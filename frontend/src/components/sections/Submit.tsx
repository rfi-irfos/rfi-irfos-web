// "Submit a tip" / contact section (`#submit`) - extracted verbatim from
// PublicSite.tsx. The consolidated contact/disclosure form's state and submit
// handler live at the page level (PublicSite.tsx) since the Lighthouse tracking
// pixel right below the form, and the abandonment beacon, both key off the same
// state - so this section receives it all as props.
import { FormStateIcon, TEAL, Reveal, Select } from './shared'
import { useLocale } from '../../hooks/useLocale'
import { localeHref } from '../../lib/localeHref'
import { TopicLinks } from './TopicLinks'

// Emails/hrefs are locale-independent; labels come from t.submit.contactCards.
const CONTACT_CARDS = [
  { key: 'general' as const, value: 'contact@rfi-irfos.com', href: 'mailto:contact@rfi-irfos.com' },
  { key: 'security' as const, value: 'security@rfi-irfos.com', href: 'mailto:security@rfi-irfos.com' },
  { key: 'publicDisclosures' as const, value: 'disclosure@rfi-irfos.com', href: 'mailto:disclosure@rfi-irfos.com' },
  { key: 'research' as const, value: 'research@rfi-irfos.com', href: 'mailto:research@rfi-irfos.com' },
  { key: 'careers' as const, value: 'career@rfi-irfos.com', href: 'mailto:career@rfi-irfos.com' },
]

const INPUT: React.CSSProperties = { width: '100%', boxSizing: 'border-box', borderRadius: 12, padding: '12px 16px', color: 'var(--text)', fontSize: 'var(--fs-body)', outline: 'none', fontFamily: 'inherit' }

// `plain` renders a div: a <label> around the custom Select would forward option clicks to its button.
function Field({ label, hint, plain, children }: { label: string; hint?: string; plain?: boolean; children: React.ReactNode }) {
  const Tag = plain ? 'div' : 'label'
  return (
    <Tag style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
      <span style={{ fontSize: 'var(--fs-label)', fontWeight: 600, color: 'var(--text)' }}>
        {label}{hint && <span style={{ fontWeight: 400, color: 'var(--text2)' }}> · {hint}</span>}
      </span>
      {children}
    </Tag>
  )
}

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
  const { t, locale } = useLocale()
  const f = t.submit.form
  const disclosure = tipForm.topic === 'Security Disclosure'
  const blocked = disclosure && !tipForm.lawful
  return (
    <section id="submit" style={{ padding: '48px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p className="rfi-eyebrow" style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', marginBottom: 12, textAlign: 'center' }}>{t.submit.eyebrow}</p>
          <h2 className="rfi-section-h2" style={{ marginBottom: 12, textAlign: 'center' }}>{t.submit.heading}</h2>
          <p style={{ color: 'var(--text)', fontSize: 'var(--fs-lead)', marginBottom: 40, maxWidth: 680, lineHeight: 'var(--lh-body)', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            {t.submit.paragraph}
          </p>
        </Reveal>

        {/* Wrapped in one rounded panel (live feedback 2026-08-14: the form "floats
            too much in timespace" without a container of its own) - same
            glass-panel treatment the rest of the site's card surfaces use. */}
        <div className="fx-panel" style={{
          display: mobile ? 'block' : 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start',
          borderRadius: 20,
          padding: mobile ? '28px 22px' : '40px',
        }}>
          {/* left: quick contact channels first (general-purpose, what most
              visitors actually want), disclosure policy detail below it - live
              feedback: leading with the disclosure policy panel made the whole
              section read as a security-intake-only channel with no obvious
              "just email someone" option. */}
          <Reveal>
            {/* both reassurance lines moved to sit together under the Careers
                card at the bottom of the list (live feedback 2026-08-14) instead
                of split - one above the cards, one below - across the whole
                block. --text3 -> --text on both, plus the card eyebrow labels
                below: same "proper font, black not grey" contrast fix already
                applied to the pricing tier body copy. */}
            {/* Simeon 01.11.: one quiet directory instead of five stacked cards, so the
                left column reads as "or just email us" next to the form. */}
            <p style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', margin: '0 0 10px' }}>{t.submit.directHeading}</p>
            <div className="fx-row" style={{ borderRadius: 16, padding: '4px 0', marginBottom: 18 }}>
              {CONTACT_CARDS.map((c, i) => (
                <a key={c.key} href={c.href} className="fx-dir-row" style={{
                  display: 'block', padding: '12px 18px', textDecoration: 'none',
                  borderTop: i ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{ fontSize: 'var(--fs-label)', color: 'var(--text)', marginBottom: 3 }}>{t.submit.contactCards[c.key]}</div>
                  <div style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: 'var(--fs-small)' }}>{c.value}</div>
                </a>
              ))}
            </div>
            {/* Full disclosure-handling policy (ISO/IEC 30111 triage, lawful
                basis, credit choice) moved to the Security Policy legal page
                (#p/security) - live feedback: this panel made the contact
                section feel cluttered/security-intake-only rather than one
                clean form. */}
            <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text)', margin: 0, lineHeight: 'var(--lh-body)' }}>
              {t.submit.disclosurePolicyPrefix}
              <a href={localeHref('/security/', locale)} onClick={e => {
                // Real crawlable path (was `#p/security`, a same-document fragment
                // invisible to a crawler's link graph - same defect class as the
                // NAV_HREFS fix in PublicSite.tsx, 2026-09-05 sweep). pushState +
                // dispatched popstate keeps the in-app click SPA-smooth; App.tsx's
                // own popstate listener (LEGAL_SLUGS via pathSlug()) picks the
                // real path up exactly the way a direct /security/ landing would.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                e.preventDefault()
                history.pushState(null, '', '/security/')
                window.dispatchEvent(new PopStateEvent('popstate'))
              }} style={{ color: 'var(--accent-text)' }}>{t.submit.disclosurePolicyLink}</a>{t.submit.disclosurePolicySuffix}
            </p>
          </Reveal>

          {/* right: the one form */}
          <Reveal>
            <form onSubmit={submitTip} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
                value={tipForm.botcheck} onChange={e => setTipForm(p => ({ ...p, botcheck: e.target.value }))}
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              {/* Simeon 01.11.: a general intake channel. Labels above the fields, short
                  placeholders, and the disclosure-only parts (credit, lawful basis,
                  reproduction hint) appear only once "security finding" is picked. */}
              <Field label={f.topicLabel} plain>
                <Select value={tipForm.topic} onChange={v => setTipForm(p => ({ ...p, topic: v }))}
                  ariaLabel={f.topicAriaLabel} placeholder={f.topicPlaceholder}
                  options={[
                    { value: 'General', label: f.topicOptions.general },
                    { value: 'Service Enquiry', label: f.topicOptions.service },
                    { value: 'Managed SOC', label: f.topicOptions.managedSoc },
                    { value: 'Security Disclosure', label: f.topicOptions.securityDisclosure },
                    { value: 'Research Collaboration', label: f.topicOptions.researchCollaboration },
                    { value: 'Data Solutions', label: f.topicOptions.dataSolutions },
                    { value: 'Careers', label: f.topicOptions.careers },
                    { value: 'Other', label: f.topicOptions.other },
                  ]} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                <Field label={f.nameLabel} hint={f.optional}>
                  <input type="text" autoComplete="name" placeholder={f.namePlaceholder}
                    value={tipForm.handle} onChange={e => setTipForm(p => ({ ...p, handle: e.target.value }))}
                    className="fx-input" style={INPUT} />
                </Field>
                <Field label={f.emailLabel}>
                  <input type="email" autoComplete="email" required placeholder={f.emailPlaceholder}
                    value={tipForm.email} onChange={e => setTipForm(p => ({ ...p, email: e.target.value }))}
                    className="fx-input" style={INPUT} />
                </Field>
              </div>
              <Field label={f.targetLabel} hint={disclosure ? undefined : f.optional}>
                <input type="text" autoCapitalize="none" autoCorrect="off" spellCheck={false} required={disclosure} placeholder={f.targetPlaceholder}
                  value={tipForm.target} onChange={e => setTipForm(p => ({ ...p, target: e.target.value }))}
                  className="fx-input" style={INPUT} />
              </Field>
              <Field label={f.messageLabel}>
                <textarea required placeholder={disclosure ? f.findingPlaceholder : f.messagePlaceholder}
                  value={tipForm.finding} onChange={e => setTipForm(p => ({ ...p, finding: e.target.value }))}
                  rows={5} className="fx-input" style={{ ...INPUT, resize: 'vertical' }} />
              </Field>
              {/* Always mounted so it can slide open: grid rows 0fr -> 1fr animate the real height. inert keeps
                  the closed block out of tab order and form validation focus. */}
              <div className={`fx-expand${disclosure ? ' is-open' : ''}`} inert={!disclosure} aria-hidden={!disclosure}>
                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                <div className="fx-row" style={{ borderRadius: 14, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input type="checkbox" required={disclosure} checked={tipForm.lawful}
                      onChange={e => setTipForm(p => ({ ...p, lawful: e.target.checked }))}
                      style={{ marginTop: 3, accentColor: TEAL, width: 16, height: 16, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)' }}>{f.lawfulLabel}</span>
                  </label>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input type="checkbox" aria-label={f.creditAriaLabel} checked={tipForm.credit === 'alias'}
                      onChange={e => setTipForm(p => ({ ...p, credit: e.target.checked ? 'alias' : 'anonymous' }))}
                      style={{ marginTop: 3, accentColor: TEAL, width: 16, height: 16, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)' }}>{f.creditOptions.alias}</span>
                  </label>
                </div>
                </div>
              </div>
              <button type="submit" className={tipFormState === 'ok' ? undefined : 'fx-cta-teal'} disabled={tipFormState === 'sending' || blocked} style={{
                background: tipFormState === 'ok' ? 'rgba(0,245,196,0.2)' : undefined,
                color: tipFormState === 'ok' ? TEAL : '#070711',
                border: tipFormState === 'ok' ? `1px solid ${TEAL}` : 'none',
                padding: '14px 24px', borderRadius: 12, fontWeight: 700, fontSize: 'var(--fs-body)',
                cursor: tipFormState === 'sending' ? 'wait' : blocked ? 'not-allowed' : 'pointer',
                opacity: blocked && tipFormState === 'idle' ? 0.78 : 1, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              }}>
                <FormStateIcon state={tipFormState} />
                {tipFormState === 'sending' ? f.submitSending : tipFormState === 'ok' ? f.submitOk : f.submitIdle}
              </button>
              {/* A failed send must still convert. The old error was unclickable 12px text,
                  so a visitor whose submission failed simply left. This hands them a
                  one-tap mailto with everything they already typed carried across, which
                  also means the page is safe to ship before the CRM relay key is set:
                  worst case the lead arrives by email instead of in the CRM, never nowhere. */}
              {tipFormState === 'err' && (
                <p style={{ color: 'var(--sev-crit)', fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)' }}>
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
        {/* Simeon 01.11.: the service pills close the contact form, not Laura's lab card. */}
        <div style={{ marginTop: 32 }}><TopicLinks /></div>
      </div>
    </section>
  )
}
