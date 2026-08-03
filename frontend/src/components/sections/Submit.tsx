// "Submit a tip" / contact section (`#submit`) - extracted verbatim from
// PublicSite.tsx. The consolidated contact/disclosure form's state and submit
// handler live at the page level (PublicSite.tsx) since the Lighthouse tracking
// pixel right below the form, and the abandonment beacon, both key off the same
// state - so this section receives it all as props.
import { FormStateIcon, TEAL, Reveal, LIGHTHOUSE_PIXEL } from './shared'

const CONTACT_CARDS = [
  { label: 'General inquiries', value: 'contact@rfi-irfos.com', href: 'mailto:contact@rfi-irfos.com' },
  { label: 'Security disclosures', value: 'security@rfi-irfos.com', href: 'mailto:security@rfi-irfos.com' },
  { label: 'Public disclosures (audit correspondence)', value: 'rfi.irfos@gmail.com', href: 'mailto:rfi.irfos@gmail.com' },
  { label: 'Research collaboration', value: 'research@rfi-irfos.com', href: 'mailto:research@rfi-irfos.com' },
  { label: 'Careers', value: 'career@rfi-irfos.com', href: 'mailto:career@rfi-irfos.com' },
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
  mobile, tipForm, setTipForm, tipFormState, submitTip, pixelRef,
}: {
  mobile: boolean
  tipForm: TipForm
  setTipForm: (updater: (p: TipForm) => TipForm) => void
  tipFormState: 'idle' | 'sending' | 'ok' | 'err'
  submitTip: (e: React.FormEvent) => void
  pixelRef: React.RefObject<HTMLImageElement | null>
}) {
  return (
    <section id="submit" style={{ padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>08 / Contact &amp; Disclosures</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>get in touch</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 40, maxWidth: 680, lineHeight: 1.8 }}>
            One form, whatever it's about: a general question, a service inquiry, research collaboration - or a security finding. If it's the last one, we run our own intake channel instead of routing it to a third-party bug bounty platform, for the same reason we'd refuse to be routed to one ourselves.
          </p>
        </Reveal>

        <div style={{ display: mobile ? 'block' : 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          {/* left: quick contact channels first (general-purpose, what most
              visitors actually want), disclosure policy detail below it - live
              feedback: leading with the disclosure policy panel made the whole
              section read as a security-intake-only channel with no obvious
              "just email someone" option. */}
          <Reveal from="left">
            <p style={{ fontSize: 12.5, color: 'var(--text3)', marginBottom: 14 }}>
              Not sure what to pick on the right? <strong style={{ color: 'var(--text2)' }}>General inquiries</strong> reaches a human either way - or email one of these directly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {CONTACT_CARDS.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '14px 18px', textDecoration: 'none', display: 'block',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 5 }}>{c.label}</div>
                  <div style={{ color: 'var(--accent-text)', fontWeight: 600, fontSize: 13 }}>{c.value}</div>
                </a>
              ))}
            </div>
            {/* Full disclosure-handling policy (ISO/IEC 30111 triage, lawful
                basis, credit choice) moved to the Security Policy legal page
                (#p/security) - live feedback: this panel made the contact
                section feel cluttered/security-intake-only rather than one
                clean form. */}
            <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 20, lineHeight: 1.7 }}>
              Sending a security finding? See our{' '}
              <a href="#p/security" style={{ color: 'var(--accent-text)' }}>full disclosure-handling policy</a> - triage, lawful basis, and your choice of credit.
            </p>
            <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 0, lineHeight: 1.8 }}>
              Elisabethinergasse 25<br />8020 Graz, Austria<br />rfi-irfos.com · rfi-irfos.at
            </p>
          </Reveal>

          {/* right: the one form */}
          <Reveal from="right">
            <form onSubmit={submitTip} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
                value={tipForm.botcheck} onChange={e => setTipForm(p => ({ ...p, botcheck: e.target.value }))}
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              <select value={tipForm.topic} onChange={e => setTipForm(p => ({ ...p, topic: e.target.value }))} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 16px', color: tipForm.topic ? 'var(--text)' : 'var(--text3)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}>
                <option value="">Topic (optional)</option>
                <option value="Security Disclosure">Security Disclosure</option>
                <option value="Security Audit">Security Audit</option>
                <option value="Send APK">Send us your APK</option>
                <option value="Research Collaboration">Research Collaboration</option>
                <option value="Web Development">Web Development</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" placeholder="Name or alias (optional - leave blank to stay anonymous)"
                value={tipForm.handle} onChange={e => setTipForm(p => ({ ...p, handle: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              <input type="email" placeholder="Email (optional - only if you want a reply)"
                value={tipForm.email} onChange={e => setTipForm(p => ({ ...p, email: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              <input type="text" required placeholder="Company / app / subject"
                value={tipForm.target} onChange={e => setTipForm(p => ({ ...p, target: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              <select value={tipForm.credit} onChange={e => setTipForm(p => ({ ...p, credit: e.target.value }))} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}>
                <option value="alias">Credit me by alias / name I provide above</option>
                <option value="anonymous">Do not credit me - keep this anonymous</option>
                <option value="full-name">Credit me by full legal name</option>
              </select>
              <textarea required placeholder="What's this about? Include what it is, where relevant, and how to reach a conclusion (e.g. how to reproduce a finding)."
                value={tipForm.finding} onChange={e => setTipForm(p => ({ ...p, finding: e.target.value }))}
                rows={6} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" required checked={tipForm.lawful}
                  onChange={e => setTipForm(p => ({ ...p, lawful: e.target.checked }))}
                  style={{ marginTop: 3, accentColor: TEAL, width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.6 }}>
                  I confirm this information was obtained through lawful, authorized means - publicly accessible data, my own devices, or software I'm authorized to test.
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
                {tipFormState === 'sending' ? 'Sending...' : tipFormState === 'ok' ? 'Received. Thank you.' : 'Send message'}
              </button>
              {tipFormState === 'err' && (
                <p style={{ color: 'var(--sev-crit)', fontSize: 12 }}>Something went wrong. Email us directly at contact@rfi-irfos.com</p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
      {/* Lighthouse tracking pixel - site=rfi-irfos, real channel from UTM/referrer */}
      <img ref={pixelRef}
        src={`${LIGHTHOUSE_PIXEL}?site=rfi-irfos&p=${encodeURIComponent(location.pathname)}&r=${encodeURIComponent(document.referrer)}&utm_source=${encodeURIComponent(new URLSearchParams(location.search).get('utm_source') ?? '')}&utm_medium=${encodeURIComponent(new URLSearchParams(location.search).get('utm_medium') ?? '')}&utm_campaign=${encodeURIComponent(new URLSearchParams(location.search).get('utm_campaign') ?? '')}`}
        alt="" width="1" height="1" style={{ display: 'none' }} />
    </section>
  )
}
