/// Lead notifications for rfi-irfos.com: ntfy push, urgent alerts, the visitor's confirmation and
/// the internal lead mail, all server side. The old server-side Web3Forms call is gone: the free
/// tier answers 403 to every server-to-server POST (verified 2026-10-24), it never delivered a mail.
/// The browser-side Web3Forms call in the frontend stays as an extra path.

/// ntfy topic for contact and free-check alerts. ntfy.sh topics are open to anyone who knows the
/// name, and the old hardcoded name sat in this public repo, so every alert (domain, email,
/// message) was readable by any subscriber (Lighthouse round 43, 2026-10-31). The name now comes
/// from the CONTACT_NTFY_TOPIC secret; the old name stays only as a fallback until it is set.
pub fn contact_ntfy_url() -> String {
    let topic = std::env::var("CONTACT_NTFY_TOPIC").unwrap_or_default();
    let topic = if topic.trim().is_empty() { "rfi-irfos-web-contact".to_string() } else { topic.trim().to_string() };
    format!("https://ntfy.sh/{topic}")
}

/// Urgent alert to the contact channel and the Lighthouse alarm channel (14.11.2026): a lead
/// that misses the CRM must never be visible only in one channel someone may have just cleared.
/// JSON publish, because ntfy headers cannot carry UTF-8.
pub async fn alert_urgent(title: &str, message: &str) {
    if cfg!(test) { return; }
    let Ok(client) = reqwest::Client::builder().timeout(std::time::Duration::from_secs(5)).build() else { return };
    let contact_topic = contact_ntfy_url().rsplit('/').next().unwrap_or_default().to_string();
    for topic in [contact_topic.as_str(), "lighthouse-rfi-irfos"] {
        let _ = client.post("https://ntfy.sh/")
            .json(&serde_json::json!({ "topic": topic, "title": format!("⚠ {title}"), "message": message, "priority": 5 }))
            .send().await;
    }
}

/// Internal lead mail through Brevo (Simeon 14.11.2026: "das muss klappen"). Every Quick Check
/// and every contact or Squad request lands in our inbox, server side, independent of the
/// browser. Recipients come from INTERNAL_NOTIFY_EMAIL (comma separated, a Fly secret, so no
/// private address sits in this public repo); fallback is the domain-check@ alias.
/// Reply-To is the visitor, so answering the mail reaches them directly. Two tries; when both
/// fail, an urgent ntfy alert names the lead, so a dead mail path is noticed within minutes.
/// Runs in the background: a slow Brevo never delays the visitor's response.
pub fn lead_mail(key: &str, subject: String, text: String, reply_to: &str) {
    if cfg!(test) { return; }
    let (key, reply_to) = (key.to_string(), reply_to.to_string());
    tokio::spawn(async move { lead_mail_now(&key, &subject, &text, &reply_to).await });
}

async fn lead_mail_now(key: &str, subject: &str, text: &str, reply_to: &str) {
    if key.is_empty() {
        alert_urgent("Lead mail not sent", &format!("BREVO_API_KEY missing on the web app. {subject}\n\n{text}")).await;
        return;
    }
    let mut last = String::new();
    for attempt in 0..2 {
        if attempt > 0 { tokio::time::sleep(std::time::Duration::from_secs(3)).await; }
        match brevo_internal(key, subject, text, reply_to).await {
            Ok(()) => { tracing::info!("lead mail sent: {subject}"); return; }
            Err(e) => { tracing::error!("lead mail attempt {} failed: {e}", attempt + 1); last = e; }
        }
    }
    alert_urgent("Lead mail failed", &format!("{subject}: {last}\n\n{text}")).await;
}

fn internal_recipients() -> Vec<serde_json::Value> {
    let raw = std::env::var("INTERNAL_NOTIFY_EMAIL").unwrap_or_default();
    let list: Vec<_> = raw.split(',').map(str::trim).filter(|a| a.contains('@'))
        .map(|a| serde_json::json!({ "email": a })).collect();
    if list.is_empty() { vec![serde_json::json!({ "email": "domain-check@rfi-irfos.com" })] } else { list }
}

async fn brevo_internal(key: &str, subject: &str, text: &str, reply_to: &str) -> Result<(), String> {
    let client = reqwest::Client::builder().timeout(std::time::Duration::from_secs(10)).build()
        .map_err(|e| e.to_string())?;
    let html = format!("<pre style=\"font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap\">{}</pre>", html_escape(text));
    let mut body = serde_json::json!({
        "sender": { "name": "rfi-irfos.com Lead", "email": "domain-check@rfi-irfos.com" },
        "to": internal_recipients(),
        "subject": subject,
        "htmlContent": html,
        "textContent": text,
        "tags": ["lead-internal"],
    });
    if reply_to.contains('@') { body["replyTo"] = serde_json::json!({ "email": reply_to }); }
    let r = client.post("https://api.brevo.com/v3/smtp/email").header("api-key", key)
        .json(&body).send().await.map_err(|e| e.to_string())?;
    if r.status().is_success() { Ok(()) } else { Err(format!("Brevo returned {}", r.status())) }
}

fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;").replace('"', "&quot;")
}

/// Subject, HTML and plain text of the free-check confirmation (2026-10-31).
pub fn confirmation_mail(domain: &str, de: bool) -> (String, String, String) {
    let (subject, lines, access, cta) = if de {
        (
            format!("Ihr Quick Check für {domain} ist eingegangen"),
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
            format!("Your Quick Check for {domain} has arrived"),
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
        assert!(s.contains("Quick Check"));
        assert!(html.contains("/de/access/") && html.contains("a&lt;b&gt;.com"));
        assert!(!html.contains("a<b>"));
        assert!(text.contains("Werktags"));
        let (s, html, _) = confirmation_mail("example.org", false);
        assert!(s.starts_with("Your Quick Check"));
        assert!(html.contains("https://rfi-irfos.com/access/"));
    }
}
