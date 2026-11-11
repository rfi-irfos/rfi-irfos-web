import { useEffect, useRef } from 'react'

// Own page scrollbar (Simeon 11.11.2026). The native one is hidden in App.css, because every modal that
// sets body overflow to hidden made it vanish, and the page jumped sideways by its width on every open and
// close. This thumb is a fixed overlay, so it takes no layout width and nothing shifts. It follows the
// window scroll, can be dragged, and a click on the track jumps there. Only for mouse pointers; touch
// devices keep their own overlay scrollbar (see the media query in App.css).

const MIN_THUMB = 44

export function PageScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track || !thumb) return
    let frame = 0
    let hideTimer = 0

    const metrics = () => {
      const doc = document.documentElement
      const view = window.innerHeight
      const total = doc.scrollHeight
      const thumbH = Math.max(MIN_THUMB, (view * view) / total)
      return { view, total, thumbH, range: Math.max(1, total - view), travel: Math.max(1, view - thumbH) }
    }

    const draw = () => {
      frame = 0
      const m = metrics()
      track.classList.toggle('is-hidden', m.total <= m.view + 1)
      if (m.total <= m.view + 1) return
      thumb.style.height = `${m.thumbH}px`
      thumb.style.transform = `translateY(${(window.scrollY / m.range) * m.travel}px)`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw) }

    // The thumb is faint at rest and shows fully while the page moves or the pointer is near.
    const wake = () => {
      track.classList.add('is-active')
      window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => track.classList.remove('is-active'), 1100)
    }
    const onScroll = () => { schedule(); wake() }

    let dragStartY = 0
    let dragStartScroll = 0
    const onThumbDown = (e: PointerEvent) => {
      e.preventDefault()
      thumb.setPointerCapture(e.pointerId)
      dragStartY = e.clientY
      dragStartScroll = window.scrollY
      track.classList.add('is-dragging')
    }
    const onThumbMove = (e: PointerEvent) => {
      if (!thumb.hasPointerCapture(e.pointerId)) return
      const m = metrics()
      window.scrollTo({ top: dragStartScroll + ((e.clientY - dragStartY) / m.travel) * m.range, behavior: 'instant' })
    }
    const onThumbUp = (e: PointerEvent) => {
      if (thumb.hasPointerCapture(e.pointerId)) thumb.releasePointerCapture(e.pointerId)
      track.classList.remove('is-dragging')
    }
    const onTrackDown = (e: PointerEvent) => {
      if (e.target !== track) return
      const m = metrics()
      const ratio = (e.clientY - m.thumbH / 2) / m.travel
      window.scrollTo({ top: Math.min(1, Math.max(0, ratio)) * m.range, behavior: 'smooth' })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', schedule)
    // Page height changes when sections load or accordions open, so the thumb follows the body size too.
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    thumb.addEventListener('pointerdown', onThumbDown)
    thumb.addEventListener('pointermove', onThumbMove)
    thumb.addEventListener('pointerup', onThumbUp)
    thumb.addEventListener('pointercancel', onThumbUp)
    track.addEventListener('pointerdown', onTrackDown)
    draw()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
      thumb.removeEventListener('pointerdown', onThumbDown)
      thumb.removeEventListener('pointermove', onThumbMove)
      thumb.removeEventListener('pointerup', onThumbUp)
      thumb.removeEventListener('pointercancel', onThumbUp)
      track.removeEventListener('pointerdown', onTrackDown)
      cancelAnimationFrame(frame)
      window.clearTimeout(hideTimer)
    }
  }, [])

  return (
    <div ref={trackRef} className="rfi-scrollbar" aria-hidden="true" data-testid="page-scrollbar">
      <div ref={thumbRef} className="rfi-scrollbar-thumb" />
    </div>
  )
}
