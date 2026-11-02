// "What we do best" door-opener (`#app-privacy`, id kept for existing anchors).
// Rebuilt 2026-10-10: the former World Model comparison table became one panel
// that mirrors the outreach pitch (process, scope, evidence, trust) so a visitor
// arriving from the mail finds the same offer in the same order. The frame is
// static and every cell reveals on its own (same converge-from-the-sides pattern
// as the old table), because one Reveal around the whole panel is barely visible.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Reveal, useMobile, linkPhrase } from './shared'
import { InitialReviewFlow } from './InitialReviewFlow'
import { IconListSearch, IconBrandAppleFilled, IconBugFilled } from '@tabler/icons-react'
import { useLocale } from '../../hooks/useLocale'
import { localeHref } from '../../lib/localeHref'
// KPI figures are extracted from AUDIT_HIGHLIGHTS at build time
// (scripts/extract-audit-stats.mjs) - a direct import here dragged the whole
// 1.5MB TrackRecord ledger into the entry bundle of every page.
import corpusStats from '../../content/corpus-stats.json'
import auditStats from '../../content/auditStats.json'


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

export function AppPrivacySection({ onNavigateEvidence }: { onNavigateEvidence: () => void }) {
  const { t, locale } = useLocale()
  const c = t.appPrivacy
  const stacked = useMobile(900)
  const phone = useMobile(640)
  const [active, setActive] = useState(0)
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
    const id = window.setInterval(() => setActive(a => (a + 1) % c.steps.length), 3200)
    return () => window.clearInterval(id)
  }, [playing, visible, c.steps.length])
  const pick = (i: number) => { setPlaying(false); setActive(i) }
  const kpis = [
    { n: `${auditStats.appsAudited}+`, label: t.trackRecord.kpis.appsAudited, art: 'apps' as const },
    { n: `${corpusStats.trackerMentions}+`, label: t.trackRecord.kpis.trackersFound, art: 'bugs' as const },
    { n: `${auditStats.criticalFindings}+`, label: t.trackRecord.kpis.criticalFindings, art: 'shield' as const },
  ]

  return (
    <section id="app-privacy" style={{ padding: '48px var(--sec-pad-x) 12px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <p className="rfi-eyebrow" style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', marginBottom: 12, textAlign: 'center' }}>{c.eyebrow}</p>
          <h2 className="rfi-section-h2" style={{ marginBottom: 12, textAlign: 'center', fontWeight: 700 }}>{c.heading}</h2>
        </Reveal>
        <Reveal delay={1}>
          <div style={{ maxWidth: 720, margin: '0 auto 36px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text)', fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-body)', margin: 0 }}>
              {linkPhrase(c.paragraph, locale === 'de' ? 'von Grund auf trainierte Agenten' : 'built and trained from scratch in house', localeHref('/squad/', locale))}
            </p>
          </div>
        </Reveal>

        {/* Thin violet frame around process card + Free Check widget so the two read as one unit. */}
        {/* Flagship block reads one type step up (Simeon 31.10.: "flagshippy", ca. 5 % größer): the scale
            tokens are re-declared here, so every card inside grows together without raw font sizes. */}
        <div className="fx-frame" style={{ borderRadius: 26, padding: phone ? 8 : 12, maxWidth: 1320, margin: '0 auto 24px',
          '--fs-label': '12px', '--fs-small': '14px', '--fs-body': '16px' } as CSSProperties}>
        <div style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : 'minmax(0, 1fr) 350px', gap: stacked ? 28 : 8 }}>
          {/* Left: ONE framed card holding process, scope and evidence (frame static, cells reveal).
              position+zIndex keeps this card painted above the Free Check widget's turquoise
              glow on its right (live feedback 2026-10-14: the glow "overshadows" this card where
              its blur bleeds across the grid gap - without this, the later grid item wins paint
              order by default and the glow sits in front of this card's edge). */}
          <div className="fx-panel" style={{ position: 'relative', zIndex: 1, minWidth: 0, borderRadius: 20, padding: phone ? 18 : 28 }}>
            <p style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', marginBottom: 14, textAlign: 'center' }}>{c.processLabel}</p>
            <div ref={stepsRef} style={{ display: 'grid', gridTemplateColumns: phone ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 18, marginBottom: 28, alignItems: 'start' }}>
              {c.steps.map((s, i) => (
                <Reveal key={s.title} delay={i}>
                  <div role="button" tabIndex={0} onClick={() => pick(i)} aria-pressed={active === i}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i) } }}
                    style={{ cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--fs-body)', flexShrink: 0, transition: 'all 0.4s', transform: active === i ? 'scale(1.12)' : 'scale(1)',
                        background: i <= active ? 'var(--accent-text)' : 'var(--bg2)', color: i <= active ? '#02110d' : 'var(--text2)',
                        border: '1px solid ' + (i <= active ? 'var(--accent-text)' : 'var(--border)'),
                        boxShadow: active === i ? '0 0 0 4px color-mix(in srgb, var(--accent-text) 12%, transparent), 0 0 26px color-mix(in srgb, var(--accent-text) 55%, transparent)' : i < active ? '0 0 12px color-mix(in srgb, var(--accent-text) 25%, transparent)' : 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>{i + 1}</span>
                      {i < c.steps.length - 1 && !phone && <span style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', background: 'var(--accent-text)', transformOrigin: 'left', transform: i < active ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.6s ease' }} />
                      </span>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--fs-body)', color: active === i ? 'var(--accent-text)' : 'var(--text)', marginBottom: 4, transition: 'color 0.4s' }}>{s.title}</div>
                    <div style={{ fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', color: active === i ? 'var(--text)' : 'var(--text2)' }}>{s.text}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Each column gets its own centred label in the first row, so the scope rows and the evidence
                card still start and end on the same lines (Simeon 01.11. + 03.11.). On phones the DOM order
                (label, rows, label, card) stacks each label over its own column. */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'grid', gridTemplateColumns: phone ? '1fr' : 'minmax(0, 1.15fr) minmax(0, 1fr)', gridTemplateRows: phone ? undefined : 'auto 1fr', columnGap: 24, rowGap: 12 }}>
              <p style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', margin: 0, textAlign: 'center', gridColumn: phone ? undefined : 1, gridRow: phone ? undefined : 1 }}>{c.scopeLabel}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: phone ? undefined : 1, gridRow: phone ? undefined : 2 }}>
                {c.scope.map((row, i) => (
                  <Reveal key={row.title} delay={i + 1} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="fx-row" style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 14, padding: '10px 14px' }}>
                      <span className="rfi-glass-icon" style={{ ...tile, color: `var(--ic-${i + 1})`, borderColor: `color-mix(in srgb, var(--ic-${i + 1}) 38%, transparent)` }}>{SCOPE_ICONS[i]}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 'var(--fs-body)', color: 'var(--text)' }}>{row.title}</div>
                        <div style={{ fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', color: 'var(--text2)', marginTop: 2 }}>{row.text}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <p style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', margin: phone ? '16px 0 0' : 0, textAlign: 'center', gridColumn: phone ? undefined : 2, gridRow: phone ? undefined : 1 }}>{c.evidenceLabel}</p>
              <Reveal delay={2} style={{ height: '100%', gridColumn: phone ? undefined : 2, gridRow: phone ? undefined : 2 }}>
                <div className="fx-evidence" style={{ borderRadius: 18, padding: 22, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                    <span className="rfi-glass-icon" style={{ ...tile, width: 48, height: 48, color: 'var(--icon-doc)' }}>
                      <Icon size={26}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="14" y2="17" /></Icon>
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--fs-lead)', color: 'var(--text)' }}>{c.report.title}</div>
                      <div style={{ fontSize: 'var(--fs-small)', color: 'var(--text2)' }}>{c.report.sub}</div>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                    {c.report.items.map(item => (
                      <li key={item.title} style={{ display: 'flex', gap: 12 }}>
                        <span aria-hidden style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-tight)', flexShrink: 0 }}>✓</span>
                        <div>
                          <div style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-tight)', fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
                          <div style={{ fontSize: 'var(--fs-small)', lineHeight: 'var(--lh-body)', color: 'var(--text2)', marginTop: 3 }}>{item.text}</div>
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
              <InitialReviewFlow variant="embedded" />
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
          <div style={{ display: 'grid', maxWidth: 1000, margin: '0 auto 20px', gridTemplateColumns: phone ? '1fr' : 'repeat(auto-fit, minmax(270px, 1fr))', gap: 14 }}>
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
          </div>
          <Reveal delay={1}>
            <a href={localeHref('/evidence/', locale)} onClick={e => { e.preventDefault(); onNavigateEvidence() }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8, padding: '10px 18px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--glass-bg-solid)', color: 'var(--accent-text)', fontWeight: 700, fontSize: 'var(--fs-body)', textDecoration: 'none' }}>
              <IconListSearch size={18} stroke={1.8} color="var(--icon-neutral)" aria-hidden />
              {c.evidenceCta}
            </a>
          </Reveal>
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
function Brackets() {
  return <>{['tl', 'tr', 'bl', 'br'].map(c => <span key={c} className={`kpi-br kpi-br--${c}`} />)}</>
}
function KpiArt({ kind }: { kind: 'apps' | 'bugs' | 'shield' }) {
  if (kind === 'apps') return (
    <div className="kpi-art kpi-art--tilt" aria-hidden="true">
      <div className="kpi-floor" />
      <Brackets />
      <div className="kpi-glass kpi-c--android" style={{ left: 16, top: 20, width: 80, height: 80 }}><AndroidGlyph /></div>
      <div className="kpi-glass kpi-c--apple" style={{ left: 66, top: 50, width: 80, height: 80 }}><IconBrandAppleFilled size={42} className="kpi-glyph kpi-glyph--light" /></div>
    </div>
  )
  if (kind === 'bugs') return (
    <div className="kpi-art kpi-art--tilt" aria-hidden="true">
      <div className="kpi-glass kpi-glass--window" style={{ left: 4, top: 12, width: 112, height: 96 }}>
        <div className="kpi-win__bar"><i /><i /><i /></div>
        <div className="kpi-win__code"><b>&lt;/&gt;</b><span style={{ width: '70%' }} /><span style={{ width: '50%' }} /><span style={{ width: '62%' }} /><span style={{ width: '40%' }} /></div>
      </div>
      <div className="kpi-glass kpi-c--bug" style={{ left: 68, top: 52, width: 82, height: 82 }}>
        <Brackets />
        <IconBugFilled size={40} className="kpi-glyph" />
      </div>
    </div>
  )
  return (
    <div className="kpi-art kpi-art--tilt kpi-c--shield" aria-hidden="true">
      {/* Picker 02.11. (S6): the shield floats in front of a round glass disc with a dot ring,
          the disc tilted like the tiles of the other two cards (index.css .kpi-disc). */}
      <div className="kpi-disc-tilt">
        <div className="kpi-disc-dots" />
        <div className="kpi-disc" />
      </div>
      {/* Glass shield (Simeon 01.11.: stood "schlank" next to the other cards): tinted body, a light
          sheen on the left half, a bright rim along the top and a lifted drop shadow (index.css .kpi-shield). */}
      <svg className="kpi-shield" viewBox="0 0 64 72" width="66" height="74" style={{ position: 'absolute', left: 50, top: 36 }}>
        <defs>
          <linearGradient id="kpi-shield" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent-text)" stopOpacity=".5" />
            <stop offset="1" stopColor="var(--accent-text)" stopOpacity=".12" />
          </linearGradient>
          <linearGradient id="kpi-shield-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".38" />
            <stop offset=".55" stopColor="#fff" stopOpacity=".04" />
          </linearGradient>
        </defs>
        <path d="M32 3 L58 13 V34 C58 52 46 63 32 69 C18 63 6 52 6 34 V13 Z" fill="url(#kpi-shield)" stroke="var(--accent-text)" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M32 3 L6 13 V34 C6 52 18 63 32 69 Z" fill="url(#kpi-shield-sheen)" />
        <path d="M7.5 14 L32 4.6 L56.5 14" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 9 L52 17 V34 C52 48 43 57 32 62 C21 57 12 48 12 34 V17 Z" fill="none" stroke="var(--accent-text)" strokeOpacity=".5" strokeWidth="1.2" />
        <path d="M21 36 L29 44 L44 27" fill="none" stroke="#0b1424" strokeOpacity=".45" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" transform="translate(0 1.2)" />
        <path d="M21 36 L29 44 L44 27" fill="none" style={{ stroke: 'color-mix(in srgb, var(--accent-text) 55%, #fff)' }} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
