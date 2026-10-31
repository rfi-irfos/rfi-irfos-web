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

/// ntfy topic for contact and free-check alerts. ntfy.sh topics are open to anyone who knows the
/// name, and the old hardcoded name sat in this public repo, so every alert (domain, email,
/// message) was readable by any subscriber (Lighthouse round 43, 2026-10-31). The name now comes
/// from the CONTACT_NTFY_TOPIC secret; the old name stays only as a fallback until it is set.
pub fn contact_ntfy_url() -> String {
    let topic = std::env::var("CONTACT_NTFY_TOPIC").unwrap_or_default();
    let topic = if topic.trim().is_empty() { "rfi-irfos-web-contact".to_string() } else { topic.trim().to_string() };
    format!("https://ntfy.sh/{topic}")
}

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

fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;")
}

/// Subject, HTML and plain text of the free-check confirmation (2026-10-31).
pub fn confirmation_mail(domain: &str, de: bool) -> (String, String, String) {
    let (subject, lines, access, cta) = if de {
        (
            format!("Ihr Gratis-Check für {domain} ist eingegangen"),
            [
                format!("danke, Ihre Anfrage für {domain} ist bei uns eingegangen."),
                "Ein Researcher prüft sie und meldet sich innerhalb eines Werktags mit dem nächsten Schritt.".to_string(),
                "Falls jemand anderer diese Adresse eingetragen hat, ignorieren Sie diese Mail einfach.".to_string(),
            ],
            "https://rfi-irfos.com/de/access/",
            "Pakete und Preise ansehen",
        )
    } else {
        (
            format!("Your free check for {domain} has arrived"),
            [
                format!("thank you, your request for {domain} has reached us."),
                "A researcher reviews it and replies within one working day with the next step.".to_string(),
                "If someone else entered this address, simply ignore this mail.".to_string(),
            ],
            "https://rfi-irfos.com/access/",
            "See packages and pricing",
        )
    };
    let hello = if de { "Hallo," } else { "Hello," };
    let sign = if de { "Schöne Grüße aus Graz,<br>RFI-IRFOS" } else { "With appreciation,<br>RFI-IRFOS" };
    let paras: String = lines.iter()
        .map(|l| format!("<p style=\"margin:0 0 14px\">{}</p>", html_escape(l)))
        .collect();
    let html = format!(
        "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tr><td align=\"center\" style=\"padding:24px\">\
<table role=\"presentation\" width=\"560\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:560px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#111\"><tr><td>\
<p style=\"margin:0 0 14px;font-family:monospace;font-size:12px\">RFI-IRFOS · GRAZ, AUSTRIA</p>\
<p style=\"margin:0 0 14px\">{hello}</p>{paras}\
<p style=\"margin:20px 0\"><a href=\"{access}\" style=\"background:#f97316;color:#1a0f00;padding:11px 18px;border-radius:8px;font-weight:700;text-decoration:none\">{cta}</a></p>\
<p style=\"margin:0\">{sign}</p></td></tr></table></td></tr></table>"
    );
    let text = format!("{hello}\n\n{}\n\n{cta}: {access}\n\n{}", lines.join("\n\n"), sign.replace("<br>", "\n"));
    (subject, html, text)
}

/// Sends the confirmation through Brevo's transactional API. Errors are only
/// logged: the request is already saved and ntfy already fired.
pub async fn brevo_confirmation(key: &str, domain: &str, email: &str, de: bool) {
    if cfg!(test) { return; }
    let (subject, html, text) = confirmation_mail(domain, de);
    let Ok(client) = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(8))
        .build()
    else { return };
    let res = client
        .post("https://api.brevo.com/v3/smtp/email")
        .header("api-key", key)
        .json(&serde_json::json!({
            // domain-check@ (ImprovMX alias, Simeon 2026-10-31): matches the form the visitor
            // just used; security@ stays the disclosure inbox from security.txt.
            "sender": { "name": "RFI-IRFOS Domain Check", "email": "domain-check@rfi-irfos.com" },
            "replyTo": { "email": "domain-check@rfi-irfos.com" },
            "to": [{ "email": email }],
            "subject": subject,
            "htmlContent": html,
            "textContent": text,
            "tags": ["free-check-confirmation"],
        }))
        .send()
        .await;
    match res {
        Ok(r) if r.status().is_success() => tracing::info!("free-check confirmation sent for {domain}"),
        Ok(r) => tracing::error!("brevo_confirmation: status {}", r.status()),
        Err(e) => tracing::error!("brevo_confirmation request failed: {e}"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn confirmation_mail_matches_locale_and_escapes_domain() {
        let (s, html, text) = confirmation_mail("a<b>.com", true);
        assert!(s.contains("Gratis-Check"));
        assert!(html.contains("/de/access/") && html.contains("a&lt;b&gt;.com"));
        assert!(!html.contains("a<b>"));
        assert!(text.contains("Werktags"));
        let (s, html, _) = confirmation_mail("example.org", false);
        assert!(s.starts_with("Your free check"));
        assert!(html.contains("https://rfi-irfos.com/access/"));
    }
}
