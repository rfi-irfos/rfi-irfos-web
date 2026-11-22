// Body of the search-facing landing pages (2026-10-31, see landingPages.ts for the why and
// the content rules). Rendered inside LegalPage's shell (back button, locale toggle, footer
// identity line) because that is the simplest existing pattern for a standalone prerendered
// route (App.tsx LEGAL_SLUGS + LegalPage META + prerender ROUTES/LOCALIZED_ROUTES).
// Everything page-specific lives in landingPages.ts.
//
// Layout (Zabih + Simeon 2026-11-22): every service page is a showcase page in the same
// language as Data Solutions (hero, icon card grids, section heads, embedded Quick Check),
// no longer a wall of text with a row of fourteen pills on top. The data-* classes come
// from App.css and are shared with DataSolutions.tsx on purpose: one look for every
// product page. Body text stays at full contrast: these pages carry the offer itself, and
// important information must not sit in grey text (binding style rule).
import React, { useEffect } from 'react'
import { upsertJsonLd, breadcrumbJsonLd, faqPageJsonLd, landingServiceJsonLd } from '../lib/structuredData'
import { LANDING, LANDING_SLUGS, landingDoc, localePath, type LandingLocale, type LandingSlug } from './landingPages'
import { InitialReviewFlow } from './sections/InitialReviewFlow'
import { RelatedTiles } from './RelatedTiles'
import { Reveal } from './sections/shared'
import auditStats from '../content/auditStats.json'
import {
  IconDeviceMobile, IconLock, IconCertificate, IconRadar2, IconRobot, IconHeadset, IconListCheck, IconWorldSearch, IconBug, IconApi,
  IconCloudLock, IconCode, IconTool, IconMapPin, IconShieldCheck, IconFileSearch, IconKey, IconServer, IconGitBranch, IconClock,
  IconCircleCheck, IconBook, IconMessageQuestion,
} from '@tabler/icons-react'

const ICONS: Record<LandingSlug, typeof IconLock> = {
  'app-security-audit': IconDeviceMobile, 'gdpr-app-audit': IconLock, 'nis2-software-vendors': IconCertificate, 'app-tracker-sdk-check': IconRadar2,
  'ai-app-privacy-audit': IconRobot, 'managed-soc': IconHeadset, 'compliance-automation': IconListCheck, 'domain-security-test': IconWorldSearch,
  'penetration-testing': IconBug, 'api-security-testing': IconApi, 'cloud-security-assessment': IconCloudLock, 'secure-code-review': IconCode, 'vulnerability-remediation': IconTool, 'it-security-graz': IconMapPin, 'nis2-consulting': IconCertificate,
}

// One icon per bullet card, by position. The bullets are sentences from landingPages.ts
// (surfaces, controls, deliverables), so the icons mark the card and carry no meaning of
// their own; the sentence does.
const CARD_ICONS = [IconShieldCheck, IconKey, IconServer, IconGitBranch, IconCloudLock, IconClock, IconFileSearch, IconCircleCheck]

const A: React.CSSProperties = { color: 'var(--accent-text)', textDecoration: 'none', fontWeight: 600 }
const SECONDARY: React.CSSProperties = { display: 'inline-block', marginTop: 28, padding: '13px 21px', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontWeight: 700, textDecoration: 'none' }

export function LandingBody({ slug, locale }: { slug: LandingSlug; locale: LandingLocale }) {
  const d = landingDoc(slug, locale)

  // Head writes moved here from LegalPage (2026-11-22): title, description, og/twitter, plus the
  // BreadcrumbList, the FAQPage built from the visible Q&A below, and the Service node.
  useEffect(() => {
    document.title = d.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', d.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', d.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', d.description)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', d.title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', d.description)
    upsertJsonLd('ld-breadcrumb', breadcrumbJsonLd(d.label, localePath(locale, `/${slug}`)))
    upsertJsonLd('ld-faqpage', faqPageJsonLd(d.faq))
    upsertJsonLd('ld-landing-service', landingServiceJsonLd(slug, d.label, d.description, locale))
  }, [slug, locale, d])
  const fill = (s: string) => s.replace('{apps}', String(auditStats.appsAudited)).replace('{critical}', String(auditStats.criticalFindings))
  const de = locale === 'de'
  const others = LANDING_SLUGS.filter(s => s !== slug)
  const Icon = ICONS[slug]
  const toCheck = (e: React.MouseEvent) => { e.preventDefault(); document.getElementById('domain-check')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return <div className="data-solutions rfi-landing"><div className="data-wrap">
    <header className="data-hero">
      <Reveal><div className="data-icon rfi-ri-box"><Icon size={30} stroke={1.6} /></div></Reveal>
      <Reveal><h1>{d.h1}</h1></Reveal>
      <Reveal delay={1}><p className="data-lede">{d.lead}</p></Reveal>
      <Reveal delay={2}><div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        <a href="#domain-check" onClick={toCheck} className="data-cta" style={{ textDecoration: 'none', display: 'inline-block' }}>{de ? 'Quick Check starten' : 'Start the Quick Check'} <span aria-hidden="true">→</span></a>
        <a href={localePath(locale, '/access/')} style={SECONDARY}>{de ? 'Pläne und Preise' : 'Plans and prices'}</a>
      </div></Reveal>
    </header>

    {d.sections.map(s => <section key={s.h2} className="data-section">
      <Reveal><div className="data-section-head"><h2>{s.h2}</h2>{s.p.map((para, i) => <p key={i}>{para}</p>)}</div></Reveal>
      {s.ul && <div className="data-dataset-grid rfi-landing-grid">
        {s.ul.map((li, i) => { const Li = CARD_ICONS[i % CARD_ICONS.length]; return <Reveal key={li} delay={(i % 3) + 1}>
          <article className="rfi-glass-flat rfi-glass-solid rfi-hover-card"><div className="data-icon rfi-ri-box"><Li size={28} stroke={1.6} /></div><p>{li}</p></article>
        </Reveal> })}
      </div>}
    </section>)}

    {/* Ort und Arbeitsweise (2026-11-16): Leistungsseiten trugen „Graz“ nur in der Fußzeile, lokale
        Suchanfragen wie „app security audit graz“ fanden uns nicht. Belegt durch de.ts (eigener Server in Graz). */}
    <section className="data-section">
      <Reveal><div className="data-section-head">
        <h2>{de ? 'Ihr eingebettetes Security-Engineering-Team aus Graz' : 'Your embedded security engineering team, from Graz'}</h2>
        <p>{de
          ? 'Wir arbeiten in Graz, Österreich, auf unserem eigenen Server: Die komplette Pipeline läuft dort, vom ersten Scan bis zum Bericht. The Squad arbeitet in Ihrem Entwicklungszyklus mit. Agenten testen laufend, und die Behebung kommt von unseren Ingenieuren als Änderung an Ihrem Code, wo möglich als Patch zum direkten Einspielen. So arbeitet ein eingebettetes Security-Engineering-Team. Wir arbeiten für Kleinst-, Klein- und Mittelunternehmen, wachsende Firmen und Konzerne aus allen Branchen, und unsere Pläne skalieren mit Ihrem Unternehmen.'
          : 'We work from Graz, Austria, on our own server: the whole pipeline runs there, from the first scan to the report. The Squad works inside your delivery cycle. Agents test continuously, and the fix arrives from our engineers as a change to your code, where possible as a ready-to-apply patch. That is how an embedded security engineering team works. We work for micro, small and medium-sized enterprises, growing companies and large enterprises across every industry, and our plans scale with your business.'}</p>
      </div></Reveal>
    </section>

    <section className="data-section">
      <Reveal><div className="data-section-head"><h2>{d.evidenceH2}</h2><p>{fill(d.evidenceIntro)}</p></div></Reveal>
      <div className="data-agent-grid rfi-landing-grid">
        {d.evidence.map((e, i) => <Reveal key={e.slug} delay={(i % 3) + 1}>
          <article className="rfi-glass-flat rfi-glass-solid rfi-hover-card">
            <div className="data-icon data-icon--row rfi-ri-box"><IconBook size={26} stroke={1.6} /></div>
            <div><h3><a href={`/evidence/${e.slug}/`} style={A} className="rfi-inline-link">{e.label}</a></h3><p>{e.note}</p></div>
          </article>
        </Reveal>)}
      </div>
      <Reveal><p style={{ textAlign: 'center', marginTop: 28 }}>
        {de ? 'Alle weiteren Untersuchungen stehen im ' : 'Every other investigation is in the '}
        <a href={localePath(locale, '/evidence/')} style={A} className="rfi-inline-link">{de ? 'vollständigen Evidence-Ledger' : 'full evidence ledger'}</a>.
      </p></Reveal>
    </section>

    <section className="data-section">
      <Reveal><div className="data-section-head">
        <h2>{d.startH2}</h2>
        {d.startText.map((para, i) => <p key={i}>{para}</p>)}
        <p>
          {de ? 'Pläne und Preise stehen unter ' : 'Plans and prices are on '}
          <a href={localePath(locale, '/access/')} style={A} className="rfi-inline-link">Access</a>
          {de ? ', die Agenten hinter jeder Prüfung unter ' : ', the agents behind every review on '}
          <a href={localePath(locale, '/squad/')} style={A} className="rfi-inline-link">The Squad</a>
          {de ? ' und die Rahmenwerke, an denen wir messen, unter ' : ' and the frameworks we measure against on '}
          <a href={localePath(locale, '/standards/')} style={A} className="rfi-inline-link">Standards</a>.
        </p>
      </div></Reveal>
      {/* id="domain-check": target of the hero button and of the compact topic modal (same anchor the homepage uses). */}
      <div id="domain-check" style={{ display: 'flex', justifyContent: 'center', scrollMarginTop: 90 }}>
        <InitialReviewFlow variant="embedded" />
      </div>
    </section>

    <section className="data-section">
      <Reveal><div className="data-section-head"><h2>{d.faqH2}</h2></div></Reveal>
      <div className="data-agent-grid rfi-landing-grid rfi-landing-faq">
        {d.faq.map(([q, a], i) => <Reveal key={q} delay={(i % 2) + 1}>
          <article className="rfi-glass-flat rfi-glass-solid rfi-hover-card">
            <div className="data-icon data-icon--row rfi-ri-box"><IconMessageQuestion size={26} stroke={1.6} /></div>
            <div><h3>{q}</h3><p>{a}</p></div>
          </article>
        </Reveal>)}
      </div>
      <Reveal><p style={{ textAlign: 'center', marginTop: 28 }}>
        <a href={localePath(locale, '/faq/')} style={A}>
          {de ? 'Weitere Antworten zu Leistungen, Portal, Connectors und Datenort in den FAQ' : 'More answers on services, the portal, connectors and data location in the FAQ'}
        </a>
      </p></Reveal>
    </section>

    <RelatedTiles title={de ? 'Verwandte Seiten' : 'Related pages'}
      items={others.map(s => ({ href: localePath(locale, `/${s}/`), label: LANDING[s][locale].label, Icon: ICONS[s] }))} />
  </div></div>
}
