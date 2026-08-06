// The "hypermodular" scroll spine (Simeon relaying Zabih's idea, 2026-08-06): a
// vertical center line the page assembles around as you scroll, a light trail
// tracking scroll position instead of a conventional progress bar, and a subtle
// glow around whichever section it's currently passing.
//
// Mounted exactly once, in PublicSite.tsx, as an early child of the page's outer
// wrapper (which was given `position: relative; zIndex: 0` specifically so this
// component's `zIndex: -1` layer stays behind every section instead of escaping
// to the document root's stacking context and painting behind the page background).
//
// A negative z-index alone bled through everywhere at first: every card family
// on this site (`rfi-glass-flat`, the ledger panel, the featured pricing card,
// the problem/solution box) used a genuinely semi-transparent background by
// design, so the spine showed straight through all of them. Fixed at the source
// instead of here (see `rfi-glass-solid` applied across those components,
// components/sections/TrackRecord.tsx's ledger panel background, etc.) - once
// the surfaces the spine passes behind are actually opaque, plain z-index
// stacking works exactly as it should, with no per-component masking logic
// needed in this file at all.
import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { TEAL, prefersReducedMotion, usePageScrollProgress } from './shared'
import type { Theme } from '../../hooks/useTheme'

// Every glow/trail color below was hardcoded to dark theme's bright #00f5c4
// (rgb 0,245,196) - fine blended into a near-black background, but a saturated
// bright teal drop-shadow reads as a garish green stain against light theme's
// white cards (screenshot feedback, 2026-08-06). `--accent` is already
// theme-correct as a CSS variable (TEAL = 'var(--accent)', used below for the
// static-color pieces), but the proximity glow computes a DYNAMIC alpha in JS
// and writes a literal rgba() string, which can't reference a CSS custom
// property - so it needs the actual RGB triple per theme, picked here once.
const ACCENT_RGB: Record<Theme, string> = { dark: '0,245,196', light: '0,158,122', hc: '255,212,0' }

export function ScrollSpine({ theme }: { theme: Theme }) {
  const reduced = prefersReducedMotion()
  const rawProgress = usePageScrollProgress()
  const accentRgb = ACCENT_RGB[theme]

  const mv = useMotionValue(rawProgress)
  useEffect(() => { mv.set(rawProgress) }, [rawProgress, mv])
  const smooth = useSpring(mv, { stiffness: 120, damping: 22, mass: 0.5 })
  // 3%..97%, not 0%..100% - keeps the trail's own tail fully on-screen at both
  // ends of the page instead of clipping off the top/bottom edge.
  const topPct = useTransform(smooth, v => `${3 + v * 94}%`)

  // Fades the whole spine group in only once scrolled past the Hero (Simeon:
  // shouldn't compete with the hero's own CTA), using the Research section's
  // offsetTop as "end of hero" rather than giving Hero.tsx an id of its own
  // purely for this. Reads window.scrollY directly inside the transform
  // callback (Framer's value pipeline, not React's render phase) so this
  // doesn't need its own synchronized motion-value plumbing.
  const heroBottom = useMotionValue(600)
  useEffect(() => {
    const el = document.getElementById('research')
    if (el) heroBottom.set(el.offsetTop)
  }, [heroBottom])
  const groupOpacity = useTransform([mv, heroBottom], (latest) => {
    const hb = (latest as number[])[1]
    const sy = window.scrollY
    const start = Math.max(0, hb - 150)
    if (hb <= start) return sy >= hb ? 1 : 0
    return Math.min(1, Math.max(0, (sy - start) / (hb - start)))
  })

  // Stops the rail (and clips the orb with it) right above the footer's WKO
  // badge (Simeon, screenshot feedback) - measured live against the footer's
  // current viewport-relative top on every scroll frame, not a fixed page
  // offset, so it stays correct regardless of how much content is above it.
  const clipHeight = useMotionValue(typeof window === 'undefined' ? 2000 : window.innerHeight)
  useEffect(() => {
    let rafId = 0
    const compute = () => {
      const footerTop = document.querySelector('footer')?.getBoundingClientRect().top
      clipHeight.set(footerTop === undefined ? window.innerHeight : Math.max(0, Math.min(window.innerHeight, footerTop)))
    }
    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(compute) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    compute()
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(rafId) }
  }, [clipHeight])

  // Per-CARD proximity glow, tied to the orb's actual position (rewritten
  // 2026-08-06, twice: first from a section-level inset shadow - invisible
  // behind opaque cards, only reached ~60px from a section's edge, useless for
  // a tall multi-row grid - to a per-card drop-shadow compared against the
  // VIEWPORT'S center. That second version still read wrong: a card could
  // light up while the orb itself was still well above or below it, because
  // "card near viewport center" and "orb currently passing this card" are not
  // the same moment (Simeon: "als ob der orb der grund für das highlight ist" -
  // the glow should read as caused BY the orb, not by generic screen position).
  // Fixed by comparing each card's center against the orb's own current pixel
  // position instead, read live off the same spring `smooth` value the
  // rendered orb uses (so the glow can never be out of sync with where the dot
  // visually is), recomputed on every scroll/resize frame rather than only on
  // each card's own IntersectionObserver threshold crossings. Falloff also
  // tightened (was vh*0.55, now a fixed ~220px) - loose enough for "the orb is
  // near", not "the orb is anywhere on screen".
  useEffect(() => {
    if (reduced) return // pure ambience, no informational payload to preserve - skip setup entirely
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.rfi-hover-card'))
    cards.forEach(el => el.classList.add('rfi-proximity-glow'))
    let rafId = 0
    const compute = () => {
      const vh = window.innerHeight
      const orbPx = ((3 + smooth.get() * 94) / 100) * vh
      for (const el of cards) {
        const rect = el.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > vh) { el.style.filter = 'none'; continue }
        const cardCenter = rect.top + rect.height / 2
        const dist = Math.abs(cardCenter - orbPx)
        const falloff = 220
        const ratio = Math.max(0, 1 - dist / falloff)
        const a = (ratio * 0.35).toFixed(3)
        el.style.filter = ratio > 0 ? `drop-shadow(0 0 18px rgba(${accentRgb},${a}))` : 'none'
      }
    }
    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(compute) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // The orb's own spring keeps easing for a bit after scrolling stops, so a
    // plain scroll listener alone would leave the glow one step behind the
    // final resting position - subscribe to the spring's own change events too.
    const unsubscribe = smooth.on('change', onScroll)
    compute()
    return () => {
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll)
      unsubscribe(); cancelAnimationFrame(rafId)
      cards.forEach(el => { el.style.filter = ''; el.classList.remove('rfi-proximity-glow') })
    }
  }, [reduced, smooth, accentRgb])

  const staticTop = `${3 + rawProgress * 94}%`

  // Fades the orb out over the last ~90px before it reaches the footer clip
  // point, rather than letting it hard-clip and sit pinned to that edge
  // (Simeon, screenshot feedback: it should actually vanish, not visibly park
  // itself on the seam above the footer).
  const orbOpacity = useTransform([smooth, clipHeight], (latest) => {
    const [s, ch] = latest as [number, number]
    const vh = window.innerHeight
    const orbPx = ((3 + s * 94) / 100) * vh
    return Math.max(0, Math.min(1, (ch - orbPx) / 90))
  })

  // High contrast strips glass/blur/decorative effects everywhere else in this
  // codebase for the same reason (see .rfi-glass's [data-theme="hc"] override) -
  // this whole feature is pure ambience with no functional payload, so it skips
  // that theme entirely rather than picking a "high contrast glow" color.
  if (theme === 'hc') return null

  return (
    <motion.div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: reduced ? 1 : groupOpacity }}>
      <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: clipHeight, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.1)', boxShadow: `0 0 6px rgba(${accentRgb},0.08)` }} />
        <motion.div style={{ position: 'absolute', left: '50%', width: 0, height: 0, top: reduced ? staticTop : topPct, opacity: reduced ? 1 : orbOpacity }}>
          {/* the trail - a short fading tail extending back up the spine, not a
              radial blob, so it stays confined to the line's own narrow width */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', width: 5, height: 110,
            transform: 'translateX(-50%)',
            background: `linear-gradient(to top, rgba(${accentRgb},0.4), rgba(${accentRgb},0))`,
            filter: 'blur(1.5px)',
          }} />
          {/* the core - small, soft-edged, tight glow radius */}
          <div style={{
            position: 'absolute', bottom: -3, left: '50%', width: 6, height: 6, borderRadius: '50%',
            transform: 'translateX(-50%)', background: TEAL,
            boxShadow: `0 0 5px 1.5px rgba(${accentRgb},0.45)`,
          }} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
