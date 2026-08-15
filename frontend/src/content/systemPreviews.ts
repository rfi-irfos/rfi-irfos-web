// Per-system preview assignment for the 143 System Card modals (rebuilt
// 2026-08-15). The previous version assigned one of 14 anonymous "archetype"
// shapes via keyword regex - live feedback rejected that in full: every
// system now gets its own hand-written DiagramSpec, derived from actually
// reading that system's card content (problem/why/different/fit/technical in
// systems.ts). The diagram *templates* are shared (SystemDiagrams.tsx renders
// them), but everything a reader sees - stage names, CLI lines, endpoint
// paths, counts, captions - is this specific system's own reality, so the
// preview works like a road sign: understandable without reading the prose.
// No keyword fallback anymore: a system missing from this table is a build
// mistake we want loudly visible (getPreview throws), not silently painted
// over with a generic shape.
import type { SystemCard } from './systems'

export type DiagramSpec =
  | { kind: 'stack'; layers: string[]; cap: string }
  | { kind: 'pipeline'; stages: string[]; cap: string }
  | { kind: 'terminal'; lines: { p?: boolean; t: string }[]; cap: string }
  | { kind: 'chat'; lines: { who: 'you' | 'ai'; t: string }[]; badge?: string; cap: string }
  | { kind: 'code-highlight'; popup?: boolean; cap: string }
  | { kind: 'module-grid'; domains: string[]; count: string; cap: string }
  | { kind: 'agent-pool'; count: string; gate: string; cap: string }
  | { kind: 'gate'; label: string; cap: string }
  | { kind: 'two-way'; left: string; right: string; cap: string }
  | { kind: 'converge'; center: string; note: string; cap: string }
  | { kind: 'doc'; title: string; bullets?: boolean; cap: string }
  | { kind: 'graph'; stamps?: boolean; cap: string }
  | { kind: 'hub'; center: string; spokes: string[]; cap: string }
  | { kind: 'market'; cap: string }
  | { kind: 'ports'; cap: string }
  | { kind: 'webpage'; variant: 'tutor' | 'shop' | 'research' | 'site' | 'game' | 'pwa'; url: string; cap: string }
  | { kind: 'fork'; upstream: string; cap: string }
  | { kind: 'bundle'; items: string[]; cap: string }
  | { kind: 'decompile'; from: string; to: string; cap: string }
  | { kind: 'quantize'; cap: string }
  | { kind: 'sparse'; cap: string }
  | { kind: 'nodes'; labels: string[]; cap: string }
  | { kind: 'bridge'; left: string; right: string; mid: string; cap: string }
  | { kind: 'chip'; cap: string }
  | { kind: 'checks'; items: string[]; cap: string }
  | { kind: 'trits'; cap: string }
  | { kind: 'twin'; distributed?: boolean; cap: string }
  | { kind: 'plug'; cap: string }
  | { kind: 'moon'; cap: string }
  | { kind: 'triangle'; cap: string }
  | { kind: 'zones'; cap: string }
  | { kind: 'share'; cap: string }
  | { kind: 'waves'; cap: string }
  | { kind: 'empty'; cap: string }
  | { kind: 'cloud'; endpoints: string[]; url: string; cap: string }
  | { kind: 'ternary-net'; cap: string }

export type PreviewSpec =
  | { type: 'image'; src: string; alt: string }
  | { type: 'diagram'; spec: DiagramSpec }

const img = (src: string, alt: string): PreviewSpec => ({ type: 'image', src, alt })
const d = (spec: DiagramSpec): PreviewSpec => ({ type: 'diagram', spec })

const PREVIEWS: Record<string, PreviewSpec> = {
  // ── RFI core systems ──────────────────────────────────────────
  tis: d({ kind: 'stack', layers: ['TERNLANG COMPILER', 'BET-VM · 27 REG · 50 OPS', 'API · 34 MCP TOOLS'], cap: '144K LINES RUST — ALL LAYERS OURS' }),
  albert: d({ kind: 'ternary-net', cap: 'TERNARY WEIGHTS — ZERO OPS SKIPPED' }),
  'rusty-penguin': d({ kind: 'terminal', lines: [{ p: true, t: 'boot' }, { t: 'long mode ......... OK' }, { t: 'paging ............ OK' }, { t: 'TCP/IP + TLS 1.3 .. OK' }, { t: 'kernel: 100% RUST, 0% C' }], cap: 'AN OS FROM SCRATCH — 41,500 LINES' }),
  'agent-albert-cli': d({ kind: 'chat', lines: [{ who: 'you', t: 'albert "why is this test red?"' }, { who: 'ai', t: 'reading src/lib.rs …' }, { who: 'ai', t: 'off-by-one in line 42' }, { who: 'ai', t: 'patched — tests green' }], cap: 'A FULL AGENT IN YOUR TERMINAL' }),
  'ternlang-stdlib': d({ kind: 'module-grid', domains: ['MATH', 'NET', 'IO', 'CRYPTO', 'TIME', 'TEXT'], count: '28,715 MODULES', cap: 'A STDLIB BUILT ON TRITS, NOT BITS' }),
  'tree-sitter-ternlang': d({ kind: 'code-highlight', cap: 'EDITORS LEARN .TERN — GRAMMAR AS CODE' }),
  'lauras-agents': d({ kind: 'agent-pool', count: '293 AGENTS', gate: 'TERNARY CONTEXT GATE', cap: 'SPECIALISTS, NOT ONE GENERALIST' }),
  'call-laura': d({ kind: 'gate', label: '15 LENSES · NO LLM · NO NETWORK', cap: 'SAME DOC IN → SAME VERDICT OUT' }),
  bifp: d({ kind: 'two-way', left: 'HUMAN', right: 'AGENT', cap: 'THE AGENT CAN RAISE A FLAG BACK' }),
  'albert-spores': d({ kind: 'converge', center: 'albert.', note: 'LOSS 10.09 → 5.55', cap: 'OUTSIDE CHECKPOINTS BLEND IN' }),
  'veo-framework': d({ kind: 'doc', title: 'VEO.md', cap: 'A METHOD, NOT CODE — PURE PROMPTING' }),
  dingir: d({ kind: 'graph', stamps: true, cap: '1,026 NODES — EVERY CLAIM STAMPED' }),
  'coevolution-factory': d({ kind: 'hub', center: 'FACTORY', spokes: ['LAURAS-AGENTS', 'CALL-LAURA GATE', 'LIGHTHOUSE', '50 CENTERS'], cap: 'ONE CONSTITUTION, 50 LIVE CENTERS' }),
  'aladdin-mini': d({ kind: 'market', cap: 'DISCLOSURES MOVE MARKETS — MEASURED' }),
  lighthouse: img('/systems/lighthouse-dashboard.png', 'Lighthouse governance dashboard'),
  laura: img('/systems/laura-canary-kit.png', 'LAURA canary kit interface'),
  'invisible-layer': img('/systems/invisible-layer.png', 'invisible-layer sensor probe interface'),
  'lauras-port-proxy': d({ kind: 'ports', cap: 'REAL TIMING PROBE — NO FAKE BUTTONS' }),
  'foodchain-analysis': img('/systems/foodchain-analysis.png', 'Foodchain analysis sufficiency dashboard'),
  ginie: d({ kind: 'chat', badge: 'OFFLINE·USB', lines: [{ who: 'you', t: 'summarize this folder' }, { who: 'ai', t: 'running local model …' }, { who: 'ai', t: 'done — no cloud touched' }], cap: 'AI FROM A USB STICK, ZERO INSTALL' }),
  eil: d({ kind: 'webpage', variant: 'research', url: 'eil · live', cap: 'RESEARCH PLATFORM + RAG AGENT, 42K LOC' }),
  'rfi-irfos-web': d({ kind: 'webpage', variant: 'site', url: 'rfi-irfos.com', cap: 'THIS EXACT SITE — YOU ARE LOOKING AT IT' }),

  // ── EXTERNAL entries in the rfi-irfos org ─────────────────────
  'rfi-github-profile': d({ kind: 'doc', title: 'profile/README.md', cap: 'THE ORG FRONT DOOR — ONE MARKDOWN FILE' }),
  'rfi-13': d({ kind: 'fork', upstream: 'COBIOEARTH / 13', cap: 'EARLY TERNARY EXPERIMENT — REFERENCE' }),
  'rfi-auto-bayesian': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'BAYESIAN NETS FROM ONE CONFIG FILE' }),
  'rfi-autoguardrails': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'LLM GUARDRAILS AS ONE POLICY.MD' }),
  'rfi-causal-perception-implementation': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'COMPETING CAUSAL MODELS, FAIR CREDIT' }),
  'rfi-e-techbike-at': d({ kind: 'webpage', variant: 'shop', url: 'e-techbike-graz.at', cap: 'LIVE RETAILER SITE ON OUR WEB KIT' }),
  'rfi-gen-fraud-graph': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'SYNTHETIC FRAUD GRAPHS FOR BENCHMARKS' }),
  'rfi-genesis': d({ kind: 'fork', upstream: 'COBIOEARTH / 13', cap: 'SAME FORK AS "13", SECOND NAME' }),
  'rfi-genetic-algorithm': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'PLUG-IN FITNESS, ZERO DEPENDENCIES' }),
  'rfi-linear-adapter-trainer': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'LINEAR ADAPTERS TUNE RAG EMBEDDINGS' }),
  'rfi-llm-bridge': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'ONE CLIENT API, MANY LLM VENDORS' }),
  'rfi-mech-gov-framework': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'HARD APPROVAL GATES FOR LLM DECISIONS' }),
  'rfi-mutatis-mutandis': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'THE COMPARATOR DECIDES THE BIAS TEST' }),
  'rfi-nikoletta-tutor': d({ kind: 'webpage', variant: 'tutor', url: 'niki csonka · coaching', cap: 'LIVE TUTORING SITE — LESSONS & BOOKING' }),
  'rfi-ntpsec': d({ kind: 'fork', upstream: 'NTPSEC PROJECT', cap: 'HARDENED TIME SYNC — CRITICAL INFRA' }),
  'rfi-p2p-repository': d({ kind: 'empty', cap: "GITHUB'S OWN DEMO BOILERPLATE — NOT OURS" }),
  'rfi-ralph': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: "FRESH CONTEXT EVERY LOOP — /LOOP'S ROOT" }),
  'rfi-ralph-vault-skill': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'KNOWLEDGE THAT SURVIVES THE RESTART' }),
  'rfi-ruvector': d({ kind: 'fork', upstream: 'RUVNET / RUVECTOR', cap: 'REUVEN COHEN COLLAB — ZERO-DIFF FORK' }),
  'rfi-sota-stressed-datasets': d({ kind: 'fork', upstream: 'SANTANDER AI LAB', cap: 'BENCHMARKS, DELIBERATELY STRESSED' }),
  'rfi-tis-genesis-archive': d({ kind: 'fork', upstream: 'OUR OWN TIS REPO', cap: 'FROZEN SNAPSHOT — TIS AS IT BEGAN' }),

  // ── simeon-kepp account: personal repos, forks, tools ─────────
  'simeon-abliterator': d({ kind: 'fork', upstream: 'FAILSPY / ABLITERATOR', cap: 'SUBTRACTS THE REFUSAL DIRECTION' }),
  'simeon-albert-strategy-orchestrator': d({ kind: 'hub', center: 'CONSENSUS', spokes: ['SUN MATE', 'OODA', 'SYSTEMS', 'GAME THEORY'], cap: 'FOUR LENSES, ONE VALIDATED REPORT' }),
  'simeon-ansible': d({ kind: 'fork', upstream: 'ANSIBLE / RED HAT', cap: 'AGENTLESS FLEET CONFIG OVER SSH' }),
  'simeon-api-guidelines': d({ kind: 'doc', title: 'api-guidelines.md', cap: "THE SWISS GOVERNMENT'S API RULEBOOK" }),
  'simeon-api-registry': d({ kind: 'fork', upstream: 'APIDECK', cap: 'ONE INDEX OVER MANY SPEC FORMATS' }),
  'simeon-awesome-go': d({ kind: 'doc', title: 'awesome-go.md', bullets: true, cap: 'CURATED GO LIBRARIES — LOOKUP SHELF' }),
  'simeon-awesome-ios-security-tools': d({ kind: 'doc', title: 'ios-sec-tools.md', bullets: true, cap: 'IOS SECURITY TOOLS — AUDIT PREP SHELF' }),
  'simeon-awesome-mac': d({ kind: 'doc', title: 'awesome-mac.md', bullets: true, cap: 'MACOS SOFTWARE, HAND-PICKED' }),
  'simeon-awesome-python': d({ kind: 'doc', title: 'awesome-python.md', bullets: true, cap: 'PYTHON LIBRARIES, CURATED NOT DUMPED' }),
  'simeon-awesome-scalability': d({ kind: 'doc', title: 'scalability.md', bullets: true, cap: 'REAL-WORLD SCALE WAR STORIES' }),
  'simeon-bazaarak': d({ kind: 'empty', cap: 'A RESERVED NAME — NOTHING BUILT YET' }),
  'simeon-burn': d({ kind: 'fork', upstream: 'TRACEL-AI / BURN', cap: 'RUST DEEP LEARNING — STUDIED FOR ALBERT.' }),
  'simeon-candle': d({ kind: 'fork', upstream: 'HUGGING FACE / CANDLE', cap: 'LEAN RUST INFERENCE, NO PYTHON' }),
  'simeon-committers-top': d({ kind: 'fork', upstream: 'COMMITTERS.TOP', cap: 'GITHUB RANKINGS VIA GRAPHQL' }),
  'simeon-crewai': d({ kind: 'fork', upstream: 'CREWAI', cap: 'ROLE CREWS — LAURAS-AGENTS CONTRAST' }),
  'simeon-cybersecurity-soar': d({ kind: 'doc', title: 'soar-list.md', bullets: true, cap: 'SECURITY AUTOMATION, CURATED' }),
  'simeon-deutsch-lernen-pwa': d({ kind: 'webpage', variant: 'pwa', url: 'deutsch-lernen', cap: "B2 GERMAN ↔ PERSIAN — A COLLEAGUE'S BUILD" }),
  'simeon-dynamodb-toolbox': d({ kind: 'fork', upstream: 'DYNAMODB-TOOLBOX', cap: 'TYPED ENTITIES OVER RAW DYNAMODB' }),
  'simeon-flax': d({ kind: 'fork', upstream: 'GOOGLE / FLAX', cap: 'FUNCTIONAL NNS ON JAX — REFERENCE' }),
  'simeon-foodsharing': d({ kind: 'share', cap: 'SURPLUS FOOD FINDS ITS EATER' }),
  'simeon-frida-ipa-extract': d({ kind: 'decompile', from: 'ENCRYPTED .IPA', to: 'READABLE APP', cap: 'DUMPS DECRYPTED IOS APPS FOR AUDIT' }),
  'simeon-frida-tools': d({ kind: 'terminal', lines: [{ p: true, t: 'frida-trace -i "open*"' }, { t: 'hooked 12 functions' }, { t: 'open("/secrets.db") ← caught' }], cap: 'LIVE INSTRUMENTATION — AUDIT WORKHORSE' }),
  'simeon-github-mcp-server': d({ kind: 'bridge', left: 'AI AGENTS', right: 'GITHUB', mid: 'MCP', cap: 'ISSUES & PRS AS AGENT TOOLS — OFFICIAL' }),
  'simeon-hermes-agent': d({ kind: 'fork', upstream: 'NOUSRESEARCH / HERMES', cap: "THE AGENT THAT GROWS — OUR BUNDLES' BASE" }),
  'simeon-hermes-agent-bundle': d({ kind: 'bundle', items: ['skills/', 'plugins/', 'config.toml', 'secrets ✕ stripped'], cap: 'SETUP IN ONE DROP, MACHINE TO MACHINE' }),
  'simeon-hermes-bundle': d({ kind: 'bundle', items: ['skills/', 'plugins/', 'config.toml', 'secrets ✕ stripped'], cap: 'SAME BUNDLE, SEPARATE SNAPSHOT' }),
  'simeon-hermes-setup': d({ kind: 'bundle', items: ['setup.sh', 'skills/', 'plugins/', 'secrets ✕ stripped'], cap: 'THE SETUP ENTRY POINT OF THE THREE' }),
  'simeon-ios-binary-security-analyzer': d({ kind: 'checks', items: ['PIE ENABLED', 'STACK CANARY', 'ARC PRESENT', 'NO WEAK CRYPTO'], cap: 'BINARY HARDENING, CHECKED STATICALLY' }),
  'simeon-jadx': d({ kind: 'decompile', from: 'APK / DEX', to: 'READABLE JAVA', cap: 'EVERY ANDROID AUDIT STARTS HERE' }),
  'simeon-jupyterlab-pygments': d({ kind: 'fork', upstream: 'JUPYTERLAB', cap: 'NOTEBOOK SYNTAX COLORS — MINOR DEP' }),
  'simeon-keras': d({ kind: 'fork', upstream: 'KERAS', cap: 'THE FRIENDLY MODEL API — REFERENCE' }),
  'simeon-linguist': d({ kind: 'fork', upstream: 'GITHUB / LINGUIST', cap: 'HOW GITHUB KNOWS YOUR LANGUAGE' }),
  'simeon-llama-cpp': d({ kind: 'fork', upstream: 'GGML-ORG / LLAMA.CPP', cap: "CPU INFERENCE STANDARD — ALBERT.'S BAR" }),
  'simeon-lunar-phase-calendar': d({ kind: 'moon', cap: 'MOON PHASES AS AN ICS FEED, 5 YEARS OUT' }),
  'simeon-mixed-radix-circuit-synthesis': d({ kind: 'fork', upstream: 'AIUNDERSTAND', cap: 'CIRCUITS BEYOND BINARY — STUDY REF' }),
  'simeon-ml-from-scratch': d({ kind: 'fork', upstream: 'ERIKLINDERNOREN', cap: 'EVERY ML ALGORITHM BARE, IN NUMPY' }),
  'simeon-netron': d({ kind: 'graph', cap: "WE OPEN ALBERT.'S CHECKPOINTS IN THIS" }),
  'simeon-ontologyscope': d({ kind: 'waves', cap: 'WIFI SIGNALS READ PRESENCE — NO CAMERA' }),
  'simeon-openapi-to-graphql': d({ kind: 'bridge', left: 'OPENAPI', right: 'GRAPHQL', mid: '→', cap: 'REST SPECS BECOME GRAPHQL SCHEMAS' }),
  'simeon-osiris': d({ kind: 'fork', upstream: 'SIMPLIFAISOUL / OSIRIS', cap: "OSINT DASHBOARD — HELD AT ARM'S LENGTH" }),
  'simeon-pocketbase': d({ kind: 'fork', upstream: 'POCKETBASE', cap: "BACKEND IN ONE BINARY — LIGHTHOUSE'S KIN" }),
  'simeon-powertoys': d({ kind: 'zones', cap: 'WINDOW ZONES & UTILITIES — PERSONAL' }),
  'simeon-python-ternary': d({ kind: 'triangle', cap: 'TERNARY *PLOTS* — NAME TWIN, NOT LOGIC' }),
  'simeon-resonanceflow': d({ kind: 'fork', upstream: 'RUVNET / CLAUDE-FLOW', cap: 'A REBRAND OF RUFLO — SAME CODE' }),
  'simeon-rfi-labs-arcade': d({ kind: 'webpage', variant: 'game', url: 'rfi-labs arcade', cap: 'SATURDAY GAMES — HONESTLY 1 OF 3 BUILT' }),
  'simeon-ruflo': d({ kind: 'fork', upstream: 'RUVNET / RUFLO', cap: 'AGENT SWARMS FOR CLAUDE — COMPARISON' }),
  'simeon-ruvector': d({ kind: 'fork', upstream: 'RUVNET / RUVECTOR', cap: 'SAME ZERO-DIFF FORK AS THE ORG COPY' }),
  'simeon-ruview': d({ kind: 'waves', cap: 'WIFI DENSEPOSE — POSE WITHOUT A CAMERA' }),
  'simeon-rvllm': d({ kind: 'fork', upstream: 'EMMA-UW / RVLLM', cap: 'RUST VLLM REPLACEMENT — RUNTIME REF' }),
  'simeon-github-profile': d({ kind: 'doc', title: 'README.md', cap: 'A PERSONAL PROFILE PAGE, NOTHING MORE' }),
  'simeon-software-systems-engineering': d({ kind: 'doc', title: 'EN.645.764', cap: 'COURSEWORK ARCHIVE — PRIVATE STUDY' }),
  'simeon-sparc': d({ kind: 'pipeline', stages: ['SPEC', 'PSEUDO', 'ARCH', 'DONE'], cap: "RUVNET'S PHASED AI-DEV METHOD" }),
  'simeon-synaptic-mesh': d({ kind: 'fork', upstream: 'RUVNET / SYNAPTIC-MESH', cap: "P2P NEURAL FABRIC — SPORES' COUSIN" }),
  'simeon-tensorflow': d({ kind: 'fork', upstream: 'GOOGLE / TENSORFLOW', cap: "THE INCUMBENT — WHAT ALBERT. ISN'T" }),
  'simeon-tensorzero': d({ kind: 'fork', upstream: 'TENSORZERO', cap: 'LLM-OPS STACK — RLHF TRACKING REF' }),
  'simeon-termix': d({ kind: 'fork', upstream: 'TERMIX', cap: 'SSH & FILES IN THE BROWSER — PERSONAL' }),
  'simeon-ternary-moral-logic': d({ kind: 'fork', upstream: 'FRACTONICMIND', cap: 'TERNARY ETHICS CLAIM — THEIRS, NOT OURS' }),
  'simeon-terncore-silicon': d({ kind: 'empty', cap: 'A NAME FOR FUTURE SILICON — ZERO COMMITS' }),
  'simeon-ternvector': d({ kind: 'fork', upstream: 'RUVECTOR (INTERNALLY)', cap: 'BRANDING UNRESOLVED — WE SAY SO PLAINLY' }),
  'simeon-book-of-secret-knowledge': d({ kind: 'doc', title: 'the-book.md', bullets: true, cap: 'ONE-LINERS, TOOLS, HACKS — BOOKMARKS' }),
  'simeon-tinygrad': d({ kind: 'fork', upstream: 'TINYGRAD', cap: 'MINIMALISM AS A FRAMEWORK — LEAN REF' }),
  'simeon-top-github-users': d({ kind: 'fork', upstream: 'TOP-GITHUB-USERS', cap: 'A RANKING TOY — CURIOSITY FORK' }),
  'simeon-wayfinder': d({ kind: 'fork', upstream: 'APIDECK / WAYFINDER', cap: 'FINDS PATHS THROUGH BIG JSON' }),
  'simeon-xlstm': d({ kind: 'fork', upstream: 'NX-AI / XLSTM', cap: 'LSTMS STRIKE BACK — ARCHITECTURE WATCH' }),

  // ── crates.io: the published Rust surface ─────────────────────
  'crate-ternlang-ml': d({ kind: 'sparse', cap: 'TRITFLOAT MATMUL — ZEROS NEVER RUN' }),
  'crate-ternlang-runtime': d({ kind: 'nodes', labels: ['NODE A', 'NODE B', 'NODE C'], cap: 'SPAWN / SEND / AWAIT OVER PLAIN TCP' }),
  'crate-ternlang-hdl': d({ kind: 'chip', cap: 'TERNARY LOGIC AS REAL VERILOG-2001' }),
  'crate-moe-llb': d({ kind: 'gate', label: 'LLB · PURE RULES · NO LLM', cap: 'EVERY DISK WRITE PASSES HERE FIRST' }),
  'crate-ternlang-cli': d({ kind: 'terminal', lines: [{ p: true, t: 'tern run main.tern' }, { t: '✓ 42 trits returned' }, { p: true, t: 'tern build --target c' }, { t: '✓ emitted main.c' }], cap: 'RUN · BUILD · SIM · REPL — ONE BINARY' }),
  'crate-ternlang-lsp': d({ kind: 'code-highlight', popup: true, cap: 'LSP 3.17 — ERRORS AS YOU TYPE' }),
  'crate-ternlang-mcp': d({ kind: 'bridge', left: 'MCP AGENTS', right: 'TRIT ENGINE', mid: 'MCP', cap: 'CLAUDE CAN CALL TRIT_DECIDE DIRECTLY' }),
  'crate-moe-platform': d({ kind: 'bridge', left: 'ALL CALLERS', right: 'MOE-13', mid: 'API v1.3', cap: 'ONE LOCKED DOOR — INTERNALS FREE TO MOVE' }),
  'crate-ternlang-compat': d({ kind: 'bridge', left: '.TASM / OWLET', right: 'BET BYTECODE', mid: '→', cap: 'OLD FORMATS STILL COMPILE TODAY' }),
  'crate-moe-plugin-sdk': d({ kind: 'plug', cap: 'PLUGINS OUTLIVE MODEL UPDATES' }),
  'crate-ternpkg': d({ kind: 'terminal', lines: [{ p: true, t: 'ternpkg install std/math' }, { t: 'resolved via ternlang.toml' }, { t: '✓ 28,715 modules indexed' }], cap: 'THE PACKAGE MANAGER FOR .TERN' }),
  'crate-ternlang-codegen': d({ kind: 'pipeline', stages: ['.TERN', 'AST', 'C', 'BIN'], cap: 'NO VM ON TARGET? COMPILE TO C.' }),
  'crate-ternlang-test': d({ kind: 'checks', items: ['assert_trit(+1)', 'golden-file diff', 'BET-VM output'], cap: 'TRIT-AWARE ASSERTS + GOLDEN FILES' }),
  'crate-ternlang-compress': d({ kind: 'quantize', cap: 'FLOAT MODEL IN → {−1 0 +1} OUT' }),
  'crate-moe-runtime': d({ kind: 'twin', cap: 'SAME INPUT → SAME RESULT, EVERY RUN' }),
  'crate-moe-reference': d({ kind: 'doc', title: 'moe-reference.rs', cap: 'THE DOCS LIVE INSIDE THE CRATE' }),
  'crate-moe-ddel': d({ kind: 'twin', distributed: true, cap: 'DETERMINISM ACROSS MACHINES' }),
  'crate-moe-sdk': d({ kind: 'stack', layers: ['MOE-SDK', 'PLATFORM · PLUGIN-SDK', 'RUNTIME · DDEL'], cap: 'ONE ENTRY POINT, FOUR CRATES BEHIND' }),
  'crate-pytern': d({ kind: 'pipeline', stages: ['PYTHON', 'PYTERN', 'BYTECODE'], cap: 'PYTHON IN, TERNARY BYTECODE OUT' }),
  'crate-ternaudit-guard': d({ kind: 'checks', items: ['ART. 13 TRANSPARENCY', 'ART. 14 OVERSIGHT', 'ART. 15 ACCURACY'], cap: 'EU AI ACT LOGGING, NATIVE TO THE AGENT' }),
  'crate-moe-llm-core': d({ kind: 'ternary-net', cap: 'THE MODEL CORE AS ITS OWN CRATE' }),
  'crate-moe-compute': d({ kind: 'sparse', cap: 'THE EXECUTION LAYER UNDER THE CORE' }),
  'crate-moe-uril': d({ kind: 'hub', center: 'URIL', spokes: ['LLM-CORE', 'COMPUTE', 'TEST', 'VALIDATION'], cap: 'ONE RUNTIME GLUE FOR EVERY MOE CRATE' }),
  'crate-moe-validation-suite': d({ kind: 'checks', items: ['BLACK-BOX PROBES', 'NO SELF-GRADING', 'OUTSIDE-IN CERT'], cap: "THE MODEL DOESN'T GRADE ITS OWN HOMEWORK" }),
  'crate-albert-reference': d({ kind: 'doc', title: 'albert-reference.rs', cap: 'PRODUCTION PATTERNS, SHIPPED AS A CRATE' }),
  'crate-lauras-team': d({ kind: 'agent-pool', count: '15 EXPERTS', gate: 'BSL-1.1 LICENSE', cap: 'OSINT · LEGAL · FINANCE · SECURITY · OPS' }),
  'crate-call-laura-core': d({ kind: 'gate', label: 'UIP 8-LAYER · DETERMINISTIC', cap: 'REPRODUCIBLE OFFLINE — NO KEY, NO CALL' }),
  'crate-moe-test': d({ kind: 'checks', items: ['moe-llm-core', 'moe-compute', 'moe-uril'], cap: "THE MOE STACK'S OWN TEST BENCH" }),
  'crate-ternary-core': d({ kind: 'trits', cap: 'TRIT + TRYTE — NO_STD, ZERO DEPS' }),
  'crate-lauras-mcp': d({ kind: 'bridge', left: 'CLAUDE CODE', right: 'LAURA CORE', mid: 'MCP', cap: 'REVIEW_PLAN FREE · REVIEW_TEAM LICENSED' }),
  'crate-ternlang-api': d({ kind: 'cloud', endpoints: ['/trit_decide', '/trit_vector', 'TaaS mesh'], url: 'ternlang.com/api', cap: 'THE PUBLIC REST DOOR INTO TIS' }),
  'crate-lauras-api': d({ kind: 'cloud', endpoints: ['/review free', '/team keyed', '/mcp json-rpc'], url: 'laura-api.fly.dev', cap: 'THE HOSTED SURFACE, LIVE ON FLY' }),
  'crate-laura-mcp': d({ kind: 'bridge', left: 'MCP CLIENT', right: 'CALL-LAURA', mid: 'MCP', cap: 'JUST REVIEW_PLAN — NOTHING HEAVIER' }),
  'crate-albert-compat': d({ kind: 'bridge', left: 'ANY MANIFEST', right: 'ALBERT CLI', mid: 'COMPAT', cap: '22 VERSIONS OF NOT BREAKING' }),
  'crate-albert-tools': d({ kind: 'terminal', lines: [{ t: '▸ bash' }, { t: '▸ grep / glob' }, { t: '▸ file edit' }, { t: '▸ mcp dispatch' }], cap: 'THE HANDS OF ALBERT-CLI' }),
  'crate-albert-commands': d({ kind: 'terminal', lines: [{ p: true, t: '/plan' }, { p: true, t: '/tdd' }, { p: true, t: '/loop' }, { p: true, t: '/code-review' }], cap: 'SHARED SLASH-COMMANDS, 23 VERSIONS DEEP' }),
}

export function getPreview(system: SystemCard): PreviewSpec {
  const spec = PREVIEWS[system.key]
  if (!spec) throw new Error(`systemPreviews: no preview spec for "${system.key}" - every system needs one, add it to PREVIEWS`)
  return spec
}
