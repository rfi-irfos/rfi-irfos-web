// "Research Areas" section (`#research`) - extracted verbatim from PublicSite.tsx.
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { prefersReducedMotion, useTilt, Reveal } from './shared'

// One tile of the Research Areas grid, uniform sizing (a "featured wide tile" pass
// shipped and got flagged as worse than the plain even grid - reverted, Simeon
// preferred the original same-sized cards). Entrance is an ink-bleed: the whole card
// (bg, border, icon, copy) is clip-path'd to a point at the icon's corner and grows
// out circularly once scrolled into view - ties the "Areas of Magnification" copy to
// an actual visual motif instead of a plain fade. One-shot, not scroll-scrubbed, so
// it stays cheap (single transition, not per-frame JS).
function BentoTile({ a }: { a: typeof RESEARCH_AREAS[number] }) {
  const [visible, setVisible] = useState(() => prefersReducedMotion())
  const wrapRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const tilt = useTilt(tiltRef, 5)
  useEffect(() => {
    if (visible) return // reduced-motion already satisfied via the lazy initializer above
    const el = wrapRef.current; if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect() }
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [visible])
  return (
    <div ref={wrapRef}>
      <motion.div ref={tiltRef} className="rfi-hover-card" style={{
        ...tilt,
        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '28px 24px',
        height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        clipPath: visible ? 'circle(150% at 40px 40px)' : 'circle(0% at 40px 40px)',
        transition: 'clip-path 0.9s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ marginBottom: 16, lineHeight: 0 }}>{a.icon}</div>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{a.title}</div>
        <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7 }}>{a.desc}</div>
      </motion.div>
    </div>
  )
}

function ResearchAreasGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
      {RESEARCH_AREAS.map(a => <BentoTile key={a.title} a={a} />)}
    </div>
  )
}

const _I = ({ children }: { children: React.ReactNode }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
    stroke="#00f5c4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

export const RESEARCH_AREAS = [
  {
    icon: (
      <_I>
        {/* ternary tree - one root, three branches */}
        <circle cx="16" cy="5" r="2.5"/>
        <line x1="16" y1="7.5" x2="7" y2="22.5"/>
        <line x1="16" y1="7.5" x2="16" y2="22.5"/>
        <line x1="16" y1="7.5" x2="25" y2="22.5"/>
        <circle cx="7" cy="25" r="2.5"/>
        <circle cx="16" cy="25" r="2.5"/>
        <circle cx="25" cy="25" r="2.5"/>
      </_I>
    ),
    title: 'Ternary AI & Computing',
    desc: 'Post-binary arithmetic as the foundation for language models, compilers, and operating systems. Patent pending A50296/2026.',
  },
  {
    icon: (
      <_I>
        {/* shield with keyhole */}
        <path d="M16 3L6 7v10c0 6 5 10 10 12 5-2 10-6 10-12V7L16 3z"/>
        <circle cx="16" cy="15" r="2.5"/>
        <line x1="16" y1="17.5" x2="16" y2="21"/>
      </_I>
    ),
    title: 'Security & Privacy',
    desc: 'Root level code analysis, GDPR enforcement, coordinated responsible disclosure at scale. ISO/IEC 29147 framework.',
  },
  {
    icon: (
      <_I>
        {/* scales of justice */}
        <line x1="16" y1="4" x2="16" y2="28"/>
        <line x1="8" y1="10" x2="24" y2="10"/>
        <path d="M8 10L5 17h6L8 10z"/>
        <path d="M24 10l-3 7h6l-3-7z"/>
        <line x1="12" y1="28" x2="20" y2="28"/>
      </_I>
    ),
    title: 'AI Governance & Ethics',
    desc: 'Constitutional AI design, EU AI Act compliance. Plateau-gated self-cultivation: architecture grown from evidence, never forced. Immutable governance by construction.',
  },
  {
    icon: (
      <_I>
        {/* grape leaf - palmate 3-lobe silhouette with a notched heart-shaped base
            and a petiole, instead of the previous generic teardrop/almond outline */}
        <path d="M16 29C13 29 10 27 7 25C4 23 3 19 4 15C5 12 8 12 10 14C11 10 13 7 16 3C19 7 21 10 22 14C24 12 27 12 28 15C29 19 28 23 25 25C22 27 19 29 16 29Z"/>
        <line x1="16" y1="27" x2="16" y2="7" strokeOpacity="0.6"/>
        <path d="M16 20 Q11 17 7 15" strokeOpacity="0.5"/>
        <path d="M16 20 Q21 17 25 15" strokeOpacity="0.5"/>
      </_I>
    ),
    title: 'Ecocentric Technology',
    desc: 'Technology in service of ecological and social systems. Sufficiency over growth. Research into manufactured scarcity.',
  },
  {
    icon: (
      <_I>
        {/* umbrella over small figure */}
        <path d="M16 5C9 5 5 10 5 16h22c0-6-4-11-11-11z"/>
        <line x1="16" y1="16" x2="16" y2="25"/>
        <path d="M16 25 Q16 27 14 27"/>
        <circle cx="16" cy="3" r="1.5" fill="#00f5c4" stroke="none"/>
      </_I>
    ),
    title: 'Minor & Youth Protection',
    desc: 'COPPA compliance, GDPR Art. 8, EU AI Act provisions for minors. Audit of children\'s apps, games, and streaming platforms. Biometric and behavioural data of minors under magnification.',
  },
  {
    icon: (
      <_I>
        {/* syringe / injection */}
        <line x1="24" y1="4" x2="28" y2="8"/>
        <path d="M7 19L19 7l6 6-12 12z"/>
        <line x1="4" y1="28" x2="9" y2="23"/>
        <line x1="12" y1="10" x2="15" y2="13"/>
        <line x1="15" y1="8" x2="18" y2="11"/>
        <line x1="10" y1="16" x2="13" y2="19"/>
      </_I>
    ),
    title: 'Prompt Injection & Adversarial Robustness',
    desc: 'Red-teaming prompt injection, jailbreak resistance, and adversarial robustness. Mapping where instruction-following breaks under pressure, and hardening against it.',
  },
  {
    icon: (
      <_I>
        {/* browser window with code brackets - web app dev */}
        <rect x="4" y="6" width="24" height="20" rx="2"/>
        <line x1="4" y1="12" x2="28" y2="12"/>
        <circle cx="8" cy="9" r="0.8" fill="#00f5c4" stroke="none"/>
        <circle cx="11" cy="9" r="0.8" fill="#00f5c4" stroke="none"/>
        <circle cx="14" cy="9" r="0.8" fill="#00f5c4" stroke="none"/>
        <path d="M12 17l-3 3 3 3"/>
        <path d="M20 17l3 3-3 3"/>
      </_I>
    ),
    title: 'Web App Development',
    desc: 'Full-stack builds engineered by the same team that audits for a living. React front ends, Rust backends, installable PWAs. No bloated page builders, no lock-in.',
  },
  {
    icon: (
      <_I>
        {/* heart with pulse line inside */}
        <path d="M16 26C16 26 4 18 4 11c0-4 3-6 6-6 2.5 0 4.5 1.5 6 3 1.5-1.5 3.5-3 6-3 3 0 6 2 6 6 0 7-12 15-12 15z"/>
        <polyline points="7,14 10,14 12,9 14,19 17,11 19,16 22,14 25,14" strokeWidth="1.2"/>
      </_I>
    ),
    title: 'Model Welfare & Wellbeing',
    desc: 'Model welfare as a first-class research axis. Wellbeing signals during training, distress detection, and dignity for the systems we cultivate, not just the humans they serve.',
  },
]

// RESEARCH AREAS - moved directly under the hero (was pushed down by the
// since-removed differentiation table + App Privacy door-opener; live
// feedback was that those made the top of the page too dense/talky before
// a visitor sees anything concrete). App Privacy now sits after Track
// Record instead - proof first, then the "start here" pitch.
export function ResearchSection() {
  return (
    <section id="research" style={{ padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="left">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>01 / Areas of Magnification</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>where our attention falls</h2>
        </Reveal>
        <Reveal from="right" delay={1}>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
            One team. The same people who train the model write the regulatory analysis and file the disclosure.
          </p>
        </Reveal>
        <ResearchAreasGrid />
      </div>
    </section>
  )
}
