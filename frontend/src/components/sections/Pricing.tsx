// "Pricing" section (`#pricing`) - extracted verbatim from PublicSite.tsx.
// Checkout/proposal modal state lives at the page level (shared with the
// Coop Partners section's own buy buttons and the checkout/proposal modal
// chrome itself), so the open functions are passed in as props.
//
// i18n note: tier copy (bring/mechanism/receive/delivery) now comes from the
// current locale's t.pricing.tiers array (frontend/src/content/en.ts + de.ts),
// zipped by index with the locale-independent technical metadata below
// (price, stripeKey, directUrl, contact flag).
//
// REBUILT 2026-08-21 (Simeon, live direction): the three separate product
// lines (Business Intelligence / Technical Intelligence / Security), each a
// 1-featured-tier-plus-3-upsell carousel you had to arrow through, are gone.
// One unified three-stage ladder replaces all of it - First Light, Deep
// Field, You vs. the World - the same "Three Stages" language already used
// in disclosure/collaboration outreach (see
// ~/rfi-irfos-skills/appsec/references/collaboration_offer_template.md),
// generalised here so it reads as the site's one pricing model rather than
// an app-review-specific pitch. No more upsell teaser cards: every card
// already carries what the old upsells used to add separately.
//
// CORRECTED same day: a first pass showed all three cards side by side in a
// static grid - wrong, Simeon wanted the same one-card-at-a-time-plus-arrows
// navigation the old three product lines used, just cycling through these
// three tiers instead of three lines (arrows/dots/mobile-nav-strip logic
// below is the same shape that lived directly in this file before the
// extraction, not reinvented). Also fixed a real duplication bug from that
// same first pass: the price rendered twice per card (once via the
// `PriceDelivery` helper, once again as the buy button's own label) because
// both were wired in at once - reverted to the original pattern, price
// appears exactly once, as the button's label, delivery sits in its own
// pill beside it.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScopeTag, EngagementFlow, CartIcon, Reveal, ScrambleHeading, useMobile, prefersReducedMotion } from './shared'
import { useLocale } from '../../hooks/useLocale'

// Technical metadata only, one entry per tier, same order as t.pricing.tiers
// so index-zipping lines them up correctly.
//
// All three tiers are contact-only now (2026-08-21, corrected same day as the
// "also contact form" request above: Simeon wanted one consistent pill on
// every card leading to the contact form, not a Stripe checkout on First
// Light and contact-only on the other two). First Light's Stripe Payment Link
// stays defined here in case it comes back later, just not wired into the
// card below anymore.
const TIER_META = [
  { price: 'from €9,500', stripeKey: 'first_light', directUrl: 'https://buy.stripe.com/aFacN7dd64rB0DHazC7N60J', contact: true },
  { price: 'from €15,000', stripeKey: null as string | null, directUrl: null as string | null, contact: true },
  { price: 'from €50,000', stripeKey: null as string | null, directUrl: null as string | null, contact: true },
] as const

type PricingTier = {
  tier: string; delivery?: string
  bring?: readonly string[]; mechanism?: readonly string[]; receive?: readonly string[]
  price: string; stripeKey: string | null; directUrl: string | null; contact: boolean
}

// One full, self-contained offer card - title, scope badge, the You bring /
// We / You receive diagram, then a delivery pill plus a single CTA button
// whose own label IS the price (never render the price a second time
// elsewhere on the card - see the file header note on the duplication bug).
function PricingOfferCard({
  tier, scopeTag, mobile, onSelectTier,
}: {
  tier: PricingTier
  scopeTag: string
  mobile: boolean
  onSelectTier: (tier: string) => void
}) {
  return (
    <div className="rfi-glass-flat rfi-glass-solid" style={{ borderRadius: 20, padding: mobile ? '16px 14px' : '24px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 21, fontWeight: 900, color: 'var(--text)', margin: 0 }}>{tier.tier}</p>
        <div style={{ marginTop: 8 }}><ScopeTag label={scopeTag} /></div>
      </div>
      <EngagementFlow bring={tier.bring} mechanism={tier.mechanism} receive={tier.receive} large />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
        {tier.delivery && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, flex: '0 0 auto', maxWidth: '100%',
            background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.3)',
            borderRadius: 10, padding: '6px 12px',
            color: 'var(--accent-text)', fontSize: 12, fontWeight: 600, lineHeight: 1.5,
          }}>
            <span style={{ minWidth: 0, whiteSpace: 'nowrap' }}>{tier.delivery}</span>
          </div>
        )}
        {/* Translucent, not solid (live feedback 2026-08-21: "nicht direkt wie n
            kaufen button ausschaut" - this goes to the contact form now, not a
            checkout, so it shouldn't read as a "buy" button). Same teal, same
            shape, just dim against the background - same visual language as
            the delivery pill beside it. */}
        <button type="button" onClick={() => onSelectTier(tier.tier)} style={{
          borderRadius: 8, cursor: 'pointer', padding: '9px 16px', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800,
          letterSpacing: '0.02em', whiteSpace: 'nowrap',
          background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent-text)',
        }}>
          <CartIcon />
          {tier.price}
        </button>
      </div>
    </div>
  )
}

export function PricingSection({
  onSelectTier,
}: {
  onSelectTier: (tier: string) => void
}) {
  const { t } = useLocale()
  const tiers = t.pricing.tiers.map((tier, i) => ({ ...tier, ...TIER_META[i] }))
  const [active, setActive] = useState(0)
  const count = tiers.length
  const cycle = (direction: number) => setActive(current => (current + direction + count) % count)
  const mobile = useMobile(640)
  const reduced = prefersReducedMotion()
  const arrowStyle: React.CSSProperties = {
    width: mobile ? 40 : 48, height: mobile ? 40 : 48, borderRadius: '50%',
    border: '1px solid rgba(0,245,196,0.35)', background: 'var(--bg2)',
    color: 'var(--accent-text)', fontSize: mobile ? 17 : 20, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }
  const dots = (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 7 }}>
      {tiers.map((tier, index) => <button key={tier.tier} onClick={() => setActive(index)} aria-label={`Show tier ${index + 1} of ${count}`} style={{
        width: 8, height: 8, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
        background: active === index ? 'var(--accent-text)' : 'rgba(255,255,255,0.18)',
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
            <button onClick={() => cycle(-1)} aria-label="Previous tier" style={arrowStyle}>&larr;</button>
            {dots}
            <button onClick={() => cycle(1)} aria-label="Next tier" style={arrowStyle}>&rarr;</button>
          </div>
        )}

        <div id="pricing-offer" style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 720, margin: '0 auto', scrollMarginTop: 84 }}>
          {!mobile && <button onClick={() => cycle(-1)} aria-label="Previous tier" style={arrowStyle}>&larr;</button>}
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            {/* Soft cross-fade on tier change (2026-08-21 live feedback) - AnimatePresence
                mode="wait" so the outgoing card fully fades before the incoming one starts,
                never a jarring overlap. Skipped entirely under reduced-motion. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={tiers[active].tier}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}>
                <PricingOfferCard tier={tiers[active]} scopeTag={t.pricing.scopeTag} mobile={mobile} onSelectTier={onSelectTier} />
              </motion.div>
            </AnimatePresence>
          </div>
          {!mobile && <button onClick={() => cycle(1)} aria-label="Next tier" style={arrowStyle}>&rarr;</button>}
        </div>
        {/* Desktop keeps its dots under the card; on phones they are already in
            the nav strip above, rendering them twice would just be noise. */}
        {!mobile && <div style={{ marginTop: 18 }}>{dots}</div>}

        {/* Research Cooperation Products - via our coop partner Laura Serna
            Gaviria / Emergent Interaction Lab. No Stripe checkout: these are
            bespoke engagements, always "on request" via #contact. See the
            COOP PARTNERS section below for who Laura is and the crates. */}
      </div>
    </section>
  )
}
