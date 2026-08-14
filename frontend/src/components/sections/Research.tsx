// "Research Areas" section (`#research`) - extracted verbatim from PublicSite.tsx.
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { prefersReducedMotion, useTilt, Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

// One tile of the Research Areas grid. Was its own bespoke ink-bleed clip-path
// reveal (whole card clip-path'd to a point at the icon's corner, growing out
// circularly) - replaced 2026-08-06 with the shared `Reveal` so each of the 8
// tiles can fly in from its own distinct direction (Simeon/Zabih: the grid should
// visibly assemble from multiple directions at once, not one uniform effect).
// Tradeoff made explicitly: layering a directional translate ON TOP of the old
// clip-path would have been two competing entrance motions on one element, which
// reads as busy - the ink-bleed's distinct character is traded away here for the
// "genuinely mixed directions" requirement instead.
function BentoTile({ icon, title, desc, from, delay }: {
  icon: React.ReactNode; title: string; desc: string
  from: 'left' | 'right' | 'top' | 'bottom'; delay: number
}) {
  const tiltRef = useRef<HTMLDivElement>(null)
  const tilt = useTilt(tiltRef, 5)
  return (
    <Reveal from={from} delay={delay} style={{ height: '100%' }}>
      <motion.div ref={tiltRef} className="rfi-hover-card" style={{
        ...tilt,
        background: 'var(--glass-bg-solid)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '28px 24px',
        height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'box-shadow 260ms cubic-bezier(0.16,1,0.3,1), border-color 180ms cubic-bezier(0.4,0,0.2,1)',
      }}
        whileHover={prefersReducedMotion() ? undefined : { y: -4, scale: 1.012 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
          <div style={{ lineHeight: 0, flex: '0 0 auto' }}>{icon}</div>
          <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.25 }}>{title}</div>
        </div>
        <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7 }}>{desc}</div>
      </motion.div>
    </Reveal>
  )
}

// Genuinely mixed per-card directions (not a left-half/right-half mirror): each
// column's two rows get a different axis, e.g. column 0 is left-then-top, not
// left-then-left - see plan discussion for why a mirror doesn't satisfy the ask.
const RESEARCH_TILE_DIRECTIONS: Array<'left' | 'right' | 'top' | 'bottom'> =
  ['left', 'top', 'bottom', 'right', 'right', 'bottom', 'top', 'left']

// Icons are locale-independent (module-level RESEARCH_AREAS below), title/desc
// come from the current locale's content object, zipped together by index.
function ResearchAreasGrid() {
  const { t } = useLocale()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
      {RESEARCH_AREAS.map((a, i) => {
        const area = t.research.areas[i]
        return (
          <BentoTile key={area.title} icon={a.icon} title={area.title} desc={area.desc}
            from={RESEARCH_TILE_DIRECTIONS[i % RESEARCH_TILE_DIRECTIONS.length]} delay={i} />
        )
      })}
    </div>
  )
}

const _I = ({ children }: { children: React.ReactNode }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
    stroke="currentColor" style={{ color: 'var(--accent)' }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

export const RESEARCH_AREAS = [
  {
    icon: (
      <_I>
        {/* world model - connected entities */}
        <circle cx="16" cy="16" r="4"/>
        <circle cx="6" cy="8" r="2.5"/><circle cx="26" cy="8" r="2.5"/>
        <circle cx="6" cy="24" r="2.5"/><circle cx="26" cy="24" r="2.5"/>
        <line x1="12.5" y1="13.5" x2="8" y2="9.5"/><line x1="19.5" y1="13.5" x2="24" y2="9.5"/>
        <line x1="12.5" y1="18.5" x2="8" y2="22.5"/><line x1="19.5" y1="18.5" x2="24" y2="22.5"/>
      </_I>
    ),
    title: 'World Models & Cross-Domain Intelligence',
    desc: 'A shared model for entities, relationships, evidence, and change across domains.',
  },
  {
    icon: (
      <_I>
        {/* ethics and minor protection - shelter */}
        <path d="M5 15c0-6 5-10 11-10s11 4 11 10H5z"/>
        <line x1="16" y1="15" x2="16" y2="25"/><path d="M16 25q0 3-3 3"/>
        <circle cx="16" cy="3" r="1.5" fill="currentColor" stroke="none"/>
      </_I>
    ),
    title: 'Ethics & Minor Protection',
    desc: 'Consent, dignity, and exposure in systems built around people who cannot fully protect themselves — starting with children and young people under magnification.',
  },
  {
    icon: (
      <_I>
        {/* ternary tree - one root, three branches */}
        <circle cx="16" cy="5" r="2.5"/>
        <line x1="16" y1="7.5" x2="7" y2="22.5"/><line x1="16" y1="7.5" x2="16" y2="22.5"/><line x1="16" y1="7.5" x2="25" y2="22.5"/>
        <circle cx="7" cy="25" r="2.5"/><circle cx="16" cy="25" r="2.5"/><circle cx="25" cy="25" r="2.5"/>
      </_I>
    ),
    title: 'Ternary AI & Computing',
    desc: 'Post-binary arithmetic as the foundation for language models, compilers, and operating systems. Patent pending A50296/2026.',
  },
  {
    icon: (
      <_I>
        {/* pattern matching - repeated structure with one recognized mark */}
        <circle cx="6" cy="9" r="2"/><circle cx="13" cy="6" r="2"/><circle cx="13" cy="13" r="2"/>
        <line x1="7.8" y1="8.2" x2="11.2" y2="6.8"/><line x1="7.8" y1="9.8" x2="11.2" y2="12.2"/>
        <circle cx="18" cy="9" r="2"/><circle cx="25" cy="6" r="2"/><circle cx="25" cy="13" r="2"/>
        <line x1="19.8" y1="8.2" x2="23.2" y2="6.8"/><line x1="19.8" y1="9.8" x2="23.2" y2="12.2"/>
        <path d="M13 20c3-3 6-3 9 0"/><circle cx="25" cy="20" r="2.5" fill="currentColor" stroke="none"/>
      </_I>
    ),
    title: 'Pattern Recognition & Impact Propagation',
    desc: 'Recurring structures and the downstream effects they activate across connected systems.',
  },
  {
    icon: (
      <_I>
        {/* change + anomaly - target with signal */}
        <circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="5"/><circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="16" y1="26" x2="16" y2="30"/><line x1="2" y1="16" x2="6" y2="16"/><line x1="26" y1="16" x2="30" y2="16"/>
      </_I>
    ),
    title: 'Change & Anomaly Detection',
    desc: 'Temporal analysis for meaningful change: what shifted, what is unusual, and what deserves attention.',
  },
  {
    icon: (
      <_I>
        {/* scenario simulation - radar */}
        <circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="6"/><circle cx="16" cy="16" r="2"/>
        <path d="M16 16L24 9"/><path d="M24 9l-1 5M24 9l-5 1"/>
      </_I>
    ),
    title: 'Scenario Simulation & Counterfactuals',
    desc: 'Interventions, alternative futures, and propagated consequences — explicitly marked as simulated.',
  },
  {
    icon: (
      <_I>
        {/* evidence + contradiction - document with split marks */}
        <path d="M8 3h11l5 5v21H8z"/><path d="M19 3v6h5"/>
        <path d="M12 15l3 3 5-6"/><path d="M12 24h8"/>
      </_I>
    ),
    title: 'Evidence & Contradiction',
    desc: 'Supporting and conflicting evidence, provenance, confidence, and unresolved questions kept together.',
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
    title: 'Model Welfare & Prompt Injection',
    desc: 'The behaviour, boundaries, failure modes, and dignity of intelligent systems — from jailbreak pressure to signs of distress.',
  },
]

// RESEARCH AREAS - moved directly under the hero (was pushed down by the
// since-removed differentiation table + App Privacy door-opener; live
// feedback was that those made the top of the page too dense/talky before
// a visitor sees anything concrete). App Privacy now sits after Track
// Record instead - proof first, then the "start here" pitch.
export function ResearchSection() {
  const { t } = useLocale()
  return (
    <section id="research" style={{ padding: '48px 2rem 72px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="left">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{t.research.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}><ScrambleHeading text={t.research.heading} /></h2>
        </Reveal>
        <Reveal from="right" delay={1}>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
            {t.research.subheading}
          </p>
        </Reveal>
        <ResearchAreasGrid />
      </div>
    </section>
  )
}
