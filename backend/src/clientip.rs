//! Visitor IP, one place for every handler.
//!
//! Which header carries the real address depends on the proxy in front of the app: Fly sets
//! `fly-client-ip`, the Graz setup lets Caddy overwrite `x-rfi-client-ip` from `Cf-Connecting-IP`.
//! `CLIENT_IP_HEADER` names that one header. Nothing else is trusted for decisions that can hurt a
//! third party (bans), because a client can send any other header itself.
use axum::http::HeaderMap;
use std::net::IpAddr;
use std::sync::OnceLock;

fn configured_header() -> &'static str {
    static NAME: OnceLock<String> = OnceLock::new();
    NAME.get_or_init(|| std::env::var("CLIENT_IP_HEADER").ok().map(|v| v.trim().to_ascii_lowercase()).filter(|v| !v.is_empty()).unwrap_or_else(|| "fly-client-ip".into()))
}

fn first_entry(value: &str) -> &str {
    value.split(',').next().unwrap_or("").trim()
}

/// Strict: only the configured header, and only a valid IP. Empty string otherwise.
pub fn trusted_ip_with(headers: &HeaderMap, header: &str) -> String {
    let v = headers.get(header).and_then(|h| h.to_str().ok()).map(first_entry).unwrap_or("");
    if v.parse::<IpAddr>().is_ok() { v.to_string() } else { String::new() }
}

/// Lax: the configured header first, then `x-forwarded-for`, else "unknown". For rate limits only.
pub fn client_ip_with(headers: &HeaderMap, header: &str) -> String {
    let strict = trusted_ip_with(headers, header);
    if !strict.is_empty() {
        return strict;
    }
    let v = headers.get("x-forwarded-for").and_then(|h| h.to_str().ok()).map(first_entry).unwrap_or("");
    if v.is_empty() { "unknown".into() } else { v.to_string() }
}

pub fn trusted_ip(headers: &HeaderMap) -> String {
    trusted_ip_with(headers, configured_header())
}

pub fn client_ip(headers: &HeaderMap) -> String {
    client_ip_with(headers, configured_header())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn h(pairs: &[(&'static str, &'static str)]) -> HeaderMap {
        let mut m = HeaderMap::new();
        for (k, v) in pairs {
            m.insert(*k, v.parse().unwrap());
        }
        m
    }

    #[test]
    fn strict_reads_only_the_configured_header() {
        let m = h(&[("x-rfi-client-ip", "203.0.113.7"), ("fly-client-ip", "198.51.100.9"), ("x-forwarded-for", "192.0.2.1")]);
        assert_eq!(trusted_ip_with(&m, "x-rfi-client-ip"), "203.0.113.7");
        assert_eq!(trusted_ip_with(&m, "fly-client-ip"), "198.51.100.9");
    }

    #[test]
    fn strict_ignores_a_forged_header_when_another_one_is_configured() {
        // on Fly a client can send x-rfi-client-ip itself; Fly config trusts fly-client-ip only
        let m = h(&[("x-rfi-client-ip", "10.9.9.9")]);
        assert_eq!(trusted_ip_with(&m, "fly-client-ip"), "");
    }

    #[test]
    fn strict_rejects_junk_and_takes_first_of_a_list() {
        assert_eq!(trusted_ip_with(&h(&[("x-rfi-client-ip", "not-an-ip")]), "x-rfi-client-ip"), "");
        assert_eq!(trusted_ip_with(&h(&[("x-rfi-client-ip", "203.0.113.7, 10.0.0.1")]), "x-rfi-client-ip"), "203.0.113.7");
        assert_eq!(trusted_ip_with(&h(&[("x-rfi-client-ip", "2001:db8::1")]), "x-rfi-client-ip"), "2001:db8::1");
    }

    #[test]
    fn lax_falls_back_to_forwarded_for_then_unknown() {
        assert_eq!(client_ip_with(&h(&[("x-forwarded-for", "192.0.2.1, 10.0.0.1")]), "x-rfi-client-ip"), "192.0.2.1");
        assert_eq!(client_ip_with(&HeaderMap::new(), "x-rfi-client-ip"), "unknown");
        assert_eq!(client_ip_with(&h(&[("x-rfi-client-ip", "203.0.113.7"), ("x-forwarded-for", "192.0.2.1")]), "x-rfi-client-ip"), "203.0.113.7");
    }
}
