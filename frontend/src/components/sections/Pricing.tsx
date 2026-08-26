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
import { EngagementFlow, CartIcon, ZapIcon, Reveal, useMobile, prefersReducedMotion } from './shared'
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
// `amount` is locale-independent (the € figure never changes), but the "from"/
// "ab" prefix is locale text - kept out of this array and prepended at
// zip-time in PricingSection using t.pricing.priceFrom, so German never
// shows the English word "from" (fixed 2026-08-25, live feedback: the price
// button read "from €15,000" even with the DE locale active).
const TIER_META = [
  { amount: '€9,500', stripeKey: 'first_light', directUrl: 'https://buy.stripe.com/aFacN7dd64rB0DHazC7N60J', contact: true },
  { amount: '€15,000', stripeKey: null as string | null, directUrl: null as string | null, contact: true },
  { amount: '€50,000', stripeKey: null as string | null, directUrl: null as string | null, contact: true },
] as const

type PricingTier = {
  tier: string; delivery?: string
  bring?: string; mechanism?: string; receive?: string
  price: string; amount: string; stripeKey: string | null; directUrl: string | null; contact: boolean
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
  const { t } = useLocale()
  // FULL REDESIGN 2026-08-25 ("premium dark futuristic intelligence interface",
  // Simeon's exact written spec + reference mockup, matched as closely as inline
  // React styles + a few real CSS classes for the pseudo-element border/tilt
  // allow - see .rfi-pricing-* in index.css). Card silhouette, icon-per-row
  // sections (now in EngagementFlow itself), and this bottom price bar are the
  // three pieces the spec called out as most load-bearing.
  return (
    <div className="rfi-pricing-scene">
      <div className="rfi-pricing-glow" aria-hidden="true" />
      {/* min-height + flex column + marginTop:auto on the bottom block anchors the
          delivery/price bar and the "talk to us" line to the bottom of the card
          consistently across all 3 tiers, even though their bring/mechanism/
          receive prose runs to different lengths (live feedback 2026-08-25: "too
          much differencies ... place this more down to the bottom of the card"). */}
      <div className="rfi-pricing-card" style={{ padding: mobile ? '24px 20px' : '36px 34px', display: 'flex', flexDirection: 'column', minHeight: mobile ? undefined : 560 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: mobile ? 26 : 32, fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f6f6', margin: 0 }}>{tier.tier}</p>
          <div style={{ marginTop: 10 }}><span className="rfi-pricing-badge">{scopeTag}</span></div>
        </div>
        <EngagementFlow bring={tier.bring} mechanism={tier.mechanism} receive={tier.receive} large />
        <div style={{ marginTop: 'auto' }}>
          {/* Recessed bottom panel: delivery split into a small label line + a bold
              value line (the existing full sentence, wording untouched), price as
              the strongest element on the card - "from"/"ab" in teal, the amount in
              white, inside its own glowing outlined control. Sized down a step
              2026-08-25 (live feedback: "delivery and from and all could be a tad
              smaller") and no longer forced into JetBrains Mono for the label,
              same reasoning as the badge above. */}
          <div className="rfi-pricing-bar" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            marginTop: 18, padding: mobile ? '10px 12px' : '11px 14px',
          }}>
            {tier.delivery && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0, flex: '1 1 auto' }}>
                <span style={{ color: 'var(--accent-text)', flexShrink: 0, display: 'flex' }}><ZapIcon size={18} /></span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 9.5, fontWeight: 700,
                    color: '#00e8d0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2,
                  }}>{t.pricing.deliveryLabel}</div>
                  <div style={{ color: '#f4f6f6', fontSize: 13, fontWeight: 800, letterSpacing: '0.01em', lineHeight: 1.3 }}>{tier.delivery}</div>
                </div>
              </div>
            )}
            <button type="button" onClick={() => onSelectTier(tier.tier)} className="rfi-pricing-price-btn" style={{
              cursor: 'pointer', padding: '9px 16px', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 800,
              letterSpacing: '0.02em', whiteSpace: 'nowrap',
            }}>
              <span style={{ color: 'var(--accent-text)', display: 'flex' }}><CartIcon /></span>
              <span style={{ color: 'var(--accent-text)', textTransform: 'uppercase' }}>{t.pricing.priceFrom}</span>
              <span style={{ color: '#fff' }}>{tier.amount}</span>
            </button>
          </div>
          <p style={{ textAlign: 'center', margin: '14px 0 0', fontSize: 12, color: 'var(--text3)' }}>
            <a href="#submit" style={{ color: 'inherit' }}>{t.checkoutModal.talkFirstInstead}</a>
          </p>
        </div>
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
  const tiers = t.pricing.tiers.map((tier, i) => ({ ...tier, ...TIER_META[i], price: `${t.pricing.priceFrom} ${TIER_META[i].amount}` }))
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
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>{t.pricing.heading}</h2>
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

        {/* Widened 720->1180 (live feedback 2026-08-25: "die karte darf den screen
            fullen, rechteck format, dann passt alles rein" - paired with
            EngagementFlow's 3-column grid for `large`, below, a wide rectangular
            card replaces three stacked paragraph blocks with three side-by-side
            columns, collapsing total card height instead of just wrapping text
            differently). */}
        <div id="pricing-offer" style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 1280, margin: '0 auto', scrollMarginTop: 84 }}>
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
