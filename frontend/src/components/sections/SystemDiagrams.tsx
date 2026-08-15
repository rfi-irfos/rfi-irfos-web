// Animated preview diagrams for the System Card modal's left column
// (2026-08-15). 143 modals, most with no live UI to screenshot - rather than
// one bespoke animation per system (untenable) or a static icon (reads as
// filler), this is a small family of ~14 visual metaphors assigned by what a
// system actually does (see content/systemPreviews.ts for the assignment
// logic). Every archetype shares the same viewBox and the same keyframe
// vocabulary from index.css, so switching between modals via the "connects
// to" pills never feels like jumping between unrelated design systems.
// Every archetype also carries a short plain-language caption baked into the
// SVG itself (live feedback 2026-08-15: "das sind doch keine archetypen...
// die sollen wie strassentafeln jede mensch unmissverständlich erklären was
// des system macht" - reusing one diagram across many systems is fine, an
// unlabeled abstract shape that reads as decoration is not). The caption
// states what the *pattern* does, not the specific system - the system's own
// name/description sits in the modal's text column right next to it.
// Pure SVG + CSS animation - no canvas, no animation library, so this stays
// prerenderable and costs nothing at rest (paused off-screen via CSS
// containment the same way the rest of the site treats decorative motion).
import type { DiagramArchetype } from '../../content/systemPreviews'

// Square viewBox (live feedback 2026-08-15: "same size issue" - a 260x300
// canvas inside a square preview box always left letterboxing bars, on top
// of the diagrams themselves already under-using their own canvas).
const VB_W = 260
const VB_H = 260

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
      <text x={cx} y={16} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">ONE HUB, MANY SPOKES</text>
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
      <text x={VB_W / 2} y={246} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">STAGE BY STAGE, IN ORDER</text>
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
  // Redesigned 2026-08-15 (live feedback: "everybody thinks nice flashing
  // colors, nobody understands the diagram... must be stupidly simple") -
  // the previous version (a database icon with dots orbiting it) looked like
  // generic "tech decoration," not "finds and groups similar things." This
  // is the literal pictogram instead: a scatter of points visibly gathers
  // into three tight clusters and back, on a loop - the actual mechanism
  // (grouping by similarity), not an abstract stand-in for it.
  const cx = VB_W / 2, cy = VB_H / 2
  const clusters = [{ x: cx - 66, y: cy - 38 }, { x: cx + 66, y: cy - 28 }, { x: cx, y: cy + 68 }]
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2
    const startX = cx + Math.cos(angle) * 95
    const startY = cy + Math.sin(angle) * 95
    const cluster = clusters[i % 3]
    const jitterX = ((i % 3) - 1) * 9
    const jitterY = (Math.floor(i / 3) % 2) * 9 - 4
    return { startX, startY, dx: cluster.x + jitterX - startX, dy: cluster.y + jitterY - startY, i }
  })
  return (
    <Frame>
      <text x={VB_W / 2} y={16} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">GROUPS BY SIMILARITY</text>
      {dots.map(d => (
        <circle key={d.i} cx={d.startX} cy={d.startY} r={6.5} fill={accent} opacity={0.75}
          style={{
            ['--rfi-cluster-dx' as string]: `${d.dx}px`, ['--rfi-cluster-dy' as string]: `${d.dy}px`,
            animation: `rfi-diagram-cluster 5s ease-in-out ${(d.i % 3) * 0.15}s infinite`,
          }} />
      ))}
    </Frame>
  )
}

function ResourceFlow({ accent }: { accent: string }) {
  // Custom pictogram for foodsharing (live feedback: "what does this show
  // me about how foodsharing works?" - the generic web-app browser mockup
  // said nothing). Two people, a surplus item literally moving from the one
  // who has extra to the one who needs it - the entire concept in one loop.
  const cy = VB_H / 2
  const person = (x: number) => (
    <>
      <circle cx={x} cy={cy - 34} r={13} fill="none" stroke={accent} strokeWidth={2} opacity={0.7} />
      <path d={`M ${x - 20} ${cy + 26} Q ${x - 20} ${cy - 8} ${x} ${cy - 8} Q ${x + 20} ${cy - 8} ${x + 20} ${cy + 26}`} fill="none" stroke={accent} strokeWidth={2} opacity={0.7} />
    </>
  )
  return (
    <Frame>
      {person(56)}
      {person(VB_W - 56)}
      <line x1={90} y1={cy - 4} x2={VB_W - 90} y2={cy - 4} stroke={accent} strokeWidth={1.2} strokeDasharray="3 6" opacity={0.35} />
      <circle r={9} fill={accent} cy={cy - 4}
        style={{ animation: 'rfi-diagram-flow 3.2s ease-in-out infinite', transformBox: 'view-box', transformOrigin: '90px center' }} />
      <text x={VB_W / 2} y={cy + 60} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">SURPLUS &rarr; NEED</text>
    </Frame>
  )
}

function DeterministicReplay({ accent }: { accent: string }) {
  // Custom pictogram for moe-runtime/moe-ddel (live feedback: "random
  // charts, not showing the architecture"). The actual claim is "run it
  // twice, get the identical result" - so this literally runs two identical
  // lanes in perfect lockstep, both landing on the same checkmark at the
  // same instant.
  const lanes = [VB_W / 2 - 56, VB_W / 2 + 56]
  const steps = [-70, -20, 30]
  return (
    <Frame>
      <line x1={VB_W / 2} y1={30} x2={VB_W / 2} y2={100} stroke={accent} strokeWidth={1.2} strokeDasharray="2 5" opacity={0.3} />
      <text x={VB_W / 2} y={22} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">SAME INPUT</text>
      {lanes.map((lx, li) => (
        <g key={li}>
          <line x1={lx} y1={100} x2={lx} y2={210} stroke={accent} strokeWidth={1.2} opacity={0.25} />
          {steps.map((sy, si) => (
            <rect key={si} x={lx - 15} y={VB_H / 2 + sy} width={30} height={20} rx={4} fill="none" stroke={accent} strokeWidth={1.4}
              style={{ animation: `rfi-diagram-node-wake 3s ease-in-out ${si * 0.5}s infinite` }} />
          ))}
          <circle cx={lx} cy={VB_H / 2 + 60} r={11} fill="none" stroke={accent} strokeWidth={1.8} />
          <path d={`M ${lx - 5} ${VB_H / 2 + 60} l 3.5 4 l 6.5 -8`} fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={1} pathLength={1} style={{ animation: `rfi-draw 0.5s ease-out 1.6s both` } as React.CSSProperties} />
        </g>
      ))}
    </Frame>
  )
}

function CliTerminal({ accent }: { accent: string }) {
  const x = 40, y = 90, w = 180, h = 120
  return (
    <Frame>
      <text x={VB_W / 2} y={246} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">RUN FROM THE COMMAND LINE</text>
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
  const y = VB_H / 2, bw = 76, bh = 128
  const rows = [-40, -14, 12, 38]
  return (
    <Frame>
      <text x={VB_W / 2} y={244} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">TRANSLATES BETWEEN TWO SIDES</text>
      {[30, VB_W - 30 - bw].map((bx, side) => (
        <g key={side}>
          <rect x={bx} y={y - bh / 2} width={bw} height={bh} rx={8} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
          <line x1={bx + 12} y1={y - bh / 2 + 20} x2={bx + bw - 12} y2={y - bh / 2 + 20} stroke={accent} strokeWidth={1.1} opacity={0.4} />
          {rows.map((ry, i) => (
            <rect key={i} x={bx + 12} y={y + ry} width={bw - 24 - (i % 2) * 14} height={5} rx={2} fill={accent} opacity={0.28} />
          ))}
        </g>
      ))}
      <line x1={30 + bw + 6} y1={y} x2={VB_W - 30 - bw - 6} y2={y} stroke={accent} strokeWidth={1.4} strokeDasharray="4 4" opacity={0.5} />
      <rect x={VB_W / 2 - 7} y={y - 7} width={14} height={14} rx={3} fill={accent}
        style={{ ['--rfi-pp-dist' as string]: `${VB_W / 2 - 30 - bw - 13}px`, animation: 'rfi-diagram-pingpong 2.8s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
    </Frame>
  )
}

function ForkReference({ accent }: { accent: string }) {
  // Redesigned 2026-08-15 (live feedback: "stupidly simple and clear...
  // imagine somebody can't read") - the literal git-branch pictogram: one
  // origin point, one path that keeps going solid and bright (the real
  // upstream project, still active), one path that branches off and
  // visibly stops at a dim, static, dashed node (our kept copy). The
  // contrast between "moving" and "stopped" carries the whole meaning
  // without needing a single word.
  const cx = VB_W / 2, originY = 56
  return (
    <Frame>
      <text x={cx} y={248} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">KEPT FOR REFERENCE ONLY</text>
      <circle cx={cx} cy={originY} r={13} fill={accent} />
      <path d={`M ${cx} ${originY + 13} L ${cx + 58} ${originY + 68} L ${cx + 58} ${VB_H - 40}`} fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" strokeDasharray="10 6" opacity={0.9}
        style={{ animation: 'rfi-diagram-march 1.4s linear infinite' }} />
      <circle cx={cx + 58} cy={VB_H - 40} r={7} fill={accent} opacity={0.9}
        style={{ animation: 'rfi-diagram-node-wake 2.2s ease-in-out infinite' }} />
      <path d={`M ${cx} ${originY + 13} L ${cx - 58} ${originY + 68} L ${cx - 58} ${VB_H - 78}`} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 8" opacity={0.35} />
      <circle cx={cx - 58} cy={VB_H - 78} r={11} fill="none" stroke={accent} strokeWidth={2} opacity={0.45} />
      <line x1={cx - 58 - 13} y1={VB_H - 78} x2={cx - 58 + 13} y2={VB_H - 78} stroke={accent} strokeWidth={2} opacity={0.35} />
    </Frame>
  )
}

function SecurityGate({ accent }: { accent: string }) {
  const y = VB_H / 2
  return (
    <Frame>
      <text x={VB_W / 2} y={244} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">CHECKED BEFORE IT PASSES</text>
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
      <text x={VB_W / 2} y={244} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">SIGNAL FLOWS LAYER TO LAYER</text>
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
      <text x={VB_W / 2} y={14} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={9} fill={accent} opacity={0.45} letterSpacing="0.1em">BUILT INTO THE CIRCUIT</text>
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
      <text x={VB_W / 2} y={244} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">REVIEWED LINE BY LINE</text>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <line x1={x + 14} y1={y + 16} x2={x + w - 14} y2={y + 16} stroke={accent} strokeWidth={1.2} opacity={0.4} />
      {checks.map((cy, i) => (
        <g key={i}>
          <rect x={x + 14} y={cy - 7} width={14} height={14} rx={3} fill="none" stroke={accent} strokeWidth={1.3} opacity={0.5} />
          <path d={`M ${x + 17} ${cy} l 4 4 l 7 -8`} fill="none" stroke={accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={1} pathLength={1}
            style={{ animation: `rfi-draw 0.6s ease-out ${0.6 + i * 0.7}s both, rfi-diagram-node-wake 3.2s ease-in-out ${1.2 + i * 0.7}s infinite` } as React.CSSProperties} />
          <line x1={x + 36} y1={cy} x2={x + w - 14} y2={cy} stroke={accent} strokeWidth={1} opacity={0.3} />
        </g>
      ))}
    </Frame>
  )
}

function WebApp({ accent }: { accent: string }) {
  const x = 34, y = 74, w = 192, h = 132
  const cw = w - 28, cx0 = x + 14, cy0 = y + 58, ch = 44
  // CSS `background`/`background-position` has no effect on an SVG <rect> -
  // it's an HTML box-model property, SVG shapes paint via fill/stroke only.
  // Fixed with an SVG-native sweep instead: a gradient-filled rect three
  // times the content width, clipped to the content box, translated via a
  // CSS transform keyframe (transform DOES work on SVG elements).
  return (
    <Frame>
      <defs>
        <linearGradient id="rfi-diagram-webapp-shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="50%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <clipPath id="rfi-diagram-webapp-clip"><rect x={cx0} y={cy0} width={cw} height={ch} rx={4} /></clipPath>
      </defs>
      <text x={VB_W / 2} y={242} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">RUNS IN THE BROWSER</text>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <line x1={x} y1={y + 22} x2={x + w} y2={y + 22} stroke={accent} strokeWidth={1} opacity={0.3} />
      {[0, 1, 2].map(i => <circle key={i} cx={x + 14 + i * 11} cy={y + 11} r={2.8} fill={accent} opacity={0.5} />)}
      <rect x={cx0} y={y + 36} width={cw} height={12} rx={2} fill={accent} opacity={0.5} />
      <rect x={cx0} y={cy0} width={cw} height={ch} rx={4} fill="none" stroke={accent} strokeWidth={1} opacity={0.35} />
      <g clipPath="url(#rfi-diagram-webapp-clip)">
        <rect x={cx0 - cw} y={cy0} width={cw * 3} height={ch} fill="url(#rfi-diagram-webapp-shimmer)"
          style={{ ['--rfi-shimmer-dist' as string]: `${cw * 2}px`, animation: 'rfi-diagram-shimmer-x 2.8s linear infinite' }} />
      </g>
    </Frame>
  )
}

function EmptyPlaceholder({ accent }: { accent: string }) {
  const x = 70, y = 100, w = 120, h = 100
  return (
    <Frame>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="5 5" opacity={0.35} />
      <circle cx={VB_W / 2} cy={VB_H / 2} r={4} fill={accent} opacity={0.35} style={{ animation: 'rfi-diagram-echo 4s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x={VB_W / 2} y={246} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={10} fill={accent} opacity={0.45} letterSpacing="0.1em">NOTHING BUILT HERE YET</text>
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
  'resource-flow': ResourceFlow,
  'deterministic-replay': DeterministicReplay,
}

export function SystemDiagram({ archetype, accent }: { archetype: DiagramArchetype; accent: string }) {
  const Component = ARCHETYPES[archetype]
  return <Component accent={accent} />
}
