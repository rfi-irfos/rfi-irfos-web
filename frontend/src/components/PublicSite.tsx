import { useState, useEffect, useRef, useCallback } from 'react'

// ── Scroll-scrubbing reveal: progress directly drives opacity+transform via RAF ──
function Reveal({
  children, delay = 0, from = 'bottom', style: extra,
}: {
  children: React.ReactNode
  delay?: number        // stagger index (0,1,2…) — shifts reveal start lower in viewport
  from?: 'bottom' | 'left' | 'right' | 'scale'
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    let rafId = 0
    const update = () => {
      const rect = el.getBoundingClientRect(), vh = window.innerHeight
      const startFrac = 0.94 - delay * 0.06  // stagger: each index shifts 6% of vh
      const raw = (vh * startFrac - rect.top) / (vh * 0.58)
      const p = Math.max(0, Math.min(1, raw))
      el.style.opacity = String(p)
      const d = (1 - p) * 30
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

// ── Mobile breakpoint hook ──
function useMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp)
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [bp])
  return m
}

const ACCENT = 'var(--accent)'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined
const LIGHTHOUSE_PIXEL = 'https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track/pixel.gif'

type Theme = 'light' | 'dark' | 'hc'

const NAV_LINKS = [
  { href: '#research',     label: 'Research' },
  { href: '#projects',     label: 'Projects' },
  { href: '#track-record', label: 'Track Record' },
  { href: '#pricing',      label: 'Pricing' },
  { href: '#contact',      label: 'Contact' },
]

const RESEARCH_AREAS = [
  {
    icon: '◎',
    title: 'Security & Privacy',
    desc:  'Decompilation and root-level comparison of code files. GDPR enforcement, coordinated responsible disclosure at scale. ISO/IEC 29147 framework.',
  },
  {
    icon: '△',
    title: 'Ternary AI',
    desc:  'Training and evaluating models on ternary arithmetic. The ternlang runtime. albert. - a ternary-native language model built in-house from scratch.',
  },
  {
    icon: '⬡',
    title: 'Governance & Policy',
    desc:  'Regulatory analysis under GDPR, EU AI Act, eIDAS. Direct submissions to DSB, EDPB, BfDI, ICO. Human oversight of automated systems.',
  },
  {
    icon: '⊕',
    title: 'Ecocentric Technology',
    desc:  'Low-footprint infrastructure. Surplus reinvested into open research. Land and compute sovereignty as design constraints, not afterthoughts.',
  },
]

const PROJECTS = [
  {
    name: 'albert.',
    sub:  'ternary language model',
    tag:  'ACTIVE',
    desc: 'A ternary-native language model trained in-house. Not a fork. Not a fine-tune. Built from the weight matrix up in Rust, trained on Modal GPU infrastructure.',
    link: 'https://github.com/rfi-irfos',
  },
  {
    name: 'ternlang',
    sub:  'ternary runtime + compiler',
    tag:  'ACTIVE',
    desc: '@sparseskip - patent pending A50296/2026. Sparse execution: skip null ternary branches at compile time, pay in dense compute only. 83 tok/s on T4.',
    link: 'https://ternlang.com',
  },
  {
    name: 'Lighthouse',
    sub:  'workplace operating system',
    tag:  'LIVE',
    desc: 'Internal governance + task management OS. Append-only audit trail. Unanimous quorum on destructive actions. Built on Axum + React. Live at ternlang.com/lighthouse.',
    link: null,
  },
  {
    name: 'Rusty Penguin',
    sub:  'pure-Rust operating system',
    tag:  'ACTIVE',
    desc: 'A from-scratch OS written in Rust. No Linux kernel. No GNU. Boots DOOM. Fetches web pages via a hand-written TCP/IP stack. Daily-drivability as the target.',
    link: 'https://github.com/rfi-irfos',
  },
  {
    name: 'Android Audit 2026',
    sub:  '103 apps · 81 companies',
    tag:  'DISCLOSURE 2026-09-19',
    desc: 'Mass coordinated disclosure across European and global app markets. Every R1 sent. Regulators in BCC on every submission. Full archive on GitHub.',
    link: 'https://github.com/rfi-irfos/android-security-audit-2026',
  },
  {
    name: 'rfi-irfos-web-template',
    sub:  'open source web kit',
    tag:  'OPEN SOURCE',
    desc: 'The React + Rust component template behind every client site we deliver. MIT licensed. Used for e-techbike.at and others.',
    link: 'https://github.com/rfi-irfos',
  },
]

const PUBLICATIONS = [
  {
    year: '2025',
    title: 'Ternary Intelligence Stack — Architecture Whitepaper',
    sub:   'albert. · ternlang · @sparseskip · patent A50296/2026',
    tag:   'whitepaper',
    href:  'https://osf.io/rzvyg/',
    venue: 'OSF Preprints',
  },
  {
    year: '2026',
    title: 'Earth Is Not Full. We Regulate It That Way.',
    sub:   'Sufficiency proof · manufactured scarcity · policy implications',
    tag:   'article',
    href:  'https://www.linkedin.com/pulse/earth-full-we-regulate-way-simeon-kepp/',
    venue: 'LinkedIn',
  },
  {
    year: '2026',
    title: 'Android Security Audit 2026 — Coordinated Disclosure',
    sub:   '103 apps · 81 companies · 200+ critical findings · NYSE/NASDAQ targets',
    tag:   'ongoing',
    href:  'https://github.com/rfi-irfos/android-security-audit-2026',
    venue: 'GitHub · Disclosure 2026-09-19',
  },
  {
    year: '2024',
    title: '@sparseskip — Sparse Ternary Execution',
    sub:   'Skip null branches at compile time · 83 tok/s on T4 · patent pending',
    tag:   'patent',
    href:  'https://osf.io/rzvyg/',
    venue: 'OSF · A50296/2026',
  },
  {
    year: '2022',
    title: 'Research Archive — 119 OSF Projects',
    sub:   'Ternary computing · digital rights · ecocentric infrastructure',
    tag:   'archive',
    href:  'https://osf.io/rzvyg/',
    venue: 'OSF · 119 projects',
  },
]

const AUDIT_HIGHLIGHTS = [
  { target: 'Pokemon GO',     market: 'NYSE',    sev: 'CRITICAL', finding: 'Photogrammetric 3D map data from civilian gameplay licensed to Vantor (US defense contractor, NGA contract). Art. 5(1)(b) purpose limitation breach.' },
  { target: 'Tinder',         market: 'NASDAQ',  sev: 'CRITICAL', finding: 'FaceTec 3D liveness biometric to api.facetec.com US. FaceUnity biometric SDK (China). LiveRamp identity resolution on sex-preference data. GDPR Art. 9.' },
  { target: 'Disneyland EU',  market: 'NYSE',    sev: 'CRITICAL', finding: 'Facial recognition of children at EU theme park. ContentSquare session replay. MagicBand RFID. IoB pricing applies.' },
  { target: 'Snapchat',       market: 'NYSE',    sev: 'CRITICAL', finding: 'Fidelius encryption keys stored at Google. Disappearing messages can be retained. Core product claim invalidated.' },
  { target: 'Lovoo',          market: 'PRIVATE', sev: 'CRITICAL', finding: 'Chucker HTTP interceptor in production: all API calls logged in plaintext. FaceUnity + Mintegral (Chinese SDKs). Broken NSC syntax bypasses pinning.' },
  { target: 'Strava',         market: 'PRIVATE', sev: 'CRITICAL', finding: 'Firebase API key hardcoded. NSC present but empty: 120M users, no certificate pinning. privacy@strava.com bounced (finding H4).' },
  { target: 'Marionnaud',     market: 'NYSE',    sev: 'CRITICAL', finding: 'ModiFace 65-point facial geometry AR try-on. ContentSquare session replay during AR face scanning. GDPR Art. 9 without explicit basis.' },
  { target: 'AliExpress',     market: 'NYSE',    sev: 'CRITICAL', finding: 'ByteDance shadowhook + TikTok assets + WhiteScreenRecorder full-screen capture = triple NSL pipeline on EU user devices.' },
]

const SEV_COLOR: Record<string, string> = {
  CRITICAL: 'var(--sev-crit)',
  HIGH:     'var(--sev-high)',
  MEDIUM:   'var(--sev-med)',
}

const MILESTONES = [
  { year: '2020', tag: 'founding',     title: 'Founded in Graz',              body: 'Registered as a regulated not-for-profit research institute. ZVR 1015608684. WKO member. Research agenda: ternary computation and digital rights.' },
  { year: '2022', tag: 'research',     title: 'First OSF publications',        body: '119 projects archived on OSF. Public record of research outputs, methodologies, and findings from the first research cycle.' },
  { year: '2024', tag: 'development',  title: 'ternlang + albert. initiated',  body: 'Development of the ternary runtime and language model started in-house. First @sparseskip prototype. albert. training begins.' },
  { year: '2025', tag: 'milestone',    title: '@sparseskip patent filed',      body: 'Patent application A50296/2026 filed. Sparse ternary execution: 83 tok/s on T4. Whitepaper published on OSF.' },
  { year: '2026', tag: 'audit-series', title: '103 apps. 81 companies.',       body: 'The 2026 Android audit series. Mass coordinated disclosure across European and global markets. Pokemon GO, Tinder, Strava, Snapchat, Disneyland EU - all notified. Disclosure: 2026-09-19.' },
  { year: '2026', tag: 'live',         title: 'Lighthouse OS live',            body: 'Internal governance OS deployed. Append-only audit trail. Unanimous quorum on destructive operations. A production system for a team that does not trust defaults.' },
]

const CREDENTIALS = [
  { label: 'ZVR',          value: '1015608684',  sub: 'Vereinsregister Austria' },
  { label: 'GISA',         value: '39261441',    sub: 'Gewerbeinformationssystem' },
  { label: 'Steuernummer', value: '68 028/0989', sub: 'Finanzamt Graz' },
  { label: 'WKO',          value: 'GewO § 32',   sub: 'Automatische Datenverarbeitung' },
  { label: 'ISO/IEC',      value: '29147',       sub: 'Disclosure framework' },
  { label: 'GDPR',         value: 'Art. 5/9/32', sub: 'Applicable articles' },
]

const CONTACT_CARDS = [
  { label: 'Security Disclosures',    href: 'mailto:contact@ternlang.com',   value: 'contact@ternlang.com' },
  { label: 'Research + Partnerships', href: 'mailto:rfi.irfos@gmail.com',    value: 'rfi.irfos@gmail.com' },
  { label: 'GitHub',                  href: 'https://github.com/rfi-irfos', value: 'github.com/rfi-irfos' },
  { label: 'OSF Research Archive',    href: 'https://osf.io/rzvyg/',         value: 'osf.io/rzvyg' },
  { label: 'Security Policy',         href: '/.well-known/security.txt',     value: 'security.txt' },
]

function TimelineItem({ m, i }: { m: typeof MILESTONES[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
      else if (entry.boundingClientRect.top > 0) setVisible(false)
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const isLeft = i % 2 === 0
  const tagStyle: React.CSSProperties = {
    fontFamily: 'monospace', fontSize: 9, textTransform: 'uppercase',
    letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 20,
    border: '1px solid var(--accent-border)', color: 'var(--accent)', whiteSpace: 'nowrap',
  }
  const cardStyle: React.CSSProperties = {
    flex: 1,
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderLeft: visible ? '3px solid var(--accent)' : '3px solid transparent',
    borderRadius: 8, padding: '20px 22px',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : isLeft ? 'translateX(-28px)' : 'translateX(28px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease, border-left-color 0.5s ease',
  }

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 48px 1fr', alignItems: 'start' }}>
      {isLeft ? (
        <>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)' }}>{m.year}</span>
              <span style={tagStyle}>{m.tag}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8, color: 'var(--text)' }}>{m.title}</div>
            <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.75 }}>{m.body}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: visible ? 'var(--accent)' : 'var(--text4)',
              border: '2px solid var(--bg)',
              boxShadow: visible ? '0 0 0 3px var(--accent-border)' : 'none',
              transition: 'all 0.4s ease', zIndex: 1,
            }} />
          </div>
          <div />
        </>
      ) : (
        <>
          <div />
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: visible ? 'var(--accent)' : 'var(--text4)',
              border: '2px solid var(--bg)',
              boxShadow: visible ? '0 0 0 3px var(--accent-border)' : 'none',
              transition: 'all 0.4s ease', zIndex: 1,
            }} />
          </div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)' }}>{m.year}</span>
              <span style={tagStyle}>{m.tag}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8, color: 'var(--text)' }}>{m.title}</div>
            <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.75 }}>{m.body}</div>
          </div>
        </>
      )}
    </div>
  )
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const opts: { key: Theme; label: string }[] = [
    { key: 'light', label: 'LIGHT' },
    { key: 'dark',  label: 'DARK'  },
    { key: 'hc',    label: 'HC'    },
  ]
  return (
    <div style={{ display: 'flex' }}>
      {opts.map(o => (
        <button
          key={o.key}
          onClick={() => setTheme(o.key)}
          className={`theme-btn${theme === o.key ? ' active' : ''}`}
          aria-pressed={theme === o.key}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function PublicSite() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try { return (localStorage.getItem('rfi-theme') as Theme) ?? 'dark' } catch { return 'dark' }
  })
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [formState, setFormState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const pixelRef = useRef<HTMLImageElement>(null)
  const mobile = useMobile()
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  function setTheme(t: Theme) {
    setThemeState(t)
    try { localStorage.setItem('rfi-theme', t) } catch {}
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    fetch('https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/', referrer: document.referrer, utm_source: new URLSearchParams(location.search).get('utm_source') ?? '' }),
    }).catch(() => {})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('rfi-visible')
          } else if (entry.boundingClientRect.top > 0) {
            entry.target.classList.remove('rfi-visible')
          }
        })
      },
      { threshold: 0.08 },
    )
    document.querySelectorAll('.rfi-animate').forEach(el => observer.observe(el))
    return () => observer.disconnect()
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
            subject: `[rfi-irfos.com] ${form.subject || 'New inquiry'} -- ${form.name}`,
            name: form.name, email: form.email, replyto: form.email,
            subject_interest: form.subject, message: form.message,
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
    <div data-theme={theme} className="rfi-public" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled || menuOpen ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid var(--nav-border)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        padding: '0 1.4rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
      }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="RFI-IRFOS" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.06em', color: 'var(--text)' }}>RFI-IRFOS</span>
        </a>

        {mobile ? (
          /* ── HAMBURGER (mobile) ── */
          <button onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 6px',
            display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end',
          }}>
            <span style={{
              display: 'block', width: 22, height: 2, background: 'var(--text)',
              transition: 'transform 0.28s, opacity 0.28s',
              transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            }} />
            <span style={{
              display: 'block', height: 2, background: 'var(--text)',
              transition: 'width 0.28s, opacity 0.28s',
              width: menuOpen ? 0 : 14, opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: 22, height: 2, background: 'var(--text)',
              transition: 'transform 0.28s',
              transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            }} />
          </button>
        ) : (
          /* ── DESKTOP NAV ── */
          <div style={{ display: 'flex', gap: '1.6rem', alignItems: 'center' }}>
            {NAV_LINKS.map(n => (
              <a key={n.href} href={n.href} style={{
                color: 'var(--text3)', fontSize: 12, fontWeight: 600,
                textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}>
                {n.label}
              </a>
            ))}
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <a href="mailto:contact@ternlang.com" style={{
              background: 'var(--accent)', color: 'var(--bg)',
              padding: '7px 16px', borderRadius: 4,
              fontWeight: 800, fontSize: 11, textDecoration: 'none', letterSpacing: '0.07em',
            }}>Contact</a>
          </div>
        )}
      </nav>

      {/* ── MOBILE MENU DRAWER ── */}
      {mobile && menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: 64, zIndex: 199,
          background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          padding: '2rem 1.6rem 3rem',
          overflowY: 'auto',
          animation: 'mobileMenuIn 0.22s ease',
        }}>
          <style>{`@keyframes mobileMenuIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
          {NAV_LINKS.map((n, i) => (
            <a key={n.href} href={n.href} onClick={closeMenu} style={{
              color: 'var(--text)', fontSize: 26, fontWeight: 800,
              textDecoration: 'none', padding: '18px 0',
              borderBottom: '1px solid var(--border)',
              display: 'block',
              animationDelay: `${i * 0.04}s`,
              letterSpacing: '-0.01em',
            }}>
              {n.label}
            </a>
          ))}
          <div style={{ marginTop: 32, display: 'flex', gap: 14, alignItems: 'center' }}>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
          <a href="mailto:contact@ternlang.com" onClick={closeMenu} style={{
            marginTop: 24, background: 'var(--accent)', color: 'var(--bg)',
            padding: '15px 30px', borderRadius: 4, textAlign: 'center',
            fontWeight: 800, fontSize: 14, textDecoration: 'none', letterSpacing: '0.06em',
            display: 'block',
          }}>Contact</a>
        </div>
      )}

      {/* HERO */}
      <section className="rfi-hero" style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: mobile ? '96px 1.1rem 56px' : '120px 2rem 80px',
        background: 'var(--hero-grad)',
      }}>
        <p style={{
          fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', letterSpacing: '0.22em',
          textTransform: 'uppercase', marginBottom: 36,
          border: '1px solid var(--border)', padding: '5px 14px', borderRadius: 2, display: 'inline-block',
        }}>
          RFI-IRFOS &nbsp;·&nbsp; ZVR 1015608684 &nbsp;·&nbsp; GISA 39261441 &nbsp;·&nbsp; Graz, Austria &nbsp;·&nbsp; est. 2020
        </p>
        <p style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)', fontWeight: 900, lineHeight: 1.06, marginBottom: 8, letterSpacing: '-0.02em', color: 'var(--text)' }}>
          We read your code.
        </p>
        <p style={{ fontSize: 'clamp(1.2rem, 2.8vw, 2.2rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: 28, letterSpacing: '-0.01em', color: 'var(--text2)' }}>
          Not your documentation. Your code.
        </p>
        <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 560, lineHeight: 1.85, marginBottom: 48, fontWeight: 400 }}>
          An independent Austrian research institute working at the intersection of ternary AI, security and privacy, governance, and ecocentric technology.
          One team. No silos. Everything in-house.
        </p>
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
          flexDirection: mobile ? 'column' : 'row',
          width: mobile ? '100%' : 'auto',
        }}>
          <a href="#research" style={{
            background: 'var(--accent)', color: 'var(--bg)',
            padding: '13px 30px', borderRadius: 4,
            fontWeight: 800, fontSize: 13, textDecoration: 'none', letterSpacing: '0.06em',
            textAlign: 'center',
          }}>Explore our research</a>
          <a href="#track-record" style={{
            border: '1px solid var(--accent-border)', color: 'var(--accent-text)',
            padding: '13px 30px', borderRadius: 4,
            fontWeight: 700, fontSize: 13, textDecoration: 'none', letterSpacing: '0.04em',
            textAlign: 'center',
          }}>2026 audit series</a>
        </div>

        <div style={{ display: 'flex', gap: '3rem', marginTop: 80, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { n: '103',  label: 'apps audited' },
            { n: '81',   label: 'companies notified' },
            { n: '200+', label: 'critical findings' },
            { n: '10+',  label: 'regulators notified' },
            { n: '6',    label: 'years of research' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i} from="scale">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--accent)', fontFamily: 'monospace' }}>{s.n}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 5 }}>{s.label}</div>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RESEARCH AREAS */}
      <section id="research" style={{ padding: '100px 2rem', background: 'var(--bg2)', borderTop: '1px solid var(--border2)' }}>
        <div className="rfi-animate rfi-from-left" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 10 }}>01 - Research Areas</p>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 14, color: 'var(--text)' }}>Areas of investigation</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 520, lineHeight: 1.75, fontSize: 15 }}>
            The same people who train the model write the regulatory analysis.
            One team. Not multiple departments coordinating across silos.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {RESEARCH_AREAS.map((a, i) => (
              <Reveal key={a.title} delay={i} from="bottom">
              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '26px 22px', height: '100%',
              }}>
                <div style={{ fontSize: 22, color: 'var(--accent)', marginBottom: 14, lineHeight: 1 }}>{a.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10, color: 'var(--text)' }}>{a.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.75 }}>{a.desc}</div>
              </div>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 60 }}>
            <Reveal from="left">
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 18, color: 'var(--text)' }}>Publications &amp; Research</h3>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PUBLICATIONS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.5} from="left">
                <a href={p.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '14px 18px', borderRadius: 6, textDecoration: 'none',
                    background: 'var(--bg)', border: '1px solid var(--border2)', transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-border)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border2)')}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)', minWidth: 32 }}>{p.year}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{p.title}</span>
                    <span style={{ color: 'var(--text3)', fontSize: 11, display: 'block', marginTop: 2 }}>{p.sub}</span>
                    <span style={{ color: 'var(--text4)', fontSize: 10, fontFamily: 'monospace', display: 'block', marginTop: 1 }}>{p.venue}</span>
                  </span>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 20, border: '1px solid var(--accent-border)', color: 'var(--accent)', whiteSpace: 'nowrap' }}>{p.tag}</span>
                  <span style={{ color: 'var(--text4)', fontSize: 12 }}>&#8599;</span>
                </a>
                </Reveal>
              ))}
            </div>
            <p style={{ marginTop: 14, fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)' }}>
              119 projects on OSF &nbsp;·&nbsp; <a href="https://osf.io/rzvyg/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text3)', textDecoration: 'none' }}>osf.io/rzvyg</a>
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: '100px 2rem', background: 'var(--bg)', borderTop: '1px solid var(--border2)' }}>
        <div className="rfi-animate rfi-from-right" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 10 }}>02 - Projects</p>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 14, color: 'var(--text)' }}>What we build</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 520, lineHeight: 1.75, fontSize: 15 }}>
            Each project is a proof of concept for a different research question.
            All of them run on the same stack.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {PROJECTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.4} from={i % 2 === 0 ? 'left' : 'right'}>
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '26px 22px', display: 'flex', flexDirection: 'column', gap: 10,
                height: '100%',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 17, color: 'var(--text)' }}>{p.name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 3 }}>{p.sub}</div>
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 20, border: '1px solid var(--accent-border)', color: 'var(--accent)', whiteSpace: 'nowrap' }}>{p.tag}</span>
                </div>
                <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.75, flex: 1 }}>{p.desc}</p>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--accent-text)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
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
      <section id="track-record" style={{ padding: '100px 2rem', background: 'var(--bg2)', borderTop: '1px solid var(--border2)' }}>
        <div className="rfi-animate rfi-from-left" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 10 }}>03 - Track Record</p>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 14, color: 'var(--text)' }}>Security research at scale</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 48, maxWidth: 520, lineHeight: 1.75, fontSize: 15 }}>
            Decompilation and root-level comparison of code files. Regulators in BCC on every submission.
            90-day coordinated disclosure. Our framework, our timeline.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
            {[
              { n: '103',  label: 'Apps audited' },
              { n: '81',   label: 'Companies notified' },
              { n: '200+', label: 'Critical findings' },
              { n: '10+',  label: 'Regulators notified' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i} from="scale">
              <div style={{
                background: 'var(--bg-accent)', border: '1px solid var(--accent-border)',
                borderRadius: 6, padding: '22px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--accent)', fontFamily: 'monospace' }}>{s.n}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 6 }}>{s.label}</div>
              </div>
              </Reveal>
            ))}
          </div>
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '14px 20px', marginBottom: 44,
            fontFamily: 'monospace', fontSize: 11, color: 'var(--text2)', lineHeight: 2,
          }}>
            <span style={{ color: 'var(--accent-text)', fontWeight: 700 }}>NYSE · NASDAQ · LSE · XETRA</span>
            {' '}listed targets &nbsp;·&nbsp; GDPR Art. 5/8/9/13/25/32/44 &nbsp;·&nbsp; ISO/IEC 29147 &nbsp;·&nbsp; coordinated disclosure 2026-09-19 &nbsp;·&nbsp; DSB · EDPB · ICO · BfDI · DPC · CERT.at
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>Selected findings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {AUDIT_HIGHLIGHTS.map((a, i) => (
              <Reveal key={i} delay={i * 0.3} from="left">
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-start',
                padding: '14px 18px', borderRadius: 6,
                background: 'var(--bg)', border: '1px solid var(--border2)',
              }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', minWidth: 140, flex: '0 0 auto' }}>{a.target}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', flex: '0 0 auto', paddingTop: 2 }}>{a.market}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: SEV_COLOR[a.sev] ?? ACCENT, flex: '0 0 auto', paddingTop: 2 }}>{a.sev}</span>
                <span style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.65, flex: '1 1 260px' }}>{a.finding}</span>
              </div>
              </Reveal>
            ))}
          </div>
          <p style={{ marginTop: 16, fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)' }}>
            Full audit archive &nbsp;·&nbsp; <a href="https://github.com/rfi-irfos/android-security-audit-2026" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text3)', textDecoration: 'none' }}>github.com/rfi-irfos/android-security-audit-2026</a>
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{ padding: '100px 2rem', background: 'var(--bg)', borderTop: '1px solid var(--border2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p className="rfi-animate rfi-from-up" style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 10, textAlign: 'center' }}>04 - Timeline</p>
          <h2 className="rfi-animate rfi-from-up" style={{ fontSize: 34, fontWeight: 900, marginBottom: 64, textAlign: 'center', color: 'var(--text)' }}>2020 to now</h2>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
              background: 'var(--timeline-line)', transform: 'translateX(-50%)',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {MILESTONES.map((m, i) => (
                <TimelineItem key={i} m={m} i={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 2rem', background: 'var(--bg2)', borderTop: '1px solid var(--border2)' }}>
        <div className="rfi-animate rfi-from-right" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 10 }}>05 - Pricing</p>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 14, color: 'var(--text)' }}>Transparent pricing</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 520, lineHeight: 1.75, fontSize: 15 }}>
            Fixed rates. No retainer lock-in unless you want one. Scope determines tier, not company size.
          </p>

          <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 16 }}>Security Audits &amp; Responsible Disclosure</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 44 }}>
            {[
              { tier: 'Public',                price: 'free',     desc: 'Full public disclosure. Findings published after 90-day coordinated embargo. No NDA.', highlight: false },
              { tier: 'Remediation Advisory',  price: '4,500',    desc: 'Full report + remediation guidance. 30-day follow-up. GDPR compliance mapping included.', highlight: false },
              { tier: 'Confidential',          price: '9,000',    desc: 'NDA-protected disclosure. Private report + patch validation. Regulators still notified.', highlight: false },
              { tier: 'Enterprise NDA',        price: '18,000',   desc: 'Extended embargo + dedicated remediation support + legal evidence package.', highlight: false },
              { tier: 'Critical Infrastructure', price: '75,000', desc: 'NDA + legal + PR containment strategy + regulator liaison. Full-scope package.', highlight: true },
              { tier: 'IoB / Art. 9',          price: '150,000',  desc: 'Internet of Bodies / wearables with Art. 9 GDPR health data. Elevated risk premium.', highlight: true },
            ].map(t => (
              <div key={t.tier} style={{
                background: t.highlight ? 'var(--bg-accent)' : 'var(--bg)',
                border: `1px solid ${t.highlight ? 'var(--accent-border)' : 'var(--border)'}`,
                borderRadius: 6, padding: '22px 18px',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent)', marginBottom: 10, fontFamily: 'monospace' }}>{t.price === 'free' ? 'free' : `€${t.price}`}</div>
                <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.75 }}>{t.desc}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '20px 26px', marginBottom: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 5, color: 'var(--text)' }}>Security Retainer</div>
              <div style={{ color: 'var(--text2)', fontSize: 13 }}>continuous monitoring · quarterly audits · priority response · dedicated contact</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent)', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>&#8364;1,500 / mo</div>
          </div>

          <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 16 }}>Web Development &amp; Research</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { tier: 'Landing Page',    price: '1,500',  desc: 'Single-page site. React + our template. Delivered in 48h.' },
              { tier: 'Full Site',       price: '4,500',  desc: 'Multi-page + CMS admin + contact form + analytics. 2-week delivery.' },
              { tier: 'Enterprise',      price: '18,000', desc: 'Custom Rust backend + auth + integrations. Full scope.' },
              { tier: 'Research Report', price: '2,500',  desc: 'Market analysis / policy brief / stakeholder interviews. 10-page minimum.' },
            ].map(t => (
              <div key={t.tier} style={{
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '22px 18px',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{t.tier}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent)', marginBottom: 10, fontFamily: 'monospace' }}>&#8364;{t.price}</div>
                <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.75 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 2rem', background: 'var(--bg)', borderTop: '1px solid var(--border2)' }}>
        <div className="rfi-animate rfi-from-left" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 10 }}>06 - Services</p>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 14, color: 'var(--text)' }}>Work with us</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 48, maxWidth: 520, lineHeight: 1.75, fontSize: 15 }}>
            We are a regulated research institute that earns revenue.
            Not a charitable institution. Not a bug bounty shop.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { title: 'Security Audits',  desc: 'Root-level comparison of your code files. GDPR compliance review. Coordinated disclosure with regulators in BCC. From EUR 4,500.', accent: true },
              { title: 'Send us your APK', desc: 'We tear it apart. You get the full report before anyone else does. Any Android APK, any company size. First R1 always free.', accent: true },
              { title: 'Web Development', desc: 'React + Rust backends. Mobile. Enterprise. Built on our own stack. From EUR 1,500.', accent: false },
              { title: 'Research Reports', desc: 'Market analysis, policy briefs, stakeholder interviews, AI governance consulting. From EUR 2,500.', accent: false },
            ].map(s => (
              <div key={s.title} style={{
                background: s.accent ? 'var(--bg-accent)' : 'var(--bg2)',
                border: `1px solid ${s.accent ? 'var(--accent-border)' : 'var(--border)'}`,
                borderRadius: 6, padding: '24px 22px',
              }}>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, color: 'var(--text)' }}>{s.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.75 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <a href="mailto:contact@ternlang.com" style={{
            display: 'inline-block',
            border: '1px solid var(--accent-border)', color: 'var(--accent-text)',
            padding: '11px 24px', borderRadius: 4, fontWeight: 700, fontSize: 13,
            textDecoration: 'none', letterSpacing: '0.04em',
          }}>Get in touch &rarr;</a>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section style={{ padding: '60px 2rem', background: 'var(--bg2)', borderTop: '1px solid var(--border2)' }}>
        <div className="rfi-animate rfi-from-up" style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', textAlign: 'center', marginBottom: 28 }}>
            Regulated · Licensed · Registered
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
            {CREDENTIALS.map(c => (
              <div key={c.label} style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '16px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>{c.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{c.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{c.sub}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace', marginTop: 22 }}>
            regulated not-for-profit · 90%+ surplus reinvested into research · surplus not distributed to members
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '100px 2rem', background: 'var(--bg)', borderTop: '1px solid var(--border2)' }}>
        <div className="rfi-animate rfi-from-up" style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 10 }}>07 - Contact</p>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 14, color: 'var(--text)' }}>Connect</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 48, fontSize: 15, lineHeight: 1.75 }}>Research collaboration, security disclosures, service inquiries.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(['name', 'email'] as const).map(f => (
                <input key={f} type={f === 'email' ? 'email' : 'text'} required placeholder={f === 'name' ? 'Name' : 'Email'}
                  value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                  className="rfi-input" />
              ))}
              <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="rfi-input"
                style={{ color: form.subject ? 'var(--input-text)' : 'var(--input-ph)' }}>
                <option value="">Topic (optional)</option>
                <option value="Security Audit">Security Audit</option>
                <option value="Send APK">Send us your APK</option>
                <option value="Research Collaboration">Research Collaboration</option>
                <option value="Web Development">Web Development</option>
                <option value="Other">Other</option>
              </select>
              <textarea required placeholder="Message" value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                rows={5} className="rfi-input" style={{ resize: 'vertical' }} />
              <button type="submit" disabled={formState === 'sending'} style={{
                background: formState === 'ok' ? 'var(--bg-accent)' : 'var(--accent)',
                color: formState === 'ok' ? 'var(--accent-text)' : 'var(--bg)',
                border: formState === 'ok' ? '1px solid var(--accent-border)' : 'none',
                padding: '12px 22px', borderRadius: 4, fontWeight: 800, fontSize: 13,
                cursor: formState === 'sending' ? 'wait' : 'pointer', fontFamily: 'inherit',
                letterSpacing: '0.04em',
              }}>
                {formState === 'sending' ? 'Sending...' : formState === 'ok' ? 'Message received.' : 'Send message'}
              </button>
              {formState === 'err' && (
                <p style={{ color: 'var(--sev-crit)', fontSize: 12 }}>Something went wrong. Email us directly at contact@ternlang.com</p>
              )}
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CONTACT_CARDS.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 6, padding: '16px 18px', textDecoration: 'none', display: 'block',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-border)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 5 }}>{c.label}</div>
                  <div style={{ color: 'var(--accent-text)', fontWeight: 600, fontSize: 13 }}>{c.value}</div>
                </a>
              ))}
              <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace', marginTop: 6, lineHeight: 1.9 }}>
                Elisabethinergasse 25<br />8020 Graz, Austria<br />rfi-irfos.com · rfi-irfos.at
              </p>
            </div>
          </div>
        </div>
        <img ref={pixelRef} src={`${LIGHTHOUSE_PIXEL}?utm_source=rfi-irfos-web`}
          alt="" width="1" height="1" style={{ display: 'none' }} />
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 2rem', textAlign: 'center', background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', gap: '1.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            { label: 'Impressum',            href: '#p/impressum' },
            { label: 'Datenschutz',          href: '#p/datenschutz' },
            { label: 'AGB',                  href: '#p/agb' },
            { label: 'Security Policy',      href: '#p/security' },
            { label: 'ternlang.com',         href: 'https://ternlang.com' },
            { label: 'github.com/rfi-irfos', href: 'https://github.com/rfi-irfos' },
          ].map(l => (
            <a key={l.label} href={l.href} style={{ color: 'var(--text3)', fontSize: 12, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}>
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', background: 'var(--bg)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.06em' }}>WKO MEMBER &nbsp;·&nbsp; GewO § 32 &nbsp;·&nbsp; Automatische Datenverarbeitung</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', background: 'var(--bg)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.06em' }}>REGULATED NOT-FOR-PROFIT &nbsp;·&nbsp; ZVR 1015608684 &nbsp;·&nbsp; GISA 39261441</span>
          </div>
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)', letterSpacing: '0.08em' }}>
          &copy; 2026 RFI-IRFOS &nbsp;&middot;&nbsp; Steuernummer 68 028/0989 &nbsp;&middot;&nbsp; Graz, Austria
        </p>
      </footer>
    </div>
  )
}
