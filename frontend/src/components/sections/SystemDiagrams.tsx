// Per-system preview diagrams for the System Card modal (rebuilt 2026-08-15).
// The previous version was 14 anonymous "archetype" shapes shared across 143
// systems - live feedback killed that outright: "das sind doch keine
// archetypen... read the modal, understand what's in, craft a unique
// visualization that ACTUALLY shows the ACTUAL thing". This rebuild keeps the
// one thing that made 143 diagrams tractable (a shared family of SVG
// templates) but makes every template *parameterized*: real stage names, real
// CLI lines, real endpoint paths, real numbers from the system's own card
// text flow in via DiagramSpec (content/systemPreviews.ts assigns one spec
// per system, hand-written from each card's actual content). So
// ternlang-codegen shows .TERN → AST → C → BINARY, ternlang-compress shows
// floats collapsing to {-1 0 +1}, albert-cli shows an actual terminal
// conversation - not "STAGE BY STAGE, IN ORDER" under an unlabeled shape.
// Same shared keyframe vocabulary from index.css as before (rfi-diagram-*),
// same 260x260 viewBox, pure SVG + CSS - prerenderable, cheap at rest.
import type { DiagramSpec } from '../../content/systemPreviews'

const W = 260
const H = 260
const MONO = "'JetBrains Mono', monospace"

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className="rfi-diagram-anim" style={{ display: 'block' }}>
      {children}
    </svg>
  )
}

// Caption baked into every diagram - the one-line plain-language statement of
// what this specific system does. Auto-wraps onto two lines when too long for
// the 260px canvas (~40 chars at 9px mono), splitting at the space nearest
// the midpoint so neither line runs off the edge.
function Cap({ text, accent, y = 244 }: { text: string; accent: string; y?: number }) {
  const lines: string[] = []
  if (text.length <= 40) lines.push(text)
  else {
    const mid = Math.floor(text.length / 2)
    let split = text.lastIndexOf(' ', mid)
    if (split < 8) split = text.indexOf(' ', mid)
    if (split === -1) lines.push(text)
    else lines.push(text.slice(0, split), text.slice(split + 1))
  }
  const y0 = lines.length === 2 ? y - 12 : y
  return (
    <g>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y0 + i * 12} textAnchor="middle" fontFamily={MONO} fontSize={9}
          fill={accent} opacity={0.6} letterSpacing="0.08em">{l}</text>
      ))}
    </g>
  )
}

function TLabel({ x, y, size = 8.5, accent, op = 0.8, anchor = 'middle', children }: {
  x: number; y: number; size?: number; accent: string; op?: number; anchor?: 'middle' | 'start' | 'end'; children: React.ReactNode
}) {
  return <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize={size} fill={accent} opacity={op} letterSpacing="0.04em">{children}</text>
}

// ── Core stack shapes ─────────────────────────────────────────────

function Stack({ layers, cap, accent }: { layers: string[]; cap: string; accent: string }) {
  const bh = 40, gap = 12, total = layers.length * bh + (layers.length - 1) * gap
  const y0 = (H - 50 - total) / 2 + 10
  return (
    <Frame>
      {layers.map((l, i) => {
        const y = y0 + i * (bh + gap)
        return (
          <g key={i}>
            <rect x={34} y={y} width={W - 68} height={bh} rx={6} fill={`${i === 0 ? accent : 'none'}`} fillOpacity={i === 0 ? 0.12 : 0}
              stroke={accent} strokeWidth={1.4} opacity={0.7} style={{ animation: `rfi-diagram-node-wake 3.4s ease-in-out ${i * 0.4}s infinite` }} />
            <TLabel x={W / 2} y={y + bh / 2 + 3} accent={accent}>{l}</TLabel>
            {i < layers.length - 1 && <line x1={W / 2} y1={y + bh} x2={W / 2} y2={y + bh + gap} stroke={accent} strokeWidth={1.2} opacity={0.4} />}
          </g>
        )
      })}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Pipeline({ stages, cap, accent }: { stages: string[]; cap: string; accent: string }) {
  const n = stages.length, bw = Math.min(56, (W - 40 - (n - 1) * 14) / n), y = H / 2 - 24
  const x0 = (W - (n * bw + (n - 1) * 14)) / 2
  return (
    <Frame>
      <line x1={x0} y1={y + 18} x2={x0 + n * bw + (n - 1) * 14} y2={y + 18} stroke={accent} strokeWidth={1} opacity={0.2} />
      {stages.map((s, i) => {
        const x = x0 + i * (bw + 14)
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={36} rx={5} fill="none" stroke={accent} strokeWidth={1.4} opacity={0.65}
              style={{ animation: `rfi-diagram-node-wake 3.2s ease-in-out ${i * 0.5}s infinite` }} />
            <TLabel x={x + bw / 2} y={y + 21} size={8} accent={accent}>{s}</TLabel>
            {i < n - 1 && <TLabel x={x + bw + 7} y={y + 21} size={10} accent={accent} op={0.5}>&rarr;</TLabel>}
          </g>
        )
      })}
      {[0, 1].map(i => (
        <circle key={i} cy={y + 60} r={4} fill={accent} style={{ animation: `rfi-diagram-flow 3.6s linear ${i * 1.8}s infinite`, transformBox: 'view-box', transformOrigin: `${x0}px center` }} />
      ))}
      <line x1={x0} y1={y + 60} x2={x0 + n * bw + (n - 1) * 14} y2={y + 60} stroke={accent} strokeWidth={1} opacity={0.15} />
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

// ── Terminals ─────────────────────────────────────────────────────

function TermChrome({ accent, x = 22, y = 46, w = W - 44, h = 150 }: { accent: string; x?: number; y?: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="none" stroke={accent} strokeWidth={1.4} opacity={0.55} />
      <line x1={x} y1={y + 20} x2={x + w} y2={y + 20} stroke={accent} strokeWidth={1} opacity={0.3} />
      {[0, 1, 2].map(i => <circle key={i} cx={x + 13 + i * 11} cy={y + 10} r={2.6} fill={accent} opacity={0.5} />)}
    </g>
  )
}

function Terminal({ lines, cap, accent }: { lines: { p?: boolean; t: string }[]; cap: string; accent: string }) {
  return (
    <Frame>
      <TermChrome accent={accent} />
      {lines.slice(0, 6).map((l, i) => (
        <g key={i} style={{ animation: `rfi-diagram-node-wake 4s ease-in-out ${i * 0.45}s infinite` }}>
          {l.p && <TLabel x={34} y={84 + i * 19} size={9} accent={accent} anchor="start" op={0.95}>$</TLabel>}
          <TLabel x={l.p ? 44 : 34} y={84 + i * 19} size={8.5} accent={accent} anchor="start" op={l.p ? 0.9 : 0.6}>{l.t}</TLabel>
        </g>
      ))}
      <rect x={34} y={84 + Math.min(lines.length, 6) * 19 - 9} width={8} height={11} fill={accent} style={{ animation: 'rfi-diagram-blink 1.1s step-end infinite' }} />
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Chat({ lines, badge, cap, accent }: { lines: { who: 'you' | 'ai'; t: string }[]; badge?: string; cap: string; accent: string }) {
  return (
    <Frame>
      <TermChrome accent={accent} y={40} h={162} />
      {badge && (
        <g>
          <rect x={W - 96} y={46} width={68} height={13} rx={6.5} fill={accent} opacity={0.14} />
          <TLabel x={W - 62} y={55.5} size={7.5} accent={accent}>{badge}</TLabel>
        </g>
      )}
      {lines.slice(0, 5).map((l, i) => (
        <g key={i} style={{ animation: `rfi-diagram-node-wake 4.5s ease-in-out ${i * 0.55}s infinite` }}>
          <TLabel x={34} y={86 + i * 24} size={8} accent={accent} anchor="start" op={l.who === 'you' ? 0.95 : 0.55}>
            {l.who === 'you' ? '>' : '▸'}
          </TLabel>
          <TLabel x={46} y={86 + i * 24} size={8.5} accent={accent} anchor="start" op={l.who === 'you' ? 0.9 : 0.65}>{l.t}</TLabel>
        </g>
      ))}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

// ── Language / editor ─────────────────────────────────────────────

function CodeHighlight({ popup, cap, accent }: { popup?: boolean; cap: string; accent: string }) {
  const rows = [
    [{ w: 34, o: 0.9 }, { w: 46, o: 0.4 }, { w: 26, o: 0.65 }],
    [{ w: 20, o: 0.4 }, { w: 58, o: 0.9 }, { w: 30, o: 0.4 }],
    [{ w: 44, o: 0.65 }, { w: 24, o: 0.9 }, { w: 40, o: 0.4 }],
    [{ w: 28, o: 0.4 }, { w: 38, o: 0.65 }],
  ]
  return (
    <Frame>
      <TermChrome accent={accent} />
      {rows.map((row, r) => {
        let x = 34
        return row.map((seg, s) => {
          const el = (
            <rect key={`${r}-${s}`} x={x} y={78 + r * 22} width={seg.w} height={9} rx={2} fill={accent} opacity={seg.o * 0.7}
              style={{ animation: `rfi-diagram-node-wake 3.6s ease-in-out ${(r * 0.3 + s * 0.15)}s infinite` }} />
          )
          x += seg.w + 8
          return el
        })
      })}
      {popup && (
        <g style={{ animation: 'rfi-diagram-node-wake 3s ease-in-out 0.6s infinite' }}>
          <rect x={112} y={112} width={104} height={54} rx={5} fill="#0c0c11" stroke={accent} strokeWidth={1.2} opacity={0.9} />
          {['trit_decide()', 'trit_vector()', 'sparse_dot()'].map((s, i) => (
            <TLabel key={i} x={122} y={128 + i * 15} size={8} accent={accent} anchor="start" op={i === 0 ? 0.95 : 0.5}>{s}</TLabel>
          ))}
        </g>
      )}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function ModuleGrid({ domains, count, cap, accent }: { domains: string[]; count: string; cap: string; accent: string }) {
  const cols = 3, cw = 62, ch = 34
  const x0 = (W - cols * cw - (cols - 1) * 10) / 2
  return (
    <Frame>
      <TLabel x={W / 2} y={40} size={11} accent={accent} op={0.95}>{count}</TLabel>
      {domains.slice(0, 6).map((d, i) => {
        const x = x0 + (i % cols) * (cw + 10), y = 62 + Math.floor(i / cols) * (ch + 12)
        return (
          <g key={i}>
            <rect x={x} y={y} width={cw} height={ch} rx={5} fill="none" stroke={accent} strokeWidth={1.2} opacity={0.55}
              style={{ animation: `rfi-diagram-node-wake 3.4s ease-in-out ${i * 0.3}s infinite` }} />
            <TLabel x={x + cw / 2} y={y + ch / 2 + 3} size={8} accent={accent}>{d}</TLabel>
          </g>
        )
      })}
      {[0, 1, 2, 3, 4].map(i => (
        <circle key={i} cx={x0 + 10 + i * 28} cy={178} r={2.2} fill={accent} opacity={0.4}
          style={{ animation: `rfi-diagram-node-wake 2.4s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <TLabel x={W / 2} y={200} size={8} accent={accent} op={0.4}>+ 40 DOMAINS</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

// ── Agents / gates / review ───────────────────────────────────────

function AgentPool({ count, gate, cap, accent }: { count: string; gate: string; cap: string; accent: string }) {
  const dots = Array.from({ length: 15 }, (_, i) => ({
    x: 46 + (i % 5) * 42, y: 52 + Math.floor(i / 5) * 34,
  }))
  return (
    <Frame>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={7} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6}
          style={{ animation: `rfi-diagram-node-wake 3s ease-in-out ${(i % 5) * 0.2 + Math.floor(i / 5) * 0.1}s infinite` }} />
      ))}
      <TLabel x={W / 2} y={158} size={10} accent={accent} op={0.95}>{count}</TLabel>
      <rect x={58} y={172} width={W - 116} height={24} rx={12} fill={accent} opacity={0.12} />
      <rect x={58} y={172} width={W - 116} height={24} rx={12} fill="none" stroke={accent} strokeWidth={1.3} opacity={0.6} />
      <TLabel x={W / 2} y={187} size={8} accent={accent}>{gate}</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Gate({ label, cap, accent }: { label: string; cap: string; accent: string }) {
  const y = H / 2 - 18
  return (
    <Frame>
      <line x1={16} y1={y} x2={W - 16} y2={y} stroke={accent} strokeWidth={1} opacity={0.18} />
      <rect x={W / 2 - 52} y={y - 32} width={104} height={64} rx={8} fill={accent} fillOpacity={0.08} stroke={accent} strokeWidth={1.6} opacity={0.8} />
      <path d={`M ${W / 2 - 12} ${y} l 8 9 l 16 -19`} fill="none" stroke={accent} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {[0, 1, 2].map(i => (
        <circle key={i} cy={y} r={3.6} fill={accent} style={{ animation: `rfi-diagram-flow 3.4s linear ${i * 1.15}s infinite`, transformBox: 'view-box', transformOrigin: '16px center' }} />
      ))}
      <TLabel x={W / 2} y={y + 52} size={8.5} accent={accent} op={0.7}>{label}</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function TwoWay({ left, right, cap, accent }: { left: string; right: string; cap: string; accent: string }) {
  const y = H / 2 - 14
  const person = (x: number) => (
    <g>
      <circle cx={x} cy={y - 26} r={11} fill="none" stroke={accent} strokeWidth={1.8} opacity={0.7} />
      <path d={`M ${x - 16} ${y + 22} Q ${x - 16} ${y - 6} ${x} ${y - 6} Q ${x + 16} ${y - 6} ${x + 16} ${y + 22}`} fill="none" stroke={accent} strokeWidth={1.8} opacity={0.7} />
    </g>
  )
  return (
    <Frame>
      {person(58)}
      <rect x={W - 80} y={y - 38} width={44} height={58} rx={6} fill="none" stroke={accent} strokeWidth={1.8} opacity={0.7} />
      {[0, 1].map(i => <circle key={i} cx={W - 68 + i * 20} cy={y - 18} r={3} fill={accent} opacity={0.8} />)}
      <line x1={W - 72} y1={y + 4} x2={W - 44} y2={y + 4} stroke={accent} strokeWidth={1.4} opacity={0.5} />
      <TLabel x={58} y={y + 42} size={8} accent={accent}>{left}</TLabel>
      <TLabel x={W - 58} y={y + 42} size={8} accent={accent}>{right}</TLabel>
      <line x1={86} y1={y - 22} x2={W - 92} y2={y - 22} stroke={accent} strokeWidth={1.2} opacity={0.4} />
      <circle r={4} cy={y - 22} fill={accent} style={{ animation: 'rfi-diagram-flow 3s ease-in-out infinite', transformBox: 'view-box', transformOrigin: '86px center' }} />
      <line x1={86} y1={y - 2} x2={W - 92} y2={y - 2} stroke={accent} strokeWidth={1.2} opacity={0.4} />
      <circle r={4} cy={y - 2} fill={accent} style={{ animation: 'rfi-diagram-flow 3s ease-in-out 1.5s infinite reverse', transformBox: 'view-box', transformOrigin: '86px center' }} />
      <path d={`M ${W / 2 - 4} ${y - 60} l 0 18 M ${W / 2 - 4} ${y - 60} l 14 5 l -14 5`} fill="none" stroke={accent} strokeWidth={1.8} strokeLinejoin="round"
        style={{ animation: 'rfi-diagram-node-wake 2.6s ease-in-out infinite' }} />
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Converge({ center, note, cap, accent }: { center: string; note: string; cap: string; accent: string }) {
  const cx = W / 2, cy = H / 2 - 16
  const sources = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    return { x: cx + Math.cos(a) * 86, y: cy + Math.sin(a) * 74, dx: cx - (cx + Math.cos(a) * 86), dy: cy - (cy + Math.sin(a) * 74) }
  })
  return (
    <Frame>
      {sources.map((s, i) => (
        <g key={i}>
          <rect x={s.x - 7} y={s.y - 5} width={14} height={10} rx={2} fill="none" stroke={accent} strokeWidth={1.3} opacity={0.5} />
          <circle cx={s.x} cy={s.y} r={3.5} fill={accent} opacity={0.8}
            style={{ ['--rfi-cluster-dx' as string]: `${s.dx}px`, ['--rfi-cluster-dy' as string]: `${s.dy}px`, animation: `rfi-diagram-cluster 4.5s ease-in-out ${i * 0.25}s infinite` }} />
        </g>
      ))}
      <circle cx={cx} cy={cy} r={22} fill={accent} opacity={0.15} />
      <circle cx={cx} cy={cy} r={22} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.8} />
      <TLabel x={cx} y={cy + 3.5} size={9} accent={accent} op={0.95}>{center}</TLabel>
      <TLabel x={cx} y={cy + 96} size={9} accent={accent} op={0.7}>{note}</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

// ── Documents / knowledge ─────────────────────────────────────────

function Doc({ title, bullets, cap, accent }: { title: string; bullets?: boolean; cap: string; accent: string }) {
  const x = 72, y = 44, w = 116, h = 158
  return (
    <Frame>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <path d={`M ${x + w - 26} ${y} l 26 26 l -26 0 z`} fill={accent} opacity={0.15} />
      <TLabel x={x + 12} y={y + 22} size={8} accent={accent} anchor="start" op={0.9}>{title}</TLabel>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <g key={i} style={{ animation: `rfi-diagram-node-wake 3.8s ease-in-out ${i * 0.3}s infinite` }}>
          {bullets && <circle cx={x + 16} cy={y + 42 + i * 19} r={2} fill={accent} opacity={0.6} />}
          <rect x={x + (bullets ? 24 : 12)} y={y + 39 + i * 19} width={w - (bullets ? 40 : 28) - (i % 3) * 12} height={5.5} rx={2} fill={accent} opacity={0.3} />
        </g>
      ))}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Graph({ stamps, cap, accent }: { stamps?: boolean; cap: string; accent: string }) {
  const nodes = [
    { x: 70, y: 62 }, { x: 168, y: 50 }, { x: 210, y: 116 }, { x: 132, y: 108 },
    { x: 58, y: 142 }, { x: 116, y: 178 }, { x: 190, y: 172 },
  ]
  const edges: [number, number][] = [[0, 1], [1, 2], [1, 3], [0, 3], [3, 4], [3, 5], [2, 6], [5, 6], [4, 5]]
  const stampGlyphs = ['+1', '0', '−1']
  return (
    <Frame>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={accent} strokeWidth={1} opacity={0.28} />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i === 3 ? 9 : 6} fill={i === 3 ? accent : 'none'} stroke={accent} strokeWidth={1.5}
          opacity={i === 3 ? 0.9 : 0.6} style={{ animation: `rfi-diagram-node-wake 3.2s ease-in-out ${i * 0.25}s infinite` }} />
      ))}
      {stamps && nodes.filter((_, i) => i % 2 === 0).map((n, i) => (
        <g key={i} style={{ animation: `rfi-diagram-node-wake 3.2s ease-in-out ${i * 0.4 + 0.5}s infinite` }}>
          <rect x={n.x + 8} y={n.y - 18} width={20} height={13} rx={3} fill="#0c0c11" stroke={accent} strokeWidth={1} opacity={0.9} />
          <TLabel x={n.x + 18} y={n.y - 8.5} size={7.5} accent={accent} op={0.95}>{stampGlyphs[i % 3]}</TLabel>
        </g>
      ))}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Hub({ center, spokes, cap, accent }: { center: string; spokes: string[]; cap: string; accent: string }) {
  const cx = W / 2, cy = H / 2 - 16
  const pts = spokes.slice(0, 5).map((s, i) => {
    const a = (i / Math.min(spokes.length, 5)) * Math.PI * 2 - Math.PI / 2
    return { s, x: cx + Math.cos(a) * 84, y: cy + Math.sin(a) * 68 }
  })
  return (
    <Frame>
      {pts.map((p, i) => (
        <g key={i}>
          <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={accent} strokeWidth={1} opacity={0.25} />
          <circle cx={p.x} cy={p.y} r={4} fill={accent}>
            <animate attributeName="opacity" values="0;0;1;0" dur="3.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          <TLabel x={p.x} y={p.y + (p.y > cy ? 18 : -10)} size={7.5} accent={accent} op={0.7}>{p.s}</TLabel>
        </g>
      ))}
      <circle cx={cx} cy={cy} r={26} fill={accent} opacity={0.12} />
      <circle cx={cx} cy={cy} r={26} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.85} />
      <TLabel x={cx} y={cy + 3.5} size={8.5} accent={accent} op={0.95}>{center}</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

// ── Domain-specific pictograms ────────────────────────────────────

function Market({ cap, accent }: { cap: string; accent: string }) {
  const pts = 'M30,150 L60,142 L85,148 L110,138 L128,144'
  const after = 'M128,144 L148,110 L172,118 L196,88 L226,96'
  return (
    <Frame>
      <line x1={128} y1={58} x2={128} y2={186} stroke={accent} strokeWidth={1} strokeDasharray="3 5" opacity={0.4} />
      <TLabel x={128} y={48} size={8} accent={accent} op={0.7}>DISCLOSURE</TLabel>
      <path d={pts} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.4} />
      <path d={after} fill="none" stroke={accent} strokeWidth={2} strokeDasharray={1} pathLength={1}
        style={{ animation: 'rfi-draw 2.4s ease-out infinite', strokeDashoffset: 1 } as React.CSSProperties} />
      <circle cx={128} cy={144} r={5} fill={accent} style={{ animation: 'rfi-diagram-node-wake 2.4s ease-in-out infinite' }} />
      <line x1={30} y1={186} x2={226} y2={186} stroke={accent} strokeWidth={1} opacity={0.25} />
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Ports({ cap, accent }: { cap: string; accent: string }) {
  const ports = [{ p: ':22', w: 92 }, { p: ':80', w: 44 }, { p: ':443', w: 38 }, { p: ':5432', w: 118 }]
  return (
    <Frame>
      <TLabel x={34} y={54} size={9} accent={accent} anchor="start" op={0.9}>ws://localhost</TLabel>
      {ports.map((pt, i) => (
        <g key={i}>
          <TLabel x={34} y={86 + i * 32} size={8.5} accent={accent} anchor="start" op={0.7}>{pt.p}</TLabel>
          <rect x={78} y={78 + i * 32} width={148} height={11} rx={3} fill="none" stroke={accent} strokeWidth={1} opacity={0.3} />
          <rect x={78} y={78 + i * 32} width={pt.w} height={11} rx={3} fill={accent} opacity={0.5}
            style={{ animation: `rfi-diagram-node-wake 2.8s ease-in-out ${i * 0.3}s infinite` }} />
          <TLabel x={232} y={87 + i * 32} size={7.5} accent={accent} anchor="end" op={0.5}>{pt.w > 80 ? 'OPEN?' : 'ms'}</TLabel>
        </g>
      ))}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Webpage({ variant, url, cap, accent }: { variant: 'tutor' | 'shop' | 'research' | 'site' | 'game' | 'pwa'; url: string; cap: string; accent: string }) {
  const x = 30, y = 42, w = W - 60, h = 158
  const inner = () => {
    switch (variant) {
      case 'tutor': return (
        <g>
          <rect x={x + 14} y={y + 34} width={100} height={64} rx={4} fill={accent} opacity={0.12} />
          <rect x={x + 14} y={y + 34} width={100} height={64} rx={4} fill="none" stroke={accent} strokeWidth={1.2} opacity={0.5} />
          <TLabel x={x + 64} y={y + 60} size={9} accent={accent} op={0.9}>A &rarr; B</TLabel>
          <TLabel x={x + 64} y={y + 78} size={7.5} accent={accent} op={0.55}>LESSON 12</TLabel>
          {[0, 1, 2].map(i => <rect key={i} x={x + 126} y={y + 38 + i * 20} width={58 - i * 10} height={7} rx={2} fill={accent} opacity={0.35}
            style={{ animation: `rfi-diagram-node-wake 3.4s ease-in-out ${i * 0.4}s infinite` }} />)}
          <rect x={x + 126} y={y + 104} width={58} height={18} rx={9} fill={accent} opacity={0.25} />
          <TLabel x={x + 155} y={y + 116} size={7} accent={accent} op={0.9}>BOOK</TLabel>
        </g>
      )
      case 'shop': return (
        <g>
          {/* an e-bike, not an abstract card: wheels, frame, handlebar */}
          <circle cx={x + 62} cy={y + 96} r={22} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.7} />
          <circle cx={x + 138} cy={y + 96} r={22} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.7} />
          <path d={`M ${x + 62} ${y + 96} L ${x + 92} ${y + 58} L ${x + 126} ${y + 58} L ${x + 138} ${y + 96} L ${x + 100} ${y + 96} L ${x + 92} ${y + 58} M ${x + 100} ${y + 96} L ${x + 62} ${y + 96}`}
            fill="none" stroke={accent} strokeWidth={1.6} opacity={0.8} strokeLinejoin="round" />
          <path d={`M ${x + 126} ${y + 58} l 8 -10 l 8 3`} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.8} />
          <path d={`M ${x + 96} ${y + 74} l 8 0 l -5 9 l 8 0 l -11 14 l 4 -11 l -8 0 z`} fill={accent} opacity={0.85}
            style={{ animation: 'rfi-diagram-node-wake 2.2s ease-in-out infinite' }} />
          <rect x={x + 168} y={y + 44} width={26} height={14} rx={7} fill={accent} opacity={0.25} />
          <TLabel x={x + 181} y={y + 54} size={7} accent={accent} op={0.9}>&euro;</TLabel>
        </g>
      )
      case 'research': return (
        <g>
          {[0, 1, 2].map(i => <rect key={i} x={x + 14} y={y + 36 + i * 24} width={92 - i * 16} height={8} rx={2} fill={accent} opacity={0.4}
            style={{ animation: `rfi-diagram-node-wake 3.4s ease-in-out ${i * 0.35}s infinite` }} />)}
          <rect x={x + 118} y={y + 32} width={72} height={90} rx={5} fill="none" stroke={accent} strokeWidth={1.2} opacity={0.5} />
          <TLabel x={x + 154} y={y + 48} size={7.5} accent={accent} op={0.8}>JARVIS</TLabel>
          {[0, 1, 2].map(i => <rect key={i} x={x + 126} y={y + 58 + i * 16} width={56 - (i % 2) * 14} height={6} rx={2} fill={accent} opacity={0.3}
            style={{ animation: `rfi-diagram-node-wake 3s ease-in-out ${0.4 + i * 0.3}s infinite` }} />)}
        </g>
      )
      case 'site': return (
        <g>
          <TLabel x={x + w / 2} y={y + 56} size={10} accent={accent} op={0.9}>RETHINK THE OBVIOUS.</TLabel>
          {[0, 1, 2].map(i => (
            <rect key={i} x={x + 22 + i * 56} y={y + 74} width={44} height={30} rx={4} fill="none" stroke={accent} strokeWidth={1.1} opacity={0.5}
              style={{ animation: `rfi-diagram-node-wake 3.2s ease-in-out ${i * 0.35}s infinite` }} />
          ))}
          <rect x={x + 48} y={y + 112} width={100} height={14} rx={4} fill={accent} opacity={0.14} />
          <TLabel x={x + 98} y={y + 122} size={7} accent={accent} op={0.85}>A MODAL LIKE THIS ONE</TLabel>
        </g>
      )
      case 'game': return (
        <g>
          {/* a pixel invader */}
          {[[2, 0], [4, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [0, 2], [2, 2], [4, 2], [6, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [1, 4], [5, 4]].map(([px, py], i) => (
            <rect key={i} x={x + 62 + px * 10} y={y + 34 + py * 10} width={9} height={9} fill={accent} opacity={0.75}
              style={{ animation: `rfi-diagram-node-wake 1.8s step-end ${(px % 2) * 0.9}s infinite` }} />
          ))}
          <rect x={x + 92} y={y + 108} width={22} height={9} fill={accent} opacity={0.9} />
          <rect x={x + 100} y={y + 101} width={6} height={7} fill={accent} opacity={0.9} />
          <TLabel x={x + w / 2} y={y + 136} size={7.5} accent={accent} op={0.6}>1 PLAYABLE &middot; 2 IN THE README</TLabel>
        </g>
      )
      case 'pwa': return (
        <g>
          <TLabel x={x + w / 2 - 40} y={y + 62} size={11} accent={accent} op={0.9}>DE</TLabel>
          <TLabel x={x + w / 2 + 40} y={y + 62} size={11} accent={accent} op={0.9}>&#x0641;&#x0627;</TLabel>
          <line x1={x + w / 2 - 22} y1={y + 58} x2={x + w / 2 + 22} y2={y + 58} stroke={accent} strokeWidth={1.3} opacity={0.5} />
          <circle r={3.5} cy={y + 58} fill={accent} style={{ animation: 'rfi-diagram-pingpong 2.6s ease-in-out infinite', ['--rfi-pp-dist' as string]: '44px', transformBox: 'view-box', transformOrigin: `${x + w / 2 - 22}px center` }} />
          {[0, 1, 2].map(i => <rect key={i} x={x + 34} y={y + 86 + i * 18} width={w - 68 - (i % 2) * 30} height={7} rx={2} fill={accent} opacity={0.3}
            style={{ animation: `rfi-diagram-node-wake 3.4s ease-in-out ${i * 0.35}s infinite` }} />)}
          <TLabel x={x + w / 2} y={y + 148} size={7} accent={accent} op={0.55}>NO ADS &middot; NO PAYWALL &middot; B2</TLabel>
        </g>
      )
    }
  }
  return (
    <Frame>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <line x1={x} y1={y + 20} x2={x + w} y2={y + 20} stroke={accent} strokeWidth={1} opacity={0.3} />
      {[0, 1, 2].map(i => <circle key={i} cx={x + 12 + i * 10} cy={y + 10} r={2.4} fill={accent} opacity={0.5} />)}
      <TLabel x={x + w - 10} y={y + 13.5} size={7} accent={accent} anchor="end" op={0.55}>{url}</TLabel>
      {inner()}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Fork({ upstream, cap, accent }: { upstream: string; cap: string; accent: string }) {
  const cx = W / 2, oy = 54
  return (
    <Frame>
      <circle cx={cx} cy={oy} r={12} fill={accent} />
      <TLabel x={cx} y={oy - 22} size={8} accent={accent} op={0.85}>{upstream}</TLabel>
      <path d={`M ${cx} ${oy + 12} L ${cx + 56} ${oy + 64} L ${cx + 56} ${H - 66}`} fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" strokeDasharray="10 6" opacity={0.9}
        style={{ animation: 'rfi-diagram-march 1.4s linear infinite' }} />
      <circle cx={cx + 56} cy={H - 66} r={7} fill={accent} opacity={0.9} style={{ animation: 'rfi-diagram-node-wake 2.2s ease-in-out infinite' }} />
      <TLabel x={cx + 56} y={H - 48} size={7} accent={accent} op={0.6}>UPSTREAM LIVES ON</TLabel>
      <path d={`M ${cx} ${oy + 12} L ${cx - 56} ${oy + 64} L ${cx - 56} ${H - 96}`} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 8" opacity={0.35} />
      <circle cx={cx - 56} cy={H - 96} r={10} fill="none" stroke={accent} strokeWidth={2} opacity={0.45} />
      <line x1={cx - 56 - 12} y1={H - 96} x2={cx - 56 + 12} y2={H - 96} stroke={accent} strokeWidth={2} opacity={0.35} />
      <TLabel x={cx - 56} y={H - 74} size={7} accent={accent} op={0.6}>OUR COPY: FROZEN</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Bundle({ items, cap, accent }: { items: string[]; cap: string; accent: string }) {
  const x = 62, y = 56, w = 136, h = 128
  return (
    <Frame>
      <path d={`M ${x} ${y + 14} l 0 -14 l 44 0 l 10 12 l ${w - 54} 0 l 0 2`} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <rect x={x} y={y + 12} width={w} height={h} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      {items.slice(0, 4).map((it, i) => (
        <g key={i} style={{ animation: `rfi-diagram-node-wake 3.6s ease-in-out ${i * 0.35}s infinite` }}>
          <TLabel x={x + 16} y={y + 40 + i * 24} size={8.5} accent={accent} anchor="start" op={it.includes('✕') ? 0.45 : 0.8}>{it}</TLabel>
        </g>
      ))}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Decompile({ from, to, cap, accent }: { from: string; to: string; cap: string; accent: string }) {
  return (
    <Frame>
      <rect x={30} y={72} width={76} height={92} rx={6} fill={accent} opacity={0.16} />
      <rect x={30} y={72} width={76} height={92} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.7} />
      {[0, 1, 2, 3].map(i => (
        <TLabel key={i} x={68} y={96 + i * 18} size={7.5} accent={accent} op={0.5}>{'█▓░█░▓'}</TLabel>
      ))}
      <TLabel x={68} y={186} size={7.5} accent={accent} op={0.75}>{from}</TLabel>
      <path d={`M 116 118 l 26 0 m -8 -7 l 8 7 l -8 7`} fill="none" stroke={accent} strokeWidth={1.8} strokeLinecap="round"
        style={{ animation: 'rfi-diagram-node-wake 2.2s ease-in-out infinite' }} />
      <rect x={154} y={72} width={76} height={92} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.7} />
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={164} y={90 + i * 18} width={56 - (i % 2) * 18} height={6} rx={2} fill={accent} opacity={0.45}
          style={{ animation: `rfi-diagram-node-wake 3.2s ease-in-out ${i * 0.3}s infinite` }} />
      ))}
      <TLabel x={192} y={186} size={7.5} accent={accent} op={0.75}>{to}</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Quantize({ cap, accent }: { cap: string; accent: string }) {
  const floats = ['0.7314', '−0.1189', '0.9822', '−0.4407', '0.0021']
  const trits = ['+1', '0', '+1', '−1', '0']
  return (
    <Frame>
      {floats.map((f, i) => (
        <TLabel key={i} x={70} y={64 + i * 28} size={9} accent={accent} op={0.55}>{f}</TLabel>
      ))}
      <line x1={112} y1={56} x2={112} y2={188} stroke={accent} strokeWidth={1} opacity={0.2} />
      {trits.map((t, i) => (
        <g key={i}>
          <path d={`M 120 ${60 + i * 28} l 22 0`} stroke={accent} strokeWidth={1.2} opacity={0.4}
            style={{ animation: `rfi-diagram-node-wake 2.8s ease-in-out ${i * 0.25}s infinite` }} />
          <rect x={158} y={49 + i * 28} width={38} height={19} rx={4} fill={t === '0' ? 'none' : accent} fillOpacity={t === '0' ? 0 : 0.16}
            stroke={accent} strokeWidth={1.3} opacity={t === '0' ? 0.35 : 0.85}
            style={{ animation: `rfi-diagram-node-wake 2.8s ease-in-out ${i * 0.25 + 0.3}s infinite` }} />
          <TLabel x={177} y={62.5 + i * 28} size={9.5} accent={accent} op={t === '0' ? 0.45 : 0.95}>{t}</TLabel>
        </g>
      ))}
      <TLabel x={70} y={212} size={7.5} accent={accent} op={0.5}>FLOAT32</TLabel>
      <TLabel x={177} y={212} size={7.5} accent={accent} op={0.5}>{'{−1 0 +1}'}</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Sparse({ cap, accent }: { cap: string; accent: string }) {
  const grid = [
    [1, 0, -1, 0, 1], [0, 0, 1, 0, 0], [-1, 1, 0, 0, -1], [0, 0, 0, 1, 0], [1, 0, -1, 0, 1],
  ]
  return (
    <Frame>
      {grid.map((row, r) => row.map((v, c) => {
        const x = 58 + c * 30, y = 52 + r * 30
        return v === 0
          ? <rect key={`${r}${c}`} x={x} y={y} width={22} height={22} rx={4} fill="none" stroke={accent} strokeWidth={1} opacity={0.14} strokeDasharray="3 3" />
          : (
            <g key={`${r}${c}`}>
              <rect x={x} y={y} width={22} height={22} rx={4} fill={accent} opacity={0.14} />
              <rect x={x} y={y} width={22} height={22} rx={4} fill="none" stroke={accent} strokeWidth={1.3} opacity={0.7}
                style={{ animation: `rfi-diagram-node-wake 3s ease-in-out ${(r + c) * 0.15}s infinite` }} />
              <TLabel x={x + 11} y={y + 15} size={8.5} accent={accent} op={0.9}>{v > 0 ? '+1' : '−1'}</TLabel>
            </g>
          )
      }))}
      <TLabel x={W / 2} y={216} size={7.5} accent={accent} op={0.55}>DASHED = ZERO = NEVER COMPUTED</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Nodes({ labels, cap, accent }: { labels: string[]; cap: string; accent: string }) {
  const pts = [{ x: 62, y: 74 }, { x: 196, y: 68 }, { x: 128, y: 168 }]
  const msgs: [number, number, string][] = [[0, 1, 'spawn'], [1, 2, 'send'], [2, 0, 'await']]
  return (
    <Frame>
      {msgs.map(([a, b, m], i) => (
        <g key={i}>
          <line x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} stroke={accent} strokeWidth={1.1} opacity={0.3} />
          <TLabel x={(pts[a].x + pts[b].x) / 2 + (i === 2 ? -26 : 12)} y={(pts[a].y + pts[b].y) / 2} size={7.5} accent={accent} op={0.65}>{m}</TLabel>
          <circle r={3.5} fill={accent}>
            <animateMotion dur="2.8s" begin={`${i * 0.9}s`} repeatCount="indefinite"
              path={`M ${pts[a].x} ${pts[a].y} L ${pts[b].x} ${pts[b].y}`} />
            <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" begin={`${i * 0.9}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {pts.map((p, i) => (
        <g key={i}>
          <rect x={p.x - 26} y={p.y - 16} width={52} height={32} rx={5} fill="#0c0c11" stroke={accent} strokeWidth={1.4} opacity={0.85} />
          <TLabel x={p.x} y={p.y + 3.5} size={7.5} accent={accent} op={0.85}>{labels[i] ?? `NODE ${i}`}</TLabel>
        </g>
      ))}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Bridge({ left, right, mid, cap, accent }: { left: string; right: string; mid: string; cap: string; accent: string }) {
  const y = H / 2 - 16, bw = 78, bh = 96
  return (
    <Frame>
      {[{ x: 24, l: left }, { x: W - 24 - bw, l: right }].map((b, side) => (
        <g key={side}>
          <rect x={b.x} y={y - bh / 2} width={bw} height={bh} rx={8} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
          <TLabel x={b.x + bw / 2} y={y - bh / 2 + 20} size={7.5} accent={accent} op={0.85}>{b.l}</TLabel>
          {[0, 1, 2].map(i => (
            <rect key={i} x={b.x + 12} y={y - 6 + i * 14} width={bw - 24 - (i % 2) * 12} height={5} rx={2} fill={accent} opacity={0.28} />
          ))}
        </g>
      ))}
      <line x1={24 + bw + 6} y1={y} x2={W - 30 - bw} y2={y} stroke={accent} strokeWidth={1.4} strokeDasharray="4 4" opacity={0.5} />
      <rect x={W / 2 - 26} y={y - 11} width={52} height={22} rx={11} fill="#0c0c11" stroke={accent} strokeWidth={1.3} opacity={0.95} />
      <TLabel x={W / 2} y={y + 3.5} size={7.5} accent={accent} op={0.95}>{mid}</TLabel>
      <rect x={W / 2 - 5} y={y + 24} width={10} height={10} rx={2} fill={accent}
        style={{ ['--rfi-pp-dist' as string]: `${(W / 2 - 30 - bw) - 12}px`, animation: 'rfi-diagram-pingpong 2.8s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Chip({ cap, accent }: { cap: string; accent: string }) {
  const cx = W / 2, cy = H / 2 - 14, s = 62
  return (
    <Frame>
      <TLabel x={cx} y={44} size={8} accent={accent} op={0.7}>module tern_alu(...)</TLabel>
      <line x1={cx} y1={52} x2={cx} y2={cy - s / 2 - 8} stroke={accent} strokeWidth={1.2} strokeDasharray="2 4" opacity={0.4} />
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={6} fill={accent} opacity={0.12} />
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={6} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.8} />
      <TLabel x={cx} y={cy + 3.5} size={8.5} accent={accent} op={0.95}>BET</TLabel>
      {Array.from({ length: 5 }, (_, i) => {
        const off = -24 + i * 12
        return (
          <g key={i}>
            <line x1={cx - s / 2 - 16} y1={cy + off} x2={cx - s / 2} y2={cy + off} stroke={accent} strokeWidth={1.3} opacity={0.5}
              style={{ animation: `rfi-diagram-node-wake 2.6s ease-in-out ${i * 0.2}s infinite` }} />
            <line x1={cx + s / 2} y1={cy + off} x2={cx + s / 2 + 16} y2={cy + off} stroke={accent} strokeWidth={1.3} opacity={0.5}
              style={{ animation: `rfi-diagram-node-wake 2.6s ease-in-out ${i * 0.2 + 0.4}s infinite` }} />
          </g>
        )
      })}
      <TLabel x={cx} y={cy + s / 2 + 24} size={7.5} accent={accent} op={0.6}>VERILOG-2001 &rarr; FPGA</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Checks({ items, cap, accent }: { items: string[]; cap: string; accent: string }) {
  const x = 48, y = 52, w = 164
  return (
    <Frame>
      <rect x={x} y={y} width={w} height={items.length * 34 + 26} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.55} />
      {items.slice(0, 4).map((it, i) => {
        const cy = y + 30 + i * 34
        return (
          <g key={i}>
            <rect x={x + 14} y={cy - 8} width={16} height={16} rx={3} fill="none" stroke={accent} strokeWidth={1.3} opacity={0.5} />
            <path d={`M ${x + 18} ${cy} l 4 4 l 7 -9`} fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={1} pathLength={1}
              style={{ animation: `rfi-draw 0.5s ease-out ${0.5 + i * 0.6}s both, rfi-diagram-node-wake 3.6s ease-in-out ${1.4 + i * 0.6}s infinite` } as React.CSSProperties} />
            <TLabel x={x + 40} y={cy + 3.5} size={7.5} accent={accent} anchor="start" op={0.75}>{it}</TLabel>
          </g>
        )
      })}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Trits({ cap, accent }: { cap: string; accent: string }) {
  const cells = ['−1', '0', '+1']
  return (
    <Frame>
      {cells.map((c, i) => (
        <g key={i}>
          <rect x={44 + i * 62} y={66} width={48} height={48} rx={8} fill={i === 1 ? 'none' : accent} fillOpacity={i === 1 ? 0 : 0.14}
            stroke={accent} strokeWidth={1.6} opacity={i === 1 ? 0.45 : 0.85}
            style={{ animation: `rfi-diagram-node-wake 2.8s ease-in-out ${i * 0.45}s infinite` }} />
          <TLabel x={68 + i * 62} y={96} size={14} accent={accent} op={i === 1 ? 0.55 : 0.95}>{c}</TLabel>
        </g>
      ))}
      <TLabel x={W / 2} y={140} size={8} accent={accent} op={0.6}>1 TRIT</TLabel>
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={40 + i * 20} y={156} width={16} height={16} rx={3} fill="none" stroke={accent} strokeWidth={1.2} opacity={0.5}
          style={{ animation: `rfi-diagram-node-wake 3s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
      <TLabel x={W / 2} y={192} size={8} accent={accent} op={0.6}>9 TRITS = 1 TRYTE</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Twin({ distributed, cap, accent }: { distributed?: boolean; cap: string; accent: string }) {
  const lanes = [W / 2 - 56, W / 2 + 56]
  const steps = [-58, -18, 22]
  return (
    <Frame>
      <line x1={W / 2} y1={34} x2={W / 2} y2={70} stroke={accent} strokeWidth={1.2} strokeDasharray="2 5" opacity={0.3} />
      <TLabel x={W / 2} y={26} size={8.5} accent={accent} op={0.7}>SAME INPUT</TLabel>
      {lanes.map((lx, li) => (
        <g key={li}>
          {distributed && (
            <g>
              <rect x={lx - 30} y={54} width={60} height={16} rx={4} fill="none" stroke={accent} strokeWidth={1.2} opacity={0.5} />
              <TLabel x={lx} y={65.5} size={7} accent={accent} op={0.7}>{li === 0 ? 'MACHINE A' : 'MACHINE B'}</TLabel>
            </g>
          )}
          <line x1={lx} y1={distributed ? 70 : 56} x2={lx} y2={196} stroke={accent} strokeWidth={1.2} opacity={0.25} />
          {steps.map((sy, si) => (
            <rect key={si} x={lx - 14} y={H / 2 + sy - 12} width={28} height={18} rx={4} fill="none" stroke={accent} strokeWidth={1.4}
              style={{ animation: `rfi-diagram-node-wake 3s ease-in-out ${si * 0.5}s infinite` }} />
          ))}
          <circle cx={lx} cy={H / 2 + 52} r={10} fill="none" stroke={accent} strokeWidth={1.8} />
          <path d={`M ${lx - 4.5} ${H / 2 + 52} l 3 3.5 l 6 -7.5`} fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={1} pathLength={1} style={{ animation: 'rfi-draw 0.5s ease-out 1.6s both' } as React.CSSProperties} />
        </g>
      ))}
      <TLabel x={W / 2} y={H / 2 + 82} size={8} accent={accent} op={0.7}>= IDENTICAL RESULT</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Plug({ cap, accent }: { cap: string; accent: string }) {
  const y = H / 2 - 14
  return (
    <Frame>
      <rect x={34} y={y - 44} width={92} height={88} rx={8} fill={accent} opacity={0.1} />
      <rect x={34} y={y - 44} width={92} height={88} rx={8} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.7} />
      <TLabel x={80} y={y - 22} size={7.5} accent={accent} op={0.85}>MOE-13</TLabel>
      <rect x={126} y={y - 16} width={12} height={12} fill="#0c0c11" stroke={accent} strokeWidth={1.3} />
      <rect x={126} y={y + 6} width={12} height={12} fill="#0c0c11" stroke={accent} strokeWidth={1.3} />
      <g style={{ ['--rfi-pp-dist' as string]: '-28px', animation: 'rfi-diagram-pingpong 3s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x={176} y={y - 26} width={54} height={52} rx={6} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.75} />
        <line x1={176} y1={y - 10} x2={162} y2={y - 10} stroke={accent} strokeWidth={3} opacity={0.8} />
        <line x1={176} y1={y + 12} x2={162} y2={y + 12} stroke={accent} strokeWidth={3} opacity={0.8} />
        <TLabel x={203} y={y + 2} size={7} accent={accent} op={0.85}>PLUGIN</TLabel>
      </g>
      <TLabel x={W / 2} y={y + 66} size={7.5} accent={accent} op={0.6}>STABLE CONTRACT, BOTH SIDES</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Moon({ cap, accent }: { cap: string; accent: string }) {
  const phases = [0, 0.25, 0.5, 0.75, 1]
  return (
    <Frame>
      {phases.map((p, i) => {
        const cx = 44 + i * 43, r = 15
        return (
          <g key={i} style={{ animation: `rfi-diagram-node-wake 4s ease-in-out ${i * 0.5}s infinite` }}>
            <circle cx={cx} cy={92} r={r} fill="none" stroke={accent} strokeWidth={1.4} opacity={0.6} />
            {p > 0 && <path d={`M ${cx} ${92 - r} A ${r} ${r} 0 0 1 ${cx} ${92 + r} A ${r * (1 - p * 2 < 0 ? -(1 - p * 2) : 1 - p * 2)} ${r} 0 0 ${p < 0.5 ? 0 : 1} ${cx} ${92 - r}`}
              fill={accent} opacity={0.55} />}
          </g>
        )
      })}
      <rect x={62} y={136} width={136} height={54} rx={6} fill="none" stroke={accent} strokeWidth={1.3} opacity={0.5} />
      <line x1={62} y1={152} x2={198} y2={152} stroke={accent} strokeWidth={1} opacity={0.3} />
      <TLabel x={130} y={148} size={7.5} accent={accent} op={0.8}>calendar.ics</TLabel>
      {[0, 1].map(i => <rect key={i} x={74} y={160 + i * 12} width={100 - i * 30} height={6} rx={2} fill={accent} opacity={0.3} />)}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Triangle({ cap, accent }: { cap: string; accent: string }) {
  const top = { x: W / 2, y: 52 }, bl = { x: 56, y: 182 }, br = { x: W - 56, y: 182 }
  const dots = [[0.5, 0.3, 0.2], [0.2, 0.5, 0.3], [0.33, 0.33, 0.34], [0.7, 0.2, 0.1], [0.15, 0.25, 0.6], [0.4, 0.45, 0.15]]
  return (
    <Frame>
      <path d={`M ${top.x} ${top.y} L ${bl.x} ${bl.y} L ${br.x} ${br.y} Z`} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      {[0.25, 0.5, 0.75].map((f, i) => (
        <g key={i} opacity={0.18}>
          <line x1={top.x + (bl.x - top.x) * f} y1={top.y + (bl.y - top.y) * f} x2={top.x + (br.x - top.x) * f} y2={top.y + (br.y - top.y) * f} stroke={accent} strokeWidth={1} />
        </g>
      ))}
      {dots.map(([a, b, c], i) => {
        const x = top.x * a + bl.x * b + br.x * c, y = top.y * a + bl.y * b + br.y * c
        return <circle key={i} cx={x} cy={y} r={4} fill={accent} opacity={0.75}
          style={{ animation: `rfi-diagram-node-wake 3s ease-in-out ${i * 0.3}s infinite` }} />
      })}
      <TLabel x={top.x} y={top.y - 10} size={7.5} accent={accent} op={0.6}>A</TLabel>
      <TLabel x={bl.x - 12} y={bl.y + 10} size={7.5} accent={accent} op={0.6}>B</TLabel>
      <TLabel x={br.x + 12} y={br.y + 10} size={7.5} accent={accent} op={0.6}>C</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Zones({ cap, accent }: { cap: string; accent: string }) {
  return (
    <Frame>
      <rect x={34} y={52} width={192} height={140} rx={7} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.6} />
      <rect x={42} y={60} width={86} height={124} rx={4} fill={accent} opacity={0.1} />
      <rect x={42} y={60} width={86} height={124} rx={4} fill="none" stroke={accent} strokeWidth={1.1} opacity={0.4} strokeDasharray="4 4" />
      <rect x={134} y={60} width={84} height={58} rx={4} fill="none" stroke={accent} strokeWidth={1.1} opacity={0.4} strokeDasharray="4 4" />
      <rect x={134} y={124} width={84} height={60} rx={4} fill="none" stroke={accent} strokeWidth={1.1} opacity={0.4} strokeDasharray="4 4" />
      <g style={{ ['--rfi-pp-dist' as string]: '88px', animation: 'rfi-diagram-pingpong 3.4s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x={52} y={76} width={62} height={44} rx={4} fill={accent} opacity={0.35} />
        <line x1={52} y1={86} x2={114} y2={86} stroke={accent} strokeWidth={1.4} opacity={0.7} />
      </g>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Share({ cap, accent }: { cap: string; accent: string }) {
  const cy = H / 2 - 10
  const person = (x: number) => (
    <g>
      <circle cx={x} cy={cy - 34} r={13} fill="none" stroke={accent} strokeWidth={2} opacity={0.7} />
      <path d={`M ${x - 20} ${cy + 26} Q ${x - 20} ${cy - 8} ${x} ${cy - 8} Q ${x + 20} ${cy - 8} ${x + 20} ${cy + 26}`} fill="none" stroke={accent} strokeWidth={2} opacity={0.7} />
    </g>
  )
  return (
    <Frame>
      {person(56)}
      {person(W - 56)}
      <line x1={90} y1={cy - 4} x2={W - 90} y2={cy - 4} stroke={accent} strokeWidth={1.2} strokeDasharray="3 6" opacity={0.35} />
      <circle r={9} fill={accent} cy={cy - 4}
        style={{ animation: 'rfi-diagram-flow 3.2s ease-in-out infinite', transformBox: 'view-box', transformOrigin: '90px center' }} />
      <TLabel x={W / 2} y={cy + 52} size={8.5} accent={accent} op={0.6}>SURPLUS &rarr; NEED</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Waves({ cap, accent }: { cap: string; accent: string }) {
  const cx = 62, cy = H / 2 - 12
  return (
    <Frame>
      <rect x={cx - 8} y={cy - 26} width={16} height={52} rx={4} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.7} />
      <circle cx={cx} cy={cy - 14} r={2.5} fill={accent} opacity={0.7} />
      {[0, 1, 2].map(i => (
        <path key={i} d={`M ${cx + 18 + i * 22} ${cy - 26 - i * 8} A ${30 + i * 22} ${30 + i * 22} 0 0 1 ${cx + 18 + i * 22} ${cy + 26 + i * 8}`}
          fill="none" stroke={accent} strokeWidth={1.4} opacity={0.5}
          style={{ animation: `rfi-diagram-node-wake 2.4s ease-in-out ${i * 0.35}s infinite` }} />
      ))}
      {/* the person the WiFi field reads - pose skeleton, not a camera image */}
      <g style={{ animation: 'rfi-diagram-node-wake 3s ease-in-out 0.8s infinite' }}>
        <circle cx={196} cy={cy - 34} r={9} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.8} />
        <path d={`M 196 ${cy - 25} L 196 ${cy + 6} M 178 ${cy - 12} L 214 ${cy - 12} M 196 ${cy + 6} L 184 ${cy + 32} M 196 ${cy + 6} L 208 ${cy + 32}`}
          fill="none" stroke={accent} strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
        {[[196, cy - 12], [196, cy + 6]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.5} fill={accent} />)}
      </g>
      <TLabel x={W / 2} y={cy + 62} size={7.5} accent={accent} op={0.6}>NO CAMERA &mdash; SIGNAL ONLY</TLabel>
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Empty({ cap, accent }: { cap: string; accent: string }) {
  return (
    <Frame>
      <rect x={70} y={92} width={120} height={92} rx={6} fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="5 5" opacity={0.35} />
      <TLabel x={W / 2} y={70} size={8.5} accent={accent} op={0.6}>$ git log</TLabel>
      <TLabel x={W / 2} y={142} size={8} accent={accent} op={0.4}>(nothing here)</TLabel>
      <circle cx={W / 2} cy={162} r={3.5} fill={accent} opacity={0.35} style={{ animation: 'rfi-diagram-echo 4s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function Cloud({ endpoints, url, cap, accent }: { endpoints: string[]; url: string; cap: string; accent: string }) {
  return (
    <Frame>
      <path d="M 90 78 a 22 22 0 0 1 42 -10 a 18 18 0 0 1 30 14 a 14 14 0 0 1 -6 27 l -74 0 a 19 19 0 0 1 8 -31"
        fill="none" stroke={accent} strokeWidth={1.6} opacity={0.7} />
      <TLabel x={W / 2} y={94} size={7.5} accent={accent} op={0.85}>{url}</TLabel>
      {endpoints.slice(0, 3).map((e, i) => (
        <g key={i} style={{ animation: `rfi-diagram-node-wake 3.4s ease-in-out ${i * 0.4}s infinite` }}>
          <line x1={W / 2 - 50 + i * 50} y1={122} x2={W / 2 - 50 + i * 50} y2={142} stroke={accent} strokeWidth={1.2} opacity={0.4} />
          <rect x={W / 2 - 50 + i * 50 - 36} y={144} width={72} height={20} rx={10} fill={accent} opacity={0.1} />
          <rect x={W / 2 - 50 + i * 50 - 36} y={144} width={72} height={20} rx={10} fill="none" stroke={accent} strokeWidth={1.1} opacity={0.5} />
          <TLabel x={W / 2 - 50 + i * 50} y={157} size={6.5} accent={accent} op={0.8}>{e}</TLabel>
        </g>
      ))}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

function TernaryNet({ cap, accent }: { cap: string; accent: string }) {
  const layers = [72, 130, 188]
  const counts = [3, 4, 3]
  const weights = ['+1', '−1', '0', '+1']
  return (
    <Frame>
      {layers.slice(0, -1).map((x, li) => {
        const from = counts[li] === 4 ? [-64, -21, 21, 64] : [-42, 0, 42]
        const to = counts[li + 1] === 4 ? [-64, -21, 21, 64] : [-42, 0, 42]
        return from.flatMap((fy, fi) => to.map((ty, ti) => {
          const zero = (fi + ti + li) % 4 === 0
          return (
            <line key={`${li}-${fi}-${ti}`} x1={x} y1={H / 2 - 16 + fy} x2={layers[li + 1]} y2={H / 2 - 16 + ty}
              stroke={accent} strokeWidth={zero ? 0.5 : 1} opacity={zero ? 0.06 : 0.25} strokeDasharray={zero ? '2 4' : undefined} />
          )
        }))
      })}
      {layers.map((x, li) => Array.from({ length: counts[li] }, (_, ni) => {
        const spread = counts[li] === 4 ? [-64, -21, 21, 64] : [-42, 0, 42]
        return <circle key={`${li}-${ni}`} cx={x} cy={H / 2 - 16 + spread[ni]} r={6} fill="none" stroke={accent} strokeWidth={1.4}
          style={{ animation: `rfi-diagram-node-wake 2.4s ease-in-out ${(li * 0.35 + ni * 0.12)}s infinite` }} />
      }))}
      {weights.map((w, i) => (
        <g key={i}>
          <rect x={92 + i * 24 - 10} y={H / 2 + 66} width={20} height={14} rx={3} fill={w === '0' ? 'none' : accent} fillOpacity={w === '0' ? 0 : 0.15}
            stroke={accent} strokeWidth={1} opacity={w === '0' ? 0.3 : 0.7} />
          <TLabel x={92 + i * 24} y={H / 2 + 76.5} size={7.5} accent={accent} op={w === '0' ? 0.4 : 0.9}>{w}</TLabel>
        </g>
      ))}
      <Cap text={cap} accent={accent} />
    </Frame>
  )
}

// ── Dispatcher ────────────────────────────────────────────────────

export function SystemDiagram({ spec, accent }: { spec: DiagramSpec; accent: string }) {
  switch (spec.kind) {
    case 'stack': return <Stack layers={spec.layers} cap={spec.cap} accent={accent} />
    case 'pipeline': return <Pipeline stages={spec.stages} cap={spec.cap} accent={accent} />
    case 'terminal': return <Terminal lines={spec.lines} cap={spec.cap} accent={accent} />
    case 'chat': return <Chat lines={spec.lines} badge={spec.badge} cap={spec.cap} accent={accent} />
    case 'code-highlight': return <CodeHighlight popup={spec.popup} cap={spec.cap} accent={accent} />
    case 'module-grid': return <ModuleGrid domains={spec.domains} count={spec.count} cap={spec.cap} accent={accent} />
    case 'agent-pool': return <AgentPool count={spec.count} gate={spec.gate} cap={spec.cap} accent={accent} />
    case 'gate': return <Gate label={spec.label} cap={spec.cap} accent={accent} />
    case 'two-way': return <TwoWay left={spec.left} right={spec.right} cap={spec.cap} accent={accent} />
    case 'converge': return <Converge center={spec.center} note={spec.note} cap={spec.cap} accent={accent} />
    case 'doc': return <Doc title={spec.title} bullets={spec.bullets} cap={spec.cap} accent={accent} />
    case 'graph': return <Graph stamps={spec.stamps} cap={spec.cap} accent={accent} />
    case 'hub': return <Hub center={spec.center} spokes={spec.spokes} cap={spec.cap} accent={accent} />
    case 'market': return <Market cap={spec.cap} accent={accent} />
    case 'ports': return <Ports cap={spec.cap} accent={accent} />
    case 'webpage': return <Webpage variant={spec.variant} url={spec.url} cap={spec.cap} accent={accent} />
    case 'fork': return <Fork upstream={spec.upstream} cap={spec.cap} accent={accent} />
    case 'bundle': return <Bundle items={spec.items} cap={spec.cap} accent={accent} />
    case 'decompile': return <Decompile from={spec.from} to={spec.to} cap={spec.cap} accent={accent} />
    case 'quantize': return <Quantize cap={spec.cap} accent={accent} />
    case 'sparse': return <Sparse cap={spec.cap} accent={accent} />
    case 'nodes': return <Nodes labels={spec.labels} cap={spec.cap} accent={accent} />
    case 'bridge': return <Bridge left={spec.left} right={spec.right} mid={spec.mid} cap={spec.cap} accent={accent} />
    case 'chip': return <Chip cap={spec.cap} accent={accent} />
    case 'checks': return <Checks items={spec.items} cap={spec.cap} accent={accent} />
    case 'trits': return <Trits cap={spec.cap} accent={accent} />
    case 'twin': return <Twin distributed={spec.distributed} cap={spec.cap} accent={accent} />
    case 'plug': return <Plug cap={spec.cap} accent={accent} />
    case 'moon': return <Moon cap={spec.cap} accent={accent} />
    case 'triangle': return <Triangle cap={spec.cap} accent={accent} />
    case 'zones': return <Zones cap={spec.cap} accent={accent} />
    case 'share': return <Share cap={spec.cap} accent={accent} />
    case 'waves': return <Waves cap={spec.cap} accent={accent} />
    case 'empty': return <Empty cap={spec.cap} accent={accent} />
    case 'cloud': return <Cloud endpoints={spec.endpoints} url={spec.url} cap={spec.cap} accent={accent} />
    case 'ternary-net': return <TernaryNet cap={spec.cap} accent={accent} />
  }
}
