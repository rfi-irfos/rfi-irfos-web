// "App Privacy" door-opener section (`#app-privacy`) - extracted verbatim from
// PublicSite.tsx.
import { Reveal, TEAL } from './shared'

// APP PRIVACY DOOR-OPENER — Stage 1c (website-repositioning plan), moved
// here after Track Record per live feedback: the pitch reads better once
// a visitor has already seen the ledger of real, disclosed findings,
// rather than immediately after the hero before any proof exists.
export function AppPrivacySection({ mobile }: { mobile: boolean }) {
  return (
    <section id="app-privacy" style={{ padding: '100px 2rem', background: 'rgba(0,245,196,0.03)' }}>
      {/* maxWidth matched to the neighboring Track Record/Pricing sections (1320,
          not 1000) - live feedback: the narrower container made this section's
          left edge sit further right than the sections directly above/below it. */}
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="left">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>04 / Start Here</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>does your app really protect user data?</h2>
        </Reveal>
        <Reveal from="right" delay={1}>
          <p style={{ color: 'var(--text2)', marginBottom: 40, maxWidth: 680, fontSize: 15, lineHeight: 1.9 }}>
            Most teams believe the answer is yes, because the app passes whatever checklist it was built against. What it actually does once it's running — which SDKs it talks to, where the data ends up, whether tracking starts before anyone consents — is a separate question, and often a different answer. This is usually the easiest place to start, because the question itself is easy to ask.
          </p>
        </Reveal>
        <Reveal from="bottom" delay={1}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 24, marginBottom: 40 }}>
            <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 16, background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontWeight: 800, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-text)', marginBottom: 14 }}>What we check</div>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.9 }}>
                Permissions actually requested and used, where data flows once it leaves the device, which third-party SDKs are embedded and what they receive, and when tracking behaviour actually starts relative to consent.
              </p>
            </div>
            <div style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 16, background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontWeight: 800, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-text)', marginBottom: 14 }}>What you get</div>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.9 }}>
                A data flow map of what the app actually does, a risk analysis of what that means for you, and the underlying findings behind both — in plain language first, technical detail available underneath.
              </p>
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
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>Talk to us about your app</a>
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
