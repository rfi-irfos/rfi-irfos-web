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
    let mut store = live_feed_store().lock().unwrap_or_else(|e| e.into_inner());
    // A fresh container (every deploy) starts empty; restore the last batch from the data
    // volume so the page is not blank until the relay's next run (19.11.2026).
    if store.is_empty() {
        if let Some(saved) = load_json::<Vec<FeedEntry>>(&data_file("worldmodel_feed.json")) { *store = saved; }
    }
    Json(store.clone())
}

// Same inbound-secret pattern as contact.rs/relay_to_crm use outbound: reuse
// LIGHTHOUSE_INBOX_KEY rather than mint a dedicated secret, since this app
// already has exactly one trusted server-to-server caller. Cap at 100
// entries - the relay only ever sends ~40, so anything past that is either a
// bug on the sending side or someone else entirely, not a batch to trust.
const MAX_FEED_ENTRIES: usize = 100;

pub async fn ingest_worldmodel_feed(headers: HeaderMap, Json(body): Json<Vec<FeedEntry>>) -> impl IntoResponse {
    if let Err(code) = inbox_authorized(&headers) { return code.into_response(); }
    if body.len() > MAX_FEED_ENTRIES {
        return (StatusCode::BAD_REQUEST, format!("at most {MAX_FEED_ENTRIES} entries per batch")).into_response();
    }

    let mut store = live_feed_store().lock().unwrap_or_else(|e| e.into_inner());
    let count = body.len();
    *store = body;
    let _ = save_json(&data_file("worldmodel_feed.json"), &*store);
    drop(store);

    tracing::info!("worldmodel-feed ingest: stored {count} live entries");
    StatusCode::OK.into_response()
}

/// Shared-secret check for the two relay endpoints (feed and stats).
fn inbox_authorized(headers: &HeaderMap) -> Result<(), StatusCode> {
    let expected = std::env::var("LIGHTHOUSE_INBOX_KEY").unwrap_or_default();
    if expected.is_empty() {
        tracing::error!("worldmodel ingest rejected: LIGHTHOUSE_INBOX_KEY not set on this app");
        return Err(StatusCode::SERVICE_UNAVAILABLE);
    }
    let provided = headers.get("x-inbox-key").and_then(|v| v.to_str().ok()).unwrap_or_default();
    if provided != expected { return Err(StatusCode::UNAUTHORIZED); }
    Ok(())
}

/// Files next to contacts.jsonl, i.e. on the persistent data volume (or the working directory in dev).
fn data_file(name: &str) -> std::path::PathBuf {
    let contacts = std::env::var("CONTACTS_PATH").unwrap_or_else(|_| "contacts.jsonl".into());
    std::path::Path::new(&contacts).parent().map(|p| p.join(name)).unwrap_or_else(|| name.into())
}

fn save_json<T: Serialize>(path: &std::path::Path, value: &T) -> std::io::Result<()> {
    let tmp = path.with_extension("json.tmp");
    std::fs::write(&tmp, serde_json::to_vec(value).map_err(std::io::Error::other)?)?;
    std::fs::rename(&tmp, path)
}

fn load_json<T: serde::de::DeserializeOwned>(path: &std::path::Path) -> Option<T> {
    serde_json::from_slice(&std::fs::read(path).ok()?).ok()
}

// ── Headline numbers (19.11.2026) ───────────────────────────────────────
//
// The World Model page used to carry its counts as fixed text ("as of 2026-10-26"), so it went
// stale after every bake. The relay now also reads the bake's consensus_snapshot.json and posts
// these four numbers; the page shows them with their real date and falls back to the fixed text
// only while none have arrived.
#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct WorldStats {
    pub nodes: u64,
    pub edges: u64,
    pub live_observations: u64,
    pub live_streams: u32,
    /// Day the bake measured these, YYYY-MM-DD.
    pub as_of: String,
}

const MAX_COUNT: u64 = 1_000_000_000_000;

fn validate_stats(s: &WorldStats) -> Result<(), &'static str> {
    if s.nodes == 0 || s.edges == 0 || s.live_observations == 0 { return Err("counts must be positive"); }
    if s.nodes > MAX_COUNT || s.edges > MAX_COUNT || s.live_observations > MAX_COUNT { return Err("count out of range"); }
    if s.as_of.len() != 10 || chrono::NaiveDate::parse_from_str(&s.as_of, "%Y-%m-%d").is_err() { return Err("as_of must be YYYY-MM-DD"); }
    Ok(())
}

fn save_stats(path: &std::path::Path, s: &WorldStats) -> std::io::Result<()> { save_json(path, s) }
fn load_stats(path: &std::path::Path) -> Option<WorldStats> { load_json(path) }

static WORLD_STATS: OnceLock<Mutex<Option<WorldStats>>> = OnceLock::new();

fn stats_store() -> &'static Mutex<Option<WorldStats>> { WORLD_STATS.get_or_init(|| Mutex::new(None)) }

/// GET /api/worldmodel-stats: the latest numbers, or null before the first relay run.
pub async fn worldmodel_stats() -> impl IntoResponse {
    let mut store = stats_store().lock().unwrap_or_else(|e| e.into_inner());
    if store.is_none() { *store = load_stats(&data_file("worldmodel_stats.json")); }
    Json(store.clone())
}

pub async fn ingest_worldmodel_stats(headers: HeaderMap, Json(body): Json<WorldStats>) -> impl IntoResponse {
    if let Err(code) = inbox_authorized(&headers) { return code.into_response(); }
    if let Err(why) = validate_stats(&body) { return (StatusCode::BAD_REQUEST, why).into_response(); }
    let _ = save_stats(&data_file("worldmodel_stats.json"), &body);
    tracing::info!("worldmodel-stats ingest: {} nodes, {} edges as of {}", body.nodes, body.edges, body.as_of);
    *stats_store().lock().unwrap_or_else(|e| e.into_inner()) = Some(body);
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
    let ip = crate::clientip::client_ip(&headers);

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

    let base = crate::lighthouse_base();

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

#[cfg(test)]
mod stats_tests {
    use super::*;

    fn good() -> WorldStats {
        WorldStats { nodes: 216_041, edges: 837_311, live_observations: 70_546_851, live_streams: 27, as_of: "2026-11-19".into() }
    }

    #[test]
    fn valid_stats_pass() {
        assert!(validate_stats(&good()).is_ok());
    }

    #[test]
    fn zero_counts_are_rejected() {
        for f in [|s: &mut WorldStats| s.nodes = 0, |s: &mut WorldStats| s.edges = 0, |s: &mut WorldStats| s.live_observations = 0] {
            let mut s = good();
            f(&mut s);
            assert!(validate_stats(&s).is_err());
        }
    }

    #[test]
    fn malformed_date_is_rejected() {
        for d in ["", "19.11.2026", "2026-13-40", "2026-11-19T10:00:00Z", "<b>x</b>"] {
            let mut s = good();
            s.as_of = d.into();
            assert!(validate_stats(&s).is_err(), "{d}");
        }
    }

    #[test]
    fn absurd_counts_are_rejected() {
        let mut s = good();
        s.live_observations = 10_000_000_000_000;
        assert!(validate_stats(&s).is_err());
    }

    #[test]
    fn stats_survive_a_restart_through_the_file() {
        let dir = std::env::temp_dir().join(format!("wm-stats-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("worldmodel_stats.json");
        save_stats(&path, &good()).unwrap();
        assert_eq!(load_stats(&path), Some(good()));
        assert_eq!(load_stats(&dir.join("missing.json")), None);
        let _ = std::fs::remove_dir_all(&dir);
    }
}
