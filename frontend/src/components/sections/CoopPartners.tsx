// "Research Cooperation" / coop partner section (`#coop-partners`) - extracted
// verbatim from PublicSite.tsx. Its buy buttons open the same page-level
// checkout modal as Pricing, so `openCheckoutModal` is passed in as a prop.
import { Reveal } from './shared'
import { useLocale } from '../../hooks/useLocale'

type CheckoutInfo = { key: string; tier: string; desc: string; price: string; delivery?: string; directUrl?: string }

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
    <section id="coop-partners" style={{ padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>{t.coopPartners.eyebrow}</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16, textAlign: 'center' }}>{t.coopPartners.heading}</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 40, textAlign: 'center', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            {t.coopPartners.subheading}
          </p>
        </Reveal>
        <Reveal from="bottom" delay={1}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20,
            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 340 }}>
              {[
                { label: 'GitHub · call-laura', href: 'https://github.com/rfi-irfos/call-laura' },
                { label: 'GitHub · lauras-agents', href: 'https://github.com/rfi-irfos/lauras-agents' },
                { label: 'GitHub · lauras-agents-public', href: 'https://github.com/rfi-irfos/lauras-agents-public' },
                { label: 'GitHub · coevolution-factory', href: 'https://github.com/rfi-irfos/coevolution-factory' },
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
                     fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 999,
                     border: `1px solid ${c.live ? 'rgba(16,185,129,.5)' : 'var(--border)'}`,
                     color: c.live ? '#10b981' : 'var(--text2)',
                     textDecoration: 'none', whiteSpace: 'nowrap',
                   }}>
                  {c.label}
                </a>
              ))}
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
                style={{
                  display: 'flex', flexDirection: 'column', gap: 4, padding: '14px 16px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                  borderRadius: 10, textAlign: 'left', cursor: 'pointer', transition: 'border-color .15s',
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
