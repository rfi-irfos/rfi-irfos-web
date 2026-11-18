import { useEffect, useRef, useState } from 'react'
import type { Content } from '../content/en'

// Login screen behind the nav profile icon (Simeon 11.11.2026, opened 17.11.2026). Left: link to the real
// portal sign-in (email, password and MFA are typed there only, never on this page) and a Get access button
// that opens the Starter checkout; the purchase webhook then creates the portal account and sends the invitation.
// Right: demo dashboard preview.
// Layout (Simeon, same day): portal on the left, preview as large as the window allows on the right,
// click on the preview opens it enlarged. Always dark (background image and preview are dark),
// independent of the site theme.

const ACCENT = '#f2501f'
const TRUST_GREEN = '#4fbf86'
const PORTAL_LOGIN_URL = 'https://portal.rfi-irfos.com/login'
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
/* Wide windows (Simeon 18.11.): the preview stays straight and fills the stage; the Trust Center card hangs in its lower right corner.
   The frame carries the card, so both keep their place at every window size. */
@media (min-width: 960px) {
  .rfi-login-stage { position: relative; overflow: hidden; padding: 40px 40px 40px 36px; }
  .rfi-login-frame { position: relative; flex: none; width: min(100%, calc((100vh - 80px) * ${PREVIEW_RATIO.toFixed(3)})); }
  .rfi-login-tilt { width: 100%; }
  .rfi-login-tilt .rfi-login-shot { width: 100%; }
  .rfi-login-trust { position: absolute; right: -18px; bottom: -38px; width: clamp(260px, 22vw, 380px); }
}
/* The Trust Center card (Simeon 18.11.): the one key feature hanging in front of the dashboard, linked to the landing page, green mark. */
.rfi-login-trust { display: block; overflow: hidden; color: #fff; text-decoration: none; background: rgba(16,13,13,0.9);
  border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; box-shadow: 0 24px 60px rgba(0,0,0,0.65), 0 14px 52px -2px rgba(79,191,134,0.42);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); transition: border-color 0.2s ease, transform 0.2s ease; }
.rfi-login-trust:hover, .rfi-login-trust:focus-visible { border-color: ${ACCENT}; transform: translateY(-2px); outline: none; }
.rfi-login-trust img { display: block; width: 100%; height: auto; border-bottom: 1px solid rgba(255,255,255,0.12); }
.rfi-login-trust-text { display: block; padding: 13px 16px 15px; }
.rfi-login-trust-text b { display: flex; align-items: center; gap: 8px; position: relative; font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.rfi-login-trust-arrow { margin-left: auto; flex: none; transition: transform 0.25s ease; }
.rfi-login-trust:hover .rfi-login-trust-arrow, .rfi-login-trust:focus-visible .rfi-login-trust-arrow { transform: translateX(3px); }
.rfi-login-trust-text span { display: block; font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.78); }
.rfi-login-hint { position: absolute; left: 12px; top: 10px; display: flex; align-items: center; gap: 6px; padding: 6px 11px;
  font-size: 12px; font-weight: 600; color: #fff; background: rgba(12,10,10,0.78); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px; backdrop-filter: blur(6px); }
/* Smooth switch (Simeon 11.11., slower and staged 18.11.): first only the background picture, then the side panel slides in, the preview rises
   behind it and last the Trust Center card settles on its corner; closing fades out before the screen is removed. The card keeps its fill mode
   at "backwards" so the hover lift is not frozen by the finished animation. */
.rfi-login { animation: rfi-login-in 0.6s cubic-bezier(.4, 0, .2, 1) both; }
.rfi-login.is-closing { animation: rfi-login-out 0.25s cubic-bezier(.4, 0, .2, 1) both; pointer-events: none; }
.rfi-login-side { animation: rfi-login-side-in 0.95s 0.5s cubic-bezier(.2, .7, .2, 1) both; }
.rfi-login-stage { animation: rfi-login-stage-in 1s 0.8s cubic-bezier(.2, .7, .2, 1) both; }
.rfi-login-trust { animation: rfi-login-card-in 0.9s 1.45s cubic-bezier(.2, .7, .2, 1) backwards; }
@keyframes rfi-login-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes rfi-login-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes rfi-login-side-in { from { opacity: 0; transform: translateX(-44px); } to { opacity: 1; transform: none; } }
@keyframes rfi-login-stage-in { from { opacity: 0; transform: translateY(22px) scale(0.985); } to { opacity: 1; transform: none; } }
@keyframes rfi-login-card-in { from { opacity: 0; transform: translateY(26px) scale(0.95); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .rfi-login, .rfi-login.is-closing, .rfi-login-side, .rfi-login-stage, .rfi-login-trust { animation: none; } }
@media (max-width: 959px) {
  .rfi-login-grid { grid-template-columns: minmax(0, 1fr); }
  .rfi-login-side { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 64px 24px 32px; align-items: center; }
  .rfi-login-side > * { width: 100%; max-width: 420px; }
  .rfi-login-stage { padding: 28px 16px 40px; }
  .rfi-login-shot { width: 100%; }
  .rfi-login-frame { width: 100%; }
  .rfi-login-trust { margin: 16px auto 0; max-width: 420px; }
}
`

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="rfi-login-trust-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={TRUST_GREEN} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" />
    </svg>
  )
}

export function LoginPreview({ t, onClose, onRequestAccess, busy }: { t: Content; onClose: () => void; onRequestAccess: () => void; busy: boolean }) {
  const c = t.login
  const closeRef = useRef<HTMLButtonElement>(null)
  const [zoom, setZoom] = useState(false)
  const [closing, setClosing] = useState(false)

  // Every way out (X, Esc) fades the screen out first, then runs the real callback.
  const closingRef = useRef(false)
  const leave = (after: () => void) => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(after, reduced ? 0 : 200)
  }
  const leaveRef = useRef(leave)
  leaveRef.current = leave

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
      if (zoomRef.current) setZoom(false); else leaveRef.current(onClose)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      opener?.focus?.()
    }
  }, [onClose])

  return (
    <div className={closing ? 'rfi-login is-closing' : 'rfi-login'} role="dialog" aria-modal="true" aria-labelledby="login-title" data-testid="login-screen">
      <style>{CSS}</style>
      <button ref={closeRef} type="button" onClick={() => leave(onClose)} aria-label={c.close} title={c.close} style={{
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href={PORTAL_LOGIN_URL} data-testid="login-sign-in" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box', height: 50, fontFamily: FONT,
              fontSize: 15, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: 10, textDecoration: 'none',
            }}>{c.signIn}</a>
            <button type="button" disabled={busy} onClick={onRequestAccess} data-testid="login-request-access" style={{
              width: '100%', height: 50, fontFamily: FONT, fontSize: 15, fontWeight: 700, color: '#fff', background: ACCENT,
              border: 'none', borderRadius: 10, cursor: busy ? 'progress' : 'pointer', opacity: busy ? 0.7 : 1,
            }}>{busy ? c.accessBusy : c.requestAccess}</button>
          </div>
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.72)', margin: 0 }}>{c.accessNote} {c.signInNote}</p>
          </div>
        </div>

        <div className="rfi-login-stage">
          <div className="rfi-login-frame">
            <div className="rfi-login-tilt">
              <button type="button" className="rfi-login-shot" onClick={() => setZoom(true)} aria-label={`${c.previewTitle}: ${c.previewZoom}`} data-testid="login-preview">
                <img src="/login/demo-dashboard-2026-11-13.webp" alt={c.previewAlt} width={1921} height={929} />
                <span className="rfi-login-hint"><ExpandIcon />{c.previewZoom}</span>
              </button>
            </div>
            <a className="rfi-login-trust" href="https://trust.rfi-irfos.com/" target="_blank" rel="noopener" data-testid="login-trust-card">
              <img src={c.trustImage} alt={c.trustAlt} width={1600} height={900} loading="lazy" />
              <span className="rfi-login-trust-text"><b><ShieldIcon />{c.trustTitle}<ArrowIcon /></b><span>{c.trustLine}</span></span>
            </a>
          </div>
        </div>
      </div>

      {zoom && (
        <div onClick={() => setZoom(false)} data-testid="login-preview-zoom" style={{
          position: 'fixed', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          background: 'rgba(6,5,5,0.9)', cursor: 'zoom-out',
        }}>
          <img src="/login/demo-dashboard-2026-11-13.webp" alt={c.previewAlt} width={1921} height={929} style={{
            display: 'block', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 30px 90px rgba(0,0,0,0.7)',
          }} />
        </div>
      )}
    </div>
  )
}
