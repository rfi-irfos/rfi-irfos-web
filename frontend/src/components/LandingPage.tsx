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
import auditStats from '../content/auditStats.json'

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

    <section>
      <h2 style={H2}>{d.evidenceH2}</h2>
      <p style={BODY}>{fill(d.evidenceIntro)}</p>
      <ul style={LIST}>
        {d.evidence.map(e => <li key={e.slug} style={{ marginBottom: 6 }}>
          <a href={`/evidence/${e.slug}/`} style={A}>{e.label}</a>{': '}{e.note}
        </li>)}
      </ul>
      <p style={BODY}>
        {de ? 'Alle weiteren Untersuchungen stehen im ' : 'Every other investigation is in the '}
        <a href={localePath(locale, '/evidence/')} style={A}>{de ? 'vollständigen Evidence-Ledger' : 'full evidence ledger'}</a>.
      </p>
    </section>

    <section>
      <h2 style={H2}>{d.startH2}</h2>
      {d.startText.map((para, i) => <p key={i} style={BODY}>{para}</p>)}
      <p style={BODY}>
        {de ? 'Pläne und Preise stehen unter ' : 'Plans and prices are on '}
        <a href={localePath(locale, '/access/')} style={A}>Access</a>
        {de ? ', die Agenten hinter jeder Prüfung unter ' : ', the agents behind every review on '}
        <a href={localePath(locale, '/squad/')} style={A}>The Squad</a>
        {de ? ' und die Rahmenwerke, an denen wir messen, unter ' : ' and the frameworks we measure against on '}
        <a href={localePath(locale, '/standards/')} onClick={e => navigate(e, localePath(locale, '/standards/'))} style={A}>Standards</a>.
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
    </section>

    <section>
      <h2 style={H2}>{de ? 'Verwandte Seiten' : 'Related pages'}</h2>
      <p style={BODY}>
        {de ? 'Mehr dazu auf den Seiten ' : 'More on the pages '}
        {others.map((s, i) => <React.Fragment key={s}>
          {i > 0 && (i === others.length - 1 ? (de ? ' und ' : ' and ') : ', ')}
          <a href={localePath(locale, `/${s}/`)} onClick={e => navigate(e, localePath(locale, `/${s}/`))} style={A}>{LANDING[s][locale].label}</a>
        </React.Fragment>)}.
      </p>
    </section>
  </>
}
