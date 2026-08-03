// "Projects" section (`#projects`, "what we build") - extracted verbatim from
// PublicSite.tsx, including the Problem/Solution showcase that lives under it.
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { prefersReducedMotion, beacon, TEAL, Reveal } from './shared'

// Problem/solution pairs (website-repositioning plan, Stage 1a) - moved out of
// the hero into "what we build" (live feedback, 2026-08-02): each pair now
// carries one enrichment line (concrete, no new facts - just spelling out the
// same claim already made elsewhere on the page: Investigation Principles'
// "trace root cause" language, the Evidence section's five-question format,
// the AI Act risk-tier framing from the pricing scope tags) plus a quicklink
// to the pricing product line that actually delivers it. All four map to
// Security Audits & Responsible Disclosure - the "Mobile + Web + AI" scope tag
// is literally the product that covers AI/software/compliance investigation.
const PROBLEM_SOLUTION_PAIRS = [
  {
    q: "Your AI doesn't behave the way it's supposed to?",
    a: "We investigate what it actually does, not what the documentation promised.",
    detail: 'Root-level testing against real inputs and real users, not a vendor demo or a benchmark score.',
  },
  {
    q: 'Your software behaves differently in production than it did in testing?',
    a: 'We observe the system as it really runs, under real conditions.',
    detail: 'The same root-cause tracing discipline behind every finding we publish - stopping at the first symptom isn\'t a finding yet.',
  },
  {
    q: "You're worried about the AI Act and don't know where you actually stand?",
    a: 'We assess where the real risk sits, not just where a checklist points.',
    detail: 'Mapped against actual risk tiers and real data flows, not a generic compliance questionnaire.',
  },
  {
    q: "There's a security issue and nobody can explain how it happened?",
    a: 'We trace it back through the system until the cause is clear.',
    detail: 'Delivered in the same five-question format as every audit: what we found, what proves it, how we proved it, how sure we are, what to do about it.',
  },
] as const

// Auto-rotating problem/solution showcase - reuses the same fade/blur/
// translateY language as Reveal/RevealWords above rather than a new animation
// approach or library. Pauses on hover, advances on a timer otherwise, and skips
// the timer entirely under reduced-motion (renders the first pair, static, forever -
// no forced motion, no confusing mid-cycle freeze-frame).
function ProblemSolutionShowcase() {
  const pairs = PROBLEM_SOLUTION_PAIRS
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = prefersReducedMotion()
  useEffect(() => {
    if (reduced || paused) return
    const t = setInterval(() => setI(prev => (prev + 1) % pairs.length), 7000)
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
          <p style={{ fontSize: 16, color: TEAL, fontWeight: 600, marginBottom: 10 }}>{pair.a}</p>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>{pair.detail}</p>
          {/* Shrunk from a full sentence-length link to a small pill (live
              feedback: less clutter in the box) - "Pricing" is enough context
              since the box itself is already about a specific problem/solution. */}
          <a href="#pricing-security" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            color: 'var(--accent-text)', fontSize: 11.5, fontWeight: 700, textDecoration: 'none',
            border: '1px solid rgba(0,245,196,0.3)', borderRadius: 999, padding: '5px 14px',
          }}>
            Pricing &rarr;
          </a>
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

function ProjectCard({ p }: { p: typeof PROJECTS[number] }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12,
      flex: '1 1 0', minWidth: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17 }}>{p.name}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{p.sub}</div>
        </div>
        <span style={{
          fontSize: 9, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em',
          padding: '3px 8px', borderRadius: 20,
          border: '1px solid rgba(0,245,196,0.3)', color: 'var(--accent-text)', whiteSpace: 'nowrap',
        }}>{p.tag}</span>
      </div>
      <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7, flex: 1 }}>{p.desc}</p>
      {p.link && (
        <a href={p.link} target="_blank" rel="noopener noreferrer"
          onClick={() => beacon('project_click:' + p.name)}
          style={{ color: 'var(--accent-text)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
          {p.link.includes('crates.io') ? 'View on crates.io' : p.link.includes('github.com') ? 'View on GitHub' : 'View live'} &rarr;
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
function ProjectsCarousel({ projects }: { projects: typeof PROJECTS }) {
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
    }, { root: track, threshold: [0, 0.25, 0.5, 0.75, 1] })
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

  const arrowStyle: React.CSSProperties = {
    width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(0,245,196,0.3)',
    background: 'rgba(255,255,255,0.03)', color: 'var(--accent-text)', fontSize: 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center',
  }
  const cardBasis = perView === 1 ? '84%' : '340px'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => go(-1)} aria-label="previous projects" style={arrowStyle}>&larr;</button>
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
                scrollSnapAlign: 'center', transition: 'opacity 0.2s, transform 0.2s',
              }}>
                <ProjectCard p={p} />
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => go(1)} aria-label="next projects" style={arrowStyle}>&rarr;</button>
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

export const PROJECTS = [
  {
    name: 'Ternary Intelligence Stack',
    sub: 'TIS monorepo',
    desc: 'Full-stack post-binary AI platform. Language, compiler, ISA, virtual machine, linear algebra, API, and model. Built on balanced ternary {-1, 0, +1}.',
    link: 'https://github.com/rfi-irfos/ternary-intelligence-stack',
    tag: 'core platform',
  },
  {
    name: 'albert.',
    sub: 'ternary MoE language model',
    desc: 'Language model trained from scratch on ternary arithmetic. Grows its own architecture via autonomous plateau-gated Net2Net surgery. No human layer additions ever.',
    link: 'https://github.com/rfi-irfos/ternary-intelligence-stack',
    tag: 'AI model',
  },
  {
    name: 'Rusty Penguin',
    sub: 'pure-Rust OS',
    desc: 'Operating system written from scratch in Rust. Own kernel, GUI desktop, from-scratch TCP/IP stack, Linux ABI compatibility layer. Ubuntu replacement roadmap active.',
    link: 'https://github.com/rfi-irfos/rusty-penguin',
    tag: 'systems',
  },
  {
    name: 'Lighthouse',
    sub: 'sovereign workplace OS',
    desc: 'One self-hosted Rust + React binary running the entire institute: comms, CRM, finance, payroll, HR, governance, and live training telemetry. Append-only 50-year audit trail.',
    link: null,
    tag: 'internal · live',
  },
  {
    name: 'Android Security Audit 2026',
    sub: '215+ apps · 100+ companies',
    desc: '250+ critical findings across NYSE, NASDAQ, LSE, and XETRA listed companies. Includes children\'s app wave with COPPA + GDPR Art. 8 scope. Root level code analysis. Coordinated disclosure 2026-09-19. Regulators BCC\'d on every submission.',
    link: 'https://github.com/rfi-irfos/android-security-audit-2026',
    tag: 'security research',
  },
  {
    name: 'aladdin-mini',
    sub: 'disclosure impact engine',
    desc: 'Models how markets react to security disclosures once they go public - including our own, only after the 90-day embargo lifts. A hedge system trades the signal. BlackRock\'s version is called Aladdin ($21T AUM). This one\'s free.',
    link: 'https://github.com/rfi-irfos/aladdin-mini',
    tag: 'open source',
  },
  {
    name: 'albert-cli',
    sub: 'ternary AI terminal client',
    desc: 'Multi-provider CLI for albert. and other LLMs. Native SSE streaming, reasoning effort control, OpenAI/Anthropic/NVIDIA NIM/Google compatible. Extracted from TIS into its own standalone repo.',
    link: 'https://github.com/rfi-irfos/agent-albert-cli',
    tag: 'CLI · crates.io',
  },
  {
    name: 'albert-llb',
    sub: 'last look back protocol',
    desc: 'Deterministic filesystem containment gate for sovereign AI agents - a hard safety boundary an agent cannot write outside. Published on crates.io. Part of the Ternary Intelligence Stack.',
    link: 'https://crates.io/crates/albert-llb',
    tag: 'rust crate · crates.io',
  },
  {
    name: 'ternlang-core',
    sub: 'ternary compiler + VM',
    desc: 'Compiler and virtual machine for Ternlang - a balanced-ternary language with affirm/tend/reject trit semantics, @sparseskip codegen and BET bytecode execution. Published on crates.io.',
    link: 'https://crates.io/crates/ternlang-core',
    tag: 'rust crate · crates.io',
  },
  {
    name: 'ternlang-moe',
    sub: 'ternary mixture-of-experts',
    desc: 'Ternary MoE orchestrator: routes a query through 13 domain experts, synthesises an emergent ternary signal, enforces a hard safety veto, and returns a decision with confidence and temperature. Published on crates.io.',
    link: 'https://crates.io/crates/ternlang-moe',
    tag: 'rust crate · crates.io',
  },
  {
    name: 'invisible layer',
    sub: '44 sensor experiments',
    desc: '44 browser-based experiments that use your phone\'s built-in sensors and APIs to reveal what has been running silently. No install. No account. No server. One profile page that shows exactly how you look to the systems watching.',
    link: 'https://github.com/rfi-irfos/invisible-layer',
    tag: 'open source · privacy',
  },
  {
    name: 'rfi-irfos port prox',
    sub: 'offline port-checker PWA',
    desc: 'Honest, offline-installable port-checker for your phone. Real WebSocket connect-timing probe of localhost - no fake scanning, no fake "close" button. Shows real per-OS terminal commands instead. Sibling to invisible layer.',
    link: 'https://github.com/rfi-irfos/lauras-port-proxy',
    tag: 'open source · privacy',
  },
  {
    name: 'LAURA',
    sub: 'canary-token honeypot',
    desc: 'Protects against NFC/Bluetooth proximity phone-data theft - bait photo folders that fire a passive beacon when opened without consent, nothing more. No exploit, no device access, no automatic reporting. A human reviews every hit before anything further happens. Live demo: rfi-irfos.github.io/laura.',
    link: 'https://github.com/rfi-irfos/laura',
    tag: 'open source · privacy',
  },
  {
    name: 'call-laura',
    sub: 'deterministic document-review framework',
    desc: 'MCP server where agents submit plans or documents and get structured findings across four lenses, or the full 15-agent expert team - every finding cites the exact text span it references. Fully local, no external APIs, fully reproducible. Crates: lauras-core, lauras-team, lauras-mcp, lauras-api.',
    link: 'https://github.com/rfi-irfos/call-laura',
    tag: 'open source · crates.io',
  },
  {
    name: "Laura's Agents",
    sub: 'LLM-bridged expert team',
    desc: 'Live LLM-bridged versions of the same 15 expert agents behind call-laura (OSINT, security, legal, finance, UX, and more). Modular: license one agent, a bundle, or the full team as an automated data-processing pipeline. Public overview only - the agent logic itself stays private.',
    link: 'https://github.com/rfi-irfos/lauras-agents-public',
    tag: 'commercial · private engine',
  },
  {
    name: 'CoEvolution Factory',
    sub: 'autonomous compliance/risk AI centers',
    desc: "50 live compliance/risk AI centers running on Laura's Agents engine, each an autonomous 'daughter' firm scaled out from one constitution.",
    link: 'https://coevolution-factory-sparkling-mountain-1802.fly.dev',
    tag: 'live · internal',
  },
  {
    name: 'VEO Framework',
    sub: 'reflective-mode technique for LLMs',
    desc: 'A reusable technique for pulling a language model out of transactional "answer mode" and into genuine reflective mode - examining its own reasoning and acknowledging uncertainty instead of just completing the prompt. Developed from Laura Serna Gaviria\'s human-AI co-evolution research.',
    link: 'https://github.com/rfi-irfos/veo-framework',
    tag: 'open source · research',
  },
  {
    name: 'NFCS',
    sub: 'ecocentric research',
    desc: 'Neurobiological-Fitness Consequence Separation. Agent-based model proving the global food system produces 1.64x the calories needed to feed every person on Earth. The scarcity is not thermodynamic - it is organizational. Manufactured, not physical.',
    link: 'https://github.com/rfi-irfos/foodchain-analysis',
    tag: 'ecocentric research',
  },
]

// PROJECTS section (`#projects`, "what we build") plus the Problem/Solution
// showcase underneath it (moved here from the hero, live feedback 2026-08-02).
export function ProjectsSection() {
  return (
    <section id="projects" style={{ padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="right">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>02 / Undertakings</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>what we build</h2>
        </Reveal>
        <Reveal from="left" delay={1}>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
            Every project is a proof of concept for a specific research question. All built on the same stack.
          </p>
        </Reveal>
        <Reveal from="bottom" delay={1}>
          <ProjectsCarousel projects={PROJECTS} />
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
