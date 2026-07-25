import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

const TEAL = '#00f5c4'

// Same NAV_LINKS as PublicSite.tsx, but as router paths. Once the content
// migration (Task 3) strips the nav out of PublicSite, this becomes the single
// source of truth.
const NAV_LINKS = [
  { label: 'Research', to: '/research' },
  { label: 'Projects', to: '/projects' },
  { label: 'Track Record', to: '/track-record' },
  { label: 'Submit', to: '/submit' },
  { label: 'Standards', to: '/standards' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Team', to: '/team' },
  { label: 'Coop', to: '/coop' },
]

// Copied verbatim from PublicSite.tsx — React inline styles can't do media
// queries, so the hamburger/desktop-nav split is gated on this hook.
function useMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp)
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [bp])
  return m
}

export function Layout() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const mobile = useMobile()
  const location = useLocation()

  // Theme application — moved here from PublicSite so every route (including
  // legal pages and stubs) gets the data-theme attribute. useTheme() itself
  // persists to localStorage.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Route change: close the mobile menu and reset scroll (replaces the old
  // hash-route scroll reset in App.tsx).
  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', overflowX: 'hidden', maxWidth: '100vw' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.png" alt="RFI-IRFOS" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.06em', color: 'var(--text)' }}>RFI-IRFOS</span>
          <svg width="54" height="18" viewBox="0 0 54 18" fill="none" style={{ marginLeft: 4, flexShrink: 0, overflow: 'visible' }}>
            <polyline className="ekg-line" points="0,9 12,9 16,2 20,16 24,2 28,9 54,9"
              stroke="#00f5c4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* Desktop nav - React inline styles can't do media queries, so gate on the useMobile() hook */}
        <div style={{ display: mobile ? 'none' : 'flex', gap: '1.75rem', alignItems: 'center' }}>
          {NAV_LINKS.map(n => (
            <Link key={n.to} to={n.to} style={{
              color: 'var(--text2)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', letterSpacing: '0.04em',
              transition: 'color 0.18s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}>
              {n.label}
            </Link>
          ))}

          {/* Theme toggle */}
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
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

          <a href="mailto:contact@rfi-irfos.com" title="Contact" aria-label="Contact"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 38, height: 38, borderRadius: 8,
              background: 'transparent', border: `1px solid ${TEAL}`,
              color: TEAL, textDecoration: 'none', transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#070711' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TEAL }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </a>
        </div>

        {/* Hamburger - shown only on mobile (media queries don't work in inline styles) */}
        <button onClick={() => setMobileOpen(o => !o)} style={{
          display: mobile ? 'flex' : 'none',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px', color: 'var(--text)',
        }} aria-label="Menu">
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="8" x2="21" y2="8" /><line x1="3" y1="16" x2="21" y2="16" /></svg>
          )}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: 'var(--nav-bg)', backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', gap: 4,
        }}>
          {NAV_LINKS.map(n => (
            <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)} style={{
              color: 'var(--text)', fontSize: 20, fontWeight: 700, textDecoration: 'none',
              padding: '16px 0', borderBottom: '1px solid var(--border)',
            }}>{n.label}</Link>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            {(['light', 'dark', 'hc'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)} style={{
                background: theme === t ? 'rgba(0,245,196,0.18)' : 'var(--bg3)',
                color: theme === t ? TEAL : 'var(--text3)',
                border: theme === t ? `1px solid ${TEAL}` : '1px solid var(--border)',
                borderRadius: 6, cursor: 'pointer',
                padding: '8px 16px', fontSize: 11, fontWeight: 700,
                fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{t === 'hc' ? 'HC' : t.toUpperCase()}</button>
            ))}
          </div>
          <a href="mailto:contact@rfi-irfos.com" title="Contact" aria-label="Contact"
            style={{
              marginTop: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 48, height: 48, borderRadius: 8,
              background: 'transparent', border: `1px solid ${TEAL}`,
              color: TEAL, textDecoration: 'none', alignSelf: 'flex-start',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#070711' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TEAL }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </a>
        </div>
      )}

      {/* ROUTED PAGE CONTENT */}
      <Outlet />

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 12, color: TEAL, letterSpacing: '0.06em', marginBottom: 24, fontWeight: 600 }}>
          Human rights are not subject to negotiation.
          <br />
          <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 400 }}>— RFI-IRFOS × Emergent Interaction Lab, core doctrine</span>
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            { label: 'Legal Notice', to: '/p/impressum' },
            { label: 'Privacy Policy', to: '/p/datenschutz' },
            { label: 'Terms', to: '/p/agb' },
            { label: 'Security Policy', to: '/p/security' },
          ].map(l => (
            <Link key={l.label} to={l.to} style={{ color: 'var(--text3)', fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = TEAL)}
              onMouseLeave={e => (e.currentTarget.style.color = '#606080')}>
              {l.label}
            </Link>
          ))}
          {[
            { label: 'ternlang.com', href: 'https://ternlang.com' },
            { label: 'github.com/rfi-irfos', href: 'https://github.com/rfi-irfos' },
          ].map(l => (
            <a key={l.label} href={l.href} style={{ color: 'var(--text3)', fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = TEAL)}
              onMouseLeave={e => (e.currentTarget.style.color = '#606080')}>
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <a href="https://www.wko.at" target="_blank" rel="noopener" title="WKO Mitglied - Wirtschaftskammer Osterreich" style={{ display: 'inline-block', opacity: 0.85 }}>
            <svg viewBox="0 0 420 100" width="168" height="40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WKO - Wirtschaftskammer Osterreich" style={{ display: 'block' }}>
              <rect x="0" y="0" width="100" height="100" fill="#CC0000" />
              <text x="50" y="78" fontFamily="Arial Black,sans-serif" fontSize="74" fontWeight="900" fill="#fff" textAnchor="middle">W</text>
              <rect x="105" y="0" width="100" height="100" fill="#CC0000" />
              <text x="155" y="78" fontFamily="Arial Black,sans-serif" fontSize="74" fontWeight="900" fill="#fff" textAnchor="middle">K</text>
              <rect x="210" y="0" width="100" height="100" fill="#CC0000" />
              <text x="260" y="78" fontFamily="Arial Black,sans-serif" fontSize="74" fontWeight="900" fill="#fff" textAnchor="middle">O</text>
              <rect x="320" y="0" width="100" height="33" fill="#CC0000" />
              <rect x="320" y="33" width="100" height="34" fill="#fff" />
              <rect x="320" y="67" width="100" height="33" fill="#CC0000" />
            </svg>
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: 16 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: 4, border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', background: 'var(--bg2)', textAlign: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.06em' }}>WKO MEMBER · GewO § 32 · Automatic Data Processing</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: 4, border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', background: 'var(--bg2)', textAlign: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.06em' }}>REGULATED NOT-FOR-PROFIT · ZVR 1015608684</span>
          </div>
        </div>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: 4, border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', background: 'var(--bg2)', textAlign: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.06em' }}>
              UID ATU83405245 &nbsp;·&nbsp; GISA 39261441
            </span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', gap: 4, border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', background: 'var(--bg2)', textAlign: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text2)', letterSpacing: '0.06em' }}>
              ECG AUTHORITY · Magistrate of the City of Graz &nbsp;·&nbsp; Since 2026-03-19
            </span>
          </div>
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)', letterSpacing: '0.08em', marginBottom: 4 }}>
          Trade Description: Services in Automatic Data Processing and Information Technology &nbsp;·&nbsp; Trade-Law Management: Simeon-Andreas Johann Manfred Kepp
        </p>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)', letterSpacing: '0.08em' }}>
          Elisabethinergasse 25/10, 8020 Graz &nbsp;·&nbsp; GLN 9110038490191 &nbsp;·&nbsp; Steuernummer 68 696/8736
        </p>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)', letterSpacing: '0.08em', marginBottom: 0 }}>
          &copy; 2026 RFI-IRFOS &nbsp;·&nbsp; Graz, Austria
        </p>
      </footer>
    </div>
  )
}
