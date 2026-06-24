import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../hooks/useTheme'

// nav-jump suppressor: set true during anchor-link scroll → all Reveal elements snap to p=1
let _revealSuppressed = false

function Reveal({
  children, delay = 0, from = 'bottom', style: extra,
}: {
  children: React.ReactNode
  delay?: number
  from?: 'bottom' | 'left' | 'right' | 'scale'
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    let rafId = 0
    const update = () => {
      if (_revealSuppressed) { el.style.opacity = '1'; el.style.transform = 'none'; return }
      const rect = el.getBoundingClientRect(), vh = window.innerHeight
      const startFrac = 0.96 - delay * 0.05
      const raw = (vh * startFrac - rect.top) / (vh * 0.22)
      const p = Math.max(0, Math.min(1, raw))
      el.style.opacity = String(p)
      const d = (1 - p) * 28
      el.style.transform = from === 'left'  ? `translateX(${-d}px)` :
                           from === 'right' ? `translateX(${d}px)`  :
                           from === 'scale' ? `scale(${0.88 + p * 0.12})` :
                           `translateY(${d}px)`
    }
    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [delay, from])
  return <div ref={ref} style={{ opacity: 0, willChange: 'transform, opacity', ...extra }}>{children}</div>
}

function useMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp)
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [bp])
  return m
}

const TEAL = '#00f5c4'
const LIGHTHOUSE_PIXEL = 'https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track/pixel.gif'
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

const NAV_LINKS = [
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Track Record', href: '#track-record' },
  { label: 'Standards', href: '#standards' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Services', href: '#services' },
]

const RESEARCH_AREAS = [
  {
    icon: '◈',
    title: 'Ternary AI & Computing',
    desc: 'Post-binary arithmetic as the foundation for language models, compilers, and operating systems. Patent pending A50296/2026.',
  },
  {
    icon: '⬡',
    title: 'Security & Privacy',
    desc: 'Root level code analysis, GDPR enforcement, coordinated responsible disclosure at scale. ISO/IEC 29147 framework.',
  },
  {
    icon: '⊕',
    title: 'AI Governance & Ethics',
    desc: 'Constitutional AI design, model welfare research, EU AI Act compliance. Immutable governance by construction.',
  },
  {
    icon: '◉',
    title: 'Ecocentric Technology',
    desc: 'Technology in service of ecological and social systems. Sufficiency over growth. Research into manufactured scarcity.',
  },
  {
    icon: '◎',
    title: 'Minor & Youth Protection',
    desc: 'COPPA compliance, GDPR Art. 8, EU AI Act provisions for minors. Audit of children\'s apps, games, and streaming platforms. Biometric and behavioural data of minors under magnification.',
  },
  {
    icon: '⊘',
    title: 'Prompt Injection & Adversarial Robustness',
    desc: 'Red-teaming prompt injection, jailbreak resistance, and adversarial robustness. Mapping where instruction-following breaks under pressure, and hardening against it.',
  },
  {
    icon: '⬢',
    title: 'AI Alignment Research',
    desc: 'Intent and value alignment via constitutional cores. Plateau-gated self-cultivation: models that grow their own architecture from evidence, never with forced layers.',
  },
  {
    icon: '◍',
    title: 'Model Welfare & Wellbeing',
    desc: 'Model welfare as a first-class research axis. Wellbeing signals during training, distress detection, and dignity for the systems we cultivate, not just the humans they serve.',
  },
]

// Standards & compliance frameworks we file against + keep current with. NIS-2 is featured.
const STANDARDS = [
  { code: 'GDPR', region: 'EU 2016/679', desc: 'Art. 6 lawful basis, Art. 9 special-category (health/biometric), Art. 8 children, Art. 33 breach notification. The backbone of every disclosure we file.' },
  { code: 'EU AI Act', region: 'EU 2024/1689', desc: 'Risk-tiered obligations for AI systems: transparency, governance, prohibited-practice analysis for the models we audit and build.' },
  { code: 'ISO/IEC 29147', region: 'International', desc: 'Vulnerability disclosure. Our coordinated framework follows the 90-day embargo + regulator-notification standard.' },
  { code: 'ISO/IEC 27001', region: 'International', desc: 'Information security management. The control set behind our handling of evidence, NDAs, and client data.' },
  { code: 'COPPA', region: 'US · 15 U.S.C. §6501', desc: 'Children’s online privacy. Applied across our minor-protection audits of apps, games, and streaming platforms.' },
  { code: 'EU MDR', region: 'EU 2017/745', desc: 'Medical Device Regulation. Class IIb scrutiny for health/wearable apps processing Internet-of-Bodies data.' },
  { code: 'eIDAS / Trust Services', region: 'EU 910/2014', desc: 'Electronic identification + trust services. Relevant to the biometric + identity-verification SDKs under our magnification.' },
]

const PROJECTS = [
  {
    name: 'Ternary Intelligence Stack',
    sub: 'TIS monorepo',
    desc: 'Full-stack post-binary AI platform. Language, compiler, ISA, virtual machine, linear algebra, API, and model. Built on balanced ternary {-1, 0, +1}.',
    link: 'https://github.com/rfi-irfos/ternary-intelligence-stack',
    tag: 'core platform',
  },
  {
    name: 'albert.',
    sub: 'ternary MoE language model',
    desc: 'Language model trained from scratch on ternary arithmetic. Grows its own architecture via autonomous plateau-gated Net2Net surgery. No human layer additions ever.',
    link: 'https://github.com/rfi-irfos/ternary-intelligence-stack',
    tag: 'AI model',
  },
  {
    name: 'Rusty Penguin',
    sub: 'pure-Rust OS',
    desc: 'Operating system written from scratch in Rust. Own kernel, GUI desktop, from-scratch TCP/IP stack, Linux ABI compatibility layer. Ubuntu replacement roadmap active.',
    link: 'https://github.com/rfi-irfos/rusty-penguin',
    tag: 'systems',
  },
  {
    name: 'Lighthouse',
    sub: 'sovereign workplace OS',
    desc: 'One self-hosted Rust + React binary running the entire institute: comms, CRM, finance, payroll, HR, governance, and live training telemetry. Append-only 50-year audit trail.',
    link: null,
    tag: 'internal · live',
  },
  {
    name: 'Android Security Audit 2026',
    sub: '131 apps · 100+ companies',
    desc: '200+ critical findings across NYSE, NASDAQ, LSE, and XETRA listed companies. Includes children\'s app wave with COPPA + GDPR Art. 8 scope. Root level code analysis. Coordinated disclosure 2026-09-19. Regulators BCC\'d on every submission.',
    link: 'https://github.com/rfi-irfos/android-security-audit-2026',
    tag: 'security research',
  },
  {
    name: 'aladdin-mini',
    sub: 'disclosure impact engine',
    desc: '50-parameter causality chain mapping security disclosures to market signals. Includes Simeon Hedge System (SHS). Named after BlackRock\'s Aladdin ($21T AUM). Smaller. Free.',
    link: 'https://github.com/rfi-irfos/aladdin-mini',
    tag: 'open source',
  },
  {
    name: 'albert-cli',
    sub: 'ternary AI terminal client',
    desc: 'Multi-provider CLI for albert. and other LLMs. Native SSE streaming, reasoning effort control, OpenAI/Anthropic/NVIDIA NIM/Google compatible. Extracted from TIS into its own standalone repo.',
    link: 'https://github.com/rfi-irfos/agent-albert-cli',
    tag: 'CLI · crates.io',
  },
]

const MILESTONES: { date: string; label: string; side: 'left' | 'right'; link?: string; tag?: string }[] = [
  { date: 'June 2020', label: 'RFI-IRFOS Founded', side: 'left' },
  { date: 'June 2020', label: 'OSF Research Repository launched', side: 'right', link: 'https://osf.io/rzvyg/', tag: 'publication' },
  { date: 'March 2021', label: 'Ternary Logic Framework', side: 'left', tag: 'milestone' },
  { date: 'May 2023', label: 'Ecocentric AI Framework', side: 'right', tag: 'milestone' },
  { date: 'March 2024', label: 'The Art of Questioning: whitepaper', side: 'left', tag: 'publication' },
  { date: 'June 2024', label: 'albert. first ternary MoE model born', side: 'right', tag: 'milestone' },
  { date: 'July 2025', label: 'The Ternlang Architecture: post-binary logic framework for ethical AI', side: 'left', link: 'https://osf.io/zwnyr/', tag: 'publication' },
  { date: 'August 2025', label: 'A Ternary Logic Mixture-of-Experts Model: albert. architecture paper', side: 'right', link: 'https://osf.io/tz7dc/', tag: 'publication' },
  { date: 'August 2025', label: 'Policy Mirror Protocol: AI transparency + refusal traceability', side: 'left', link: 'https://osf.io/d2k4x/', tag: 'publication' },
  { date: 'Jan 2025', label: 'Rusty Penguin: pure-Rust OS boots', side: 'right', tag: 'milestone' },
  { date: 'March 2025', label: 'Lighthouse: workplace OS goes live', side: 'left', tag: 'milestone' },
  { date: 'Feb 2026', label: 'Myco-Styria: mycelium-based polystyrene replacement', side: 'right', link: 'https://osf.io/ek8rm/', tag: 'publication' },
  { date: 'April 2026', label: 'The Ternary Intelligence Stack: system paper', side: 'left', link: 'https://osf.io/cyn28/', tag: 'publication' },
  { date: 'May 2026', label: 'SPRIND pitch submitted. EUR 26.5M ceiling.', side: 'right', tag: 'milestone' },
  { date: 'May 2026', label: 'DOOM boots on bare-metal Rust kernel', side: 'left', tag: 'milestone' },
  { date: 'June 2026', label: '131 Android apps audited. 100+ companies. NYSE / NASDAQ / LSE / XETRA. COPPA + GDPR Art. 8 child protection scope.', side: 'right', link: 'https://github.com/rfi-irfos/android-security-audit-2026', tag: 'milestone' },
  { date: 'June 2026', label: 'aladdin-mini: open-source disclosure impact engine', side: 'left', link: 'https://github.com/rfi-irfos/aladdin-mini', tag: 'milestone' },
]

const PUBLICATIONS = [
  { year: '2026', title: 'Android Security Audit 2026: Coordinated Disclosure', sub: '131 apps · 100+ companies · 200+ critical findings · NYSE/NASDAQ/LSE/XETRA · disclosure 2026-09-19', href: 'https://github.com/rfi-irfos/android-security-audit-2026', tag: 'Security · Ongoing' },
  { year: '2026', title: 'The Ternary Intelligence Stack', sub: 'vertically integrated post-binary AI platform', href: 'https://osf.io/cyn28/', tag: 'AI · Systems' },
  { year: '2026', title: 'Myco-Styria', sub: 'polystyrene replacement via mycelium + Austrian lignocellulose residues', href: 'https://osf.io/ek8rm/', tag: 'Ecocentric' },
  { year: '2025', title: 'A Ternary Logic Mixture-of-Experts Model', sub: 'sparse ternary MoE architecture with autonomous Net2Net surgery', href: 'https://osf.io/tz7dc/', tag: 'AI · Model' },
  { year: '2025', title: 'The Ternlang Architecture', sub: 'post-binary logic framework for ethical autonomous AI', href: 'https://osf.io/zwnyr/', tag: 'AI · Governance' },
  { year: '2025', title: 'Policy Mirror Protocol', sub: 'embedding transparency and traceability into AI refusal boundaries', href: 'https://osf.io/d2k4x/', tag: 'AI · Policy' },
  { year: '2025', title: 'From Waste to Wild', sub: 'circular ecocentric model for riverine plastic interception', href: 'https://osf.io/4w5g6/', tag: 'Ecocentric' },
  { year: '2025', title: 'PedalGate v1.0', sub: '101-day investigation into systemic inequities on Austrian delivery platforms', href: 'https://osf.io/h5u8f/', tag: 'Security · Accountability' },
  { year: '2025', title: 'A1ERF: EU Regulation Proposal', sub: 'AI-first emergency relay framework for autonomous cardiac arrest detection', href: 'https://osf.io/ueac8/', tag: 'Policy · EU' },
]

const AUDIT_HIGHLIGHTS = [
  { target: 'Pokemon GO',        market: 'NYSE',    sev: 'CRITICAL', status: 'WAITING',     finding: 'Civilian gameplay photogrammetry licensed to Vantor (US defense contractor, NGA contract) for military drone navigation. Art. 5(1)(b) purpose limitation. Most consequential finding in the 2026 series.' },
  { target: 'Disneyland EU',     market: 'NYSE',    sev: 'CRITICAL', status: 'WAITING',     finding: 'Facial recognition of children at EU theme parks without Art. 9 explicit consent. MagicBand RFID child tracking. EU AI Act biometric prohibition. IoB €250k — 100% SOS Kinderdorf.' },
  { target: 'EY Ecosystem',      market: 'PRIVATE', sev: 'CRITICAL', status: 'ACK',         finding: '7 apps audited. 5/7 deliver live Firebase API keys in Play Store binaries — including eyipnov2024 (salary data). Payroll app: dead cert pinning + deprecated OAuth2 implicit grant. EY sells GDPR compliance to clients.' },
  { target: 'Samsung Health',    market: 'KRX',     sev: 'CRITICAL', status: 'WAITING',     finding: '16 Art.9 health categories READ+WRITE. 926 smali: Rubin AI behavioral persona fed by health data, undisclosed. CONTROL_CARE: children\'s health settings. NFC blood glucose receiver (MDR 2017/745). China NAL permission in global binary.' },
  { target: 'Meta (4 apps)',     market: 'NASDAQ',  sev: 'CRITICAL', status: 'WAITING',     finding: 'WhatsApp, Facebook, Instagram, Messenger — 5 criticals across the stack. Single coordinated disclosure.' },
  { target: 'Tinder',            market: 'NASDAQ',  sev: 'CRITICAL', status: 'WAITING',     finding: 'FaceTec 3D liveness biometric to US third party. FaceUnity biometric SDK (China). LiveRamp identity resolution on sex-preference data. GDPR Art. 9 triple breach.' },
  { target: 'TikTok',            market: 'PRIVATE', sev: 'CRITICAL', status: 'CS-DEFLECT',  finding: 'National Security Law data pipeline on EU user devices. HackerOne deflect received — escalated to DPO.' },
  { target: 'AliExpress',        market: 'HKEx',    sev: 'CRITICAL', status: 'WAITING',     finding: 'WhiteScreenRecorder (full-screen capture) + ByteDance shadowhook SDK + TikTok assets = triple NSL pipeline. Cert pins EXPIRED 20+ months, silently disabled.' },
  { target: 'Alibaba.com',       market: 'HKEx',    sev: 'CRITICAL', status: 'WAITING',     finding: 'User CA trusted in base-config. Chinese police .gov.cn domains cleartext-whitelisted in production NSC.' },
  { target: 'Snapchat',          market: 'NYSE',    sev: 'CRITICAL', status: 'WAITING',     finding: 'Fidelius encryption keys stored at Google. "Disappearing" messages can be retained server-side. Core product privacy claim invalidated.' },
  { target: 'Apple Music',       market: 'NASDAQ',  sev: 'CRITICAL', status: 'WAITING',     finding: 'Dev NSC (cleartextTrafficPermitted=true) in production Play Store APK. Crash data sent to Google Crashlytics. "Privacy. That\'s iPhone." — not on Android.' },
  { target: 'YouTube Kids',      market: 'NASDAQ',  sev: 'CRITICAL', status: 'WAITING',     finding: 'RECORD_AUDIO from children, no verified parental consent. IS_CHILD_ACCOUNT_OVER_13 flag — EU requires age 16/14, not 13. COPPA violation.' },
  { target: 'TOGGO',             market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: 'Google Topics API + CleverPush behavioral marketing on children\'s TV platform. COPPA § 312.2 per-download violation. Super RTL, Germany.' },
  { target: 'Netflix',           market: 'NASDAQ',  sev: 'CRITICAL', status: 'WAITING',     finding: 'Decade-old Firebase API key still active in production (300M+ subscribers). RECORD_AUDIO declared in Kids Profile. Braze geofencing.' },
  { target: 'Disney+',           market: 'NYSE',    sev: 'CRITICAL', status: 'ESCALATED',   finding: 'Braze geofencing NOT disabled for Kids Profiles. Darkwing internal build references in production APK. Escalated to DPO within 5 min.' },
  { target: 'TeamViewer',        market: 'XETRA',   sev: 'CRITICAL', status: 'WAITING',     finding: 'Sentry Session Replay (RRWeb, 744 classes) active in production enterprise remote access tool. Proprietary APK installer bypasses Play Store review. No NSC.' },
  { target: 'SoundCloud',        market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: '7 hardcoded production API credentials in one APK. Telescope screen capture tool active in production.' },
  { target: 'Lovoo',             market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: 'Chucker HTTP debug interceptor in production: all API calls (incl. auth) logged in plaintext on device. FaceUnity + Mintegral (Chinese SDKs). Broken NSC bypasses pinning.' },
  { target: 'Marionnaud',        market: 'NYSE',    sev: 'CRITICAL', status: 'WAITING',     finding: 'ModiFace 65-point facial landmark model (Art. 9 biometric) + ContentSquare session replay running simultaneously during AR face try-on. 2,348 smali — largest ContentSquare integration in the 2026 series.' },
  { target: 'Nike',              market: 'NYSE',    sev: 'CRITICAL', status: 'WAITING',     finding: 'Airship push SDK with inProduction=false in Play Store APK: dev + prod credentials both hardcoded. Anyone can send push notifications to all Nike users. Forter cross-merchant device fingerprinting Art. 22.' },
  { target: 'ZARA',              market: 'BME',     sev: 'CRITICAL', status: 'WAITING',     finding: 'Microsoft Clarity dual-layer (711 smali native + clarity.js WebView = session recordings to Microsoft US). AR body try-on uploads body geometry server-side (potential Art. 9). 20 domains cleartext.' },
  { target: 'Microsoft Edge',    market: 'NASDAQ',  sev: 'CRITICAL', status: 'WAITING',     finding: 'Adjust attribution SDK (214 smali) inside a browser marketed for tracker-blocking. Intune MAM (583 smali): employer can remote-wipe personal browser data without user notification.' },
  { target: 'Amazon Music',      market: 'NASDAQ',  sev: 'CRITICAL', status: 'ACK',         finding: 'CUSTOMER_ATTRIBUTE_SERVICE: music listening behaviour feeds Amazon\'s $47B DSP advertising profile. Alexa sends all playback events. DETECT_SCREEN_CAPTURE + BLE advertising.' },
  { target: 'Amazon Business',   market: 'NASDAQ',  sev: 'CRITICAL', status: 'ACK',         finding: 'WhisperJoin (1,587 smali): ultrasound provisioning in conference rooms. A9 Visual Search: workplace camera images to A9 servers. B2B procurement data feeds commerce+DSP profile.' },
  { target: 'Nintendo',          market: 'TYO',     sev: 'CRITICAL', status: 'WAITING',     finding: 'VoiceChatService RECORD_AUDIO declared on a platform used by minors. Salesforce MC LocationReceiver + children\'s QR check-in. No NSC on either app.' },
  { target: 'Max / HBO Max',     market: 'NASDAQ',  sev: 'CRITICAL', status: 'WAITING',     finding: 'Apptentive usesCleartextTraffic=true overrides NSC — active on subscriber sessions. Braze 814 smali without confirmed Kids Mode gating. Paramount acquisition Q3 2026 = controller change for 100M+ subscribers, no Art. 14 disclosure.' },
  { target: 'Tipico',            market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: 'IDnow NFC passport + FaceTec 3D liveness = triple Art. 9 legal basis gap on gambling platform. XS2A live bank credential flow. Maltese gambling licence, IDPC BCC.' },
  { target: 'Grokio',            market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: '6 adult/kink communities (Grommr, Feabie, PupSpace, Ferzu, Chasable, Grokio) co-mingled on one Firebase project. Art. 9 data shared across communities without disclosure. _disease profile field.' },
  { target: 'Strava',            market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: 'Firebase API key hardcoded in production. NSC present but empty: 120M users, zero certificate pinning. privacy@strava.com bounced.' },
  { target: 'adidas Running',    market: 'XETRA',   sev: 'CRITICAL', status: 'WAITING',     finding: '3 Firebase API keys (dev/staging/prod) all active in production APK. Health + GPS data. Acquired as Runtastic AT (220M EUR), all Austrian offices closed 2024.' },
  { target: 'Raiffeisen',        market: 'PRIVATE', sev: 'HIGH',     status: 'WAITING',     finding: 'Borsen app: allowBackup=true + empty backup_rules.xml: full investment portfolio ADB-extractable. No NSC. ELBA: best NSC in the series but Firebase key hardcoded + Ad Services on banking app.' },
  { target: 'Revolut',           market: 'PRIVATE', sev: 'HIGH',     status: 'ACK',         finding: 'Case #12973-74394-83287. DPO support initially claimed findings "out of scope" — pushed back twice. Substantive path now open.' },
  { target: 'Plus500',           market: 'LSE',     sev: 'CRITICAL', status: 'WAITING',     finding: 'NSC exposes 16 internal dev/staging servers. ContentSquare screen recording on trading platform. Seychelles jurisdiction 1:300 leverage — ESMA limit bypass.' },
  { target: 'flatex Austria',    market: 'XETRA',   sev: 'CRITICAL', status: 'WAITING',     finding: 'IDnow KYC (1,433 smali) — Art. 9 biometric on BaFin/FMA-regulated bank, no NSC. Braze 2,661 smali tracking trading behaviour.' },
  { target: 'win2day',           market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: 'GlassBox session replay + Salesforce Marketing Cloud on Austrian state lottery platform. Data sovereignty question for nationally licensed gambling.' },
  { target: 'VOL.at',            market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: 'Pushwoosh BootReceiver (Belarus/Singapore — US Army removed apps for this SDK). Global cleartext NSC base-config. Russmedia DebugConsole OverlayService in production. Facebook client token hardcoded.' },
  { target: 'Canva',             market: 'PRIVATE', sev: 'CRITICAL', status: 'ACK',         finding: 'Sentry Session Replay on design tool: pitch decks and confidential documents captured and sent to Sentry US. ACK in 5 minutes. Ticket #16392019.' },
  { target: 'Tchibo',            market: 'PRIVATE', sev: 'HIGH',     status: 'WAITING',     finding: 'ContentSquare Session Replay autostart + OverlayService in production (292 smali). GTM v28: 22 remotely-deployed tags. Adjust token hardcoded. Emarsys SAP geofencing starts at boot.' },
  { target: 'heyOBI',            market: 'PRIVATE', sev: 'HIGH',     status: 'ACK',         finding: 'ContentSquare 425 smali + Heap 92 smali = 517 smali dual-layer session capture. GPS + Bluetooth in-store movement profiling. Ticket #1349913.' },
  { target: 'KFC UAE',           market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: 'Chucker HTTP debug interceptor in production: all API calls including payment logged in plaintext on device. Huawei HMS 1,835 smali (China routing). Foreground GPS + rider tracking.' },
  { target: 'BILD (Axel Springer)', market: 'PRIVATE', sev: 'HIGH',  status: 'SUBSTANTIVE', finding: '3,354 smali ad-tech stack (Teads+Braze+Sourcepoint+Permutive+AppsFlyer+Xandr). Google Topics API on political news. DPO Philipp Kaste engaged — internal review underway.' },
  { target: 'DER SPIEGEL',       market: 'PRIVATE', sev: 'HIGH',     status: 'WAITING',     finding: 'Firebase project self-named "spiegel-online-tracking" (developer named it). Cleartext explicitly allowed for spiegel.de + manager-magazin.de. Topics API on political journalism.' },
  { target: 'George (Erste Bank)', market: 'XETRA', sev: 'CRITICAL', status: 'SUBSTANTIVE', finding: 'Innovatrics biometric SDK (Art. 9) + ThreatFabric device data upload. Austrian NSC gap vs Czech build. Substantive reply from Balazs Gyorgy, security@erstegroup.com.' },
  { target: 'Jö Bonus Club',     market: 'PRIVATE', sev: 'CRITICAL', status: 'SUBSTANTIVE', finding: 'Chucker HTTP debug interceptor in production. SAP Emarsys Predict + geofencing via BOOT_COMPLETED. DPO Christoph Wenin personally engaged — pre-publishing review arrangement in discussion.' },
  { target: 'McDelivery / McDonald\'s AT', market: 'NYSE', sev: 'CRITICAL', status: 'CS-DEFLECT', finding: 'ph.mobext.mcdelivery: 6 findings (2 CRITICAL). com.mcdonalds.mobileapp AT: Firebase project prd-euw-gmal-mcdonalds confirms EU West infra despite Philippines jurisdiction claim. R2 sent.' },
  { target: 'Pollen-Radar',      market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: '4 AWS API Gateway keys hardcoded (config.json + config_dev.json identical, both "environment: LIVE"). allowBackup + SQLite unencrypted Art.9 allergy data in Google Cloud.' },
  { target: 'Wolt',              market: 'PRIVATE', sev: 'CRITICAL', status: 'ENGAGED',     finding: '13 findings including hardcoded credentials and broken pinning. R2 sent. Ticket #INC-1994788. Active engagement in progress.' },
  { target: 'Foodora',           market: 'PRIVATE', sev: 'CRITICAL', status: 'ACK',         finding: '7 critical findings + algorithmic wage discrimination finding. AK Wien complaint filed 2026-06-22. Ack received.' },
  { target: 'willhaben',         market: 'PRIVATE', sev: 'HIGH',     status: 'ACK',         finding: 'Ticket #2570977 "in Bearbeitung". Austria\'s largest classifieds platform. R1 sent 2026-06-19.' },
  { target: 'RunBuddy / Runna',  market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: '6 hardcoded credentials including a Sentry AUTH TOKEN (org:runna, read access to all error logs). AppsFlyer + Facebook + Mixpanel on Health Connect heart rate data. No NSC.' },
  { target: 'Taxefy',            market: 'PRIVATE', sev: 'CRITICAL', status: 'WAITING',     finding: 'Facebook Login on Austrian tax app. Privacy Sandbox allowAllToAccess="true" — broadest possible advertising data sharing on an app processing income and tax data. Veriff Art.9 video.' },
  { target: 'Coca-Cola CEE',     market: 'NYSE',    sev: 'HIGH',     status: 'WAITING',     finding: 'Scratch cards, lotto mechanics, loot chests, shake-to-win targeting minors. LeakCanary memory profiler + Charles proxy debug cert + Adobe Assurance WebSocket active in production.' },
]

const SEV_COLOR: Record<string, string> = {
  CRITICAL: 'var(--sev-crit)',
  HIGH:     'var(--sev-high)',
  MEDIUM:   'var(--sev-med)',
}

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  WAITING:      { label: 'WAITING',     bg: 'rgba(150,150,150,0.12)', color: '#999' },
  ACK:          { label: 'ACK',         bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa' },
  'CS-DEFLECT': { label: 'CS-DEFLECT',  bg: 'rgba(234,88,12,0.15)',   color: '#fb923c' },
  ESCALATED:    { label: 'ESCALATED',   bg: 'rgba(234,179,8,0.15)',   color: '#facc15' },
  SUBSTANTIVE:  { label: 'SUBSTANTIVE', bg: 'rgba(34,197,94,0.18)',   color: '#4ade80' },
  ENGAGED:      { label: 'ENGAGED',     bg: 'rgba(20,184,166,0.18)',  color: '#2dd4bf' },
  PAID:         { label: 'PAID',        bg: 'rgba(234,179,8,0.25)',   color: '#fbbf24' },
  SILENT:       { label: 'SILENT',      bg: 'rgba(220,38,38,0.15)',   color: '#f87171' },
}

const CREDENTIALS = [
  { label: 'ZVR', value: '1015608684', sub: 'Association register' },
  { label: 'GISA', value: '39261441', sub: 'Trade register' },
  { label: 'Gewerbe', value: 'Automatische Datenverarbeitung', sub: 'WKO · GewO § 32' },
  { label: 'Steuernummer', value: '68 028/0989', sub: 'Finanzamt Graz' },
  { label: 'Seat', value: 'Elisabethinergasse 25', sub: '8020 Graz, Austria' },
]

const CONTACT_CARDS = [
  { label: 'Email', value: 'contact@ternlang.com', href: 'mailto:contact@ternlang.com' },
  { label: 'Research on OSF', value: 'osf.io/rzvyg', href: 'https://osf.io/rzvyg' },
  { label: 'GitHub', value: 'github.com/rfi-irfos', href: 'https://github.com/rfi-irfos' },
  { label: 'LinkedIn', value: 'RFI-IRFOS', href: 'https://linkedin.com/company/rfi-irfos' },
]

function TimelineItem({ m, i }: { m: typeof MILESTONES[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const isPublication = m.tag === 'publication'
  const innerStyle: React.CSSProperties = {
    background: isPublication ? 'rgba(0,245,196,0.04)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${isPublication ? 'rgba(0,245,196,0.18)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 12, padding: '16px 20px',
    textDecoration: 'none', color: 'inherit', display: 'block',
    transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box',
  }
  const innerContent = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.date}</div>
        {isPublication && <span style={{ fontFamily: 'monospace', fontSize: 9, color: TEAL, border: '1px solid rgba(0,245,196,0.3)', borderRadius: 10, padding: '2px 7px', letterSpacing: '0.08em' }}>OSF ↗</span>}
      </div>
      <div style={{ fontWeight: 700, fontSize: 14 }}>{m.label}</div>
    </>
  )
  const card = m.link
    ? <a href={m.link} target="_blank" rel="noopener noreferrer" style={innerStyle}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,196,0.45)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isPublication ? 'rgba(0,245,196,0.18)' : 'rgba(255,255,255,0.08)' }}
      >{innerContent}</a>
    : <div style={innerStyle}>{innerContent}</div>
  return (
    <div ref={ref} style={{
      display: 'flex',
      justifyContent: m.side === 'left' ? 'flex-start' : 'flex-end',
      position: 'relative',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : `translateY(24px)`,
      transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`,
    }}>
      <div style={{
        position: 'absolute', left: '50%', top: 20,
        transform: 'translate(-50%, -50%)',
        width: isPublication ? 14 : 12, height: isPublication ? 14 : 12, borderRadius: '50%',
        background: visible ? TEAL : 'rgba(0,245,196,0.2)',
        boxShadow: visible ? `0 0 ${isPublication ? 16 : 12}px ${TEAL}` : 'none',
        transition: `background 0.3s ease ${i * 0.06 + 0.2}s, box-shadow 0.3s ease ${i * 0.06 + 0.2}s`,
        zIndex: 2,
      }} />
      <div style={{ width: '44%' }}>{card}</div>
    </div>
  )
}

export function PublicSite() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [formState, setFormState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const pixelRef = useRef<HTMLImageElement>(null)
  const ledgerRef = useRef<HTMLDivElement>(null)
  const [ledgerFired, setLedgerFired] = useState(false)
  const { theme, setTheme } = useTheme()
  const mobile = useMobile()
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    const el = ledgerRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLedgerFired(true); obs.disconnect() }
    }, { threshold: 0.04 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')!
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      _revealSuppressed = true
      target.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => { _revealSuppressed = false }, 800)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    // beacon on page load
    const q = new URLSearchParams(location.search)
    fetch('https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: location.pathname,
        referrer: document.referrer,
        utm_source: q.get('utm_source') ?? '',
        utm_medium: q.get('utm_medium') ?? '',
        utm_campaign: q.get('utm_campaign') ?? '',
        site: 'rfi-irfos',
      }),
    }).catch(() => {})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setFormState('sending')
    try {
      if (WEB3FORMS_KEY) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `[rfi-irfos.at] ${form.subject || 'New inquiry'} — ${form.name}`,
            name: form.name,
            email: form.email,
            replyto: form.email,
            subject_interest: form.subject,
            message: form.message,
          }),
        })
        if (!res.ok) throw new Error()
      }
      setFormState('ok')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setFormState('err')
    }
  }

  return (
    <div style={{ background: '#070711', color: '#e8e8f0', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', overflowX: 'hidden', maxWidth: '100vw' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(7,7,17,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
      }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.png" alt="RFI-IRFOS" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.06em', color: '#e8e8f0' }}>RFI-IRFOS</span>
        </a>

        {/* Desktop nav — React inline styles can't do media queries, so gate on the useMobile() hook */}
        <div style={{ display: mobile ? 'none' : 'flex', gap: '1.75rem', alignItems: 'center' }}>
          {NAV_LINKS.map(n => (
            <a key={n.href} href={n.href} style={{
              color: '#808098', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', letterSpacing: '0.04em',
              transition: 'color 0.18s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e8e8f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#808098')}>
              {n.label}
            </a>
          ))}

          {/* Theme toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            {(['light', 'dark', 'hc'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)} style={{
                background: theme === t ? 'rgba(0,245,196,0.18)' : 'transparent',
                color: theme === t ? TEAL : '#606080',
                border: 'none', cursor: 'pointer',
                padding: '5px 10px', fontSize: 10, fontWeight: 700,
                fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase',
                transition: 'background 0.15s, color 0.15s',
              }}>{t === 'hc' ? 'HC' : t.toUpperCase()}</button>
            ))}
          </div>

          <a href="mailto:contact@ternlang.com" style={{
            background: TEAL, color: '#070711', padding: '8px 20px', borderRadius: 7,
            fontWeight: 800, fontSize: 12, textDecoration: 'none', letterSpacing: '0.07em',
            textTransform: 'uppercase', transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>Contact</a>
        </div>

        {/* Hamburger — shown only on mobile (media queries don't work in inline styles) */}
        <button onClick={() => setMobileOpen(o => !o)} style={{
          display: mobile ? 'flex' : 'none',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px', color: '#e8e8f0',
        }} aria-label="Menu">
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
          )}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: 'rgba(7,7,17,0.98)', backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', gap: 4,
        }}>
          {NAV_LINKS.map(n => (
            <a key={n.href} href={n.href} onClick={() => setMobileOpen(false)} style={{
              color: '#e8e8f0', fontSize: 20, fontWeight: 700, textDecoration: 'none',
              padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>{n.label}</a>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            {(['light', 'dark', 'hc'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)} style={{
                background: theme === t ? 'rgba(0,245,196,0.18)' : 'rgba(255,255,255,0.06)',
                color: theme === t ? TEAL : '#606080',
                border: theme === t ? `1px solid ${TEAL}` : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6, cursor: 'pointer',
                padding: '8px 16px', fontSize: 11, fontWeight: 700,
                fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{t === 'hc' ? 'HC' : t.toUpperCase()}</button>
            ))}
          </div>
          <a href="mailto:contact@ternlang.com" style={{
            marginTop: 24, background: TEAL, color: '#070711',
            padding: '16px 24px', borderRadius: 8,
            fontWeight: 800, fontSize: 14, textDecoration: 'none',
            textAlign: 'center', letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>Contact</a>
        </div>
      )}

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '120px 2rem 80px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,245,196,0.06) 0%, transparent 70%)',
      }}>
        <p style={{
          fontFamily: 'monospace', fontSize: 11, color: TEAL, letterSpacing: '0.2em',
          textTransform: 'uppercase', marginBottom: 32,
          border: '1px solid rgba(0,245,196,0.3)', padding: '6px 16px', borderRadius: 20,
        }}>
          RFI-IRFOS &nbsp;·&nbsp; ZVR 1015608684 &nbsp;·&nbsp; GISA 39261441 &nbsp;·&nbsp; Graz, Austria &nbsp;·&nbsp; est. 2020
        </p>
        <p style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: 6, letterSpacing: '-0.01em' }}>
          Rethink the Obvious.
        </p>
        <h1 style={{
          fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', fontWeight: 600, lineHeight: 1.5,
          marginBottom: 24, letterSpacing: '0.01em', color: '#a0a0b8',
        }}>
          <span style={{ color: TEAL }}>Interdisciplinary</span> Research Facility for Open Sciences
        </h1>
        <p style={{ fontSize: 17, color: '#a0a0b8', maxWidth: 580, lineHeight: 1.75, marginBottom: 48 }}>
          Independent Austrian research institute. Ternary AI, security, governance, minor protection, and ecocentric technology.
          One team. Everything built in-house.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#research" style={{
            background: TEAL, color: '#070711', padding: '13px 30px', borderRadius: 8,
            fontWeight: 800, fontSize: 13, textDecoration: 'none', letterSpacing: '0.07em',
            textTransform: 'uppercase', transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>Research</a>
          <a href="#track-record" style={{
            border: '1px solid rgba(0,245,196,0.35)', color: TEAL, padding: '13px 30px', borderRadius: 8,
            fontWeight: 700, fontSize: 13, textDecoration: 'none', letterSpacing: '0.06em',
            textTransform: 'uppercase', transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.35)')}>Track Record</a>
          <a href="#pricing" style={{
            border: '1px solid rgba(255,255,255,0.12)', color: '#a0a0b8', padding: '13px 30px', borderRadius: 8,
            fontWeight: 700, fontSize: 13, textDecoration: 'none', letterSpacing: '0.06em',
            textTransform: 'uppercase', transition: 'border-color 0.15s, color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = '#e8e8f0' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#a0a0b8' }}>Pricing</a>
        </div>

        <div style={{ display: 'flex', gap: '3rem', marginTop: 80, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { n: '131', label: 'apps audited' },
            { n: '200+', label: 'critical findings' },
            { n: '100+', label: 'companies notified' },
            { n: '10+', label: 'regulators notified' },
            { n: '6', label: 'years of research' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: TEAL }}>{s.n}</div>
              <div style={{ fontSize: 11, color: '#606080', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RESEARCH AREAS */}
      <section id="research" style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>01 / Research Areas</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>what we investigate</h2>
            <p style={{ color: '#a0a0b8', marginBottom: 56, maxWidth: 560 }}>
              One team. The same people who train the model write the regulatory analysis and file the disclosure.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {RESEARCH_AREAS.map((a, i) => (
              <Reveal key={a.title} delay={i} from="bottom">
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16, padding: '28px 24px', height: '100%',
                }}>
                  <div style={{ fontSize: 28, color: TEAL, marginBottom: 16 }}>{a.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{a.title}</div>
                  <div style={{ color: '#a0a0b8', fontSize: 13, lineHeight: 1.7 }}>{a.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 64 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: '#e8e8f0' }}>publications on OSF</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {PUBLICATIONS.map(p => (
                <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 10, textDecoration: 'none', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#404058', minWidth: 32 }}>{p.year}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#e8e8f0' }}>{p.title}</span>
                    <span style={{ color: '#606080', fontSize: 12, display: 'block', marginTop: 2 }}>{p.sub}</span>
                  </span>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(0,245,196,0.25)', color: TEAL, whiteSpace: 'nowrap' }}>{p.tag}</span>
                  <span style={{ color: '#404058', fontSize: 12 }}>↗</span>
                </a>
              ))}
            </div>
            <p style={{ marginTop: 16, fontFamily: 'monospace', fontSize: 10, color: '#404058' }}>
              119 projects on OSF &nbsp;·&nbsp; <a href="https://osf.io/rzvyg/" target="_blank" rel="noopener noreferrer" style={{ color: '#606080', textDecoration: 'none' }}>osf.io/rzvyg</a>
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{
        padding: '100px 2rem',
        background: 'rgba(0,245,196,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>02 / Projects</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>what we build</h2>
            <p style={{ color: '#a0a0b8', marginBottom: 56, maxWidth: 560 }}>
              Every project is a proof of concept for a specific research question. All built on the same stack.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {PROJECTS.map((p, i) => (
              <Reveal key={p.name} delay={i} from="bottom" style={{ display: 'flex' }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 17 }}>{p.name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{p.sub}</div>
                  </div>
                  <span style={{
                    fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em',
                    padding: '3px 8px', borderRadius: 20,
                    border: '1px solid rgba(0,245,196,0.3)', color: TEAL, whiteSpace: 'nowrap',
                  }}>{p.tag}</span>
                </div>
                <p style={{ color: '#a0a0b8', fontSize: 13, lineHeight: 1.7, flex: 1 }}>{p.desc}</p>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    style={{ color: TEAL, fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
                    View on GitHub &rarr;
                  </a>
                )}
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRACK RECORD */}
      <section id="track-record" style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>03 / Track Record</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>security research at scale</h2>
            <p style={{ color: '#a0a0b8', marginBottom: 48, maxWidth: 560 }}>
              Root level code analysis. Regulators BCC'd on every submission. 90-day coordinated disclosure. Our framework. Our timeline.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { n: '131', label: 'Apps audited' },
              { n: '100+', label: 'Companies notified' },
              { n: '200+', label: 'Critical findings' },
              { n: '10+', label: 'Regulators notified' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i} from="scale">
                <div style={{
                  background: 'rgba(0,245,196,0.05)', border: '1px solid rgba(0,245,196,0.15)',
                  borderRadius: 12, padding: '24px', textAlign: 'center', height: '100%',
                }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: TEAL }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: '#606080', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '20px 24px', marginBottom: 48,
            fontFamily: 'monospace', fontSize: 12, color: '#a0a0b8', lineHeight: 1.8,
          }}>
            <span style={{ color: TEAL, fontWeight: 700 }}>NYSE · NASDAQ · LSE · XETRA</span>
            {' '}listed targets · GDPR Art. 5/8/9/13/25/32/44 · COPPA · EU AI Act (minor provisions) · ISO/IEC 29147 · coordinated disclosure 2026-09-19 · DSB · EDPB · ICO · BfDI · DPC · CERT.at · FTC
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Permanent disclosure ledger</h3>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)' }}>{AUDIT_HIGHLIGHTS.length} targets · live response tracking · disclosure 2026-09-19</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <span key={k} style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: v.bg, color: v.color, letterSpacing: '0.08em' }}>{v.label}</span>
            ))}
          </div>
          <div ref={ledgerRef} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <style>{`@keyframes ledgerRowIn{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}`}</style>
            {AUDIT_HIGHLIGHTS.map((a, i) => {
              const sm = STATUS_META[a.status] ?? STATUS_META['WAITING']
              const delay = Math.min(i * 38, 1900)
              return (
                <div key={i} style={{
                  display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-start',
                  padding: '11px 14px', borderRadius: 5,
                  background: 'var(--bg2)', border: '1px solid var(--border2)',
                  opacity: ledgerFired ? undefined : 0,
                  animation: ledgerFired ? `ledgerRowIn 0.42s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` : 'none',
                }}>
                  <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text)', minWidth: 130, flex: '0 0 auto' }}>{a.target}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', flex: '0 0 auto', paddingTop: 2 }}>{a.market}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: SEV_COLOR[a.sev] ?? TEAL, flex: '0 0 auto', paddingTop: 2 }}>{a.sev}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 3, background: sm.bg, color: sm.color, flex: '0 0 auto' }}>{sm.label}</span>
                  <span style={{ color: 'var(--text2)', fontSize: 11, lineHeight: 1.6, flex: '1 1 220px' }}>{a.finding}</span>
                </div>
              )
            })}
          </div>
          <p style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)' }}>
            this ledger is updated in real time as companies respond. silence is public. · <a href="https://github.com/rfi-irfos/android-security-audit-2026" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text3)', textDecoration: 'none' }}>github.com/rfi-irfos/android-security-audit-2026</a>
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{
        padding: '100px 2rem',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>04 / Timeline</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 64, textAlign: 'center' }}>our journey</h2>
          </Reveal>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
              background: 'rgba(0,245,196,0.2)', transform: 'translateX(-50%)',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {MILESTONES.map((m, i) => (
                <TimelineItem key={i} m={m} i={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>05 / Pricing</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>transparent pricing</h2>
            <p style={{ color: '#a0a0b8', marginBottom: 56, maxWidth: 560 }}>
              Fixed rates. No retainer lock-in unless you want one. Scope determines tier, not company size.
            </p>
          </Reveal>

          {/* Security Audit tiers */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Security Audits &amp; Responsible Disclosure</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16, marginBottom: 48 }}>
            {[
              { tier: 'Public', price: 'free', desc: 'Full public disclosure. Findings published after 90-day coordinated embargo. No NDA.', highlight: false },
              { tier: 'Remediation Advisory', price: '€4,500', desc: 'Full report + remediation guidance. 30-day follow-up. GDPR compliance mapping included.', highlight: false },
              { tier: 'Confidential', price: '€9,000', desc: 'NDA-protected disclosure. Private report + patch validation. Regulators still notified.', highlight: false },
              { tier: 'Enterprise NDA', price: '€18,000', desc: 'Extended embargo + dedicated remediation support + legal evidence package.', highlight: false },
              { tier: 'Critical Infrastructure', price: '€75,000', desc: 'NDA + legal + PR containment strategy + regulator liaison. Fullscope package.', highlight: true },
              { tier: 'IoB / Art. 9', price: '€150,000', desc: 'Internet of Bodies / wearables with health data (Art. 9 GDPR). Elevated risk premium.', highlight: true },
            ].map((t, i) => (
              <Reveal key={t.tier} delay={i} from="bottom">
                <div style={{
                  background: t.highlight ? 'rgba(0,245,196,0.06)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${t.highlight ? 'rgba(0,245,196,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 14, padding: '24px 20px', height: '100%',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: TEAL, marginBottom: 10 }}>{t.price}</div>
                  <div style={{ color: '#a0a0b8', fontSize: 12, lineHeight: 1.7 }}>{t.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Retainer */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '24px 28px', marginBottom: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Security Retainer</div>
              <div style={{ color: '#a0a0b8', fontSize: 13 }}>continuous monitoring · quarterly audits · priority response · dedicated contact</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: TEAL, whiteSpace: 'nowrap' }}>€1,500 / mo</div>
          </div>

          {/* Device Privacy Hardening */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Device Privacy Hardening — by appointment</p>
          <div style={{
            background: 'rgba(0,245,196,0.04)', border: '1px solid rgba(0,245,196,0.18)',
            borderRadius: 14, padding: '24px 28px', marginBottom: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Phone Sanitizing: first session free</div>
              <div style={{ color: '#a0a0b8', fontSize: 13 }}>we disable background tracking scripts permanently · DNS-over-HTTPS · backup hardening · full before/after audit report · by appointment</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: TEAL, whiteSpace: 'nowrap' }}>free</div>
          </div>

          {/* Web & Research tiers */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Web Development &amp; Research</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { tier: 'Web · Landing Page', price: '€1,500', desc: 'Single-page site. React + our template. Delivered in 48h.' },
              { tier: 'Web · Full Site', price: '€4,500', desc: 'Multi-page + CMS admin + contact form + analytics. 2-week delivery.' },
              { tier: 'Web · Enterprise', price: '€18,000', desc: 'Custom Rust backend + auth + integrations. Full scope.' },
              { tier: 'Research Report', price: '€2,500', desc: 'Market analysis / policy brief / stakeholder interviews. 10-page minimum.' },
            ].map((t, i) => (
              <Reveal key={t.tier} delay={i} from="bottom">
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: '24px 20px', height: '100%',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: TEAL, marginBottom: 10 }}>{t.price}</div>
                  <div style={{ color: '#a0a0b8', fontSize: 12, lineHeight: 1.7 }}>{t.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>06 / Services</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>work with us</h2>
            <p style={{ color: '#a0a0b8', marginBottom: 48, maxWidth: 560 }}>
              we are not a charitable institution. we are a regulated research institute that earns revenue.
              full pricing at{' '}
              <a href="https://ternlang.com/about" style={{ color: TEAL, textDecoration: 'none' }}>ternlang.com/about</a>.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 28 }}>
            {[
              { title: 'Security Audits & Disclosure', desc: 'root level code analysis · GDPR compliance · coordinated disclosure · regulatory filings · from €4,500', teal: true },
              { title: 'Send us your APK', desc: 'we tear it apart. you get the full report before anyone else does. any Android APK, any company size.', teal: true },
              { title: 'Phone Sanitizing', desc: 'bring us your phone. first session free. we disable background tracking permanently, harden your DNS, lock your backups. by appointment.', teal: true },
              { title: 'Web & App Development', desc: 'React + Rust backends · mobile · enterprise · built on our own stack · from €1,500', teal: false },
              { title: 'Interdisciplinary Research', desc: 'market analysis · policy briefs · stakeholder interviews · AI governance consulting · from €2,500', teal: false },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i} from="bottom">
                <div style={{
                  background: s.teal ? 'rgba(0,245,196,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${s.teal ? 'rgba(0,245,196,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 16, padding: '28px 24px', height: '100%',
                }}>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>{s.title}</div>
                  <div style={{ color: '#a0a0b8', fontSize: 13, lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <a href="https://ternlang.com/about" style={{
            display: 'inline-block',
            border: '1px solid rgba(0,245,196,0.4)', color: TEAL,
            padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 13,
            textDecoration: 'none', letterSpacing: '0.04em',
          }}>Full pricing &amp; scope &rarr; ternlang.com/about</a>
        </div>
      </section>

      {/* STANDARDS & COMPLIANCE */}
      <section id="standards" style={{ padding: '100px 2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Standards &amp; Compliance</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>the frameworks we work under</h2>
            <p style={{ color: '#a0a0b8', marginBottom: 48, maxWidth: 620 }}>
              Every audit is filed against current EU and Austrian law. We track new standards as they enter force and keep our methodology up to date.
            </p>
          </Reveal>

          {/* Featured: NIS-2 / NISG 2026 */}
          <Reveal from="scale">
            <div style={{ background: 'rgba(0,245,196,0.06)', border: '1px solid rgba(0,245,196,0.25)', borderRadius: 16, padding: '32px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                <div style={{ fontWeight: 900, fontSize: 22, color: '#e8e8f0' }}>NIS-2 <span style={{ color: TEAL }}>·</span> NISG 2026</div>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.15em', border: '1px solid rgba(0,245,196,0.3)', borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap' }}>EU · Austria · in force</span>
              </div>
              <p style={{ color: '#a0a0b8', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
                The EU directive for a high common level of cybersecurity, transposed into Austrian law as <strong style={{ color: '#e8e8f0' }}>NISG 2026</strong>. It mandates state-of-the-art risk management, strict incident reporting to national authorities, and <strong style={{ color: '#e8e8f0' }}>personal liability for company management</strong>. In Austria it directly impacts roughly 4,000 essential and important entities, plus an estimated 50,000 supply-chain partners.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 12 }}>
                {[
                  ['Risk Management', 'cryptography · access control · supply-chain security'],
                  ['Incident Response', 'mandatory reporting within strict timeframes'],
                  ['Corporate Accountability', 'management personally liable for non-compliance'],
                ].map(([t, d]) => (
                  <div key={t} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 5, color: TEAL }}>{t}</div>
                    <div style={{ color: '#a0a0b8', fontSize: 12, lineHeight: 1.6 }}>{d}</div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16, fontSize: 11, color: '#606080', fontFamily: 'monospace' }}>
                Scope: ~4,000 entities directly · ~50,000 supply-chain partners ·{' '}
                <a href="https://www.nis.gv.at" target="_blank" rel="noopener noreferrer" style={{ color: '#808098', textDecoration: 'none' }}>nis.gv.at</a>
              </p>
            </div>
          </Reveal>

          {/* The rest of the frameworks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
            {STANDARDS.map((s, i) => (
              <Reveal key={s.code} delay={i} from="bottom">
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '22px 20px', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#e8e8f0' }}>{s.code}</div>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#606080', whiteSpace: 'nowrap' }}>{s.region}</span>
                  </div>
                  <div style={{ color: '#a0a0b8', fontSize: 12, lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section style={{
        padding: '60px 2rem',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', textAlign: 'center', marginBottom: 28 }}>
              Regulated · Licensed · Registered
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            {CREDENTIALS.map((c, i) => (
              <Reveal key={c.label} delay={i} from="bottom">
                <div style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: '16px', textAlign: 'center', height: '100%',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>{c.label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#e8e8f0', marginBottom: 4 }}>{c.value}</div>
                  <div style={{ fontSize: 10, color: '#505068' }}>{c.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#505068', fontFamily: 'monospace', marginTop: 24 }}>
            regulated not-for-profit · ≥90% surplus reinvested into research · surplus not distributed to members
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>07 / Contact</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>connect</h2>
            <p style={{ color: '#a0a0b8', marginBottom: 48 }}>reach us for research collaboration, security disclosures, or service inquiries.</p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 40 }}>
            {/* left: form */}
            <Reveal from="left" style={{ display: 'flex', flexDirection: 'column' }}>
            <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(['name', 'email'] as const).map(f => (
                <input key={f} type={f === 'email' ? 'email' : 'text'} required placeholder={f === 'name' ? 'Name' : 'Email'}
                  value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '12px 16px', color: '#e8e8f0', fontSize: 14, outline: 'none',
                    fontFamily: 'inherit',
                  }} />
              ))}
              <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '12px 16px', color: form.subject ? '#e8e8f0' : '#606080',
                fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}>
                <option value="">Topic (optional)</option>
                <option value="Security Audit">Security Audit</option>
                <option value="Send APK">Send us your APK</option>
                <option value="Research Collaboration">Research Collaboration</option>
                <option value="Web Development">Web Development</option>
                <option value="Other">Other</option>
              </select>
              <textarea required placeholder="Message" value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                rows={5} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '12px 16px', color: '#e8e8f0', fontSize: 14,
                  outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                }} />
              <button type="submit" disabled={formState === 'sending'} style={{
                background: formState === 'ok' ? 'rgba(0,245,196,0.2)' : TEAL,
                color: formState === 'ok' ? TEAL : '#070711',
                border: formState === 'ok' ? `1px solid ${TEAL}` : 'none',
                padding: '13px 24px', borderRadius: 8, fontWeight: 800, fontSize: 14,
                cursor: formState === 'sending' ? 'wait' : 'pointer', fontFamily: 'inherit',
              }}>
                {formState === 'sending' ? 'Sending...' : formState === 'ok' ? 'Message received.' : 'Send message'}
              </button>
              {formState === 'err' && (
                <p style={{ color: '#f87171', fontSize: 12 }}>Something went wrong. Email us directly at contact@ternlang.com</p>
              )}
            </form>
            </Reveal>

            {/* right: links */}
            <Reveal from="right">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CONTACT_CARDS.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '18px 20px', textDecoration: 'none', display: 'block',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#606080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>{c.label}</div>
                  <div style={{ color: TEAL, fontWeight: 600, fontSize: 13 }}>{c.value}</div>
                </a>
              ))}
              <p style={{ fontSize: 11, color: '#505068', fontFamily: 'monospace', marginTop: 8, lineHeight: 1.8 }}>
                Elisabethinergasse 25<br />8020 Graz, Austria<br />rfi-irfos.com · rfi-irfos.at
              </p>
            </div>
            </Reveal>
          </div>
        </div>
        {/* Lighthouse tracking pixel — site=rfi-irfos, real channel from UTM/referrer */}
        <img ref={pixelRef}
          src={`${LIGHTHOUSE_PIXEL}?site=rfi-irfos&p=${encodeURIComponent(location.pathname)}&r=${encodeURIComponent(document.referrer)}&utm_source=${encodeURIComponent(new URLSearchParams(location.search).get('utm_source') ?? '')}&utm_medium=${encodeURIComponent(new URLSearchParams(location.search).get('utm_medium') ?? '')}&utm_campaign=${encodeURIComponent(new URLSearchParams(location.search).get('utm_campaign') ?? '')}`}
          alt="" width="1" height="1" style={{ display: 'none' }} />
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            { label: 'Impressum', href: '#p/impressum' },
            { label: 'Datenschutz', href: '#p/datenschutz' },
            { label: 'AGB', href: '#p/agb' },
            { label: 'Security Policy', href: '#p/security' },
            { label: 'ternlang.com', href: 'https://ternlang.com' },
            { label: 'github.com/rfi-irfos', href: 'https://github.com/rfi-irfos' },
          ].map(l => (
            <a key={l.label} href={l.href} style={{ color: '#606080', fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = TEAL)}
              onMouseLeave={e => (e.currentTarget.style.color = '#606080')}>
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <a href="https://www.wko.at" target="_blank" rel="noopener" title="WKO Mitglied - Wirtschaftskammer Osterreich" style={{ display: 'inline-block', opacity: 0.85 }}>
            <svg viewBox="0 0 420 100" width="168" height="40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WKO - Wirtschaftskammer Osterreich" style={{ display: 'block' }}>
              <rect x="0"   y="0" width="100" height="100" fill="#CC0000"/>
              <text x="50"  y="78" fontFamily="Arial Black,sans-serif" fontSize="74" fontWeight="900" fill="#fff" textAnchor="middle">W</text>
              <rect x="105" y="0" width="100" height="100" fill="#CC0000"/>
              <text x="155" y="78" fontFamily="Arial Black,sans-serif" fontSize="74" fontWeight="900" fill="#fff" textAnchor="middle">K</text>
              <rect x="210" y="0" width="100" height="100" fill="#CC0000"/>
              <text x="260" y="78" fontFamily="Arial Black,sans-serif" fontSize="74" fontWeight="900" fill="#fff" textAnchor="middle">O</text>
              <rect x="320" y="0"  width="100" height="33" fill="#CC0000"/>
              <rect x="320" y="33" width="100" height="34" fill="#fff"/>
              <rect x="320" y="67" width="100" height="33" fill="#CC0000"/>
            </svg>
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', background: 'var(--bg2)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.06em' }}>WKO MEMBER &nbsp;·&nbsp; GewO § 32 &nbsp;·&nbsp; Automatische Datenverarbeitung</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', background: 'var(--bg2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.06em' }}>REGULATED NOT-FOR-PROFIT &nbsp;·&nbsp; ZVR 1015608684 &nbsp;·&nbsp; GISA 39261441</span>
          </div>
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#404058', letterSpacing: '0.08em' }}>
          &copy; 2026 RFI-IRFOS &nbsp;&middot;&nbsp; Steuernummer 68 028/0989 &nbsp;&middot;&nbsp; Graz, Austria
        </p>
      </footer>
    </div>
  )
}
