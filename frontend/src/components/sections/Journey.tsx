// "Customer Journey" section (`#journey`) - extracted verbatim from PublicSite.tsx.
import { useState, useEffect } from 'react'
import { TEAL, prefersReducedMotion, useMobile, Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

// Auto-advances which stage reads as "current" (live feedback: a static timeline
// permanently pinned on step 1 looked stuck/broken, not like a process that
// actually flows). Same pattern as ProblemSolutionCarousel - pauses on hover,
// skips the timer under reduced-motion (stays on step 1, no forced motion).
function CustomerJourneyTimeline() {
  const { t } = useLocale()
  const steps = t.journey.steps
  const mobile = useMobile()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = prefersReducedMotion()
  useEffect(() => {
    if (reduced || paused) return
    const timer = setInterval(() => setActive(prev => (prev + 1) % steps.length), 3200)
    return () => clearInterval(timer)
  }, [reduced, paused, steps.length])
  const current = reduced ? 0 : active
  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : `repeat(${steps.length}, 1fr)`,
        gap: mobile ? 0 : 14,
      }}>
      {steps.map((s, i) => (
        <Reveal key={s.stage} from={mobile ? 'left' : 'bottom'} delay={i}>
          {/* Solid backing added 2026-08-06 (spine feedback): these step columns
              sit directly on the page background with nothing behind them, and
              with 5 equal columns the middle one straddles the page's
              horizontal center where the spine/orb live. Padding + a matching
              negative margin keep the column's content pixel-aligned with
              before - only the panel is new. */}
          <div onClick={() => setActive(i)} style={{
            position: 'relative', padding: mobile ? '0 0 28px 40px' : '18px 16px',
            background: mobile ? undefined : 'var(--glass-bg-solid)',
            borderRadius: mobile ? undefined : 10,
            border: mobile ? 'none' : `1px solid ${i === current ? TEAL : 'var(--border)'}`,
            borderLeft: mobile ? `2px solid ${i === current ? TEAL : 'var(--border)'}` : undefined,
            marginLeft: mobile ? 8 : undefined, cursor: 'pointer', transition: 'border-color 0.4s',
            height: mobile ? undefined : '100%', boxSizing: 'border-box',
          }}>
            {!mobile && (
              <div style={{
                height: 3, borderRadius: 2, marginBottom: 22,
                background: i === current ? TEAL : 'var(--border)', transition: 'background 0.4s',
              }} />
            )}
            <div style={{
              position: mobile ? 'absolute' : 'static', left: mobile ? -21 : undefined, top: mobile ? -2 : undefined,
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i === current ? TEAL : 'rgba(255,255,255,0.06)',
              border: `1px solid ${i === current ? TEAL : 'var(--border)'}`,
              color: i === current ? '#070711' : 'var(--text2)',
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 12.5,
              marginBottom: mobile ? 0 : 14, transition: 'background 0.4s, border-color 0.4s, color 0.4s',
            }}>{i + 1}</div>
            {/* Active stage reads noticeably bolder/brighter than the rest (live
                feedback: all five looked identical, so nothing signalled "you are
                here" without staring at the small number badge). */}
            {/* Was fontSize 16 -> 19 with a font-size transition. font-size is a LAYOUT
                property, and this timeline auto-advances every 3.2s, so it reflowed the
                stage column and every paragraph beneath it twenty times a minute. Fixed
                size with a compositor-only scale is visually equivalent and free. */}
            <div style={{
              fontWeight: 900, fontSize: 19,
              transform: i === current ? 'scale(1)' : 'scale(0.84)',
              transformOrigin: 'left center',
              color: i === current ? 'var(--text)' : 'var(--text2)',
              marginBottom: 8, marginTop: mobile ? 2 : 0,
              transition: 'transform 420ms cubic-bezier(0.16,1,0.3,1), color 200ms cubic-bezier(0.4,0,0.2,1)',
            }}>{s.stage}</div>
            {/* Split into two shorter paragraphs instead of one dense block, and
                bumped up a size, per live feedback - easier to scan at a glance. */}
            {s.body.split('\n\n').map((para, pi) => (
              <p key={pi} style={{ color: i === current ? 'var(--text)' : 'var(--text3)', fontSize: 14, lineHeight: 1.8, margin: pi === 0 ? '0 0 10px' : 0, transition: 'color 0.4s' }}>{para}</p>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

// CUSTOMER JOURNEY - stage2 (2026-08-02). Distinct from the pre-sale
// hero/pricing decision flow above: this is what happens AFTER a client
// has started, in order. Sits right after Pricing (you now know what it
// costs) and right before Evidence (here's proof of the quality of the
// work you just read the process for).
export function JourneySection() {
  const { t } = useLocale()
  return (
    <section id="journey" style={{ padding: '48px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="left">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>{t.journey.eyebrow}</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}><ScrambleHeading text={t.journey.heading} /></h2>
        </Reveal>
        <Reveal from="right" delay={1}>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 640 }}>
            {t.journey.subheading}
          </p>
        </Reveal>
        <CustomerJourneyTimeline />
      </div>
    </section>
  )
}
