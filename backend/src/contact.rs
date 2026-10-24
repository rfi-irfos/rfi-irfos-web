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

    // ntfy ping on every submission, unconditionally - not just on CRM failure
    // (notify_crm_failure below). Live bug report 2026-10-24: a self-sent test
    // through this exact form showed the green "Received" state and produced
    // zero email. Root-caused by replaying the server-side Web3Forms call this
    // function used to make below: Web3Forms' free tier returns 403 "This
    // method is not allowed ... Pro plan is required" for ANY server-to-server
    // POST, unconditionally - the 2026-09-11 fix this comment used to describe
    // as "restored" never actually delivered a single email, it just silently
    // logged a tracing::error! with no alerting, so the gap went unnoticed for
    // six weeks. This is the exact same failure review.rs hit on 2026-10-14
    // ("ich hab ne ntfy bekommen, aber keine email") - mirroring that fix here:
    // ntfy is the one delivery path actually proven to reach a human. Real
    // email delivery needs a provider that allows server-side sends (Web3Forms
    // Pro, or a transactional provider like Resend/Mailgun/SES) - a service/
    // cost decision for Simeon, not something to pick unilaterally.
    if !cfg!(test) {
        if let Ok(client) = reqwest::Client::builder().timeout(std::time::Duration::from_secs(5)).build() {
            let _ = client
                .post("https://ntfy.sh/rfi-irfos-web-contact")
                .header("Title", "New contact form submission")
                .body(format!(
                    "{} <{}>{}\n\n{}",
                    entry.name, entry.email,
                    if entry.phone.is_empty() { String::new() } else { format!(" — {}", entry.phone) },
                    entry.message,
                ))
                .send()
                .await;
        }
    }

    // Relay the lead into the Lighthouse CRM - best-effort, not on the
    // response path. Live decision 2026-10-24 (Zabih is actively bugfixing
    // Lighthouse right now, so the CRM is a known-unreliable dependency this
    // endpoint should not block on): matches the pattern review.rs already
    // uses for domain-check submissions - durable local write + ntfy above,
    // always 200 once those two land, CRM relay attempted afterward and
    // logged/alerted on failure but never the reason a real visitor sees an
    // error. The submission is never lost either way: contacts.jsonl above is
    // the durable record, and Lighthouse's own lead count catches up the next
    // time this succeeds or someone backfills it from that file.
    tokio::spawn(async move {
        if let Err(e) = relay_to_crm(&entry).await {
            tracing::error!("Contact relay to CRM failed for {}: {e}", entry.email);
            notify_crm_failure(&entry, &e).await;
        } else {
            tracing::info!("Contact from {} ({}) relayed to CRM", entry.name, entry.email);
        }
    });
    StatusCode::OK.into_response()
}

async fn notify_crm_failure(entry: &ContactEntry, err: &str) {
    let Ok(client) = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()
    else { return };
    let body = format!(
        "rfi-irfos.com contact form: CRM relay failed for {} <{}> ({err}). The visitor's \
         browser still tries a direct Web3Forms send, but that lead won't show up in \
         Lighthouse's count. Backup copy: contacts.jsonl on the web machine's local \
         (unmounted) disk - check it before the machine restarts.",
        entry.name, entry.email,
    );
    let _ = client
        .post("https://ntfy.sh/rfi-irfos-web-contact")
        .header("Title", "Contact form CRM relay failed")
        .header("Priority", "urgent")
        .body(body)
        .send()
        .await;
}

async fn relay_to_crm(entry: &ContactEntry) -> Result<(), String> {
    // Lighthouse's own signup() checks LIGHTHOUSE_SIGNUP_KEY first, falling back to
    // LIGHTHOUSE_INBOX_KEY - mirror that order here. A stale/mismatched
    // LIGHTHOUSE_INBOX_KEY (401 as of 2026-09-11) is why this reads SIGNUP_KEY first:
    // a dedicated key set on both sides can't collide with whatever INBOX_KEY is doing
    // for the unrelated Gmail-push webhook.
    let key = std::env::var("LIGHTHOUSE_SIGNUP_KEY")
        .or_else(|_| std::env::var("LIGHTHOUSE_INBOX_KEY"))
        .unwrap_or_default();
    if key.is_empty() {
        return Err("neither LIGHTHOUSE_SIGNUP_KEY nor LIGHTHOUSE_INBOX_KEY set on this app".into());
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
