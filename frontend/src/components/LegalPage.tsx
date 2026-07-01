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
    <h1 style={H1}>Legal Notice</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Disclosure pursuant to § 5 ECG (Austrian E-Commerce Act)</p>

    <p style={P}>
      We publish under our own name, at a real street address, because coordinated disclosure only works if the institute doing it can be found, verified, and held to account — the same standard we hold everyone we audit to.
    </p>

    <h2 style={H2}>Operator</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Research Focus Institute — Interdisciplinary Research Facility for Open Sciences</strong><br />
      Short name: RFI-IRFOS<br />
      Elisabethinergasse 25/10, 8020 Graz, Austria<br />
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a><br />
      Website: <a href="https://rfi-irfos.com" style={A}>rfi-irfos.com</a>
    </p>

    <h2 style={H2}>Register &amp; Trade Data</h2>
    <p style={P}>
      Legal form: Registered association (non-profit, regulated not-for-profit)<br />
      ZVR number (Austrian Central Register of Associations): 1015608684<br />
      GISA number (Trade Register): 39261441<br />
      GLN: 9110038490191<br />
      Tax number: 68 028/0989<br />
      Trade description: Services in automatic data processing and information technology<br />
      Governing trade law: Austrian Trade Regulation Act (Gewerbeordnung, GewO) &middot; WKO member (Austrian Federal Economic Chamber)<br />
      Competent authority pursuant to § 5(1)(5) ECG: Magistrate of the City of Graz<br />
      Trade registered: 19 March 2026
    </p>

    <h2 style={H2}>Trade-Law Management</h2>
    <p style={P}>Simeon-Andreas Johann Manfred Kepp</p>

    <h2 style={H2}>Notice Pursuant to EU Regulation 524/2013 (ODR)</h2>
    <p style={P}>
      The European Commission provides a platform for online dispute resolution:{' '}
      <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" style={A}>ec.europa.eu/consumers/odr</a>.<br />
      We are neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board, as we contract exclusively with businesses.
    </p>

    <h2 style={H2}>Disclaimer</h2>
    <p style={P}>The content of this website has been prepared with the greatest care. No liability is assumed for its accuracy, completeness, or currency.</p>

    <h2 style={H2}>Copyright</h2>
    <p style={P}>All content created by RFI-IRFOS is subject to Austrian copyright law. Reproduction or use beyond the limits of copyright law requires written consent.</p>

    <h2 style={H2}>Governing Law</h2>
    <p style={P}>The law of the Republic of Austria and the law of the European Union apply.</p>
  </>
}

function Datenschutz() {
  return <>
    <h1 style={H1}>Privacy Policy</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>Pursuant to the GDPR (EU) 2016/679 &middot; Last updated: July 2026</p>

    <h2 style={H2}>Data Controller</h2>
    <p style={P}>
      RFI-IRFOS (Research Focus Institute — Interdisciplinary Research Facility for Open Sciences)<br />
      Elisabethinergasse 25/10, 8020 Graz, Austria<br />
      E-Mail: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a>
    </p>

    <h2 style={H2}>Data We Collect</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Server logs:</strong> IP address, access timestamp, URL, HTTP status code — collected by GitHub Pages (GitHub, Inc., USA) and Fly.io (Superfly, Inc., USA).<br />
      <strong style={{ color: '#e8e8f0' }}>Contact form:</strong> name, email, subject, message — submitted via Web3Forms (<a href="https://web3forms.com/privacy" target="_blank" rel="noopener" style={A}>web3forms.com/privacy</a>).<br />
      <strong style={{ color: '#e8e8f0' }}>Payment data:</strong> for purchases made through the website, payment data (card details, email, name) is processed by <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> (354 Oyster Point Blvd, South San Francisco, CA 94080, USA). RFI-IRFOS never receives or stores your card data. Stripe's privacy policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener" style={A}>stripe.com/privacy</a>.<br />
      <strong style={{ color: '#e8e8f0' }}>Visit statistics:</strong> anonymized first-party analytics via Lighthouse (self-hosted, Graz). No third-party tracking. No remarketing.
    </p>

    <h2 style={H2}>Legal Basis</h2>
    <p style={P}>
      Performance of a contract (Art. 6(1)(b) GDPR): payment processing, contact inquiries.<br />
      Legitimate interest (Art. 6(1)(f) GDPR): server logs for security and error analysis.
    </p>

    <h2 style={H2}>Processors</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> — payment processing. Data Processing Agreement (DPA) concluded pursuant to Art. 28 GDPR. Data transferred to the USA on the basis of Standard Contractual Clauses (Art. 46(2)(c) GDPR).<br />
      <strong style={{ color: '#e8e8f0' }}>GitHub, Inc.</strong> — frontend hosting (GitHub Pages). Data transferred to the USA on the basis of Standard Contractual Clauses.<br />
      <strong style={{ color: '#e8e8f0' }}>Superfly, Inc. (Fly.io)</strong> — backend API hosting. Data transferred to the USA on the basis of Standard Contractual Clauses.
    </p>

    <h2 style={H2}>Cookies</h2>
    <p style={P}>
      We don't use cookies. Not tracking cookies, not advertising cookies, not analytics cookies — not even the "essential for platform performance" kind, a phrase that's usually a placeholder for tracking you anyway. This page loaded, the form above submits, and checkout works. None of it needed a cookie to do that. You're looking at the proof right now.
    </p>

    <h2 style={H2}>Automated Decision-Making</h2>
    <p style={P}>None. We do not use profiling or automated decision-making that produces legal or similarly significant effects on you.</p>

    <h2 style={H2}>Retention</h2>
    <p style={P}>Contact inquiries are deleted once communication concludes, at the latest after 7 years per Austrian statutory retention rules. Payment receipts are retained for 7 years pursuant to § 132 BAO (Federal Fiscal Code).</p>

    <h2 style={H2}>Your Rights (Art. 15–21 GDPR)</h2>
    <p style={P}>Access, rectification, erasure, restriction, data portability, objection: <a href="mailto:rfi.irfos@gmail.com" style={A}>rfi.irfos@gmail.com</a></p>

    <h2 style={H2}>Right to Lodge a Complaint</h2>
    <p style={P}>Austrian Data Protection Authority (Datenschutzbehörde): <a href="https://www.dsb.gv.at" target="_blank" rel="noopener" style={A}>dsb.gv.at</a></p>

    <h2 style={H2}>A Note on Consistency</h2>
    <p style={P}>We spend our research auditing other companies for exactly this kind of policy. This one describes what actually happens on this site, in the same evidence-first spirit — nothing here is aspirational.</p>
  </>
}

function AGB() {
  return <>
    <h1 style={H1}>General Terms and Conditions</h1>
    <p style={{ ...P, fontFamily: 'monospace', fontSize: 11, color: '#606080' }}>RFI-IRFOS &middot; Last updated: July 2026</p>

    <h2 style={H2}>1. Scope — B2B Only</h2>
    <p style={P}>
      These Terms apply to all services provided by RFI-IRFOS (ZVR 1015608684, Elisabethinergasse 25/10, 8020 Graz) — in particular security audits, software development, and research services.<br /><br />
      This offer is directed <strong style={{ color: '#e8e8f0' }}>exclusively at business entities</strong> within the meaning of § 1(2) of the Austrian Consumer Protection Act (KSchG). Contracts with consumers within the meaning of the KSchG are excluded. By placing an order, the client confirms that they are acting within the scope of their commercial or professional activity.
    </p>

    <h2 style={H2}>2. Service Delivery</h2>
    <p style={P}>Scope and terms are agreed in writing. Website descriptions and price listings do not constitute binding offers.</p>

    <h2 style={H2}>3. Pricing &amp; Payment</h2>
    <p style={P}>
      Prices are in Euro, plus statutory VAT. Payment is made <strong style={{ color: '#e8e8f0' }}>in full, upfront</strong>, before work begins — exclusively via the payment methods offered on the website (Stripe).<br /><br />
      Service delivery begins <strong style={{ color: '#e8e8f0' }}>immediately</strong> upon receipt of payment. The client expressly consents to this immediate commencement. Accordingly, no right of withdrawal exists (§ 18(1)(1) of the Austrian Distance and Off-Premises Contracts Act, FAGG). Cancellation or refund is excluded once payment has been received.
    </p>

    <h2 style={H2}>4. Confidentiality &amp; NDA</h2>
    <p style={P}>Security audit findings are subject to strict confidentiality until coordinated disclosure (90-day embargo, ISO/IEC 29147). Regulatory authorities are notified independently of NDA status, in fulfillment of our statutory reporting obligations.</p>

    <h2 style={H2}>5. Liability</h2>
    <p style={P}>Liability is limited to intent and gross negligence. Maximum liability: the invoice value of the respective service. Consequential damages are excluded to the extent permitted by law.</p>

    <h2 style={H2}>6. No Warranty of Completeness (Security Research)</h2>
    <p style={P}>Security and privacy assessments reflect the state of the audited system at the time of testing, within the depth of access and duration of the engagement. RFI-IRFOS does not warrant that all vulnerabilities have been identified.</p>

    <h2 style={H2}>7. Intellectual Property</h2>
    <p style={P}>Reports, source code, and research output remain the property of RFI-IRFOS until payment is received in full. Upon receipt of payment, the client receives the agreed usage rights.</p>

    <h2 style={H2}>8. Governing Law &amp; Jurisdiction</h2>
    <p style={P}>Austrian law applies, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). Place of jurisdiction: Graz, Austria.</p>

    <h2 style={H2}>9. Online Dispute Resolution (ODR)</h2>
    <p style={P}>
      EU platform for online dispute resolution: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" style={A}>ec.europa.eu/consumers/odr</a>.<br />
      As we contract exclusively with businesses, we are not obligated to participate in consumer arbitration proceedings.
    </p>

    <h2 style={H2}>10. Severability</h2>
    <p style={P}>Should any provision of these Terms be or become invalid, the validity of the remaining provisions shall remain unaffected.</p>

    <h2 style={H2}>11. Contact</h2>
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

    <h2 style={H2}>A Word on Tone</h2>
    <p style={P}>
      We work out of Graz, Austria — closer to the Alps than to a glass tower. We follow ISO/IEC 29147 to the letter, we file with regulators before anyone makes us, and we still think most corporate security pages read like they were written by the incident they're supposed to prevent. This one wasn't.
    </p>
  </>
}
