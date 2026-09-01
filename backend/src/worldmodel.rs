use axum::{extract::State, http::{HeaderMap, StatusCode}, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use tokio::io::AsyncWriteExt;
use std::{collections::HashMap, sync::{Mutex, OnceLock}, time::Instant};

use crate::AppState;

// ── Live feed ────────────────────────────────────────────────────────────
//
// Built 2026-09-01, replacing the placeholder five-example array this route
// shipped with. The real source is DINGIR's bi_api /reasoning/feed (ANOMALY/
// HUB/PREDICTION/CHANGE entries derived from the already-trained world
// graph), which only binds 127.0.0.1 on DINGIR's own machine and is not
// network-reachable from this Fly.io app. worldmodel_feed_relay.py (next to
// nightly_bake.sh, same machine, run every 5 minutes by a systemd user timer)
// reads that local endpoint and POSTs the curated batch here with a
// shared-secret header - same outbound-relay shape as contact.rs's own
// relay_to_crm, just reversed. Deliberately NOT reaching into any of the
// three existing ntfy topics, which mix in unrelated case/embargo data that
// must never become public.
//
// LIVE_FEED starts empty and stays empty until the relay's first successful
// POST. GET intentionally returns [] rather than canned examples in that
// window - the frontend's own FEED_FALLBACK + "BEISPIELDATEN (LIVE-FEED
// NICHT ERREICHBAR)" state is what a visitor should see, not this route
// quietly claiming success with fake data.
#[derive(Serialize, Deserialize, Clone)]
pub struct FeedEntry {
    id: String,
    kind: String,
    title: String,
    time: String,
    detail: String,
}

static LIVE_FEED: OnceLock<Mutex<Vec<FeedEntry>>> = OnceLock::new();

fn live_feed_store() -> &'static Mutex<Vec<FeedEntry>> {
    LIVE_FEED.get_or_init(|| Mutex::new(Vec::new()))
}

pub async fn worldmodel_feed() -> impl IntoResponse {
    let entries = live_feed_store().lock().unwrap_or_else(|e| e.into_inner()).clone();
    Json(entries)
}

// Same inbound-secret pattern as contact.rs/relay_to_crm use outbound: reuse
// LIGHTHOUSE_INBOX_KEY rather than mint a dedicated secret, since this app
// already has exactly one trusted server-to-server caller. Cap at 100
// entries - the relay only ever sends ~40, so anything past that is either a
// bug on the sending side or someone else entirely, not a batch to trust.
const MAX_FEED_ENTRIES: usize = 100;

pub async fn ingest_worldmodel_feed(headers: HeaderMap, Json(body): Json<Vec<FeedEntry>>) -> impl IntoResponse {
    let expected = std::env::var("LIGHTHOUSE_INBOX_KEY").unwrap_or_default();
    if expected.is_empty() {
        tracing::error!("worldmodel-feed ingest rejected: LIGHTHOUSE_INBOX_KEY not set on this app");
        return StatusCode::SERVICE_UNAVAILABLE.into_response();
    }
    let provided = headers.get("x-inbox-key").and_then(|v| v.to_str().ok()).unwrap_or_default();
    if provided != expected {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    if body.len() > MAX_FEED_ENTRIES {
        return (StatusCode::BAD_REQUEST, format!("at most {MAX_FEED_ENTRIES} entries per batch")).into_response();
    }

    let mut store = live_feed_store().lock().unwrap_or_else(|e| e.into_inner());
    let count = body.len();
    *store = body;
    drop(store);

    tracing::info!("worldmodel-feed ingest: stored {count} live entries");
    StatusCode::OK.into_response()
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
