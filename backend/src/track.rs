use axum::{
    body::Body,
    extract::{Query, State},
    http::{header, HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    Json,
};
use serde_json::Value;
use std::collections::HashMap;
use crate::AppState;

pub fn derive_source(utm_source: &str, referrer: &str) -> String {
    let u = utm_source.trim().to_lowercase();
    if !u.is_empty() {
        return match u.as_str() {
            "li" | "linkedin"                           => "linkedin",
            "tw" | "x" | "twitter"                     => "twitter",
            "fb" | "facebook" | "meta"                  => "facebook",
            "ig" | "instagram"                          => "instagram",
            "gh" | "github"                             => "github",
            "yt" | "youtube"                            => "youtube",
            "google" | "bing" | "duckduckgo" | "search" => "search",
            "newsletter" | "email" | "mail"             => "email",
            other                                       => return other.to_string(),
        }.to_string();
    }
    let r = referrer.trim().to_lowercase();
    if r.is_empty() { return "direct".into(); }
    let host = r.split("://").nth(1).unwrap_or(&r).split('/').next().unwrap_or("");
    let host = host.strip_prefix("www.").unwrap_or(host);
    if host.contains("linkedin") || host == "lnkd.in" { "linkedin" }
    else if host.contains("github")                    { "github" }
    else if host == "t.co" || host.contains("twitter") || host == "x.com" { "twitter" }
    else if host.contains("facebook") || host == "fb.com" { "facebook" }
    else if host.contains("instagram")                 { "instagram" }
    else if host.contains("youtu")                     { "youtube" }
    else if host.contains("google") || host.contains("bing") || host.contains("duckduckgo") || host.contains("ecosia") { "search" }
    else if host.is_empty()                            { "direct" }
    else                                               { "referral" }
    .to_string()
}

/// Funnel/section event name from the beacon's `section` field (Lighthouse round 66,
/// 2026-10-31): it was dropped, so every offer_click/offer_attempt/section scroll was stored
/// as one more page view of the current path and the funnel could not be read at all.
/// Empty = a real page view. Control characters out, 80 characters max.
/// Automated browsers run our JavaScript and fire the beacon like a visitor would (Lighthouse
/// round 68: 982 "views" of /evidence/supercell/ on 2026-10-27, no referrer, while Search brought
/// 7 clicks that day). Our own Playwright checks, PageSpeed and crawlers are not audience.
pub fn is_automated(user_agent: &str) -> bool {
    let ua = user_agent.to_lowercase();
    ["headlesschrome", "chrome-lighthouse", "playwright", "puppeteer", "phantomjs", "bot", "crawler", "spider", "slurp", "facebookexternalhit"]
        .iter().any(|m| ua.contains(m))
}

fn ua(headers: &HeaderMap) -> &str {
    headers.get(header::USER_AGENT).and_then(|h| h.to_str().ok()).unwrap_or("")
}

pub fn event_name(section: &str) -> String {
    section.chars().filter(|c| !c.is_control()).take(80).collect::<String>().trim().to_string()
}

async fn record(state: &AppState, path: &str, referrer: &str, utm_source: &str, utm_medium: &str, utm_campaign: &str, visitor: &str, event: &str) {
    let source = derive_source(utm_source, referrer);
    let _ = sqlx::query(
        "INSERT INTO web_visits (path,source,referrer,utm_source,utm_medium,utm_campaign,visitor,event) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)"
    )
    .bind(path).bind(&source).bind(referrer).bind(utm_source).bind(utm_medium).bind(utm_campaign).bind(visitor).bind(event)
    .execute(&state.db).await;
}

fn q<'a>(m: &'a HashMap<String, String>, k: &str) -> &'a str {
    m.get(k).map(|s| s.as_str()).unwrap_or("")
}

/// GET /api/track/pixel.gif — 1x1 transparent GIF beacon, no auth required.
pub async fn pixel(State(state): State<AppState>, headers: HeaderMap, Query(m): Query<HashMap<String, String>>) -> Response {
    if !is_automated(ua(&headers)) { record(&state, q(&m, "p"), q(&m, "r"), q(&m, "utm_source"), q(&m, "utm_medium"), q(&m, "utm_campaign"), q(&m, "v"), "").await; }
    const GIF: [u8; 43] = [
        0x47,0x49,0x46,0x38,0x39,0x61,0x01,0x00,0x01,0x00,0x80,0x00,0x00,0x00,0x00,0x00,
        0xff,0xff,0xff,0x21,0xf9,0x04,0x01,0x00,0x00,0x00,0x00,0x2c,0x00,0x00,0x00,0x00,
        0x01,0x00,0x01,0x00,0x00,0x02,0x02,0x44,0x01,0x00,0x3b,
    ];
    (
        [(header::CONTENT_TYPE, "image/gif"),
         (header::CACHE_CONTROL, "no-store, max-age=0"),
         (header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")],
        Body::from(GIF.to_vec()),
    ).into_response()
}

/// POST /api/track — JSON beacon (navigator.sendBeacon), CORS-open.
pub async fn beacon(State(state): State<AppState>, headers: HeaderMap, Json(b): Json<Value>) -> StatusCode {
    if is_automated(ua(&headers)) {
        return StatusCode::NO_CONTENT;
    }
    let g = |k: &str| b.get(k).and_then(|v| v.as_str()).unwrap_or("");
    record(&state, g("path"), g("referrer"), g("utm_source"), g("utm_medium"), g("utm_campaign"), g("visitor"), &event_name(g("section"))).await;
    StatusCode::NO_CONTENT
}

#[cfg(test)]
mod tests {
    use super::{event_name, is_automated};

    #[test]
    fn automated_browsers_are_not_audience() {
        assert!(is_automated("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/130.0.0.0 Safari/537.36"));
        assert!(is_automated("Mozilla/5.0 (Linux; Android 11) Chrome/120 Mobile Safari/537.36 Chrome-Lighthouse"));
        assert!(is_automated("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"));
        assert!(!is_automated("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"));
        assert!(!is_automated("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148"));
    }

    #[test]
    fn event_name_keeps_funnel_steps_and_strips_noise() {
        assert_eq!(event_name("offer_attempt:growth"), "offer_attempt:growth");
        assert_eq!(event_name(""), "");
        assert_eq!(event_name("  access \n"), "access");
        assert_eq!(event_name(&"x".repeat(200)).len(), 80);
    }
}
