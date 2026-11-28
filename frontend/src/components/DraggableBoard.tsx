// Remediation board on the service pages, now draggable like the board in the portal (Simeon 28.11.2026:
// "so drag und dropable wie die eigentliche remediation pipeline"). Pure client state: nothing is saved,
// a reload shows the example again. Pointer events cover mouse, pen and touch; the arrow keys move a
// focused card between columns. Cards that change place glide there (FLIP), the dragged card lifts.
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { severityLabel } from './serviceShowcase'
import type { LandingLocale } from './landingPages'

type Severity = 'critical' | 'high' | 'medium' | 'low'
type Card = { id: string; sev: Severity; title: string; where: string }
type Column = { column: string; cards: Card[] }
type Drag = { id: string; from: number; dx: number; dy: number; ox: number; oy: number; target: number; index: number }

const fromDoc = (board: { column: string; cards: [Severity, string, string][] }[]): Column[] =>
  board.map((col, c) => ({ column: col.column, cards: col.cards.map(([sev, title, where], i) => ({ id: `${c}-${i}-${title}`, sev, title, where })) }))

export function DraggableBoard({ board, locale, tag }: { board: { column: string; cards: [Severity, string, string][] }[]; locale: LandingLocale; tag: string }) {
  const [cols, setCols] = useState<Column[]>(() => fromDoc(board))
  const [drag, setDrag] = useState<Drag | null>(null)
  const colRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs = useRef(new Map<string, HTMLDivElement>())
  const before = useRef(new Map<string, DOMRect>())
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  // FLIP: after a move, every card that changed place starts at its old spot and glides to the new one.
  useLayoutEffect(() => {
    if (!before.current.size || reduced) { before.current.clear(); return }
    cardRefs.current.forEach((el, id) => {
      const old = before.current.get(id); if (!old) return
      const now = el.getBoundingClientRect(), dx = old.left - now.left, dy = old.top - now.top
      if (!dx && !dy) return
      // the CSS transform transition would outrank the animation, so it pauses while the card glides home
      el.style.transition = 'box-shadow .25s ease'
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' })
        .finished.finally(() => { el.style.transition = '' })
    })
    before.current.clear()
  }, [cols, reduced])

  const snapshot = () => { cardRefs.current.forEach((el, id) => before.current.set(id, el.getBoundingClientRect())) }
  const move = (id: string, to: number, index: number) => setCols(prev => {
    const next = prev.map(c => ({ ...c, cards: c.cards.filter(card => card.id !== id) }))
    const card = prev.flatMap(c => c.cards).find(c => c.id === id); if (!card) return prev
    next[to].cards.splice(Math.min(index, next[to].cards.length), 0, card)
    return next
  })

  // Where would the card land: the column under the pointer, before the first card whose middle is lower.
  const targetAt = (x: number, y: number, id: string, fallback: number): [number, number] => {
    let col = fallback
    colRefs.current.forEach((el, i) => { if (!el) return; const r = el.getBoundingClientRect(); if (x >= r.left && x <= r.right && y >= r.top - 40 && y <= r.bottom + 40) col = i })
    const others = cols[col].cards.filter(c => c.id !== id)
    const index = others.findIndex(c => { const r = cardRefs.current.get(c.id)?.getBoundingClientRect(); return r ? y < r.top + r.height / 2 : false })
    return [col, index < 0 ? others.length : index]
  }

  const onDown = (e: ReactPointerEvent<HTMLDivElement>, id: string, from: number) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ id, from, dx: 0, dy: 0, ox: e.clientX, oy: e.clientY, target: from, index: cols[from].cards.findIndex(c => c.id === id) })
  }
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag) return
    const [target, index] = targetAt(e.clientX, e.clientY, drag.id, drag.target)
    setDrag({ ...drag, dx: e.clientX - drag.ox, dy: e.clientY - drag.oy, target, index })
  }
  const onUp = () => {
    if (!drag) return
    const { id, target, index, dx, dy } = drag
    setDrag(null)
    if (Math.abs(dx) + Math.abs(dy) < 4) return
    snapshot()
    // The dragged card glides from where it was let go. Its rect still carries the drag transform, and rotate
    // and scale keep the centre in place, so the centre gives the drop point without counting the offset twice.
    const el = cardRefs.current.get(id)
    if (el) { const r = el.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight; before.current.set(id, new DOMRect(r.left + r.width / 2 - w / 2, r.top + r.height / 2 - h / 2, w, h)) }
    move(id, target, index)
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>, id: string, from: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const to = Math.max(0, Math.min(cols.length - 1, from + step)); if (to === from) return
    e.preventDefault(); snapshot(); move(id, to, cols[to].cards.length)
    requestAnimationFrame(() => cardRefs.current.get(id)?.focus())
  }

  const hint = locale === 'de' ? 'Karten ziehen' : 'Drag the cards'
  return <div className={`svc-board rfi-glass-flat rfi-glass-solid${drag ? ' is-dragging' : ''}`}>
    <div className="svc-board-bar"><strong>Remediation</strong><span>{tag} · {hint}</span></div>
    <div className="svc-board-cols">{cols.map((col, c) => {
      const counting = drag && drag.target !== drag.from ? col.cards.length + (drag.target === c ? 1 : 0) - (drag.from === c ? 1 : 0) : col.cards.length
      return <div key={col.column} ref={el => { colRefs.current[c] = el }} className={`svc-board-col${drag && drag.target === c ? ' is-target' : ''}`} role="list" aria-label={col.column}>
        <div className="svc-board-colhead">{col.column}<em>{counting}</em></div>
        {col.cards.map(card => {
          const lifted = drag?.id === card.id
          return <div key={card.id} ref={el => { if (el) cardRefs.current.set(card.id, el); else cardRefs.current.delete(card.id) }}
            className={`svc-board-card${lifted ? ' is-lifted' : ''}`} role="listitem" tabIndex={0}
            aria-label={`${severityLabel(locale, card.sev)}: ${card.title}, ${col.column}`}
            style={lifted ? { transform: `translate(${drag!.dx}px, ${drag!.dy}px) rotate(-1.5deg) scale(1.03)` } : undefined}
            onPointerDown={e => onDown(e, card.id, c)} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
            onKeyDown={e => onKey(e, card.id, c)}>
            <span className={`svc-sev svc-sev--${card.sev}`}>{severityLabel(locale, card.sev)}</span>
            <strong>{card.title}</strong>
            <code>{card.where}</code>
          </div>
        })}
      </div>
    })}</div>
  </div>
}
