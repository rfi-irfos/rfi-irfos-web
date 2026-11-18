import type { CSSProperties } from 'react'

// End marker of the four steps (Simeon 18.11., picked in the variant picker, V2): a glass padlock with a tinted body.
// While the steps fill up it stands open, the shackle swung out to the right around its right leg. When the last
// step is reached the shackle swings back, drops into the body with a click and a green check is drawn.
// The animation sits in index.css (.rfi-fl-*), the open state is the static one so nothing plays before the end.
const ACCENT = '#712009'
const GREEN = '#3ddc84'

export function FinishLock({ reached }: { reached: boolean }) {
  return (
    <span aria-hidden="true" className={reached ? 'rfi-fl is-closed' : 'rfi-fl'} style={{
      width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      '--fl-accent': ACCENT, position: 'relative', zIndex: 1,
    } as CSSProperties}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="rfiFlBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'color-mix(in srgb, var(--fl-accent) 45%, #fff)' }} stopOpacity=".95" />
            <stop offset=".6" style={{ stopColor: 'color-mix(in srgb, var(--fl-accent) 80%, #fff)' }} stopOpacity=".95" />
            <stop offset="1" style={{ stopColor: 'color-mix(in srgb, var(--fl-accent) 82%, #000)' }} stopOpacity=".98" />
          </linearGradient>
          <radialGradient id="rfiFlShadow"><stop offset="0" stopColor="#000" stopOpacity=".5" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="16" cy="28.4" rx="9.6" ry="1.6" fill="url(#rfiFlShadow)" stroke="none" />
        {/* the right leg stays inside the lock, so the shackle visibly hangs on it while it is lifted */}
        <path d="M21 11v7" stroke="#000" strokeOpacity=".38" strokeWidth="3.8" />
        <path d="M21 11v7" stroke="#f4f6f8" strokeWidth="2.6" />
        <g className="rfi-fl-body">
          <rect x="7.5" y="14" width="17" height="13" rx="3.2" fill="url(#rfiFlBody)" stroke="#fff" strokeOpacity=".6" strokeWidth="1.1" />
          <rect x="9.2" y="15.7" width="13.6" height="9.6" rx="2.2" stroke="#fff" strokeOpacity=".2" strokeWidth=".8" />
          <path d="M10.6 15.1h10.8" stroke="#fff" strokeOpacity=".75" strokeWidth="1" />
          <g className="rfi-fl-key"><circle cx="16" cy="19.6" r="1.9" fill="#000" fillOpacity=".42" stroke="none" /><path d="M16 21.2v2.6" stroke="#000" strokeOpacity=".42" strokeWidth="1.8" /></g>
          <path className="rfi-fl-check" pathLength="1" d="m11.8 20.4 2.9 2.9 5.4-6" stroke="#000" strokeOpacity=".4" strokeWidth="4" />
          <path className="rfi-fl-check" pathLength="1" d="m11.8 20.4 2.9 2.9 5.4-6" stroke={GREEN} strokeWidth="2.5" />
        </g>
        <g className="rfi-fl-shackle">
          <path d="M11 14.4v-3.4a5 5 0 0 1 10 0v3.4" stroke="#000" strokeOpacity=".38" strokeWidth="3.8" />
          <path d="M11 14.4v-3.4a5 5 0 0 1 10 0v3.4" stroke="#f4f6f8" strokeWidth="2.6" />
          <path d="M10.3 13.6v-2.6a5.7 5.7 0 0 1 2.7-4.8" stroke="#fff" strokeOpacity=".95" strokeWidth=".8" />
        </g>
      </svg>
    </span>
  )
}
