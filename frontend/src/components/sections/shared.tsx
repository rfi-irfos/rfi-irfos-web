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
export const LIGHTHOUSE_PIXEL = 'https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track/pixel.gif'
export const LIGHTHOUSE_BEACON = 'https://lighthouse-rfi-irfos.fly.dev/lighthouse/api/track'
export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

    const section = el.closest('section')
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

// Lighter version of the same shuffle mechanic as HeroFlipWord, without the
// mirror - a section heading settles into itself the first time it scrolls
// into view, AND every time a top-nav click jumps straight to it.
//
// The nav-jump case first tried piggybacking on `revealSuppressed` (the
// existing ~800ms flag the global anchor-click handler sets during its smooth
// scroll) - unreliable in practice: that's a fixed timer racing an unrelated,
// variable-duration scroll animation, so for a long jump the flag could
// already be back to false by the time this heading's intersection threshold
// actually crossed, silently skipping the replay. Fixed with a direct signal
// instead: the click handler dispatches an 'rfi-nav-jump' CustomEvent on the
// actual target element at the moment of the click, independent of how long
// the resulting scroll takes - listened for here directly, deterministic.
//
// Organic re-scrolling past an already-played heading does not replay it -
// only the first natural scroll-into-view or an explicit nav click does.
// Tried this as a nav-link hover effect first (2026-08-05); direct correction
// was "not these, the actual header[s] on the page as you scroll" - moved
// here instead, nav links reverted to plain. innerHTML-based rather than
// persistent per-character spans: short text, runs once per trigger, not a
// continuous loop.
export function ScrambleHeading({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = prefersReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.textContent = text
    if (reduced) return

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const randomChar = () => chars[Math.floor(Math.random() * chars.length)]
    const n = text.length
    let raf = 0
    let playing = false

    function play() {
      if (playing) return
      playing = true
      // Slowed ~2x from the original (start 0-9, end +8-19) - feedback 2026-08-06:
      // headings resettled too fast while scrolling, read as flicker not a shuffle.
      // HeroFlipWord's own timing is untouched, this only affects section headings.
      const plans = Array.from({ length: n }, () => {
        const start = Math.floor(Math.random() * 20)
        return { start, end: start + Math.floor(Math.random() * 24) + 16 }
      })
      let frame = 0
      function tick() {
        let out = ''
        let done = 0
        for (let i = 0; i < n; i++) {
          const p = plans[i]
          if (frame >= p.end) { done++; out += text[i] }
          else if (frame >= p.start) {
            const remaining = (p.end - frame) / (p.end - p.start)
            out += `<span style="filter:blur(${Math.max(0, remaining * 2.4).toFixed(2)}px)">${randomChar()}</span>`
          } else {
            out += text[i]
          }
        }
        el!.innerHTML = out
        if (done === n) { playing = false; return }
        raf = requestAnimationFrame(tick)
        frame++
      }
      tick()
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { play(); io.unobserve(entry.target) }
      })
    }, { threshold: 0.4 })
    io.observe(el)

    const section = el.closest('section')
    section?.addEventListener('rfi-nav-jump', play)

    return () => {
      io.disconnect()
      section?.removeEventListener('rfi-nav-jump', play)
      cancelAnimationFrame(raf)
    }
  }, [text, reduced])

  return <span ref={ref} />
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
    const inEnd = Math.min(0.45, 0.16 + delay * 0.025)
    const outStart = Math.max(0.55, 0.84 - delay * 0.025)
    if (latest <= 0) return 0
    if (latest < inEnd) return latest / inEnd
    if (latest <= outStart) return 1
    if (latest < 1) return 1 - (latest - outStart) / (1 - outStart)
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
function EngagementFlow({ bring, mechanism, receive }: {
  bring?: readonly string[]; mechanism?: readonly string[]; receive?: readonly string[]
}) {
  const { t: locale } = useLocale()
  // This box is the innermost of four nested padded surfaces (section gutter >
  // offer glass card > featured tier card > this), so its own horizontal padding
  // is the last 32px taken off an already narrow phone column. Halved on mobile
  // as part of the 2026-08-16 squeezed-card fix - see the comment on the arrow
  // buttons in Pricing.tsx for the full chain.
  const mobile = useMobile(640)
  if ((!bring || bring.length === 0) && (!mechanism || mechanism.length === 0) && (!receive || receive.length === 0)) return null
  const groups: { label: string; items: readonly string[] | undefined }[] = [
    { label: locale.modalTierBody.youBring, items: bring },
    { label: locale.modalTierBody.we, items: mechanism },
    { label: locale.modalTierBody.youReceive, items: receive },
  ]
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16,
      border: '1px solid rgba(0,245,196,0.16)', borderRadius: 12,
      padding: mobile ? '12px 10px' : '14px 16px',
      background: 'rgba(0,245,196,0.03)',
    }}>
      {groups.map((g, gi) => (
        (g.items && g.items.length > 0) && (
          <div key={g.label} style={{
            paddingTop: gi > 0 ? 10 : 0,
            borderTop: gi > 0 ? '1px solid rgba(255,255,255,0.07)' : undefined,
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
              color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6,
            }}>{g.label}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {g.items!.map((item, i) => (
                <li key={i} style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text)', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ color: TEAL, fontSize: 16, lineHeight: 1, flexShrink: 0 }}>&#8226;</span>{item}
                </li>
              ))}
            </ul>
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
// Card face shows tier + ONE plain sentence (first sentence of `desc`, not the whole
// first paragraph) + price + a labeled button - full desc and the delivery timeline
// only live in the modal after a click. First pass (2026-07-31) put the whole first
// paragraph plus a delivery pill on the card and it read as cluttered/noisy - trimmed
// back to a single hard sentence per Simeon's call, delivery moved back to modal-only.
export function PriceTierCard({ tier, price, hook, highlight, onBuy, onProposal }: {
  tier: string; price: string; hook?: string; highlight?: boolean
  onBuy?: () => void; onProposal?: () => void
}) {
  const tiltRef = useRef<HTMLDivElement>(null)
  const tilt = useTilt(tiltRef, 4)
  return (
    <motion.div ref={tiltRef} className="rfi-hover-card" style={{
      ...tilt,
      // Highlight used to be a barely-there 6%-opacity tint - easy to miss scanning a
      // dense grid of near-identical cards. Now a visibly brighter tint, a solid
      // (not low-opacity) border, and a persistent glow (not hover-only) so the
      // recommended tier actually reads as recommended at a glance, plus the badge below.
      // Regular cards bumped up from var(--bg2) (3% white - nearly invisible against the
      // near-black page background) to a visibly lighter/whiter surface + brighter border,
      // so each tier reads as a distinct card instead of blending into the background.
      background: highlight ? 'rgba(0,245,196,0.1)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${highlight ? 'rgba(0,245,196,0.55)' : 'rgba(255,255,255,0.14)'}`,
      boxShadow: highlight ? '0 0 0 1px rgba(0,245,196,0.12), 0 12px 32px rgba(0,245,196,0.14)' : undefined,
      borderRadius: 14, padding: '22px 20px', height: '100%', position: 'relative',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16,
    }}>
      {highlight && (
        <span style={{
          position: 'absolute', top: -11, left: 20,
          background: TEAL, color: '#070711', fontSize: 9.5, fontWeight: 800,
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '3px 9px', borderRadius: 20,
        }}>Recommended</span>
      )}
      <div>
        <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', lineHeight: 1.3, marginBottom: hook ? 10 : 0 }}>{tier}</div>
        {hook && (
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{hook}</div>
        )}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent-text)' }}>{price}</div>
          {(onBuy || onProposal) && (
            <button
              onClick={onBuy ?? onProposal}
              style={{
                flexShrink: 0, borderRadius: 8, cursor: 'pointer', padding: '9px 16px',
                display: 'flex', alignItems: 'center', gap: 7,
                fontSize: 12.5, fontWeight: 800, letterSpacing: '0.02em',
                // Buy = solid teal fill (the "pay now" color used everywhere else on the
                // page). Request-a-proposal is deliberately NOT a paler version of the same
                // green - a solid neutral fill instead, so the two read as different KINDS
                // of action at a glance, not just different intensities of the same one.
                background: onBuy ? 'var(--accent)' : 'var(--bg3)',
                border: onBuy ? 'none' : '1px solid var(--border)',
                color: onBuy ? 'var(--accent-fg)' : 'var(--text)',
              }}
            >
              {onBuy ? <CartIcon /> : <ArrowIcon />}
              {onBuy ? 'Get Started' : 'Request Proposal'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Output vocabulary (website-repositioning plan, Stage 1e) ───────────────────
// Shared framework a tier's `outputs` field draws from instead of each product
// line inventing its own "what you get" language. Not every tier lists all six -
// only the ones that line's desc copy actually supports (see per-tier `outputs`
// arrays below, e.g. Security Audits / Market Research). Web/Mobile Dev and Device
// Privacy tiers deliver a built product or a service session, not a report, so
// most of them carry no `outputs` tag at all rather than forcing report language
// onto a non-report deliverable.
export const OUTPUT_VOCABULARY = [
  'Investigation Report', 'Evidence Map', 'Risk Matrix',
  'Technical Findings', 'Recommendations', 'Optional Retest',
] as const

// One scope tag per product LINE (not per tier - all tiers within a line cover
// the same scope), so a visitor scanning the pricing headers knows what a whole
// carousel covers before opening any single tier. Deliberately not a new field
// on `CarouselTier` - would touch every tier array in every product line for a
// value that doesn't vary tier-to-tier. A small static label next to the
// existing product-line heading instead.
export function ScopeTag({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em',
      textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-text)',
      border: '1px solid rgba(0,245,196,0.3)', background: 'rgba(0,245,196,0.06)',
      borderRadius: 999, padding: '4px 12px', verticalAlign: 'middle', marginLeft: 12,
    }}>{label}</span>
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
const OUTPUT_TAG_HUES = [
  { bg: 'rgba(0,245,196,0.09)',  border: 'rgba(0,245,196,0.35)' },  // teal (brand)
  { bg: 'rgba(255,180,90,0.09)', border: 'rgba(255,180,90,0.4)' },  // amber
  { bg: 'rgba(90,160,255,0.09)', border: 'rgba(90,160,255,0.4)' },  // soft blue
  { bg: 'rgba(180,120,255,0.09)',border: 'rgba(180,120,255,0.4)' }, // soft violet
]

export function OutputTags({ outputs }: { outputs?: readonly string[] }) {
  if (!outputs || outputs.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
      {outputs.map((o, i) => {
        const hue = OUTPUT_TAG_HUES[i % OUTPUT_TAG_HUES.length]
        return (
          // textTransform: 'uppercase' dropped (live feedback 2026-08-14: read as
          // "rau"/shouty) - shows the tag's own Title Case as written instead.
          <span key={o} style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.01em',
            fontFamily: "'JetBrains Mono', monospace", color: 'var(--text3)',
            border: `1px solid ${hue.border}`, background: hue.bg, borderRadius: 999, padding: '4px 10px',
          }}>{o}</span>
        )
      })}
    </div>
  )
}

// Shape every product-line tier array conforms to (Security Audits, Market
// Research, Web Development, Mobile App Dev, Device Privacy Hardening). `outputs`
// is optional and deliberately omitted where the Output vocabulary doesn't fit.
export type CarouselTier = {
  tier: string
  price: string
  hook?: string
  desc: string
  // Concrete, jargon-free use cases ("you're in this situation, this tier is for
  // you") - added 2026-08-15, live feedback: the desc prose alone doesn't land for
  // a visitor with zero background in what RFI-IRFOS does, however well-written.
  bullets?: readonly string[]
  // Three-part "You bring / RFI-IRFOS / You receive" transformation, as short bullet
  // phrases rather than prose - added 2026-08-15, live feedback: even a well-written
  // desc paragraph doesn't make it obvious what a visitor is meant to hand over and
  // what they get back; a diagram-like bullet structure does. All three optional -
  // renders nothing if omitted (see EngagementFlow).
  bring?: readonly string[]
  mechanism?: readonly string[]
  receive?: readonly string[]
  delivery?: string
  highlight?: boolean
  outputs?: readonly string[]
}

// Price + delivery, grouped as one bottom-left unit (live feedback,
// 2026-08-12: price used to sit top-right next to the tier name while delivery
// sat bottom-left in its own pill - two different reading paths for the two
// numbers that actually decide a purchase. Now every rendering of a tier -
// featured card, secondary card, modal - pins price directly beside the
// calendar-days pill at the bottom, same order, same place, every time).
function PriceDelivery({ price, delivery, size = 'md' }: { price: string; delivery?: string; size?: 'sm' | 'md' }) {
  const priceSize = size === 'sm' ? 15 : 20
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {delivery && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.3)',
          borderRadius: 10, padding: size === 'sm' ? '4px 9px' : '6px 12px',
          color: 'var(--accent-text)', fontSize: size === 'sm' ? 11 : 12.5, fontWeight: 600, lineHeight: 1.5,
        }}>
          <ClockIcon /> {delivery}
        </div>
      )}
      <span style={{ fontSize: priceSize, fontWeight: 900, color: 'var(--accent-text)', whiteSpace: 'nowrap' }}>{price}</span>
    </div>
  )
}

// Featured-tier display (redesigned 2026-08-12, live feedback: no more
// prev/next arrows cycling the featured slot one tier at a time - a product
// line now always ships exactly 1 highlighted tier + 3 upsells, so all 4 fit
// on screen at once. One large card for the highlighted/active tier, a static
// 3-across row of full secondary cards underneath (side by side, not stacked,
// not a scrolling filmstrip) for the other tiers in the line. Clicking a
// secondary card still swaps it into the featured slot - that swap
// interaction stays, only the "cycle via arrows" and "one-line filmstrip
// tile" parts are gone. One instance per product line, never mixing tiers
// across lines.
export function TierCarousel({ tiers, getActions }: {
  tiers: readonly CarouselTier[]
  getActions: (t: CarouselTier) => { onBuy?: () => void; onProposal?: () => void }
}) {
  const { t: locale } = useLocale()
  const mobile = useMobile(640)
  const defaultIdx = tiers.findIndex(t => t.highlight)
  const [idx, setIdx] = useState(defaultIdx === -1 ? 0 : defaultIdx)
  const active = tiers[idx]
  const actions = getActions(active)
  const secondary = tiers.map((t, i) => ({ t, i })).filter(({ i }) => i !== idx)

  return (
    <div style={{ marginBottom: 0 }}>
      {/* Featured card - was shrunk to maxWidth 520 (from 760) at one point so it
          wouldn't dwarf the narrower secondary row below it; live feedback
          2026-08-14 reversed that - use the full width the parent already
          allots (maxWidth: 1040 on the wrapping div in Pricing.tsx) instead of
          leaving a wide empty margin either side. */}
      <motion.div key={active.tier} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
        style={{
          margin: '0 auto 14px', borderRadius: 18, padding: mobile ? '16px 12px' : '20px 16px',
          // Opaque base + a teal wash (not a single translucent rgba fill) -
          // spine feedback, 2026-08-06: this pricing card is exactly the kind
          // of dense, text-heavy surface the scroll spine/orb must never bleed
          // through, and a flat low-alpha background let it show straight through.
          background: 'linear-gradient(var(--accent-dim), var(--accent-dim)), var(--glass-bg-solid)',
          border: '1px solid rgba(0,245,196,0.35)',
          boxShadow: '0 12px 40px rgba(0,245,196,0.1)',
        }}>
        <div>
          {/* "FEATURED TIER" / "★ RECOMMENDED TIER" eyebrow removed (live feedback,
              2026-08-14: reads as noise repeated over every card, the tier name
              alone is the title). The tier name is the first thing in the card now. */}
          <div style={{ fontSize: 21, fontWeight: 900, color: 'var(--text)', lineHeight: 1.25 }}>{active.tier}</div>
          {/* --text2 -> --text (live feedback 2026-08-14: "sollte alles weiß sein,
              weiß geschrieben... im whitemode sauber schwarz" - full-contrast body
              copy, not the dimmer secondary tone). */}
          {active.hook && <div style={{ fontSize: 12.5, color: 'var(--text)', marginTop: 8 }}>{active.hook}</div>}
        </div>
        {/* Used to be capped at maxHeight 320 + internal scroll, so every card had
            the same predictable height regardless of description length - live
            feedback 2026-08-16: an offer you have to scroll inside of to read isn't
            a good offer, the whole You bring/We/You receive box needs to be visible
            in one look. Card now grows to fit its content instead. marginTop
            raised 12->22 (live feedback 2026-08-14: the hook sentence and the
            first description paragraph read as cramped, one line of air wasn't
            enough breathing room between them). */}
        <div style={{ marginTop: 22 }}>
          {active.desc.split('\n\n').map((p, i) => (
            <p key={i} style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.65, marginBottom: 9 }}>{p}</p>
          ))}
          <EngagementFlow bring={active.bring} mechanism={active.mechanism} receive={active.receive} />
        </div>
        {/* Delivery pill (left) + green buy button showing cart icon + price (right).
            Replaces the old "Get Started" label - the price IS the button label. */}
        {/* flexWrap nowrap -> wrap (2026-08-16): both children are whiteSpace:
            nowrap, so on a narrow card they could not shrink and simply spilled
            past the card's edge instead of dropping onto a second line. That
            overflow is why the delivery/price badges still looked correctly
            sized in the bug screenshot while everything above them was crushed -
            they were never inside the narrow column to begin with. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
          {active.delivery && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, flex: '0 0 auto', maxWidth: '100%',
              background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.3)',
              borderRadius: 10, padding: '6px 12px',
              color: 'var(--accent-text)', fontSize: 12, fontWeight: 600, lineHeight: 1.5,
            }}>
              <ClockIcon style={{ flexShrink: 0 }} /> <span style={{ minWidth: 0, whiteSpace: 'nowrap' }}>{active.delivery}</span>
            </div>
          )}
          {(actions.onBuy || actions.onProposal) && (
            <button
              onClick={actions.onBuy ?? actions.onProposal}
              style={{
                borderRadius: 8, cursor: 'pointer', padding: '9px 16px', flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800,
                letterSpacing: '0.02em', whiteSpace: 'nowrap',
                background: actions.onBuy ? 'var(--accent)' : 'var(--bg3)',
                border: actions.onBuy ? 'none' : '1px solid var(--border)',
                color: actions.onBuy ? 'var(--accent-fg)' : 'var(--text)',
              }}
            >
              <CartIcon />
              {active.price}
            </button>
          )}
        </div>
      </motion.div>

      {/* Secondary tiers - the other tiers in this line, side by side, always
          visible, no click-through required to see what else exists. Grid
          wraps to fewer columns only when the viewport can't fit 3 readable
          cards, never stacks to a single column on desktop. maxWidth 680
          dropped for the same reason as the featured card above - fills the
          parent's full 1040 instead of leaving empty margin on both sides.
          minmax's first argument is min(100%, 170px), not a bare 170px: auto-fit's
          minimum is a hard floor, so on a container narrower than 170px the track
          stayed 170px and overflowed. Same guard Research.tsx already uses. */}
      {secondary.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 10, margin: '0 auto' }}>
          {secondary.map(({ t, i }) => (
            <button key={t.tier} onClick={() => setIdx(i)} style={{
              textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              borderRadius: 12, padding: '12px 14px', gap: 7,
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${i === defaultIdx ? 'rgba(0,245,196,0.4)' : 'var(--border)'}`,
              transition: 'border-color .15s, background .15s',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{t.tier}</div>
              {t.hook && <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{t.hook}</div>}
              <div style={{ marginTop: 'auto', paddingTop: 4 }}>
                <PriceDelivery price={t.price} size="sm" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

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
export function beacon(section: string, extra?: Record<string, string>) {
  const body: Record<string, string> = {
    path: location.pathname,
    referrer: document.referrer,
    site: 'rfi-irfos',
    section,
    ...extra,
  }
  fetch(LIGHTHOUSE_BEACON, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {})
}

// Core Web Vitals (LCP, CLS) beamed once per page-load through the same first-party
// pixel as everything else here - no cookie, no visitor id, just "was this page slow
// or janky for someone." LCP/CLS both only finalize once the page is hidden/unloaded
// (the browser can keep painting/shifting content after that point in some cases, but
// this is the standard capture pattern), so we report on visibilitychange/pagehide,
// not on mount.
export function useWebVitals() {
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    let lcp = 0
    let cls = 0
    try {
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        const last = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
        lcp = last.renderTime || last.loadTime || last.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })
    } catch { /* unsupported browser - skip, not critical */ }
    try {
      const supported = (PerformanceObserver as unknown as { supportedEntryTypes?: string[] }).supportedEntryTypes
      if (!supported || supported.includes('layout-shift')) {
        new PerformanceObserver(list => {
          for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
            if (!entry.hadRecentInput) cls += entry.value
          }
        }).observe({ type: 'layout-shift', buffered: true })
      }
    } catch { /* unsupported browser - skip, not critical */ }

    let reported = false
    const report = () => {
      if (reported || (lcp === 0 && cls === 0)) return
      reported = true
      beacon('web_vitals', { lcp: String(Math.round(lcp)), cls: cls.toFixed(3) })
    }
    const onVisibility = () => { if (document.visibilityState === 'hidden') report() }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', report)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', report)
    }
  }, [])
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
