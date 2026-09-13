// "Pricing" section (`#pricing`) - extracted verbatim from PublicSite.tsx.
//
// i18n note: domain copy (tagline/scope/bring/we/receive/cta/badge/delivery)
// comes from the current locale's t.pricing.domains array
// (frontend/src/content/en.ts + de.ts).
//
// REBUILT 2026-09-12 (Simeon, live direction): the three-tier ladder (First
// Light / Deep Field / You vs. the World), one card at a time behind arrows,
// is gone. It read as three separate brochures written by three consultants
// who never met each other, and nobody understood which of the three product
// lines they were even looking at. Replaced with five stacked service-line
// cards - Intelligence / Security / Data / Business & Market / Engineering -
// each answering "what can I hand you / what do you actually do to it / what
// comes back" for one concrete domain instead of a grab-bag list spanning all
// of them at once. No more carousel: five real cards, one scroll, no arrows/
// dots/cross-fade to navigate past.
//
// Pricing itself is no longer per-card - none of the five domains carry a
// price, depth is scoped per engagement, not read off a fixed tier name. Each
// card keeps its own delivery estimate (live direction: "delivered in xy days
// soll bitte direkt in jeder karte drin sein"), same figure on all five since
// there is no longer a differentiated tier to hang a different number on. The
// entry price and the "talk to us instead" line, that used to repeat on every
// one of the three old tier cards, now appear exactly once, as a real CTA
// button below all five domains (not a small footnote link - live direction:
// "dass soll keine fussnote werden sondern ein gscheider CTA den man sehen
// kann").
import { EngagementFlow, CartIcon, ZapIcon, Reveal, useMobile } from './shared'
import { useLocale } from '../../hooks/useLocale'

type PricingDomain = {
  name: string; badge: string; scope: string
  bring?: string; we?: string; receive?: string; cta: string; delivery: string
  startingFrom?: string
}

// One full domain card - number + name, a domain-specific scope badge (each
// domain gets its own, not the one generic badge repeated five times), the
// tagline/scope sentence, the You bring / We / You receive diagram, then a
// bottom bar with the delivery estimate on the left and a single action CTA
// on the right that names how this domain actually gets used ("Bring us the
// question", "Put it to the test", ...) instead of a price. Clicking it goes
// straight to the contact form with the domain pre-filled as the topic, same
// mechanism the old tier cards used (PublicSite.tsx's selectTier).
function DomainCard({
  domain, mobile, onSelectTier,
}: {
  domain: PricingDomain
  mobile: boolean
  onSelectTier: (topic: string) => void
}) {
  const { t } = useLocale()
  return (
    <div className="rfi-pricing-scene">
      <div className="rfi-pricing-glow" aria-hidden="true" />
      {/* Top padding trimmed down from the card's own edge - live feedback
          2026-09-13: "the space above each header ... is too much", wanted
          the title pulled up closer to the card's top edge. Left/right/bottom
          padding unchanged. */}
      <div className="rfi-pricing-card" style={{ padding: mobile ? '16px 20px 24px' : '20px 34px 36px' }}>
        <p style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', margin: '0 0 10px' }}>{domain.name}</p>
        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text)', margin: '0 0 20px', maxWidth: 760 }}>{domain.scope}</p>
        <EngagementFlow bring={domain.bring} mechanism={domain.we} receive={domain.receive} large />
        {/* Delivery / starting price / CTA back in one bar (Simeon, 2026-09-13,
            second look) - the top-right price placement read fine on its own
            but front-loaded a number before the offer text, and the audit's
            actual intent was to anchor price right before the CTA, not up by
            the title. Three columns: delivery left, price middle, CTA right. */}
        <div className="rfi-pricing-bar" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          marginTop: 18, padding: mobile ? '10px 12px' : '11px 14px',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0, flex: '1 1 auto' }}>
            <span style={{ color: 'var(--accent-text)', flexShrink: 0, display: 'flex' }}><ZapIcon size={18} /></span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 9.5, fontWeight: 700,
                color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2,
              }}>{t.pricing.deliveryLabel}</div>
              <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 800, letterSpacing: '0.01em', lineHeight: 1.3 }}>{domain.delivery}</div>
            </div>
          </div>
          {domain.startingFrom && (
            <div style={{ minWidth: 0, borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
              <div style={{
                fontSize: 9.5, fontWeight: 700,
                color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2,
              }}>{t.pricing.startingFromLabel}</div>
              <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 800, letterSpacing: '0.01em', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{domain.startingFrom}</div>
            </div>
          )}
          <button type="button" onClick={() => onSelectTier(domain.name)} className="rfi-pricing-price-btn" style={{
            cursor: 'pointer', padding: '9px 16px', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 800,
            letterSpacing: '0.02em', whiteSpace: 'nowrap', color: 'var(--accent-text)',
          }}>{domain.cta}</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}><span className="rfi-pricing-badge">{domain.badge}</span></div>
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
  const domains = t.pricing.domains
  const mobile = useMobile(640)

  // Top padding matched to Data Solutions' .data-hero (56px) - live feedback
  // 2026-09-13: Access/Evidence/Data Solutions each had a different gap
  // under the floating nav pill; they should all read the same.
  return (
    <section id="pricing" style={{ padding: '56px var(--sec-pad-x) 120px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <Reveal>
          {/* h1, not h2 - same CRITICAL audit finding as TrackRecord.tsx: /access/
              rendered zero h1 elements. This section only renders on the access
              view, so there is no competing h1 on the homepage. Centered to match
              Data Solutions' .data-hero treatment and Evidence's heading block -
              live direction 2026-09-13: page headers/subheaders should read
              consistently across the site instead of Access/Evidence sitting
              left-aligned while Data Solutions centers. */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="wm-eyebrow">{t.pricing.eyebrow}</p>
            <h1 className="rfi-page-h1" style={{ marginBottom: 12 }}>{t.pricing.heading}</h1>
            <p style={{ color: 'var(--text2)', marginBottom: 40, maxWidth: 640 }}>
              {t.pricing.subheading}
            </p>
          </div>
        </Reveal>

        {/* Sticky card-stack effect (live direction 2026-09-13, "wie beim
            Durchblättern von Akten"): each card sticks a little lower than the
            one before it as you scroll, so the next card slides up and covers
            it, leaving only its title strip peeking out above - by the last
            card the whole stack reads as a deck of files with just the domain
            names showing. Pure CSS `position: sticky` per card + an
            increasing `top` offset and z-index, no scroll-tracking JS needed.
            `gap` is 0 here on purpose - any gap would leave a permanent seam
            between cards regardless of scroll position and break the
            overlapping-stack look; spacing between cards comes entirely from
            each card's own height plus the top-offset stagger. */}
        <div id="pricing-offer" style={{ display: 'flex', flexDirection: 'column', maxWidth: 900, margin: '0 auto', scrollMarginTop: 84 }}>
          {/* Each card's `paddingBottom` is how long it stays glued in place before
              releasing. A first attempt gave every card the SAME dwell as the
              last (padding = its own natural handoff + the last card's dwell),
              cascaded per remaining card - mathematically sound but produced an
              absurdly long dead scroll before anything visibly happened (live
              feedback 2026-09-13: "totally kaputt"). Corrected direction: keep
              the original per-card pacing (each hands off to the next quickly,
              same as before) and ONLY give every card enough extra padding to
              survive through the LAST card's own short dwell (DWELL, not the
              full cascading construction of every card after it) - so the
              five-card stack stays intact for exactly as long as Engineering
              pauses, then the whole assembled deck releases and scrolls to the
              CTA together, instead of individual cards falling back out mid-dwell. */}
          {domains.map((domain, i) => {
            const isLast = i === domains.length - 1
            // Lowered from 320 - live bug report 2026-09-13: this padding is
            // invisible while the card is still stuck, but once it releases
            // this exact amount becomes real, visible blank space in the
            // document before the closing CTA - 320px read as "a huge empty
            // gap" right before "Didn't find the right fit". 120 is still
            // enough for the other four cards to survive Engineering's own
            // brief dwell without the gap being the dominant thing on screen.
            const DWELL = 120
            const paddingBottom = isLast ? DWELL : 40 + DWELL
            // Base offset and per-card step both trimmed to match the card's
            // own reduced top padding (live feedback 2026-09-13) - the peek
            // window used to be tuned for the old, taller header block, so
            // after the padding cut it exposed a sliver of the scope
            // sentence below the title instead of ending cleanly at it.
            // Slug-based id per card (e.g. "pricing-data") so other pages can
            // deep-link straight to one offer instead of just the top of
            // Access - added for Data Solutions' new cross-link (2026-09-13).
            const slug = domain.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            return (
            <div key={domain.name} id={`pricing-${slug}`} style={{ position: 'sticky', top: `${78 + i * 68}px`, zIndex: i + 1, paddingBottom, scrollMarginTop: 84 }}>
              <Reveal delay={i * 0.05}>
                <DomainCard domain={domain} mobile={mobile} onSelectTier={onSelectTier} />
              </Reveal>
            </div>
            )
          })}
        </div>

        {/* Closing CTA - a real, visible button, not a small muted footnote link
            (live direction 2026-09-12). Sits once below all five domains: if
            none of them is the right fit, or an engagement spans several, this
            is where that conversation starts. The entry price stays as a small
            trust anchor underneath, not the focus of the block. */}
        <Reveal delay={domains.length * 0.05}>
          {/* margin-top removed (Zabih, 2026-09-13): the last card's own DWELL
              padding-bottom (120px, for the sticky-stack release effect) already
              provided the top clearance - the extra 48px on top of that made the
              gap above this button visibly bigger than the section's bottom
              padding below it. Section bottom padding raised to match (72->120)
              instead, so both sides read as the same amount of breathing room. */}
          <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
            <button type="button" onClick={() => onSelectTier('Other')} className="rfi-pricing-price-btn" style={{
              cursor: 'pointer', padding: mobile ? '14px 22px' : '16px 32px', width: mobile ? '100%' : undefined,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontSize: mobile ? 14.5 : 15.5, fontWeight: 800, letterSpacing: '0.01em',
            }}>
              <span style={{ color: 'var(--accent-text)', display: 'flex' }}><CartIcon /></span>
              <span style={{ color: 'var(--text)' }}>{t.checkoutModal.talkFirstInstead}</span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
