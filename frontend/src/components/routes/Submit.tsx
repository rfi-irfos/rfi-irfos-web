import { useSiteGlue, useDocumentTitle, Reveal } from './shared'

export default function Submit() {
  const { mobile, form, tipForm, tipFormState } = useSiteGlue()
  useDocumentTitle('Submit a Tip — RFI-IRFOS')
  return (
    <div>
      {/* SUBMIT A TIP */}
      <section id="submit" style={{
        padding: '100px 2rem',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Disclosures</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>found something? say so.</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 40, maxWidth: 680, lineHeight: 1.8 }}>
              We run our own intake channel instead of routing you to a third-party bug bounty platform - for the same reason we refuse to be routed to one ourselves when we report a finding. This is a direct line to the same permanent ledger you see above, held to the same standard.
            </p>
          </Reveal>

          <div style={{ display: mobile ? 'block' : 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
            {/* left: policy */}
            <Reveal from="left">
              <div style={{ background: 'rgba(0,245,196,0.06)', border: '1px solid rgba(0,245,196,0.25)', borderRadius: 16, padding: '28px 26px', marginBottom: mobile ? 24 : 0 }}>
                <div style={{ fontWeight: 900, fontSize: 15, color: 'var(--text)', marginBottom: 14 }}>How we handle what you send us</div>
                <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.85, marginBottom: 16 }}>
                  <strong style={{ color: 'var(--accent-text)' }}>ISO/IEC 30111 triage:</strong> reproduce it, scope it, fix it, credit you. No finding gets buried because it's inconvenient - that's the entire complaint we file against everyone else, and we're not exempting ourselves from it.
                </p>
                <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.85, marginBottom: 16 }}>
                  <strong style={{ color: 'var(--text)' }}>Lawful basis only.</strong> We accept findings obtained through publicly accessible information, your own devices, or software you're authorized to test - the same standard our own root level code analysis holds to. If what you send us shows evidence of unauthorized access to a system you don't control, we do not publish or credit it under this program. We report it directly to the relevant authorities, the same way we'd expect to be treated if the roles were reversed.
                </p>
                <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.85, margin: 0 }}>
                  <strong style={{ color: 'var(--text)' }}>Credit, your choice.</strong> Full name, alias, or fully anonymous - exactly as set out in our{' '}
                  <a href="#p/agb" style={{ color: 'var(--accent-text)' }}>terms</a>. No call, no meeting. Everything stays written, same as every disclosure we send.
                </p>
              </div>
            </Reveal>

            {/* right: form */}
            <Reveal from="right">
              <form onSubmit={submitTip} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  value={tipForm.botcheck} onChange={e => setTipForm(p => ({ ...p, botcheck: e.target.value }))}
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                <input type="text" placeholder="Name or alias (optional - leave blank to stay anonymous)"
                  value={tipForm.handle} onChange={e => setTipForm(p => ({ ...p, handle: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                <input type="email" placeholder="Email (optional - only if you want follow-up)"
                  value={tipForm.email} onChange={e => setTipForm(p => ({ ...p, email: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                <input type="text" required placeholder="Company / app / target"
                  value={tipForm.target} onChange={e => setTipForm(p => ({ ...p, target: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                <select value={tipForm.credit} onChange={e => setTipForm(p => ({ ...p, credit: e.target.value }))} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
                }}>
                  <option value="alias">Credit me by alias / name I provide above</option>
                  <option value="anonymous">Do not credit me - keep this anonymous</option>
                  <option value="full-name">Credit me by full legal name</option>
                </select>
                <textarea required placeholder="What did you find? Include what it is, where you found it, and how to reproduce it."
                  value={tipForm.finding} onChange={e => setTipForm(p => ({ ...p, finding: e.target.value }))}
                  rows={6} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
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
                }}>
                  {tipFormState === 'sending' ? 'Sending...' : tipFormState === 'ok' ? 'Received. Thank you.' : 'Submit tip'}
                </button>
                {tipFormState === 'err' && (
                  <p style={{ color: 'var(--sev-crit)', fontSize: 12 }}>Something went wrong. Email us directly at contact@rfi-irfos.com</p>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" style={{
        padding: '100px 2rem',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>04 / Chronicle</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 64, textAlign: 'center' }}>how we came to be</h2>
          </Reveal>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
              background: 'rgba(0,245,196,0.2)', transform: 'translateX(-50%)',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {MILESTONES.map((m, i) => (
                <TimelineItem key={i} m={m} i={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
