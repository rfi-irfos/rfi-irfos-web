import { useId, useState } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { WEB3FORMS_KEY, beacon } from './shared'
import { FailToast } from '../FailToast'

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
  const [toast, setToast] = useState(false)
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
    setToast(false)
    // Browser-side Web3Forms: a second inbox path next to the server's Brevo mail.
    const mailUs = () => WEB3FORMS_KEY ? fetch('https://api.web3forms.com/submit', {
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
    }).then(r => r.ok, () => false) : Promise.resolve(false)
    // Server down or network gone (14.11.2026, "das muss klappen"): the request still reaches
    // our inbox through Web3Forms; only when that fails too the visitor sees the toast.
    const failed = async (why: string) => {
      beacon('free_check_error:' + why + ':' + variant)
      if (await mailUs()) { setState('ok'); beacon('free_check_submitted_fallback:' + variant); return }
      setState('err')
      setToast(true)
    }
    try {
      const res = await fetch('/api/initial-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, email, consent, botcheck, locale }),
      })
      if (res.status === 400) { setState('invalid'); beacon('free_check_error:400:' + variant); return }
      // Rate limit: the request still reaches our inbox through the browser path (14.11.2026).
      if (res.status === 429) { await failed('429'); return }
      if (!res.ok) { await failed(String(res.status)); return }
      setState('ok')
      // Lighthouse round 22: the DLT free check is the top of the paid funnel, but it was
      // the one conversion that never reached web_visits. No domain or email is sent.
      beacon('free_check_submitted:' + variant)
      void mailUs()
    } catch {
      await failed('network')
    }
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: 18, padding: wide ? '20px 24px' : variant === 'embedded' ? '22px' : '24px', display: wide ? 'grid' : 'flex', flexDirection: 'column', gap: wide ? '28px 24px' : 14,
    // Same tracks and gap as the process card above (0.9fr / 1fr, 24 px), so the divider sits on the same vertical line (Simeon 11.11.)
    gridTemplateColumns: wide ? 'minmax(0, 0.9fr) minmax(0, 1fr)' : undefined,
    maxWidth: variant === 'modal' ? 380 : undefined, height: variant === 'embedded' ? '100%' : undefined,
    boxSizing: 'border-box',
  }

  const badge = (
    <span className="irf-badge-pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: wide ? 'auto' : undefined, fontSize: wide ? 15 : 'var(--fs-small)', fontWeight: 700, color: 'var(--accent-text)', background: 'rgba(0,245,196,0.1)', padding: wide ? '8px 17px' : '6px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>
      {wide && <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>}
      {c.badge}
    </span>
  )
  const labelStyle: React.CSSProperties = { fontSize: wide ? 14 : 'var(--fs-small)', fontWeight: wide ? 600 : undefined, color: wide ? 'var(--text)' : 'var(--text2)', display: wide ? 'flex' : 'block', alignItems: 'center', gap: 8, marginBottom: wide ? 0 : 6, ...(wide ? { position: 'absolute' as const, left: 16, top: 0, bottom: 0, width: 18, overflow: 'hidden', whiteSpace: 'nowrap' as const, pointerEvents: 'none' as const, color: 'var(--text2)' } : {}) }
  // Landing card (wide): only the icon sits inside the box, the label text is the placeholder and disappears while typing (Simeon 11.11.); the label stays in the DOM, clipped, for screen readers. Narrow card keeps them stacked above.
  const fieldRow: React.CSSProperties = wide ? { position: 'relative' } : {}
  const labelIcon = (d: string) => wide && (
    <svg width={18} height={18} style={{ flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
  )

  return (
    <div className={wide ? 'irf-card-glow irf-dlt-band' : 'irf-card-glow'} style={cardStyle}>
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={botcheck} onChange={e => setBotcheck(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

      {/* `display: contents` keeps the stacked card flat; wide groups the intro into its own column. */}
      <div style={wide ? { display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 15, position: 'relative' } : { display: 'contents' }}>
        <div style={{ display: 'flex', alignItems: wide ? 'center' : 'flex-start', justifyContent: wide ? 'flex-start' : 'space-between', gap: wide ? 16 : 10, flexWrap: wide ? 'wrap' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: wide ? 14 : 10 }}>
            <span className="rfi-glass-icon" style={{ width: wide ? 50 : 44, height: wide ? 50 : 44, borderRadius: wide ? 14 : 12, color: 'var(--accent-text)', flexShrink: 0 }}>
              <svg width={wide ? 32 : 28} height={wide ? 32 : 28} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 25H6.5A2.5 2.5 0 0 1 4 22.5v-15A2.5 2.5 0 0 1 6.5 5h19A2.5 2.5 0 0 1 28 7.500V13M4 11h24" />
                <path d="M21 14.500l6 2v4.500c0 3.600-2.500 6-6 7.500-3.500-1.500-6-3.900-6-7.500v-4.500z" />
                <path d="M18.500 21l1.800 1.800 3.200-3.400" />
              </svg>
            </span>
            <div className={wide ? 'irf-dlt-title' : undefined} style={{ fontWeight: 700, fontSize: wide ? 23 : 'var(--fs-lead)', lineHeight: 1.15, color: 'var(--text)' }}>{c.introTitle}</div>
          </div>
          {badge}
        </div>
        {wide ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginTop: 14 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', lineHeight: 1.35, margin: 0 }}>{c.introText[0]}</p>
            <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--text)', lineHeight: 'var(--lh-body)', margin: 0 }}>{c.introText[2]}</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 'var(--lh-body)', margin: 0 }}>{c.introText[1]}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {c.introText.slice(0, -1).map((para, i) => (
              <p key={i} style={{ fontSize: 'var(--fs-small)', fontWeight: 400, color: 'var(--text)', lineHeight: 'var(--lh-body)', margin: 0 }}>{para}</p>
            ))}
          </div>
        )}
        {wide && <div aria-hidden style={{ position: 'absolute', top: '8%', bottom: '8%', right: -14, width: 1, background: 'linear-gradient(transparent, var(--accent-text), transparent)', opacity: 0.45 }} />}
      </div>
      {!wide && <div style={{ borderTop: '1px solid var(--border)' }} />}

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, ...(wide ? { padding: '14px 18px', borderRadius: 14, gap: 10, border: '1px solid color-mix(in srgb, var(--accent-text) 38%, transparent)', background: 'color-mix(in srgb, var(--accent-text) 6%, transparent)' } : {}) }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: wide ? 10 : 12 }}>
        <div style={fieldRow}>
          <label htmlFor={`${fid}-domain`} style={labelStyle}>{labelIcon('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.500 2.500 3.800 5.500 3.800 9s-1.300 6.500-3.800 9c-2.500-2.500-3.800-5.500-3.800-9S9.500 5.500 12 3z')}{c.domainLabel}</label>
          <input id={`${fid}-domain`} name="domain" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} required placeholder={wide ? c.domainLabel : c.domainPlaceholder} value={domain}
            onChange={e => setDomain(e.target.value)}
            className="fx-input" style={{ width: '100%', minWidth: 0, borderRadius: 12, padding: wide ? '13px 16px 13px 46px' : '12px 16px', color: 'var(--text)', fontSize: wide ? 15 : 'var(--fs-body)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div style={fieldRow}>
          <label htmlFor={`${fid}-email`} style={labelStyle}>{labelIcon('M3 6h18v12H3zM3 7l9 6 9-6')}{c.emailLabel}</label>
          <input id={`${fid}-email`} name="email" autoComplete="email" type="email" required placeholder={wide ? c.emailLabel : c.emailPlaceholder} value={email}
            onChange={e => setEmail(e.target.value)}
            className="fx-input" style={{ width: '100%', minWidth: 0, borderRadius: 12, padding: wide ? '13px 16px 13px 46px' : '12px 16px', color: 'var(--text)', fontSize: wide ? 15 : 'var(--fs-body)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
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
          color: state === 'ok' ? 'var(--accent-text)' : '#fff',
          border: state === 'ok' ? '1px solid var(--accent-text)' : 'none',
          padding: wide ? '11px 18px' : '14px 20px', borderRadius: 12, fontWeight: 700, fontSize: wide ? 15 : 'var(--fs-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: state === 'sending' ? 'wait' : !consent ? 'not-allowed' : 'pointer',
          opacity: !consent && state === 'idle' ? 0.78 : 1,
        }}>
          {state === 'sending' ? c.submitSending : state === 'ok' ? c.submitOk : c.submitCta}{wide && state === 'idle' && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          )}
        </button>
      </form>
      {toast && <FailToast message={t.alerts.sendFailed} mailSubject={`Quick Check: ${domain}`}
        mailBody={`Domain: ${domain}\nEmail: ${email}`} onClose={() => setToast(false)} />}
    </div>
  )
}
