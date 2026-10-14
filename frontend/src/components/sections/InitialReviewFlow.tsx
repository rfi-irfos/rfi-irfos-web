import { useState } from 'react'
import { useLocale } from '../../hooks/useLocale'

type FormState = 'idle' | 'sending' | 'ok' | 'err'

// Single-step form (2026-10-14, live direction: "why make it a two step
// process, lets make it as easy as possible") - site, work email and the
// consent checkbox all sit on one screen instead of splitting domain entry
// from email+consent across two steps. Same /api/initial-review contract,
// unchanged on the backend.
export function InitialReviewFlow({ variant }: { variant: 'embedded' | 'modal' }) {
  const { t } = useLocale()
  const c = t.initialReview
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [botcheck, setBotcheck] = useState('')
  const [state, setState] = useState<FormState>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent || state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/initial-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, email, consent, botcheck }),
      })
      setState(res.ok ? 'ok' : 'err')
    } catch {
      setState('err')
    }
  }

  const cardStyle: React.CSSProperties = {
    border: '1px solid var(--border)', borderRadius: 16, padding: variant === 'embedded' ? '20px' : '24px',
    background: 'var(--glass-bg-solid)', display: 'flex', flexDirection: 'column', gap: 14,
    maxWidth: variant === 'modal' ? 380 : undefined, height: variant === 'embedded' ? '100%' : undefined,
    boxSizing: 'border-box',
  }

  return (
    <div className="irf-card-glow" style={cardStyle}>
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={botcheck} onChange={e => setBotcheck(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,245,196,0.12)', color: 'var(--accent-text)', flexShrink: 0 }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            </svg>
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--text)' }}>{c.introTitle}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{c.introSubtitle}</div>
          </div>
        </div>
        <span className="irf-badge-pulse" style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--accent-text)', background: 'rgba(0,245,196,0.1)', padding: '5px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>{c.badge}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {c.introText.map((para, i) => (
          <p key={i} style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.55, margin: 0 }}>{para}</p>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border)' }} />

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div>
          <label style={{ fontSize: 12.5, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{c.domainLabel}</label>
          <input type="text" required placeholder={c.domainPlaceholder} value={domain}
            onChange={e => setDomain(e.target.value)}
            style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: 12.5, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{c.emailLabel}</label>
          <input type="email" required placeholder={c.emailPlaceholder} value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)}
            style={{ marginTop: 3, accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ color: 'var(--text2)', fontSize: 11.5, lineHeight: 1.6 }}>{c.consentLabel}</span>
        </label>
        {state === 'err' && (
          <p style={{ color: 'var(--sev-crit)', fontSize: 12.5, lineHeight: 1.6 }}>
            {c.errorText}{' '}
            <a href={`mailto:contact@rfi-irfos.com?subject=${encodeURIComponent('Initial Review — ' + domain)}&body=${encodeURIComponent(`Domain: ${domain}\nEmail: ${email}`)}`} style={{ color: 'var(--accent-text)', fontWeight: 700 }}>
              {c.errorMailtoCta}
            </a>
          </p>
        )}
        <button type="submit" disabled={state === 'sending' || !consent} style={{
          background: state === 'ok' ? 'rgba(0,245,196,0.2)' : '#f97316',
          color: state === 'ok' ? 'var(--accent-text)' : '#1a0f00',
          border: state === 'ok' ? '1px solid var(--accent-text)' : 'none',
          padding: '13px 20px', borderRadius: 8, fontWeight: 800, fontSize: 13,
          cursor: state === 'sending' ? 'wait' : !consent ? 'not-allowed' : 'pointer',
          opacity: !consent && state === 'idle' ? 0.5 : 1,
          marginTop: 'auto',
        }}>
          {state === 'sending' ? c.submitSending : state === 'ok' ? c.submitOk : c.submitCta}
        </button>
      </form>
    </div>
  )
}
