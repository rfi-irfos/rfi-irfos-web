mod analytics;
mod auth;
mod contact;
mod content;
mod notify;
mod review;
mod stripe;
mod track;
mod trap;
mod upload;
mod worldmodel;

use axum::{
    extract::{Request, State},
    http::{header, HeaderName, HeaderValue, Method},
    middleware::{self, Next},
    response::{IntoResponse, Redirect, Response},
    routing::{get, post}, Router,
};
use sqlx::SqlitePool;
use std::{collections::HashMap, path::PathBuf, sync::{Arc, RwLock}};
use tower_http::{cors::CorsLayer, services::{ServeDir, ServeFile}};
use serde::{Deserialize, Serialize};

// tower-http's ServeDir answers `/security` (a directory) with a 307 to `/security/`. Google reads
// 307 as temporary and keeps both URLs, which is how slash and no-slash variants ended up
// as separate entries in Search Console. Redirect permanently (308) before ServeDir sees it.
// Pure so it can be unit-tested: `is_dir_with_index` is the only filesystem touch.
fn dir_slash_target(path: &str, query: Option<&str>, is_dir_with_index: impl Fn(&str) -> bool) -> Option<String> {
    if path == "/" || path.ends_with('/') || path.contains("..") {
        return None;
    }
    if ["/api", "/auth", "/uploads"].iter().any(|p| path == *p || path.starts_with(&format!("{p}/"))) {
        return None;
    }
    if path.rsplit('/').next().is_some_and(|last| last.contains('.')) {
        return None;
    }
    if !is_dir_with_index(path) {
        return None;
    }
    Some(match query {
        Some(q) => format!("{path}/?{q}"),
        None => format!("{path}/"),
    })
}

async fn redirect_dir_slash(State(static_dir): State<PathBuf>, req: Request, next: Next) -> Response {
    if matches!(*req.method(), Method::GET | Method::HEAD) {
        let target = dir_slash_target(req.uri().path(), req.uri().query(), |p| {
            static_dir.join(p.trim_start_matches('/')).join("index.html").is_file()
        });
        if let Some(target) = target {
            return Redirect::permanent(&target).into_response();
        }
    }
    next.run(req).await
}

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
    style-src 'self' 'unsafe-inline'; \
    font-src 'self'; \
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
    // Found by our own Domain Check (2026-10-21): the three headers every
    // scanner expects next to CSP/HSTS. None of them changes site behaviour.
    headers.insert(header::X_CONTENT_TYPE_OPTIONS, HeaderValue::from_static("nosniff"));
    headers.insert(header::REFERRER_POLICY, HeaderValue::from_static("strict-origin-when-cross-origin"));
    headers.insert(
        HeaderName::from_static("permissions-policy"),
        HeaderValue::from_static("camera=(), microphone=(), geolocation=(), payment=(), usb=()"),
    );

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
    review::create_tables(&db).await;
    trap::create_table(&db).await;
    trap::spawn_retention(db.clone());

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
        .route("/api/initial-review", get(review::list_reviews).post(review::submit_review))
        .route("/api/initial-review/:id/approve", post(review::approve_review))
        .route("/api/initial-review/:id/reject", post(review::reject_review))
        .route("/api/early-access", post(worldmodel::submit_early_access))
        .route("/api/worldmodel-feed", get(worldmodel::worldmodel_feed).post(worldmodel::ingest_worldmodel_feed))
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
        .with_state(state.clone())
        .layer(middleware::from_fn_with_state(state, trap::guard))
        .layer(CorsLayer::permissive())
        .layer(middleware::from_fn(set_cache_control))
        .layer(middleware::from_fn(set_security_headers))
        .layer(middleware::from_fn_with_state(static_dir.clone(), redirect_dir_slash))
        .layer(middleware::from_fn(redirect_www));

    let port = std::env::var("PORT").unwrap_or("3000".into());
    let addr = format!("0.0.0.0:{port}");
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    tracing::info!("Listening on http://{addr}");
    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod tests {
    use super::dir_slash_target;

    fn dirs(p: &str) -> bool {
        matches!(p, "/security" | "/evidence/nintendo" | "/humanrights")
    }

    #[test]
    fn directory_without_slash_gets_a_slash() {
        assert_eq!(dir_slash_target("/security", None, dirs), Some("/security/".into()));
        assert_eq!(dir_slash_target("/evidence/nintendo", Some("a=1"), dirs), Some("/evidence/nintendo/?a=1".into()));
    }

    #[test]
    fn leaves_everything_else_alone() {
        assert_eq!(dir_slash_target("/", None, dirs), None);
        assert_eq!(dir_slash_target("/security/", None, dirs), None);
        assert_eq!(dir_slash_target("/robots.txt", None, |_| true), None);
        assert_eq!(dir_slash_target("/.well-known", None, |_| true), None);
        assert_eq!(dir_slash_target("/api", None, |_| true), None);
        assert_eq!(dir_slash_target("/api/track", None, |_| true), None);
        assert_eq!(dir_slash_target("/uploads/x", None, |_| true), None);
        assert_eq!(dir_slash_target("/not-a-dir", None, dirs), None);
    }

    #[test]
    fn path_traversal_is_never_probed() {
        assert_eq!(dir_slash_target("/../etc", None, |_| true), None);
    }

    #[test]
    fn prefix_lookalikes_of_excluded_roots_still_redirect() {
        assert_eq!(dir_slash_target("/apiary", None, |_| true), Some("/apiary/".into()));
    }
}
