//! Easter Eggs und Honeypot: freundliche Eier auf erfundenen Pfaden, Köderpfade mit Fake-Dateien,
//! Erkennung von Scannern und Injection-Versuchen. Treffer gehen als ntfy-Meldung raus
//! (nur wenn `TRAP_NTFY_TOPIC` gesetzt ist) und landen in der Tabelle `trap_hits`.
//!
//! Grundsätze:
//! * Echte Routen (`/api`, `/auth`, `/uploads`, `/assets`, robots.txt, sitemap.xml, .well-known) bleiben
//!   unberührt. Köder liegen nur auf Pfaden, die unsere Seite nie belegt.
//! * Fake-Dateien enthalten offensichtlichen Unsinn, nie etwas, das wie ein echter Schlüssel aussieht.
//! * ntfy bekommt IP, Standort und Provider des Treffers (Selbstschutz, siehe Datenschutzerklärung). Der
//!   Topic-Name ist deshalb geheim: ntfy.sh-Topics sind für jeden lesbar, der den Namen kennt.
//! * Fallgatter: wiederholte oder schwere Treffer sperren die IP für 24 Stunden. Quelle der IP ist allein
//!   `fly-client-ip`, nie ein fälschbarer Header. Eier lösen nie eine Sperre aus.

use axum::{
    extract::{Request, State},
    http::{header, HeaderValue, Method, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
};
use std::{
    collections::HashMap,
    sync::{Mutex, OnceLock},
    time::{Duration, Instant},
};

use crate::AppState;

// ── Sprüche ─────────────────────────────────────────────────────────────────────────────────────

const DEFAULT_LINE: &str = "Your incompetence has been successfully observed.";

const URKUNDE: &str = "\
+------------------------------------------------------+
|                    U R K U N D E                     |
|                                                      |
|   HARTNÄCKIGSTER SCANNER DES TAGES                   |
|                                                      |
|   Verliehen für: 400 Requests, 0 Erkenntnisse        |
|   Unterschrift:  Das Ei, das du nicht gefunden hast  |
+------------------------------------------------------+";

const FLAGGE: &str = "flag{congratulations_you_found_the_only_flag_it_is_worthless}";

const LINES: &[&str] = &[
    "Du suchst eine Schwachstelle? Süß. Ich suche gerade noch deinen Kompetenznachweis.",
    "Dein größter Exploit ist offenbar dein Selbstvertrauen.",
    "404 wäre freundlicher gewesen. Das hier ist 200 mit Gefühlen.",
    "Glückwunsch, du hast gerade einem Menschen den Abend versüßt. Er lacht sich über deinen Log-Eintrag schlapp.",
    "Wir haben deine Anfrage vorgelesen. Im Büro. Laut. Mit Applaus.",
    "Hier liegt nichts. Außer deiner Würde. Die liegt am Boden.",
    "Dein Scanner hat 3 Stunden gebraucht, um zu scheitern. Respekt für das Durchhaltevermögen.",
    "Die Passwörter stehen im Safe. Der Safe steht in Graz. Der Schlüssel steckt in deinem Ego.",
    "Wir haben dich in unser Gästebuch eingetragen. Unter „Besucher mit größtem Optimismus“.",
    "Dieser Pfad existiert nur, damit du ihn findest. Und wir dich.",
    "Pentest? Nett. Wir machen das professionell, mit Vertrag und Rechnung. Du machst es mit Hoffnung.",
    "Hast du schon versucht, es auszuschalten und wieder einzuschalten? Dich, meine ich.",
    "Das war ein ehrlicher Versuch. Leider kein guter.",
    "Hier wohnt ein Wachhund. Er heißt Rust und beißt nur, wenn man ihn kompiliert.",
    "Wir lesen jeden Request. Dieser war der lustigste seit Dienstag.",
    "Der Admin-Bereich ist nicht hier. Der Admin ist auch nicht hier. Er trinkt Kaffee und schaut dir zu.",
    "Ziel erfasst. Ziel gelangweilt.",
    "Du hast einen Zero-Day gefunden: Nämlich den Tag, an dem du dachtest, das hier wäre einfach.",
    "Schöner Payload. Hast du den selbst geschrieben oder aus dem Tutorial von 2009?",
    "Wir haben uns bei deinem Provider über dich beschwert. Er hat nur gelacht.",
    "Fehlermeldung: Du bist zu laut für einen Geist und zu leise für einen Profi.",
    "Hier gibt es nichts zu holen. Außer einem Eintrag in unserer Hall of Shame.",
    "Dein User-Agent sieht aus wie ein Bewerbungsfoto aus dem Automaten.",
    "Zugriff verweigert. Mitleid gewährt.",
    "Wir haben den Honeypot extra für dich poliert. Du bist hineingetappt wie ein Profi.",
    "Fun Fact: Auf dieser Seite gibt es 100 Köder und 1 echte Tür. Du hast jeden Köder gefunden.",
    "Dein Skript hat eine Fehlerquote von 100 Prozent. Das ist wenigstens konsistent.",
    "Ich habe in deinen Request geschaut. Er ist leer. Wie der Kaffeebecher, den du jetzt brauchst.",
    "Das war kein Hack. Das war ein Spaziergang mit Stolperdraht.",
    "Danke für den Besuch! Dein Eintrag hängt jetzt an unserer Pinnwand. Neben den anderen.",
    "Wir haben deine IP nicht gespeichert. Wir haben sie eingerahmt.",
    "Hier ist die Sicherheitslücke: Du glaubst, es gäbe eine.",
    "Netter Versuch. Bei uns heißt das „unbezahlter Beitrag zu unserer Statistik“.",
    "Brute Force? Der einzige, der hier brutal gefordert wird, ist dein Geduldsfaden.",
    "Das Wartungsfenster für Angreifer ist heute leider geschlossen. Bitte nie wieder versuchen.",
    "Du suchst Daten? Hier ist ein Datum: Heute hast du verloren.",
    "Sag mal, bist du ein Bot oder einfach nur sehr hartnäckig? Beides ist peinlich.",
    "Ein Mensch hat gerade deine Anfrage gelesen und musste kurz die Stirn auf den Tisch legen.",
    "Geheimtipp vom Haus: Probier es mit Fragen. Wir antworten oft ehrlicher als unsere Server.",
    "Dieser Server wurde von Menschen gebaut, die Sicherheitslücken für andere aufspüren. Du bist gerade eine geworden.",
];

fn pick_line() -> &'static str {
    let r = uuid::Uuid::new_v4().as_u128();
    match (r % 100) as u32 {
        0 => URKUNDE,
        1 => FLAGGE,
        2..=5 => DEFAULT_LINE,
        _ => LINES[((r >> 8) as usize) % LINES.len()],
    }
}

// ── Feste Easter Eggs ───────────────────────────────────────────────────────────────────────────

pub struct Egg {
    paths: &'static [&'static str],
    status: u16,
    body: &'static str,
}

const EGGS: &[Egg] = &[
    Egg { paths: &["/flag", "/flag.txt"], status: 200, body: "flag{no_flags_here_just_phenomena}" },
    Egg { paths: &["/humans.txt"], status: 200, body: "Hier schreiben Menschen und manchmal Maschinen. Die Maschinen dürfen nur Kommentare." },
    Egg { paths: &["/teapot", "/coffee", "/brew"], status: 418, body: "418 I'm a teapot. Kaffee gibt es oben im Büro in Graz." },
    Egg { paths: &["/hallo", "/hello"], status: 200, body: "Hallo! Schön, dass du neugierig bist. Unsere Forschung findest du auf der Startseite." },
    Egg { paths: &["/secret", "/hidden", "/easter-egg", "/konami"], status: 200, body: "Du hast das Ei gefunden. Es ist leer. Aber du warst schneller als alle anderen." },
    Egg { paths: &["/42"], status: 200, body: "Die Frage dazu ist noch in Arbeit. Dingir rechnet." },
    Egg { paths: &["/sudo"], status: 200, body: "Hier gibt es keinen root. Nur Neugier." },
    Egg { paths: &["/ping"], status: 200, body: "pong" },
    Egg { paths: &["/emergence"], status: 200, body: "Emergenz ist, wenn das Ganze mehr kann als die Summe seiner Teile. Das hier ist ein Ei und trotzdem schon eine Seite." },
    Egg { paths: &["/matrix", "/neo"], status: 200, body: "Es gibt keinen Löffel. Aber es gibt einen Pfad, den du gerade gefunden hast." },
    Egg { paths: &["/coffee.txt"], status: 200, body: "Brewing... 99 Prozent. Der letzte Prozent ist Geduld." },
    Egg { paths: &["/rickroll", "/never-gonna"], status: 200, body: "Never gonna give you up, never gonna let you down. Wir geben nur die Mail-Adresse nicht her." },
];

// ── Köder: Pfad → Fake-Inhalt ───────────────────────────────────────────────────────────────────

pub struct Bait {
    /// Treffer, wenn der Pfad (kleingeschrieben) so beginnt oder genau so lautet.
    prefix: &'static str,
    /// Name in der ntfy-Meldung: welches Fake-Paket wurde gelesen.
    kind: &'static str,
    /// Fake-Inhalt. `None` = nur ein Spruch.
    fake: Option<&'static str>,
}

const ENV_FAKE: &str = "\
# produktiv, bitte nicht committen
DATABASE_URL=postgres://admin:hunter2@localhost/definitiv_echt
STRIPE_SECRET_KEY=sk_fake_dieser_schluessel_ist_ein_witz
JWT_SECRET=wer-das-liest-hat-zu-viel-zeit
ADMIN_PASSWORD=du-bist-jetzt-in-unserem-log
";

const GIT_CONFIG_FAKE: &str = "\
[core]
\trepositoryformatversion = 0
[remote \"origin\"]
\turl = https://example.invalid/hier-gibt-es-nichts.git
[branch \"main\"]
\tremote = origin
; Diese Datei wurde mit viel Liebe für dich geschrieben.
";

const WPCONFIG_FAKE: &str = "\
<?php
// wp-config.php - frisch aus dem Köder-Paket
define('DB_NAME', 'nicht_hier');
define('DB_USER', 'root_fantasie');
define('DB_PASSWORD', 'passwort123_nein_wirklich_nicht');
// Wir benutzen kein WordPress. Aber schön, dass du es versucht hast.
";

const SQL_FAKE: &str = "\
-- dump.sql, erzeugt von niemandem
CREATE TABLE geheimnisse (id INT, inhalt TEXT);
INSERT INTO geheimnisse VALUES (1, 'Die Tabelle ist leer.');
INSERT INTO geheimnisse VALUES (2, 'Das war ein Witz.');
";

const KEY_FAKE: &str = "\
-----BEGIN FAKE PRIVATE KEY-----
VGhpcyBpcyBubyBrZXkuIEl0IGlzIGEgdHJvbGwuIEhhdmUgYSBuaWNlIGRheS4=
-----END FAKE PRIVATE KEY-----
";

const BAITS: &[Bait] = &[
    Bait { prefix: "/.env", kind: ".env", fake: Some(ENV_FAKE) },
    Bait { prefix: "/.git/", kind: ".git", fake: Some(GIT_CONFIG_FAKE) },
    Bait { prefix: "/.git", kind: ".git", fake: Some(GIT_CONFIG_FAKE) },
    Bait { prefix: "/wp-config.php", kind: "wp-config", fake: Some(WPCONFIG_FAKE) },
    Bait { prefix: "/config.php", kind: "config.php", fake: Some(WPCONFIG_FAKE) },
    Bait { prefix: "/backup.sql", kind: "sql-dump", fake: Some(SQL_FAKE) },
    Bait { prefix: "/dump.sql", kind: "sql-dump", fake: Some(SQL_FAKE) },
    Bait { prefix: "/database.sql", kind: "sql-dump", fake: Some(SQL_FAKE) },
    Bait { prefix: "/db.sql", kind: "sql-dump", fake: Some(SQL_FAKE) },
    Bait { prefix: "/id_rsa", kind: "ssh-key", fake: Some(KEY_FAKE) },
    Bait { prefix: "/.ssh/", kind: "ssh-key", fake: Some(KEY_FAKE) },
    Bait { prefix: "/server-status", kind: "apache-status", fake: None },
    Bait { prefix: "/wp-login.php", kind: "wp-login", fake: None },
    Bait { prefix: "/wp-admin", kind: "wp-admin", fake: None },
    Bait { prefix: "/wp-content", kind: "wp-content", fake: None },
    Bait { prefix: "/wp-includes", kind: "wp-includes", fake: None },
    Bait { prefix: "/xmlrpc.php", kind: "xmlrpc", fake: None },
    Bait { prefix: "/administrator", kind: "joomla", fake: None },
    Bait { prefix: "/phpmyadmin", kind: "phpmyadmin", fake: None },
    Bait { prefix: "/pma/", kind: "phpmyadmin", fake: None },
    Bait { prefix: "/myadmin", kind: "phpmyadmin", fake: None },
    Bait { prefix: "/adminer", kind: "adminer", fake: None },
    Bait { prefix: "/phpinfo", kind: "phpinfo", fake: None },
    Bait { prefix: "/info.php", kind: "phpinfo", fake: None },
    Bait { prefix: "/cgi-bin", kind: "cgi-bin", fake: None },
    Bait { prefix: "/shell", kind: "webshell", fake: None },
    Bait { prefix: "/cmd/", kind: "webshell", fake: None },
    Bait { prefix: "/c99", kind: "webshell", fake: None },
    Bait { prefix: "/r57", kind: "webshell", fake: None },
    Bait { prefix: "/eval-stdin.php", kind: "phpunit", fake: None },
    Bait { prefix: "/vendor/phpunit", kind: "phpunit", fake: None },
    Bait { prefix: "/actuator", kind: "spring-actuator", fake: None },
    Bait { prefix: "/jenkins", kind: "jenkins", fake: None },
    Bait { prefix: "/solr", kind: "solr", fake: None },
    Bait { prefix: "/manager/html", kind: "tomcat", fake: None },
    Bait { prefix: "/console", kind: "console", fake: None },
    Bait { prefix: "/.aws/", kind: "aws-credentials", fake: None },
    Bait { prefix: "/.docker", kind: "docker", fake: None },
    Bait { prefix: "/.svn", kind: "svn", fake: None },
    Bait { prefix: "/.hg", kind: "hg", fake: None },
    Bait { prefix: "/.ds_store", kind: "ds_store", fake: None },
    Bait { prefix: "/.htaccess", kind: "htaccess", fake: None },
    Bait { prefix: "/.htpasswd", kind: "htpasswd", fake: None },
    Bait { prefix: "/.bash_history", kind: "bash_history", fake: None },
    Bait { prefix: "/composer.json", kind: "composer", fake: None },
    Bait { prefix: "/package-lock.json", kind: "npm-lock", fake: None },
    Bait { prefix: "/docker-compose", kind: "docker-compose", fake: None },
    Bait { prefix: "/dockerfile", kind: "dockerfile", fake: None },
    Bait { prefix: "/terraform.tfstate", kind: "terraform", fake: None },
    Bait { prefix: "/.terraform", kind: "terraform", fake: None },
    Bait { prefix: "/backup", kind: "backup", fake: None },
    Bait { prefix: "/old/", kind: "old", fake: None },
    Bait { prefix: "/test.php", kind: "test.php", fake: None },
    Bait { prefix: "/debug", kind: "debug", fake: None },
    Bait { prefix: "/telescope", kind: "laravel", fake: None },
    Bait { prefix: "/_ignition", kind: "laravel", fake: None },
    Bait { prefix: "/.vscode", kind: "vscode", fake: None },
    Bait { prefix: "/.idea", kind: "idea", fake: None },
    Bait { prefix: "/swagger", kind: "swagger", fake: None },
    Bait { prefix: "/graphql", kind: "graphql", fake: None },
    Bait { prefix: "/v1/api-docs", kind: "swagger", fake: None },
    Bait { prefix: "/owa/", kind: "exchange", fake: None },
    Bait { prefix: "/ecp/", kind: "exchange", fake: None },
    Bait { prefix: "/remote/login", kind: "fortinet", fake: None },
    Bait { prefix: "/vpn/", kind: "vpn", fake: None },
    Bait { prefix: "/boaform", kind: "router", fake: None },
    Bait { prefix: "/hnap1", kind: "router", fake: None },
    Bait { prefix: "/setup.cgi", kind: "router", fake: None },
    Bait { prefix: "/login.action", kind: "confluence", fake: None },
    Bait { prefix: "/confluence", kind: "confluence", fake: None },
    Bait { prefix: "/.well-known/security.txt.bak", kind: "security.txt.bak", fake: None },
    Bait { prefix: "/etc/passwd", kind: "passwd", fake: None },
    Bait { prefix: "/proc/self", kind: "proc", fake: None },
];

// ── Erkennung ───────────────────────────────────────────────────────────────────────────────────

const SCANNER_UAS: &[&str] = &[
    "sqlmap", "nikto", "nmap", "nuclei", "masscan", "zgrab", "gobuster", "dirbuster", "dirb",
    "wfuzz", "ffuf", "feroxbuster", "acunetix", "nessus", "openvas", "burp", "zaproxy", "arachni",
    "wpscan", "hydra", "metasploit", "havij", "netsparker", "whatweb", "xsstrike", "commix",
    "jaeles", "httpx", "katana", "python-requests/2.6", "go-http-client/1.1 scanner",
];

const PAYLOAD_PATTERNS: &[(&str, &str)] = &[
    ("union select", "sql-injection"),
    ("union%20select", "sql-injection"),
    ("' or '1'='1", "sql-injection"),
    ("' or 1=1", "sql-injection"),
    ("\" or 1=1", "sql-injection"),
    ("sleep(", "sql-injection"),
    ("benchmark(", "sql-injection"),
    ("information_schema", "sql-injection"),
    ("<script", "xss"),
    ("javascript:", "xss"),
    ("onerror=", "xss"),
    ("${jndi:", "log4shell"),
    ("${${", "log4shell"),
    ("../", "path-traversal"),
    ("..\\", "path-traversal"),
    ("%2e%2e", "path-traversal"),
    ("etc/passwd", "path-traversal"),
    ("php://", "lfi"),
    ("base64_decode", "php-injection"),
    ("/bin/sh", "command-injection"),
    ("cmd.exe", "command-injection"),
];

const ALLOWED_METHODS: &[Method] = &[
    Method::GET, Method::HEAD, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS, Method::PATCH,
];

/// Pfade, die nie Köder sind, auch wenn ein Präfix sie träfe.
fn is_protected(path: &str) -> bool {
    path.starts_with("/api/")
        || path.starts_with("/auth/")
        || path.starts_with("/uploads/")
        || path.starts_with("/assets/")
        || path == "/robots.txt"
        || path == "/sitemap.xml"
        || path == "/llms.txt"
        || path == "/.well-known/security.txt"
}

pub enum Verdict {
    Pass,
    Egg(&'static Egg),
    Bait(&'static Bait),
    Attack(String),
}

pub fn classify(method: &Method, path: &str, query: &str, user_agent: &str) -> Verdict {
    let path_l = path.to_lowercase();

    if !ALLOWED_METHODS.contains(method) {
        return Verdict::Attack(format!("method:{method}"));
    }
    if let Some(egg) = EGGS.iter().find(|e| e.paths.contains(&path_l.as_str())) {
        return Verdict::Egg(egg);
    }
    let ua = user_agent.to_lowercase();
    if let Some(s) = SCANNER_UAS.iter().find(|s| ua.contains(*s)) {
        return Verdict::Attack(format!("scanner:{s}"));
    }
    // Payload-Suche auf dem rohen Pfad plus Abfrage, einmal URL-dekodiert.
    let haystack = format!("{path_l}?{}", query.to_lowercase());
    let decoded = percent_decode(&haystack);
    for (needle, kind) in PAYLOAD_PATTERNS {
        if haystack.contains(needle) || decoded.contains(needle) {
            return Verdict::Attack((*kind).to_string());
        }
    }
    if is_protected(&path_l) {
        return Verdict::Pass;
    }
    if let Some(b) = BAITS.iter().find(|b| path_l.starts_with(b.prefix)) {
        return Verdict::Bait(b);
    }
    Verdict::Pass
}

fn percent_decode(s: &str) -> String {
    let b = s.as_bytes();
    let mut out = Vec::with_capacity(b.len());
    let mut i = 0;
    while i < b.len() {
        if b[i] == b'%' && i + 2 < b.len() {
            if let Ok(v) = u8::from_str_radix(&s[i + 1..i + 3], 16) {
                out.push(v);
                i += 3;
                continue;
            }
        }
        out.push(b[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}

// ── Meldung, Fallgatter, Aufbewahrung ───────────────────────────────────────────────────────────
//
// Rechtsgrundlage und Texte: siehe Datenschutzerklärung, Abschnitt „Sicherheitsprotokoll“.
// IP-Adresse, Standort und Provider eines Treffers gehören zur Selbstverteidigung (Art. 6 Abs. 1 lit. f
// DSGVO) und werden nach `RETENTION_DAYS` Tagen gelöscht.

const RETENTION_DAYS: i64 = 30;
/// Fallgatter: ab diesem Punktestand pro Stunde wird die Adresse für `BAN_HOURS` Stunden gesperrt.
const BAN_SCORE: u32 = 3;
const BAN_HOURS: u64 = 24;

fn clean(s: &str, max: usize) -> String {
    s.chars().filter(|c| !c.is_control()).take(max).collect()
}

fn is_ip(s: &str) -> bool {
    s.parse::<std::net::IpAddr>().is_ok()
}

/// Eigene Adressen (ZBook, Kolonie) werden nie gesperrt und sammeln keine Punkte. Ein Eintrag ist eine
/// exakte IP oder ein IPv6-Präfix mit Doppelpunkt am Ende (`2001:db8:1:2:`), weil IPv6-Adressen durch
/// Privacy Extensions wechseln.
fn allowlisted(ip: &str) -> bool {
    std::env::var("TRAP_ALLOW_IPS")
        .map(|v| allow_matches(&v, ip))
        .unwrap_or(false)
}

fn allow_matches(list: &str, ip: &str) -> bool {
    list.split(',').map(str::trim).filter(|a| !a.is_empty()).any(|a| {
        a == ip || (a.ends_with(':') && ip.starts_with(a))
    })
}

struct Limiter {
    seen: HashMap<String, Instant>,
    window_start: Instant,
    window_count: u32,
}

static LIMITER: OnceLock<Mutex<Limiter>> = OnceLock::new();

/// Gleicher Treffer (IP + Pfad) höchstens alle 15 Minuten, insgesamt höchstens 30 Meldungen pro Stunde.
/// Ein Scanner mit 5000 Requests erzeugt so eine Handvoll Pings, keine Flut.
fn allow_ping(key: String) -> bool {
    let lim = LIMITER.get_or_init(|| Mutex::new(Limiter {
        seen: HashMap::new(), window_start: Instant::now(), window_count: 0,
    }));
    let Ok(mut l) = lim.lock() else { return false };
    let now = Instant::now();
    if now.duration_since(l.window_start) > Duration::from_secs(3600) {
        l.window_start = now;
        l.window_count = 0;
    }
    l.seen.retain(|_, t| now.duration_since(*t) < Duration::from_secs(900));
    if l.seen.contains_key(&key) || l.window_count >= 30 {
        return false;
    }
    l.seen.insert(key, now);
    l.window_count += 1;
    true
}

#[derive(Default)]
struct Gate {
    /// IP -> Sperre bis
    bans: HashMap<String, Instant>,
    /// IP -> (Zeitpunkt, Punkte) der letzten Stunde
    score: HashMap<String, Vec<(Instant, u32)>>,
    /// IP -> Versuche seit der Sperre
    repeats: HashMap<String, u32>,
    /// IP -> letzte Wiederholer-Meldung
    repeat_ping: HashMap<String, Instant>,
}

static GATE: OnceLock<Mutex<Gate>> = OnceLock::new();

fn gate() -> &'static Mutex<Gate> {
    GATE.get_or_init(|| Mutex::new(Gate::default()))
}

/// Zählt einen Versuch einer gesperrten IP. Gibt (Versuche gesamt, ob jetzt gemeldet wird) zurück.
/// Gemeldet wird pro IP höchstens alle 30 Minuten, sonst würde ein Scanner mit 5000 Requests fluten.
fn note_repeat(ip: &str) -> (u32, bool) {
    let Ok(mut g) = gate().lock() else { return (0, false) };
    let now = Instant::now();
    let n = { let c = g.repeats.entry(ip.to_string()).or_insert(0); *c += 1; *c };
    let due = g.repeat_ping.get(ip).map_or(true, |t| now.duration_since(*t) >= Duration::from_secs(1800));
    if due { g.repeat_ping.insert(ip.to_string(), now); }
    (n, due)
}

fn is_banned(ip: &str) -> bool {
    let Ok(mut g) = gate().lock() else { return false };
    let now = Instant::now();
    match g.bans.get(ip) {
        Some(until) if *until > now => true,
        Some(_) => { g.bans.remove(ip); g.repeats.remove(ip); g.repeat_ping.remove(ip); false }
        None => false,
    }
}

/// Bucht Punkte und gibt (Punkte der letzten Stunde, Sperre ausgelöst) zurück.
fn add_score(ip: &str, points: u32) -> (u32, bool) {
    let Ok(mut g) = gate().lock() else { return (0, false) };
    let now = Instant::now();
    let hist = g.score.entry(ip.to_string()).or_default();
    hist.retain(|(t, _)| now.duration_since(*t) < Duration::from_secs(3600));
    hist.push((now, points));
    let total: u32 = hist.iter().map(|(_, p)| p).sum();
    if total >= BAN_SCORE {
        g.score.remove(ip);
        g.bans.insert(ip.to_string(), now + Duration::from_secs(BAN_HOURS * 3600));
        return (total, true);
    }
    (total, false)
}

/// Standort und Provider über ipwho.is (HTTPS, ohne Schlüssel). Fehler ergeben nur „unbekannt“.
async fn geo_lookup(ip: &str) -> String {
    let Ok(client) = reqwest::Client::builder().timeout(Duration::from_secs(3)).build() else { return "unbekannt".into() };
    let Ok(res) = client.get(format!("https://ipwho.is/{ip}")).send().await else { return "unbekannt".into() };
    let Ok(v) = res.json::<serde_json::Value>().await else { return "unbekannt".into() };
    if v.get("success").and_then(|x| x.as_bool()) != Some(true) {
        return "unbekannt".into();
    }
    let g = |k: &str| v.get(k).and_then(|x| x.as_str()).unwrap_or("").to_string();
    let conn = v.get("connection");
    let c = |k: &str| conn.and_then(|c| c.get(k)).and_then(|x| x.as_str()).unwrap_or("").to_string();
    let asn = conn.and_then(|c| c.get("asn")).and_then(|x| x.as_u64()).map(|n| format!("AS{n}")).unwrap_or_default();
    let (city, country) = (g("city"), g("country"));
    let place = [city, country].into_iter().filter(|p| !p.is_empty()).collect::<Vec<_>>().join(", ");
    // isp und org sind oft identisch, dann nur einmal.
    let (isp, org) = (c("isp"), c("org"));
    let provider = if org.is_empty() || org == isp { isp } else { format!("{isp} / {org}") };
    let net = [provider, asn].into_iter().filter(|p| !p.is_empty()).collect::<Vec<_>>().join(" · ");
    match (place.is_empty(), net.is_empty()) {
        (true, true) => "unbekannt".into(),
        (false, true) => place,
        (true, false) => net,
        (false, false) => format!("{place} · {net}"),
    }
}

/// Lesbare Überschrift zur internen Art („köder:.env“, „angriff:scanner:sqlmap“).
fn headline(kind: &str) -> (String, &'static str) {
    let (typ, rest) = kind.split_once(':').unwrap_or((kind, ""));
    match typ {
        "köder" => (format!("Köder {rest}"), "◆"),
        "angriff" => {
            let label = match rest.split_once(':') {
                Some(("scanner", tool)) => format!("Scanner {tool}"),
                Some(("method", m)) => format!("Ungewöhnliche Methode {m}"),
                _ => match rest {
                    "sql-injection" => "SQL-Injection".to_string(),
                    "xss" => "Script-Einschleusung (XSS)".to_string(),
                    "log4shell" => "Log4Shell".to_string(),
                    "path-traversal" => "Pfad-Traversal".to_string(),
                    "lfi" => "Datei-Einbindung (LFI)".to_string(),
                    "php-injection" => "PHP-Einschleusung".to_string(),
                    "command-injection" => "Befehls-Einschleusung".to_string(),
                    other => other.to_string(),
                },
            };
            (format!("Angriff: {label}"), "▲")
        }
        _ => (kind.to_string(), "◇"),
    }
}

async fn ping_ntfy(title: String, body: String, tags: &'static str, priority: &'static str) {
    let Ok(topic) = std::env::var("TRAP_NTFY_TOPIC") else { return };
    if topic.is_empty() { return; }
    let Ok(client) = reqwest::Client::builder().timeout(Duration::from_secs(5)).build() else { return };
    let _ = client
        .post(format!("https://ntfy.sh/{topic}"))
        .header("Title", title)
        .header("Tags", tags)
        .header("Priority", priority)
        .body(body)
        .send()
        .await;
}

// ── Middleware ──────────────────────────────────────────────────────────────────────────────────

fn plain(status: u16, body: &str) -> Response {
    let mut res = (
        StatusCode::from_u16(status).unwrap_or(StatusCode::OK),
        [(header::CONTENT_TYPE, "text/plain; charset=utf-8")],
        body.to_string(),
    ).into_response();
    res.headers_mut().insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
    res
}

const BERGFRIED: &str = "\
        |>>>                    |>>>
        |                       |
    _  _|_  _               _  _|_  _
   | |_| |_| |             | |_| |_| |
   \\  .      /             \\ .    .  /
    \\    ,  /               \\      . /
     |.    .|_  _  _  _  _  _|.   ,  |
     |      |_||_||_||_||_||_|      .|
     |  ,   |                |  ,    |
     |______|________________|_______|

Das Fallgatter ist unten. Deine Adresse steht im Protokoll.
Die Burg bleibt zu, die Zugbrücke ebenfalls.
Kontakt für Irrtümer: security@rfi-irfos.com";

pub async fn guard(State(state): State<AppState>, req: Request, next: Next) -> Response {
    let method = req.method().clone();
    let path = req.uri().path().to_string();
    let query = req.uri().query().unwrap_or("").to_string();
    let ua = req.headers().get(header::USER_AGENT).and_then(|h| h.to_str().ok()).unwrap_or("").to_string();
    // Nur der Header des Fly-Proxys zählt. X-Forwarded-For kann ein Angreifer fälschen und damit
    // fremde Adressen sperren lassen.
    let ip = req.headers().get("fly-client-ip").and_then(|h| h.to_str().ok()).unwrap_or("").trim().to_string();
    let ip = if is_ip(&ip) { ip } else { String::new() };

    if !ip.is_empty() && !allowlisted(&ip) && is_banned(&ip) {
        let (tries, due) = note_repeat(&ip);
        if due {
            let (db, ip, m) = (state.db.clone(), ip.clone(), method.to_string());
            let (path_c, ua_c) = (clean(&path, 120), clean(&ua, 80));
            tokio::spawn(async move {
                let geo = geo_lookup(&ip).await;
                let _ = sqlx::query("INSERT INTO trap_hits (kind,method,path,user_agent,ip,geo,fake,banned) VALUES (?1,?2,?3,?4,?5,?6,0,0)")
                    .bind(format!("wiederholer:{tries}")).bind(&m).bind(&path_c).bind(&ua_c).bind(&ip).bind(&geo)
                    .execute(&db).await;
                let ua_show = if ua_c.is_empty() { "(leer)".to_string() } else { ua_c };
                let body = format!(
                    "◈ {ip}\n⌖ {geo}\n▤ {m} {path_c}\n⚙ {ua_show}\n◷ {tries} Versuche seit der Sperre, Mauer hält"
                );
                ping_ntfy("♜ Bergfried: Wiederholer an der Mauer".to_string(), body, "bergfried", "default").await;
            });
        }
        return plain(403, BERGFRIED);
    }

    let (kind, fake, points, response, line, fake_head) = match classify(&method, &path, &query, &ua) {
        Verdict::Pass => return next.run(req).await,
        Verdict::Egg(e) => {
            tracing::info!("easter egg: {path}");
            return plain(e.status, e.body);
        }
        Verdict::Bait(b) => {
            let line = pick_line();
            let body = b.fake.map(|f| format!("{f}\n{line}")).unwrap_or_else(|| line.to_string());
            let head = b.fake.and_then(|f| f.lines().find(|l| !l.trim().is_empty())).unwrap_or("").to_string();
            (format!("köder:{}", b.kind), b.fake.is_some(), if b.fake.is_some() { 2 } else { 1 }, plain(200, &body), line, head)
        }
        Verdict::Attack(k) => {
            let line = pick_line();
            (format!("angriff:{k}"), false, 3, plain(200, line), line, String::new())
        }
    };

    let (path_c, ua_c) = (clean(&path, 120), clean(&ua, 80));
    let ip_log = if ip.is_empty() { "unbekannt".to_string() } else { ip.clone() };
    tracing::warn!("trap hit {kind} {method} {path_c} ua={ua_c} ip={ip_log}");

    let (score, banned) = if ip.is_empty() || allowlisted(&ip) { (0, false) } else { add_score(&ip, points) };
    let ping = allow_ping(format!("{ip_log}|{path_c}")) || banned;

    // Standortabfrage und Protokoll laufen im Hintergrund, die Antwort an den Angreifer wartet nicht.
    let db = state.db.clone();
    let m = method.to_string();
    tokio::spawn(async move {
        let geo = if ip.is_empty() { "unbekannt".to_string() } else { geo_lookup(&ip).await };
        let _ = sqlx::query("INSERT INTO trap_hits (kind,method,path,user_agent,ip,geo,fake,banned) VALUES (?1,?2,?3,?4,?5,?6,?7,?8)")
            .bind(&kind).bind(&m).bind(&path_c).bind(&ua_c).bind(&ip_log).bind(&geo).bind(fake).bind(banned)
            .execute(&db).await;
        let (what, icon) = headline(&kind);
        let ua_show = if ua_c.is_empty() { "(leer)".to_string() } else { ua_c.clone() };
        let card = |lines: &[(&str, String)]| lines.iter().map(|(i, t)| format!("{i} {t}")).collect::<Vec<_>>().join("\n");
        // Der Spruch kann mehrzeilig sein (Urkunde, Flagge). Die Karte zeigt nur die erste Zeile.
        let said = clean(line.lines().find(|l| !l.trim().is_empty()).unwrap_or(""), 140);
        if ping {
            let verdict = if fake { "Fake-Datei ausgeliefert, er hat gelesen" } else { "Nur einen Spruch bekommen" };
            let mut rows = vec![
                ("◎", what.clone()),
                ("▤", format!("{m} {path_c}")),
                ("◈", ip_log.clone()),
                ("⌖", geo.clone()),
                ("⚙", ua_show.clone()),
                ("▣", verdict.to_string()),
            ];
            if !fake_head.is_empty() {
                rows.push(("▧", format!("Inhalt: {}", clean(&fake_head, 100))));
            }
            rows.push(("❝", format!("Spruch: {said}")));
            rows.push(("◐", format!("{score} von {BAN_SCORE} Punkten, dann Sperre")));
            ping_ntfy(format!("{icon} Honeypot: {what}"), card(&rows), "honeypot", "high").await;
        }
        if banned {
            let body = card(&[
                ("◈", ip_log.clone()),
                ("⌖", geo.clone()),
                ("◎", format!("Auslöser: {what}")),
                ("▤", format!("{m} {path_c}")),
                ("⚙", ua_show),
                ("❝", format!("Spruch: {said}")),
                ("◷", format!("Gesperrt für {BAN_HOURS} Stunden ({score} Punkte)")),
                ("↺", "Aufheben: IP in TRAP_ALLOW_IPS oder Zeile in trap_hits mit banned=1 löschen".to_string()),
            ]);
            ping_ntfy("♜ Bergfried: IP ausgesperrt".to_string(), body, "bergfried", "urgent").await;
        }
    });
    response
}

pub async fn create_table(db: &sqlx::SqlitePool) {
    sqlx::query("CREATE TABLE IF NOT EXISTS trap_hits (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, method TEXT NOT NULL, path TEXT NOT NULL, user_agent TEXT NOT NULL DEFAULT '', ip TEXT NOT NULL DEFAULT '', geo TEXT NOT NULL DEFAULT '', fake BOOLEAN NOT NULL DEFAULT 0, banned BOOLEAN NOT NULL DEFAULT 0, created_at DATETIME NOT NULL DEFAULT (datetime('now')))")
        .execute(db).await.ok();
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_trap_created ON trap_hits(created_at)").execute(db).await.ok();
    // Fly stoppt die Maschine im Leerlauf. Sperren der letzten 24 Stunden kommen aus dem Protokoll zurück.
    if let Ok(rows) = sqlx::query_scalar::<_, String>(
        "SELECT DISTINCT ip FROM trap_hits WHERE banned = 1 AND created_at > datetime('now', '-24 hours')",
    ).fetch_all(db).await {
        if let Ok(mut g) = gate().lock() {
            let until = Instant::now() + Duration::from_secs(BAN_HOURS * 3600);
            for ip in rows.into_iter().filter(|ip| is_ip(ip)) {
                g.bans.insert(ip, until);
            }
        }
    }
}

/// Löscht Treffer nach `RETENTION_DAYS` Tagen. Beim Start und danach alle 6 Stunden.
pub fn spawn_retention(db: sqlx::SqlitePool) {
    tokio::spawn(async move {
        loop {
            let _ = sqlx::query("DELETE FROM trap_hits WHERE created_at < datetime('now', ?1)")
                .bind(format!("-{RETENTION_DAYS} days")).execute(&db).await;
            tokio::time::sleep(Duration::from_secs(6 * 3600)).await;
        }
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    fn kind(m: Method, p: &str, q: &str, ua: &str) -> String {
        match classify(&m, p, q, ua) {
            Verdict::Pass => "pass".into(),
            Verdict::Egg(e) => format!("egg:{}", e.paths[0]),
            Verdict::Bait(b) => format!("bait:{}", b.kind),
            Verdict::Attack(k) => format!("attack:{k}"),
        }
    }

    #[test]
    fn real_routes_pass() {
        assert_eq!(kind(Method::GET, "/", "", "Mozilla/5.0"), "pass");
        assert_eq!(kind(Method::POST, "/api/contact", "", "Mozilla/5.0"), "pass");
        assert_eq!(kind(Method::GET, "/robots.txt", "", "Mozilla/5.0"), "pass");
        assert_eq!(kind(Method::GET, "/assets/index-abc.js", "", "Mozilla/5.0"), "pass");
    }

    #[test]
    fn eggs_baits_and_attacks() {
        assert_eq!(kind(Method::GET, "/teapot", "", ""), "egg:/teapot");
        assert_eq!(kind(Method::GET, "/KONAMI", "", ""), "egg:/secret");
        assert_eq!(kind(Method::GET, "/.env", "", ""), "bait:.env");
        assert_eq!(kind(Method::GET, "/wp-login.php", "", ""), "bait:wp-login");
        assert_eq!(kind(Method::GET, "/", "", "sqlmap/1.7"), "attack:scanner:sqlmap");
        assert_eq!(kind(Method::GET, "/", "q=1%20UNION%20SELECT%20x", ""), "attack:sql-injection");
        assert_eq!(kind(Method::GET, "/", "x=${jndi:ldap://a}", ""), "attack:log4shell");
        assert_eq!(kind(Method::GET, "/a/../../etc", "", ""), "attack:path-traversal");
        assert_eq!(kind(Method::TRACE, "/", "", ""), "attack:method:TRACE");
    }

    #[test]
    fn fallgatter_bans_after_score() {
        assert_eq!(add_score("198.51.100.1", 1), (1, false));
        assert_eq!(add_score("198.51.100.1", 1), (2, false));
        assert_eq!(add_score("198.51.100.1", 1), (3, true));
        assert!(is_banned("198.51.100.1"));
        assert!(!is_banned("198.51.100.2"));
        // ein schwerer Treffer genügt
        assert_eq!(add_score("198.51.100.3", 3), (3, true));
    }

    #[test]
    fn headlines_are_readable() {
        assert_eq!(headline("köder:.env").0, "Köder .env");
        assert_eq!(headline("angriff:scanner:sqlmap").0, "Angriff: Scanner sqlmap");
        assert_eq!(headline("angriff:sql-injection").0, "Angriff: SQL-Injection");
        assert_eq!(headline("angriff:method:TRACE").0, "Angriff: Ungewöhnliche Methode TRACE");
    }

    #[test]
    fn allowlist_matches_exact_and_prefix() {
        let l = "89.144.199.197, 2001:4bb8:13b:286c:";
        assert!(allow_matches(l, "89.144.199.197"));
        assert!(allow_matches(l, "2001:4bb8:13b:286c:1:2:3:4"));
        assert!(!allow_matches(l, "89.144.199.19"));
        assert!(!allow_matches(l, "2001:4bb8:13b:286d:1:2:3:4"));
        assert!(!allow_matches("", "1.2.3.4"));
    }

    #[test]
    fn only_valid_ips_count() {
        assert!(is_ip("203.0.113.7"));
        assert!(is_ip("2001:db8::1"));
        assert!(!is_ip("1.2.3.4, 5.6.7.8"));
    }

    #[test]
    fn rare_lines_exist() {
        assert!(URKUNDE.contains("Hartnäckigster") || URKUNDE.contains("HARTNÄCKIGSTER"));
        assert!(LINES.len() >= 40);
    }
}
