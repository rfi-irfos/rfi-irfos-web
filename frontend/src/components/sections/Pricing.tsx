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
      <div className="rfi-pricing-card" style={{ padding: mobile ? '24px 20px' : '36px 34px' }}>
        <p style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', margin: '0 0 10px' }}>{domain.name}</p>
        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text)', margin: '0 0 20px', maxWidth: 760 }}>{domain.scope}</p>
        <EngagementFlow bring={domain.bring} mechanism={domain.we} receive={domain.receive} large />
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

  return (
    <section id="pricing" style={{ padding: '16px var(--sec-pad-x) 72px' }}>
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
          {domains.map((domain, i) => (
            <div key={domain.name} style={{ position: 'sticky', top: `${80 + i * 76}px`, zIndex: i + 1, paddingBottom: 40 }}>
              <Reveal delay={i * 0.05}>
                <DomainCard domain={domain} mobile={mobile} onSelectTier={onSelectTier} />
              </Reveal>
            </div>
          ))}
        </div>

        {/* Closing CTA - a real, visible button, not a small muted footnote link
            (live direction 2026-09-12). Sits once below all five domains: if
            none of them is the right fit, or an engagement spans several, this
            is where that conversation starts. The entry price stays as a small
            trust anchor underneath, not the focus of the block. */}
        <Reveal delay={domains.length * 0.05}>
          <div style={{ maxWidth: 620, margin: '48px auto 0', textAlign: 'center' }}>
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
