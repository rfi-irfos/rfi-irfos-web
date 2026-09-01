// "World Model" page (`#world-model`, nav slot between Systems and Data
// Solutions). DINGIR's own showcase: what it is, real corpus/graph numbers
// (see content/en.ts+de.ts `worldModel.stats` for sourcing notes), the LM vs.
// agent vs. world-model distinction, five causality-chain examples paired
// with a live-events feed, business use cases, and an early-access signup.
// The full 20-chain carousel (CausalChainsSection, ex-homepage widget) was
// tried on this page and pulled again (live feedback 2026-08-31:
// "overstimulates ppl") - this compact five-chain view is the only
// causality-chain presence here now, not a preview of something bigger.
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type WheelEvent as ReactWheelEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  IconActivity, IconAlertTriangle, IconBroadcast, IconBug, IconBuildingSkyscraper, IconChartLine,
  IconChevronLeft, IconChevronRight,
  IconCircleCheck, IconCloudRain, IconFlag, IconFlame, IconFlask, IconMail,
  IconMessage2, IconMountain, IconRobot, IconRoute, IconShieldLock, IconShip, IconSnowflake, IconTrain,
  IconWorld, IconX,
} from '@tabler/icons-react'
import { Reveal, OUTPUT_TAG_HUES, beacon } from './shared'
import { HeroSlideshow } from './Hero'
import { useLocale } from '../../hooks/useLocale'
// Real DINGIR interface screenshots, own set (added 2026-09-01, replacing the
// shared HERO_IMAGES import) - live feedback: the main homepage hero's photo
// set "passt nich" here, this page gets its own fresh screenshots rather than
// borrowing the main hero's. Keep these two pools independent going forward,
// don't re-merge them even if the counts happen to be similar later.
import wmHeroGlobeOverview from '../../assets/world-model/wm-hero-globe-overview.png'
import wmHeroBuoyDetail from '../../assets/world-model/wm-hero-buoy-detail.png'
import wmHeroReasoningSanctions from '../../assets/world-model/wm-hero-reasoning-sanctions.png'
import wmHeroEarthquakeDetail from '../../assets/world-model/wm-hero-earthquake-detail.png'
import wmHeroLiveCamera from '../../assets/world-model/wm-hero-live-camera.png'
import wmHeroTrafficIncident from '../../assets/world-model/wm-hero-traffic-incident.png'
import wmHeroFireDetection from '../../assets/world-model/wm-hero-fire-detection.png'
import wmHeroInfrastructureWeather from '../../assets/world-model/wm-hero-infrastructure-weather.png'
import wmHeroGraphFlood from '../../assets/world-model/wm-hero-graph-flood.png'
import wmHeroAircraftDetail from '../../assets/world-model/wm-hero-aircraft-detail.png'
import wmHeroStormDetail from '../../assets/world-model/wm-hero-storm-detail.png'
import wmHeroChatAnalyst from '../../assets/world-model/wm-hero-chat-analyst.png'

const WORLD_MODEL_HERO_IMAGES = [
  wmHeroGlobeOverview, wmHeroBuoyDetail, wmHeroReasoningSanctions, wmHeroEarthquakeDetail,
  wmHeroLiveCamera, wmHeroTrafficIncident, wmHeroFireDetection, wmHeroInfrastructureWeather,
  wmHeroGraphFlood, wmHeroAircraftDetail, wmHeroStormDetail, wmHeroChatAnalyst,
]

const hue = (i: number) => OUTPUT_TAG_HUES[i % OUTPUT_TAG_HUES.length]
const hueStyle = (i: number) => ({ '--hue-bg': hue(i).bg, '--hue-border': hue(i).border }) as CSSProperties
const HUE_MAIN = hueStyle(0) // teal, the whole page is one topic - see DataSolutions.tsx's own comment on why hue is per-section not per-card

// Same small pointer-spotlight hook DataSolutions.tsx defines locally for its
// own grids - kept local here too rather than lifted into shared.tsx, since
// exactly two files need it and both already own their copy independently.
function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const onMouseMove = (event: ReactMouseEvent<T>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }
  return { ref, onMouseMove }
}

type FeedEntry = { id: string; kind: string; title: string; time: string; detail?: string }

// Each category gets its own icon AND its own color (live feedback: uniform
// teal icons "read as one thing" - a scanning eye needs color to tell seismic
// from maritime from infrastructure at a glance, the way a real ops feed does).
// security/cyber/fire added 2026-09-01, ANOMALY/HUB/PREDICTION/CHANGE removed
// same day - the relay first shipped bi_api's /reasoning/feed (graph-internal
// entries like "SANCTIONED:NK-RKmRD2fUstkjpbfmxVoNg4 --SANCTIONED_UNDER?->
// PROGRAM:US-RUSHAR"), which read as pure jargon (live feedback: "das sagt
// mir genau gar nichts... war eig besser als beim livestream globale
// echtzeitwarnungen drinnen standen nich das reasoning"). worldmodel_feed_
// relay.py now reads world_model/datasets/live/{earthquakes,weather_events,
// conflicts,cyber_attacks,fires} directly instead - real event data with a
// place name and a magnitude, not a graph node ID.
const FEED_META: Record<string, { icon: typeof IconActivity; color: string }> = {
  seismic:        { icon: IconActivity,   color: '#ff6b5e' },
  weather:        { icon: IconCloudRain,  color: '#ffa94d' },
  maritime:       { icon: IconShip,       color: '#4dabf7' },
  infrastructure: { icon: IconTrain,      color: '#94a3b8' },
  model:          { icon: IconBroadcast,  color: 'var(--accent)' },
  security:       { icon: IconShieldLock, color: '#c77dff' },
  cyber:          { icon: IconBug,        color: '#ff6b5e' },
  fire:           { icon: IconFlame,      color: '#ff922b' },
}

// Illustrative fallback, shown only when GET /api/worldmodel-feed is unreachable
// (e.g. plain `vite dev` with no backend/proxy running) or hasn't shipped real
// entries yet. The live-status dot and heading both switch to an explicit
// "example data" state whenever this path is the one actually rendering, so a
// visitor is never shown a placeholder disguised as a live feed.
const FEED_FALLBACK: FeedEntry[] = [
  { id: 'ex-1', kind: 'seismic', title: 'M4.8 aftershock, Sumatra region', time: '07:24 UTC', detail: 'Aftershock probability updated continuously via the Omori-Utsu model against the USGS earthquake feed.' },
  { id: 'ex-2', kind: 'weather', title: 'Heavy rainfall system, Southeast Asia', time: '07:18 UTC', detail: 'Precipitation intensity cross-checked against the affected region\'s historical flood threshold.' },
  { id: 'ex-3', kind: 'maritime', title: 'Vessel reroute, Strait of Hormuz', time: '07:16 UTC', detail: 'AIS position change flagged against the shipping-lane baseline for this route.' },
  { id: 'ex-4', kind: 'infrastructure', title: 'Rail delay cluster, DB network', time: '07:11 UTC', detail: 'Multiple correlated delays on the same line segment within a short window.' },
  { id: 'ex-5', kind: 'model', title: 'Checkpoint evaluated, AUC 0.769', time: '06:58 UTC', detail: 'Nightly retraining run scored against the held-out validation split before acceptance.' },
]

function FeedDetailModal({ entry, meta, kindLabel, onClose }: {
  entry: FeedEntry; meta: { icon: typeof IconActivity; color: string }; kindLabel: string; onClose: () => void
}) {
  const Icon = meta.icon
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  // Deliberately scoped to the Live-Feed card itself, not the viewport (live
  // feedback 2026-08-31: a full-viewport-centered modal "wasn't as sleek" as
  // one contained inside the panel it was opened from) - .wm-panel is
  // position:relative, this is position:absolute filling that box exactly.
  return (
    <div className="wm-modal-backdrop" onClick={onClose}>
      <div className="wm-modal wm-card" onClick={ev => ev.stopPropagation()}>
        <button type="button" className="wm-modal-close" onClick={onClose} aria-label="Close"><IconX size={18} /></button>
        <div className="wm-feed-icon wm-modal-icon" style={{ color: meta.color, borderColor: `color-mix(in srgb, ${meta.color} 40%, transparent)` }}><Icon size={22} stroke={1.7} /></div>
        <span className="wm-feed-tag">{kindLabel}</span>
        <h3 className="wm-modal-title">{entry.title}</h3>
        <div className="wm-feed-time">{entry.time}</div>
        {entry.detail && <p className="wm-modal-detail">{entry.detail}</p>}
      </div>
    </div>
  )
}

function LiveFeedWidget() {
  const { t } = useLocale()
  const w = t.worldModel
  const [entries, setEntries] = useState<FeedEntry[] | null>(null)
  const [live, setLive] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/worldmodel-feed')
      .then(res => { if (!res.ok) throw new Error(String(res.status)); return res.json() })
      .then((data: FeedEntry[]) => { if (!cancelled && Array.isArray(data) && data.length) { setEntries(data); setLive(true) } })
      .catch(() => { if (!cancelled) { setEntries(FEED_FALLBACK); setLive(false) } })
    return () => { cancelled = true }
  }, [])

  const rows = entries ?? FEED_FALLBACK
  const openEntry = rows.find(r => r.id === openId) ?? null

  return (
    <div className="wm-panel wm-card">
      <div className="wm-panel-head">
        <div className="wm-panel-head-row">
          <h3>{w.liveFeed.heading}</h3>
          <div className="wm-live-status">
            <span className={`wm-live-dot${live ? '' : ' wm-live-dot--muted'}`} />
            {live ? w.liveStatus : w.liveStatusFallback}
          </div>
        </div>
        <p>{w.liveFeed.sub}</p>
      </div>
      <div className="wm-chain-list wm-feed-list">
      {rows.length === 0 && <p style={{ color: 'var(--text2)', fontSize: 13 }}>{w.liveFeed.empty}</p>}
      {rows.map(entry => {
        const meta = FEED_META[entry.kind] ?? FEED_META.model
        const Icon = meta.icon
        const kindLabel = w.liveFeed.kinds[entry.kind] ?? entry.kind
        return (
          <div key={entry.id} className="wm-feed-item">
          <button type="button" className="wm-feed-row" onClick={() => setOpenId(entry.id)}>
            <div className="wm-feed-icon" style={{ color: meta.color, borderColor: `color-mix(in srgb, ${meta.color} 40%, transparent)` }}><Icon size={17} stroke={1.7} /></div>
            <div className="wm-feed-body">
              <div className="wm-feed-title">{entry.title}</div>
              <div className="wm-feed-time">{entry.time}</div>
            </div>
            <span className="wm-feed-tag">{kindLabel}</span>
            <span className="wm-feed-new"><IconCircleCheck size={11} />{w.liveFeed.newBadge}</span>
          </button>
          </div>
        )
      })}
      </div>
      {openEntry && (
        <FeedDetailModal
          entry={openEntry}
          meta={FEED_META[openEntry.kind] ?? FEED_META.model}
          kindLabel={w.liveFeed.kinds[openEntry.kind] ?? openEntry.kind}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  )
}

// Only the icon keys actually used by the five curated chains shown here
// (content/*.ts `causalChains.chains[i].icon`) - not the full ~150-key dict
// CausalChains.tsx owns, since only these five are ever rendered on this page.
const CHAIN_ICONS: Record<string, typeof IconActivity> = {
  seismic: IconActivity, rain: IconCloudRain, mountain: IconMountain,
  snowflake: IconSnowflake, shield: IconShieldLock,
}
const CHAIN_STEPS = 4
const CHAIN_COUNT = 5

function ChainsPreview() {
  const { t } = useLocale()
  const w = t.worldModel
  const chains = (t.causalChains.chains ?? []).slice(0, CHAIN_COUNT)
  return (
    <div className="wm-panel wm-card">
      <div className="wm-panel-head">
        <h3>{w.chainsPreview.heading}</h3>
        <p>{w.chainsPreview.sub}</p>
      </div>
      <div className="wm-chain-list">
      {chains.map(chain => {
        const ChainIcon = CHAIN_ICONS[chain.icon] ?? IconActivity
        const lastStep = CHAIN_STEPS - 1
        return (
        <div key={chain.title} className="wm-chain-row">
          {chain.nodes.slice(0, CHAIN_STEPS).map((node, j) => (
            <span key={j} style={{ display: 'contents' }}>
              {j > 0 && <span className="wm-chain-arrow">&rarr;</span>}
              {/* Step 0 = the real per-chain classification icon (grounded in
                  content data, not invented per node). Middle steps = the
                  traced intermediate change, teal. Last step = the flagged
                  outcome this chain ends on, amber, with a flag mark - not a
                  fabricated count: the real chain data is descriptive text,
                  no per-node delta/percentage exists to display honestly. */}
              <span className={`wm-chain-step wm-chain-step--${j === 0 ? 0 : j === lastStep ? 2 : 1}`}>
                {j === 0 && <span className="wm-chain-icon"><ChainIcon size={13} stroke={1.8} /></span>}
                {j !== 0 && <span className="wm-chain-dot" />}
                {node}
                {j === lastStep && <span className="wm-chain-flag"><IconFlag size={11} stroke={2} /></span>}
              </span>
            </span>
          ))}
        </div>
        )
      })}
      </div>
    </div>
  )
}

const ZOOM_MIN = 1
const ZOOM_MAX = 4

// Full-viewport lightbox opened by clicking the hero panel (live feedback
// 2026-09-01: "click on the hero... expand into a fullscreen view with
// slideshow effect and an option to scroll in n out and pan around so
// people can discover it uncut"). Reuses HeroSlideshow itself for the
// cycling/cross-fade, just at viewport scale instead of inside the bounded
// panel - the zoom/pan layer wraps it rather than reimplementing the
// slideshow a third time. `position: fixed`, not the `.wm-modal-backdrop`
// pattern used elsewhere on this page (FeedDetailModal) - that one is
// `position: absolute` scoped to its own panel by design, this needs the
// whole screen.
// Manual left/right navigation, no auto-advance and no cross-fade blend
// (live feedback 2026-09-01, after the first cut reused HeroSlideshow's own
// auto-cycling here too: "when fullscreen modal is on, obv the blend over
// effect is gone, this is the preview where the user can use it as he wants,
// with no interruptions") - a hard cut on manual navigation, not the panel's
// own atmospheric timed crossfade. Deliberately NOT HeroSlideshow reused a
// second time here; the two components now want genuinely different
// interaction models (auto/blended vs. manual/instant), forcing one to serve
// both would mean threading a disable-autoplay flag through a component this
// page doesn't otherwise control.
function HeroLightbox({ startIndex, onClose }: { startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragging = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }
  const prev = () => { setCurrent(c => (c - 1 + WORLD_MODEL_HERO_IMAGES.length) % WORLD_MODEL_HERO_IMAGES.length); resetView() }
  const next = () => { setCurrent(c => (c + 1) % WORLD_MODEL_HERO_IMAGES.length); resetView() }

  // Warm the browser cache for every shot up front (added 2026-09-01, live
  // feedback: "die pfeile... sieht man kurz erscheinen in der mitte vom
  // bild wärend es wächselt" - the browser's broken-image glyph flashing
  // centered while a fresh 1-3MB PNG was still downloading). Only 12 images,
  // and the lightbox only mounts once someone has already opened it, so
  // eagerly loading all of them here is cheap relative to the confusion of
  // a half-loaded frame mid-crossfade.
  useEffect(() => {
    WORLD_MODEL_HERO_IMAGES.forEach(src => { const img = new Image(); img.src = src })
  }, [])

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose()
      if (ev.key === 'ArrowLeft') prev()
      if (ev.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose])

  const onWheel = (ev: ReactWheelEvent) => {
    ev.preventDefault()
    setZoom(z => {
      const nextZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z - ev.deltaY * 0.0018))
      if (nextZoom === ZOOM_MIN) setPan({ x: 0, y: 0 })
      return nextZoom
    })
  }
  const onMouseDown = (ev: ReactMouseEvent) => {
    if (zoom <= ZOOM_MIN) return
    dragging.current = { x: ev.clientX, y: ev.clientY, panX: pan.x, panY: pan.y }
  }
  const onMouseMove = (ev: ReactMouseEvent) => {
    if (!dragging.current) return
    const d = dragging.current
    setPan({ x: d.panX + (ev.clientX - d.x), y: d.panY + (ev.clientY - d.y) })
  }
  const endDrag = () => { dragging.current = null }

  // Rendered via a portal straight onto document.body (added 2026-09-01,
  // fixing a real bug the first cut of this shipped with) - `position: fixed`
  // only escapes to the true viewport when NO ancestor sets `transform`
  // (or filter/perspective/will-change: transform), and nearly every element
  // on this page is wrapped in <Reveal>, whose motion.div sets `transform`
  // unconditionally as part of its own scroll-linked animation. Left un-
  // portaled, the "fullscreen" lightbox rendered pinned inside the hero
  // panel's own small box instead of covering the viewport - portaling out
  // of the whole Reveal-wrapped tree is what actually gets a real containing
  // block back.
  return createPortal(
    <div
      className="wm-lightbox-backdrop"
      onClick={onClose}
      onWheel={onWheel}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <button type="button" className="wm-modal-close wm-lightbox-close" onClick={onClose} aria-label="Close"><IconX size={20} /></button>
      <button type="button" className="wm-lightbox-nav wm-lightbox-nav--prev" onClick={ev => { ev.stopPropagation(); prev() }} aria-label="Previous"><IconChevronLeft size={22} /></button>
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={WORLD_MODEL_HERO_IMAGES[current]}
          alt=""
          className="wm-lightbox-frame"
          onClick={ev => ev.stopPropagation()}
          onMouseDown={onMouseDown}
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            cursor: zoom > ZOOM_MIN ? (dragging.current ? 'grabbing' : 'grab') : 'default',
          }}
        />
      </AnimatePresence>
      <button type="button" className="wm-lightbox-nav wm-lightbox-nav--next" onClick={ev => { ev.stopPropagation(); next() }} aria-label="Next"><IconChevronRight size={22} /></button>
      <span className="wm-lightbox-hint">&larr; &rarr; to browse &middot; scroll to zoom &middot; drag to pan &middot; esc to close</span>
    </div>,
    document.body
  )
}

// Was a single static DINGIR interface screenshot - swapped 2026-09-01 for the
// same cross-fading slideshow the main homepage hero runs (live feedback:
// "können wir da auch einfach die slideshow zeigen von den screenshots die
// wir haben, wie draussen im main hero"), reusing HeroSlideshow/HERO_IMAGES
// exported from Hero.tsx rather than a second copy of the same mechanic.
// .wm-graph-panel is position:relative + overflow:hidden, so the slideshow's
// absolutely-positioned layer fills and crops to this bounded box instead of
// the full viewport it normally sits behind. Clicking it opens HeroLightbox
// (added same session, same live-feedback round) for the uncropped fullscreen
// view.
function WorldGraphVisual() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className="wm-graph-panel wm-graph-panel--clickable" onClick={() => setOpen(true)} aria-label="View screenshots fullscreen">
        <HeroSlideshow images={WORLD_MODEL_HERO_IMAGES} zoomEffect={false} fit="contain" />
        <span className="wm-graph-expand-hint"><IconWorld size={13} stroke={1.8} /> view fullscreen</span>
      </button>
      {open && <HeroLightbox startIndex={0} onClose={() => setOpen(false)} />}
    </>
  )
}

function HeroBlock({ onApiRequest }: { onApiRequest: () => void }) {
  const { t } = useLocale()
  const w = t.worldModel
  const scrollToUseCases = () => document.getElementById('wm-usecases')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <div className="wm-wrap wm-hero">
      <Reveal dist={14}>
        <div className="wm-hero-copy">
          <h1>{w.heading}</h1>
          <p>{w.intro}</p>
          <div className="wm-hero-ctas">
            <button className="wm-btn-primary" onClick={scrollToUseCases}>{w.exploreCta}</button>
            <button className="wm-btn-secondary" onClick={onApiRequest}>{w.apiCta}</button>
          </div>
          <div className="wm-live-status"><span className="wm-live-dot" />{w.liveStatus}</div>
        </div>
      </Reveal>
      <Reveal dist={14} delay={1}><WorldGraphVisual /></Reveal>
    </div>
  )
}

// Decorative per-metric glyphs, not charts of real measured series - the
// underlying numbers are point-in-time counts (see content/*.ts `stats` sub
// labels for the actual sourcing/dates), not a real day-by-day history, so
// drawing a smooth "trend line" from them would fabricate precision that
// doesn't exist. Fixed hand-authored shapes instead, one visual idiom per
// metric kind (bars / pulse / network / ridge line / icon row / constellation),
// matching what the metric IS rather than a time series it doesn't have.
function SparkBars() {
  const h = [5, 7, 6, 9, 8, 11, 10, 13, 12, 15, 14, 17, 16, 19]
  const w = 100 / h.length
  return <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: '100%', height: 24 }}>
    {h.map((v, i) => <rect key={i} x={i * w + 0.6} y={24 - v} width={w - 1.2} height={v} rx="0.6" fill="var(--accent)" opacity={0.35 + (i / h.length) * 0.45} />)}
  </svg>
}
function SparkPulse() {
  const pts = [[0, 14], [7, 17], [14, 10], [21, 19], [28, 8], [35, 15], [42, 12], [50, 20], [58, 9], [65, 16], [72, 11], [80, 18], [88, 13], [100, 15]]
  return <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: '100%', height: 24 }}>
    <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
  </svg>
}
const NET_NODES = [[8, 18], [24, 6], [40, 14], [58, 5], [72, 16], [88, 9], [50, 20]]
const NET_EDGES = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [2, 6], [4, 5], [6, 1]]
function SparkNetwork() {
  return <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: '100%', height: 24 }}>
    {NET_EDGES.map(([a, b], i) => <line key={i} x1={NET_NODES[a][0]} y1={NET_NODES[a][1]} x2={NET_NODES[b][0]} y2={NET_NODES[b][1]} stroke="var(--accent)" strokeWidth="0.7" opacity="0.4" />)}
    {NET_NODES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 6 ? 2.4 : 1.6} fill="var(--accent)" opacity={i === 6 ? 0.95 : 0.7} />)}
  </svg>
}
function SparkRidge() {
  return <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: '100%', height: 24 }}>
    <path d="M0,18 C10,16 14,8 24,9 C34,10 38,19 48,17 C58,15 62,4 72,6 C82,8 86,17 100,13"
      fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
  </svg>
}
function SparkIconRow() {
  const icons = [IconActivity, IconShip, IconCloudRain, IconTrain, IconBroadcast]
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 24 }}>
    {icons.map((I, i) => <I key={i} size={14} stroke={1.7} style={{ color: 'var(--accent)', opacity: 0.55 + (i % 2) * 0.25 }} />)}
  </div>
}
function SparkConstellation() {
  const dots = [[6, 16, 1.8], [16, 8, 1.2], [28, 18, 2.2], [38, 6, 1], [48, 14, 1.6], [58, 20, 1.2], [68, 9, 2], [78, 17, 1.3], [88, 5, 1.7], [96, 15, 1.1]]
  return <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: '100%', height: 24 }}>
    {dots.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="var(--accent)" opacity={0.35 + (r / 2.2) * 0.5} />)}
  </svg>
}

function StatsRow() {
  const { t } = useLocale()
  const s = t.worldModel.stats
  const items: [keyof typeof s, () => React.ReactElement][] = [
    ['historical', SparkBars], ['live', SparkPulse], ['nodes', SparkNetwork],
    ['edges', SparkRidge], ['streams', SparkIconRow], ['domains', SparkConstellation],
  ]
  return (
    <div className="wm-wrap">
      <div className="wm-stats-grid" style={HUE_MAIN}>
        {items.map(([key, Spark], i) => (
          <Reveal key={key} delay={(i % 3) + 1} style={{ height: '100%' }}>
            <div className="wm-stat wm-card">
              <span className="wm-stat-label">{s[key].label}</span>
              <span className="wm-stat-value">{s[key].value}</span>
              <span className="wm-stat-sub">{s[key].sub}</span>
              <span className="wm-stat-accent"><Spark /></span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function ComparisonBlock() {
  const { t } = useLocale()
  const c = t.worldModel.comparison
  return (
    <div className="wm-wrap">
      <div className="wm-section-box">
      <Reveal dist={14}><h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 900, marginBottom: 28 }}>{c.heading}</h2></Reveal>
        <div className="wm-compare-grid">
          <Reveal dist={14} style={{ height: '100%' }}><div className="wm-compare-card wm-card">
            <div className="wm-compare-icon"><IconMessage2 size={19} stroke={1.7} /></div>
            <h3>{c.lm.title}</h3>
            <p>{c.lm.body}</p>
            <p className="wm-compare-tag">{c.lm.tag}</p>
            <span className="wm-compare-verdict">{c.lm.verdict}</span>
          </div></Reveal>
          <span className="wm-compare-vs">vs.</span>
          <Reveal dist={14} delay={1} style={{ height: '100%' }}><div className="wm-compare-card wm-card">
            <div className="wm-compare-icon"><IconRobot size={19} stroke={1.7} /></div>
            <h3>{c.agent.title}</h3>
            <p>{c.agent.body}</p>
            <p className="wm-compare-tag">{c.agent.tag}</p>
            <span className="wm-compare-verdict">{c.agent.verdict}</span>
          </div></Reveal>
          <span className="wm-compare-vs">vs.</span>
          <Reveal dist={14} delay={2} style={{ height: '100%' }}><div className="wm-compare-card wm-compare-card--wm wm-card">
            <div className="wm-compare-icon"><IconWorld size={19} stroke={1.7} /></div>
            <h3>{c.wm.title}</h3>
            <p>{c.wm.body}</p>
            <p className="wm-compare-tag">{c.wm.tag}</p>
            <span className="wm-compare-verdict">{c.wm.verdict}</span>
          </div></Reveal>
        </div>
      </div>
    </div>
  )
}

const USE_CASE_ICONS = [IconAlertTriangle, IconRoute, IconChartLine, IconShieldLock, IconFlask, IconBuildingSkyscraper]

function UseCasesGrid() {
  const { t } = useLocale()
  const u = t.worldModel.useCases
  const spot = useSpotlight<HTMLDivElement>()
  return (
    <div id="wm-usecases" className="wm-wrap">
      <div className="wm-section-box">
      <Reveal dist={14}><div className="wm-section-head"><p className="wm-eyebrow">{u.eyebrow}</p><h2>{u.heading}</h2><p>{u.sub}</p></div></Reveal>
      <div ref={spot.ref} className="wm-usecase-grid" style={HUE_MAIN} onMouseMove={spot.onMouseMove}>
        {u.cards.map((card, i) => {
          const Icon = USE_CASE_ICONS[i]
          return (
            <Reveal key={card.title} dist={14} delay={(i % 3) + 1} style={{ height: '100%' }}>
              <article className="wm-card">
                <div className="wm-compare-icon"><Icon size={19} stroke={1.6} /></div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            </Reveal>
          )
        })}
      </div>
      </div>
    </div>
  )
}

type EarlyAccessState = 'idle' | 'sending' | 'ok' | 'err'

function EarlyAccessForm() {
  const { t } = useLocale()
  const e = t.worldModel.earlyAccess
  const [email, setEmail] = useState('')
  const [botcheck, setBotcheck] = useState('')
  const [state, setState] = useState<EarlyAccessState>('idle')

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (botcheck) { setState('ok'); return } // honeypot: silently no-op, same convention as the contact form
    setState('sending')
    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, botcheck }),
      })
      if (!res.ok) throw new Error(String(res.status))
      beacon('world_model_early_access_signup')
      setState('ok')
      setEmail('')
    } catch {
      setState('err')
    }
  }

  return (
    <div className="wm-wrap wm-early-narrow">
      <Reveal dist={14}>
        <div className="wm-early wm-card">
          <div className="wm-early-copy">
            <div className="wm-compare-icon wm-early-icon"><IconMail size={20} stroke={1.7} /></div>
            <h3>{e.heading}</h3>
            <p>{e.sub}</p>
          </div>
          <form className="wm-early-form" onSubmit={submit}>
            <div className="wm-early-row">
              <input
                type="email" required placeholder={e.emailPlaceholder} value={email}
                onChange={ev => setEmail(ev.target.value)} disabled={state === 'sending' || state === 'ok'}
              />
              <button type="submit" className="wm-btn-primary" disabled={state === 'sending' || state === 'ok'}>
                {state === 'sending' ? e.submitSending : state === 'ok' ? <IconCircleCheck size={16} /> : e.submitIdle}
              </button>
            </div>
            <ul className="wm-early-benefits">
              {e.benefits.map(b => <li key={b}><IconCircleCheck size={14} />{b}</li>)}
            </ul>
            {/* Honeypot, same pattern as SubmitSection: hidden from real visitors, only an
                automated filler that submits every field populates it. */}
            <input type="text" name="company" value={botcheck} onChange={ev => setBotcheck(ev.target.value)}
              tabIndex={-1} autoComplete="off" aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
            {state === 'ok' && <span style={{ color: 'var(--accent-text)', fontSize: 13, fontWeight: 700 }}>{e.submitOk}</span>}
            {state === 'err' && (
              <span style={{ color: 'var(--text2)', fontSize: 12.5 }}>
                {e.errorText} <a href="mailto:contact@rfi-irfos.com" style={{ color: 'var(--accent-text)' }}><IconMail size={12} style={{ verticalAlign: -1 }} /> contact@rfi-irfos.com</a>
              </span>
            )}
          </form>
        </div>
      </Reveal>
    </div>
  )
}

export function WorldModelSection() {
  const scrollToApi = () => document.querySelector('.wm-early')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  return (
    <div className="wm">
      <section className="wm-section"><HeroBlock onApiRequest={scrollToApi} /></section>
      <section className="wm-section"><StatsRow /></section>
      <section className="wm-section"><ComparisonBlock /></section>
      <section className="wm-section">
        <div className="wm-wrap">
          <div className="wm-section-box wm-split">
            {/* Same two-tier contrast as the comparison box (live feedback
                2026-08-31: without a darker outer frame, the navy card
                surface reads as flat grey instead of blue - the darker
                --bg box around it is what makes --wm-surface read as blue
                by contrast, not the card colour itself). */}
            <Reveal dist={14}><ChainsPreview /></Reveal>
            <Reveal dist={14} delay={1}><LiveFeedWidget /></Reveal>
          </div>
        </div>
      </section>
      <section className="wm-section"><UseCasesGrid /></section>
      <section className="wm-section wm-section--last"><EarlyAccessForm /></section>
    </div>
  )
}
