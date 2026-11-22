// The search landing pages as a row of icon pills under the homepage evidence strip
// (Simeon 2026-10-31: the plain-text row under the pricing intro sent people off to a full
// page and back to the bottom of /access/). Each pill is still a real <a href> to the
// prerendered page, so crawlers keep the internal link, but a click opens the page's own
// copy in an overlay and the visitor stays where they were.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconShieldCheck, IconShieldLock, IconCertificate, IconHeadset, IconListCheck, IconWorldSearch, IconTool, IconX } from '@tabler/icons-react'
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
  'vulnerability-remediation': IconTool,
  'it-security-graz': IconShieldCheck,
  'nis2-consulting': IconCertificate,
}

const KEYS = {
  'app-security-audit': 'appSecurityAudit', 'gdpr-app-audit': 'gdprAppAudit',
  'nis2-software-vendors': 'nis2', 'app-tracker-sdk-check': 'trackerSdk',
  'ai-app-privacy-audit': 'aiApp', 'managed-soc': 'managedSoc',
  'compliance-automation': 'compliance', 'domain-security-test': 'domainCheck',
  'penetration-testing': 'pentest', 'api-security-testing': 'apiSecurity',
  'cloud-security-assessment': 'cloud', 'secure-code-review': 'codeReview', 'vulnerability-remediation': 'remediation',
  'it-security-graz': 'itSecurityGraz', 'nis2-consulting': 'nis2Consulting',
} as const

// Simeon 2026-11-10: five pills, not one per landing page. Penetration testing leads (strongest
// buyer term) and its overlay links on to the app security audit; GDPR, tracker/SDK and AI-app
// stay as pages in the footer and the sitemap. Every pill keeps its real <a href>, so crawlers see all five pages.
const PILLS: readonly LandingSlug[] = ['penetration-testing', 'nis2-software-vendors', 'managed-soc', 'compliance-automation', 'domain-security-test']
const ALSO: Partial<Record<LandingSlug, LandingSlug>> = { 'penetration-testing': 'app-security-audit' }

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
              {t.footer.groups.services.links[KEYS[slug]]}
            </a>
          )
        })}
        {/* Trust Center (Simeon 2026-11-18): the customer-facing page of the portal lives on its own host, so this pill
            is a plain external link and not an overlay. Same look as the pills around it. */}
        <a href="https://trust.rfi-irfos.com/" onClick={() => beacon('trust_center_pill')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--glass-bg-solid)', color: 'var(--accent-text)', fontWeight: 700, fontSize: 'var(--fs-small)', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <IconShieldLock size={16} stroke={1.8} color="var(--icon-neutral)" aria-hidden />
          {t.footer.groups.services.links.trustCenter}
        </a>
      </nav>
      {/* Portal to <body> (bug 2026-11-01, Zabih): the row sits inside an animated
          section whose transform turns position:fixed into "fixed to that section",
          so on desktop the overlay rendered cut off at the bottom of the page. */}
      {open && createPortal(<TopicModal slug={open.slug} doc={open.doc} href={`${pre}/${open.slug}/`} onClose={() => setOpen(null)} />, document.body)}
    </>
  )
}

export function TopicModal({ slug, doc, href, onClose }: { slug: LandingSlug; doc: LandingDoc; href: string; onClose: () => void }) {
  // Compact on purpose (Simeon + Zabih 2026-11-22): the overlay names the service in a title and a
  // lead, then sends the visitor to the page itself. No scrolling, no sections, no grey boxes. The
  // page is the showcase; the overlay is the signpost.
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
        style={{ position: 'relative', width: '100%', maxWidth: 560, border: '1px solid var(--border)', borderRadius: 16, background: 'var(--bg, #0a0b12)', boxShadow: '0 20px 60px rgba(0,0,0,0.55)', padding: '32px 32px 28px', textAlign: 'center' }}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={c.close}
          style={{ position: 'absolute', top: 14, right: 14, background: 'transparent', border: 'none', color: 'var(--text2)', padding: 6, cursor: 'pointer', display: 'flex' }}>
          <IconX size={18} stroke={1.8} />
        </button>
        <div className="rfi-ri-box" style={{ width: 52, height: 52, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14 }}>
          <Icon size={26} stroke={1.7} color="var(--accent-text)" aria-hidden />
        </div>
        <h2 id="topic-modal-title" style={{ fontSize: 'var(--fs-h3, 1.4rem)', fontWeight: 800, color: 'var(--text)', margin: '0 0 12px', lineHeight: 'var(--lh-tight)' }}>{doc.h1}</h2>
        <p style={{ color: 'var(--text)', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', margin: '0 auto 22px', maxWidth: 460 }}>{doc.lead}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <a href={href} onClick={() => beacon('topic_modal_page:' + slug)}
            className="fx-cta-glass" style={{ padding: '12px 22px', borderRadius: 8, fontWeight: 700, fontSize: 'var(--fs-small)', textDecoration: 'none' }}>{c.fullPage} <span aria-hidden="true">→</span></a>
          <button type="button" onClick={startCheck}
            style={{ background: 'transparent', color: 'var(--accent-text)', border: 'none', padding: '12px 14px', fontWeight: 700, fontSize: 'var(--fs-small)', cursor: 'pointer' }}>{c.startCheck}</button>
        </div>
        {also && <p style={{ margin: '16px 0 0', fontSize: 'var(--fs-small)' }}><a href={alsoHref} style={{ color: 'var(--text2)', textDecoration: 'underline' }}>{t.footer.groups.services.links[KEYS[also]]}</a></p>}
      </div>
    </div>
  )
}
