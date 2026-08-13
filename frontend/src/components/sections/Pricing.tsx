// "Pricing" section (`#pricing`) - extracted verbatim from PublicSite.tsx.
// Checkout/proposal modal state lives at the page level (shared with the
// Coop Partners section's own buy buttons and the checkout/proposal modal
// chrome itself), so the open functions are passed in as props.
//
// i18n note: tier copy (hook/desc/delivery) now comes from the current locale's
// t.pricing.{security,market} arrays (frontend/src/content/en.ts + de.ts),
// zipped by index with the locale-independent technical metadata below
// (price, stripeKey, directUrl, contact flag, output-vocabulary tags - the
// output tags stay English in both locales, same small fixed-vocabulary
// treatment as the Track Record ledger's STATUS_META codes).
//
// Web Development and Mobile App Development lines removed entirely
// (2026-08-12, live feedback): every remaining line follows the same
// 1-highlighted-tier + 3-upsell shape, keyed to keywords instead of a long
// tier list. Web/Mobile as standalone product lines diluted the audit/
// intelligence positioning; that work is still offered, just no longer
// carried as its own priced tier here - see #contact.
import { ScopeTag, TierCarousel, Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

type CheckoutInfo = { key: string; tier: string; desc: string; price: string; delivery?: string; directUrl?: string }
type ProposalInfo = { tier: string; desc: string; price: string; delivery?: string }

// Technical metadata only, one entry per tier, same order as the corresponding
// t.pricing.<line> array so index-zipping lines them up correctly.
//
// Security collapsed 8 tiers -> 4 (2026-08-12, same treatment as Business
// Intelligence): Public stays as the free, non-negotiable entry point (the
// disclosure-doctrine tier, not a sales funnel step). Security Retainer,
// Enterprise NDA, Critical Infrastructure, IoB/Art.9 and Annual Retainer
// merged into one flexible top tier - same "on request" pattern already used
// for the old Web Enterprise tier - since their scopes (NIS2 response,
// biometric data-flow tracing, portfolio-wide coverage) vary too much for a
// fixed Stripe price each. Their direct Stripe Payment Links still exist on
// Stripe's side but are no longer linked from the site.
const SECURITY_META = [
  { price: 'free', highlight: false, stripeKey: null as string | null, directUrl: null as string | null, contact: true, outputs: ['Investigation Report', 'Technical Findings'] },
  { price: '€9,500', highlight: true, stripeKey: null as string | null, directUrl: 'https://buy.stripe.com/9B67sN6OI4rB5Y12367N60S', contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Technical Findings', 'Recommendations', 'Optional Retest'] },
  { price: '€18,000', highlight: false, stripeKey: null as string | null, directUrl: 'https://buy.stripe.com/aFa4gB4GA3nx1HLgY07N60T', contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Optional Retest'] },
  { price: 'from €50,000', highlight: false, stripeKey: null as string | null, directUrl: 'https://buy.stripe.com/dRm8wRdd67DN1HLbDG7N60U', contact: true, outputs: ['Investigation Report', 'Risk Matrix', 'Evidence Map', 'Recommendations'] },
] as const

const MARKET_META = [
  { price: '€3,500', highlight: true, stripeKey: 'first_light', directUrl: 'https://buy.stripe.com/aFacN7dd64rB0DHazC7N60J', outputs: ['Investigation Report'] },
  { price: '€9,500', highlight: false, stripeKey: 'competitive_trace', directUrl: 'https://buy.stripe.com/9B6eVf3Cw2jt869cHK7N60K', outputs: ['Investigation Report', 'Evidence Map', 'Technical Findings'] },
  { price: '€22,000', highlight: false, stripeKey: 'sector_map', directUrl: 'https://buy.stripe.com/5kQeVf4GA6zJ1HL0Z27N60L', outputs: ['Investigation Report', 'Risk Matrix'] },
  { price: '€6,500 / mo', highlight: false, stripeKey: 'signal', directUrl: 'https://buy.stripe.com/3cI28tgpi5vFcmp4be7N60M', outputs: ['Investigation Report', 'Recommendations'] },
] as const

const TECHNICAL_META = [
  { price: 'from €12,000', highlight: true, stripeKey: 'agent_deployment', directUrl: 'https://buy.stripe.com/aFa00l6OIcY7eux4be7N60N', contact: false, outputs: ['Architecture Plan', 'Prototype', 'Validation Criteria'] },
  { price: 'from €24,000', highlight: false, stripeKey: 'custom_stack', directUrl: 'https://buy.stripe.com/8x2cN76OI1fp725gY07N60O', contact: false, outputs: ['Custom System', 'Source Code', 'Documentation'] },
  { price: 'from €8,500', highlight: false, stripeKey: 'architecture_lab', directUrl: 'https://buy.stripe.com/7sY14p7SMaPZ4TXdLO7N60Q', contact: false, outputs: ['Research Plan', 'Architecture Design', 'Prototype'] },
  { price: 'from €50,000', highlight: false, stripeKey: 'full_spectrum_deploy', directUrl: 'https://buy.stripe.com/9B68wReha2jt5Y1bDG7N60R', contact: false, outputs: ['Full Deployment', 'Integration', 'Training', 'Ongoing Support'] },
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
  const technicalTiers = t.pricing.technical.map((tier, i) => ({ ...tier, ...TECHNICAL_META[i] }))

  return (
    <section id="pricing" style={{ padding: '48px 2rem 72px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{t.pricing.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}><ScrambleHeading text={t.pricing.heading} /></h2>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
            {t.pricing.subheading}
          </p>
        </Reveal>

        {/* Business Intelligence - now the FIRST product line (2026-08-12):
            the decompiled-app corpus is the asset; the tiers are queries against
            it, not bespoke report-writing. */}
        <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 20, padding: '32px 24px', marginBottom: 48, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>{t.pricing.lineHeadings.market}<ScopeTag label={t.pricing.scopeTags.market} /></p>
        <TierCarousel tiers={marketTiers} getActions={tier => {
          const full = marketTiers.find(s => s.tier === tier.tier)!
          return { onBuy: () => openCheckoutModal({ key: full.stripeKey, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) }
        }} />
        </div>

        {/* Technical Intelligence & Systems - second product line: AI integration,
            custom systems, research architecture. No Stripe checkout for these tiers
            by default - they route to proposal/contact. */}
        <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 20, padding: '32px 24px', marginBottom: 48, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>{t.pricing.lineHeadings.technical}<ScopeTag label={t.pricing.scopeTags.technical} /></p>
        <TierCarousel tiers={technicalTiers} getActions={tier => {
          const full = technicalTiers.find(s => s.tier === tier.tier)!
          return { onBuy: () => openCheckoutModal({ key: full.stripeKey, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, directUrl: full.directUrl ?? undefined }) }
        }} />
        </div>

        {/* Security Audit tiers - featured-tier carousel. Collapsed to 4 tiers
            (2026-08-12, same treatment as Business Intelligence): Public (free,
            highlight:false) + Remediation Advisory (highlighted/recommended) +
            Confidential (NDA) + Enterprise & Critical Infrastructure (merged
            top tier, proposal-only). One big card + a filmstrip of the rest,
            per product line - see `TierCarousel`. */}
        <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 20, padding: '32px 24px', marginBottom: 0, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        <p id="pricing-security" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center', scrollMarginTop: 96 }}>{t.pricing.lineHeadings.security}<ScopeTag label={t.pricing.scopeTags.security} /></p>
        <TierCarousel tiers={securityTiers} getActions={tier => {
          const full = securityTiers.find(s => s.tier === tier.tier)!
          return {
            onBuy: full.stripeKey ? () => openCheckoutModal({ key: full.stripeKey!, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, directUrl: full.directUrl ?? undefined }) : undefined,
            onProposal: full.contact ? () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) : undefined,
          }
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
