// "Causality Chains" section (`#causal-chains`) - placed directly above the
// Contact & Disclosures (Submit) section on Home. Mirrors the site's section
// vocabulary: Reveal, ScrambleHeading, JetBrains Mono eyebrow, glass cards.
//
// Interaction model (per spec 2026-08-20):
//  - Section eyebrow: "Causality Chains" (left-aligned, matches page edge)
//  - Section title:    "A look into Dingir's Mind" / "Einblicke in Dingirs Denkweise"
//  - Section subheading stays (left-aligned).
//  - The WIDGET: chain title centered at top; ONE step shown at a time as a
//    centered card; nav buttons show the stage; the flat GRAPH visualizer sits
//    UNDER the nav buttons at the very bottom of the widget.
//  - Two SCENARIO arrows flank the widget (outside it, vertically centered),
//    reuse the exact Systems-tab carousel button style + a card-flip slide
//    animation (ccFlipLeft / ccFlipRight) so scenarios cycle dynamically.
import { useState, useMemo, useRef } from 'react'
import { Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

type Chain = {
  title: string
  nodes: string[]
}

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
    animTimer.current = window.setTimeout(() => setAnim(null), reduced ? 0 : 600)
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
    stepAnimTimer.current = window.setTimeout(() => setStepAnim(null), reduced ? 0 : 600)
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
              className="rfi-glass-flat"
              style={{
                borderRadius: 16, padding: '22px 20px 14px', width: '100%', maxWidth: 560, flex: '0 1 auto',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(2px)',
                animation: anim ? `${anim === 'left' ? 'ccFlipLeft' : 'ccFlipRight'} 600ms cubic-bezier(0.16,1,0.3,1)` : undefined,
                display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: 17, color: 'var(--text)', fontWeight: 800, marginBottom: 18, textAlign: 'center', lineHeight: 1.35 }}>
                {current?.title ?? ''}
              </div>

              {/* Big centered step card - takes most space, transparent glass */}
              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                  padding: '34px 22px', margin: '0 auto 22px', width: '100%', maxWidth: 480,
                  textAlign: 'center', backdropFilter: 'blur(2px)',
                  animation: stepAnim ? `${stepAnim === 'left' ? 'ccFlipLeft' : 'ccFlipRight'} 600ms cubic-bezier(0.16,1,0.3,1)` : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
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
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', minWidth: 70, textAlign: 'center' }}>
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
