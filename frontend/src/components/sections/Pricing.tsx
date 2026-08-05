// "Pricing" section (`#pricing`) - extracted verbatim from PublicSite.tsx.
// Checkout/proposal modal state lives at the page level (shared with the
// Coop Partners section's own buy buttons and the checkout/proposal modal
// chrome itself), so the open functions are passed in as props.
//
// i18n note: tier copy (hook/desc/delivery) now comes from the current locale's
// t.pricing.{security,market,web,mobile} arrays (frontend/src/content/en.ts +
// de.ts), zipped by index with the locale-independent technical metadata below
// (price, stripeKey, directUrl, contact flag, output-vocabulary tags - the
// output tags stay English in both locales, same small fixed-vocabulary
// treatment as the Track Record ledger's STATUS_META codes).
import { ScopeTag, TierCarousel, Reveal } from './shared'
import { useLocale } from '../../hooks/useLocale'

type CheckoutInfo = { key: string; tier: string; desc: string; price: string; delivery?: string; directUrl?: string }
type ProposalInfo = { tier: string; desc: string; price: string; delivery?: string }

// Technical metadata only, one entry per tier, same order as the corresponding
// t.pricing.<line> array so index-zipping lines them up correctly.
const SECURITY_META = [
  { price: 'free', highlight: false, stripeKey: null as string | null, directUrl: null as string | null, contact: false, outputs: ['Investigation Report', 'Technical Findings'] },
  { price: '€1,500 / mo', highlight: false, stripeKey: 'retainer', directUrl: null, contact: false, outputs: ['Technical Findings', 'Recommendations'] },
  { price: '€4,500', highlight: true, stripeKey: 'remediation', directUrl: null, contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Technical Findings', 'Recommendations', 'Optional Retest'] },
  { price: '€9,000', highlight: false, stripeKey: 'confidential', directUrl: null, contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Optional Retest'] },
  { price: '€18,000', highlight: false, stripeKey: 'enterprise_nda', directUrl: null, contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Evidence Map', 'Recommendations'] },
  { price: '€75,000', highlight: false, stripeKey: 'critical_infra', directUrl: 'https://buy.stripe.com/9B66oJ6OIbU32LPcHK7N60H', contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Recommendations'] },
  { price: '€150,000', highlight: false, stripeKey: 'iob_art9', directUrl: 'https://buy.stripe.com/4gMcN7ehagaj4TXcHK7N60G', contact: false, outputs: ['Investigation Report', 'Evidence Map', 'Technical Findings'] },
  { price: '€250,000', highlight: false, stripeKey: 'annual_retainer', directUrl: 'https://buy.stripe.com/00wcN71uo4rBdqt7nq7N60I', contact: false, outputs: ['Investigation Report', 'Technical Findings', 'Recommendations'] },
] as const

const MARKET_META = [
  { price: '€2,500', highlight: true, stripeKey: 'market_overview', outputs: ['Investigation Report'] },
  { price: '€7,500', highlight: false, stripeKey: 'competitor_intel', outputs: ['Investigation Report', 'Evidence Map', 'Technical Findings'] },
  { price: '€18,000', highlight: false, stripeKey: 'sector_intel', outputs: ['Investigation Report', 'Risk Matrix'] },
  { price: '€4,500 / mo', highlight: false, stripeKey: 'ongoing_intel', outputs: ['Investigation Report', 'Recommendations'] },
] as const

const WEB_META = [
  { price: '€1,500', highlight: true, stripeKey: 'web_landing' as string | null },
  { price: '€4,500', highlight: false, stripeKey: 'web_full' as string | null },
  { price: '€18,000', highlight: false, stripeKey: 'web_enterprise' as string | null },
  { price: '€75,000', highlight: false, stripeKey: null as string | null },
] as const

const MOBILE_META = [
  { price: '€1,200 / mo', highlight: false },
  { price: 'from €1,500', highlight: true },
  { price: 'from €9,000', highlight: false },
  { price: 'on request', highlight: false },
] as const

export function PricingSection({
  openCheckoutModal, openProposalModal,
}: {
  openCheckoutModal: (info: CheckoutInfo) => void
  openProposalModal: (info: ProposalInfo) => void
}) {
  const { t } = useLocale()

  const securityTiers = t.pricing.security.map((tier, i) => ({ ...tier, ...SECURITY_META[i] }))
  const marketTiers = t.pricing.market.map((tier, i) => ({ ...tier, ...MARKET_META[i] }))
  const webTiers = t.pricing.web.map((tier, i) => ({ ...tier, ...WEB_META[i] }))
  const mobileTiers = t.pricing.mobile.map((tier, i) => ({ ...tier, ...MOBILE_META[i] }))

  return (
    <section id="pricing" style={{ padding: '72px 2rem' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{t.pricing.eyebrow}</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>{t.pricing.heading}</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
            {t.pricing.subheading}
          </p>
        </Reveal>

        {/* Security Audit tiers - featured-tier carousel (Stage 1e, corrected
            2026-08-02): all 8 existing tiers stay, none merged/dropped. One big
            card + a filmstrip of the rest, per product line - see `TierCarousel`.
            Each product line now wrapped in its own bordered container (live
            feedback) so the four lines read as distinct units, not one long
            unbroken scroll. */}
        <div className="rfi-glass-flat" style={{ borderRadius: 20, padding: '32px 24px', marginBottom: 48, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        <p id="pricing-security" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center', scrollMarginTop: 96 }}>{t.pricing.lineHeadings.security}<ScopeTag label={t.pricing.scopeTags.security} /></p>
        <TierCarousel tiers={securityTiers} getActions={tier => {
          const full = securityTiers.find(s => s.tier === tier.tier)!
          return {
            onBuy: full.stripeKey ? () => openCheckoutModal({ key: full.stripeKey!, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, directUrl: full.directUrl ?? undefined }) : undefined,
            onProposal: full.contact ? () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) : undefined,
          }
        }} />
        </div>

        {/* Market Research & Competitor Analysis */}
        <div className="rfi-glass-flat" style={{ borderRadius: 20, padding: '32px 24px', marginBottom: 48, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>{t.pricing.lineHeadings.market}<ScopeTag label={t.pricing.scopeTags.market} /></p>
        <TierCarousel tiers={marketTiers} getActions={tier => {
          const full = marketTiers.find(s => s.tier === tier.tier)!
          return { onBuy: () => openCheckoutModal({ key: full.stripeKey, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) }
        }} />
        </div>

        {/* Web Development */}
        <div className="rfi-glass-flat" style={{ borderRadius: 20, padding: '32px 24px', marginBottom: 48, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>{t.pricing.lineHeadings.web}<ScopeTag label={t.pricing.scopeTags.web} /></p>
        <TierCarousel tiers={webTiers} getActions={tier => {
          const full = webTiers.find(s => s.tier === tier.tier)!
          return {
            onBuy: full.stripeKey ? () => openCheckoutModal({ key: full.stripeKey!, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) : undefined,
            onProposal: !full.stripeKey ? () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) : undefined,
          }
        }} />
        </div>

        {/* Mobile App Development & Fixing */}
        <div className="rfi-glass-flat" style={{ borderRadius: 20, padding: '32px 24px', marginBottom: 0, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>{t.pricing.lineHeadings.mobile}<ScopeTag label={t.pricing.scopeTags.mobile} /></p>
        <TierCarousel tiers={mobileTiers} getActions={tier => {
          const full = mobileTiers.find(s => s.tier === tier.tier)!
          return { onProposal: () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) }
        }} />
        </div>

        {/* Research Cooperation Products - via our coop partner Laura Serna
            Gaviria / Emergent Interaction Lab. No Stripe checkout: these are
            bespoke engagements, always "on request" via #contact. See the
            COOP PARTNERS section below for who Laura is and the crates. */}
        {/* Research Cooperation used to be duplicated here (3 "on request" tiers
            under names that didn't match Coop Partners' 4 real-priced ones below,
            same product line shown two different ways with different framing). Single
            source of truth now lives in the Coop Partners section - #coop-partners -
            nothing repeated here. */}
        {/* Device Privacy Hardening / "Phone Sanitizing" tier removed entirely
            (live feedback 2026-08-02: never booked, and the free first-session
            offer already lives inside the Public security tier's description
            above - this standalone product line was redundant with it). */}
      </div>
    </section>
  )
}
