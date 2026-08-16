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
import { useState } from 'react'
import { ScopeTag, TierCarousel, Reveal, ScrambleHeading, useMobile } from './shared'
import { useLocale } from '../../hooks/useLocale'

type CheckoutInfo = { key: string; tier: string; desc: string; price: string; delivery?: string; directUrl?: string; bullets?: readonly string[]; bring?: readonly string[]; mechanism?: readonly string[]; receive?: readonly string[] }
type ProposalInfo = { tier: string; desc: string; price: string; delivery?: string; bullets?: readonly string[]; bring?: readonly string[]; mechanism?: readonly string[]; receive?: readonly string[] }

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
  // directUrl removed (2026-08-15, live feedback): this tier had both a Stripe
  // link AND a contact button at once - highest tier in every line should be
  // contact-only, scope/price genuinely varies too much for a fixed checkout.
  { price: 'from €50,000', highlight: false, stripeKey: null as string | null, directUrl: null as string | null, contact: true, outputs: ['Investigation Report', 'Risk Matrix', 'Evidence Map', 'Recommendations'] },
] as const

const MARKET_META = [
  { price: '€3,500', highlight: true, stripeKey: 'first_light', directUrl: 'https://buy.stripe.com/aFacN7dd64rB0DHazC7N60J', contact: false, outputs: ['Investigation Report'] },
  { price: '€9,500', highlight: false, stripeKey: 'competitive_trace', directUrl: 'https://buy.stripe.com/9B6eVf3Cw2jt869cHK7N60K', contact: false, outputs: ['Investigation Report', 'Evidence Map', 'Technical Findings'] },
  // Highest one-time tier in this line - contact-only (2026-08-15, live feedback):
  // no Stripe link, "from" pricing since Sector Map's actual scope varies per sector.
  { price: 'from €22,000', highlight: false, stripeKey: null as string | null, directUrl: null as string | null, contact: true, outputs: ['Investigation Report', 'Risk Matrix'] },
  { price: '€6,500 / mo', highlight: false, stripeKey: 'signal', directUrl: 'https://buy.stripe.com/3cI28tgpi5vFcmp4be7N60M', contact: false, outputs: ['Investigation Report', 'Recommendations'] },
] as const

const TECHNICAL_META = [
  { price: 'from €12,000', highlight: true, stripeKey: 'agent_deployment', directUrl: 'https://buy.stripe.com/aFa00l6OIcY7eux4be7N60N', contact: false, outputs: ['Architecture Plan', 'Prototype', 'Validation Criteria'] },
  { price: 'from €24,000', highlight: false, stripeKey: 'custom_stack', directUrl: 'https://buy.stripe.com/8x2cN76OI1fp725gY07N60O', contact: false, outputs: ['Custom System', 'Source Code', 'Documentation'] },
  { price: 'from €8,500', highlight: false, stripeKey: 'architecture_lab', directUrl: 'https://buy.stripe.com/7sY14p7SMaPZ4TXdLO7N60Q', contact: false, outputs: ['Research Plan', 'Architecture Design', 'Prototype'] },
  // Highest tier in this line - contact-only (2026-08-15, live feedback): scope
  // varies too much for a fixed Stripe price, same treatment as Enterprise below.
  { price: 'from €50,000', highlight: false, stripeKey: null as string | null, directUrl: null as string | null, contact: true, outputs: ['Full Deployment', 'Integration', 'Training', 'Ongoing Support'] },
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
  const [activeOffer, setActiveOffer] = useState(0)
  const offerCount = 3
  const cycleOffer = (direction: number) => setActiveOffer(current => (current + direction + offerCount) % offerCount)
  // FIXED (live bug report + phone screenshot, 2026-08-16): the two round
  // prev/next buttons below used to sit INSIDE the same flex row as the offer
  // card, with flexShrink: 0. On a 380px phone that row had 316px to spend
  // (viewport minus the section gutter) and the arrows plus their two 16px gaps
  // took 128px of it before the card was measured at all, leaving the card
  // flex: 1 with exactly 188px. The card's own 24px glass padding, the featured
  // tier card's 16px padding and the EngagementFlow box's 16px padding then
  // stacked on top of that, so the "You receive" bullets rendered in a ~70px
  // column - "Ein Urteil:" / "wahr, falsch" / "oder" / "unbewiesen", four lines
  // for four words. The delivery/price badges at the card's foot looked fine
  // because they are nowrap and simply overflowed their box, which is why the
  // page container looked innocent. On phones the arrows now move OUT of the
  // row and join the dots in a single nav strip above the card, so the card
  // gets the full width; desktop keeps the side arrows it was designed with.
  const mobile = useMobile(640)
  const arrowStyle: React.CSSProperties = {
    width: mobile ? 40 : 48, height: mobile ? 40 : 48, borderRadius: '50%',
    border: '1px solid rgba(0,245,196,0.35)', background: 'var(--bg2)',
    color: 'var(--accent-text)', fontSize: mobile ? 17 : 20, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }
  const dots = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 7 }}>
      {[0, 1, 2].map(index => <button key={index} onClick={() => setActiveOffer(index)} aria-label={`Show access offer ${index + 1} of 3`} style={{
        width: 8, height: 8, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
        background: activeOffer === index ? 'var(--accent-text)' : 'rgba(255,255,255,0.18)',
      }} />)}
    </div>
  )

  return (
    <section id="pricing" style={{ padding: '16px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}><ScrambleHeading text={t.pricing.heading} /></h2>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
            {t.pricing.subheading}
          </p>
        </Reveal>

        {/* id + scrollMarginTop (live feedback 2026-08-16): clicking "Access" in the
            nav used to jump to the very top of this section - the heading/subheading,
            with the actual offer card below the fold on mobile. The heading stays
            reachable by scrolling up further; the nav click now lands on the card
            itself so the offer is what you see immediately. */}
        {/* Phone nav strip - arrows + dots in one row ABOVE the card. Above, not
            below, because a single offer card is several thousand px tall on a
            phone: controls placed under it are effectively unreachable, and
            #pricing-offer is also the nav's scroll target, so the controls are
            the first thing in view when "Access" is tapped. */}
        {mobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 14 }}>
            <button onClick={() => cycleOffer(-1)} aria-label="Previous access offer" style={arrowStyle}>&larr;</button>
            {dots}
            <button onClick={() => cycleOffer(1)} aria-label="Next access offer" style={arrowStyle}>&rarr;</button>
          </div>
        )}

        <div id="pricing-offer" style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 1040, margin: '0 auto', scrollMarginTop: 84 }}>
          {!mobile && <button onClick={() => cycleOffer(-1)} aria-label="Previous access offer" style={arrowStyle}>&larr;</button>}

          <div style={{ flex: 1, minWidth: 0 }}>
            {activeOffer === 0 && (
                <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 20, padding: mobile ? '16px 14px' : '24px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}><p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{t.pricing.lineHeadings.market}</p><div style={{ marginTop: 8 }}><ScopeTag label={t.pricing.scopeTags.market} /></div></div>
                <TierCarousel tiers={marketTiers} getActions={tier => {
                  const full = marketTiers.find(s => s.tier === tier.tier)!
                  const hasCheckout = !!(full.stripeKey || full.directUrl)
                  return {
                    onBuy: hasCheckout ? () => openCheckoutModal({ key: full.stripeKey ?? full.tier, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, directUrl: full.directUrl ?? undefined, bullets: full.bullets, bring: full.bring, mechanism: full.mechanism, receive: full.receive }) : undefined,
                    onProposal: full.contact ? () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, bullets: full.bullets, bring: full.bring, mechanism: full.mechanism, receive: full.receive }) : undefined,
                  }
                }} />
              </div>
            )}

            {activeOffer === 1 && (
                <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 20, padding: mobile ? '16px 14px' : '24px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}><p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{t.pricing.lineHeadings.technical}</p><div style={{ marginTop: 8 }}><ScopeTag label={t.pricing.scopeTags.technical} /></div></div>
                <TierCarousel tiers={technicalTiers} getActions={tier => {
                  const full = technicalTiers.find(s => s.tier === tier.tier)!
                  const hasCheckout = !!(full.stripeKey || full.directUrl)
                  return {
                    onBuy: hasCheckout ? () => openCheckoutModal({ key: full.stripeKey ?? full.tier, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, directUrl: full.directUrl ?? undefined, bullets: full.bullets, bring: full.bring, mechanism: full.mechanism, receive: full.receive }) : undefined,
                    onProposal: full.contact ? () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, bullets: full.bullets, bring: full.bring, mechanism: full.mechanism, receive: full.receive }) : undefined,
                  }
                }} />
              </div>
            )}

            {activeOffer === 2 && (
                <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 20, padding: mobile ? '16px 14px' : '24px 24px' }}>
                <div id="pricing-security" style={{ textAlign: 'center', marginBottom: 20, scrollMarginTop: 96 }}><p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{t.pricing.lineHeadings.security}</p><div style={{ marginTop: 8 }}><ScopeTag label={t.pricing.scopeTags.security} /></div></div>
                <TierCarousel tiers={securityTiers} getActions={tier => {
                  const full = securityTiers.find(s => s.tier === tier.tier)!
                  const hasCheckout = !!(full.stripeKey || full.directUrl)
                  return {
                    onBuy: hasCheckout ? () => openCheckoutModal({ key: full.stripeKey ?? full.tier, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, directUrl: full.directUrl ?? undefined, bullets: full.bullets, bring: full.bring, mechanism: full.mechanism, receive: full.receive }) : undefined,
                    onProposal: full.contact ? () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, bullets: full.bullets, bring: full.bring, mechanism: full.mechanism, receive: full.receive }) : undefined,
                  }
                }} />
              </div>
            )}
          </div>

          {!mobile && <button onClick={() => cycleOffer(1)} aria-label="Next access offer" style={arrowStyle}>&rarr;</button>}
        </div>
        {/* Desktop keeps its dots under the card; on phones they are already in
            the nav strip above, rendering them twice would just be noise. */}
        {!mobile && <div style={{ marginTop: 18 }}>{dots}</div>}

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
