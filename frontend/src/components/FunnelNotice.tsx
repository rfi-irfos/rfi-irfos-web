import { useState } from 'react'
import { useLocale } from '../hooks/useLocale'
import { localeHref } from '../lib/localeHref'

type Link = { href: string; label: string }

// Bottom-centre notice for the funnel's edge cases (2026-10-31, Lighthouse rounds 19
// and 21): a dead link, and the return from Stripe Checkout. Both keep the visitor
// moving instead of dropping them on a page that says nothing about what just happened.
export function FunnelNotice({ title, links }: { title: string; links: Link[] }) {
  const { locale } = useLocale()
  const [open, setOpen] = useState(true)
  if (!open) return null
  return (
    <div role="status" style={{
      position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 60,
      width: 'min(560px, calc(100vw - 32px))', boxSizing: 'border-box',
      background: 'var(--glass-bg-solid)', border: '1px solid var(--border)', borderRadius: 14,
      padding: '14px 44px 14px 18px', boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
    }}>
      <p style={{ margin: links.length ? '0 0 8px' : 0, color: 'var(--text)', fontWeight: 700, fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)' }}>{title}</p>
      {links.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
          {links.map(l => (
            <a key={l.href} href={l.href} style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: 'var(--fs-small)', textDecoration: 'none' }}>{l.label} →</a>
          ))}
        </div>
      )}
      <button type="button" onClick={() => setOpen(false)} aria-label={locale === 'de' ? 'Schließen' : 'Close'} style={{
        position: 'absolute', top: 8, right: 10, background: 'none', border: 'none',
        color: 'var(--text)', fontSize: 20, lineHeight: 1, cursor: 'pointer', padding: 4,
      }}>×</button>
    </div>
  )
}

// Shown only when the backend served its not-found fallback (SERVED_NOT_FOUND in App.tsx).
export function NotFoundNotice() {
  const { locale } = useLocale()
  const de = locale === 'de'
  return <FunnelNotice
    title={de ? 'Dieser Link führt ins Leere. Weiter geht es hier:' : 'This link leads nowhere. Here is where to go next:'}
    links={[
      { href: localeHref('/evidence/', locale), label: de ? 'Veröffentlichte Reports' : 'Published reports' },
      { href: `${localeHref('/', locale)}#domain-check`, label: de ? 'Gratis-Check' : 'Free check' },
      { href: localeHref('/access/', locale), label: de ? 'Umfang und Preise' : 'Scope and pricing' },
    ]} />
}

// Return from Stripe Checkout (?checkout=success|cancelled, set in backend/src/stripe.rs).
// Read once at module load, then stripped from the URL so a reload or a shared link
// does not show it again.
const CHECKOUT_RETURN = (() => {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('checkout')
  if (v !== 'success' && v !== 'cancelled') return null
  const url = new URL(window.location.href)
  url.searchParams.delete('checkout')
  window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  return v
})()

export function CheckoutReturnNotice() {
  const { locale } = useLocale()
  if (!CHECKOUT_RETURN) return null
  const de = locale === 'de'
  if (CHECKOUT_RETURN === 'success') return <FunnelNotice
    title={de
      ? 'Zahlung erhalten, danke. Die Quittung kommt von Stripe per E-Mail. Wir melden uns an dieselbe Adresse, um den Start abzustimmen.'
      : 'Payment received, thank you. Stripe emails your receipt. We will contact you at the same address to schedule the start.'}
    links={[]} />
  return <FunnelNotice
    title={de ? 'Der Checkout wurde abgebrochen, es wurde nichts berechnet. Offene Fragen klären wir gern vorab:' : 'Checkout cancelled, nothing was charged. Happy to answer questions first:'}
    links={[
      { href: 'mailto:contact@rfi-irfos.com', label: de ? 'Schreiben Sie uns' : 'Email us' },
      { href: `${localeHref('/', locale)}#domain-check`, label: de ? 'Erst den Gratis-Check' : 'Start with the free check' },
    ]} />
}
