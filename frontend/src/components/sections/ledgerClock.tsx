// Gemeinsame Sekundenuhr fuer das Evidence-Ledger (2026-10-31, Performance-Umbau).
//
// Vorher: PublicSite hielt `now` als State und gab es als Prop an TrackRecordSection. Jeder
// Sekundentakt renderte die ganze Seite und alle ~300 Ledger-Zeilen neu. Jetzt gibt es EINEN
// setInterval, der nur laeuft, solange mindestens ein Abonnent existiert und der Tab sichtbar
// ist. Nur die kleinen Komponenten unten (Countdown, Elapsed, DaysAgo, Battery) abonnieren ihn,
// die Ledger-Liste selbst rendert beim Takt nicht neu.
import { useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()
let current = Date.now()
let timer: number | undefined

function tick() {
  current = Date.now()
  listeners.forEach(l => l())
}
function startTimer() {
  if (timer !== undefined || typeof document === 'undefined' || document.hidden) return
  tick()
  timer = window.setInterval(tick, 1000)
}
function stopTimer() {
  if (timer !== undefined) { window.clearInterval(timer); timer = undefined }
}
function onVisibility() {
  if (listeners.size === 0) return
  if (document.hidden) stopTimer(); else startTimer()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  if (listeners.size === 1) {
    document.addEventListener('visibilitychange', onVisibility)
    startTimer()
  }
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0) {
      stopTimer()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }
}

/** Aktuelle Zeit in ms, gerundet auf `stepMs` (Standard 1 s). Rendert nur neu, wenn sich der gerundete Wert aendert. */
export function useNow(stepMs = 1000): number {
  const get = () => Math.floor(current / stepMs) * stepMs
  return useSyncExternalStore(subscribe, get, get)
}

const pad = (n: number) => String(n).padStart(2, '0')
const fmt = (ms: number) => {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return { d, text: `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s` }
}

const TEAL = '#00f5c4'

/** Restlaufzeit bis `target` (ms-Zeitstempel). `closedLabel` ersetzt den Text, wenn der Fall geschlossen ist. */
export function Countdown({ target, resolved, closedLabel, className }: {
  target: number; resolved: boolean; closedLabel: string; className: string
}) {
  const now = useNow(1000)
  const { d, text } = fmt(Math.max(0, target - now))
  const color = resolved || d > 60 ? TEAL : d > 30 ? '#fb923c' : '#f87171'
  return <div className={className} style={{ color }}>{resolved ? closedLabel : text}</div>
}

/** Verstrichene Zeit seit `from`; bei geloesten Faellen bis `until`, sonst bis jetzt. */
export function Elapsed({ from, until, resolved, className }: {
  from: number | null; until: number | null; resolved: boolean; className: string
}) {
  const now = useNow(1000)
  if (!from) return <div className={className} style={{ color: resolved ? '#4ade80' : TEAL }}>-</div>
  const end = resolved && until ? until : now
  const { d, text } = fmt(Math.max(0, end - from))
  const color = resolved ? '#4ade80' : d > 60 ? '#f87171' : d > 30 ? '#fb923c' : TEAL
  return <div className={className} style={{ color }}>{text}</div>
}

/** "heute" / "vor N Tagen" - aendert sich nur an Tagesgrenzen, daher Minutentakt. */
export function DaysAgo({ from, until, resolved, todayLabel, daysAgo, className }: {
  from: number; until: number | null; resolved: boolean
  todayLabel: string; daysAgo: (n: number) => string; className: string
}) {
  const now = useNow(60000)
  const end = resolved && until ? until : now
  const d = Math.floor(Math.max(0, end - from) / 86400000)
  return <div className={className}>{d === 0 ? todayLabel : daysAgo(d)}</div>
}

/** Embargo-Balken oben an der Zeile. Aenderung ist langsam, Minutentakt reicht. */
export function Battery({ notified, disclosure, resolved }: {
  notified: number | null; disclosure: number; resolved: boolean
}) {
  const now = useNow(60000)
  const total = notified ? disclosure - notified : 90 * 86400000
  const pct = notified ? Math.max(0, Math.min(1, (disclosure - now) / total)) : 1
  const c = pct > 0.66 ? '#4ade80' : pct > 0.33 ? '#fb923c' : '#f87171'
  return (
    <div className="rfi-ledger-bat">
      {/* scaleX statt width: compositor-only, kein Layout pro Zeile */}
      <div className="rfi-ledger-bat-fill" style={{
        transform: `scaleX(${resolved ? 1 : pct})`,
        background: resolved ? 'linear-gradient(90deg, rgba(0,245,196,0.55), #00f5c4)' : `linear-gradient(90deg, ${c}55, ${c})`,
      }} />
    </div>
  )
}
