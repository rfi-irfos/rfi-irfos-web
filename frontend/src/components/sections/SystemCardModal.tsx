// System Card modal (2026-08-15) - the footer's repo/crate directory no longer
// links straight out to GitHub/crates.io. Clicking a system opens this instead:
// a standardized card (status, problem, why we built it, what's actually
// different, where it sits in the stack, proof, technical details) with the
// external links demoted to a "go deeper" row at the very bottom. "Connects to"
// pills are real, verified relationships (an actual HTTP call, a shared schema,
// a shared codebase - see content/systems.ts's own header comment), clicking one
// swaps the modal to that system - same portal/backdrop chrome and keyboard
// handling as ResearchAreaModal (Research.tsx), but keyed by system key instead
// of a sequential index, since navigation here follows the architecture graph,
// not a fixed order.
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocale } from '../../hooks/useLocale'
import { getSystem, ZONE_LABELS, ZONE_ORDER, type SystemStatus } from '../../content/systems'
import { getPreview } from '../../content/systemPreviews'
import { SystemDiagram } from './SystemDiagrams'

const STATUS_COLOR: Record<SystemStatus, string> = {
  OPERATIONAL: '#00f5c4',
  COMPOSABLE: '#facc15',
  EXPERIMENTAL: '#8a8aa0',
  // Forks/personal side-projects/tooling honestly aren't RFI-IRFOS-built -
  // a distinct blue rather than reusing grey (EXPERIMENTAL) so the two
  // meanings ("in progress" vs. "not ours") don't visually collide.
  EXTERNAL: '#5a9fff',
}

function StatusBadge({ status }: { status: SystemStatus }) {
  const c = STATUS_COLOR[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
      color: c, border: `1px solid ${c}55`, background: `${c}15`, borderRadius: 999, padding: '4px 10px',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
      {status}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6, marginTop: 18 }}>
      {children}
    </div>
  )
}

// Every modal's left-side preview box is the same fixed footprint whether it
// holds a real screenshot (object-fit: cover) or a generated SVG diagram
// (fills via width/height 100%) - the point (2026-08-15 feedback) is that
// switching between "real product" and "generated diagram" cards via the
// connects pills never produces a visible size jump.
function PreviewBox({ preview, accent }: { preview: ReturnType<typeof getPreview>; accent: string }) {
  return (
    <div style={{
      flex: '1 1 200px', maxWidth: 236, width: '100%', height: 236, borderRadius: 10, overflow: 'hidden',
      background: 'radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.05), transparent 60%), #0c0c11',
      border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {preview.type === 'image'
        ? <img src={preview.src} alt={preview.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '82%', height: '82%' }}><SystemDiagram archetype={preview.archetype} accent={accent} /></div>}
    </div>
  )
}

const LABELS = {
  de: {
    problem: 'Welches Problem löst es?', why: 'Warum haben wir es gebaut?', different: 'Was macht es anders?',
    fit: 'Wo sitzt es im Stack?', proof: 'Beleg', technical: 'Technisch', connects: 'Verbunden mit', deepen: 'Vertiefen',
  },
  en: {
    problem: 'What problem does it solve?', why: 'Why did we build it?', different: 'What does it do differently?',
    fit: 'Where does it fit?', proof: 'Proof', technical: 'Technical details', connects: 'Connects to', deepen: 'Go deeper',
  },
} as const

export function SystemCardModal({ systemKey, onClose, onNavigate }: {
  systemKey: string
  onClose: () => void
  onNavigate: (key: string) => void
}) {
  const { locale } = useLocale()
  const sys = getSystem(systemKey)
  const l = LABELS[locale]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [])

  if (!sys) return null
  const connected = sys.connects.map(k => getSystem(k)).filter((s): s is NonNullable<typeof s> => !!s)
  const preview = getPreview(sys)
  const accent = STATUS_COLOR[sys.status]

  return createPortal(
    <div className="rfi-modal-backdrop" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,4,7,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div key={systemKey} className="rfi-modal-panel" onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(155deg, #17171d 0%, #0a0a0c 28%, #050506 52%, #131319 76%, #08080a 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
        backgroundBlendMode: 'overlay',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 50px rgba(0,0,0,0.55), 0 20px 60px rgba(0,0,0,0.65)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '36px 32px', maxWidth: 820, width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative',
      }}>
        <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#8a8aa0', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4, zIndex: 1 }}>&#x2715;</button>

        {/* Zone breadcrumb - current zone highlighted, same architecture-position
            signal at the top of every card regardless of which system it is.
            Skipped entirely when zone is undefined (2026-08-15: forks/personal
            side-projects/tooling don't cleanly map onto one of the four zones -
            forcing a bad fit would be less honest than just not showing one). */}
        {sys.zone && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '0.04em', marginBottom: 16, paddingRight: 24 }}>
            {ZONE_ORDER.map((z, i) => (
              <span key={z} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: z === sys.zone ? '#00f5c4' : '#606080', fontWeight: z === sys.zone ? 800 : 500 }}>
                  {z === sys.zone ? `[${ZONE_LABELS[z][locale].toUpperCase()}]` : ZONE_LABELS[z][locale]}
                </span>
                {i < ZONE_ORDER.length - 1 && <span style={{ color: '#404058' }}>&rarr;</span>}
              </span>
            ))}
          </div>
        )}

        {/* Wide layout (2026-08-15 feedback): preview left, everything else
            right - wraps to stacked (preview on top) once the panel is
            narrower than both flex-basis widths combined, so this needs no
            separate mobile branch. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
          <PreviewBox preview={preview} accent={accent} />

          <div style={{ flex: '999 1 300px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4, marginTop: 0 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#e8e8f0', lineHeight: 1.2, margin: 0 }}>{sys.name}</h3>
              <StatusBadge status={sys.status} />
            </div>

            <SectionLabel>{l.problem}</SectionLabel>
            <p style={{ color: '#e8e8f0', fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>{sys.problem[locale]}</p>

            <SectionLabel>{l.why}</SectionLabel>
            <p style={{ color: '#c8c8d8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{sys.why[locale]}</p>

            <SectionLabel>{l.different}</SectionLabel>
            <p style={{ color: '#c8c8d8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{sys.different[locale]}</p>

            <SectionLabel>{l.fit}</SectionLabel>
            <p style={{ color: '#c8c8d8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{sys.fit[locale]}</p>

            <SectionLabel>{l.proof}</SectionLabel>
            <p style={{ color: '#a0a0b8', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{sys.proof[locale]}</p>

            <SectionLabel>{l.technical}</SectionLabel>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", color: '#a0a0b8', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{sys.technical[locale]}</p>

            {connected.length > 0 && (
              <>
                <SectionLabel>{l.connects}</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {connected.map(c => (
                    <button key={c.key} onClick={() => onNavigate(c.key)} style={{
                      fontSize: 12, fontWeight: 700, padding: '6px 13px', borderRadius: 999, cursor: 'pointer',
                      background: 'rgba(0,245,196,0.07)', border: '1px solid rgba(0,245,196,0.22)', color: '#8fe8d0',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{c.name}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {(sys.links.github || sys.links.crates || sys.links.live) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {sys.links.github && <a href={sys.links.github} target="_blank" rel="noopener noreferrer" style={{ color: '#8fe8d0', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>GitHub &rarr;</a>}
            {sys.links.crates && <a href={sys.links.crates} target="_blank" rel="noopener noreferrer" style={{ color: '#8fe8d0', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>crates.io &rarr;</a>}
            {sys.links.live && <a href={sys.links.live} target="_blank" rel="noopener noreferrer" style={{ color: '#8fe8d0', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>{locale === 'de' ? 'Live ansehen' : 'View live'} &rarr;</a>}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
