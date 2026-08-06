// The "hypermodular" scroll spine (`#spine`, no visible section id - this is a
// pure decoration layer, not content) - Simeon relaying Zabih's idea, 2026-08-06:
// a vertical center line the page assembles around as you scroll down, a glowing
// orb tracking scroll position instead of a conventional progress bar, and a
// subtle glow around whichever section the orb is currently passing.
//
// Mounted exactly once, in PublicSite.tsx, as an early child of the page's outer
// wrapper (which was given `position: relative; zIndex: 0` specifically so this
// component's `zIndex: -1` rail stays behind every section instead of escaping to
// the document root's stacking context and painting behind the page background).
import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { TEAL, prefersReducedMotion, usePageScrollProgress } from './shared'

export function ScrollSpine() {
  const reduced = prefersReducedMotion()
  const rawProgress = usePageScrollProgress()

  const mv = useMotionValue(rawProgress)
  useEffect(() => { mv.set(rawProgress) }, [rawProgress, mv])
  const smooth = useSpring(mv, { stiffness: 120, damping: 22, mass: 0.5 })
  // 3%..97%, not 0%..100% - keeps the orb's own radius fully on-screen at both
  // ends of the page instead of clipping half of it off the top/bottom edge.
  const topPct = useTransform(smooth, v => `${3 + v * 94}%`)

  const glowRef = useRef<HTMLDivElement>(null)
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

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.05)' }} />
      <motion.div
        ref={glowRef}
        style={{
          position: 'absolute', left: '50%', width: 10, height: 10, borderRadius: '50%',
          transform: 'translate(-50%, -50%)', background: TEAL,
          boxShadow: '0 0 12px 4px rgba(0,245,196,0.55), 0 0 24px 8px rgba(0,245,196,0.25)',
          top: reduced ? `${3 + rawProgress * 94}%` : topPct,
          transition: reduced ? 'none' : undefined,
        }}
      />
    </div>
  )
}
