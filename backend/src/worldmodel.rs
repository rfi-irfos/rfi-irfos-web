use axum::{extract::State, http::{HeaderMap, StatusCode}, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use tokio::io::AsyncWriteExt;
use std::{collections::HashMap, sync::{Mutex, OnceLock}, time::Instant};

use crate::AppState;

// ── Live feed ────────────────────────────────────────────────────────────
//
// Placeholder only. The real source (DINGIR's ReasoningFeed, OBSERVED/
// DERIVED/PREDICTED entries from the world graph, plus curated world-model
// events) lives on a separate machine and isn't network-reachable from this
// Fly.io app (bi_api only binds 127.0.0.1). The intended real architecture,
// same shape as contact.rs's own outbound relay just reversed: a small
// script next to DINGIR's nightly_bake.sh periodically POSTs curated
// entries here with a shared-secret header, this handler stores the latest
// batch in memory, and this GET route serves it - never reaching into any
// of the three existing ntfy topics, which mix in unrelated case/embargo
// data that must never become public. Not built yet; this route ships the
// wire shape now so the frontend has something real to render against.
#[derive(Serialize)]
struct FeedEntry {
    id: &'static str,
    kind: &'static str,
    title: &'static str,
    time: &'static str,
    detail: &'static str,
}

pub async fn worldmodel_feed() -> impl IntoResponse {
    let entries = [
        FeedEntry { id: "ex-1", kind: "seismic", title: "M4.8 aftershock, Sumatra region", time: "07:24 UTC", detail: "Aftershock probability updated continuously via the Omori-Utsu model against the USGS earthquake feed." },
        FeedEntry { id: "ex-2", kind: "weather", title: "Heavy rainfall system, Southeast Asia", time: "07:18 UTC", detail: "Precipitation intensity cross-checked against the affected region's historical flood threshold." },
        FeedEntry { id: "ex-3", kind: "maritime", title: "Vessel reroute, Strait of Hormuz", time: "07:16 UTC", detail: "AIS position change flagged against the shipping-lane baseline for this route." },
        FeedEntry { id: "ex-4", kind: "infrastructure", title: "Rail delay cluster, DB network", time: "07:11 UTC", detail: "Multiple correlated delays on the same line segment within a short window." },
        FeedEntry { id: "ex-5", kind: "model", title: "Checkpoint evaluated, AUC 0.769", time: "06:58 UTC", detail: "Nightly retraining run scored against the held-out validation split before acceptance." },
    ];
    Json(entries)
}

// ── Early access signup ─────────────────────────────────────────────────
//
// Same rate limit / honeypot / durable-log / CRM-relay pattern as
// contact::submit_contact, deliberately not shared code with it: the two
// entries have different required fields (this one is email-only) and
// diverging that struct later should not risk the contact form's own
// working rate limiter or CRM payload shape.
static EARLY_ACCESS_RATE_LIMITER: OnceLock<Mutex<HashMap<String, Vec<Instant>>>> = OnceLock::new();

fn rate_limiter() -> &'static Mutex<HashMap<String, Vec<Instant>>> {
    EARLY_ACCESS_RATE_LIMITER.get_or_init(|| Mutex::new(HashMap::new()))
}

fn rate_limited(ip: &str) -> bool {
    const MAX: usize = 5;
    const WINDOW: std::time::Duration = std::time::Duration::from_secs(60);
    let now = Instant::now();
    let mut map = rate_limiter().lock().unwrap_or_else(|e| e.into_inner());
    let ts = map.entry(ip.to_string()).or_default();
    ts.retain(|t| now.duration_since(*t) < WINDOW);
    if ts.len() >= MAX { return true; }
    ts.push(now);
    false
}

#[derive(Deserialize)]
pub struct EarlyAccessRequest {
    pub email: String,
    /// Honeypot, same convention as contact::ContactRequest::botcheck.
    pub botcheck: Option<String>,
}

#[derive(Serialize)]
struct EarlyAccessEntry {
    email: String,
    received_at: String,
}

pub async fn submit_early_access(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<EarlyAccessRequest>,
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

    if rate_limited(&ip) {
        return (StatusCode::TOO_MANY_REQUESTS, "rate limit exceeded — 5 submissions per minute per IP\n").into_response();
    }

    if body.botcheck.as_deref().is_some_and(|v| !v.trim().is_empty()) {
        tracing::info!("Early-access submission from {ip} dropped: honeypot field filled");
        return StatusCode::OK.into_response();
    }

    let email = body.email.trim().to_string();
    if email.is_empty() || !email.contains('@') {
        return (StatusCode::BAD_REQUEST, "Gültige E-Mail-Adresse erforderlich.").into_response();
    }
    if email.len() > 200 {
        return (StatusCode::BAD_REQUEST, "Eingabe zu lang.").into_response();
    }

    let entry = EarlyAccessEntry { email: email.clone(), received_at: chrono::Utc::now().to_rfc3339() };

    let line = match serde_json::to_string(&entry) {
        Ok(s) => format!("{s}\n"),
        Err(e) => {
            tracing::error!("Early-access serialize failed: {e}");
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };

    let path = state.content_path
        .parent()
        .unwrap_or(std::path::Path::new("."))
        .join("early_access.jsonl");

    match tokio::fs::OpenOptions::new().create(true).append(true).open(&path).await {
        Ok(mut f) => {
            if let Err(e) = f.write_all(line.as_bytes()).await {
                tracing::error!("Early-access write failed: {e}");
                return StatusCode::INTERNAL_SERVER_ERROR.into_response();
            }
        }
        Err(e) => {
            tracing::error!("Early-access open failed: {e}");
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    }

    match relay_to_crm(&entry).await {
        Ok(()) => {
            tracing::info!("Early-access signup from {} relayed to CRM", entry.email);
            StatusCode::OK.into_response()
        }
        Err(e) => {
            // Durably logged above already, so nothing is lost - fail loudly rather
            // than reporting success into a CRM the lead never actually reached,
            // same reasoning as contact::submit_contact.
            tracing::error!("Early-access relay to CRM failed for {}: {e}", entry.email);
            (StatusCode::BAD_GATEWAY, "could not reach the CRM").into_response()
        }
    }
}

async fn relay_to_crm(entry: &EarlyAccessEntry) -> Result<(), String> {
    let key = std::env::var("LIGHTHOUSE_INBOX_KEY")
        .or_else(|_| std::env::var("LIGHTHOUSE_SIGNUP_KEY"))
        .unwrap_or_default();
    if key.is_empty() {
        return Err("LIGHTHOUSE_INBOX_KEY not set on this app".into());
    }

    let base = std::env::var("LIGHTHOUSE_BASE_URL")
        .unwrap_or_else(|_| "https://lighthouse-rfi-irfos.fly.dev".to_string());

    let payload = serde_json::json!({
        "email": entry.email,
        "name":  "",
        "org":   "",
        "tier":  "rfi-irfos.com world-model early access",
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

    if res.status().is_success() { Ok(()) } else { Err(format!("CRM returned {}", res.status())) }
}
