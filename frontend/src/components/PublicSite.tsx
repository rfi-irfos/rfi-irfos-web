import { useState, useEffect, useRef } from 'react'
import { useTheme, type Theme } from '../hooks/useTheme'
import { useLocale, type Locale, LOCALES } from '../hooks/useLocale'
import type { Content } from '../content/en'
import { TEAL, useMobile, useFormAbandonment, beacon, LIGHTHOUSE_PIXEL, WEB3FORMS_KEY, ModalTierBody, revealSuppressed } from './sections/shared'
import { HeroSection } from './sections/Hero'
import { ResearchSection } from './sections/Research'
import { ProjectsSection } from './sections/Projects'
import { TrackRecordSection } from './sections/TrackRecord'
import { ProofSection } from './sections/Proof'
import { ScrollSpine } from './sections/Spine'
import { AppPrivacySection } from './sections/AppPrivacy'
import { PricingSection } from './sections/Pricing'
import { JourneySection } from './sections/Journey'
import { CoopPartnersSection } from './sections/CoopPartners'
import { SubmitSection, type TipForm } from './sections/Submit'

// Nav logo's EKG line. Was one fixed blip shape looping identically forever - "measuring
// the same heartbeat forever" per Simeon. A wider multi-beat path was tried and reverted
// (he wanted the original short length/duration back, just varied). Five different
// single-beat shapes at the *original* 54x18 box, cycled one per pulse - `key={i}` forces
// a clean remount each swap so the dash animation always restarts from a full pulse
// instead of jumping mid-cycle. stroke-dasharray/duration unchanged from the original.
const EKG_SHAPES = [
  '0,9 12,9 16,2 20,16 24,2 28,9 54,9',           // original classic spike
  '0,9 14,9 18,4 22,9 54,9',                       // small single bump
  '0,9 10,9 13,6 16,11 19,9 23,9 27,2 29,16 31,9 54,9', // irregular double-bump
  '0,9 15,9 17,0 19,18 21,9 54,9',                 // tall thin spike
  '0,9 11,9 15,3 19,9 24,9 26,6 28,9 54,9',        // shallow spike + small aftershock
]
function EkgLine({ theme }: { theme: Theme }) {
  const [i, setI] = useState(0)
  // ACCENT here is local to PublicSite() (derived from theme) and out of scope for this
  // standalone component - same light-theme-contrast fix, computed independently.
  // theme comes in as a prop rather than its own useTheme() call - useTheme's state is
  // per-instance/local by design, so a second call here went stale on toggle the same
  // way Hero's did (see Hero.tsx HeroBackground comment).
  const accent = theme === 'light' ? '#0a7a5c' : TEAL
  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % EKG_SHAPES.length), 2400)
    return () => clearInterval(id)
  }, [])
  return (
    <svg width="54" height="18" viewBox="0 0 54 18" fill="none" style={{ marginLeft: 4, flexShrink: 0, overflow: 'visible' }}>
      <polyline key={i} className="ekg-line" points={EKG_SHAPES[i]}
        stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Labels shown in the locale toggle's title/aria text - deliberately each
// language's own name for itself ("English"/"Deutsch"), not translated
// through the content layer, since a language switcher naming languages in
// the CURRENTLY active language would be backwards (a German visitor should
// see "Switch to English", not a German translation of "English").
const LOCALE_LABEL: Record<Locale, string> = { en: 'English', de: 'Deutsch' }

// LocaleIcon glyph for the EN/DE toggle - same 38x38 ghost-button family as
// ThemeIcon below, but text-based (two-letter language code) rather than an
// SVG glyph, since there's no obvious universal icon for "language".
function LocaleIcon({ locale }: { locale: Locale }) {
  // Show the *target* language, not the current one — users expect the toggle
  // to say "click here to switch to Deutsch/English", not "you are already here".
  const target = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length]
  return <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, letterSpacing: '0.02em' }}>{target.toUpperCase()}</span>
}

// Sun / Moon / Monitor glyphs for the theme toggle - icon-only reads at a glance and
// avoids the light-theme "LIGHT" label going low-contrast against its own selected pill.
function ThemeIcon({ t }: { t: 'light' | 'dark' | 'hc' }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (t === 'light') return (
    <svg {...common}><circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
  )
  if (t === 'dark') return (
    <svg {...common}><path d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z" /></svg>
  )
  return (
    <svg {...common}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></svg>
  )
}

type PublicView = 'home' | 'systems' | 'evidence' | 'access'

function viewForSection(section?: string | null): PublicView {
  if (section === 'systems' || section === 'projects') return 'systems'
  if (section === 'evidence' || section === 'track-record') return 'evidence'
  if (section === 'access' || section === 'pricing') return 'access'
  return 'home'
}

// Human Rights and Team both dropped from primary nav (website-repositioning plan
// M9 / Stage 0): Human Rights stays reachable via the footer's mission/company
// framing rather than competing for top-level attention against the actual
// services; Team moved to its own page (`#p/team`), linked from the footer's
// Company group - see the removed `<section id="team">` in this file.
// Hrefs only - labels come from the current locale's content object (t.nav.links)
// since NAV_LINKS itself sits above PublicSite() and can't call useLocale().
const NAV_HREFS = [
  { key: 'projects' as const, href: '#systems' },
  { key: 'trackRecord' as const, href: '#evidence' },
  { key: 'pricing' as const, href: '#access' },
]

// Section-specific <title>/meta description for visitors (and crawlers) landing
// directly on a section's own URL (e.g. /pricing) instead of the homepage - pulled
// straight from each section's existing heading/dek text so it stays bilingual for
// free instead of needing a second, separately-maintained copy of the same copy.
function sectionMeta(t: Content, section: string) {
  switch (section) {
    case 'research': return { title: `${t.research.heading} — RFI-IRFOS`, description: t.research.subheading }
    case 'systems':
    case 'projects': return { title: `${t.projects.heading} — RFI-IRFOS`, description: t.projects.subheading }
    case 'evidence':
    case 'track-record': return { title: `${t.trackRecord.heading} — RFI-IRFOS`, description: t.trackRecord.paragraph }
    case 'access':
    case 'pricing': return { title: `${t.pricing.heading} — RFI-IRFOS`, description: t.pricing.subheading }
    case 'submit': return { title: `${t.submit.heading} — RFI-IRFOS`, description: t.submit.paragraph }
    default: return null
  }
}

export function PublicSite({ initialSection }: { initialSection?: string | null } = {}) {
  const { locale, setLocale, t } = useLocale()
  const NAV_LINKS = NAV_HREFS.map(n => ({ label: t.nav.links[n.key], href: n.href }))
  const [view, setView] = useState<PublicView>(() => viewForSection(initialSection))

  // Landed on a section's own URL (crawler or external link, not an in-page nav
  // click) - set that section's meta tags and scroll to it once on mount.
  useEffect(() => {
    if (!initialSection) return
    const meta = sectionMeta(t, initialSection)
    if (meta) {
      document.title = meta.title
      document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    }
    if (initialSection === 'submit') {
      requestAnimationFrame(() => document.getElementById('submit')?.scrollIntoView({ block: 'start' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function navigateTo(href: string) {
    const target = href.slice(1)
    if (target === 'submit') {
      setView('home')
      window.history.replaceState(null, '', '#submit')
      requestAnimationFrame(() => document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      return
    }
    const next = viewForSection(target)
    setView(next)
    window.history.replaceState(null, '', `#${target}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function navigateHome() {
    setView('home')
    window.history.replaceState(null, '', '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const toggleLocale = () => setLocale(LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length])
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  // One consolidated contact/disclosure form (live feedback: two separate full
  // forms - a general "write to us" one and a security-tip one - stacked on the
  // page read as duplicated UI). `topic` added so it still covers every inquiry
  // type the old general form's Topic dropdown did; the disclosure-specific
  // fields (credit preference, lawful-basis attestation) stay, since those are
  // the compliance-relevant part and apply just as validly to any inquiry.
  const [tipForm, setTipForm] = useState<TipForm>({ topic: '', handle: '', email: '', target: '', credit: 'alias', finding: '', lawful: false, botcheck: '' })
  const [tipFormState, setTipFormState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  useFormAbandonment('submit_tip', tipForm, tipFormState)
  const pixelRef = useRef<HTMLImageElement>(null)
  const ledgerRef = useRef<HTMLDivElement>(null)
  const [ledgerFired, setLedgerFired] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState<string | null>(null)
  const [activeSev, setActiveSev] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('elapsed-desc')
  const [openDD, setOpenDD] = useState<string | null>(null)
  // Restored 2026-07-31: an earlier "performance fix" removed this assuming MoonPhase
  // was its only consumer - it wasn't. The Track Record ledger's live per-row countdown
  // timers (disclosure countdown, elapsed-since-notification, embargo progress bar,
  // elapsed-desc sort) all read `now` too, and removing it left those as a bare
  // undefined reference - a ReferenceError that crashed the entire render (blank white
  // page in production). That ledger genuinely needs one shared, synchronized clock
  // across potentially hundreds of rows computed in the same .map(), so a top-level
  // ticking state is the right shape for THIS feature - MoonPhase (a single icon with
  // no reason to share a clock with anything) still correctly ticks on its own, slower,
  // isolated timer instead of this one.
  const [now, setNow] = useState(() => Date.now())
  const [, setCheckoutLoading] = useState<string | null>(null)
  // Cards now show only tier/price/CTA - the full breakdown (what this tier actually
  // is) moved into this confirmation modal, shown above the B2B/ToS checkboxes, so
  // nothing gets lost by trimming the card itself.
  const [checkoutModal, setCheckoutModal]     = useState<{ key: string; tier: string; desc: string; price: string; delivery?: string; directUrl?: string } | null>(null)
  const [proposalModal, setProposalModal]     = useState<{ tier: string; desc: string; price: string; delivery?: string } | null>(null)
  const [reportModal, setReportModal]         = useState<string | null>(null)
  // Full plain-language writeup per ledger entry - the ledger row/cell only ever
  // summarizes (hover reveals the short "why it matters" line), this is where the
  // complete article-style explanation lives, opened by clicking the Intel cell.
  const [intelModal, setIntelModal]           = useState<{ target: string; market: string; sev: string; finding: string; headline?: string } | null>(null)
  const [agbChecked, setAgbChecked]           = useState(false)
  const [b2bChecked, setB2bChecked]           = useState(false)
  const { theme, cycle } = useTheme()
  // Dismissal persists. Previously the banner reopened on every single page load,
  // so a returning visitor (and every click from a paid ad) got the panel back over
  // the pricing CTA. Reverted the localStorage-dismissal persistence added earlier
  // today (2026-08-05): this banner is the joke one - "we don't use cookies, so
  // there's nothing to consent to" - not a real consent mechanism, and it always
  // reappearing on refresh is the actual, deliberate, pre-existing behavior.
  const [cookieBannerOpen, setCookieBannerOpen] = useState(true)
  const [bannerClosing, setBannerClosing] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Lock background scroll while a modal is open - without this the page behind a
  // fixed-position modal keeps scrolling under it, which reads as "scrolling is broken."
  useEffect(() => {
    if (!checkoutModal && !proposalModal && !reportModal && !intelModal) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [checkoutModal, proposalModal, reportModal, intelModal])

  // "ba-dum-tss" - Zabih's idea, live feedback 2026-08-14: the confetti pop needed a
  // rimshot to sell the joke. Two low kick thumps (sine, pitch-dropping) then a
  // cymbal crash (filtered noise burst, longer decay), synthesized via the Web
  // Audio API, no audio file. This used to run alongside a separate "pop" sound and
  // a scattered-clap sound (both removed 2026-08-14, live feedback: "ONLY badumm
  // tss pls") - it is now the only sound on the cookie-banner-close/confetti
  // moment. Timing widened slightly (0.18/0.32 -> 0.24/0.44) same feedback pass,
  // "a bissl langsamer."
  const playRimshotSound = () => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AC()
      const kick = (startAt: number) => {
        const now = ctx.currentTime + startAt
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(160, now)
        osc.frequency.exponentialRampToValueAtTime(48, now + 0.09)
        gain.gain.setValueAtTime(0.5, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
        osc.connect(gain); gain.connect(ctx.destination)
        osc.start(now); osc.stop(now + 0.13)
      }
      kick(0)
      kick(0.24)
      const cymbalAt = 0.44
      const now = ctx.currentTime + cymbalAt
      const dur = 0.5
      const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let n = 0; n < data.length; n++) data[n] = Math.random() * 2 - 1
      const noise = ctx.createBufferSource(); noise.buffer = buf
      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'; hp.frequency.value = 6000
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.0008, now + dur)
      noise.connect(hp); hp.connect(gain); gain.connect(ctx.destination)
      noise.start(now); noise.stop(now + dur)
      noise.onended = () => ctx.close()
    } catch { /* never block the banner over audio */ }
  }

  // Upgraded from flat 6-13px circles/squares dropping in ~1s (live feedback 2026-08-14:
  // "billige confetti... machma richtig geile"): bigger mixed shapes including actual
  // ribbon-strip rectangles (not just dots), a shine highlight via inset box-shadow so
  // each piece doesn't read as a flat color chip, a wider/richer palette, and a slower
  // 3-phase fall (burst -> a mid-air sway checkpoint -> settle) instead of one straight
  // transition, so pieces flutter down instead of dropping on rails.
  const fireConfettiFromRect = (rect: DOMRect, count: number) => {
    const colors = ['#00f5c4', '#ef4444', '#f97316', '#eab308', '#e8e8f0', '#ec4899', '#facc15']
    playRimshotSound()
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const shapeRoll = Math.random()
      const isRibbon = shapeRoll < 0.35
      const isCircle = !isRibbon && shapeRoll < 0.65
      const size = 9 + Math.random() * 9
      const w = isRibbon ? size * 0.42 : size
      const h = isRibbon ? size * 1.9 : size
      const color = colors[i % colors.length]
      const startX = rect.left + Math.random() * rect.width
      const startY = rect.top + Math.random() * rect.height
      el.style.cssText = `position:fixed;left:${startX}px;top:${startY}px;width:${w}px;height:${h}px;background:${color};box-shadow:inset -2px -2px 3px rgba(0,0,0,0.22),inset 2px 2px 2px rgba(255,255,255,0.35);opacity:1;border-radius:${isCircle ? '50%' : '2px'};pointer-events:none;z-index:99999;transform:translate(0,0) scale(0.4) rotate(0deg);transition:transform 0.16s cubic-bezier(.2,.9,.35,1);`
      document.body.appendChild(el)
      // force a synchronous layout so the browser commits the starting transform
      // before we change it - otherwise the transition can silently no-op.
      void el.offsetHeight
      // phase 1 - piñata burst: fast, radial, outward.
      const angle = Math.random() * Math.PI * 2
      const burstDist = 70 + Math.random() * 160
      const burstX = Math.cos(angle) * burstDist
      const burstY = Math.sin(angle) * burstDist - 34 // slight upward pop before gravity takes over
      const burstSpin = (Math.random() - 0.5) * 560
      el.style.transform = `translate(${burstX}px, ${burstY}px) scale(1.15) rotate(${burstSpin}deg)`
      setTimeout(() => {
        // phase 2 - a mid-air sway checkpoint, roughly a third of the way down, with a
        // slower transition than the burst - this is what reads as "flutter" instead of
        // a straight drop, since the piece visibly changes drift direction mid-fall.
        const totalFall = window.innerHeight - startY + 80 + Math.random() * 100
        const swayX = burstX + (Math.random() - 0.5) * 220
        const swayY = startY + totalFall * 0.4
        const swaySpin = burstSpin + (Math.random() - 0.5) * 500
        el.style.transition = `transform ${0.7 + Math.random() * 0.35}s cubic-bezier(.45,0,.55,1)`
        el.style.transform = `translate(${swayX}px, ${swayY - startY}px) scale(1) rotate(${swaySpin}deg)`
        setTimeout(() => {
          // phase 3 - settle the rest of the way down, fading out near the bottom.
          const fallX = swayX + (Math.random() - 0.5) * 160
          const fallSpin = swaySpin + (Math.random() - 0.5) * 700
          el.style.transition = `transform ${1.1 + Math.random() * 0.5}s cubic-bezier(.45,0,.55,1), opacity 0.5s ease-in ${0.7 + Math.random() * 0.3}s`
          el.style.transform = `translate(${fallX}px, ${totalFall}px) scale(0.85) rotate(${fallSpin}deg)`
          el.style.opacity = '0'
        }, (0.7 + Math.random() * 0.35) * 1000)
      }, 160)
      setTimeout(() => el.remove(), 3400)
    }
  }

  const dismissCookieBanner = () => {
    const el = bannerRef.current
    if (el) fireConfettiFromRect(el.getBoundingClientRect(), 90)
    new Image().src = `${LIGHTHOUSE_PIXEL}?site=rfi-irfos&p=${encodeURIComponent(location.pathname)}&r=${encodeURIComponent(document.referrer)}&s=${encodeURIComponent('Cookie Banner Close')}`
    setBannerClosing(true)
    setTimeout(() => { setCookieBannerOpen(false); setBannerClosing(false) }, 240)
  }

  const openCheckoutModal = (info: { key: string; tier: string; desc: string; price: string; delivery?: string; directUrl?: string }) => {
    // Funnel step 1: user pressed the tier button → open the checkout modal AND
    // beam offer_click:<tier> to Lighthouse (same first-party tracker as pageviews).
    beacon('offer_click:' + info.key)
    setAgbChecked(false)
    setB2bChecked(false)
    setCheckoutModal(info)
  }

  const cancelCheckout = (key: string) => {
    // Funnel step 2a: user dismissed the confirmation modal without continuing.
    beacon('offer_cancel:' + key)
    setCheckoutModal(null)
  }

  const openProposalModal = (info: { tier: string; desc: string; price: string; delivery?: string }) => {
    setProposalModal(info)
  }

  const proposalRequest = (tier: string) => {
    // Contact-only tiers have no Stripe checkout — beam the request so they show
    // up in the same Lighthouse funnel as the paid tiers.
    beacon('proposal_request:' + tier)
  }

  const confirmProposal = () => {
    if (!proposalModal) return
    proposalRequest(proposalModal.tier)
    setProposalModal(null)
    location.hash = '#submit'
  }

  const handleCheckout = async (tier: string) => {
    // Funnel step 2b: user hit CONTINUE TO STRIPE — beam the attempt BEFORE the
    // redirect so a Stripe-bound click counts even if the tab navigates away.
    beacon('offer_attempt:' + tier)
    setCheckoutModal(null)
    setCheckoutLoading(tier)
    const apiBase = (import.meta.env.VITE_API_BASE as string) ?? ''
    try {
      const res = await fetch(`${apiBase}/api/stripe/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const { url } = await res.json()
      window.location.href = url
    } catch {
      alert(t.alerts.checkoutUnavailable)
    } finally {
      setCheckoutLoading(null)
    }
  }

  // Some tiers use a pre-made Stripe Payment Link (buy.stripe.com) instead of a
  // backend-generated checkout session - same B2B/ToS-gated modal either way, this
  // just decides where "Continue to Stripe" actually sends the browser.
  const confirmCheckout = () => {
    if (!checkoutModal) return
    if (checkoutModal.directUrl) {
      beacon('offer_attempt:' + checkoutModal.key)
      const url = checkoutModal.directUrl
      setCheckoutModal(null)
      window.location.href = url
      return
    }
    handleCheckout(checkoutModal.key)
  }

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const mobile = useMobile()

  useEffect(() => {
    const el = ledgerRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLedgerFired(true); obs.disconnect() }
    }, { threshold: 0 })
    obs.observe(el)
    // bulletproof fallback: on a very tall rows container the ratio can never
    // cross a nonzero threshold, so guarantee rows render even if the observer never fires.
    const fallback = setTimeout(() => setLedgerFired(true), 800)
    return () => { obs.disconnect(); clearTimeout(fallback) }
  }, [view])

  useEffect(() => {
    // revealSuppressed itself still had the exact race ScrambleHeading's comment
    // above already diagnosed and worked around with 'rfi-nav-jump': a fixed 800ms
    // window guessing at an unrelated smooth-scroll's actual duration. ScrambleHeading
    // routed around it entirely; Reveal's `settled` (shared.tsx) still reads
    // revealSuppressed.current LIVE on every scroll frame, so the same race still
    // applied there - live feedback ("greys out" / "auto-zooms" after a nav click)
    // traced to this: on a long jump the flag flips back to false while the native
    // scroll is still mid-flight, `settled` recomputes from the real (not-yet-arrived)
    // scrollYProgress for a frame, and the element visibly drops before snapping back
    // in once the scroll actually stops. Fixed the same way as the timing problem
    // itself should be fixed: release on the browser's own `scrollend` signal instead
    // of a guessed delay, with the old 1600ms bumped-up timeout only as a safety net
    // for browsers without `scrollend` or a same-position click that never scrolls.
    let releaseTimer: ReturnType<typeof setTimeout>
    const release = () => {
      revealSuppressed.current = false
      window.removeEventListener('scrollend', release)
      clearTimeout(releaseTimer)
    }
    const suppressUntilSettled = () => {
      revealSuppressed.current = true
      window.removeEventListener('scrollend', release)
      window.addEventListener('scrollend', release, { once: true })
      clearTimeout(releaseTimer)
      releaseTimer = setTimeout(release, 1600)
    }
    const handler = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')!
      if (href.length < 2) {
        // bare "#" (e.g. the logo) - scroll to top, still suppress Reveal so hero/KPIs
        // don't get stuck mid-transform from the jump (same fix as named-anchor links below)
        e.preventDefault()
        suppressUntilSettled()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      suppressUntilSettled()
      // Land the section top BELOW the fixed 64px nav, not at/past it. This used to
      // aim for "+10" (justified by a comment claiming section content sits ~100px
      // into the section, so the actual heading would clear the nav) - that assumption
      // went stale when section top padding was tightened to 48px, so the heading
      // itself was landing at roughly y=48-60, i.e. still partly UNDER the fixed nav's
      // blurred background. Two visible symptoms of the same root cause: (a) the nav's
      // backdrop-filter blur washing the heading out, and (b) Reveal's scroll-scrubbed
      // `settled` value (shared.tsx) computing well below 1 for a short element sitting
      // that close to the very top of the transit it tracks - both read as "greys out"
      // right after a nav click. Scrolling to clear the nav with real margin fixes both.
      const NAV_HEIGHT = 64
      const abs = target.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: Math.max(0, abs - NAV_HEIGHT - 20), behavior: 'smooth' })
      // Explicit signal for ScrambleHeading (2026-08-05): fires deterministically at
      // the moment of the click itself, independent of scroll/threshold timing.
      target.dispatchEvent(new CustomEvent('rfi-nav-jump', { bubbles: true }))
    }
    document.addEventListener('click', handler)
    return () => { document.removeEventListener('click', handler); window.removeEventListener('scrollend', release); clearTimeout(releaseTimer) }
  }, [])

  // A note for whoever opened devtools looking for something to find. Runs once, and
  // every claim in it is one we can actually back up (see the section-tracking effect
  // below - in-memory only, no cookie, no localStorage, nothing survives a reload).
  useEffect(() => {
    const big = 'font-family:monospace;font-size:32px;font-weight:900;color:#00f5c4'
    const h = 'font-size:15px;font-weight:700;color:#e8e8f0'
    const p = 'font-size:12px;color:#a0a0b8;line-height:1.7'
    const mono = 'font-family:monospace;font-size:11px;color:#606080'
    const link = 'font-size:12px;color:#00f5c4;font-weight:700'
    const crit = 'font-family:monospace;font-size:11px;font-weight:900;color:#ef4444'
    const high = 'font-family:monospace;font-size:11px;font-weight:900;color:#f97316'
    const med = 'font-family:monospace;font-size:11px;font-weight:900;color:#eab308'
    const low = 'font-family:monospace;font-size:11px;font-weight:900;color:#6b7280'

    console.log('%crfi-irfos', big)
    console.log('%cso. devtools open, poking through the source.', h)
    console.log('%clet\'s just name what\'s actually happening here, since we spend our whole day naming exactly this for other people.', p)
    console.log('%cyou\'re probably one of three people. one: you work at a company that just got an email from us with a severity table and a deadline attached, and someone told you to "check if these guys are legit" before anyone replies. two: you\'re a security researcher who does the same work we do, and you want to see whether the people who roast companies for hardcoded firebase keys are leaving one lying around themselves. three: you\'re just curious, which is honestly the correct default state for anyone on the internet.', p)
    console.log('%cwhichever one you are: good instinct. checking is exactly what we\'d tell you to do. we read binaries for a living - we\'d be hypocrites if we asked anyone to just take our word for it.', p)
    console.log('%cso here\'s the audit, root level, on ourselves:', h)
    console.log('%cC0%c - hardcoded api keys: none.\n%cH0%c - third-party analytics: none.\n%cH0%c - cookies for anything beyond a theme toggle: none.\n%cM0%c - fingerprinting: none.\n%cL0%c - third-party fonts, CDNs, or other silent third-party requests: none.',
      crit, mono, high, mono, high, mono, med, mono, low, mono)
    console.log('%csection views live in this tab\'s memory only, and they\'re gone the moment you refresh. that\'s not a policy statement. that\'s the entire mechanism, and you are currently looking directly at all of it, because none of it is hidden anywhere.', p)
    console.log('%cwe know this isn\'t a bug bounty program. there\'s no hall-of-fame page or branded stickers for finding this message, mostly because there\'s nothing here to find - and also because, as a few companies have learned this year slower than they\'d have liked, we don\'t really do bug bounties. we do disclosure. if you did find something real, actually real, we want to know. not for swag. because unlike some inboxes we\'ve written to this year, we actually read what gets sent to us.', p)
    console.log('%ca lot more people have been ending up in this exact console tab lately than we expected. we noticed. we\'re not going to pretend we didn\'t, and we\'re not going to start tracking who - that would rather defeat the point of the five zeroes above.', p)
    console.log('%ceither way: thanks for looking closely enough to end up here. that\'s rarer than you\'d think, and it\'s also, unfortunately for a lot of companies whose apps we\'ve opened this year, the entire job.', p)
    console.log('%ccontact@rfi-irfos.com - write to us directly', link)
    console.log('%crfi-irfos.com/#submit - if you want it in writing', link)
    console.log('%cgithub.com/rfi-irfos - if you want the receipts', link)
    console.log('%ca regulated austrian not-for-profit. everything built in-house. no bug bounty, no hackerone, no VDP portal - just people who read the source.', mono)
  }, [])

  // Who actually opens devtools, not just who we joke to about it. Window-size heuristic -
  // a docked devtools panel shrinks the inner viewport relative to the outer window past a
  // clear threshold. Passive, no timing tricks, no debugger statements. Same one-shot,
  // in-memory-only pattern as the section-view tracker below: fires at most once per
  // pageview, nothing persisted, gone on refresh. Misses undocked/separate-window devtools,
  // which is fine - this is curiosity, not a security control.
  useEffect(() => {
    let fired = false
    const threshold = 160
    const check = () => {
      if (fired) return
      const widthGap = window.outerWidth - window.innerWidth
      const heightGap = window.outerHeight - window.innerHeight
      if (widthGap > threshold || heightGap > threshold) {
        fired = true
        fetch('https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: location.pathname, section: 'devtools-opened', site: 'rfi-irfos' }),
        }).catch(() => {})
      }
    }
    const id = window.setInterval(check, 1000)
    check()
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    // beacon on page load
    const q = new URLSearchParams(location.search)
    fetch('https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: location.pathname,
        referrer: document.referrer,
        utm_source: q.get('utm_source') ?? '',
        utm_medium: q.get('utm_medium') ?? '',
        utm_campaign: q.get('utm_campaign') ?? '',
        // Google Ads' own auto-tagging appends gclid with no UTM params at all - without
        // reading it, a click from an ad with no manual UTM setup was indistinguishable
        // from direct/organic traffic on the backend. See lighthouse's track.rs.
        gclid: q.get('gclid') ?? '',
        site: 'rfi-irfos',
      }),
    }).catch(() => {})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Section-level view counts - plain hit-counter per section, nothing more. The `seen` set
  // lives only in this component's memory: never written to a cookie, localStorage, or
  // sessionStorage, so it's gone the moment the page reloads. No visitor id is sent - this
  // can only ever answer "how many page-loads scrolled past section X today", never "who".
  useEffect(() => {
    const seen = new Set<string>()
    const sectionIds = ['research', 'systems', 'projects', 'evidence', 'track-record', 'timeline', 'submit', 'access', 'pricing', 'team', 'coop-partners', 'contact']
    const els = sectionIds.map(id => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    if (!els.length) return
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const id = entry.target.id
        if (seen.has(id)) continue
        seen.add(id)
        // Plain fetch, not sendBeacon - sendBeacon defaults to text/plain and the backend's
        // Json extractor expects application/json; this matches the proven page-load beacon above.
        fetch('https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: location.pathname, section: id, site: 'rfi-irfos' }),
        }).catch(() => {})
      }
    }, { threshold: 0.4 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [view])

  async function submitTip(e: React.FormEvent) {
    e.preventDefault()
    if (!tipForm.lawful) return
    if (tipForm.botcheck) { setTipFormState('ok'); return }
    setTipFormState('sending')
    // Posts same-origin to our own backend, which relays into the Lighthouse CRM with
    // the key held server side. This replaced a direct call to Web3Forms that was gated
    // behind `if (WEB3FORMS_KEY)`. That key comes from import.meta.env, Vite inlines it
    // at BUILD time, and the Dockerfile never passed it, so in production the constant
    // was undefined, the whole branch was dead-code-eliminated, and the code below still
    // reported success. Every submission since that deploy was shown a confirmation and
    // thrown away. Verified against the live bundle: zero occurrences of "web3forms".
    //
    // The GitHub Actions workflow does set VITE_WEB3FORMS_KEY, but it builds for GitHub
    // Pages, and rfi-irfos.com is served by Fly. The secret was wired to a pipeline
    // nobody serves from.
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tipForm.handle || 'anonymous',
          email: tipForm.email,
          phone: tipForm.target,
          // The client-side botcheck gate above (line ~497) only stops a browser
          // running this exact JS - anything posting straight to /api/contact skips it
          // entirely. Sending the honeypot value through lets the backend enforce it too.
          botcheck: tipForm.botcheck,
          message: [
            tipForm.topic ? `Topic: ${tipForm.topic}` : null,
            tipForm.target ? `Target: ${tipForm.target}` : null,
            `Credit preference: ${tipForm.credit}`,
            '',
            tipForm.finding,
          ].filter(v => v !== null).join('\n'),
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      beacon('lead_submitted')
      setTipFormState('ok')
      setTipForm({ topic: '', handle: '', email: '', target: '', credit: 'alias', finding: '', lawful: false, botcheck: '' })
    } catch {
      // CRM relay failed. Fall back to Web3Forms, which is an email-forwarding
      // service and is what actually delivered mail before this rewrite. Two
      // independent paths to a lead, so one being down never loses it: CRM first
      // because it is what the leads counter reads, email second because it
      // reaches a human immediately, and the mailto in the error state third.
      // Requires VITE_WEB3FORMS_KEY at build time, now passed via the Dockerfile.
      try {
        if (!WEB3FORMS_KEY) throw new Error('no web3forms key in this build')
        const res2 = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `[rfi-irfos.com] ${tipForm.topic || 'Enquiry'} - ${tipForm.target || 'unspecified'}`,
            name: tipForm.handle || 'anonymous',
            email: tipForm.email,
            replyto: tipForm.email || undefined,
            topic: tipForm.topic,
            target: tipForm.target,
            credit_preference: tipForm.credit,
            message: tipForm.finding,
          }),
        })
        if (!res2.ok) throw new Error(String(res2.status))
        beacon('lead_submitted_email_fallback')
        setTipFormState('ok')
        setTipForm({ topic: '', handle: '', email: '', target: '', credit: 'alias', finding: '', lawful: false, botcheck: '' })
      } catch {
        // Both paths down. Never report success on a failed send: the error state
        // carries a pre-filled mailto so the visitor can still reach us.
        setTipFormState('err')
      }
    }
  }

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#000000' : theme === 'hc' ? '#000000' : 'var(--bg)',
      // position:relative + zIndex:0 give this wrapper its own stacking context -
      // without it, ScrollSpine's zIndex:-1 rail escapes to the document root's
      // stacking context and paints BEHIND this div's own background instead of
      // in front of it, i.e. invisible. Everything else in the page (nav, modals,
      // dropdowns) already carries its own explicit positive z-index and is
      // unaffected by this - they paint above the spine exactly as before.
      position: 'relative', zIndex: 0,
      color: 'var(--text)', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', overflowX: 'hidden', maxWidth: '100vw' }}>

      {/* Photo backdrop, on its own layer (live feedback 2026-08-14: "it takes too
          much attention, like a drummer overshadowing the band, not carrying it" -
          wants it to recede, not compete with content). filter: blur() was tried
          in the same pass and reverted immediately after ("remove the blur...the
          blur looks bad") - grain + the raised tint opacity below are what's
          actually doing the "recede" work now. Kept as its own layer (split out
          from the wrapper's own background) regardless, since a dedicated paint
          layer is harmless and keeps this ready if blur or another per-layer
          effect comes back. position:absolute + inset:0 inside this
          position:relative wrapper spans the exact same box the background used
          to cover directly - same sizing/crop behavior as before, just its own
          paint layer. Tint opacity raised a touch (0.42->0.5 dark, 0.38->0.46
          light) to push the photo further back as ambient texture. hc untouched,
          its 0.8 overlay is the accessibility-mandated one. */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: -2, pointerEvents: 'none',
        backgroundBlendMode: 'normal',
        background: theme === 'dark'
          ? 'radial-gradient(ellipse 60% 45% at 12% 15%, rgba(0,245,196,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 88% 55%, rgba(0,245,196,0.05) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 20% 92%, rgba(0,245,196,0.045) 0%, transparent 60%), linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/page-structure-dark.jpeg") center top / cover no-repeat'
          : theme === 'light'
            ? 'linear-gradient(rgba(250,245,239,0.46), rgba(250,245,239,0.46)), url("/page-structure-light.jpeg") center top / cover no-repeat'
            : 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("/page-structure-dark.jpeg") center top / cover no-repeat',
      }} />

      {/* Grain overlay (live feedback 2026-08-14: the photo backdrop looked too
          clean/digital, "more like a newspaper print"; opacity raised 0.05->0.08
          in the same pass that added the blur above, "more grainy"). SVG
          feTurbulence noise, not a shipped PNG - generates the texture at render
          time so there's no extra asset request. mix-blend-mode: 'overlay' is the
          whole effect: breaks up the photo's otherwise perfectly smooth gradients
          just enough to read as printed rather than rendered. position:fixed is
          fine here (unlike the photo layer above) since a repeating noise tile has
          no crop/zoom concerns tied to viewport size the way a single photo does. */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none',
        opacity: 0.08, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '180px 180px',
      }} />

      <ScrollSpine theme={theme} />

      {/* REPORT PDF MODAL */}
      {reportModal && (
        // Blurred backdrop to match the checkout/proposal modals (live feedback
        // 2026-08-14: that's "the canonical template", this one was still the older
        // flat rgba(0,0,0,0.85) dim with no blur - now the same blur(14px) treatment).
        <div className="rfi-modal-backdrop" onClick={() => setReportModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(4,4,7,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          {/* Same always-dark carbon chrome as the checkout/intel modals (live
              feedback 2026-08-14) - fixed light hex text, not var(--text*)/var(--accent-text),
              which resolve dark in light mode and went illegible against this panel. */}
          <div className="rfi-modal-panel" onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 900, height: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(155deg, #17171d 0%, #0a0a0c 28%, #050506 52%, #131319 76%, #08080a 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
            backgroundBlendMode: 'overlay',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 50px rgba(0,0,0,0.55), 0 20px 60px rgba(0,0,0,0.65)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: TEAL, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.reportModal.label}</span>
              <button onClick={() => setReportModal(null)} style={{ background: 'none', border: 'none', color: '#8a8aa0', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 6px' }}>&#x2715;</button>
            </div>
            <iframe src={reportModal} style={{ flex: 1, border: 'none', width: '100%' }} title={t.reportModal.iframeTitle} />
          </div>
        </div>
      )}

      {/* INTEL ARTICLE MODAL - clicking a ledger row's Intel cell opens this. Written
          as one flowing piece, no sub-headers inside the prose itself (Simeon, 2026-08-08:
          "nicht mit den headers, aber halt einfach total sauberer artikel") - only the
          technical finding at the bottom is visually separated, kept for anyone who wants
          to verify the plain-language explanation against the actual audit evidence. */}
      {intelModal && (() => {
        const sep = ' — meaning '
        const si = intelModal.finding.indexOf(sep)
        const technical = si === -1 ? intelModal.finding : intelModal.finding.slice(0, si)
        const meaning = si === -1 ? intelModal.finding : intelModal.finding.slice(si + sep.length)
        return (
          // Blurred backdrop to match the checkout/proposal modals - same reasoning
          // as the Report PDF modal above.
          <div className="rfi-modal-backdrop" onClick={() => setIntelModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(4,4,7,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            {/* Same canonical carbon-gradient template as the checkout/proposal modals
                (live feedback 2026-08-14: this one was still on a flat hardcoded navy
                panel, "auch nichtmal in dem carbon style") - and, same as those, this
                chrome is deliberately always-dark independent of the site theme
                toggle, so every text color inside is a fixed light hex, NOT a
                var(--text*) token (those resolve to near-black in light mode and read
                as illegible dark-on-navy - the actual light-mode contrast bug). */}
            <div className="rfi-modal-panel" onClick={e => e.stopPropagation()} style={{
              width: '100%', maxWidth: 640, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              background: 'linear-gradient(155deg, #17171d 0%, #0a0a0c 28%, #050506 52%, #131319 76%, #08080a 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
              backgroundBlendMode: 'overlay',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 50px rgba(0,0,0,0.55), 0 20px 60px rgba(0,0,0,0.65)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{intelModal.target} · {intelModal.market} · {intelModal.sev}</div>
                <button onClick={() => setIntelModal(null)} style={{ background: 'none', border: 'none', color: '#8a8aa0', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 6px' }}>&#x2715;</button>
              </div>
              <div style={{ padding: '20px 22px', overflowY: 'auto' }}>
                {/* Newspaper-style headline - the thing a visitor with zero technical
                    background reads first and instantly understands. Falls back to
                    nothing (meaning paragraph just runs first, as before) until every
                    ledger entry has one written - Simeon, 2026-08-08. */}
                {intelModal.headline && (
                  <h3 style={{ fontSize: 22, lineHeight: 1.3, fontWeight: 800, color: '#e8e8f0', margin: '0 0 12px' }}>{intelModal.headline}</h3>
                )}
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#e8e8f0', margin: 0 }}>{meaning}</p>
                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{t.intelModal.evidenceLabel}</div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.6, color: '#a0a0b8', margin: 0 }}>{technical}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* B2B CHECKOUT CONFIRMATION MODAL - cards on the page only show tier/price/CTA now;
          this is where the full breakdown actually lives, right above the terms. */}
      {checkoutModal && (
        // Backdrop now blurs the page behind it (same idea as the header's scroll blur)
        // so the modal visually pops forward instead of just dimming - added 2026-07-31
        // alongside the carbon-gradient panel below, same technique as the cookie banner
        // but pushed darker for contrast against a blurred page.
        <div className="rfi-modal-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,4,7,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', alignItems: mobile ? 'flex-end' : 'center', justifyContent: 'center', padding: mobile ? 0 : '1rem' }}>
          <div className="rfi-modal-panel" style={{
            background: 'linear-gradient(155deg, #17171d 0%, #0a0a0c 28%, #050506 52%, #131319 76%, #08080a 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
            backgroundBlendMode: 'overlay',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 50px rgba(0,0,0,0.55), 0 20px 60px rgba(0,0,0,0.65)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: mobile ? '14px 14px 0 0' : 14, padding: mobile ? '28px 24px 36px' : '40px 36px', maxWidth: mobile ? '100%' : 640, width: '100%', maxHeight: mobile ? '92vh' : '88vh', overflowY: 'auto' }}>
            {/* This modal's chrome is deliberately always-dark (carbon gradient, same family as
                the cookie banner but darker), independent of the
                site theme toggle - so every text color inside it is a fixed light hex, NOT a
                var(--text*) token, which would resolve to near-black in light mode and read as
                illegible grey-on-navy. */}
            <ModalTierBody tier={checkoutModal.tier} price={checkoutModal.price} desc={checkoutModal.desc} delivery={checkoutModal.delivery} mobile={mobile} />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>{t.checkoutModal.orderConfirmation}</div>
              {/* Single combined checkbox, not two - the old two-checkbox gate (business-customer
                  declaration + separate ToS/no-refund consent) meant the Continue button stayed
                  disabled through two clicks, not one, and funnel data showed most people never
                  cleared it: 68 clicks this month, cancel rates 50-100% per tier, ATTEMPT stuck
                  at 0-1, PAID at 0 everywhere. Merged 2026-07-31 - same legal content, one action. */}
              <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24, cursor: 'pointer' }}>
                <input type="checkbox" checked={agbChecked} onChange={e => { setAgbChecked(e.target.checked); setB2bChecked(e.target.checked) }}
                  style={{ marginTop: 3, accentColor: TEAL, width: 18, height: 18, flexShrink: 0 }} />
                <span style={{ color: '#a0a0b8', fontSize: mobile ? 14 : 13, lineHeight: 1.6 }}>
                  {t.checkoutModal.agreementPrefix}<strong style={{ color: '#e8e8f0' }}>{t.checkoutModal.agreementBusinessCustomer}</strong>{t.checkoutModal.agreementMiddle}<a href="#p/agb" style={{ color: 'var(--accent-text)' }}>{t.checkoutModal.agreementTos}</a>{t.checkoutModal.agreementSuffix}
                </span>
              </label>
              <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 10 }}>
                <button onClick={confirmCheckout}
                  disabled={!agbChecked || !b2bChecked}
                  style={{
                    flex: mobile ? undefined : 2, padding: '13px', borderRadius: 6, fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700,
                    // Always reads as "the real button", checked or not - a fully disabled-looking
                    // grey-on-transparent button next to a loud red Cancel was the actual conversion
                    // killer here, not the copy. Unchecked state keeps a visible teal outline instead.
                    background: agbChecked && b2bChecked ? TEAL : 'rgba(0,245,196,0.08)',
                    border: `1px solid ${agbChecked && b2bChecked ? TEAL : 'rgba(0,245,196,0.4)'}`,
                    color: agbChecked && b2bChecked ? '#070711' : 'rgba(0,245,196,0.55)',
                    cursor: agbChecked && b2bChecked ? 'pointer' : 'not-allowed',
                  }}>
                  {t.checkoutModal.continueToStripe}
                </button>
                <button onClick={() => cancelCheckout(checkoutModal.key)}
                  style={{ flex: 1, padding: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#8a8aa0', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {t.checkoutModal.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROPOSAL REQUEST MODAL - same "full breakdown before you commit" pattern as the
          checkout modal above, for tiers that route to Contact instead of Stripe. */}
      {proposalModal && (
        <div className="rfi-modal-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,4,7,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', display: 'flex', alignItems: mobile ? 'flex-end' : 'center', justifyContent: 'center', padding: mobile ? 0 : '1rem' }}>
          <div className="rfi-modal-panel" style={{
            background: 'linear-gradient(155deg, #17171d 0%, #0a0a0c 28%, #050506 52%, #131319 76%, #08080a 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
            backgroundBlendMode: 'overlay',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 50px rgba(0,0,0,0.55), 0 20px 60px rgba(0,0,0,0.65)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: mobile ? '14px 14px 0 0' : 14, padding: mobile ? '28px 24px 36px' : '40px 36px', maxWidth: mobile ? '100%' : 640, width: '100%', maxHeight: mobile ? '92vh' : '88vh', overflowY: 'auto' }}>
            {/* Same fixed-light-on-dark rule as the checkout modal above - this chrome
                doesn't follow the site theme either. */}
            <ModalTierBody tier={proposalModal.tier} price={proposalModal.price} desc={proposalModal.desc} delivery={proposalModal.delivery} mobile={mobile} />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
              <p style={{ color: '#a0a0b8', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                {t.proposalModal.bodyPrefix}<strong style={{ color: '#e8e8f0' }}>{proposalModal.tier}</strong>{t.proposalModal.bodySuffix}
              </p>
              <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 10 }}>
                <button onClick={confirmProposal}
                  style={{ flex: mobile ? undefined : 2, padding: '13px', background: TEAL, border: `1px solid ${TEAL}`, borderRadius: 6, color: '#070711', fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {t.proposalModal.continueToContact}
                </button>
                <button onClick={() => setProposalModal(null)}
                  style={{ flex: 1, padding: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#8a8aa0', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {t.proposalModal.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
      }}>
        <a href="#" onClick={e => { e.preventDefault(); navigateHome() }} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.png" alt="RFI-IRFOS" style={{ width: 42, height: 42, objectFit: 'contain', flexShrink: 0 }} />
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.06em', color: 'var(--text)' }}>RFI-IRFOS</span>
          <EkgLine theme={theme} />
        </a>

        {/* Desktop nav - React inline styles can't do media queries, so gate on the useMobile() hook */}
        <div style={{ display: mobile ? 'none' : 'flex', gap: '1.25rem', alignItems: 'center' }}>
          {/* Live feedback 2026-08-14: at the top of the page (nav still transparent,
              `scrolled` false) these links sit directly on the hero photo and
              disappeared against its busier patches. Button-wrapped now regardless of
              scroll state - glassy grey fill + blur - so they read as buttons against
              any background, not just plain text hoping for contrast. Follow-up
              feedback: not bold, rounded corners rather than a full pill, and grouped
              tight against each other (own inner gap, separate from the outer gap to
              the theme/locale/contact icon group). */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {NAV_LINKS.map(n => (
              <a key={n.href} href={n.href} style={{
                color: 'var(--text2)', fontSize: 14, fontWeight: 600,
                textDecoration: 'none', letterSpacing: '0.02em',
                padding: '8px 18px', borderRadius: 10,
                background: 'var(--bg2)', border: '1px solid var(--border)',
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                transition: 'color 0.18s, background 0.18s, border-color 0.18s',
              }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'var(--bg2)' }}
                onClick={e => { e.preventDefault(); navigateTo(n.href) }}
                aria-current={viewForSection(n.href.slice(1)) === view ? 'page' : undefined}>
                {n.label}
              </a>
            ))}
          </div>

          {/* Theme + Contact - same 38x38 square, same radius, sit flush together as one
              pair (their own tight-gap group, not the wide nav-link gap). Theme toggle is
              deliberately minimal/neutral (ghost button, no color fill) - Contact is the one
              that's allowed to be loud, solid ACCENT fill with a white icon. */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={toggleLocale} title={t.nav.localeTitle(LOCALE_LABEL[locale])} aria-label={t.nav.localeAria(LOCALE_LABEL[locale])} style={{
              width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 8,
              cursor: 'pointer', transition: 'background 0.15s, color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--text2)' }}>
              <LocaleIcon locale={locale} />
            </button>
            <button onClick={cycle} title={t.nav.themeTitle(t.nav.themeLabel[theme])} aria-label={t.nav.themeAria(t.nav.themeLabel[theme])} style={{
              width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 8,
              cursor: 'pointer', transition: 'background 0.15s, color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--text2)' }}>
              <ThemeIcon t={theme} />
            </button>
            {/* Standalone nav mail-icon button removed entirely (live feedback) -
                "Submit" is already in NAV_LINKS and points at the same consolidated
                contact/disclosure section, so this was a second, visually louder
                route to the identical destination. */}
          </div>
        </div>

        {/* Hamburger - shown only on mobile (media queries don't work in inline styles) */}
        <button onClick={() => setMobileOpen(o => !o)} style={{
          display: mobile ? 'flex' : 'none',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px', color: 'var(--text)',
        }} aria-label={t.nav.menuAria}>
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
          )}
        </button>
      </nav>

      {/* Mobile menu overlay — always mounted, drops down from the top (partial height) */}
      <div style={{
        position: 'fixed', top: 64, left: 'auto', right: 0, bottom: 'auto', zIndex: 99,
        width: 'min(50%, 320px)', height: 'auto',
        background: theme === 'dark'
          ? 'radial-gradient(120% 90% at 50% 0%, rgba(0,245,196,0.12) 0%, transparent 55%), linear-gradient(155deg, #1e1e24 0%, #101013 30%, #0a0a0c 55%, #17171d 78%, #0c0c0f 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.09) 0px, rgba(255,255,255,0.09) 1px, transparent 1px, transparent 3px)'
          : 'rgba(255,255,255,0.25)',
        backgroundBlendMode: theme === 'dark' ? 'overlay' : 'normal',
        border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid var(--border)',
        borderTop: 'none',
        borderRadius: '0 0 14px 14px',
        boxShadow: theme === 'dark'
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 50px rgba(0,0,0,0.45), 0 12px 40px rgba(0,0,0,0.55)'
          : '0 8px 32px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        padding: '1.5rem 1.5rem 1.75rem', gap: 4,
        // Fixed bug (live feedback, 2026-08-03): translateY(-110%) only clears
        // 110% of the panel's OWN height, but the panel also sits 64px down
        // from the viewport top (`top: 64`) - for any panel shorter than ~640px
        // tall, that left a visible sliver of the carbon-textured background
        // peeking in at the very top of the page. Adding the top offset itself
        // to the translate distance guarantees the whole panel clears y=0.
        transform: mobileOpen ? 'translateY(0)' : 'translateY(calc(-100% - 64px))',
        transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: mobileOpen ? 'auto' : 'none',
        textAlign: 'right',
      }}>
        {NAV_LINKS.map(n => (
          <a key={n.href} href={n.href} onClick={e => { e.preventDefault(); setMobileOpen(false); navigateTo(n.href) }} style={{
            color: 'var(--text)', fontSize: 20, fontWeight: 700, textDecoration: 'none',
            padding: '16px 0', borderBottom: '1px solid var(--border)', width: '100%',
            textAlign: 'right',
          }}>{n.label}</a>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 24, alignSelf: 'flex-end' }}>
          <button onClick={toggleLocale} title={t.nav.localeTitle(LOCALE_LABEL[locale])} aria-label={t.nav.localeAria(LOCALE_LABEL[locale])} style={{
            width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 8,
            cursor: 'pointer',
          }}><LocaleIcon locale={locale} /></button>
          <button onClick={cycle} title={t.nav.themeTitle(t.nav.themeLabel[theme])} aria-label={t.nav.themeAria(t.nav.themeLabel[theme])} style={{
            width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 8,
            cursor: 'pointer',
          }}><ThemeIcon t={theme} /></button>
          {/* Mobile mail-icon button removed too, same reasoning as the desktop nav
              - Submit already covers this destination. */}
        </div>
      </div>

      <main className="rfi-view-stage" key={view} aria-live="polite">
        {view === 'home' && <>
          <HeroSection mobile={mobile} theme={theme} />
          <ResearchSection />
          <AppPrivacySection />
          <CoopPartnersSection mobile={mobile} openCheckoutModal={openCheckoutModal} />
          <SubmitSection mobile={mobile} tipForm={tipForm} setTipForm={setTipForm} tipFormState={tipFormState} submitTip={submitTip} pixelRef={pixelRef} />
        </>}

        {view === 'systems' && <section id="systems" className="rfi-view-panel">
          <ProjectsSection />
        </section>}

        {view === 'evidence' && <section id="evidence" className="rfi-view-panel">
          <TrackRecordSection
            mobile={mobile} theme={theme} now={now} ledgerFired={ledgerFired} ledgerRef={ledgerRef}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            activeStatus={activeStatus} setActiveStatus={setActiveStatus}
            activeSev={activeSev} setActiveSev={setActiveSev}
            sortBy={sortBy} setSortBy={setSortBy}
            openDD={openDD} setOpenDD={setOpenDD}
            setReportModal={setReportModal}
            setIntelModal={setIntelModal}
          />
          <ProofSection setReportModal={setReportModal} />
        </section>}

        {view === 'access' && <section id="access" className="rfi-view-panel">
          <PricingSection openCheckoutModal={openCheckoutModal} openProposalModal={openProposalModal} />
          <JourneySection />
        </section>}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 2rem 28px', textAlign: 'center' }}>
        {/* WKO badge sized down a step (live feedback: "der Footer soll doch net so
            fett sein" - this loud red/white block was the single heaviest element in
            an otherwise thin/monospace footer) - opacity nudged down to match. */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <a href="https://www.wko.at" target="_blank" rel="noopener" title="WKO Mitglied - Wirtschaftskammer Osterreich" style={{ display: 'inline-block', opacity: 0.7 }}>
            <svg viewBox="0 0 420 100" width="120" height="29" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WKO - Wirtschaftskammer Osterreich" style={{ display: 'block' }}>
              <rect x="0"   y="0" width="100" height="100" fill="#CC0000"/>
              <text x="50"  y="78" fontFamily="Arial Black,sans-serif" fontSize="74" fontWeight="900" fill="#fff" textAnchor="middle">W</text>
              <rect x="105" y="0" width="100" height="100" fill="#CC0000"/>
              <text x="155" y="78" fontFamily="Arial Black,sans-serif" fontSize="74" fontWeight="900" fill="#fff" textAnchor="middle">K</text>
              <rect x="210" y="0" width="100" height="100" fill="#CC0000"/>
              <text x="260" y="78" fontFamily="Arial Black,sans-serif" fontSize="74" fontWeight="900" fill="#fff" textAnchor="middle">O</text>
              <rect x="320" y="0"  width="100" height="33" fill="#CC0000"/>
              <rect x="320" y="33" width="100" height="34" fill="#fff"/>
              <rect x="320" y="67" width="100" height="33" fill="#CC0000"/>
            </svg>
          </a>
        </div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--accent-text)', letterSpacing: '0.06em', marginBottom: 28, fontWeight: 600 }}>
          {t.footer.tagline}
          <br />
          <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 400 }}>{t.footer.taglineAttribution}</span>
        </p>
        {/* Three separate groups, not one flat row: Legal (statutory pages) vs.
            Company (who we are - Team moved here from the mainpage, see Stage 0
            of the website-repositioning plan) vs. Research (a core service, not
            company trivia - Laura's review round 2 specifically flagged folding
            Research into "Company" as confusing since it's a real service line). */}
        {/* Spread across the full footer width (live feedback: three groups
            clustered tightly in the center looked cramped against how wide the
            rest of the page is) - maxWidth + a grid instead of a centered flex
            cluster with a fixed gap. First pass used maxWidth 900, still far
            narrower than every other section's 1320 content width (Research/
            Projects/Track Record/Pricing/Journey/App Privacy all use 1320) - on
            a wide viewport that read as three narrow "pillars" stranded in the
            middle of the footer rather than a widescreen row. Matched to 1320
            so the footer's content width is consistent with the rest of the page.
            Equal-width grid columns, not flex + space-between: Legal (5 links)/
            Company (4)/Research (3) have different natural widths, so space-between
            gave each group a different width and left uneven, "choppy" gaps between
            them instead of a clean evenly-spaced row. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: 24, maxWidth: 1320, margin: '0 auto 24px' }}>
          {[
            {
              heading: t.footer.groups.legal.heading, links: [
                { label: t.footer.groups.legal.links.impressum, href: '/impressum' },
                { label: t.footer.groups.legal.links.datenschutz, href: '/datenschutz' },
                { label: t.footer.groups.legal.links.agb, href: '/agb' },
                { label: t.footer.groups.legal.links.security, href: '/security' },
                { label: t.footer.groups.legal.links.standards, href: '/standards' },
              ],
            },
            {
              heading: t.footer.groups.company.heading, links: [
                { label: t.footer.groups.company.links.team, href: '/team' },
                { label: t.footer.groups.company.links.careers, href: 'mailto:career@rfi-irfos.com' },
                { label: t.footer.groups.company.links.ternlang, href: 'https://ternlang.com' },
                { label: t.footer.groups.company.links.github, href: 'https://github.com/rfi-irfos' },
              ],
            },
            {
              heading: t.footer.groups.research.heading, links: [
                { label: t.footer.groups.research.links.research, href: '#research' },
                { label: t.footer.groups.research.links.trackRecord, href: '#track-record' },
                { label: t.footer.groups.research.links.methodology, href: '/methodology' },
              ],
            },
          ].map(group => (
            <div key={group.heading} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text4)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>{group.heading}</p>
              {/* Links run in one horizontal line under the heading, not stacked - live
                  feedback: a vertical list per group made the footer taller than it
                  needed to be. "·" separators (same pattern as the copyright line below)
                  keep adjacent links from reading as one run-on word when wrapped. */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                {group.links.map((l, i) => (
                  <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <a href={l.href} style={{ color: 'var(--text3)', fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => (e.currentTarget.style.color = TEAL)}
                      onMouseLeave={e => (e.currentTarget.style.color = '#606080')}>
                      {l.label}
                    </a>
                    {i < group.links.length - 1 && <span style={{ color: 'var(--text4)', fontSize: 12 }}>·</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Full registry data (ZVR/UID/GISA/GLN/Steuernummer/ECG authority/address) lives on
            Legal Notice - not duplicated here, this footer only needs to point there. */}
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text4)', letterSpacing: '0.08em', marginBottom: 0 }}>
          {t.footer.copyright}
        </p>
      </footer>
      {cookieBannerOpen && (
        // background/border/box-shadow come from .rfi-glass-flat now, not hand-rolled per
        // theme - that inline duplication only ever branched dark-vs-not-dark, so it silently
        // fell back to the light gradient under data-theme="hc" instead of the canonical
        // opaque-black/no-weave AAA treatment index.css already defines for hc. The shared
        // class is the single source of truth for all three themes; text still branches
        // explicitly below because, unlike the checkout modal, this surface's background
        // really does flip light/dark and can't just hardcode one text color.
        // rfi-glass-solid on top: this banner reads as a solid carbon plate, not the
        // translucent material the rest of the site uses - .rfi-glass-flat alone made it
        // 52% see-through (feedback 2026-08-06), so the opaque variant overrides just the
        // background while keeping the same theme-correct border/shadow/hc handling.
        <div ref={bannerRef} className="rfi-glass-flat rfi-glass-solid" style={{
                  position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 200,
                  maxWidth: 640, margin: '0 auto',
                  borderRadius: 12,
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                  transform: bannerClosing ? 'scale(0.85)' : 'scale(1)',
                  opacity: bannerClosing ? 0 : 1,
                  transition: 'transform 0.24s ease-in, opacity 0.24s ease-in',
                }}>
                  <p style={{ margin: 0, flex: '1 1 260px', fontSize: 13.5, color: theme === 'light' ? '#000000' : '#ffffff', fontWeight: 'bold', lineHeight: 1.5 }}>
                    {t.cookieBanner.text}
                    <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: theme === 'light' ? '#555555' : '#999999', letterSpacing: '0.04em', marginTop: 4, fontWeight: 'normal' }}>
                      {t.cookieBanner.subtext}
                    </span>
                  </p>
                  <div style={{ display: 'flex', gap: 8, flex: 'none' }}>
                    <button
                      onClick={() => {}}
                      style={{
                        background: 'transparent', color: theme === 'light' ? '#000000' : '#ffffff',
                        border: theme === 'light' ? '1px solid var(--border)' : '2px solid #ffffff',
                        borderRadius: 8, padding: '9px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {t.cookieBanner.doesNothing}
                    </button>
                    <button
                      onClick={dismissCookieBanner}
                      style={{
                        background: 'var(--accent)', color: 'var(--bg)', border: 'none',
                        borderRadius: 8, padding: '9px 16px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      {t.cookieBanner.close}
                    </button>
                  </div>
                </div>
      )}
    </div>
  )
}
