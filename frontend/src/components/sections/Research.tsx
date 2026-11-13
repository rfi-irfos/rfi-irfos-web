// "Research Areas" section (`#research`) - extracted verbatim from PublicSite.tsx.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { prefersReducedMotion, Reveal, useModalExit } from './shared'
import { useLocale } from '../../hooks/useLocale'

// Live feedback 2026-08-14: cards used to show the full two-paragraph
// description inline, which read as overwhelming across 8 tiles at once.
// Redesigned to icon + title only - a "table of contents" a visitor can
// scan in one pass - with the actual prose moved into a click-to-open
// modal. rfi-icon-tile (index.css) adds a barely-there background tint on
// hover, deliberately subtle - a nudge that the tile is clickable, not a
// competing animation on top of the existing tilt/lift.
// One soft colour per research area (tokens --ic-N, index.css) so each topic reads as its own
// thing instead of every icon being the same teal. Order is spread so neighbours differ.
const AREA_IC = [3, 1, 2, 8, 7, 5, 4, 6]

function BentoTile({ icon, ic, title, onOpen, delay, alt }: {
  icon: React.ReactNode; ic: number; title: string; onOpen: () => void
  delay: number; alt?: boolean
}) {
  // Tilt and hover scale removed (Simeon 01.11.): the 3D transform rasterised the glass tile and its text blurry.
  const tiltRef = useRef<HTMLButtonElement>(null)
  return (
    <Reveal delay={delay} style={{ height: '100%' }}>
      {/* Slimmed down 2026-08-18 (live feedback: "die karten bischl verschlankern") -
          padding, icon badge and gap all cut, card reads as a compact index entry
          rather than a bulky tile. */}
      <motion.button ref={tiltRef} onClick={onOpen} className={`rfi-hover-card rfi-icon-tile fx-tile${alt ? ' fx-tile--alt' : ''}`} style={{
        ['--tile-hue' as string]: `var(--ib-${ic})`,
        borderRadius: 18, padding: '22px 14px', cursor: 'pointer',
        height: '100%', width: '100%', boxSizing: 'border-box', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center',
        transition: 'box-shadow 260ms cubic-bezier(0.16,1,0.3,1), border-color 180ms cubic-bezier(0.4,0,0.2,1), background-color 180ms cubic-bezier(0.4,0,0.2,1)',
        font: 'inherit', color: 'inherit',
      }}
        whileHover={prefersReducedMotion() ? undefined : { y: -3 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glass box with the KPI glass values (Simeon 01.11., icon picker): the box and the icon
            take the colour on hover, eased in slowly, the card itself stays neutral. index.css .rfi-ri-box */}
        <div className="rfi-ri-box" style={{ width: 74, height: 74, ['--ib' as string]: `var(--ib-${ic})` }}>
          {icon}
        </div>
        <div style={{ fontWeight: 700, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-tight)', whiteSpace: 'pre-line' }}>{title}</div>
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
function ResearchAreaModal({ index, closing, onClose, onNavigate }: {
  index: number
  closing?: boolean
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
    <div className={`rfi-modal-backdrop${closing ? ' rfi-modal-backdrop-out' : ''}`} onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,4,7,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* key={index} forces a remount on every cross-link click, re-triggering the
          panel's CSS mount animation - a smooth swap between two areas' content
          instead of an abrupt content swap inside a static box. */}
      <div key={index} className={`rfi-modal-panel${closing ? ' rfi-modal-panel-out' : ''}`} onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(155deg, #17171d 0%, #0a0a0c 28%, #050506 52%, #131319 76%, #08080a 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
        backgroundBlendMode: 'overlay',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 50px rgba(0,0,0,0.55), 0 20px 60px rgba(0,0,0,0.65)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '44px 44px', maxWidth: 780, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative',
      }}>
        {/* Icon and close button share one row. The close button used to be
            absolutely positioned at top:8 while the icon sat inside the panel's
            40px padding, so the two never lined up (live feedback 2026-08-16:
            "das logo isch weiter unten wie das x oben rechts"). Negative margins
            pull the button's generous tap padding back out to the panel edge
            without moving its optical position. */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
          <div style={{ lineHeight: 'var(--lh-tight)', ['--tile-ic' as string]: `var(--ic-${AREA_IC[index]})` }}>{icon}</div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'none', border: 'none', color: '#8a8aa0', cursor: 'pointer',
            fontSize: 'var(--fs-h3)', lineHeight: 'var(--lh-tight)', padding: 10, margin: '-10px -10px 0 0',
          }}>&#x2715;</button>
        </div>
        <h3 style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, color: '#e8e8f0', lineHeight: 'var(--lh-tight)', marginBottom: 22 }}>{area.title}</h3>
        {/* Plain-language anchor line (2026-08-15, live feedback: the two prose
            paragraphs below assume a reader already knows what a "world model" or
            a "trit" is - this line never does, one concrete sentence before the
            deeper explanation). Same teal-left-border treatment as the pricing
            modal's punchline paragraph, for visual consistency across modals. */}
        {area.plain && (
          <p style={{
            color: '#e8e8f0', fontSize: 'var(--fs-body)', fontWeight: 700, lineHeight: 'var(--lh-body)',
            margin: 0, marginBottom: 18, paddingLeft: 16, borderLeft: '2px solid #00f5c4',
          }}>{area.plain}</p>
        )}
        {/* Body paragraphs bumped from a dimmer grey (#c8c8d8) to near-white
            (#e8e8f0, matching the title/anchor line) - live feedback 2026-08-25:
            "sollte doch in weiss stehen ... nicht in grau". Font-size/line-height/
            margin tightened at the same time (15->14, 1.85->1.7, 16->12) since the
            same feedback pass also asked for less scrolling after the keyword-
            density pass made every area's desc noticeably longer. */}
        {area.desc.split('\n\n').map((p, i) => (
          <p key={i} style={{ color: '#e8e8f0', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', margin: 0, marginBottom: 14 }}>{p}</p>
        ))}
        {/* Deliberately unshowy (live feedback: "nicht so grell") - a low-fill teal
            pill, not a loud CTA button, so it reads as "there's more to explore"
            rather than competing with the actual close/primary actions elsewhere
            on the page. Centered with an explicit "Up next" eyebrow above it
            (live feedback 2026-08-25: the pill's teaser copy alone read as a
            cryptic slogan, not obviously a "go to the next area" link) and no
            fontFamily override, so it inherits the same body font as the rest
            of the card instead of the monospace fallback reading as "Roboto". */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', margin: 0, marginBottom: 9 }}>{t.research.upNext}</p>
          <button onClick={() => onNavigate(nextIndex)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,245,196,0.07)', border: '1px solid rgba(0,245,196,0.22)',
            color: '#8fe8d0', fontSize: 'var(--fs-small)',
            letterSpacing: '0.01em', padding: '10px 18px', borderRadius: 999, cursor: 'pointer',
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
  const selectedExit = useModalExit(selected)
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16, maxWidth: 1060, margin: '0 auto' }}>
        {RESEARCH_AREAS.map((a, i) => {
          const area = t.research.areas[i]
          const row = Math.floor(i / RESEARCH_GRID_COLS)
          return (
            <BentoTile key={area.title} icon={a.icon} ic={AREA_IC[i]} title={area.title} onOpen={() => setSelected(i)}
              delay={row} alt={(row + (i % RESEARCH_GRID_COLS)) % 2 === 1} />
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
      {selectedExit.rendered !== null && createPortal(
        <ResearchAreaModal index={selectedExit.rendered} closing={selectedExit.closing} onClose={() => setSelected(null)} onNavigate={setSelected} />,
        document.body
      )}
    </>
  )
}

const _I = ({ children, sw = '1.6' }: { children: React.ReactNode; sw?: string }) => (
  <svg width="56" height="56" viewBox="0 0 32 32" fill="none"
    stroke="currentColor" style={{ color: 'var(--tile-ic, var(--accent))' }} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

// Icons picked by Simeon and Sabi in the icon picker (01.11.): one 32-unit grid, round caps,
// main element in the area colour, secondary element (.k2) in a near-white tone so details stay readable.
export const RESEARCH_AREAS = [
  {
    icon: (
      // umbrella, the handle in the second tone
      <_I>
        <path d="M4 16C4 9.4 9.4 4.5 16 4.5S28 9.4 28 16q-2-2.4-4-2.4T20 16q-2-2.4-4-2.4T12 16q-2-2.4-4-2.4T4 16Z"/>
        <path d="M16 4.5C12.6 7 11.3 11 12 15.6M16 4.5c3.4 2.5 4.7 6.5 4 11.1" opacity=".8"/>
        <path d="M16 3.5v1"/>
        <g className="k2">
        <path d="M16 15.5v9a2.8 2.8 0 0 1-5.6 0"/>
        </g>
      </_I>
    ),
    title: 'Ethic Audits & Minor Protection',
    desc: 'Consent, dignity, and exposure in systems built around people who cannot fully protect themselves, starting with children and young people under magnification.',
  },
  {
    icon: (
      // page in the second tone, magnifier in the area colour
      <_I>
        <g className="k2">
        <path d="M13 27.5H7.5A1.5 1.5 0 0 1 6 26V5.5A1.5 1.5 0 0 1 7.5 4H16l5 5v4.5"/>
        <path d="M16 4v5h5"/>
        <path d="M10 11h4.5M10 15h3"/>
        </g>
        <circle cx="20" cy="20" r="5.5"/>
        <path d="M24 24l4 4"/>
      </_I>
    ),
    title: 'Evidence Security & Contradiction Reviews',
    desc: 'Supporting and conflicting evidence, provenance, confidence, and unresolved questions kept together.',
  },
  {
    icon: (
      // three nodes in a triangle, spokes and centre in the second tone
      <_I>
        <circle cx="16" cy="6.5" r="3"/>
        <circle cx="7" cy="24" r="3"/>
        <circle cx="25" cy="24" r="3"/>
        <path d="M14.6 9.2 8.4 21.3M17.4 9.2l6.2 12.1M10 24h12"/>
        <g className="k2">
        <path d="M16 9.5v6.8M14.4 19.2l-5 3.1M17.6 19.2l5 3.1" opacity=".8"/>
        <circle cx="16" cy="18" r="1.8" fill="currentColor" stroke="none"/>
        </g>
      </_I>
    ),
    title: 'Ternary AI & Smart Computing',
    desc: 'Post-binary arithmetic as the foundation for language models, compilers, and operating systems. Patent pending A50296/2026.',
  },
  {
    icon: (
      // globe with one tilted orbit and three points
      <_I sw="1.15">
        <g className="k2">
        <circle cx="16" cy="16" r="8.5"/>
        </g>
        <ellipse cx="16" cy="16" rx="3.57" ry="8.5" opacity=".45"/>
        <path d="M7.5 16h17" opacity=".45"/>
        <g strokeWidth="1.1">
        <mask id="ri-orbit">
        <rect width="32" height="32" fill="#fff"/>
        <circle cx="16" cy="16" r="9.8" fill="#000"/>
        </mask>
        <g mask="url(#ri-orbit)" opacity=".55">
        <path d="M1.4 16A14.6 4.6 0 0 1 30.6 16" transform="rotate(-20 16 16)"/>
        </g>
        <path d="M1.4 16A14.6 4.6 0 0 0 30.6 16" transform="rotate(-20 16 16)"/>
        </g>
        <g className="k3">
        <circle cx="3.1" cy="21.91" r="1.6" fill="currentColor" stroke="none"/>
        <circle cx="21.74" cy="18.57" r="1.6" fill="currentColor" stroke="none"/>
        <circle cx="27.74" cy="9.64" r="1.6" fill="currentColor" stroke="none"/>
        </g>
      </_I>
    ),
    title: 'World Models & Cross-Domain Intelligence',
    desc: 'A shared model for entities, relationships, evidence, and change across domains.',
  },
  {
    icon: (
      // node chain fanning out, links in the second tone
      <_I>
        <circle cx="6" cy="16" r="2.4"/>
        <circle cx="14" cy="16" r="2.4"/>
        <circle cx="22" cy="10" r="2.4"/>
        <circle cx="22" cy="22" r="2.4"/>
        <g className="k2">
        <path d="M8.4 16h3.2M16 14.5l3.9-3M16 17.5l3.9 3"/>
        <path d="M24.4 10h3.6M24.4 22h3.6" strokeDasharray="1.8 1.8"/>
        </g>
      </_I>
    ),
    title: 'Pattern Recognition & Impact Propagation',
    desc: 'Recurring structures and the downstream effects they activate across connected systems.',
  },
  {
    icon: (
      // trend line opening into a fan of possible paths, axes in the second tone
      <_I>
        <g className="k2">
        <path d="M5 5v22h22"/>
        </g>
        <path d="M18 17 27 8.5V21.5Z" fill="currentColor" stroke="none" opacity=".18"/>
        <path d="M8 21l3.5-2 3.5 1 3-3"/>
        <path d="M18 17l9-8.5M18 17h9M18 17l9 4.5" strokeDasharray="2 2.2"/>
        <circle cx="18" cy="17" r="1.6" fill="currentColor" stroke="none"/>
      </_I>
    ),
    title: 'Change Detection & Anomaly Evaluation',
    desc: 'Temporal analysis for meaningful change: what shifted, what is unusual, and what deserves attention.',
  },
  {
    icon: (
      // lighthouse, tower in the second tone
      <_I>
        <g className="k2">
        <path d="M13 27l1.5-13.5h3L19 27Z"/>
        <path d="M13 9.8 16 6.8l3 3"/>
        <path d="M9 27h14"/>
        </g>
        <path d="M13.6 13.5h4.8V9.8h-4.8Z" fill="currentColor" fillOpacity=".35"/>
        <path d="M20.8 10.6 28 7.8M20.8 12.6 28 15.4M11.2 10.6 4 7.8M11.2 12.6 4 15.4"/>
      </_I>
    ),
    title: 'Early Warning & Scenario Prediction',
    desc: 'Hazard chains computed before they arrive, with alternative futures and propagated consequences, every forecast explicitly marked as simulated.',
  },
  {
    icon: (
      // heart with a syringe set into its centre, syringe in the second tone
      <_I>
        <mask id="ri-heart-gap" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
        <rect width="32" height="32" fill="#fff"/>
        <path d="M9 9.6L5.6 6.2" stroke="#000" strokeWidth="4.6" strokeLinecap="round"/>
        </mask>
        <path d="M16 26.5C9.2 22.2 4.5 18 4.5 12.8a5.8 5.8 0 0 1 11.5-1.1 5.8 5.8 0 0 1 11.5 1.1C27.5 18 22.8 22.2 16 26.5Z" mask="url(#ri-heart-gap)" strokeWidth="1.25"/>
        <g className="k2">
        <g transform="translate(16 16.6) rotate(-135) scale(1.05)" strokeWidth="1.19">
        <path d="M0 0h6.5"/>
        <rect x="6.5" y="-2" width="8" height="4" rx="1.20"/>
        <path d="M9.0 -2v1.8M11.5 -2v1.8"/>
        <path d="M14.5 0h2.6"/>
        <path d="M17.1 -2.6v5.2"/>
        </g>
        </g>
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
export function ResearchSection({ page = false }: { page?: boolean } = {}) {
  const { t } = useLocale()
  const Heading = page ? 'h1' : 'h2'
  return (
    <section id="research" style={{ padding: '48px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <Heading className="rfi-section-h2" style={{ marginBottom: 12, textAlign: 'center' }}>{t.research.heading}</Heading>
        </Reveal>
        <Reveal delay={1}>
          <p style={{ color: 'var(--text)', fontSize: 'var(--fs-lead)', marginBottom: 56, maxWidth: 560, textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            {t.research.subheading}
          </p>
        </Reveal>
        <ResearchAreasGrid />
      </div>
    </section>
  )
}
