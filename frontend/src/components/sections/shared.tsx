// Shared primitives used across multiple homepage sections (and by PublicSite.tsx
// itself for the nav/modals/footer) - extracted verbatim from the former single
// ~5600-line PublicSite.tsx as a pure refactor (no copy/style/behavior changes).
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { useLocale } from '../../hooks/useLocale'

// Was the literal '#00f5c4'. In dark, --accent IS #00f5c4, so this is a zero-diff
// change to the primary theme, while light (#009e7a) and high-contrast (#ffd400)
// finally receive a legible accent instead of near-white-on-white at 1.41:1.
export const TEAL = 'var(--accent)'
// Keep telemetry first-party. A third-party-looking Lighthouse host is needlessly
// blocked by privacy extensions, which turns an otherwise harmless beacon into a
// noisy red line in DevTools.
export const LIGHTHOUSE_PIXEL = '/api/track/pixel.gif'
export const LIGHTHOUSE_BEACON = '/api/track'
export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Custom-styled listbox replacing the native <select>. Native option popups are
// drawn by the OS/browser chrome, not the page, so they can't be pulled into the
// site's glass/dark theme no matter how the closed control or <option> tags are
// styled (live feedback 2026-08-21: "still looks like a retro box"). This trades
// that native affordance for one drawn entirely in our own markup.
export function Select({
  value, onChange, options, placeholder, ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  ariaLabel: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', background: 'var(--input-bg)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '12px 16px', color: selected ? 'var(--text)' : 'var(--text3)', fontSize: 14,
          fontFamily: 'inherit', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
        }}>
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{ fontSize: 10, opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}>▾</span>
      </button>
      {open && (
        <div role="listbox" aria-label={ariaLabel} style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40,
          background: 'var(--glass-bg-solid)', border: '1px solid var(--border)', borderRadius: 12,
          padding: 6, boxShadow: '0 12px 32px rgba(0,0,0,0.4)', maxHeight: 280, overflowY: 'auto',
          backdropFilter: 'blur(20px)',
        }}>
          {options.map(o => (
            <div key={o.value} role="option" aria-selected={o.value === value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              className="rfi-select-option"
              style={{
                padding: '10px 12px', borderRadius: 8, fontSize: 14, cursor: 'pointer',
                color: o.value === value ? 'var(--accent-text)' : 'var(--text)',
              }}>
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Whole-page scroll fraction (0-1), for the top progress bar - distinct from
// useScrollProgress below, which is per-element activation, not total page position.
export function usePageScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let rafId = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(rafId) }
  }, [])
  return progress
}

// Subtle pointer-position perspective tilt for cards. Capped small on purpose -
// this is a polish cue, not a gimmick. transform-only, no-ops under reduced-motion.
// Same ref-provenance note as useMagnetic above.
export function useTilt<T extends HTMLElement>(elRef: React.RefObject<T | null>, max = 6) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 })
  useEffect(() => {
    const el = elRef.current
    if (!el || prefersReducedMotion()) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      rotateY.set(px * max * 2)
      rotateX.set(-py * max * 2)
    }
    const onLeave = () => { rotateX.set(0); rotateY.set(0) }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [elRef, max, rotateX, rotateY])
  return { rotateX: springRX, rotateY: springRY, transformPerspective: 800 }
}

// Counts up from 0 to the numeric part of `value` (keeping any non-numeric suffix,
// e.g. "14+") once scrolled into view. Respects reduced-motion (renders final value
// immediately, no counting).
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const target = parseInt(value, 10)
  const suffix = value.replace(/^-?\d+/, '')
  const [display, setDisplay] = useState(prefersReducedMotion() || isNaN(target) ? target : 0)
  useEffect(() => {
    if (prefersReducedMotion() || isNaN(target)) return
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now(), dur = 1100
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(Math.round(eased * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])
  return <span ref={ref}>{isNaN(target) ? value : `${display}${suffix}`}</span>
}

// Per-word stagger reveal for headline text - splits on spaces, each word its own
// span animated in on mount via Framer, respects reduced-motion (renders flat/static).
export function RevealWords({ text, delayStart = 0.2, emphasizeIndices = [] }: { text: string; delayStart?: number; emphasizeIndices?: number[] }) {
  const words = text.split(' ')
  const reduced = prefersReducedMotion()
  if (reduced) return <>{text}</>
  return (
    <>
      {words.map((w, i) => {
        const emphasized = emphasizeIndices.includes(i)
        const wordDelay = delayStart + i * 0.16
        return (
          <motion.span
            key={i}
            style={{ display: 'inline-block', transformOrigin: '50% 50%', color: emphasized ? TEAL : undefined }}
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)', scale: emphasized ? 0.85 : 1 }}
            // Reverted (2026-08-02): the emphasized word used to flip permanently upside
            // down after settling - live reaction was that it reads as disorienting, not
            // clever ("stresst mein Gehirn"), not worth the reorientation cost it forced on
            // every reader. Reveal-in motion stays, and is leaned into harder for the
            // emphasized word specifically (a teal color pop + a slight overshoot scale
            // instead of the rest of the headline's plain fade/slide-up) - but nothing ends
            // up flipped anymore.
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            transition={{
              opacity: { duration: 0.95, delay: wordDelay, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 0.95, delay: wordDelay, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 0.95, delay: wordDelay, ease: [0.16, 1, 0.3, 1] },
              scale: emphasized
                ? { duration: 0.5, delay: wordDelay, ease: [0.34, 1.56, 0.64, 1] }
                : { duration: 0.95, delay: wordDelay, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        )
      })}
    </>
  )
}

// Real per-letter shuffle-reveal for a single word. Approved 2026-08-05 after
// several review rounds against a standalone motion prototype - replaces the
// earlier permanent-upside-down rotate(180deg) attempt (added and reverted
// same day, 2026-08-02: "disorienting, not clever", see the comment in
// RevealWords below). Each letter is its own absolutely-positioned span with
// its own transition, individually cycling through random characters with a
// blur/jitter flourish before settling back into its own normal slot at the
// end of its brief shuffle, rather than one rotate() on the whole word (which
// read as "a string rotating," not real per-letter motion).
// FIXED (live bug report, mobile Safari screenshot, 2026-08-15): this used to
// settle each letter into a MIRRORED slot (scaleX(-1), reversed left-to-right
// position via `mirrorLeft`) and hold there permanently - on the primary hero
// headline that reads as exactly what it is, backwards/mirrored garbage text
// ("ЯэHTЭЯ"), not a legible word. Whatever read as an acceptable flourish in
// review clearly doesn't survive contact with the actual deployed headline -
// every letter now settles back into its own normal (unflipped, correctly
// ordered) position: the shuffle-in flourish stays, the word is legible again
// once it settles, on every viewport, not just ones where nobody looked
// closely enough to notice it never un-mirrors.
// Widths are measured per character (an offscreen probe in the real font), not
// an equal 1/n cell - equal cells looked mechanically spaced next to the
// tightly-kerned normal word. Settles and holds once scrolled into view; resets
// and replays if scrolled away and back. Renders into an EMPTY ref target on
// purpose - all character content is written imperatively below, never through
// JSX children, so React's reconciler never fights the per-frame DOM writes
// (the same pattern used to wrap non-React widgets, not a hack).
export function HeroFlipWord({ word, delay = 0.2 }: { word: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = prefersReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) { el.textContent = word; return }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const randomChar = () => chars[Math.floor(Math.random() * chars.length)]
    const n = word.length
    const spans: HTMLSpanElement[] = []
    const normalLeft: number[] = []
    let playing = false
    let raf = 0
    let leadTimer: ReturnType<typeof setTimeout> | null = null

    el.textContent = word
    const height = el.getBoundingClientRect().height
    el.textContent = ''
    const probe = document.createElement('span')
    probe.style.position = 'absolute'
    probe.style.visibility = 'hidden'
    probe.style.whiteSpace = 'pre'
    probe.style.font = getComputedStyle(el).font
    document.body.appendChild(probe)
    const widths: number[] = []
    for (let i = 0; i < n; i++) { probe.textContent = word[i]; widths.push(probe.getBoundingClientRect().width) }
    document.body.removeChild(probe)
    let totalWidth = 0
    for (let i = 0; i < n; i++) totalWidth += widths[i]
    el.style.width = totalWidth + 'px'
    el.style.height = height + 'px'
    let accN = 0
    for (let i = 0; i < n; i++) { normalLeft.push(accN); accN += widths[i] }
    for (let i = 0; i < n; i++) {
      const span = document.createElement('span')
      span.className = 'flip-char'
      span.textContent = word[i]
      span.style.width = widths[i] + 'px'
      span.style.left = normalLeft[i] + 'px'
      span.style.transition = 'none'
      el.appendChild(span)
      spans.push(span)
    }

    function reset() {
      cancelAnimationFrame(raf)
      playing = false
      for (let i = 0; i < n; i++) {
        const span = spans[i]
        span.style.transition = 'none'
        span.textContent = word[i]
        span.style.filter = 'none'
        span.style.left = normalLeft[i] + 'px'
        span.style.transform = 'scaleX(1) rotate(0deg)'
      }
    }
    function play() {
      if (playing) return
      playing = true
      // Live feedback 2026-08-05: overall animation read as too long, windows
      // roughly halved. Live feedback 2026-08-14: went too far the other way -
      // "wechselt sich zu schnell, muss ein bisschen länger da stehen" - widened
      // back out partway (not fully back to the original), still individually
      // varied per letter, not clustered.
      const plans = spans.map(() => {
        const start = Math.floor(Math.random() * 35)
        return { start, end: start + Math.floor(Math.random() * 40) + 25, settled: false }
      })
      spans.forEach(span => {
        span.style.transition = 'left 420ms cubic-bezier(.3,1.4,.5,1), transform 420ms cubic-bezier(.3,1.4,.5,1), filter 60ms linear'
      })
      let frame = 0
      function tick() {
        let allDone = true
        for (let i = 0; i < n; i++) {
          const p = plans[i], span = spans[i]
          if (frame < p.start) { allDone = false }
          else if (frame < p.end) {
            allDone = false
            span.textContent = randomChar()
            const remaining = (p.end - frame) / (p.end - p.start)
            span.style.filter = `blur(${Math.max(0, remaining * 3.6).toFixed(2)}px)`
            const jitter = (Math.random() - 0.5) * remaining * 10
            span.style.transform = `scaleX(1) rotate(${jitter.toFixed(1)}deg)`
          } else if (!p.settled) {
            p.settled = true
            span.textContent = word[i]
            span.style.filter = 'none'
            span.style.left = normalLeft[i] + 'px'
            span.style.transform = 'scaleX(1) rotate(0deg)'
          }
        }
        if (allDone) { playing = false; return }
        raf = requestAnimationFrame(tick)
        frame++
      }
      tick()
    }

    const section = el.closest('.rfi-view-panel') ?? el.closest('section')
    let io: IntersectionObserver | null = null
    if (section) {
      io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 300ms -> 1300ms (live feedback 2026-08-14: "muss länger grade angezeigt
            // werden... kurz Zeit haben Rethink zu lesen bevors sichs shuffelt") - the
            // plain word is already fully legible the instant this mounts (see the
            // per-character span setup above), this delay is purely how long it holds
            // still and readable before the scramble starts.
            leadTimer = setTimeout(play, 1300)
          } else {
            if (leadTimer) clearTimeout(leadTimer)
            reset()
          }
        })
      }, { threshold: 0.6 })
      io.observe(section)
    }

    return () => {
      io?.disconnect()
      if (leadTimer) clearTimeout(leadTimer)
      cancelAnimationFrame(raf)
    }
  }, [word, reduced])

  if (reduced) return <>{word}</>

  return (
    <motion.span
      ref={ref}
      style={{ display: 'inline-block', position: 'relative', verticalAlign: 'bottom' }}
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}


// nav-jump suppressor: set true during anchor-link scroll → all Reveal elements snap to p=1.
// Was a bare module-level `let _revealSuppressed = false` when Reveal lived in the same
// file as the anchor-scroll handler that flips it (PublicSite.tsx) - now that the handler
// and Reveal live in different files, a plain `let` can't be mutated through an import
// (ES module bindings are read-only views from the importing side), so this is a mutable
// cell instead. Same single shared flag, same semantics, just import-safe.
export const revealSuppressed = { current: false }

// History of this function, both incidents worth knowing before touching it again:
//
// (1) Original version computed opacity as a pure function of the element's CURRENT
// position on every scroll event, with NO defined settle zone and no reduced-motion/
// anchor-jump escape hatch - it could leave content stuck invisible depending on
// scroll direction, confirmed by direct reproduction on the one page taking paid
// traffic. Fixed 2026-08-05 by switching to a one-shot IntersectionObserver:
// `visible` latched true forever once seen, never reverting.
//
// (2) That one-shot version was itself replaced 2026-08-06 (bidirectional toggle),
// then replaced AGAIN the same day: bidirectional-via-CSS-transition still fired a
// fixed-duration animation off a threshold crossing, which read as a discrete "snap"
// rather than tracking scroll continuously (Simeon: "diese reinfliegen muss nich
// animiert sein sondern vom scroll abhangig sein"). This version fixes that by using
// Framer's `useScroll` to read the element's own scroll-relative progress directly -
// opacity/transform are a continuous function of CURRENT position again, same shape
// as incident (1)'s root cause. The difference this time, deliberately: a real
// library primitive (`useScroll`) does the position tracking instead of a hand-rolled
// listener, and `prefersReducedMotion()`/`revealSuppressed.current` are checked
// LIVE inside the `useTransform` callback below (which runs in Framer's value
// pipeline, not React's render phase - not the same class of read as the
// react-hooks/refs violation fixed earlier the same day) rather than captured once
// at mount. That live check is what makes an in-app anchor-nav click correctly force
// already-mounted elements to full visibility regardless of where the jump lands,
// closing the specific gap the mount-once "bypass" state had.
// dist default raised 32 -> 72 (2026-08-18, live feedback: "der effect isch zu
// wenig dramatisch, fast nicht sichtbar, das muss ULTRASMOOTH sein") - the
// mechanism underneath was already continuous/scroll-linked (see the incident
// history above), so "ultrasmooth" was never a motion-curve problem, just a
// travel distance too small to read as converging from the edges. Raising the
// shared default means every existing Reveal call across the site gets the
// more dramatic version automatically, not just the ones touched directly.
export function Reveal({
  children, delay = 0, from = 'bottom', dist = 32, style: extra,
}: {
  children: React.ReactNode
  delay?: number
  from?: 'bottom' | 'top' | 'left' | 'right' | 'scale'
  dist?: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  // 0 = element's top edge about to enter the viewport from the bottom, 1 = its
  // bottom edge about to leave past the top - the element's full transit, not a
  // single threshold crossing.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Maps that transit into a 0-1 "how assembled is this" value: ramps up over the
  // first stretch (entrance), holds at 1 through the middle (settled, fully
  // readable), ramps back down over the last stretch (exit) - continuous, so
  // scrolling slowly assembles/disassembles slowly and reversing direction
  // reverses it at the same rate, symmetric both ways. `delay` shifts where the
  // ramps sit (not a time delay - there's no fixed-duration animation left to
  // delay), so a row of grid items sharing nearly the same vertical position
  // still cascades instead of settling in lockstep.
  const settled = useTransform(scrollYProgress, latest => {
    if (prefersReducedMotion() || revealSuppressed.current) return 1
    // Every reveal follows the same broad, scroll-linked rhythm. `delay` is a
    // tiny compositional offset only; it must not create different-sized
    // visible bands or make neighbouring content flicker at different times.
    const offset = Math.min(0.06, delay * 0.008)
    const inEnd = 0.28 + offset
    const outStart = 0.72 + offset
    const smooth = (value: number) => value * value * (3 - 2 * value)
    if (latest <= 0) return 0
    if (latest < inEnd) return smooth(latest / inEnd)
    if (latest <= outStart) return 1
    if (latest < 1) return 1 - smooth((latest - outStart) / (1 - outStart))
    return 0
  })
  const transform = useTransform(settled, s => {
    const d = (1 - s) * dist
    if (from === 'left')  return `translateX(${-d}px)`
    if (from === 'right') return `translateX(${d}px)`
    if (from === 'top')   return `translateY(${-d}px)`
    if (from === 'scale') return `scale(${1 - (1 - s) * 0.16})`
    return `translateY(${d}px)`
  })
  // Same root cause ScrambleHeading already hit and fixed (see its comment above):
  // `settled` only recomputes when `scrollYProgress` itself changes, so an in-app
  // nav jump that lands the element at rest - no further scroll delta - never
  // re-runs the transform, and it stays stuck at whatever mid-transit value it
  // happened to hold at that instant (live bug report: a paragraph "stuck grey,
  // doesn't slide fully in" after clicking a top-nav link straight to it).
  // `revealSuppressed.current` alone doesn't fix this either, for the same reason
  // ScrambleHeading's own comment gives: it's read inside this useTransform
  // callback, so it only takes effect the next time the callback happens to fire.
  // Fix: listen for the same deterministic `rfi-nav-jump` event ScrambleHeading
  // uses and imperatively `.set(1)` on the settled MotionValue - that push
  // directly notifies every dependent (`transform` here) regardless of whether
  // scrollYProgress ever moves again.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const section = el.closest('.rfi-view-panel') ?? el.closest('section')
    const onJump = () => settled.set(1)
    section?.addEventListener('rfi-nav-jump', onJump)
    return () => section?.removeEventListener('rfi-nav-jump', onJump)
  }, [settled])
  return (
    <motion.div ref={ref} style={{ opacity: settled, transform, willChange: 'transform, opacity', ...extra }}>
      {children}
    </motion.div>
  )
}

// Shared pricing-tier card, used by every pricing group (Security Audits, Market
// Research, Web Development, Mobile, Research Cooperation - previously 5 near-identical
// copies of this JSX). Tier name is now the loud, bold, white element; price moved to a
// compact bottom-left readout next to a small icon-only CTA (cart = buy now via Stripe,
// arrow = request a proposal) instead of a full-width "GET STARTED" button eating space.
export function CartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}
// Submit button state icon - spinner while sending, checkmark draw-in once accepted,
// nothing for idle/err (text alone carries those). CSS rotate + stroke-dashoffset,
// both compositor/paint-cheap one-off animations, no continuous JS.
export function FormStateIcon({ state }: { state: 'idle' | 'sending' | 'ok' | 'err' }) {
  if (state === 'sending') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ animation: prefersReducedMotion() ? undefined : 'rfi-spin 0.8s linear infinite' }}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
  if (state === 'ok') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 0, animation: 'rfi-draw 0.45s ease-out' }} />
      </svg>
    )
  }
  return null
}

export function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
// "You bring / We / You receive" transformation diagram, as one cohesive box with three
// stacked bullet groups - added 2026-08-15, live feedback (via Laura's own review of the
// site): a visitor can see what RFI-IRFOS is capable of but not how their own messy,
// unstructured problem turns into a concrete deliverable. Same-day follow-up: the first
// pass read as three visually separate segments (alternating background, heavier
// dividers, bullets wrapping onto the same line) - "very chaotic". Flattened to one
// uniform surface, hairline dividers only, one bullet per line. Middle label is "We",
// not "RFI-IRFOS" - the name is already the page's own voice throughout, repeating it
// here read as oddly formal. This box fully replaces TierBullets/OutputTags in the
// pricing UI - deliberately not rendered alongside them (see call sites) to avoid the
// exact redundant, overflowing-card problem this box was built to fix.
// `large` (2026-08-21, live feedback): Pricing.tsx's card is now the only
// place this renders at full card width with nothing else competing for
// attention (the old multi-tier-per-line layout had less room to spare) - 2px
// up on both the label and the list text there. The checkout/proposal modal's
// usage (ModalTierBody) stays at the original tuned size, unchanged.
export function EngagementFlow({ bring, mechanism, receive, large }: {
  // string = one flowing paragraph (Pricing.tsx's 3 main tiers, 2026-08-25 prose
  // rewrite). readonly string[] = legacy short-bullet-phrase arrays, still used by
  // TierCarousel/CarouselTier (Projects.tsx, Hero.tsx collaboration tiers) - both
  // render as paragraphs now, array items just become one paragraph each instead
  // of a single joined one.
  bring?: string | readonly string[]; mechanism?: string | readonly string[]; receive?: string | readonly string[]
  large?: boolean
}) {
  const { t: locale } = useLocale()
  // This box is the innermost of four nested padded surfaces (section gutter >
  // offer glass card > featured tier card > this), so its own horizontal padding
  // is the last 32px taken off an already narrow phone column. Halved on mobile
  // as part of the 2026-08-16 squeezed-card fix - see the comment on the arrow
  // buttons in Pricing.tsx for the full chain.
  const mobile = useMobile(640)
  const toParagraphs = (v?: string | readonly string[]) => !v ? undefined : typeof v === 'string' ? [v] : v
  // REDESIGNED 2026-08-25 (reference mockup, matched exactly on request): an icon
  // box per row instead of a centered pill label inside one shared bordered
  // container - icon left, label + paragraphs left-aligned to its right, a thin
  // divider between rows, no outer border/background box at all. Icon is fixed
  // per position (bring/mechanism/receive is always this order everywhere this
  // component is called), not data-driven.
  const groups: { label: string; paragraphs: readonly string[] | undefined; icon: React.ReactNode }[] = [
    { label: locale.modalTierBody.youBring, paragraphs: toParagraphs(bring), icon: <BringIcon size={large ? 24 : 20} /> },
    { label: locale.modalTierBody.we, paragraphs: toParagraphs(mechanism), icon: <WeIcon size={large ? 24 : 20} /> },
    { label: locale.modalTierBody.youReceive, paragraphs: toParagraphs(receive), icon: <ReceiveIcon size={large ? 24 : 20} /> },
  ]
  if (groups.every(g => !g.paragraphs)) return null
  // Stacked rows, NOT a 3-column grid (tried 2026-08-25, reverted same day -
  // live feedback: "die icons sollten schon stacked ubereinander bleiben, you
  // bring we you receive remains under each other" - the earlier "rechteck
  // format" request was about the CARD's own width/shape, not about putting
  // the three sections side by side. Widening the card (see the maxWidth bump
  // in Pricing.tsx) still shortens the card because each stacked paragraph
  // wraps into fewer lines, without restructuring the section layout itself.
  const boxSize = large ? 52 : 44
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
      {groups.map((g, gi) => (
        g.paragraphs && (
          <div key={g.label} style={{ display: 'flex', gap: mobile ? 12 : 14, paddingTop: gi > 0 ? (large ? 16 : 12) : 0, paddingBottom: large ? 16 : 12, borderTop: gi > 0 ? '1px solid var(--wm-border)' : undefined }}>
            <div className="rfi-pricing-icon-box" style={{
              width: boxSize, height: boxSize, flexShrink: 0,
              color: 'var(--accent-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{g.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* font-family no longer forced to JetBrains Mono (live feedback
                  2026-08-25: "same font as the rest ... not this roboto") - inherits
                  the card's body font like everything else now. Also flipped the
                  label/body size relationship: the label used to render SMALLER
                  than the paragraph it introduces, backwards from what reads right
                  ("you bring we you receive must be one font size bigger than what
                  it describes"). */}
              <div style={{
                fontSize: large ? 15 : 10, fontWeight: large ? 700 : 700,
                color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: large ? '0.04em' : '0.12em',
                marginBottom: 6,
              }}>{g.label}</div>
              {/* Was hardcoded #f4f6f6/#00e8d0 for `large` (live feedback 2026-08-25:
                  "immer noch grau" on dark, fixed by going near-white/bright-teal
                  instead of var(--text)/var(--accent-text)) - that hardcoding is
                  exactly why this text went invisible in light mode (found
                  2026-09-07: near-white text on a white card). var(--text) already
                  resolves solid/high-contrast in dark theme too, so dropping the
                  large-specific override doesn't reopen the original "immer noch
                  grau" complaint, it was never about the variable, it was about an
                  actually-grey value being used at the time. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {g.paragraphs.map((p, i) => (
                  <p key={i} style={{ margin: 0, fontSize: large ? 13.5 : 12.5, lineHeight: large ? 1.55 : 1.5, color: 'var(--text)' }}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  )
}
// Compact, non-repeating preview of "what happens after you pay" - added 2026-08-16
// (live feedback: the checkout modal repeated the exact same You bring/We/You
// receive box the buyer already read on the card before clicking Buy - by the time
// someone reaches checkout they've decided, they don't need re-convincing, they
// want to know what happens now, and internal funnel data already shows this is
// where people bail: 68 clicks, 50-100% cancel rate per tier, PAID stuck at 0). This
// reuses the same journey.steps content as the Journey section further down the
// page - no new copy, just a second, higher-leverage placement for it, right at the
// moment of highest purchase anxiety. Only used inside ModalTierBody (the modal),
// never on the card - the card's job is still to convince, via EngagementFlow.
function JourneyPreview({ mobile }: { mobile: boolean }) {
  const { t: locale } = useLocale()
  const steps = locale.journey.steps
  // Mobile sizing tightened separately (not just a scaled-down version of desktop) -
  // 5 nowrap labels ("Normalize" is the long one) plus connector lines is close to
  // the available width even on desktop; the modal's mobile padding leaves noticeably
  // less room, and this exact "5 fixed columns overflow a narrow viewport" shape is
  // what broke the Evidence table days earlier - shrinking font/circle/connector-
  // width here specifically avoids repeating that bug rather than hoping flex-shrink
  // handles it.
  const circle = mobile ? 20 : 24
  const font = mobile ? 8.5 : 10
  const connectorMin = mobile ? 3 : 8
  const reduced = prefersReducedMotion()
  // Relay animation (live feedback 2026-08-16): the first pass used one absolutely-
  // positioned dot sweeping via guessed percentage left/right offsets - fragile, since
  // the last step's circle is auto-sized (not evenly spaced like the flex:1 ones), so a
  // percentage endpoint can't reliably land "behind Learn" the way it was asked to. This
  // version instead animates each connector's OWN background color in sequence (each one
  // is already correctly positioned, no guessing needed) and finishes with a glow directly
  // on the Learn circle itself - the highlight can't help but end exactly where it should,
  // because it's driven by the real element, not a separately-positioned copy of it. All
  // four connectors + the glow share one identical `times` array so they can't drift out
  // of sync across repeats (a `delay` prop resets after the first loop in framer-motion,
  // baking the stagger into keyframe `times` instead avoids that entirely).
  // Glow slowed down and given a two-point plateau instead of a single spike (live
  // feedback 2026-08-16: "this glow could be a bit slower and more gradual") - it now
  // fades in, holds, and fades out over roughly a third of the (also lengthened) cycle
  // instead of one sharp keyframe.
  const CYCLE_SECONDS = 5.5
  const TIMES = [0, 0.13, 0.26, 0.39, 0.52, 0.68, 0.84, 1]
  const GREY = 'rgba(255,255,255,0.14)'
  const HOT = '#00f5c4'
  const connectorColors = (segmentIndex: number) => TIMES.map((_, ti) => (ti === segmentIndex + 1 ? HOT : GREY))
  const GLOW_ON = '0 0 16px 4px rgba(0,245,196,0.85)'
  const GLOW_OFF = '0 0 0 0 rgba(0,245,196,0)'
  const glowShadows = TIMES.map((_, ti) => (ti === 5 || ti === 6 ? GLOW_ON : GLOW_OFF))
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
        color: TEAL, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12,
      }}>{locale.modalTierBody.whatHappensNext}</div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1
          return (
            <div key={s.stage} style={{ display: 'flex', alignItems: 'flex-start', flex: isLast ? '0 0 auto' : 1, minWidth: 0 }}>
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <motion.div
                  animate={isLast && !reduced ? { boxShadow: glowShadows } : undefined}
                  transition={isLast && !reduced ? { duration: CYCLE_SECONDS, times: TIMES, repeat: Infinity, ease: 'easeInOut' } : undefined}
                  style={{
                    width: circle, height: circle, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,245,196,0.12)', border: `1px solid ${TEAL}`, color: TEAL,
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: font,
                  }}>{i + 1}</motion.div>
                <div style={{ fontSize: font, fontWeight: 700, color: '#e8e8f0', textAlign: 'center', whiteSpace: 'nowrap' }}>{s.stage}</div>
              </motion.div>
              {!isLast && (
                <motion.div
                  animate={reduced ? undefined : { background: connectorColors(i) }}
                  transition={reduced ? undefined : { duration: CYCLE_SECONDS, times: TIMES, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ flex: 1, height: 1, background: GREY, marginTop: circle / 2, minWidth: connectorMin }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
// Shared renderer for a tier's concrete-use-case bullets (see CarouselTier.bullets) -
// same small check-mark-in-a-circle glyph used nowhere else on the pricing UI, so it
// reads as "here's a list of situations", not another paragraph of prose.
// NOT rendered on pricing cards/modals any more (superseded by EngagementFlow, live
// feedback 2026-08-15 - the two together overflowed the card's capped height and read as
// redundant/broken, showing one truncated bullet). Still exported for any future non-
// pricing CarouselTier consumer that wants "who this is for" without the 3-part diagram.
function TierBullets({ bullets }: { bullets?: readonly string[] }) {
  if (!bullets || bullets.length === 0) return null
  return (
    <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, lineHeight: 1.55, color: 'var(--text)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}><path d="M20 6L9 17l-5-5" /></svg>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}
export function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}
// Added 2026-08-25 for the unified delivery+price bar on pricing cards
// (PricingOfferCard) - live feedback wanted a lightning-bolt "fast delivery"
// mark instead of the clock, one wide connected bar rather than two separate
// pills, matching a reference mockup.
export function ZapIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  )
}
// Three icons for EngagementFlow's redesigned per-row icon boxes (2026-08-25,
// reference mockup) - a viewfinder/reticle for "you bring" (what gets pointed
// at), a hex network node for "we" (Dingir/agent-swarm processing), a
// document for "you receive" (the deliverable). Same stroke language as the
// other line icons in this file (fill none, currentColor, round joins).
export function BringIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9V6a2 2 0 0 1 2-2h3" /><path d="M20 9V6a2 2 0 0 0-2-2h-3" />
      <path d="M4 15v3a2 2 0 0 0 2 2h3" /><path d="M20 15v3a2 2 0 0 1-2 2h-3" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  )
}
export function WeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <path d="M12 10.4V8M12 13.6v2.4M10.6 12H8M15.6 12h-2.6" opacity="0.7" />
    </svg>
  )
}
export function ReceiveIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 16h6M9 10h2" opacity="0.8" />
    </svg>
  )
}
// Checkout/proposal modal body, shared between both. Was three same-weight paragraphs in
// a row - read as "one massive block" (Simeon's words) with no way to tell what's the
// deliverable vs. the closing pitch. Now: a "WHAT YOU GET" label up front, a divider, and
// the tier copy's closing sentence (always the strongest line - see the pricing rewrite)
// pulled out as a distinct highlighted callout instead of blending into the paragraph
// flow. Delivery line upgraded from floating text to an actual bordered pill.
export function ModalTierBody({ tier, price, desc, delivery, mobile, bullets, bring, mechanism, receive }: {
  tier: string; price: string; desc: string; delivery?: string; mobile: boolean; bullets?: readonly string[]
  bring?: readonly string[]; mechanism?: readonly string[]; receive?: readonly string[]
}) {
  const { t } = useLocale()
  const paras = desc.split('\n\n')
  const body = paras.slice(0, -1)
  const punchline = paras[paras.length - 1]
  return (
    <>
      {/* Title was a hardcoded #c8c8d8 (fixed light grey, not theme-aware - would've
          been low-contrast on light theme too) - live feedback 2026-08-14, "fat white
          [in dark] or black [in light]" - var(--text) instead. Same live feedback for
          the punchline paragraph below: color was var(--accent-text) (teal), meant as
          a small closing-line highlight, but for any tier whose desc has no '\n\n'
          paragraph break, `body` is empty and the ENTIRE description becomes the
          "punchline" - i.e. a full block of teal body copy, not a highlight. Text is
          var(--text) now for both cases; the teal left border alone still marks it as
          the closing/highlighted line when there IS a real body above it. The smaller
          "WHAT YOU GET" eyebrow stays on its own muted grey - that one's meant to
          stay quiet, it's just the section label, not primary content. */}
      {/* Title + the 12h response commitment share one header row (live feedback
          2026-08-16: "title, next to it the pill, then summary, then what happens
          next"). First pass gave this its own bordered/background chip - flagged
          same day as "too much noise" next to the title - downgraded to plain quiet
          inline text, no box, no uppercase shouting. */}
      {/* alignItems: 'baseline' (not 'flex-start') - live feedback 2026-08-16: the small
          pill text was sitting visibly higher than the title, because top-aligning two
          very different font sizes lines up their box tops, not their actual text
          baselines. Baseline alignment fixes that regardless of the size difference,
          no manual marginTop nudge needed any more. */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <h3 style={{ fontSize: mobile ? 22 : 28, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, margin: 0 }}>{tier}</h3>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, color: '#8a8aa0', fontSize: 12 }}>
          <ClockIcon /> {t.modalTierBody.inTouchWithin12h}
        </div>
      </div>
      {body.length > 0 && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#7a7aa0', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>
          {t.modalTierBody.whatYouGet}
        </div>
      )}
      {body.map((para, pi) => (
        <p key={pi} style={{ color: '#e8e8f0', fontSize: mobile ? 15.5 : 16.5, lineHeight: 1.85, margin: 0, marginBottom: 18 }}>{para}</p>
      ))}
      {body.length > 0 && <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '2px 0 18px' }} />}
      {punchline && (
        body.length > 0 ? (
          <p style={{
            color: 'var(--text)', fontSize: mobile ? 15.5 : 17, fontWeight: 700, lineHeight: 1.6,
            margin: 0, marginBottom: 20, paddingLeft: 14, borderLeft: `2px solid ${TEAL}`,
          }}>{punchline}</p>
        ) : (
          // No real body/punchline split (single-paragraph desc, e.g. First Light) - this
          // used to get the SAME bold/highlighted treatment as a genuine closing line above
          // real body text, so the whole description read as one shouting block (live
          // feedback 2026-08-16: "darf grau sein und bissl kleiner, nich so fett"). Downgraded
          // to quiet context copy here specifically - the tiers that DO have a real body +
          // distinct closing punchline keep the emphasized version above untouched.
          <p style={{
            color: '#8a8aa0', fontSize: mobile ? 13.5 : 14, fontWeight: 400, lineHeight: 1.6,
            margin: 0, marginBottom: 20,
          }}>{punchline}</p>
        )
      )}
      <JourneyPreview mobile={mobile} />
    </>
  )
}



// Soft, low-opacity fills instead of the flat grey/mono-border pills that used
// to render here - same font/weight/letterspacing as the rest of the site's
// tag treatment, just a rotating set of desaturated brand-adjacent hues so a
// row of several tags reads as a set rather than a monochrome wall. Assigned
// by index (not per-string hash) so it's deterministic across renders and
// locales without depending on the tag text itself.
// Live feedback 2026-08-14: the first pass of this (fixed light pastel text -
// #9cc9ff soft blue, #d7b8ff soft violet, etc.) was calibrated by eye against
// a dark card and was close to unreadable on light theme's pale mint-tinted
// featured card - light text on a light background. Text now always stays on
// the same var(--text3)/var(--border) tokens used everywhere else (already
// theme-correct in both directions), the rotating hue only colors the
// low-opacity wash background and border - a thin border and a translucent
// fill both tolerate a lot more color before contrast becomes a problem than
// body text does.
export const OUTPUT_TAG_HUES = [
  { bg: 'rgba(0,245,196,0.09)',  border: 'rgba(0,245,196,0.35)' },  // teal (brand)
  { bg: 'rgba(255,180,90,0.09)', border: 'rgba(255,180,90,0.4)' },  // amber
  { bg: 'rgba(90,160,255,0.09)', border: 'rgba(90,160,255,0.4)' },  // soft blue
  { bg: 'rgba(180,120,255,0.09)',border: 'rgba(180,120,255,0.4)' }, // soft violet
]





export function useMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp)
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [bp])
  return m
}

// ── Own-offer funnel telemetry ──────────────────────────────────────────────
// Every pricing-tier interaction is beamed to the Lighthouse first-party tracker
// as a tagged `section` value. Lighthouse groups these into a per-tier funnel:
//   offer_click:<tier>      → user opened the checkout modal (button press)
//   offer_cancel:<tier>     → user dismissed the modal without continuing
//   offer_attempt:<tier>    → user hit CONTINUE TO STRIPE (before the redirect)
//   proposal_request:<tier> → user hit REQUEST PROPOSAL (contact-only tiers)
// That gives click → cancel → attempt → paid without any cookies or PII — it's a
// 1x1 beacon on our own infra, not third-party ad tracking.
// gclid/utm_* only exist on the URL a paid click actually lands on. PublicSite.tsx's
// own initial page-load beacon (its 'beacon on page load' effect) already reads and
// forwards them for that one event - added 2026-08-07 (commit 0caa889) alongside the
// matching fix in Lighthouse's own track.rs (found chasing an unexplained Organic
// Search spike that actually traced to Ads). This beacon() function is the OTHER path:
// every named funnel/lead event (offer_click, lead_submitted, etc.) it sends still went
// out with no attribution at all, so even when a visit's initial page-load correctly
// reads "paid", nothing downstream in the funnel could be traced back to that same
// paid session. Cached in a plain module-scope variable, not sessionStorage/localStorage
// - the site's privacy policy (LegalPage.tsx, /datenschutz) explicitly and repeatedly
// states nothing is written to any browser storage, only kept in memory for the
// current page load. Matches the existing section-view hit-counter's own pattern
// (PublicSite.tsx: "lives only in this component's memory... gone the moment the page
// reloads"). Read once, from the real landing URL, before any client-side nav can
// replace it (navigateHome's `history.replaceState(null, '', '/')` does drop it, same
// limitation the in-memory hit-counter already accepts on a hard reload).
const ATTRIBUTION_KEYS = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign'] as const
let cachedAttribution: Record<string, string> | null = null

export function attributionParams(): Record<string, string> {
  if (cachedAttribution) return cachedAttribution
  const q = new URLSearchParams(location.search)
  const attrib: Record<string, string> = {}
  for (const key of ATTRIBUTION_KEYS) {
    const value = q.get(key)
    if (value) attrib[key] = value
  }
  cachedAttribution = attrib
  return attrib
}

export function beacon(section: string, extra?: Record<string, string>) {
  const body: Record<string, string> = {
    path: location.pathname,
    referrer: document.referrer,
    site: 'rfi-irfos',
    section,
    ...attributionParams(),
    ...extra,
  }
  fetch(LIGHTHOUSE_BEACON, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {})
}


// Form-abandonment signal: did someone type into a form and then leave without
// submitting it. Fires at most once per form per visit, only if the form actually has
// content in it (never on an untouched, empty form) and was never successfully sent.
// No field values are sent - just the fact that abandonment happened, on which form.
export function useFormAbandonment(name: string, values: Record<string, unknown>, state: string) {
  const touchedRef = useRef(false)
  const reportedRef = useRef(false)
  useEffect(() => {
    if (Object.entries(values).some(([k, v]) => k !== 'botcheck' && typeof v === 'string' && v.trim() !== '')) {
      touchedRef.current = true
    }
  })
  useEffect(() => {
    const report = () => {
      if (reportedRef.current || !touchedRef.current || state === 'ok') return
      reportedRef.current = true
      beacon('form_abandoned:' + name)
    }
    const onVisibility = () => { if (document.visibilityState === 'hidden') report() }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', report)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', report)
    }
  }, [name, state])
}
