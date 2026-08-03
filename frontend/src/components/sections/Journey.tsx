// "Customer Journey" section (`#journey`) - extracted verbatim from PublicSite.tsx.
import { useState, useEffect } from 'react'
import { TEAL, prefersReducedMotion, useMobile, Reveal } from './shared'

// ── Customer Journey timeline (stage2, 2026-08-02) ─────────────────────────────
// Post-sale delivery process, distinct from the pre-sale hero/pricing decision
// flow above it: what actually happens once a client has started, in the order
// it happens. Generic-but-honest professional-services structure (standard
// engagement lifecycle, not a fabricated specific claim) - one to two sentences
// per stage, grounded in language already used elsewhere in this file (delivery
// windows in the Pricing tiers, the five-question format in Evidence, the
// Methods/Disclosure principles in Investigation Principles, the "Optional
// Retest" output tag already offered on several tiers).
const JOURNEY_STEPS = [
  {
    stage: 'Kickoff',
    body: 'Scope gets locked, a named engineer is assigned, and whatever you\'re providing - a build, API access, a device - is exchanged through a secure channel. You know exactly who is doing the work and when it starts.',
  },
  {
    stage: 'Analyse',
    body: 'The investigation itself, run against the same Sources and Methods principles that apply to every client: source-level testing, root-cause tracing, nothing accepted that only one person can reproduce.',
  },
  {
    stage: 'Review',
    body: 'Every finding is triaged and ranked by severity before it reaches you, in the same five-part format documented in our Methodology - what we found, what proves it, how we proved it, how sure we are, what to do about it.',
  },
  {
    stage: 'Delivery',
    body: 'You receive the findings in the format your tier defines - plain-language summary first, technical detail underneath - on the delivery window agreed at checkout.',
  },
  {
    stage: 'Follow-up',
    body: 'Once fixes ship, a retest confirms they actually closed the gap, where the tier includes one. For ongoing engagements, follow-up is also where the next audit cycle begins.',
  },
] as const

// Auto-advances which stage reads as "current" (live feedback: a static timeline
// permanently pinned on step 1 looked stuck/broken, not like a process that
// actually flows). Same pattern as ProblemSolutionCarousel - pauses on hover,
// skips the timer under reduced-motion (stays on step 1, no forced motion).
function CustomerJourneyTimeline() {
  const mobile = useMobile()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = prefersReducedMotion()
  useEffect(() => {
    if (reduced || paused) return
    const t = setInterval(() => setActive(prev => (prev + 1) % JOURNEY_STEPS.length), 3200)
    return () => clearInterval(t)
  }, [reduced, paused])
  const current = reduced ? 0 : active
  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : `repeat(${JOURNEY_STEPS.length}, 1fr)`,
        gap: mobile ? 0 : 4,
      }}>
      {JOURNEY_STEPS.map((s, i) => (
        <Reveal key={s.stage} from={mobile ? 'left' : 'bottom'} delay={i}>
          <div onClick={() => setActive(i)} style={{
            position: 'relative', padding: mobile ? '0 0 28px 40px' : '0 16px',
            borderLeft: mobile ? `2px solid ${i === current ? TEAL : 'var(--border)'}` : 'none',
            marginLeft: mobile ? 8 : 0, cursor: 'pointer', transition: 'border-color 0.4s',
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
            <div style={{
              fontWeight: 900, fontSize: i === current ? 19 : 16,
              color: i === current ? '#ffffff' : 'var(--text2)',
              marginBottom: 8, marginTop: mobile ? 2 : 0, transition: 'font-size 0.4s, color 0.4s',
            }}>{s.stage}</div>
            <p style={{ color: i === current ? 'var(--text)' : 'var(--text3)', fontSize: 13, lineHeight: 1.8, margin: 0, transition: 'color 0.4s' }}>{s.body}</p>
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
  return (
    <section id="journey" style={{ padding: '100px 2rem' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <Reveal from="left">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>06 / Engagement Journey</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>what happens after you start</h2>
        </Reveal>
        <Reveal from="right" delay={1}>
          <p style={{ color: 'var(--text2)', marginBottom: 56, maxWidth: 640 }}>
            Same five stages whether the engagement is a one-week APK review or a year-round retainer. What changes between tiers is the depth and the timeline, never the order.
          </p>
        </Reveal>
        <CustomerJourneyTimeline />
      </div>
    </section>
  )
}
