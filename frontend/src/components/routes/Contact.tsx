import { useSiteGlue, useDocumentTitle, Reveal, CONTACT_CARDS, LIGHTHOUSE_PIXEL, TEAL } from './shared'

export default function Contact() {
  const { form, formState, mobile, pixelRef, setForm, submitForm } = useSiteGlue()
  useDocumentTitle('Contact — RFI-IRFOS')
  return (
        <section id="contact" style={{ padding: '100px 2rem' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <Reveal>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>07 / Correspondence</p>
              <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>write to us</h2>
              <p style={{ color: 'var(--text2)', marginBottom: 48 }}>for research collaboration, security disclosures, or service inquiries.</p>
            </Reveal>

            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 16 : 40 }}>
              {/* left: form */}
              <Reveal from="left" style={{ display: 'flex', flexDirection: 'column' }}>
              <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  value={form.botcheck} onChange={e => setForm(p => ({ ...p, botcheck: e.target.value }))}
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                {(['name', 'email'] as const).map(f => (
                  <input key={f} type={f === 'email' ? 'email' : 'text'} required placeholder={f === 'name' ? 'Name' : 'Email'}
                    value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                    style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none',
                      fontFamily: 'inherit',
                    }} />
                ))}
                <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '12px 16px', color: form.subject ? '#e8e8f0' : '#606080',
                  fontSize: 14, outline: 'none', fontFamily: 'inherit',
                }}>
                  <option value="">Topic (optional)</option>
                  <option value="Security Audit">Security Audit</option>
                  <option value="Send APK">Send us your APK</option>
                  <option value="Research Collaboration">Research Collaboration</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Other">Other</option>
                </select>
                <textarea required placeholder="Message" value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={5} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14,
                    outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                  }} />
                <button type="submit" disabled={formState === 'sending'} style={{
                  background: formState === 'ok' ? 'rgba(0,245,196,0.2)' : TEAL,
                  color: formState === 'ok' ? TEAL : '#070711',
                  border: formState === 'ok' ? `1px solid ${TEAL}` : 'none',
                  padding: '13px 24px', borderRadius: 8, fontWeight: 800, fontSize: 14,
                  cursor: formState === 'sending' ? 'wait' : 'pointer', fontFamily: 'inherit',
                }}>
                  {formState === 'sending' ? 'Sending...' : formState === 'ok' ? 'Message received.' : 'Send message'}
                </button>
                {formState === 'err' && (
                  <p style={{ color: 'var(--sev-crit)', fontSize: 12 }}>Something went wrong. Email us directly at contact@rfi-irfos.com</p>
                )}
              </form>
              </Reveal>

              {/* right: links */}
              <Reveal from="right">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {CONTACT_CARDS.map(c => (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '18px 20px', textDecoration: 'none', display: 'block',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                    <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>{c.label}</div>
                    <div style={{ color: 'var(--accent-text)', fontWeight: 600, fontSize: 13 }}>{c.value}</div>
                  </a>
                ))}
                <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace', marginTop: 8, lineHeight: 1.8 }}>
                  Elisabethinergasse 25<br />8020 Graz, Austria<br />rfi-irfos.com · rfi-irfos.at
                </p>
              </div>
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
