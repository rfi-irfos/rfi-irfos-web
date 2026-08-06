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
// Second pass (same day): the first version used a wide, bright radial-gradient
// blob for the orb, which visibly bled through semi-transparent card/table
// backgrounds and sat on top of readable text (screenshot feedback: showing on
// the Track Record ledger's dense rows). Rebuilt as a narrow "comet trail" hugging
// the spine's own 2px width - a small core plus a short fading tail, not a wide
// glow - so it reads as "the line itself is lit up here" rather than a floating
// object independent of it, and stays thin enough to mostly avoid overlapping
// text even where it does cross dense content.
import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { TEAL, prefersReducedMotion, usePageScrollProgress } from './shared'

export function ScrollSpine() {
  const reduced = prefersReducedMotion()
  const rawProgress = usePageScrollProgress()

  const mv = useMotionValue(rawProgress)
  useEffect(() => { mv.set(rawProgress) }, [rawProgress, mv])
  const smooth = useSpring(mv, { stiffness: 120, damping: 22, mass: 0.5 })
  // 3%..97%, not 0%..100% - keeps the trail's own tail fully on-screen at both
  // ends of the page instead of clipping off the top/bottom edge.
  const topPct = useTransform(smooth, v => `${3 + v * 94}%`)

  // Fades the whole spine group in only once scrolled past the Hero (Simeon:
  // shouldn't compete with the hero's own CTA) - uses the Research section's
  // offsetTop as "end of hero" rather than giving Hero.tsx an id of its own
  // purely for this. A MotionValue, not React state: `.set()` inside an effect
  // doesn't trigger a React re-render the way setState does, so this stays
  // outside the "don't setState synchronously in an effect" territory entirely
  // rather than fighting that lint rule.
  const { scrollY } = useScroll()
  const heroBottomMV = useMotionValue(600)
  useEffect(() => {
    const el = document.getElementById('research')
    if (el) heroBottomMV.set(el.offsetTop)
  }, [heroBottomMV])
  const groupOpacity = useTransform([scrollY, heroBottomMV], (latest) => {
    const [sy, hb] = latest as [number, number]
    const start = Math.max(0, hb - 150)
    if (hb <= start) return sy >= hb ? 1 : 0
    return Math.min(1, Math.max(0, (sy - start) / (hb - start)))
  })

  useEffect(() => {
    if (reduced) return // pure ambience, no informational payload to preserve - skip setup entirely
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
    sections.forEach(el => el.classList.add('rfi-proximity-glow'))
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        if (!entry.isIntersecting) { el.style.boxShadow = 'none'; continue }
        const vh = entry.rootBounds?.height ?? window.innerHeight
        const sectionCenter = entry.boundingClientRect.top + entry.boundingClientRect.height / 2
        const dist = Math.abs(sectionCenter - vh / 2)
        const falloff = vh * 0.65
        const ratio = Math.max(0, 1 - dist / falloff)
        const a = (ratio * 0.12).toFixed(3)
        el.style.boxShadow = `inset 0 40px 60px -40px rgba(0,245,196,${a}), inset 0 -40px 60px -40px rgba(0,245,196,${a})`
      }
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) })
    sections.forEach(el => io.observe(el))
    return () => {
      io.disconnect()
      sections.forEach(el => { el.style.boxShadow = ''; el.classList.remove('rfi-proximity-glow') })
    }
  }, [reduced])

  const staticTop = `${3 + rawProgress * 94}%`

  return (
    <motion.div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: reduced ? 1 : groupOpacity }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.1)', boxShadow: '0 0 6px rgba(0,245,196,0.08)' }} />
      <motion.div style={{ position: 'absolute', left: '50%', width: 0, height: 0, top: reduced ? staticTop : topPct }}>
        {/* the trail - a short fading tail extending back up the spine, not a
            radial blob, so it stays confined to the line's own narrow width */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', width: 5, height: 110,
          transform: 'translateX(-50%)',
          background: 'linear-gradient(to top, rgba(0,245,196,0.4), rgba(0,245,196,0))',
          filter: 'blur(1.5px)',
        }} />
        {/* the core - small, soft-edged, tight glow radius */}
        <div style={{
          position: 'absolute', bottom: -3, left: '50%', width: 6, height: 6, borderRadius: '50%',
          transform: 'translateX(-50%)', background: TEAL,
          boxShadow: '0 0 5px 1.5px rgba(0,245,196,0.45)',
        }} />
      </motion.div>
    </motion.div>
  )
}
