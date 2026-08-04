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

export const EN = {
  nav: {
    links: {
      research: 'Research',
      projects: 'Projects',
      trackRecord: 'Track Record',
      pricing: 'Pricing',
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
    identity: 'Regulated Austrian research institute for NIS2 implementation, cybersecurity compliance, ternary AI, governance, and ecocentric technology. We translate directive obligations into technical controls, audit critical infrastructure, and file disclosures with regulators.',
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
    eyebrow: '02 / Undertakings',
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
          q: "Your AI doesn't behave the way it's supposed to?",
          a: 'We investigate what it actually does, not what the documentation promised.',
          detail: 'Root-level testing against real inputs and real users, not a vendor demo or a benchmark score.',
        },
        {
          q: 'Your software behaves differently in production than it did in testing?',
          a: 'We observe the system as it really runs, under real conditions.',
          detail: 'The same root-cause tracing discipline behind every finding we publish - stopping at the first symptom isn\'t a finding yet.',
        },
        {
          q: 'You need NIS2-compliant incident response but don\'t know which controls actually fit your stack?',
          a: 'We translate directive obligations into technical controls your infrastructure team can implement.',
          detail: 'NIS2 is not a checklist you can buy. We map the obligations against your actual systems, your actual code, and the actual data flows that regulators will ask about first.',
        },
        {
          q: 'You\'re worried about the AI Act and don\'t know where you actually stand?',
          a: 'We assess where the real risk sits, not just where a checklist points.',
          detail: 'Mapped against actual risk tiers and real data flows, not a generic compliance questionnaire.',
        },
        {
          q: 'Your app processes children\'s data and you\'re not sure the consent flow actually holds up?',
          a: 'We audit under COPPA, GDPR Art. 8, and the EU AI Act provisions for minors - the intersection where most compliance frameworks stop.',
          detail: 'Children\'s privacy is not a lighter version of adult privacy. We test the exact flows that matter for minors: age gating, consent mechanisms, biometric handling, and the SDKs that run before any screen appears.',
        },
        {
          q: 'You\'re building AI health or wearable products and the biometric data path is unclear?',
          a: 'We trace where bodies become data - from sensor to storage to third-party processor.',
          detail: 'The Internet of Bodies is not hypothetical. We audit wearables, medical devices, and AI health assistants for GDPR Art. 9 compliance, data minimisation, and the cross-border transfers that happen without anyone noticing.',
        },
        {
          q: 'There\'s a security issue and nobody can explain how it happened?',
          a: 'We trace it back through the system until the cause is clear.',
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
    eyebrow: '03 / Track Record',
    heading: 'the discipline, demonstrated',
    paragraph: 'We read apps at the source-code level, not just the outside. The companies on this ledger got here the same way: they quietly pass your data to third parties, track you without consent, or leave security holes open. On every report we send, the data-protection authorities are copied in directly and we give the company ninety days to fix it before anything becomes public. The rule is simple and non-negotiable: every organization here is treated exactly the same, whether or not they ever pay us a cent.',
    kpis: {
      appsAudited: 'Apps audited',
      companiesNotified: 'Companies notified',
      criticalFindings: 'Critical findings',
      regulatorsNotified: 'Regulators notified',
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
    },
    row: {
      today: 'today',
      daysAgo: (d: number) => `${d}d ago`,
      closed: 'CLOSED',
      disclosureLabel: 'DISCLOSURE',
      respondedLabel: 'RESPONDED',
      elapsedLabel: 'ELAPSED',
      yes: 'YES',
      no: 'NO',
      pdf: 'PDF',
    },
    footerNote: 'this ledger is updated in real time as companies respond. silence is public. · ',
  },

  appPrivacy: {
    eyebrow: '04 / Start Here',
    heading: 'does your app really protect user data?',
    paragraph: "Most teams believe the answer is yes, because the app passes whatever checklist it was built against. What it actually does once it's running — which SDKs it talks to, where the data ends up, whether tracking starts before anyone consents — is a separate question, and often a different answer. This is usually the easiest place to start, because the question itself is easy to ask.",
    comparisonClassicLabel: 'Typical app review',
    comparisonRfiLabel: 'RFI',
    comparisonRows: [
      { classic: 'Reads the privacy policy', rfi: 'Reads what the code actually does' },
      { classic: 'Checks which permissions are requested', rfi: 'Checks which permissions are actually used' },
      { classic: "Takes the vendor's compliance claim on trust", rfi: "Traces where each SDK's data actually goes" },
      { classic: 'A one-time snapshot', rfi: 'Reproducible, timestamped evidence' },
      { classic: 'A pass/fail checklist result', rfi: 'A plain-language report, technical detail underneath' },
    ],
    cta: 'Talk to us about your app',
  },

  pricing: {
    eyebrow: '05 / Pricing',
    heading: 'priced in plain terms',
    subheading: 'Fixed rates. No retainer lock-in unless you want one. Scope determines tier, not company size.',
    scopeTags: {
      security: 'Mobile + Web + AI',
      market: 'Desk research + technical analysis',
      web: 'Web only',
      mobile: 'Mobile only (Android + iOS)',
    },
    lineHeadings: {
      security: 'Security Audits & Responsible Disclosure',
      market: 'Market Research & Competitor Analysis',
      web: 'Web Development',
      mobile: 'Mobile App Development & Fixing',
    },
    security: [
      { tier: 'Public', hook: 'Free, forever - findings publish after 90 days no matter what.', desc: 'You get the same source-code-level audit we run for paying clients, at no cost. Findings publish on our public ledger after a 90-day heads-up window, giving the organization time to fix the problem before anyone else sees it.\n\nEvery name on that ledger is held to the identical rule, big or small, paying or not. No contract, no secrecy agreement, no quieter treatment for anyone.\n\nYour first phone privacy session is included: we walk you through switching off the hidden trackers running on your own device. That offer does not expire.', delivery: 'Begins immediately after intake; report within 7 calendar days of scope lock.' },
      { tier: 'Security Retainer', hook: 'Ongoing security coverage between audits, not a one-time snapshot.', desc: 'A single audit is a photo taken on one day; real security drifts the moment you ship new code. This retainer replaces the snapshot with ongoing coverage.\n\nFor 1,500 euros a month we monitor your product continuously, run a full deep-dive audit every three months, and move you to the front of the queue the instant something urgent appears.\n\nYou get one named engineer who already knows your system, so a panic call never starts with explaining your setup. Coverage begins within days of your first payment.\n\nThink of it as a standing security team on call, without hiring one.', delivery: 'Report within 7 calendar days of audit completion.' },
      { tier: 'Remediation Advisory', hook: 'A ranked report, plus a walkthrough with the engineers who found it.', desc: 'You get a ranked report in plain language: exactly how we tested, every weakness found, and a concrete fix for each one, delivered within 7 calendar days of payment.\n\nThe engineers who found the holes walk you through closing them. This is never a list of problems handed off to someone else to interpret.\n\nThirty days later we check back to confirm the fixes actually landed, not that someone claimed they did. Every finding is tied to the exact privacy-law article it breaks, so your legal team gets a map instead of a guess.\n\nThis is the difference between having a report and being truly fixed.', delivery: 'Report within 7 calendar days of payment.' },
      { tier: 'Confidential', hook: 'The same ranked report, kept private under a strict secrecy agreement.', desc: 'You get a written report ranking every weakness by severity and pinned to the exact spot in your code, plus a plain-language summary your non-technical leadership can actually read. Delivered within 7 calendar days of payment.\n\nEverything stays private under a strict secrecy agreement; your customers and the public never see it. Once you ship fixes, we re-test by hand to confirm the holes are closed, not just patched on paper.\n\nOne thing does not change: as a not-for-profit bound by our own rules, the relevant regulators are still told, in parallel, without detail that would expose you. Discretion where it matters, proof where it counts.', delivery: 'Report within 7 calendar days of payment.' },
      { tier: 'Enterprise NDA', hook: 'Private report, longer embargo, direct engineer access to fix it.', desc: 'You get the same private, ranked report as the Confidential tier, with one difference: the embargo runs well past our standard 90 days, so your team has real time to fix things properly instead of patching over a weekend.\n\nYou work directly with the engineers on the repair. Your lawyers receive a complete evidence package they can hand straight to counsel.\n\nWe kick off within days of payment, and any follow-up work jumps the queue. Built for organizations where fixing everything inside 90 days is not realistic.', delivery: 'Begins immediately after intake; full report within 7 calendar days of scope lock.' },
      { tier: 'Critical Infrastructure', hook: 'NIS2-compliant emergency response for regulated operators.', desc: 'You get a full-scope review under a secrecy agreement, our own legal review, and a rehearsed incident-response protocol built with your team before anything goes wrong. For operators of energy, water, health care, or transport infrastructure, a breach is a public-safety event, not an IT ticket.\\n\\nWe translate NIS2 obligations into technical controls your infrastructure team can actually implement, and we speak directly to the Austrian and German authorities on your behalf. You receive a standing emergency-response protocol, so the worst day is rehearsed in advance, not invented on the spot.\\n\\nWe mobilize within days of payment. This is the tier for situations where failure is not an option.', delivery: 'Begins immediately after intake; full report within 7 calendar days of scope lock.' },
      { tier: 'IoB / Art. 9', hook: 'A full biometric-data trace - the category most shops won\'t touch.', desc: 'You get a full trace of every flow of biometric data through your product: retention periods, cross-border transfers, and processing purpose, mapped against the strictest category in European privacy law.\n\nThe price reflects the depth of the work. You keep the same secrecy agreement and regulator contact as the Enterprise tier. Most security shops will not touch this category; we specialize in it because the data involved is literally people\'s bodies.\n\nWe start within days of payment.', delivery: 'Continuous; first quarterly report within 7 calendar days of kick-off.' },
      { tier: 'Annual Intelligence Retainer', hook: 'A year-round external security and compliance department.', desc: 'You get a full year of our flagship service: continuous coverage of your entire app portfolio, not a sample, with a deep audit every three months.\n\nYour dedicated contact speaks directly to the regulators that matter, from the Austrian and German data-protection authorities to the UK ICO. You get a threat briefing every month and immediate notice the moment we see a breach taking shape.\n\nWe take over within a week of payment and act as your external security and compliance department from day one.', delivery: 'Continuous; first quarterly report within 7 calendar days of kick-off.' },
    ],
    market: [
      { tier: 'Market Overview', hook: 'A ten-page, jargon-free map of your sector, in 14 days.', desc: 'You get a plain-language map of your sector: the key players, how regulation actually works for them, and where the real openings sit. Delivered within 14 calendar days.\n\nIt runs at least ten pages, no jargon, no two-hundred-slide deck, written so a founder can read it in one sitting.\n\nResearch starts within days of payment.', delivery: '14 calendar days.' },
      { tier: 'Competitor Intelligence', hook: 'Three to five competitors taken apart: tech, privacy, positioning.', desc: 'You get three to five of your competitors taken apart: what technology they run on, how they actually treat user privacy versus what they claim, how they position themselves, and where they are strategically weak.\n\nThe result is a realistic picture of the field, including gaps you can exploit and ones you need to close. This is the homework most teams skip and later regret.\n\nDelivered within 14 calendar days of payment.', delivery: '14 calendar days.' },
      { tier: 'Sector Intelligence Report', hook: 'Market, regulation, and technology - refreshed every quarter.', desc: 'You get the complete picture of your sector: market, regulation, and technology, with each major player\'s risk exposure spelled out in numbers, not vague claims.\n\nBecause markets move, this is not a one-off document. You receive a fresh update every three months, so you always know where the sector is heading.\n\nFirst report within 14 calendar days of payment, refreshed every quarter after.', delivery: '14 calendar days.' },
      { tier: 'Ongoing Intelligence Briefing', hook: 'A dedicated analyst watching your competitors, month after month.', desc: 'You get continuous watch on your competitors: a proper briefing every month, and an immediate alert the moment one of them makes a significant move, a funding round, a pivot, a breach, or a key hire.\n\nOne dedicated analyst who knows your space handles it, so you hear about a competitor\'s launch the day it happens, not after.\n\nYour analyst is assigned within a week of payment; the first briefing lands at the end of month one.', delivery: 'First briefing within 14 calendar days, then monthly.' },
    ],
    web: [
      { tier: 'Landing Page', hook: 'A fast, clean single page, live within 48 hours.', desc: 'You get a sharp single-page site on our own open-source React template: fast, clean, live within 48 hours of payment.\n\nBuilt by the same team that audits apps for security, so it is clean by default, not an afterthought.\n\nNo page-builder lock-in: you own the code and can take it anywhere.', delivery: '48 hours.' },
      { tier: 'Full Site', hook: 'A proper multi-page site with a real content editor, PWA-ready.', desc: 'You get a proper multi-page site with a content editor your team can actually use, a working contact form, and privacy-respecting analytics built in from the start.\n\nIt ships as an installable progressive web app, behaving like a native app on Android and iPhone without an app-store listing. Delivered in about two weeks.\n\nBuilt by the same team that audits apps for security, so it is clean by default.', delivery: '14–28 calendar days, depending on scope.' },
      { tier: 'Enterprise Site', hook: 'A full custom build: Rust backend, auth, native apps included.', desc: 'You get a full custom build: a Rust backend, authentication, and the specific integrations your operation requires; we scope every one of them with you directly.\n\nReal native Android and iPhone apps are included, not a web wrapper dressed up as one. Long-term support is part of the deal, not a later upsell.\n\nWe scope the build with you in the first week after payment. For organizations where the website is the business, not a brochure.', delivery: '14–28 calendar days, depending on scope.' },
      { tier: 'Platform Build', hook: 'The whole product - infrastructure, API, native apps - built with you.', desc: 'You get a complete product, not just a site: custom infrastructure, API design, data pipelines, and native apps, with a dedicated team that stays on it.\n\nThis is the engagement for building the actual platform, not only the front door to it.\n\nWe start within a week of payment and keep building with you as the product grows; we set scope and timeline together at kickoff, not in advance.', delivery: 'User-specific timeline, aligned after kick-off.' },
    ],
    mobile: [
      { tier: 'Maintenance Retainer', hook: "Steady patches and dependency upkeep, so your app doesn't rot.", desc: 'You get a steady rhythm of patches, app-store compliance monitoring so a policy change never catches you off guard, and clean dependency upkeep so old libraries do not become tomorrow\'s emergency.\n\nOne named contact and priority response; first review lands within a week of payment.\n\nQuiet, continuous upkeep, so your app does not silently rot.', delivery: 'Ongoing engagement; first patch within 14 calendar days.' },
      { tier: 'APK Review & Bugfix', hook: 'Send your build, get root-level answers in one week.', desc: 'You send us your build; we read the actual code, not the marketing. Covers Android and iPhone.\n\nWe identify crashes and real weak spots, then hand you concrete guidance for fixing each one, at a fixed scope with a one-week turnaround from the day you send the build.\n\nA clear answer fast, instead of a six-week audit you were not braced for.', delivery: '1 week / 7 calendar days.' },
      { tier: 'App Build', hook: 'Your native app, Kotlin and Swift, built in-house from zero to shipped.', desc: 'You get your native app built from zero to shipped: Kotlin for Android, Swift for iPhone, with a Rust backend underneath.\n\nWe do everything in-house, with the team you are already talking to, not an offshore handoff. We also handle Play Store and App Store submission, exactly where most builds stall.\n\nWe kick off within a week of payment. One team, one codebase, one launch.', delivery: '14–28 calendar days, depending on scope.' },
      { tier: 'Full Mobile Product', hook: 'From a napkin sketch to a launched app, built together end to end.', desc: 'You get the whole mobile product, from a spec on a napkin to a launched app: custom infrastructure, API design, native apps, and a dedicated team that stays on it.\n\nThis is an ongoing engagement, because a real product keeps evolving after launch.\n\nWe start within a week of payment and build it with you as it grows. For when you need a mobile business built, not only an app made.', delivery: 'User-specific timeline after kick-off.' },
    ],
  },

  tierCarousel: {
    recommendedTier: '★ Recommended tier',
    featuredTier: 'Featured tier',
    getStarted: 'Get Started',
    requestProposal: 'Request Proposal',
    recommendedBadge: '★ RECOMMENDED',
    prevTierAria: 'Previous tier',
    nextTierAria: 'Next tier',
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

  journey: {
    eyebrow: '06 / Engagement Journey',
    heading: 'what happens after you start',
    subheading: 'Same five stages whether the engagement is a one-week APK review or a year-round retainer. What changes between tiers is the depth and the timeline, never the order.',
    steps: [
      { stage: 'Kickoff', body: "Scope gets locked and a named engineer is assigned.\n\nWhatever you're providing - a build, API access, a device - is exchanged through a secure channel. You know exactly who is doing the work and when it starts." },
      { stage: 'Analyse', body: 'The investigation itself, run against the same Sources and Methods principles that apply to every client.\n\nSource-level testing, root-cause tracing - nothing accepted that only one person can reproduce.' },
      { stage: 'Review', body: 'Every finding is triaged and ranked by severity before it reaches you.\n\nSame five-part format documented in our Methodology - what we found, what proves it, how we proved it, how sure we are, what to do about it.' },
      { stage: 'Delivery', body: "You receive the findings in the format your tier defines - plain-language summary first, technical detail underneath.\n\nDelivered on the window agreed at checkout." },
      { stage: 'Follow-up', body: 'Once fixes ship, a retest confirms they actually closed the gap, where the tier includes one.\n\nFor ongoing engagements, follow-up is also where the next audit cycle begins.' },
    ],
  },

  coopPartners: {
    eyebrow: '07 / Research Cooperation',
    heading: 'built alongside our coop partner',
    subheading: "Laura Serna Gaviria directs the Emergent Interaction Lab's own research and agent architecture - Lauras Team, Call Laura, and Jarvis all grew out of her method. RFI-IRFOS builds what she directs, labelled as hers so it stays clear who did what.",
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
    eyebrow: '08 / Contact & Disclosures',
    heading: 'get in touch',
    paragraph: "One form, whatever it's about: a general question, a service inquiry, research collaboration - or a security finding. If it's the last one, we run our own intake channel instead of routing it to a third-party bug bounty platform, for the same reason we'd refuse to be routed to one ourselves.",
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
      errorText: 'Something went wrong. Email us directly at contact@rfi-irfos.com',
    },
  },

  footer: {
    tagline: 'Human rights are not subject to negotiation.',
    taglineAttribution: '— RFI-IRFOS × Emergent Interaction Lab, core doctrine',
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
