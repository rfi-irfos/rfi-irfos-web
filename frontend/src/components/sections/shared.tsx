// Shared primitives used across multiple homepage sections (and by PublicSite.tsx
// itself for the nav/modals/footer) - extracted verbatim from the former single
// ~5600-line PublicSite.tsx as a pure refactor (no copy/style/behavior changes).
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { IconMaximize } from '@tabler/icons-react'
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
// Web3Forms explicitly designs this as a client-side key ("safely use it in client side
// code" per their own dashboard) - their free tier rejects server-to-server submissions
// outright, so this fallback has to run in the browser, not proxied through our backend.
export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Lighthouse round 24 (2026-10-31): main.tsx uses createRoot, which throws away the
// prerendered snapshot and mounts fresh nodes. Any above-the-fold entrance animation
// then hides text that was already on screen, and the phone only counts it as painted
// once the JS has loaded and the fade has run (mobile LCP 11 s, desktop 2 s). True when
// #root still held the snapshot at module load (evaluated before createRoot renders),
// or when prerender.mjs itself is capturing, so the snapshot shows the final state.
export const SKIP_FIRST_PAINT_ANIMATION = typeof document !== 'undefined' &&
  (navigator.webdriver || !!document.getElementById('root')?.firstElementChild)

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
          borderRadius: 8, padding: '12px 16px', color: selected ? 'var(--text)' : 'var(--text3)', fontSize: 'var(--fs-body)',
          fontFamily: 'inherit', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
        }}>
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{ fontSize: 'var(--fs-label)', opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}>▾</span>
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
                padding: '10px 12px', borderRadius: 8, fontSize: 'var(--fs-body)', cursor: 'pointer',
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

// Delays a modal/overlay's actual unmount so its CSS exit animation (the
// "-out" class variant, see index.css .rfi-modal-backdrop-out/-panel-out) has
// time to play (animation audit 2026-09-13: every modal on the site - report
// PDF, intel article, checkout, system card - animated IN via CSS keyframes
// but vanished INSTANTLY on close, no exit at all). Wraps the read side only:
// callers keep calling their existing setXModal(null) exactly as before, this
// just keeps rendering the last non-null value for `exitMs` longer and
// exposes `closing` so the caller can swap in the "-out" class during that
// window. No change needed anywhere a modal is opened or closed, including
// child components that call the raw setter directly.
export function useModalExit<T>(value: T | null, exitMs = 220) {
  const [rendered, setRendered] = useState(value)
  const [closing, setClosing] = useState(false)
  useEffect(() => {
    if (value !== null) {
      setRendered(value)
      setClosing(false)
      return
    }
    if (rendered === null) return
    setClosing(true)
    const t = setTimeout(() => { setRendered(null); setClosing(false) }, exitMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally
    // excludes `rendered`, which this effect itself sets; including it would
    // re-fire the exit timer on every render while closing.
  }, [value, exitMs])
  return { rendered, closing }
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
// immediately, no counting). The prerender (Playwright, navigator.webdriver) also gets
// the final value: Lighthouse round 47 found /evidence/ shipped mid-animation snapshots
// (367+ EN, 224+ DE instead of 387+) to crawlers and no-JS readers.
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const target = parseInt(value, 10)
  const suffix = value.replace(/^-?\d+/, '')
  const still = prefersReducedMotion() || navigator.webdriver || isNaN(target)
  const [display, setDisplay] = useState(still ? target : 0)
  useEffect(() => {
    if (still) return
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
  }, [target, still])
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
    // Baseline anchor (live feedback 2026-10-24, round 2: vertical-align: baseline
    // alone didn't fix it - "its still lower"). Root cause: all `.flip-char` letters
    // are position: absolute (index.css), so el has NO in-flow content once
    // textContent was cleared above - per CSS2.1 10.8.1, an inline-block with no
    // in-flow line boxes takes its BASELINE from its bottom margin edge, same as
    // vertical-align: bottom regardless of what vertical-align is set to. This
    // invisible (but still in-flow, still laid out) copy of the word gives el a
    // real line box to take its baseline from, matching RevealWords' sibling spans
    // next to it ("the Obvious.") which get theirs from their own normal text.
    const ghost = document.createElement('span')
    // Kein Textknoten (siehe .flip-ghost in index.css, 2026-10-31): sonst steht das Wort doppelt im DOM
    // und die h1 der Startseite lautet im Prerender "RethinkRethink the Obvious.".
    ghost.className = 'flip-ghost'
    ghost.setAttribute('data-word', word)
    ghost.setAttribute('aria-hidden', 'true')
    el.appendChild(ghost)
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
      // verticalAlign: baseline (not bottom, live feedback 2026-10-24: "the rethink
      // is not on the same height" / "it sits lower, definitely") - this span's
      // height is set below to the plain word's measured line-box height (ascent +
      // leading, no descender reserve for a word with no descenders like "Rethink").
      // `bottom` anchors that box's bottom edge to the whole line's bottom, which
      // includes descender space the box itself doesn't have, pushing the visible
      // glyphs down relative to RevealWords' sibling spans (the default `baseline`,
      // unset there) by roughly that descender gap. `baseline` matches them.
      style={{ display: 'inline-block', position: 'relative', verticalAlign: 'baseline' }}
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

// Hero film panel shared by Squad and World Model (2026-10-26): a muted 16:9
// loop, and a click on the panel puts the video element itself into the
// browser's fullscreen (Simeon: "zeigen das video in fullscreen ... gleich bei
// squad auch"). iOS Safari has no element requestFullscreen for <video>, only
// its own webkitEnterFullscreen, hence the fallback.
// Fullscreen plays from the start with sound and native controls; the click is
// the user gesture browsers require for unmuted playback. Leaving fullscreen
// returns to the silent hero loop (Simeon 2026-10-26: "mit Ton abspielen").
// 2026-10-31 (Lighthouse round 18): the two product films had no VideoObject, so
// Google could not list them as video results. `video` adds one, with a
// stable thumbnail in public/media/ (the hashed /assets/ mp4 URL is fine as
// contentUrl, it is rebuilt with every deploy together with this markup).
export type FilmMeta = { name: string; description: string; thumbnail: string; uploadDate: string; duration: string }

// watchHref (Lighthouse R88, 2026-10-31): Search Console reported the films as "Video isn't on a
// watch page". Each film now has its own static watch page (public/<route>/film/). Google finds it
// through the video sitemap; the visible "Watch the film with controls" link below the panel was
// removed on 31.10. (Simeon: leads visitors to a page that does not fit the site).
export function FilmPanel({ src, className, video }: { src: string; className: string; video?: FilmMeta; watchHref?: string }) {
  const { locale } = useLocale()
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const toLoop = () => {
      if (document.fullscreenElement === video) return
      video.muted = true
      video.controls = false
      video.play().catch(() => {})
    }
    document.addEventListener('fullscreenchange', toLoop)
    video.addEventListener('webkitendfullscreen', toLoop)
    return () => {
      document.removeEventListener('fullscreenchange', toLoop)
      video.removeEventListener('webkitendfullscreen', toLoop)
    }
  }, [])
  const openFullscreen = () => {
    const video = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!video) return
    video.currentTime = 0
    video.muted = false
    video.controls = true
    video.play().catch(() => {})
    if (video.requestFullscreen) video.requestFullscreen().catch(() => {})
    else video.webkitEnterFullscreen?.()
  }
  return (
    <>
    <button type="button" className={`${className} film-panel`} onClick={openFullscreen}
      aria-label={locale === 'de' ? 'Film im Vollbild ansehen' : 'View film fullscreen'}>
      <video ref={ref} className="film-panel-video" src={src} autoPlay muted loop playsInline title={video?.name} />
      <span className="wm-graph-expand-hint"><IconMaximize size={13} stroke={1.8} /> {locale === 'de' ? 'Vollbild' : 'view fullscreen'}</span>
      {video && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'VideoObject',
          name: video.name, description: video.description,
          thumbnailUrl: `https://rfi-irfos.com${video.thumbnail}`,
          contentUrl: new URL(src, 'https://rfi-irfos.com').href,
          uploadDate: video.uploadDate, duration: video.duration, inLanguage: locale,
          publisher: { '@id': 'https://rfi-irfos.com/#organization' },
        }) }} />
      )}
    </button>
    </>
  )
}

// History of this function (why it's no longer a continuous scroll-position
// tween): v1 computed opacity as a pure function of CURRENT scroll position
// with no settle zone - could leave content stuck invisible depending on
// scroll direction (2026-08-05). v2 was a one-shot IntersectionObserver (fixed
// v1, but never reverted once revealed). v3 (2026-08-06) made it bidirectional
// via a fixed-duration CSS transition on a threshold crossing - rejected the
// same day for reading as a "snap" instead of tracking scroll continuously
// ("diese reinfliegen muss nich animiert sein sondern vom scroll abhangig
// sein"), replaced by v4: Framer's useScroll/useTransform driving opacity and
// transform directly off live scroll position, no transition at all. v4 fixed
// the "snap" complaint, but turned out to be the wrong trade - four months of
// recurring live bugs chasing a settle formula that had to be correct for
// every element height, every nesting depth, and every platform's scroll
// quirks at once: wrong settle zone for tall/short/nested elements (multiple
// rounds, 08-14 through 10-24), then mobile jank from reading layout
// properties on every scroll frame, then mobile's address bar resizing the
// viewport DURING scroll and moving the settle line out from under the
// animation while it played. Simeon, 2026-10-24, after that last round:
// "that every single element is flying in or out... is an impossible task to
// actually get it right across all the platforms... better to have a normal
// scroll reveal." This is v5 - back to v3's IntersectionObserver-plus-CSS-
// transition shape. The "snap" v3 was rejected for is the point now: a short
// fixed-duration transition triggered by a threshold crossing has a small,
// enumerable surface (one rootMargin, one duration, one easing curve) instead
// of a settle formula that has to hold for every element against every
// browser's live viewport behavior - correct-by-construction instead of
// correct-by-increasingly-specific-correction.
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
  // Lazy useState initializer, not a ref read during render (that's flagged
  // by this project's react-hooks lint rule, and was the exact class of bug
  // ScrambleHeading's own history already hit once): computed once at mount,
  // never again. Reduced-motion users and an in-flight anchor-nav jump
  // (PublicSite.tsx sets this during the jump, see revealSuppressed above)
  // both render fully visible immediately, no transition, no observer needed.
  const [skip] = useState(() => prefersReducedMotion() || revealSuppressed.current)
  const [visible, setVisible] = useState(skip)
  // Which side of the viewport the element last sat on while hidden (null
  // only before the observer's first report). A ref, not state: it only
  // matters at the moment `visible` flips, and must not itself schedule
  // renders mid-scroll.
  const exitSide = useRef<'top' | 'bottom' | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || skip) return
    // rootMargin shrinks the box IntersectionObserver tests intersection
    // against: -10% at the bottom means "visible" only once the element is
    // already 10% of the viewport up from the bottom edge (comfortably on
    // screen, not right at the clipping edge, before the eye could rest on
    // it); -8% at the top means it goes invisible again slightly before it
    // would be clipped under the fixed nav, rather than exactly at the clip
    // line. Not latched - isIntersecting toggles both ways, so scrolling back
    // up past an element hides it again, same as scrolling down past it:
    // "coming in as you scroll down... disappear again as you scroll up."
    // Debounced, not applied straight from the callback (live bug report,
    // 2026-10-24: the pricing page's billing toggle sits right under the
    // fixed nav once scrolled, exactly where the -8% top margin above puts
    // the exit boundary - an element resting there crosses that single-pixel
    // line back and forth on ordinary scroll-momentum jitter, and each
    // crossing restarted this element's CSS transition mid-flight, reading
    // as a visible shake). Collapsing a burst of crossings into the state
    // that's still current 80ms after the last one keeps the intended
    // scroll-past show/hide (still fires, just once scroll actually settles
    // past the line) while killing the flicker - confirmed via a scripted
    // reproduction oscillating 1px across this exact boundary before this
    // fix (toggled) and after (didn't).
    let debounce: number | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting
        // Second half of the same 2026-10-24 bug class, found the next day at
        // other boundary-resting elements (World Model page): the debounce
        // stops transition RESTARTS, but the hide transition itself could
        // still re-cross the boundary it was reacting to - from="bottom"'s
        // hide slides the element downward, back toward the visible zone,
        // when it exited at the TOP edge (and the pricing page's from="top"
        // patch mirrored the same loop at the bottom edge). Record which
        // boundary the element left through, and let the hidden transform
        // slide AWAY from that boundary regardless of `from`, so the hide
        // motion reinforces the crossing instead of undoing it. This also
        // fires on the initial observation (element starts below the fold ->
        // 'bottom'), so the rule is uniform: a hidden element always sits
        // displaced AWAY from the viewport, and `from` is only the fallback
        // for the vertical variants before the observer has ever reported.
        if (!next) {
          const r = entry.boundingClientRect
          const mid = entry.rootBounds
            ? entry.rootBounds.top + entry.rootBounds.height / 2
            : window.innerHeight / 2
          exitSide.current = r.top + r.height / 2 < mid ? 'top' : 'bottom'
        }
        window.clearTimeout(debounce)
        debounce = window.setTimeout(() => setVisible(next), 80)
      },
      { rootMargin: '-8% 0px -10% 0px', threshold: 0 },
    )
    observer.observe(el)
    // Anchor-nav jump (PublicSite.tsx dispatches this at the moment of the
    // click, see revealSuppressed above): force visible immediately rather
    // than waiting for the observer to catch up with the programmatic scroll.
    const onJump = () => { window.clearTimeout(debounce); setVisible(true) }
    const section = el.closest('.rfi-view-panel') ?? el.closest('section')
    section?.addEventListener('rfi-nav-jump', onJump)
    return () => {
      window.clearTimeout(debounce)
      observer.disconnect()
      section?.removeEventListener('rfi-nav-jump', onJump)
    }
  }, [skip])
  const computeTransform = (shown: boolean) => {
    const d = shown ? 0 : dist
    // Hidden vertical movement must point away from the boundary the element
    // exited through (see the observer callback above). Horizontal variants
    // can't re-cross a horizontal scroll boundary, so they keep `from`; the
    // vertical and scale variants defer to the recorded exit side once known.
    if (!shown && exitSide.current && (from === 'bottom' || from === 'top' || from === 'scale')) {
      return `translateY(${exitSide.current === 'top' ? -d : d}px)`
    }
    if (from === 'left')  return `translateX(${-d}px)`
    if (from === 'right') return `translateX(${d}px)`
    if (from === 'top')   return `translateY(${-d}px)`
    if (from === 'scale') return `scale(${shown ? 1 : 0.92})`
    return `translateY(${d}px)`
  }
  // `delay` is used across the site as a small stagger index (0/1/2/3, or a
  // grid's `i`), never a literal second count - capped the same way the old
  // settle-offset was, so no call site's range can produce an absurd wait.
  const transitionDelay = `${Math.min(0.4, delay * 0.06)}s`
  return (
    <div
      ref={ref}
      style={{
        opacity: skip || visible ? 1 : 0,
        transform: skip ? 'none' : computeTransform(visible),
        transition: skip ? 'none' : `opacity 0.6s ease ${transitionDelay}, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${transitionDelay}`,
        willChange: 'transform, opacity',
        ...extra,
      }}
    >
      {children}
    </div>
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
                fontSize: large ? 'var(--fs-body)' : 'var(--fs-label)', fontWeight: large ? 700 : 700,
                color: 'var(--accent-text)', marginBottom: 6,
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
                  <p key={i} style={{ margin: 0, fontSize: large ? 'var(--fs-small)' : 'var(--fs-small)', lineHeight: large ? 'var(--lh-body)' : 'var(--lh-body)', color: 'var(--text)' }}>{p}</p>
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
        fontSize: 'var(--fs-label)', fontWeight: 700,
        color: TEAL, marginBottom: 12,
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
                    fontWeight: 700, fontSize: font,
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
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', color: 'var(--text)' }}>
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
        <h3 style={{ fontSize: mobile ? 'var(--fs-h3)' : 'var(--fs-h2)', fontWeight: 700, color: 'var(--text)', lineHeight: 'var(--lh-tight)', margin: 0 }}>{tier}</h3>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0, color: '#8a8aa0', fontSize: 'var(--fs-small)' }}>
          <ClockIcon /> {t.modalTierBody.inTouchWithin12h}
        </div>
      </div>
      {body.length > 0 && (
        <div style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', marginBottom: 12 }}>
          {t.modalTierBody.whatYouGet}
        </div>
      )}
      {body.map((para, pi) => (
        <p key={pi} style={{ color: '#e8e8f0', fontSize: mobile ? 'var(--fs-body)' : 'var(--fs-lead)', lineHeight: 'var(--lh-body)', margin: 0, marginBottom: 18 }}>{para}</p>
      ))}
      {body.length > 0 && <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '2px 0 18px' }} />}
      {punchline && (
        body.length > 0 ? (
          <p style={{
            color: 'var(--text)', fontSize: mobile ? 'var(--fs-body)' : 'var(--fs-lead)', fontWeight: 700, lineHeight: 'var(--lh-body)',
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
            color: '#8a8aa0', fontSize: mobile ? 'var(--fs-small)' : 'var(--fs-body)', fontWeight: 400, lineHeight: 'var(--lh-body)',
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
  // keepalive (Lighthouse round 26, 2026-10-31): offer_attempt fires right before the
  // redirect to Stripe and mobile_menu_free_check right before a page load; without it
  // the browser aborts the request on navigation (seen live as net::ERR_ABORTED), so the
  // funnel's most important step went missing exactly when it happened.
  fetch(LIGHTHOUSE_BEACON, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
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


// The whole site renders under `html { zoom: 0.9 }` (index.css). Viewport APIs
// (getBoundingClientRect, clientX, innerWidth) report screen px, while position:fixed
// and inline px lay out in zoomed units - divide screen px by this to convert.
export function pageZoom(): number {
  if (typeof document === 'undefined') return 1
  return parseFloat(getComputedStyle(document.documentElement).zoom) || 1
}
