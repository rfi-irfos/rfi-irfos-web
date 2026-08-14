// Hero (no `<section id>` of its own - it's the first section on the page,
// scrolled to via the bare "#" logo link) - extracted verbatim from PublicSite.tsx.
import { useState, lazy, Suspense } from 'react'
import { prefersReducedMotion, Reveal, RevealWords, CountUp, HeroFlipWord } from './shared'
import { RESEARCH_AREAS } from './Research'
import { PROJECTS } from './Projects'
import { useLocale } from '../../hooks/useLocale'

// The hero keeps one proof-first action. The contact form remains on the landing
// page, but no longer competes with the Evidence view from the first screen.
function HeroCtaRow({ onNavigate }: { onNavigate?: (href: string) => void }) {
  const { t } = useLocale()
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <a href="#evidence" style={{
        border: '1px solid rgba(0,245,196,0.35)', color: 'var(--accent-text)', padding: '13px 30px', borderRadius: 8,
        fontWeight: 700, fontSize: 13, textDecoration: 'none', letterSpacing: '0.06em',
        textTransform: 'uppercase', transition: 'border-color 0.15s',
      }}
        onClick={e => { if (onNavigate) { e.preventDefault(); onNavigate('#evidence') } }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.7)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,245,196,0.35)')}>{t.hero.ctaTrackRecord}</a>
    </div>
  )
}

const LazyHeroCanvas = lazy(() => import('../HeroCanvas'))

// Gates the WebGL hero background: skipped outright under prefers-reduced-motion,
// on narrow/mobile viewports (no room for it to read as ambient depth, just cost),
// and on low-core-count devices (a cheap, if imperfect, low-end-hardware signal).
// Lazy-imported so its ~30kb (ogl) never blocks the hero's first paint - the existing
// CSS radial-gradient (set directly on the hero section) stays as the base layer/
// no-JS fallback the whole time, this only ever adds on top of it.
function HeroBackground() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const cores = navigator.hardwareConcurrency ?? 8
    return !prefersReducedMotion() && window.innerWidth >= 1024 && cores >= 4
  })
  if (!enabled) return null
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
      <Suspense fallback={null}>
        <LazyHeroCanvas />
      </Suspense>
    </div>
  )
}

// The full roster (with GitHub handles + focus lines) now lives on its own Team page
// (LegalPage.tsx's `Team` component, reached via `#p/team`) - moved off the mainpage
// per the website-repositioning plan (decision space vs. trust space). Only the
// headcount survives here for the hero stat strip; keep this in sync with
// LegalPage.tsx's `TEAM` array length by hand when someone joins/leaves - a small,
// deliberate exception to "one array edit" now that the roster lives in a different
// (lazily-loaded) file.
const TEAM_COUNT = 7

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

export function HeroSection({ mobile, onNavigate }: { mobile: boolean; onNavigate?: (href: string) => void }) {
  const { t } = useLocale()
  return (
    <section style={{
      display: 'flex', flexDirection: 'column', position: 'relative',
      alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center',
      padding: 'calc(72px + 6vh) 2rem 72px',
      background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,245,196,0.06) 0%, transparent 70%)',
    }}>
      <HeroBackground />
      {/* Stays English in both locales (live feedback) - "Rethink the Obvious."
          is the site's signature line/wordmark-adjacent phrase, not translated
          copy. "Rethink" split out to HeroFlipWord (2026-08-05, approved after
          several review rounds) - same reveal-in timing it had inside
          RevealWords before (delay 0.2), "the Obvious." keeps its own timing by
          starting RevealWords' stagger at 0.36 instead of 0.2 (equivalent to
          "the"/"Obvious." having been words 1/2 of one three-word call). */}
      <p className="rfi-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: 6, letterSpacing: '-0.01em', marginTop: 32 }}>
        <HeroFlipWord word="Rethink" delay={0.2} />{' '}
        <RevealWords text="the Obvious." delayStart={0.36} emphasizeIndices={[1]} />
      </p>
      <h1 style={{
        fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', fontWeight: 600, lineHeight: 1.5,
        marginBottom: 24, letterSpacing: '0.01em', color: 'var(--text2)',
      }}>
        <span style={{ color: 'var(--accent-text)' }}>{t.hero.subtitlePrefix}</span>{t.hero.subtitleSuffix}
      </h1>
      <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 580, lineHeight: 1.75, marginBottom: 40 }}>
        {t.hero.identity}
      </p>

      {/* Stats moved up, directly after the identity paragraph (live feedback:
          the hero read as a wall of text with too many stacked lines before
          anything concrete landed). Problem/solution carousel now sits after
          the stats, as a single slower-cycling line rather than competing with
          a second static teal headline underneath it (that redundant "Most
          technology decisions..." line has been removed entirely). */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: mobile ? '1.25rem' : '3rem', margin: '0 auto 48px', maxWidth: 860, justifyContent: 'center' }}>
        {/* Deliberately NOT the same numbers as the Track Record stat row further down -
            that one is audit-specific (apps/findings/companies/regulators), this one is
            the breadth story: research areas, systems and projects, publications, team,
            years. Showing the same five numbers twice wastes the hero's one shot at
            explaining why the institute matters beyond appsec. */}
        {([
          { n: `${RESEARCH_AREAS.length}`,    label: t.hero.stats.researchAreas,      from: 'left'   as const },
          { n: `${PROJECTS.length}+`,         label: t.hero.stats.openSourceProjects, from: 'bottom' as const },
          { n: `${PUBLICATIONS.length}+`,     label: t.hero.stats.publications,       from: 'scale'  as const },
          { n: `${TEAM_COUNT}`,               label: t.hero.stats.people,             from: 'bottom' as const },
          { n: '300+',                        label: t.hero.stats.agents,             from: 'bottom' as const },
        ]).map((s, i) => (
          <Reveal key={s.label} delay={i} from={s.from}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent-text)' }}><CountUp value={s.n} /></div>
              <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Problem/solution carousel moved out of the hero entirely - live
          feedback: it works better as content, not decoration, so it now lives
          under "what we build" (Projects section), enriched with detail and a
          pricing link per pair - see ProblemSolutionShowcase below. */}

      {/* Down from 3 co-equal buttons to 2, deliberately unequal: Hire Us is the one
          real conversion action and gets the solid fill; Track Record is the proof
          a skeptical visitor wants before that, secondary by design. Research and
          Pricing dropped as separate hero buttons - both are one scroll or one nav
          click away already, they don't need to compete with the actual CTA here. */}
      <HeroCtaRow onNavigate={onNavigate} />
      {/* "I am a..." persona chips removed entirely (live feedback: redundant -
          the nav/CTAs/Research Areas right below already cover the same
          "where do I look" job without a second, parallel navigation device). */}
    </section>
  )
}
