// Non-translatable metadata for The Squad / Kader page: icon, accent color, and
// hub diagram position. Bilingual prose (mission, domain, description,
// monitors/detects/output bullets) lives in content/en.ts + content/de.ts under
// the `squad` key instead, following the separation already established for
// other sections (see en.ts:6-11).
//
// This is a purpose-built type, not a reuse of content/systems.ts's `SystemCard` -
// none of these 8 agent names exist there, and SystemCard has no monitors/detects/
// output shape to extend.
import {
  IconHierarchy, IconEye, IconPlanet, IconBook,
  IconGitCompare, IconCube, IconTarget, IconShieldLock,
  type TablerIcon,
} from '@tabler/icons-react'

export type AgentKey = 'atlas' | 'argus' | 'kopernikus' | 'janus' | 'mirror' | 'daedalus' | 'lynx' | 'nyx'

export type SquadAgent = {
  key: AgentKey
  name: string
  icon: TablerIcon
  color: string
  // Hub diagram position (see SquadHubDiagram): ring 0 = ATLAS/NYX (center
  // top/bottom), ring 1-3 = the three left/right pairs radiating outward.
  hubRing: 0 | 1 | 2 | 3
  hubSide: 'left' | 'right' | 'center'
}

export const SQUAD_AGENTS: SquadAgent[] = [
  { key: 'atlas', name: 'ATLAS', icon: IconHierarchy, color: 'var(--accent)', hubRing: 0, hubSide: 'center' },
  { key: 'argus', name: 'ARGUS', icon: IconEye, color: '#ffd43b', hubRing: 1, hubSide: 'left' },
  { key: 'kopernikus', name: 'KOPERNIKUS', icon: IconPlanet, color: '#4dabf7', hubRing: 1, hubSide: 'right' },
  { key: 'mirror', name: 'MIRROR', icon: IconGitCompare, color: '#c77dff', hubRing: 2, hubSide: 'left' },
  { key: 'janus', name: 'JANUS', icon: IconBook, color: '#69db7c', hubRing: 2, hubSide: 'right' },
  { key: 'lynx', name: 'LYNX', icon: IconTarget, color: '#20c997', hubRing: 3, hubSide: 'left' },
  { key: 'daedalus', name: 'DAEDALUS', icon: IconCube, color: '#ffa94d', hubRing: 3, hubSide: 'right' },
  { key: 'nyx', name: 'NYX', icon: IconShieldLock, color: '#ff6b5e', hubRing: 0, hubSide: 'center' },
]

export function agentByKey(key: AgentKey): SquadAgent {
  const agent = SQUAD_AGENTS.find(a => a.key === key)
  if (!agent) throw new Error(`squadAgents: no agent for key "${key}"`)
  return agent
}
