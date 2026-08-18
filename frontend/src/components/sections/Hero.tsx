// Hero (no `<section id>` of its own - it's the first section on the page,
// scrolled to via the bare "#" logo link) - extracted verbatim from PublicSite.tsx.
import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { prefersReducedMotion, RevealWords, CountUp, HeroFlipWord } from './shared'
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
import heroDingir10 from '../../assets/hero-dingir-10.png'
import heroDingir11 from '../../assets/hero-dingir-11.png'
import heroDingir12 from '../../assets/hero-dingir-12.png'
import heroDingir13 from '../../assets/hero-dingir-13.png'
// hero-dingir-9 (Turkish Straits + a live DINGIR chat answer panel) was
// pulled 2026-08-18 - live feedback: it read as "a screenshot of a chatbot"
// rather than a satellite/software shot, once the slideshow had enough
// other frames for that one to stand out. Replaced by the vessel-tracking
// shot below, which shows the same satellite basemap without the chat UI.
import heroDingirVesselsNl from '../../assets/hero-dingir-vessels-nl.png'
// Four more plain-software (MAP-mode, not SAT-mode) shots (2026-08-18) -
// brought the software-UI count up to 8, matching satellite and (mostly)
// matching neural-network, so the 3-way rotation below is a real round-robin
// instead of running out of one category early.
import heroDingirMapDc from '../../assets/hero-dingir-map-dc.png'
import heroDingirMapGrazDossier from '../../assets/hero-dingir-map-graz-dossier.png'
import heroDingirGlobeAntarctica from '../../assets/hero-dingir-globe-antarctica.png'
import heroDingirGlobeAfricaThreats from '../../assets/hero-dingir-globe-africa-threats.png'
// The embedding-graph ("neural network") shots - DINGIR's UMAP/cosine-
// similarity view of albert's own token embeddings, 3D-rendered inside a
// wireframe cube. Added 2026-08-18 as a third slideshow category alongside
// plain software UI and satellite: "drei typen zum wechseln - normal,
// satellit und vom neuralen netzwerk selber". -embed-storm is the one shot
// that actually shows the cube's wireframe edges rather than just the
// zoomed-in node cluster - live feedback specifically wanted this visible
// ("nich nur label, whitebox by design" - the wireframe IS the point, not
// just a claim about it), so it leads this category in the sequence below.
import heroDingirEmbedBuoy from '../../assets/hero-dingir-embed-buoy.png'
import heroDingirEmbedLanguage from '../../assets/hero-dingir-embed-language.png'
import heroDingirEmbedImpact from '../../assets/hero-dingir-embed-impact.png'
import heroDingirEmbedCoast from '../../assets/hero-dingir-embed-coast.png'
import heroDingirEmbedStorm from '../../assets/hero-dingir-embed-storm.png'
import heroDingirEmbedHope from '../../assets/hero-dingir-embed-hope.png'
import heroDingirEmbedWater from '../../assets/hero-dingir-embed-water.png'
import heroDingirEmbedDecided from '../../assets/hero-dingir-embed-decided.png'
// -embed-incident and -embed-decade ("1950") are the same decade/timeline
// cluster shape as several others above, so they ride as two extra
// neural-network-only slides at the end rather than forcing a 4th category
// or an uneven triad - still shown ("alle screenshots"), just not forced
// into lockstep with a software/satellite pair that doesn't exist for them.
import heroDingirEmbedIncident from '../../assets/hero-dingir-embed-incident.png'
import heroDingirEmbedDecade from '../../assets/hero-dingir-embed-decade.png'
// Append more `import heroX from '../../assets/hero-x.jpeg'` + entries here to
// grow the slideshow - HeroSlideshow below already handles 1..N images. With
// just one, it renders exactly like the old single static image (no interval,
// no cross-fade) rather than needing a separate code path for that case.
// Three categories rotate after the globe opener - plain software UI
// (vector map/globe/panel, MAP mode), satellite (photographic SAT-mode
// basemap), and neural-network (the embedding-graph shots) - in strict
// software -> satellite -> neural-network triads, 8 of each, per live
// feedback ("ersch kommt das netzt - dann satellit - dann software - dann
// wieder das netzt"). 2 extra neural-network shots ride at the end since
// there were 10 of those supplied against 8 software/8 satellite.
const HERO_IMAGES = [
  heroSoftware,
  heroDingir2, heroDingir4, heroDingirEmbedStorm,
  heroDingirMapDc, heroDingir6, heroDingirEmbedBuoy,
  heroDingir7, heroDingir12, heroDingirEmbedLanguage,
  heroDingirMapGrazDossier, heroDingir13, heroDingirEmbedWater,
  heroDingir8, heroDingir5, heroDingirEmbedImpact,
  heroDingirGlobeAntarctica, heroDingir10, heroDingirEmbedHope,
  heroDingir3, heroDingir11, heroDingirEmbedCoast,
  heroDingirGlobeAfricaThreats, heroDingirVesselsNl, heroDingirEmbedDecided,
  heroDingirEmbedIncident, heroDingirEmbedDecade,
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
            // Light theme: white bar + dark text (live feedback), same highlighter
            // logic as before, just flipped - still opaque enough to read cleanly
            // against any part of the photo underneath it.
            background: theme === 'hc' ? 'rgba(0,0,0,0.92)' : theme === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(5,7,14,0.88)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
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
          style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.95rem, 1.7vw, 1.2rem)', fontWeight: 400, color: theme === 'light' ? '#1a1a20' : '#ffffff', lineHeight: 1.5, letterSpacing: '0.01em', margin: 0 }}
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
            the breadth story: research areas, systems and projects, live monitoring
            scale, team, years. Showing the same five numbers twice wastes the hero's
            one shot at explaining why the institute matters beyond appsec. */}
        {([
          { n: `${RESEARCH_AREAS.length}`,    label: t.hero.stats.researchAreas,      from: 'left'   as const, sub: t.hero.stats.researchAreasSub },
          // Was `${PROJECTS.length}+` (18+) - only counted the curated highlight
          // cards in the Systems section, not RFI-IRFOS's actual system count.
          // Live-counted via `gh repo list` across both accounts (2026-08-15):
          // 53 original (non-fork) repositories - see rfi-irfos-architecture-
          // synthesis.md for the full breakdown. Re-count periodically, same
          // caveat as the footer's repo directory (content/repos.ts).
          { n: '53+',                         label: t.hero.stats.openSourceProjects, from: 'bottom' as const, sub: t.hero.stats.openSourceProjectsSub },
          // Replaced the old "9+ publications" count (2026-08-18, live feedback:
          // wanted a "hitter metric nobody else can reproduce") with DINGIR's live
          // tracked-entity count instead - satellites, ships, flights, CCTV cameras,
          // wildfires, buoys, earthquakes, GDELT events and more, individually
          // counted, not a fabricated throughput number (the dashboard's own source
          // comment: "Real entity count — no fake throughput metrics"). Verified live
          // against dingir-osint.fly.dev on 2026-08-18: summing every entity type the
          // dashboard tracks came to ~61k at query time; "58k+" is a conservative
          // floor that stays true as the live count fluctuates rather than the
          // instantaneous reading. Re-verify before raising this number further.
          { n: '58k+',                        label: t.hero.stats.dataPointsMonitored, from: 'scale'  as const, sub: undefined as string | undefined },
          { n: '301',                         label: t.hero.stats.agents,             from: 'bottom' as const, sub: undefined as string | undefined },
          { n: '1',                           label: t.hero.stats.worldModel,         from: 'bottom' as const, sub: undefined as string | undefined },
        ]).map((s, i) => (
          // Mount-triggered fly-in, NOT `Reveal` (same fix pattern as the identity
          // paragraph above, same root cause): Reveal drives its transform off
          // scroll progress through the viewport, but this row is above the fold -
          // already fully in view at mount, so it never gets a scroll transit to
          // animate through and Reveal's animation silently never played (live bug
          // report: "die KPI cards brauchen den Effekt auch, der fehlt komplett").
          <motion.div
            key={s.label}
            initial={prefersReducedMotion() ? undefined : {
              opacity: 0,
              x: s.from === 'left' ? -32 : s.from === 'right' ? 32 : 0,
              y: s.from === 'bottom' ? 32 : s.from === 'top' ? -32 : 0,
              scale: s.from === 'scale' ? 0.84 : 1,
            }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100%' }}
          >
            {/* Carbon-gradient card in dark/hc (same family as the ledger/checkout
                modals), given more grey than the original near-black mix + a plain
                white card in light theme (live feedback: light theme needs its own
                treatment here, not the fixed always-dark card - unlike the identity
                bar/nav, these sit low enough in the hero that a white card reads
                fine against the dark photo tint above them).
                height: 100% + flex centering (live feedback: "kpi cards are not
                the same size") - labels wrap to a different number of lines
                ("SYSTEMS & PROJECTS" vs "DATA POINTS MONITORED"), so without a shared
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
              // Light theme: soft glass, not solid white - a hint of the dark hero
              // photo still shows through (live feedback: "leichter Glass-Effekt
              // statt vollem Weiss, ganz zart").
              background: theme === 'light'
                ? 'linear-gradient(155deg, rgba(255,255,255,0.82) 0%, rgba(246,247,248,0.78) 100%)'
                : 'linear-gradient(155deg, #34343d 0%, #222228 28%, #1a1a1e 52%, #2c2c34 76%, #1e1e22 100%), repeating-linear-gradient(112deg, rgba(255,255,255,0.055) 0px, rgba(255,255,255,0.055) 1px, transparent 1px, transparent 3px)',
              backdropFilter: theme === 'light' ? 'blur(14px)' : undefined,
              WebkitBackdropFilter: theme === 'light' ? 'blur(14px)' : undefined,
              backgroundBlendMode: theme === 'light' ? 'normal' : 'overlay',
              boxShadow: theme === 'light'
                ? '0 12px 30px rgba(0,0,0,0.35)'
                : 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 30px rgba(0,0,0,0.5), 0 12px 30px rgba(0,0,0,0.5)',
              border: theme === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.09)',
            }}>
              {/* Dark theme: deeper, less cyan-bright green than the site's usual
                  #00f5c4 accent (live feedback: better visibility, scoped to this
                  card only). Light theme: same #009e7a the icon tiles below use as
                  --accent (live feedback: the dark-theme green was hard to read on
                  the light glass card, use what's already proven legible there). */}
              <div style={{ fontSize: 'clamp(2rem, 3.3vw, 2.75rem)', fontWeight: 900, color: theme === 'light' ? '#009e7a' : '#00c896', lineHeight: 1 }}><CountUp value={s.n} /></div>
              {/* marginRight cancels the trailing letter-space that letter-spacing
                  appends after the final character. Centred text is otherwise
                  optically pushed right by half a tracking unit, which is what
                  made the longest label look off-centre. */}
              <div style={{ fontSize: 11, color: theme === 'light' ? '#3a3a42' : '#e8e8f0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.35, marginTop: 8, marginRight: '-0.08em' }}>{s.label}</div>
              {/* Small connective caption under just these two cards (2026-08-18,
                  live feedback) - signals research areas and systems aren't
                  counted in isolation, they operate as one whole. */}
              {s.sub && <div style={{ fontSize: 9.5, color: theme === 'light' ? '#6a6a76' : 'var(--text3)', fontWeight: 500, letterSpacing: '0.04em', marginTop: 3 }}>{s.sub}</div>}
            </div>
          </motion.div>
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
