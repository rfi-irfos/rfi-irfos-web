const TEAL = '#00f5c4'
const BASE = { background: '#070711', color: '#e8e8f0', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', padding: '80px 2rem' }
const PROSE = { maxWidth: 720, margin: '0 auto', lineHeight: 1.8 }
const H1 = { fontSize: 32, fontWeight: 900, marginBottom: 8, color: '#e8e8f0' }
const H2: React.CSSProperties = { fontSize: 12, fontWeight: 800, marginTop: 32, marginBottom: 8, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace' }
const P = { color: '#a0a0b8', fontSize: 14, marginBottom: 12 }
const A = { color: TEAL, textDecoration: 'none' }

import React from 'react'

export function LegalPage({ slug }: { slug: string }) {
  return (
    <div style={BASE}>
      <div style={PROSE}>
        <div style={{ marginBottom: 40 }}>
          <a href="/" style={{ ...A, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            &larr; rfi-irfos.com
          </a>
        </div>
        {slug === 'impressum' && <Impressum />}
        {slug === 'datenschutz' && <Datenschutz />}
        {slug === 'agb' && <AGB />}
        {slug === 'security' && <Security />}
        {!['impressum', 'datenschutz', 'agb', 'security'].includes(slug) && (
          <p style={P}>Seite nicht gefunden.</p>
        )}
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)', fontFamily: 'monospace', fontSize: 10, color: '#404058' }}>
          RFI-IRFOS &nbsp;&middot;&nbsp; ZVR 1015608684 &nbsp;&middot;&nbsp; GISA 39261441 &nbsp;&middot;&nbsp; Steuernummer 68 028/0989 &nbsp;&middot;&nbsp; Elisabethinergasse 25/10, 8020 Graz
        </div>
      </div>
    </div>
  )
}

function Impressum() {
  return <>
    <h1 style={H1}>Impressum</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Angaben gemäß §5 ECG (Österreich)</p>

    <h2 style={H2}>Betreiber</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Research Focus Institute — Interdisciplinary Research Facility for Open Sciences</strong><br />
      Kurzbezeichnung: RFI-IRFOS<br />
      Elisabethinergasse 25/10, 8020 Graz, Austria<br />
      E-Mail: <a href="mailto:contact@ternlang.com" style={A}>contact@ternlang.com</a><br />
      Website: <a href="https://rfi-irfos.com" style={A}>rfi-irfos.com</a> &nbsp;&middot;&nbsp; <a href="https://ternlang.com" style={A}>ternlang.com</a>
    </p>

    <h2 style={H2}>Rechtliches</h2>
    <p style={P}>
      Rechtsform: Eingetragener Verein (gemeinnützig, reguliertes Not-for-Profit)<br />
      ZVR-Zahl: 1015608684<br />
      GISA-Zahl: 39261441<br />
      Steuernummer: 68 028/0989<br />
      Gewerbe: Automatische Datenverarbeitung (WKO &middot; GewO § 32)<br />
      Gewerbebehörde: Magistrat der Stadt Graz<br />
      Gewerbeanmeldung: 19.03.2026
    </p>

    <h2 style={H2}>Verantwortliche Personen</h2>
    <p style={P}>
      Simeon Kepp — Geschäftsführung, Head of Research &amp; ML Systems<br />
      Zabih Karumi — Head of Engineering
    </p>

    <h2 style={H2}>Haftungsausschluss</h2>
    <p style={P}>Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und Aktualität kann keine Gewähr übernommen werden.</p>

    <h2 style={H2}>Urheberrecht</h2>
    <p style={P}>Alle durch RFI-IRFOS erstellten Inhalte unterliegen dem österreichischen Urheberrecht. Vervielfältigung oder Verwertung außerhalb des Urheberrechts bedürfen der schriftlichen Zustimmung.</p>

    <h2 style={H2}>Anwendbares Recht</h2>
    <p style={P}>Es gilt das Recht der Republik Österreich sowie das Recht der Europäischen Union.</p>
  </>
}

function Datenschutz() {
  return <>
    <h1 style={H1}>Datenschutzerklärung</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Gemäß DSGVO (EU) 2016/679</p>

    <h2 style={H2}>Verantwortlicher</h2>
    <p style={P}>
      RFI-IRFOS (Research Focus Institute — Interdisciplinary Research Facility for Open Sciences)<br />
      Elisabethinergasse 25/10, 8020 Graz, Austria<br />
      E-Mail: <a href="mailto:contact@ternlang.com" style={A}>contact@ternlang.com</a>
    </p>

    <h2 style={H2}>Erhobene Daten</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Server-Logs:</strong> IP-Adresse, Zugriffszeitpunkt, URL, HTTP-Statuscode — durch GitHub Pages (GitHub, Inc., USA) erhoben.<br />
      <strong style={{ color: '#e8e8f0' }}>Kontaktformular:</strong> Name, E-Mail, Thema, Nachricht — übermittelt über Web3Forms (<a href="https://web3forms.com/privacy" target="_blank" rel="noopener" style={A}>web3forms.com/privacy</a>).<br />
      <strong style={{ color: '#e8e8f0' }}>Besuchsstatistik:</strong> Anonymisiertes First-Party-Tracking via Lighthouse (selbst gehostet in Graz). Kein Drittanbieter-Tracking. Kein Remarketing.
    </p>

    <h2 style={H2}>Zweck der Verarbeitung</h2>
    <p style={P}>Kontaktdaten werden ausschließlich zur Beantwortung von Anfragen und Anbahnung von Kooperationen verwendet. Keine Weitergabe zu Werbezwecken.</p>

    <h2 style={H2}>Hosting</h2>
    <p style={P}>
      GitHub Pages (GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA).<br />
      Datenschutzerklärung: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener" style={A}>docs.github.com/privacy</a>
    </p>

    <h2 style={H2}>Cookies</h2>
    <p style={P}>Diese Website verwendet keine Tracking-Cookies von Drittanbietern.</p>

    <h2 style={H2}>Aufbewahrung</h2>
    <p style={P}>Kontaktanfragen werden nach Abschluss der Kommunikation gelöscht, spätestens nach 7 Jahren gemäß österreichischer Aufbewahrungspflicht.</p>

    <h2 style={H2}>Ihre Rechte (Art. 15–21 DSGVO)</h2>
    <p style={P}>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch: <a href="mailto:contact@ternlang.com" style={A}>contact@ternlang.com</a></p>

    <h2 style={H2}>Beschwerderecht</h2>
    <p style={P}>Österreichische Datenschutzbehörde: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener" style={A}>dsb.gv.at</a></p>
  </>
}

function AGB() {
  return <>
    <h1 style={H1}>Allgemeine Geschäftsbedingungen</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>RFI-IRFOS &middot; Stand: Juni 2026</p>

    <h2 style={H2}>1. Geltungsbereich</h2>
    <p style={P}>Diese AGB gelten für alle Dienstleistungen von RFI-IRFOS (ZVR 1015608684, Elisabethinergasse 25/10, 8020 Graz) — insbesondere Sicherheitsaudits, Softwareentwicklung und Forschungsleistungen.</p>

    <h2 style={H2}>2. Leistungserbringung</h2>
    <p style={P}>Umfang und Konditionen werden schriftlich vereinbart. Website-Beschreibungen und Preisangaben sind keine verbindlichen Angebote.</p>

    <h2 style={H2}>3. Preise &amp; Zahlung</h2>
    <p style={P}>Preise in Euro gemäß Angebot zzgl. gesetzlicher Umsatzsteuer. Zahlungsziel: 14 Tage. Bei Verzug: 8 % Verzugszinsen p.a.</p>

    <h2 style={H2}>4. Vertraulichkeit &amp; NDA</h2>
    <p style={P}>Sicherheitsaudit-Findings unterliegen bis zur koordinierten Offenlegung (90-Tage-Embargo, ISO/IEC 29147) strikter Vertraulichkeit. Regulierungsbehörden werden unabhängig vom NDA-Status im Rahmen unserer Meldepflichten informiert.</p>

    <h2 style={H2}>5. Haftung</h2>
    <p style={P}>Haftung beschränkt sich auf Vorsatz und grobe Fahrlässigkeit. Maximale Haftung: Rechnungswert der jeweiligen Leistung. Folgeschäden sind ausgeschlossen, soweit gesetzlich zulässig.</p>

    <h2 style={H2}>6. Stornierung</h2>
    <p style={P}>Bis 14 Tage vor Leistungsbeginn: kostenfrei. Danach: 50 % des Entgelts. Nach Leistungsbeginn: voller Rechnungsbetrag fällig.</p>

    <h2 style={H2}>7. Geistiges Eigentum</h2>
    <p style={P}>Berichte, Quellcode und Forschungsoutput bleiben bis zur vollständigen Zahlung Eigentum von RFI-IRFOS. Nach Zahlung erhält der Auftraggeber die vereinbarten Nutzungsrechte.</p>

    <h2 style={H2}>8. Anwendbares Recht &amp; Gerichtsstand</h2>
    <p style={P}>Österreichisches Recht. Gerichtsstand: Graz, Österreich.</p>

    <h2 style={H2}>9. Kontakt</h2>
    <p style={P}><a href="mailto:contact@ternlang.com" style={A}>contact@ternlang.com</a></p>
  </>
}

function Security() {
  return <>
    <h1 style={H1}>Security Policy</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Coordinated Disclosure &middot; ISO/IEC 29147</p>

    <h2 style={H2}>Reporting a Vulnerability</h2>
    <p style={P}>
      E-Mail: <a href="mailto:contact@ternlang.com" style={A}>contact@ternlang.com</a><br />
      PGP key available on request. We acknowledge all reports within 48 hours.
    </p>

    <h2 style={H2}>Our Disclosure Framework</h2>
    <p style={P}>90-day coordinated embargo from initial notification to public disclosure. Regulators (DSB, EDPB, CERT.at) notified in parallel. Extensions considered case-by-case.</p>

    <h2 style={H2}>Scope</h2>
    <p style={P}>rfi-irfos.com &middot; ternlang.com &middot; lighthouse-rfi-irfos.fly.dev &middot; github.com/rfi-irfos/*</p>

    <h2 style={H2}>Out of Scope</h2>
    <p style={P}>Social engineering, physical attacks, DoS/DDoS. We do not operate a bug bounty program.</p>

    <h2 style={H2}>Hall of Fame</h2>
    <p style={P}>Responsible reporters credited publicly (with consent) in our disclosure reports.</p>
  </>
}
