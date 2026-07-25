import { useSiteGlue, useDocumentTitle, Reveal, RESEARCH_AREAS, PROJECTS, PUBLICATIONS } from './shared'

export default function Research() {
  useDocumentTitle('Research — RFI-IRFOS')
  return (
        <section id="research" style={{ padding: '100px 2rem' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto' }}>
            <Reveal from="left">
              <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>01 / Areas of Magnification</p>
              <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>where our attention falls</h2>
            </Reveal>
            <Reveal from="right" delay={1}>
              <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
                One team. The same people who train the model write the regulatory analysis and file the disclosure.
              </p>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
              {RESEARCH_AREAS.map((a, i) => (
                <Reveal key={a.title} delay={i} from={(['left', 'bottom', 'right', 'scale'] as const)[i % 4]}>
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16, padding: '28px 24px', height: '100%',
                  }}>
                    <div style={{ marginBottom: 16, lineHeight: 0 }}>{a.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>{a.title}</div>
                    <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7 }}>{a.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div style={{ marginTop: 64 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: 'var(--text)' }}>publications on OSF</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {PUBLICATIONS.map(p => (
                  <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 10, textDecoration: 'none', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.25)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)', minWidth: 32 }}>{p.year}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{p.title}</span>
                      <span style={{ color: 'var(--text3)', fontSize: 12, display: 'block', marginTop: 2 }}>{p.sub}</span>
                    </span>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(0,245,196,0.25)', color: 'var(--accent-text)', whiteSpace: 'nowrap' }}>{p.tag}</span>
                    <span style={{ color: 'var(--text4)', fontSize: 12 }}>↗</span>
                  </a>
                ))}
              </div>
              <p style={{ marginTop: 16, fontFamily: 'monospace', fontSize: 10, color: 'var(--text4)' }}>
                119 projects on OSF &nbsp;·&nbsp; <a href="https://osf.io/rzvyg/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text3)', textDecoration: 'none' }}>osf.io/rzvyg</a>
              </p>
            </div>
          </div>
        </section>
  )
}
