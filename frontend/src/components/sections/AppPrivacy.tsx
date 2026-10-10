// "What we do best" door-opener (`#app-privacy`, id kept for existing anchors).
// Rebuilt 2026-10-10: the former World Model comparison table became one panel
// that mirrors the outreach pitch (process, scope, evidence, trust) so a visitor
// arriving from the mail finds the same offer in the same order. The frame is
// static and every cell reveals on its own (same converge-from-the-sides pattern
// as the old table), because one Reveal around the whole panel is barely visible.
import { useState } from 'react'
import { Reveal, useMobile } from './shared'
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
  <Icon key="db"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0" /></Icon>,
  <Icon key="shield"><path d={SHIELD} /></Icon>,
]

const TRUST_ICONS = [
  <Icon key="a" size={30}><path d={SHIELD} /><polyline points="9 12 11 14 15 10" /></Icon>,
  <Icon key="b" size={30}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Icon>,
  <Icon key="c" size={30}><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></Icon>,
]

const tile = { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,245,196,0.10)', color: 'var(--accent-text)', flexShrink: 0 } as const

export function AppPrivacySection({ onNavigateEvidence }: { onNavigateEvidence: () => void }) {
  const { t } = useLocale()
  const c = t.appPrivacy
  const stacked = useMobile(900)
  const phone = useMobile(640)
  const [active, setActive] = useState(0)
  const kpis = [
    { n: `${AUDIT_HIGHLIGHTS.length}+`, label: t.trackRecord.kpis.appsAudited, from: 'left' as const },
    { n: `${(corpusStats.smaliClassesTotal / 1e6).toFixed(2)}M+`, label: t.trackRecord.kpis.smaliClasses, from: 'bottom' as const },
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
          <p style={{ color: 'var(--text)', marginBottom: 40, maxWidth: 680, fontSize: 16, lineHeight: 1.9, textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>{c.paragraph}</p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : 'minmax(0, 1fr) 320px', gap: stacked ? 28 : 44, maxWidth: 1320, margin: '0 auto 56px' }}>
          {/* Left: ONE framed card holding process, scope and evidence (frame static, cells reveal) */}
          <div style={{ minWidth: 0, border: '1px solid var(--border)', borderRadius: 20, padding: phone ? 18 : 28, background: 'var(--glass-bg-solid)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: phone ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 18, marginBottom: 28, alignItems: 'start' }}>
              {c.steps.map((s, i) => (
                <Reveal key={s.title} from="bottom" dist={48} delay={i}>
                  <div role="button" tabIndex={0} onClick={() => setActive(i)} aria-pressed={active === i}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i) } }}
                    style={{ cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0, transition: 'all 0.2s',
                        background: active === i ? 'var(--accent-text)' : 'var(--bg2)', color: active === i ? '#02110d' : 'var(--text2)',
                        border: '1px solid ' + (active === i ? 'var(--accent-text)' : 'var(--border)'),
                        boxShadow: active === i ? '0 0 18px rgba(0,245,196,0.35)' : 'none' }}>{i + 1}</span>
                      {i < c.steps.length - 1 && !phone && <span style={{ flex: 1, height: 2, background: i < active ? 'var(--accent-text)' : 'var(--border)' }} />}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.55, color: active === i ? 'var(--text)' : 'var(--text2)' }}>{s.text}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 22, display: 'grid', gridTemplateColumns: phone ? '1fr' : 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: 24 }}>
              <div>
                <p style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>{c.scopeLabel}</p>
                {c.scope.map((row, i) => (
                  <Reveal key={row.title} from="left" dist={64} delay={i + 1}>
                    <div style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: i < c.scope.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={tile}>{SCOPE_ICONS[i]}</span>
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
                    <span style={{ ...tile, width: 48, height: 48 }}>
                      <Icon size={26}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="14" y2="17" /></Icon>
                    </span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>{c.report.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text2)' }}>{c.report.sub}</div>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', margin: '0 0 18px', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
                    {c.report.items.map(item => (
                      <li key={item} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.4, color: 'var(--text)' }}>
                        <span aria-hidden style={{ color: 'var(--accent-text)', fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>✓</span>{item}
                      </li>
                    ))}
                  </ul>
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: 'auto', paddingTop: 14 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text3)' }}>{c.report.freeLabel}</div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', margin: '2px 0 4px' }}>{c.report.freeTitle}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text2)' }}>{c.report.freeText}</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right: unframed trust points, thin rule, then the single call to action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignSelf: stacked ? 'stretch' : 'center' }}>
            {c.trust.map((item, i) => (
              <Reveal key={item.title} from="right" dist={64} delay={i + 1}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ color: 'var(--accent-text)', flexShrink: 0 }}>{TRUST_ICONS[i]}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)', marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--text2)' }}>{item.text}</div>
                  </div>
                </div>
              </Reveal>
            ))}
            <div style={{ borderTop: '1px solid var(--border)' }} />
            <Reveal from="bottom" dist={48} delay={4}>
              <a href="#submit" className="rfi-cta-pulse" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f97316', color: '#1a0f00', padding: '13px 22px', borderRadius: 10, fontWeight: 800, fontSize: 13, textDecoration: 'none', letterSpacing: '0.07em', textTransform: 'uppercase', textAlign: 'center' }}>{c.cta} →</a>
            </Reveal>
          </div>
        </div>

        {/* Evidence strip: the same three live figures as the ledger KPI row
            (AUDIT_HIGHLIGHTS + corpus-stats.json), never hand-typed numbers. */}
        <div style={{ maxWidth: 920, margin: '0 auto 40px', textAlign: 'center' }}>
          <Reveal>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>{c.evidenceHeading}</h3>
          </Reveal>
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
            <p style={{ fontSize: 12.5, color: 'var(--text3)', marginBottom: 12 }}>{c.evidenceNote}</p>
            <a href="/evidence/" onClick={e => { e.preventDefault(); onNavigateEvidence() }} style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>{c.evidenceCta}</a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
