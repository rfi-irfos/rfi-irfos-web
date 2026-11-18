// Request pop-up for the Managed SOC band (Simeon 18.11.2026): the visitor fills in the enquiry on the spot instead of being
// scrolled down to the contact form. It uses the page's own form state and submit handler (PublicSite.tsx), so the CRM relay,
// the Web3Forms fallback, the honeypot and the lead beacon are the same as for the contact form below.
import { useEffect, useRef } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { FormStateIcon, TEAL } from './shared'
import { Field, INPUT, type TipForm } from './Submit'

export function ManagedSocModal({ tipForm, setTipForm, tipFormState, submitTip, onClose, title, sub, testId = 'managed-soc-modal' }: {
  title?: string
  sub?: string
  testId?: string
  tipForm: TipForm
  setTipForm: (updater: (p: TipForm) => TipForm) => void
  tipFormState: 'idle' | 'sending' | 'ok' | 'err'
  submitTip: (e: React.FormEvent) => void
  onClose: () => void
}) {
  const { t } = useLocale()
  const f = t.submit.form
  const m = t.pricing.managedSoc
  const firstRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow }
  }, [onClose])

  // Once the request is sent the pop-up closes itself after a moment, long enough to read the confirmation on the button.
  useEffect(() => {
    if (tipFormState !== 'ok') return
    const id = window.setTimeout(onClose, 2200)
    return () => window.clearTimeout(id)
  }, [tipFormState, onClose])

  return (
    <div className="rfi-req-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }} data-testid={testId}>
      <div className="rfi-req-panel fx-panel" role="dialog" aria-modal="true" aria-labelledby="managed-soc-modal-title">
        <button type="button" className="rfi-req-close" onClick={onClose} aria-label={t.login.close} title={t.login.close}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 id="managed-soc-modal-title" style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)', margin: sub ? '0 0 6px' : '0 0 22px', lineHeight: 1.15, color: 'var(--text)' }}>{title ?? m.cta}</h2>
        {sub && <p style={{ margin: '0 0 22px', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', color: 'var(--text2)' }}>{sub}</p>}
        <form onSubmit={submitTip} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
            value={tipForm.botcheck} onChange={e => setTipForm(p => ({ ...p, botcheck: e.target.value }))}
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
          <Field label={f.nameLabel} hint={f.optional}>
            <input ref={firstRef} type="text" autoComplete="name" placeholder={f.namePlaceholder}
              value={tipForm.handle} onChange={e => setTipForm(p => ({ ...p, handle: e.target.value }))} className="fx-input" style={INPUT} />
          </Field>
          <Field label={f.emailLabel}>
            <input type="email" autoComplete="email" required placeholder={f.emailPlaceholder}
              value={tipForm.email} onChange={e => setTipForm(p => ({ ...p, email: e.target.value }))} className="fx-input" style={INPUT} />
          </Field>
          <Field label={f.messageLabel}>
            <textarea required placeholder={f.messagePlaceholder} rows={4}
              value={tipForm.finding} onChange={e => setTipForm(p => ({ ...p, finding: e.target.value }))} className="fx-input" style={{ ...INPUT, resize: 'vertical' }} />
          </Field>
          <button type="submit" className={tipFormState === 'ok' ? undefined : 'fx-cta-teal'} disabled={tipFormState === 'sending'} style={{
            background: tipFormState === 'ok' ? 'rgba(0,245,196,0.2)' : undefined,
            color: tipFormState === 'ok' ? TEAL : '#070711',
            border: tipFormState === 'ok' ? `1px solid ${TEAL}` : 'none',
            padding: '14px 24px', borderRadius: 12, fontWeight: 700, fontSize: 'var(--fs-body)', fontFamily: 'inherit',
            cursor: tipFormState === 'sending' ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
          }}>
            <FormStateIcon state={tipFormState} />
            {tipFormState === 'sending' ? f.submitSending : tipFormState === 'ok' ? f.submitOk : f.submitIdle}
          </button>
          {tipFormState === 'err' && (
            <p style={{ margin: 0, color: 'var(--sev-crit)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)' }}>
              {f.errorText}{' '}
              <a href={`mailto:contact@rfi-irfos.com?subject=${encodeURIComponent('[rfi-irfos.com] Managed SOC')}&body=${encodeURIComponent([tipForm.handle ? `From: ${tipForm.handle}` : '', tipForm.email ? `Email: ${tipForm.email}` : '', '', tipForm.finding].filter(Boolean).join('\n'))}`}
                style={{ color: 'var(--accent-text)', fontWeight: 700 }}>{f.errorMailtoCta}</a>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
