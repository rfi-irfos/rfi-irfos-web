// "What we do best" door-opener (`#app-privacy`, id kept for existing anchors).
// Rebuilt 2026-10-10: the former World Model comparison table became one panel
// that mirrors the outreach pitch (process, scope, evidence, trust) so a visitor
// arriving from the mail finds the same offer in the same order. The frame is
// static and every cell reveals on its own (same converge-from-the-sides pattern
// as the old table), because one Reveal around the whole panel is barely visible.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Reveal, useMobile, prefersReducedMotion } from './shared'
import { InitialReviewFlow } from './InitialReviewFlow'
import { IconBrandAppleFilled, IconBugFilled } from '@tabler/icons-react'
import { useLocale } from '../../hooks/useLocale'
// KPI figures are extracted from AUDIT_HIGHLIGHTS at build time
// (scripts/extract-audit-stats.mjs) - a direct import here dragged the whole
// 1.5MB TrackRecord ledger into the entry bundle of every page.
import corpusStats from '../../content/corpus-stats.json'
import auditStats from '../../content/auditStats.json'
import { FinishLock } from './FinishLock'


// Running total of domain checks (GET /api/stats/checks): one number, nothing per check is stored.
// The figure counts up when it first arrives and again whenever a poll (every 30 s while the tab is
// visible, the server caches the answer for the same time) brings a higher total, so the card ticks
// along without a reload. No figure at all when the first request fails.
function useCheckTotal(): number | null {
  const [target, setTarget] = useState<number | null>(null)
  const [shown, setShown] = useState<number | null>(null)
  const shownRef = useRef(0)
  useEffect(() => {
    let alive = true
    const load = () => {
      if (document.hidden) return
      fetch('/api/stats/checks').then(r => r.ok ? r.json() : null).then(j => { if (alive && j && Number.isFinite(j.total)) setTarget(j.total) }).catch(() => {})
    }
    load()
    const timer = window.setInterval(load, 30000)
    document.addEventListener('visibilitychange', load)
    return () => { alive = false; window.clearInterval(timer); document.removeEventListener('visibilitychange', load) }
  }, [])
  useEffect(() => {
    if (target === null) return
    const from = shownRef.current
    const done = (n: number) => { shownRef.current = n; setShown(n) }
    if (prefersReducedMotion() || target < 2 || target <= from) { done(target); return }
    const start = performance.now(), dur = from === 0 ? 1400 : 700
    let raf = 0
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur)
      done(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return shown
}

function Icon({ children, size = 22 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  )
}

const SHIELD = 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'

const SCOPE_ICONS = [
  <Icon key="code"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>,
  <Icon key="plug"><path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" /></Icon>,
  <Icon key="cloud"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></Icon>,
  <Icon key="shield"><path d={SHIELD} /></Icon>,
  <Icon key="bug"><path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" /><path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4" /></Icon>,
]

const tile = { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-text)', flexShrink: 0 } as const

export function AppPrivacySection() {
  const { t, locale } = useLocale()
  const c = t.appPrivacy
  const stacked = useMobile(900)
  const phone = useMobile(640)
  const [active, setActive] = useState(0)
  const [completedSegments, setCompletedSegments] = useState(0)
  const [flowPhase, setFlowPhase] = useState<'hold' | 'filling' | 'finished'>('hold')
  const [finishReached, setFinishReached] = useState(false)
  // Autoplay walks through the four steps until the visitor clicks one; skipped for reduced motion.
  const [playing, setPlaying] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const stepsRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = stepsRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!playing || !visible) return
    const delay = flowPhase === 'hold' ? 1500 : flowPhase === 'filling' ? 1200 : 3400
    const id = window.setTimeout(() => {
      if (flowPhase === 'hold') {
        setFlowPhase('filling')
      } else if (flowPhase === 'filling' && active < c.steps.length - 1) {
        setCompletedSegments(active + 1)
        setActive(active + 1)
        setFlowPhase('hold')
      } else if (flowPhase === 'filling') {
        setCompletedSegments(c.steps.length)
        setFinishReached(true)
        setFlowPhase('finished')
      } else {
        setActive(0)
        setCompletedSegments(0)
        setFinishReached(false)
        setFlowPhase('hold')
      }
    }, delay)
    return () => window.clearTimeout(id)
  }, [active, flowPhase, playing, visible, c.steps.length])
  const pick = (i: number) => {
    setPlaying(false)
    setActive(i)
    setCompletedSegments(i)
    setFinishReached(false)
    setFlowPhase('hold')
  }
  const checkTotal = useCheckTotal()
  const kpis = [
    { n: `${auditStats.appsAudited}+`, label: t.trackRecord.kpis.appsAudited, art: 'apps' as const },
    { n: `${corpusStats.trackerMentions}+`, label: t.trackRecord.kpis.trackersFound, art: 'bugs' as const },
    { n: `${auditStats.criticalFindings}+`, label: t.trackRecord.kpis.criticalFindings, art: 'shield' as const },
  ]

  return (
    <section id="app-privacy" style={{ padding: '36px var(--sec-pad-x) 12px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        {/* Thin violet frame around process card + Free Check widget so the two read as one unit. */}
        {/* Flagship block reads one type step up (Simeon 31.10.: "flagshippy", ca. 5 % größer): the scale
            tokens are re-declared here, so every card inside grows together without raw font sizes. */}
        <div style={{ borderRadius: 26, padding: 0, maxWidth: 1320, margin: '0 auto 24px',
          '--fs-label': '12px', '--fs-small': '14px', '--fs-body': '16px' } as CSSProperties}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: stacked ? 28 : 22 }}>
          {/* Left: ONE framed card holding process, scope and evidence (frame static, cells reveal).
              position+zIndex keeps this card painted above the Free Check widget's turquoise
              glow on its right (live feedback 2026-10-14: the glow "overshadows" this card where
              its blur bleeds across the grid gap - without this, the later grid item wins paint
              order by default and the glow sits in front of this card's edge). */}
          <div className="fx-panel irf-scope-band" style={{ position: 'relative', zIndex: 1, minWidth: 0, borderRadius: 20, padding: phone ? 18 : 28 }}>
            <div ref={stepsRef} style={{ display: 'grid', gridTemplateColumns: phone ? '1fr' : 'repeat(4, 1fr)', gap: phone ? 0 : 18, marginBottom: 28, alignItems: 'start' }}>
              {c.steps.map((s, i) => {
                const last = i === c.steps.length - 1
                const filled = i < completedSegments || (flowPhase === 'filling' && i === active)
                const circle = (
                  <span style={{ position: 'relative', zIndex: 1, width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--fs-body)', flexShrink: 0, transition: 'all 0.4s', transform: active === i ? 'scale(1.12)' : 'scale(1)',
                        background: i <= active ? 'var(--accent-text)' : 'var(--bg2)', color: i <= active ? '#02110d' : 'var(--text2)',
                        border: '1px solid ' + (i <= active ? 'var(--accent-text)' : 'var(--border)'),
                        boxShadow: active === i ? '0 0 0 4px color-mix(in srgb, var(--accent-text) 12%, transparent), 0 0 26px color-mix(in srgb, var(--accent-text) 55%, transparent)' : i < active ? '0 0 12px color-mix(in srgb, var(--accent-text) 25%, transparent)' : 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>{i + 1}</span>
                )
                const title = <div style={{ fontWeight: 700, fontSize: 'var(--fs-body)', color: active === i ? 'var(--accent-text)' : 'var(--text)', marginBottom: 4, transition: 'color 0.4s' }}>{s.title}</div>
                // Active description grows a touch (Simeon 20.11.): transform only, so the neighbouring columns never move.
                const text = <div style={{ fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', color: '#e8e8f0', textShadow: '0 0 12px rgba(232,232,240,0.12)', transformOrigin: 'left top', transform: active === i ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(.2,.7,.2,1)' }}>{s.text}</div>
                return (
                <Reveal key={s.title} delay={i}>
                  {phone ? (
                    // Phones (Simeon 18.11.): one column as a vertical timeline, a line runs from step to step and the lock hangs below the last circle on the same line.
                    <div role="button" tabIndex={0} onClick={() => pick(i)} aria-pressed={active === i}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i) } }}
                      style={{ cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 14 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        {circle}
                        {!last && <span style={{ position: 'relative', width: 2, flex: 1, minHeight: 20, margin: '-2px 0', background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                          <span style={{ display: 'block', width: '100%', height: '100%', background: 'var(--accent-text)', transformOrigin: 'top', transform: filled ? 'scaleY(1)' : 'scaleY(0)', transition: 'transform 1.1s ease-in-out' }} />
                        </span>}
                        {last && <>
                          <span style={{ position: 'relative', width: 2, height: 26, margin: '-2px 0 2px', background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                            <span style={{ display: 'block', width: '100%', height: '100%', background: 'var(--accent-text)', transformOrigin: 'top', transform: finishReached || active === i ? 'scaleY(1)' : 'scaleY(0)', transition: 'transform 1.1s ease-in-out' }} />
                          </span>
                          <FinishLock reached={finishReached} />
                        </>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 22 }}>
                        <div style={{ display: 'flex', alignItems: 'center', minHeight: 38 }}>{title}</div>
                        {text}
                      </div>
                    </div>
                  ) : (
                  <div role="button" tabIndex={0} onClick={() => pick(i)} aria-pressed={active === i}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i) } }}
                    style={{ cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      {circle}
                      <span style={{ position: 'relative', zIndex: 0, marginLeft: -8, marginRight: last ? -8 : -18, flex: 1, height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', background: 'var(--accent-text)', transformOrigin: 'left', transform: filled ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 1.1s ease-in-out' }} />
                      </span>
                      {/* Finish lock after the last step (Simeon 18.11.): stands open while the steps fill up, closes and shows a green check at the end. */}
                      {last && <FinishLock reached={finishReached} />}
                    </div>
                    {title}
                    {text}
                  </div>
                  )}
                </Reveal>
                )
              })}
            </div>

            {/* Each column gets its own centred label in the first row, so the scope rows and the evidence
                card still start and end on the same lines (Simeon 01.11. + 03.11.). On phones the DOM order
                (label, rows, label, card) stacks each label over its own column. */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'grid', gridTemplateColumns: phone ? '1fr' : 'minmax(0, 0.9fr) minmax(0, 1fr)', gridTemplateRows: phone ? undefined : 'auto 1fr', columnGap: 24, rowGap: 12 }}>
              <p style={{ fontSize: 'var(--fs-small)', fontWeight: 600, color: 'var(--text)', margin: 0, textAlign: 'center', gridColumn: phone ? undefined : 1, gridRow: phone ? undefined : 1 }}>{c.scopeLabel}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: phone ? undefined : 1, gridRow: phone ? undefined : 2 }}>
                {c.scope.map((row, i) => (
                  <Reveal key={row.title} delay={i + 1} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="fx-row" style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 14, padding: '10px 14px' }}>
                      <span className="rfi-glass-icon" style={{ ...tile, color: `var(--ic-${i + 1})`, borderColor: `color-mix(in srgb, var(--ic-${i + 1}) 38%, transparent)` }}>{SCOPE_ICONS[i]}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 'var(--fs-body)', color: 'var(--text)' }}>{row.title}</div>
                        <div style={{ fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', color: 'var(--text)', marginTop: 2 }}>{row.text}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <p style={{ fontSize: 'var(--fs-small)', fontWeight: 600, color: 'var(--text)', margin: phone ? '16px 0 0' : 0, textAlign: 'center', gridColumn: phone ? undefined : 2, gridRow: phone ? undefined : 1 }}>{c.evidenceLabel}</p>
              <Reveal delay={2} style={{ height: '100%', gridColumn: phone ? undefined : 2, gridRow: phone ? undefined : 2 }}>
                <div className="fx-evidence irf-evidence-band" style={{ borderRadius: 18, padding: 22, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                    <span className="rfi-glass-icon" style={{ ...tile, width: 48, height: 48, color: '#fff', borderColor: 'rgba(255,255,255,.2)', boxShadow: 'none' }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3.25" y="3.25" width="7.5" height="7.5" rx="2" />
                        <path d="M10.75 7h2.5a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 0 0 2.5 2.5h.5" />
                        <rect x="16.25" y="15" width="5" height="5.5" rx="1.6" />
                      </svg>
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--fs-lead)', lineHeight: 1.3, color: 'var(--text)' }}>{c.report.title}</div>
                      {c.report.sub && <div style={{ fontSize: 'var(--fs-small)', color: 'var(--text)' }}>{c.report.sub}</div>}
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: '0 0 0 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                    {c.report.items.map(item => (
                      <li key={item.title} style={{ display: 'flex', gap: 6 }}>
                        <span aria-hidden style={{ color: 'var(--evidence-check, var(--accent-text))', fontWeight: 700, fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-tight)', flexShrink: 0, marginLeft: 6 }}>✓</span>
                        <div>
                          <div style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-tight)', fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
                          <div style={{ fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', color: 'var(--text)', marginTop: 3 }}>{item.text}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right: the embedded review flow (2026-10-14 redesign — this
              used to be four trust-point cards stacked above a CTA link to
              #submit; live direction moved the actual intake flow onto the
              page itself instead of behind a click). */}
          {/* id="domain-check" is the anchor every DLT benchmark mail links to
              (rfi-irfos.com/#domain-check). It didn't exist until 2026-10-31, so
              those clicks landed on the top of the homepage instead of the form. */}
          <div id="domain-check" style={{
            display: 'flex', flexDirection: 'column', gap: 16, alignSelf: 'stretch', scrollMarginTop: 84,
          }}>
            <Reveal delay={1} style={{ flex: 1 }}>
              <InitialReviewFlow variant="embedded" wide={!stacked} />
            </Reveal>
          </div>
        </div>
        </div>

        {/* Evidence strip: the same three live figures as the ledger KPI row
            (auditStats.json - build-time extract of AUDIT_HIGHLIGHTS - plus
            corpus-stats.json), never hand-typed numbers. */}
        <div style={{ maxWidth: 1320, margin: '0 auto 40px', textAlign: 'center' }}>
          {/* Glass cards after Simeon's reference (01.11.): icon tile, hairline, figure and label left-aligned.
              Phone stacks them full width, the horizontal card reads better as a row than squeezed in pairs. */}
          <div className="kpi-grid" style={phone ? { gridTemplateColumns: '1fr' } : checkTotal === null ? { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', maxWidth: 1000 } : undefined}>
            {kpis.map((k, i) => (
              <Reveal key={k.label} delay={i}>
                <div className="kpi-cq"><div className={`kpi-card kpi-card--${i + 1}`}>
                  <KpiArt kind={k.art} />
                  <div className="kpi-card__rule" aria-hidden="true" />
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div className="kpi-card__n">{k.n}</div>
                    <div className="kpi-card__label">{k.label}</div>
                  </div>
                </div></div>
              </Reveal>
            ))}
            {/* Fourth figure (Simeon 19.11.): live total of domain checks, in the same row. Icon W3 from the picker. Hidden until the number has loaded. */}
            {checkTotal !== null && (
              <Reveal delay={3}>
                <div className="kpi-cq"><div className="kpi-card kpi-card--2">
                  <KpiArt kind="globe" />
                  <div className="kpi-card__rule" aria-hidden="true" />
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div className="kpi-card__n">{checkTotal.toLocaleString(locale === 'de' ? 'de-AT' : 'en-GB')}+</div>
                    <div className="kpi-card__label">{t.trackRecord.kpis.domainChecks}</div>
                  </div>
                </div></div>
              </Reveal>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}

// Layered glass illustrations for the evidence cards (Simeon's reference 01.11.):
// two app tiles, a code window with a bug tile, a shield inside scan rings.
function AndroidGlyph() {
  return (
    <svg viewBox="0 0 48 52" width="40" height="44" className="kpi-glyph" fill="currentColor">
      <path d="M10 20a14 13 0 0 1 28 0Z" />
      <circle cx="18.5" cy="14" r="1.6" fill="rgba(10,14,18,.9)" /><circle cx="29.5" cy="14" r="1.6" fill="rgba(10,14,18,.9)" />
      <path d="M15 4l3 5M33 4l-3 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="10" y="22" width="28" height="19" rx="3" />
      <rect x="2" y="22" width="6" height="15" rx="3" /><rect x="40" y="22" width="6" height="15" rx="3" />
      <rect x="15" y="39" width="6" height="11" rx="3" /><rect x="27" y="39" width="6" height="11" rx="3" />
    </svg>
  )
}
function KpiArt({ kind }: { kind: 'apps' | 'bugs' | 'shield' | 'globe' }) {
  if (kind === 'globe') return (
    // Picker 19.11. (W3): globe and check tile, built like the apps card.
    <div className="kpi-art kpi-art--tilt" aria-hidden="true">
      <div className="kpi-floor" />
      <div className="kpi-glass kpi-c--apple" style={{ left: 16, top: 20, width: 80, height: 80 }}>
        <svg className="kpi-glyph" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18" /></svg>
      </div>
      <div className="kpi-glass kpi-c--android" style={{ left: 66, top: 50, width: 80, height: 80 }}>
        <svg className="kpi-glyph" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
      </div>
    </div>
  )
  if (kind === 'apps') return (
    <div className="kpi-art kpi-art--tilt" aria-hidden="true">
      <div className="kpi-floor" />
      <div className="kpi-glass kpi-c--android" style={{ left: 16, top: 20, width: 80, height: 80 }}><AndroidGlyph /></div>
      <div className="kpi-glass kpi-c--apple" style={{ left: 66, top: 50, width: 80, height: 80 }}><IconBrandAppleFilled size={42} className="kpi-glyph kpi-glyph--light" /></div>
    </div>
  )
  if (kind === 'bugs') return (
    <div className="kpi-art kpi-art--tilt" aria-hidden="true">
      <div className="kpi-floor" />
      <div className="kpi-glass kpi-glass--window" style={{ left: 4, top: 12, width: 112, height: 96 }}>
        <div className="kpi-win__bar"><i /><i /><i /></div>
        <div className="kpi-win__code"><b>&lt;/&gt;</b><span style={{ width: '70%' }} /><span style={{ width: '50%' }} /><span style={{ width: '62%' }} /><span style={{ width: '40%' }} /></div>
      </div>
      <div className="kpi-glass kpi-c--bug" style={{ left: 68, top: 52, width: 82, height: 82 }}>
          <IconBugFilled size={40} className="kpi-glyph" />
      </div>
    </div>
  )
  return (
    // Picker 19.11. (K4): hazard tile with a striped bar behind, the shield tile in front with a dot ring
    // around the shield itself and a green check. Same two-tile build and floor as the other three cards.
    <div className="kpi-art kpi-art--tilt" aria-hidden="true">
      <div className="kpi-floor" />
      <div className="kpi-glass kpi-c--bug" style={{ left: 16, top: 20, width: 80, height: 80, flexDirection: 'column', gap: 8 }}>
        <svg className="kpi-glyph" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.6 21.4 20H2.6Z" fill="rgba(255,93,82,.14)" /><path d="M12 9.5v5M12 17.4h.01" strokeWidth="2.2" /></svg>
        <span style={{ display: 'block', width: 58, height: 9, borderRadius: 2, background: 'repeating-linear-gradient(-45deg, #f5b73a 0 6px, #1b1f27 6px 12px)', boxShadow: '0 0 6px rgba(245,183,58,.35)' }} />
      </div>
      <div className="kpi-glass kpi-c--shield" style={{ left: 66, top: 50, width: 80, height: 80 }}>
        <div style={{ position: 'relative', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="-35 -35 70 70" width="70" height="70" style={{ position: 'absolute', inset: 0, fill: 'none', stroke: 'var(--accent-text)', strokeOpacity: 0.85, strokeWidth: 2.2, strokeLinecap: 'round' }}><circle r="30" strokeDasharray="0.1 5.2" /></svg>
          <svg className="kpi-glyph" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 20 6v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6Z" /><path d="m8.5 12 2.5 2.5 4.5-5" stroke="#3ddc84" strokeWidth="2" /></svg>
        </div>
      </div>
    </div>
  )
}
