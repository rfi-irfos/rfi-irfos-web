import { useState } from 'react'
import { useLocale } from '../../hooks/useLocale'

const MONO = "'JetBrains Mono', monospace"

type FormState = 'idle' | 'sending' | 'ok' | 'err'

export function InitialReviewFlow({ variant }: { variant: 'embedded' | 'modal' }) {
  const { t } = useLocale()
  const c = t.initialReview
  const [step, setStep] = useState<1 | 2>(1)
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
    <div style={cardStyle}>
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={botcheck} onChange={e => setBotcheck(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

      <p style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', margin: 0 }}>
        {step === 1 ? c.step1Label : c.step2Label}
      </p>

      {step === 1 ? (
        <form onSubmit={e => { e.preventDefault(); if (domain.trim()) setStep(2) }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 12.5, color: 'var(--text2)' }}>{c.domainLabel}</label>
          <input type="text" required placeholder={c.domainPlaceholder} value={domain}
            onChange={e => setDomain(e.target.value)}
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          <button type="submit" style={{ background: '#f97316', color: '#1a0f00', padding: '12px 20px', borderRadius: 8, fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer' }}>
            {c.continueCta}
          </button>
        </form>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button type="button" onClick={() => setStep(1)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text3)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
            ← {c.backCta}
          </button>
          <div>
            <div style={{ fontSize: 10, fontFamily: MONO, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{c.domainLabel}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{domain}</div>
          </div>
          <input type="email" required placeholder={c.emailPlaceholder} value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
            <input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)}
              style={{ marginTop: 3, accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }} />
            <span style={{ color: 'var(--text2)', fontSize: 11.5, lineHeight: 1.6 }}>{c.consentLabel}</span>
          </label>
          <button type="submit" disabled={state === 'sending' || !consent} style={{
            background: state === 'ok' ? 'rgba(0,245,196,0.2)' : '#f97316',
            color: state === 'ok' ? 'var(--accent-text)' : '#1a0f00',
            border: state === 'ok' ? '1px solid var(--accent-text)' : 'none',
            padding: '13px 20px', borderRadius: 8, fontWeight: 800, fontSize: 13,
            cursor: state === 'sending' ? 'wait' : !consent ? 'not-allowed' : 'pointer',
            opacity: !consent && state === 'idle' ? 0.5 : 1,
          }}>
            {state === 'sending' ? c.submitSending : state === 'ok' ? c.submitOk : c.submitCta}
          </button>
          {state === 'err' && (
            <p style={{ color: 'var(--sev-crit)', fontSize: 12.5, lineHeight: 1.6 }}>
              {c.errorText}{' '}
              <a href={`mailto:contact@rfi-irfos.com?subject=${encodeURIComponent('Initial Review — ' + domain)}&body=${encodeURIComponent(`Domain: ${domain}\nEmail: ${email}`)}`} style={{ color: 'var(--accent-text)', fontWeight: 700 }}>
                {c.errorMailtoCta}
              </a>
            </p>
          )}
        </form>
      )}

      <p style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6, margin: 0 }}>{c.gateNote}</p>
      <p style={{ fontSize: 10.5, color: 'var(--text3)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>{c.scopeDisclaimer}</p>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 'auto' }}>
        <a href="#pricing" style={{ color: 'var(--accent-text)', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>{c.priceTeaser} →</a>
        <p style={{ fontSize: 10.5, color: 'var(--text3)', margin: '4px 0 0' }}>{c.priceSubline}</p>
      </div>
    </div>
  )
}
