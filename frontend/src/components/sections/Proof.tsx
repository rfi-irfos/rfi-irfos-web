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
import { prefersReducedMotion, beacon, Reveal, useWideCarousel } from './shared'
import { useLocale } from '../../hooks/useLocale'
import { localeHref } from '../../lib/localeHref'
import { AUDIT_HIGHLIGHTS, AUDIT_META, reportSlug } from './TrackRecord'

type ProofEntry = { target: string; market: string; finding: string; reportUrl: string; resolvedDate?: string }

// Multiple ledger rows can point at the same published PDF (one consolidated
// report covering several app variants, e.g. foodora Consumer/Rider/Partner).
// Live feedback 2026-09-13: that showed up as 3 near-duplicate cards for one
// report. Merge rows sharing a reportUrl into a single card: title becomes
// "<common prefix> (<distinguishing part> / <distinguishing part> / ...)",
// finding text comes from whichever row has the longest (most complete) lede.
function mergeSharedReports(rows: ProofEntry[]): ProofEntry[] {
  const byUrl = new Map<string, ProofEntry[]>()
  for (const row of rows) {
    const group = byUrl.get(row.reportUrl) ?? []
    group.push(row)
    byUrl.set(row.reportUrl, group)
  }
  return [...byUrl.values()].map(group => {
    if (group.length === 1) return group[0]
    const names = group.map(g => g.target)
    let prefixLen = names[0].length
    for (const name of names.slice(1)) {
      let i = 0
      while (i < prefixLen && i < name.length && name[i] === names[0][i]) i++
      prefixLen = i
    }
    let prefix = names[0].slice(0, prefixLen).trim()
    // Only strip parens when the whole remainder is wrapped in them (the
    // Foodora case: "Foodora (Rider)" -> "Rider"). Don't touch a trailing
    // paren that's part of the distinguishing text itself (the StoryToys
    // case: "LEGO Bluey (IE)" must keep its own closing paren, or ten of
    // these joined by ' / ' turn into one run-on string of dangling "(IE"s
    // with a single stray ")" tacked on at the very end).
    let parts = names.map(n => {
      let s = n.slice(prefixLen).trim()
      if (s.startsWith('(') && s.endsWith(')')) s = s.slice(1, -1).trim()
      return s || 'Consumer'
    })
    // ViCare / ViGuide / ViParts (Viessmann) share only "Vi" as a text prefix, which cut the names
    // mid-word ("Vi (Care (Viessmann) / Guide (Viessmann) / ...)", Simeon 2026-11-19). When the
    // prefix ends inside a word and every name carries the same "(Brand)" tail, the brand becomes
    // the title and the app names stay whole: "Viessmann (ViCare / ViGuide / ViParts)".
    const brandTail = /\s*\(([^()]+)\)$/.exec(names[0])
    const cutMidWord = prefixLen > 0 && /\w/.test(names[0][prefixLen - 1]) && names.every(n => /\w/.test(n[prefixLen] ?? ''))
    if (brandTail && cutMidWord && names.every(n => n.endsWith(brandTail[0]))) {
      prefix = brandTail[1].trim()
      parts = names.map(n => n.slice(0, n.length - brandTail[0].length).trim())
    }
    const richest = group.reduce((a, b) => (b.finding.length > a.finding.length ? b : a))
    // A title listing every distinguishing part blows up past 3-4 members
    // (StoryToys: 10 apps, the Outfit7/Talking Tom franchise: 17) and forces
    // every other card in the same carousel row to match its height, so cap
    // what's spelled out and fold the rest into a count instead.
    const MAX_NAMED = 3
    const shownParts = parts.length > MAX_NAMED
      ? [...parts.slice(0, MAX_NAMED), `+${parts.length - MAX_NAMED} more`]
      : parts
    return { ...richest, target: `${prefix} (${shownParts.join(' / ')})` }
  })
}

function getProofEntries(locale: 'en' | 'de'): ProofEntry[] {
  const rows = AUDIT_HIGHLIGHTS
    .map(a => ({ a, meta: AUDIT_META[a.target] }))
    .filter((x): x is { a: typeof AUDIT_HIGHLIGHTS[number]; meta: NonNullable<typeof x.meta> & { reportUrl: string } } => !!x.meta?.reportUrl)
    .map(({ a, meta }) => ({
      target: a.target, market: a.market,
      finding: a.finding[locale].split(' — meaning ')[0], // drop the plain-language restatement, keep the technical lede
      reportUrl: meta.reportUrl, resolvedDate: meta.resolvedDate,
    }))
  return mergeSharedReports(rows)
    // Freshest publish leads the carousel - live feedback 2026-09-13: the
    // newest report (Foodora) was sitting third, buried behind older ones,
    // because entries just followed AUDIT_HIGHLIGHTS' own array order.
    .sort((a, b) => (b.resolvedDate ?? '').localeCompare(a.resolvedDate ?? ''))
}


function ProofCard({ entry, onOpen }: { entry: ProofEntry; onOpen: (url: string) => void }) {
  const { t } = useLocale()
  // Full teal frame instead of a top strip (Simeon, 2026-08-06, second pass -
  // a full-width colored bar per card, red or teal, still read as heavier
  // than needed; a thin border around the whole card reads as "featured
  // document" without dominating it).
  return (
    // Real <a href="/evidence/<slug>/"> (was <button onClick>) - 2026-09-25
    // crawlability sweep: this carousel is the site's own highlight reel of its
    // strongest evidence, yet every card was a button, contributing zero real
    // internal links to any of the individual report pages. preventDefault +
    // the same onOpen callback keeps the in-app click (opens the ledger's
    // report modal) identical to before.
    <a
      href={`/evidence/${reportSlug(entry.reportUrl)}/`}
      onClick={e => { e.preventDefault(); beacon('proof_card_click:' + entry.target); onOpen(entry.reportUrl) }}
      className="rfi-card-quiet rfi-hover-card rfi-glass-flat rfi-glass-solid"
      style={{
        borderRadius: 16, padding: 0, display: 'flex', flexDirection: 'column', gap: 0,
        flex: '1 1 0', minWidth: 0, textAlign: 'left', cursor: 'pointer', textDecoration: 'none',
        border: '1px solid var(--card-edge, rgba(255,255,255,0.12))', font: 'inherit', color: 'inherit', overflow: 'hidden',
      }}
    >
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ fontWeight: 900, fontSize: 'var(--fs-lead)', minWidth: 0 }}>{entry.target}</div>
          {/* PDF tag - live feedback (Simeon, 2026-08-06): the small file icon
              down by the link wasn't enough to signal at a glance that these
              cards ARE documents, not just more ledger rows. */}
          <span style={{
            fontSize: 'var(--fs-label)', fontWeight: 700, padding: '3px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 3,
            border: '1px solid var(--text3)', color: 'var(--text2)', flexShrink: 0,
          }}>
            <svg width="8" height="10" viewBox="0 0 10 12" fill="none"><path d="M1 1h5l3 3v7H1V1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6 1v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
            PDF
          </span>
        </div>
        <div style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>
          {entry.market}{entry.resolvedDate ? ` · ${t.proof.resolvedOn(entry.resolvedDate)}` : ''}
        </div>
        <p style={{ color: 'var(--text2)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', flex: 1, margin: 0, overflowWrap: 'anywhere', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {entry.finding}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-text)', fontSize: 'var(--fs-small)', fontWeight: 700, marginTop: 4 }}>
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M1 1h5l3 3v7H1V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M3 6h4M3 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
          {t.proof.viewReport} &rarr;
        </div>
      </div>
    </a>
  )
}

// Same scroll-snap carousel mechanics as ProjectsCarousel (Projects.tsx) - kept
// as its own copy rather than a shared generic: the two carousels' card shapes
// and click behaviour (external link vs. modal-open) differ enough that a
// shared abstraction would need as many branches as it saves lines.
function ProofCarousel({ entries, onOpen }: { entries: ProofEntry[]; onOpen: (url: string) => void }) {
  const { t } = useLocale()
  const { perView, phone, cardBasis, rowStyle } = useWideCarousel()
  const reduced = prefersReducedMotion()
  const n = entries.length

  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const carouselUsed = useRef(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)

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

  // Wraps at both ends - see the identical comment on ProjectsCarousel's go()
  // in Projects.tsx for why a plain scrollBy needed this. `silent` skips
  // markUsed() - the autoplay tick advances the track without counting as
  // the "user touched the carousel" signal that autoplay itself listens for.
  const go = (dir: number, silent = false) => {
    if (!silent) markUsed()
    const track = trackRef.current
    if (!track) return
    const cardWidth = track.firstElementChild?.clientWidth ?? 300
    const maxScroll = track.scrollWidth - track.clientWidth
    const atStart = track.scrollLeft <= 2
    const atEnd = track.scrollLeft >= maxScroll - 2
    if (dir < 0 && atStart) {
      track.scrollTo({ left: maxScroll, behavior: reduced ? 'auto' : 'smooth' })
    } else if (dir > 0 && atEnd) {
      track.scrollTo({ left: 0, behavior: reduced ? 'auto' : 'smooth' })
    } else {
      track.scrollBy({ left: cardWidth * dir, behavior: reduced ? 'auto' : 'smooth' })
    }
  }

  // Slow auto-rotate, showcase-style (Simeon, 2026-09-19: "langsam durchrotiert
  // wie so n showcase"). Stops for good the moment a visitor actually touches
  // the carousel (arrow click or manual scroll both flip carouselUsed) - once
  // someone is steering, autoplay fighting them is the failure mode. Also
  // pauses on hover/focus and respects prefers-reduced-motion outright.
  useEffect(() => {
    if (reduced || n <= perView) return
    const id = window.setInterval(() => {
      if (paused || carouselUsed.current || document.hidden) return
      go(1, true)
    }, 4500)
    return () => window.clearInterval(id)
  }, [reduced, n, perView, paused])

  const arrowSize = perView === 1 ? 36 : 44
  const arrowStyle: React.CSSProperties = {
    width: arrowSize, height: arrowSize, borderRadius: '50%', border: '1px solid rgba(0,245,196,0.3)',
    background: 'var(--bg2)', color: 'var(--accent-text)', fontSize: perView === 1 ? 'var(--fs-body)' : 'var(--fs-lead)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center',
  }
  // Phone: arrows move under the track and the card takes the full width - same
  // fix and same reasoning as ProjectsCarousel in Projects.tsx (2026-08-16).
  // 84% was the worst offender of the two: arrows + gaps + an 16% self-imposed
  // inset left the evidence card at barely half the viewport.
  const showArrows = n > perView

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: phone ? 0 : 16, ...rowStyle }}>
        {showArrows && !phone && <button onClick={() => go(-1)} aria-label={t.proof.carouselPrevAria} style={arrowStyle}>&larr;</button>}
        {/* overflowY visible (not hidden) - see identical note in Projects.tsx's
            ProjectsCarousel: the proximity glow needs room outside the card
            box, and scrolling here is horizontal-only anyway.
            paddingTop matches Projects.tsx's 2026-08-14 fix: overflowY:'visible'
            alone doesn't work, CSS coerces it to 'auto' the moment overflowX
            isn't 'visible' too, so the hover lift (.rfi-hover-card's
            translateY(-4px) + shadow) still needs real padding to render
            before it reaches the clip edge - this copy never got that fix
            ported over, which is why the card top clipped on hover. */}
        <div
          style={{ overflowX: 'hidden', overflowY: 'visible', flex: 1, minWidth: 0 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="rfi-thin-scrollbar"
            style={{
              display: 'flex', gap: 20, overflowX: 'auto', overflowY: 'visible', scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch', padding: '8px 4px 4px',
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
        {showArrows && !phone && <button onClick={() => go(1)} aria-label={t.proof.carouselNextAria} style={arrowStyle}>&rarr;</button>}
      </div>
      {showArrows && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: phone ? 12 : 28 }}>
          {phone && <button onClick={() => go(-1)} aria-label={t.proof.carouselPrevAria} style={arrowStyle}>&larr;</button>}
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>
            {String(Math.min(activeIdx + 1, n)).padStart(2, '0')} / {n}
          </span>
          {phone && <button onClick={() => go(1)} aria-label={t.proof.carouselNextAria} style={arrowStyle}>&rarr;</button>}
        </div>
      )}
    </div>
  )
}

export function ProofSection({ setReportModal }: { setReportModal: (url: string) => void }) {
  const { t, locale } = useLocale()
  const entries = getProofEntries(locale)
  if (entries.length === 0) return null // nothing published yet - section simply doesn't render, no empty-state placeholder needed
  return (
    <section id="proof" style={{ padding: '0 var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        {/* Centered to match Data Solutions/Access/Evidence's heading treatment -
            live feedback 2026-09-13: this was still left-aligned. */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Reveal>
            <h2 className="rfi-section-h2" style={{ marginBottom: 12 }}>{t.proof.heading}</h2>
          </Reveal>
          <Reveal delay={1}>
            <p style={{ color: 'var(--text)', fontSize: 'var(--fs-lead)', marginBottom: 40, maxWidth: 620 }}>{t.proof.subheading}</p>
          </Reveal>
        </div>
        <Reveal delay={1}>
          <ProofCarousel entries={entries} onOpen={setReportModal} />
        </Reveal>
        <p style={{ color: 'var(--text2)', margin: '14px auto 0', maxWidth: 720, textAlign: 'center', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)' }}>
          {t.trackRecord.follow.servicesLabel}{' '}
          <a href={localeHref('/app-security-audit/', locale)} className="rfi-inline-link">{t.trackRecord.follow.audit}</a>{' · '}
          <a href={localeHref('/secure-code-review/', locale)} className="rfi-inline-link">{t.trackRecord.follow.review}</a>{' · '}
          <a href={localeHref('/managed-soc/', locale)} className="rfi-inline-link">{t.trackRecord.follow.soc}</a>{' · '}
          <a href={localeHref('/faq/', locale)} className="rfi-inline-link">{t.trackRecord.follow.faq}</a>
        </p>
        {/* Follow channels (Simeon 19.11.): under the services line; the Quick Check sentence is gone, the check sits on the home page. */}
        <p style={{ color: 'var(--text2)', margin: '10px auto 0', maxWidth: 720, textAlign: 'center', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)' }}>
          <a href="/evidence/feed.xml" className="rfi-inline-link">{t.trackRecord.follow.feed}</a>{' · '}
          <a href="https://www.linkedin.com/company/rfi-irfos" className="rfi-inline-link">LinkedIn</a>{' · '}
          <a href="https://www.youtube.com/@rfi-irfos-official" className="rfi-inline-link">YouTube</a>
        </p>
      </div>
    </section>
  )
}
