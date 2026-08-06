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

  // Per-CARD proximity glow (rewritten 2026-08-06, screenshot feedback on the
  // section-level version: with card backgrounds now opaque, an inset shadow on
  // the outer <section> was invisible behind them everywhere except a thin band
  // at the very top/bottom edge - useless for a tall multi-row grid like the
  // Research tiles, and where it WAS visible (Proof's two-card row) it clipped
  // hard at the section's own square bounds, reading as a heavy rectangular
  // seam against the cards' rounded corners. Targeting .rfi-hover-card directly
  // instead - every card family site-wide uses that class - fixes both: each
  // card gets its OWN glow from its OWN distance-to-center, so a multi-row grid
  // lights up consistently top to bottom, and drop-shadow (not inset box-shadow)
  // wraps the card's actual rounded silhouette instead of clipping at a
  // rectangular boundary.
  useEffect(() => {
    if (reduced) return // pure ambience, no informational payload to preserve - skip setup entirely
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.rfi-hover-card'))
    cards.forEach(el => el.classList.add('rfi-proximity-glow'))
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        if (!entry.isIntersecting) { el.style.filter = 'none'; continue }
        const vh = entry.rootBounds?.height ?? window.innerHeight
        const cardCenter = entry.boundingClientRect.top + entry.boundingClientRect.height / 2
        const dist = Math.abs(cardCenter - vh / 2)
        const falloff = vh * 0.55
        const ratio = Math.max(0, 1 - dist / falloff)
        const a = (ratio * 0.35).toFixed(3)
        el.style.filter = `drop-shadow(0 0 18px rgba(0,245,196,${a}))`
      }
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) })
    cards.forEach(el => io.observe(el))
    return () => {
      io.disconnect()
      cards.forEach(el => { el.style.filter = ''; el.classList.remove('rfi-proximity-glow') })
    }
  }, [reduced])

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

  return (
    <motion.div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: reduced ? 1 : groupOpacity }}>
      <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: clipHeight, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.1)', boxShadow: '0 0 6px rgba(0,245,196,0.08)' }} />
        <motion.div style={{ position: 'absolute', left: '50%', width: 0, height: 0, top: reduced ? staticTop : topPct, opacity: reduced ? 1 : orbOpacity }}>
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
    </motion.div>
  )
}
