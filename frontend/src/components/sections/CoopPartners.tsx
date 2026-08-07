// "Research Cooperation" / coop partner section (`#coop-partners`) - extracted
// verbatim from PublicSite.tsx. Its buy buttons open the same page-level
// checkout modal as Pricing, so `openCheckoutModal` is passed in as a prop.
import { Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

type CheckoutInfo = { key: string; tier: string; desc: string; price: string; delivery?: string; directUrl?: string }

// The four separate "GitHub · <repo>" pills used to sit in the same badge row as
// every crates.io/OSF/live-link badge - live feedback: that read as "just a pile
// of pointless badges" eating space. One GitHub-branded pill (linking to the org)
// replaces all four; the individual repos move into a compact plain-text list
// right under it instead of repeating the same platform four times as full pills.
const LAURA_REPOS = ['call-laura', 'lauras-agents', 'lauras-agents-public', 'coevolution-factory']

function GithubMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

// COOP PARTNERS - not team, an external research partner whose method
// Lauras Team / Call Laura / Jarvis grew out of. Kept deliberately
// separate from the TEAM grid above (different relationship: Laura
// directs her own research and agent architecture; RFI-IRFOS builds
// on her direction, not the reverse).
export function CoopPartnersSection({
  mobile, openCheckoutModal,
}: {
  mobile: boolean
  openCheckoutModal: (info: CheckoutInfo) => void
}) {
  const { t } = useLocale()
  return (
    <section id="coop-partners" style={{ padding: '48px 2rem 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>{t.coopPartners.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}><ScrambleHeading text={t.coopPartners.heading} /></h2>
          <p style={{ color: 'var(--text2)', marginBottom: 40, textAlign: 'center', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            {t.coopPartners.subheading}
          </p>
        </Reveal>
        <Reveal from="bottom" delay={1}>
          <div className="rfi-glass-flat rfi-glass-solid" style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20,
            borderRadius: 14, padding: '28px 28px',
          }}>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>Laura Serna Gaviria</p>
              <p style={{ fontSize: 13, color: 'var(--accent-text)', marginTop: 2, fontWeight: 600 }}>{t.coopPartners.role}</p>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 10, lineHeight: 1.6, maxWidth: 560 }}>
                {t.coopPartners.laura.desc}
              </p>
              <a href="https://emergent-interaction-lab.fly.dev" target="_blank" rel="noopener noreferrer"
                 style={{ display: 'inline-block', marginTop: 14, fontSize: 13, fontWeight: 700, color: 'var(--accent-text)', textDecoration: 'none' }}>
                emergent-interaction-lab.fly.dev →
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, maxWidth: 340 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 }}>
                {[
                  { label: 'GitHub · rfi-irfos', href: 'https://github.com/rfi-irfos', icon: true },
                  { label: 'lauras-core v0.2.0', href: 'https://crates.io/crates/lauras-core' },
                  { label: 'lauras-team v0.2.0 (auf Anfrage)', href: 'https://crates.io/crates/lauras-team' },
                  { label: 'lauras-mcp v0.2.0', href: 'https://crates.io/crates/lauras-mcp' },
                  { label: 'lauras-api v0.2.0', href: 'https://crates.io/crates/lauras-api' },
                  { label: 'OSF · HC9ZB', href: 'https://doi.org/10.17605/OSF.IO/HC9ZB' },
                  { label: 'OSF · QCVJB', href: 'https://doi.org/10.17605/OSF.IO/QCVJB' },
                  { label: 'OSF · UXCJE', href: 'https://doi.org/10.17605/OSF.IO/UXCJE' },
                  { label: 'Live API', href: 'https://laura-api.fly.dev', live: true },
                  { label: 'Coevolution Factory', href: 'https://coevolution-factory-sparkling-mountain-1802.fly.dev', live: true },
                ].map((c, i) => (
                  <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                     style={{
                       display: 'inline-flex', alignItems: 'center', gap: 6,
                       fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 999,
                       border: `1px solid ${c.live ? 'rgba(16,185,129,.5)' : 'var(--border)'}`,
                       color: c.live ? '#10b981' : 'var(--text2)',
                       textDecoration: 'none', whiteSpace: 'nowrap',
                     }}>
                    {c.icon && <GithubMark />}
                    {c.label}
                  </a>
                ))}
              </div>
              {/* The four repos behind the single GitHub badge above, as a plain compact
                  list rather than four more pills - still one click away, none of the weight. */}
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text3)', textAlign: 'right', lineHeight: 1.7 }}>
                {LAURA_REPOS.map((repo, i) => (
                  <span key={repo}>
                    <a href={`https://github.com/rfi-irfos/${repo}`} target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--text3)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                      {repo}
                    </a>
                    {i < LAURA_REPOS.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginTop: 16 }}>
            {[
              { name: 'Systemaudit', price: '€4.500', href: 'https://buy.stripe.com/14AdRbgpi1fpdqt6jm7N60r' },
              { name: 'Emergent Case Intelligence Sprint', price: '€12.500', href: 'https://buy.stripe.com/bJe9AVc927DNdqtePS7N60m' },
              { name: 'Multi-Agent System Design', price: '€24.500', href: 'https://buy.stripe.com/00w3cxc92bU30DH2367N60n' },
              { name: 'System Design & Deployment', price: '€55.000', href: 'https://buy.stripe.com/dRm9AVgpi7DNdqt37a7N60A' },
            ].map((p, i) => (
              <button key={i}
                onClick={() => openCheckoutModal({ key: `coop_${i}`, tier: p.name, desc: t.coopPartners.products[i].desc, price: p.price, delivery: t.coopPartners.productsDeliveryNote, directUrl: p.href })}
                className="rfi-hover-card rfi-glass-flat rfi-glass-solid"
                style={{
                  display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 16px',
                  borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{p.name}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-text)' }}>{p.price}</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10 }}>
            {t.coopPartners.footerNotePrefix}{' '}
            <a href="https://emergent-interaction-lab.fly.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)' }}>emergent-interaction-lab.fly.dev</a>.
          </p>
        </Reveal>
      </div>

    </section>
  )
}
