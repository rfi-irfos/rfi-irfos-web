/// Shared Web3Forms email delivery, used by both `contact.rs` and `review.rs`.
///
/// Read server-side at runtime, NOT as a Vite build-time constant. The frontend
/// still has its own client-side Web3Forms fallback (PublicSite.tsx, Squad.tsx)
/// gated on `VITE_WEB3FORMS_KEY`, but that only works if the key was passed as a
/// build-arg to the frontend build — the Dockerfile moved the frontend build
/// outside Docker on 2026-09-26, and nothing in that local `npm run build` step
/// sets the var, so the client-side path has been silently dead ever since.
/// Reading the same already-deployed Fly secret as a plain runtime env var here
/// is the one path that has ever actually delivered mail for this codebase (see
/// the 2026-09-11 contact-form fix, which did this for `contact.rs` before it
/// was lost in a later refactor).
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
