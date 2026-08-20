// "Causality Chains" section (`#causal-chains`) - placed directly above the
// Contact & Disclosures (Submit) section on Home. Mirrors the site's section
// vocabulary: Reveal, ScrambleHeading, JetBrains Mono eyebrow, glass cards.
//
// Interaction model (per spec 2026-08-20):
//  - Each chain shows an icon (inline SVG map, no external dep) + chain index
//    "01 / 20" so users see how many chains exist and where they are.
//  - ONE step shown at a time as a centered card; nav buttons show the stage;
//    the flat GRAPH visualizer sits UNDER the nav buttons at the very bottom.
//  - Two SCENARIO arrows flank the widget (outside it, vertically centered).
type Chain = {
  title: string
  nodes: string[]
  icon: keyof typeof ICONS
}

import { useState, useMemo, useRef } from 'react'
import { Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

// Inline SVG icon map (sleek, single-path-ish, currentColor) - no external lib.
const I = (d: string) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)
const ICONS = {
  seismic: I('M3 12h2l1.5-4 3 10 3-14 3 10 1.5-2H22'),
  rain: I('M7 18v2M12 18v2M17 18v2M5 14a4 4 0 0 1 1-7 5 5 0 0 1 9-1 3 3 0 0 1 4 3v2'),
  mountain: I('M3 20l6-11 4 7 3-5 5 9z'),
  snowflake: I('M12 2v20M4 7l16 10M20 7L4 17M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3'),
  shield: I('M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z'),
  sun: I('M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19'),
  water: I('M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z'),
  fire: I('M12 3c1 3-2 4-2 7a4 4 0 0 0 8 0c0-2-1-4-2-6-1 2-2 2-2 4 0-3 0-5-0-5z'),
  ship: I('M4 14l2 5M20 14l-2 5M3 14h18l-2-8H5zM12 3v3'),
  bolt: I('M13 2L4 13h7l-1 9 9-12h-7z'),
  virus: I('M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2'),
  thermometer: I('M14 14V5a2 2 0 0 0-4 0v9a4 4 0 1 0 4 0z'),
  power: I('M12 3v9M7 7a7 7 0 1 0 10 0'),
  box: I('M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8'),
  money: I('M12 3v18M8 7h6a2 2 0 0 1 0 4H8a2 2 0 0 0 0 4h8'),
  people: I('M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19a5 5 0 0 1 12 0M16 11a3 3 0 1 0 0-6M16 14a5 5 0 0 1 5 5'),
  wind: I('M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h9a3 3 0 1 0-3 3'),
  volcano: I('M3 20h18l-7-11a3 3 0 0 0-4 0zM9 9l1 4M15 9l-1 4M11 5l1 2M12 4v2'),
  drop: I('M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11zM9 14a3 3 0 0 0 3 3'),
  globe: I('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18'),
  coin: I('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v10M9 9h6M9 15h6'),
  train: I('M7 4h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM7 17l2 3M17 17l-2 3M8 11h8'),
} as const

const arrowStyle: React.CSSProperties = {
  width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(0,245,196,0.3)',
  background: 'var(--bg2)', color: 'var(--accent-text)', fontSize: 18, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center',
}

const stepArrowStyle: React.CSSProperties = {
  width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)',
  background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
}

function dotColor(i: number, n: number) {
  // light turquoise -> darker blue as you proceed through the chain
  const t = n > 1 ? i / (n - 1) : 0
  const from = [94, 234, 212]   // #5eead4 light turquoise
  const to = [37, 99, 235]      // #2563eb darker blue
  const c = from.map((f, k) => Math.round(f + (to[k] - f) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

function ChainGraph({ nodes, step, onStep }: { nodes: string[]; step: number; onStep: (i: number) => void }) {
  const W = 720
  const H = 88
  const pad = 30
  const usable = W - pad * 2
  const stepX = nodes.length > 1 ? usable / (nodes.length - 1) : 0
  const y = H / 2
  const pts = useMemo(
    () => nodes.map((_, i) => ({ x: pad + i * stepX, y })),
    [nodes.length, stepX]
  )

  return (
    <div style={{ width: '100%', maxWidth: 720, margin: '0 auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r={i === step ? 5.5 : 3}
            fill={i === step ? 'var(--accent-text)' : dotColor(i, nodes.length)}
            style={{ cursor: 'pointer', transition: 'r 200ms cubic-bezier(0.16,1,0.3,1), fill 200ms' }}
            onClick={() => onStep(i)}
          />
        ))}
        <line
          x1={pts[0]?.x ?? pad}
          y1={y}
          x2={pts[step]?.x ?? pad}
          y2={y}
          stroke="var(--accent-text)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.55}
        />
      </svg>
    </div>
  )
}

export function CausalChainsSection() {
  const { t } = useLocale()
  const chains = (t.causalChains.chains as Chain[]) ?? []
  const [scenario, setScenario] = useState(0)
  const [step, setStep] = useState(0)
  const [anim, setAnim] = useState<'left' | 'right' | null>(null)
  const [stepAnim, setStepAnim] = useState<'left' | 'right' | null>(null)
  const animTimer = useRef<number | null>(null)
  const stepAnimTimer = useRef<number | null>(null)

  const n = chains.length
  const safeScenario = n ? scenario % n : 0
  const current = chains[safeScenario]

  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const cycleScenario = (dir: number) => {
    if (!n) return
    setAnim(dir < 0 ? 'right' : 'left')
    if (animTimer.current) window.clearTimeout(animTimer.current)
    animTimer.current = window.setTimeout(() => setAnim(null), reduced ? 0 : 650)
    setScenario(s => (s + dir + n) % n)
    setStep(0)
  }
  const goStep = (i: number) => {
    if (!current) return
    const len = current.nodes.length
    const next = ((i % len) + len) % len
    const dir = next > step ? 'left' : 'right'
    setStepAnim(dir)
    if (stepAnimTimer.current) window.clearTimeout(stepAnimTimer.current)
    stepAnimTimer.current = window.setTimeout(() => setStepAnim(null), reduced ? 0 : 650)
    setStep(next)
  }

  return (
    <section id="causal-chains" style={{ padding: '12px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>
            {t.causalChains.eyebrow}
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}>
            <ScrambleHeading text={t.causalChains.heading} />
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 28, textAlign: 'center', maxWidth: 720, lineHeight: 1.7, marginLeft: 'auto', marginRight: 'auto' }}>
            {t.causalChains.subheading}
          </p>
        </Reveal>

        <Reveal from="bottom" delay={1}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => cycleScenario(-1)} aria-label="Previous scenario" style={arrowStyle}>&larr;</button>

            <div
              className="rfi-glass-flat rfi-glass-solid"
              style={{
                borderRadius: 16, padding: '22px 20px 14px', width: '100%', maxWidth: 560, flex: '0 1 auto',
                animation: anim ? `${anim === 'left' ? 'ccFlipLeft' : 'ccFlipRight'} 820ms cubic-bezier(0.16,1,0.3,1)` : undefined,
                display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: 17, color: 'var(--text)', fontWeight: 800, marginBottom: 18, textAlign: 'center', lineHeight: 1.35, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {current && ICONS[current.icon] && (
                  <span style={{ color: 'var(--accent-text)', display: 'inline-flex', flexShrink: 0 }}>{ICONS[current.icon]}</span>
                )}
                <span>{current?.title ?? ''}</span>
              </div>

              {/* chain index "01 / 20" - how many chains total + where you are */}
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text)', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 14 }}>
                {String(safeScenario + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} &middot; causality chains
              </div>

              {/* Big centered step card - takes most space, transparent glass */}
              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                  padding: '34px 22px', margin: '0 auto 22px', width: '100%', maxWidth: 480,
                  textAlign: 'center', backdropFilter: 'blur(2px)',
                  animation: stepAnim ? `${stepAnim === 'left' ? 'ccFlipLeft' : 'ccFlipRight'} 820ms cubic-bezier(0.16,1,0.3,1)` : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                  {current && ICONS[current.icon] && (
                    <span style={{ color: 'var(--accent-text)', display: 'inline-flex', flexShrink: 0 }}>{ICONS[current.icon]}</span>
                  )}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: 'var(--accent-text)', minWidth: 34 }}>
                    {current ? String(step + 1).padStart(2, '0') : '--'}
                  </span>
                  <span style={{ fontSize: 17, color: 'var(--text)', lineHeight: 1.5 }}>
                    {current ? current.nodes[step] : ''}
                  </span>
                </div>
              </div>

              {/* Nav buttons (stage) just above the graph */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8, marginBottom: 10 }}>
                <button onClick={() => goStep(step - 1)} aria-label="Previous step" style={stepArrowStyle}>&larr;</button>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text)', letterSpacing: '0.08em', minWidth: 70, textAlign: 'center' }}>
                  {current ? `${String(step + 1).padStart(2, '0')} / ${String(current.nodes.length).padStart(2, '0')}` : '-- / --'}
                </span>
                <button onClick={() => goStep(step + 1)} aria-label="Next step" style={stepArrowStyle}>&rarr;</button>
              </div>

              {/* Graph flush at very bottom */}
              {current && <ChainGraph nodes={current.nodes} step={step} onStep={goStep} />}
            </div>

            <button onClick={() => cycleScenario(1)} aria-label="Next scenario" style={arrowStyle}>&rarr;</button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
