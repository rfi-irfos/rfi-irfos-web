import { useSiteGlue, useDocumentTitle, Reveal, PROJECTS } from './shared'

export default function Projects() {
  useDocumentTitle('Projects — RFI-IRFOS')
  return (
        <section id="projects" style={{
          padding: '100px 2rem',
          background: 'rgba(0,245,196,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <Reveal from="right">
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>02 / Undertakings</p>
              <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>what we build</h2>
            </Reveal>
            <Reveal from="left" delay={1}>
              <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
                Every project is a proof of concept for a specific research question. All built on the same stack.
              </p>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
              {PROJECTS.map((p, i) => (
                <Reveal key={p.name} delay={i % 4} from={(['bottom', 'right', 'bottom', 'left'] as const)[i % 4]} style={{ display: 'flex' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: 17 }}>{p.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{p.sub}</div>
                    </div>
                    <span style={{
                      fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em',
                      padding: '3px 8px', borderRadius: 20,
                      border: '1px solid rgba(0,245,196,0.3)', color: 'var(--accent-text)', whiteSpace: 'nowrap',
                    }}>{p.tag}</span>
                  </div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7, flex: 1 }}>{p.desc}</p>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--accent-text)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
                      {p.link.includes('crates.io') ? 'View on crates.io' : 'View on GitHub'} &rarr;
                    </a>
                  )}
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
  )
}
