use axum::{extract::{Path, State}, http::{HeaderMap, StatusCode}, response::IntoResponse, Json};
use axum_extra::extract::cookie::CookieJar;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::{Mutex, OnceLock}, time::Instant};

use crate::auth::get_session;
use crate::AppState;

static REVIEW_RATE_LIMITER: OnceLock<Mutex<HashMap<String, Vec<Instant>>>> = OnceLock::new();

fn review_rate_limiter() -> &'static Mutex<HashMap<String, Vec<Instant>>> {
    REVIEW_RATE_LIMITER.get_or_init(|| Mutex::new(HashMap::new()))
}

fn review_rate_limited(ip: &str) -> bool {
    const MAX: usize = 5;
    const WINDOW: std::time::Duration = std::time::Duration::from_secs(60);
    let now = Instant::now();
    let mut map = review_rate_limiter().lock().unwrap_or_else(|e| e.into_inner());
    let ts = map.entry(ip.to_string()).or_default();
    ts.retain(|t| now.duration_since(*t) < WINDOW);
    if ts.len() >= MAX { return true; }
    ts.push(now);
    false
}

// The per-minute burst limiter above stops scripted spam but not a human
// spacing out submissions over a day - the domain-dedup check only blocks
// re-submitting the SAME still-pending domain, so a new domain + throwaway
// email sails through it every time. This caps how many free checks one IP
// can queue up in 24h, independent of domain/email (live direction
// 2026-10-14: "what hinders somebody now to everyday check his website for
// free, taking another work email"). In-memory like the limiter above, so it
// resets on redeploy - that's fine, this is abuse-dampening, not a hard quota.
static REVIEW_DAILY_LIMITER: OnceLock<Mutex<HashMap<String, Vec<Instant>>>> = OnceLock::new();

fn review_daily_limiter() -> &'static Mutex<HashMap<String, Vec<Instant>>> {
    REVIEW_DAILY_LIMITER.get_or_init(|| Mutex::new(HashMap::new()))
}

fn review_daily_limited(ip: &str) -> bool {
    const MAX: usize = 3;
    const WINDOW: std::time::Duration = std::time::Duration::from_secs(60 * 60 * 24);
    let now = Instant::now();
    let mut map = review_daily_limiter().lock().unwrap_or_else(|e| e.into_inner());
    let ts = map.entry(ip.to_string()).or_default();
    ts.retain(|t| now.duration_since(*t) < WINDOW);
    if ts.len() >= MAX { return true; }
    ts.push(now);
    false
}

/// Strips scheme, path, query and port from a user-entered site string,
/// returning a bare lowercase hostname. A visitor pasting a full URL
/// (https://foo.com/bar) is the common case, not something to reject.
pub fn normalize_domain(input: &str) -> Option<String> {
    let trimmed = input.trim();
    if trimmed.is_empty() { return None; }
    let without_scheme = trimmed
        .strip_prefix("https://")
        .or_else(|| trimmed.strip_prefix("http://"))
        .unwrap_or(trimmed);
    let host_and_port = without_scheme.split('/').next().unwrap_or("");
    let host = host_and_port.split(':').next().unwrap_or("");
    let host = host.trim().to_lowercase();
    if host.is_empty() || !host.contains('.') { return None; }
    Some(host)
}

#[derive(Deserialize)]
pub struct SubmitReviewRequest {
    pub domain: String,
    pub email: String,
    pub consent: bool,
    pub botcheck: Option<String>,
    /// "de" picks the German confirmation mail.
    #[serde(default)]
    pub locale: Option<String>,
}

pub async fn create_tables(db: &sqlx::SqlitePool) {
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS initial_reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            domain TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending_approval',
            signals TEXT,
            created_at DATETIME NOT NULL DEFAULT (datetime('now')),
            approved_at DATETIME,
            scanned_at DATETIME
        )"
    ).execute(db).await.expect("create initial_reviews");
}

pub async fn submit_review(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<SubmitReviewRequest>,
) -> impl IntoResponse {
    let ip = headers
        .get("fly-client-ip")
        .or_else(|| headers.get("x-forwarded-for"))
        .and_then(|v| v.to_str().ok())
        .unwrap_or("unknown")
        .split(',').next().unwrap_or("unknown").trim().to_string();

    if review_rate_limited(&ip) {
        return (StatusCode::TOO_MANY_REQUESTS, "rate limit exceeded — 5 submissions per minute per IP\n").into_response();
    }
    if review_daily_limited(&ip) {
        return (StatusCode::TOO_MANY_REQUESTS, "daily limit exceeded — try again tomorrow\n").into_response();
    }

    if body.botcheck.as_deref().is_some_and(|v| !v.trim().is_empty()) {
        tracing::info!("Initial review submission from {ip} dropped: honeypot field filled");
        return StatusCode::OK.into_response();
    }

    if !body.consent {
        return (StatusCode::BAD_REQUEST, "Consent is required.").into_response();
    }
    let Some(domain) = normalize_domain(&body.domain) else {
        return (StatusCode::BAD_REQUEST, "A valid domain is required.").into_response();
    };
    if body.email.trim().is_empty() || body.email.len() > 200 {
        return (StatusCode::BAD_REQUEST, "A valid email is required.").into_response();
    }

    let email = body.email.trim().to_string();

    // A visitor re-submitting the same still-pending domain (double click,
    // retried request) must not pile up duplicate rows that leave an admin
    // unsure which one to approve — treat it as a no-op success instead of
    // inserting again. Keyed on domain AND email since 2026-10-31 (Lighthouse
    // round 20): a second person from the same company got an OK while their
    // address never reached the table or ntfy, a silently lost lead.
    let existing: Option<(i64,)> = sqlx::query_as(
        "SELECT id FROM initial_reviews WHERE domain = ? AND lower(email) = lower(?) AND status = 'pending_approval'"
    ).bind(&domain).bind(&email).fetch_optional(&state.db).await.unwrap_or(None);
    if existing.is_some() {
        return StatusCode::OK.into_response();
    }

    if let Err(e) = sqlx::query(
        "INSERT INTO initial_reviews (domain, email, status) VALUES (?, ?, 'pending_approval')"
    ).bind(&domain).bind(&email).execute(&state.db).await {
        tracing::error!("initial_reviews insert failed: {e}");
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }

    notify_new_request(&domain, &email).await;

    // 2026-10-31 (Simeon): the visitor gets a confirmation mail right away, so the
    // warmest moment of the DLT funnel ends in their inbox, not only on our screen.
    // Spawned: Brevo being slow or down never touches the response. One per
    // address per day, so the form cannot be used to flood a stranger's inbox.
    if !state.brevo_api_key.is_empty() && confirmation_allowed(&email) {
        let key = state.brevo_api_key.clone();
        // locale from the body; the same-origin Referer (/de/...) covers older bundles.
        let de = body.locale.as_deref() == Some("de") || headers.get("referer")
            .and_then(|v| v.to_str().ok()).is_some_and(|r| r.contains("rfi-irfos.com/de/"));
        tokio::spawn(async move {
            crate::notify::brevo_confirmation(&key, &domain, &email, de).await;
        });
    }
    StatusCode::OK.into_response()
}

static CONFIRMATION_LIMITER: OnceLock<Mutex<HashMap<String, Instant>>> = OnceLock::new();

fn confirmation_allowed(email: &str) -> bool {
    const WINDOW: std::time::Duration = std::time::Duration::from_secs(60 * 60 * 24);
    let now = Instant::now();
    let mut map = CONFIRMATION_LIMITER.get_or_init(|| Mutex::new(HashMap::new()))
        .lock().unwrap_or_else(|e| e.into_inner());
    map.retain(|_, t| now.duration_since(*t) < WINDOW);
    let key = email.trim().to_lowercase();
    if map.contains_key(&key) { return false; }
    map.insert(key, now);
    true
}

async fn notify_new_request(domain: &str, email: &str) {
    // Tests dürfen nie echte Pushes oder Mails auslösen (2026-10-22: Testläufe füllten ntfy und die Anfrageliste mit foo.com / a@b.com)
    if cfg!(test) { return; }
    let Ok(client) = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5)).build() else { return };
    let _ = client
        .post(crate::notify::contact_ntfy_url())
        .header("Title", "New initial review request")
        .body(format!("domain={domain} email={email} — approve via POST /api/initial-review/:id/approve"))
        .send().await;

    // ntfy alone is a push notification, not an inbox record - live feedback
    // 2026-10-14: "ich hab ne ntfy bekommen, aber keine email". Reply-To is the
    // visitor's own address so replying to this mail reaches them directly.
    crate::notify::web3forms_email(
        &format!("[rfi-irfos.com] New initial review request — {domain}"),
        "Initial review request",
        email,
        &format!("domain={domain}\nemail={email}\n\nApprove via POST /api/initial-review/:id/approve"),
    ).await;
}

#[derive(Serialize)]
pub struct Signal {
    pub category: &'static str,
    pub flag: bool,
    pub detail: String,
    pub confidence: &'static str,
}

#[derive(Serialize)]
struct ReviewRow {
    id: i64,
    domain: String,
    email: String,
    status: String,
    signals: Option<String>,
    created_at: String,
}

pub async fn list_reviews(State(state): State<AppState>, jar: CookieJar) -> impl IntoResponse {
    if get_session(&jar, &state).is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let rows: Vec<(i64, String, String, String, Option<String>, String)> = match sqlx::query_as(
        "SELECT id, domain, email, status, signals, created_at FROM initial_reviews ORDER BY created_at DESC"
    ).fetch_all(&state.db).await {
        Ok(r) => r,
        Err(e) => { tracing::error!("list_reviews query failed: {e}"); return StatusCode::INTERNAL_SERVER_ERROR.into_response(); }
    };
    let out: Vec<ReviewRow> = rows.into_iter()
        .map(|(id, domain, email, status, signals, created_at)| ReviewRow { id, domain, email, status, signals, created_at })
        .collect();
    Json(out).into_response()
}

pub async fn approve_review(
    State(state): State<AppState>, jar: CookieJar, Path(id): Path<i64>,
) -> impl IntoResponse {
    if get_session(&jar, &state).is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let domain: Option<(String,)> = sqlx::query_as(
        "SELECT domain FROM initial_reviews WHERE id = ? AND status = 'pending_approval'"
    ).bind(id).fetch_optional(&state.db).await.unwrap_or(None);
    let Some((domain,)) = domain else {
        return (StatusCode::NOT_FOUND, "no pending request with that id").into_response();
    };
    if let Err(e) = sqlx::query(
        "UPDATE initial_reviews SET status = 'approved', approved_at = datetime('now') WHERE id = ?"
    ).bind(id).execute(&state.db).await {
        tracing::error!("approve update failed: {e}");
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
    let db = state.db.clone();
    tokio::spawn(run_scan(db, id, domain));
    StatusCode::OK.into_response()
}

pub async fn reject_review(
    State(state): State<AppState>, jar: CookieJar, Path(id): Path<i64>,
) -> impl IntoResponse {
    if get_session(&jar, &state).is_none() {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    match sqlx::query("UPDATE initial_reviews SET status = 'rejected' WHERE id = ?")
        .bind(id).execute(&state.db).await {
        Ok(_) => StatusCode::OK.into_response(),
        Err(e) => { tracing::error!("reject update failed: {e}"); StatusCode::INTERNAL_SERVER_ERROR.into_response() }
    }
}

fn http_client() -> reqwest::Client {
    reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(8))
        .redirect(reqwest::redirect::Policy::limited(3))
        .build()
        .expect("build scan http client")
}

/// GETs a fixed list of common-exposure paths and expects 404. A 200 is a
/// flag, not proof of a vulnerability — the report-writing human verifies.
async fn check_exposed_paths(base: &str) -> Signal {
    const PATHS: &[&str] = &["/.env", "/.git/config", "/wp-config.php.bak", "/.aws/credentials"];
    let client = http_client();
    let mut hits = Vec::new();
    for path in PATHS {
        if let Ok(res) = client.get(format!("{base}{path}")).send().await {
            if res.status().is_success() { hits.push(path.to_string()); }
        }
    }
    Signal {
        category: "architecture_attack_surface",
        flag: !hits.is_empty(),
        detail: if hits.is_empty() { "No common exposure paths returned 200.".into() }
                else { format!("Paths returning 200: {}", hits.join(", ")) },
        confidence: "high",
    }
}

async fn check_security_headers(base: &str) -> Signal {
    let client = http_client();
    let Ok(res) = client.get(base).send().await else {
        return Signal { category: "tls_security_headers", flag: false, detail: "Homepage did not respond within timeout.".into(), confidence: "low" };
    };
    let headers = res.headers();
    let mut missing = Vec::new();
    for h in ["content-security-policy", "strict-transport-security", "x-frame-options"] {
        if !headers.contains_key(h) { missing.push(h); }
    }
    Signal {
        category: "tls_security_headers",
        flag: !missing.is_empty(),
        detail: if missing.is_empty() { "CSP, HSTS and X-Frame-Options all present.".into() }
                else { format!("Missing headers: {}", missing.join(", ")) },
        confidence: "high",
    }
}

async fn check_dns_mail_security(domain: &str) -> Signal {
    let resolver_result = tokio::net::lookup_host(format!("{domain}:443")).await;
    Signal {
        category: "dns_mail_security",
        flag: resolver_result.is_err(),
        detail: match resolver_result {
            Ok(_) => "Domain resolves. SPF/DKIM/DMARC TXT lookups are a later enhancement (needs a DNS TXT resolver dependency, not yet added).".into(),
            Err(e) => format!("Domain did not resolve: {e}"),
        },
        confidence: "low",
    }
}

async fn check_data_protection(base: &str) -> Signal {
    let client = http_client();
    let Ok(res) = client.get(base).send().await else {
        return Signal { category: "data_protection", flag: false, detail: "Homepage did not respond within timeout.".into(), confidence: "low" };
    };
    let body = res.text().await.unwrap_or_default().to_lowercase();
    let has_privacy_link = body.contains("privacy") || body.contains("datenschutz");
    Signal {
        category: "data_protection",
        flag: !has_privacy_link,
        detail: if has_privacy_link { "A privacy/Datenschutz link was found on the homepage.".into() }
                else { "No privacy/Datenschutz link found on the homepage.".into() },
        confidence: "low",
    }
}

async fn check_consumer_protection(base: &str) -> Signal {
    let client = http_client();
    let Ok(res) = client.get(base).send().await else {
        return Signal { category: "consumer_protection", flag: false, detail: "Homepage did not respond within timeout.".into(), confidence: "low" };
    };
    let body = res.text().await.unwrap_or_default().to_lowercase();
    let pre_checked = body.contains("checked") && (body.contains("subscribe") || body.contains("newsletter"));
    Signal {
        category: "consumer_protection",
        flag: pre_checked,
        detail: if pre_checked { "Possible pre-checked subscribe/newsletter checkbox pattern detected (static heuristic, low confidence — verify manually).".into() }
                else { "No pre-checked subscribe/newsletter pattern detected.".into() },
        confidence: "low",
    }
}

async fn check_payment_surface(base: &str) -> Signal {
    let client = http_client();
    let Ok(res) = client.get(base).send().await else {
        return Signal { category: "payment_surface", flag: false, detail: "Homepage did not respond within timeout.".into(), confidence: "low" };
    };
    let https = base.starts_with("https://");
    let body = res.text().await.unwrap_or_default().to_lowercase();
    let has_payment_sdk = body.contains("stripe.com") || body.contains("paypal.com") || body.contains("adyen");
    Signal {
        category: "payment_surface",
        flag: has_payment_sdk && !https,
        detail: format!("Payment SDK reference detected: {has_payment_sdk}. Served over HTTPS: {https}."),
        confidence: "medium",
    }
}

async fn run_scan(db: sqlx::SqlitePool, id: i64, domain: String) {
    let base = format!("https://{domain}");
    let signals = vec![
        check_exposed_paths(&base).await,
        check_security_headers(&base).await,
        check_dns_mail_security(&domain).await,
        check_data_protection(&base).await,
        check_consumer_protection(&base).await,
        check_payment_surface(&base).await,
    ];
    let signals_json = serde_json::to_string(&signals).unwrap_or_else(|_| "[]".into());
    if let Err(e) = sqlx::query(
        "UPDATE initial_reviews SET status = 'scanned', scanned_at = datetime('now'), signals = ? WHERE id = ?"
    ).bind(&signals_json).bind(id).execute(&db).await {
        tracing::error!("run_scan update failed for id {id}: {e}");
        return;
    }
    notify_scan_complete(&domain).await;
}

async fn notify_scan_complete(domain: &str) {
    // Tests dürfen nie echte Pushes oder Mails auslösen (2026-10-22: Testläufe füllten ntfy und die Anfrageliste mit foo.com / a@b.com)
    if cfg!(test) { return; }
    let Ok(client) = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5)).build() else { return };
    let _ = client
        .post(crate::notify::contact_ntfy_url())
        .header("Title", "Initial review scan complete")
        .body(format!("domain={domain} — signals ready, review before sending a report"))
        .send().await;
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::{body::Body, http::{Request, StatusCode}, Router, routing::post};
    use tower::ServiceExt;
    use std::sync::{Arc, RwLock};
    use std::collections::HashMap;

    async fn test_state() -> AppState {
        let db = sqlx::SqlitePool::connect("sqlite::memory:").await.unwrap();
        create_tables(&db).await;
        AppState {
            sessions: Arc::new(RwLock::new(HashMap::new())),
            content_path: std::path::PathBuf::from("content.json"),
            uploads_dir: std::path::PathBuf::from("uploads"),
            static_dir: std::path::PathBuf::from("."),
            allowed_email: String::new(),
            google_client_id: String::new(),
            google_client_secret: String::new(),
            redirect_uri: String::new(),
            dev_mode: true,
            db,
            stripe_secret_key: String::new(),
            stripe_webhook_secret: String::new(),
            brevo_api_key: String::new(),
        }
    }

    #[test]
    fn confirmation_is_sent_once_per_address_per_day() {
        assert!(confirmation_allowed("once@example.org"));
        assert!(!confirmation_allowed("ONCE@example.org "));
        assert!(confirmation_allowed("other@example.org"));
    }

    fn app(state: AppState) -> Router {
        Router::new()
            .route("/api/initial-review", post(submit_review))
            .with_state(state)
    }

    #[test]
    fn normalize_strips_scheme_and_path() {
        assert_eq!(normalize_domain("https://foo.com/bar?x=1"), Some("foo.com".into()));
        assert_eq!(normalize_domain("foo.com"), Some("foo.com".into()));
        assert_eq!(normalize_domain("  "), None);
        assert_eq!(normalize_domain(""), None);
    }

    #[tokio::test]
    async fn submit_without_consent_is_rejected() {
        let state = test_state().await;
        let body = serde_json::json!({
            "domain": "foo.com", "email": "a@b.com", "consent": false, "botcheck": null
        });
        let res = app(state)
            .oneshot(Request::builder()
                .method("POST").uri("/api/initial-review")
                .header("content-type", "application/json")
                .header("x-forwarded-for", "10.0.0.1")
                .body(Body::from(body.to_string())).unwrap())
            .await.unwrap();
        assert_eq!(res.status(), StatusCode::BAD_REQUEST);
    }

    #[tokio::test]
    async fn submit_with_consent_inserts_row_and_returns_200() {
        let state = test_state().await;
        let db = state.db.clone();
        let body = serde_json::json!({
            "domain": "https://foo.com/bar", "email": "a@b.com", "consent": true, "botcheck": null
        });
        let res = app(state)
            .oneshot(Request::builder()
                .method("POST").uri("/api/initial-review")
                .header("content-type", "application/json")
                .header("x-forwarded-for", "10.0.0.2")
                .body(Body::from(body.to_string())).unwrap())
            .await.unwrap();
        assert_eq!(res.status(), StatusCode::OK);
        let row: (String, String) = sqlx::query_as(
            "SELECT domain, status FROM initial_reviews WHERE email = 'a@b.com'"
        ).fetch_one(&db).await.unwrap();
        assert_eq!(row.0, "foo.com");
        assert_eq!(row.1, "pending_approval");
    }

    #[tokio::test]
    async fn honeypot_filled_drops_silently_with_200() {
        let state = test_state().await;
        let db = state.db.clone();
        let body = serde_json::json!({
            "domain": "foo.com", "email": "a@b.com", "consent": true, "botcheck": "x"
        });
        let res = app(state)
            .oneshot(Request::builder()
                .method("POST").uri("/api/initial-review")
                .header("content-type", "application/json")
                .header("x-forwarded-for", "10.0.0.3")
                .body(Body::from(body.to_string())).unwrap())
            .await.unwrap();
        assert_eq!(res.status(), StatusCode::OK);
        let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM initial_reviews")
            .fetch_one(&db).await.unwrap();
        assert_eq!(count.0, 0);
    }

    #[tokio::test]
    async fn duplicate_pending_submission_does_not_create_a_second_row() {
        let state = test_state().await;
        let db = state.db.clone();
        let body = serde_json::json!({
            "domain": "foo.com", "email": "a@b.com", "consent": true, "botcheck": null
        });
        let make_req = || Request::builder()
            .method("POST").uri("/api/initial-review")
            .header("content-type", "application/json")
            .header("x-forwarded-for", "10.0.0.4")
            .body(Body::from(body.to_string())).unwrap();

        let app1 = app(state.clone());
        let res1 = app1.oneshot(make_req()).await.unwrap();
        assert_eq!(res1.status(), StatusCode::OK);

        let app2 = app(state.clone());
        let res2 = app2.oneshot(make_req()).await.unwrap();
        assert_eq!(res2.status(), StatusCode::OK);

        let count: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM initial_reviews WHERE domain = 'foo.com' AND status = 'pending_approval'"
        ).fetch_one(&db).await.unwrap();
        assert_eq!(count.0, 1);
    }

    #[tokio::test]
    async fn second_person_same_domain_gets_own_row() {
        let state = test_state().await;
        let db = state.db.clone();
        for (email, ip) in [("a@foo.com", "10.0.0.7"), ("b@foo.com", "10.0.0.8")] {
            let body = serde_json::json!({ "domain": "foo.com", "email": email, "consent": true, "botcheck": null });
            let req = Request::builder()
                .method("POST").uri("/api/initial-review")
                .header("content-type", "application/json")
                .header("x-forwarded-for", ip)
                .body(Body::from(body.to_string())).unwrap();
            assert_eq!(app(state.clone()).oneshot(req).await.unwrap().status(), StatusCode::OK);
        }
        let count: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM initial_reviews WHERE domain = 'foo.com' AND status = 'pending_approval'"
        ).fetch_one(&db).await.unwrap();
        assert_eq!(count.0, 2);
    }

    #[tokio::test]
    async fn fourth_submission_from_same_ip_in_a_day_is_rate_limited() {
        // Distinct domains per request so the domain-dedup check above isn't
        // what's blocking the 4th one - this is specifically about one IP
        // queuing up unlimited free checks via different domains/emails.
        let state = test_state().await;
        let make_req = |domain: &str| Request::builder()
            .method("POST").uri("/api/initial-review")
            .header("content-type", "application/json")
            .header("x-forwarded-for", "10.0.0.5")
            .body(Body::from(serde_json::json!({
                "domain": domain, "email": "a@b.com", "consent": true, "botcheck": null
            }).to_string())).unwrap();

        for domain in ["one.com", "two.com", "three.com"] {
            let res = app(state.clone()).oneshot(make_req(domain)).await.unwrap();
            assert_eq!(res.status(), StatusCode::OK, "domain {domain} should be accepted");
        }
        let res = app(state.clone()).oneshot(make_req("four.com")).await.unwrap();
        assert_eq!(res.status(), StatusCode::TOO_MANY_REQUESTS);
    }

    #[tokio::test]
    async fn approve_without_session_is_unauthorized() {
        let state = test_state().await;
        sqlx::query("INSERT INTO initial_reviews (domain, email) VALUES ('foo.com', 'a@b.com')")
            .execute(&state.db).await.unwrap();
        let app = Router::new()
            .route("/api/initial-review/:id/approve", post(approve_review))
            .with_state(state);
        let res = app.oneshot(Request::builder()
            .method("POST").uri("/api/initial-review/1/approve")
            .body(Body::empty()).unwrap())
            .await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn architecture_signal_flags_exposed_env_file() {
        let server = wiremock::MockServer::start().await;
        wiremock::Mock::given(wiremock::matchers::path("/.env"))
            .respond_with(wiremock::ResponseTemplate::new(200).set_body_string("SECRET=1"))
            .mount(&server).await;
        wiremock::Mock::given(wiremock::matchers::any())
            .respond_with(wiremock::ResponseTemplate::new(404))
            .mount(&server).await;

        let host = server.uri().trim_start_matches("http://").to_string();
        let signal = check_exposed_paths(&format!("http://{host}")).await;
        assert!(signal.flag, "expected a flag when /.env returns 200");
    }

    #[tokio::test]
    async fn architecture_signal_clean_when_paths_404() {
        let server = wiremock::MockServer::start().await;
        wiremock::Mock::given(wiremock::matchers::any())
            .respond_with(wiremock::ResponseTemplate::new(404))
            .mount(&server).await;
        let host = server.uri().trim_start_matches("http://").to_string();
        let signal = check_exposed_paths(&format!("http://{host}")).await;
        assert!(!signal.flag);
    }
}
