// Hero (no `<section id>` of its own - it's the first section on the page,
// scrolled to via the bare "#" logo link) - extracted verbatim from PublicSite.tsx.
import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { prefersReducedMotion, Reveal, RevealWords, CountUp, HeroFlipWord } from './shared'
import { RESEARCH_AREAS } from './Research'
import { PROJECTS } from './Projects'
import { useLocale } from '../../hooks/useLocale'
import type { Theme } from '../../hooks/useTheme'

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
      padding: 'calc(72px + 6vh) 2rem 72px',
      // Tint gradient only - the actual photo is the dedicated zoom layer below,
      // not this section's own background. Kept as a tint (not a full photo) for
      // text legibility over whatever's showing through it. Went near-opaque here
      // once already (live feedback: "strange grey mess") - overcorrected, that
      // hid the photo entirely (live feedback 2026-08-14: "die software auch
      // garnicht mehr im hero... vollkommen überschattet"). Settled in between:
      // lighter than the original faded wash, still see-through. The original's
      // deep dip to 0.32 at the 52% stop (vs 0.55/0.5 either side) was likely
      // what read as a dark smudge specifically where the headline sits - flattened
      // that dip out too instead of just raising every stop by the same amount.
      background: theme === 'dark'
        ? 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,245,196,0.08) 0%, transparent 70%), linear-gradient(90deg, rgba(5,7,14,0.55) 0%, rgba(5,7,14,0.32) 52%, rgba(5,7,14,0.5) 100%)'
        : theme === 'hc'
          ? 'rgba(0,0,0,0.45)'
          : 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,122,92,0.06) 0%, transparent 70%), linear-gradient(90deg, rgba(250,245,239,0.62) 0%, rgba(250,245,239,0.52) 52%, rgba(250,245,239,0.6) 100%)',
    }}>
      {/* Real screenshot of our own OSINT/monitoring software as the hero backdrop
          (live feedback 2026-08-14: "this is from the software itself"), with a slow
          Ken Burns zoom-out - starts tight/zoomed in, eases out to the full frame over
          the animation's run, then holds (animation-fill-mode: forwards in the
          .rfi-hero-zoom CSS rule, index.css). overflow: hidden on the section above
          clips the zoomed-in overflow; transform (not background-size) animates since
          transform is compositor-only, cheaper than repainting background-size every
          frame. Sits behind HeroBackground's WebGL canvas (zIndex -1) at -2, and
          behind the tint gradient above it (the section's own `background`, which
          paints on top of z-index -2/-1 children per normal stacking order). */}
      <div aria-hidden="true" className="rfi-hero-zoom" style={{
        position: 'absolute', inset: 0, zIndex: -2,
        backgroundImage: 'url("/hero-software.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <HeroBackground theme={theme} />
      {/* Stays English in both locales (live feedback) - "Rethink the Obvious."
          is the site's signature line/wordmark-adjacent phrase, not translated
          copy. "Rethink" split out to HeroFlipWord (2026-08-05, approved after
          several review rounds) - same reveal-in timing it had inside
          RevealWords before (delay 0.2), "the Obvious." keeps its own timing by
          starting RevealWords' stagger at 0.36 instead of 0.2 (equivalent to
          "the"/"Obvious." having been words 1/2 of one three-word call). */}
      <p className="rfi-display" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: 6, letterSpacing: '-0.01em', marginTop: 32 }}>
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
          to read cleanly against any part of the photo underneath it. */}
      <div style={{ position: 'relative', display: 'inline-block', maxWidth: 1000, marginBottom: 40 }}>
        <motion.div
          aria-hidden="true"
          initial={prefersReducedMotion() ? undefined : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', inset: '-1px -4px', zIndex: 0, borderRadius: 3, transformOrigin: 'left center',
            background: theme === 'dark'
              ? 'rgba(5,7,14,0.88)'
              : theme === 'hc'
                ? 'rgba(0,0,0,0.92)'
                : 'rgba(250,245,239,0.92)',
          }}
        />
        <motion.p
          initial={prefersReducedMotion() ? undefined : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.95rem, 1.7vw, 1.2rem)', fontWeight: 400, color: 'var(--text2)', lineHeight: 1.5, letterSpacing: '0.01em', margin: 0 }}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: mobile ? '1.25rem' : '3rem', margin: '0 auto 24px', maxWidth: 980, justifyContent: 'center' }}>
        {/* Deliberately NOT the same numbers as the Track Record stat row further down -
            that one is audit-specific (apps/findings/companies/regulators), this one is
            the breadth story: research areas, systems and projects, publications, team,
            years. Showing the same five numbers twice wastes the hero's one shot at
            explaining why the institute matters beyond appsec. */}
        {([
          { n: `${RESEARCH_AREAS.length}`,    label: t.hero.stats.researchAreas,      from: 'left'   as const },
          { n: `${PROJECTS.length}+`,         label: t.hero.stats.openSourceProjects, from: 'bottom' as const },
          { n: `${PUBLICATIONS.length}+`,     label: t.hero.stats.publications,       from: 'scale'  as const },
          { n: '301',                         label: t.hero.stats.agents,             from: 'bottom' as const },
          { n: '1',                           label: t.hero.stats.worldModel,         from: 'bottom' as const },
        ]).map((s, i) => (
          <Reveal key={s.label} delay={i} from={s.from}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2rem, 3.3vw, 2.75rem)', fontWeight: 900, color: 'var(--accent-text)', lineHeight: 1 }}><CountUp value={s.n} /></div>
              <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.35, marginTop: 8 }}>{s.label}</div>
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
