// "Research Cooperation" / coop partner section (`#coop-partners`) - extracted
// verbatim from PublicSite.tsx.
import { Reveal } from './shared'
import { useLocale } from '../../hooks/useLocale'

const GH = 'https://github.com/rfi-irfos/'

function GroupIcon({ kind, size = 20 }: { kind: 'software' | 'research' | 'repos' | 'website'; size?: number }) {
  const icon = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const
  if (kind === 'repos') return <GithubMark size={size} />
  if (kind === 'research') return <svg {...icon}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5M8 7h6M8 11h6" /></svg>
  if (kind === 'website') return <svg {...icon}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></svg>
  return <svg {...icon}><path d="M12 3 3.5 7.5v9L12 21l8.5-4.5v-9z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></svg>
}
const GROUPS = [
  { title: 'Software', kind: 'software' as const, ic: 1, links: [
    { label: 'lauras-core v0.2.0', href: 'https://crates.io/crates/lauras-core' },
    { label: 'lauras-mcp v0.2.0', href: 'https://crates.io/crates/lauras-mcp' },
    { label: 'lauras-api v0.2.0', href: 'https://crates.io/crates/lauras-api' },
    { label: 'lauras-team v0.2.0', onRequest: true, href: 'https://crates.io/crates/lauras-team' },
  ] },
  { title: 'Research (OSF)', kind: 'research' as const, ic: 2, links: [
    { label: 'HC9ZB', href: 'https://doi.org/10.17605/OSF.IO/HC9ZB' },
    { label: 'QCVJB', href: 'https://doi.org/10.17605/OSF.IO/QCVJB' },
    { label: 'UXCJE', href: 'https://doi.org/10.17605/OSF.IO/UXCJE' },
  ] },
  { title: 'Repositories', kind: 'repos' as const, ic: 4, links: [
    'call-laura', 'lauras-agents-public', 'coevolution-factory',
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
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'var(--fs-label)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>{t.coopPartners.eyebrow}</p>
          <h2 className="rfi-section-h2" style={{ marginBottom: 12, textAlign: 'center' }}>{t.coopPartners.heading}</h2>
          <p style={{ color: 'var(--text)', fontSize: 'var(--fs-lead)', marginBottom: 40, textAlign: 'center', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            {t.coopPartners.subheading}
          </p>
        </Reveal>
        <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 14, maxWidth: 820, margin: '0 auto', overflow: 'hidden', zoom: 0.95, background: 'linear-gradient(165deg, var(--silver-bg-a), var(--silver-bg-b))', border: '1px solid var(--silver-line)' }}>
          <Reveal from="left" dist={60} delay={1}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '24px 28px' }}>
              <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                <p style={{ fontSize: 'var(--fs-h3)', fontWeight: 700, color: 'var(--text)', margin: 0 }}>Laura Serna Gaviria</p>
                <p style={{ fontSize: 'var(--fs-small)', color: 'var(--silver-text)', marginTop: 3, fontWeight: 700 }}>{t.coopPartners.role}</p>
                <a href="https://github.com/emergentinteractionlab" target="_blank" rel="noopener noreferrer"
                   style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 'var(--fs-small)', color: 'var(--text2)', textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace" }}>
                  <GithubMark />
                  @emergentinteractionlab
                </a>
              </div>
              <a href="https://emergent-interaction-lab.com" target="_blank" rel="noopener noreferrer"
                 style={{
                   display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-label)', fontWeight: 700,
                   letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 999,
                   border: '1px solid color-mix(in srgb, var(--accent) 55%, transparent)', background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--accent)', textDecoration: 'none', whiteSpace: 'nowrap',
                 }}>
                <GroupIcon kind="website" size={11} />
                Website
              </a>
            </div>
          </Reveal>
          <Reveal from="bottom" dist={40} delay={2}>
            <div style={{ padding: '24px 28px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {t.coopPartners.laura.paragraphs.map((para, i) => (
                <p key={i} style={{ margin: 0, color: 'var(--text)', lineHeight: 'var(--lh-body)', fontSize: 'var(--fs-body)', fontWeight: 400 }}>{para}</p>
              ))}
            </div>
          </Reveal>
          <Reveal from="right" dist={60} delay={3}>
            <div style={{
              display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 10,
              borderTop: '1px solid var(--border)', padding: '14px',
            }}>
              {GROUPS.map(g => (
                <div key={g.title} style={{
                  padding: '26px 18px 22px', textAlign: 'center', borderRadius: 16, position: 'relative', overflow: 'hidden',
                  // Glass card: a faint glow in the icon's own colour on top, a silver sheen below,
                  // a bright top edge and blur so it reads as frosted glass, not a flat box.
                  background: `radial-gradient(120% 70% at 50% 0%, color-mix(in srgb, var(--ic-${g.ic}) 6%, transparent), transparent 62%), linear-gradient(160deg, var(--silver-tile-a), var(--silver-tile-b) 55%, var(--silver-tile-a))`,
                  border: '1px solid var(--silver-line)',
                  backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.05), 0 6px 16px rgba(0,0,0,0.28)',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span className="rfi-glass-icon rfi-icon-pop" style={{ width: 40, height: 40, borderRadius: 12, ['--ib' as string]: `var(--ib-${g.ic})` }}>
                      <GroupIcon kind={g.kind} size={17} />
                    </span>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'var(--fs-small)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', margin: 0, color: 'var(--text)' }}>{g.title}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                    {g.links.map(l => (
                      <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                         style={{ fontSize: 'var(--fs-small)', color: 'var(--text)', textDecoration: 'none' }}>
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
