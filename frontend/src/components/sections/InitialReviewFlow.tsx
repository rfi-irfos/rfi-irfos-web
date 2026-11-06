import { useId, useState } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { WEB3FORMS_KEY, beacon } from './shared'

type FormState = 'idle' | 'sending' | 'ok' | 'err' | 'invalid' | 'limited'

// Single-step form (2026-10-14, live direction: "why make it a two step
// process, lets make it as easy as possible") - site, work email and the
// consent checkbox all sit on one screen instead of splitting domain entry
// from email+consent across two steps. Same /api/initial-review contract,
// unchanged on the backend.
// `wide`: full-width band with the intro left and the form right, for the homepage block.
export function InitialReviewFlow({ variant, wide = false }: { variant: 'embedded' | 'modal'; wide?: boolean }) {
  const { t, locale } = useLocale()
  const c = t.initialReview
  const pre = locale === 'de' ? '/de' : ''
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [botcheck, setBotcheck] = useState('')
  const [state, setState] = useState<FormState>('idle')
  // Lighthouse round 33: labels tied to their inputs (screen readers, click-to-focus).
  const fid = useId()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent || state === 'sending') return
    // 2026-10-31 (Lighthouse round 20): a typo like "meinefirma" (no dot) came back as a
    // backend 400 and was shown as "something went wrong" plus a mail link, so people
    // read it as our failure. Same check as normalize_domain in review.rs, caught here.
    if (!domain.replace(/^https?:\/\//, '').split('/')[0].includes('.')) { setState('invalid'); beacon('free_check_invalid:' + variant); return }
    setState('sending')
    try {
      const res = await fetch('/api/initial-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, email, consent, botcheck, locale }),
      })
      setState(res.ok ? 'ok' : res.status === 400 ? 'invalid' : res.status === 429 ? 'limited' : 'err')
      // Lighthouse round 22: the DLT free check is the top of the paid funnel, but it was
      // the one conversion that never reached web_visits. No domain or email is sent.
      beacon((res.ok ? 'free_check_submitted:' : 'free_check_error:' + res.status + ':') + variant)
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
      beacon('free_check_error:network:' + variant)
    }
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: 18, padding: wide ? '24px 28px' : variant === 'embedded' ? '22px' : '24px', display: wide ? 'grid' : 'flex', flexDirection: 'column', gap: wide ? '18px 24px' : 14,
    gridTemplateColumns: wide ? 'minmax(0, 1.15fr) minmax(0, 1fr)' : undefined,
    maxWidth: variant === 'modal' ? 380 : undefined, height: variant === 'embedded' ? '100%' : undefined,
    boxSizing: 'border-box',
  }

  return (
    <div className="irf-card-glow" style={cardStyle}>
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={botcheck} onChange={e => setBotcheck(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

      <div style={{ display: 'flex', alignItems: wide ? 'center' : 'flex-start', justifyContent: 'space-between', gap: 10, gridColumn: wide ? '1 / -1' : undefined, paddingLeft: wide ? 15 : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: wide ? 14 : 10 }}>
          <span className="rfi-glass-icon" style={{ width: 44, height: 44, borderRadius: 12, color: '#4f9dff' }}>
            <svg width={28} height={28} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="6" width="24" height="20" rx="3" />
              <g stroke="var(--text)"><path d="M4 12h24" /><circle cx="16" cy="19" r="3.5" /><path d="M16 14v1.5M16 22.5V24M11 19h1.5M19.5 19H21" /></g>
            </svg>
          </span>
          <div style={{ fontWeight: 700, fontSize: 'var(--fs-lead)', color: 'var(--text)' }}>{c.introTitle}</div>
        </div>
        <span className="irf-badge-pulse" style={{ fontSize: 'var(--fs-small)', fontWeight: 700, color: 'var(--accent-text)', background: 'rgba(0,245,196,0.1)', padding: '6px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>{c.badge}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: wide ? 73 : undefined }}>
        {c.introText.slice(0, -1).map((para, i) => (
          <p key={i} style={{ fontSize: 'var(--fs-small)', fontWeight: 400, color: 'var(--text)', lineHeight: 'var(--lh-body)', margin: 0 }}>{para}</p>
        ))}
      </div>
      {!wide && <div style={{ borderTop: '1px solid var(--border)' }} />}

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: wide ? '1fr 1fr' : '1fr', gap: 12 }}>
        <div>
          <label htmlFor={`${fid}-domain`} style={{ fontSize: 'var(--fs-small)', color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{c.domainLabel}</label>
          <input id={`${fid}-domain`} name="domain" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} required placeholder={c.domainPlaceholder} value={domain}
            onChange={e => setDomain(e.target.value)}
            className="fx-input" style={{ width: '100%', borderRadius: 12, padding: '12px 16px', color: 'var(--text)', fontSize: 'var(--fs-body)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label htmlFor={`${fid}-email`} style={{ fontSize: 'var(--fs-small)', color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{c.emailLabel}</label>
          <input id={`${fid}-email`} name="email" autoComplete="email" type="email" required placeholder={c.emailPlaceholder} value={email}
            onChange={e => setEmail(e.target.value)}
            className="fx-input" style={{ width: '100%', borderRadius: 12, padding: '12px 16px', color: 'var(--text)', fontSize: 'var(--fs-body)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
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
        <button type="submit" className={state === 'ok' ? undefined : 'fx-cta'} disabled={state === 'sending' || !consent} style={{
          background: state === 'ok' ? 'rgba(0,245,196,0.2)' : undefined,
          color: state === 'ok' ? 'var(--accent-text)' : '#1a0f00',
          border: state === 'ok' ? '1px solid var(--accent-text)' : 'none',
          padding: '14px 20px', borderRadius: 12, fontWeight: 700, fontSize: 'var(--fs-body)',
          cursor: state === 'sending' ? 'wait' : !consent ? 'not-allowed' : 'pointer',
          opacity: !consent && state === 'idle' ? 0.78 : 1,
        }}>
          {state === 'sending' ? c.submitSending : state === 'ok' ? c.submitOk : c.submitCta}
        </button>
      </form>
    </div>
  )
}
