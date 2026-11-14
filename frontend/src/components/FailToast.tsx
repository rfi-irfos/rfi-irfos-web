import { useLocale } from '../hooks/useLocale'

// Failure toast for the lead funnel (Simeon 14.11.2026: "eig sollt n toast kommen auf der seite
// wenns nich geht"). The website is our only lead channel, so a failed Quick Check or checkout
// always hands the visitor two working ways to reach us: the contact form and a prefilled mail.
export function FailToast({ message, mailSubject, mailBody, onClose }: {
  message: string; mailSubject: string; mailBody: string; onClose: () => void
}) {
  const { t, locale } = useLocale()
  const a = t.alerts
  const link: React.CSSProperties = { color: 'var(--accent-text)', fontWeight: 700, whiteSpace: 'nowrap' }
  return (
    <div role="alert" style={{
      position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 1000,
      width: 'min(520px, calc(100vw - 32px))', boxSizing: 'border-box', padding: '16px 44px 16px 18px', borderRadius: 14,
      background: 'var(--bg, #0b0b10)', color: 'var(--text)', border: '1px solid var(--sev-crit)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.45)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)',
    }}>
      <p style={{ margin: '0 0 10px' }}>{message}</p>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <a href={`${locale === 'de' ? '/de' : ''}/#submit`} onClick={onClose} style={link}>{a.contactCta} →</a>
        <a href={`mailto:contact@rfi-irfos.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`} style={link}>{a.mailCta} →</a>
      </div>
      <button type="button" onClick={onClose} aria-label={a.close} style={{
        position: 'absolute', top: 8, right: 8, width: 30, height: 30, border: 'none', borderRadius: 8,
        background: 'transparent', color: 'var(--text2)', fontSize: 20, lineHeight: 1, cursor: 'pointer',
      }}>×</button>
    </div>
  )
}
