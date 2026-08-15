// System-card data for the footer's "explore the architecture" modal
// (2026-08-15, live feedback from Simeon via the user: the footer's repo/crate
// directory shouldn't be an exit from the site straight to GitHub, it should be
// an entry point into the actual system architecture - clicking a link opens a
// standardized System Card modal instead, and GitHub/crates.io only appears as
// a technical-deep-dive link at the bottom of it).
//
// Every field here is grounded in the 2026-08-15 repo audit (see
// rfi-irfos-architecture-synthesis.md on Simeon's Desktop for the full evidence
// trail - which repos are genuinely original, which have real verified
// cross-repo dependencies, actual LOC/test counts, etc). `status` follows the
// evidence-status vocabulary already used internally in the Kindom/DINGIR
// project docs (PROVEN/OPERATIONAL/COMPOSABLE/EXPERIMENTAL/...), reused here
// for consistency rather than inventing a second vocabulary.
export type SystemStatus = 'OPERATIONAL' | 'COMPOSABLE' | 'EXPERIMENTAL'
export type SystemZone = 'foundation' | 'intelligence' | 'worldmodel' | 'applications'

type Bilingual = { de: string; en: string }

export type SystemCard = {
  key: string
  name: string
  zone: SystemZone
  status: SystemStatus
  problem: Bilingual
  why: Bilingual
  different: Bilingual
  fit: Bilingual
  proof: Bilingual
  technical: Bilingual
  // Keys of other SYSTEMS entries this one has a REAL, verified relationship
  // with (an actual HTTP call, a shared schema, a shared codebase, a documented
  // dependency) - not just shared branding. Rendered as clickable pills that
  // swap the modal to that system, same navigate-by-relationship pattern as
  // the Research Areas modal's "next" pill, but keyed instead of sequential.
  connects: string[]
  links: { github?: string; crates?: string; live?: string }
}

export const ZONE_LABELS: Record<SystemZone, Bilingual> = {
  foundation: { de: 'Foundation', en: 'Foundation' },
  intelligence: { de: 'Intelligence', en: 'Intelligence' },
  worldmodel: { de: 'World Model', en: 'World Model' },
  applications: { de: 'Applications', en: 'Applications' },
}
export const ZONE_ORDER: SystemZone[] = ['foundation', 'intelligence', 'worldmodel', 'applications']

export const SYSTEMS: SystemCard[] = [
  {
    key: 'tis', name: 'Ternary Intelligence Stack', zone: 'foundation', status: 'OPERATIONAL',
    problem: { de: 'Ternäre Systeme brauchten eine eigene Sprache, einen eigenen Compiler und eine eigene Laufzeitumgebung - es gab keine, auf der man einfach aufbauen konnte.', en: 'Ternary systems needed their own language, compiler, and runtime - none existed to build on.' },
    why: { de: 'Bestehende Compiler und VMs sind fest auf Binärlogik gebaut. Eine dritte Zustandsebene nachträglich reinzuquetschen hätte an jeder Stelle Kompromisse erzwungen.', en: 'Existing compilers and VMs are hard-coded for binary logic. Retrofitting a third state afterward would have forced compromises everywhere.' },
    different: { de: 'Balancierte Ternärlogik {-1, 0, +1} ist hier ein natives Systemprimitiv, keine nachträglich aufgesetzte Quantisierung - eigene VM (BET, 27 Register, 50 Opcodes), eigener Compiler, eigene API.', en: 'Balanced ternary {-1, 0, +1} is a native systems primitive here, not quantization bolted on afterward - own VM (BET, 27 registers, 50 opcodes), own compiler, own API.' },
    fit: { de: 'Die Foundation-Schicht: albert. und der Ternlang-Compiler leben aktuell fusioniert im selben Monorepo.', en: 'The Foundation layer: albert. and the Ternlang compiler currently live fused in the same monorepo.' },
    proof: { de: '144.000+ Zeilen Rust, 34 MCP-Tools, Live-API, tägliche Entwicklungs-Log-Einträge, aktive Fly-Deploys.', en: '144,000+ lines of Rust, 34 MCP tools, a live API, daily dev-log entries, active Fly deploys.' },
    technical: { de: 'Rust, Cargo-Workspace, 441 .rs-Dateien, 1.547 .tern-Dateien.', en: 'Rust, Cargo workspace, 441 .rs files, 1,547 .tern files.' },
    connects: ['albert', 'rusty-penguin', 'agent-albert-cli', 'albert-spores', 'ternlang-stdlib', 'tree-sitter-ternlang'],
    links: { github: 'https://github.com/rfi-irfos/ternary-intelligence-stack', crates: 'https://crates.io/crates/ternlang-core' },
  },
  {
    key: 'albert', name: 'albert.', zone: 'intelligence', status: 'OPERATIONAL',
    problem: { de: 'Sprachmodelle brauchen heute riesige GPU-Farmen und bleiben eine Blackbox - niemand kann jede Entscheidung darin nachvollziehen.', en: 'Language models today need huge GPU farms and stay a black box - nobody can trace every decision inside them.' },
    why: { de: 'Wir wollten ein Modell, das auf gewöhnlicher Hardware läuft und dessen Gewichte man tatsächlich verstehen kann, nicht nur benchmarken.', en: 'We wanted a model that runs on ordinary hardware and whose weights you can actually understand, not just benchmark.' },
    different: { de: 'Von Grund auf mit ternären Gewichten {-γ, 0, +γ} trainiert, nicht aus einem Floating-Point-Modell konvertiert. Duale Mixture-of-Experts-Architektur, überspringt Nullgewicht-Operationen, kann sich über Net2Net-Chirurgie selbst erweitern.', en: 'Trained from scratch with ternary weights {-γ, 0, +γ}, not converted from a floating-point model. Dual-stream MoE architecture, skips zero-weight operations, can expand itself via Net2Net surgery.' },
    fit: { de: 'Die Intelligence-Schicht, aktuell fusioniert im TIS-Monorepo. DINGIR ruft albert. als Synthese-Backend auf, sobald es trainiert ist.', en: "The Intelligence layer, currently fused inside the TIS monorepo. DINGIR calls albert. as its synthesis backend once it's trained." },
    proof: { de: 'Live-Trainings-Telemetrie, CPU-Benchmarks, federiertes Weight-Sharing über den albert-spores-Checkpoint-Pool.', en: 'Live training telemetry, CPU benchmarks, federated weight-sharing via the albert-spores checkpoint pool.' },
    technical: { de: 'Rust, Ternlang-Runtime.', en: 'Rust, Ternlang runtime.' },
    connects: ['tis', 'albert-spores', 'dingir', 'agent-albert-cli'],
    links: { github: 'https://github.com/rfi-irfos/ternary-intelligence-stack', crates: 'https://crates.io/crates/albert-runtime' },
  },
  {
    key: 'rusty-penguin', name: 'Rusty Penguin', zone: 'foundation', status: 'OPERATIONAL',
    problem: { de: 'Jedes gängige Betriebssystem trägt jahrzehntealten C-Code mit sich - und damit Jahrzehnte an Speichersicherheits-Bugs.', en: 'Every mainstream OS carries decades-old C code with it - and decades of memory-safety bugs along with it.' },
    why: { de: 'Ein ternäres Substrat für ternäre Intelligenz gibt es nirgends von der Stange, und Sicherheit nachträglich auf einen bestehenden Kernel zu pfropfen, löst das Grundproblem nicht.', en: "A ternary substrate for ternary intelligence doesn't exist off the shelf, and grafting security onto an existing kernel afterward doesn't fix the root problem." },
    different: { de: 'Bare-Metal-Betriebssystem komplett in Rust: eigener Kernel, Long-Mode-Boot, Paging, TCP/IP + TLS 1.3 von Grund auf, Linux-ABI-Kompatibilität.', en: 'Bare-metal OS entirely in Rust: own kernel, long-mode boot, paging, TCP/IP + TLS 1.3 from scratch, Linux-ABI compatibility.' },
    fit: { de: 'Foundation-Schicht, gedacht als Substrat für albert. und Ternlang. DINGIRs GNN-Inferenz-Bridge dorthin ist in Arbeit, noch nicht end-to-end verifiziert.', en: "Foundation layer, meant as the substrate albert. and Ternlang run on. DINGIR's GNN-inference bridge to it is in progress, not yet verified end-to-end." },
    proof: { de: '41.500+ Zeilen Rust, echtes HTTPS-Fetching verifiziert, eigenes ehrliches Status-Board direkt im Repo.', en: "41,500+ lines of Rust, verified real HTTPS fetching, its own honest status board right in the repo." },
    technical: { de: 'Rust, kein externer Kernel-Unterbau, in QEMU verifiziert.', en: 'Rust, no external kernel base, verified in QEMU.' },
    connects: ['tis', 'dingir'],
    links: { github: 'https://github.com/rfi-irfos/rusty-penguin' },
  },
  {
    key: 'agent-albert-cli', name: 'albert-cli', zone: 'foundation', status: 'OPERATIONAL',
    problem: { de: 'albert. und andere Sprachmodelle brauchten einen Weg, direkt im Terminal genutzt zu werden, ohne Browser oder Chat-Oberfläche.', en: 'albert. and other language models needed a way to be used directly in a terminal, no browser or chat UI.' },
    why: { de: 'Fertige CLI-Tools sind an einen Anbieter gebunden - wir wollten Multi-Provider und von Anfang an ternär-logik-gegated.', en: 'Off-the-shelf CLI tools are tied to one vendor - we wanted multi-provider and ternary-logic-gated from day one.' },
    different: { de: 'Terminal-natives Multi-Provider-CLI mit echtem SSE-Streaming, Reasoning-Aufwands-Steuerung, kompatibel mit OpenAI/Anthropic/NVIDIA NIM/Google.', en: 'Terminal-native multi-provider CLI with real SSE streaming, reasoning-effort control, compatible with OpenAI/Anthropic/NVIDIA NIM/Google.' },
    fit: { de: 'Foundation-Werkzeug, aus TIS in ein eigenes Repo extrahiert.', en: 'Foundation-layer tool, extracted from TIS into its own repo.' },
    proof: { de: '92.000+ Zeilen Rust, echte TUI/Hooks/Skills/Permissions-Architektur, über 400 crates.io-Downloads.', en: '92,000+ lines of Rust, real TUI/hooks/skills/permissions architecture, 400+ crates.io downloads.' },
    technical: { de: 'Rust, ratatui/crossterm, rustyline.', en: 'Rust, ratatui/crossterm, rustyline.' },
    connects: ['tis', 'albert'],
    links: { github: 'https://github.com/rfi-irfos/agent-albert-cli', crates: 'https://crates.io/crates/albert-cli' },
  },
  {
    key: 'ternlang-stdlib', name: 'ternlang-stdlib', zone: 'foundation', status: 'OPERATIONAL',
    problem: { de: 'Eine Programmiersprache ohne Standardbibliothek zwingt jede und jeden, alles von Grund auf neu zu schreiben.', en: 'A programming language without a standard library forces everyone to write everything from scratch.' },
    why: { de: 'Ternlang brauchte eine ebenso vollständige offene Bibliothek wie etablierte Sprachen, sonst bleibt sie ein Nischen-Experiment.', en: 'Ternlang needed a standard library as complete as established languages have, or it stays a niche experiment.' },
    different: { de: '28.700+ offene .tern-Module über rund 40 Domänen, direkt auf dem Trit gebaut statt binär emuliert.', en: '28,700+ open .tern modules across roughly 40 domains, built directly on the trit instead of binary-emulated.' },
    fit: { de: 'Foundation, das offene Pendant zur kommerziellen ternlang-plib-Stufe.', en: 'Foundation, the open counterpart to the commercial ternlang-plib tier.' },
    proof: { de: '28.715 Dateien, strukturell vollständig über alle Domänen.', en: '28,715 files, structurally complete across every domain.' },
    technical: { de: 'reines Ternlang, kein Cargo-Manifest nötig.', en: 'pure Ternlang, no Cargo manifest needed.' },
    connects: ['tis'],
    links: { github: 'https://github.com/simeon-kepp/ternlang-stdlib' },
  },
  {
    key: 'tree-sitter-ternlang', name: 'tree-sitter-ternlang', zone: 'foundation', status: 'OPERATIONAL',
    problem: { de: 'Ohne Grammatik-Unterstützung bekommt Ternlang-Code in keinem Editor Syntax-Highlighting oder Codeanalyse.', en: 'Without grammar support, Ternlang code gets no syntax highlighting or code analysis in any editor.' },
    why: { de: 'Ein eigenes Sprach-Ökosystem braucht eigenes Entwickler-Tooling, sonst schreibt niemand ernsthaft Ternlang.', en: "A language ecosystem needs its own developer tooling, or nobody writes serious Ternlang." },
    different: { de: 'Vollständige Tree-sitter-Grammatik für Ternlang, inklusive der @sparseskip-Annotation als First-Class-Element.', en: 'A complete Tree-sitter grammar for Ternlang, including the @sparseskip annotation as a first-class element.' },
    fit: { de: 'Foundation-Tooling, downstream von TIS.', en: 'Foundation-layer tooling, downstream of TIS.' },
    proof: { de: 'Klein, vollständig, funktionsfähig - 13 Dateien.', en: 'Small, complete, working - 13 files.' },
    technical: { de: 'JavaScript/Tree-sitter-Grammatik.', en: 'JavaScript/Tree-sitter grammar.' },
    connects: ['tis'],
    links: { github: 'https://github.com/simeon-kepp/tree-sitter-ternlang' },
  },
  {
    key: 'lauras-agents', name: "Laura's Agents", zone: 'intelligence', status: 'OPERATIONAL',
    problem: { de: 'Ein einzelner General-Agent kennt sich überall ein bisschen aus, aber nirgends wirklich tief - für echte Fachfragen reicht das nicht.', en: 'A single generalist agent knows a little about everything but nothing deeply enough for real domain questions.' },
    why: { de: 'Wir wollten 15 wirklich spezialisierte Fachagenten statt eines Alleskönners, und eine Instanz, die sich selbst gegenprüft, bevor sie etwas vorschlägt.', en: 'We wanted 15 genuinely specialized domain agents instead of one generalist, and an instance that cross-checks itself before proposing anything.' },
    different: { de: '293-Agenten-Pool (aus 18 handgeschriebenen Kern-Agenten skaliert), ein ternäres Kontext-Gate vor jedem Auftrag, ein gehärteter Review-Loop mit call-laura als unabhängiger zweiter Meinung.', en: "293-agent pool (scaled from 18 hand-authored core agents), a ternary context gate before every task, a hardened review loop with call-laura as an independent second opinion." },
    fit: { de: 'Intelligence-Schicht. Ruft TIS\' Trit-Engine per HTTP für Gate-Entscheidungen, nutzt call-laura als Ship-Gate, ist die Engine hinter coevolution-factory.', en: "Intelligence layer. Calls TIS's trit engine over HTTP for gate decisions, uses call-laura as its ship gate, is the engine behind coevolution-factory." },
    proof: { de: '15.676 Zeilen Rust, 39 bestandene Tests, live im Einsatz, dokumentierte Produktionsläufe.', en: '15,676 lines of Rust, 39 passing tests, live in production, documented production runs.' },
    technical: { de: 'Rust, 28-Crate-Workspace, TOML-Agenten-Manifeste.', en: 'Rust, 28-crate workspace, TOML agent manifests.' },
    connects: ['tis', 'call-laura', 'coevolution-factory', 'eil'],
    links: { github: 'https://github.com/rfi-irfos/lauras-agents-public', live: 'https://lauras-agents-api.fly.dev' },
  },
  {
    key: 'call-laura', name: 'call-laura', zone: 'intelligence', status: 'OPERATIONAL',
    problem: { de: 'LLM-basierte Dokumentenprüfung ist teuer, braucht externe API-Calls und liefert bei derselben Eingabe nicht immer dasselbe Ergebnis.', en: "LLM-based document review is expensive, needs external API calls, and doesn't always return the same result for the same input." },
    why: { de: 'Für einen verlässlichen Gate-Mechanismus brauchten wir etwas garantiert Reproduzierbares - kein Modell, das an einem Tag anders urteilt als am anderen.', en: 'For a reliable gate mechanism we needed something guaranteed reproducible - not a model that judges differently one day to the next.' },
    different: { de: 'Vollständig deterministisch: kein Netzwerk-Call, kein LLM, reines Keyword-/Pattern-Matching über dieselbe 15-Lens-Taxonomie wie lauras-agents - jedes Ergebnis direkt im Quellcode nachlesbar.', en: 'Fully deterministic: no network call, no LLM, pure keyword/pattern matching over the same 15-lens taxonomy as lauras-agents - every result directly readable in the source.' },
    fit: { de: 'Intelligence-Schicht, kein Wrapper von lauras-agents, sondern eine unabhängige zweite Implementierung mit geteiltem Schema. Von lauras-agents und coevolution-factory als Ship-Gate genutzt.', en: 'Intelligence layer, not a wrapper around lauras-agents but an independent second implementation with a shared schema. Used by lauras-agents and coevolution-factory as a ship gate.' },
    proof: { de: '3.064 Zeilen Rust, 50 Tests, live im Einsatz, auf crates.io veröffentlicht.', en: '3,064 lines of Rust, 50 tests, live in production, published on crates.io.' },
    technical: { de: 'Rust, axum/tokio, 4-Crate-Workspace.', en: 'Rust, axum/tokio, 4-crate workspace.' },
    connects: ['lauras-agents', 'coevolution-factory'],
    links: { github: 'https://github.com/rfi-irfos/call-laura', crates: 'https://crates.io/crates/lauras-core', live: 'https://laura-api.fly.dev' },
  },
  {
    key: 'bifp', name: 'BIFP', zone: 'intelligence', status: 'OPERATIONAL',
    problem: { de: 'Mensch-KI-Zusammenarbeit läuft meist nur in eine Richtung: der Mensch korrigiert die KI. Es fehlt ein Kanal, über den ein Agent auch selbst Bescheid gibt.', en: "Human-AI collaboration usually runs one-way: the human corrects the AI. There's no channel for an agent to flag something back." },
    why: { de: 'Ohne ein echtes Protokoll dafür bleibt "die KI sagt Bescheid" eine vage Absicht statt einem verlässlichen Mechanismus.', en: "Without a real protocol for it, \"the AI flags things\" stays a vague intention instead of a reliable mechanism." },
    different: { de: 'Native ternäre Flag-/Konsens-/Teach-then-Handoff-Primitiven mit echter Trit-Persistenz. Ungewöhnlich ehrlich dokumentiert: nennt explizit, was es NICHT mit anderen Systemen teilt.', en: 'Native ternary flag/consensus/teach-then-handoff primitives with real trit persistence. Unusually honest documentation: explicitly states what it does NOT share with other systems.' },
    fit: { de: 'Intelligence-Schicht, aktuell nicht öffentlich beworben. Zitiert Lighthouses reale RLHF-Trit-Felder als Beispiel für gelebte Praxis.', en: "Intelligence layer, not currently promoted publicly. Cites Lighthouse's real RLHF trit fields as an example of the pattern in production." },
    proof: { de: '781 Zeilen Rust, 14 Tests, MCP-Server gegen echten JSON-RPC-Handshake verifiziert.', en: '781 lines of Rust, 14 tests, MCP server verified against a live JSON-RPC handshake.' },
    technical: { de: 'Rust, MCP-SDK (rmcp).', en: 'Rust, MCP SDK (rmcp).' },
    connects: ['lighthouse', 'tis'],
    links: { github: 'https://github.com/rfi-irfos/bifp', crates: 'https://crates.io/crates/bifp-core' },
  },
  {
    key: 'albert-spores', name: 'albert-spores', zone: 'intelligence', status: 'OPERATIONAL',
    problem: { de: 'Ein Sprachmodell allein zu trainieren begrenzt, wie viel Rechenleistung überhaupt zur Verfügung steht.', en: 'Training a language model alone caps how much compute is ever available.' },
    why: { de: 'Statt auf eine einzelne teure GPU-Farm zu setzen, wollten wir Trainingsbeiträge von verteilten Mitwirkenden einsammeln.', en: 'Instead of relying on one expensive GPU farm, we wanted to collect training contributions from distributed collaborators.' },
    different: { de: "Checkpoint-Einreichungs-Protokoll für federiertes Gewicht-Sharing: Mitwirkende laden 'Spores' hoch, die beim nächsten Trainingszyklus in albert. eingemischt werden.", en: "A checkpoint-submission protocol for federated weight-sharing: contributors upload 'spores' that get blended into albert. at the next training cycle." },
    fit: { de: 'Intelligence-Schicht, Satellit von TIS - die eigentliche Trainings-Engine liegt dort, dieses Repo hält nur das Einreichungsprotokoll.', en: 'Intelligence layer, a satellite of TIS - the actual training engine lives there, this repo only holds the submission protocol.' },
    proof: { de: 'Aktiv genutzt, datierte Einreichungen mit sinkendem Loss über die Zeit (10.09 → 5.55).', en: 'Actively used, dated submissions with loss dropping over time (10.09 → 5.55).' },
    technical: { de: 'Python-Skripte + Git LFS für Checkpoint-Dateien.', en: 'Python scripts + Git LFS for checkpoint files.' },
    connects: ['albert', 'tis'],
    links: { github: 'https://github.com/rfi-irfos/albert-spores' },
  },
  {
    key: 'veo-framework', name: 'VEO Framework', zone: 'intelligence', status: 'EXPERIMENTAL',
    problem: { de: "Sprachmodelle bleiben meist im reinen 'Antwortmodus' und prüfen die eigene Argumentation nie wirklich.", en: "Language models usually stay in pure 'answer mode' and never genuinely examine their own reasoning." },
    why: { de: 'Aus einem beobachteten Einzelfall (ein langes Gespräch mit einem Custom-GPT) entstand die Frage, ob sich dieses Verhalten gezielt reproduzieren lässt.', en: 'One observed case (an extended dialogue with a custom GPT) raised the question of whether that behaviour could be deliberately reproduced.' },
    different: { de: 'Eine reine Prompting-Methodik, kein Code - verallgemeinert einen beobachteten Fall auf eine wiederholbare Technik.', en: 'A pure prompting methodology, no code - generalizes one observed case into a repeatable technique.' },
    fit: { de: 'Intelligence-Schicht, verwandt mit lauras-agents und call-laura nur über gemeinsame Forschungsherkunft, nicht über Code.', en: 'Intelligence layer, related to lauras-agents and call-laura only through shared research lineage, not code.' },
    proof: { de: 'Noch keine Code-Implementierung - reines Methodik-Dokument.', en: 'No code implementation yet - a pure methodology document.' },
    technical: { de: 'Kein Code, Markdown-Whitepaper.', en: 'No code, markdown whitepaper.' },
    connects: ['lauras-agents', 'call-laura'],
    links: { github: 'https://github.com/rfi-irfos/veo-framework' },
  },
  {
    key: 'dingir', name: 'DINGIR', zone: 'worldmodel', status: 'OPERATIONAL',
    problem: { de: 'Ein Sprachmodell beantwortet Fragen in Worten. Es verfolgt aber nicht, wie Entitäten in der physischen Welt tatsächlich zusammenhängen.', en: "A language model answers questions in words. It doesn't track how entities in the physical world actually connect." },
    why: { de: 'Untersuchungen scheiterten wiederholt, weil Evidenz in fünf getrennten Systemen lag, die nie miteinander sprachen - ein gemeinsames Weltmodell sollte das beenden.', en: 'Investigations kept stalling because evidence lived in five separate systems that never talked to each other - a shared world model was built to end that.' },
    different: { de: "Echter PyTorch-GNN mit getrackter Test-AUC, jede Aussage wird mit einem ternären Epistemic-State gestempelt. Albert ist bewusst eine 'explizite Naht': die Synthese-Funktion wirft absichtlich einen Fehler, statt einen Albert-Output vorzutäuschen, solange kein echtes Backend verdrahtet ist.", en: "A real PyTorch GNN with tracked test AUC, every claim gets stamped with a ternary epistemic state. Albert is deliberately an 'explicit seam': the synthesis function intentionally raises an error rather than faking an Albert output until a real backend is wired in." },
    fit: { de: 'Die World-Model-Schicht. Der Kern-Loop (ingest → reason → stamp → interim-synthesize) läuft; die native Ausführung auf Rusty Penguin ist eine separate, noch experimentelle Baustelle.', en: "The World Model layer. The core loop (ingest → reason → stamp → interim-synthesize) runs; native execution on Rusty Penguin is a separate, still-experimental piece." },
    proof: { de: '1.026 Knoten, 1.960 Kanten, 313 Beobachtungen aus 9 Datensätzen, mehrere selbst aufgedeckte und offen dokumentierte Mess-Fehler statt stillschweigend korrigierter Zahlen.', en: '1,026 nodes, 1,960 edges, 313 observations from 9 datasets, several self-caught and openly documented measurement errors instead of quietly corrected numbers.' },
    technical: { de: 'Python, PyTorch-GNN. Noch nicht öffentlich auf GitHub.', en: 'Python, PyTorch GNN. Not yet public on GitHub.' },
    connects: ['albert', 'rusty-penguin', 'tis'],
    links: {},
  },
  {
    key: 'coevolution-factory', name: 'CoEvolution Factory', zone: 'applications', status: 'OPERATIONAL',
    problem: { de: 'Compliance- und Risikoprüfung für viele Organisationen gleichzeitig lässt sich nicht mit Einzelaudits skalieren.', en: "Compliance and risk review for many organizations at once doesn't scale through one-off audits." },
    why: { de: 'Statt jede Prüfung einzeln zu vergeben, wollten wir eine Engine, die eigenständig laufende, spezialisierte Einheiten ausrollen kann.', en: 'Instead of assigning every review individually, we wanted an engine that could roll out independently running, specialized units.' },
    different: { de: 'Ruft lauras-agents als Engine, call-laura als Freigabe-Gate und pusht Umsatz-Telemetrie an Lighthouse - 50 live laufende, autonome KI-Zentren, aus einer gemeinsamen Konstitution skaliert.', en: 'Calls lauras-agents as its engine, call-laura as its approval gate, and pushes revenue telemetry to Lighthouse - 50 live, autonomous AI centers, scaled from one shared constitution.' },
    fit: { de: 'Applications-Schicht - der klarste Beleg im ganzen Stack, dass die Ebenen wirklich zusammenhängen: ohne lauras-agents läuft dieses System schlicht nicht.', en: "Applications layer - the clearest proof in the whole stack that the layers genuinely connect: this system simply doesn't run without lauras-agents." },
    proof: { de: '12.143 Zeilen Python, echter Selbstverbesserungs-Loop mit call-laura als finalem Ship-Gate, tägliche Cron-Re-Optimierung.', en: '12,143 lines of Python, a real self-improvement loop with call-laura as the final ship gate, daily cron re-optimization.' },
    technical: { de: 'Python, aiohttp, Docker/Fly.', en: 'Python, aiohttp, Docker/Fly.' },
    connects: ['lauras-agents', 'call-laura', 'lighthouse'],
    links: { github: 'https://github.com/rfi-irfos/coevolution-factory', live: 'https://coevolution-factory-sparkling-mountain-1802.fly.dev' },
  },
  {
    key: 'aladdin-mini', name: 'aladdin-mini', zone: 'applications', status: 'OPERATIONAL',
    problem: { de: 'Wenn ein Sicherheitsfund öffentlich wird, reagiert der Markt oft messbar - aber niemand außerhalb großer Fonds modelliert das systematisch.', en: "When a security finding goes public, the market often reacts measurably - but nobody outside large funds models that systematically." },
    why: { de: 'BlackRocks Version davon heißt Aladdin und verwaltet 21 Billionen Dollar. Wir wollten zeigen, dass dasselbe Prinzip auch offen und kostenlos geht.', en: "BlackRock's version of this is called Aladdin and manages $21 trillion. We wanted to show the same principle works open and free too." },
    different: { de: 'Trading-Signal-Engine, direkt an unseren eigenen Disclosure-Rhythmus gekoppelt - inklusive unserer eigenen Funde, erst nach Ablauf der 90-Tage-Sperrfrist.', en: 'A trading-signal engine directly coupled to our own disclosure rhythm - including our own findings, only after the 90-day embargo lifts.' },
    fit: { de: 'Applications-Schicht, weitgehend eigenständig.', en: 'Applications layer, largely standalone.' },
    proof: { de: '3.488 Zeilen Python, Architektur deckt sich 1:1 mit der eigenen Dokumentation.', en: '3,488 lines of Python, architecture matches its own documentation 1:1.' },
    technical: { de: 'Python, MetaTrader5, Bayes\'sche Netze.', en: 'Python, MetaTrader5, Bayesian networks.' },
    connects: [],
    links: { github: 'https://github.com/rfi-irfos/aladdin-mini' },
  },
  {
    key: 'lighthouse', name: 'Lighthouse', zone: 'applications', status: 'OPERATIONAL',
    problem: { de: 'Die meisten Institute kaufen ihren SaaS-Stack (E-Mail, CRM, Buchhaltung) stückweise von Drittanbietern ein - und geben damit die Kontrolle über die eigenen Daten ab.', en: "Most institutes buy their SaaS stack (email, CRM, accounting) piecemeal from third parties - handing away control of their own data." },
    why: { de: 'Wir wollten, dass niemand außer uns unsere eigenen Betriebsdaten sieht, ohne auf ein funktionierendes Workplace-OS zu verzichten.', en: 'We wanted nobody but us to see our own operational data, without giving up a working workplace OS.' },
    different: { de: 'Eine einzige selbst gehostete Rust-+-React-Binärdatei für das gesamte Institut. Der "ternary-native"-Anspruch ist im Code belegt, nicht nur behauptet: echte Trit-Felder in Produktions-DB-Schemas (BIFP-Signale, RLHF-Bewertungen von albert.-Outputs).', en: 'One self-hosted Rust + React binary for the entire institute. The "ternary-native" claim is substantiated in code, not just asserted: real trit fields in production DB schemas (BIFP signals, RLHF ratings of albert. outputs).' },
    fit: { de: 'Applications-Schicht, funktioniert als Kontrollturm: zieht Live-Daten von TIS und trackt Aktivität anderer RFI-Repos.', en: 'Applications layer, functions as a control tower: pulls live data from TIS and tracks activity across other RFI repos.' },
    proof: { de: '191 Quelldateien, live deployed, ausführliche Betriebsdokumentation.', en: '191 source files, live deployed, extensive operational documentation.' },
    technical: { de: 'Rust/axum-Backend, React/TypeScript-Frontend, SQLite. Privates Repo.', en: 'Rust/axum backend, React/TypeScript frontend, SQLite. Private repo.' },
    connects: ['bifp', 'albert', 'coevolution-factory'],
    links: { live: 'https://ternlang.com/lighthouse' },
  },
  {
    key: 'laura', name: 'LAURA', zone: 'applications', status: 'OPERATIONAL',
    problem: { de: 'Wenn jemand unbefugt physischen Zugriff auf ein Handy bekommt (NFC/Bluetooth-Nahbereich), merkt man das meistens gar nicht.', en: 'When someone gets unauthorized physical (NFC/Bluetooth proximity) access to a phone, you usually never know it happened.' },
    why: { de: 'Klassische Canary-Token-Dienste decken diesen Angriffsweg nicht ab, und wir wollten kein Hack-back-Tool, nur einen Beleg.', en: "Classic canary-token services don't cover this attack path, and we wanted no hack-back tool, only proof." },
    different: { de: 'Köder-Fotoordner lösen beim unbefugten Öffnen nur ein passives Signal aus - kein Exploit, kein Gerätezugriff, ein Mensch prüft jeden Treffer manuell.', en: 'Bait photo folders fire only a passive signal when opened without consent - no exploit, no device access, a human reviews every hit manually.' },
    fit: { de: 'Applications-Schicht, geteilte Design-Sprache mit lauras-port-proxy, kein geteilter Code.', en: 'Applications layer, shares design language with lauras-port-proxy, no shared code.' },
    proof: { de: 'Live deployed (Rust/Axum-Backend auf Fly, Python-Scanner-Paket), reale Test-Suite.', en: 'Live deployed (Rust/Axum backend on Fly, Python scanner package), real test suite.' },
    technical: { de: 'Rust/Axum + SQLite Backend, Python-Scanner.', en: 'Rust/Axum + SQLite backend, Python scanner.' },
    connects: ['lauras-port-proxy', 'eil'],
    links: { github: 'https://github.com/rfi-irfos/laura', live: 'https://rfi-irfos.github.io/laura' },
  },
  {
    key: 'invisible-layer', name: 'invisible layer', zone: 'applications', status: 'OPERATIONAL',
    problem: { de: 'Die meisten Menschen wissen nicht, welche Sensoren ihr eigenes Handy im Hintergrund tatsächlich nutzt.', en: "Most people don't know which sensors their own phone is actually using in the background." },
    why: { de: 'Wir wollten das direkt erlebbar machen, ohne App-Installation oder Konto, damit niemand uns einfach glauben muss.', en: "We wanted this directly experienceable, no app install, no account, so nobody has to just take our word for it." },
    different: { de: '44 eigenständige, browserbasierte Experimente, die echte Sensor-/Browser-APIs live abfragen und sofort zeigen, was passiert.', en: "44 self-contained, browser-based experiments that query real sensor/browser APIs live and show exactly what's happening." },
    fit: { de: 'Applications-Schicht, Geschwisterprojekt zu lauras-port-proxy.', en: 'Applications layer, sibling project to lauras-port-proxy.' },
    proof: { de: '65 Dateien, vollständig funktionsfähige PWA, mehrsprachig (DE/EN/FR).', en: '65 files, fully working PWA, multilingual (DE/EN/FR).' },
    technical: { de: 'reines HTML/CSS/JS, kein Build-Schritt.', en: 'pure HTML/CSS/JS, no build step.' },
    connects: ['lauras-port-proxy'],
    links: { github: 'https://github.com/rfi-irfos/invisible-layer', live: 'https://rfi-irfos.github.io/invisible-layer' },
  },
  {
    key: 'lauras-port-proxy', name: 'rfi-irfos port prox', zone: 'applications', status: 'OPERATIONAL',
    problem: { de: 'Ein Browser kann die offenen Ports eines Geräts nicht wirklich ermitteln oder schließen - viele Tools behaupten trotzdem genau das.', en: "A browser can't really determine or close a device's open ports - many tools claim to do exactly that anyway." },
    why: { de: 'Wir wollten ein Tool, das nie eine Fähigkeit vortäuscht, die die Plattform gar nicht hat.', en: "We wanted a tool that never fakes a capability the platform doesn't actually have." },
    different: { de: 'Echte WebSocket-Connect-Timing-Probe gegen localhost statt vorgetäuschtem Scan, zeigt echte OS-spezifische Terminal-Befehle statt eines falschen "Schließen"-Buttons.', en: "A real WebSocket connect-timing probe against localhost instead of a fake scan, shows real per-OS terminal commands instead of a fake \"close\" button." },
    fit: { de: 'Applications-Schicht, Geschwisterprojekt zu invisible layer.', en: 'Applications layer, sibling project to invisible layer.' },
    proof: { de: 'Klein aber vollständig, 11 Dateien, echte Timing-Probe-Logik implementiert.', en: 'Small but complete, 11 files, real timing-probe logic implemented.' },
    technical: { de: 'reines HTML/CSS/JS, kein Build-Schritt.', en: 'pure HTML/CSS/JS, no build step.' },
    connects: ['invisible-layer', 'eil'],
    links: { github: 'https://github.com/rfi-irfos/lauras-port-proxy' },
  },
  {
    key: 'foodchain-analysis', name: 'NFCS', zone: 'applications', status: 'OPERATIONAL',
    problem: { de: 'Das globale Ernährungssystem produziert rechnerisch genug Kalorien für alle - trotzdem hungert fast eine Milliarde Menschen.', en: "The global food system mathematically produces enough calories for everyone - yet nearly a billion people go hungry." },
    why: { de: 'Wir wollten belegen, ob diese Knappheit physikalisch bedingt ist oder organisatorisch entsteht, statt es nur zu behaupten.', en: "We wanted to prove whether this scarcity is physically necessary or organizationally manufactured, not just assert it." },
    different: { de: 'Agentenbasiertes Modell, das den Rückgang von 1,64-fachem Kalorienüberschuss auf ~0,94x durch Nachernteverlust, Verarbeitungsverschwendung und Zugangsbarrieren nachrechnet, mit Sobol-Sensitivitätsanalyse.', en: 'An agent-based model computing the collapse from a 1.64x caloric surplus down to ~0.94x through post-harvest loss, processing waste, and access barriers, with Sobol sensitivity analysis.' },
    fit: { de: 'Applications-Schicht, eigenständige Forschung.', en: 'Applications layer, standalone research.' },
    proof: { de: 'Interaktives Dashboard, ABC-Parameterschätzung, reproduzierbare Python-Simulation.', en: 'Interactive dashboard, ABC parameter estimation, reproducible Python simulation.' },
    technical: { de: 'Python (numpy/scipy), statisches HTML-Dashboard.', en: 'Python (numpy/scipy), static HTML dashboard.' },
    connects: [],
    links: { github: 'https://github.com/rfi-irfos/foodchain-analysis', live: 'https://rfi-irfos.github.io/foodchain-analysis' },
  },
  {
    key: 'ginie', name: 'Ginie', zone: 'applications', status: 'OPERATIONAL',
    problem: { de: 'KI-Assistenten setzen fast immer eine Cloud-Verbindung voraus - offline und wirklich portabel ist selten.', en: "AI assistants almost always assume a cloud connection - genuinely offline and portable is rare." },
    why: { de: 'Wir wollten einen KI-Assistenten, der komplett vom USB-Stick läuft, ohne irgendetwas auf dem Host-Rechner zu installieren.', en: 'We wanted an AI assistant that runs entirely from a USB stick, installing nothing on the host machine.' },
    different: { de: 'Bringt ihr eigenes Ollama-Modell mit, läuft vollständig offline. Nutzt bewusst ein generisches Qwen-Modell, nicht albert.', en: 'Brings its own Ollama model, runs fully offline. Deliberately uses a generic Qwen model, not albert.' },
    fit: { de: 'Applications-Schicht, architektonisch eigenständig - keine Verbindung zum übrigen Stack.', en: 'Applications layer, architecturally standalone - no connection to the rest of the stack.' },
    proof: { de: '2.652-Zeilen-GTK3-App, funktionierendes System-Tray, Sprach-Eingabe, Desktop-Pet-Animation.', en: '2,652-line GTK3 app, working system tray, voice input, desktop-pet animation.' },
    technical: { de: 'Python, GTK3/PyGObject, portables Ollama.', en: 'Python, GTK3/PyGObject, portable Ollama.' },
    connects: [],
    links: { github: 'https://github.com/rfi-irfos/ginie' },
  },
  {
    key: 'eil', name: 'Emergent Interaction Lab', zone: 'applications', status: 'OPERATIONAL',
    problem: { de: 'Forschung zu Mensch-KI-Interaktion braucht eine echte Plattform, nicht nur einzelne Paper - sonst bleibt sie unzugänglich.', en: 'Human-AI interaction research needs a real platform, not just individual papers - otherwise it stays inaccessible.' },
    why: { de: 'Unser Kooperationspartner Laura Serna Gaviria brauchte eine eigene Forschungs- und Produktplattform für ihre Human-AI-Co-Evolution-Methode.', en: 'Our coop partner Laura Serna Gaviria needed her own research and product platform for her Human-AI Co-Evolution method.' },
    different: { de: 'Vollständige Full-Stack-Plattform mit eigenem RAG-Forschungsagenten (Jarvis), zieht live Daten von coevolution-factory und stellt selbst einen MCP-Server für Hermes bereit.', en: 'A full-stack platform with its own RAG research agent (Jarvis), pulls live data from coevolution-factory, and exposes its own MCP server for Hermes integration.' },
    fit: { de: 'Applications-Schicht, funktioniert faktisch als Forschungs-Hub, den andere Systeme referenzieren.', en: 'Applications layer, functions as the research hub other systems reference.' },
    proof: { de: '42.400+ Zeilen Code (Rust-Backend + TypeScript-Frontend), live deployed mit Stripe-Billing und OAuth2.', en: '42,400+ lines of code (Rust backend + TypeScript frontend), live deployed with Stripe billing and OAuth2.' },
    technical: { de: 'Rust/axum, React/TypeScript, SQLite.', en: 'Rust/axum, React/TypeScript, SQLite.' },
    connects: ['coevolution-factory', 'lauras-agents', 'call-laura', 'laura', 'lauras-port-proxy'],
    links: { github: 'https://github.com/rfi-irfos/emergent-interaction-lab', live: 'https://emergent-interaction-lab.fly.dev' },
  },
]

export function getSystem(key: string): SystemCard | undefined {
  return SYSTEMS.find(s => s.key === key)
}
