// "Submit a tip" / contact section (`#submit`) - extracted verbatim from
// PublicSite.tsx. The consolidated contact/disclosure form's state and submit
// handler live at the page level (PublicSite.tsx) since the Lighthouse tracking
// pixel right below the form, and the abandonment beacon, both key off the same
// state - so this section receives it all as props.
import { FormStateIcon, TEAL, Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

// Emails/hrefs are locale-independent; labels come from t.submit.contactCards.
const CONTACT_CARDS = [
  { key: 'general' as const, value: 'contact@rfi-irfos.com', href: 'mailto:contact@rfi-irfos.com' },
  { key: 'security' as const, value: 'security@rfi-irfos.com', href: 'mailto:security@rfi-irfos.com' },
  { key: 'publicDisclosures' as const, value: 'rfi.irfos@gmail.com', href: 'mailto:rfi.irfos@gmail.com' },
  { key: 'research' as const, value: 'research@rfi-irfos.com', href: 'mailto:research@rfi-irfos.com' },
  { key: 'careers' as const, value: 'career@rfi-irfos.com', href: 'mailto:career@rfi-irfos.com' },
]

export type TipForm = {
  topic: string
  handle: string
  email: string
  target: string
  credit: string
  finding: string
  lawful: boolean
  botcheck: string
}

export function SubmitSection({
  mobile, tipForm, setTipForm, tipFormState, submitTip,
}: {
  mobile: boolean
  tipForm: TipForm
  setTipForm: (updater: (p: TipForm) => TipForm) => void
  tipFormState: 'idle' | 'sending' | 'ok' | 'err'
  submitTip: (e: React.FormEvent) => void
}) {
  const { t } = useLocale()
  return (
    <section id="submit" style={{ padding: '48px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>{t.submit.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}><ScrambleHeading text={t.submit.heading} /></h2>
          <p style={{ color: 'var(--text)', fontSize: 17, marginBottom: 40, maxWidth: 680, lineHeight: 1.8, textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            {t.submit.paragraph}
          </p>
        </Reveal>

        {/* Wrapped in one rounded panel (live feedback 2026-08-14: the form "floats
            too much in timespace" without a container of its own) - same
            glass-panel treatment the rest of the site's card surfaces use. */}
        <div style={{
          display: mobile ? 'block' : 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start',
          background: 'var(--glass-bg-solid)', border: '1px solid var(--border)', borderRadius: 20,
          padding: mobile ? '28px 22px' : '40px',
        }}>
          {/* left: quick contact channels first (general-purpose, what most
              visitors actually want), disclosure policy detail below it - live
              feedback: leading with the disclosure policy panel made the whole
              section read as a security-intake-only channel with no obvious
              "just email someone" option. */}
          <Reveal from="left">
            {/* both reassurance lines moved to sit together under the Careers
                card at the bottom of the list (live feedback 2026-08-14) instead
                of split - one above the cards, one below - across the whole
                block. --text3 -> --text on both, plus the card eyebrow labels
                below: same "proper font, black not grey" contrast fix already
                applied to the pricing tier body copy. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {CONTACT_CARDS.map(c => (
                <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer" className="rfi-hover-card rfi-glass-flat rfi-glass-solid" style={{
                  borderRadius: 12, padding: '14px 18px', textDecoration: 'none', display: 'block',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 5 }}>{t.submit.contactCards[c.key]}</div>
                  <div style={{ color: 'var(--accent-text)', fontWeight: 600, fontSize: 13 }}>{c.value}</div>
                </a>
              ))}
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text)', marginBottom: 10, lineHeight: 1.6 }}>
              {t.submit.notSurePrefix}<strong>{t.submit.notSureStrong}</strong>{t.submit.notSureSuffix}
            </p>
            {/* Full disclosure-handling policy (ISO/IEC 30111 triage, lawful
                basis, credit choice) moved to the Security Policy legal page
                (#p/security) - live feedback: this panel made the contact
                section feel cluttered/security-intake-only rather than one
                clean form. */}
            <p style={{ fontSize: 12, color: 'var(--text)', marginBottom: 20, lineHeight: 1.7 }}>
              {t.submit.disclosurePolicyPrefix}
              <a href="#p/security" style={{ color: 'var(--accent-text)' }}>{t.submit.disclosurePolicyLink}</a>{t.submit.disclosurePolicySuffix}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 0, lineHeight: 1.8 }}>
              {t.submit.address.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>
          </Reveal>

          {/* right: the one form */}
          <Reveal from="right">
            <form onSubmit={submitTip} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
                value={tipForm.botcheck} onChange={e => setTipForm(p => ({ ...p, botcheck: e.target.value }))}
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              <select value={tipForm.topic} onChange={e => setTipForm(p => ({ ...p, topic: e.target.value }))} aria-label={t.submit.form.topicAriaLabel} style={{
                background: 'var(--input-bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 16px', color: tipForm.topic ? 'var(--text)' : 'var(--text3)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}>
                <option value="">{t.submit.form.topicPlaceholder}</option>
                <option value="Security Disclosure">{t.submit.form.topicOptions.securityDisclosure}</option>
                <option value="Security Audit">{t.submit.form.topicOptions.securityAudit}</option>
                <option value="Send APK">{t.submit.form.topicOptions.sendApk}</option>
                <option value="Research Collaboration">{t.submit.form.topicOptions.researchCollaboration}</option>
                <option value="Web Development">{t.submit.form.topicOptions.webDevelopment}</option>
                <option value="Other">{t.submit.form.topicOptions.other}</option>
              </select>
              <input type="text" placeholder={t.submit.form.namePlaceholder}
                value={tipForm.handle} onChange={e => setTipForm(p => ({ ...p, handle: e.target.value }))}
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              <input type="email" required placeholder={t.submit.form.emailPlaceholder}
                value={tipForm.email} onChange={e => setTipForm(p => ({ ...p, email: e.target.value }))}
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              <input type="text" required placeholder={t.submit.form.targetPlaceholder}
                value={tipForm.target} onChange={e => setTipForm(p => ({ ...p, target: e.target.value }))}
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              <select value={tipForm.credit} onChange={e => setTipForm(p => ({ ...p, credit: e.target.value }))} aria-label={t.submit.form.creditAriaLabel} style={{
                background: 'var(--input-bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}>
                <option value="alias">{t.submit.form.creditOptions.alias}</option>
                <option value="anonymous">{t.submit.form.creditOptions.anonymous}</option>
                <option value="full-name">{t.submit.form.creditOptions.fullName}</option>
              </select>
              <textarea required placeholder={t.submit.form.findingPlaceholder}
                value={tipForm.finding} onChange={e => setTipForm(p => ({ ...p, finding: e.target.value }))}
                rows={6} style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" required checked={tipForm.lawful}
                  onChange={e => setTipForm(p => ({ ...p, lawful: e.target.checked }))}
                  style={{ marginTop: 3, accentColor: TEAL, width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.6 }}>
                  {t.submit.form.lawfulLabel}
                </span>
              </label>
              <button type="submit" disabled={tipFormState === 'sending' || !tipForm.lawful} style={{
                background: tipFormState === 'ok' ? 'rgba(0,245,196,0.2)' : TEAL,
                color: tipFormState === 'ok' ? TEAL : '#070711',
                border: tipFormState === 'ok' ? `1px solid ${TEAL}` : 'none',
                padding: '13px 24px', borderRadius: 8, fontWeight: 800, fontSize: 14,
                cursor: tipFormState === 'sending' ? 'wait' : !tipForm.lawful ? 'not-allowed' : 'pointer',
                opacity: !tipForm.lawful && tipFormState === 'idle' ? 0.5 : 1, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              }}>
                <FormStateIcon state={tipFormState} />
                {tipFormState === 'sending' ? t.submit.form.submitSending : tipFormState === 'ok' ? t.submit.form.submitOk : t.submit.form.submitIdle}
              </button>
              {/* A failed send must still convert. The old error was unclickable 12px text,
                  so a visitor whose submission failed simply left. This hands them a
                  one-tap mailto with everything they already typed carried across, which
                  also means the page is safe to ship before the CRM relay key is set:
                  worst case the lead arrives by email instead of in the CRM, never nowhere. */}
              {tipFormState === 'err' && (
                <p style={{ color: 'var(--sev-crit)', fontSize: 13, lineHeight: 1.6 }}>
                  {t.submit.form.errorText}{' '}
                  <a
                    href={`mailto:contact@rfi-irfos.com?subject=${encodeURIComponent(
                      `[rfi-irfos.com] ${tipForm.topic || 'Enquiry'}${tipForm.target ? ' - ' + tipForm.target : ''}`
                    )}&body=${encodeURIComponent(
                      [
                        tipForm.handle ? `From: ${tipForm.handle}` : '',
                        tipForm.email ? `Email: ${tipForm.email}` : '',
                        tipForm.target ? `Target: ${tipForm.target}` : '',
                        '',
                        tipForm.finding,
                      ].filter(Boolean).join('\n')
                    )}`}
                    style={{ color: 'var(--accent-text)', fontWeight: 700 }}
                  >
                    {t.submit.form.errorMailtoCta}
                  </a>
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
