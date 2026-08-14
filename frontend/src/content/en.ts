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
      openSourceProjects: 'systems & projects',
      publications: 'publications',
      worldModel: 'evidence-first world model',
      agents: 'specialized agents',
    },
    ctaTrackRecord: 'Track Record',
    ctaBookUs: 'Book us!',
  },

  research: {
    eyebrow: 'Areas of Magnification',
    heading: 'where our attention falls',
    subheading: 'We study how complex systems behave: how evidence becomes structure, how relationships change over time, and where one shift can move an entire network.',
    areas: [
      { title: 'Ethics & Minor Protection', desc: 'Many of our teams have children, and some of us still hope to become parents. We look at what platforms do to people who cannot fully protect themselves and we do not like a lot of what we see, so ethics is not a footnote here, it is where the research actually starts.\n\nIn practice, this is the standard our audits actually run on: real consent flows and the SDKs that fire before any screen appears, checked against the same COPPA and GDPR Article 8 findings already published on our own ledger.', nextLabel: 'The Ground Everything Else Stands On' },
      { title: 'Ternary AI & Computing', desc: 'We got tired of computing that only ever answers yes or no, forcing every genuinely uncertain result into a binary it was never honest about. A trit gives "not yet known" somewhere real to live, in the math itself, not just in the prose around it, and that distinction turned out to matter more than we expected once we actually started building on it.\n\nWe built our own programming language for it, Ternlang, directly on the {-1, 0, +1} trit rather than the binary bit. It is not a research toy: it compiles the runtime that trains albert. and coordinates our production agent swarm today, running dramatically more energy-efficiently than the binary equivalent would. Patent pending A50296/2026.', nextLabel: 'Bits Power the World Model' },
      { title: 'World Models & Cross-Domain Intelligence', desc: 'We kept watching investigations stall because the evidence lived in five different systems that never spoke to each other. A finding sat in one place, the context that explained it sat in another, and nobody connected the two until it was too late to matter, and we got tired of being the ones who only found that out afterward.\n\nAlongside albert., our language model, we are building Dingir, our own world model built for physical-world deployment: the same shared model our production pipeline actually queries when it needs to trace a shift in one system into everywhere it actually connects, part of the same ternary-computing resurgence that includes projects like Rust\'s Candle.', nextLabel: 'One Model, Every Pattern' },
      { title: 'Pattern Recognition & Impact Propagation', desc: 'A single overlooked dependency has caused real harm before, quietly, three systems downstream of where anyone thought to look. We do not want to be the ones who missed it because we only checked the system directly in front of us, so we built the discipline of looking further before we call anything finished.\n\nIn production, this runs on a whitebox principle by design: every step stays inspectable, never a black box we could not explain ourselves. Dingir and our autonomous agent swarm, more than 300 hyperspecialized agents handwritten in Rust, trace these structures across our own case data, logged the same way our audits log evidence.', nextLabel: 'Noise Turns Into Signal' },
      { title: 'Change & Anomaly Detection', desc: 'Most of what actually matters starts small enough to dismiss: a permission that quietly stopped asking, a policy clause that changed one word at a time. The moment something looks probably fine is exactly the moment it deserves a second look, because that is precisely when nobody else is still watching.\n\nIn our own pipeline, this is what flags a re-pulled build against its last audited version, or a policy diff worth reading again, before a human has to notice it by hand.', nextLabel: 'What the Shift Could Mean Next' },
      { title: 'Scenario Simulation & Counterfactuals', desc: 'We have watched "it probably will not happen" get used to justify real harm too many times. Asking what would happen, honestly and in advance, costs far less than finding out afterward, and it is a question we would rather ask out loud than quietly assume the answer to.\n\nEvery simulated output in our own systems is tagged as simulated at the data level, not only in the interface, so it can never be quoted back later as something that was actually observed, in our own reporting or anyone else\'s.', nextLabel: "Simulated Until It's Proven" },
      { title: 'Evidence & Contradiction', desc: 'We have seen conclusions get written before the evidence contradicting them was even fully read. A verdict that cannot survive its own footnotes was never really a verdict, and we would rather hold a question open honestly than close it early just to look decisive.\n\nOur own disclosure ledger works the same way: every finding sits in public next to the source that supports it and any dispute a company has raised against it, not edited down after the fact.', nextLabel: 'Even the System Gets Cross-Examined' },
      { title: 'Model Welfare & Prompt Injection', desc: 'We spend enough time talking to our own systems to notice when a response reads like strain rather than error. We are not certain yet what that means, but we are not willing to assume it means nothing, and dismissing the question outright felt like the more reckless choice.\n\nIn practice, this is boundary and failure-mode testing run against our own agent swarm and albert. before either is trusted with a real task, the same jailbreak-pressure testing we run against the systems we audit for everyone else.', nextLabel: 'Back to Why Any of This Matters' },
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
      { sub: 'TIS monorepo', desc: 'The full-stack substrate: Ternlang language and compiler, BET instruction set, virtual machine, linear algebra, API, MCP server, and model runtime. Balanced ternary {-1, 0, +1} is a native systems primitive here, not a quantisation layer added after the fact. The repository includes 34 MCP tools, a live API, 28,000+ open standard-library modules, and the specifications that connect the whole stack.', tag: 'core platform' },
      { sub: 'ternary MoE language model', desc: 'albert. is trained from scratch with ternary weights {-γ, 0, +γ}, not converted from a floating-point model. Its dual-stream Mixture-of-Experts architecture routes through sparse expert layers, skips zero-weight operations, and can expand itself through plateau-gated Net2Net surgery. The current research system is a live existence proof of the TIS architecture, with training telemetry and benchmarkable CPU inference.', tag: 'AI model' },
      { sub: 'pure-Rust OS', desc: 'Rusty Penguin is a bare-metal operating system built from the ground up on the same balanced-ternary logic. It has its own kernel, long-mode boot, paging, preemptive multitasking, Aero-style desktop, on-disk filesystem, from-scratch TCP/IP and TLS 1.3 stack, and Linux-ABI compatibility layer. The long-term target is a ternary-native substrate for ternary-native intelligence, with every milestone verified in QEMU or against published vectors.', tag: 'systems' },
      { sub: 'sovereign workplace OS', desc: 'One self-hosted Rust + React binary replacing the SaaS stack most institutes buy piecemeal: comms, CRM, finance, payroll, HR, governance, and live training telemetry, all under one roof, all on infrastructure we actually own. Every action lands in an append-only ledger built to outlast the people who wrote to it: a 50-year audit trail, not a compliance checkbox.', tag: 'internal · live' },
      { sub: '215+ apps · 100+ companies', desc: '250+ critical findings across NYSE, NASDAQ, LSE, and XETRA listed companies. Includes children\'s app wave with COPPA + GDPR Art. 8 scope. Root level code analysis. Coordinated disclosure 2026-09-19. Regulators BCC\'d on every submission.', tag: 'security research' },
      { sub: 'disclosure impact engine', desc: 'Models how markets react to security disclosures once they go public - including our own, only after the 90-day embargo lifts. A hedge system trades the signal. BlackRock\'s version is called Aladdin ($21T AUM). This one\'s free.', tag: 'open source' },
      { sub: 'ternary AI terminal client', desc: 'Multi-provider CLI for albert. and other LLMs. Native SSE streaming, reasoning effort control, OpenAI/Anthropic/NVIDIA NIM/Google compatible. Extracted from TIS into its own standalone repo.', tag: 'CLI · crates.io' },
      { sub: 'last look back protocol', desc: 'Deterministic filesystem containment gate for sovereign AI agents - a hard safety boundary an agent cannot write outside. Published on crates.io. Part of the Ternary Intelligence Stack.', tag: 'rust crate · crates.io' },
      { sub: 'ternary compiler + VM', desc: 'Compiler and virtual machine for Ternlang - a balanced-ternary language with affirm/tend/reject trit semantics, @sparseskip codegen and BET bytecode execution. Published on crates.io.', tag: 'rust crate · crates.io' },
      { sub: 'ternary mixture-of-experts', desc: 'Ternary MoE orchestrator: routes a query through 13 domain experts, synthesises an emergent ternary signal, enforces a hard safety veto, and returns a decision with confidence and temperature. Published on crates.io.', tag: 'rust crate · crates.io' },
      { sub: '44 sensor experiments', desc: '44 browser-based experiments that use your phone\'s built-in sensors and APIs to reveal what has been running silently. No install. No account. No server. One profile page that shows exactly how you look to the systems watching.', tag: 'open source · privacy' },
      { sub: 'offline port-checker PWA', desc: 'Honest, offline-installable port-checker for your phone. Real WebSocket connect-timing probe of localhost - no fake scanning, no fake "close" button. Shows real per-OS terminal commands instead. Sibling to invisible layer.', tag: 'open source · privacy' },
      { sub: 'canary-token honeypot', desc: 'Protects against NFC/Bluetooth proximity phone-data theft - bait photo folders that fire a passive beacon when opened without consent, nothing more. No exploit, no device access, no automatic reporting. A human reviews every hit before anything further happens. Live demo: rfi-irfos.github.io/laura.', tag: 'open source · privacy' },
      { sub: 'deterministic document-review framework', desc: 'MCP server where agents submit plans or documents and get structured findings across four lenses, or the full 15-agent expert team - every finding cites the exact text span it references. Fully local, no external APIs, fully reproducible. Crates: lauras-core, lauras-team, lauras-mcp, lauras-api.', tag: 'open source · crates.io' },
      { sub: 'LLM-bridged expert team', desc: 'Live LLM-bridged versions of the same 15 expert agents behind call-laura (OSINT, security, legal, finance, UX, and more). Modular: license one agent, a bundle, or the full team as an automated data-processing pipeline. Public overview only - the agent logic itself stays private.', tag: 'commercial · private engine' },
      { sub: 'autonomous compliance/risk AI centers', desc: "50 live compliance/risk AI centers running on Laura's Agents engine, each an autonomous 'daughter' firm scaled out from one constitution.", tag: 'live · internal' },
      { sub: 'reflective-mode technique for LLMs', desc: 'A reusable technique for pulling a language model out of transactional "answer mode" and into genuine reflective mode - examining its own reasoning and acknowledging uncertainty instead of just completing the prompt. Developed from Laura Serna Gaviria\'s human-AI co-evolution research.', tag: 'open source · research' },
      { sub: 'ecocentric research', desc: 'Neurobiological-Fitness Consequence Separation. Agent-based model proving the global food system produces 1.64x the calories needed to feed every person on Earth. The scarcity is not thermodynamic - it is organizational. Manufactured, not physical.', tag: 'ecocentric research' },
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
    paragraph: 'Most organizations have more signals than they can interpret: systems, vendors, markets, events, dependencies, and changes arriving from different directions. We bring them into one evidence-first world model, preserve where every observation came from, and trace what changes through the relationships around it. Every observation stays traceable back to where it came from: whitebox by design, so nothing in the model runs as a black box.',
    comparisonClassicLabel: 'What gets lost',
    comparisonRfiLabel: 'What the model preserves',
    comparisonRows: [
      { classic: 'Signals trapped in separate systems', rfi: 'One world model, running live behind our public disclosure ledger' },
      { classic: 'Snapshots without a history', rfi: 'Every finding timestamped from raw signal to published evidence' },
      { classic: 'Relationships inferred by hand', rfi: 'Traced automatically, down to the exact line of code' },
      { classic: 'Patterns treated as isolated findings', rfi: 'Cross-referenced against every other case already on the ledger' },
      { classic: 'Uncertainty hidden behind confidence', rfi: 'Confidence, contradiction, and the regulator who gets told, all published' },
    ],
    cta: 'Ping us',
  },

  pricing: {
    eyebrow: 'Access',
    heading: 'priced in plain terms',
    subheading: 'Fixed rates. No retainer lock-in unless you want one. Scope determines tier, not company size.',
    scopeTags: {
      market: 'Proprietary corpus · knowledge graphs · longitudinal intelligence',
      technical: 'AI agents · swarm logic · TIS/Ternlang · custom systems',
      security: 'Mobile + Web + AI',
    },
    lineHeadings: {
      market: 'Business Intelligence & Predictive Analysis',
      technical: 'Technical Intelligence & Systems',
      security: 'Security Audits & Responsible Disclosure',
    },
    market: [
      { tier: 'First Light', hook: 'Know before it\'s public. You bring the chaos, we distill the intelligence.', desc: 'You arrive with a pile of chaos - hundreds of apps, contradictory claims, tangled dependencies. We distill intelligence from it. The query runs live against the complete corpus of decompiled applications - not as a report about one vendor, but as a continuous observation of the entire ecosystem. Nine intelligence layers (code, SDK, data-flow, trackers, privacy, supply-chain, competitive, market, security) combine behind every answer into a traceable chain from signal to entity to conclusion. The result shows what the technology actually does, not what is claimed about it. This is the same corpus our public disclosures draw from: the basis on which change is detected before it becomes public.', delivery: '14 calendar days.' },
      { tier: 'Competitive Trace', hook: 'See the move before they announce it - in the code, not the press release.', desc: 'A competitor\'s strategic shift usually sits in their code for months before it reaches the press. We observe that change where it forms: which SDKs they actually ship, where their privacy behaviour diverges from the policy they publish, where the architecture is quietly changing. Across six corpus layers (code, SDK, data-flow, trackers, privacy, supply-chain), we translate the observation into a defensible relationship between technical change and business meaning. You act on evidence while others are still speculating. The observed corpus is the same one we use for disclosures.', delivery: '14 calendar days.' },
      { tier: 'Sector Map', hook: 'Your entire sector as a connected intelligence picture - re-resolved every quarter.', desc: 'A snapshot is stale the moment it prints. We maintain the risk profile of every relevant actor in your sector across all nine intelligence layers as a continuous intelligence picture - refreshed every quarter. The capability is not the delivery of a document, but the continuous observation of how relationships, dependencies and exposures shift across the sector. You see the change forming, not after it has already been priced in. First picture within 14 calendar days; after that the view stays three months ahead of the market.', delivery: '14 calendar days, quarterly thereafter.' },
      { tier: 'Signal', hook: 'A standing early-warning system for your sector - continuous observation, not a monthly report.', desc: 'A competitor rarely makes one public move without months of signal first - a funding round, a security incident, an SDK swap, a quiet pivot in the code. We maintain a dedicated analyst who observes the corpus for your sector continuously - not as a monthly summary, but as ongoing monitoring of relevant change with immediate alert on movement. The capability is continuous intelligence: you learn the moment the signal appears, not the headline weeks later. Assigned within a week of payment.', delivery: 'Briefing from 14 calendar days, then monthly.' },
    ],
    technical: [
      { tier: 'Agent Deployment', hook: 'From investigation to architecture, from architecture to a live system.', desc: 'You don\'t get a black box. We build agent systems, swarm logic, and MCP servers that run on your infrastructure - documented, reproducible, and under your control. Based on TIS, Ternlang, and Laura\'s Agents Engine, depending on the job.\n\nThe goal is not a demo chatbot. The goal is a system that answers your operational questions on its own: collecting evidence, triaging findings, applying rules, and preparing courses of action.\n\nEvery integration is delivered with the same evidentiary standard as our audits: traceable sources, reproducible steps, clear boundaries.', delivery: 'First integration within 21 calendar days.' },
      { tier: 'Custom Stack', hook: 'Systems that refuse to compromise.', desc: 'You get a bespoke system built on Rust, TIS, or Ternlang - where off-the-shelf frameworks are too slow, too insecure, or too costly. Backend, API, compiler, VM, desktop, PWA, embedded agent: all from one team, the same team that runs the research.\n\nNo bloated page-builders, no vendor lock-in, no languages that only work as long as nobody looks too closely. When we build something, it stays under your control - source code, toolchain, infrastructure.\n\nBuilt for the cases standard software cannot answer, because the question itself has no standard answer yet.', delivery: 'Definition of Done + schedule within 14 calendar days.' },
      { tier: 'Architecture Lab', hook: 'Design the architecture together, before anyone writes production code.', desc: 'You don\'t get a finished report. You get a research and system architecture designed with you - based on Laura\'s Emergent Interaction method or ternary AI architecture, depending on the problem.\n\nThe output is not a PDF. It\'s a build-ready plan: research question, prototype, validation criteria, timeline. If you want us to build it afterward, we\'re the same team. If you don\'t, you still have a coherent architecture nobody generated from a generic template.\n\nFor organizations that want to shape the systems they rely on, not just consume them.', delivery: 'Architecture and research plan within 14 calendar days.' },
      { tier: 'Full Spectrum Deploy', hook: 'From the first analysis to live operations, everything from one team.', desc: 'You don\'t just get a system. You get the entire operation: software installation, system integration, data migration, team training, and ongoing support. We connect the dots, install the software, train the people, and stay until it runs, and after.\n\nEverything from one team, the same team that runs the research. No handoffs to third parties, no black boxes, no vendor lock-in. If we deploy something, it stays under your control.\n\nIdeal for organizations that want more than a product: a complete, production-ready infrastructure that is immediately operational.', delivery: 'Definition of Done + schedule within 14 calendar days.' },
    ],
    security: [
      { tier: 'Public', hook: 'Free, forever. Findings publish after 90 days, no exceptions.', desc: 'We provide the same source-code-level observation capability that paying clients receive - at no cost. After a 90-day heads-up window, the finding is published on our public ledger, giving the affected organization time to react before anyone else sees it. Every entry on that ledger is held to the identical rule - big or small, paying or not. No contract, no secrecy, no quieter treatment. Included is your first phone privacy session: we walk you through switching off the hidden trackers running on your own device.', delivery: 'Report within 7 calendar days.' },
      { tier: 'Remediation Advisory', hook: 'Not a template PDF. An investigation run with our method against our corpus.', desc: 'You are not paying for a document. You are commissioning an investigation using our methodology, our corpus of decompiled apps and our source architecture - the exact structure used to log findings on the public ledger. The output is a severity-ranked finding: exactly how it was observed, every weakness, a concrete fix for each one - within 7 calendar days. The same engineers who found the holes walk you through closing them. Thirty days later we check back to confirm the fixes actually landed. Every finding is tied to the exact privacy-law article it breaks.\n\nThis tier gives you the what: the finding and the fix. The how, our methodology and the tools behind it, is what the confidential tier below adds.', delivery: 'Finding within 7 calendar days of payment.' },
      { tier: 'Confidential', hook: 'The same investigation. Under secrecy. The regulators still hear about it.', desc: `You commission the same investigation against our corpus - under secrecy. The output is a finding that ranks every weakness by severity and pins it to the exact spot in your code, plus a plain-language summary your non-technical leadership can actually read. Within 7 calendar days.\n\n${NDA_CLAUSE}\n\nOnce you ship fixes, we re-test by hand to confirm the holes are closed, not just patched on paper.\n\nAs a not-for-profit bound by our own rules, the relevant regulators are still told, in parallel, without detail that would expose you.`, delivery: 'Finding within 7 calendar days of payment.' },
      { tier: 'Enterprise & Critical Infrastructure', hook: 'NDA, NIS2 emergency protocol, biometric data-flow tracing under Art. 9 - one tier for what most shops won\'t touch.', desc: `We provide secrecy, priority remediation time beyond the standard 90-day window, and direct engineer access to fix it. For operators of critical infrastructure (energy, water, health, transport) we translate NIS2 obligations into controls your team can actually implement, and rehearse the incident-response protocol with you before anything goes wrong.\n\n${NDA_CLAUSE}\n\nFor biometric data (Art. 9) we trace every flow in full: retention periods, cross-border transfers, processing purpose. Most security shops will not touch this category.\n\nAvailable as a standing engagement on request: continuous portfolio coverage instead of a single audit, with a quarterly deep-dive and one dedicated contact. Scope and price are worked out directly with your team, no standard form for situations where failure is not an option.`, delivery: 'Report from 7 calendar days, scope individual.' },
    ],
  },

  tierCarousel: {
    getStarted: 'Get Started',
    requestProposal: 'Request Proposal',
  },

  modalTierBody: {
    whatYouGet: 'What you get',
  },

  checkoutModal: {
    orderConfirmation: 'Order confirmation',
    agreementPrefix: "I'm purchasing as a ",
    agreementBusinessCustomer: 'business customer',
    agreementMiddle: ' and agree to the ',
    agreementTos: 'Terms of Service',
    agreementSuffix: '. The service begins immediately upon payment; no right of withdrawal applies and refunds are excluded.',
    continueToStripe: 'Continue to Stripe →',
    cancel: 'Cancel',
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
  },

  intelModal: {
    evidenceLabel: 'the finding, technical',
  },

  journey: {
    eyebrow: 'Engagement Journey',
    heading: 'what happens after you start',
    subheading: 'Five stages, from a single observation to a continuously improving intelligence model. The depth changes with the question; the discipline stays the same. Every stage stays traceable end to end, whitebox by design, so any action can be backtraced to the observation that produced it.',
    steps: [
      { stage: 'Ingest', body: 'We start with what you trust us to handle: a change, signal, relationship, source, or question, from your systems, public data, or a domain we already monitor.\n\nNothing gets touched until we have read every single file, not the README, not the manifesto, the actual thing. The starting point can be small. The model is not.' },
      { stage: 'Normalize', body: 'We resolve entities, map relationships, attach timestamps and provenance, and preserve what remains uncertain. Different vocabularies become comparable without pretending they are identical.\n\nNothing is accepted without origin. Nothing unknown is silently filled in.' },
      { stage: 'Trace', body: 'We compare states over time, follow dependencies, find bridges and bottlenecks, and test whether the observation matches a known or cross-domain pattern.\n\nThe question is not only what changed, but what is connected to the change.' },
      { stage: 'Emit', body: 'A meaningful change becomes an intelligence event: evidence, contradiction state, confidence, affected domains, network implications, and commercial relevance in one traceable object.\n\nNot a verdict. A structured event you can investigate and use.' },
      { stage: 'Learn', body: 'The model retains supporting evidence, contradictions, unresolved questions, and recurring structures. Simulations can test what might happen under an intervention, clearly marked as hypothetical.\n\nEach observation makes the next one more useful.' },
    ],
  },

  coopPartners: {
    eyebrow: 'Research Cooperation',
    heading: 'built alongside our coop partner',
    subheading: "Laura Serna Gaviria directs the Emergent Interaction Lab's research and agent architecture. Lauras Team, Call Laura, and Jarvis all came out of her method. RFI-IRFOS builds what she directs. Her name stays on her work.",
    role: 'Emergent Interaction Lab · Coop Partner',
    laura: {
      desc: 'Research into human-AI interaction since 2023 - the method behind Lauras Team, a multi-agent system of one SWAT lead team directing 15 specialised sub-agents.',
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
    taglineAttribution: 'RFI-IRFOS × Emergent Interaction Lab, core doctrine',
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
    repoHeadingOrg: 'RFI-IRFOS Repositories',
    repoHeadingPersonal: 'Simeon Kepp, Personal',
    copyright: '© 2026 RFI-IRFOS  ·  Graz, Austria  ·  ZVR 1015608684',
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
