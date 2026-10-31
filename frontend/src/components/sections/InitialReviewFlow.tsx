import { useState } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { WEB3FORMS_KEY } from './shared'

type FormState = 'idle' | 'sending' | 'ok' | 'err' | 'invalid' | 'limited'

// Single-step form (2026-10-14, live direction: "why make it a two step
// process, lets make it as easy as possible") - site, work email and the
// consent checkbox all sit on one screen instead of splitting domain entry
// from email+consent across two steps. Same /api/initial-review contract,
// unchanged on the backend.
export function InitialReviewFlow({ variant }: { variant: 'embedded' | 'modal' }) {
  const { t, locale } = useLocale()
  const c = t.initialReview
  const pre = locale === 'de' ? '/de' : ''
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [botcheck, setBotcheck] = useState('')
  const [state, setState] = useState<FormState>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent || state === 'sending') return
    // 2026-10-31 (Lighthouse round 20): a typo like "meinefirma" (no dot) came back as a
    // backend 400 and was shown as "something went wrong" plus a mail link, so people
    // read it as our failure. Same check as normalize_domain in review.rs, caught here.
    if (!domain.replace(/^https?:\/\//, '').split('/')[0].includes('.')) { setState('invalid'); return }
    setState('sending')
    try {
      const res = await fetch('/api/initial-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, email, consent, botcheck }),
      })
      setState(res.ok ? 'ok' : res.status === 400 ? 'invalid' : res.status === 429 ? 'limited' : 'err')
      // The backend already persists the request and pings ntfy regardless of this
      // call, but Web3Forms' free tier rejects the equivalent server-to-server send
      // outright ("Pro plan required" - see notify.rs) - this client-side call is the
      // only path that actually reaches an inbox. Fire-and-forget: a failure here
      // never blocks the visitor's already-saved submission (live feedback
      // 2026-10-14: "ich hab ne ntfy bekommen, aber keine email").
      if (res.ok && WEB3FORMS_KEY) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `[rfi-irfos.com] New initial review request — ${domain}`,
            name: 'Initial review request',
            email,
            replyto: email,
            message: `domain=${domain}\nemail=${email}`,
          }),
        }).catch(() => {})
      }
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
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-lead)', color: 'var(--text)' }}>{c.introTitle}</div>
        </div>
        <span className="irf-badge-pulse" style={{ fontSize: 'var(--fs-small)', fontWeight: 700, color: 'var(--accent-text)', background: 'rgba(0,245,196,0.1)', padding: '6px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>{c.badge}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {c.introText.slice(0, -1).map((para, i) => (
          <p key={i} style={{ fontSize: 'var(--fs-small)', fontWeight: 400, color: '#ffffff', lineHeight: 'var(--lh-body)', margin: 0 }}>{para}</p>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border)' }} />

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div>
          <label style={{ fontSize: 'var(--fs-small)', color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{c.domainLabel}</label>
          <input type="text" required placeholder={c.domainPlaceholder} value={domain}
            onChange={e => setDomain(e.target.value)}
            style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 'var(--fs-body)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: 'var(--fs-small)', color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{c.emailLabel}</label>
          <input type="email" required placeholder={c.emailPlaceholder} value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 'var(--fs-body)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)}
            style={{ marginTop: 3, accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ color: 'var(--text2)', fontSize: 'var(--fs-label)', lineHeight: 'var(--lh-body)' }}>
            {c.consentLabel} {c.introText[c.introText.length - 1]}
          </span>
        </label>
        {state === 'ok' && (
          // 2026-10-31: the success state used to only relabel the button, a dead end
          // right at the warmest moment of the DLT funnel. Next step + pricing.
          <p style={{ color: 'var(--text)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)' }}>
            {c.okNext}{' '}
            <a href={`${pre}/access/`} style={{ color: 'var(--accent-text)', fontWeight: 700 }}>{c.okPricing}</a>{' '}
            <a href={`${pre}/evidence/`} style={{ color: 'var(--accent-text)', fontWeight: 700 }}>{c.okReports}</a>
          </p>
        )}
        {state === 'invalid' && (
          <p role="alert" style={{ color: 'var(--sev-crit)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)' }}>{c.errorInvalid}</p>
        )}
        {(state === 'err' || state === 'limited') && (
          <p role="alert" style={{ color: 'var(--sev-crit)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)' }}>
            {state === 'limited' ? c.errorLimited : c.errorText}{' '}
            <a href={`mailto:contact@rfi-irfos.com?subject=${encodeURIComponent('Initial Review — ' + domain)}&body=${encodeURIComponent(`Domain: ${domain}\nEmail: ${email}`)}`} style={{ color: 'var(--accent-text)', fontWeight: 700 }}>
              {c.errorMailtoCta}
            </a>
          </p>
        )}
        <button type="submit" disabled={state === 'sending' || !consent} style={{
          background: state === 'ok' ? 'rgba(0,245,196,0.2)' : '#f97316',
          color: state === 'ok' ? 'var(--accent-text)' : '#1a0f00',
          border: state === 'ok' ? '1px solid var(--accent-text)' : 'none',
          padding: '13px 20px', borderRadius: 8, fontWeight: 700, fontSize: 'var(--fs-small)',
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
