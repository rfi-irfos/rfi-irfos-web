// "App Privacy" door-opener section (`#app-privacy`) - extracted verbatim from
// PublicSite.tsx.
import { Reveal, TEAL } from './shared'
import { useLocale } from '../../hooks/useLocale'

// APP PRIVACY DOOR-OPENER — Stage 1c (website-repositioning plan), moved
// here after Track Record per live feedback: the pitch reads better once
// a visitor has already seen the ledger of real, disclosed findings,
// rather than immediately after the hero before any proof exists.
export function AppPrivacySection() {
  const { t } = useLocale()
  return (
    <section id="app-privacy" style={{ padding: '100px 2rem', background: 'rgba(0,245,196,0.03)' }}>
      {/* maxWidth matched to the neighboring Track Record/Pricing sections (1320,
          not 1000) - live feedback: the narrower container made this section's
          left edge sit further right than the sections directly above/below it. */}
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="left">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{t.appPrivacy.eyebrow}</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>{t.appPrivacy.heading}</h2>
        </Reveal>
        <Reveal from="right" delay={1}>
          <p style={{ color: 'var(--text2)', marginBottom: 40, maxWidth: 680, fontSize: 15, lineHeight: 1.9 }}>
            {t.appPrivacy.paragraph}
          </p>
        </Reveal>
        {/* Replaced the "What we check / What you get" two-card block with a
            direct comparison table (live feedback: the two cards read as too
            soft/abstract - a side-by-side contrast lands harder). Framed as two
            APPROACHES, not naming a competitor, same non-disparagement rule as
            the rest of the site's differentiation language. */}
        <Reveal from="bottom" delay={1}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.06)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text)', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>{t.appPrivacy.comparisonClassicLabel}</div>
              <div style={{ padding: '16px 24px', background: 'rgba(0,245,196,0.08)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-text)', borderBottom: '1px solid var(--border)' }}>{t.appPrivacy.comparisonRfiLabel}</div>
              {t.appPrivacy.comparisonRows.map((row, i) => (
                <div key={i} style={{ display: 'contents' }}>
                  <div style={{ padding: '18px 24px', fontSize: 14, color: 'var(--text2)', borderRight: '1px solid var(--border)', borderBottom: i < t.appPrivacy.comparisonRows.length - 1 ? '1px solid var(--border)' : 'none' }}>{row.classic}</div>
                  <div style={{ padding: '18px 24px', fontSize: 14, fontWeight: 700, color: 'var(--text)', borderBottom: i < t.appPrivacy.comparisonRows.length - 1 ? '1px solid var(--border)' : 'none' }}>{row.rfi}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal from="bottom" delay={2}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <a href="#submit" className="rfi-cta-pulse" style={{
              display: 'inline-block', background: TEAL, color: '#070711', padding: '13px 30px', borderRadius: 8,
              fontWeight: 800, fontSize: 13, textDecoration: 'none', letterSpacing: '0.07em',
              textTransform: 'uppercase', transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>{t.appPrivacy.cta}</a>
          </div>
        </Reveal>
        {/* "Beyond app privacy" (OTHER_DOMAINS grid) + the closing "same three
            services" line removed entirely per live feedback - redundant with
            Research Areas / the Investigate-Assess-Monitor hierarchy already
            explained elsewhere on the page. */}
      </div>
    </section>
  )
}
