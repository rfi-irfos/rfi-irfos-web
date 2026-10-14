use axum::{extract::State, http::{HeaderMap, StatusCode}, response::IntoResponse, Json};
use serde::Deserialize;
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
        assert_eq!(res2.status(), StatusCode::OK);

        let count: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM initial_reviews WHERE domain = 'foo.com' AND status = 'pending_approval'"
        ).fetch_one(&db).await.unwrap();
        assert_eq!(count.0, 1);
    }
}
