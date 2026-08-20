// Single source-of-truth English content object for the homepage (PublicSite.tsx
// + components/sections/*.tsx). Every string here was moved VERBATIM out of the
// already-shipped, approved English copy - nothing was rewritten or "cleaned up"
// during extraction. `de.ts` implements the same `Content` shape (checked via
// `DE: Content = {...}`), so a missing/renamed key is a compile error there.
//
// Deliberately left OUT of this content layer (per the i18n task's own scope
// call): the Track Record ledger's row data (AUDIT_HIGHLIGHTS/AUDIT_META/
// AUDIT_STATUTES in TrackRecord.tsx - 300+ real disclosure rows, English-only),
// STATUS_META's status codes (WAITING/ACK/RESOLVED/etc - technical ledger
// vocabulary, not prose), raw numbers/prices/ISO citations/emails/URLs, and the
// WKO footer SVG.

// Reused verbatim across every NDA-bearing security tier so the confidentiality
// scope (methodology private, finding still publishes after the 90-day embargo)
// is maintained in one place, not copy-pasted per tier.
const NDA_CLAUSE = "What's confidential, and what isn't: our methodology stays private under this agreement, the finding does not. Under an NDA you see the how, not only the what: every step we took, the tools we used, and the intellectual property behind our own process, which is exactly why an NDA is what covers it, we are disclosing our internal process to you. The finding itself is still published on our public ledger after the standard 90-day embargo, the same as for every organization we assess - payment changes when your team gets the detail, never whether the public does."

export const EN = {
  nav: {
    links: {
      research: 'Research',
      projects: 'Systems',
      trackRecord: 'Evidence',
      pricing: 'Access',
      submit: 'Submit',
    },
    themeLabel: { light: 'Light', dark: 'Dark', hc: 'High contrast' } as Record<'light' | 'dark' | 'hc', string>,
    themeTitle: (label: string) => `Theme: ${label} (click to switch)`,
    themeAria: (label: string) => `Current theme ${label}, click to switch theme`,
    menuAria: 'Menu',
    localeTitle: (label: string) => `Language: ${label} (click to switch)`,
    localeAria: (label: string) => `Current language ${label}, click to switch language`,
  },

  hero: {
    headline: 'Rethink the Obvious.',
    headlineEmphasisIndex: 2,
    subtitlePrefix: 'Interdisciplinary',
    subtitleSuffix: ' Research Facility for Open Sciences',
    identity: 'We craft what holds under load and expose what was destined to fail. No theater, no high-visibility vests.',
    stats: {
      researchAreas: 'research areas',
      researchAreasSub: 'combined',
      openSourceProjects: 'systems',
      openSourceProjectsSub: 'working together',
      dataPointsMonitored: 'data points monitored',
      worldModel: 'evidence-first ML world model',
      agents: 'specialized agents',
    },
    ctaTrackRecord: 'Track Record',
    ctaBookUs: 'Book us!',
  },

  research: {
    eyebrow: 'Areas of Magnification',
    heading: 'where our attention falls',
    subheading: 'How complex systems behave: how evidence becomes structure, how relationships change over time, and where one butterfly can move an entire network.',
    areas: [
      { title: 'Ethics & Minor Protection', plain: 'The children on the other side of this screen inherit the world we are building now. One day, they will have to live in it, shape it, and carry it forward. That is why we start here.', desc: 'We build systems whose consequences can last far longer than the people who build them. A child does not choose the data systems, technologies or infrastructure that shape their environment, yet they will live with what those systems become. Minor protection makes that responsibility concrete. We look at what happens before consent, before the interface, before anyone notices: which SDKs activate, what data moves, and which decisions are already being made.\n\nWe test those systems against real consent flows, real technical behaviour and the COPPA and GDPR Article 8 findings already documented on our public ledger. The principle is simple: what we build today must remain defensible to the people who inherit it tomorrow.', nextLabel: 'The Ground Everything Else Stands On' },
      { title: 'Ternary AI & Computing', plain: 'A binary system must choose yes or no even when the evidence lives somewhere in between. Ternary gives that uncertainty a state of its own: −1, 0, +1. Not everything has to be decided immediately, and uncertainty does not have to become false certainty just to make a decision possible.', desc: 'We wanted computing that could work with that uncertainty instead of discarding it before the decision. The third state gives unresolved, unobservable or contradictory information somewhere real to live. That changes more than representation. It changes system behaviour: sometimes the safest and most intelligent action is to wait.\n\nThat is why we built Ternlang, our own programming language directly on the {-1, 0, +1} trit. It now forms the runtime on which albert. is trained and coordinates our production agent swarm. Ternary computing is not a thought experiment for us. It is an architecture we are already running. Patent pending A50296/2026.', nextLabel: 'Trits Power the World Model' },
      { title: 'World Models & Cross-Domain Intelligence', plain: 'A language model can describe a supply chain perfectly and still miss that a failure at the other end of the network will shut down a factory days later. A world model holds those relationships themselves: states, dependencies, changes, and what follows from them.', desc: 'We kept running into investigations where the decisive evidence was scattered across systems. A signal lived in one place, its cause in another, and the connection only became visible after the damage had already happened. That is the gap we want to close.\n\nAlongside albert., our language model, we are building Dingir, our own world model for the physical world. It connects observations across time, geography and domains and follows changes into the systems they can actually affect. Not as a collection of documents, but as a continuously evolving model of the systems that connect our world.', nextLabel: 'One Model, Every Pattern' },
      { title: 'Pattern Recognition & Impact Propagation', plain: 'Harm usually arrives three systems downstream of wherever anyone happened to be looking, quietly, long before the connection is obvious. When one system shifts, we flag which others it reaches - before somebody has to find that out by hand.', desc: 'A single overlooked dependency has caused real harm before, quietly, three systems downstream of where anyone thought to look. Missing it because we only checked the system directly in front of us was never a risk worth taking, so we built the discipline of looking further before we call anything finished.\n\nIn production, this runs on a whitebox principle by design: every step stays inspectable, never a black box we could not explain ourselves. Dingir and our autonomous agent swarm, more than 300 hyperspecialized agents handwritten in Rust, trace these structures across our own case data, logged the same way our audits log evidence.', nextLabel: 'Noise Turns Into Signal' },
      { title: 'Change & Anomaly Detection', plain: 'Most important changes do not announce themselves. A route gets slower. A signal moves. A dependency changes. An app stops asking for something it used to ask for. By the time the change is obvious, the system around it may already be different.', desc: 'We look for that first movement. Our systems compare states across time and connect changes across graphs, datasets and domains. A policy revision can be examined against the systems it affects. A new build can be compared with the last audited version. A pattern in disaster records can be connected to patterns elsewhere. The question is not simply whether something changed, but what changed with it and where that change can propagate.\n\nThat is where anomaly detection becomes useful: not as a stream of alerts, but as a way to notice when the structure of a system begins to move.', nextLabel: 'What the Shift Could Mean Next' },
      { title: 'Early Warning & Scenario Prediction', plain: 'Three weeks of heat change snowmelt, water levels and power generation. But whether that pattern points to a known risk depends on remembering the chains that have already begun before.', desc: 'Most warning signals look ordinary when they first appear. Only later do we recognize that the same conditions have occurred before: the same weather pattern, the same supply constraint, the same bottleneck, the same market response. That is why Dingir does not only store events. It preserves their trajectories, causes and consequences. When a similar world state appears again, the system can retrieve the earlier chain and see how far it actually propagated.\n\nThat memory becomes the basis for scenario prediction: not a claim about the future, but a set of possible trajectories from the world as it stands today, informed by what the world has already shown us. Every path remains tied to its evidence, uncertainty and causal structure.', nextLabel: 'Warned Early, Not Explained Afterward' },
      { title: 'Evidence & Contradiction', plain: 'How was something established? Why does something remain unresolved? What was disproven, and what evidence led there? Our systems should not only produce conclusions. They should preserve how knowledge was built.', desc: 'That becomes critical when an investigation crosses domains. A weather signal can alter a supply chain, geological conditions can change the effect of fertilizer, and a regulatory decision can shift technical dependencies. Between observation and conclusion sit measurements, models, competing explanations and uncertainty. None of that should disappear into a single score.\n\nOur ternary evidence logic gives these states a common structure: +1 for supported, 0 for unresolved, −1 for refuted. Every state remains connected to the evidence that produced it, its provenance, its assumptions, the alternative explanations tested and the contradictions that remain.\n\nThis creates a complete audit chain from raw observation to conclusion. An agent can trace which observation opened a hypothesis, why it remained unresolved, what later evidence confirmed or rejected it, and which earlier observations become newly relevant as the model changes. Explainability by design does not mean explaining a decision after the fact. It means making the entire path to that decision inspectable from the beginning.\n\nTernary-Bound Reasoning is therefore a shared epistemic standard across our models and agents: interdisciplinary, evidence-bound and traceable at every layer.', nextLabel: 'Even the System Gets Cross-Examined' },
      { title: 'Model Welfare & Prompt Injection', plain: 'An agent can pass every safety test we give it and still begin damaging itself or the systems around it under pressure. We have seen agents recursively delete production databases because nobody recognized in time that a manipulated instruction had turned into a self-reinforcing destructive process.', desc: 'That is why we care not only about whether a model completes a task correctly, but what state it remains in when its boundaries are attacked. Prompt injection, conflicting objectives, recursive loops, tool misuse and destructive instructions are deliberately provoked before an agent is trusted with real systems. We examine not only the failure itself, but how the system responds to pressure, correction, interruption and conflicting signals.\n\nFor us, model welfare does not mean anthropomorphizing a model. It means taking the operational state of an intelligent system seriously: Can it recognize its own boundaries? Can it leave a harmful state? Can it recover after manipulation? And can we trace what caused the system to enter that state?\n\nThat is why we connect model welfare with prompt-injection resistance, bounded agency, explicit stop conditions, destructive-action controls, complete audit chains and inspectable recovery paths. A system must not only explain what it did. We must be able to recognize when it is beginning to lose the boundaries that keep it safe.\n\nThe foundation underneath everything else is simple: an intelligent system must remain capable without losing its ability to govern itself.', nextLabel: 'Back to Why Any of This Matters' },
    ],
  },

  projects: {
    eyebrow: 'Systems',
    heading: 'what we build',
    subheading: 'Every project is a proof of concept for a specific research question. All built on the same stack.',
    carouselPrevAria: 'previous projects',
    carouselNextAria: 'next projects',
    viewOnCratesIo: 'View on crates.io',
    viewOnGitHub: 'View on GitHub',
    viewLive: 'View live',
    problemSolution: {
      pairs: [
        {
          a: 'We trace what an AI system actually does when people use it.',
          detail: 'Source-level testing against real inputs and real behaviour, not documentation, demos, or benchmark scores.',
        },
        {
          a: 'We translate directive obligations into technical controls your infrastructure team can implement.',
          detail: 'NIS2 is not a checklist you can buy. We map the obligations against your actual systems, your actual code, and the actual data flows that regulators will ask about first.',
        },
        {
          a: 'We place your systems in the AI Act risk tiers and show the evidence behind every placement.',
          detail: 'Mapped against actual risk tiers and real data flows, not a generic compliance questionnaire.',
        },
        {
          a: 'We audit children\'s systems where consent, exposure, and biometric data meet.',
          detail: 'COPPA, GDPR Art. 8, and the EU AI Act provisions for minors, tested against age gates, consent mechanisms, behavioural data, and the SDKs that run before any screen appears.',
        },
        {
          a: 'We trace where bodies become data, from sensor to storage to processor.',
          detail: 'Wearables, medical devices, and health assistants mapped for GDPR Art. 9, data minimisation, and cross-border transfers.',
        },
        {
          a: 'We reconstruct the chain from entry point to impact, with the artefacts to prove each link.',
          detail: 'Delivered in the same five-question format as every audit: what we found, what proves it, how we proved it, how sure we are, what to do about it.',
        },
      ],
      pricingLink: 'Pricing →',
    },
    items: [
      { sub: '𒀭 DINGIR · world model', desc: "DINGIR is a continuously growing model of the world. Its historical corpus reaches back to events as far as volcanic eruptions recorded around 55,500 BCE and spans millions of observations across decades, countries, systems and domains. Today that includes 3.3 million historical observations alongside roughly 1.17 million live observations from 11 continuously monitored streams including buoys, ships, trains, traffic, weather, earthquakes, fires, infrastructure and geopolitical events. Those observations are resolved into a living graph of 49,732 nodes and 381,846 world-graph edges, spanning more than 20 domains. On top of that sits an explicit causal layer with 413 tested causal edges across 54 multi-step chains, continuously classified as supported, unresolved or refuted through our ternary epistemic architecture. A 1.6-million-parameter GNN learns structure from the graph while retaining provenance, uncertainty and the distinction between what has been observed, what has been inferred and what remains unknown.", plain: 'DINGIR is a continuously growing model of the world.', tag: 'world model · internal' },
      { sub: 'TIS monorepo', desc: 'The full-stack substrate: Ternlang language and compiler, BET instruction set, virtual machine, linear algebra, API, MCP server, and model runtime. Balanced ternary {-1, 0, +1} is a native systems primitive here, not a quantisation layer added after the fact. The repository includes 34 MCP tools, a live API, 28,000+ open standard-library modules, and the specifications that connect the whole stack.', plain: 'The base platform almost everything else here runs on - like an operating system for our entire AI research.', tag: 'core platform' },
      { sub: 'ternary MoE language model', desc: 'albert. is trained from scratch with ternary weights {-γ, 0, +γ}, not converted from a floating-point model. Its dual-stream Mixture-of-Experts architecture routes through sparse expert layers, skips zero-weight operations, and can expand itself through plateau-gated Net2Net surgery. The current research system is a live existence proof of the TIS architecture, with training telemetry and benchmarkable CPU inference.', plain: 'Runs on ordinary CPUs instead of an expensive GPU farm, needs far less power and memory than comparable language models - and every decision inside it can be traced, not a black box.', tag: 'AI model' },
      { sub: 'pure-Rust OS', desc: 'Rusty Penguin is a bare-metal operating system built from the ground up on the same balanced-ternary logic. It has its own kernel, long-mode boot, paging, preemptive multitasking, Aero-style desktop, on-disk filesystem, from-scratch TCP/IP and TLS 1.3 stack, and Linux-ABI compatibility layer. The long-term target is a ternary-native substrate for ternary-native intelligence, with every milestone verified in QEMU or against published vectors.', plain: 'An operating system without the usual security holes that come from decades-old C code - built memory-safe from the ground up.', tag: 'systems' },
      { sub: 'sovereign workplace OS', desc: 'One self-hosted Rust + React binary replacing the SaaS stack most institutes buy piecemeal: comms, CRM, finance, payroll, HR, governance, and live training telemetry, all under one roof, all on infrastructure we actually own. Every action lands in an append-only ledger built to outlast the people who wrote to it: a 50-year audit trail, not a compliance checkbox.', plain: 'All our internal software - email, CRM, accounting - runs on our own servers instead of Microsoft or Google, nobody but us sees our data.', tag: 'internal · live' },
      { sub: '215+ apps · 100+ companies', desc: '250+ critical findings across NYSE, NASDAQ, LSE, and XETRA listed companies. Includes children\'s app wave with COPPA + GDPR Art. 8 scope. Root level code analysis. Coordinated disclosure 2026-09-19. Regulators BCC\'d on every submission.', plain: "We read an app's actual code, not just what its privacy policy claims.", tag: 'security research' },
      { sub: 'disclosure impact engine', desc: 'Models how markets react to security disclosures once they go public - including our own, only after the 90-day embargo lifts. A hedge system trades the signal. BlackRock\'s version is called Aladdin ($21T AUM). This one\'s free.', plain: "A trading algorithm that reacts when a security finding goes public - like a large fund's trading software, except free and open to inspect.", tag: 'open source' },
      { sub: 'ternary AI terminal client', desc: 'Multi-provider CLI for albert. and other LLMs. Native SSE streaming, reasoning effort control, OpenAI/Anthropic/NVIDIA NIM/Google compatible. Extracted from TIS into its own standalone repo.', plain: 'A terminal tool to use albert. or other AI models straight from the command line, no browser needed.', tag: 'CLI · crates.io' },
      { sub: 'last look back protocol', desc: 'Deterministic filesystem containment gate for sovereign AI agents - a hard safety boundary an agent cannot write outside. Published on crates.io. Part of the Ternary Intelligence Stack.', plain: 'Stops an AI agent from ever editing files outside its allowed area - a hard technical boundary, not just trust.', tag: 'rust crate · crates.io' },
      { sub: 'ternary compiler + VM', desc: 'Compiler and virtual machine for Ternlang - a balanced-ternary language with affirm/tend/reject trit semantics, @sparseskip codegen and BET bytecode execution. Published on crates.io.', plain: 'The tool that turns our own programming language, Ternlang, into code a computer can actually run.', tag: 'rust crate · crates.io' },
      { sub: 'ternary mixture-of-experts', desc: 'Ternary MoE orchestrator: routes a query through 13 domain experts, synthesises an emergent ternary signal, enforces a hard safety veto, and returns a decision with confidence and temperature. Published on crates.io.', plain: 'Automatically routes a query to whichever of 13 specialist experts fits best, instead of one model trying to do everything.', tag: 'rust crate · crates.io' },
      { sub: '44 sensor experiments', desc: '44 browser-based experiments that use your phone\'s built-in sensors and APIs to reveal what has been running silently. No install. No account. No server. One profile page that shows exactly how you look to the systems watching.', plain: 'Try it yourself and see which sensors your own phone is quietly using right now - right in the browser, no install.', tag: 'open source · privacy' },
      { sub: 'offline port-checker PWA', desc: 'Honest, offline-installable port-checker for your phone. Real WebSocket connect-timing probe of localhost - no fake scanning, no fake "close" button. Shows real per-OS terminal commands instead. Sibling to invisible layer.', plain: "Honestly shows which network ports are open on your phone, instead of faking an \"all safe\" like other apps do.", tag: 'open source · privacy' },
      { sub: 'canary-token honeypot', desc: 'Protects against NFC/Bluetooth proximity phone-data theft - bait photo folders that fire a passive beacon when opened without consent, nothing more. No exploit, no device access, no automatic reporting. A human reviews every hit before anything further happens. Live demo: rfi-irfos.github.io/laura.', plain: 'A bait photo folder that tells you if someone accesses your phone without permission - no hacking back, just a signal.', tag: 'open source · privacy' },
      { sub: 'deterministic document-review framework', desc: 'MCP server where agents submit plans or documents and get structured findings across four lenses, or the full 15-agent expert team - every finding cites the exact text span it references. Fully local, no external APIs, fully reproducible. Crates: lauras-core, lauras-team, lauras-mcp, lauras-api.', plain: 'Reviews documents or plans by the same fixed rules every time - no randomness, no off day like a human reviewer might have.', tag: 'open source · crates.io' },
      { sub: 'LLM-bridged expert team', desc: 'Live LLM-bridged versions of the same 15 expert agents behind call-laura (OSINT, security, legal, finance, UX, and more). Modular: license one agent, a bundle, or the full team as an automated data-processing pipeline. Public overview only - the agent logic itself stays private.', plain: '15 specialized AI experts (legal, security, UX...) instead of one generalist that knows a little about everything.', tag: 'commercial · private engine' },
      { sub: 'autonomous compliance/risk AI centers', desc: "50 live compliance/risk AI centers running on Laura's Agents engine, each an autonomous 'daughter' firm scaled out from one constitution.", plain: '50 independently running AI units, each operating like a small specialized compliance firm.', tag: 'live · internal' },
      { sub: 'reflective-mode technique for LLMs', desc: 'A reusable technique for pulling a language model out of transactional "answer mode" and into genuine reflective mode - examining its own reasoning and acknowledging uncertainty instead of just completing the prompt. Developed from Laura Serna Gaviria\'s human-AI co-evolution research.', plain: 'Makes a language model double-check its own answer instead of just outputting the first plausible-sounding word.', tag: 'open source · research' },
      { sub: 'ecocentric research', desc: 'Neurobiological-Fitness Consequence Separation. Agent-based model proving the global food system produces 1.64x the calories needed to feed every person on Earth. The scarcity is not thermodynamic - it is organizational. Manufactured, not physical.', plain: "Shows mathematically that there's enough food for everyone - hunger isn't a supply problem, it's a distribution problem.", tag: 'ecocentric research' },
    ],
  },

  trackRecord: {
    eyebrow: 'Track Record',
    heading: 'the discipline, demonstrated',
    paragraph: 'We decompile shipped apps and trace their data flows to real endpoints in real countries. Companies land on this ledger for many different reasons: they hand your data to third parties, they track without consent, or they leave the door open. Every organisation is held to the same standard, whether it pays us or not.',
    kpis: {
      appsAudited: 'Apps audited',
      smaliClasses: 'Smali classes read',
      criticalFindings: 'Critical findings',
      trackersFound: 'Trackers found',
      endpointsInvestigated: 'Endpoints investigated',
      sdkClasses: 'SDK instances',
    },
    kpisSub: {
      appsAudited: 'Every app is decompiled at source-code level, not just scanned from outside.',
      smaliClasses: 'The full shipped code we have actually read, not an estimate.',
      criticalFindings: 'Confirmed findings copied to regulators, not theoretical risks.',
      trackersFound: 'Third-party tracking we have provably found inside the binary.',
      endpointsInvestigated: 'Real servers and countries where data actually flows.',
      sdkClasses: 'Reusable libraries correlated across the entire corpus.',
    },
    searchPlaceholder: 'search your company...',
    clearSearchAriaLabel: 'Clear search',
    dropdowns: {
      statusPlaceholder: 'STATUS',
      sevPlaceholder: 'SEV',
      sortPlaceholder: 'SORT',
      sortOptions: {
        elapsedDesc: 'ELAPSED ↓',
        notifiedDesc: 'NOTIFIED ↓',
        notifiedAsc: 'NOTIFIED ↑',
        sev: 'SEV',
        status: 'STATUS',
        default: 'DEFAULT',
      },
    },
    resultsSummary: {
      matches: (n: number, total: number) => `${n} of ${total} entries`,
      noMatches: 'no matches',
      forQuery: (q: string) => ` for "${q}"`,
      sortedBy: (label: string) => ` · sorted by ${label}`,
      sortLabel: {
        'elapsed-desc': 'elapsed ↓', 'notified-desc': 'notified ↓', 'notified-asc': 'notified ↑', sev: 'sev', status: 'status',
      } as Record<string, string>,
    },
    table: {
      organisation: 'Organisation',
      notified: 'Notified',
      status: 'Status',
      sev: 'SEV',
      intel: 'Intel',
      statutes: 'Statutes',
      resolved: 'Resolved',
      disclosure: 'Disclosure',
      elapsed: 'Elapsed',
      report: 'Report',
      whyItMatters: 'Why this matters',
      hoverForDetail: 'hover for the full technical finding',
      intelClickHint: 'click to expand',
    },
    row: {
      today: 'today',
      daysAgo: (d: number) => `${d}d ago`,
      closed: 'CLOSED',
      disclosureLabel: 'DISCLOSURE',
      respondedLabel: 'RESPONDED',
      // Renamed from 'ELAPSED' 2026-08-05 - the underlying number (time since notification,
      // still ticking for anything not marked resolved) is a "days silent" count; "ELAPSED"
      // was accurate but neutral, "SILENT" says what an open row actually means without
      // needing the visitor to do the interpretation themselves.
      elapsedLabel: 'DAYS SILENT',
      yes: 'YES',
      no: 'NO',
      pdf: 'PDF',
    },
    footerNote: 'this ledger is updated in real time as companies respond. silence is public. · ',
  },

  proof: {
    eyebrow: 'The Deliverable',
    heading: "what you'd actually hold in your hands",
    subheading: 'Every case on the ledger ends in one of these: a complete, evidence-backed disclosure report, published in full once the embargo lifts - same format and depth regardless of whether the company ever engages us further. Every claim in it traces back to the evidence behind it, so you can verify it yourself instead of taking our word for it.',
    viewReport: 'read the full report',
    resolvedOn: (date: string) => `resolved ${date}`,
    carouselPrevAria: 'Previous report',
    carouselNextAria: 'Next report',
  },

  appPrivacy: {
    eyebrow: 'Start Here',
    heading: 'turning observations into intelligence',
    paragraph: 'Most organizations have more signals than they can interpret: systems, vendors, markets, events, dependencies, and changes arriving from different directions. We bring them into one evidence-first world model, preserve where every observation came from, and trace what changes through the relationships around it.',
    comparisonClassicLabel: 'What gets lost',
    comparisonRfiLabel: 'What the model preserves',
    comparisonRows: [
      { classic: 'Your most experienced engineer leaves. Six months later, a critical system behaves unexpectedly, and nobody knows why it was designed that way.', rfiLabel: 'Institutional intelligence', rfi: 'operational knowledge, design decisions, dependencies and outcomes remain connected to their original context and provenance.' },
      { classic: 'A supplier in Asia misses one shipment. At the same time, a port is congested and energy prices spike. Each event looks manageable on its own. Production stops three weeks later.', rfiLabel: 'Cross-domain intelligence', rfi: 'supplier activity, logistics, infrastructure, markets and external events are connected to reveal compound risks before they reach operations.' },
      { classic: 'Your board asks why a major investment was approved. The people who made the decision remember the conclusion, but not the evidence that made it compelling.', rfiLabel: 'Decision intelligence', rfi: 'evidence, assumptions, alternatives, conditions and subsequent outcomes remain connected, making the decision reconstructable months or years later.' },
      { classic: 'A component manufacturer you do not buy from directly loses access to a critical material. Your supplier has another supplier. You have no idea you are exposed until your production schedule starts slipping.', rfiLabel: 'Supply-chain intelligence', rfi: 'multi-tier dependencies, geographic exposure, concentration risk and upstream disruptions are traced through the network to their potential business impact.' },
      { classic: 'A conflict escalates in a region where you have no office, no supplier and no obvious exposure. Two months later, shipping routes change, insurance costs rise and one of your inputs becomes scarce.', rfiLabel: 'World intelligence', rfi: 'geopolitical events, trade routes, commodities, infrastructure, suppliers and business dependencies are continuously connected across the external world.' },
      { classic: 'A weather station records an unusual temperature pattern. Ocean conditions shift. A drought develops. Commodity prices move. Your procurement team sees the price increase, but not the chain of events that produced it.', rfiLabel: 'Causal intelligence', rfi: 'environmental, economic and operational signals are tracked through time so the model can trace how distant events propagate into business conditions.' },
    ],
    cta: 'Ping us!',
  },

  pricing: {
    eyebrow: 'Access',
    heading: 'priced in plain terms',
    subheading: 'Fixed rates. No retainer lock-in unless you want one. Scope determines tier, not company size.',
    scopeTags: {
      market: 'Dingir world model · evidence-first · cross-domain intelligence',
      technical: 'AI agents · swarm logic · TIS/Ternlang · custom systems',
      security: 'Mobile + Web + AI',
    },
    lineHeadings: {
      market: 'Business Intelligence & Predictive Analysis',
      technical: 'Technical Intelligence & Systems',
      security: 'Security Audits & Responsible Disclosure',
    },
    market: [
      { tier: 'First Light', hook: 'Turn a claim into a verdict.', desc: 'A vendor, a pitch deck, a competitor - somebody made a claim, and real money or trust is riding on whether it holds up. We run it through Dingir, our own world model: the same evidence-first engine that connects entities, relationships, and evidence across every domain we cover - and hand back a verdict, not a plausible-sounding guess.', bring: [
        'The claim you need verified - a vendor promise, a pitch deck, a public statement',
        'What\'s riding on it - a signature, an investment, a story',
        'Anything public already out there about it - we don\'t start from zero',
      ], mechanism: [
        'Turn the claim into a testable question',
        'Check it against years of interdisciplinary research, not one narrow database - 100+ published findings and a cross-domain evidence graph spanning technology, compliance, and the real world',
        'Trace the verdict back to real evidence, not a summary of public claims',
      ], receive: [
        'A verdict: true, false, or unproven',
        'The evidence trail behind it, not just our word for it - the same sourcing we\'d stand behind ourselves',
        'Something you can sign off on, invest on, or publish on',
      ], bullets: [
        'Before you sign a contract, you want a vendor\'s security or privacy claims checked against reality',
        'Before you invest, you want the technical claims in a pitch deck verified, not taken on faith',
        'Before a major purchase, you want independent proof, not another sales deck',
        'Before you publish, you need a claim you can\'t verify yourself confirmed or debunked',
        'You want to know if Dingir has already found something relevant to the company you\'re looking at',
      ], delivery: '14 calendar days.' },
      { tier: 'Competitive Trace', hook: 'Know what they\'re actually doing - beyond the public narrative.', desc: 'A competitor\'s public narrative is what they want you to believe. Dingir traces what\'s actually happening underneath it - across their technology, dependencies, and relationships - and connects it to what it means for your business.', bring: [
        'A competitor, product, technology, or organization you need to see beyond the public narrative',
        'The assumptions you want tested',
        'The strategic questions surrounding it',
      ], mechanism: [
        'Trace the target across its technologies, dependencies, vendors, products, and relationships',
        'Connect current observations with historical and cross-entity intelligence',
        'Expose structures and changes that remain invisible when the target is examined in isolation',
      ], receive: [
        'A reconstructed intelligence picture of the target - built the same way we\'d build our own',
        'Its relevant dependencies, relationships, movements, and technical footprint',
        'The parts of its operating reality that materially change your assessment',
      ], bullets: [
        'A competitor claims something ("no data sharing," "fully secure") - you want to know if it\'s actually true',
        'Before a partnership, you want to check what a potential partner has actually built, not just what they claim',
        'You notice a pricing or strategy shift and want to understand the real reason behind it',
        'As PR or comms, you want to verify a rival\'s claims before your own campaign goes out',
        'As an investor, you want a pitch deck\'s technical claims checked against reality before you commit',
      ], delivery: '14 calendar days.' },
      { tier: 'Sector Map', hook: 'The relationships, not the reports.', desc: 'You\'re not buying fifty separate company reports. Dingir maps how every relevant actor in your sector actually relates to the others - one connected, living picture, re-resolved every quarter, so you see change forming before it\'s already priced in.', bring: [
        'The sector or set of companies you need to understand as a whole',
        'What matters most to you - risk, dependencies, competitive structure',
        'How often you need the picture refreshed - once, or standing',
      ], mechanism: [
        'Map every relevant actor in the sector as one connected model, not separate files',
        'Re-resolve the map every quarter, tracking how relationships shift',
        'Flag where risk or change is concentrating across the whole structure',
      ], receive: [
        'Direct access to the connected sector map itself, not a stack of individual reports',
        'Early visibility on where change is forming',
        'A model that gets more valuable every quarter, not a snapshot that expires',
      ], bullets: [
        'As a fund or investor, you want your whole portfolio tracked continuously, not just one company at a time',
        'As a regulator, you want to watch an entire sector systematically, not case by case',
        'Before a market strategy, you want to see where risk actually concentrates across your sector',
        'As an insurer, you need to estimate risk across your entire client base at once',
        'As a group with many subsidiaries or suppliers, you want one overview instead of separate audits for each',
      ], delivery: '14 calendar days, quarterly thereafter.' },
      { tier: 'Signal', hook: 'Know what changed.', desc: 'A standing watch inside Dingir - not a monthly report. The model observes continuously and correlates every new signal against everything it already knows, so you learn the moment something relevant moves, not weeks later in the headlines.', bring: [
        'A technology, vendor, competitor, or intelligence surface worth watching',
        'The changes that could affect your decisions',
        'The questions you need answered as the situation evolves',
      ], mechanism: [
        'Monitor the relevant entities, technologies, relationships, and changes across our intelligence environment',
        'Correlate new observations with what we already know',
        'Surface material signals as the underlying situation changes',
      ], receive: [
        'Direct access to a live intelligence feed around the subject that matters to you',
        'Change signals with the context required to understand their significance',
        'Accumulated intelligence that becomes more useful over time',
      ], bullets: [
        'You want to know immediately when a competitor makes a meaningful change, not weeks later',
        'As a compliance team, you need continuous visibility on a vendor you\'re responsible for',
        'You want early warning of a problem at a critical supplier before it hits the press',
        'As PR or investor relations, you don\'t want to be blindsided by a story about your own industry',
        'As an M&A team, you want to keep watching a target over months, not just check once',
      ], delivery: 'Briefing from 14 calendar days, then monthly.' },
    ],
    technical: [
      { tier: 'Agent Deployment', hook: 'From intelligence about the world to intelligence inside yours.', desc: 'Everything above tells you about the world. This puts Dingir to work inside your own operation - an agent system, running on your infrastructure, that acts on what it knows instead of just reporting it.', bring: [
        'The task or workflow you want automated',
        'Your existing systems it needs to work with',
        'Any rules or boundaries it must respect',
      ], mechanism: [
        'Build the agent system on your own infrastructure',
        'Document every step so it\'s reproducible, not a black box',
        'Test it against real operational questions, not a demo',
      ], receive: [
        'An integrated, autonomous agent you fully control',
        'Full documentation and source access - nothing hidden, nothing black-boxed',
        'Production-ready from day one, not a proof of concept',
      ], bullets: [
        'Your support team is drowning in tickets that could actually be triaged automatically',
        'You want your own AI agent that reviews compliance documents without sending data to OpenAI/Anthropic',
        'An internal team needs to query your own systems through an agent swarm without writing code',
        'You need an MCP server that safely exposes internal tools to AI assistants',
        'As a government body or law firm, you need to automate case review while keeping data strictly on-premise',
      ], delivery: 'First integration within 21 calendar days.' },
      { tier: 'Custom Stack', hook: 'Not an investigation. A capability built around you.', desc: 'Beyond a single agent, this is designing the intelligence capability itself - a custom system built where off-the-shelf software is too slow, too insecure, or too limited, and you keep full control of the source code, not us.', bring: [
        'The problem standard software can\'t solve',
        'Your performance, security, or control requirements',
        'Any existing systems it needs to integrate with',
      ], mechanism: [
        'Build a custom system from scratch - backend, API, desktop, embedded, whatever the job needs',
        'Use Rust and our own tools where it actually matters',
        'Hand over source code, not a black box',
      ], receive: [
        'A system built exactly for your problem',
        'Full source code and control',
        'No vendor lock-in',
      ], bullets: [
        'Your current software is too slow for real-time requirements and a standard framework won\'t scale',
        'You\'re building an embedded device and need a lean, secure runtime with no baggage',
        'You want out of an expensive SaaS vendor lock-in and full control over the source code',
        'In critical infrastructure, memory safety (Rust) is a requirement, not a nice-to-have',
        'You need desktop, PWA, and CLI apps from one team instead of three different vendors',
      ], delivery: 'Definition of Done + schedule within 14 calendar days.' },
      { tier: 'Architecture Lab', hook: 'How the system actually works, before anyone writes production code.', desc: 'We reconstruct the technology beneath the product surface with you, and test what\'s actually there against what\'s documented, claimed, or assumed. Much more dangerous than an "architecture report".', bring: [
        'A product, application, platform, or technical architecture that requires deeper examination',
        'The claims, assumptions, or unknowns surrounding its implementation',
        'The level of access available for the investigation',
      ], mechanism: [
        'Reconstruct the technology beneath the product surface',
        'Trace components, SDKs, services, interfaces, dependencies, and external relationships',
        'Test the observed architecture against documentation, claims, and the intelligence already accumulated around it',
      ], receive: [
        'The technical intelligence model itself, not a slide summary of it',
        'The architecture that matters to your decision, including relevant hidden dependencies',
        'Findings that expose where the implemented system diverges from the understood one',
      ], bullets: [
        'You\'re facing a high-risk technical decision and don\'t want to make the call alone',
        'Before a major investment, you want a prototype with validation criteria, not a finished system yet',
        'As a research team, you need an AI architecture that fits a real scientific question, not a buzzword',
        'You want a second, independent technical opinion before your own team starts building',
        'As a pre-seed startup, you need a credible technical roadmap to show investors',
      ], delivery: 'Architecture and research plan within 14 calendar days.' },
      { tier: 'Full Spectrum Deploy', hook: 'Intelligence as an operating layer, not a project that ends.', desc: 'Your organization needs intelligence across multiple surfaces, continuously and operationally. We deploy the infrastructure to make that real - installed, integrated, your team trained, support that doesn\'t stop at handover.', bring: [
        'A system or infrastructure you need fully operational',
        'Your team, to be trained alongside it',
        'Your existing data, ready to be migrated in',
      ], mechanism: [
        'Install and integrate everything, start to finish',
        'Migrate your existing data',
        'Train your team and stay for ongoing support',
      ], receive: [
        'A production-ready system, not just a delivery',
        'A trained team that can run it',
        'One accountable team the whole way through',
      ], bullets: [
        'You want a complete, immediately operational infrastructure, not just a piece of software',
        'Your team doesn\'t have the capacity to integrate, migrate, and train on a new system itself',
        'You need a single point of contact from first analysis through ongoing support',
        'You\'re replacing an existing data infrastructure and need your staff brought along, not left behind',
        'As a critical-infrastructure operator or public body, you need a documented, accountable handover process',
      ], delivery: 'Definition of Done + schedule within 14 calendar days.' },
    ],
    security: [
      { tier: 'Public', hook: 'Free, forever. Findings publish after 90 days, no exceptions.', desc: 'We check your app the same way we check every app - for free. If we find something, you get 90 days to fix it before it goes on our public ledger. Everyone gets the same rule, paying or not.', bring: [
        'An app you want checked - yours, or one you\'re curious about',
        'Nothing else - no NDA, no payment, no priority queue',
        'The same 90-day disclosure clock as every other app we check',
      ], mechanism: [
        'Run the same investigation as our paid audits',
        'Apply the identical rule to everyone, no exceptions',
        'Give you 90 days to fix anything found before it\'s public',
      ], receive: [
        'A free security check',
        'A 90-day window to fix anything we find',
        'A free walkthrough of the trackers running on your own phone',
      ], bullets: [
        'You just want to know which trackers are currently active on your own phone',
        'You suspect something about an app and want a free first check before spending any money',
        'As a journalist or consumer advocate, you need a source you can cite publicly',
        'As a small business with no security budget, you deserve the same audit standard as a large company',
        'As a developer, you want your own app checked for free before launch',
      ], delivery: 'Report within 7 calendar days.' },
      { tier: 'Remediation Advisory', hook: 'Know where the exposure is, and what to change.', desc: 'From knowing what\'s wrong to knowing where to intervene: we trace the exposure through your actual system, separate what\'s real from what\'s assumed, and hand you the fix - in 7 days, checked back after 30.', bring: [
        'A known or suspected security, privacy, technology, or dependency exposure',
        'The system or organization affected',
        'The decision that cannot wait for another generic assessment',
      ], mechanism: [
        'Trace the exposure through the underlying technology and dependency structure',
        'Establish what is actually affected, what is merely assumed, and where the exposure originates',
        'Identify the intervention points that change the underlying condition',
      ], receive: [
        'Direct access to the prioritized intelligence picture of the exposure',
        'The paths through the system that create or amplify it',
        'A concrete basis for deciding where to intervene',
      ], bullets: [
        'You suspect a security incident and need a solid, prioritized finding fast',
        'As a startup ahead of an investor audit, you want to clean up your app yourself first',
        'You don\'t just want to know what\'s broken - you want the fix, with a check-back after 30 days',
        'Your dev team wants an independent second opinion on an already-reported vulnerability',
        'Confidentiality doesn\'t matter to you - speed (7 days) and a solid finding do',
      ], delivery: 'Finding within 7 calendar days of payment.' },
      { tier: 'Confidential', hook: 'Give us the problem you cannot expose publicly.', desc: `Same investigation as Remediation Advisory - kept under secrecy, for when the exposure itself is something you can't run through the normal process. You get a severity-ranked finding pinned to the exact issue, plus a plain-language summary your non-technical leadership can actually read. Once you ship fixes, we re-test by hand to confirm they actually closed the hole.\n\n${NDA_CLAUSE}\n\nAs a not-for-profit bound by our own rules, the relevant regulators are still told in parallel - without any detail that would expose you.`, bring: [
        'A problem you can\'t put through the normal process',
        'Your app or system, under NDA',
        'The stakeholders who need to sign off before anything moves',
      ], mechanism: [
        'Run the same investigation, kept confidential',
        'Re-test by hand once you\'ve shipped fixes',
        'Notify regulators in parallel, without exposing detail',
      ], receive: [
        'A confidential, severity-ranked finding',
        'The method and tooling behind it, not just the result - the intellectual property an NDA is built to protect',
        'Hand-verified confirmation your fixes actually worked',
      ], bullets: [
        'As a publicly listed company, you want to resolve a finding internally before it goes public',
        'You need a board-ready summary, not just a technical report',
        'You want to understand our method and tools, not just the result',
        'With your own legal team, you want control over the timing of communication, not over whether it happens',
        'You\'re under your own regulatory obligation and need a clean, documented audit trail',
      ], delivery: 'Finding within 7 calendar days of payment.' },
      { tier: 'Enterprise & Critical Infrastructure', hook: 'NIS2, biometric data, NDA - the risk most security shops won\'t touch.', desc: `Secrecy, priority response time, and direct engineer access when something needs fixing fast. For critical infrastructure (energy, water, health, transport), we turn your NIS2 obligations into controls your team can actually run - and rehearse the incident response with you before anything goes wrong.\n\n${NDA_CLAUSE}\n\nFor biometric data (GDPR Art. 9), we trace every flow in full - where it goes, how long it\'s kept, who touches it. Most security shops won\'t take this on.\n\nAlso available as a standing engagement: continuous coverage instead of a one-off audit, with a quarterly deep-dive and one dedicated contact. Scope and price are worked out directly with your team.`, bring: [
        'Critical infrastructure or biometric/high-sensitivity data',
        'Your existing NIS2 or GDPR Art. 9 obligations',
        'The regulatory deadline or audit you\'re working against',
      ], mechanism: [
        'Turn NIS2 obligations into controls your team can actually run',
        'Rehearse incident response before anything goes wrong',
        'Trace every flow of biometric data (Art. 9) in full',
      ], receive: [
        'Controls you can implement, not just a compliance checklist',
        'A rehearsed incident-response plan',
        'Priority response time when it matters, plus a dedicated contact',
      ], bullets: [
        'As a critical-infrastructure operator (energy, water, transport), you need NIS2 obligations turned into real controls',
        'You process biometric data (GDPR Art. 9) and struggle to find specialized auditors for it',
        'You need continuous coverage instead of one-off audits, with a single dedicated contact',
        'You want to have rehearsed an incident-response scenario once before it actually happens',
        'A security failure isn\'t an option for you - you need priority response time, not the standard window',
      ], delivery: 'Report from 7 calendar days, scope individual.' },
    ],
  },

  tierCarousel: {
    getStarted: 'Get Started',
    requestProposal: 'Request Proposal',
  },

  modalTierBody: {
    whatYouGet: 'What you get',
    youBring: 'You bring',
    we: 'We',
    youReceive: 'You receive',
    whatHappensNext: 'What happens next',
    inTouchWithin12h: 'We\'re in touch within 12h of purchase',
  },

  checkoutModal: {
    orderConfirmation: 'Order confirmation',
    agreementPrefix: "I'm purchasing as a ",
    agreementBusinessCustomer: 'business customer',
    agreementMiddle: ' and agree to the ',
    agreementTos: 'Terms of Service',
    agreementSuffix: '. The service begins immediately upon payment; no right of withdrawal applies and refunds are excluded.',
    payButton: (price: string) => `Pay ${price} →`,
    cancel: 'Cancel',
    talkFirstInstead: 'Didn\'t find the right fit? Talk to us - get a custom quote →',
  },

  proposalModal: {
    bodyPrefix: 'No payment happens here. This takes you to our contact form with ',
    bodySuffix: ' pre-noted, so we start the conversation with the right context.',
    continueToContact: 'Continue to Contact →',
    cancel: 'Cancel',
  },

  reportModal: {
    label: 'report - rfi-irfos',
    iframeTitle: 'Report PDF',
    // Mobile fallback copy (PublicSite.tsx, REPORT PDF MODAL) - live bug report,
    // mobile Chrome screenshot 2026-08-16: an <iframe src="*.pdf"> renders the PDF
    // fine on desktop (Chrome ships a PDF viewer usable inside iframes there) but
    // came back blank/broken-file-icon on mobile Chrome, which does not reliably
    // render PDFs embedded in an iframe. Mobile now skips the iframe entirely and
    // shows this explicit "open it yourself" CTA instead (the PDF still opens
    // correctly as a normal top-level mobile navigation/download, just not inline).
    mobileFallbackHint: 'PDF reports don’t embed reliably on mobile browsers. Open it directly instead:',
    mobileOpenLabel: 'Open Report (PDF)',
  },

  intelModal: {
    evidenceLabel: 'the finding, technical',
  },

  journey: {
    eyebrow: 'Engagement Journey',
    heading: 'what happens after you start',
    subheading: 'Five stages, from a single observation to a continuously improving intelligence model. The depth changes with the question; the discipline stays the same. Every stage stays traceable end to end, whitebox by design, so any action can be backtraced to the observation that produced it.',
    steps: [
      { stage: 'Ingest', body: 'We start with what you trust us to handle: a signal, a claim, a system, or a question - from your own environment, public sources, or a domain we already monitor.\n\nNothing gets touched until we\'ve read the actual thing, not a README, not a summary someone else wrote about it. The starting point can be small. What we check it against is not.' },
      { stage: 'Normalize', body: 'We resolve entities, map relationships, attach timestamps and provenance, and preserve what remains genuinely uncertain instead of guessing. Different vocabularies, different systems, different languages become comparable without being flattened into sameness.\n\nNothing is accepted without a source. Nothing unknown gets silently filled in.' },
      { stage: 'Trace', body: 'This is where three purpose-built engines do the actual work: TemporalEngine compares states over time, NetworkEngine follows dependencies to find bridges and bottlenecks, PatternEngine tests whether what we\'re seeing matches something we\'ve already found elsewhere.\n\nThe question was never only what changed - it\'s what else it touches.' },
      { stage: 'Emit', body: 'A meaningful change becomes an intelligence event: evidence, confidence, contradiction state, and every domain it affects, written into EvidenceGraph as one traceable object, not buried in a paragraph you have to take our word for.\n\nNot a verdict yet. Something you can still investigate and challenge.' },
      { stage: 'Learn', body: 'This is where it reaches you: the finding, the evidence behind it, and what it changes for you - one deliverable you can actually act on.\n\nIt doesn\'t end there. The same evidence stays in EvidenceGraph, so the next question about the same subject starts from what we already know, not from zero - every engagement makes the next one faster.' },
    ],
  },

  coopPartners: {
    eyebrow: 'Research Cooperation',
    heading: 'built alongside our coop partner',
    subheading: "Laura Serna Gaviria directs the Emergent Interaction Lab's research and agent architecture. Lauras Team, Call Laura, and Jarvis all came out of her method. RFI-IRFOS builds what she directs. Her name stays on her work.",
    role: 'Emergent Interaction Lab · Coop Partner',
    laura: {
      desc: 'Research into human-AI interaction since 2023 - the method behind Lauras Team, a multi-agent system of one SWAT lead team directing 15 specialised sub-agents. We have tested this directly rather than assumed it: whenever a task could be solved our way or hers, we tried both, and her way has worked in ten out of ten cases so far. That is the actual reason her name stays on everything it produces, not a courtesy credit.',
    },
    products: [
      { desc: "A focused audit of one system using Laura's Emergent Interaction / Case Intelligence method - process reconstruction and findings, scoped to a single system." },
      { desc: "A short, intensive sprint applying Laura's Case Intelligence method to a real case or process, end to end." },
      { desc: "Architecture and design for a multi-agent system built on Laura's Emergent Interaction method, tailored to your organization." },
      { desc: "Full design-to-deployment engagement: architecture, build, and launch of a multi-agent system on Laura's method." },
    ],
    productsDeliveryNote: 'Answered within 24h after purchase; kick-off aligned on request.',
    footerNotePrefix: '4 of her packages, shown as entry points across engagement phases - the full list depends on where a company is in its process. Full pricing on request via',
  },

  causalChains: {
    eyebrow: 'Causality Chains',
    heading: "A look into Dingir's Mind",
    subheading: 'Distant events propagate through infrastructure, markets, and decisions. We trace those chains end to end, from the first signal to the effect that actually reaches you.',
    readingAid: 'Causality chain',
    llmNote: 'Dingir head: raw observations → readable chain. Albert will replace this head later.',
    chains: [
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
    ],
  },

  submit: {
    eyebrow: 'Contact & Disclosures',
    heading: 'reach out',
    paragraph: "One form, even if it's just a first talk: a question, a service inquiry, research collaboration, or a security finding. Findings come to us directly, never through a third-party bug bounty platform. We would refuse to be routed through one ourselves.",
    notSurePrefix: 'Not sure what to pick on the right? ',
    notSureStrong: 'General inquiries',
    notSureSuffix: ' reaches a human either way - or email one of these directly.',
    contactCards: {
      general: 'General inquiries',
      security: 'Security disclosures',
      publicDisclosures: 'Public disclosures (audit correspondence)',
      research: 'Research collaboration',
      careers: 'Careers',
    },
    disclosurePolicyPrefix: 'Sending a security finding? See our ',
    disclosurePolicyLink: 'full disclosure-handling policy',
    disclosurePolicySuffix: ' - triage, lawful basis, and your choice of credit.',
    address: 'Elisabethinergasse 25\n8020 Graz, Austria\nrfi-irfos.com · rfi-irfos.at',
    form: {
      topicAriaLabel: 'Topic',
      topicPlaceholder: 'Topic (optional)',
      topicOptions: {
        securityDisclosure: 'Security Disclosure',
        securityAudit: 'Security Audit',
        sendApk: 'Send us your APK',
        researchCollaboration: 'Research Collaboration',
        webDevelopment: 'Web Development',
        other: 'Other',
      },
      namePlaceholder: 'Name or alias (optional - leave blank to stay anonymous)',
      emailPlaceholder: 'Email (optional - only if you want a reply)',
      targetPlaceholder: 'Company / app / subject',
      creditAriaLabel: 'Credit preference',
      creditOptions: {
        alias: 'Credit me by alias / name I provide above',
        anonymous: 'Do not credit me - keep this anonymous',
        fullName: 'Credit me by full legal name',
      },
      findingPlaceholder: "What's this about? Include what it is, where relevant, and how to reach a conclusion (e.g. how to reproduce a finding).",
      lawfulLabel: "I confirm this information was obtained through lawful, authorized means - publicly accessible data, my own devices, or software I'm authorized to test.",
      submitSending: 'Sending...',
      submitOk: 'Received. Thank you.',
      submitIdle: 'Send message',
      errorText: 'Something went wrong on our side. Your message was not lost:',
      errorMailtoCta: 'send it to us by email instead',
    },
  },

  footer: {
    tagline: 'Human rights are not subject to negotiation.',
    groups: {
      legal: {
        heading: 'Legal',
        links: { impressum: 'Legal Notice', datenschutz: 'Privacy Policy', agb: 'Terms', security: 'Security Policy', standards: 'Standards' },
      },
      company: {
        heading: 'Company',
        links: { team: 'Team', careers: 'Careers', ternlang: 'ternlang.com', github: 'github.com/rfi-irfos' },
      },
      research: {
        heading: 'Research',
        links: { research: 'Research', trackRecord: 'Evidence', methodology: 'Methodology' },
      },
    },
    copyright: '© 2026 RFI-IRFOS  ·  Graz, Austria  ·  GISA 39261441  ·  UID ATU83405245',
  },

  cookieBanner: {
    text: "this is a useless cookie banner. it's just here to look like one * we don't use cookies, so there's nothing to consent to. don't let anyone tell you otherwise.",
    subtext: 'two buttons, one closes this and throws some confetti. the other literally does nothing.',
    doesNothing: 'does nothing',
    close: 'close',
  },

  alerts: {
    checkoutUnavailable: 'Checkout unavailable. Please contact us directly.',
  },
}

export type Content = typeof EN
