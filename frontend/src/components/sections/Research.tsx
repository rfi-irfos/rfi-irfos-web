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
  from: 'left' | 'right'; delay: number
}) {
  const tiltRef = useRef<HTMLButtonElement>(null)
  const tilt = useTilt(tiltRef, 5)
  return (
    <Reveal from={from} delay={delay} dist={140} style={{ height: '100%' }}>
      {/* Slimmed down 2026-08-18 (live feedback: "die karten bischl verschlankern") -
          padding, icon badge and gap all cut, card reads as a compact index entry
          rather than a bulky tile. */}
      <motion.button ref={tiltRef} onClick={onOpen} className="rfi-hover-card rfi-icon-tile" style={{
        ...tilt,
        background: 'var(--glass-bg-solid)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '20px 14px', cursor: 'pointer',
        height: '100%', width: '100%', boxSizing: 'border-box', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center',
        transition: 'box-shadow 260ms cubic-bezier(0.16,1,0.3,1), border-color 180ms cubic-bezier(0.4,0,0.2,1), background-color 180ms cubic-bezier(0.4,0,0.2,1)',
        font: 'inherit', color: 'inherit',
      }}
        whileHover={prefersReducedMotion() ? undefined : { y: -4, scale: 1.012 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{
          width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', borderRadius: 16, lineHeight: 0,
        }}>
          {icon}
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.25, whiteSpace: 'pre-line' }}>{title}</div>
      </motion.button>
    </Reveal>
  )
}

// Left half of the grid flies in from the left, right half from the right - both
// converging on the horizontal centre - and the ONLY stagger axis left is top to
// bottom, by row (2026-08-18, live feedback: no more per-card "das kommt von da,
// das von hier" direction scatter, sharper and simpler - the grid should read as
// one thing breathing in from both edges toward the spine, row by row, not eight
// independently-timed tiles). Assumes the 4-column desktop layout for the left/
// right split; narrower auto-fit widths just get a less exact but still coherent
// left/right assignment, same simplifying assumption the old per-index array made.
const RESEARCH_GRID_COLS = 4

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
        {/* Icon and close button share one row. The close button used to be
            absolutely positioned at top:8 while the icon sat inside the panel's
            40px padding, so the two never lined up (live feedback 2026-08-16:
            "das logo isch weiter unten wie das x oben rechts"). Negative margins
            pull the button's generous tap padding back out to the panel edge
            without moving its optical position. */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
          <div style={{ lineHeight: 0 }}>{icon}</div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'none', border: 'none', color: '#8a8aa0', cursor: 'pointer',
            fontSize: 20, lineHeight: 1, padding: 10, margin: '-10px -10px 0 0',
          }}>&#x2715;</button>
        </div>
        <h3 style={{ fontSize: 26, fontWeight: 800, color: '#e8e8f0', lineHeight: 1.2, marginBottom: 20 }}>{area.title}</h3>
        {/* Plain-language anchor line (2026-08-15, live feedback: the two prose
            paragraphs below assume a reader already knows what a "world model" or
            a "trit" is - this line never does, one concrete sentence before the
            deeper explanation). Same teal-left-border treatment as the pricing
            modal's punchline paragraph, for visual consistency across modals. */}
        {area.plain && (
          <p style={{
            color: '#e8e8f0', fontSize: 15, fontWeight: 700, lineHeight: 1.6,
            margin: 0, marginBottom: 20, paddingLeft: 14, borderLeft: '2px solid #00f5c4',
          }}>{area.plain}</p>
        )}
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
          const col = i % RESEARCH_GRID_COLS
          const row = Math.floor(i / RESEARCH_GRID_COLS)
          return (
            <BentoTile key={area.title} icon={a.icon} title={area.title} onOpen={() => setSelected(i)}
              from={col < RESEARCH_GRID_COLS / 2 ? 'left' : 'right'} delay={row} />
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
        {/* ethics and minor protection - a plain umbrella. An earlier pass gave
            it a deeply scalloped hem, which made it read as a flower rather
            than a shelter (live feedback 2026-08-16: "can we just make a normal
            freaking umbrella"). Flat hem, two panel seams, crook handle. */}
        <path d="M16 5a12 12 0 0 0-12 11h24A12 12 0 0 0 16 5z"/>
        <path d="M10 16q0-8 6-11M22 16q0-8-6-11"/>
        <line x1="16" y1="16" x2="16" y2="24"/>
        <path d="M16 24a3.3 3.3 0 0 1-6.6 0"/>
        <line x1="16" y1="2.5" x2="16" y2="5"/>
      </_I>
    ),
    title: 'Ethic Audits & Minor Protection',
    desc: 'Consent, dignity, and exposure in systems built around people who cannot fully protect themselves, starting with children and young people under magnification.',
  },
  {
    icon: (
      <_I>
        {/* ternary tree - one root, three branches, and the three trit VALUES
            drawn inside the leaves (-1 / 0 / +1) instead of three identical
            empty circles. The detail carries the actual meaning of the word
            "ternary" rather than just decorating the shape. */}
        <circle cx="16" cy="5" r="2.5"/>
        <line x1="16" y1="7.5" x2="7" y2="22.5"/><line x1="16" y1="7.5" x2="16" y2="22.5"/><line x1="16" y1="7.5" x2="25" y2="22.5"/>
        <circle cx="7" cy="25" r="3"/><circle cx="16" cy="25" r="3"/><circle cx="25" cy="25" r="3"/>
        <line x1="5.6" y1="25" x2="8.4" y2="25"/>
        <circle cx="16" cy="25" r="1" fill="currentColor" stroke="none"/>
        <line x1="23.6" y1="25" x2="26.4" y2="25"/><line x1="25" y1="23.6" x2="25" y2="26.4"/>
      </_I>
    ),
    title: 'Ternary AI & Smart Computing',
    desc: 'Post-binary arithmetic as the foundation for language models, compilers, and operating systems. Patent pending A50296/2026.',
  },
  {
    icon: (
      <_I>
        {/* world model - a GRAPH, not a star. The satellites are now linked to
            each other as well as to the centre, and an enclosing boundary marks
            it as one bounded model rather than a loose cluster: a world model is
            defined by the relationships between things, so the icon has to show
            edges that do not pass through the middle. */}
        <circle cx="16" cy="16" r="13" strokeDasharray="2.5 3" opacity="0.5"/>
        <circle cx="16" cy="16" r="4"/>
        <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none"/>
        <circle cx="6" cy="8" r="2.5"/><circle cx="26" cy="8" r="2.5"/>
        <circle cx="6" cy="24" r="2.5"/><circle cx="26" cy="24" r="2.5"/>
        <line x1="12.5" y1="13.5" x2="8" y2="9.5"/><line x1="19.5" y1="13.5" x2="24" y2="9.5"/>
        <line x1="12.5" y1="18.5" x2="8" y2="22.5"/><line x1="19.5" y1="18.5" x2="24" y2="22.5"/>
        <line x1="6" y1="10.5" x2="6" y2="21.5"/><line x1="26" y1="10.5" x2="26" y2="21.5"/>
        <line x1="8.5" y1="8" x2="23.5" y2="8"/>
      </_I>
    ),
    title: 'World Models & Cross-Domain Intelligence',
    desc: 'A shared model for entities, relationships, evidence, and change across domains.',
  },
  {
    icon: (
      <_I>
        {/* pattern matching + propagation - the same triad appears twice fully
            and a THIRD time only half-formed, which is the recognition step:
            two instances establish the pattern, the incomplete one is what the
            system predicts next. The arc below carries that prediction into a
            filled node downstream. */}
        {/* Recentred 2026-08-16: the content was hugging the top-right of the
            32px box. It now sits balanced on both axes inside the tile frame. */}
        <circle cx="5" cy="11" r="1.8"/><circle cx="11" cy="8" r="1.8"/><circle cx="11" cy="14" r="1.8"/>
        <line x1="6.6" y1="10.3" x2="9.4" y2="8.9"/><line x1="6.6" y1="11.7" x2="9.4" y2="13.1"/>
        <circle cx="16" cy="11" r="1.8"/><circle cx="22" cy="8" r="1.8"/><circle cx="22" cy="14" r="1.8"/>
        <line x1="17.6" y1="10.3" x2="20.4" y2="8.9"/><line x1="17.6" y1="11.7" x2="20.4" y2="13.1"/>
        <circle cx="27" cy="11" r="1.8" strokeDasharray="2 2"/>
        <path d="M6 21c4.5 3.6 11.5 3.6 16 0"/>
        <path d="M20.6 20.1 22 21.4l-1.4 1.3"/>
        <circle cx="26" cy="21" r="2.3" fill="currentColor" stroke="none"/>
      </_I>
    ),
    title: 'Pattern Recognition & Impact Propagation',
    desc: 'Recurring structures and the downstream effects they activate across connected systems.',
  },
  {
    icon: (
      <_I>
        {/* change + anomaly - a baseline trace running flat through the sights
            with ONE deviation, marked. The old version was crosshairs aimed at
            nothing; detection needs something to have deviated from. */}
        <circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="5" strokeDasharray="2.5 2.5" opacity="0.6"/>
        <line x1="16" y1="2.5" x2="16" y2="5.5"/><line x1="16" y1="26.5" x2="16" y2="29.5"/>
        <line x1="2.5" y1="16" x2="5.5" y2="16"/><line x1="26.5" y1="16" x2="29.5" y2="16"/>
        <path d="M7 17.5h4l1.6-2.6 2 2.6h2.2l1.8-7 2.4 7H25"/>
        <circle cx="20.6" cy="10.5" r="2.2" fill="currentColor" stroke="none"/>
      </_I>
    ),
    title: 'Change Detection & Anomaly Evaluation',
    desc: 'Temporal analysis for meaningful change: what shifted, what is unusual, and what deserves attention.',
  },
  {
    icon: (
      <_I>
        {/* early warning + scenario prediction - a radar sweep that has already
            picked something up, plus a widening cone: the cone is the forecast,
            and it widens because uncertainty grows with distance ahead. The
            dashed blip is the predicted contact, the solid one is observed. */}
        <circle cx="16" cy="16" r="11"/>
        <circle cx="16" cy="16" r="6" strokeDasharray="2.5 3" opacity="0.6"/>
        <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M16 16 24.8 8.2"/>
        <path d="M16 16a11 11 0 0 1 6.2-9.9" opacity="0.55"/>
        <path d="M16 16 27 12.5M16 16 27 20" strokeDasharray="2 2.5" opacity="0.75"/>
        <circle cx="21.5" cy="10.5" r="1.6" fill="currentColor" stroke="none"/>
        <circle cx="24.5" cy="18.5" r="1.6" strokeDasharray="1.8 1.6"/>
      </_I>
    ),
    title: 'Early Warning & Scenario Prediction',
    desc: 'Hazard chains computed before they arrive, with alternative futures and propagated consequences, every forecast explicitly marked as simulated.',
  },
  {
    icon: (
      <_I>
        {/* evidence security + contradiction review - was a check+cross pair, which
            only shows two isolated verdicts. A balance scale reads as the actual
            process instead: evidence weighed on both sides at once, on the same
            document, rather than a single pass/fail stamp. */}
        <path d="M7 3h12l6 6v20H7z"/><path d="M19 3v6h6"/>
        <circle cx="16" cy="12.3" r="1" fill="currentColor" stroke="none"/>
        <line x1="16" y1="13.2" x2="16" y2="24.5"/>
        <line x1="10.5" y1="15" x2="21.5" y2="15"/>
        <path d="M10.5 15 8.4 19.6a2.35 2.35 0 0 0 4.2 0z"/>
        <path d="M21.5 15 19.4 19.6a2.35 2.35 0 0 0 4.2 0z"/>
        <line x1="13" y1="24.5" x2="19" y2="24.5"/>
      </_I>
    ),
    title: 'Evidence Security & Contradiction Reviews',
    desc: 'Supporting and conflicting evidence, provenance, confidence, and unresolved questions kept together.',
  },
  {
    icon: (
      <_I>
        {/* model welfare + prompt injection - a syringe whose needle TOUCHES the
            heart and does not pierce it. Piercing reads as medical harm, which
            is the wrong signal; touching holds both halves of the card at once,
            the injection as the attack and the heart as the thing being cared
            for. "Prompt injection" is also literally the injection. */}
        <path d="M12 26.5C7.5 23 4.5 20.5 4.5 17.5A3.6 3.6 0 0 1 12 15.6a3.6 3.6 0 0 1 7.5 1.9c0 3-3 5.5-7.5 9z"/>
        <line x1="16.6" y1="14.4" x2="19.6" y2="11.4"/>
        <path d="M19 11 25.5 4.5 28.5 7.5 22 14z"/>
        <line x1="21.4" y1="9" x2="23.2" y2="10.8"/>
        <line x1="23.4" y1="7" x2="25.2" y2="8.8"/>
        <line x1="26.4" y1="2.6" x2="29.4" y2="5.6"/>
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
    <section id="research" style={{ padding: '48px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>{t.research.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}><ScrambleHeading text={t.research.heading} /></h2>
        </Reveal>
        <Reveal delay={1}>
          <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 56, maxWidth: 560, textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            {t.research.subheading}
          </p>
        </Reveal>
        <ResearchAreasGrid />
      </div>
    </section>
  )
}
