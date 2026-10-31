// "Pricing" section (`#pricing`) - extracted verbatim from PublicSite.tsx.
//
// i18n note: domain copy (tagline/scope/bring/we/receive/cta/badge/delivery)
// comes from the current locale's t.pricing.domains array
// (frontend/src/content/en.ts + de.ts).
//
// REBUILT 2026-10-14 (initial-review/pricing redesign): the sticky
// five-card domain stack was the whole hero. It's now a secondary
// "Need something else?" row below the real hero: a standalone Free
// card, a 4-tier subscription stack (Starter/Growth/Pro/Business) and an
// Enterprise band. The five domains (Intelligence/Security/Data/
// Business & Market/Engineering) still exist and still route into the
// contact form via onSelectTier - they're the second commercial motion
// (custom intelligence/engineering work) sitting alongside the new
// productized-appsec subscription product, not replaced by it.
//
// REVISED same day (live direction, second pass): the first cut of this
// rebuild rendered the four tiers as a static 4-column grid - flagged as
// unclear and "can't go live" because nothing on the page said what you
// were looking at.
//
// REVISED again same day (live direction, third pass): tried reusing the
// five-domain DomainCard stack's sticky-overlap effect (each tier sticks a
// little lower than the one before it, next price slides over the last) -
// flagged as "absolute crap" once live, because a compact pricing card has
// no natural tall header the way a domain card does: the peeking strip
// compressed down to just name+price with the "Most popular" badge cutting
// through the seam, reading as broken cards rather than a deck of files.
// Settled on a plain vertical stack instead - every tier card fully
// visible, full price, full checkmark list, no overlap at any scroll
// position.
//
// REVISED again same day (live direction, fourth pass): rebuilt as a
// side-by-side 4-column comparison grid with a Monthly/Annual toggle, so
// the four tiers can be read against each other directly instead of
// scrolled through one at a time. Annual prices are computed client-side
// (10x monthly - backend only has monthly Stripe price IDs, see
// backend/src/stripe.rs's tier_info()) and route to a contact request
// instead of onCheckout, since there is no live annual price to charge.
import { EngagementFlow, Reveal, useMobile } from './shared'
import { useLocale, type Locale } from '../../hooks/useLocale'
import { InitialReviewFlow } from './InitialReviewFlow'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconBulb, IconShieldLock, IconDatabase, IconTrendingUp, IconTerminal2 } from '@tabler/icons-react'

// One icon per "Need something else?" domain, same neutral-colour convention
// as Squad.tsx's NEED_TO_KNOW_ICONS (--icon-neutral, 2026-09-12: a calm
// shared highlight reads better here than a different colour per item).
const DOMAIN_ICONS: Record<string, typeof IconBulb> = {
  Intelligence: IconBulb, Security: IconShieldLock, Data: IconDatabase,
  'Business & Market': IconTrendingUp, Engineering: IconTerminal2,
}

type PricingDomain = {
  name: string; badge: string; scope: string
  bring?: string; we?: string; receive?: string; cta: string; delivery: string
}

type PricingTier = {
  name: string; price: string; tagline: string; features: string[]; cta: string
  stripeKey: string; popular?: boolean
}

function annualPrice(monthlyPrice: string, locale: Locale): string {
  const n = Number(monthlyPrice.replace(/[^0-9]/g, ''))
  const annual = n * 10
  return `€${new Intl.NumberFormat(locale === 'de' ? 'de-AT' : 'en-US').format(annual)}`
}

// Unified comparison panel (live direction, fifth pass): the four tiers
// used to be separate floating cards with gaps between them - flagged as
// "too disjointed". Rebuilt as one bordered panel with thin internal
// column dividers (TierCard renders no border/background of its own, the
// panel wrapper owns those), the Enterprise band attached directly below
// with no gap, and a square-cornered tab toggle instead of a pill.
function TierCard({
  tier, billing, onCheckout, onSelectTier,
}: {
  tier: PricingTier; billing: 'monthly' | 'annual'
  onCheckout: (stripeKey: string) => void; onSelectTier: (tier: string) => void
}) {
  const { t, locale } = useLocale()
  const b = t.pricing.billing
  return (
    <div style={{ padding: '36px 28px', display: 'flex', flexDirection: 'column', gap: 13, height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text2)', margin: 0 }}>{tier.name}</p>
        {tier.popular && (
          <span style={{ fontSize: 'var(--fs-label)', fontWeight: 700, color: '#f97316', whiteSpace: 'nowrap' }}>{t.pricing.mostPopular}</span>
        )}
      </div>
      <div style={{ overflow: 'hidden' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={billing}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <span style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, color: 'var(--text)' }}>{billing === 'monthly' ? tier.price : annualPrice(tier.price, locale)}</span>
            <span style={{ fontSize: 'var(--fs-body)', color: 'var(--text2)' }}> {billing === 'monthly' ? b.perMonth : `/${b.annual.toLowerCase()}`}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <p style={{ fontSize: 'var(--fs-body)', color: 'var(--text2)', margin: 0, lineHeight: 'var(--lh-body)', minHeight: 44 }}>{tier.tagline}</p>
      <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0 6px' }} />
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
        {tier.features.map(f => (
          <li key={f} style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--text)', display: 'flex', gap: 9 }}>
            <span style={{ color: 'var(--accent-text)', fontWeight: 700 }}>✓</span>{f}
          </li>
        ))}
      </ul>
      <AnimatePresence initial={false}>
        {billing === 'annual' && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', margin: 0, overflow: 'hidden' }}
          >{b.annualNote}</motion.p>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => billing === 'monthly' ? onCheckout(tier.stripeKey) : onSelectTier(`${tier.name} (${b.annual})`)}
        style={{
          background: tier.popular ? '#f97316' : 'transparent',
          color: tier.popular ? '#1a0f00' : 'var(--text)',
          border: tier.popular ? 'none' : '1px solid var(--border)',
          padding: '14px 18px', borderRadius: 8, fontWeight: 700, fontSize: 'var(--fs-body)', cursor: 'pointer', marginTop: 6,
        }}>{billing === 'monthly' ? tier.cta : b.annualCta}</button>
    </div>
  )
}

function FreeTierCard({ onOpen }: { onOpen: () => void }) {
  const { t } = useLocale()
  const f = t.pricing.freeCard
  return (
    <div style={{ padding: '36px 28px', display: 'flex', flexDirection: 'column', gap: 13, height: '100%', boxSizing: 'border-box' }}>
      <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text2)', margin: 0 }}>{f.label}</p>
      <div>
        <span style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, color: 'var(--text)' }}>{f.price}</span>
      </div>
      <p style={{ fontSize: 'var(--fs-body)', color: 'var(--text2)', margin: 0, lineHeight: 'var(--lh-body)', minHeight: 44 }}>{f.tagline}</p>
      <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0 6px' }} />
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11, flex: 1 }}>
        {f.features.map(feat => (
          <li key={feat} style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--text)', display: 'flex', gap: 9 }}>
            <span style={{ color: 'var(--accent-text)', fontWeight: 700 }}>✓</span>{feat}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onOpen} style={{
        background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)',
        padding: '14px 18px', borderRadius: 8, fontWeight: 700, fontSize: 'var(--fs-body)', cursor: 'pointer', marginTop: 6,
      }}>{f.cta}</button>
    </div>
  )
}

function BillingToggle({ billing, onChange }: { billing: 'monthly' | 'annual'; onChange: (b: 'monthly' | 'annual') => void }) {
  const { t } = useLocale()
  const b = t.pricing.billing
  const opt = (value: 'monthly' | 'annual', label: string, borderLeft: boolean) => (
    <button type="button" onClick={() => onChange(value)} style={{
      position: 'relative', zIndex: 1,
      background: 'transparent',
      color: billing === value ? '#1a0f00' : 'var(--text2)',
      border: 'none', borderLeft: borderLeft ? '1px solid var(--border)' : 'none',
      padding: '12px 24px', fontWeight: 700, fontSize: 'var(--fs-small)', cursor: 'pointer',
      transition: 'color 0.2s ease',
    }}>{label}</button>
  )
  return (
    <div style={{ position: 'relative', display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
      <motion.div
        animate={{ left: billing === 'monthly' ? '0%' : '50%' }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', background: '#f97316' }}
      />
      {opt('monthly', b.monthly, false)}
      {opt('annual', b.annual, true)}
    </div>
  )
}

function NeedSomethingElseRow({ domains, onSelectTier }: { domains: PricingDomain[]; onSelectTier: (t: string) => void }) {
  const { t } = useLocale()
  return (
    <div style={{ borderTop: '1px solid var(--border)', marginTop: 32, paddingTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 18px' }}>
      <span style={{ fontSize: 'var(--fs-small)', fontWeight: 700, color: 'var(--text)' }}>{t.pricing.needSomethingElse}</span>
      {domains.map((d, i) => {
        const Icon = DOMAIN_ICONS[d.name]
        return (
          <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button type="button" onClick={() => onSelectTier(d.name)} style={{ background: 'none', border: 'none', color: 'var(--accent-text)', fontWeight: 700, fontSize: 'var(--fs-small)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              {Icon && <Icon size={15} stroke={1.8} color="var(--icon-neutral)" />}
              {d.name}
            </button>
            {i < domains.length - 1 && <span style={{ color: 'var(--border)' }}>·</span>}
          </span>
        )
      })}
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
  const tablet = useMobile(980)
  const [freeModalOpen, setFreeModalOpen] = useState(false)
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <section id="pricing" style={{ padding: '56px var(--sec-pad-x) 120px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        {/* from="top" on all three Reveals in this section (not the shared
            default "bottom"): live bug report 2026-10-24, these three blocks
            sit immediately below the fixed nav once scrolled, exactly where
            Reveal's top exit boundary (shared.tsx, rootMargin -8% from top)
            lives. "bottom" hides by translateY(+dist) - away from the top
            edge, i.e. back INTO the still-visible zone - so the hide
            transition's own motion could re-cross the same exit line it had
            just crossed, flip back to visible, animate back out, and repeat:
            a self-driven feedback loop (not scroll jitter - an 80ms debounce
            added earlier the same day did not fix it, because the loop keeps
            re-arming itself). "top" hides by translateY(-dist) - further AWAY
            from the exit line, in the same direction as the exit itself - so
            the hide motion reinforces the crossing instead of undoing it. */}
        <Reveal from="top">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="wm-eyebrow">{t.pricing.eyebrow}</p>
            <h1 className="rfi-page-h1" style={{ marginBottom: 12 }}>{t.pricing.heading}</h1>
            {/* White at --fs-lead like the Evidence ledger intro (Simeon 2026-10-26). */}
            <p style={{ color: 'var(--text)', marginTop: 16, marginBottom: 40, maxWidth: 720, fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-body)' }}>{t.pricing.subheading}</p>
          </div>
        </Reveal>

        <div>
          <Reveal from="top">
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
              <BillingToggle billing={billing} onChange={setBilling} />
            </div>
          </Reveal>

          {/* Unified panel (see git history for the floating-card layouts
              tried before this): one bordered container, thin internal
              column dividers instead of gaps, Free folded in as the first
              of five columns instead of a separate banner, Enterprise band
              attached directly below with its own tinted background so it
              reads as the premium tier rather than a sixth plain card. */}
          <Reveal from="top" dist={32}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'var(--glass-bg-solid)', boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: tablet ? '1fr' : 'repeat(5, 1fr)' }}>
                <div style={{
                  scrollMarginTop: 84,
                  borderRight: !tablet ? '1px solid var(--border)' : undefined,
                  borderBottom: tablet ? '1px solid var(--border)' : undefined,
                }}>
                  <FreeTierCard onOpen={() => setFreeModalOpen(true)} />
                </div>
                {t.pricing.tiers.map((tier, i) => {
                  const slug = tier.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                  const last = i === t.pricing.tiers.length - 1
                  return (
                    <div key={tier.name} id={`pricing-${slug}`} style={{
                      scrollMarginTop: 84,
                      borderRight: !tablet && !last ? '1px solid var(--border)' : undefined,
                      borderBottom: tablet && !last ? '1px solid var(--border)' : undefined,
                      background: tier.popular ? 'rgba(249,115,22,0.07)' : undefined,
                    }}>
                      <TierCard tier={tier} billing={billing} onCheckout={onCheckout} onSelectTier={onSelectTier} />
                    </div>
                  )
                })}
              </div>

              <div style={{
                borderTop: '1px solid var(--border)', padding: '28px 28px',
                background: 'linear-gradient(135deg, rgba(0,245,196,0.08), rgba(0,245,196,0.015))',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
              }}>
                <div>
                  <p style={{ fontSize: 'var(--fs-label)', color: 'var(--accent-text)', margin: '0 0 7px' }}>{t.pricing.enterprise.heading}</p>
                  <p style={{ fontSize: 'var(--fs-small)', color: 'var(--text)', margin: 0, maxWidth: 560 }}>{t.pricing.enterprise.text}</p>
                </div>
                <button type="button" onClick={() => onSelectTier('Enterprise')} style={{ background: 'transparent', border: '1px solid var(--accent-text)', color: 'var(--accent-text)', padding: '12px 22px', borderRadius: 8, fontWeight: 700, fontSize: 'var(--fs-body)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {t.pricing.enterprise.cta}
                </button>
              </div>
            </div>
          </Reveal>

          <p style={{ margin: '20px 0 0', fontSize: 'var(--fs-small)', color: 'var(--text)', lineHeight: 1.6 }}>
            {t.pricing.termsNote.text}{' '}
            <a href={t.pricing.termsNote.href} style={{ color: 'var(--accent-text)' }}>{t.pricing.termsNote.link}</a>
          </p>

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
