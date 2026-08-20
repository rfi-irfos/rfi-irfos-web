// "Causality Chains" section (`#causal-chains`) - placed directly above the
// Contact & Disclosures (Submit) section on Home. Mirrors the site's section
// vocabulary: Reveal, ScrambleHeading, JetBrains Mono eyebrow, glass cards.
//
// Interaction model (per spec 2026-08-20):
//  - Section eyebrow: "Causality Chains"
//  - Section title:    "A look into Dingir's Mind" / "Einblicke in Dingirs Denkweise"
//  - Section subheading stays.
//  - The WIDGET shows the current chain's title at its top (larger).
//  - The WIDGET shows exactly ONE step at a time as a wrapped card.
//  - The graph is a flat horizontal line with one dot per node; the current
//    stage's dot is highlighted. It sits at the BOTTOM of the widget.
//  - Stage nav arrows sit at the bottom of the graph to walk back/forth.
//  - Two SCENARIO arrows flank the widget (outside it, vertically centered),
//    reuse the exact Systems-tab carousel button style + smooth wrap animation,
//    and cycle scenarios, wrapping around (circle).
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
    <div style={{ width: '100%', maxWidth: 720, margin: '16px auto 0' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r={i === step ? 5.5 : 3}
            fill={i === step ? 'var(--accent-text)' : 'var(--text3)'}
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 10 }}>
        <button
          onClick={() => onStep((step - 1 + nodes.length) % nodes.length)}
          aria-label="Previous step"
          style={{
            width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}
        >&larr;</button>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', minWidth: 70, textAlign: 'center' }}>
          {String(step + 1).padStart(2, '0')} / {String(nodes.length).padStart(2, '0')}
        </span>
        <button
          onClick={() => onStep((step + 1) % nodes.length)}
          aria-label="Next step"
          style={{
            width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)',
            background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}
        >&rarr;</button>
      </div>
    </div>
  )
}

export function CausalChainsSection() {
  const { t } = useLocale()
  const chains = (t.causalChains.chains as Chain[]) ?? []
  const [scenario, setScenario] = useState(0)
  const [step, setStep] = useState(0)
  const [anim, setAnim] = useState<'left' | 'right' | null>(null)
  const animTimer = useRef<number | null>(null)

  const n = chains.length
  const safeScenario = n ? scenario % n : 0
  const current = chains[safeScenario]

  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const cycleScenario = (dir: number) => {
    if (!n) return
    setAnim(dir < 0 ? 'right' : 'left')
    if (animTimer.current) window.clearTimeout(animTimer.current)
    animTimer.current = window.setTimeout(() => setAnim(null), reduced ? 0 : 320)
    setScenario(s => (s + dir + n) % n)
    setStep(0)
  }
  const goStep = (i: number) => {
    if (!current) return
    setStep(((i % current.nodes.length) + current.nodes.length) % current.nodes.length)
  }

  return (
    <section id="causal-chains" style={{ padding: '48px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'left' }}>
            {t.causalChains.eyebrow}
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, textAlign: 'left' }}>
            <ScrambleHeading text={t.causalChains.heading} />
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 28, textAlign: 'left', maxWidth: 720, lineHeight: 1.7 }}>
            {t.causalChains.subheading}
          </p>
        </Reveal>

        <Reveal from="bottom" delay={1}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => cycleScenario(-1)} aria-label="Previous scenario" style={arrowStyle}>&larr;</button>

            <div
              className="rfi-glass-flat rfi-glass-solid"
              style={{
                borderRadius: 16, padding: '26px 26px 20px', maxWidth: 820, flex: '1 1 auto', minWidth: 0,
                animation: anim ? `${anim === 'left' ? 'ccSlideLeft' : 'ccSlideRight'} 320ms cubic-bezier(0.16,1,0.3,1)` : undefined,
              }}
            >
              <div style={{ fontSize: 18, color: 'var(--text)', fontWeight: 800, marginBottom: 18, textAlign: 'left', lineHeight: 1.35 }}>
                {current?.title ?? ''}
              </div>

              {/* ONE step at a time, wrapped as a card */}
              <div
                style={{
                  border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg2)',
                  padding: '18px 20px', marginBottom: 4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: 'var(--accent-text)', minWidth: 30 }}>
                    {current ? String(step + 1).padStart(2, '0') : '--'}
                  </span>
                  <span style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.5 }}>
                    {current ? current.nodes[step] : ''}
                  </span>
                </div>
              </div>

              {current && <ChainGraph nodes={current.nodes} step={step} onStep={goStep} />}
            </div>

            <button onClick={() => cycleScenario(1)} aria-label="Next scenario" style={arrowStyle}>&rarr;</button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
