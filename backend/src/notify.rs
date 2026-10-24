/// Shared Web3Forms email delivery, used by `review.rs`.
///
/// Verified broken 2026-10-24 by replaying this exact request shape directly
/// against api.web3forms.com: it returns 403 "This method is not allowed...
/// Pro plan is required" for ANY server-to-server POST, every time, key valid
/// or not. The doc comment this replaces claimed the opposite - that reading
/// `VITE_WEB3FORMS_KEY` as a runtime secret here (rather than a Vite build-time
/// constant) was "the one path that has ever actually delivered mail for this
/// codebase". It never delivered one; the 403 was only ever visible as a
/// tracing::error! with no alerting, so the gap went unnoticed for six weeks
/// (see review.rs's own 2026-10-14 bug report in `notify_new_request`, and
/// contact.rs's near-identical one on 2026-10-24 - this function's call sites
/// were never actually sending mail either time, CRM/local-write success
/// masked it both times). contact.rs no longer calls this; it pings ntfy
/// directly instead, which is the one delivery path actually proven to reach
/// a human. review.rs still calls it below - harmless no-op, not yet removed.
/// Real server-side email delivery needs a provider that allows it (Web3Forms
/// Pro, or a transactional provider like Resend/Mailgun/SES) - unresolved.
/// The frontend's OWN client-side Web3Forms fallback (PublicSite.tsx,
/// Squad.tsx) is a different, real path - browser-origin calls are not
/// rejected the way server-to-server ones are - gated on `VITE_WEB3FORMS_KEY`
/// reaching the Vite build; see scripts/ship.sh for why that needed fixing
/// separately (the frontend build runs outside Docker, build-args don't apply).
pub async fn web3forms_email(subject: &str, name: &str, email: &str, message: &str) {
    let Ok(key) = std::env::var("VITE_WEB3FORMS_KEY") else { return };
    if key.is_empty() {
        tracing::warn!("web3forms_email skipped: VITE_WEB3FORMS_KEY not set on this app");
        return;
    }
    let Ok(client) = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()
    else { return };
    let res = client
        .post("https://api.web3forms.com/submit")
        .json(&serde_json::json!({
            "access_key": key,
            "subject": subject,
            "name": name,
            "email": email,
            "replyto": email,
            "message": message,
        }))
        .send()
        .await;
    match res {
        Ok(r) if r.status().is_success() => {}
        Ok(r) => tracing::error!("web3forms_email: non-success status {}", r.status()),
        Err(e) => tracing::error!("web3forms_email request failed: {e}"),
    }
}
