import { useState, useEffect, useRef } from 'react'

const TEAL = '#00f5c4'
const LIGHTHOUSE_PIXEL = 'https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track/pixel.gif'
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

const NAV_LINKS = [
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Track Record', href: '#track-record' },
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
    desc: 'Static APK analysis, GDPR enforcement, coordinated responsible disclosure at scale. ISO/IEC 29147 framework.',
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
]

const PROJECTS = [
  {
    name: 'Ternary Intelligence Stack',
    sub: 'TIS monorepo',
    desc: 'Full-stack post-binary AI platform. Language, compiler, ISA, virtual machine, linear algebra, API, and model — built on balanced ternary {-1, 0, +1}.',
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
    desc: 'One self-hosted Rust + React binary running the entire institute — comms, CRM, finance, payroll, HR, governance, and live training telemetry. Append-only 50-year audit trail.',
    link: null,
    tag: 'internal · live',
  },
  {
    name: 'Android Security Audit 2026',
    sub: '100 apps · 74 companies',
    desc: '150+ critical findings across NYSE, NASDAQ, LSE, and XETRA listed companies. Static APK analysis. Coordinated disclosure 2026-09-19. Regulators BCC\'d on every submission.',
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

const MILESTONES: { date: string; label: string; side: 'left' | 'right' }[] = [
  { date: 'June 2020', label: 'RFI-IRFOS Founded', side: 'left' },
  { date: 'June 2020', label: 'OSF Repository launched', side: 'right' },
  { date: 'March 2021', label: 'Ternary Logic Framework', side: 'left' },
  { date: 'May 2023', label: 'Ecocentric AI Framework', side: 'right' },
  { date: 'March 2024', label: 'The Art of Questioning — whitepaper', side: 'left' },
  { date: 'June 2024', label: 'albert. — first ternary MoE model born', side: 'right' },
  { date: 'Jan 2025', label: 'Rusty Penguin — pure-Rust OS boots', side: 'left' },
  { date: 'March 2025', label: 'Lighthouse — workplace OS goes live', side: 'right' },
  { date: 'May 2026', label: 'SPRIND pitch submitted — €26.5M ceiling', side: 'left' },
  { date: 'May 2026', label: 'DOOM boots on bare-metal Rust kernel', side: 'right' },
  { date: 'June 2026', label: '100 Android apps audited — 74 companies · NYSE · NASDAQ · LSE · XETRA', side: 'left' },
  { date: 'June 2026', label: 'aladdin-mini — open-source disclosure impact engine released', side: 'right' },
]

const PUBLICATIONS = [
  { year: '2026', title: 'The Ternary Intelligence Stack', sub: 'vertically integrated post-binary AI platform', href: 'https://osf.io/cyn28/', tag: 'AI · Systems' },
  { year: '2026', title: 'Myco-Styria', sub: 'polystyrene replacement via mycelium + Austrian lignocellulose residues', href: 'https://osf.io/ek8rm/', tag: 'Ecocentric' },
  { year: '2025', title: 'A Ternary Logic Mixture-of-Experts Model', sub: 'sparse ternary MoE architecture with autonomous Net2Net surgery', href: 'https://osf.io/tz7dc/', tag: 'AI · Model' },
  { year: '2025', title: 'The Ternlang Architecture', sub: 'post-binary logic framework for ethical autonomous AI', href: 'https://osf.io/zwnyr/', tag: 'AI · Governance' },
  { year: '2025', title: 'Policy Mirror Protocol', sub: 'embedding transparency and traceability into AI refusal boundaries', href: 'https://osf.io/d2k4x/', tag: 'AI · Policy' },
  { year: '2025', title: 'From Waste to Wild', sub: 'circular ecocentric model for riverine plastic interception', href: 'https://osf.io/4w5g6/', tag: 'Ecocentric' },
  { year: '2025', title: 'PedalGate v1.0', sub: '101-day investigation into systemic inequities on Austrian delivery platforms', href: 'https://osf.io/h5u8f/', tag: 'Security · Accountability' },
  { year: '2025', title: 'A1ERF — EU Regulation Proposal', sub: 'AI-first emergency relay framework for autonomous cardiac arrest detection', href: 'https://osf.io/ueac8/', tag: 'Policy · EU' },
]

const AUDIT_HIGHLIGHTS = [
  { target: 'Snapchat', market: 'NASDAQ', sev: 'CRITICAL', finding: 'Fidelius private keys stored at Google — "disappearing" messages provably don\'t disappear' },
  { target: 'Glovo', market: 'Private', sev: 'CRITICAL', finding: 'Meta SDK active as undisclosed joint controller; user data shared without legal basis' },
  { target: 'myNFP', market: 'Private', sev: 'CRITICAL', finding: 'Art. 9 menstrual cycle data transferred to Google (USA) via Auto Backup; privacy policy says "local only"' },
  { target: 'A-Trust / ID Austria', market: 'eIDAS', sev: 'HIGH', finding: 'Same certificate library as national ID system; eIDAS compliance gap; 5 findings' },
  { target: 'Roblox', market: 'NYSE', sev: 'HIGH', finding: 'COPPA + GDPR violations; child health data processed without adequate safeguards' },
  { target: 'Wolt', market: 'Private', sev: 'HIGH', finding: '13 findings; company confirmed; structured remediation initiated' },
  { target: 'Foodora', market: 'Private', sev: 'HIGH', finding: '7 critical findings + algorithmic wage suppression signal; BCC: Finanzpolizei' },
  { target: 'Marionnaud', market: 'Private', sev: 'HIGH', finding: 'ModiFace AR try-on (Art. 9 biometric) + ContentSquare on AR screen; no consent layer' },
]

const SEV_COLOR: Record<string, string> = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308' }

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
        width: 12, height: 12, borderRadius: '50%',
        background: visible ? TEAL : 'rgba(0,245,196,0.2)',
        boxShadow: visible ? `0 0 12px ${TEAL}` : 'none',
        transition: `background 0.3s ease ${i * 0.06 + 0.2}s, box-shadow 0.3s ease ${i * 0.06 + 0.2}s`,
        zIndex: 2,
      }} />
      <div style={{
        width: '44%',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '16px 20px',
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{m.date}</div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{m.label}</div>
      </div>
    </div>
  )
}

export function PublicSite() {
  const [scrolled, setScrolled] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [formState, setFormState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const pixelRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    // beacon on page load
    fetch('https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/', referrer: document.referrer, utm_source: new URLSearchParams(location.search).get('utm_source') ?? '' }),
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
    <div style={{ background: '#070711', color: '#e8e8f0', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(7,7,17,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
      }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="RFI-IRFOS" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.05em', color: '#e8e8f0' }}>RFI-IRFOS</span>
        </a>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {NAV_LINKS.map(n => (
            <a key={n.href} href={n.href} style={{
              color: '#a0a0b8', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', letterSpacing: '0.04em',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = TEAL)}
              onMouseLeave={e => (e.currentTarget.style.color = '#a0a0b8')}>
              {n.label}
            </a>
          ))}
          <a href="mailto:contact@ternlang.com" style={{
            background: TEAL, color: '#070711', padding: '7px 18px', borderRadius: 6,
            fontWeight: 800, fontSize: 12, textDecoration: 'none', letterSpacing: '0.06em',
          }}>Contact</a>
        </div>
      </nav>

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
        <p style={{ fontSize: 18, color: '#a0a0b8', maxWidth: 600, lineHeight: 1.7, marginBottom: 48 }}>
          an independent Austrian research institute at the intersection of ternary AI,
          security &amp; privacy, governance, and ecocentric technology.
          everything in-house. everything interdisciplinary.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#research" style={{
            background: TEAL, color: '#070711', padding: '14px 32px', borderRadius: 8,
            fontWeight: 800, fontSize: 14, textDecoration: 'none', letterSpacing: '0.06em',
          }}>Explore our research</a>
          <a href="#projects" style={{
            border: '1px solid rgba(0,245,196,0.4)', color: TEAL, padding: '14px 32px', borderRadius: 8,
            fontWeight: 700, fontSize: 14, textDecoration: 'none', letterSpacing: '0.04em',
          }}>What we build</a>
        </div>

        <div style={{ display: 'flex', gap: '3rem', marginTop: 80, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { n: '100', label: 'apps audited' },
            { n: '150+', label: 'critical findings' },
            { n: '74', label: 'companies notified' },
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
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>01 — Research Areas</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>what we investigate</h2>
          <p style={{ color: '#a0a0b8', marginBottom: 56, maxWidth: 560 }}>
            not multiple faculties coordinating across silos. one team where the same people
            who train the model write the regulatory analysis.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {RESEARCH_AREAS.map(a => (
              <div key={a.title} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '28px 24px',
              }}>
                <div style={{ fontSize: 28, color: TEAL, marginBottom: 16 }}>{a.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{a.title}</div>
                <div style={{ color: '#a0a0b8', fontSize: 13, lineHeight: 1.7 }}>{a.desc}</div>
              </div>
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
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>02 — Projects</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>what we build</h2>
          <p style={{ color: '#a0a0b8', marginBottom: 56, maxWidth: 560 }}>
            every project is a proof of concept for a different research question. they all run on the same stack.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {PROJECTS.map(p => (
              <div key={p.name} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12,
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
            ))}
          </div>
        </div>
      </section>

      {/* TRACK RECORD */}
      <section id="track-record" style={{ padding: '100px 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>03 — Track Record</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>security research at scale</h2>
          <p style={{ color: '#a0a0b8', marginBottom: 48, maxWidth: 560 }}>
            static APK analysis. regulators BCC'd on every submission.
            90-day coordinated disclosure. our framework, our timeline.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { n: '100', label: 'Apps audited' },
              { n: '74', label: 'Companies notified' },
              { n: '150+', label: 'Critical findings' },
              { n: '10+', label: 'Regulators notified' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(0,245,196,0.05)', border: '1px solid rgba(0,245,196,0.15)',
                borderRadius: 12, padding: '24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: TEAL }}>{s.n}</div>
                <div style={{ fontSize: 11, color: '#606080', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '20px 24px', marginBottom: 48,
            fontFamily: 'monospace', fontSize: 12, color: '#a0a0b8', lineHeight: 1.8,
          }}>
            <span style={{ color: TEAL, fontWeight: 700 }}>NYSE · NASDAQ · LSE · XETRA</span>
            {' '}listed targets · GDPR Art. 5/8/9/13/25/32/44 · ISO/IEC 29147 · coordinated disclosure 2026-09-19 · DSB · EDPB · ICO · BfDI · DPC · CERT.at
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#e8e8f0' }}>selected findings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {AUDIT_HIGHLIGHTS.map((a, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '160px 80px 80px 1fr',
                gap: 16, alignItems: 'center',
                padding: '14px 18px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{a.target}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#606080', textTransform: 'uppercase' }}>{a.market}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: SEV_COLOR[a.sev] ?? TEAL }}>{a.sev}</span>
                <span style={{ color: '#a0a0b8', fontSize: 12, lineHeight: 1.5 }}>{a.finding}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 20, fontFamily: 'monospace', fontSize: 10, color: '#404058' }}>
            full audit archive · <a href="https://github.com/rfi-irfos/android-security-audit-2026" target="_blank" rel="noopener noreferrer" style={{ color: '#606080', textDecoration: 'none' }}>github.com/rfi-irfos/android-security-audit-2026</a>
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
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>04 — Timeline</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 64, textAlign: 'center' }}>our journey</h2>
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
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>05 — Pricing</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>transparent pricing</h2>
          <p style={{ color: '#a0a0b8', marginBottom: 56, maxWidth: 560 }}>
            fixed rates. no retainer lock-in unless you want one. scope determines tier, not company size.
          </p>

          {/* Security Audit tiers */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Security Audits &amp; Responsible Disclosure</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
            {[
              { tier: 'Public', price: 'free', desc: 'Full public disclosure. Findings published after 90-day coordinated embargo. No NDA.', highlight: false },
              { tier: 'Remediation Advisory', price: '€4,500', desc: 'Full report + remediation guidance. 30-day follow-up. GDPR compliance mapping included.', highlight: false },
              { tier: 'Confidential', price: '€9,000', desc: 'NDA-protected disclosure. Private report + patch validation. Regulators still notified.', highlight: false },
              { tier: 'Enterprise NDA', price: '€18,000', desc: 'Extended embargo + dedicated remediation support + legal evidence package.', highlight: false },
              { tier: 'Critical Infrastructure', price: '€75,000', desc: 'NDA + legal + PR containment strategy + regulator liaison. Fullscope package.', highlight: true },
              { tier: 'IoB / Art. 9', price: '€150,000', desc: 'Internet of Bodies / wearables with health data (Art. 9 GDPR). Elevated risk premium.', highlight: true },
            ].map(t => (
              <div key={t.tier} style={{
                background: t.highlight ? 'rgba(0,245,196,0.06)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${t.highlight ? 'rgba(0,245,196,0.25)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 14, padding: '24px 20px',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: TEAL, marginBottom: 10 }}>{t.price}</div>
                <div style={{ color: '#a0a0b8', fontSize: 12, lineHeight: 1.7 }}>{t.desc}</div>
              </div>
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

          {/* Web & Research tiers */}
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Web Development &amp; Research</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { tier: 'Web · Landing Page', price: '€1,500', desc: 'Single-page site. React + our template. Delivered in 48h.' },
              { tier: 'Web · Full Site', price: '€4,500', desc: 'Multi-page + CMS admin + contact form + analytics. 2-week delivery.' },
              { tier: 'Web · Enterprise', price: '€18,000', desc: 'Custom Rust backend + auth + integrations. Full scope.' },
              { tier: 'Research Report', price: '€2,500', desc: 'Market analysis / policy brief / stakeholder interviews. 10-page minimum.' },
            ].map(t => (
              <div key={t.tier} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '24px 20px',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: TEAL, marginBottom: 10 }}>{t.price}</div>
                <div style={{ color: '#a0a0b8', fontSize: 12, lineHeight: 1.7 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 2rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>06 — Services</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>work with us</h2>
          <p style={{ color: '#a0a0b8', marginBottom: 48, maxWidth: 560 }}>
            we are not a charitable institution. we are a regulated research institute that earns revenue.
            full pricing at{' '}
            <a href="https://ternlang.com/about" style={{ color: TEAL, textDecoration: 'none' }}>ternlang.com/about</a>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 28 }}>
            {[
              { title: 'Security Audits & Disclosure', desc: 'static APK analysis · GDPR compliance · coordinated disclosure · regulatory filings · from €4,500', teal: true },
              { title: 'Send us your APK', desc: 'we tear it apart. you get the full report before anyone else does. any Android APK, any company size.', teal: true },
              { title: 'Web & App Development', desc: 'React + Rust backends · mobile · enterprise · built on our own stack · from €1,500', teal: false },
              { title: 'Interdisciplinary Research', desc: 'market analysis · policy briefs · stakeholder interviews · AI governance consulting · from €2,500', teal: false },
            ].map(s => (
              <div key={s.title} style={{
                background: s.teal ? 'rgba(0,245,196,0.05)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${s.teal ? 'rgba(0,245,196,0.2)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16, padding: '28px 24px',
              }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>{s.title}</div>
                <div style={{ color: '#a0a0b8', fontSize: 13, lineHeight: 1.7 }}>{s.desc}</div>
              </div>
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

      {/* CREDENTIALS */}
      <section style={{
        padding: '60px 2rem',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', textAlign: 'center', marginBottom: 28 }}>
            Regulated · Licensed · Registered
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            {CREDENTIALS.map(c => (
              <div key={c.label} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '16px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#e8e8f0', marginBottom: 4 }}>{c.value}</div>
                <div style={{ fontSize: 10, color: '#505068' }}>{c.sub}</div>
              </div>
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
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>07 — Contact</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>connect</h2>
          <p style={{ color: '#a0a0b8', marginBottom: 48 }}>reach us for research collaboration, security disclosures, or service inquiries.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            {/* left: form */}
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
                <p style={{ color: '#f87171', fontSize: 12 }}>Something went wrong — email us directly at contact@ternlang.com</p>
              )}
            </form>

            {/* right: links */}
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
          </div>
        </div>
        {/* Lighthouse tracking pixel */}
        <img ref={pixelRef} src={`${LIGHTHOUSE_PIXEL}?utm_source=rfi-irfos-web`}
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
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#404058', letterSpacing: '0.08em' }}>
          &copy; 2026 RFI-IRFOS &nbsp;&middot;&nbsp; ZVR 1015608684 &nbsp;&middot;&nbsp; GISA 39261441 &nbsp;&middot;&nbsp; Steuernummer 68 028/0989 &nbsp;&middot;&nbsp; Graz, Austria
        </p>
      </footer>
    </div>
  )
}
