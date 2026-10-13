// "Research Cooperation" / coop partner section (`#coop-partners`) - extracted
// verbatim from PublicSite.tsx.
import { Reveal } from './shared'
import { useLocale } from '../../hooks/useLocale'

const GH = 'https://github.com/rfi-irfos/'

const ICON = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const
function GroupIcon({ kind }: { kind: 'software' | 'research' | 'repos' }) {
  if (kind === 'repos') return <GithubMark size={20} />
  if (kind === 'research') return <svg {...ICON}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5M8 7h6M8 11h6" /></svg>
  return <svg {...ICON}><path d="M12 3 3.5 7.5v9L12 21l8.5-4.5v-9z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></svg>
}
const GROUPS = [
  { title: 'Software', kind: 'software' as const, links: [
    { label: 'lauras-core v0.2.0', href: 'https://crates.io/crates/lauras-core' },
    { label: 'lauras-mcp v0.2.0', href: 'https://crates.io/crates/lauras-mcp' },
    { label: 'lauras-api v0.2.0', href: 'https://crates.io/crates/lauras-api' },
    { label: 'lauras-team v0.2.0', onRequest: true, href: 'https://crates.io/crates/lauras-team' },
  ] },
  { title: 'Research (OSF)', kind: 'research' as const, links: [
    { label: 'HC9ZB', href: 'https://doi.org/10.17605/OSF.IO/HC9ZB' },
    { label: 'QCVJB', href: 'https://doi.org/10.17605/OSF.IO/QCVJB' },
    { label: 'UXCJE', href: 'https://doi.org/10.17605/OSF.IO/UXCJE' },
  ] },
  { title: 'Repositories', kind: 'repos' as const, links: [
    'call-laura', 'lauras-agents', 'lauras-agents-public', 'coevolution-factory',
  ].map(r => ({ label: r, href: GH + r })) },
]

function GithubMark({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

// COOP PARTNERS - the Emergent Interaction Lab, whose method Lauras Team / Call
// Laura / Jarvis grew out of. Its lead, Laura Serna Gaviria, is also on the board
// of co-founders (listed on the Team page); this card covers the research side.
export function CoopPartnersSection({
  mobile,
}: {
  mobile: boolean
}) {
  const { t } = useLocale()
  return (
    <section id="coop-partners" style={{ padding: '48px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>{t.coopPartners.eyebrow}</p>
          <h2 className="rfi-section-h2" style={{ marginBottom: 12, textAlign: 'center' }}>{t.coopPartners.heading}</h2>
          <p style={{ color: 'var(--text)', fontSize: 17, marginBottom: 40, textAlign: 'center', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            {t.coopPartners.subheading}
          </p>
        </Reveal>
        <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 14, maxWidth: 820, margin: '0 auto', overflow: 'hidden' }}>
          <Reveal from="left" dist={60} delay={1}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '24px 28px' }}>
              <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Laura Serna Gaviria</p>
                <p style={{ fontSize: 13, color: 'var(--accent-text)', marginTop: 3, fontWeight: 600 }}>{t.coopPartners.role}</p>
                <a href="https://github.com/emergentinteractionlab" target="_blank" rel="noopener noreferrer"
                   style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: 'var(--text2)', textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace" }}>
                  <GithubMark />
                  @emergentinteractionlab
                </a>
              </div>
              <a href="https://laura-api.fly.dev" target="_blank" rel="noopener noreferrer"
                 style={{
                   display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700,
                   letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 999,
                   border: '1px solid rgba(16,185,129,.45)', color: '#10b981', textDecoration: 'none', whiteSpace: 'nowrap',
                 }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, background: '#10b981', display: 'inline-block' }} />
                Live API
              </a>
            </div>
          </Reveal>
          <Reveal from="bottom" dist={40} delay={2}>
            <div style={{ padding: '24px 28px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {t.coopPartners.laura.paragraphs.map((para, i) => (
                <p key={i} style={{ margin: 0, color: 'var(--text)', lineHeight: 1.65, fontSize: i === 0 ? 15.5 : 14.5, fontWeight: 400, opacity: i === 0 ? 1 : 0.88 }}>{para}</p>
              ))}
            </div>
          </Reveal>
          <Reveal from="right" dist={60} delay={3}>
            <div style={{
              display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 0,
              borderTop: '1px solid var(--border)',
            }}>
              {GROUPS.map((g, gi) => (
                <div key={g.title} style={{ padding: '22px 24px', textAlign: 'center', borderLeft: gi > 0 && !mobile ? '1px solid var(--border)' : 'none', borderTop: gi > 0 && mobile ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--accent-text)', marginBottom: 12 }}>
                    <GroupIcon kind={g.kind} />
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.16em', margin: 0 }}>{g.title}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                    {g.links.map(l => (
                      <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                         style={{ fontSize: 12.5, color: 'var(--text)', textDecoration: 'none' }}>
                        {l.label}{'onRequest' in l && l.onRequest ? ` ${t.coopPartners.onRequest}` : ''}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

    </section>
  )
}
