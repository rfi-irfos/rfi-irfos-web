// Preview assignment for the ~143 System Card modals (2026-08-15). Every modal
// gets a fixed-size preview box on its left side: a real screenshot for the
// handful of systems with an actual live UI worth showing, or one of a small
// set of reusable animated SVG "archetype" diagrams for everything else -
// hand-building 143 bespoke animations wasn't tractable, so instead the
// archetypes are visual metaphors (hub, pipeline, vector store, CLI, protocol
// bridge, ...) assigned by what a system actually does. EXTERNAL systems are
// almost entirely unmodified forks kept for reference (see systems.ts's own
// header comment) - defaulting all of them to 'fork-reference' unless a
// system is explicitly overridden below covers the vast majority correctly.
import type { SystemCard } from './systems'

export type DiagramArchetype =
  | 'orchestrator-hub'
  | 'pipeline-flow'
  | 'vector-storage'
  | 'cli-terminal'
  | 'protocol-bridge'
  | 'fork-reference'
  | 'security-gate'
  | 'model-inference'
  | 'hardware-silicon'
  | 'document-review'
  | 'web-app'
  | 'empty-placeholder'

export type PreviewSpec =
  | { type: 'image'; src: string; alt: string }
  | { type: 'diagram'; archetype: DiagramArchetype }

// Explicit overrides - flagship RFI systems (bespoke archetype choice, or a
// real screenshot once the file exists under public/systems/), plus the small
// number of EXTERNAL entries that aren't conceptually forks (real live
// side-projects, or confirmed-empty scaffolds) where 'fork-reference' would
// be misleading.
const OVERRIDES: Record<string, PreviewSpec> = {
  // Real screenshots - files expected at public/systems/<name>.png, see the
  // report at the end of this rollout for the exact list handed to the user.
  laura: { type: 'image', src: '/systems/laura-canary-kit.png', alt: 'LAURA canary kit interface' },
  'invisible-layer': { type: 'image', src: '/systems/invisible-layer.png', alt: 'invisible-layer sensor probe interface' },
  lighthouse: { type: 'image', src: '/systems/lighthouse-dashboard.png', alt: 'Lighthouse governance dashboard' },
  'foodchain-analysis': { type: 'image', src: '/systems/foodchain-analysis.png', alt: 'Foodchain analysis sufficiency dashboard' },

  // Flagship systems without a screenshot yet - deliberate archetype choice
  // rather than falling through the keyword heuristic below.
  tis: { type: 'diagram', archetype: 'orchestrator-hub' },
  albert: { type: 'diagram', archetype: 'model-inference' },
  'rusty-penguin': { type: 'diagram', archetype: 'hardware-silicon' },
  'agent-albert-cli': { type: 'diagram', archetype: 'cli-terminal' },
  'ternlang-stdlib': { type: 'diagram', archetype: 'pipeline-flow' },
  'tree-sitter-ternlang': { type: 'diagram', archetype: 'document-review' },
  'lauras-agents': { type: 'diagram', archetype: 'orchestrator-hub' },
  'call-laura': { type: 'diagram', archetype: 'document-review' },
  bifp: { type: 'diagram', archetype: 'security-gate' },
  'albert-spores': { type: 'diagram', archetype: 'orchestrator-hub' },
  'veo-framework': { type: 'diagram', archetype: 'pipeline-flow' },
  dingir: { type: 'diagram', archetype: 'vector-storage' },
  'coevolution-factory': { type: 'diagram', archetype: 'pipeline-flow' },
  'aladdin-mini': { type: 'diagram', archetype: 'model-inference' },
  'lauras-port-proxy': { type: 'diagram', archetype: 'protocol-bridge' },
  ginie: { type: 'diagram', archetype: 'cli-terminal' },
  eil: { type: 'diagram', archetype: 'web-app' },
  'rfi-irfos-web': { type: 'diagram', archetype: 'web-app' },

  // Real live side-projects, not forks - a fork-reference ghost node would
  // misrepresent these as external references when they're genuinely built
  // and deployed, just outside the ternary stack.
  'rfi-e-techbike-at': { type: 'diagram', archetype: 'web-app' },
  'rfi-nikoletta-tutor': { type: 'diagram', archetype: 'web-app' },
  'simeon-deutsch-lernen-pwa': { type: 'diagram', archetype: 'web-app' },
  'simeon-foodsharing': { type: 'diagram', archetype: 'web-app' },

  // Confirmed-empty scaffolds - the honest "nothing here yet" state, not a
  // reference-fork ghost (these aren't forks at all, or the fork content
  // itself never materialized).
  'simeon-bazaarak': { type: 'diagram', archetype: 'empty-placeholder' },
  'simeon-terncore-silicon': { type: 'diagram', archetype: 'empty-placeholder' },
  'rfi-p2p-repository': { type: 'diagram', archetype: 'empty-placeholder' },

  // EXPERIMENTAL non-forks that read as personal tooling snapshots, not a
  // single running system - cli-terminal (config/setup bundles you drop in
  // and run) fits better than orchestrator-hub or fork-reference.
  'simeon-hermes-agent-bundle': { type: 'diagram', archetype: 'cli-terminal' },
  'simeon-hermes-bundle': { type: 'diagram', archetype: 'cli-terminal' },
  'simeon-hermes-setup': { type: 'diagram', archetype: 'cli-terminal' },
  'simeon-albert-strategy-orchestrator': { type: 'diagram', archetype: 'orchestrator-hub' },
  'simeon-rfi-labs-arcade': { type: 'diagram', archetype: 'web-app' },
  'simeon-ontologyscope': { type: 'diagram', archetype: 'vector-storage' },
}

// Keyword heuristic - only reached for the ~35 real RFI crates/tools that
// have no explicit override above. Checked in order; first match wins.
const KEYWORD_RULES: Array<{ archetype: DiagramArchetype; test: RegExp }> = [
  { archetype: 'security-gate', test: /audit|guard|llb|containment|compliance/i },
  { archetype: 'cli-terminal', test: /\bcli\b|command|slash command/i },
  { archetype: 'protocol-bridge', test: /\bmcp\b|\bapi\b|gateway|rest interface|bridge/i },
  { archetype: 'vector-storage', test: /vector|memory database|gnn|embedding/i },
  { archetype: 'hardware-silicon', test: /verilog|hdl|silicon|hardware|fpga|no_std/i },
  { archetype: 'document-review', test: /test|validation|verification|documentation/i },
  { archetype: 'model-inference', test: /inference|llm|transpiler|quantiz|compress/i },
  { archetype: 'pipeline-flow', test: /pipeline|orchestrat|runtime|execution|package manager|registry/i },
]

function classify(system: SystemCard): DiagramArchetype {
  const haystack = `${system.technical.en} ${system.fit.en} ${system.name}`
  for (const rule of KEYWORD_RULES) {
    if (rule.test.test(haystack)) return rule.archetype
  }
  return 'pipeline-flow'
}

export function getPreview(system: SystemCard): PreviewSpec {
  const override = OVERRIDES[system.key]
  if (override) return override
  if (system.status === 'EXTERNAL') return { type: 'diagram', archetype: 'fork-reference' }
  return { type: 'diagram', archetype: classify(system) }
}
