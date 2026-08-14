// "App Privacy" door-opener section (`#app-privacy`) - extracted verbatim from
// PublicSite.tsx.
import { Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

// APP PRIVACY DOOR-OPENER — Stage 1c (website-repositioning plan), moved
// here after Track Record per live feedback: the pitch reads better once
// a visitor has already seen the ledger of real, disclosed findings,
// rather than immediately after the hero before any proof exists.
export function AppPrivacySection() {
  const { t } = useLocale()
  // Own flat tint removed (live feedback 2026-08-14: liked the extra hair of
  // contrast enough to want it page-wide, not just here) - now part of the
  // page-wide backdrop gradient in PublicSite.tsx, so it stays uniform
  // instead of this one section reading slightly darker than its neighbors.
  return (
    <section id="app-privacy" style={{ padding: '48px 2rem 72px' }}>
      {/* maxWidth matched to the neighboring Track Record/Pricing sections (1320,
          not 1000) - live feedback: the narrower container made this section's
          left edge sit further right than the sections directly above/below it. */}
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="left">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{t.appPrivacy.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}><ScrambleHeading text={t.appPrivacy.heading} /></h2>
        </Reveal>
        <Reveal from="right" delay={1}>
          <p style={{ color: 'var(--text)', marginBottom: 40, maxWidth: 680, fontSize: 16, lineHeight: 1.9 }}>
            {t.appPrivacy.paragraph}
          </p>
        </Reveal>
        {/* Replaced the "What we check / What you get" two-card block with a
            direct comparison table (live feedback: the two cards read as too
            soft/abstract - a side-by-side contrast lands harder). Framed as two
            APPROACHES, not naming a competitor, same non-disparagement rule as
            the rest of the site's differentiation language. */}
        {/* Table narrowed to 920 and auto-margined ("middle/center aligned table" feedback,
            asked for twice). Centering the section's heading/intro while leaving the table at
            the full 1320 container width was not what was meant - the table still ran edge to
            edge under a centered heading. Cell text stays left-aligned on purpose: centered
            cells read as a poster, not as a side-by-side comparison.
            Header size 11 -> 13: the weight was already 800, but index.html loads JetBrains
            Mono at wght@400;500;600;700 only, so 800 silently falls back to 700 and cannot
            render any heavier. Size is the lever that actually adds visibility here. */}
        <Reveal from="bottom" delay={1}>
          {/* background: var(--glass-bg-solid) added (live feedback 2026-08-14: this
              table had no fill of its own, so on light theme it sat directly over the
              page's busy marble photo and was hard to read) - same solid-card token the
              Research bento tiles use for exactly this "readable over the photo
              backdrop" job. */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 40, maxWidth: 920, marginLeft: 'auto', marginRight: 'auto', background: 'var(--glass-bg-solid)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.06)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text)', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>{t.appPrivacy.comparisonClassicLabel}</div>
              <div style={{ padding: '16px 24px', background: 'rgba(0,245,196,0.08)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-text)', borderBottom: '1px solid var(--border)' }}>{t.appPrivacy.comparisonRfiLabel}</div>
              {t.appPrivacy.comparisonRows.map((row, i) => (
                <div key={i} style={{ display: 'contents' }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', fontSize: 14, color: 'var(--text2)', borderRight: '1px solid var(--border)', borderBottom: i < t.appPrivacy.comparisonRows.length - 1 ? '1px solid var(--border)' : 'none' }}>{row.classic}</div>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', fontSize: 14, fontWeight: 700, color: 'var(--text)', borderBottom: i < t.appPrivacy.comparisonRows.length - 1 ? '1px solid var(--border)' : 'none' }}>{row.rfi}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal from="bottom" delay={2}>
          <div style={{ textAlign: 'center', marginBottom: 0 }}>
            {/* Orange instead of the site's teal (live feedback 2026-08-14: one
                singular, orange CTA here) - deliberately off-brand-teal so this one
                button reads as a distinct "send us something" action, not just another
                teal link blending into the rest of the page. Domino icon: one tile
                leaning hard into the next, which leans into the last upright one - a
                signal setting off a chain, matching the CTA copy. */}
            <a href="#submit" className="rfi-cta-pulse" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, background: '#f97316', color: '#1a0f00', padding: '13px 30px', borderRadius: 8,
              fontWeight: 800, fontSize: 13, textDecoration: 'none', letterSpacing: '0.07em',
              textTransform: 'uppercase', transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="27" x2="30" y2="27" />
                <rect x="4" y="8" width="6" height="18" rx="1.5" transform="rotate(38 7 26)" />
                <rect x="13" y="8" width="6" height="18" rx="1.5" transform="rotate(18 16 26)" />
                <rect x="22" y="6" width="6" height="20" rx="1.5" />
              </svg>
              {t.appPrivacy.cta}
            </a>
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
