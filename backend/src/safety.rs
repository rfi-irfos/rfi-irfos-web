//! Passive website safety check ("Beliebige Website" tab of the Domain-Sicherheitstest).
//!
//! Only public, unauthenticated information is read: DNS records, the TLS
//! handshake, the response headers of `GET /` and a plain `GET http://host/`.
//! No payloads, no paths beyond `/`, no login, nothing is stored or logged
//! per target. Four areas, one request each, so the page can resolve every
//! row as soon as its own answer arrives.
//!
//! SSRF guard: the target is resolved by us, every address must be public,
//! the connection is pinned to that address (no second lookup, so DNS
//! rebinding has no window) and redirects are followed by hand, each hop
//! re-validated.

use axum::{http::{HeaderMap, StatusCode}, response::{IntoResponse, Response}, Json};
use hickory_resolver::{
    config::{ResolverConfig, ResolverOpts},
    error::ResolveErrorKind,
    proto::rr::RecordType,
    TokioAsyncResolver,
};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    net::{IpAddr, Ipv4Addr, SocketAddr},
    sync::{Arc, Mutex, OnceLock},
    time::{Duration, Instant},
};
use tokio::{net::TcpStream, sync::Semaphore, time::timeout};

// ───────────────────────── result model ─────────────────────────

#[derive(Serialize, Clone, Copy, PartialEq, Eq, Debug)]
#[serde(rename_all = "lowercase")]
pub enum St {
    Ok,
    Warn,
    Bad,
    /// Observation without a verdict (not scored).
    Info,
}

#[derive(Serialize, Clone, Debug)]
pub struct Check {
    pub state: St,
    pub code: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<String>,
}

fn chk(state: St, code: &'static str) -> Check {
    Check { state, code, value: None }
}
fn chk_v(state: St, code: &'static str, value: impl ToString) -> Check {
    Check { state, code, value: Some(value.to_string()) }
}

#[derive(Serialize, Debug)]
pub struct AreaResult {
    pub area: &'static str,
    pub state: St,
    /// 0..=100, absent when nothing in the area could be scored.
    pub score: Option<u32>,
    pub checks: Vec<Check>,
}

pub fn area_result(area: &'static str, checks: Vec<Check>) -> AreaResult {
    let scored: Vec<&Check> = checks.iter().filter(|c| c.state != St::Info).collect();
    let state = if scored.iter().any(|c| c.state == St::Bad) {
        St::Bad
    } else if scored.iter().any(|c| c.state == St::Warn) {
        St::Warn
    } else if scored.is_empty() {
        St::Info
    } else {
        St::Ok
    };
    let score = if scored.is_empty() {
        None
    } else {
        let sum: f64 = scored.iter().map(|c| match c.state { St::Ok => 1.0, St::Warn => 0.5, _ => 0.0 }).sum();
        Some((sum / scored.len() as f64 * 100.0).round() as u32)
    };
    AreaResult { area, state, score, checks }
}

// ───────────────────────── host validation + SSRF guard ─────────────────────────

#[derive(Debug, PartialEq, Eq)]
pub enum HostError {
    Invalid,
    /// Resolves to (or is) a non-public address.
    Blocked,
    NotFound,
}

const BLOCKED_SUFFIXES: [&str; 12] = [
    "local", "localhost", "internal", "lan", "home", "corp", "intranet", "test", "invalid", "example", "onion", "arpa",
];

/// Strict hostname from user input. Accepts a pasted URL (scheme, path, query,
/// port are dropped); rejects IP literals, userinfo, unicode and internal names.
pub fn parse_host(input: &str) -> Result<String, HostError> {
    let s = input.trim();
    let s = s.strip_prefix("https://").or_else(|| s.strip_prefix("http://")).unwrap_or(s);
    if s.contains('@') || s.contains('[') || s.contains('\\') || s.chars().any(|c| c.is_whitespace()) {
        return Err(HostError::Invalid);
    }
    let s = s.split(['/', '?', '#']).next().unwrap_or("");
    let s = s.split(':').next().unwrap_or("");
    let host = s.trim_end_matches('.').to_ascii_lowercase();
    if host.is_empty() || host.len() > 253 || !host.is_ascii() || host.parse::<IpAddr>().is_ok() {
        return Err(HostError::Invalid);
    }
    let labels: Vec<&str> = host.split('.').collect();
    if labels.len() < 2 {
        return Err(HostError::Invalid);
    }
    for l in &labels {
        let ok = !l.is_empty()
            && l.len() <= 63
            && !l.starts_with('-')
            && !l.ends_with('-')
            && l.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-');
        if !ok {
            return Err(HostError::Invalid);
        }
    }
    let tld = labels[labels.len() - 1];
    if !(tld.starts_with("xn--") || (tld.len() >= 2 && tld.bytes().all(|b| b.is_ascii_alphabetic()))) {
        return Err(HostError::Invalid);
    }
    if BLOCKED_SUFFIXES.contains(&tld) {
        return Err(HostError::Blocked);
    }
    Ok(host)
}

fn v4_public(ip: Ipv4Addr) -> bool {
    let o = ip.octets();
    !(ip.is_unspecified()
        || ip.is_loopback()
        || ip.is_private()
        || ip.is_link_local()
        || ip.is_broadcast()
        || ip.is_multicast()
        || ip.is_documentation()
        || o[0] == 0
        || (o[0] == 100 && (o[1] & 0b1100_0000) == 64) // 100.64.0.0/10 carrier-grade NAT
        || (o[0] == 192 && o[1] == 0 && o[2] == 0) // 192.0.0.0/24 IETF protocol
        || (o[0] == 198 && (o[1] == 18 || o[1] == 19)) // 198.18.0.0/15 benchmarking
        || o[0] >= 240) // reserved + broadcast
}

pub fn is_public_ip(ip: IpAddr) -> bool {
    match ip {
        IpAddr::V4(v4) => v4_public(v4),
        IpAddr::V6(v6) => {
            if let Some(v4) = v6.to_ipv4_mapped() {
                return v4_public(v4);
            }
            let s = v6.segments();
            if v6.is_unspecified() || v6.is_loopback() || v6.is_multicast() {
                return false;
            }
            if (s[0] & 0xfe00) == 0xfc00 || (s[0] & 0xffc0) == 0xfe80 {
                return false; // unique local, link local
            }
            if s[0] == 0x2001 && s[1] == 0x0db8 {
                return false; // documentation
            }
            if s[0] == 0x0064 && s[1] == 0xff9b {
                // NAT64: judge the embedded IPv4 address
                let v4 = Ipv4Addr::new((s[6] >> 8) as u8, s[6] as u8, (s[7] >> 8) as u8, s[7] as u8);
                return v4_public(v4);
            }
            if s[0] == 0x2002 {
                // 6to4: judge the embedded IPv4 address
                let v4 = Ipv4Addr::new((s[1] >> 8) as u8, s[1] as u8, (s[2] >> 8) as u8, s[2] as u8);
                return v4_public(v4);
            }
            true
        }
    }
}

// ───────────────────────── rate limits (in memory, resets on restart) ─────────────────────────

struct Windows(Mutex<HashMap<String, Vec<Instant>>>);

impl Windows {
    fn new() -> Self {
        Windows(Mutex::new(HashMap::new()))
    }
    /// true when the key is over its limit; otherwise records the hit.
    fn limited(&self, key: &str, max: usize, window: Duration) -> bool {
        let now = Instant::now();
        let mut map = self.0.lock().unwrap_or_else(|e| e.into_inner());
        if map.len() > 20_000 {
            map.retain(|_, v| v.iter().any(|t| now.duration_since(*t) < window));
        }
        let ts = map.entry(key.to_string()).or_default();
        ts.retain(|t| now.duration_since(*t) < window);
        if ts.len() >= max {
            return true;
        }
        ts.push(now);
        false
    }
}

static PER_IP_MINUTE: OnceLock<Windows> = OnceLock::new();
static PER_IP_DAY: OnceLock<Windows> = OnceLock::new();
static PER_TARGET: OnceLock<Windows> = OnceLock::new();
static SLOTS: OnceLock<Arc<Semaphore>> = OnceLock::new();

// 4 areas per scan: 24 per minute is six scans, 160 per day is forty.
const IP_MINUTE_MAX: usize = 24;
const IP_DAY_MAX: usize = 160;
// Nobody uses us to hammer one site: 16 area requests per target per minute across all visitors.
const TARGET_MINUTE_MAX: usize = 16;
const MAX_PARALLEL: usize = 12;

// ───────────────────────── DNS ─────────────────────────

static RESOLVER: OnceLock<TokioAsyncResolver> = OnceLock::new();

fn resolver() -> &'static TokioAsyncResolver {
    RESOLVER.get_or_init(|| {
        let mut opts = ResolverOpts::default();
        opts.timeout = Duration::from_secs(4);
        opts.attempts = 2;
        // Quad9: validating resolver based in Switzerland.
        TokioAsyncResolver::tokio(ResolverConfig::quad9(), opts)
    })
}

enum Lookup<T> {
    Found(T),
    None,
    Failed,
}

fn classify<T>(r: Result<T, hickory_resolver::error::ResolveError>) -> Lookup<T> {
    match r {
        Ok(v) => Lookup::Found(v),
        Err(e) => match e.kind() {
            ResolveErrorKind::NoRecordsFound { .. } => Lookup::None,
            _ => Lookup::Failed,
        },
    }
}

async fn txt_records(name: &str) -> Lookup<Vec<String>> {
    match classify(resolver().txt_lookup(format!("{name}.")).await) {
        Lookup::Found(l) => {
            let v: Vec<String> = l
                .iter()
                .map(|t| t.txt_data().iter().map(|b| String::from_utf8_lossy(b).into_owned()).collect::<String>())
                .collect();
            if v.is_empty() { Lookup::None } else { Lookup::Found(v) }
        }
        Lookup::None => Lookup::None,
        Lookup::Failed => Lookup::Failed,
    }
}

async fn has_record(name: &str, rt: RecordType) -> Lookup<usize> {
    match classify(resolver().lookup(format!("{name}."), rt).await) {
        Lookup::Found(l) => {
            let n = l.record_iter().filter(|r| r.record_type() == rt).count();
            if n == 0 { Lookup::None } else { Lookup::Found(n) }
        }
        Lookup::None => Lookup::None,
        Lookup::Failed => Lookup::Failed,
    }
}

/// Resolves the host and returns its addresses; every one of them must be public.
pub async fn resolve_public(host: &str) -> Result<Vec<IpAddr>, HostError> {
    let lookup = resolver().lookup_ip(format!("{host}.")).await;
    let ips: Vec<IpAddr> = match lookup {
        Ok(l) => l.iter().collect(),
        Err(_) => return Err(HostError::NotFound),
    };
    if ips.is_empty() {
        return Err(HostError::NotFound);
    }
    if ips.iter().any(|ip| !is_public_ip(*ip)) {
        return Err(HostError::Blocked);
    }
    Ok(ips)
}

/// IPv4 first, at most three addresses: a site with a dead IPv6 route must not fail the check.
fn ordered(ips: &[IpAddr]) -> Vec<IpAddr> {
    let mut v: Vec<IpAddr> = ips.iter().copied().filter(|i| i.is_ipv4()).collect();
    v.extend(ips.iter().copied().filter(|i| i.is_ipv6()));
    v.truncate(3);
    v
}

fn org_domain(host: &str) -> String {
    psl::domain_str(host).unwrap_or(host).to_string()
}

// ───────────────────────── pure evaluators ─────────────────────────

pub fn eval_spf(records: &[String]) -> Check {
    let spf: Vec<&String> = records.iter().filter(|r| r.trim_start().to_ascii_lowercase().starts_with("v=spf1")).collect();
    match spf.len() {
        0 => chk(St::Bad, "spf_missing"),
        1 => {
            let r = spf[0].to_ascii_lowercase();
            let all = r.split_whitespace().find(|t| t.trim_start_matches(['+', '-', '~', '?']) == "all");
            match all {
                Some(t) if t.starts_with('-') => chk(St::Ok, "spf_strict"),
                Some(t) if t.starts_with('~') => chk(St::Ok, "spf_soft"),
                Some(t) if t.starts_with('?') => chk(St::Warn, "spf_neutral"),
                Some(_) => chk(St::Bad, "spf_open"), // +all or bare all lets anyone send
                None => {
                    if r.contains("redirect=") { chk(St::Ok, "spf_redirect") } else { chk(St::Warn, "spf_no_all") }
                }
            }
        }
        _ => chk(St::Warn, "spf_multiple"), // more than one SPF record is invalid
    }
}

pub fn eval_dmarc(records: &[String]) -> Check {
    let dm: Vec<&String> = records.iter().filter(|r| r.trim_start().to_ascii_lowercase().starts_with("v=dmarc1")).collect();
    let Some(first) = dm.first() else { return chk(St::Bad, "dmarc_missing") };
    let policy = first
        .split(';')
        .filter_map(|t| t.split_once('='))
        .find(|(k, _)| k.trim().eq_ignore_ascii_case("p"))
        .map(|(_, v)| v.trim().to_ascii_lowercase())
        .unwrap_or_default();
    match policy.as_str() {
        "reject" | "quarantine" => chk_v(St::Ok, "dmarc_enforced", policy),
        "none" => chk(St::Warn, "dmarc_none"),
        _ => chk(St::Warn, "dmarc_invalid"),
    }
}

fn header<'a>(h: &'a HeaderMap, name: &str) -> Option<&'a str> {
    h.get(name).and_then(|v| v.to_str().ok())
}

pub fn eval_headers(h: &HeaderMap) -> Vec<Check> {
    let mut out = Vec::new();

    out.push(match header(h, "strict-transport-security") {
        None => chk(St::Warn, "hsts_missing"),
        Some(v) => {
            let age = v
                .split(';')
                .filter_map(|t| t.trim().split_once('='))
                .find(|(k, _)| k.trim().eq_ignore_ascii_case("max-age"))
                .and_then(|(_, n)| n.trim().trim_matches('"').parse::<u64>().ok())
                .unwrap_or(0);
            if age >= 15_552_000 { chk_v(St::Ok, "hsts_ok", age / 86_400) } else { chk_v(St::Warn, "hsts_short", age / 86_400) }
        }
    });

    let csp = header(h, "content-security-policy");
    out.push(match (csp, header(h, "content-security-policy-report-only")) {
        (Some(_), _) => chk(St::Ok, "csp_ok"),
        (None, Some(_)) => chk(St::Warn, "csp_report_only"),
        (None, None) => chk(St::Warn, "csp_missing"),
    });

    let frame = header(h, "x-frame-options").is_some() || csp.is_some_and(|c| c.to_ascii_lowercase().contains("frame-ancestors"));
    out.push(if frame { chk(St::Ok, "frame_ok") } else { chk(St::Warn, "frame_missing") });

    let nosniff = header(h, "x-content-type-options").is_some_and(|v| v.eq_ignore_ascii_case("nosniff"));
    out.push(if nosniff { chk(St::Ok, "nosniff_ok") } else { chk(St::Warn, "nosniff_missing") });

    let leak = header(h, "server")
        .filter(|s| s.contains('/') && s.bytes().any(|b| b.is_ascii_digit()))
        .map(|s| s.to_string())
        .or_else(|| header(h, "x-powered-by").map(|s| s.to_string()));
    out.push(match leak {
        Some(v) => chk_v(St::Warn, "server_version", v.chars().take(60).collect::<String>()),
        None => chk(St::Ok, "server_hidden"),
    });
    out
}

// ───────────────────────── TLS ─────────────────────────

struct Handshake {
    version: Option<rustls::ProtocolVersion>,
    leaf_der: Option<Vec<u8>>,
}

enum TlsFail {
    Expired,
    NotYetValid,
    Untrusted,
    NameMismatch,
    Other,
    Unreachable,
}

fn tls_config(versions: &[&'static rustls::SupportedProtocolVersion]) -> Arc<rustls::ClientConfig> {
    let mut roots = rustls::RootCertStore::empty();
    roots.extend(webpki_roots::TLS_SERVER_ROOTS.iter().cloned());
    let cfg = rustls::ClientConfig::builder_with_provider(Arc::new(rustls::crypto::ring::default_provider()))
        .with_protocol_versions(versions)
        .expect("tls versions")
        .with_root_certificates(roots)
        .with_no_client_auth();
    Arc::new(cfg)
}

async fn handshake(host: &str, ip: IpAddr, versions: &[&'static rustls::SupportedProtocolVersion]) -> Result<Handshake, TlsFail> {
    let tcp = timeout(Duration::from_secs(5), TcpStream::connect(SocketAddr::new(ip, 443)))
        .await
        .map_err(|_| TlsFail::Unreachable)?
        .map_err(|_| TlsFail::Unreachable)?;
    let name = rustls::pki_types::ServerName::try_from(host.to_string()).map_err(|_| TlsFail::Other)?;
    let connector = tokio_rustls::TlsConnector::from(tls_config(versions));
    let stream = match timeout(Duration::from_secs(6), connector.connect(name, tcp)).await {
        Err(_) => return Err(TlsFail::Unreachable),
        Ok(Err(e)) => {
            use rustls::{CertificateError as C, Error as E};
            let inner = e.get_ref().and_then(|i| i.downcast_ref::<E>());
            return Err(match inner {
                Some(E::InvalidCertificate(C::Expired | C::ExpiredContext { .. })) => TlsFail::Expired,
                Some(E::InvalidCertificate(C::NotValidYet | C::NotValidYetContext { .. })) => TlsFail::NotYetValid,
                Some(E::InvalidCertificate(C::UnknownIssuer)) => TlsFail::Untrusted,
                Some(E::InvalidCertificate(C::NotValidForName | C::NotValidForNameContext { .. })) => TlsFail::NameMismatch,
                _ => TlsFail::Other,
            });
        }
        Ok(Ok(s)) => s,
    };
    let (_, conn) = stream.get_ref();
    Ok(Handshake {
        version: conn.protocol_version(),
        leaf_der: conn.peer_certificates().and_then(|c| c.first()).map(|c| c.as_ref().to_vec()),
    })
}

fn days_left(der: &[u8]) -> Option<i64> {
    let (_, cert) = x509_parser::parse_x509_certificate(der).ok()?;
    let end = cert.validity().not_after.timestamp();
    Some((end - chrono::Utc::now().timestamp()).div_euclid(86_400))
}

fn http_client(host: &str, ip: IpAddr, port: u16) -> Result<reqwest::Client, reqwest::Error> {
    reqwest::Client::builder()
        .resolve(host, SocketAddr::new(ip, port))
        .redirect(reqwest::redirect::Policy::none())
        .timeout(Duration::from_secs(8))
        .user_agent("RFI-IRFOS-SafetyCheck/1.0 (passive; https://rfi-irfos.com)")
        .build()
}

async fn area_tls(host: &str, ips: &[IpAddr]) -> AreaResult {
    let mut checks = Vec::new();
    let mut ip = ips[0];
    let mut outcome = Err(TlsFail::Unreachable);
    for cand in ordered(ips) {
        ip = cand;
        outcome = handshake(host, cand, &[&rustls::version::TLS13, &rustls::version::TLS12]).await;
        if !matches!(outcome, Err(TlsFail::Unreachable)) {
            break;
        }
    }
    match outcome {
        Err(fail) => {
            checks.push(match fail {
                TlsFail::Expired => chk(St::Bad, "cert_expired"),
                TlsFail::NotYetValid => chk(St::Bad, "cert_not_yet_valid"),
                TlsFail::Untrusted => chk(St::Bad, "cert_untrusted"),
                TlsFail::NameMismatch => chk(St::Bad, "cert_name_mismatch"),
                TlsFail::Other => chk(St::Bad, "tls_failed"),
                TlsFail::Unreachable => chk(St::Info, "https_unreachable"),
            });
        }
        Ok(hs) => {
            checks.push(match hs.leaf_der.as_deref().and_then(days_left) {
                Some(d) if d < 21 => chk_v(St::Warn, "cert_expiring", d),
                Some(d) => chk_v(St::Ok, "cert_ok", d),
                None => chk(St::Ok, "cert_ok_unknown_expiry"),
            });
            let negotiated13 = matches!(hs.version, Some(rustls::ProtocolVersion::TLSv1_3));
            let tls13 = negotiated13 || handshake(host, ip, &[&rustls::version::TLS13]).await.is_ok();
            checks.push(if tls13 { chk(St::Ok, "tls13_yes") } else { chk(St::Warn, "tls13_no") });
        }
    }
    // Plain HTTP: does it lead to HTTPS?
    let mut http_check = chk(St::Info, "http_closed");
    for cand in ordered(ips) {
        let Ok(client) = http_client(host, cand, 80) else { continue };
        match client.get(format!("http://{host}/")).send().await {
            Ok(r) if r.status().is_redirection() => {
                let to_https = r.headers().get("location").and_then(|v| v.to_str().ok()).is_some_and(|l| l.starts_with("https://") || l.starts_with('/'));
                http_check = if to_https { chk(St::Ok, "https_redirect") } else { chk(St::Warn, "http_no_redirect") };
                break;
            }
            Ok(r) if r.status().is_success() => {
                http_check = chk(St::Warn, "http_open");
                break;
            }
            Ok(_) => {
                http_check = chk(St::Info, "http_other");
                break;
            }
            Err(_) => continue,
        }
    }
    checks.push(http_check);
    area_result("tls", checks)
}

// ───────────────────────── headers ─────────────────────────

async fn area_headers(host: &str, first_ips: &[IpAddr]) -> AreaResult {
    let mut cur = host.to_string();
    let mut ips = first_ips.to_vec();
    for _ in 0..4 {
        let mut answer = None;
        for cand in ordered(&ips) {
            let Ok(client) = http_client(&cur, cand, 443) else { continue };
            if let Ok(resp) = client.get(format!("https://{cur}/")).send().await {
                answer = Some(resp);
                break;
            }
        }
        let Some(resp) = answer else { return area_result("headers", vec![chk(St::Info, "https_unreachable")]) };
        if resp.status().is_redirection() {
            let next = resp
                .headers()
                .get("location")
                .and_then(|v| v.to_str().ok())
                .and_then(|l| reqwest::Url::parse(&format!("https://{cur}/")).ok()?.join(l).ok());
            if let Some(url) = next {
                let same_origin_https = url.scheme() == "https" && url.port().is_none();
                if same_origin_https {
                    if let Some(h) = url.host_str().and_then(|h| parse_host(h).ok()) {
                        if let Ok(new_ips) = resolve_public(&h).await {
                            cur = h;
                            ips = new_ips;
                            continue;
                        }
                    }
                }
            }
        }
        return area_result("headers", eval_headers(resp.headers()));
    }
    area_result("headers", vec![chk(St::Info, "https_unreachable")])
}

// ───────────────────────── mail ─────────────────────────

const DKIM_SELECTORS: [&str; 20] = [
    "default", "google", "selector1", "selector2", "k1", "k2", "s1", "s2", "mail", "dkim",
    "brevo1", "brevo2", "protonmail", "protonmail2", "protonmail3", "fm1", "fm2", "mandrill", "zoho", "mailjet",
];

async fn area_mail(host: &str) -> AreaResult {
    let org = org_domain(host);
    let dmarc_name = format!("_dmarc.{org}");
    let (spf_l, dmarc_l, mx_l) = tokio::join!(txt_records(&org), txt_records(&dmarc_name), has_record(&org, RecordType::MX));
    let spf_txt = match &spf_l { Lookup::Found(v) => v.clone(), _ => Vec::new() };
    let dmarc_txt = match &dmarc_l { Lookup::Found(v) => v.clone(), _ => Vec::new() };
    if matches!(spf_l, Lookup::Failed) || matches!(dmarc_l, Lookup::Failed) {
        return area_result("mail", vec![chk(St::Info, "lookup_failed")]);
    }
    let has_mx = matches!(mx_l, Lookup::Found(_));
    let has_spf = spf_txt.iter().any(|r| r.to_ascii_lowercase().starts_with("v=spf1"));
    let has_dmarc = dmarc_txt.iter().any(|r| r.to_ascii_lowercase().starts_with("v=dmarc1"));
    if !has_mx && !has_spf && !has_dmarc {
        return area_result("mail", vec![chk(St::Info, "mail_unused")]);
    }
    let mut checks = vec![eval_spf(&spf_txt), eval_dmarc(&dmarc_txt)];
    let probes = futures_util_join(DKIM_SELECTORS.iter().map(|s| {
        let name = format!("{s}._domainkey.{org}");
        async move { (*s, txt_records(&name).await) }
    }))
    .await;
    let found = probes.into_iter().find_map(|(s, l)| match l {
        Lookup::Found(v) if v.iter().any(|t| t.to_ascii_lowercase().contains("v=dkim1") || t.contains("p=")) => Some(s),
        _ => None,
    });
    checks.push(match found {
        Some(s) => chk_v(St::Ok, "dkim_found", s),
        None => chk(St::Info, "dkim_unknown"), // absence under common selectors proves nothing
    });
    area_result("mail", checks)
}

/// Minimal join_all (avoids a dependency for ten lookups).
async fn futures_util_join<I, F, T>(it: I) -> Vec<T>
where
    I: IntoIterator<Item = F>,
    F: std::future::Future<Output = T> + Send + 'static,
    T: Send + 'static,
{
    let handles: Vec<_> = it.into_iter().map(tokio::spawn).collect();
    let mut out = Vec::new();
    for h in handles {
        if let Ok(v) = h.await {
            out.push(v);
        }
    }
    out
}

// ───────────────────────── DNS area ─────────────────────────

async fn area_dns(host: &str) -> AreaResult {
    let org = org_domain(host);
    let (ns, ds, caa_host, caa_org, cname) = tokio::join!(
        has_record(&org, RecordType::NS),
        has_record(&org, RecordType::DS),
        has_record(host, RecordType::CAA),
        has_record(&org, RecordType::CAA),
        async { classify(resolver().lookup(format!("{host}."), RecordType::CNAME).await) },
    );
    let mut checks = Vec::new();
    checks.push(match ns {
        Lookup::Found(n) if n >= 2 => chk_v(St::Ok, "ns_redundant", n),
        Lookup::Found(_) => chk(St::Warn, "ns_single"),
        _ => chk(St::Info, "lookup_failed"),
    });
    checks.push(match ds {
        Lookup::Found(_) => chk(St::Ok, "dnssec_yes"),
        Lookup::None => chk(St::Warn, "dnssec_no"),
        Lookup::Failed => chk(St::Info, "lookup_failed"),
    });
    checks.push(match (caa_host, caa_org) {
        (Lookup::Found(_), _) | (_, Lookup::Found(_)) => chk(St::Ok, "caa_yes"),
        (Lookup::Failed, _) | (_, Lookup::Failed) => chk(St::Info, "lookup_failed"),
        _ => chk(St::Warn, "caa_no"),
    });
    // Dangling CNAME: alias whose target no longer exists (takeover candidate).
    let target = match cname {
        Lookup::Found(l) => l
            .record_iter()
            .find(|r| r.record_type() == RecordType::CNAME)
            .and_then(|r| r.data().and_then(|d| d.as_cname().map(|c| c.0.to_string()))),
        _ => None,
    };
    checks.push(match target {
        Some(t) => {
            let t = t.trim_end_matches('.').to_string();
            match resolver().lookup_ip(format!("{t}.")).await {
                Ok(_) => chk(St::Ok, "no_dangling"),
                Err(e) if matches!(e.kind(), ResolveErrorKind::NoRecordsFound { .. }) => chk_v(St::Bad, "dangling_cname", t),
                Err(_) => chk(St::Info, "lookup_failed"),
            }
        }
        None => chk(St::Ok, "no_dangling"),
    });
    area_result("dns", checks)
}

// ───────────────────────── endpoint ─────────────────────────

#[derive(Deserialize)]
pub struct SafetyRequest {
    pub domain: String,
    pub area: String,
}

fn err(status: StatusCode, code: &str) -> Response {
    (status, Json(serde_json::json!({ "error": code }))).into_response()
}

pub async fn check(headers: HeaderMap, Json(req): Json<SafetyRequest>) -> Response {
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
    let minute = PER_IP_MINUTE.get_or_init(Windows::new);
    let day = PER_IP_DAY.get_or_init(Windows::new);
    if minute.limited(&ip, IP_MINUTE_MAX, Duration::from_secs(60)) || day.limited(&ip, IP_DAY_MAX, Duration::from_secs(86_400)) {
        return err(StatusCode::TOO_MANY_REQUESTS, "rate_limited");
    }
    let area = match req.area.as_str() {
        "tls" => "tls",
        "headers" => "headers",
        "mail" => "mail",
        "dns" => "dns",
        _ => return err(StatusCode::BAD_REQUEST, "invalid_area"),
    };
    let host = match parse_host(&req.domain) {
        Ok(h) => h,
        Err(HostError::Blocked) => return err(StatusCode::BAD_REQUEST, "blocked"),
        Err(_) => return err(StatusCode::BAD_REQUEST, "invalid_domain"),
    };
    if PER_TARGET.get_or_init(Windows::new).limited(&host, TARGET_MINUTE_MAX, Duration::from_secs(60)) {
        return err(StatusCode::TOO_MANY_REQUESTS, "target_busy");
    }
    let slots = SLOTS.get_or_init(|| Arc::new(Semaphore::new(MAX_PARALLEL))).clone();
    let Ok(_permit) = slots.try_acquire_owned() else { return err(StatusCode::SERVICE_UNAVAILABLE, "busy") };

    let ips = match resolve_public(&host).await {
        Ok(v) => v,
        Err(HostError::Blocked) => return err(StatusCode::BAD_REQUEST, "blocked"),
        Err(_) => return err(StatusCode::UNPROCESSABLE_ENTITY, "not_found"),
    };
    let work = async {
        match area {
            "tls" => area_tls(&host, &ips).await,
            "headers" => area_headers(&host, &ips).await,
            "mail" => area_mail(&host).await,
            _ => area_dns(&host).await,
        }
    };
    match timeout(Duration::from_secs(20), work).await {
        Ok(r) => Json(r).into_response(),
        Err(_) => err(StatusCode::GATEWAY_TIMEOUT, "timeout"),
    }
}

// ───────────────────────── tests ─────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::HeaderValue;

    fn ip(s: &str) -> IpAddr {
        s.parse().unwrap()
    }

    #[test]
    fn parse_host_accepts_urls_and_plain_domains() {
        assert_eq!(parse_host("Example.COM").unwrap(), "example.com");
        assert_eq!(parse_host("https://www.example.com/path?q=1#x").unwrap(), "www.example.com");
        assert_eq!(parse_host("  http://example.co.uk:8080/ ").unwrap(), "example.co.uk");
        assert_eq!(parse_host("example.com.").unwrap(), "example.com");
        assert_eq!(parse_host("xn--mnchen-3ya.de").unwrap(), "xn--mnchen-3ya.de");
    }

    #[test]
    fn parse_host_rejects_ip_literals_userinfo_and_junk() {
        for bad in ["", "localhost", "127.0.0.1", "http://169.254.169.254/latest", "[::1]", "user@example.com", "a b.com", "exa_mple.com", "-a.com", "a..com", "münchen.de", "example", "example.c0m", "http://example.com\\@evil.com"] {
            assert_eq!(parse_host(bad), Err(HostError::Invalid), "{bad}");
        }
    }

    #[test]
    fn parse_host_blocks_internal_suffixes() {
        for blocked in ["printer.local", "db.internal", "x.localhost", "svc.corp", "a.b.test"] {
            assert_eq!(parse_host(blocked), Err(HostError::Blocked), "{blocked}");
        }
    }

    #[test]
    fn non_public_addresses_are_refused() {
        for bad in [
            "127.0.0.1", "10.1.2.3", "172.16.0.1", "172.31.255.255", "192.168.1.1", "169.254.169.254", "0.0.0.0", "100.64.0.1",
            "192.0.0.5", "198.18.0.1", "224.0.0.1", "255.255.255.255", "240.0.0.1", "192.0.2.1", "::1", "::", "fe80::1", "fc00::1",
            "fd12:3456::1", "ff02::1", "2001:db8::1", "::ffff:127.0.0.1", "::ffff:10.0.0.1", "64:ff9b::7f00:1", "2002:7f00:1::1",
        ] {
            assert!(!is_public_ip(ip(bad)), "{bad} must be blocked");
        }
    }

    #[test]
    fn public_addresses_pass() {
        for good in ["8.8.8.8", "1.1.1.1", "93.184.216.34", "2606:4700:4700::1111", "2a00:1450:4001:81b::200e", "::ffff:8.8.8.8", "172.32.0.1", "100.128.0.1"] {
            assert!(is_public_ip(ip(good)), "{good} must pass");
        }
    }

    fn s(v: &[&str]) -> Vec<String> {
        v.iter().map(|x| x.to_string()).collect()
    }

    #[test]
    fn spf_policies() {
        assert_eq!(eval_spf(&s(&["v=spf1 include:_spf.google.com -all"])).code, "spf_strict");
        assert_eq!(eval_spf(&s(&["v=spf1 mx ~all"])).code, "spf_soft");
        assert_eq!(eval_spf(&s(&["v=spf1 mx ?all"])).state, St::Warn);
        assert_eq!(eval_spf(&s(&["v=spf1 +all"])).state, St::Bad);
        assert_eq!(eval_spf(&s(&["v=spf1 mx"])).code, "spf_no_all");
        assert_eq!(eval_spf(&s(&["v=spf1 redirect=_spf.example.com"])).state, St::Ok);
        assert_eq!(eval_spf(&s(&["google-site-verification=abc"])).code, "spf_missing");
        assert_eq!(eval_spf(&s(&["v=spf1 -all", "v=spf1 ~all"])).code, "spf_multiple");
    }

    #[test]
    fn dmarc_policies() {
        assert_eq!(eval_dmarc(&s(&["v=DMARC1; p=reject; rua=mailto:a@b.c"])).code, "dmarc_enforced");
        assert_eq!(eval_dmarc(&s(&["v=DMARC1;p=quarantine"])).state, St::Ok);
        assert_eq!(eval_dmarc(&s(&["v=DMARC1; p=none"])).code, "dmarc_none");
        assert_eq!(eval_dmarc(&s(&["v=DMARC1; rua=mailto:a@b.c"])).code, "dmarc_invalid");
        assert_eq!(eval_dmarc(&[]).code, "dmarc_missing");
    }

    fn hm(pairs: &[(&'static str, &str)]) -> HeaderMap {
        let mut h = HeaderMap::new();
        for (k, v) in pairs {
            h.insert(*k, HeaderValue::from_str(v).unwrap());
        }
        h
    }

    fn code_state(checks: &[Check], code: &str) -> St {
        checks.iter().find(|c| c.code == code).unwrap_or_else(|| panic!("{code} missing in {checks:?}")).state
    }

    #[test]
    fn headers_all_good() {
        let h = hm(&[
            ("strict-transport-security", "max-age=63072000; includeSubDomains; preload"),
            ("content-security-policy", "default-src 'self'"),
            ("x-frame-options", "DENY"),
            ("x-content-type-options", "nosniff"),
            ("server", "cloudflare"),
        ]);
        let c = eval_headers(&h);
        assert!(c.iter().all(|x| x.state == St::Ok), "{c:?}");
    }

    #[test]
    fn headers_flag_gaps_and_version_leak() {
        let h = hm(&[("strict-transport-security", "max-age=300"), ("server", "nginx/1.18.0"), ("x-powered-by", "PHP/7.4")]);
        let c = eval_headers(&h);
        assert_eq!(code_state(&c, "hsts_short"), St::Warn);
        assert_eq!(code_state(&c, "csp_missing"), St::Warn);
        assert_eq!(code_state(&c, "frame_missing"), St::Warn);
        assert_eq!(code_state(&c, "nosniff_missing"), St::Warn);
        assert_eq!(code_state(&c, "server_version"), St::Warn);
    }

    #[test]
    fn frame_ancestors_in_csp_counts_as_clickjacking_protection() {
        let h = hm(&[("content-security-policy", "frame-ancestors 'none'")]);
        assert_eq!(code_state(&eval_headers(&h), "frame_ok"), St::Ok);
    }

    #[test]
    fn plain_server_name_without_version_is_not_a_leak() {
        let h = hm(&[("server", "nginx")]);
        assert_eq!(code_state(&eval_headers(&h), "server_hidden"), St::Ok);
    }

    #[test]
    fn area_score_ignores_info_and_weights_warn_half() {
        let r = area_result("x", vec![chk(St::Ok, "a"), chk(St::Warn, "b"), chk(St::Bad, "c"), chk(St::Info, "d")]);
        assert_eq!(r.score, Some(50));
        assert_eq!(r.state, St::Bad);
        let only_info = area_result("x", vec![chk(St::Info, "a")]);
        assert_eq!(only_info.score, None);
        assert_eq!(only_info.state, St::Info);
        assert_eq!(area_result("x", vec![chk(St::Ok, "a"), chk(St::Warn, "b")]).state, St::Warn);
    }

    #[test]
    fn ordered_prefers_ipv4_and_caps_at_three() {
        let v = ordered(&[ip("2600::1"), ip("8.8.8.8"), ip("2600::2"), ip("1.1.1.1")]);
        assert_eq!(v, vec![ip("8.8.8.8"), ip("1.1.1.1"), ip("2600::1")]);
    }

    #[test]
    fn windows_limit_per_key() {
        let w = Windows::new();
        for _ in 0..3 {
            assert!(!w.limited("a", 3, Duration::from_secs(60)));
        }
        assert!(w.limited("a", 3, Duration::from_secs(60)));
        assert!(!w.limited("b", 3, Duration::from_secs(60)));
    }
}
