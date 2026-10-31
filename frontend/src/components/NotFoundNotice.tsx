import { useState } from 'react'
import { useLocale } from '../hooks/useLocale'
import { localeHref } from '../lib/localeHref'

// Shown only when the backend served its not-found fallback (see SERVED_NOT_FOUND in
// App.tsx). Keeps the dead-link visitor in the funnel: reports, free check, pricing.
export function NotFoundNotice() {
  const { locale } = useLocale()
  const [open, setOpen] = useState(true)
  if (!open) return null
  const de = locale === 'de'
  const links = [
    { href: localeHref('/evidence/', locale), label: de ? 'Veröffentlichte Reports' : 'Published reports' },
    { href: `${localeHref('/', locale)}#domain-check`, label: de ? 'Gratis-Check' : 'Free check' },
    { href: localeHref('/access/', locale), label: de ? 'Umfang und Preise' : 'Scope and pricing' },
  ]
  return (
    <div role="status" style={{
      position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 60,
      width: 'min(560px, calc(100vw - 32px))', boxSizing: 'border-box',
      background: 'var(--glass-bg-solid)', border: '1px solid var(--border)', borderRadius: 14,
      padding: '14px 44px 14px 18px', boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
    }}>
      <p style={{ margin: '0 0 8px', color: 'var(--text)', fontWeight: 700, fontSize: 'var(--fs-small)' }}>
        {de ? 'Dieser Link führt ins Leere. Weiter geht es hier:' : 'This link leads nowhere. Here is where to go next:'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
        {links.map(l => (
          <a key={l.href} href={l.href} style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: 'var(--fs-small)', textDecoration: 'none' }}>{l.label} →</a>
        ))}
      </div>
      <button type="button" onClick={() => setOpen(false)} aria-label={de ? 'Schließen' : 'Close'} style={{
        position: 'absolute', top: 8, right: 10, background: 'none', border: 'none',
        color: 'var(--text)', fontSize: 20, lineHeight: 1, cursor: 'pointer', padding: 4,
      }}>×</button>
    </div>
  )
}
