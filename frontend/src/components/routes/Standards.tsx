import { Reveal, STANDARDS } from './shared'

export default function Standards() {
  useDocumentTitle('Standards — RFI-IRFOS')
  return (
    <section id="standards" style={{ padding: '100px 2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Standards &amp; Compliance</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>the frameworks we work under</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 48, maxWidth: 620 }}>
            Every audit is filed against current EU and Austrian law. We track new standards as they enter force and keep our methodology up to date.
          </p>
        </Reveal>

        {/* Featured: NIS-2 / NISG 2026 */}
        <Reveal from="scale">
          <div style={{ background: 'rgba(0,245,196,0.06)', border: '1px solid rgba(0,245,196,0.25)', borderRadius: 16, padding: '32px 28px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
              <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--text)' }}>NIS-2 <span style={{ color: 'var(--accent-text)' }}>·</span> NISG 2026</div>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.15em', border: '1px solid rgba(0,245,196,0.3)', borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap' }}>EU · Austria · in force</span>
            </div>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
              The EU directive for a high common level of cybersecurity, transposed into Austrian law as <strong style={{ color: 'var(--text)' }}>NISG 2026</strong>. It mandates state-of-the-art risk management, strict incident reporting to national authorities, and <strong style={{ color: 'var(--text)' }}>personal liability for company management</strong>. In Austria it directly impacts roughly 4,000 essential and important entities, plus an estimated 50,000 supply-chain partners.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 12 }}>
              {[
                ['Risk Management', 'cryptography · access control · supply-chain security'],
                ['Incident Response', 'mandatory reporting within strict timeframes'],
                ['Corporate Accountability', 'management personally liable for non-compliance'],
              ].map(([t, d]) => (
                <div key={t} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 5, color: 'var(--accent-text)' }}>{t}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.6 }}>{d}</div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>
              Scope: ~4,000 entities directly · ~50,000 supply-chain partners ·{' '}
              <a href="https://www.nis.gv.at" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text3)', textDecoration: 'none' }}>nis.gv.at</a>
            </p>
          </div>
        </Reveal>

        {/* The rest of the frameworks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
          {STANDARDS.map((s, i) => (
            <Reveal key={s.code} delay={i} from="bottom">
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '22px 20px', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>{s.code}</div>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{s.region}</span>
                </div>
                <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
