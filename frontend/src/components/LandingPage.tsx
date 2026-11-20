// Body of the search-facing landing pages (2026-10-31, see landingPages.ts for the why and
// the content rules). Rendered inside LegalPage's shell - the always-dark glass card with
// back button, locale toggle and footer identity line - because that is the simplest
// existing pattern for a standalone prerendered route (App.tsx LEGAL_SLUGS + LegalPage META
// + prerender ROUTES/LOCALIZED_ROUTES). Everything page-specific lives in landingPages.ts.
//
// Body text uses #d8d8e8, not LegalPage's grey P (#a0a0b8): these pages carry the offer
// itself, and important information must not sit in grey text (binding style rule).
import React from 'react'
import { LANDING, LANDING_SLUGS, landingDoc, localePath, type LandingLocale, type LandingSlug } from './landingPages'
import { InitialReviewFlow } from './sections/InitialReviewFlow'
import { RelatedTiles } from './RelatedTiles'
import auditStats from '../content/auditStats.json'
import { IconDeviceMobile, IconLock, IconCertificate, IconRadar2, IconRobot, IconHeadset, IconListCheck, IconWorldSearch, IconBug, IconApi, IconCloudLock, IconCode, IconTool } from '@tabler/icons-react'

const ICONS: Record<LandingSlug, typeof IconLock> = {
  'app-security-audit': IconDeviceMobile, 'gdpr-app-audit': IconLock, 'nis2-software-vendors': IconCertificate, 'app-tracker-sdk-check': IconRadar2,
  'ai-app-privacy-audit': IconRobot, 'managed-soc': IconHeadset, 'compliance-automation': IconListCheck, 'domain-security-test': IconWorldSearch,
  'penetration-testing': IconBug, 'api-security-testing': IconApi, 'cloud-security-assessment': IconCloudLock, 'secure-code-review': IconCode, 'vulnerability-remediation': IconTool,
}

const H1: React.CSSProperties = { fontSize: 'var(--fs-h2)', fontWeight: 900, marginBottom: 14, color: '#e8e8f0', lineHeight: 'var(--lh-tight)' }
const LEAD: React.CSSProperties = { color: '#eeeef8', fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-body)', marginBottom: 16 }
const H2: React.CSSProperties = { fontSize: 'var(--fs-small)', fontWeight: 700, marginTop: 36, marginBottom: 10, color: 'var(--accent-text)' }
const BODY: React.CSSProperties = { color: '#d8d8e8', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', marginBottom: 12 }
const LIST: React.CSSProperties = { ...BODY, paddingLeft: 22 }
const A: React.CSSProperties = { color: 'var(--accent-text)', textDecoration: 'none', fontWeight: 600 }
const H3: React.CSSProperties = { fontSize: 'var(--fs-body)', fontWeight: 700, color: '#eeeef8', marginTop: 18, marginBottom: 6 }

export function LandingBody({ slug, locale, navigate }: {
  slug: LandingSlug
  locale: LandingLocale
  navigate: (e: React.MouseEvent, href: string) => void
}) {
  const d = landingDoc(slug, locale)
  const fill = (s: string) => s.replace('{apps}', String(auditStats.appsAudited)).replace('{critical}', String(auditStats.criticalFindings))
  const de = locale === 'de'
  const others = LANDING_SLUGS.filter(s => s !== slug)

  return <>
    <h1 style={H1}>{d.h1}</h1>
    <p style={LEAD}>{d.lead}</p>

    {d.sections.map(s => <section key={s.h2}>
      <h2 style={H2}>{s.h2}</h2>
      {s.p.map((para, i) => <p key={i} style={BODY}>{para}</p>)}
      {s.ul && <ul style={LIST}>{s.ul.map(li => <li key={li} style={{ marginBottom: 6 }}>{li}</li>)}</ul>}
    </section>)}

    {/* Ort und Arbeitsweise (2026-11-16): Leistungsseiten trugen „Graz“ nur in der Fußzeile, lokale
        Suchanfragen wie „app security audit graz“ fanden uns nicht. Belegt durch de.ts (eigener Server in Graz). */}
    <section>
      <h2 style={H2}>{de ? 'Ihr eingebettetes Security-Engineering-Team aus Graz' : 'Your embedded security engineering team, from Graz'}</h2>
      <p style={BODY}>{de
        ? 'Wir arbeiten in Graz, Österreich, auf unserem eigenen Server: Die komplette Pipeline läuft dort, vom ersten Scan bis zum Bericht. The Squad arbeitet in Ihrem Entwicklungszyklus mit. Agenten testen laufend, Fachleute prüfen jeden Fund, und die Behebung kommt als Änderung an Ihrem Code. So arbeitet ein eingebettetes Security-Engineering-Team. Wir arbeiten für Kleinst-, Klein- und Mittelunternehmen, wachsende Firmen und Konzerne aus allen Branchen, und unsere Pläne skalieren flexibel mit Ihrem Unternehmen.'
        : 'We work from Graz, Austria, on our own server: the whole pipeline runs there, from the first scan to the report. The Squad works inside your delivery cycle. Agents test continuously, specialists verify every finding, and the fix arrives as a change to your code. That is how an embedded security engineering team works. We work for micro, small and medium-sized enterprises, growing companies and large enterprises across every industry, and our plans scale flexibly with your business.'}</p>
    </section>

    <section>
      <h2 style={H2}>{d.evidenceH2}</h2>
      <p style={BODY}>{fill(d.evidenceIntro)}</p>
      <ul style={LIST}>
        {d.evidence.map(e => <li key={e.slug} style={{ marginBottom: 6 }}>
          <a href={`/evidence/${e.slug}/`} style={A} className="rfi-inline-link">{e.label}</a>{': '}{e.note}
        </li>)}
      </ul>
      <p style={BODY}>
        {de ? 'Alle weiteren Untersuchungen stehen im ' : 'Every other investigation is in the '}
        <a href={localePath(locale, '/evidence/')} style={A} className="rfi-inline-link">{de ? 'vollständigen Evidence-Ledger' : 'full evidence ledger'}</a>.
      </p>
    </section>

    <section>
      <h2 style={H2}>{d.startH2}</h2>
      {d.startText.map((para, i) => <p key={i} style={BODY}>{para}</p>)}
      <p style={BODY}>
        {de ? 'Pläne und Preise stehen unter ' : 'Plans and prices are on '}
        <a href={localePath(locale, '/access/')} style={A} className="rfi-inline-link">Access</a>
        {de ? ', die Agenten hinter jeder Prüfung unter ' : ', the agents behind every review on '}
        <a href={localePath(locale, '/squad/')} style={A} className="rfi-inline-link">The Squad</a>
        {de ? ' und die Rahmenwerke, an denen wir messen, unter ' : ' and the frameworks we measure against on '}
        <a href={localePath(locale, '/standards/')} onClick={e => navigate(e, localePath(locale, '/standards/'))} style={A} className="rfi-inline-link">Standards</a>.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 8px' }}>
        <InitialReviewFlow variant="embedded" />
      </div>
    </section>

    <section>
      <h2 style={H2}>{d.faqH2}</h2>
      {d.faq.map(([q, a]) => <div key={q}>
        <h3 style={H3}>{q}</h3>
        <p style={BODY}>{a}</p>
      </div>)}
      <p style={BODY}>
        <a href={localePath(locale, '/faq/')} onClick={e => navigate(e, localePath(locale, '/faq/'))} style={A}>
          {de ? 'Weitere Antworten zu Leistungen, Portal, Connectors und Datenort in den FAQ' : 'More answers on services, the portal, connectors and data location in the FAQ'}
        </a>
      </p>
    </section>

    <RelatedTiles title={de ? 'Verwandte Seiten' : 'Related pages'} navigate={navigate}
      items={others.map(s => ({ href: localePath(locale, `/${s}/`), label: LANDING[s][locale].label, Icon: ICONS[s] }))} />
  </>
}
