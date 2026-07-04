const TEAL = '#00f5c4'
const BASE = { background: '#070711', color: '#e8e8f0', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', padding: '80px 2rem' }
const PROSE = { maxWidth: 720, margin: '0 auto', lineHeight: 1.8 }
const H1 = { fontSize: 32, fontWeight: 900, marginBottom: 8, color: '#e8e8f0' }
const H2: React.CSSProperties = { fontSize: 12, fontWeight: 800, marginTop: 32, marginBottom: 8, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace' }
const P = { color: '#a0a0b8', fontSize: 14, marginBottom: 12 }
const A = { color: TEAL, textDecoration: 'none' }

import React, { useEffect, useRef } from 'react'

const LIGHTHOUSE_PIXEL = 'https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track/pixel.gif'
const LIGHTHOUSE_TRACK = 'https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track'

export function LegalPage({ slug }: { slug: string }) {
  const footerRef = useRef<HTMLDivElement>(null)

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
        <div ref={footerRef} style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)', fontFamily: 'monospace', fontSize: 10, color: '#404058' }}>
          RFI-IRFOS &nbsp;&middot;&nbsp; ZVR 1015608684 &nbsp;&middot;&nbsp; GISA 39261441 &nbsp;&middot;&nbsp; GLN 9110038490191 &nbsp;&middot;&nbsp; UID ATU83405245 &nbsp;&middot;&nbsp; Steuernummer 68 696/8736 &nbsp;&middot;&nbsp; Elisabethinergasse 25/10, 8020 Graz
        </div>
        {/* Lighthouse tracking pixel — page-view only, same mechanism disclosed in the privacy policy below */}
        <img src={`${LIGHTHOUSE_PIXEL}?site=rfi-irfos&p=${encodeURIComponent(`/${slug}`)}&r=${encodeURIComponent(document.referrer)}`}
          alt="" width="1" height="1" style={{ display: 'none' }} />
      </div>
    </div>
  )
}

function Impressum() {
  return <>
    <h1 style={H1}>Legal Notice</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Disclosure pursuant to § 5 ECG (Austrian E-Commerce Act) &middot; Last updated: July 2026</p>

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
      Legal form: Registered association (non-profit, regulated not-for-profit)<br />
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
  </>
}

function Datenschutz() {
  return <>
    <h1 style={H1}>Privacy Policy</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Pursuant to the GDPR (EU) 2016/679 &middot; Last updated: July 2026</p>

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
      <code style={{ fontFamily: 'monospace', fontSize: 12, color: TEAL, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
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

function AGB() {
  return <>
    <h1 style={H1}>General Terms and Conditions</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>RFI-IRFOS &middot; Last updated: July 2026</p>

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
  </>
}

function Security() {
  return <>
    <h1 style={H1}>Security Policy</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Coordinated Disclosure &middot; ISO/IEC 29147 &amp; ISO/IEC 30111</p>

    <p style={P}>
      We spend most of our time finding the things other companies didn't want found. Fair's fair — here's how to find one in ours. Real institute, real street address in Graz, Austria, no bug-bounty theater, no chatbot standing between you and the person who actually reads this.
    </p>

    <h2 style={H2}>Reporting a Vulnerability</h2>
    <p style={P}>
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a><br />
      PGP key available on request. We acknowledge all reports within 48 hours — from a human, not a ticket number.
    </p>

    <h2 style={H2}>Our Disclosure Framework</h2>
    <p style={P}>90-day coordinated embargo from initial notification to public disclosure. Regulators (DSB, EDPB, CERT.at) notified in parallel — not after the fact, not only "if this goes nowhere." Extensions considered case-by-case, for genuine remediation in progress, never for stalling.</p>

    <h2 style={H2}>How We Handle What You Send Us</h2>
    <p style={P}>ISO/IEC 30111 triage: reproduce it, scope it, fix it, credit you. No finding gets buried because it's inconvenient — that's the entire complaint we file against everyone else, and we're not exempting ourselves from it.</p>

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
