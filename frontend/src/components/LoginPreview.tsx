import { useEffect, useRef, useState } from 'react'
import type { Content } from '../content/en'

// Login screen behind the nav profile icon (Simeon 11.11.2026). Shows what the customer portal's
// sign-in looks like: locked fields, a request-early-access button and a demo dashboard preview.
// The portal itself is not reachable from here, so nothing on this screen submits anywhere.
// Layout (Simeon, same day): portal on the left, preview as large as the window allows on the right,
// click on the preview opens it enlarged. Always dark (background image and preview are dark),
// independent of the site theme.

const ACCENT = '#f2501f'
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif"
// demo-dashboard.webp is 1918x926: the preview is capped so the whole picture fits the window height.
const PREVIEW_RATIO = 1918 / 926

const CSS = `
.rfi-login { position: fixed; inset: 0; z-index: 9999; overflow-y: auto; font-family: ${FONT}; color: #fff;
  background: #0d0d10 url('/login/bg.webp') center / cover no-repeat; }
.rfi-login-grid { min-height: 100%; display: grid; grid-template-columns: minmax(360px, 460px) minmax(0, 1fr); }
.rfi-login-side { display: flex; flex-direction: column; justify-content: center; padding: 48px;
  background: linear-gradient(180deg, rgba(14,12,12,0.7), rgba(14,12,12,0.62)); border-right: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.rfi-login-stage { display: flex; align-items: center; justify-content: center; padding: 56px 56px 48px; min-width: 0; }
.rfi-login-shot { position: relative; display: block; width: min(100%, calc((100vh - 190px) * ${PREVIEW_RATIO.toFixed(3)})); padding: 0;
  border: 1px solid rgba(255,255,255,0.16); border-radius: 14px; overflow: hidden; background: #141212; cursor: zoom-in;
  box-shadow: 0 30px 80px rgba(0,0,0,0.6); transition: transform 0.2s ease, border-color 0.2s ease; }
.rfi-login-shot:hover, .rfi-login-shot:focus-visible { transform: translateY(-2px); border-color: ${ACCENT}; outline: none; }
.rfi-login-shot img { display: block; width: 100%; height: auto; }
.rfi-login-hint { position: absolute; right: 12px; bottom: 12px; display: flex; align-items: center; gap: 6px; padding: 6px 11px;
  font-size: 12px; font-weight: 600; color: #fff; background: rgba(12,10,10,0.78); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px; backdrop-filter: blur(6px); }
@media (max-width: 959px) {
  .rfi-login-grid { grid-template-columns: minmax(0, 1fr); }
  .rfi-login-side { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 64px 24px 32px; align-items: center; }
  .rfi-login-side > * { width: 100%; max-width: 420px; }
  .rfi-login-stage { padding: 28px 16px 40px; }
  .rfi-login-shot { width: 100%; }
}
`

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  )
}

function LockedField({ id, label, placeholder, type }: { id: string; label: string; placeholder: string; type: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.78)', marginBottom: 7 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input id={id} type={type} disabled placeholder={placeholder} autoComplete="off" style={{
          width: '100%', boxSizing: 'border-box', height: 48, padding: '0 42px 0 15px', fontFamily: FONT, fontSize: 14,
          color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.13)',
          borderRadius: 10, cursor: 'not-allowed', outline: 'none',
        }} />
        <span style={{ position: 'absolute', right: 14, top: 0, height: 48, display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.42)' }}><LockIcon /></span>
      </div>
    </div>
  )
}

export function LoginPreview({ t, onClose, onRequestAccess }: { t: Content; onClose: () => void; onRequestAccess: () => void }) {
  const c = t.login
  const closeRef = useRef<HTMLButtonElement>(null)
  const [zoom, setZoom] = useState(false)

  // Esc closes the enlarged preview first, then the screen. The page behind stays put while the
  // screen is open, and focus returns to the profile icon.
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (zoomRef.current) setZoom(false); else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      opener?.focus?.()
    }
  }, [onClose])

  return (
    <div className="rfi-login" role="dialog" aria-modal="true" aria-labelledby="login-title" data-testid="login-screen">
      <style>{CSS}</style>
      <button ref={closeRef} type="button" onClick={onClose} aria-label={c.close} title={c.close} style={{
        position: 'fixed', top: 18, right: 22, zIndex: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(14,12,12,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, cursor: 'pointer',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <div className="rfi-login-grid">
        <div className="rfi-login-side">
          {/* logo.webp is 126x84 (3:2): keep the ratio, the nav shows it the same way at 48x32 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <img src="/logo.webp" alt="" width={63} height={42} style={{ display: 'block', objectFit: 'contain' }} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em' }}>RFI-IRFOS</span>
          </div>
          <h2 id="login-title" style={{ fontSize: 32, fontWeight: 700, margin: '0 0 10px', lineHeight: 1.15 }}>{c.title}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.74)', margin: '0 0 30px' }}>{c.lead}</p>

          <form onSubmit={e => e.preventDefault()} aria-describedby="login-note">
            <LockedField id="login-email" type="email" label={c.emailLabel} placeholder={c.emailPlaceholder} />
            <LockedField id="login-password" type="password" label={c.passwordLabel} placeholder="••••••••••" />
            <button type="submit" disabled style={{
              width: '100%', height: 48, marginTop: 4, fontFamily: FONT, fontSize: 14, fontWeight: 600, borderRadius: 10,
              color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.13)', cursor: 'not-allowed',
            }}>{c.signIn}</button>
          </form>
          <p id="login-note" style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.62)', margin: '12px 0 26px' }}>{c.lockedNote}</p>

          <button type="button" onClick={onRequestAccess} data-testid="login-request-access" style={{
            width: '100%', height: 50, fontFamily: FONT, fontSize: 15, fontWeight: 700, color: '#fff', background: ACCENT,
            border: 'none', borderRadius: 10, cursor: 'pointer',
          }}>{c.requestAccess}</button>
        </div>

        <div className="rfi-login-stage">
          <button type="button" className="rfi-login-shot" onClick={() => setZoom(true)} aria-label={`${c.previewTitle}: ${c.previewZoom}`} data-testid="login-preview">
            <img src="/login/demo-dashboard.webp" alt={c.previewAlt} width={1918} height={926} />
            <span className="rfi-login-hint"><ExpandIcon />{c.previewZoom}</span>
          </button>
        </div>
      </div>

      {zoom && (
        <div onClick={() => setZoom(false)} data-testid="login-preview-zoom" style={{
          position: 'fixed', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          background: 'rgba(6,5,5,0.9)', cursor: 'zoom-out',
        }}>
          <img src="/login/demo-dashboard.webp" alt={c.previewAlt} width={1918} height={926} style={{
            display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 30px 90px rgba(0,0,0,0.7)',
          }} />
        </div>
      )}
    </div>
  )
}
