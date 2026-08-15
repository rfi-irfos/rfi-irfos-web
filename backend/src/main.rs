mod analytics;
mod auth;
mod contact;
mod content;
mod stripe;
mod track;
mod upload;

use axum::{
    extract::Request,
    http::{header, HeaderName, HeaderValue},
    middleware::{self, Next},
    response::{IntoResponse, Redirect, Response},
    routing::{get, post}, Router,
};
use sqlx::SqlitePool;
use std::{collections::HashMap, path::PathBuf, sync::{Arc, RwLock}};
use tower_http::{cors::CorsLayer, services::{ServeDir, ServeFile}};
use serde::{Deserialize, Serialize};

// Google indexes rfi-irfos.com and www.rfi-irfos.com as duplicate pages
// otherwise — the canonical tag alone doesn't stop the www host from
// serving its own 200 response.
async fn redirect_www(req: Request, next: Next) -> Response {
    let host = req.headers().get(header::HOST).and_then(|h| h.to_str().ok());
    if let Some(bare) = host.and_then(|h| h.strip_prefix("www.")) {
        let path_and_query = req.uri().path_and_query().map(|pq| pq.as_str()).unwrap_or("/");
        return Redirect::permanent(&format!("https://{bare}{path_and_query}")).into_response();
    }
    next.run(req).await
}

// Lighthouse "Use efficient cache lifetimes" (live audit, 2026-08-15): every
// static asset served by this app had Cache-Control: none — ~1,320 KiB of
// avoidable re-downloads on repeat visits. Lifetime depends on whether Vite
// content-hashes the file:
//   - /assets/*.js /assets/*.css are content-hashed by Vite (e.g.
//     index-CsjbmRaB.js) — the filename itself changes whenever the content
//     does, so these are safe to cache for a full year as immutable.
//   - index.html (and every extensionless SPA route that falls back to it,
//     via spa_fallback below) references the CURRENT hashed filenames, so it
//     must always be revalidated: caching it long risks serving a visitor a
//     stale page pointing at asset hashes a later deploy has already deleted.
//   - Plain images (/logo.png, /hero-software.jpeg, ...) are NOT
//     content-hashed, so a full year is too aggressive — an image swap on
//     the same filename wouldn't bust the cache. A week is a deliberate
//     middle ground between bandwidth savings and staleness risk; adjust up
//     if these images turn out to change rarely in practice.
// Scoped to the static frontend surface only (excludes /api, /auth,
// /uploads) so we never accidentally cache something like the tracking
// pixel at /api/track/pixel.gif, which would silently undercount visits.
async fn set_cache_control(req: Request, next: Next) -> Response {
    let path = req.uri().path().to_string();
    let mut res = next.run(req).await;

    if path.starts_with("/api/") || path.starts_with("/auth/") || path.starts_with("/uploads/") {
        return res;
    }

    let cache_value = if path.starts_with("/assets/") {
        "public, max-age=31536000, immutable"
    } else if [".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".svg"]
        .iter()
        .any(|ext| path.ends_with(ext))
    {
        "public, max-age=604800" // 1 week — see rationale above
    } else {
        "no-cache" // index.html and every SPA route that falls back to it
    };

    res.headers_mut()
        .insert(header::CACHE_CONTROL, HeaderValue::from_static(cache_value));
    res
}

// Lighthouse "Best Practices" (live audit, 2026-08-15) flagged CSP, HSTS,
// COOP and frame-control as entirely absent (all High severity — literal
// "No CSP found" / "No HSTS header found" / "No COOP header found" / "No
// frame control policy found"). Applied as a separate global layer since
// these headers belong on every response, not just static assets.
//
// The CSP allowlist below was built by grepping frontend/src + index.html
// for every external resource the site actually loads (2026-08-15), not
// guessed:
//   - script-src/style-src 'unsafe-inline': frontend/index.html ships two
//     inline <script> blocks (http->https upgrade, a URL-rewrite hack for
//     GitHub-Pages-style query params), and React's style={{...}} props
//     render as inline style="" attributes throughout the app. There's no
//     nonce/hash plumbing in this static-file server to avoid 'unsafe-inline'
//     without a much larger change (per-request HTML rewriting).
//   - style-src/font-src fonts.googleapis.com/fonts.gstatic.com:
//     index.html preconnects to and loads Inter/Space Grotesk/JetBrains
//     Mono from Google Fonts.
//   - img-src/connect-src lighthouse-rfi-irfos.fly.dev: the first-party
//     tracking pixel (<img src=.../pixel.gif> in PublicSite.tsx/
//     LegalPage.tsx) and the beacon (fetch POST to .../api/track).
//   - connect-src api.github.com: the admin panel's GitHub Contents API
//     read/write (frontend/src/lib/github.ts).
//   - img-src/connect-src raw.githubusercontent.com: the public site's live
//     content fetch (frontend/src/hooks/useContent.ts) and uploaded content
//     images, which are served straight from raw.githubusercontent.com URLs.
//   - connect-src api.web3forms.com: the contact form's email fallback path
//     (PublicSite.tsx submitTip) used only if the CRM relay to /api/contact
//     fails.
//   - Stripe (checkout.stripe.com / buy.stripe.com) is deliberately NOT in
//     connect-src or script-src: there's no Stripe.js on the frontend at
//     all (confirmed via package.json + source grep) — checkout is a full
//     top-level navigation, `window.location.href = url`, in
//     PublicSite.tsx's handleCheckout/confirmCheckout. CSP's connect-src/
//     script-src don't govern plain top-level navigations, so no entry is
//     needed and adding one would be a no-op at best.
const CSP_POLICY: &str = "default-src 'self'; \
    script-src 'self' 'unsafe-inline'; \
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; \
    font-src 'self' https://fonts.gstatic.com; \
    img-src 'self' data: https://raw.githubusercontent.com https://lighthouse-rfi-irfos.fly.dev; \
    connect-src 'self' https://lighthouse-rfi-irfos.fly.dev https://api.github.com https://raw.githubusercontent.com https://api.web3forms.com; \
    frame-src 'self'; \
    frame-ancestors 'self'; \
    object-src 'none'; \
    base-uri 'self'; \
    form-action 'self'";

async fn set_security_headers(req: Request, next: Next) -> Response {
    let mut res = next.run(req).await;
    let headers = res.headers_mut();

    headers.insert(header::CONTENT_SECURITY_POLICY, HeaderValue::from_static(CSP_POLICY));
    // fly.toml already sets force_https = true at the edge; HSTS just tells
    // the browser to remember that and skip the plaintext hop entirely.
    headers.insert(
        header::STRICT_TRANSPORT_SECURITY,
        HeaderValue::from_static("max-age=31536000; includeSubDomains"),
    );
    // Stripe Checkout redirects the top-level page rather than popping up
    // (see CSP comment above), so same-origin is safe here.
    headers.insert(
        HeaderName::from_static("cross-origin-opener-policy"),
        HeaderValue::from_static("same-origin"),
    );
    // Belt-and-suspenders with the CSP frame-ancestors directive above, for
    // older browsers that don't honor frame-ancestors.
    headers.insert(header::X_FRAME_OPTIONS, HeaderValue::from_static("SAMEORIGIN"));

    res
}

#[derive(Clone)]
pub struct AppState {
    pub sessions: Arc<RwLock<HashMap<String, SessionData>>>,
    pub content_path: PathBuf,
    pub uploads_dir: PathBuf,
    pub static_dir: PathBuf,
    pub allowed_email: String,
    pub google_client_id: String,
    pub google_client_secret: String,
    pub redirect_uri: String,
    pub dev_mode: bool,
    pub db: SqlitePool,
    pub stripe_secret_key: String,
    pub stripe_webhook_secret: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct SessionData {
    pub email: String,
    pub name: String,
    pub picture: String,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenvy::dotenv().ok();

    let dev_mode = std::env::var("DEV_MODE").unwrap_or_default() == "true";
    let uploads_dir = PathBuf::from(std::env::var("UPLOADS_DIR").unwrap_or("uploads".into()));
    let static_dir = PathBuf::from(std::env::var("STATIC_DIR").unwrap_or("../frontend/dist".into()));

    tokio::fs::create_dir_all(&uploads_dir).await.ok();

    let db_path = std::env::var("DB_PATH").unwrap_or("visits.db".into());
    let db = SqlitePool::connect(&format!("sqlite://{}?mode=rwc", db_path))
        .await.expect("open visits.db");
    sqlx::query("CREATE TABLE IF NOT EXISTS web_visits (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL DEFAULT '/', source TEXT NOT NULL DEFAULT 'direct', referrer TEXT NOT NULL DEFAULT '', utm_source TEXT NOT NULL DEFAULT '', utm_medium TEXT NOT NULL DEFAULT '', utm_campaign TEXT NOT NULL DEFAULT '', visitor TEXT NOT NULL DEFAULT '', created_at DATETIME NOT NULL DEFAULT (datetime('now')))")
        .execute(&db).await.expect("create web_visits");
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_wv_created ON web_visits(created_at)")
        .execute(&db).await.ok();
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_wv_source ON web_visits(source, created_at)")
        .execute(&db).await.ok();

    let state = AppState {
        sessions: Arc::new(RwLock::new(HashMap::new())),
        content_path: PathBuf::from(std::env::var("CONTENT_PATH").unwrap_or("content.json".into())),
        uploads_dir: uploads_dir.clone(),
        static_dir: static_dir.clone(),
        allowed_email: std::env::var("ALLOWED_EMAIL").unwrap_or_default(),
        google_client_id: std::env::var("GOOGLE_CLIENT_ID").unwrap_or_default(),
        google_client_secret: std::env::var("GOOGLE_CLIENT_SECRET").unwrap_or_default(),
        redirect_uri: std::env::var("REDIRECT_URI")
            .unwrap_or("http://localhost:3000/auth/callback".into()),
        dev_mode,
        db,
        stripe_secret_key: std::env::var("STRIPE_SECRET_KEY").unwrap_or_default(),
        stripe_webhook_secret: std::env::var("STRIPE_WEBHOOK_SECRET").unwrap_or_default(),
    };

    if dev_mode {
        tracing::warn!("DEV_MODE=true — auth is bypassed, do not use in production");
    }

    let index_html = static_dir.join("index.html");
    let spa_fallback = ServeDir::new(&static_dir)
        .not_found_service(ServeFile::new(&index_html));

    let app = Router::new()
        // Auth
        .route("/auth/google", get(auth::google_login))
        .route("/auth/callback", get(auth::google_callback))
        .route("/auth/logout", post(auth::logout))
        // API
        .route("/api/me", get(auth::get_me))
        .route("/api/content", get(content::get_content).put(content::update_content))
        .route("/api/upload", post(upload::upload_file))
        .route("/api/contact", post(contact::submit_contact))
        .route("/api/analytics", get(analytics::stats))
        .route("/api/stripe/checkout", post(stripe::create_checkout))
        .route("/api/stripe/webhook", post(stripe::webhook))
        // Tracking pixel (public, no auth)
        .route("/api/track/pixel.gif", get(track::pixel))
        .route("/api/track", post(track::beacon))
        // Uploads
        .nest_service("/uploads", ServeDir::new(&uploads_dir))
        // React SPA
        .fallback_service(spa_fallback)
        .with_state(state)
        .layer(CorsLayer::permissive())
        .layer(middleware::from_fn(set_cache_control))
        .layer(middleware::from_fn(set_security_headers))
        .layer(middleware::from_fn(redirect_www));

    let port = std::env::var("PORT").unwrap_or("3000".into());
    let addr = format!("0.0.0.0:{port}");
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    tracing::info!("Listening on http://{addr}");
    axum::serve(listener, app).await.unwrap();
}
