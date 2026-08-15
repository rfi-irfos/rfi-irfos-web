// Full repo/crate directory (restored 2026-08-15, live feedback: the zone-grouped
// System Card modal in content/systems.ts covers 21 curated systems with real
// depth, but the footer should still show everything, not just the curated set -
// "alle trophies"). Every entry below now gets its own modal too (live feedback,
// same day: "jetzt müss alles in modale umgesetzt werden") - `key` maps 1:1 to a
// SYSTEMS entry in content/systems.ts. Prefixed by source (`rfi-`/`simeon-`/
// `crate-`) since a few repo names repeat across the two GitHub accounts
// (RuVector is forked into both) and would otherwise collide.
//
// Deliberately excludes the 21 originally-curated repos/crates already
// represented as a top-tier SYSTEMS entry (content/systems.ts) - PublicSite.tsx
// filters those out at render time rather than this file hand-maintaining two
// overlapping lists.
//
// Snapshot pulled via `gh repo list <org|user> --json name,isPrivate,url` on
// 2026-08-14 (repos) and the crates.io API on 2026-08-15 (crates) - only public
// repos are listed (a linked private repo 404s for a visitor who isn't a
// collaborator). Will drift as repos/crates are added - re-pull periodically.
export type RepoLink = { n: string; u: string; key: string }

export const RFI_REPOS: RepoLink[] = [
  { n: '.github', u: 'https://github.com/rfi-irfos/.github', key: 'rfi-github-profile' },
  { n: '13', u: 'https://github.com/rfi-irfos/13', key: 'rfi-13' },
  { n: 'auto-bayesian', u: 'https://github.com/rfi-irfos/auto-bayesian', key: 'rfi-auto-bayesian' },
  { n: 'autoguardrails', u: 'https://github.com/rfi-irfos/autoguardrails', key: 'rfi-autoguardrails' },
  { n: 'causal-perception-implementation', u: 'https://github.com/rfi-irfos/causal-perception-implementation', key: 'rfi-causal-perception-implementation' },
  { n: 'e-techbike-at', u: 'https://github.com/rfi-irfos/e-techbike-at', key: 'rfi-e-techbike-at' },
  { n: 'gen-fraud-graph', u: 'https://github.com/rfi-irfos/gen-fraud-graph', key: 'rfi-gen-fraud-graph' },
  { n: 'genesis', u: 'https://github.com/rfi-irfos/genesis', key: 'rfi-genesis' },
  { n: 'genetic-algorithm', u: 'https://github.com/rfi-irfos/genetic-algorithm', key: 'rfi-genetic-algorithm' },
  { n: 'linear-adapter-trainer', u: 'https://github.com/rfi-irfos/linear-adapter-trainer', key: 'rfi-linear-adapter-trainer' },
  { n: 'llm_bridge', u: 'https://github.com/rfi-irfos/llm_bridge', key: 'rfi-llm-bridge' },
  { n: 'mech-gov-framework', u: 'https://github.com/rfi-irfos/mech-gov-framework', key: 'rfi-mech-gov-framework' },
  { n: 'mutatis-mutandis', u: 'https://github.com/rfi-irfos/mutatis-mutandis', key: 'rfi-mutatis-mutandis' },
  { n: 'nikoletta-tutor', u: 'https://github.com/rfi-irfos/nikoletta-tutor', key: 'rfi-nikoletta-tutor' },
  { n: 'ntpsec', u: 'https://github.com/rfi-irfos/ntpsec', key: 'rfi-ntpsec' },
  { n: 'p2p-repository', u: 'https://github.com/rfi-irfos/p2p-repository', key: 'rfi-p2p-repository' },
  { n: 'ralph', u: 'https://github.com/rfi-irfos/ralph', key: 'rfi-ralph' },
  { n: 'ralph-vault-skill', u: 'https://github.com/rfi-irfos/ralph-vault-skill', key: 'rfi-ralph-vault-skill' },
  { n: 'rfi-irfos-web', u: 'https://github.com/rfi-irfos/rfi-irfos-web', key: 'rfi-irfos-web' },
  { n: 'RuVector', u: 'https://github.com/rfi-irfos/RuVector', key: 'rfi-ruvector' },
  { n: 'sota-stressed-datasets', u: 'https://github.com/rfi-irfos/sota-stressed-datasets', key: 'rfi-sota-stressed-datasets' },
  { n: 'ternary-intelligence-stack-genesis-archive', u: 'https://github.com/rfi-irfos/ternary-intelligence-stack-genesis-archive', key: 'rfi-tis-genesis-archive' },
]

export const SIMEON_REPOS: RepoLink[] = [
  { n: 'abliterator', u: 'https://github.com/simeon-kepp/abliterator', key: 'simeon-abliterator' },
  { n: 'albert-strategy-orchestrator', u: 'https://github.com/simeon-kepp/albert-strategy-orchestrator', key: 'simeon-albert-strategy-orchestrator' },
  { n: 'ansible', u: 'https://github.com/simeon-kepp/ansible', key: 'simeon-ansible' },
  { n: 'api-guidelines', u: 'https://github.com/simeon-kepp/api-guidelines', key: 'simeon-api-guidelines' },
  { n: 'api-registry', u: 'https://github.com/simeon-kepp/api-registry', key: 'simeon-api-registry' },
  { n: 'awesome-go', u: 'https://github.com/simeon-kepp/awesome-go', key: 'simeon-awesome-go' },
  { n: 'awesome-iOS-security-tools', u: 'https://github.com/simeon-kepp/awesome-iOS-security-tools', key: 'simeon-awesome-ios-security-tools' },
  { n: 'awesome-mac', u: 'https://github.com/simeon-kepp/awesome-mac', key: 'simeon-awesome-mac' },
  { n: 'awesome-python', u: 'https://github.com/simeon-kepp/awesome-python', key: 'simeon-awesome-python' },
  { n: 'awesome-scalability', u: 'https://github.com/simeon-kepp/awesome-scalability', key: 'simeon-awesome-scalability' },
  { n: 'bazaarak', u: 'https://github.com/simeon-kepp/bazaarak', key: 'simeon-bazaarak' },
  { n: 'burn', u: 'https://github.com/simeon-kepp/burn', key: 'simeon-burn' },
  { n: 'candle', u: 'https://github.com/simeon-kepp/candle', key: 'simeon-candle' },
  { n: 'committers.top', u: 'https://github.com/simeon-kepp/committers.top', key: 'simeon-committers-top' },
  { n: 'crewAI', u: 'https://github.com/simeon-kepp/crewAI', key: 'simeon-crewai' },
  { n: 'cybersecurity-SOAR', u: 'https://github.com/simeon-kepp/cybersecurity-SOAR', key: 'simeon-cybersecurity-soar' },
  { n: 'deutsch-lernen-pwa', u: 'https://github.com/simeon-kepp/deutsch-lernen-pwa', key: 'simeon-deutsch-lernen-pwa' },
  { n: 'dynamodb-toolbox', u: 'https://github.com/simeon-kepp/dynamodb-toolbox', key: 'simeon-dynamodb-toolbox' },
  { n: 'flax', u: 'https://github.com/simeon-kepp/flax', key: 'simeon-flax' },
  { n: 'foodsharing', u: 'https://github.com/simeon-kepp/foodsharing', key: 'simeon-foodsharing' },
  { n: 'frida-ipa-extract', u: 'https://github.com/simeon-kepp/frida-ipa-extract', key: 'simeon-frida-ipa-extract' },
  { n: 'frida-tools', u: 'https://github.com/simeon-kepp/frida-tools', key: 'simeon-frida-tools' },
  { n: 'github-mcp-server', u: 'https://github.com/simeon-kepp/github-mcp-server', key: 'simeon-github-mcp-server' },
  { n: 'hermes-agent', u: 'https://github.com/simeon-kepp/hermes-agent', key: 'simeon-hermes-agent' },
  { n: 'hermes-agent-bundle', u: 'https://github.com/simeon-kepp/hermes-agent-bundle', key: 'simeon-hermes-agent-bundle' },
  { n: 'hermes-bundle', u: 'https://github.com/simeon-kepp/hermes-bundle', key: 'simeon-hermes-bundle' },
  { n: 'hermes-setup', u: 'https://github.com/simeon-kepp/hermes-setup', key: 'simeon-hermes-setup' },
  { n: 'iOS-Binary-Security-Analyzer', u: 'https://github.com/simeon-kepp/iOS-Binary-Security-Analyzer', key: 'simeon-ios-binary-security-analyzer' },
  { n: 'jadx', u: 'https://github.com/simeon-kepp/jadx', key: 'simeon-jadx' },
  { n: 'jupyterlab_pygments', u: 'https://github.com/simeon-kepp/jupyterlab_pygments', key: 'simeon-jupyterlab-pygments' },
  { n: 'keras', u: 'https://github.com/simeon-kepp/keras', key: 'simeon-keras' },
  { n: 'linguist', u: 'https://github.com/simeon-kepp/linguist', key: 'simeon-linguist' },
  { n: 'llama.cpp', u: 'https://github.com/simeon-kepp/llama.cpp', key: 'simeon-llama-cpp' },
  { n: 'lunar-phase-calendar', u: 'https://github.com/simeon-kepp/lunar-phase-calendar', key: 'simeon-lunar-phase-calendar' },
  { n: 'MixedRadixCircuitSynthesis', u: 'https://github.com/simeon-kepp/MixedRadixCircuitSynthesis', key: 'simeon-mixed-radix-circuit-synthesis' },
  { n: 'ML-From-Scratch', u: 'https://github.com/simeon-kepp/ML-From-Scratch', key: 'simeon-ml-from-scratch' },
  { n: 'netron', u: 'https://github.com/simeon-kepp/netron', key: 'simeon-netron' },
  { n: 'OntologyScope', u: 'https://github.com/simeon-kepp/OntologyScope', key: 'simeon-ontologyscope' },
  { n: 'openapi-to-graphql', u: 'https://github.com/simeon-kepp/openapi-to-graphql', key: 'simeon-openapi-to-graphql' },
  { n: 'osiris', u: 'https://github.com/simeon-kepp/osiris', key: 'simeon-osiris' },
  { n: 'pocketbase', u: 'https://github.com/simeon-kepp/pocketbase', key: 'simeon-pocketbase' },
  { n: 'PowerToys', u: 'https://github.com/simeon-kepp/PowerToys', key: 'simeon-powertoys' },
  { n: 'python-ternary', u: 'https://github.com/simeon-kepp/python-ternary', key: 'simeon-python-ternary' },
  { n: 'ResonanceFlow', u: 'https://github.com/simeon-kepp/ResonanceFlow', key: 'simeon-resonanceflow' },
  { n: 'rfi-labs-arcade', u: 'https://github.com/simeon-kepp/rfi-labs-arcade', key: 'simeon-rfi-labs-arcade' },
  { n: 'ruflo', u: 'https://github.com/simeon-kepp/ruflo', key: 'simeon-ruflo' },
  { n: 'RuVector', u: 'https://github.com/simeon-kepp/RuVector', key: 'simeon-ruvector' },
  { n: 'RuView', u: 'https://github.com/simeon-kepp/RuView', key: 'simeon-ruview' },
  { n: 'rvllm', u: 'https://github.com/simeon-kepp/rvllm', key: 'simeon-rvllm' },
  { n: 'simeon-kepp', u: 'https://github.com/simeon-kepp/simeon-kepp', key: 'simeon-github-profile' },
  { n: 'SoftwareSystemsEngineering', u: 'https://github.com/simeon-kepp/SoftwareSystemsEngineering', key: 'simeon-software-systems-engineering' },
  { n: 'sparc', u: 'https://github.com/simeon-kepp/sparc', key: 'simeon-sparc' },
  { n: 'Synaptic-Mesh', u: 'https://github.com/simeon-kepp/Synaptic-Mesh', key: 'simeon-synaptic-mesh' },
  { n: 'tensorflow', u: 'https://github.com/simeon-kepp/tensorflow', key: 'simeon-tensorflow' },
  { n: 'tensorzero', u: 'https://github.com/simeon-kepp/tensorzero', key: 'simeon-tensorzero' },
  { n: 'Termix', u: 'https://github.com/simeon-kepp/Termix', key: 'simeon-termix' },
  { n: 'TernaryMoralLogic', u: 'https://github.com/simeon-kepp/TernaryMoralLogic', key: 'simeon-ternary-moral-logic' },
  { n: 'TernCore-Silicon', u: 'https://github.com/simeon-kepp/TernCore-Silicon', key: 'simeon-terncore-silicon' },
  { n: 'TernVector', u: 'https://github.com/simeon-kepp/TernVector', key: 'simeon-ternvector' },
  { n: 'the-book-of-secret-knowledge', u: 'https://github.com/simeon-kepp/the-book-of-secret-knowledge', key: 'simeon-book-of-secret-knowledge' },
  { n: 'tinygrad', u: 'https://github.com/simeon-kepp/tinygrad', key: 'simeon-tinygrad' },
  { n: 'top-github-users', u: 'https://github.com/simeon-kepp/top-github-users', key: 'simeon-top-github-users' },
  { n: 'wayfinder', u: 'https://github.com/simeon-kepp/wayfinder', key: 'simeon-wayfinder' },
  { n: 'xlstm', u: 'https://github.com/simeon-kepp/xlstm', key: 'simeon-xlstm' },
]

// All 47 published crates.io packages (live-verified 2026-08-15) - the 12 with
// glosses in a top-tier SYSTEMS entry are excluded here (rendered via that
// modal instead).
export const CRATES: RepoLink[] = [
  { n: 'ternlang-ml', u: 'https://crates.io/crates/ternlang-ml', key: 'crate-ternlang-ml' },
  { n: 'ternlang-runtime', u: 'https://crates.io/crates/ternlang-runtime', key: 'crate-ternlang-runtime' },
  { n: 'ternlang-hdl', u: 'https://crates.io/crates/ternlang-hdl', key: 'crate-ternlang-hdl' },
  { n: 'moe-llb', u: 'https://crates.io/crates/moe-llb', key: 'crate-moe-llb' },
  { n: 'ternlang-cli', u: 'https://crates.io/crates/ternlang-cli', key: 'crate-ternlang-cli' },
  { n: 'ternlang-lsp', u: 'https://crates.io/crates/ternlang-lsp', key: 'crate-ternlang-lsp' },
  { n: 'ternlang-mcp', u: 'https://crates.io/crates/ternlang-mcp', key: 'crate-ternlang-mcp' },
  { n: 'moe-platform', u: 'https://crates.io/crates/moe-platform', key: 'crate-moe-platform' },
  { n: 'ternlang-compat', u: 'https://crates.io/crates/ternlang-compat', key: 'crate-ternlang-compat' },
  { n: 'moe-plugin-sdk', u: 'https://crates.io/crates/moe-plugin-sdk', key: 'crate-moe-plugin-sdk' },
  { n: 'ternpkg', u: 'https://crates.io/crates/ternpkg', key: 'crate-ternpkg' },
  { n: 'ternlang-codegen', u: 'https://crates.io/crates/ternlang-codegen', key: 'crate-ternlang-codegen' },
  { n: 'ternlang-test', u: 'https://crates.io/crates/ternlang-test', key: 'crate-ternlang-test' },
  { n: 'ternlang-compress', u: 'https://crates.io/crates/ternlang-compress', key: 'crate-ternlang-compress' },
  { n: 'moe-runtime', u: 'https://crates.io/crates/moe-runtime', key: 'crate-moe-runtime' },
  { n: 'moe-reference', u: 'https://crates.io/crates/moe-reference', key: 'crate-moe-reference' },
  { n: 'moe-ddel', u: 'https://crates.io/crates/moe-ddel', key: 'crate-moe-ddel' },
  { n: 'moe-sdk', u: 'https://crates.io/crates/moe-sdk', key: 'crate-moe-sdk' },
  { n: 'pytern', u: 'https://crates.io/crates/pytern', key: 'crate-pytern' },
  { n: 'ternaudit-guard', u: 'https://crates.io/crates/ternaudit-guard', key: 'crate-ternaudit-guard' },
  { n: 'moe-llm-core', u: 'https://crates.io/crates/moe-llm-core', key: 'crate-moe-llm-core' },
  { n: 'moe-compute', u: 'https://crates.io/crates/moe-compute', key: 'crate-moe-compute' },
  { n: 'moe-uril', u: 'https://crates.io/crates/moe-uril', key: 'crate-moe-uril' },
  { n: 'moe-validation-suite', u: 'https://crates.io/crates/moe-validation-suite', key: 'crate-moe-validation-suite' },
  { n: 'albert-reference', u: 'https://crates.io/crates/albert-reference', key: 'crate-albert-reference' },
  { n: 'lauras-team', u: 'https://crates.io/crates/lauras-team', key: 'crate-lauras-team' },
  { n: 'call-laura-core', u: 'https://crates.io/crates/call-laura-core', key: 'crate-call-laura-core' },
  { n: 'moe-test', u: 'https://crates.io/crates/moe-test', key: 'crate-moe-test' },
  { n: 'ternary-core', u: 'https://crates.io/crates/ternary-core', key: 'crate-ternary-core' },
  { n: 'lauras-mcp', u: 'https://crates.io/crates/lauras-mcp', key: 'crate-lauras-mcp' },
  { n: 'ternlang-api', u: 'https://crates.io/crates/ternlang-api', key: 'crate-ternlang-api' },
  { n: 'lauras-api', u: 'https://crates.io/crates/lauras-api', key: 'crate-lauras-api' },
  { n: 'laura-mcp', u: 'https://crates.io/crates/laura-mcp', key: 'crate-laura-mcp' },
  { n: 'albert-compat', u: 'https://crates.io/crates/albert-compat', key: 'crate-albert-compat' },
  { n: 'albert-tools', u: 'https://crates.io/crates/albert-tools', key: 'crate-albert-tools' },
  { n: 'albert-commands', u: 'https://crates.io/crates/albert-commands', key: 'crate-albert-commands' },
]
export const CRATES_IO_PROFILE = 'https://crates.io/users/simeon-kepp'
