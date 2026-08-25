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
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '32px 32px', maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative',
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
            color: '#e8e8f0', fontSize: 14, fontWeight: 700, lineHeight: 1.5,
            margin: 0, marginBottom: 16, paddingLeft: 14, borderLeft: '2px solid #00f5c4',
          }}>{area.plain}</p>
        )}
        {/* Body paragraphs bumped from a dimmer grey (#c8c8d8) to near-white
            (#e8e8f0, matching the title/anchor line) - live feedback 2026-08-25:
            "sollte doch in weiss stehen ... nicht in grau". Font-size/line-height/
            margin tightened at the same time (15->14, 1.85->1.7, 16->12) since the
            same feedback pass also asked for less scrolling after the keyword-
            density pass made every area's desc noticeably longer. */}
        {area.desc.split('\n\n').map((p, i) => (
          <p key={i} style={{ color: '#e8e8f0', fontSize: 14, lineHeight: 1.7, margin: 0, marginBottom: 12 }}>{p}</p>
        ))}
        {/* Deliberately unshowy (live feedback: "nicht so grell") - a low-fill teal
            pill, not a loud CTA button, so it reads as "there's more to explore"
            rather than competing with the actual close/primary actions elsewhere
            on the page. Centered with an explicit "Up next" eyebrow above it
            (live feedback 2026-08-25: the pill's teaser copy alone read as a
            cryptic slogan, not obviously a "go to the next area" link) and no
            fontFamily override, so it inherits the same body font as the rest
            of the card instead of the monospace fallback reading as "Roboto". */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: '#6a6a80', textTransform: 'uppercase', letterSpacing: '0.14em', margin: 0, marginBottom: 8 }}>{t.research.upNext}</p>
          <button onClick={() => onNavigate(nextIndex)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,245,196,0.07)', border: '1px solid rgba(0,245,196,0.22)',
            color: '#8fe8d0', fontSize: 12,
            letterSpacing: '0.01em', padding: '9px 16px', borderRadius: 999, cursor: 'pointer',
          }}>
            {t.research.areas[nextIndex].nextLabel} &rarr;
          </button>
        </div>
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
            freaking umbrella"). Flat hem, two panel seams, crook handle.
            Redrawn again 2026-08-24 (live feedback: "ein Regenschirm mit drei
            Dividern das war die Idee... das muss ja durchgehen bis rauf") -
            three dividers converging at the apex (16,5): the two curved rib
            seams already reached the apex, but the centre divider used to stop
            partway down inside the canopy instead of continuing all the way up
            to meet them. Now one continuous line from the apex to the handle,
            merging what used to be two separate short segments (a ferrule stub
            above the canopy and a shaft below it) into a single spine. */}
        <path d="M16 5a12 12 0 0 0-12 11h24A12 12 0 0 0 16 5z"/>
        <path d="M10 16q0-8 6-11M22 16q0-8-6-11"/>
        <line x1="16" y1="2.5" x2="16" y2="24" strokeWidth="2.1"/>
        <path d="M16 24a3.3 3.3 0 0 1-6.6 0"/>
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
            "ternary" rather than just decorating the shape.
            Swapped from minus/dot/plus GLYPHS drawn as raw line segments to
            actual "-1"/"0"/"+1" text 2026-08-24 (live feedback: "hier wollten
            wir -1 0 +1 reinschreiben und das ternary computing besser
            anzeigen") - the old plus/minus strokes read as generic math
            symbols at tile scale, not specifically as the trit values this
            icon exists to represent. Leaf circles bumped 3 -> 3.3 to give the
            two-character "-1"/"+1" labels a little breathing room. */}
        <circle cx="16" cy="5" r="2.5"/>
        <line x1="16" y1="7.5" x2="7" y2="22.5"/><line x1="16" y1="7.5" x2="16" y2="22.5"/><line x1="16" y1="7.5" x2="25" y2="22.5"/>
        <circle cx="7" cy="25" r="3.8"/><circle cx="16" cy="25" r="3.8"/><circle cx="25" cy="25" r="3.8"/>
        <text x="7" y="26.7" textAnchor="middle" fontSize="4.1" fontWeight="700" fontFamily="monospace" fill="currentColor" stroke="none">-1</text>
        <text x="16" y="26.7" textAnchor="middle" fontSize="4.6" fontWeight="700" fontFamily="monospace" fill="currentColor" stroke="none">0</text>
        <text x="25" y="26.7" textAnchor="middle" fontSize="4.1" fontWeight="700" fontFamily="monospace" fill="currentColor" stroke="none">+1</text>
      </_I>
    ),
    title: 'Ternary AI & Smart Computing',
    desc: 'Post-binary arithmetic as the foundation for language models, compilers, and operating systems. Patent pending A50296/2026.',
  },
  {
    icon: (
      <_I>
        {/* world model - redrawn 2026-08-24 as an actual GLOBE with domains
            connected across its surface (live feedback: "cross domain ok aber
            man sieht das world model nich, wär doch besser eine globus mit
            domains conected drauf?"). Previous version was a pure abstract
            graph (dashed boundary + satellite nodes) - correct in spirit but
            didn't read as "world" to a first glance. Sphere outline plus a
            flattened equator ellipse and a flattened meridian ellipse give the
            3D-globe read, four small domain nodes and their connections sit on
            top of it so the "relationships between things" idea from the old
            design survives inside the new shape instead of being replaced by it. */}
        <circle cx="16" cy="16" r="12"/>
        <ellipse cx="16" cy="16" rx="12" ry="4.5" opacity="0.6"/>
        <ellipse cx="16" cy="16" rx="4.5" ry="12" opacity="0.6"/>
        <line x1="9" y1="10" x2="22" y2="9" strokeWidth="2"/>
        <line x1="9" y1="10" x2="10" y2="22" strokeWidth="2"/>
        <line x1="22" y1="9" x2="23" y2="21" strokeWidth="2"/>
        <line x1="10" y1="22" x2="23" y2="21" strokeWidth="2"/>
        <line x1="9" y1="10" x2="23" y2="21" strokeWidth="2" opacity="0.6"/>
        <circle cx="9" cy="10" r="2" fill="currentColor" stroke="none"/>
        <circle cx="22" cy="9" r="2" fill="currentColor" stroke="none"/>
        <circle cx="10" cy="22" r="2" fill="currentColor" stroke="none"/>
        <circle cx="23" cy="21" r="2" fill="currentColor" stroke="none"/>
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
        {/* Swapped the smile-shaped check-arrow for a crosshair 2026-08-24 (live
            feedback: "the arrow does look cheap like amazon, so idk lets leave
            the chain, and put a crosshair there somehow of some sort") - the
            triad "chain" above is unchanged, only the downstream marker below
            it changed, from an arrow reading as a logo wink to a reticle
            reading as "this is the node the system is tracking." */}
        <path d="M22 15.5c1.6 2.2 3 3.4 4.3 4" opacity="0.6"/>
        <circle cx="26" cy="21" r="4" strokeDasharray="1.6 1.9" opacity="0.7"/>
        <line x1="26" y1="15.3" x2="26" y2="17.6"/>
        <line x1="26" y1="24.4" x2="26" y2="26.7"/>
        <line x1="20.3" y1="21" x2="22.6" y2="21"/>
        <line x1="29.4" y1="21" x2="31.7" y2="21"/>
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
        {/* filled sweep wedge added 2026-08-24 (live feedback: "can be more of
            a radar shape") - the sweep used to be a bare line plus a faint
            outline arc for the forecast cone, which read as a compass bearing
            more than a radar display. A translucent filled sector between the
            same two directions reads as an actual sweeping beam. */}
        <path d="M16 16 24.8 8.2A11 11 0 0 0 22.2 6.1Z" fill="currentColor" stroke="none" opacity="0.28"/>
        <path d="M16 16 24.8 8.2"/>
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
            only shows two isolated verdicts. The replacement keeps the evidence
            document itself and makes close review explicit with a detailed lens. */}
        <path d="M5.5 3.5h12l5 5v19.5h-17z"/><path d="M17.5 3.5v5h5"/>
        <line x1="9" y1="11" x2="16" y2="11"/>
        <line x1="9" y1="14.5" x2="14" y2="14.5"/>
        <line x1="9" y1="24.5" x2="13" y2="24.5"/>
        <circle cx="18" cy="18" r="7.2"/>
        <circle cx="18" cy="18" r="5.7" opacity="0.42"/>
        {/* small hook arc swapped for a ">" chevron 2026-08-24 (live feedback:
            "und da in die lupe rein ein '>' noch maginifiziert mit rein?") -
            reads as "go deeper / expand" magnified inside the lens, rather
            than an ambiguous partial curve. */}
        <path d="M15.7 14 19.4 18 15.7 22" strokeWidth="1.8"/>
        <line x1="23.1" y1="23.1" x2="28.5" y2="28.5"/>
        <line x1="24.3" y1="21.9" x2="25.6" y2="23.2"/>
      </_I>
    ),
    title: 'Evidence Security & Contradiction Reviews',
    desc: 'Supporting and conflicting evidence, provenance, confidence, and unresolved questions kept together.',
  },
  {
    icon: (
      <_I>
        {/* Model welfare + prompt injection, redrawn from the approved visual:
            a broad protective heart, a keyhole-shaped injection point and a
            precise syringe crossing the upper-right edge. The tile supplies the
            rounded outer frame, avoiding a redundant frame-within-a-frame. */}
        <path d="M15.5 27 8.3 20.5C3.1 15.8 4.5 9 9.5 7.7c2.5-.6 4.7.5 6 2.5 1.4-2 3.4-3 5.7-2.6"/>
        <path d="M24.6 12c1.1 3 .3 6.2-2.4 8.7L15.5 27"/>

        {/* The needle terminates at, rather than piercing through, the keyhole.
            Barrel redrawn 2026-08-24 (live feedback: "die spritze muss dünner
            sein das sieht man nich richtig das isch nich sauber gezeichnet") -
            the old barrel was a closed zigzag path that read as a lightning
            bolt rather than a syringe. Replaced with one thin diagonal line for
            the barrel, three short perpendicular dose-mark hatches along it,
            and a single perpendicular tick for the plunger cap at the top end -
            the same visual grammar a real syringe icon uses, just thinner and
            with no filled shapes to read as clutter at tile scale. */}
        <path d="M13.9 22.2h3.6l-.6-3.2a2.4 2.4 0 1 0-2.3 0z"/>
        <line x1="16.3" y1="16.9" x2="18.4" y2="14.8"/>
        <line x1="18.4" y1="14.8" x2="26.2" y2="7"/>
        <line x1="19.8" y1="13.4" x2="21.1" y2="12.1"/>
        <line x1="22.3" y1="10.9" x2="23.6" y2="9.6"/>
        <line x1="24.8" y1="8.4" x2="26.1" y2="7.1"/>
        <line x1="24.9" y1="5.7" x2="27.5" y2="8.3"/>
      </_I>
    ),
    title: 'Model Welfare & Injection Robustness',
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
