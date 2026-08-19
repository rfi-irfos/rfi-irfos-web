// "Causality Chains" section (`#causal-chains`) - new widget placed between
// CoopPartners and Submit on Home. Mirrors the site's section vocabulary:
// Reveal, ScrambleHeading, JetBrains Mono eyebrow, glass cards, arrow buttons.
// The animated graph at the bottom is intentionally lightweight: a rolling
// polyline in an SVG viewBox, no external libs.
import { useState, useMemo } from 'react'
import { Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

type Chain = {
  title: string
  nodes: string[]
}

const CHAINS: Chain[] = [
  {
    title: 'The Earthquake That Changes a Food Price Months Later',
    nodes: [
      'Earthquake',
      'local port infrastructure is damaged',
      'handling capacity declines',
      'ships are rerouted',
      'transit time increases',
      'containers remain tied up longer',
      'effective global transport capacity declines',
      'freight rates rise',
      'import costs for an agricultural input increase',
      'regional production costs rise',
      'planting decisions shift',
      'cultivated area changes',
      'seasonal supply changes',
      'futures market reacts',
      'spot market reacts',
      'food producer adjusts procurement',
      'consumer prices change',
      'political price measures',
      'fiscal burden',
      'later infrastructure investment',
    ],
  },
  {
    title: 'A Rainfall Event That Ends in a Financial System',
    nodes: [
      'Extreme rainfall',
      'soil becomes saturated',
      'slope instability increases',
      'road fails',
      'local freight traffic declines',
      'production losses occur across multiple businesses',
      'delivery deadlines are missed',
      'contractual penalties increase',
      'cash flow declines',
      'short-term credit demand increases',
      'credit risk changes',
      'bank adjusts lending terms',
      'investment is postponed',
      'regional employment declines',
      'consumption declines',
      'tax revenue declines',
      'municipal budget tightens',
      'maintenance is deferred',
      'future failure probability increases',
    ],
  },
  {
    title: 'A Rockfall Upstream That Changes a Delta',
    nodes: [
      'Rockfall in the upper watershed',
      'sediment load increases',
      'river morphology changes',
      'sediment is deposited downstream',
      'delta channels change their cross-section',
      'flow is redistributed',
      'saltwater/freshwater boundary shifts',
      'soils become more saline in certain areas',
      'agricultural suitability declines',
      'cultivation practices change',
      'local incomes decline',
      'migration increases',
      'labor supply changes',
      'wage structure changes',
      'investment decisions shift',
      'regional land use changes',
      'future sediment dynamics change',
    ],
  },
  {
    title: 'A Dry Winter Becomes an Energy and Industrial Event',
    nodes: [
      'Low-snow season',
      'snow-water reservoir declines',
      'spring melt decreases',
      'reservoir inflow declines',
      'hydropower generation decreases',
      'electricity supply declines',
      'thermal reserves are used',
      'gas demand increases',
      'gas price changes',
      'electricity price changes',
      'energy-intensive industry reduces operating hours',
      'metal production declines',
      'global intermediate-goods prices change',
      'manufacturers raise prices',
      'demand shifts',
      'investment planning is adjusted',
      'future capacity expansion is delayed',
    ],
  },
  {
    title: 'A Conflict That Changes an Industrial Price Through Insurance',
    nodes: [
      'Conflict escalates',
      'route risk increases',
      'insurance premiums rise',
      'individual shipping companies change routes',
      'transit time increases',
      'available tonnage on alternative routes declines',
      'freight costs rise',
      'imported intermediate input becomes more expensive',
      'manufacturer reduces inventory coverage',
      'short-term production disruption',
      'spot price rises',
      'buyers secure long-term contracts',
      'supplier investment changes',
      'market structure shifts',
      'political sanctions change again',
    ],
  },
]

function ChainGraph({ nodes }: { nodes: string[] }) {
  // Build a deterministic rolling polyline from the chain itself.
  // Each node becomes a point; we spread them across the viewBox and
  // animate a translate so the line appears to move right->left.
  const W = 720
  const H = 110
  const pad = 24
  const usable = W - pad * 2
  const pts = useMemo(() => {
    const step = usable / Math.max(nodes.length - 1, 1)
    return nodes.map((_, i) => ({
      x: pad + i * step,
      y: H / 2 + Math.sin(i * 0.9) * 28 + ((i * 7) % 14) - 7,
    }))
  }, [nodes.length])

  const path = useMemo(() => {
    if (!pts.length) return null
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    const len = pts.length * 40 + 80
    return { d, len }
  }, [pts])

  return (
    <div style={{ width: '100%', maxWidth: 720, margin: '18px auto 0' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="causalGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(0,245,196,0)" />
            <stop offset="55%" stopColor="rgba(0,245,196,0.85)" />
            <stop offset="100%" stopColor="rgba(0,245,196,0)" />
          </linearGradient>
        </defs>
        {path && (
          <g>
            <path d={path.d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <path d={path.d} fill="none" stroke="url(#causalGrad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <animate attributeName="stroke-dasharray" from={`0 ${path.len}`} to={`${path.len} 0`} dur="4.2s" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate" from={`${W} 0`} to={`-${path.len} 0`} dur="6.8s" repeatCount="indefinite" />
            </path>
            {pts.map((p, i) => (
              <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="2.6" fill={i % 3 === 0 ? 'var(--accent-text)' : 'var(--text3)'} />
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}

export function CausalChainsSection() {
  const { t } = useLocale()
  const [idx, setIdx] = useState(0)
  const chains = t.causalChains.chains as Chain[]
  const current = chains[idx % chains.length]
  const prev = () => setIdx(i => (i - 1 + chains.length) % chains.length)
  const next = () => setIdx(i => (i + 1) % chains.length)

  return (
    <section id="causal-chains" style={{ padding: '48px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>{t.causalChains.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}><ScrambleHeading text={current?.title ?? ''} /></h2>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 28, textAlign: 'center', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            {t.causalChains.subheading}
          </p>
        </Reveal>

        <Reveal from="bottom" delay={1}>
          <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 16, padding: '22px 22px 18px', maxWidth: 820, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 14 }}>
              <button onClick={prev} aria-label="Previous chain" style={{
                width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border)',
                background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>&larr;</button>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {chains.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`Chain ${i + 1}`} style={{
                    width: 8, height: 8, borderRadius: 999, border: 'none',
                    background: i === idx ? 'var(--accent-text)' : 'var(--border)',
                    cursor: 'pointer', transform: i === idx ? 'scale(1.15)' : 'scale(1)', transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1), background 220ms',
                  }} />
                ))}
              </div>
              <button onClick={next} aria-label="Next chain" style={{
                width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border)',
                background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>&rarr;</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1 / -1', fontSize: 13, color: 'var(--text)', fontWeight: 700, marginBottom: 4 }}>
                {t.causalChains.readingAid || 'Causality chain'}
              </div>
              {current.nodes.map((node, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, color: 'var(--text)', lineHeight: 1.55,
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text3)', minWidth: 22 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ color: 'var(--text2)' }}>{node}</span>
                </div>
              ))}
            </div>

            <ChainGraph nodes={current.nodes} />

            <p style={{ fontSize: 11.5, color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
              {t.causalChains.llmNote || 'Dingir head: raw observations → readable chain. Albert will replace this head later.'}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
