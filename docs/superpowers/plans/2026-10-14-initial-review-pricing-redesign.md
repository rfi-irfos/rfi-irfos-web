# Initial Review CTA + Pricing Redesign — Phase A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a clickable local journey — submit a domain + work email from
either the homepage widget or the pricing page, have it land in a gated
queue, approve it, watch the read-only signal scan run, and see the new
4-tier pricing grid with working Stripe test-mode checkout buttons.

**Architecture:** New Rust/Axum module `review.rs` (submit + admin
approve/reject + background scan task) backed by one new SQLite table. A
new chrome-less React component `InitialReviewFlow` mounted two ways: inline
in `AppPrivacySection.tsx`, and inside the existing checkout-modal pattern
from `Pricing.tsx`'s Free card. `Pricing.tsx`'s sticky card-stack is replaced
with a static 4-tier grid wired to the existing `handleCheckout`/Stripe flow.

**Tech Stack:** Axum 0.7, sqlx (SQLite), tokio, reqwest — React 18 + TypeScript,
Vite, no CSS framework (inline styles, existing `t.*` i18n content layer).

**Spec:** `docs/superpowers/specs/2026-10-14-initial-review-and-pricing-redesign-design.md`

## Global Constraints

- No automated outbound email of scan results — signals are read via `GET
  /api/initial-review`, a human/Claude session drafts and sends the report
  manually (out of code scope for this plan).
- No active/invasive scanning — read-only GETs and passive inspection only.
- No category produces a severity score or "finding" — each signal is
  `{category, flag, detail, confidence}`, synthesis is a human step.
- Phase A does NOT include: annual billing, the `review_subscriptions`
  table, the recurring-scan sweep task, or Stripe's
  `customer.subscription.deleted` handling. Those are a follow-up plan once
  this phase is confirmed locally — the four Stripe `tier_info` price
  points are added now because the pricing grid's checkout buttons need
  them to not 400, but nothing schedules a recurring scan yet.
- Starter is €99/mo (9_900 cents); Growth €399/mo (39_900); Pro €799/mo
  (79_900); Business €1,999/mo (199_900) — exact cents values, do not
  recompute from the spec's euro figures by hand in code.
- Admin approve/reject reuses the existing session-cookie guard
  (`auth::get_session`), the same pattern `content::update_content` uses —
  do NOT build a new auth mechanism and do NOT wire this into
  `AdminPanel.tsx` (confirmed during planning: that component is unused
  CMS template code for a different content model, not the live site's
  actual admin surface).

## Review Focus

- A domain submitted with a scheme/path (`https://foo.com/bar`) must be
  normalized to a bare hostname before it's stored or scanned, not rejected
  outright — a visitor pasting a full URL is the common case, not the edge
  case.
- A second submission for the same domain while the first is still
  `pending_approval` should not silently create a duplicate row that
  confuses which one gets approved — dedupe or at least surface the
  existing row.
- The scan task must not hang the whole process if the target domain is
  unreachable or slow — each HTTP check needs its own timeout, independent
  of the others.
- Consent `false` (checkbox unchecked) must be rejected server-side, not
  just disabled client-side — a direct POST to the endpoint bypassing the
  UI must not be able to skip consent.
- The honeypot/rate-limit must not accidentally block the legitimate
  two-step flow (step 1 doesn't hit the backend at all — only step 2's
  submit does — so rate limiting must be scoped to the actual POST, not
  per-keystroke on the domain field).

---

## Task 1: `initial_reviews` table + submit endpoint

**Files:**
- Create: `backend/src/review.rs`
- Modify: `backend/src/main.rs` (register module, route, table creation)

**Interfaces:**
- Consumes: `crate::AppState` (existing), `crate::auth::get_session`
  (existing, `fn get_session(jar: &CookieJar, state: &AppState) ->
  Option<SessionData>`).
- Produces: `pub async fn submit_review(State, HeaderMap, Json<SubmitReviewRequest>) -> impl IntoResponse`,
  `pub struct SubmitReviewRequest { domain: String, email: String, consent: bool, botcheck: Option<String> }`,
  `fn normalize_domain(input: &str) -> Option<String>` (strips scheme/path/
  port, lowercases, rejects empty/whitespace-only).

- [ ] **Step 1: Write the failing tests**

```rust
// backend/src/review.rs (bottom of file)
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
        }
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
            .body(Body::from(body.to_string())).unwrap();

        let app1 = app(state.clone());
        let res1 = app1.oneshot(make_req()).await.unwrap();
        assert_eq!(res1.status(), StatusCode::OK);

        let app2 = app(state.clone());
        let res2 = app2.oneshot(make_req()).await.unwrap();
        // Still 200 — the visitor shouldn't see an error for re-submitting
        // the same pending request, but it must not duplicate the row.
        assert_eq!(res2.status(), StatusCode::OK);

        let count: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM initial_reviews WHERE domain = 'foo.com' AND status = 'pending_approval'"
        ).fetch_one(&db).await.unwrap();
        assert_eq!(count.0, 1);
    }
}
```

(`test_state()` must be adjusted to return a clonable-friendly setup — since
`AppState` already derives `Clone` per `main.rs`'s `#[derive(Clone)] pub
struct AppState`, `state.clone()` and reusing `state.db.clone()` above both
work as written; `app(state)` takes `AppState` by value because
`Router::with_state` does, so each `oneshot` call needs its own `app(...)`
built from a clone, which is why the test above constructs `app1`/`app2`
separately instead of reusing one `Router`.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && cargo test review:: -- --nocapture`
Expected: FAIL to compile — `review` module, `submit_review`,
`normalize_domain`, `create_tables` don't exist yet.

- [ ] **Step 3: Write the implementation**

```rust
// backend/src/review.rs (top of file, above the tests module)
use axum::{extract::State, http::{HeaderMap, StatusCode}, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::{Mutex, OnceLock}, time::Instant};

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
    // inserting again.
    let existing: Option<(i64,)> = sqlx::query_as(
        "SELECT id FROM initial_reviews WHERE domain = ? AND status = 'pending_approval'"
    ).bind(&domain).fetch_optional(&state.db).await.unwrap_or(None);
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
    StatusCode::OK.into_response()
}

async fn notify_new_request(domain: &str, email: &str) {
    let Ok(client) = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5)).build() else { return };
    let _ = client
        .post("https://ntfy.sh/rfi-irfos-web-contact")
        .header("Title", "New initial review request")
        .body(format!("domain={domain} email={email} — approve via POST /api/initial-review/:id/approve"))
        .send().await;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && cargo test review:: -- --nocapture`
Expected: PASS (4 tests: `normalize_strips_scheme_and_path`,
`submit_without_consent_is_rejected`,
`submit_with_consent_inserts_row_and_returns_200`,
`honeypot_filled_drops_silently_with_200`).

- [ ] **Step 5: Register the module and route in `main.rs`**

In `backend/src/main.rs`, add `mod review;` next to the other `mod`
declarations, call `review::create_tables(&db).await;` right after the
existing `web_visits` table setup, and add the route:

```rust
.route("/api/initial-review", post(review::submit_review))
```

- [ ] **Step 6: Commit**

```bash
git add backend/src/review.rs backend/src/main.rs
git commit -m "feat(backend): add initial review submission endpoint"
```

## Task 2: Admin approve/reject + scan task

**Files:**
- Modify: `backend/src/review.rs`

**Interfaces:**
- Consumes: Task 1's `normalize_domain`, `AppState`, `auth::get_session`.
- Produces: `pub async fn list_reviews`, `pub async fn approve_review`,
  `pub async fn reject_review` (all `Path<i64>` where relevant), `async fn
  run_scan(db: SqlitePool, id: i64, domain: String)`, each signal check
  function returning `Signal { category: &'static str, flag: bool, detail:
  String, confidence: &'static str }`.

- [ ] **Step 1: Write the failing tests**

```rust
// append inside backend/src/review.rs's existing #[cfg(test)] mod tests
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
    // A tiny local server standing in for the "target domain" — exercised
    // directly against the check function, not over real DNS.
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
```

Add `wiremock = "0.6"` under `[dev-dependencies]` in `backend/Cargo.toml`
(create the section if it doesn't exist yet — it doesn't, per the earlier
scan of `Cargo.toml`).

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && cargo test review:: -- --nocapture`
Expected: FAIL to compile — `approve_review`, `check_exposed_paths` don't
exist.

- [ ] **Step 3: Write the implementation**

```rust
// backend/src/review.rs — add below submit_review, above create_tables or
// wherever reads cleanest; imports to add at the top of the file:
use axum::extract::Path;
use axum_extra::extract::cookie::CookieJar;
use crate::auth::get_session;

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
    let Ok(client) = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5)).build() else { return };
    let _ = client
        .post("https://ntfy.sh/rfi-irfos-web-contact")
        .header("Title", "Initial review scan complete")
        .body(format!("domain={domain} — signals ready, review before sending a report"))
        .send().await;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && cargo test review:: -- --nocapture`
Expected: PASS, including the two `wiremock`-backed signal tests and the
unauthorized-approve test.

- [ ] **Step 5: Register the new routes in `main.rs`**

```rust
.route("/api/initial-review", get(review::list_reviews).post(review::submit_review))
.route("/api/initial-review/:id/approve", post(review::approve_review))
.route("/api/initial-review/:id/reject", post(review::reject_review))
```

(Replaces the single `.route("/api/initial-review", post(review::submit_review))`
line added in Task 1.)

- [ ] **Step 6: Commit**

```bash
git add backend/src/review.rs backend/src/main.rs backend/Cargo.toml backend/Cargo.lock
git commit -m "feat(backend): add review approval queue and read-only signal scan"
```

## Task 3: Stripe tiers for the four subscription levels

**Files:**
- Modify: `backend/src/stripe.rs:29-47` (the `tier_info` match)

**Interfaces:**
- Consumes: existing `TierInfo { label, amount, recurring }`.
- Produces: four new tier keys usable by `POST /api/stripe/checkout`.

- [ ] **Step 1: Write the failing test**

```rust
// backend/src/stripe.rs — add near the bottom of the file
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn review_tiers_have_correct_amounts() {
        assert_eq!(tier_info("review_starter").unwrap().amount, 9_900);
        assert_eq!(tier_info("review_growth").unwrap().amount, 39_900);
        assert_eq!(tier_info("review_pro").unwrap().amount, 79_900);
        assert_eq!(tier_info("review_business").unwrap().amount, 199_900);
        assert!(tier_info("review_starter").unwrap().recurring);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && cargo test stripe::tests::review_tiers -- --nocapture`
Expected: FAIL — `assertion failed` / panics on `.unwrap()` of `None`.

- [ ] **Step 3: Add the four tiers**

In `backend/src/stripe.rs`, inside `fn tier_info`, add before the closing
`_ => None,` arm:

```rust
        // Initial Review subscription tiers (2026-10-14 pricing redesign)
        "review_starter"  => Some(TierInfo { label: "RFI-IRFOS Initial Review — Starter",  amount:   9_900, recurring: true }),
        "review_growth"   => Some(TierInfo { label: "RFI-IRFOS Initial Review — Growth",   amount:  39_900, recurring: true }),
        "review_pro"      => Some(TierInfo { label: "RFI-IRFOS Initial Review — Pro",      amount:  79_900, recurring: true }),
        "review_business" => Some(TierInfo { label: "RFI-IRFOS Initial Review — Business", amount: 199_900, recurring: true }),
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && cargo test stripe::tests::review_tiers -- --nocapture`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/stripe.rs
git commit -m "feat(backend): add Stripe tier_info for the 4 review subscription tiers"
```

## Task 4: i18n content for the review flow

**Files:**
- Modify: `frontend/src/content/en.ts` (add `initialReview` block near
  `appPrivacy`/`submit`)
- Modify: `frontend/src/content/de.ts` (mirror, German copy)

**Interfaces:**
- Produces: `t.initialReview` with the shape consumed by Task 5's
  `InitialReviewFlow.tsx`.

- [ ] **Step 1: No test for copy content — TypeScript's structural type
  check on `DE: Content` is the safety net (Task 2's self-review already
  confirmed `de.ts` must match `en.ts`'s shape exactly or the build fails).
  Add the block, then verify with the typecheck in Step 2.**

In `frontend/src/content/en.ts`, add after the `appPrivacy` block (before
`pricing:`):

```ts
  initialReview: {
    step1Label: 'Step 1 of 2',
    domainLabel: 'Your site',
    domainPlaceholder: 'yoursite.com',
    continueCta: 'Continue',
    step2Label: 'Step 2 of 2',
    backCta: 'Back',
    emailLabel: 'Your work email',
    emailPlaceholder: 'you@company.com',
    consentLabel: 'I own this domain or am authorized to test it, and I agree to this one read-only check. One word, we never look at it again — permanent opt-out.',
    submitCta: 'Send my report, no commitment',
    submitSending: 'Sending…',
    submitOk: 'Request received',
    gateNote: 'Nothing scans until a researcher confirms your request. We reply within one business day.',
    scopeDisclaimer: 'External, read-only signal check — not a source code review, and not a statement that the application is secure.',
    priceTeaser: 'Start from €99',
    priceSubline: 'plans from €99/mo · read-only free check · ~20 min · permanent opt-out · or pick a plan',
    errorText: 'Something went wrong sending that.',
    errorMailtoCta: 'Email us directly instead →',
  },
```

In `frontend/src/content/de.ts`, add the matching block in the same
position:

```ts
  initialReview: {
    step1Label: 'Schritt 1 von 2',
    domainLabel: 'Ihre Website',
    domainPlaceholder: 'ihreseite.com',
    continueCta: 'Weiter',
    step2Label: 'Schritt 2 von 2',
    backCta: 'Zurück',
    emailLabel: 'Ihre Arbeits-E-Mail',
    emailPlaceholder: 'sie@firma.com',
    consentLabel: 'Ich besitze diese Domain oder bin autorisiert, sie zu testen, und stimme diesem einen Read-only-Check zu. Ein Wort genügt, wir sehen sie nie wieder an — dauerhafter Opt-out.',
    submitCta: 'Report anfordern, unverbindlich',
    submitSending: 'Wird gesendet…',
    submitOk: 'Anfrage erhalten',
    gateNote: 'Es wird nichts gescannt, bevor ein:e Researcher:in Ihre Anfrage bestätigt hat. Wir melden uns innerhalb eines Werktags.',
    scopeDisclaimer: 'Externer Read-only-Signal-Check — keine Quellcode-Prüfung und keine Aussage, dass die Anwendung sicher ist.',
    priceTeaser: 'Ab €99',
    priceSubline: 'Pläne ab €99/Monat · kostenloser Read-only-Check · ~20 Min · dauerhafter Opt-out · oder einen Plan wählen',
    errorText: 'Beim Senden ist etwas schiefgegangen.',
    errorMailtoCta: 'Stattdessen direkt per E-Mail →',
  },
```

- [ ] **Step 2: Verify the TypeScript build still typechecks**

Run: `cd frontend && npx tsc --noEmit`
Expected: no new errors referencing `initialReview` or `content/de.ts`
(pre-existing unrelated errors, if any, are out of scope for this task —
confirm by running the same command on the pre-Task-4 commit if unsure
whether an error is new).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/content/en.ts frontend/src/content/de.ts
git commit -m "feat(frontend): add i18n content for the initial review flow"
```

## Task 5: `InitialReviewFlow.tsx` component

**Files:**
- Create: `frontend/src/components/sections/InitialReviewFlow.tsx`

**Interfaces:**
- Consumes: `t.initialReview` (Task 4), `useLocale` hook, existing
  `Reveal`/`useMobile` from `./shared` if useful for mobile stacking (not
  required — this component is small enough to not need `Reveal`).
- Produces: `export function InitialReviewFlow({ variant }: { variant:
  'embedded' | 'modal'; onDone?: () => void })` — a two-step form, no
  modal chrome of its own (the `modal` variant still renders only the
  card; Task 7 wraps it in the existing checkout-modal overlay pattern).

- [ ] **Step 1: No unit test harness exists for `.tsx` components in this
  repo (confirmed during spec research) — verified manually via the `run`
  skill in Task 8. Write the implementation directly, matching the
  three-state (idle/sending/ok/err) pattern `Submit.tsx` already uses.**

```tsx
// frontend/src/components/sections/InitialReviewFlow.tsx
import { useState } from 'react'
import { useLocale } from '../../hooks/useLocale'

const MONO = "'JetBrains Mono', monospace"

type FormState = 'idle' | 'sending' | 'ok' | 'err'

export function InitialReviewFlow({ variant }: { variant: 'embedded' | 'modal' }) {
  const { t } = useLocale()
  const c = t.initialReview
  const [step, setStep] = useState<1 | 2>(1)
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [botcheck, setBotcheck] = useState('')
  const [state, setState] = useState<FormState>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent || state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/initial-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, email, consent, botcheck }),
      })
      setState(res.ok ? 'ok' : 'err')
    } catch {
      setState('err')
    }
  }

  const cardStyle: React.CSSProperties = {
    border: '1px solid var(--border)', borderRadius: 16, padding: variant === 'embedded' ? '20px' : '24px',
    background: 'var(--glass-bg-solid)', display: 'flex', flexDirection: 'column', gap: 14,
    maxWidth: variant === 'modal' ? 380 : undefined, height: variant === 'embedded' ? '100%' : undefined,
    boxSizing: 'border-box',
  }

  return (
    <div style={cardStyle}>
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={botcheck} onChange={e => setBotcheck(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

      <p style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', margin: 0 }}>
        {step === 1 ? c.step1Label : c.step2Label}
      </p>

      {step === 1 ? (
        <form onSubmit={e => { e.preventDefault(); if (domain.trim()) setStep(2) }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 12.5, color: 'var(--text2)' }}>{c.domainLabel}</label>
          <input type="text" required placeholder={c.domainPlaceholder} value={domain}
            onChange={e => setDomain(e.target.value)}
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          <button type="submit" style={{ background: '#f97316', color: '#1a0f00', padding: '12px 20px', borderRadius: 8, fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer' }}>
            {c.continueCta}
          </button>
        </form>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button type="button" onClick={() => setStep(1)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text3)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
            ← {c.backCta}
          </button>
          <div>
            <div style={{ fontSize: 10, fontFamily: MONO, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{c.domainLabel}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{domain}</div>
          </div>
          <input type="email" required placeholder={c.emailPlaceholder} value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
            <input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)}
              style={{ marginTop: 3, accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }} />
            <span style={{ color: 'var(--text2)', fontSize: 11.5, lineHeight: 1.6 }}>{c.consentLabel}</span>
          </label>
          <button type="submit" disabled={state === 'sending' || !consent} style={{
            background: state === 'ok' ? 'rgba(0,245,196,0.2)' : '#f97316',
            color: state === 'ok' ? 'var(--accent-text)' : '#1a0f00',
            border: state === 'ok' ? '1px solid var(--accent-text)' : 'none',
            padding: '13px 20px', borderRadius: 8, fontWeight: 800, fontSize: 13,
            cursor: state === 'sending' ? 'wait' : !consent ? 'not-allowed' : 'pointer',
            opacity: !consent && state === 'idle' ? 0.5 : 1,
          }}>
            {state === 'sending' ? c.submitSending : state === 'ok' ? c.submitOk : c.submitCta}
          </button>
          {state === 'err' && (
            <p style={{ color: 'var(--sev-crit)', fontSize: 12.5, lineHeight: 1.6 }}>
              {c.errorText}{' '}
              <a href={`mailto:contact@rfi-irfos.com?subject=${encodeURIComponent('Initial Review — ' + domain)}&body=${encodeURIComponent(`Domain: ${domain}\nEmail: ${email}`)}`} style={{ color: 'var(--accent-text)', fontWeight: 700 }}>
                {c.errorMailtoCta}
              </a>
            </p>
          )}
        </form>
      )}

      <p style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6, margin: 0 }}>{c.gateNote}</p>
      <p style={{ fontSize: 10.5, color: 'var(--text3)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>{c.scopeDisclaimer}</p>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 'auto' }}>
        <a href="#pricing" style={{ color: 'var(--accent-text)', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>{c.priceTeaser} →</a>
        <p style={{ fontSize: 10.5, color: 'var(--text3)', margin: '4px 0 0' }}>{c.priceSubline}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/sections/InitialReviewFlow.tsx
git commit -m "feat(frontend): add InitialReviewFlow component (step1/step2 form)"
```

## Task 6: Rebuild `AppPrivacySection.tsx`'s right column

**Files:**
- Modify: `frontend/src/components/sections/AppPrivacySection.tsx:156-175`

**Interfaces:**
- Consumes: `InitialReviewFlow` (Task 5), existing `TRUST_ICONS`/`tile`
  already defined in this file.

- [ ] **Step 1: Replace the right column**

Replace lines 156-175 (the `{/* Right: frameless column ... */}` block,
from `<div style={{ display: 'flex', flexDirection: 'column', gap: 22, ...`
through its closing `</div>` before the section's closing `</div>`) with:

```tsx
          {/* Right: the embedded review flow (2026-10-14 redesign — this
              used to be four trust-point cards stacked above a CTA link to
              #submit; live direction moved the actual intake flow onto the
              page itself instead of behind a click, so the trust points
              compress into a slim icon row and the reclaimed space holds
              the real step1/step2 form). */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 16, alignSelf: stacked ? 'stretch' : 'stretch', padding: stacked ? 0 : '0 4px',
          }}>
            <Reveal from="right" dist={64} delay={1} style={{ flex: 1 }}>
              <InitialReviewFlow variant="embedded" />
            </Reveal>
            <Reveal from="bottom" dist={48} delay={4}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                {c.trust.map((item, i) => (
                  <span key={item.title} className="rfi-glass-icon" title={item.title} style={{ ...tile, width: 36, height: 36 }}>
                    {TRUST_ICONS[i]}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
```

Add the import at the top of the file:

```tsx
import { InitialReviewFlow } from './InitialReviewFlow'
```

(Leave everything else in the file — the left column with the 4 process
steps, the scope list, and the evidence card — untouched, per the earlier
confirmation that only the right column changes.)

- [ ] **Step 2: Verify the TypeScript build typechecks**

Run: `cd frontend && npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/sections/AppPrivacySection.tsx
git commit -m "feat(frontend): embed InitialReviewFlow in AppPrivacySection, compress trust points to an icon row"
```

## Task 7: `Pricing.tsx` rewrite — 4-tier grid + Free card + secondary menu

**Files:**
- Modify: `frontend/src/content/en.ts` (add `t.pricing.tiers`, keep
  `t.pricing.domains` for the secondary list)
- Modify: `frontend/src/content/de.ts` (mirror)
- Modify: `frontend/src/components/sections/Pricing.tsx` (replace the
  sticky card-stack body; keep the file's existing `onSelectTier` prop
  contract so `PublicSite.tsx`'s `<PricingSection onSelectTier={selectTier} />`
  call site doesn't need to change)

**Interfaces:**
- Consumes: `InitialReviewFlow` (Task 5, `variant="modal"`), existing
  `EngagementFlow`/`Reveal`/`useMobile`/`CartIcon`/`ZapIcon` from `./shared`,
  `onSelectTier: (tier: string) => void` prop (existing — routes to the
  contact form, per `PublicSite.tsx`'s `selectTier`), a new
  `onCheckout: (tier: string) => void` prop that `PublicSite.tsx` passes
  as `handleCheckout`-via-`checkoutModal` (same confirmation-modal path
  other Stripe-bound tiers already use — see `PublicSite.tsx:655-665`'s
  `setCheckoutModal(info)` pattern).
- Produces: `PricingSection({ onSelectTier, onCheckout }: {...})`.

- [ ] **Step 1: Add `t.pricing.tiers` content**

In `frontend/src/content/en.ts`, inside the existing `pricing:` block, add
a new `tiers` array alongside the existing `domains` array (keep
`domains` — it now backs the secondary list, not the hero grid):

```ts
    tiers: [
      { name: 'Starter', price: '€99', features: ['One defined investigation per billing month.', 'Validated findings with PoC.', 'PDF report.', 'Free retest of fixed findings.'], cta: 'Choose Starter', stripeKey: 'review_starter' },
      { name: 'Growth', price: '€399', popular: true, features: ['Continuous monitoring: scheduled re-examination at a fixed interval within the agreed scope.', 'Unlimited retests on this surface.', 'Validated findings with PoC.'], cta: 'Choose Growth', stripeKey: 'review_growth' },
      { name: 'Pro', price: '€799', features: ['Everything in Growth.', 'Up to three defined surfaces.', 'Priority scheduling.'], cta: 'Choose Pro', stripeKey: 'review_pro' },
      { name: 'Business', price: '€1,999', features: ['Everything in Pro.', 'Up to ten surfaces.', 'Dedicated success channel.'], cta: 'Choose Business', stripeKey: 'review_business' },
    ],
    freeCard: { label: 'Free', price: '€0', tagline: 'Initial review · Self-serve entry point.' },
    enterprise: { heading: 'Enterprise', text: 'Custom surfaces, MSP, multi-tenant deployments, white-label and negotiated SLAs. Price in writing.', cta: 'Talk to us' },
    needSomethingElse: 'Need something else?',
```

In `frontend/src/content/de.ts`, add the matching `tiers`/`freeCard`/
`enterprise`/`needSomethingElse` keys with German copy:

```ts
    tiers: [
      { name: 'Starter', price: '€99', features: ['Eine definierte Untersuchung pro Abrechnungsmonat.', 'Validierte Findings mit PoC.', 'PDF-Report.', 'Kostenloser Retest behobener Findings.'], cta: 'Starter wählen', stripeKey: 'review_starter' },
      { name: 'Growth', price: '€399', popular: true, features: ['Laufende Überwachung: geplante Neuprüfung in festem Intervall innerhalb des vereinbarten Scopes.', 'Unbegrenzte Retests auf dieser Oberfläche.', 'Validierte Findings mit PoC.'], cta: 'Growth wählen', stripeKey: 'review_growth' },
      { name: 'Pro', price: '€799', features: ['Alles aus Growth.', 'Bis zu drei definierte Oberflächen.', 'Priorisierte Terminierung.'], cta: 'Pro wählen', stripeKey: 'review_pro' },
      { name: 'Business', price: '€1.999', features: ['Alles aus Pro.', 'Bis zu zehn Oberflächen.', 'Dedizierter Success-Kanal.'], cta: 'Business wählen', stripeKey: 'review_business' },
    ],
    freeCard: { label: 'Free', price: '€0', tagline: 'Erstprüfung · Self-Serve-Einstieg.' },
    enterprise: { heading: 'Enterprise', text: 'Individuelle Oberflächen, MSP, Multi-Tenant-Deployments, White-Label und verhandelte SLAs. Preis auf Anfrage.', cta: 'Kontakt aufnehmen' },
    needSomethingElse: 'Etwas anderes gesucht?',
```

- [ ] **Step 2: Rewrite `Pricing.tsx`**

Replace the file's `DomainCard` function and `PricingSection` export (the
whole sticky-stack body) with:

```tsx
import { EngagementFlow, Reveal, useMobile } from './shared'
import { useLocale } from '../../hooks/useLocale'
import { InitialReviewFlow } from './InitialReviewFlow'
import { useState } from 'react'

type PricingDomain = {
  name: string; badge: string; scope: string
  bring?: string; we?: string; receive?: string; cta: string; delivery: string
}

type PricingTier = {
  name: string; price: string; features: string[]; cta: string
  stripeKey: string; popular?: boolean
}

function TierCard({ tier, mobile, onCheckout }: { tier: PricingTier; mobile: boolean; onCheckout: (stripeKey: string) => void }) {
  return (
    <div style={{
      border: tier.popular ? '1px solid #f97316' : '1px solid var(--border)',
      borderRadius: 16, padding: mobile ? '18px 20px' : '22px 24px',
      background: tier.popular ? 'rgba(249,115,22,0.06)' : 'var(--glass-bg-solid)',
      display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
    }}>
      {tier.popular && (
        <span style={{ position: 'absolute', top: -11, left: 20, background: '#f97316', color: '#1a0f00', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Most popular
        </span>
      )}
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text3)', margin: 0 }}>{tier.name}</p>
      <div>
        <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)' }}>{tier.price}</span>
        <span style={{ fontSize: 12.5, color: 'var(--text3)' }}> /mo</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {tier.features.map(f => (
          <li key={f} style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text2)', display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--accent-text)', fontWeight: 800 }}>✓</span>{f}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onCheckout(tier.stripeKey)} style={{
        background: tier.popular ? '#f97316' : 'transparent',
        color: tier.popular ? '#1a0f00' : 'var(--text)',
        border: tier.popular ? 'none' : '1px solid var(--border)',
        padding: '11px 16px', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer',
      }}>{tier.cta}</button>
    </div>
  )
}

function NeedSomethingElseRow({ domains, onSelectTier }: { domains: PricingDomain[]; onSelectTier: (t: string) => void }) {
  const { t } = useLocale()
  return (
    <div style={{ borderTop: '1px solid var(--border)', marginTop: 32, paddingTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 18px' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{t.pricing.needSomethingElse}</span>
      {domains.map((d, i) => (
        <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button type="button" onClick={() => onSelectTier(d.name)} style={{ background: 'none', border: 'none', color: 'var(--accent-text)', fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: 0 }}>
            {d.name}
          </button>
          {i < domains.length - 1 && <span style={{ color: 'var(--border)' }}>·</span>}
        </span>
      ))}
    </div>
  )
}

export function PricingSection({
  onSelectTier, onCheckout,
}: {
  onSelectTier: (tier: string) => void
  onCheckout: (stripeKey: string) => void
}) {
  const { t } = useLocale()
  const mobile = useMobile(640)
  const [freeModalOpen, setFreeModalOpen] = useState(false)

  return (
    <section id="pricing" style={{ padding: '56px var(--sec-pad-x) 120px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="wm-eyebrow">{t.pricing.eyebrow}</p>
            <h1 className="rfi-page-h1" style={{ marginBottom: 12 }}>{t.pricing.heading}</h1>
            <p style={{ color: 'var(--text2)', marginBottom: 40, maxWidth: 640 }}>{t.pricing.subheading}</p>
          </div>
        </Reveal>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <button type="button" onClick={() => setFreeModalOpen(true)} style={{
              width: '100%', textAlign: 'left', background: 'var(--glass-bg-solid)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px 28px', cursor: 'pointer', marginBottom: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text3)', margin: '0 0 6px' }}>{t.pricing.freeCard.label}</p>
                <p style={{ fontSize: 13.5, color: 'var(--text2)', margin: 0 }}>{t.pricing.freeCard.tagline}</p>
              </div>
              <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)' }}>{t.pricing.freeCard.price}</span>
            </button>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(4, 1fr)', gap: 16 }}>
            {t.pricing.tiers.map((tier, i) => (
              <Reveal key={tier.name} from="bottom" dist={48} delay={i}>
                <TierCard tier={tier} mobile={mobile} onCheckout={onCheckout} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={4}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', margin: '0 0 4px' }}>{t.pricing.enterprise.heading}</p>
                <p style={{ fontSize: 12.5, color: 'var(--text2)', margin: 0, maxWidth: 520 }}>{t.pricing.enterprise.text}</p>
              </div>
              <button type="button" onClick={() => onSelectTier('Enterprise')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {t.pricing.enterprise.cta}
              </button>
            </div>
          </Reveal>

          <NeedSomethingElseRow domains={t.pricing.domains} onSelectTier={onSelectTier} />
        </div>
      </div>

      {freeModalOpen && (
        <div onClick={() => setFreeModalOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,4,10,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()}>
            <InitialReviewFlow variant="modal" />
          </div>
        </div>
      )}
    </section>
  )
}
```

(`EngagementFlow` stays imported for parity with the rest of the codebase
even though this rewrite doesn't call it directly — if `tsc` flags it as
an unused import after this change, remove it; TypeScript's `noUnusedLocals`
setting, if enabled, will tell you in Step 4 below.)

- [ ] **Step 3: Update the call site in `PublicSite.tsx`**

Find `<PricingSection onSelectTier={selectTier} />` and replace with:

```tsx
<PricingSection onSelectTier={selectTier} onCheckout={handleCheckout} />
```

(`handleCheckout` already exists in `PublicSite.tsx` per the earlier
research — it posts to `/api/stripe/checkout` and redirects to the
returned URL. This reuses it directly rather than routing paid tiers
through the `checkoutModal` confirmation step, since that step exists for
B2B ToS agreement text that doesn't apply the same way to a recurring
self-serve subscription — if Simeon wants the same confirmation modal for
these tiers too, that's a one-line follow-up swapping `handleCheckout` for
the `setCheckoutModal(...)` call other tiers use, not a structural change.)

- [ ] **Step 4: Verify the TypeScript build typechecks**

Run: `cd frontend && npx tsc --noEmit`
Expected: no new errors. Remove `EngagementFlow` from the import list if
flagged unused.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/content/en.ts frontend/src/content/de.ts frontend/src/components/sections/Pricing.tsx frontend/src/components/PublicSite.tsx
git commit -m "feat(frontend): replace sticky pricing card-stack with 4-tier grid + free card + secondary domain menu"
```

## Task 8: Run locally and walk the journey

**Files:** none (verification only)

- [ ] **Step 1: Start the backend**

```bash
cd backend && DEV_MODE=true cargo run
```

Expected: `Listening on http://0.0.0.0:3000` with no panics; `initial_reviews`
table created (visible via `sqlite3 visits.db ".schema initial_reviews"` in
another terminal).

- [ ] **Step 2: Start the frontend**

```bash
cd frontend && npm run dev
```

Expected: Vite dev server prints a local URL (proxy `/api` to the backend
per the existing `vite.config.ts`, if one isn't already configured check
that file and add a proxy entry for `/api` → `http://localhost:3000`
before relying on this step).

- [ ] **Step 3: Walk the free journey**

Open the homepage in a browser, scroll to the "Multi-Agent Software
Security Investigations" section, confirm the left column (steps,
scope list, evidence card) is unchanged, confirm the right column now
shows the embedded step-1/step-2 form with the compressed trust-icon row
beneath it. Submit a test domain + email, confirm the submit succeeds
(network tab shows `200` from `POST /api/initial-review`).

- [ ] **Step 4: Approve and confirm the scan runs**

```bash
# list pending requests (requires a session cookie — in DEV_MODE, visiting
# /auth/google in the browser logs you in without real Google OAuth)
curl -b cookies.txt http://localhost:3000/api/initial-review
# approve the id from the listing
curl -b cookies.txt -X POST http://localhost:3000/api/initial-review/1/approve
# wait a few seconds for the background scan, then re-list and confirm
# status is "scanned" and `signals` is populated
curl -b cookies.txt http://localhost:3000/api/initial-review
```

Expected: `signals` contains 6 entries, one per category from Task 2.

- [ ] **Step 5: Walk the pricing page**

Navigate to `#pricing`. Confirm: Free card at the top opens the modal
variant of the same form; the 4-tier grid renders with Growth marked
"Most popular"; clicking a paid tier's CTA hits `POST /api/stripe/checkout`
(will fail gracefully with the existing `alert(t.alerts.checkoutUnavailable)`
if `STRIPE_SECRET_KEY` isn't set in the local `.env` — set a Stripe test
key to see the real redirect); the Enterprise band and "Need something
else?" row both route into the existing contact form with the right topic
pre-filled.

- [ ] **Step 6: Report back**

No commit for this task — it's verification. Note anything that didn't
match the expected behavior above as a follow-up, rather than silently
patching past it.
