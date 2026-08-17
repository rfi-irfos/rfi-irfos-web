// Hero (no `<section id>` of its own - it's the first section on the page,
// scrolled to via the bare "#" logo link) - extracted verbatim from PublicSite.tsx.
import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { prefersReducedMotion, Reveal, RevealWords, CountUp, HeroFlipWord } from './shared'
import { RESEARCH_AREAS } from './Research'
import { useLocale } from '../../hooks/useLocale'
import type { Theme } from '../../hooks/useTheme'
// Imported (not a /public string path) so Vite content-hashes the built filename -
// every future swap of this file gets a new URL automatically, instead of silently
// colliding with visitors' 7-day cache-control on the old bytes at the same path.
import heroSoftware from '../../assets/hero-software.jpeg'
// Live DINGIR dashboard screenshots (2026-08-17), full resolution/quality on
// purpose - live feedback was explicit: "HD wie's geht", no compression.
import heroDingir2 from '../../assets/hero-dingir-2.png'
import heroDingir3 from '../../assets/hero-dingir-3.png'
import heroDingir4 from '../../assets/hero-dingir-4.png'
import heroDingir5 from '../../assets/hero-dingir-5.png'
import heroDingir6 from '../../assets/hero-dingir-6.png'
import heroDingir7 from '../../assets/hero-dingir-7.png'
import heroDingir8 from '../../assets/hero-dingir-8.png'
import heroDingir9 from '../../assets/hero-dingir-9.png'
import heroDingir10 from '../../assets/hero-dingir-10.png'
import heroDingir11 from '../../assets/hero-dingir-11.png'
import heroDingir12 from '../../assets/hero-dingir-12.png'
import heroDingir13 from '../../assets/hero-dingir-13.png'
// Append more `import heroX from '../../assets/hero-x.jpeg'` + entries here to
// grow the slideshow - HeroSlideshow below already handles 1..N images. With
// just one, it renders exactly like the old single static image (no interval,
// no cross-fade) rather than needing a separate code path for that case.
const HERO_IMAGES = [
  heroSoftware, heroDingir2, heroDingir3, heroDingir4, heroDingir5, heroDingir6, heroDingir7,
  heroDingir8, heroDingir9, heroDingir10, heroDingir11, heroDingir12, heroDingir13,
]

const LazyHeroCanvas = lazy(() => import('../HeroCanvas'))

// Gates the WebGL hero background: skipped outright under prefers-reduced-motion,
// on narrow/mobile viewports (no room for it to read as ambient depth, just cost),
// and on low-core-count devices (a cheap, if imperfect, low-end-hardware signal).
// Lazy-imported so its ~30kb (ogl) never blocks the hero's first paint - the existing
// CSS radial-gradient (set directly on the hero section) stays as the base layer/
// no-JS fallback the whole time, this only ever adds on top of it.
// `theme` comes from PublicSite as a prop, not its own useTheme() call - useTheme's
// state is per-instance/local by design (so e.g. a builder preview can run independently),
// which meant this component's own copy went stale the moment the nav theme toggle
// changed PublicSite's instance: the hero background/canvas silently froze on whatever
// theme was active at mount instead of following the toggle. Passing theme down keeps
// this section in lockstep with the single source of truth PublicSite already owns.
// Slow cross-fade between hero screenshots, each still getting its own Ken
// Burns zoom (the .rfi-hero-zoom CSS animation, index.css) as it becomes
// active. Deliberately calm: an earlier looping-video hero was reverted
// 2026-08-15 specifically because it read as too busy/distracting behind the
// headline, and the first cut of this slideshow overcorrected the other way
// - live feedback: the incoming image was popping in at full opacity
// instead of fading, and the whole cycle felt too quick ("BOOOM nächstes
// bild"). Two real causes, both fixed below, not just retuned numbers:
//
// 1) FIRST BUG: a plain `<div key={current}>` with `opacity: 1` set directly
// in its initial style renders at full opacity on the very first paint -
// CSS transitions only animate a property that CHANGES on an already-
// rendered element, not an element's initial value on mount. Only the
// outgoing slide (an existing node whose opacity actually changed) was
// ever animating; the incoming one just appeared. AnimatePresence/motion.div
// handle exactly this - `initial`/`animate` on a newly-mounted element is
// framer-motion's whole reason to exist, so the fade-IN now genuinely
// animates instead of popping.
//
// 2) Timing was too tight for "professional" pacing: 8s/slide, 2s fade.
// Now 13s/slide with a 3.2s fade - noticeably longer dwell time on each
// image ("längeres showcase") and a slower, softer blend, still calm
// rather than busy.
//
// ONLY THE CURRENT SLIDE (PLUS ITS BRIEFLY-OVERLAPPING PREDECESSOR DURING
// THE FADE) IS EVER IN THE DOM, via AnimatePresence with a single keyed
// child - not all N at once. The first version of this rendered all N
// images up front (one div per slide, opacity 0/1); harmless at the old
// single-image size, but these are full-resolution, uncompressed dashboard
// screenshots (up to 3MB each, ~11MB for the full set) by explicit request
// ("HD wie's geht", no compression). Mounting all of them up front meant
// every one got fetched and decoded immediately on load, which stalled the
// page long enough that the prerender build step's `waitForSelector` on the
// headline timed out entirely - caught by running the actual production
// build, not just tsc.
//
// The NEXT slide is explicitly preloaded a beat before its turn (a plain
// `Image()`, not rendered) so the cross-fade never has to wait on a
// mid-transition network fetch.
//
// The Ken Burns zoom (.rfi-hero-zoom, index.css) restarts correctly because
// AnimatePresence mounts a genuinely fresh DOM node per slide (keyed by
// index) rather than reusing one - an `animation-fill-mode: forwards`
// animation holds its end state once played, so re-showing the same node
// via opacity alone would leave it static on a second viewing.
const SLIDE_INTERVAL_MS = 15000
const CROSSFADE_S = 3.2

function HeroSlideshow({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (images.length <= 1 || reduced) return
    // Warm the browser's cache for the NEXT slide while the current one is
    // still showing - a full interval's head start before it's needed.
    const preload = new Image()
    preload.src = images[(current + 1) % images.length]

    const id = setTimeout(() => setCurrent(c => (c + 1) % images.length), SLIDE_INTERVAL_MS)
    return () => clearTimeout(id)
  }, [current, images, reduced])

  return (
    <AnimatePresence>
      <motion.div
        key={current}
        aria-hidden="true"
        className="rfi-hero-zoom"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduced ? undefined : { opacity: 0 }}
        transition={{ duration: reduced ? 0 : CROSSFADE_S, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, zIndex: -2,
          backgroundImage: `url("${images[current]}")`, backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      />
    </AnimatePresence>
  )
}

function HeroBackground({ theme }: { theme: Theme }) {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const cores = navigator.hardwareConcurrency ?? 8
    return theme === 'dark' && !prefersReducedMotion() && window.innerWidth >= 1024 && cores >= 4
  })
  if (!enabled || theme !== 'dark') return null
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
      <Suspense fallback={null}>
        <LazyHeroCanvas />
      </Suspense>
    </div>
  )
}

const PUBLICATIONS = [
  { year: '2026', title: 'Android Security Audit 2026: Coordinated Disclosure', sub: '215+ apps · 100+ companies · 250+ critical findings · NYSE/NASDAQ/LSE/XETRA · StoryToys children\'s wave · disclosure Sep 2026', href: 'https://github.com/rfi-irfos/android-security-audit-2026', tag: 'Security · Ongoing' },
  { year: '2026', title: 'The Ternary Intelligence Stack', sub: 'vertically integrated post-binary AI platform', href: 'https://osf.io/cyn28/', tag: 'AI · Systems' },
  { year: '2026', title: 'Myco-Styria', sub: 'polystyrene replacement via mycelium + Austrian lignocellulose residues', href: 'https://osf.io/ek8rm/', tag: 'Ecocentric' },
  { year: '2025', title: 'A Ternary Logic Mixture-of-Experts Model', sub: 'sparse ternary MoE architecture with autonomous Net2Net surgery', href: 'https://osf.io/tz7dc/', tag: 'AI · Model' },
  { year: '2025', title: 'The Ternlang Architecture', sub: 'post-binary logic framework for ethical autonomous AI', href: 'https://osf.io/zwnyr/', tag: 'AI · Governance' },
  { year: '2025', title: 'Policy Mirror Protocol', sub: 'embedding transparency and traceability into AI refusal boundaries', href: 'https://osf.io/d2k4x/', tag: 'AI · Policy' },
  { year: '2025', title: 'From Waste to Wild', sub: 'circular ecocentric model for riverine plastic interception', href: 'https://osf.io/4w5g6/', tag: 'Ecocentric' },
  { year: '2025', title: 'PedalGate v1.0', sub: '101-day investigation into systemic inequities on Austrian delivery platforms', href: 'https://osf.io/h5u8f/', tag: 'Security · Accountability' },
  { year: '2025', title: 'A1ERF: EU Regulation Proposal', sub: 'AI-first emergency relay framework for autonomous cardiac arrest detection', href: 'https://osf.io/ueac8/', tag: 'Policy · EU' },
]

export function HeroSection({ mobile, theme }: { mobile: boolean, theme: Theme }) {
  const { t } = useLocale()
  return (
    <section style={{
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
      alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center',
      padding: 'calc(72px + 6vh) var(--sec-pad-x) 72px',
      // Tint gradient only - the actual photo is the dedicated zoom layer below,
      // not this section's own background. Kept as a tint (not a full photo) for
      // text legibility over whatever's showing through it. Tried tuning a
      // separate, lighter tint for light theme (twice - first too transparent,
      // "strange grey mess", then overcorrected to fully hiding the photo) before
      // live feedback settled it: same principle regardless of dark or light mode,
      // hero always shows the photo in its own dark tint - only HC (which needs
      // near-opaque for its own contrast floor) stays different.
      background: theme === 'hc'
        ? 'rgba(0,0,0,0.45)'
        : 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,245,196,0.08) 0%, transparent 70%), linear-gradient(90deg, rgba(5,7,14,0.55) 0%, rgba(5,7,14,0.32) 52%, rgba(5,7,14,0.5) 100%)',
    }}>
      {/* Real screenshots of our own OSINT/monitoring software as the hero backdrop
          (reverted 2026-08-15, live feedback: back to a still image - the looping
          video read as too busy/distracting sitting behind the headline; the
          2026-08-17 slideshow keeps that lesson - slow 8s cycle, 1.5s cross-fade,
          not a busy loop). Each slide gets its own Ken Burns zoom-out - starts
          tight/zoomed in, eases out to the full frame over the animation's run,
          then holds (animation-fill-mode: forwards in the .rfi-hero-zoom CSS
          rule, index.css). overflow: hidden on the section above clips the
          zoomed-in overflow; transform (not background-size) animates since
          transform is compositor-only, cheaper than repainting background-size
          every frame. Sits behind HeroBackground's WebGL canvas (zIndex -1) at
          -2, and behind the tint gradient above it (the section's own
          `background`, which paints on top of z-index -2/-1 children per
          normal stacking order). */}
      <HeroSlideshow images={HERO_IMAGES} />
      <HeroBackground theme={theme} />
      {/* Stays English in both locales (live feedback) - "Rethink the Obvious."
          is the site's signature line/wordmark-adjacent phrase, not translated
          copy. "Rethink" split out to HeroFlipWord (2026-08-05, approved after
          several review rounds) - same reveal-in timing it had inside
          RevealWords before (delay 0.2), "the Obvious." keeps its own timing by
          starting RevealWords' stagger at 0.36 instead of 0.2 (equivalent to
          "the"/"Obvious." having been words 1/2 of one three-word call). */}
      {/* color fixed here too (not inherited var(--text)) - same always-dark-hero
          reasoning as the identity bar/KPIs below: light theme's near-black
          default text went illegible once the hero stopped following theme. */}
      <p className="rfi-display" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: 6, letterSpacing: '-0.01em', marginTop: 32, color: '#e8e8f0' }}>
        <HeroFlipWord word="Rethink" delay={0.2} />{' '}
        <RevealWords text="the Obvious." delayStart={0.36} emphasizeIndices={[1]} />
      </p>
      {/* Mount-triggered fly-in, not the scroll-linked `Reveal` (used elsewhere below
          the fold) - Reveal drives its animation off scroll progress through the
          viewport, so content already in view at page load (everything in the Hero)
          never gets a scroll transit to animate through and just appears static.
          Chained after the headline settles (RevealWords' last word starts at 0.36 +
          1*0.16 = 0.52s) - same easing curve as RevealWords for visual consistency.
          Font size taken down a step further (clamp 1.05-1.4rem -> 0.95-1.2rem, live
          feedback 2026-08-14: still reading too heavy under the shrunk headline). */}
      {/* Live feedback 2026-08-14: the identity line sits directly on the busy
          dashboard screenshot now (map dots/lines right behind the glyphs), so
          plain text color alone doesn't hold contrast anymore. A solid bar in
          the theme's own background tone sweeps in behind the text (scaleX,
          left-anchored, "zieht rein") just before the text itself fades up -
          same fix pattern as a highlighter, not a glass panel: opaque enough
          to read cleanly against any part of the photo underneath it. Fixed
          hex, not var(--text2)/theme-conditional, now that the hero's own
          background is always the dark tint regardless of site theme (same
          "carbon modal" reasoning as the ledger modals - a section that's
          deliberately theme-independent needs theme-independent text too,
          or light mode's dark text tokens go illegible on it). maxWidth
          widened 1000->1300 so the longer identity line (with "Kein Theater,
          keine Warnwesten.") fits on one line instead of wrapping mid-bar. */}
      <div style={{ position: 'relative', display: 'inline-block', maxWidth: 1300, marginBottom: 40 }}>
        <motion.div
          aria-hidden="true"
          initial={prefersReducedMotion() ? undefined : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', inset: '-1px -4px', zIndex: 0, borderRadius: 3, transformOrigin: 'left center',
            background: theme === 'hc' ? 'rgba(0,0,0,0.92)' : 'rgba(5,7,14,0.88)',
          }}
        />
        {/* This paragraph is the page's LCP element (Lighthouse, 2026-08-16) - the old
            0.65s delay + 0.8s fade added ~1.45s of pure animation on top of JS hydration
            time, directly inflating the LCP score for purely cosmetic reveal polish.
            Cut hard since this is the single largest lever on the performance score;
            the bar sweep above is decorative and unaffected. */}
        <motion.p
          initial={prefersReducedMotion() ? undefined : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.95rem, 1.7vw, 1.2rem)', fontWeight: 400, color: '#a0a0b8', lineHeight: 1.5, letterSpacing: '0.01em', margin: 0 }}
        >
          {t.hero.identity}
        </motion.p>
      </div>

      {/* Stats moved up, directly after the identity paragraph (live feedback:
          the hero read as a wall of text with too many stacked lines before
          anything concrete landed). Problem/solution carousel now sits after
          the stats, as a single slower-cycling line rather than competing with
          a second static teal headline underneath it (that redundant "Most
          technology decisions..." line has been removed entirely). */}
      {/* FIXED (live bug report, mobile Safari, 2026-08-15): was a hard `repeat(5,
          1fr)` - 5 equal columns at every viewport width, with `mobile` only
          ever touching the gap, never the column count. On a ~390px phone that
          forces 5 columns down to ~50px each, well under the card's own min
          content width (the number alone floors at clamp()'s 2rem/32px), so
          the row just crushed/overflowed - not "a bit too big," no responsive
          logic was actually sizing it to the viewport at all. `auto-fit` +
          `minmax` (same pattern already used for TierCarousel's secondary row
          below in this file) reflows continuously by available width instead
          of a single mobile/desktop toggle: 5-across at the 980px desktop
          maxWidth, 2 or 3-across on a phone, 1-across only once a column would
          otherwise drop under the readable floor - correct at 360/390/430px
          and everything between, not just the one width someone last tested. */}
      {/* FIXED (live bug report, mobile Chrome screenshot, 2026-08-16): the auto-fit/
          minmax fix above was still overflowing off the right edge on real mobile
          viewports ("die kpis gehn rechts am rand raus"). Root cause: this section's
          own flex container sets `alignItems: 'center'` (not the flex default
          `stretch`), so without an explicit `width` this grid was sized via
          shrink-to-fit/max-content instead of being constrained to the actually
          available cross-axis space - `auto-fit` was then computing its column count
          against that unconstrained max-content width, not the real ~310px viewport
          budget, so a 3rd column got created and spilled past the screen edge.
          `width: '100%'` (bounded by the existing maxWidth: 980) forces layout to use
          the real available width, so auto-fit wraps to 2/1 columns correctly. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: mobile ? '1.25rem' : '3rem', margin: '0 auto 24px', width: '100%', maxWidth: 980, justifyContent: 'center' }}>
        {/* Deliberately NOT the same numbers as the Track Record stat row further down -
            that one is audit-specific (apps/findings/companies/regulators), this one is
            the breadth story: research areas, systems and projects, publications, team,
            years. Showing the same five numbers twice wastes the hero's one shot at
            explaining why the institute matters beyond appsec. */}
        {([
          { n: `${RESEARCH_AREAS.length}`,    label: t.hero.stats.researchAreas,      from: 'left'   as const },
          // Was `${PROJECTS.length}+` (18+) - only counted the curated highlight
          // cards in the Systems section, not RFI-IRFOS's actual system count.
          // Live-counted via `gh repo list` across both accounts (2026-08-15):
          // 53 original (non-fork) repositories - see rfi-irfos-architecture-
          // synthesis.md for the full breakdown. Re-count periodically, same
          // caveat as the footer's repo directory (content/repos.ts).
          { n: '53+',                         label: t.hero.stats.openSourceProjects, from: 'bottom' as const },
          { n: `${PUBLICATIONS.length}+`,     label: t.hero.stats.publications,       from: 'scale'  as const },
          { n: '301',                         label: t.hero.stats.agents,             from: 'bottom' as const },
          { n: '1',                           label: t.hero.stats.worldModel,         from: 'bottom' as const },
        ]).map((s, i) => (
          <Reveal key={s.label} delay={i} from={s.from} style={{ height: '100%' }}>
            {/* Same canonical carbon-gradient card as the ledger/checkout modals
                (live feedback 2026-08-14: "gebma den kpis die gleichen carbon
                cards wie den ledger auch?") - fixed hex text, not var(--accent-
                text)/var(--text), same reasoning as the identity bar above: this
                sits on the hero's always-dark tint regardless of site theme.
                height: 100% + flex centering (live feedback: "kpi cards are not
                the same size") - labels wrap to a different number of lines
                ("SYSTEMS & PROJECTS" vs "PUBLICATIONS"), so without a shared
                height each card just hugged its own content and the row looked
                uneven. */}
            {/* justifyContent was 'center', which vertically centred the whole
                number+label block - so the two cards whose label wraps to two
                lines pushed their NUMBER up relative to the single-line cards and
                the row read as misaligned (live feedback 2026-08-16). Top-aligned
                instead: every number sits on one line, every first label line
                sits on one line, and only the wrapping cards extend a second line
                downward. height:100% still equalises the card sizes themselves. */}
            <div style={{
              height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
              textAlign: 'center', padding: '20px 12px', borderRadius: 12,
              background: 'linear-gradient(155deg, #1c1c22 0%, #101014 28%, #0a0a0d 52%, #18181f 76%, #0d0d11 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.055) 0px, rgba(255,255,255,0.055) 1px, transparent 1px, transparent 3px)',
              backgroundBlendMode: 'overlay',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 30px rgba(0,0,0,0.5), 0 12px 30px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}>
              <div style={{ fontSize: 'clamp(2rem, 3.3vw, 2.75rem)', fontWeight: 900, color: '#00f5c4', lineHeight: 1 }}><CountUp value={s.n} /></div>
              {/* marginRight cancels the trailing letter-space that letter-spacing
                  appends after the final character. Centred text is otherwise
                  optically pushed right by half a tracking unit, which is what
                  made the longest label look off-centre. */}
              <div style={{ fontSize: 11, color: '#e8e8f0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.35, marginTop: 8, marginRight: '-0.08em' }}>{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Problem/solution carousel moved out of the hero entirely - live
          feedback: it works better as content, not decoration, so it now lives
          under "what we build" (Projects section), enriched with detail and a
          pricing link per pair - see ProblemSolutionShowcase below. */}

      {/* "I am a..." persona chips removed entirely (live feedback: redundant -
          the nav/CTAs/Research Areas right below already cover the same
          "where do I look" job without a second, parallel navigation device). */}
    </section>
  )
}
