// Shared primitives used across multiple homepage sections (and by PublicSite.tsx
// itself for the nav/modals/footer) - extracted verbatim from the former single
// ~5600-line PublicSite.tsx as a pure refactor (no copy/style/behavior changes).
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
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

// Fixed-top scroll progress bar, teal fill on the nav's carbon background - gives
// the whole long funnel (research → projects → track record → pricing → contact)
// a sense of "you're getting somewhere". Fixed 3px strip, transform-only (scaleX).
export function ScrollProgressBar() {
  const progress = usePageScrollProgress()
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 101, background: 'rgba(255,255,255,0.04)' }}>
      <div style={{
        height: '100%', width: '100%', transformOrigin: '0 50%',
        transform: `scaleX(${progress})`, background: TEAL,
        boxShadow: '0 0 8px rgba(0,245,196,0.6)',
      }} />
    </div>
  )
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

// Real per-letter mirror-flip for a single word. Approved 2026-08-05 after several
// review rounds against a standalone motion prototype - replaces the earlier
// permanent-upside-down rotate(180deg) attempt (added and reverted same day,
// 2026-08-02: "disorienting, not clever", see the comment in RevealWords below).
// Each letter is its own absolutely-positioned span with its own transition - it
// slides from its normal slot to its mirrored slot and flips (scaleX(-1))
// individually, once its own brief shuffle settles, rather than one rotate() on
// the whole word (which read as "a string rotating," not real per-letter motion).
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
    const mirrorLeft: number[] = new Array(n)
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
    let accM = 0
    for (let i = n - 1; i >= 0; i--) { mirrorLeft[i] = accM; accM += widths[i] }
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
      // Live feedback 2026-08-05: overall animation read as too long. Windows
      // roughly halved from the reviewed version - still individually varied
      // per letter (not clustered), just compressed to a shorter total span.
      const plans = spans.map(() => {
        const start = Math.floor(Math.random() * 25)
        return { start, end: start + Math.floor(Math.random() * 30) + 18, flipped: false }
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
          } else if (!p.flipped) {
            p.flipped = true
            span.textContent = word[i]
            span.style.filter = 'none'
            span.style.left = mirrorLeft[i] + 'px'
            span.style.transform = 'scaleX(-1) rotate(0deg)'
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
            leadTimer = setTimeout(play, 300)
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
      const plans = Array.from({ length: n }, () => {
        const start = Math.floor(Math.random() * 10)
        return { start, end: start + Math.floor(Math.random() * 12) + 8 }
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

// Rewritten 2026-08-05. The previous version computed opacity as a pure function of the
// element's CURRENT position relative to the viewport on every scroll event, with no
// memory of ever having been shown. That meant scrolling an element into view, then
// scrolling back up past it - completely ordinary browsing, re-reading pricing, checking
// the ledger a second time - drove its rect.top back below the reveal threshold and set
// its opacity straight back to 0. Confirmed by direct reproduction (scroll down, scroll
// back to top, re-check computed opacity) and independently flagged before this by
// another agent's report of "missing" sections that were never actually missing from the
// DOM, just invisible at whatever scroll position was current. Whole sections - the
// Projects carousel, the Track Record heading and its KPI cards - could vanish entirely
// depending on scroll direction, on the one page currently taking paid traffic.
// Fixed by switching to a one-shot IntersectionObserver, the same pattern already used
// by BentoTile in Research.tsx: once an element has been seen, `visible` latches true
// and never reverts, regardless of where the user scrolls afterward.
export function Reveal({
  children, delay = 0, from = 'bottom', dist = 32, style: extra,
}: {
  children: React.ReactNode
  delay?: number
  from?: 'bottom' | 'top' | 'left' | 'right' | 'scale'
  dist?: number
  style?: React.CSSProperties
}) {
  const [visible, setVisible] = useState(() => prefersReducedMotion() || revealSuppressed.current)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (visible) return // reduced-motion or an in-flight anchor jump already satisfied this
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting || revealSuppressed.current) { setVisible(true); io.disconnect() }
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    // IO alone misses one case: an instant jump (scrollbar drag, End key, a #hash link
    // outside our own nav handler) that lands past the element in a single tick, with no
    // rendered frame ever showing it as intersecting. A plain scroll listener as a backup
    // catches that reliably by just checking current position - this only ever turns
    // visible ON, never back off, so it can't reintroduce the bug this rewrite fixes.
    const onScroll = () => {
      if (el.getBoundingClientRect().top < window.innerHeight) { setVisible(true); io.disconnect() }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [visible])
  const d = visible ? 0 : dist
  const transform = from === 'left'  ? `translateX(${-d}px)` :
                     from === 'right' ? `translateX(${d}px)`  :
                     from === 'top'   ? `translateY(${-d}px)` :
                     from === 'scale' ? `scale(${visible ? 1 : 0.84})` :
                     `translateY(${d}px)`
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform,
      transition: revealSuppressed.current ? 'none' : `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${(delay * 0.08).toFixed(2)}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${(delay * 0.08).toFixed(2)}s`,
      willChange: visible ? undefined : 'transform, opacity',
      ...extra,
    }}>{children}</div>
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
export function ModalTierBody({ tier, price, desc, delivery, mobile }: {
  tier: string; price: string; desc: string; delivery?: string; mobile: boolean
}) {
  const { t } = useLocale()
  const paras = desc.split('\n\n')
  const body = paras.slice(0, -1)
  const punchline = paras[paras.length - 1]
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
        <h3 style={{ fontSize: mobile ? 22 : 28, fontWeight: 800, color: '#c8c8d8', lineHeight: 1.2 }}>{tier}</h3>
        <div style={{ fontSize: mobile ? 22 : 26, fontWeight: 900, color: 'var(--accent-text)', whiteSpace: 'nowrap' }}>{price}</div>
      </div>
      {body.length > 0 && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#606080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>
          {t.modalTierBody.whatYouGet}
        </div>
      )}
      {body.map((para, pi) => (
        <p key={pi} style={{ color: '#e8e8f0', fontSize: mobile ? 15.5 : 16.5, lineHeight: 1.85, margin: 0, marginBottom: 18 }}>{para}</p>
      ))}
      {body.length > 0 && <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '2px 0 18px' }} />}
      {punchline && (
        <p style={{
          color: 'var(--accent-text)', fontSize: mobile ? 15.5 : 17, fontWeight: 700, lineHeight: 1.6,
          margin: 0, marginBottom: 20, paddingLeft: 14, borderLeft: `2px solid ${TEAL}`,
        }}>{punchline}</p>
      )}
      {delivery && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.3)',
          borderRadius: 20, padding: '5px 12px', marginBottom: 20,
          color: 'var(--accent-text)', fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace",
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          <ClockIcon /> {delivery}
        </div>
      )}
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

export function OutputTags({ outputs }: { outputs?: readonly string[] }) {
  if (!outputs || outputs.length === 0) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
      {outputs.map(o => (
        <span key={o} style={{
          fontSize: 10.5, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase',
          fontFamily: "'JetBrains Mono', monospace", color: 'var(--text3)',
          border: '1px solid var(--border)', borderRadius: 999, padding: '4px 10px',
        }}>{o}</span>
      ))}
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
  delivery?: string
  highlight?: boolean
  outputs?: readonly string[]
}

// Featured-tier carousel - the display mechanism for Stage 1e's corrected
// instruction (2026-08-02): all 19+ existing price tiers stay, none get merged
// or dropped. One large "featured tier" card up top (name, price, the full desc
// copy inline - no extra click into a modal needed to read it, delivery, output
// tags, buy/propose button) plus a filmstrip of small clickable tiles for that
// same product line's REMAINING tiers underneath - click a tile and its content
// swaps into the big slot. Same interaction as an old HTC BlinkFeed camera-widget
// carousel. One instance per product line, never mixing tiers across lines.
export function TierCarousel({ tiers, getActions }: {
  tiers: readonly CarouselTier[]
  getActions: (t: CarouselTier) => { onBuy?: () => void; onProposal?: () => void }
}) {
  const { t: locale } = useLocale()
  const defaultIdx = tiers.findIndex(t => t.highlight)
  const [idx, setIdx] = useState(defaultIdx === -1 ? 0 : defaultIdx)
  const active = tiers[idx]
  const actions = getActions(active)
  // Arrows cycle the FEATURED tier itself (wraparound through the full tier list),
  // not just scroll the filmstrip - live feedback: clicking an arrow should feel
  // like flipping through the tiers directly, the way a movie-preview carousel
  // advances the main frame, rather than only revealing more thumbnails to click.
  const cycle = (dir: 1 | -1) => setIdx(prev => (prev + dir + tiers.length) % tiers.length)
  // Filmstrip now shows ALL tiers, not just "the rest" - live feedback: excluding
  // the active tile meant the strip reshuffled every time you cycled, with no
  // fixed "you are here" position, which read as the preview not tracking the
  // arrows at all. Each tile stays in its permanent slot; only the highlight
  // moves, and the strip auto-scrolls the active tile into view.
  // inline: 'center' instead of 'nearest' - "nearest" is a no-op the moment a tile is even
  // partially visible, which on first mount (combined with the filmstrip's own overflow-x
  // container below) left the recommended tile sitting half-cropped behind the left edge of
  // the scroll container instead of fully in view (screenshot feedback 2026-08-05: "the
  // recommended is a half cut off card"). 'center' forces a real scroll on every idx change,
  // mount included, so the active tile is always fully visible.
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => {
    tileRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [idx])

  return (
    <div style={{ marginBottom: 0 }}>
      {/* Featured card - shrunk from maxWidth 760 (live feedback: too large relative
          to the filmstrip below it) so the two halves of the widget read as one
          balanced unit rather than one oversized card sitting over a thin strip. */}
      <motion.div key={active.tier} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
        style={{
          maxWidth: 560, margin: '0 auto 20px', borderRadius: 18, padding: '24px 26px',
          background: 'rgba(0,245,196,0.07)', border: '1px solid rgba(0,245,196,0.35)',
          boxShadow: '0 12px 40px rgba(0,245,196,0.1)',
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            {/* Label now says which tier this actually is, not just "you're looking
                at one" - live feedback: after clicking around, there was no cue left
                for which tier was originally recommended. */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: idx === defaultIdx ? TEAL : 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8, fontWeight: idx === defaultIdx ? 800 : 400, borderLeft: idx === defaultIdx ? `2px solid ${TEAL}` : 'none', paddingLeft: idx === defaultIdx ? 8 : 0 }}>
              {idx === defaultIdx ? locale.tierCarousel.recommendedTier : locale.tierCarousel.featuredTier}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', lineHeight: 1.25 }}>{active.tier}</div>
            {active.hook && <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6 }}>{active.hook}</div>}
          </div>
          <div style={{ fontSize: 21, fontWeight: 900, color: 'var(--accent-text)', whiteSpace: 'nowrap' }}>{active.price}</div>
        </div>
        {/* Capped height + scroll (live feedback: on the longer tiers - four full
            paragraphs - the card grew tall enough to push the Get Started button
            out of view without scrolling the whole page). Every card now has the
            same predictable height regardless of description length. */}
        <div style={{ marginTop: 16, maxHeight: 300, overflowY: 'auto' }}>
          {active.desc.split('\n\n').map((p, i) => (
            <p key={i} style={{ color: 'var(--text2)', fontSize: 13.5, lineHeight: 1.75, marginBottom: 11 }}>{p}</p>
          ))}
        </div>
        <OutputTags outputs={active.outputs} />
        {/* Delivery pill + CTA button now share one row (live feedback: the pill's
            monospace/uppercase styling read as a mismatched "code" font next to
            everything else, and the button sitting flush-left under it looked
            unbalanced) - pill in the normal body font on the left, button pinned
            bottom-right of the card. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
          {active.delivery ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,245,196,0.08)', border: '1px solid rgba(0,245,196,0.3)',
              borderRadius: 20, padding: '5px 12px',
              color: 'var(--accent-text)', fontSize: 12.5, fontWeight: 600,
            }}>
              <ClockIcon /> {active.delivery}
            </div>
          ) : <span />}
          {(actions.onBuy || actions.onProposal) && (
            <button
              onClick={actions.onBuy ?? actions.onProposal}
              style={{
                borderRadius: 8, cursor: 'pointer', padding: '12px 22px',
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 800,
                letterSpacing: '0.02em',
                background: actions.onBuy ? 'var(--accent)' : 'var(--bg3)',
                border: actions.onBuy ? 'none' : '1px solid var(--border)',
                color: actions.onBuy ? 'var(--accent-fg)' : 'var(--text)',
              }}
            >
              {actions.onBuy ? <CartIcon /> : <ArrowIcon />}
              {actions.onBuy ? locale.tierCarousel.getStarted : locale.tierCarousel.requestProposal}
            </button>
          )}
        </div>
      </motion.div>

      {/* Filmstrip - every tier gets a permanent slot (see note above); the
          active one is now visually highlighted (teal border+fill) so the strip
          always shows "you are here", whether you got there via the arrows or
          by clicking a tile directly. Centered when it doesn't fill the row. */}
      {tiers.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, maxWidth: 640, margin: '0 auto' }}>
          <button onClick={() => cycle(-1)} aria-label={locale.tierCarousel.prevTierAria} style={{
            flexShrink: 0, width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
            color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>&#8592;</button>
          {/* flex-start, not center: on an overflow-x container whose content is wider than
              the box, justifyContent: 'center' crops BOTH ends evenly in the initial paint -
              before the scrollIntoView above ever runs - so the featured tile came up half
              cut off. flex-start keeps the strip anchored and lets the scroll do the work. */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, scrollBehavior: 'smooth', justifyContent: 'flex-start' }}>
            {tiers.map((t, i) => (
              <button key={t.tier} ref={el => { tileRefs.current[i] = el }} onClick={() => setIdx(i)} style={{
                flexShrink: 0, minWidth: 140, textAlign: 'left', cursor: 'pointer',
                borderRadius: 10, padding: '10px 14px',
                background: i === idx ? 'rgba(0,245,196,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${i === idx ? TEAL : i === defaultIdx ? 'rgba(0,245,196,0.4)' : 'var(--border)'}`,
                transition: 'border-color .15s, background .15s',
              }}>
                {/* Marks the recommended tier even while it's not the active card,
                    so the cue survives clicking/cycling to other tiers. */}
                {i === defaultIdx && (
                  <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--accent-text)', letterSpacing: '0.05em', marginBottom: 3 }}>{locale.tierCarousel.recommendedBadge}</div>
                )}
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{t.tier}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-text)', marginTop: 4 }}>{t.price}</div>
              </button>
            ))}
          </div>
          <button onClick={() => cycle(1)} aria-label={locale.tierCarousel.nextTierAria} style={{
            flexShrink: 0, width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
            color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>&#8594;</button>
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
