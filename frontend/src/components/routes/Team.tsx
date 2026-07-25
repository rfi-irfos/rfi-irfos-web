import { useSiteGlue, useDocumentTitle, Reveal } from './shared'

export default function Team() {
  useDocumentTitle('Team — RFI-IRFOS')
  return (
        <section id="team" style={{ padding: '100px 2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Reveal>
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>The Institute</p>
              <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 48, textAlign: 'center' }}>one team, everything in-house</h2>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              {TEAM.map((p, i) => (
                <Reveal key={p.name} delay={i} from="bottom">
                  <a href={p.gh ? `https://github.com/${p.gh}` : undefined} target="_blank" rel="noopener"
                     style={{
                       display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                       background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                       borderRadius: 14, padding: 20, textAlign: 'center', textDecoration: 'none',
                       height: '100%', transition: 'border-color 0.15s', cursor: p.gh ? 'pointer' : 'default',
                     }}
                     onMouseEnter={e => { if (p.gh) e.currentTarget.style.borderColor = 'rgba(0,245,196,0.4)' }}
                     onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
                    {p.gh ? (
                      // Self-hosted, not hotlinked: an <img> pointed straight at github.com/user.png
                      // triggers GitHub's own Set-Cookie headers on the response, which the browser
                      // (correctly) rejects as third-party in a cross-site context - harmless, but
                      // noisy console warnings on every load. A local copy avoids the request entirely.
                      <img src={`/team/${p.gh}.png`} alt={p.name} loading="lazy"
                           style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, fontWeight: 900, color: 'var(--accent-text)', background: 'rgba(0,245,196,0.08)',
                      }}>{p.name[0]}</div>
                    )}
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--accent-text)', marginTop: 3, fontWeight: 600 }}>{p.role}</p>
                      <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6, lineHeight: 1.5 }}>{p.desc}</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
  )
}
