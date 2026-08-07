use axum::{extract::State, http::{HeaderMap, StatusCode}, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use tokio::io::AsyncWriteExt;
use std::{collections::HashMap, sync::{Mutex, OnceLock}, time::Instant};

use crate::AppState;

static CONTACT_RATE_LIMITER: OnceLock<Mutex<HashMap<String, Vec<Instant>>>> = OnceLock::new();

fn contact_rate_limiter() -> &'static Mutex<HashMap<String, Vec<Instant>>> {
    CONTACT_RATE_LIMITER.get_or_init(|| Mutex::new(HashMap::new()))
}

fn contact_rate_limited(ip: &str) -> bool {
    const MAX: usize = 5;
    const WINDOW: std::time::Duration = std::time::Duration::from_secs(60);
    let now = Instant::now();
    let mut map = contact_rate_limiter().lock().unwrap_or_else(|e| e.into_inner());
    let ts = map.entry(ip.to_string()).or_default();
    ts.retain(|t| now.duration_since(*t) < WINDOW);
    if ts.len() >= MAX { return true; }
    ts.push(now);
    false
}

#[derive(Deserialize)]
pub struct ContactRequest {
    pub name: String,
    pub email: String,
    pub phone: Option<String>,
    pub message: String,
    /// Honeypot field. Hidden from real visitors via the form's own CSS/tabIndex/
    /// aria-hidden, so only an automated filler that submits every input populates it.
    /// The frontend already no-ops on a non-empty value, but that check runs in the
    /// browser - a script posting directly to this endpoint skips it entirely, which is
    /// the gap this closes.
    pub botcheck: Option<String>,
}

#[derive(Serialize)]
struct ContactEntry {
    name: String,
    email: String,
    phone: String,
    message: String,
    received_at: String,
}

pub async fn submit_contact(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<ContactRequest>,
) -> impl IntoResponse {
    let ip = headers
        .get("fly-client-ip")
        .or_else(|| headers.get("x-forwarded-for"))
        .and_then(|v| v.to_str().ok())
        .unwrap_or("unknown")
        .split(',')
        .next()
        .unwrap_or("unknown")
        .trim()
        .to_string();

    if contact_rate_limited(&ip) {
        return (StatusCode::TOO_MANY_REQUESTS, "rate limit exceeded — 5 submissions per minute per IP\n").into_response();
    }

    // Silently accept-and-drop, mirroring the frontend's own no-op on this field, so a
    // bot gets no signal that it tripped a check either way.
    if body.botcheck.as_deref().is_some_and(|v| !v.trim().is_empty()) {
        tracing::info!("Contact submission from {ip} dropped: honeypot field filled");
        return StatusCode::OK.into_response();
    }

    if body.name.trim().is_empty() || body.email.trim().is_empty() || body.message.trim().is_empty() {
        return (StatusCode::BAD_REQUEST, "Pflichtfelder fehlen.").into_response();
    }
    if body.name.len() > 200 || body.email.len() > 200 || body.message.len() > 4000 {
        return (StatusCode::BAD_REQUEST, "Eingabe zu lang.").into_response();
    }

    let entry = ContactEntry {
        name: body.name.trim().to_string(),
        email: body.email.trim().to_string(),
        phone: body.phone.unwrap_or_default().trim().to_string(),
        message: body.message.trim().to_string(),
        received_at: chrono::Utc::now().to_rfc3339(),
    };

    let line = match serde_json::to_string(&entry) {
        Ok(s) => format!("{s}\n"),
        Err(e) => {
            tracing::error!("Contact serialize failed: {e}");
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };

    let contacts_path = state.content_path
        .parent()
        .unwrap_or(std::path::Path::new("."))
        .join("contacts.jsonl");

    match tokio::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&contacts_path)
        .await
    {
        Ok(mut f) => {
            if let Err(e) = f.write_all(line.as_bytes()).await {
                tracing::error!("Contact write failed: {e}");
                return StatusCode::INTERNAL_SERVER_ERROR.into_response();
            }
        }
        Err(e) => {
            tracing::error!("Contact open failed: {e}");
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    }

    // Relay the lead into the Lighthouse CRM. This is the whole point of the endpoint:
    // Lighthouse computes its "leads" figure as COUNT(*) FROM contacts, so a submission
    // that never reaches that table is invisible no matter how many people send it. Until
    // 2026-08-05 nothing on rfi-irfos.com wrote to it, which is why 71,340 visits showed
    // zero leads.
    //
    // The key is held here, server side, and never reaches the browser bundle. We send
    // x-inbox-key against Lighthouse's existing LIGHTHOUSE_INBOX_KEY rather than
    // introducing LIGHTHOUSE_SIGNUP_KEY: signup() validates against a single key value,
    // so defining SIGNUP_KEY over there would invalidate the key ternlang.com already
    // sends and silently break its lead flow.
    let relayed = relay_to_crm(&entry).await;

    match relayed {
        Ok(()) => {
            tracing::info!("Contact from {} ({}) relayed to CRM", entry.name, entry.email);
            StatusCode::OK.into_response()
        }
        Err(e) => {
            // The submission is already durably appended above, so it is not lost. We still
            // fail loudly rather than returning 200: a form that reports success while the
            // lead goes nowhere is exactly the failure this endpoint exists to end. The
            // visitor sees an error and the direct email address instead.
            tracing::error!("Contact relay to CRM failed for {}: {e}", entry.email);
            (StatusCode::BAD_GATEWAY, "could not reach the CRM").into_response()
        }
    }
}

async fn relay_to_crm(entry: &ContactEntry) -> Result<(), String> {
    let key = std::env::var("LIGHTHOUSE_INBOX_KEY")
        .or_else(|_| std::env::var("LIGHTHOUSE_SIGNUP_KEY"))
        .unwrap_or_default();
    if key.is_empty() {
        return Err("LIGHTHOUSE_INBOX_KEY not set on this app".into());
    }

    let base = std::env::var("LIGHTHOUSE_BASE_URL")
        .unwrap_or_else(|_| "https://lighthouse-rfi-irfos.fly.dev".to_string());

    // Everything the visitor typed goes into `org` and the message body, because the CRM
    // signup shape only carries email/name/org/tier. The full message is preserved in the
    // contacts.jsonl line written above, and `tier` marks where the lead came from so
    // website leads are distinguishable from ternlang.com API signups in the CRM.
    let payload = serde_json::json!({
        "email": entry.email,
        "name":  entry.name,
        "org":   entry.phone,
        "tier":  "rfi-irfos.com contact form",
    });

    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .map_err(|e| e.to_string())?;

    let res = client
        .post(format!("{base}/lighthouse/api/crm/signup"))
        .header("x-inbox-key", key)
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        Ok(())
    } else {
        Err(format!("CRM returned {}", res.status()))
    }
}
