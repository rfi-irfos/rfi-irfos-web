// "Proof" section (`#proof`) - sits directly under the Track Record ledger.
// Live feedback (Laura, 2026-08-06): the ledger has real reports in it, but a
// cold visitor has to find the ledger, filter it, then click into a row to
// discover that - nobody digs that deep. This section surfaces every ledger
// entry that already has a published report as its own quick-glance card,
// right below the ledger, so the proof is visible without searching for it.
//
// Single source of truth: reads AUDIT_HIGHLIGHTS + AUDIT_META straight from
// TrackRecord.tsx. The moment a `reportUrl` is added to an AUDIT_META entry
// (i.e. a PDF gets uploaded to the ledger), it appears here automatically -
// no separate data entry, per Simeon's explicit ask.
import { useState, useEffect, useRef } from 'react'
import { prefersReducedMotion, beacon, TEAL, Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'
import { AUDIT_HIGHLIGHTS, AUDIT_META } from './TrackRecord'

const SEV_COLOR: Record<string, string> = { CRITICAL: '#f87171', HIGH: '#fb923c', MEDIUM: '#fbbf24' }

type ProofEntry = { target: string; market: string; sev: string; finding: string; reportUrl: string; resolvedDate?: string }

function getProofEntries(): ProofEntry[] {
  return AUDIT_HIGHLIGHTS
    .map(a => ({ a, meta: AUDIT_META[a.target] }))
    .filter((x): x is { a: typeof AUDIT_HIGHLIGHTS[number]; meta: NonNullable<typeof x.meta> & { reportUrl: string } } => !!x.meta?.reportUrl)
    .map(({ a, meta }) => ({
      target: a.target, market: a.market, sev: a.sev,
      finding: a.finding.split(' — meaning ')[0], // drop the plain-language restatement, keep the technical lede
      reportUrl: meta.reportUrl, resolvedDate: meta.resolvedDate,
    }))
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

function ProofCard({ entry, onOpen }: { entry: ProofEntry; onOpen: (url: string) => void }) {
  const { t } = useLocale()
  const color = SEV_COLOR[entry.sev] ?? TEAL
  return (
    <button
      onClick={() => { beacon('proof_card_click:' + entry.target); onOpen(entry.reportUrl) }}
      className="rfi-hover-card rfi-glass-flat"
      style={{
        borderRadius: 16, padding: 0, display: 'flex', flexDirection: 'column', gap: 0,
        flex: '1 1 0', minWidth: 0, textAlign: 'left', cursor: 'pointer', border: 'none',
        font: 'inherit', color: 'inherit', overflow: 'hidden',
      }}
    >
      <div style={{ height: 5, background: color, flexShrink: 0 }} />
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontWeight: 900, fontSize: 17, minWidth: 0 }}>{entry.target}</div>
          <span style={{
            fontSize: 9, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em',
            padding: '3px 8px', borderRadius: 20, flexShrink: 0, border: `1px solid ${color}`, color,
          }}>{entry.sev}</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {entry.market}{entry.resolvedDate ? ` · ${t.proof.resolvedOn(entry.resolvedDate)}` : ''}
        </div>
        <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.65, flex: 1, margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {entry.finding}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-text)', fontSize: 12, fontWeight: 700, marginTop: 4 }}>
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M1 1h5l3 3v7H1V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M3 6h4M3 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
          {t.proof.viewReport} &rarr;
        </div>
      </div>
    </button>
  )
}

// Same scroll-snap carousel mechanics as ProjectsCarousel (Projects.tsx) - kept
// as its own copy rather than a shared generic: the two carousels' card shapes
// and click behaviour (external link vs. modal-open) differ enough that a
// shared abstraction would need as many branches as it saves lines.
function ProofCarousel({ entries, onOpen }: { entries: ProofEntry[]; onOpen: (url: string) => void }) {
  const { t } = useLocale()
  const perView = useCarouselSize()
  const reduced = prefersReducedMotion()
  const n = entries.length

  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const carouselUsed = useRef(false)
  const [activeIdx, setActiveIdx] = useState(0)

  const markUsed = () => {
    if (!carouselUsed.current) { carouselUsed.current = true; beacon('proof_carousel_used') }
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const io = new IntersectionObserver(entries => {
      let bestRatio = -1, bestIdx = -1
      entries.forEach(entry => {
        const card = entry.target as HTMLElement
        const ratio = entry.intersectionRatio
        card.style.opacity = String(0.45 + ratio * 0.55)
        card.style.transform = `scale(${0.94 + ratio * 0.06})`
        if (ratio > bestRatio) { bestRatio = ratio; bestIdx = cardRefs.current.indexOf(card as HTMLDivElement) }
      })
      if (bestIdx >= 0) setActiveIdx(bestIdx)
    }, { root: track, threshold: Array.from({ length: 21 }, (_, i) => i / 20) })
    cardRefs.current.forEach(card => card && io.observe(card))
    const onScroll = () => markUsed()
    track.addEventListener('scroll', onScroll, { once: true, passive: true })
    return () => { io.disconnect(); track.removeEventListener('scroll', onScroll) }
  }, [n])

  const go = (dir: number) => {
    markUsed()
    if (trackRef.current) {
      const cardWidth = trackRef.current.firstElementChild?.clientWidth ?? 300
      trackRef.current.scrollBy({ left: cardWidth * dir, behavior: reduced ? 'auto' : 'smooth' })
    }
  }

  const arrowSize = perView === 1 ? 36 : 44
  const arrowStyle: React.CSSProperties = {
    width: arrowSize, height: arrowSize, borderRadius: '50%', border: '1px solid rgba(0,245,196,0.3)',
    background: 'var(--bg2)', color: 'var(--accent-text)', fontSize: perView === 1 ? 15 : 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center',
  }
  const cardBasis = perView === 1 ? '84%' : '340px'
  const showArrows = n > perView

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: perView === 1 ? 10 : 16 }}>
        {showArrows && <button onClick={() => go(-1)} aria-label={t.proof.carouselPrevAria} style={arrowStyle}>&larr;</button>}
        <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex', gap: 20, overflowX: 'auto', scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch', paddingBottom: 4,
            }}
          >
            {entries.map((entry, i) => (
              <div key={entry.target} ref={el => { cardRefs.current[i] = el }} style={{
                flex: `0 0 ${cardBasis}`, minWidth: 0, boxSizing: 'border-box', display: 'flex',
                scrollSnapAlign: 'center',
                transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <ProofCard entry={entry} onOpen={onOpen} />
              </div>
            ))}
          </div>
        </div>
        {showArrows && <button onClick={() => go(1)} aria-label={t.proof.carouselNextAria} style={arrowStyle}>&rarr;</button>}
      </div>
      {showArrows && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', letterSpacing: '0.08em' }}>
            {String(Math.min(activeIdx + 1, n)).padStart(2, '0')} / {n}
          </span>
        </div>
      )}
    </div>
  )
}

export function ProofSection({ setReportModal }: { setReportModal: (url: string) => void }) {
  const { t } = useLocale()
  const entries = getProofEntries()
  if (entries.length === 0) return null // nothing published yet - section simply doesn't render, no empty-state placeholder needed
  return (
    <section id="proof" style={{ padding: '0 2rem 72px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="right">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{t.proof.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}><ScrambleHeading text={t.proof.heading} /></h2>
        </Reveal>
        <Reveal from="left" delay={1}>
          <p style={{ color: 'var(--text2)', marginBottom: 40, maxWidth: 620 }}>{t.proof.subheading}</p>
        </Reveal>
        <Reveal from="bottom" delay={1}>
          <ProofCarousel entries={entries} onOpen={setReportModal} />
        </Reveal>
      </div>
    </section>
  )
}
