//! Google Ads offline conversions without cookies (2026-11-21, Simeon).
//!
//! The frontend keeps the Google Ads click id (gclid) in memory only and sends it
//! with the contact form, the Quick Check and the Stripe checkout. Each completed
//! conversion with a click id becomes one line in `ad_conversions.jsonl` next to
//! `contacts.jsonl`; `scripts/ads-conversions-csv.sh` turns that file into Google's
//! offline import CSV. No email, name or IP is written here, only the click id, the
//! conversion name, the time and the value.

use serde::Serialize;

/// Lead conversions as they are named in Google Ads (Conversion Name column).
pub const LEAD_CONTACT: &str = "Kontaktanfrage";
pub const LEAD_QUICK_CHECK: &str = "Quick Check";
pub const PURCHASE: &str = "Kauf";

/// Accept only the character set Google uses; anything else is dropped, never stored.
pub fn clean(id: Option<&str>) -> Option<String> {
    let id = id?.trim();
    let ok = (10..=200).contains(&id.len())
        && id.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'_' || b == b'-');
    ok.then(|| id.to_string())
}

#[derive(Serialize)]
struct Conversion<'a> {
    click_id: &'a str,
    conversion: &'a str,
    time: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    value: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    currency: Option<String>,
}

fn path() -> std::path::PathBuf {
    if let Ok(p) = std::env::var("AD_CONVERSIONS_PATH") {
        return p.into();
    }
    // Same directory as contacts.jsonl (/data on the server), so it lands on the volume.
    let contacts = std::path::PathBuf::from(
        std::env::var("CONTACTS_PATH").unwrap_or_else(|_| "contacts.jsonl".into()),
    );
    contacts.with_file_name("ad_conversions.jsonl")
}

/// Google accepts clicks up to 90 days old; older lines are deleted (privacy policy).
const KEEP_DAYS: i64 = 90;

/// Keep only lines younger than `KEEP_DAYS`, then add the new one.
fn prune_and_append(existing: &str, line: &str, now: chrono::DateTime<chrono::Utc>) -> String {
    let cutoff = now - chrono::Duration::days(KEEP_DAYS);
    let mut out = String::new();
    for l in existing.lines().filter(|l| !l.trim().is_empty()) {
        let keep = serde_json::from_str::<serde_json::Value>(l).ok()
            .and_then(|v| v["time"].as_str().and_then(|t| chrono::DateTime::parse_from_rfc3339(t).ok()))
            .is_some_and(|t| t > cutoff);
        if keep { out.push_str(l); out.push('\n'); }
    }
    out.push_str(line);
    out.push('\n');
    out
}

static WRITE_LOCK: tokio::sync::Mutex<()> = tokio::sync::Mutex::const_new(());

/// Record one conversion. Failures are logged and never affect the visitor's response.
pub async fn record(click_id: Option<&str>, conversion: &str, value_cents: Option<u64>, currency: Option<&str>) {
    let Some(id) = clean(click_id) else { return };
    let now = chrono::Utc::now();
    let entry = Conversion {
        click_id: &id,
        conversion,
        time: now.to_rfc3339(),
        value: value_cents.map(|c| c as f64 / 100.0),
        currency: currency.map(|c| c.to_uppercase()),
    };
    let Ok(line) = serde_json::to_string(&entry) else { return };
    let _guard = WRITE_LOCK.lock().await;
    let path = path();
    let existing = tokio::fs::read_to_string(&path).await.unwrap_or_default();
    let body = prune_and_append(&existing, &line, now);
    // Write a sibling file and rename, so a crash never leaves a half-written file.
    let tmp = path.with_extension("jsonl.tmp");
    if let Err(e) = tokio::fs::write(&tmp, body).await {
        tracing::error!("ad conversion write failed: {e}");
        return;
    }
    if let Err(e) = tokio::fs::rename(&tmp, &path).await {
        tracing::error!("ad conversion rename failed: {e}");
    }
}

#[cfg(test)]
mod tests {
    use super::{clean, prune_and_append};

    #[test]
    fn clean_accepts_google_ids_and_drops_junk() {
        assert_eq!(clean(Some("Cj0KCQiA_abc-123XYZ")).as_deref(), Some("Cj0KCQiA_abc-123XYZ"));
        assert_eq!(clean(Some("  Cj0KCQiA_abc-123XYZ ")).as_deref(), Some("Cj0KCQiA_abc-123XYZ"));
        assert_eq!(clean(None), None);
        assert_eq!(clean(Some("short")), None);
        assert_eq!(clean(Some("Cj0KCQiA<script>alert(1)</script>")), None);
        assert_eq!(clean(Some("a@b.com,Kauf,2026")), None);
        assert_eq!(clean(Some(&"x".repeat(201))), None);
    }

    #[test]
    fn prune_drops_lines_older_than_90_days() {
        let now = chrono::DateTime::parse_from_rfc3339("2026-11-21T12:00:00Z").unwrap().with_timezone(&chrono::Utc);
        let old = r#"{"click_id":"Cj0KCQiA_old000","conversion":"Kauf","time":"2026-08-01T00:00:00+00:00"}"#;
        let fresh = r#"{"click_id":"Cj0KCQiA_new000","conversion":"Kauf","time":"2026-11-01T00:00:00+00:00"}"#;
        let out = prune_and_append(&format!("{old}\n{fresh}\nnot json\n"), "NEW", now);
        assert_eq!(out, format!("{fresh}\nNEW\n"));
    }
}
