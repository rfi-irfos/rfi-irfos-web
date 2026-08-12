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
const NDA_CLAUSE = "What's confidential, and what isn't: Our methodology stays private under this agreement. The finding itself is published on our public ledger after the standard 90-day embargo, the same as for every organization we assess - payment changes when your team gets the detail, never whether the public does."

export const EN = {
  nav: {
    links: {
      research: 'Research',
      projects: 'Projects',
      trackRecord: 'Track Record',
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
    identity: 'Fifteen years past university, we build production systems and audit the ones other people ship. No theater, no high-visibility vests.',
    stats: {
      researchAreas: 'research areas',
      openSourceProjects: 'open-source projects',
      publications: 'publications',
      people: 'people, in-house',
      years: 'years of research',
    },
    ctaTrackRecord: 'Track Record',
    ctaBookUs: 'Book us!',
  },

  research: {
    eyebrow: '01 / Areas of Magnification',
    heading: 'where our attention falls',
    subheading: 'One team. The same people who train the model write the regulatory analysis and file the disclosure.',
    areas: [
      { title: 'Ternary AI & Computing', desc: 'Post-binary arithmetic as the foundation for language models, compilers, and operating systems. Patent pending A50296/2026.' },
      { title: 'Security & Privacy', desc: 'Root level code analysis, GDPR enforcement, coordinated responsible disclosure at scale. ISO/IEC 29147 framework.' },
      { title: 'AI Governance & Ethics', desc: 'Constitutional AI design, EU AI Act compliance. Plateau-gated self-cultivation: architecture grown from evidence, never forced. Immutable governance by construction.' },
      { title: 'Ecocentric Technology', desc: 'Technology in service of ecological and social systems. Sufficiency over growth. Research into manufactured scarcity.' },
      { title: 'Minor & Youth Protection', desc: 'COPPA compliance, GDPR Art. 8, EU AI Act provisions for minors. Audit of children\'s apps, games, and streaming platforms. Biometric and behavioural data of minors under magnification.' },
      { title: 'Prompt Injection & Adversarial Robustness', desc: 'Red-teaming prompt injection, jailbreak resistance, and adversarial robustness. Mapping where instruction-following breaks under pressure, and hardening against it.' },
      { title: 'Web App Development', desc: 'Full-stack builds engineered by the same team that audits for a living. React front ends, Rust backends, installable PWAs. No bloated page builders, no lock-in.' },
      { title: 'Model Welfare & Wellbeing', desc: 'Model welfare as a first-class research axis. Wellbeing signals during training, distress detection, and dignity for the systems we cultivate, not just the humans they serve.' },
    ],
  },

  projects: {
    eyebrow: '03 / Undertakings',
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
          q: 'AI systems drift from their spec the moment real users touch them.',
          a: 'We investigate what it actually does, not what the documentation promised.',
          detail: 'Root-level testing against real inputs and real users, not a vendor demo or a benchmark score.',
        },
        {
          q: 'What a system does in production and what it did in testing are rarely the same system.',
          a: 'We instrument the running system and reproduce the divergence.',
          detail: 'Same root-cause discipline as every finding we publish. A symptom is not a cause, and we do not file it as one.',
        },
        {
          q: 'NIS2 sets the obligations. Nobody hands you the technical controls that satisfy them.',
          a: 'We translate directive obligations into technical controls your infrastructure team can implement.',
          detail: 'NIS2 is not a checklist you can buy. We map the obligations against your actual systems, your actual code, and the actual data flows that regulators will ask about first.',
        },
        {
          q: 'Most companies can\'t point to their actual AI Act risk tier - only assume one.',
          a: 'We place your systems in the AI Act risk tiers and show the evidence behind every placement.',
          detail: 'Mapped against actual risk tiers and real data flows, not a generic compliance questionnaire.',
        },
        {
          q: 'Children\'s-data consent flows break exactly where most compliance reviews stop checking.',
          a: 'We audit under COPPA, GDPR Art. 8, and the EU AI Act provisions for minors - the intersection where most compliance frameworks stop.',
          detail: 'Children\'s privacy is not a lighter version of adult privacy. We test the exact flows that matter for minors: age gating, consent mechanisms, biometric handling, and the SDKs that run before any screen appears.',
        },
        {
          q: 'Body data moves through wearables and health AI along paths nobody has fully mapped.',
          a: 'We trace where bodies become data - from sensor to storage to third-party processor.',
          detail: 'The Internet of Bodies is not hypothetical. We audit wearables, medical devices, and AI health assistants for GDPR Art. 9 compliance, data minimisation, and the cross-border transfers that happen without anyone noticing.',
        },
        {
          q: 'Security incidents get patched over before anyone reconstructs how they actually happened.',
          a: 'We reconstruct the chain from entry point to impact, with the artefacts to prove each link.',
          detail: 'Delivered in the same five-question format as every audit: what we found, what proves it, how we proved it, how sure we are, what to do about it.',
        },
      ],
      pricingLink: 'Pricing →',
    },
    items: [
      { sub: 'TIS monorepo', desc: 'Full-stack post-binary AI platform. Language, compiler, ISA, virtual machine, linear algebra, API, and model. Built on balanced ternary {-1, 0, +1}.', tag: 'core platform' },
      { sub: 'ternary MoE language model', desc: 'Language model trained from scratch on ternary arithmetic. Grows its own architecture via autonomous plateau-gated Net2Net surgery. No human layer additions ever.', tag: 'AI model' },
      { sub: 'pure-Rust OS', desc: 'Operating system written from scratch in Rust. Own kernel, GUI desktop, from-scratch TCP/IP stack, Linux ABI compatibility layer. Ubuntu replacement roadmap active.', tag: 'systems' },
      { sub: 'sovereign workplace OS', desc: 'One self-hosted Rust + React binary running the entire institute: comms, CRM, finance, payroll, HR, governance, and live training telemetry. Append-only 50-year audit trail.', tag: 'internal · live' },
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
    eyebrow: '04 / Track Record',
    heading: 'the discipline, demonstrated',
    paragraph: 'We decompile shipped apps and trace their data flows to real endpoints in real countries. Companies land on this ledger for many different reasons: they hand your data to third parties, they track without consent, they leave the door open. Every report goes out with the data-protection authorities copied in and a ninety-day clock attached. One rule, no exceptions: paying clients and everyone else are held to the identical standard.',
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
      smaliClasses: 'The full shipped code we have actually read — not an estimate.',
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
    eyebrow: '05 / The Deliverable',
    heading: "what you'd actually hold in your hands",
    subheading: 'Every case on the ledger ends in one of these: a complete, evidence-backed disclosure report, published in full once the embargo lifts - same format and depth regardless of whether the company ever engages us further. No summary. No sales deck. Open one and read the real thing.',
    viewReport: 'read the full report',
    resolvedOn: (date: string) => `resolved ${date}`,
    carouselPrevAria: 'Previous report',
    carouselNextAria: 'Next report',
  },

  appPrivacy: {
    eyebrow: '02 / Start Here',
    heading: 'what your app does after it ships',
    paragraph: "Your app passes its build checklist. That says nothing about what the shipped binary does in production: which SDKs it contacts, where data lands, whether tracking fires before consent. We decompile it and trace every flow to the endpoint and the country it terminates in. Checklists record intent. We report behaviour.",
    comparisonClassicLabel: 'What you used to see',
    comparisonRfiLabel: 'What we do differently',
    comparisonRows: [
      { classic: 'A checklist the app was built to pass', rfi: 'Source-code tracing of the app as it actually runs' },
      { classic: "Trust in the vendor's compliance statement", rfi: 'Each control verified under NIS2, GDPR, and the AI Act' },
      { classic: 'A single snapshot captured at launch', rfi: 'Continuous monitoring backed by regulator-grade evidence' },
      { classic: 'A pass-or-fail verdict', rfi: 'A timestamped, reproducible audit trail, regulator-ready' },
      { classic: "Remediation left to the vendor's discretion", rfi: 'Stalled remediation triggers disclosure under our statutory mandate' },
    ],
    cta: 'Send us your app',
  },

  pricing: {
    eyebrow: '06 / Access',
    heading: 'priced in plain terms',
    subheading: 'Fixed rates. No retainer lock-in unless you want one. Scope determines tier, not company size.',
    scopeTags: {
      security: 'Mobile + Web + AI',
      market: 'App ecosystem intelligence',
    },
    lineHeadings: {
      security: 'Security Audits & Responsible Disclosure',
      market: 'Business Intelligence & Prediction',
    },
    security: [
      { tier: 'Public', hook: 'Free, forever. Findings publish after 90 days, no exceptions.', desc: 'You get the same source-code-level audit we run for paying clients, at no cost. Findings publish on our public ledger after a 90-day heads-up window, giving the organization time to react before anyone else sees it.\n\nEvery name on that ledger is held to the identical rule, big or small, paying or not. No contract, no secrecy, no quieter treatment for anyone.\n\nYour first phone privacy session is included: we walk you through switching off the hidden trackers running on your own device.', delivery: 'Report within 7 calendar days.' },
      { tier: 'Remediation Advisory', hook: 'The report your security team actually wanted. With the engineers who found it, at the table.', desc: 'You get a ranked report in plain language: exactly how we tested, every weakness, a concrete fix for each one - within 7 calendar days of payment.\n\nThe same engineers who found the holes walk you through closing them. Never a list handed off to someone else to interpret.\n\nThirty days later we check back to confirm the fixes actually landed, not that someone claimed they did. Every finding is tied to the exact privacy-law article it breaks.', delivery: 'Report within 7 calendar days of payment.' },
      { tier: 'Confidential', hook: 'The same report. Under secrecy. The regulators still hear about it.', desc: `You get a written report ranking every weakness by severity and pinned to the exact spot in your code, plus a plain-language summary your non-technical leadership can actually read. Within 7 calendar days of payment.\n\n${NDA_CLAUSE}\n\nOnce you ship fixes, we re-test by hand to confirm the holes are closed, not just patched on paper.\n\nAs a not-for-profit bound by our own rules, the relevant regulators are still told, in parallel, without detail that would expose you.`, delivery: 'Report within 7 calendar days of payment.' },
      { tier: 'Enterprise & Critical Infrastructure', hook: 'NDA, NIS2 emergency protocol, biometric data-flow tracing under Art. 9 - one tier for what most shops won\'t touch.', desc: `You get secrecy, priority path beyond the standard 90-day remediation window, and direct engineer access to fix it. For operators of critical infrastructure (energy, water, health, transport) we translate NIS2 obligations into controls your team can actually implement, and rehearse the incident-response protocol with you before anything goes wrong.\n\n${NDA_CLAUSE}\n\nFor biometric data (Art. 9) we trace every flow in full: retention periods, cross-border transfers, processing purpose. Most security shops will not touch this category.\n\nAvailable as a standing engagement on request: continuous portfolio coverage instead of a single audit, with a quarterly deep-dive and one dedicated contact. Scope and price are worked out directly with your team, no standard form for situations where failure is not an option.`, delivery: 'Full report within 7 calendar days, scope agreed individually.' },
    ],
    market: [
      { tier: 'Ecosystem Snapshot', hook: 'Know before it\'s public. One query, hundreds of apps, an answer nobody else can pull.', desc: 'While your competitors wait for a press release, you already know. We answer one question against the full decompiled-app corpus - not a report about one vendor, a live query run across the whole ecosystem.\n\nNine intelligence layers run behind every answer: Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain, Competitive, Market, Security. Not opinions, not marketing copy - what the code actually does, right now.\n\nThe same corpus our public disclosures come from. If something is about to break, we see it forming before it becomes a headline - and so do you.', delivery: '14 calendar days.' },
      { tier: 'Competitive Intelligence', hook: 'See the move before they announce it.', desc: 'By the time a competitor\'s pivot hits the press, it has usually been sitting in their code for months. We read the code first: which SDKs they actually ship, where their privacy behaviour diverges from the policy they publish, where the architecture is quietly changing.\n\nBenchmarked across six layers of the corpus - code, SDK, data-flow, tracker, privacy, supply-chain - so you\'re acting on evidence while everyone else is still speculating in the boardroom.\n\nThe same corpus we use for disclosures. They have no idea they\'re being watched.', delivery: '14 calendar days.' },
      { tier: 'Sector Intelligence Report', hook: 'The whole sector, mapped and refreshed before your competitors know the ground moved.', desc: 'A snapshot is stale the moment it prints. You get the risk profile of every major player in your sector, across all nine intelligence layers, refreshed every quarter - so you see the shift while it\'s still forming, not after it\'s already priced in.\n\nFirst report within 14 calendar days. After that, you\'re always looking at the sector three months ahead of whoever is still reading last year\'s market report.', delivery: '14 calendar days, quarterly thereafter.' },
      { tier: 'Ongoing Intelligence Briefing', hook: 'A standing early-warning system for your sector. Built so you\'re never the last to know.', desc: 'A competitor rarely makes one move in public without months of signal first - a funding round, a security incident, an SDK swap, a quiet pivot in the code. You get the alert the moment the signal appears, not the headline weeks later.\n\nOne dedicated analyst watches the corpus for your sector continuously: a monthly briefing, an immediate alert on movement. Assigned within a week of payment.', delivery: 'First briefing within 14 calendar days, then monthly.' },
    ],
  },

  tierCarousel: {
    recommendedTier: '★ Recommended tier',
    featuredTier: 'Featured tier',
    getStarted: 'Get Started',
    requestProposal: 'Request Proposal',
    recommendedBadge: '★ RECOMMENDED',
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
    eyebrow: '07 / Engagement Journey',
    heading: 'what happens after you start',
    subheading: 'Five stages, from a one-week security audit to a standing intelligence retainer. Depth and timeline change between tiers and product lines - AppSec, compliance, or business intelligence. The order never does.',
    steps: [
      { stage: 'Kickoff', body: "We lock the scope and name the engineer who runs the case.\n\nAccess, credentials, systems: everything moves over an encrypted channel. You have a name and a start date before work begins." },
      { stage: 'Analyse', body: 'We decompile, instrument, correlate, and trace - whatever the system demands. The same Sources and Methods principles apply to every client, paying or not.\n\nIf only one engineer can reproduce it, it does not ship as a finding.' },
      { stage: 'Review', body: 'We triage and rank every finding by severity before you see it.\n\nSame five-part format documented in our Methodology: what we found, what proves it, how we proved it, how sure we are, what to do about it.' },
      { stage: 'Delivery', body: "Findings arrive in your tier's format: plain-language summary first, technical detail underneath.\n\nInside the window agreed at checkout, not after it." },
      { stage: 'Follow-up', body: 'Once fixes ship, we re-test and confirm the gap is closed. Claims do not count.\n\nOn ongoing engagements, follow-up is where the next audit cycle starts.' },
    ],
  },

  coopPartners: {
    eyebrow: '08 / Research Cooperation',
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
    eyebrow: '09 / Contact & Disclosures',
    heading: 'reach us directly',
    paragraph: "One form, whatever it is: a question, a service inquiry, research collaboration, or a security finding. Findings come to us directly, never through a third-party bug bounty platform. We would refuse to be routed through one ourselves.",
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
        links: { research: 'Research', trackRecord: 'Track Record', methodology: 'Methodology' },
      },
    },
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
