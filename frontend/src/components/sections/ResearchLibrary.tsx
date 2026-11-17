// Research library (Simeon 2026-11-17): impact report and papers as a slideshow under the
// Research page's eight areas, same look and mechanics as the Evidence tab's Proof carousel.
// Every card is a real link /research/<slug>/ (crawlable, shareable); a click opens the PDF
// in the same carbon modal the Evidence reports use. Kept as its own copy of the carousel
// for the same reason Proof.tsx documents: card shape and click behaviour differ.
import { useState, useEffect, useRef } from 'react'
import { IconShare } from '@tabler/icons-react'
import { prefersReducedMotion, beacon, TEAL, Reveal, useMobile, useModalExit } from './shared'
import { useLocale } from '../../hooks/useLocale'
import {
  RESEARCH_DOCS, LIBRARY_TEXT as TX, getResearchDoc, docPdfUrl, docPageUrl, docDoiUrl,
  type ResearchDoc, type Locale,
} from '../../lib/researchLibrary'

function fmtDate(iso: string, locale: Locale) {
  const [y, m, d] = iso.split('-').map(Number)
  const months = locale === 'de'
    ? ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return locale === 'de' ? `${d}. ${months[m - 1]} ${y}` : `${d} ${months[m - 1]} ${y}`
}

function useCarouselSize() {
  const [n, setN] = useState(() => (typeof window === 'undefined' ? 3 : window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3))
  useEffect(() => {
    const onResize = () => setN(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return n
}

function DocCard({ doc, onOpen }: { doc: ResearchDoc; onOpen: (slug: string) => void }) {
  const { locale } = useLocale()
  return (
    <a
      href={`/research/${doc.slug}/`}
      onClick={e => { e.preventDefault(); beacon('research_doc_card:' + doc.slug); onOpen(doc.slug) }}
      className="rfi-hover-card rfi-glass-flat rfi-glass-solid"
      style={{
        borderRadius: 16, padding: 0, display: 'flex', flexDirection: 'column', flex: '1 1 0', minWidth: 0,
        textAlign: 'left', cursor: 'pointer', textDecoration: 'none', border: `1.5px solid ${TEAL}`,
        font: 'inherit', color: 'inherit', overflow: 'hidden',
      }}
    >
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontSize: 'var(--fs-label)', fontWeight: 700, color: 'var(--accent-text)' }}>
            {TX.kind[doc.kind][locale]} · {fmtDate(doc.date, locale)}
          </span>
          <span style={{
            fontSize: 'var(--fs-label)', fontWeight: 700, padding: '3px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 3,
            border: '1px solid var(--text3)', color: 'var(--text2)', flexShrink: 0,
          }}>PDF</span>
        </div>
        <div style={{
          fontWeight: 900, fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-tight)', display: '-webkit-box',
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{doc.title[locale]}</div>
        <p style={{
          color: 'var(--text2)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', flex: 1, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{doc.blurb[locale]}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-text)', fontSize: 'var(--fs-small)', fontWeight: 700, marginTop: 4 }}>
          {TX.open[locale]} &rarr;
        </div>
      </div>
    </a>
  )
}

export function ResearchLibrary({ onOpen }: { onOpen: (slug: string) => void }) {
  const { locale } = useLocale()
  const perView = useCarouselSize()
  const reduced = prefersReducedMotion()
  const docs = RESEARCH_DOCS
  const n = docs.length
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const used = useRef(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  const markUsed = () => { if (!used.current) { used.current = true; beacon('research_carousel_used') } }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const io = new IntersectionObserver(items => {
      let bestRatio = -1, bestIdx = -1
      items.forEach(item => {
        const card = item.target as HTMLElement
        card.style.opacity = String(0.45 + item.intersectionRatio * 0.55)
        card.style.transform = `scale(${0.94 + item.intersectionRatio * 0.06})`
        if (item.intersectionRatio > bestRatio) { bestRatio = item.intersectionRatio; bestIdx = cardRefs.current.indexOf(card as HTMLDivElement) }
      })
      if (bestIdx >= 0) setActiveIdx(bestIdx)
    }, { root: track, threshold: Array.from({ length: 21 }, (_, i) => i / 20) })
    cardRefs.current.forEach(card => card && io.observe(card))
    const onScroll = () => markUsed()
    track.addEventListener('scroll', onScroll, { once: true, passive: true })
    return () => { io.disconnect(); track.removeEventListener('scroll', onScroll) }
  }, [n])

  const go = (dir: number, silent = false) => {
    if (!silent) markUsed()
    const track = trackRef.current
    if (!track) return
    const cardWidth = track.firstElementChild?.clientWidth ?? 300
    const maxScroll = track.scrollWidth - track.clientWidth
    const behavior = reduced ? 'auto' : 'smooth'
    if (dir < 0 && track.scrollLeft <= 2) track.scrollTo({ left: maxScroll, behavior })
    else if (dir > 0 && track.scrollLeft >= maxScroll - 2) track.scrollTo({ left: 0, behavior })
    else track.scrollBy({ left: cardWidth * dir, behavior })
  }

  // Slow showcase rotation, stops for good once a visitor steers (same rule as the Proof carousel).
  useEffect(() => {
    if (reduced || n <= perView) return
    const id = window.setInterval(() => {
      if (paused || used.current || document.hidden) return
      go(1, true)
    }, 4500)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, n, perView, paused])

  const phone = perView === 1
  const arrowSize = phone ? 36 : 44
  const arrowStyle: React.CSSProperties = {
    width: arrowSize, height: arrowSize, borderRadius: '50%', border: '1px solid rgba(0,245,196,0.3)',
    background: 'var(--bg2)', color: 'var(--accent-text)', fontSize: phone ? 'var(--fs-body)' : 'var(--fs-lead)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center',
  }
  const showArrows = n > perView

  return (
    <section id="research-library" style={{ padding: '24px 0 0' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Reveal>
          <h2 className="rfi-section-h2" style={{ marginBottom: 12 }}>{TX.heading[locale]}</h2>
        </Reveal>
        <Reveal delay={1}>
          <p style={{ color: 'var(--text)', fontSize: 'var(--fs-lead)', marginBottom: 40, maxWidth: 760 }}>{TX.subheading[locale]}</p>
        </Reveal>
      </div>
      <Reveal delay={1}>
        <div style={{ display: 'flex', alignItems: 'center', gap: phone ? 0 : 16 }}>
          {showArrows && !phone && <button onClick={() => go(-1)} aria-label={TX.prev[locale]} style={arrowStyle}>&larr;</button>}
          <div
            style={{ overflowX: 'hidden', overflowY: 'visible', flex: 1, minWidth: 0 }}
            onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
          >
            <div
              ref={trackRef}
              className="rfi-thin-scrollbar"
              style={{ display: 'flex', gap: 20, overflowX: 'auto', overflowY: 'visible', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', padding: '8px 4px 4px' }}
            >
              {docs.map((doc, i) => (
                <div key={doc.slug} ref={el => { cardRefs.current[i] = el }} style={{
                  flex: `0 0 ${phone ? '100%' : '340px'}`, minWidth: 0, boxSizing: 'border-box', display: 'flex', scrollSnapAlign: 'center',
                  transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <DocCard doc={doc} onOpen={onOpen} />
                </div>
              ))}
            </div>
          </div>
          {showArrows && !phone && <button onClick={() => go(1)} aria-label={TX.next[locale]} style={arrowStyle}>&rarr;</button>}
        </div>
        {showArrows && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: phone ? 12 : 28 }}>
            {phone && <button onClick={() => go(-1)} aria-label={TX.prev[locale]} style={arrowStyle}>&larr;</button>}
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>
              {String(Math.min(activeIdx + 1, n)).padStart(2, '0')} / {n}
            </span>
            {phone && <button onClick={() => go(1)} aria-label={TX.next[locale]} style={arrowStyle}>&rarr;</button>}
          </div>
        )}
      </Reveal>
    </section>
  )
}

function DocShare({ doc, locale }: { doc: ResearchDoc; locale: Locale }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation(); e.preventDefault(); setOpen(false); btnRef.current?.focus()
    }
    const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKey, true)
    document.addEventListener('mousedown', onDown)
    return () => { document.removeEventListener('keydown', onKey, true); document.removeEventListener('mousedown', onDown) }
  }, [open])
  const url = docPageUrl(doc)
  const title = `${doc.title[locale]} – RFI-IRFOS`
  const label = TX.share[locale]
  const u = encodeURIComponent(url), ti = encodeURIComponent(title), both = encodeURIComponent(`${title} ${url}`)
  const links = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'X', href: `https://x.com/intent/post?url=${u}&text=${ti}` },
    { label: 'Bluesky', href: `https://bsky.app/intent/compose?text=${both}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${both}` },
    { label: 'Reddit', href: `https://www.reddit.com/submit?url=${u}&title=${ti}` },
    { label: locale === 'de' ? 'E-Mail' : 'Email', href: `mailto:?subject=${ti}&body=${both}` },
  ]
  const onClick = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try { await navigator.share({ title, url }) } catch { /* user cancelled */ }
      return
    }
    setOpen(o => !o)
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { window.prompt(label, url) }
  }
  const item: React.CSSProperties = { display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#d8d8e8', fontSize: 'var(--fs-small)', padding: '8px 12px', cursor: 'pointer', textDecoration: 'none' }
  return (
    <span ref={wrapRef} style={{ position: 'relative', display: 'inline-flex', marginLeft: 'auto', marginRight: 2 }}>
      <button ref={btnRef} type="button" onClick={onClick} aria-label={label} title={label} aria-haspopup="menu" aria-expanded={open}
        style={{ background: 'none', border: 'none', color: '#8a8aa0', cursor: 'pointer', lineHeight: 1, padding: '9px 11px', display: 'inline-flex', alignItems: 'center' }}>
        <IconShare size={18} stroke={1.8} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" aria-label={label} style={{ position: 'absolute', right: 0, top: '100%', zIndex: 5, minWidth: 170, background: '#14141b', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.55)', padding: 4 }}>
          <button role="menuitem" type="button" onClick={copy} style={item} autoFocus>{copied ? TX.copied[locale] : TX.copyLink[locale]}</button>
          {links.map(l => (
            <a key={l.label} role="menuitem" href={l.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} style={item}>{l.label}</a>
          ))}
        </div>
      )}
    </span>
  )
}

// Modal: same carbon chrome as the Evidence report modal. `slug` null = closed.
export function ResearchDocModal({ slug, onClose, h1 }: { slug: string | null; onClose: () => void; h1?: boolean }) {
  const { locale } = useLocale()
  const mobile = useMobile()
  const exit = useModalExit(slug)
  useEffect(() => {
    if (!slug) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [slug, onClose])
  const doc = getResearchDoc(exit.rendered)
  if (!exit.rendered || !doc) return null
  const pdf = docPdfUrl(doc)
  const doi = docDoiUrl(doc)
  return (
    <div className={`rfi-modal-backdrop${exit.closing ? ' rfi-modal-backdrop-out' : ''}`} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(4,4,7,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className={`rfi-modal-panel${exit.closing ? ' rfi-modal-panel-out' : ''}`} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={doc.title[locale]} style={{
        width: '100%', maxWidth: 900, height: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(155deg, #17171d 0%, #0a0a0c 28%, #050506 52%, #131319 76%, #08080a 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
        backgroundBlendMode: 'overlay',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 50px rgba(0,0,0,0.55), 0 20px 60px rgba(0,0,0,0.65)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
      }}>
        {h1 && <h1 style={{ position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}>{doc.title[locale]}</h1>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', gap: 8 }}>
          <span style={{ fontSize: 'var(--fs-label)', color: TEAL }}>{TX.modalLabel[locale]}</span>
          {doi && <a href={doi} target="_blank" rel="noopener noreferrer" onClick={() => beacon('research_doc_doi:' + doc.slug)}
            style={{ fontSize: 'var(--fs-label)', color: '#a0a0b8', textDecoration: 'underline' }}>{TX.doi[locale]}</a>}
          <DocShare doc={doc} locale={locale} />
          <button onClick={onClose} aria-label={TX.close[locale]} style={{ background: 'none', border: 'none', color: '#8a8aa0', cursor: 'pointer', fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-tight)', padding: '9px 11px' }}>&#x2715;</button>
        </div>
        {mobile ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '32px 24px', textAlign: 'center' }}>
            <p style={{ color: '#a0a0b8', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', margin: 0, maxWidth: 320 }}>{TX.mobileHint[locale]}</p>
            <a href={pdf} target="_blank" rel="noopener noreferrer" onClick={() => beacon('research_doc_mobile_open:' + doc.slug)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', background: 'var(--accent)', color: 'var(--accent-fg)', fontWeight: 700, fontSize: 'var(--fs-small)', padding: '11px 20px', borderRadius: 8, letterSpacing: '0.02em' }}>
              {TX.mobileOpen[locale]}
            </a>
          </div>
        ) : (
          <iframe src={pdf} style={{ flex: 1, border: 'none', width: '100%' }} title={TX.iframeTitle[locale]} />
        )}
      </div>
    </div>
  )
}
