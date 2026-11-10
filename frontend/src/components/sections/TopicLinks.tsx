// The search landing pages as a row of icon pills under the homepage evidence strip
// (Simeon 2026-10-31: the plain-text row under the pricing intro sent people off to a full
// page and back to the bottom of /access/). Each pill is still a real <a href> to the
// prerendered page, so crawlers keep the internal link, but a click opens the page's own
// copy in an overlay and the visitor stays where they were.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconShieldCheck, IconCertificate, IconHeadset, IconListCheck, IconWorldSearch, IconX } from '@tabler/icons-react'
import { useLocale } from '../../hooks/useLocale'
import { beacon } from './shared'
import type { LandingSlug } from '../landingSlugs'
import type { LandingDoc } from '../landingPages'

const ICONS: Record<LandingSlug, typeof IconShieldCheck> = {
  'app-security-audit': IconShieldCheck,
  'gdpr-app-audit': IconShieldCheck,
  'nis2-software-vendors': IconCertificate,
  'app-tracker-sdk-check': IconShieldCheck,
  'ai-app-privacy-audit': IconShieldCheck,
  'managed-soc': IconHeadset,
  'compliance-automation': IconListCheck,
  'domain-security-test': IconWorldSearch,
  'penetration-testing': IconShieldCheck,
  'api-security-testing': IconShieldCheck,
  'cloud-security-assessment': IconShieldCheck,
  'secure-code-review': IconShieldCheck,
}

const KEYS = {
  'app-security-audit': 'appSecurityAudit', 'gdpr-app-audit': 'gdprAppAudit',
  'nis2-software-vendors': 'nis2', 'app-tracker-sdk-check': 'trackerSdk',
  'ai-app-privacy-audit': 'aiApp', 'managed-soc': 'managedSoc',
  'compliance-automation': 'compliance', 'domain-security-test': 'domainCheck',
  'penetration-testing': 'pentest', 'api-security-testing': 'apiSecurity',
  'cloud-security-assessment': 'cloud', 'secure-code-review': 'codeReview',
} as const

// Simeon 2026-11-10: five pills, not one per landing page. App security and the GDPR app audit
// share one pill (its overlay links to the GDPR page); tracker/SDK and AI-app stay as pages in
// the footer and the sitemap. Every pill keeps its real <a href>, so crawlers see all five pages.
const PILLS: readonly LandingSlug[] = ['app-security-audit', 'nis2-software-vendors', 'managed-soc', 'compliance-automation', 'domain-security-test']
const ALSO: Partial<Record<LandingSlug, LandingSlug>> = { 'app-security-audit': 'gdpr-app-audit' }

export function TopicLinks() {
  const { t, locale } = useLocale()
  const c = t.appPrivacy.topics
  const pre = locale === 'de' ? '/de' : ''
  const [open, setOpen] = useState<{ slug: LandingSlug; doc: LandingDoc } | null>(null)

  // landingPages.ts is ~50 KB of copy; load it on the first click, not with the homepage.
  const show = async (slug: LandingSlug) => {
    beacon('topic_modal:' + slug)
    const m = await import('../landingPages')
    setOpen({ slug, doc: m.landingDoc(slug, locale) })
  }

  return (
    <>
      {/* Simeon 2026-10-31: the visible "What we examine:" lead looked out of place in front of
          the pills, so the label now only names the group for screen readers. */}
      {/* Phones: one swipeable row instead of stacked pills (.rfi-topic-row in index.css). */}
      <nav className="rfi-topic-row" aria-label={c.label.replace(/:$/, '')} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 22 }}>
        {PILLS.map(slug => {
          const Icon = ICONS[slug]
          return (
            <a key={slug} href={`${pre}/${slug}/`}
              onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); show(slug) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--glass-bg-solid)', color: 'var(--accent-text)', fontWeight: 700, fontSize: 'var(--fs-small)', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <Icon size={16} stroke={1.8} color="var(--icon-neutral)" aria-hidden />
              {slug === 'app-security-audit' ? c.appAndGdpr : t.footer.groups.services.links[KEYS[slug]]}
            </a>
          )
        })}
      </nav>
      {/* Portal to <body> (bug 2026-11-01, Zabih): the row sits inside an animated
          section whose transform turns position:fixed into "fixed to that section",
          so on desktop the overlay rendered cut off at the bottom of the page. */}
      {open && createPortal(<TopicModal slug={open.slug} doc={open.doc} href={`${pre}/${open.slug}/`} onClose={() => setOpen(null)} />, document.body)}
    </>
  )
}

function TopicModal({ slug, doc, href, onClose }: { slug: LandingSlug; doc: LandingDoc; href: string; onClose: () => void }) {
  const { t } = useLocale()
  const c = t.appPrivacy.topics
  const closeRef = useRef<HTMLButtonElement>(null)
  const Icon = ICONS[slug]
  const also = ALSO[slug]
  const alsoHref = also ? href.replace(slug, also) : ''

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  const startCheck = () => {
    beacon('topic_modal_check:' + slug)
    onClose()
    document.getElementById('domain-check')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,4,10,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div role="dialog" aria-modal="true" aria-labelledby="topic-modal-title" onClick={e => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 760, maxHeight: '86vh', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 16, background: 'var(--bg, #0a0b12)', boxShadow: '0 20px 60px rgba(0,0,0,0.55)', padding: '28px 28px 24px', textAlign: 'left' }}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={c.close}
          style={{ position: 'absolute', top: 14, right: 14, background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: 6, cursor: 'pointer', display: 'flex' }}>
          <IconX size={18} stroke={1.8} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingRight: 44 }}>
          <Icon size={22} stroke={1.8} color="var(--accent-text)" aria-hidden style={{ flexShrink: 0 }} />
          <h2 id="topic-modal-title" style={{ fontSize: 'var(--fs-h3, 1.4rem)', fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 'var(--lh-tight)' }}>{doc.h1}</h2>
        </div>
        <p style={{ color: 'var(--text)', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', margin: '0 0 18px' }}>{doc.lead}</p>
        {doc.sections.map(s => (
          <div key={s.h2} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 'var(--fs-lead)', fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>{s.h2}</h3>
            {s.p.map(p => <p key={p} style={{ color: 'var(--text)', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', margin: '0 0 8px' }}>{p}</p>)}
            {s.ul && (
              <ul style={{ margin: '0 0 8px', paddingLeft: 20, color: 'var(--text)', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)' }}>
                {s.ul.map(li => <li key={li}>{li}</li>)}
              </ul>
            )}
          </div>
        ))}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          <button type="button" onClick={startCheck}
            style={{ background: '#f97316', color: '#1a0f00', border: 'none', padding: '12px 20px', borderRadius: 8, fontWeight: 700, fontSize: 'var(--fs-small)', cursor: 'pointer' }}>{c.startCheck}</button>
          <a href={href} style={{ border: '1px solid var(--border)', color: 'var(--text)', padding: '12px 20px', borderRadius: 8, fontWeight: 700, fontSize: 'var(--fs-small)', textDecoration: 'none' }}>{c.fullPage}</a>
          {also && <a href={alsoHref} style={{ border: '1px solid var(--border)', color: 'var(--accent-text)', padding: '12px 20px', borderRadius: 8, fontWeight: 700, fontSize: 'var(--fs-small)', textDecoration: 'none' }}>{t.footer.groups.services.links[KEYS[also]]}</a>}
        </div>
      </div>
    </div>
  )
}
