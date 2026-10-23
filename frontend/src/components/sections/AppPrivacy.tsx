// "What we do best" door-opener (`#app-privacy`, id kept for existing anchors).
// Rebuilt 2026-10-10: the former World Model comparison table became one panel
// that mirrors the outreach pitch (process, scope, evidence, trust) so a visitor
// arriving from the mail finds the same offer in the same order. The frame is
// static and every cell reveals on its own (same converge-from-the-sides pattern
// as the old table), because one Reveal around the whole panel is barely visible.
import { useEffect, useRef, useState } from 'react'
import { Reveal, useMobile } from './shared'
import { InitialReviewFlow } from './InitialReviewFlow'
import { useLocale } from '../../hooks/useLocale'
import { AUDIT_HIGHLIGHTS } from './TrackRecord'
import corpusStats from '../../content/corpus-stats.json'

const MONO = "'JetBrains Mono', monospace"

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
  const { t } = useLocale()
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
    { n: `${AUDIT_HIGHLIGHTS.length}+`, label: t.trackRecord.kpis.appsAudited, from: 'left' as const },
    { n: `${corpusStats.trackerMentions}+`, label: t.trackRecord.kpis.trackersFound, from: 'bottom' as const },
    { n: `${AUDIT_HIGHLIGHTS.filter(a => a.sev === 'CRITICAL').length}+`, label: t.trackRecord.kpis.criticalFindings, from: 'right' as const },
  ]

  return (
    <section id="app-privacy" style={{ padding: '48px var(--sec-pad-x) 12px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>{c.eyebrow}</p>
          <h2 className="rfi-section-h2" style={{ marginBottom: 12, textAlign: 'center', fontWeight: 700 }}>{c.heading}</h2>
        </Reveal>
        <Reveal delay={1}>
          <div style={{ maxWidth: 720, margin: '0 auto 36px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text)', fontSize: 15.5, lineHeight: 1.8, margin: 0 }}>
              {c.paragraph}
            </p>
          </div>
        </Reveal>

        {/* Thin violet frame around process card + Free Check widget so the two read as one unit. */}
        <div style={{ border: '1px solid var(--violet-line)', borderRadius: 26, padding: phone ? 8 : 12, maxWidth: 1320, margin: '0 auto 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : 'minmax(0, 1fr) 350px', gap: stacked ? 28 : 16 }}>
          {/* Left: ONE framed card holding process, scope and evidence (frame static, cells reveal).
              position+zIndex keeps this card painted above the Free Check widget's turquoise
              glow on its right (live feedback 2026-10-14: the glow "overshadows" this card where
              its blur bleeds across the grid gap - without this, the later grid item wins paint
              order by default and the glow sits in front of this card's edge). */}
          <div style={{ position: 'relative', zIndex: 1, minWidth: 0, border: '1px solid var(--border)', borderRadius: 20, padding: phone ? 18 : 28, background: 'var(--glass-bg-solid)' }}>
            <p style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>{c.processLabel}</p>
            <div ref={stepsRef} style={{ display: 'grid', gridTemplateColumns: phone ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 18, marginBottom: 28, alignItems: 'start' }}>
              {c.steps.map((s, i) => (
                <Reveal key={s.title} from="bottom" dist={48} delay={i}>
                  <div role="button" tabIndex={0} onClick={() => pick(i)} aria-pressed={active === i}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i) } }}
                    style={{ cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0, transition: 'all 0.4s', transform: active === i ? 'scale(1.12)' : 'scale(1)',
                        background: i <= active ? 'var(--accent-text)' : 'var(--bg2)', color: i <= active ? '#02110d' : 'var(--text2)',
                        border: '1px solid ' + (i <= active ? 'var(--accent-text)' : 'var(--border)'),
                        boxShadow: active === i ? '0 0 18px rgba(0,245,196,0.35)' : 'none' }}>{i + 1}</span>
                      {i < c.steps.length - 1 && !phone && <span style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', background: 'var(--accent-text)', transformOrigin: 'left', transform: i < active ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.6s ease' }} />
                      </span>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: active === i ? 'var(--accent-text)' : 'var(--text)', marginBottom: 4, transition: 'color 0.4s' }}>{s.title}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.55, color: active === i ? 'var(--text)' : 'var(--text2)' }}>{s.text}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 22, display: 'grid', gridTemplateColumns: phone ? '1fr' : 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>{c.scopeLabel}</p>
                {c.scope.map((row, i) => (
                  <Reveal key={row.title} from="left" dist={64} delay={i + 1} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 14, padding: '10px 0', borderBottom: i < c.scope.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span className="rfi-glass-icon" style={{ ...tile, color: `var(--ic-${i + 1})`, borderColor: `color-mix(in srgb, var(--ic-${i + 1}) 38%, transparent)` }}>{SCOPE_ICONS[i]}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{row.title}</div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text2)', marginTop: 2 }}>{row.text}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal from="right" dist={64} delay={2} style={{ height: '100%' }}>
                <div style={{ border: '1px solid var(--accent-text)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box', background: 'rgba(0,245,196,0.05)' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                    <span className="rfi-glass-icon" style={{ ...tile, width: 48, height: 48, color: 'var(--icon-doc)' }}>
                      <Icon size={26}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="14" y2="17" /></Icon>
                    </span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>{c.report.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text2)' }}>{c.report.sub}</div>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                    {c.report.items.map(item => (
                      <li key={item.title} style={{ display: 'flex', gap: 12 }}>
                        <span aria-hidden style={{ color: 'var(--accent-text)', fontWeight: 800, fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>✓</span>
                        <div>
                          <div style={{ fontSize: 15, lineHeight: 1.3, fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
                          <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text2)', marginTop: 3 }}>{item.text}</div>
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
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 16, alignSelf: 'stretch',
          }}>
            <Reveal from="right" dist={64} delay={1} style={{ flex: 1 }}>
              <InitialReviewFlow variant="embedded" />
            </Reveal>
          </div>
        </div>
        </div>

        {/* Evidence strip: the same three live figures as the ledger KPI row
            (AUDIT_HIGHLIGHTS + corpus-stats.json), never hand-typed numbers. */}
        <div style={{ maxWidth: 920, margin: '0 auto 40px', textAlign: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 14 }}>
            {kpis.map((k, i) => (
              <Reveal key={k.label} from={k.from} dist={56} delay={i}>
                <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '16px 12px', background: 'var(--glass-bg-solid)' }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--accent-text)', lineHeight: 1.1 }}>{k.n}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text2)', marginTop: 6 }}>{k.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={1}>
            <a href="/evidence/" onClick={e => { e.preventDefault(); onNavigateEvidence() }} style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>{c.evidenceCta}</a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
