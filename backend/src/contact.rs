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

    tracing::info!("Contact from {} ({})", entry.name, entry.email);
    StatusCode::OK.into_response()
}
