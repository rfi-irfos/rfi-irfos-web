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
        {slug === 'impressum'   && <Impressum />}
        {slug === 'datenschutz' && <Datenschutz />}
        {slug === 'agb'         && <AGB />}
        {slug === 'security'    && <Security />}
        {!['impressum', 'datenschutz', 'agb', 'security'].includes(slug) && (
          <p style={P}>Seite nicht gefunden.</p>
        )}
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)', fontFamily: 'monospace', fontSize: 10, color: '#404058' }}>
          RFI-IRFOS &nbsp;&middot;&nbsp; ZVR 1015608684 &nbsp;&middot;&nbsp; GISA 39261441 &nbsp;&middot;&nbsp; GLN 9110038490191 &nbsp;&middot;&nbsp; Steuernummer 68 028/0989 &nbsp;&middot;&nbsp; Elisabethinergasse 25/10, 8020 Graz
        </div>
      </div>
    </div>
  )
}

function Impressum() {
  return <>
    <h1 style={H1}>Impressum</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Angaben gemäß § 5 ECG (E-Commerce-Gesetz, Österreich)</p>

    <h2 style={H2}>Betreiber</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Research Focus Institute — Interdisciplinary Research Facility for Open Sciences</strong><br />
      Kurzbezeichnung: RFI-IRFOS<br />
      Elisabethinergasse 25/10, 8020 Graz, Österreich<br />
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a><br />
      Website: <a href="https://rfi-irfos.com" style={A}>rfi-irfos.com</a>
    </p>

    <h2 style={H2}>Register &amp; Gewerbedaten</h2>
    <p style={P}>
      Rechtsform: Eingetragener Verein (gemeinnützig, reguliertes Not-for-Profit)<br />
      ZVR-Zahl: 1015608684<br />
      GISA-Zahl: 39261441<br />
      GLN: 9110038490191<br />
      Steuernummer: 68 028/0989<br />
      Gewerbewortlaut: Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik<br />
      Berufsrecht: Gewerbeordnung (GewO) &middot; WKO-Mitglied<br />
      ECG-Behörde gem. § 5 Abs. 1 Z 5 ECG: Magistrat der Stadt Graz<br />
      Gewerbeanmeldung: 19.03.2026
    </p>

    <h2 style={H2}>Gewerberechtliche Geschäftsführung</h2>
    <p style={P}>Simeon-Andreas Johann Manfred Kepp</p>

    <h2 style={H2}>Hinweis gemäß EU-VO 524/2013 (ODR)</h2>
    <p style={P}>
      Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{' '}
      <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" style={A}>ec.europa.eu/consumers/odr</a>.<br />
      Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen, da wir ausschließlich mit Unternehmern kontrahieren.
    </p>

    <h2 style={H2}>Haftungsausschluss</h2>
    <p style={P}>Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität kann keine Gewähr übernommen werden.</p>

    <h2 style={H2}>Urheberrecht</h2>
    <p style={P}>Alle durch RFI-IRFOS erstellten Inhalte unterliegen dem österreichischen Urheberrecht. Vervielfältigung oder Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.</p>

    <h2 style={H2}>Anwendbares Recht</h2>
    <p style={P}>Es gilt das Recht der Republik Österreich sowie das Recht der Europäischen Union.</p>
  </>
}

function Datenschutz() {
  return <>
    <h1 style={H1}>Datenschutzerklärung</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Gemäß DSGVO (EU) 2016/679 · Stand: Juni 2026</p>

    <h2 style={H2}>Verantwortlicher</h2>
    <p style={P}>
      RFI-IRFOS (Research Focus Institute — Interdisciplinary Research Facility for Open Sciences)<br />
      Elisabethinergasse 25/10, 8020 Graz, Österreich<br />
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a>
    </p>

    <h2 style={H2}>Erhobene Daten</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Server-Logs:</strong> IP-Adresse, Zugriffszeitpunkt, URL, HTTP-Statuscode — durch GitHub Pages (GitHub, Inc., USA) sowie Fly.io (Superfly, Inc., USA) erhoben.<br />
      <strong style={{ color: '#e8e8f0' }}>Kontaktformular:</strong> Name, E-Mail, Betreff, Nachricht — übermittelt über Web3Forms (<a href="https://web3forms.com/privacy" target="_blank" rel="noopener" style={A}>web3forms.com/privacy</a>).<br />
      <strong style={{ color: '#e8e8f0' }}>Zahlungsdaten:</strong> Bei Käufen über die Website werden Zahlungsdaten (Kartendaten, E-Mail, Name) von <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> (354 Oyster Point Blvd, South San Francisco, CA 94080, USA) verarbeitet. RFI-IRFOS erhält keine Kartendaten. Datenschutzerklärung Stripe: <a href="https://stripe.com/privacy" target="_blank" rel="noopener" style={A}>stripe.com/privacy</a>.<br />
      <strong style={{ color: '#e8e8f0' }}>Besuchsstatistik:</strong> Anonymisiertes First-Party-Tracking via Lighthouse (selbst gehostet, Graz). Kein Drittanbieter-Tracking. Kein Remarketing.
    </p>

    <h2 style={H2}>Rechtsgrundlage</h2>
    <p style={P}>
      Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO): Zahlungsabwicklung, Kontaktanfragen.<br />
      Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO): Server-Logs zur Sicherheit und Fehleranalyse.
    </p>

    <h2 style={H2}>Auftragsverarbeiter</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> — Zahlungsabwicklung. Auftragsverarbeitungsvertrag (DPA) gemäß Art. 28 DSGVO abgeschlossen. Datenübermittlung in die USA auf Basis von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).<br />
      <strong style={{ color: '#e8e8f0' }}>GitHub, Inc.</strong> — Hosting Frontend (GitHub Pages). Datenübermittlung in die USA auf Basis von Standardvertragsklauseln.<br />
      <strong style={{ color: '#e8e8f0' }}>Superfly, Inc. (Fly.io)</strong> — Hosting Backend API. Datenübermittlung in die USA auf Basis von Standardvertragsklauseln.
    </p>

    <h2 style={H2}>Cookies</h2>
    <p style={P}>Diese Website verwendet keine Tracking-Cookies von Drittanbietern. Es werden keine Werbe- oder Analytics-Cookies gesetzt.</p>

    <h2 style={H2}>Aufbewahrung</h2>
    <p style={P}>Kontaktanfragen werden nach Abschluss der Kommunikation gelöscht, spätestens nach 7 Jahren gemäß österreichischer Aufbewahrungspflicht. Zahlungsbelege gemäß § 132 BAO 7 Jahre.</p>

    <h2 style={H2}>Ihre Rechte (Art. 15–21 DSGVO)</h2>
    <p style={P}>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a></p>

    <h2 style={H2}>Beschwerderecht</h2>
    <p style={P}>Österreichische Datenschutzbehörde: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener" style={A}>dsb.gv.at</a></p>
  </>
}

function AGB() {
  return <>
    <h1 style={H1}>Allgemeine Geschäftsbedingungen</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>RFI-IRFOS &middot; Stand: Juni 2026</p>

    <h2 style={H2}>1. Geltungsbereich — Ausschließlich B2B</h2>
    <p style={P}>
      Diese AGB gelten für alle Dienstleistungen von RFI-IRFOS (ZVR 1015608684, Elisabethinergasse 25/10, 8020 Graz) — insbesondere Sicherheitsaudits, Softwareentwicklung und Forschungsleistungen.<br /><br />
      Dieses Angebot richtet sich <strong style={{ color: '#e8e8f0' }}>ausschließlich an Unternehmer</strong> i.S.d. § 1 Abs. 2 KSchG. Vertragsabschlüsse mit Verbrauchern im Sinne des KSchG sind ausgeschlossen. Mit Bestellung bestätigt der Auftraggeber, im Rahmen seiner gewerblichen oder beruflichen Tätigkeit zu handeln.
    </p>

    <h2 style={H2}>2. Leistungserbringung</h2>
    <p style={P}>Umfang und Konditionen werden schriftlich vereinbart. Website-Beschreibungen und Preisangaben sind keine verbindlichen Angebote.</p>

    <h2 style={H2}>3. Preise &amp; Zahlung</h2>
    <p style={P}>
      Preise in Euro zzgl. gesetzlicher Umsatzsteuer. Zahlung erfolgt <strong style={{ color: '#e8e8f0' }}>vollständig im Voraus (Upfront)</strong> vor Leistungsbeginn — ausschließlich über die auf der Website angebotenen Zahlungsmethoden (Stripe).<br /><br />
      Mit Zahlungseingang beginnt die Leistungserbringung <strong style={{ color: '#e8e8f0' }}>unmittelbar</strong>. Der Auftraggeber stimmt dem Sofortbeginn ausdrücklich zu. Ein Widerrufsrecht besteht daher nicht (§ 18 Abs. 1 Z 1 FAGG). Eine Stornierung oder Rückerstattung ist nach Zahlungseingang ausgeschlossen.
    </p>

    <h2 style={H2}>4. Vertraulichkeit &amp; NDA</h2>
    <p style={P}>Sicherheitsaudit-Findings unterliegen bis zur koordinierten Offenlegung (90-Tage-Embargo, ISO/IEC 29147) strikter Vertraulichkeit. Regulierungsbehörden werden unabhängig vom NDA-Status im Rahmen unserer gesetzlichen Meldepflichten informiert.</p>

    <h2 style={H2}>5. Haftung</h2>
    <p style={P}>Haftung beschränkt sich auf Vorsatz und grobe Fahrlässigkeit. Maximale Haftung: Rechnungswert der jeweiligen Leistung. Folgeschäden sind ausgeschlossen, soweit gesetzlich zulässig.</p>

    <h2 style={H2}>6. Geistiges Eigentum</h2>
    <p style={P}>Berichte, Quellcode und Forschungsoutput bleiben bis zur vollständigen Zahlung Eigentum von RFI-IRFOS. Nach Zahlungseingang erhält der Auftraggeber die vereinbarten Nutzungsrechte.</p>

    <h2 style={H2}>7. Anwendbares Recht &amp; Gerichtsstand</h2>
    <p style={P}>Österreichisches Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand: Graz, Österreich.</p>

    <h2 style={H2}>8. Online-Streitbeilegung (ODR)</h2>
    <p style={P}>
      EU-Plattform zur Online-Streitbeilegung: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" style={A}>ec.europa.eu/consumers/odr</a>.<br />
      Da wir ausschließlich mit Unternehmern kontrahieren, sind wir nicht zur Teilnahme an Verbraucherschlichtungsverfahren verpflichtet.
    </p>

    <h2 style={H2}>9. Kontakt</h2>
    <p style={P}><a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a></p>
  </>
}

function Security() {
  return <>
    <h1 style={H1}>Security Policy</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Coordinated Disclosure &middot; ISO/IEC 29147</p>

    <h2 style={H2}>Reporting a Vulnerability</h2>
    <p style={P}>
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a><br />
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
