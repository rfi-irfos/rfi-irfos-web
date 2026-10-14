// "Pricing" section (`#pricing`) - extracted verbatim from PublicSite.tsx.
//
// i18n note: domain copy (tagline/scope/bring/we/receive/cta/badge/delivery)
// comes from the current locale's t.pricing.domains array
// (frontend/src/content/en.ts + de.ts).
//
// REBUILT 2026-10-14 (initial-review/pricing redesign): the sticky
// five-card domain stack was the whole hero. It's now a secondary
// "Need something else?" row below the real hero: a standalone Free
// card, a 4-tier subscription grid (Starter/Growth/Pro/Business) and an
// Enterprise band. The five domains (Intelligence/Security/Data/
// Business & Market/Engineering) still exist and still route into the
// contact form via onSelectTier - they're the second commercial motion
// (custom intelligence/engineering work) sitting alongside the new
// productized-appsec subscription product, not replaced by it.
import { EngagementFlow, Reveal, useMobile } from './shared'
import { useLocale } from '../../hooks/useLocale'
import { InitialReviewFlow } from './InitialReviewFlow'
import { useState } from 'react'

type PricingDomain = {
  name: string; badge: string; scope: string
  bring?: string; we?: string; receive?: string; cta: string; delivery: string
}

type PricingTier = {
  name: string; price: string; features: string[]; cta: string
  stripeKey: string; popular?: boolean
}

function TierCard({ tier, mobile, onCheckout }: { tier: PricingTier; mobile: boolean; onCheckout: (stripeKey: string) => void }) {
  return (
    <div style={{
      border: tier.popular ? '1px solid #f97316' : '1px solid var(--border)',
      borderRadius: 16, padding: mobile ? '18px 20px' : '22px 24px',
      background: tier.popular ? 'rgba(249,115,22,0.06)' : 'var(--glass-bg-solid)',
      display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
    }}>
      {tier.popular && (
        <span style={{ position: 'absolute', top: -11, left: 20, background: '#f97316', color: '#1a0f00', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Most popular
        </span>
      )}
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text3)', margin: 0 }}>{tier.name}</p>
      <div>
        <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)' }}>{tier.price}</span>
        <span style={{ fontSize: 12.5, color: 'var(--text3)' }}> /mo</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {tier.features.map(f => (
          <li key={f} style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text2)', display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--accent-text)', fontWeight: 800 }}>✓</span>{f}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onCheckout(tier.stripeKey)} style={{
        background: tier.popular ? '#f97316' : 'transparent',
        color: tier.popular ? '#1a0f00' : 'var(--text)',
        border: tier.popular ? 'none' : '1px solid var(--border)',
        padding: '11px 16px', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer',
      }}>{tier.cta}</button>
    </div>
  )
}

function NeedSomethingElseRow({ domains, onSelectTier }: { domains: PricingDomain[]; onSelectTier: (t: string) => void }) {
  const { t } = useLocale()
  return (
    <div style={{ borderTop: '1px solid var(--border)', marginTop: 32, paddingTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 18px' }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{t.pricing.needSomethingElse}</span>
      {domains.map((d, i) => (
        <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button type="button" onClick={() => onSelectTier(d.name)} style={{ background: 'none', border: 'none', color: 'var(--accent-text)', fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: 0 }}>
            {d.name}
          </button>
          {i < domains.length - 1 && <span style={{ color: 'var(--border)' }}>·</span>}
        </span>
      ))}
    </div>
  )
}

export function PricingSection({
  onSelectTier, onCheckout,
}: {
  onSelectTier: (tier: string) => void
  onCheckout: (stripeKey: string) => void
}) {
  const { t } = useLocale()
  const mobile = useMobile(640)
  const [freeModalOpen, setFreeModalOpen] = useState(false)

  return (
    <section id="pricing" style={{ padding: '56px var(--sec-pad-x) 120px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="wm-eyebrow">{t.pricing.eyebrow}</p>
            <h1 className="rfi-page-h1" style={{ marginBottom: 12 }}>{t.pricing.heading}</h1>
            <p style={{ color: 'var(--text2)', marginBottom: 40, maxWidth: 640 }}>{t.pricing.subheading}</p>
          </div>
        </Reveal>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <button type="button" onClick={() => setFreeModalOpen(true)} style={{
              width: '100%', textAlign: 'left', background: 'var(--glass-bg-solid)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px 28px', cursor: 'pointer', marginBottom: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text3)', margin: '0 0 6px' }}>{t.pricing.freeCard.label}</p>
                <p style={{ fontSize: 13.5, color: 'var(--text2)', margin: 0 }}>{t.pricing.freeCard.tagline}</p>
              </div>
              <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)' }}>{t.pricing.freeCard.price}</span>
            </button>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(4, 1fr)', gap: 16 }}>
            {t.pricing.tiers.map((tier, i) => (
              <Reveal key={tier.name} from="bottom" dist={48} delay={i}>
                <TierCard tier={tier} mobile={mobile} onCheckout={onCheckout} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={4}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', margin: '0 0 4px' }}>{t.pricing.enterprise.heading}</p>
                <p style={{ fontSize: 12.5, color: 'var(--text2)', margin: 0, maxWidth: 520 }}>{t.pricing.enterprise.text}</p>
              </div>
              <button type="button" onClick={() => onSelectTier('Enterprise')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {t.pricing.enterprise.cta}
              </button>
            </div>
          </Reveal>

          <NeedSomethingElseRow domains={t.pricing.domains} onSelectTier={onSelectTier} />
        </div>
      </div>

      {freeModalOpen && (
        <div onClick={() => setFreeModalOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,4,10,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()}>
            <InitialReviewFlow variant="modal" />
          </div>
        </div>
      )}
    </section>
  )
}
