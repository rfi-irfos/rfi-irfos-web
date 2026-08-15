// Animated preview diagrams for the System Card modal's left column
// (2026-08-15). 143 modals, most with no live UI to screenshot - rather than
// one bespoke animation per system (untenable) or a static icon (reads as
// filler), this is a small family of ~12 visual metaphors assigned by what a
// system actually does (see content/systemPreviews.ts for the assignment
// logic). Every archetype shares the same viewBox and the same keyframe
// vocabulary from index.css, so switching between modals via the "connects
// to" pills never feels like jumping between unrelated design systems.
// Pure SVG + CSS animation - no canvas, no animation library, so this stays
// prerenderable and costs nothing at rest (paused off-screen via CSS
// containment the same way the rest of the site treats decorative motion).
import type { DiagramArchetype } from '../../content/systemPreviews'

const VB_W = 260
const VB_H = 300

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" className="rfi-diagram-anim" style={{ display: 'block' }}>
      {children}
    </svg>
  )
}

function Node({ x, y, r, accent, delay = 0, faint = false }: { x: number; y: number; r: number; accent: string; delay?: number; faint?: boolean }) {
  return (
    <circle cx={x} cy={y} r={r} fill={faint ? 'none' : accent} stroke={accent} strokeWidth={faint ? 1.5 : 0}
      opacity={faint ? 0.35 : 1}
      style={faint ? undefined : { animation: `rfi-diagram-node-wake 2.8s ease-in-out ${delay}s infinite` }} />
  )
}

function OrchestratorHub({ accent }: { accent: string }) {
  const cx = VB_W / 2, cy = VB_H / 2
  const spokes = [
    { x: cx, y: cy - 92 }, { x: cx + 82, y: cy - 40 }, { x: cx + 82, y: cy + 40 },
    { x: cx, y: cy + 92 }, { x: cx - 82, y: cy + 40 }, { x: cx - 82, y: cy - 40 },
  ]
  return (
    <Frame>
      {spokes.map((s, i) => (
        <line key={i} x1={cx} y1={cy} x2={s.x} y2={s.y} stroke={accent} strokeWidth={1} opacity={0.22} />
      ))}
      {spokes.map((s, i) => (
        <circle key={`p-${i}`} cx={s.x} cy={s.y} r={3} fill={accent}>
          <animate attributeName="opacity" values="0;0;1;0" dur="3.2s" begin={`${i * 0.22}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {spokes.map((s, i) => <Node key={`n-${i}`} x={s.x} y={s.y} r={7} accent={accent} delay={i * 0.18} faint />)}
      <circle cx={cx} cy={cy} r={16} fill={accent} opacity={0.15} />
      <circle cx={cx} cy={cy} r={9} fill={accent} />
    </Frame>
  )
}

function PipelineFlow({ accent }: { accent: string }) {
  const y = VB_H / 2
  const stages = [40, 100, 160, 220]
  return (
    <Frame>
      <line x1={30} y1={y} x2={230} y2={y} stroke={accent} strokeWidth={1} opacity={0.2} />
      {stages.map((x, i) => (
        <rect key={i} x={x - 14} y={y - 20} width={28} height={40} rx={5} fill="none" stroke={accent} strokeWidth={1.4} opacity={0.55} />
      ))}
      {[0, 1, 2].map(i => (
        <circle key={i} cy={y} r={4} fill={accent} style={{ animation: `rfi-diagram-flow 3.6s linear ${i * 1.2}s infinite`, transformBox: 'view-box', transformOrigin: '30px center' }} />
      ))}
    </Frame>
  )
}

function VectorStorage({ accent }: { accent: string }) {
  const cx = VB_W / 2, cy = VB_H / 2
  const dots = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2
    const rad = 55 + (i % 3) * 12
    return { x: cx + Math.cos(angle) * rad, y: cy + Math.sin(angle) * rad, i }
  })
  return (
    <Frame>
      <circle cx={cx} cy={cy} r={26} fill="none" stroke={accent} strokeWidth={1.4} opacity={0.4} />
      <rect x={cx - 14} y={cy - 18} width={28} height={36} rx={3} fill="none" stroke={accent} strokeWidth={1.6} />
      <line x1={cx - 14} y1={cy - 6} x2={cx + 14} y2={cy - 6} stroke={accent} strokeWidth={1} opacity={0.5} />
      <line x1={cx - 14} y1={cy + 6} x2={cx + 14} y2={cy + 6} stroke={accent} strokeWidth={1} opacity={0.5} />
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'rfi-diagram-orbit 22s linear infinite' }}>
        {dots.map(d => <circle key={d.i} cx={d.x} cy={d.y} r={2.6} fill={accent} opacity={0.7} />)}
      </g>
    </Frame>
  )
}

function CliTerminal({ accent }: { accent: string }) {
  const x = 40, y = 90, w = 180, h = 120
  return (
    <Frame>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="none" stroke={accent} strokeWidth={1.4} opacity={0.55} />
      <line x1={x} y1={y + 24} x2={x + w} y2={y + 24} stroke={accent} strokeWidth={1} opacity={0.3} />
      {[0, 1, 2].map(i => <circle key={i} cx={x + 14 + i * 12} cy={y + 12} r={3} fill={accent} opacity={0.5} />)}
      <text x={x + 14} y={y + 48} fontFamily="'JetBrains Mono', monospace" fontSize={11} fill={accent} opacity={0.85}>$</text>
      <rect x={x + 24} y={y + 39} height={11} fill={accent} opacity={0.85}
        style={{ ['--rfi-type-w' as string]: '110px', animation: 'rfi-diagram-type 4.5s steps(14, end) infinite', overflow: 'hidden' }} />
      <rect x={x + 14} y={y + 66} width={9} height={13} fill={accent} style={{ animation: 'rfi-diagram-blink 1.1s step-end infinite' }} />
    </Frame>
  )
}

function ProtocolBridge({ accent }: { accent: string }) {
  const y = VB_H / 2
  return (
    <Frame>
      <rect x={30} y={y - 26} width={56} height={52} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <rect x={174} y={y - 26} width={56} height={52} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <line x1={90} y1={y} x2={170} y2={y} stroke={accent} strokeWidth={1.4} strokeDasharray="4 4" opacity={0.5} />
      <rect x={122} y={y - 6} width={12} height={12} rx={2} fill={accent}
        style={{ ['--rfi-pp-dist' as string]: '56px', animation: 'rfi-diagram-pingpong 2.8s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
    </Frame>
  )
}

function ForkReference({ accent }: { accent: string }) {
  const cx = VB_W / 2
  return (
    <Frame>
      <circle cx={cx} cy={116} r={13} fill={accent} opacity={0.9} />
      <line x1={cx} y1={129} x2={cx} y2={182} stroke={accent} strokeWidth={1.4} strokeDasharray="3 5" opacity={0.5} />
      <circle cx={cx} cy={200} r={17} fill="none" stroke={accent} strokeWidth={1.4}
        style={{ animation: 'rfi-diagram-echo 3.4s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
      <circle cx={cx} cy={200} r={9} fill="none" stroke={accent} strokeWidth={1.2} opacity={0.4} />
    </Frame>
  )
}

function SecurityGate({ accent }: { accent: string }) {
  const y = VB_H / 2
  return (
    <Frame>
      <line x1={20} y1={y} x2={240} y2={y} stroke={accent} strokeWidth={1} opacity={0.18} />
      <path d={`M ${VB_W / 2 - 20} ${y - 34} L ${VB_W / 2 + 20} ${y - 34} L ${VB_W / 2 + 20} ${y + 10} Q ${VB_W / 2} ${y + 40} ${VB_W / 2 - 20} ${y + 10} Z`}
        fill="none" stroke={accent} strokeWidth={1.8} opacity={0.75} />
      <path d={`M ${VB_W / 2 - 9} ${y - 6} l 6 7 l 13 -15`} fill="none" stroke={accent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      {[0, 1, 2].map(i => (
        <circle key={i} cy={y} r={3.4} fill={accent} style={{ animation: `rfi-diagram-flow 3.2s linear ${i * 1.05}s infinite`, transformBox: 'view-box', transformOrigin: '20px center' }} />
      ))}
    </Frame>
  )
}

function ModelInference({ accent }: { accent: string }) {
  const layers = [70, 130, 190]
  const counts = [3, 4, 3]
  return (
    <Frame>
      {layers.map((x, li) => Array.from({ length: counts[li] }, (_, ni) => {
        const spread = counts[li] === 4 ? [-72, -24, 24, 72] : [-48, 0, 48]
        return <circle key={`${li}-${ni}`} cx={x} cy={VB_H / 2 + spread[ni]} r={5.5} fill="none" stroke={accent} strokeWidth={1.4}
          style={{ animation: `rfi-diagram-node-wake 2.4s ease-in-out ${(li * 0.35 + ni * 0.12)}s infinite` }} />
      }))}
      {layers.slice(0, -1).map((x, li) => {
        const from = counts[li] === 4 ? [-72, -24, 24, 72] : [-48, 0, 48]
        const to = counts[li + 1] === 4 ? [-72, -24, 24, 72] : [-48, 0, 48]
        return from.flatMap((fy, fi) => to.map((ty, ti) => (
          <line key={`${li}-${fi}-${ti}`} x1={x} y1={VB_H / 2 + fy} x2={layers[li + 1]} y2={VB_H / 2 + ty} stroke={accent} strokeWidth={0.6} opacity={0.14} />
        )))
      })}
    </Frame>
  )
}

function HardwareSilicon({ accent }: { accent: string }) {
  const path = 'M30,80 H90 V50 H160 V110 H230 M90,50 V150 H60 V220 M160,110 V200 H200 M160,150 H120 V240'
  return (
    <Frame>
      <path d={path} fill="none" stroke={accent} strokeWidth={1.3} opacity={0.35} />
      <path d={path} fill="none" stroke={accent} strokeWidth={1.6} strokeDasharray="1" pathLength={1}
        style={{ animation: 'rfi-draw 5s ease-in-out infinite', strokeDashoffset: 1 } as React.CSSProperties} />
      {[[90, 80], [160, 110], [90, 150], [160, 200], [120, 240]].map(([x, y], i) => (
        <rect key={i} x={x - 4} y={y - 4} width={8} height={8} fill={accent} style={{ animation: `rfi-diagram-node-wake 2.6s ease-in-out ${i * 0.3}s infinite` }} />
      ))}
    </Frame>
  )
}

function DocumentReview({ accent }: { accent: string }) {
  const x = 76, y = 60, w = 108, h = 150
  const checks = [y + 34, y + 66, y + 98]
  return (
    <Frame>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <line x1={x + 14} y1={y + 16} x2={x + w - 14} y2={y + 16} stroke={accent} strokeWidth={1.2} opacity={0.4} />
      {checks.map((cy, i) => (
        <g key={i}>
          <rect x={x + 14} y={cy - 7} width={14} height={14} rx={3} fill="none" stroke={accent} strokeWidth={1.3} opacity={0.5} />
          <path d={`M ${x + 17} ${cy} l 4 4 l 7 -8`} fill="none" stroke={accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
            pathLength={1} style={{ animation: `rfi-draw 0.5s ease-out ${0.6 + i * 0.7}s both, rfi-diagram-node-wake 3.6s ease-in-out ${3 + i * 0.7}s ${0.6 + i * 0.7}s infinite` } as React.CSSProperties} />
          <line x1={x + 36} y1={cy} x2={x + w - 14} y2={cy} stroke={accent} strokeWidth={1} opacity={0.3} />
        </g>
      ))}
    </Frame>
  )
}

function WebApp({ accent }: { accent: string }) {
  const x = 34, y = 74, w = 192, h = 132
  return (
    <Frame>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <line x1={x} y1={y + 22} x2={x + w} y2={y + 22} stroke={accent} strokeWidth={1} opacity={0.3} />
      {[0, 1, 2].map(i => <circle key={i} cx={x + 14 + i * 11} cy={y + 11} r={2.8} fill={accent} opacity={0.5} />)}
      <rect x={x + 14} y={y + 36} width={w - 28} height={12} rx={2} fill={accent} opacity={0.5} />
      <rect x={x + 14} y={y + 58} width={w - 28} height={44} rx={4} fill="none" stroke={accent} strokeWidth={1} opacity={0.35} />
      <rect x={x + 14} y={y + 58} width={70} height={44} fill={accent} opacity={0.08}
        style={{ background: `linear-gradient(100deg, transparent 30%, ${accent}44 50%, transparent 70%)`, backgroundSize: '250% 100%', animation: 'rfi-diagram-shimmer 3s linear infinite' } as React.CSSProperties} />
    </Frame>
  )
}

function EmptyPlaceholder({ accent }: { accent: string }) {
  const x = 70, y = 100, w = 120, h = 100
  return (
    <Frame>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="5 5" opacity={0.35} />
      <circle cx={VB_W / 2} cy={VB_H / 2} r={4} fill={accent} opacity={0.35} style={{ animation: 'rfi-diagram-echo 4s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
    </Frame>
  )
}

const ARCHETYPES: Record<DiagramArchetype, (props: { accent: string }) => JSX.Element> = {
  'orchestrator-hub': OrchestratorHub,
  'pipeline-flow': PipelineFlow,
  'vector-storage': VectorStorage,
  'cli-terminal': CliTerminal,
  'protocol-bridge': ProtocolBridge,
  'fork-reference': ForkReference,
  'security-gate': SecurityGate,
  'model-inference': ModelInference,
  'hardware-silicon': HardwareSilicon,
  'document-review': DocumentReview,
  'web-app': WebApp,
  'empty-placeholder': EmptyPlaceholder,
}

export function SystemDiagram({ archetype, accent }: { archetype: DiagramArchetype; accent: string }) {
  const Component = ARCHETYPES[archetype]
  return <Component accent={accent} />
}
