// "Pricing" section (`#pricing`) - extracted verbatim from PublicSite.tsx.
// Checkout/proposal modal state lives at the page level (shared with the
// Coop Partners section's own buy buttons and the checkout/proposal modal
// chrome itself), so the open functions are passed in as props.
import { ScopeTag, TierCarousel, Reveal } from './shared'

type CheckoutInfo = { key: string; tier: string; desc: string; price: string; delivery?: string; directUrl?: string }
type ProposalInfo = { tier: string; desc: string; price: string; delivery?: string }

export function PricingSection({
  openCheckoutModal, openProposalModal,
}: {
  openCheckoutModal: (info: CheckoutInfo) => void
  openProposalModal: (info: ProposalInfo) => void
}) {
  return (
    <section id="pricing" style={{ padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>05 / Pricing</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>priced in plain terms</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 560 }}>
            Fixed rates. No retainer lock-in unless you want one. Scope determines tier, not company size.
          </p>
        </Reveal>

        {/* Security Audit tiers - featured-tier carousel (Stage 1e, corrected
            2026-08-02): all 8 existing tiers stay, none merged/dropped. One big
            card + a filmstrip of the rest, per product line - see `TierCarousel`.
            Each product line now wrapped in its own bordered container (live
            feedback) so the four lines read as distinct units, not one long
            unbroken scroll. */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '36px 28px', marginBottom: 48 }}>
        <p id="pricing-security" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center', scrollMarginTop: 96 }}>Security Audits &amp; Responsible Disclosure<ScopeTag label="Mobile + Web + AI" /></p>
        {(() => {
          const securityTiers = ([
            { tier: 'Public',                   price: 'free',      hook: 'Free, forever - findings publish after 90 days no matter what.', desc: 'You get the same source-code-level audit we run for paying clients, at no cost. Findings publish on our public ledger after a 90-day heads-up window, giving the organization time to fix the problem before anyone else sees it.\n\nEvery name on that ledger is held to the identical rule, big or small, paying or not. No contract, no secrecy agreement, no quieter treatment for anyone.\n\nYour first phone privacy session is included: we walk you through switching off the hidden trackers running on your own device. That offer does not expire.', highlight: false, stripeKey: null,            directUrl: null, delivery: 'Begins immediately after intake; report within 7 calendar days of scope lock.', contact: false, outputs: ['Investigation Report', 'Technical Findings'] },
            { tier: 'Security Retainer',        price: '€1,500 / mo', hook: 'Ongoing security coverage between audits, not a one-time snapshot.', desc: 'A single audit is a photo taken on one day; real security drifts the moment you ship new code. This retainer replaces the snapshot with ongoing coverage.\n\nFor 1,500 euros a month we monitor your product continuously, run a full deep-dive audit every three months, and move you to the front of the queue the instant something urgent appears.\n\nYou get one named engineer who already knows your system, so a panic call never starts with explaining your setup. Coverage begins within days of your first payment.\n\nThink of it as a standing security team on call, without hiring one.', highlight: false, stripeKey: 'retainer', directUrl: null, delivery: 'Report within 7 calendar days of audit completion.', contact: false, outputs: ['Technical Findings', 'Recommendations'] },
            { tier: 'Remediation Advisory',     price: '€4,500',    hook: 'A ranked report, plus a walkthrough with the engineers who found it.', desc: 'You get a ranked report in plain language: exactly how we tested, every weakness found, and a concrete fix for each one, delivered within 7 calendar days of payment.\n\nThe engineers who found the holes walk you through closing them. This is never a list of problems handed off to someone else to interpret.\n\nThirty days later we check back to confirm the fixes actually landed, not that someone claimed they did. Every finding is tied to the exact privacy-law article it breaks, so your legal team gets a map instead of a guess.\n\nThis is the difference between having a report and being truly fixed.',                                        highlight: true, stripeKey: 'remediation',   directUrl: null, delivery: 'Report within 7 calendar days of payment.', contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Technical Findings', 'Recommendations', 'Optional Retest'] },
            { tier: 'Confidential',             price: '€9,000',    hook: 'The same ranked report, kept private under a strict secrecy agreement.', desc: 'You get a written report ranking every weakness by severity and pinned to the exact spot in your code, plus a plain-language summary your non-technical leadership can actually read. Delivered within 7 calendar days of payment.\n\nEverything stays private under a strict secrecy agreement; your customers and the public never see it. Once you ship fixes, we re-test by hand to confirm the holes are closed, not just patched on paper.\n\nOne thing does not change: as a not-for-profit bound by our own rules, the relevant regulators are still told, in parallel, without detail that would expose you. Discretion where it matters, proof where it counts.',                                        highlight: false, stripeKey: 'confidential',  directUrl: null, delivery: 'Report within 7 calendar days of payment.', contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Optional Retest'] },
            { tier: 'Enterprise NDA',           price: '€18,000',   hook: 'Private report, longer embargo, direct engineer access to fix it.', desc: 'You get the same private, ranked report as the Confidential tier, with one difference: the embargo runs well past our standard 90 days, so your team has real time to fix things properly instead of patching over a weekend.\n\nYou work directly with the engineers on the repair. Your lawyers receive a complete evidence package they can hand straight to counsel.\n\nWe kick off within days of payment, and any follow-up work jumps the queue. Built for organizations where fixing everything inside 90 days is not realistic.', highlight: false, stripeKey: 'enterprise_nda', directUrl: null, delivery: 'Begins immediately after intake; full report within 7 calendar days of scope lock.', contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Evidence Map', 'Recommendations'] },
            { tier: 'Critical Infrastructure',  price: '€75,000',   hook: 'Full-scope review, legal cover, and a rehearsed emergency-response plan.', desc: 'You get a full-scope review under a secrecy agreement, our own legal review, and a communications-containment plan built with your team before anything goes wrong. For operators of energy, water, health care, or transport infrastructure, a breach is a public-safety event, not an IT ticket.\n\nWe speak directly to every relevant authority on your behalf. You receive a standing emergency-response protocol, so the worst day is rehearsed in advance, not invented on the spot.\n\nWe mobilize within days of payment. This is the tier for situations where failure is not an option.', highlight: false,  stripeKey: 'critical_infra', directUrl: 'https://buy.stripe.com/9B66oJ6OIbU32LPcHK7N60H', delivery: 'Begins immediately after intake; full report within 7 calendar days of scope lock.', contact: false, outputs: ['Investigation Report', 'Risk Matrix', 'Recommendations'] },
            { tier: 'IoB / Art. 9',             price: '€150,000',  hook: 'A full biometric-data trace - the category most shops won\'t touch.', desc: 'You get a full trace of every flow of biometric data through your product: retention periods, cross-border transfers, and processing purpose, mapped against the strictest category in European privacy law.\n\nThe price reflects the depth of the work. You keep the same secrecy agreement and regulator contact as the Enterprise tier. Most security shops will not touch this category; we specialize in it because the data involved is literally people\'s bodies.\n\nWe start within days of payment.', highlight: false,  stripeKey: 'iob_art9', directUrl: 'https://buy.stripe.com/4gMcN7ehagaj4TXcHK7N60G', delivery: 'Continuous; first quarterly report within 7 calendar days of kick-off.', contact: false, outputs: ['Investigation Report', 'Evidence Map', 'Technical Findings'] },
            { tier: 'Annual Intelligence Retainer', price: '€250,000', hook: 'A year-round external security and compliance department.', desc: 'You get a full year of our flagship service: continuous coverage of your entire app portfolio, not a sample, with a deep audit every three months.\n\nYour dedicated contact speaks directly to the regulators that matter, from the Austrian and German data-protection authorities to the UK ICO. You get a threat briefing every month and immediate notice the moment we see a breach taking shape.\n\nWe take over within a week of payment and act as your external security and compliance department from day one.', highlight: false, stripeKey: 'annual_retainer', directUrl: 'https://buy.stripe.com/00wcN71uo4rBdqt7nq7N60I', contact: false, delivery: 'Continuous; first quarterly report within 7 calendar days of kick-off.', outputs: ['Investigation Report', 'Technical Findings', 'Recommendations'] },
          ] as const)
          return (
            <TierCarousel tiers={securityTiers} getActions={t => {
              const full = securityTiers.find(s => s.tier === t.tier)!
              return {
                onBuy: full.stripeKey ? () => openCheckoutModal({ key: full.stripeKey!, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery, directUrl: full.directUrl ?? undefined }) : undefined,
                onProposal: full.contact ? () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) : undefined,
              }
            }} />
          )
        })()}
        </div>

        {/* Market Research & Competitor Analysis */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '36px 28px', marginBottom: 48 }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>Market Research &amp; Competitor Analysis<ScopeTag label="Desk research + technical analysis" /></p>
        {(() => {
          const marketTiers = [
            { tier: 'Market Overview',          price: '€2,500',      stripeKey: 'market_overview',  delivery: '14 calendar days.', highlight: true, hook: 'A ten-page, jargon-free map of your sector, in 14 days.', desc: 'You get a plain-language map of your sector: the key players, how regulation actually works for them, and where the real openings sit. Delivered within 14 calendar days.\n\nIt runs at least ten pages, no jargon, no two-hundred-slide deck, written so a founder can read it in one sitting.\n\nResearch starts within days of payment.', outputs: ['Investigation Report'] },
            { tier: 'Competitor Intelligence',    price: '€7,500',      stripeKey: 'competitor_intel', delivery: '14 calendar days.', highlight: false, hook: 'Three to five competitors taken apart: tech, privacy, positioning.', desc: 'You get three to five of your competitors taken apart: what technology they run on, how they actually treat user privacy versus what they claim, how they position themselves, and where they are strategically weak.\n\nThe result is a realistic picture of the field, including gaps you can exploit and ones you need to close. This is the homework most teams skip and later regret.\n\nDelivered within 14 calendar days of payment.', outputs: ['Investigation Report', 'Evidence Map', 'Technical Findings'] },
            { tier: 'Sector Intelligence Report', price: '€18,000',     stripeKey: 'sector_intel',     delivery: '14 calendar days.', highlight: false, hook: 'Market, regulation, and technology - refreshed every quarter.', desc: 'You get the complete picture of your sector: market, regulation, and technology, with each major player\'s risk exposure spelled out in numbers, not vague claims.\n\nBecause markets move, this is not a one-off document. You receive a fresh update every three months, so you always know where the sector is heading.\n\nFirst report within 14 calendar days of payment, refreshed every quarter after.', outputs: ['Investigation Report', 'Risk Matrix'] },
            { tier: 'Ongoing Intelligence Briefing', price: '€4,500 / mo', stripeKey: 'ongoing_intel', delivery: 'First briefing within 14 calendar days, then monthly.', highlight: false, hook: 'A dedicated analyst watching your competitors, month after month.', desc: 'You get continuous watch on your competitors: a proper briefing every month, and an immediate alert the moment one of them makes a significant move, a funding round, a pivot, a breach, or a key hire.\n\nOne dedicated analyst who knows your space handles it, so you hear about a competitor\'s launch the day it happens, not after.\n\nYour analyst is assigned within a week of payment; the first briefing lands at the end of month one.', outputs: ['Investigation Report', 'Recommendations'] },
          ]
          return (
            <TierCarousel tiers={marketTiers} getActions={t => {
              const full = marketTiers.find(s => s.tier === t.tier)!
              return { onBuy: () => openCheckoutModal({ key: full.stripeKey, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) }
            }} />
          )
        })()}
        </div>

        {/* Web Development */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '36px 28px', marginBottom: 48 }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>Web Development<ScopeTag label="Web only" /></p>
        {(() => {
          const webTiers = [
            { tier: 'Landing Page',   price: '€1,500',  stripeKey: 'web_landing'   as string | null, delivery: '48 hours.', highlight: true, hook: 'A fast, clean single page, live within 48 hours.', desc: 'You get a sharp single-page site on our own open-source React template: fast, clean, live within 48 hours of payment.\n\nBuilt by the same team that audits apps for security, so it is clean by default, not an afterthought.\n\nNo page-builder lock-in: you own the code and can take it anywhere.' },
            { tier: 'Full Site',      price: '€4,500',  stripeKey: 'web_full'      as string | null, delivery: '14–28 calendar days, depending on scope.', highlight: false, hook: 'A proper multi-page site with a real content editor, PWA-ready.', desc: 'You get a proper multi-page site with a content editor your team can actually use, a working contact form, and privacy-respecting analytics built in from the start.\n\nIt ships as an installable progressive web app, behaving like a native app on Android and iPhone without an app-store listing. Delivered in about two weeks.\n\nBuilt by the same team that audits apps for security, so it is clean by default.' },
            { tier: 'Enterprise Site',price: '€18,000', stripeKey: 'web_enterprise' as string | null, delivery: '14–28 calendar days, depending on scope.', highlight: false, hook: 'A full custom build: Rust backend, auth, native apps included.', desc: 'You get a full custom build: a Rust backend, authentication, and the specific integrations your operation requires; we scope every one of them with you directly.\n\nReal native Android and iPhone apps are included, not a web wrapper dressed up as one. Long-term support is part of the deal, not a later upsell.\n\nWe scope the build with you in the first week after payment. For organizations where the website is the business, not a brochure.' },
            { tier: 'Platform Build', price: '€75,000', stripeKey: null,                              delivery: 'User-specific timeline, aligned after kick-off.', highlight: false, hook: 'The whole product - infrastructure, API, native apps - built with you.', desc: 'You get a complete product, not just a site: custom infrastructure, API design, data pipelines, and native apps, with a dedicated team that stays on it.\n\nThis is the engagement for building the actual platform, not only the front door to it.\n\nWe start within a week of payment and keep building with you as the product grows; we set scope and timeline together at kickoff, not in advance.' },
          ]
          return (
            <TierCarousel tiers={webTiers} getActions={t => {
              const full = webTiers.find(s => s.tier === t.tier)!
              return {
                onBuy: full.stripeKey ? () => openCheckoutModal({ key: full.stripeKey!, tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) : undefined,
                onProposal: !full.stripeKey ? () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) : undefined,
              }
            }} />
          )
        })()}
        </div>

        {/* Mobile App Development & Fixing */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 20, padding: '36px 28px', marginBottom: 48 }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 20, textAlign: 'center' }}>Mobile App Development &amp; Fixing<ScopeTag label="Mobile only (Android + iOS)" /></p>
        {(() => {
          const mobileTiers = [
            { tier: 'Maintenance Retainer',  price: '€1,200 / mo', delivery: 'Ongoing engagement; first patch within 14 calendar days.', highlight: false, hook: 'Steady patches and dependency upkeep, so your app doesn\'t rot.', desc: 'You get a steady rhythm of patches, app-store compliance monitoring so a policy change never catches you off guard, and clean dependency upkeep so old libraries do not become tomorrow\'s emergency.\n\nOne named contact and priority response; first review lands within a week of payment.\n\nQuiet, continuous upkeep, so your app does not silently rot.' },
            { tier: 'APK Review & Bugfix',  price: 'from €1,500', delivery: '1 week / 7 calendar days.', highlight: true, hook: 'Send your build, get root-level answers in one week.', desc: 'You send us your build; we read the actual code, not the marketing. Covers Android and iPhone.\n\nWe identify crashes and real weak spots, then hand you concrete guidance for fixing each one, at a fixed scope with a one-week turnaround from the day you send the build.\n\nA clear answer fast, instead of a six-week audit you were not braced for.' },
            { tier: 'App Build',            price: 'from €9,000', delivery: '14–28 calendar days, depending on scope.', highlight: false, hook: 'Your native app, Kotlin and Swift, built in-house from zero to shipped.', desc: 'You get your native app built from zero to shipped: Kotlin for Android, Swift for iPhone, with a Rust backend underneath.\n\nWe do everything in-house, with the team you are already talking to, not an offshore handoff. We also handle Play Store and App Store submission, exactly where most builds stall.\n\nWe kick off within a week of payment. One team, one codebase, one launch.' },
            { tier: 'Full Mobile Product',   price: 'on request',  delivery: 'User-specific timeline after kick-off.', highlight: false, hook: 'From a napkin sketch to a launched app, built together end to end.', desc: 'You get the whole mobile product, from a spec on a napkin to a launched app: custom infrastructure, API design, native apps, and a dedicated team that stays on it.\n\nThis is an ongoing engagement, because a real product keeps evolving after launch.\n\nWe start within a week of payment and build it with you as it grows. For when you need a mobile business built, not only an app made.' },
          ]
          return (
            <TierCarousel tiers={mobileTiers} getActions={t => {
              const full = mobileTiers.find(s => s.tier === t.tier)!
              return { onProposal: () => openProposalModal({ tier: full.tier, desc: full.desc, price: full.price, delivery: full.delivery }) }
            }} />
          )
        })()}
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
