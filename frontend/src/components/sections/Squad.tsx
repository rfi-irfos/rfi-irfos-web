// "The Squad" / "Kader" page (`#squad`, nav slot between World Model and Data
// Solutions). Showcases the 8 DINGIR agents as a product, not a "meet the team"
// page: each agent gets its own mission, monitors/detects/output, and its own
// "Request Access" entry point. All 8 are badged "Early Access" uniformly (Gate
// 6/11, final tests pending) - never "Live"/"Active", to avoid overclaiming.
//
// Deliberately does NOT duplicate World Model's real corpus numbers (would drift
// out of sync across two pages) and does NOT show a "recent signals" feed with
// fictional company names (the original mockup's placeholder data).
import { useState, type CSSProperties, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  IconTrendingUp, IconCoin, IconGitCompare, IconCircleCheck, IconSearch, IconShieldLock,
  IconDatabase, IconPlug, IconTerminal2, IconRobot, IconWorld,
  IconSend, IconCpu,
} from '@tabler/icons-react'
import { useLocale } from '../../hooks/useLocale'
import { Reveal, useMobile, beacon, WEB3FORMS_KEY, OUTPUT_TAG_HUES } from './shared'
import { SQUAD_AGENTS, agentByKey, type AgentKey } from '../../content/squadAgents'
import squadHeroWorkflow from '../../assets/squad/sq-hero-agent-workflow.mp4'

const NEED_TO_KNOW_ICONS = [IconTrendingUp, IconCoin, IconGitCompare, IconCircleCheck, IconSearch, IconShieldLock]

// Icons are locale-independent (module-level, matches the SQUAD_AGENTS convention
// in content/squadAgents.ts) - one icon per step, keyed by a stable id so content/
// en.ts+de.ts only carry title/body text, never JSX.
const HIC_STEP_ICONS: Record<string, typeof IconDatabase> = {
  data: IconDatabase, mcp: IconPlug, cli: IconTerminal2, hub: IconCpu,
  process: IconRobot, crosscheck: IconWorld, deliver: IconSend, act: IconCircleCheck,
}

type SquadForm = { email: string; botcheck: string; interest: AgentKey[] }
type FormState = 'idle' | 'sending' | 'ok' | 'err'

export function SquadSection() {
  const [selectedKey, setSelectedKey] = useState<AgentKey>('atlas')
  const [form, setForm] = useState<SquadForm>({ email: '', botcheck: '', interest: [] })
  const [formState, setFormState] = useState<FormState>('idle')
  const mobile = useMobile(768)

  function requestAccess(agentKeys: AgentKey[]) {
    setForm(f => ({ ...f, interest: agentKeys }))
    beacon('squad_request_access_click', { agents: agentKeys.join(',') || 'general' })
    requestAnimationFrame(() => {
      document.getElementById('squad-request-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      document.getElementById('squad-request-email')?.focus()
    })
  }

  return (
    <>
      <SquadHero onRequestAccess={() => requestAccess([])} />
      <SquadOverview mobile={mobile} selectedKey={selectedKey} setSelectedKey={setSelectedKey} onRequestAccess={requestAccess} />
      <HowItConnects />
      <SquadNeedToKnow onRequestAccess={requestAccess} />
      <SquadRequestForm form={form} setForm={setForm} formState={formState} setFormState={setFormState} />
    </>
  )
}

function SquadHero({ onRequestAccess }: { onRequestAccess: () => void }) {
  const { t } = useLocale()
  const s = t.squad
  return (
    <section className="sq-hero wm-section">
      <div className="wm-wrap sq-hero-grid">
        <Reveal>
          <h1 className="sq-heading">{s.heading}</h1>
          <p className="sq-subheading">{s.subheading}</p>
          <p className="sq-intro">{s.intro}</p>
          <div className="sq-hero-ctas">
            <button type="button" className="wm-btn-primary" onClick={onRequestAccess}>{s.primaryCta}</button>
            {/* Was a plain text link above the buttons + a separate "Watch an
                agent run" ghost button below them (live feedback 2026-09-13:
                inconsistent with World Model's own hero, which pairs one
                primary and one secondary button side by side - "Explore" +
                "Request API access"). Reuses that same two-button shape here:
                this real link-as-button replaces both. */}
            <a href="/world-model/" className="wm-btn-secondary">{s.worldModelLinkLabel}</a>
          </div>
          <p className="sq-status-line"><span className="sq-status-dot" />{s.statusLine}</p>
        </Reveal>
        <Reveal from="right">
          <div className="sq-hub-panel">
            {/* Swapped from a static screenshot to a real screencast of the agent
                workflow builder in motion (Simeon, 2026-09-13) - autoplay/muted/
                loop/playsInline is required for iOS Safari to autoplay at all;
                no controls, this is a hero backdrop, not a media player. */}
            <video className="sq-hub-photo" src={squadHeroWorkflow} autoPlay muted loop playsInline />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SquadOverview({
  mobile, selectedKey, setSelectedKey, onRequestAccess,
}: {
  mobile: boolean
  selectedKey: AgentKey
  setSelectedKey: (k: AgentKey) => void
  onRequestAccess: (keys: AgentKey[]) => void
}) {
  const { t } = useLocale()
  const s = t.squad
  const selected = agentByKey(selectedKey)
  const content = s.agents[selectedKey]
  const SelectedIcon = selected.icon

  return (
    <section id="squad-overview" className="sq-overview wm-section">
      <div className="wm-wrap">
        <Reveal><div className="wm-section-head"><p className="wm-eyebrow">{s.overview.eyebrow}</p><h2>{s.overview.heading}</h2><p>{s.overview.sub}</p></div></Reveal>
        <div className={mobile ? 'sq-overview-mobile sq-overview-frame' : 'sq-overview-grid sq-overview-frame'}>
          {mobile ? (
            <div className="sq-chip-row">
              {SQUAD_AGENTS.map(a => (
                <button
                  key={a.key}
                  type="button"
                  className={a.key === selectedKey ? 'sq-chip sq-chip--active' : 'sq-chip'}
                  style={{ borderColor: a.key === selectedKey ? a.color : undefined }}
                  onClick={() => setSelectedKey(a.key)}
                >
                  <a.icon size={14} color={a.color} />
                  {a.name}
                </button>
              ))}
            </div>
          ) : (
            <ul className="sq-agent-list">
              {SQUAD_AGENTS.map(a => (
                <li key={a.key}>
                  <button
                    type="button"
                    className={a.key === selectedKey ? 'sq-agent-row sq-agent-row--active' : 'sq-agent-row'}
                    style={{ borderColor: a.key === selectedKey ? a.color : undefined, '--row-color': a.color } as CSSProperties}
                    onClick={() => setSelectedKey(a.key)}
                  >
                    <span className="rfi-glass-icon" style={{ width: 44, height: 44, borderRadius: 12, borderColor: `color-mix(in srgb, ${a.color} 32%, rgba(255,255,255,0.14))` }}><a.icon size={22} color={a.color} /></span>
                    <span className="sq-agent-row-text">
                      <strong>{a.name}</strong>
                      {/* Job title only (live feedback: sidebar stays icon + name
                          + title, e.g. "Strategic Operations Lead" for Atlas -
                          the full "X is the agent you call when..." description
                          belongs exclusively in the detail panel on the right). */}
                      <span>{s.agents[a.key].jobTitle}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="sq-spec-sheet wm-card">
            {/* Fade the new agent in on key change, deliberately WITHOUT
                AnimatePresence. The first cut used AnimatePresence mode="wait",
                which only mounts the incoming child once the outgoing one
                reports its exit animation complete - that callback never fired
                here, so the sheet froze on ATLAS while the sidebar highlight
                moved (caught by measuring: sidebar active index 3, sheet still
                showing ATLAS, on a hard reload). Keying a plain motion.div lets
                React swap the subtree immediately and the new content fades in,
                which is smooth and cannot deadlock on an exit callback. */}
              <motion.div
                key={selectedKey}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className="sq-spec-head">
                  <SelectedIcon size={22} color={selected.color} />
                  <h3>{selected.name}</h3>
                  <span className="sq-pill" style={{ borderColor: selected.color, color: selected.color }}>{s.statusLine}</span>
                </div>
                <p className="sq-spec-desc">{content.description}</p>
                <div className="sq-spec-stack">
                  <div className="sq-spec-panel">
                    <h4><span className="sq-tag sq-tag--column">{s.overview.columns.monitors}</span></h4>
                    <ul>{content.monitors.map(m => <li key={m}>{m}</li>)}</ul>
                  </div>
                  <div className="sq-spec-panel">
                    <h4><span className="sq-tag sq-tag--column">{s.overview.columns.detects}</span></h4>
                    <ul>{content.detects.map(d => <li key={d}>{d}</li>)}</ul>
                  </div>
                  <div className="sq-spec-panel">
                    <h4><span className="sq-tag sq-tag--column">{s.overview.columns.output}</span></h4>
                    <ul>{content.output.map(o => <li key={o}>{o}</li>)}</ul>
                  </div>
                </div>
              </motion.div>
            {/* Fixed trust badges, same three regardless of which agent is selected
                (not per-agent content like the three columns above) - live feedback:
                three green checkmarks right above the CTA, separate from the "You
                get" list. */}
            <ul className="sq-trust-badges">
              {s.trustBadges.map(badge => <li key={badge}><IconCircleCheck size={14} />{badge}</li>)}
            </ul>
            <button type="button" className="wm-btn-primary" onClick={() => onRequestAccess([selectedKey])}>
              {s.primaryCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Fixed pixel layout for the flow diagram below (viewBox 0 0 1200 480) - box
// positions and which arrow connects to which are hardcoded here (not
// translatable, only the box content is), keyed by the same icon id used in
// content/en.ts+de.ts howItConnects.zones[].steps[].icon. Rejected cuts, in
// order (live feedback quoted): 2026-09-07 "this is a disjointed element...
// an actual diagram" (four cards + a chevron, no visible wiring); 2026-10-14
// "lame... ohne clickable popups, lieber den text in der box" (click-to-reveal
// detail popovers); 2026-10-14 "should it be not 5 boxes total..? cause the
// agent os is a standalone thingy" -> "5 gleichwertige zonen" (Agent OS
// crammed into the same zone as its entry points); 2026-10-14 "lets delete
// dashboard and control, cause the agent OS is the dashboard and the
// control... and the agent os i the direct neighbor of your sytems" - deleted
// the Dashboard & Control box entirely and moved Agent OS to sit right next
// to Your Systems, pushing Connect (now just MCP, CLI) out to zone 3. Five
// equal-width zones - Your Systems, Agent OS (standalone hub), Connect (the
// two remaining entry points), The Squad, Verified Delivery - full title+body
// text in every box. The hub<->squad hand-off now arcs over/under Connect's
// boxes instead of routing through them: delegate out through the zone's top
// margin, verified results back through its bottom margin.
const HIC_BOX: Record<string, { x: number; y: number; w: number; h: number }> = {
  data:       { x: 25,   y: 135, w: 190, h: 130 },
  hub:        { x: 265,  y: 135, w: 190, h: 130 },
  mcp:        { x: 505,  y: 80,  w: 190, h: 110 },
  cli:        { x: 505,  y: 210, w: 190, h: 110 },
  process:    { x: 745,  y: 80,  w: 190, h: 110 },
  crosscheck: { x: 745,  y: 210, w: 190, h: 110 },
  deliver:    { x: 985,  y: 80,  w: 190, h: 110 },
  act:        { x: 985,  y: 210, w: 190, h: 110 },
}
const HIC_ZONE_BANDS = [
  { x: 10,  w: 220 },
  { x: 250, w: 220 },
  { x: 490, w: 220 },
  { x: 730, w: 220 },
  { x: 970, w: 220 },
]
// Explicit orthogonal waypoints per arrow, NOT computed diagonals (live feedback
// 2026-09-07: "welcher pfeil geht wohin... diesen chaotischen pfeilen... lieber
// eckige pfeile machen, mit 90 grad kanten"). Every segment is strictly
// horizontal or vertical, fan-out/fan-in share one bus per junction so
// convergence reads as a single point instead of crossing lines. `return: true`
// marks the hub<->squad result arrow so it renders dashed, visually distinct
// from the forward/delegation arrows without being mistaken for the big
// feedback loop at the bottom. `dashed: true` marks the hub->squad delegation
// arrow itself as dashed too (live feedback 2026-10-14), so both legs of the
// Agent OS <-> Squad hand-off read as a matched pair against the solid
// entry-point arrows. `delay` groups arrows into pipeline stages so a pulse
// visibly splits/merges at each junction instead of staggering box by box.
const HIC_ARROWS: { id: string; pts: [number, number][]; delay: number; feedback?: boolean; return?: boolean; dashed?: boolean }[] = [
  { id: 'data-hub',        pts: [[215, 200], [265, 200]], delay: 0 },
  { id: 'hub-mcp',         pts: [[455, 200], [480, 200], [480, 135], [505, 135]], delay: 0.6 },
  { id: 'hub-cli',         pts: [[455, 200], [480, 200], [480, 265], [505, 265]], delay: 0.6 },
  { id: 'hub-process',     pts: [[455, 175], [470, 175], [470, 40], [720, 40], [720, 135], [745, 135]], delay: 1.2, dashed: true },
  { id: 'process-cross',   pts: [[840, 190], [840, 210]], delay: 1.7 },
  { id: 'cross-hub',       pts: [[745, 265], [720, 265], [720, 360], [470, 360], [470, 225], [455, 225]], delay: 2.1, return: true },
  { id: 'cross-deliver',   pts: [[935, 265], [960, 265], [960, 135], [985, 135]], delay: 2.1 },
  { id: 'deliver-act',     pts: [[1080, 190], [1080, 210]], delay: 2.6 },
  { id: 'act-data',        pts: [[1080, 320], [1080, 440], [120, 440], [120, 265]], delay: 3, feedback: true },
]

// Real technical diagram (live feedback 2026-09-07, reference: a Dialogflow-style
// architecture diagram with colored zones, numbered steps, connected icon boxes).
// Four zones left to right (your systems -> agent os -> the squad -> verified
// delivery), zone numbered 01-04, every box wired by right-angled arrows to the
// box(es) it hands off to - full title + body text sits directly in each box
// rather than behind a click (live feedback 2026-10-14, see layout comment
// above for the rejected cuts this replaces).
function HowItConnects() {
  const { t } = useLocale()
  const s = t.squad.howItConnects
  const allSteps = s.zones.flatMap(z => z.steps)
  const stepById = (id: string) => allSteps.find(st => st.icon === id)
  return (
    <section id="sq-connects" className="sq-connects wm-section">
      <div className="wm-wrap">
        <Reveal><div className="wm-section-head"><p className="wm-eyebrow">{s.eyebrow}</p><h2>{s.heading}</h2><p>{s.sub}</p></div></Reveal>
        <Reveal>
          <div className="hic-diagram">
            <div className="hic-canvas">
            <svg viewBox="0 0 1200 480" className="hic-svg" role="img" aria-label={s.heading}>
              <defs>
                <marker id="hic-arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 Z" fill="var(--accent-text)" />
                </marker>
              </defs>
              {HIC_ZONE_BANDS.map((band, zi) => (
                <g key={band.x}>
                  {/* Solid base under the tint - without it the page's own plexus
                      background bleeds through the translucent hue and the whole
                      diagram reads as washed out (live feedback: "opacity
                      terrible"). */}
                  <rect x={band.x} y="0" width={band.w} height="400" rx="14" fill="var(--bg)" />
                  <rect x={band.x} y="0" width={band.w} height="400" rx="14"
                    fill={OUTPUT_TAG_HUES[zi % OUTPUT_TAG_HUES.length].bg}
                    stroke={OUTPUT_TAG_HUES[zi % OUTPUT_TAG_HUES.length].border} strokeWidth="1" />
                </g>
              ))}
              {s.zones.map((zone, zi) => (
                <text key={zone.label} x={HIC_ZONE_BANDS[zi].x + HIC_ZONE_BANDS[zi].w / 2} y="28"
                  textAnchor="middle" fontSize="11.5" fontWeight="800" letterSpacing="0.1em"
                  fill="var(--text2)">{`${String(zi + 1).padStart(2, '0')} · ${zone.label.toUpperCase()}`}</text>
              ))}
              {HIC_ARROWS.map(a => (
                <polyline key={a.id} points={a.pts.map(p => p.join(',')).join(' ')}
                  fill="none" stroke="var(--accent-text)"
                  strokeWidth={a.feedback ? 1.5 : 2}
                  strokeDasharray={a.feedback || a.return || a.dashed ? '5 5' : undefined}
                  strokeLinejoin="round" strokeLinecap="round"
                  opacity={a.feedback ? 0.5 : a.return ? 0.7 : 0.9}
                  markerEnd="url(#hic-arrowhead)" />
              ))}
              {/* Travelling pulse per arrow, showing direction of flow. pathLength
                  normalises every polyline to 100 units, so one shared dash
                  pattern moves at the same visual speed on a short arrow and a
                  long one. Staggered so the pulse propagates left to right
                  through the pipeline instead of all arrows firing at once. */}
              {HIC_ARROWS.map(a => (
                <polyline key={`pulse-${a.id}`} points={a.pts.map(p => p.join(',')).join(' ')}
                  pathLength={100} className="hic-pulse"
                  style={{ animationDelay: `${a.delay}s` }} />
              ))}
              {Object.entries(HIC_BOX).map(([id, b]) => {
                const step = stepById(id)
                if (!step) return null
                const Icon = HIC_STEP_ICONS[id] ?? IconDatabase
                return (
                  <g key={id} className={id === 'hub' ? 'hic-hub-box' : undefined}>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill="var(--bg)"
                      stroke={id === 'hub' ? 'var(--accent-text)' : 'var(--wm-border)'} strokeWidth={id === 'hub' ? 2 : 1.5} />
                    <foreignObject x={b.x + 10} y={b.y} width={b.w - 20} height={b.h}>
                      <div className="hic-box-content">
                        <div className="hic-box-icon"><Icon size={17} stroke={1.8} /></div>
                        <div className="hic-box-title">{step.title}</div>
                        <div className="hic-box-body">{step.body}</div>
                      </div>
                    </foreignObject>
                  </g>
                )
              })}
              {/* Feedback loop's own label, centered on the horizontal leg of its
                  path - the only arrow in the diagram that needs one, since every
                  other hand-off is already named by the boxes it connects. */}
              <text x="580" y="430" textAnchor="middle" fontSize="11" fontWeight="700"
                fill="var(--text3)" opacity="0.8">{s.feedbackLabel}</text>
            </svg>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SquadNeedToKnow({ onRequestAccess }: { onRequestAccess: (keys: AgentKey[]) => void }) {
  const { t } = useLocale()
  const s = t.squad
  return (
    <section id="sq-need-to-know" className="sq-need-to-know wm-section">
      <div className="wm-wrap">
        <Reveal><div className="wm-section-head"><p className="wm-eyebrow">{s.needToKnow.eyebrow}</p><h2>{s.needToKnow.heading}</h2><p>{s.needToKnow.sub}</p></div></Reveal>
        <div className="sq-cards-grid">
          {s.needToKnow.cards.map((card, i) => {
            const Icon = NEED_TO_KNOW_ICONS[i % NEED_TO_KNOW_ICONS.length]
            const tags = card.tags as AgentKey[]
            return (
              <Reveal key={card.question} delay={i * 0.05}>
                <div className="sq-card wm-card">
                  <Icon size={26} color="var(--icon-neutral)" style={{ alignSelf: 'center' }} />
                  <h3>{card.question}</h3>
                  <p>{card.body}</p>
                  <div className="sq-tag-row">
                    {tags.map(tag => (
                      <span key={tag} className="sq-tag">
                        {agentByKey(tag).name}
                      </span>
                    ))}
                  </div>
                  <button type="button" className="sq-link-btn" onClick={() => onRequestAccess(tags)}>
                    {s.needToKnow.requestAccess}
                  </button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SquadRequestForm({
  form, setForm, formState, setFormState,
}: {
  form: SquadForm
  setForm: (updater: (f: SquadForm) => SquadForm) => void
  formState: FormState
  setFormState: (s: FormState) => void
}) {
  const { t } = useLocale()
  const s = t.squad.requestForm
  const customSolutionsLinkLabel = t.squad.customSolutionsLinkLabel

  async function submitSquadRequest(e: FormEvent) {
    e.preventDefault()
    if (form.botcheck) { setFormState('ok'); return }
    setFormState('sending')
    const message = form.interest.length
      ? `${s.interestedPrefix}: ${form.interest.map(k => agentByKey(k).name).join(', ')}`
      : 'General inquiry'
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'The Squad inquiry',
          email: form.email,
          phone: null,
          botcheck: form.botcheck,
          message,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      beacon('squad_lead_submitted', { agents: form.interest.join(',') || 'general' })
      setFormState('ok')
    } catch {
      // Same CRM-relay-fail -> Web3Forms fallback as submitTip (PublicSite.tsx).
      try {
        if (!WEB3FORMS_KEY) throw new Error('no web3forms key in this build')
        const res2 = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `[rfi-irfos.com] The Squad — ${form.interest.join(', ') || 'general'} inquiry`,
            name: 'The Squad inquiry',
            email: form.email,
            replyto: form.email || undefined,
            message,
          }),
        })
        if (!res2.ok) throw new Error(String(res2.status))
        beacon('squad_lead_submitted_email_fallback')
        setFormState('ok')
      } catch {
        setFormState('err')
      }
    }
  }

  return (
    <section className="sq-request wm-section wm-section--last">
      <div className="wm-wrap">
        <div className="sq-request-card wm-card">
          <div className="sq-request-text">
            <h2>{s.heading}</h2>
            <p className="sq-request-desc">{s.description}</p>
            {form.interest.length > 0 && (
              <p className="sq-interest-line">
                {s.interestedPrefix}: {form.interest.map(k => agentByKey(k).name).join(', ')}
              </p>
            )}
            <button
              type="button"
              className="sq-custom-link-inline"
              onClick={() => {
                setForm(f => ({ ...f, interest: [] }))
                document.getElementById('squad-request-email')?.focus()
              }}
            >
              {customSolutionsLinkLabel}
            </button>
          </div>
          {formState === 'ok' ? (
            <p className="sq-form-ok">{s.submitOk}</p>
          ) : (
            <form onSubmit={submitSquadRequest} className="sq-request-form">
              <input
                type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
                value={form.botcheck} onChange={e => setForm(f => ({ ...f, botcheck: e.target.value }))}
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />
              <input
                id="squad-request-email" type="email" required placeholder={s.emailPlaceholder}
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="rfi-input"
              />
              <button type="submit" className="wm-btn-primary" disabled={formState === 'sending'}>
                {formState === 'sending' ? s.submitSending : s.submitIdle}
              </button>
            </form>
          )}
        </div>
        {formState === 'err' && (
          <p className="sq-form-err">
            {s.errorText} <a href="mailto:rfi.irfos@gmail.com">rfi.irfos@gmail.com</a>
          </p>
        )}
      </div>
    </section>
  )
}
