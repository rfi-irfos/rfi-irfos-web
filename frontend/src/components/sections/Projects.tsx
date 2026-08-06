// "Projects" section (`#projects`, "what we build") - extracted verbatim from
// PublicSite.tsx, including the Problem/Solution showcase that lives under it.
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { prefersReducedMotion, beacon, TEAL, Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

// Problem/solution pairs (website-repositioning plan, Stage 1a) - moved out of
// the hero into "what we build" (live feedback, 2026-08-02): each pair now
// carries one enrichment line (concrete, no new facts - just spelling out the
// same claim already made elsewhere on the page: Investigation Principles'
// "trace root cause" language, the Evidence section's five-question format,
// the AI Act risk-tier framing from the pricing scope tags) plus a quicklink
// to the pricing product line that actually delivers it. All four map to
// Security Audits & Responsible Disclosure - the "Mobile + Web + AI" scope tag
// is literally the product that covers AI/software/compliance investigation.
// Auto-rotating problem/solution showcase - reuses the same fade/blur/
// translateY language as Reveal/RevealWords above rather than a new animation
// approach or library. Pauses on hover, advances on a timer otherwise, and skips
// the timer entirely under reduced-motion (renders the first pair, static, forever -
// no forced motion, no confusing mid-cycle freeze-frame).
function ProblemSolutionShowcase() {
  const { t } = useLocale()
  const pairs = t.projects.problemSolution.pairs
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = prefersReducedMotion()
  useEffect(() => {
    if (reduced || paused) return
    const t = setInterval(() => setI(prev => (prev + 1) % pairs.length), 10000)
    return () => clearInterval(t)
  }, [reduced, paused, pairs.length])
  const pair = pairs[reduced ? 0 : i]
  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        maxWidth: 680, margin: '0 auto', minHeight: 170, textAlign: 'center',
        background: 'rgba(0,245,196,0.04)', border: '1px solid rgba(0,245,196,0.2)',
        borderRadius: 16, padding: '32px 36px',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={reduced ? 'static' : i}
          initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduced ? undefined : { opacity: 0, y: -14, filter: 'blur(6px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{pair.q}</p>
          <p style={{ fontSize: 16, color: 'var(--accent-text)', fontWeight: 600, marginBottom: 10 }}>{pair.a}</p>
          {/* Pricing pill-link removed entirely (live feedback) - not needed here. */}
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, margin: 0, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>{pair.detail}</p>
        </motion.div>
      </AnimatePresence>
      {!reduced && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
          {pairs.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Show problem ${idx + 1} of ${pairs.length}`}
              onClick={() => setI(idx)}
              style={{
                width: 8, height: 8, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
                background: idx === i ? TEAL : 'rgba(255,255,255,0.18)', transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
      )}
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
type LocalizedProject = { name: string; link: string | null; sub: string; desc: string; tag: string }

function ProjectCard({ p }: { p: LocalizedProject }) {
  const { t } = useLocale()
  // background and border are deliberately absent from the inline style: .rfi-glass-flat
  // supplies both, and an inline declaration would override the class. That specificity
  // trap is exactly why the hover lift silently did nothing on the other card families.
  // Flat variant, not .rfi-glass: these repeat and sit inside a horizontal scroll
  // container, and backdrop-filter re-samples every scroll frame.
  return (
    <div className="rfi-hover-card rfi-glass-flat" style={{
      borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12,
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
      <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7, flex: 1 }}>{p.desc}</p>
      {p.link && (
        <a href={p.link} target="_blank" rel="noopener noreferrer"
          onClick={() => beacon('project_click:' + p.name)}
          style={{ color: 'var(--accent-text)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
          {p.link.includes('crates.io') ? t.projects.viewOnCratesIo : p.link.includes('github.com') ? t.projects.viewOnGitHub : t.projects.viewLive} &rarr;
        </a>
      )}
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
  const cardBasis = perView === 1 ? '84%' : '340px'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: perView === 1 ? 10 : 16 }}>
        <button onClick={() => go(-1)} aria-label={t.projects.carouselPrevAria} style={arrowStyle}>&larr;</button>
        <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex', gap: 20, overflowX: 'auto', scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch', paddingBottom: 4,
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
        <button onClick={() => go(1)} aria-label={t.projects.carouselNextAria} style={arrowStyle}>&rarr;</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', letterSpacing: '0.08em' }}>
          {String(Math.min(activeIdx + 1, n)).padStart(2, '0')} / {n}
        </span>
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

// PROJECTS section (`#projects`, "what we build") plus the Problem/Solution
// showcase underneath it (moved here from the hero, live feedback 2026-08-02).
export function ProjectsSection() {
  const { t } = useLocale()
  const localizedProjects: LocalizedProject[] = PROJECTS.map((p, i) => ({
    name: p.name, link: p.link, ...t.projects.items[i],
  }))
  return (
    <section id="projects" style={{ padding: '48px 2rem 72px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="right">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{t.projects.eyebrow}</p>
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

        {/* Problem/solution showcase, moved here from the hero (live feedback,
            2026-08-02): reads better as content next to the actual work than as
            hero decoration. */}
        <Reveal from="bottom" delay={2}>
          <div style={{ marginTop: 56 }}>
            <ProblemSolutionShowcase />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
