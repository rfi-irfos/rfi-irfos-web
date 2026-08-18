const BASE = { background: '#070711', color: '#e8e8f0', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', padding: '80px 2rem' }
const PROSE = { maxWidth: 720, margin: '0 auto', lineHeight: 1.8 }
const H1 = { fontSize: 32, fontWeight: 900, marginBottom: 8, color: '#e8e8f0' }
const H2: React.CSSProperties = { fontSize: 12, fontWeight: 800, marginTop: 32, marginBottom: 8, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace' }
const P = { color: '#a0a0b8', fontSize: 14, marginBottom: 12 }
const A = { color: 'var(--accent-text)', textDecoration: 'none' }

import React, { useEffect, useRef } from 'react'
import { useLocale } from '../hooks/useLocale'

const LIGHTHOUSE_PIXEL = 'https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track/pixel.gif'
const LIGHTHOUSE_TRACK = 'https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track'

// Reached via a real URL (/impressum etc) or the #p/slug hash - either way the
// document still carries the homepage's shared <title>/description until we set
// our own, so a search result or a browser tab would otherwise show "RFI-IRFOS -
// Rethink the Obvious." for every one of these instead of what the page is.
// de/de-description are only set for the three pages that actually got a German
// translation (Impressum/Datenschutz/AGB, 2026-08-18) - the rest stay
// English-only, so the effect below falls back to the English pair for them
// regardless of locale.
const META: Record<string, { title: string; description: string; titleDe?: string; descriptionDe?: string }> = {
  impressum: {
    title: 'Legal Notice — RFI-IRFOS', description: 'Legal notice for RFI-IRFOS, a registered not-for-profit research institute in Graz, Austria — registry data, contact, and trade information.',
    titleDe: 'Impressum — RFI-IRFOS', descriptionDe: 'Impressum von RFI-IRFOS, einem eingetragenen, nicht gewinnorientierten Forschungsinstitut in Graz, Österreich — Registerdaten, Kontakt und Gewerbeinformationen.',
  },
  datenschutz: {
    title: 'Privacy Policy — RFI-IRFOS', description: 'How RFI-IRFOS handles data under GDPR: what we collect, our processors, and your rights. No cookies, no tracking, no ad network.',
    titleDe: 'Datenschutzerklärung — RFI-IRFOS', descriptionDe: 'Wie RFI-IRFOS mit Daten gemäß DSGVO umgeht: was wir erheben, unsere Auftragsverarbeiter und Ihre Rechte. Keine Cookies, kein Tracking, kein Werbenetzwerk.',
  },
  agb: {
    title: 'Terms and Conditions — RFI-IRFOS', description: 'General Terms and Conditions for RFI-IRFOS security audits, software development, and research services. B2B only.',
    titleDe: 'AGB — RFI-IRFOS', descriptionDe: 'Allgemeine Geschäftsbedingungen für Sicherheitsaudits, Softwareentwicklung und Forschungsleistungen von RFI-IRFOS. Ausschließlich B2B.',
  },
  security: { title: 'Security Policy — RFI-IRFOS', description: "RFI-IRFOS's coordinated vulnerability disclosure policy: ISO/IEC 29147, 90-day embargo, regulator notification, safe harbor for good-faith research." },
  standards: { title: 'Standards & Compliance — RFI-IRFOS', description: 'The regulatory frameworks RFI-IRFOS audits against: NIS-2, GDPR, EU AI Act, DSA, ISO/IEC 29147/30111/27001, and more.' },
  team: { title: 'Team — RFI-IRFOS', description: "The people behind RFI-IRFOS's security research, disclosure, and ternary AI work." },
  methodology: { title: 'Methodology — RFI-IRFOS', description: "The four principles governing RFI-IRFOS's research: sources, methods, handling results, and disclosure — the same rules regardless of who's paying." },
}

export function LegalPage({ slug }: { slug: string }) {
  const footerRef = useRef<HTMLDivElement>(null)
  const { locale, setLocale } = useLocale()

  useEffect(() => {
    const meta = META[slug]
    if (!meta) return
    document.title = (locale === 'de' && meta.titleDe) ? meta.titleDe : meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', (locale === 'de' && meta.descriptionDe) ? meta.descriptionDe : meta.description)
  }, [slug, locale])

  // Same privacy-safe mechanism as the main site's section tracker: an in-memory-only
  // IntersectionObserver, no cookie/localStorage, no visitor id. This one watches the
  // footer identity block at the bottom of every legal/security page, so we can see
  // (in aggregate only, never per-visitor) whether people actually read to the end of
  // these pages, not just that the page loaded.
  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    let fired = false
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || fired) continue
        fired = true
        fetch(LIGHTHOUSE_TRACK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: location.pathname, section: `legal-${slug}`, site: 'rfi-irfos' }),
        }).catch(() => {})
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [slug])

  // Only impressum/datenschutz/agb actually branch on locale (see each
  // function below) - the toggle still shows everywhere on this route for
  // consistency and because it's shared state with the homepage anyway, but
  // clicking it on e.g. /security or /team just doesn't change anything there.
  return (
    <div style={BASE}>
      <div style={PROSE}>
        {/* Glass card wrapping the whole page body (2026-08-18, live feedback:
            "wenigstens schaut sleek aus drunter si ne transparente glass box unter
            die texte") - .rfi-glass resolves against :root's dark token set even
            without a [data-theme] ancestor (LegalPage is always-dark, unlike
            PublicSite), so it's safe to use here unmodified. Backdrop-filter is
            fine on a single static wrapper - the "never on repeating content"
            rule is about the 311-row ledger/filmstrip re-sampling every scroll
            frame, not a one-off page shell. */}
        <div className="rfi-glass" style={{ borderRadius: 20, padding: '36px 40px' }}>
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a
            href="/"
            onClick={e => {
              // Reached via #p/slug (hash only, still on "/"): clearing the hash is
              // enough, no reload. Reached via a real path (/impressum etc, no hash):
              // that alone wouldn't change the URL, so fall through to the normal
              // href navigation instead of preventing it.
              if (!window.location.hash) return
              e.preventDefault()
              location.hash = ''
            }}
            style={{ ...A, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            &larr; rfi-irfos.com
          </a>
          <button
            onClick={() => setLocale(locale === 'de' ? 'en' : 'de')}
            title={locale === 'de' ? 'Language: German (click to switch)' : 'Sprache: Englisch (klicken zum Wechseln)'}
            style={{ ...A, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {locale === 'de' ? 'EN' : 'DE'}
          </button>
        </div>
        {slug === 'impressum'   && <Impressum />}
        {slug === 'datenschutz' && <Datenschutz />}
        {slug === 'agb'         && <AGB />}
        {slug === 'security'    && <Security />}
        {slug === 'standards'   && <Standards />}
        {slug === 'team'        && <Team />}
        {slug === 'methodology' && <Methodology />}
        {!['impressum', 'datenschutz', 'agb', 'security', 'standards', 'team', 'methodology'].includes(slug) && (
          <p style={P}>Seite nicht gefunden.</p>
        )}
        <div ref={footerRef} style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)', fontFamily: 'monospace', fontSize: 10, color: '#7a7aa0' }}>
          RFI-IRFOS &nbsp;&middot;&nbsp; ZVR 1015608684 &nbsp;&middot;&nbsp; GISA 39261441 &nbsp;&middot;&nbsp; GLN 9110038490191 &nbsp;&middot;&nbsp; UID ATU83405245 &nbsp;&middot;&nbsp; Steuernummer 68 696/8736 &nbsp;&middot;&nbsp; Elisabethinergasse 25/10, 8020 Graz
        </div>
        </div>
        {/* Lighthouse monitoring pixel — page-view only, same mechanism disclosed in the privacy policy below */}
        <img src={`${LIGHTHOUSE_PIXEL}?site=rfi-irfos&p=${encodeURIComponent(`/${slug}`)}&r=${encodeURIComponent(document.referrer)}`}
          alt="" width="1" height="1" style={{ display: 'none' }} />
      </div>
    </div>
  )
}

// Impressum/Datenschutz/AGB (2026-08-18): these three carry actual legal weight
// for an Austrian audience under § 5 ECG / GDPR / KSchG, so they got real German
// translations rather than staying English-only like Security/Standards/Team/
// Methodology. Each function below branches on locale and renders one of two
// sibling components - kept as separate EN/DE components rather than one JSX
// tree with inline ternaries per line, since a legal text is exactly the kind
// of content where "which language is this sentence in" needs to be visually
// obvious while editing, not inferred from a ternary.
function Impressum() {
  const { locale } = useLocale()
  return locale === 'de' ? <ImpressumDE /> : <ImpressumEN />
}

function ImpressumEN() {
  return <>
    <h1 style={H1}>Legal Notice</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>Disclosure pursuant to § 5 ECG (Austrian E-Commerce Act) &middot; Last updated: July 2026</p>

    <p style={P}>
      We publish under our own name, at a real street address, because coordinated disclosure only works if the institute doing it can be found, verified, and held to account — the same standard we hold everyone we audit to. Most of what follows on this page exists because the law requires it. A few lines exist because we think a legal notice page shouldn't feel like the one part of a website that nobody proofread.
    </p>

    <h2 style={H2}>Operator</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Research Focus Institute — Interdisciplinary Research Facility for Open Sciences</strong><br />
      Short name: RFI-IRFOS<br />
      Elisabethinergasse 25/10, 8020 Graz, Austria<br />
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a><br />
      Website: <a href="https://rfi-irfos.com" style={A}>rfi-irfos.com</a>
    </p>

    <h2 style={H2}>What We Actually Do</h2>
    <p style={P}>
      In case a legal notice page is the first page you ever land on: RFI-IRFOS is a regulated not-for-profit research institute working in security research, GDPR-focused root level code analysis of Android applications, and open-source AI/ternary-computing research. We are not a marketing agency, not a law firm, and not a bug-bounty platform, whatever a stray search result might have implied.
    </p>

    <h2 style={H2}>Register &amp; Trade Data</h2>
    <p style={P}>
      Legal form: Registered association (regulated not-for-profit)<br />
      ZVR number (Austrian Central Register of Associations): 1015608684<br />
      GISA number (Trade Register): 39261441<br />
      GLN: 9110038490191<br />
      VAT ID (UID): ATU83405245<br />
      Tax number: 68 696/8736<br />
      Trade description: Services in automatic data processing and information technology<br />
      Governing trade law: Austrian Trade Regulation Act (Gewerbeordnung, GewO) &middot; WKO member (Austrian Federal Economic Chamber)<br />
      Competent authority pursuant to § 5(1)(5) ECG: Magistrate of the City of Graz<br />
      Trade registered: 19 March 2026
    </p>
    <p style={P}>
      All figures above are checkable against the public register, not just asserted here. That is deliberate: a legal notice that can't survive being cross-referenced against its own registry is not much of a legal notice.
    </p>

    <h2 style={H2}>Trade-Law Management</h2>
    <p style={P}>Simeon-Andreas Johann Manfred Kepp, responsible under Austrian trade law (GewO) for the licensed activity listed above.</p>

    <h2 style={H2}>Notice Pursuant to EU Regulation 524/2013 (ODR)</h2>
    <p style={P}>
      The European Commission provides a platform for online dispute resolution:{' '}
      <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" style={A}>ec.europa.eu/consumers/odr</a>.<br />
      We are neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board, as we contract exclusively with businesses. This is not us dodging accountability, it is the accurate legal consequence of running a B2B-only operation (see our Terms).
    </p>

    <h2 style={H2}>Disclaimer</h2>
    <p style={P}>
      The content of this website has been prepared with the greatest care. No liability is assumed for its accuracy, completeness, or currency. Where we link externally, for example to a regulator, a standard, or a piece of coverage about one of our disclosures, we do not control and are not responsible for that external content once you leave rfi-irfos.com.
    </p>

    <h2 style={H2}>Third-Party Names &amp; Trademarks</h2>
    <p style={P}>
      Company names, product names, app names, and trademarks referenced anywhere on this site, in our security research, or in our public disclosure ledger belong to their respective owners. Their appearance here documents that we examined their software; it does not imply endorsement, partnership, or affiliation in either direction.
    </p>

    <h2 style={H2}>Copyright</h2>
    <p style={P}>All content created by RFI-IRFOS is subject to Austrian copyright law. Reproduction or use beyond the limits of copyright law requires written consent. Quoting our disclosure findings with attribution, in the ordinary course of reporting on them, is fine, that is rather the point of publishing them.</p>

    <h2 style={H2}>Governing Law</h2>
    <p style={P}>The law of the Republic of Austria and the law of the European Union apply.</p>

    <h2 style={H2}>External Profiles</h2>
    <p style={P}>
      We publish our research and code openly. You can find us at:
    </p>
    <ul style={{ ...P, paddingLeft: 18, marginBottom: 16 }}>
      <li><strong style={{ color: '#e8e8f0' }}>OSF:</strong> <a href="https://osf.io/rzvyg" target="_blank" rel="noopener" style={A}>osf.io/rzvyg</a> — all research publications and preprints.</li>
      <li><strong style={{ color: '#e8e8f0' }}>GitHub:</strong> <a href="https://github.com/rfi-irfos" target="_blank" rel="noopener" style={A}>github.com/rfi-irfos</a> — open-source tools, models, and audit repositories.</li>
      <li><strong style={{ color: '#e8e8f0' }}>LinkedIn:</strong> <a href="https://linkedin.com/company/rfi-irfos" target="_blank" rel="noopener" style={A}>RFI-IRFOS</a> — institute presence and announcements.</li>
    </ul>
  </>
}

function ImpressumDE() {
  return <>
    <h1 style={H1}>Impressum</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>Offenlegung gemäß § 5 ECG (E-Commerce-Gesetz) &middot; Letzte Aktualisierung: Juli 2026</p>

    <p style={P}>
      Wir veröffentlichen unter eigenem Namen, mit einer echten Anschrift, weil koordinierte Offenlegung nur funktioniert, wenn das Institut, das sie durchführt, selbst auffindbar, überprüfbar und zur Verantwortung ziehbar ist — genau der Maßstab, den wir an jeden anlegen, den wir prüfen. Das meiste auf dieser Seite steht hier, weil es das Gesetz verlangt. Ein paar Zeilen stehen hier, weil wir finden, dass ein Impressum nicht der eine Teil einer Website sein sollte, den niemand Korrektur gelesen hat.
    </p>

    <h2 style={H2}>Betreiber</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Research Focus Institute — Interdisciplinary Research Facility for Open Sciences</strong><br />
      Kurzbezeichnung: RFI-IRFOS<br />
      Elisabethinergasse 25/10, 8020 Graz, Österreich<br />
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a><br />
      Website: <a href="https://rfi-irfos.com" style={A}>rfi-irfos.com</a>
    </p>

    <h2 style={H2}>Was wir tatsächlich tun</h2>
    <p style={P}>
      Falls ein Impressum die erste Seite ist, auf der Sie je landen: RFI-IRFOS ist ein reguliertes, nicht gewinnorientiertes Forschungsinstitut im Bereich Sicherheitsforschung, DSGVO-fokussierter Root-Level-Codeanalyse von Android-Anwendungen und Open-Source-KI-/Ternärrechen-Forschung. Wir sind keine Marketingagentur, keine Anwaltskanzlei und keine Bug-Bounty-Plattform, was ein vereinzeltes Suchergebnis auch immer nahelegen mag.
    </p>

    <h2 style={H2}>Register- &amp; Gewerbedaten</h2>
    <p style={P}>
      Rechtsform: Eingetragener Verein (reguliert, nicht gewinnorientiert)<br />
      ZVR-Zahl (Zentrales Vereinsregister): 1015608684<br />
      GISA-Zahl (Gewerbeinformationssystem Austria): 39261441<br />
      GLN: 9110038490191<br />
      UID-Nummer: ATU83405245<br />
      Steuernummer: 68 696/8736<br />
      Gewerbewortlaut: Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik<br />
      Anzuwendendes Gewerberecht: Österreichische Gewerbeordnung (GewO) &middot; Mitglied der Wirtschaftskammer Österreich (WKO)<br />
      Behörde gemäß § 5 Abs. 1 Z 5 ECG: Magistrat der Stadt Graz<br />
      Gewerbeanmeldung: 19. März 2026
    </p>
    <p style={P}>
      Alle obigen Angaben sind gegen das öffentliche Register nachprüfbar, nicht nur hier behauptet. Das ist Absicht: Ein Impressum, das einen Abgleich mit seinem eigenen Register nicht überlebt, ist kein besonders gutes Impressum.
    </p>

    <h2 style={H2}>Gewerberechtliche Geschäftsführung</h2>
    <p style={P}>Simeon-Andreas Johann Manfred Kepp, verantwortlich nach der österreichischen Gewerbeordnung (GewO) für die oben angeführte, angemeldete Tätigkeit.</p>

    <h2 style={H2}>Hinweis gemäß EU-Verordnung 524/2013 (OS)</h2>
    <p style={P}>
      Die Europäische Kommission stellt eine Plattform für Online-Streitbeilegung bereit:{' '}
      <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" style={A}>ec.europa.eu/consumers/odr</a>.<br />
      Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen, da wir ausschließlich mit Unternehmen kontrahieren. Das ist kein Ausweichen vor Verantwortung, sondern die zutreffende rechtliche Folge eines reinen B2B-Geschäfts (siehe unsere AGB).
    </p>

    <h2 style={H2}>Haftungsausschluss</h2>
    <p style={P}>
      Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität wird keine Haftung übernommen. Soweit wir extern verlinken, etwa auf eine Behörde, eine Norm oder eine Berichterstattung zu einer unserer Offenlegungen, haben wir auf diese externen Inhalte keinen Einfluss und übernehmen dafür keine Verantwortung, sobald Sie rfi-irfos.com verlassen.
    </p>

    <h2 style={H2}>Fremde Namen &amp; Marken</h2>
    <p style={P}>
      Firmennamen, Produktnamen, App-Namen und Marken, die irgendwo auf dieser Website, in unserer Sicherheitsforschung oder in unserem öffentlichen Offenlegungsregister genannt werden, gehören ihren jeweiligen Inhabern. Ihre Nennung hier dokumentiert, dass wir die betreffende Software untersucht haben; sie impliziert weder Billigung noch Partnerschaft noch Zugehörigkeit in irgendeiner Richtung.
    </p>

    <h2 style={H2}>Urheberrecht</h2>
    <p style={P}>Alle von RFI-IRFOS erstellten Inhalte unterliegen dem österreichischen Urheberrecht. Vervielfältigung oder Nutzung über die Grenzen des Urheberrechts hinaus bedarf unserer schriftlichen Zustimmung. Das Zitieren unserer Offenlegungsergebnisse mit Quellenangabe, im gewöhnlichen Rahmen der Berichterstattung darüber, ist ausdrücklich in Ordnung — das ist ja der Sinn der Veröffentlichung.</p>

    <h2 style={H2}>Anwendbares Recht</h2>
    <p style={P}>Es gilt das Recht der Republik Österreich sowie das Recht der Europäischen Union.</p>

    <h2 style={H2}>Externe Profile</h2>
    <p style={P}>
      Wir veröffentlichen unsere Forschung und unseren Code offen. Sie finden uns unter:
    </p>
    <ul style={{ ...P, paddingLeft: 18, marginBottom: 16 }}>
      <li><strong style={{ color: '#e8e8f0' }}>OSF:</strong> <a href="https://osf.io/rzvyg" target="_blank" rel="noopener" style={A}>osf.io/rzvyg</a> — sämtliche Forschungspublikationen und Preprints.</li>
      <li><strong style={{ color: '#e8e8f0' }}>GitHub:</strong> <a href="https://github.com/rfi-irfos" target="_blank" rel="noopener" style={A}>github.com/rfi-irfos</a> — Open-Source-Werkzeuge, Modelle und Audit-Repositories.</li>
      <li><strong style={{ color: '#e8e8f0' }}>LinkedIn:</strong> <a href="https://linkedin.com/company/rfi-irfos" target="_blank" rel="noopener" style={A}>RFI-IRFOS</a> — institutionelle Präsenz und Ankündigungen.</li>
    </ul>
  </>
}

function Datenschutz() {
  const { locale } = useLocale()
  return locale === 'de' ? <DatenschutzDE /> : <DatenschutzEN />
}

function DatenschutzEN() {
  return <>
    <h1 style={H1}>Privacy Policy</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>Pursuant to the GDPR (EU) 2016/679 &middot; Last updated: July 2026</p>

    <p style={P}>
      This page has every section a privacy policy is supposed to have. We just refuse to pad any of them with the vague language that usually fills them, because we spend our working hours pointing out exactly that vague language in other people's apps. So: full sections, plain claims, and where a claim is checkable, we tell you how to check it.
    </p>

    <h2 style={H2}>Data Controller</h2>
    <p style={P}>
      RFI-IRFOS (Research Focus Institute — Interdisciplinary Research Facility for Open Sciences)<br />
      Elisabethinergasse 25/10, 8020 Graz, Austria<br />
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a>
    </p>

    <h2 style={H2}>Data We Collect</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Server logs:</strong> IP address, access timestamp, URL, HTTP status code — collected by GitHub Pages (GitHub, Inc., USA) and Fly.io (Superfly, Inc., USA) as an unavoidable side effect of any request reaching a web server anywhere.<br />
      <strong style={{ color: '#e8e8f0' }}>Contact form:</strong> name, email, subject, message — submitted via Web3Forms (<a href="https://web3forms.com/privacy" target="_blank" rel="noopener" style={A}>web3forms.com/privacy</a>), only if you fill it in and press send.<br />
      <strong style={{ color: '#e8e8f0' }}>Payment data:</strong> for purchases made through the website, payment data (card details, email, name) is processed by <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> (354 Oyster Point Blvd, South San Francisco, CA 94080, USA). RFI-IRFOS never receives or stores your card data. Stripe's privacy policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener" style={A}>stripe.com/privacy</a>.<br />
      <strong style={{ color: '#e8e8f0' }}>Visit statistics:</strong> one self-hosted tracking pixel (Lighthouse, Graz) that logs a page view and a referrer, on every page including this one. On this legal/security page family specifically, we also log, in aggregate only, whether a visit scrolled all the way to the footer at the bottom of the page, the same in-memory, no-cookie mechanism as the section counters described in "Cookies" below, applied here to answer one question: are these pages actually being read to the end. On the homepage specifically, we also log, once per visit and in aggregate only, whether your browser's developer tools appear to be open (a passive window-size check, no timing tricks) — this exists purely because we left a message in the console for anyone who looks, and we're curious how often anyone actually does. No cookie, no device fingerprint, no cross-site identifier. See "Cookies" below for the unglamorous truth about what that pixel actually is.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>What we do not collect,</strong> for the avoidance of doubt: no location data, no device fingerprinting, no advertising ID, no biometric data, no cross-site profile, nothing sold or shared with a data broker, nothing handed to an ad network, because there is no ad network on the other end of anything on this site.
    </p>

    <h2 style={H2}>Legal Basis</h2>
    <p style={P}>
      Performance of a contract (Art. 6(1)(b) GDPR): payment processing, contact inquiries.<br />
      Legitimate interest (Art. 6(1)(f) GDPR): server logs for security and error analysis, and the single anonymized page-view pixel described above.
    </p>

    <h2 style={H2}>Processors</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> — payment processing. Data Processing Agreement (DPA) concluded pursuant to Art. 28 GDPR. Data transferred to the USA on the basis of Standard Contractual Clauses (Art. 46(2)(c) GDPR).<br />
      <strong style={{ color: '#e8e8f0' }}>GitHub, Inc.</strong> — frontend hosting (GitHub Pages). Data transferred to the USA on the basis of Standard Contractual Clauses.<br />
      <strong style={{ color: '#e8e8f0' }}>Superfly, Inc. (Fly.io)</strong> — backend API hosting, including the Lighthouse tracking pixel endpoint. Data transferred to the USA on the basis of Standard Contractual Clauses.<br />
      <strong style={{ color: '#e8e8f0' }}>Web3Forms</strong> — contact form delivery only, invoked only when you submit the form.
    </p>

    <h2 style={H2}>International Transfers</h2>
    <p style={P}>
      Where a processor above is US-based, the transfer runs on Standard Contractual Clauses (Art. 46(2)(c) GDPR) rather than an adequacy decision. We list this plainly rather than burying it in a "may transfer data internationally" clause, because that phrase is doing a lot of quiet work on most privacy pages.
    </p>

    <h2 style={H2}>Cookies</h2>
    <p style={P}>
      We don't use cookies. Here is the part every privacy policy is expected to have, done as an actual answer instead of a checkbox. The standard four categories, quoted the way they usually get phrased, and our real answer underneath each one:
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>"Strictly necessary cookies, required for the website to function and cannot be switched off."</strong><br />
      We have none. Open your browser's dev tools, Application tab, Cookies, on this exact page, right now. It will be empty. Nothing is being "switched off" because nothing was ever switched on.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>"Functional cookies, used to remember your preferences."</strong><br />
      We do let you pick a light, dark, or high-contrast theme and a language, and we do remember that choice, in <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>localStorage</code>, not a cookie. It never leaves your device, carries no identifier, and is not readable by us.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>"Performance / analytics cookies, used to understand how visitors use our site."</strong><br />
      This is usually where the actual tracking lives, and this is usually the one place a privacy policy goes vague. We won't. This site loads a single 1&times;1 pixel image, self-hosted, no cookie, no consent needed for it because a cookie-consent requirement (ePrivacy Art. 5(3)) attaches to storing or reading something on <em>your</em> device, and this pixel never does either. Each page load sends exactly this, the literal tag that is live on this page right now, copy it and inspect it yourself:
    </p>
    <div style={{ background: '#0c0c16', border: '1px solid rgba(0,245,196,0.2)', borderRadius: 6, padding: '12px 16px', margin: '8px 0 16px 0', overflowX: 'auto' }}>
      <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-text)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {'<img src="https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track/pixel.gif?site=rfi-irfos&p={page-path}&r={referrer}&utm_source={utm}" width="1" height="1" alt="" style="display:none">'}
      </code>
    </div>
    <p style={P}>
      What lands in our database from that request: the page path, the referring domain normalized into a channel bucket ("organic search", "direct", "referral", "linkedin", and so on, so we can tell a board member where visitors come from), and the site tag. That's it, in full: <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>path, source, referrer, utm_source, utm_medium, utm_campaign, site</code>. No IP address column exists in that table. No visitor-ID field is ever populated by this site's copy of the pixel, so two visits from the same person land as two independent, unlinked rows, not one growing profile. Full source, backend included: <a href="https://github.com/rfi-irfos/rfi-irfos-web" target="_blank" rel="noopener" style={A}>github.com/rfi-irfos/rfi-irfos-web</a>. We are not asking you to trust a sentence, we are pointing at the code that either does or doesn't match it.
    </p>
    <p style={P}>
      One more signal lands the same way: which section of this single-scrolling-page site came into view during your visit (the disclosure ledger, pricing, the tip-submission form, and so on), stored as one more anonymous <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>section</code> column on the same table. This is a hit-counter, not a viewer log — "the ledger section was seen 214 times today," never "visitor X looked at the ledger." The page keeps a plain JavaScript variable in memory so scrolling up and down past a section doesn't count it twice; that variable is never written to a cookie, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>localStorage</code>, or <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>sessionStorage</code>, and is gone the instant the page reloads. Same reasoning as the pixel above: nothing is stored on your device, so the ePrivacy consent trigger never applies, and nothing here identifies you, so it isn't personal data to begin with.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>"Targeting / advertising cookies, used to build a profile of your interests."</strong><br />
      We run no ads, have no ad account, and have nothing to target you with even if we wanted to. There is no third party on the other side of this site who would pay for that profile.
    </p>
    <p style={P}>
      We could have shipped a cookie banner with a satisfying "Accept All" button anyway, because everyone expects one. We didn't, because a consent banner implies a decision is being made on your behalf, and there isn't one here to make. If that ever changes, this section changes with it, publicly, in the same commit history as everything else on this site.
    </p>

    <h2 style={H2}>Automated Decision-Making</h2>
    <p style={P}>None. We do not use profiling or automated decision-making that produces legal or similarly significant effects on you.</p>

    <h2 style={H2}>Retention</h2>
    <p style={P}>
      Contact inquiries are deleted once communication concludes, at the latest after 7 years per Austrian statutory retention rules. Payment receipts are retained for 7 years pursuant to § 132 BAO (Federal Fiscal Code). Server logs and pixel data are retained only as long as needed for security and traffic analysis, then rotated out.
    </p>

    <h2 style={H2}>Children's Privacy</h2>
    <p style={P}>This is a B2B research and disclosure site. It is not directed at children, and we do not knowingly collect data from anyone below the age required for consent under Art. 8 GDPR.</p>

    <h2 style={H2}>Your Rights (Art. 15–21 GDPR)</h2>
    <p style={P}>
      Access, rectification, erasure, restriction, data portability, and objection, all of it, at: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a>. Given what little we actually hold on any one person, most of these requests take us minutes, not weeks, to resolve.
    </p>

    <h2 style={H2}>Right to Lodge a Complaint</h2>
    <p style={P}>Austrian Data Protection Authority (Datenschutzbehörde): <a href="https://www.dsb.gv.at" target="_blank" rel="noopener" style={A}>dsb.gv.at</a></p>

    <h2 style={H2}>Changes to This Policy</h2>
    <p style={P}>Any change to what we actually collect gets reflected here first, with the "last updated" date above moved forward. We track changes to this page the same way we would expect anyone else to.</p>

    <h2 style={H2}>A Note on Consistency</h2>
    <p style={P}>We spend our research auditing other companies for exactly this kind of policy. This one describes what actually happens on this site, in the same evidence-first spirit — nothing here is aspirational, and the parts that are checkable are checkable by you, not just by us.</p>
  </>
}

function DatenschutzDE() {
  return <>
    <h1 style={H1}>Datenschutzerklärung</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>Gemäß DSGVO (EU) 2016/679 &middot; Letzte Aktualisierung: Juli 2026</p>

    <p style={P}>
      Diese Seite hat jeden Abschnitt, den eine Datenschutzerklärung haben soll. Wir weigern uns nur, sie mit der vagen Formulierung aufzublähen, die sie normalerweise füllt, weil wir unsere Arbeitszeit damit verbringen, genau diese vage Formulierung in fremden Apps aufzuzeigen. Also: vollständige Abschnitte, klare Aussagen, und wo eine Aussage nachprüfbar ist, sagen wir Ihnen, wie.
    </p>

    <h2 style={H2}>Verantwortlicher</h2>
    <p style={P}>
      RFI-IRFOS (Research Focus Institute — Interdisciplinary Research Facility for Open Sciences)<br />
      Elisabethinergasse 25/10, 8020 Graz, Österreich<br />
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a>
    </p>

    <h2 style={H2}>Welche Daten wir erheben</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Serverprotokolle:</strong> IP-Adresse, Zugriffszeitpunkt, URL, HTTP-Statuscode — erhoben von GitHub Pages (GitHub, Inc., USA) und Fly.io (Superfly, Inc., USA) als unvermeidbarer Nebeneffekt jeder Anfrage, die irgendeinen Webserver erreicht.<br />
      <strong style={{ color: '#e8e8f0' }}>Kontaktformular:</strong> Name, E-Mail, Betreff, Nachricht — übermittelt über Web3Forms (<a href="https://web3forms.com/privacy" target="_blank" rel="noopener" style={A}>web3forms.com/privacy</a>), nur wenn Sie es ausfüllen und absenden.<br />
      <strong style={{ color: '#e8e8f0' }}>Zahlungsdaten:</strong> Für Käufe über die Website werden Zahlungsdaten (Kartendetails, E-Mail, Name) von <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> verarbeitet (354 Oyster Point Blvd, South San Francisco, CA 94080, USA). RFI-IRFOS erhält oder speichert Ihre Kartendaten nie. Datenschutzerklärung von Stripe: <a href="https://stripe.com/privacy" target="_blank" rel="noopener" style={A}>stripe.com/privacy</a>.<br />
      <strong style={{ color: '#e8e8f0' }}>Besuchsstatistik:</strong> ein selbst gehosteter Tracking-Pixel (Lighthouse, Graz), der einen Seitenaufruf und einen Referrer protokolliert, auf jeder Seite einschließlich dieser. Speziell auf dieser Familie von Rechts-/Sicherheitsseiten protokollieren wir zusätzlich, nur aggregiert, ob ein Besuch bis zur Fußzeile am Ende der Seite gescrollt hat — derselbe speicherinterne, cookielose Mechanismus wie die im Abschnitt "Cookies" unten beschriebenen Abschnittszähler, hier angewendet, um eine Frage zu beantworten: Werden diese Seiten tatsächlich bis zum Ende gelesen? Speziell auf der Startseite protokollieren wir außerdem, einmal pro Besuch und nur aggregiert, ob die Entwicklertools Ihres Browsers offenbar geöffnet sind (eine passive Fenstergrößen-Prüfung, keine Timing-Tricks) — das existiert einzig, weil wir in der Konsole eine Nachricht für alle hinterlassen haben, die dort nachsehen, und uns interessiert, wie oft das tatsächlich jemand tut. Kein Cookie, kein Geräte-Fingerprint, kein websiteübergreifender Identifikator. Die unglamouröse Wahrheit darüber, was dieser Pixel tatsächlich ist, steht unter "Cookies" weiter unten.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Was wir nicht erheben,</strong> zur Klarstellung: keine Standortdaten, kein Geräte-Fingerprinting, keine Werbe-ID, keine biometrischen Daten, kein websiteübergreifendes Profil, nichts wird an einen Datenhändler verkauft oder weitergegeben, nichts geht an ein Werbenetzwerk, weil es auf der anderen Seite dieser Website kein Werbenetzwerk gibt.
    </p>

    <h2 style={H2}>Rechtsgrundlage</h2>
    <p style={P}>
      Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO): Zahlungsabwicklung, Kontaktanfragen.<br />
      Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO): Serverprotokolle zur Sicherheits- und Fehleranalyse, sowie der oben beschriebene einzelne, anonymisierte Seitenaufruf-Pixel.
    </p>

    <h2 style={H2}>Auftragsverarbeiter</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> — Zahlungsabwicklung. Auftragsverarbeitungsvertrag (DPA) gemäß Art. 28 DSGVO abgeschlossen. Datenübermittlung in die USA auf Grundlage von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).<br />
      <strong style={{ color: '#e8e8f0' }}>GitHub, Inc.</strong> — Frontend-Hosting (GitHub Pages). Datenübermittlung in die USA auf Grundlage von Standardvertragsklauseln.<br />
      <strong style={{ color: '#e8e8f0' }}>Superfly, Inc. (Fly.io)</strong> — Backend-API-Hosting, einschließlich des Lighthouse-Tracking-Pixel-Endpunkts. Datenübermittlung in die USA auf Grundlage von Standardvertragsklauseln.<br />
      <strong style={{ color: '#e8e8f0' }}>Web3Forms</strong> — ausschließlich Zustellung des Kontaktformulars, nur ausgelöst, wenn Sie das Formular absenden.
    </p>

    <h2 style={H2}>Internationale Datenübermittlung</h2>
    <p style={P}>
      Wo ein oben genannter Auftragsverarbeiter in den USA sitzt, läuft die Übermittlung über Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO), nicht über einen Angemessenheitsbeschluss. Wir schreiben das offen hin, statt es in einer Klausel wie "Daten können international übermittelt werden" zu verstecken, denn dieser Satz erledigt auf den meisten Datenschutzseiten eine Menge stille Arbeit.
    </p>

    <h2 style={H2}>Cookies</h2>
    <p style={P}>
      Wir verwenden keine Cookies. Hier ist der Teil, den jede Datenschutzerklärung haben soll, als echte Antwort statt als Checkbox. Die üblichen vier Kategorien, so formuliert, wie sie meist formuliert werden, und darunter jeweils unsere tatsächliche Antwort:
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>„Technisch notwendige Cookies, erforderlich für die Funktion der Website und nicht deaktivierbar."</strong><br />
      Wir haben keine. Öffnen Sie jetzt, auf genau dieser Seite, die Entwicklertools Ihres Browsers, Reiter Application, Cookies. Es wird leer sein. Nichts wird „deaktiviert", weil nie etwas aktiviert wurde.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>„Funktionale Cookies, zum Merken Ihrer Einstellungen."</strong><br />
      Sie können ein helles, dunkles oder kontrastreiches Theme sowie eine Sprache wählen, und wir merken uns diese Wahl — in <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>localStorage</code>, nicht in einem Cookie. Das verlässt nie Ihr Gerät, trägt keinen Identifikator und ist für uns nicht lesbar.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>„Performance-/Analyse-Cookies, um zu verstehen, wie Besucher unsere Website nutzen."</strong><br />
      Hier steckt normalerweise das eigentliche Tracking, und hier wird eine Datenschutzerklärung normalerweise vage. Wir nicht. Diese Website lädt ein einzelnes, selbst gehostetes 1×1-Pixelbild, kein Cookie, keine Einwilligung dafür nötig, weil die Cookie-Einwilligungspflicht (ePrivacy Art. 5 Abs. 3) am Speichern oder Auslesen von etwas auf <em>Ihrem</em> Gerät ansetzt, und dieser Pixel tut keines von beiden. Jeder Seitenaufruf sendet genau das, den wortwörtlichen Tag, der genau jetzt live auf dieser Seite liegt — kopieren Sie ihn und prüfen Sie ihn selbst:
    </p>
    <div style={{ background: '#0c0c16', border: '1px solid rgba(0,245,196,0.2)', borderRadius: 6, padding: '12px 16px', margin: '8px 0 16px 0', overflowX: 'auto' }}>
      <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-text)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {'<img src="https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track/pixel.gif?site=rfi-irfos&p={page-path}&r={referrer}&utm_source={utm}" width="1" height="1" alt="" style="display:none">'}
      </code>
    </div>
    <p style={P}>
      Was durch diese Anfrage in unserer Datenbank landet: der Seitenpfad, die verweisende Domain normalisiert auf einen Kanal ("organische Suche", "direkt", "Referral", "linkedin" und so weiter, damit wir einem Vorstandsmitglied sagen können, woher Besucher kommen) und das Site-Tag. Das ist alles, vollständig: <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>path, source, referrer, utm_source, utm_medium, utm_campaign, site</code>. Es gibt in dieser Tabelle keine IP-Adress-Spalte. Kein Besucher-ID-Feld wird von dieser Pixel-Kopie je befüllt, daher landen zwei Besuche derselben Person als zwei unabhängige, nicht verknüpfte Zeilen, nicht als ein wachsendes Profil. Vollständiger Quellcode, Backend inklusive: <a href="https://github.com/rfi-irfos/rfi-irfos-web" target="_blank" rel="noopener" style={A}>github.com/rfi-irfos/rfi-irfos-web</a>. Wir bitten Sie nicht, einem Satz zu vertrauen, wir zeigen auf den Code, der entweder dazu passt oder nicht.
    </p>
    <p style={P}>
      Ein weiteres Signal landet auf demselben Weg: welcher Abschnitt dieser einzelnen, scrollenden Seite während Ihres Besuchs sichtbar wurde (das Offenlegungsregister, Preise, das Hinweis-Formular und so weiter), gespeichert als eine weitere anonyme <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>section</code>-Spalte in derselben Tabelle. Das ist ein Zähler, kein Betrachtungsprotokoll — "der Registerabschnitt wurde heute 214 Mal gesehen", niemals "Besucher X hat sich das Register angesehen." Die Seite hält eine einfache JavaScript-Variable im Speicher, damit Hoch- und Herunterscrollen über einen Abschnitt ihn nicht doppelt zählt; diese Variable wird nie in ein Cookie, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>localStorage</code> oder <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 13 }}>sessionStorage</code> geschrieben und ist beim nächsten Laden der Seite sofort weg. Dieselbe Begründung wie beim Pixel oben: Auf Ihrem Gerät wird nichts gespeichert, daher greift der ePrivacy-Einwilligungstatbestand nie, und nichts davon identifiziert Sie, daher sind es von vornherein keine personenbezogenen Daten.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>„Targeting-/Werbe-Cookies, zum Erstellen eines Profils Ihrer Interessen."</strong><br />
      Wir schalten keine Werbung, haben kein Werbekonto und hätten nichts, womit wir Sie gezielt ansprechen könnten, selbst wenn wir wollten. Es gibt keinen Dritten auf der anderen Seite dieser Website, der für ein solches Profil bezahlen würde.
    </p>
    <p style={P}>
      Wir hätten trotzdem einen Cookie-Banner mit einem befriedigenden "Alle akzeptieren"-Knopf einbauen können, weil ihn jeder erwartet. Haben wir nicht, weil ein Einwilligungsbanner suggeriert, dass in Ihrem Namen eine Entscheidung getroffen wird, und hier gibt es keine zu treffen. Sollte sich das je ändern, ändert sich dieser Abschnitt mit — öffentlich, in derselben Commit-Historie wie alles andere auf dieser Website.
    </p>

    <h2 style={H2}>Automatisierte Entscheidungsfindung</h2>
    <p style={P}>Keine. Wir setzen kein Profiling und keine automatisierte Entscheidungsfindung ein, die rechtliche oder ähnlich bedeutsame Wirkung für Sie entfaltet.</p>

    <h2 style={H2}>Speicherdauer</h2>
    <p style={P}>
      Kontaktanfragen werden nach Abschluss der Kommunikation gelöscht, spätestens nach 7 Jahren gemäß österreichischen gesetzlichen Aufbewahrungsvorschriften. Zahlungsbelege werden gemäß § 132 BAO (Bundesabgabenordnung) 7 Jahre aufbewahrt. Serverprotokolle und Pixel-Daten werden nur so lange aufbewahrt, wie es für Sicherheits- und Traffic-Analyse nötig ist, und danach rotiert.
    </p>

    <h2 style={H2}>Datenschutz für Minderjährige</h2>
    <p style={P}>Dies ist eine B2B-Forschungs- und Offenlegungsseite. Sie richtet sich nicht an Kinder, und wir erheben wissentlich keine Daten von Personen unterhalb des nach Art. 8 DSGVO für die Einwilligung erforderlichen Alters.</p>

    <h2 style={H2}>Ihre Rechte (Art. 15–21 DSGVO)</h2>
    <p style={P}>
      Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch, alles davon, unter: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a>. Angesichts dessen, wie wenig wir tatsächlich über eine einzelne Person vorhalten, erledigen wir die meisten dieser Anfragen in Minuten, nicht in Wochen.
    </p>

    <h2 style={H2}>Beschwerderecht</h2>
    <p style={P}>Österreichische Datenschutzbehörde: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener" style={A}>dsb.gv.at</a></p>

    <h2 style={H2}>Änderungen dieser Erklärung</h2>
    <p style={P}>Jede Änderung dessen, was wir tatsächlich erheben, wird zuerst hier abgebildet, mit vorgezogenem "Letzte Aktualisierung"-Datum oben. Wir verfolgen Änderungen an dieser Seite nach demselben Maßstab, den wir von jedem anderen erwarten würden.</p>

    <h2 style={H2}>Ein Wort zur Konsistenz</h2>
    <p style={P}>Wir verbringen unsere Forschungszeit damit, andere Unternehmen genau für diese Art von Erklärung zu prüfen. Diese hier beschreibt, was auf dieser Website tatsächlich passiert, im selben evidenzbasierten Geist — nichts hier ist Wunschdenken, und die nachprüfbaren Teile sind von Ihnen nachprüfbar, nicht nur von uns.</p>
  </>
}

function AGB() {
  const { locale } = useLocale()
  return locale === 'de' ? <AGBDE /> : <AGBEN />
}

function AGBEN() {
  return <>
    <h1 style={H1}>General Terms and Conditions</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>RFI-IRFOS &middot; Last updated: July 2026</p>

    <p style={P}>
      Thirteen sections, no filler clause, nothing in here that exists only to look thorough. If a paragraph below feels short, that's because the short version was the accurate one.
    </p>

    <h2 style={H2}>1. Scope — B2B Only</h2>
    <p style={P}>
      These Terms apply to all services provided by RFI-IRFOS (ZVR 1015608684, Elisabethinergasse 25/10, 8020 Graz) — in particular security audits, software development, and research services.<br /><br />
      This offer is directed <strong style={{ color: '#e8e8f0' }}>exclusively at business entities</strong> within the meaning of § 1(2) of the Austrian Consumer Protection Act (KSchG). Contracts with consumers within the meaning of the KSchG are excluded. By placing an order, the client confirms that they are acting within the scope of their commercial or professional activity.
    </p>

    <h2 style={H2}>2. Service Delivery</h2>
    <p style={P}>Scope and terms are agreed in writing, per engagement, before work starts. Website descriptions and price listings on this site are indicative and do not constitute binding offers, actual scope is confirmed in writing with each client.</p>

    <h2 style={H2}>3. Pricing &amp; Payment</h2>
    <p style={P}>
      Prices are in Euro, plus statutory VAT. Payment is made <strong style={{ color: '#e8e8f0' }}>in full, upfront</strong>, before work begins — exclusively via the payment methods offered on the website (Stripe).<br /><br />
      Service delivery begins <strong style={{ color: '#e8e8f0' }}>immediately</strong> upon receipt of payment. The client expressly consents to this immediate commencement. Accordingly, no right of withdrawal exists (§ 18(1)(1) of the Austrian Distance and Off-Premises Contracts Act, FAGG). Cancellation or refund is excluded once payment has been received.
    </p>

    <h2 style={H2}>4. Confidentiality &amp; NDA</h2>
    <p style={P}>
      Security audit findings are subject to strict confidentiality until coordinated disclosure (90-day embargo, ISO/IEC 29147). Regulatory authorities are notified independently of NDA status, in fulfillment of our statutory reporting obligations. Our NDA covers the client's confidential material; it does not, and cannot, cover findings we are legally obliged to report to a supervisory authority.
    </p>

    <h2 style={H2}>5. Liability</h2>
    <p style={P}>Liability is limited to intent and gross negligence. Maximum liability: the invoice value of the respective service. Consequential damages are excluded to the extent permitted by law.</p>

    <h2 style={H2}>6. No Warranty of Completeness (Security Research)</h2>
    <p style={P}>Security and privacy assessments reflect the state of the audited system at the time of testing, within the depth of access and duration of the engagement. RFI-IRFOS does not warrant that all vulnerabilities have been identified. Anyone who tells you a security assessment is exhaustive is selling you something, and this is us saying so about our own reports too.</p>

    <h2 style={H2}>7. Intellectual Property</h2>
    <p style={P}>Reports, source code, and research output remain the property of RFI-IRFOS until payment is received in full. Upon receipt of payment, the client receives the agreed usage rights.</p>

    <h2 style={H2}>8. Communication</h2>
    <p style={P}>All engagement-related communication is conducted in writing (email), for the audit trail this creates on both sides. We do not offer or conduct calls or in-person meetings as part of our research or disclosure process.</p>

    <h2 style={H2}>9. Force Majeure</h2>
    <p style={P}>Neither party is liable for delay or failure to perform caused by circumstances beyond its reasonable control, provided the affected party notifies the other without undue delay.</p>

    <h2 style={H2}>10. Governing Law &amp; Jurisdiction</h2>
    <p style={P}>Austrian law applies, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). Place of jurisdiction: Graz, Austria.</p>

    <h2 style={H2}>11. Online Dispute Resolution (ODR)</h2>
    <p style={P}>
      EU platform for online dispute resolution: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" style={A}>ec.europa.eu/consumers/odr</a>.<br />
      As we contract exclusively with businesses, we are not obligated to participate in consumer arbitration proceedings.
    </p>

    <h2 style={H2}>12. Severability</h2>
    <p style={P}>Should any provision of these Terms be or become invalid, the validity of the remaining provisions shall remain unaffected.</p>

    <h2 style={H2}>13. Contact</h2>
    <p style={P}><a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a></p>

    <h2 style={H2}>14. Use of Revenue</h2>
    <p style={P}>
      100% of surplus revenue is reinvested into open science, public research, and infrastructure. Zero goes to shareholders — we have none. RFI-IRFOS is a regulated not-for-profit (ZVR 1015608684). Every euro above operating costs funds the next audit, the next model training run, or the next research publication. That is not a marketing line. It is a legal obligation.
    </p>
  </>
}

function AGBDE() {
  return <>
    <h1 style={H1}>Allgemeine Geschäftsbedingungen</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>RFI-IRFOS &middot; Letzte Aktualisierung: Juli 2026</p>

    <p style={P}>
      Vierzehn Abschnitte, keine Füllklausel, nichts hier, das nur existiert, um gründlich zu wirken. Wenn ein Absatz unten kurz wirkt, dann weil die kurze Fassung die zutreffende war.
    </p>

    <h2 style={H2}>1. Geltungsbereich — Ausschließlich B2B</h2>
    <p style={P}>
      Diese Bedingungen gelten für alle von RFI-IRFOS (ZVR 1015608684, Elisabethinergasse 25/10, 8020 Graz) erbrachten Leistungen — insbesondere Sicherheitsaudits, Softwareentwicklung und Forschungsleistungen.<br /><br />
      Dieses Angebot richtet sich <strong style={{ color: '#e8e8f0' }}>ausschließlich an Unternehmer</strong> im Sinne des § 1 Abs. 2 Konsumentenschutzgesetz (KSchG). Verträge mit Verbrauchern im Sinne des KSchG sind ausgeschlossen. Mit Erteilung eines Auftrags bestätigt der Kunde, im Rahmen seiner gewerblichen oder beruflichen Tätigkeit zu handeln.
    </p>

    <h2 style={H2}>2. Leistungserbringung</h2>
    <p style={P}>Umfang und Bedingungen werden schriftlich, pro Auftrag, vor Arbeitsbeginn vereinbart. Leistungsbeschreibungen und Preislisten auf dieser Website sind unverbindlich und stellen kein bindendes Angebot dar, der tatsächliche Leistungsumfang wird mit jedem Kunden schriftlich bestätigt.</p>

    <h2 style={H2}>3. Preise &amp; Zahlung</h2>
    <p style={P}>
      Preise verstehen sich in Euro, zuzüglich gesetzlicher Umsatzsteuer. Die Zahlung erfolgt <strong style={{ color: '#e8e8f0' }}>vollständig im Voraus</strong>, vor Arbeitsbeginn — ausschließlich über die auf der Website angebotenen Zahlungsmethoden (Stripe).<br /><br />
      Die Leistungserbringung beginnt <strong style={{ color: '#e8e8f0' }}>unmittelbar</strong> nach Zahlungseingang. Der Kunde stimmt diesem unmittelbaren Beginn ausdrücklich zu. Dementsprechend besteht kein Rücktrittsrecht (§ 18 Abs. 1 Z 1 Fern- und Auswärtsgeschäfte-Gesetz, FAGG). Stornierung oder Rückerstattung sind nach Zahlungseingang ausgeschlossen.
    </p>

    <h2 style={H2}>4. Vertraulichkeit &amp; Geheimhaltungsvereinbarung</h2>
    <p style={P}>
      Ergebnisse von Sicherheitsaudits unterliegen strenger Vertraulichkeit bis zur koordinierten Offenlegung (90-Tage-Embargo, ISO/IEC 29147). Aufsichtsbehörden werden unabhängig vom Status einer Geheimhaltungsvereinbarung benachrichtigt, in Erfüllung unserer gesetzlichen Meldepflichten. Unsere Geheimhaltungsvereinbarung deckt das vertrauliche Material des Kunden ab; sie deckt Befunde, zu deren Meldung an eine Aufsichtsbehörde wir gesetzlich verpflichtet sind, nicht ab und kann dies auch nicht.
    </p>

    <h2 style={H2}>5. Haftung</h2>
    <p style={P}>Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Höchsthaftung: der Rechnungswert der jeweiligen Leistung. Folgeschäden sind, soweit gesetzlich zulässig, ausgeschlossen.</p>

    <h2 style={H2}>6. Kein Vollständigkeitsanspruch (Sicherheitsforschung)</h2>
    <p style={P}>Sicherheits- und Datenschutzbewertungen spiegeln den Zustand des geprüften Systems zum Zeitpunkt der Prüfung wider, im Rahmen der Zugriffstiefe und Dauer des jeweiligen Auftrags. RFI-IRFOS gewährleistet nicht, dass alle Schwachstellen identifiziert wurden. Wer Ihnen sagt, eine Sicherheitsbewertung sei erschöpfend, verkauft Ihnen etwas — und das sagen wir hiermit auch über unsere eigenen Berichte.</p>

    <h2 style={H2}>7. Geistiges Eigentum</h2>
    <p style={P}>Berichte, Quellcode und Forschungsergebnisse bleiben Eigentum von RFI-IRFOS, bis die Zahlung vollständig eingegangen ist. Nach Zahlungseingang erhält der Kunde die vereinbarten Nutzungsrechte.</p>

    <h2 style={H2}>8. Kommunikation</h2>
    <p style={P}>Sämtliche auftragsbezogene Kommunikation erfolgt schriftlich (E-Mail), wegen des dadurch für beide Seiten entstehenden Nachweispfads. Wir bieten und führen keine Telefonate oder persönlichen Treffen im Rahmen unseres Forschungs- oder Offenlegungsprozesses durch.</p>

    <h2 style={H2}>9. Höhere Gewalt</h2>
    <p style={P}>Keine der Parteien haftet für Verzögerungen oder Nichterfüllung, die durch Umstände außerhalb ihrer zumutbaren Kontrolle verursacht werden, sofern die betroffene Partei die andere Partei unverzüglich benachrichtigt.</p>

    <h2 style={H2}>10. Anwendbares Recht &amp; Gerichtsstand</h2>
    <p style={P}>Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand: Graz, Österreich.</p>

    <h2 style={H2}>11. Online-Streitbeilegung (OS)</h2>
    <p style={P}>
      EU-Plattform für Online-Streitbeilegung: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" style={A}>ec.europa.eu/consumers/odr</a>.<br />
      Da wir ausschließlich mit Unternehmen kontrahieren, sind wir nicht verpflichtet, an Verfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
    </p>

    <h2 style={H2}>12. Salvatorische Klausel</h2>
    <p style={P}>Sollte eine Bestimmung dieser Bedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.</p>

    <h2 style={H2}>13. Kontakt</h2>
    <p style={P}><a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a></p>

    <h2 style={H2}>14. Verwendung der Einnahmen</h2>
    <p style={P}>
      100% des Überschusses werden in offene Wissenschaft, öffentliche Forschung und Infrastruktur reinvestiert. Null Prozent gehen an Anteilseigner — wir haben keine. RFI-IRFOS ist ein regulierter, nicht gewinnorientierter Verein (ZVR 1015608684). Jeder Euro über den Betriebskosten finanziert das nächste Audit, den nächsten Modelltrainingslauf oder die nächste Forschungspublikation. Das ist keine Marketingzeile. Das ist eine gesetzliche Verpflichtung.
    </p>
  </>
}

function Security() {
  return <>
    <h1 style={H1}>Security Policy</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>Coordinated Disclosure &middot; ISO/IEC 29147 &amp; ISO/IEC 30111</p>

    <h2 style={H2}>Our Method</h2>
    <p style={P}>
      We are a research institute, not a vendor chasing customers. We perform root level code analysis on publicly distributed software and disclose what we find - to the company, and to the regulator, at the same time. Here is what that means in practice, and why it holds up. We publish what we do; the specific techniques behind any single finding stay in the report we send the company, not on this page.
    </p>
    <ul style={{ ...P, paddingLeft: 18, marginBottom: 16 }}>
      <li><strong style={{ color: '#e8e8f0' }}>Free, unconditional disclosure.</strong> Public disclosure is Tier 1. It happens after the 90-day embargo, regardless of payment, regardless of reply. Nothing is held back for money.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Coordinated, not cold outreach.</strong> We follow ISO/IEC 29147. Supervisory authorities are CC'd from day one - visibly, not blind-copied, not informed only if things go nowhere.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Evidence, not allegation.</strong> Every finding points to a specific artifact in the software as actually shipped - a declared permission, a compiled SDK class, a hardcoded key. Any competent third party can independently verify it.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Not-for-profit, by structure.</strong> RFI-IRFOS is a registered not-for-profit. There are no shareholders; surplus is reinvested into research. Paid advisory tiers are optional and separate - never a condition of free disclosure.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Research, not extortion.</strong> Our work is grounded in the freedom of scientific research (Art. 17 Austrian Federal Constitution) and GDPR Art. 89. We report on companies' own distributed software - never private, stolen, or unauthorized-access data.</li>
      <li><strong style={{ color: '#e8e8f0' }}>No disruption, ever.</strong> No denial-of-service, no load testing. Findings come from static analysis of the software as shipped, never from attacking it in production.</li>
      <li><strong style={{ color: '#e8e8f0' }}>No dynamic testing without an agreement, no social engineering.</strong> Live calls against a company's own systems happen only under a signed engagement. We never phish, pretext, or manipulate staff to obtain access.</li>
      <li><strong style={{ color: '#e8e8f0' }}>No fabricated progress, not even from our own tools.</strong> Every in-house agentic tool runs under a written truth policy: never claim a file exists, code ran, or a test passed unless it was actually verified.</li>
    </ul>

    <h2 style={H2}>Our Disclosure Framework</h2>
    <p style={P}>
      Root level code analysis. Regulators in CC on every submission - national DPA + EDPS. 90-day coordinated disclosure. Our framework. Our timeline.
    </p>
    <p style={P}>
      We do not operate bug bounty programs, HackerOne, or any third-party vulnerability reward platforms. All findings are published under <strong style={{ color: '#e8e8f0' }}>Forschungsfreiheitsgesetz (Art. 17 StGG)</strong> and constitute free scientific knowledge sharing within the EU research framework - independent of commercial incentive.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Disclosure is unconditional.</strong> Every organization on our ledger receives identical treatment - same embargo, same publication, same regulator notification - whether or not they engage RFI-IRFOS commercially.
    </p>
    <p style={P}>
      90-day coordinated embargo from initial notification to public disclosure. Regulators (DSB, EDPB, CERT.at) notified in parallel — not after the fact, not only "if this goes nowhere." Extensions considered case-by-case, for genuine remediation in progress, never for stalling.
    </p>

    <p style={P}>
      We spend most of our time finding the things other companies didn't want found. Fair's fair — here's how to find one in ours. Real institute, real street address in Graz, Austria, no bug-bounty theater, no chatbot standing between you and the person who actually reads this.
    </p>

    <h2 style={H2}>Reporting a Vulnerability</h2>
    <p style={P}>
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a><br />
      PGP key available on request. We acknowledge all reports within 48 hours — from a human, not a ticket number.
    </p>

    <h2 style={H2}>How We Handle What You Send Us</h2>
    <p style={P}>ISO/IEC 30111 triage: reproduce it, scope it, fix it, credit you. No finding gets buried because it's inconvenient — that's the entire complaint we file against everyone else, and we're not exempting ourselves from it.</p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Lawful basis only.</strong> We accept findings obtained through publicly accessible information, your own devices, or software you're authorized to test — the same standard our own root-level code analysis holds to. If what you send us shows evidence of unauthorized access to a system you don't control, we do not publish or credit it under this program. We report it directly to the relevant authorities, the same way we'd expect to be treated if the roles were reversed.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Credit, your choice.</strong> Full name, alias, or fully anonymous — exactly as set out in our <a href="#p/agb" style={A}>terms</a>. No call, no meeting. Everything stays written, same as every disclosure we send.
    </p>

    <h2 style={H2}>Scope</h2>
    <p style={P}>rfi-irfos.com &middot; ternlang.com &middot; lighthouse-rfi-irfos.fly.dev &middot; github.com/rfi-irfos/*</p>

    <h2 style={H2}>Out of Scope</h2>
    <p style={P}>Social engineering, physical attacks, DoS/DDoS. We do not operate a bug bounty program — no points, no swag, no leaderboard. This isn't a platform, it's an inbox.</p>

    <h2 style={H2}>Hall of Fame</h2>
    <p style={P}>Responsible reporters credited publicly (with consent) in our disclosure reports. Your name, where it's earned — nothing gamified about it.</p>

    <h2 style={H2}>Safe Harbor</h2>
    <p style={P}>
      Good-faith security research conducted in line with this policy, reported to us privately and given reasonable time to be triaged, will not trigger a civil or criminal complaint from us. We will not treat your report as unauthorized access, we will treat it as the thing it is.
    </p>

    <h2 style={H2}>Why We Publish This Page At All</h2>
    <p style={P}>
      Because a research institute that discloses other people's undocumented tracking mechanisms, hardcoded keys, and pre-consent SDK inits, while not publishing its own security policy, would be exactly the kind of double standard we call out in our own reports. This page exists so nobody has to take that on faith either.
    </p>

    <h2 style={H2}>A Word on Tone</h2>
    <p style={P}>
      We work out of Graz, Austria — closer to the Alps than to a glass tower. We follow ISO/IEC 29147 to the letter, we file with regulators before anyone makes us, and we still think most corporate security pages read like they were written by the incident they're supposed to prevent. This one wasn't.
    </p>
  </>
}

function Standards() {
  return <>
    <h1 style={H1}>Standards &amp; Compliance</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>The frameworks we file every audit against &middot; Last updated: July 2026</p>

    <p style={P}>
      Every audit RFI-IRFOS runs is filed against current EU and Austrian law. We track new standards as they enter force and keep our methodology up to date. This page lists what that actually means in practice — the specific frameworks, not just a claim that we "follow best practice."
    </p>

    <h2 style={H2}>NIS-2 · NISG 2026</h2>
    <p style={P}>
      The EU directive for a high common level of cybersecurity, transposed into Austrian law as <strong style={{ color: '#e8e8f0' }}>NISG 2026</strong>. It mandates state-of-the-art risk management, strict incident reporting to national authorities, and <strong style={{ color: '#e8e8f0' }}>personal liability for company management</strong>. In Austria it directly impacts roughly 4,000 essential and important entities, plus an estimated 50,000 supply-chain partners.
    </p>
    <p style={P}>
      In practice this covers three things: <strong style={{ color: '#e8e8f0' }}>risk management</strong> (cryptography, access control, supply-chain security), <strong style={{ color: '#e8e8f0' }}>incident response</strong> (mandatory reporting within strict timeframes), and <strong style={{ color: '#e8e8f0' }}>corporate accountability</strong> (management personally liable for non-compliance). Scope: ~4,000 entities directly, ~50,000 supply-chain partners — see <a href="https://www.nis.gv.at" target="_blank" rel="noopener" style={A}>nis.gv.at</a>.
    </p>

    <h2 style={H2}>GDPR &middot; EU 2016/679</h2>
    <p style={P}>Art. 6 lawful basis, Art. 9 special-category (health/biometric), Art. 8 children, Art. 33 breach notification. The backbone of every disclosure we file.</p>

    <h2 style={H2}>EU AI Act &middot; EU 2024/1689</h2>
    <p style={P}>Risk-tiered obligations for AI systems: transparency, governance, prohibited-practice analysis for the models we audit and build.</p>

    <h2 style={H2}>EU DSA &middot; EU 2022/2065</h2>
    <p style={P}>Digital Services Act. Systemic-risk and illegal-content obligations. Filed directly with the Irish Digital Services Coordinator (Coimisiún na Meán) on platform findings.</p>

    <h2 style={H2}>ISO/IEC 29147 &middot; International</h2>
    <p style={P}>Vulnerability disclosure. Our coordinated framework follows the 90-day embargo + regulator-notification standard — see our <a href="#" onClick={e => { e.preventDefault(); location.hash = '#p/security' }} style={A}>Security Policy</a> for the process itself.</p>

    <h2 style={H2}>ISO/IEC 30111 &middot; International</h2>
    <p style={P}>Vulnerability handling processes. The internal triage, validation, and remediation-tracking workflow behind every coordinated disclosure we run.</p>

    <h2 style={H2}>ISO/IEC 27001 &middot; International</h2>
    <p style={P}>Information security management. The control set behind our handling of evidence, NDAs, and client data.</p>

    <h2 style={H2}>COPPA &middot; US · 15 U.S.C. §6501</h2>
    <p style={P}>Children's online privacy. Applied across our minor-protection audits of apps, games, and streaming platforms.</p>

    <h2 style={H2}>EU MDR &middot; EU 2017/745</h2>
    <p style={P}>Medical Device Regulation. Class IIb scrutiny for health/wearable apps processing Internet-of-Bodies data.</p>

    <h2 style={H2}>eIDAS / Trust Services &middot; EU 910/2014</h2>
    <p style={P}>Electronic identification + trust services. Relevant to the biometric + identity-verification SDKs under our magnification.</p>

    <h2 style={H2}>ePrivacy Directive &middot; EU 2002/58/EC</h2>
    <p style={P}>Consent for tracking, access to terminal equipment, electronic communications confidentiality. Art. 5(3) is the legal backbone of every SDK-consent finding we publish.</p>
  </>
}

// The people - mirrors ternlang.com's roster. Kept as data so a departure/new-hire is
// one array edit, not a hunt through JSX (see the Lisa Scharler removal, 2026-07-04).
// Moved off the homepage onto its own page (was `#team`, a full mainpage section) -
// decision space vs. trust space: a first-time visitor cares "what can you do" before
// "who are you," per the website-repositioning plan. Lives under "Company" in the
// footer now, not under "Legal" - team bios aren't a legal document, just no longer a
// mainpage section either.
//
// Name + one focus line, not a stacked "bold title + separate description" - a
// generated "Head of X & Y" title format made distinct people read as filling the
// same org-chart slot (Ana Diez/Brennan Bell specifically read as near-duplicates:
// both titles combined "welfare" + "model safety" in different words). Simeon is the
// one deliberate exception: his contribution isn't a domain like everyone else's, it's
// the methodology/investigation approach itself, so he keeps a role title rather than
// a focus tag.
//
// Ana/Brennan's focus lines are grounded in their actual signed offer letters
// (~/Desktop/Documents/RFI-IRFOS_Offer_{Ana_Diez,Brennan_Bell}_...pdf), not guessed:
// the "model-welfare framework / long-horizon rubric" clause is word-for-word
// identical in both letters (genuinely shared responsibility, not a differentiator).
// The real difference: Ana's letter has her leading "our entire research and
// model-wellbeing arm" including "growth and mentoring of the research team as we
// scale" (research-org leadership); Brennan's letter has him owning "the model safety
// research agenda" specifically plus "collaboration with... external academic
// partners" (he's PhD-track and publishing - the academic-facing safety-research seat).
const TEAM = [
  { name: 'Simeon Kepp',      gh: 'simeon-kepp',   focus: 'Founder / Principal Investigator' },
  { name: 'Zabih Karimi',     gh: 'zabih-sudo',     focus: 'Infrastructure & engineering' },
  { name: 'Nikoletta Csonka', gh: 'csonikoletta',   focus: 'Onboarding & culture' },
  { name: 'Louis Ehrig',      gh: 'louisuhr',       focus: 'Press & public affairs' },
  { name: 'Ana Diez',         gh: 'anadiezmartini', focus: 'Research leadership & team growth' },
  { name: 'Brennan Bell',     gh: '496crows',       focus: 'Safety research & academic partnerships' },
  { name: 'Mariano Sosa',     gh: '',               focus: 'Trust & public perception' },
]

function Team() {
  return <>
    <h1 style={H1}>Team</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>One team, everything in-house</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginTop: 32 }}>
      {TEAM.map(p => (
        <a key={p.name} href={p.gh ? `https://github.com/${p.gh}` : undefined} target="_blank" rel="noopener"
           style={{
             display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
             background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.09)',
             borderRadius: 14, padding: 20, textAlign: 'center', textDecoration: 'none',
             transition: 'border-color 0.15s', cursor: p.gh ? 'pointer' : 'default',
           }}
           onMouseEnter={e => { if (p.gh) e.currentTarget.style.borderColor = 'rgba(0,245,196,0.4)' }}
           onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }}>
          {p.gh ? (
            <img src={`/team/${p.gh}.png`} alt="" loading="lazy"
                 style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.09)', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 900, color: 'var(--accent-text)', background: 'rgba(0,245,196,0.08)',
            }}>{p.name[0]}</div>
          )}
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#e8e8f0' }}>{p.name}</p>
            <p style={{ fontSize: 11, color: 'var(--accent-text)', marginTop: 4, fontWeight: 600 }}>{p.focus}</p>
          </div>
        </a>
      ))}
    </div>
  </>
}

// Moved off the mainpage entirely (previously a "Methodology" block folded into
// the Research section) per live feedback: these four rules read as reference
// material for whoever wants to check our process, not something that needs to
// compete for mainpage scroll - same reasoning as Team moving to its own page.
const METHODOLOGY_PRINCIPLES = [
  {
    title: 'Sources',
    body: 'We only work from what we\'re lawfully entitled to see: publicly accessible information, devices we own or are authorized to test, and software we\'re authorized to analyze. If material crosses into unauthorized access to a system we don\'t control, we don\'t use it - we report it to the relevant authority instead, the same way we\'d want to be treated in reverse.',
  },
  {
    title: 'Methods',
    body: 'Investigate first, judge second: we trace root cause instead of stopping at the first symptom, and every step has to be reproducible by someone other than the person who ran it the first time. A finding that only one person can reproduce isn\'t a finding yet.',
  },
  {
    title: 'Handling results',
    body: 'Severity gets ranked, not asserted - and every client, paying or not, gets the same triage discipline (ISO/IEC 30111: reproduce it, scope it, fix it, credit the reporter). What changes between tiers is how much of the report stays private and how fast we move - never whether the finding publishes, never the rigor of the underlying work.',
  },
  {
    title: 'Disclosure',
    body: 'A fixed public heads-up window applies before anything goes on the public ledger, giving the organization real time to fix a problem before anyone else sees it. Regulators are told in parallel where our own rules require it, without exposing detail that would put a client at risk before they\'ve had the chance to fix it.',
  },
]

// Moved off the mainpage entirely (previously the "#evidence" section) per
// live feedback: a real, already-public disclosed finding (MC-01, Merge
// Chicken) demonstrating the Finding/Evidence/Method/Confidence/
// Recommendation format - reference material for whoever wants to check how
// a finding actually gets proven, same reasoning as the four principles above.
const EVIDENCE_COLUMNS = [
  { label: 'Finding', body: 'A Google Play app rated PEGI 3 ("suitable for all ages") and listed as a casual merge puzzle game functioned as an unlicensed, no-KYC real-money online casino - not present on the face of the submitted build.' },
  { label: 'Evidence', body: 'The gambling UI and logic were absent from the reviewed binary and gated behind a server-controlled switch (Firebase Remote Config), with the live payload served from separately-controlled infrastructure after install.' },
  { label: 'Method', body: 'Static root-level analysis of the published release APK: apktool decompilation, dex/string inspection, manifest review, plus open-source corroboration of the developer entity. No production servers or user accounts were probed.' },
  { label: 'Confidence', body: 'Confirmed - reported directly to Google Play & Android Security as abuse, not negotiated as a vendor disclosure. Google\'s own security team confirmed removal from the Play Store.' },
  { label: 'Recommendation', body: 'Reported 2026-06-25; app removed from the Play Store 2026-06-30 - 5 days to resolution, the first publicly documented enforcement outcome of the RFI-IRFOS 2026 Android audit programme.' },
]

function Methodology() {
  return <>
    <h1 style={H1}>Methodology</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#7a7aa0' }}>The same rules, whoever the client is</p>
    <p style={P}>
      An investigator who bends the rules for a paying client isn't an investigator anymore - just a vendor with a fancier vocabulary. These four principles govern where we look, how we test, what we do with what we find, and when it becomes public, regardless of who's paying.
    </p>
    <div style={{ display: 'grid', gap: 24, marginTop: 24, marginBottom: 40 }}>
      {METHODOLOGY_PRINCIPLES.map(p => (
        <div key={p.title}>
          <h2 style={H2}>{p.title}</h2>
          <p style={P}>{p.body}</p>
        </div>
      ))}
    </div>

    <h2 style={H2}>A claim you can't trace back isn't evidence</h2>
    <p style={P}>
      Most reports stop at a severity label: critical, high, medium. That tells you how worried to be, but not why - and a client's own legal or engineering team can't check work they can't see the steps of. So every finding we deliver is required to answer five questions in order, not just the last one: what did we find, what proves it, how did we prove it, how sure are we, and what should you do about it.
    </p>
    <div style={{
      background: 'rgba(0,224,193,0.06)', border: '1px solid rgba(0,224,193,0.25)',
      borderRadius: 10, padding: '12px 16px', margin: '16px 0',
    }}>
      <p style={{ ...P, marginBottom: 0, fontSize: 12.5 }}>
        <strong style={{ color: '#00e0c1' }}>Real, disclosed finding.</strong> From "Merge Chicken" (com.Merge.o98Chickens), reported to Google Play &amp; Android Security 2026-06-25, removed from the Play Store 2026-06-30.{' '}
        <a href="/reports/merge-chicken-2026.pdf" target="_blank" rel="noopener" style={A}>Full report (PDF)</a>
      </p>
    </div>
    <div style={{ display: 'grid', gap: 20, marginTop: 20 }}>
      {EVIDENCE_COLUMNS.map(col => (
        <div key={col.label}>
          <h2 style={H2}>{col.label}</h2>
          <p style={P}>{col.body}</p>
        </div>
      ))}
    </div>
  </>
}
