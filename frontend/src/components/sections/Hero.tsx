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
// software -> satellite -> neural-network triads, per live feedback ("ersch
// kommt das netzt - dann satellit - dann software - dann wieder das netzt").
// BUG FIXED 2026-08-19: the first version of this had 10 neural-network shots
// against only 8 software/8 satellite, and tacked the 2 extras onto the very
// end as their own pair - which put 3 neural shots back to back right where
// the array wrapped (live bug report: "dreimal ein neurales netzwerk foto
// hintereinander"). Fixed by cycling software/satellite through all 10
// rounds instead (the last 2 rounds repeat one software + one satellite shot
// each) so every round is still a genuine triad and no two same-category
// shots ever sit next to each other, including at the wrap back to the globe
// opener. Repeating 2 of 8 shots once across a 31-slide rotation is the
// honest tradeoff for having 10 neural shots and only 8 of the other two -
// more of either would need new screenshots, not a code fix.
// Re-ordered 2026-08-23 (live bug report: "two globes after each other") - the
// 2026-08-23 hero-dingir-7 replacement (old flat 2D cyclone map -> new 3D
// globe storm shot) pushed the software category to FOUR globe-perspective
// frames (hero-dingir-7, hero-dingir-8's globe-backed reasoning panel,
// globe-antarctica, globe-africa-threats) out of 8, and satellite already had
// two (hero-dingir-12, hero-dingir-13) - the naive round-robin put a software
// globe and a satellite globe in the SAME round (r=2), i.e. back to back in
// the actual slide sequence. Fixed by placing every globe-perspective shot at
// an EVEN index in its own array (0/2/4/6 for software's 4 globes, spaced by
// exactly one flat/tilted shot each) and every satellite globe at an ODD
// index that software's globes don't occupy (1/5, spaced 4 apart, the max
// possible for 2 items in an 8-slot cycle) - so no round ever pairs two
// globe shots, and no two globes sit closer than one other shot apart even
// across the 8/10-round wrap.
const HERO_SOFTWARE_SHOTS = [heroDingir7, heroDingir2, heroDingirGlobeAntarctica, heroDingirMapDc, heroDingirGlobeAfricaThreats, heroDingir3, heroDingir8, heroDingirMapGrazDossier]
const HERO_SATELLITE_SHOTS = [heroDingir4, heroDingir12, heroDingir6, heroDingir5, heroDingir11, heroDingir13, heroDingir10, heroDingirVesselsNl]
const HERO_NEURAL_SHOTS = [heroDingirEmbedStorm, heroDingirEmbedBuoy, heroDingirEmbedLanguage, heroDingirEmbedWater, heroDingirEmbedImpact, heroDingirEmbedHope, heroDingirEmbedCoast, heroDingirEmbedDecided, heroDingirEmbedIncident, heroDingirEmbedDecade]
// Exported for WorldModel.tsx's own hero panel (live feedback 2026-09-01:
// "die slideshow zeigen von den screenshots die wir haben... wie draussen im
// main hero") - same image pool and cross-fade mechanic reused inside a
// bounded panel there instead of this section's full-viewport background.
export const HERO_IMAGES = [
  heroSoftware,
  ...HERO_NEURAL_SHOTS.flatMap((neural, r) => [
    HERO_SOFTWARE_SHOTS[r % HERO_SOFTWARE_SHOTS.length],
    HERO_SATELLITE_SHOTS[r % HERO_SATELLITE_SHOTS.length],
    neural,
  ]),
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

// `zoomEffect` (default true, the homepage's own behaviour) toggles the Ken
// Burns .rfi-hero-zoom animation - added 2026-09-01 for WorldModel.tsx's small
// bounded panel, which wants a plain crossfade only, no zoom motion (live
// feedback: "it always shows the pictures fit to the actual size of this box...
// no zoom in or zoom out", zoom/pan lives in the fullscreen lightbox instead,
// user-driven via scroll/drag, not this component's own per-slide animation).
// `fit` (default 'cover', the homepage's own behaviour, photographic shots
// that are fine being cropped to fill) - WorldModel's screenshots are real
// UI captures where a crop can slice off the logo or a panel edge, so that
// page passes 'contain' instead (live feedback 2026-09-01: "man sieht zb vo
// logo oben rechts nur GIR sonsch nix, dews schlecht" - nothing may be cut off).
// `intervalMs` (default 15s, the homepage hero's own slow ambient pace) - added
// 2026-09-07 for WorldModel.tsx's bounded preview panel, which needs a visibly
// faster cycle so a visitor registers that there are several screenshots at all
// (live feedback: "die bildansicht muss sich schneller abwechseln dort in world
// model dass leute sehen dass da mehrere bilder sind"). The homepage hero keeps
// the slow pace, where a fast cycle would fight the copy for attention.
export function HeroSlideshow({ images, zoomEffect = true, fit = 'cover', intervalMs = SLIDE_INTERVAL_MS }: { images: string[]; zoomEffect?: boolean; fit?: 'cover' | 'contain'; intervalMs?: number }) {
  const [current, setCurrent] = useState(0)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (images.length <= 1 || reduced) return
    // Warm the browser's cache for the NEXT slide while the current one is
    // still showing - a full interval's head start before it's needed.
    const preload = new Image()
    preload.src = images[(current + 1) % images.length]

    const id = setTimeout(() => setCurrent(c => (c + 1) % images.length), intervalMs)
    return () => clearTimeout(id)
  }, [current, images, reduced, intervalMs])

  return (
    <AnimatePresence>
      <motion.div
        key={current}
        aria-hidden="true"
        className={zoomEffect ? 'rfi-hero-zoom' : undefined}
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduced ? undefined : { opacity: 0 }}
        transition={{ duration: reduced ? 0 : CROSSFADE_S, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, zIndex: -2,
          backgroundImage: `url("${images[current]}")`, backgroundSize: fit, backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
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
      // minHeight keeps the hero at its pre-2026-10-10 size (live: 551px at 2133x964) now that the KPI row is gone, then trimmed 64px (~1.7cm) off the bottom.
      minHeight: 'clamp(396px, calc(57vh - 84px), 596px)',
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
      // Tint stepped down 2026-08-24 (live feedback: "shall we use like one or two
      // stages less tint on the hero, so the colors pop a bit better?") - each of
      // the three linear-gradient stops dropped roughly one notch (0.55->0.42,
      // 0.32->0.22, 0.5->0.38), same shape, less overall darkening, so the globe's
      // teal/orange markers read brighter without losing headline legibility.
      background: theme === 'hc'
        ? 'rgba(0,0,0,0.45)'
        : 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,245,196,0.08) 0%, transparent 70%), linear-gradient(90deg, rgba(5,7,14,0.42) 0%, rgba(5,7,14,0.22) 52%, rgba(5,7,14,0.38) 100%)',
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
      {/* h1, not p (fixed 2026-09-07): the homepage rendered ZERO h1 elements, so
          the site's most important page had no top-level landmark at all. Caught
          by measuring the live DOM - the UX audit had only flagged /evidence/ and
          /access/ and missed this one. Every size/weight/margin here is set
          inline, so the tag change is purely semantic. */}
      <h1 className="rfi-display" style={{ fontSize: 'clamp(2.6rem, 6.8vw, 5.8rem)', fontWeight: 900, lineHeight: 1.06, marginBottom: 6, letterSpacing: '-0.01em', marginTop: 32, color: '#e8e8f0' }}>
        <HeroFlipWord word="Rethink" delay={0.2} />{' '}
        <RevealWords text="the Obvious." delayStart={0.36} emphasizeIndices={[1]} />
      </h1>
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
          style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', fontWeight: 400, color: theme === 'light' ? '#1a1a20' : '#ffffff', lineHeight: 1.5, letterSpacing: '0.01em', margin: 0 }}
        >
          {t.hero.identity}
        </motion.p>
      </div>

      {/* KPI card row removed 2026-10-10 (breadth numbers, hand-typed literals, off-message
          next to the security-review widget below). Ledger figures now live in the
          evidence strip of AppPrivacySection. */}

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
