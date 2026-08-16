// "Projects" section (`#projects`, "what we build") - extracted verbatim from
// PublicSite.tsx.
import { useState, useEffect, useRef } from 'react'
import { prefersReducedMotion, beacon, Reveal, ScrambleHeading, TEAL } from './shared'
import { useLocale } from '../../hooks/useLocale'

function IntelligenceProofShowcase() {
  const { t } = useLocale()
  const pairs = t.projects.problemSolution.pairs
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = prefersReducedMotion()
  useEffect(() => {
    if (reduced || paused) return
    const timer = setInterval(() => setI(prev => (prev + 1) % pairs.length), 10000)
    return () => clearInterval(timer)
  }, [reduced, paused, pairs.length])
  const pair = pairs[reduced ? 0 : i]
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{
      maxWidth: 680, margin: '0 auto', height: 'clamp(140px, 13vw, 170px)', boxSizing: 'border-box', textAlign: 'center',
      background: 'linear-gradient(var(--accent-dim), var(--accent-dim)), var(--glass-bg-solid)',
      border: '1px solid rgba(0,245,196,0.2)', borderRadius: 16, padding: '24px 32px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-text)', marginBottom: 10 }}>{pair.a}</p>
      <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, margin: 0, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>{pair.detail}</p>
      {!reduced && <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
        {pairs.map((_, idx) => <button key={idx} aria-label={`Show intelligence proof ${idx + 1} of ${pairs.length}`} onClick={() => setI(idx)} style={{
          width: 8, height: 8, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
          background: idx === i ? 'var(--accent-text)' : 'rgba(255,255,255,0.18)', transition: 'background 0.2s',
        }} />)}
      </div>}
    </div>
  )
}

// 3-at-a-time (2 on tablet, 1 on phone) project carousel with wraparound arrows -
// replaces the old "all 14 cards at once" grid, which was the single biggest
// contributor to page weight/density on the homepage.
function useCarouselSize() {
  const [n, setN] = useState(() => (typeof window === 'undefined' ? 3 : window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3))
  useEffect(() => {
    const onResize = () => setN(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return n
}

// Localized project - PROJECTS below carries only locale-independent fields
// (name, link); sub/desc/tag come from the current locale's t.projects.items,
// zipped together by index in ProjectsSection/ProjectsCarousel.
type LocalizedProject = { name: string; link: string | null; sub: string; desc: string; plain?: string; tag: string }

function ProjectCard({ p }: { p: LocalizedProject }) {
  // background and border are deliberately absent from the inline style: .rfi-glass-flat
  // supplies both, and an inline declaration would override the class. That specificity
  // trap is exactly why the hover lift silently did nothing on the other card families.
  // Flat variant, not .rfi-glass: these repeat and sit inside a horizontal scroll
  // container, and backdrop-filter re-samples every scroll frame.
  return (
    <div className="rfi-hover-card rfi-glass-flat rfi-glass-solid" style={{
      borderRadius: 16, padding: '32px 28px', minHeight: 390, display: 'flex', flexDirection: 'column', gap: 12,
      flex: '1 1 0', minWidth: 0,
    }}>
      {/* flexWrap+minWidth:0+flexShrink:0 - on narrow cards (mobile, 84% basis) a long
          project name left no room for a nowrap badge on the same line, and since this
          row had no overflow:hidden of its own, the badge text silently overflowed past
          the card edge and got guillotined by the carousel track's overflow:hidden
          instead ("CORE PLATFO|" mid-word). Wrapping drops the badge to its own line
          when space is tight rather than letting it run off the card. */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px 8px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 900, fontSize: 17 }}>{p.name}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{p.sub}</div>
        </div>
        <span style={{
          fontSize: 9, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em',
          padding: '3px 8px', borderRadius: 20, flexShrink: 0,
          border: '1px solid rgba(0,245,196,0.3)', color: 'var(--accent-text)', whiteSpace: 'nowrap',
        }}>{p.tag}</span>
      </div>
      {/* Reordered 2026-08-15 (live feedback: "the technicals are on github,
          the page is for humans") - the plain-language line now leads, since
          it's the only sentence on the card most visitors can actually parse
          without a CS background; the architecture desc below is demoted to
          a smaller, muted secondary line instead of the primary read. Same
          teal-left-border treatment as the research modal's plain line and
          the pricing modal's punchline, for one consistent "here's the
          one-sentence version" pattern site-wide. Outbound crates.io/GitHub
          link removed entirely (feedback: "we get rid of the links that link
          away, we loose too much attention... all links are anyways down in
          the bottom" - every one of these systems already has its own full
          System Card modal reachable from the footer). Losing that link is
          also what fixes the "not fully visible when you click on it" bug:
          a long desc plus a link plus minHeight:390 pushed real content past
          the track wrapper's effective clip height (see the overflowY
          comment on the carousel below) - shorter, demoted desc plus no link
          keeps every card well under that limit instead of relying on the
          scroll-driven opacity/scale rig to hide the overflow. */}
      {p.plain && (
        <p style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, lineHeight: 1.6, margin: 0, paddingLeft: 12, borderLeft: `2px solid ${TEAL}` }}>{p.plain}</p>
      )}
      <p style={{ color: 'var(--text3)', fontSize: 12, lineHeight: 1.6, flex: 1, margin: 0 }}>{p.desc}</p>
    </div>
  )
}

// Horizontal scroll-scrubbed gallery. A pinned GSAP/ScrollTrigger version was tried and
// shipped as an overflowing, unpinned mess (all cards dumped in one wide row) -
// ScrollTrigger almost certainly measured track width before layout/fonts settled.
// Reverted to this native scroll-snap version, which was never reported broken, and
// removed the gsap dependency entirely since nothing else in the codebase used it -
// pure dead weight in the bundle for a feature that was permanently disabled anyway.
function ProjectsCarousel({ projects }: { projects: LocalizedProject[] }) {
  const { t } = useLocale()
  const perView = useCarouselSize()
  const reduced = prefersReducedMotion()
  const n = projects.length

  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const carouselUsed = useRef(false)
  const [activeIdx, setActiveIdx] = useState(0)

  const markUsed = () => {
    if (!carouselUsed.current) { carouselUsed.current = true; beacon('projects_carousel_used') }
  }

  // Edge fade via IntersectionObserver against the track itself.
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
    // 21 stops, not 5. The observer writes opacity/scale only on threshold crossings,
    // so five stops between 0.94 and 1.0 rendered as five discrete jumps - that stepped
    // snap is the "cards expand instantly" complaint. A continuous ramp scrubs.
    }, { root: track, threshold: Array.from({ length: 21 }, (_, i) => i / 20) })
    cardRefs.current.forEach(card => card && io.observe(card))
    const onScroll = () => markUsed()
    track.addEventListener('scroll', onScroll, { once: true, passive: true })
    return () => { io.disconnect(); track.removeEventListener('scroll', onScroll) }
  }, [n])

  // Wraps at both ends (Simeon, 2026-08-06: clicking left at the first card, or
  // right at the last, should loop instead of just stopping dead) - a plain
  // scrollBy has no concept of "the end," so the boundary has to be checked
  // explicitly against the track's actual scroll extent before deciding whether
  // to advance normally or jump to the opposite edge.
  const go = (dir: number) => {
    markUsed()
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

  // Smaller arrows + tighter gap on phone (perView===1): two 44px round buttons plus
  // 16px gaps on each side ate 120px of a 390px viewport before the card even got its
  // 84% basis, which is most of why the carousel read as cramped on mobile.
  const arrowSize = perView === 1 ? 36 : 44
  const arrowStyle: React.CSSProperties = {
    width: arrowSize, height: arrowSize, borderRadius: '50%', border: '1px solid rgba(0,245,196,0.3)',
    background: 'var(--bg2)', color: 'var(--accent-text)', fontSize: perView === 1 ? 15 : 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center',
  }
  // On phones the arrows leave the row entirely and join the position counter
  // underneath (2026-08-16, same fix as the Access offer carousel): even at the
  // reduced 36px they plus their gaps still charged 92px against a 348px
  // viewport, so the card got 92% of the remaining 256px = 235px, i.e. a 62%-
  // width card with two dead gutters - the "thin vertical rectangle" shape the
  // whole page was reported for. Out of the row, the card takes the full width
  // and the arrows stay reachable directly under it.
  const phone = perView === 1
  const cardBasis = phone
    ? '100%'
    : `calc((100% - ${20 * (perView - 1)}px) / ${perView})`

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: phone ? 0 : 16 }}>
        {!phone && <button onClick={() => go(-1)} aria-label={t.projects.carouselPrevAria} style={arrowStyle}>&larr;</button>}
        {/* overflowY: 'visible' here doesn't actually work on its own - CSS
            coerces a non-'visible' overflow-y to 'auto' the moment overflow-x
            is anything other than 'visible' too (spec rule, not a bug in this
            code), so both this wrapper's overflowX: 'hidden' and the scroll
            track's overflowX: 'auto' below still clip vertically regardless of
            what overflowY says. Fixed 2026-08-14 (live feedback: hover shadow
            visibly cut off, "schaut billig aus") the only way that actually
            works around the coercion: pad the box enough that .rfi-hover-card's
            hover shadow (translateY(-4px) + 0 12px 28px) has room to fully
            render before it ever reaches the clip edge. */}
        <div style={{ overflowX: 'hidden', overflowY: 'visible', flex: 1, minWidth: 0 }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex', gap: 20, overflowX: 'auto', overflowY: 'visible', scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch', padding: '8px 4px 44px',
            }}
          >
            {projects.map((p, i) => (
              <div key={p.name} ref={el => { cardRefs.current[i] = el }} style={{
                flex: `0 0 ${cardBasis}`, minWidth: 0, boxSizing: 'border-box', display: 'flex',
                scrollSnapAlign: 'center',
                transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <ProjectCard p={p} />
              </div>
            ))}
          </div>
        </div>
        {!phone && <button onClick={() => go(1)} aria-label={t.projects.carouselNextAria} style={arrowStyle}>&rarr;</button>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: phone ? 4 : 28 }}>
        {phone && <button onClick={() => go(-1)} aria-label={t.projects.carouselPrevAria} style={arrowStyle}>&larr;</button>}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', letterSpacing: '0.08em' }}>
          {String(Math.min(activeIdx + 1, n)).padStart(2, '0')} / {n}
        </span>
        {phone && <button onClick={() => go(1)} aria-label={t.projects.carouselNextAria} style={arrowStyle}>&rarr;</button>}
      </div>
    </div>
  )
}

// ── Term hierarchy (website-repositioning plan, Stage 1d) ──────────────────────
// Fixed. Do not introduce a new top-level term anywhere on the site outside this
// hierarchy without updating the plan itself first:
//
//   RFI
//    └─ Technology Intelligence   (internal framing only — never surfaced to a
//                                  visitor as a product/service name, it's the
//                                  RESULT of the three services below, not a
//                                  fourth thing alongside them)
//        └─ Services:   Investigate · Assess · Monitor
//             Investigate — understand what happened
//             Assess      — understand where the risk sits
//             Monitor     — understand how a system changes over time
//        └─ Domains (human → product → system order; App Privacy is the
//                     deliberate door-opener, not equal billing with the rest):
//             1. App Privacy & Data Behaviour   (see #app-privacy section)
//             2. AI Behaviour & Reliability     (not "AI Safety" — see plan 1d)
//             3. Security                       (root-cause analysis)
//             4. Competitive Intelligence       (sourcing phrase + value phrase
//                                                 must always appear together,
//                                                 never sourcing alone)
//
// Stage 1e/1f/1g landed in a later pass (2026-08-02): the pricing carousel below
// (see `TierCarousel`), the Evidence section (#evidence), and Investigation
// Principles section (#investigation-principles) all use this same Investigate ·
// Assess · Monitor vocabulary - no new top-level term was introduced for any of
// them. Note Stage 1e's own correction, same date: Laura's "reduce 19 tiers to
// ~3" recommendation was explicitly overridden by the user - every existing tier
// stayed, the carousel is the display mechanism, not a reduction.

// Locale-independent fields only (name, link) - sub/desc/tag come from the
// current locale's t.projects.items, zipped together by index below.
export const PROJECTS = [
  // DINGIR leads the carousel on purpose (live feedback 2026-08-15: "our
  // frontier model and prime value proposition... this is very crucial that
  // this is the first card") - it was previously missing from this section
  // entirely despite being a real, operational system (see content/systems.ts
  // 'dingir'). No outbound link: not yet public on GitHub.
  { name: 'DINGIR', link: null },
  { name: 'Ternary Intelligence Stack', link: 'https://github.com/rfi-irfos/ternary-intelligence-stack' },
  { name: 'albert.', link: 'https://github.com/rfi-irfos/ternary-intelligence-stack' },
  { name: 'Rusty Penguin', link: 'https://github.com/rfi-irfos/rusty-penguin' },
  { name: 'Lighthouse', link: null },
  { name: 'Android Security Audit 2026', link: 'https://github.com/rfi-irfos/android-security-audit-2026' },
  { name: 'aladdin-mini', link: 'https://github.com/rfi-irfos/aladdin-mini' },
  { name: 'albert-cli', link: 'https://github.com/rfi-irfos/agent-albert-cli' },
  { name: 'albert-llb', link: 'https://crates.io/crates/albert-llb' },
  { name: 'ternlang-core', link: 'https://crates.io/crates/ternlang-core' },
  { name: 'ternlang-moe', link: 'https://crates.io/crates/ternlang-moe' },
  { name: 'invisible layer', link: 'https://github.com/rfi-irfos/invisible-layer' },
  { name: 'rfi-irfos port prox', link: 'https://github.com/rfi-irfos/lauras-port-proxy' },
  { name: 'LAURA', link: 'https://github.com/rfi-irfos/laura' },
  { name: 'call-laura', link: 'https://github.com/rfi-irfos/call-laura' },
  { name: "Laura's Agents", link: 'https://github.com/rfi-irfos/lauras-agents-public' },
  { name: 'CoEvolution Factory', link: 'https://coevolution-factory-sparkling-mountain-1802.fly.dev' },
  { name: 'VEO Framework', link: 'https://github.com/rfi-irfos/veo-framework' },
  { name: 'NFCS', link: 'https://github.com/rfi-irfos/foodchain-analysis' },
]

// PROJECTS section (`#projects`, "what we build") plus the intelligence proof
// showcase underneath it.
export function ProjectsSection() {
  const { t } = useLocale()
  const localizedProjects: LocalizedProject[] = PROJECTS.map((p, i) => ({
    name: p.name, link: p.link, ...t.projects.items[i],
  }))
  return (
    <section id="projects" style={{ padding: '16px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="right">
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}><ScrambleHeading text={t.projects.heading} /></h2>
        </Reveal>
        <Reveal from="left" delay={1}>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
            {t.projects.subheading}
          </p>
        </Reveal>
        <Reveal from="bottom" delay={1}>
          <ProjectsCarousel projects={localizedProjects} />
        </Reveal>

        {/* Compact proof points keep the research claims concrete without adding
            another full content block to the page. */}
        <Reveal from="bottom" delay={2}>
          <div style={{ marginTop: 56 }}>
            <IntelligenceProofShowcase />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
