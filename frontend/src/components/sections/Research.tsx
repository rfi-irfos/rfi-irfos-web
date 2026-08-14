// "Research Areas" section (`#research`) - extracted verbatim from PublicSite.tsx.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { prefersReducedMotion, useTilt, Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

// Live feedback 2026-08-14: cards used to show the full two-paragraph
// description inline, which read as overwhelming across 8 tiles at once.
// Redesigned to icon + title only - a "table of contents" a visitor can
// scan in one pass - with the actual prose moved into a click-to-open
// modal. rfi-icon-tile (index.css) adds a barely-there background tint on
// hover, deliberately subtle - a nudge that the tile is clickable, not a
// competing animation on top of the existing tilt/lift.
function BentoTile({ icon, title, onOpen, from, delay }: {
  icon: React.ReactNode; title: string; onOpen: () => void
  from: 'left' | 'right' | 'top' | 'bottom'; delay: number
}) {
  const tiltRef = useRef<HTMLButtonElement>(null)
  const tilt = useTilt(tiltRef, 5)
  return (
    <Reveal from={from} delay={delay} style={{ height: '100%' }}>
      <motion.button ref={tiltRef} onClick={onOpen} className="rfi-hover-card rfi-icon-tile" style={{
        ...tilt,
        background: 'var(--glass-bg-solid)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '32px 20px', cursor: 'pointer',
        height: '100%', width: '100%', boxSizing: 'border-box', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center',
        transition: 'box-shadow 260ms cubic-bezier(0.16,1,0.3,1), border-color 180ms cubic-bezier(0.4,0,0.2,1), background-color 180ms cubic-bezier(0.4,0,0.2,1)',
        font: 'inherit', color: 'inherit',
      }}
        whileHover={prefersReducedMotion() ? undefined : { y: -4, scale: 1.012 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Live feedback 2026-08-14: icons bumped up (48->56) and given their own
            rounded-square frame ("noch extra mit so einem abgerundeten Viereck
            einrahmen, für bessere visibility") - a badge, not just a bare glyph
            floating on the card. */}
        <div style={{
          width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', borderRadius: 20, lineHeight: 0,
        }}>
          {icon}
        </div>
        <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.25 }}>{title}</div>
      </motion.button>
    </Reveal>
  )
}

// Genuinely mixed per-card directions (not a left-half/right-half mirror): each
// column's two rows get a different axis, e.g. column 0 is left-then-top, not
// left-then-left - see plan discussion for why a mirror doesn't satisfy the ask.
const RESEARCH_TILE_DIRECTIONS: Array<'left' | 'right' | 'top' | 'bottom'> =
  ['left', 'top', 'bottom', 'right', 'right', 'bottom', 'top', 'left']

// Detail modal for one research area. Reuses the checkout/proposal modal's exact
// carbon-gradient panel (same rfi-modal-backdrop/rfi-modal-panel classes - CSS-only
// spring-in animation, "supersmooth" per live feedback, no JS animation logic
// needed) so it reads as the same canonical modal template site-wide instead of a
// one-off. Always-dark chrome independent of the site theme toggle, same reasoning
// as the checkout modal: fixed light hex text colors, not var(--text*) tokens.
function ResearchAreaModal({ index, onClose, onNavigate }: {
  index: number
  onClose: () => void
  onNavigate: (i: number) => void
}) {
  const { t } = useLocale()
  const area = t.research.areas[index]
  const icon = RESEARCH_AREAS[index].icon
  const nextIndex = (index + 1) % RESEARCH_AREAS.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="rfi-modal-backdrop" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,4,7,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* key={index} forces a remount on every cross-link click, re-triggering the
          panel's CSS mount animation - a smooth swap between two areas' content
          instead of an abrupt content swap inside a static box. */}
      <div key={index} className="rfi-modal-panel" onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(155deg, #17171d 0%, #0a0a0c 28%, #050506 52%, #131319 76%, #08080a 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
        backgroundBlendMode: 'overlay',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 50px rgba(0,0,0,0.55), 0 20px 60px rgba(0,0,0,0.65)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '40px 36px', maxWidth: 640, width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative',
      }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#8a8aa0', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}>&#x2715;</button>
        <div style={{ lineHeight: 0, marginBottom: 18 }}>{icon}</div>
        <h3 style={{ fontSize: 26, fontWeight: 800, color: '#e8e8f0', lineHeight: 1.2, marginBottom: 20, paddingRight: 24 }}>{area.title}</h3>
        {area.desc.split('\n\n').map((p, i) => (
          <p key={i} style={{ color: '#c8c8d8', fontSize: 15, lineHeight: 1.85, margin: 0, marginBottom: 16 }}>{p}</p>
        ))}
        {/* Deliberately unshowy (live feedback: "nicht so grell") - a low-fill teal
            pill, not a loud CTA button, so it reads as "there's more to explore"
            rather than competing with the actual close/primary actions elsewhere
            on the page. */}
        <button onClick={() => onNavigate(nextIndex)} style={{
          marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,245,196,0.07)', border: '1px solid rgba(0,245,196,0.22)',
          color: '#8fe8d0', fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.04em', padding: '9px 16px', borderRadius: 999, cursor: 'pointer',
        }}>
          {t.research.areas[nextIndex].nextLabel} &rarr;
        </button>
      </div>
    </div>
  )
}

// Icons are locale-independent (module-level RESEARCH_AREAS below), title/desc
// come from the current locale's content object, zipped together by index.
function ResearchAreasGrid() {
  const { t } = useLocale()
  const [selected, setSelected] = useState<number | null>(null)
  // Scroll lock while open - the other 4 modals on the page (checkout, proposal,
  // report, intel) all get this from a shared effect in PublicSite.tsx keyed off
  // their own state; this modal's state lives locally here instead, so it needs
  // its own copy of the same lock. Without it the page behind the blur can keep
  // scrolling, which is likely what read as "rendert irgendwo im Nirgendwo."
  useEffect(() => {
    if (selected === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [selected])
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
        {RESEARCH_AREAS.map((a, i) => {
          const area = t.research.areas[i]
          return (
            <BentoTile key={area.title} icon={a.icon} title={area.title} onOpen={() => setSelected(i)}
              from={RESEARCH_TILE_DIRECTIONS[i % RESEARCH_TILE_DIRECTIONS.length]} delay={i} />
          )
        })}
      </div>
      {/* Portaled straight to document.body - this component sits deep inside
          <main className="rfi-view-stage"> (PublicSite.tsx), which carries a
          framer-motion identity transform (matrix(1,0,0,1,0,0) - a visual no-op,
          but "not none" is enough). Per spec, ANY non-none transform on an
          ancestor makes that ancestor the containing block for descendant
          position:fixed elements instead of the viewport - so the modal was
          centering itself against the full document height, not the visible
          viewport, and rendered far below whatever was actually on screen
          ("rendert irgendwo im Nirgendwo," live feedback 2026-08-14). The other
          four modals on this page (checkout/proposal/report/intel, all in
          PublicSite.tsx) happen to render as siblings of <main> rather than
          descendants, so they were never exposed to this. A portal sidesteps it
          outright regardless of where this component lives in the tree. */}
      {selected !== null && createPortal(
        <ResearchAreaModal index={selected} onClose={() => setSelected(null)} onNavigate={setSelected} />,
        document.body
      )}
    </>
  )
}

const _I = ({ children }: { children: React.ReactNode }) => (
  <svg width="56" height="56" viewBox="0 0 32 32" fill="none"
    stroke="currentColor" style={{ color: 'var(--accent)' }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

export const RESEARCH_AREAS = [
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
    desc: 'Consent, dignity, and exposure in systems built around people who cannot fully protect themselves, starting with children and young people under magnification.',
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
    desc: 'Interventions, alternative futures, and propagated consequences, explicitly marked as simulated.',
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
    desc: 'The behaviour, boundaries, failure modes, and dignity of intelligent systems, from jailbreak pressure to signs of distress.',
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
          <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 56, maxWidth: 560 }}>
            {t.research.subheading}
          </p>
        </Reveal>
        <ResearchAreasGrid />
      </div>
    </section>
  )
}
