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
  IconDatabase, IconPlug, IconTerminal2, IconLayoutDashboard, IconRobot, IconWorld,
  IconSend,
} from '@tabler/icons-react'
import { useLocale } from '../../hooks/useLocale'
import { Reveal, useMobile, beacon, WEB3FORMS_KEY, OUTPUT_TAG_HUES } from './shared'
import { SQUAD_AGENTS, agentByKey, type AgentKey } from '../../content/squadAgents'
import squadHeroPlexus from '../../assets/squad/sq-hero-plexus.avif'

const NEED_TO_KNOW_ICONS = [IconTrendingUp, IconCoin, IconGitCompare, IconCircleCheck, IconSearch, IconShieldLock]

// Icons are locale-independent (module-level, matches the SQUAD_AGENTS convention
// in content/squadAgents.ts) - one icon per step, keyed by a stable id so content/
// en.ts+de.ts only carry title/body text, never JSX.
const HIC_STEP_ICONS: Record<string, typeof IconDatabase> = {
  data: IconDatabase, mcp: IconPlug, cli: IconTerminal2, dashboard: IconLayoutDashboard,
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
          <a href="/world-model/" className="sq-worldmodel-link">{s.worldModelLinkLabel}</a>
          <div className="sq-hero-ctas">
            <button type="button" className="wm-btn-primary" onClick={onRequestAccess}>{s.primaryCta}</button>
            <button
              type="button"
              className="wm-btn-secondary"
              onClick={() => document.getElementById('squad-overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {s.secondaryCta}
            </button>
          </div>
          <p className="sq-status-line"><span className="sq-status-dot" />{s.statusLine}</p>
        </Reveal>
        <Reveal from="right">
          <div className="sq-hub-panel">
            <img className="sq-hub-photo" src={squadHeroPlexus} alt="" />
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
                    <a.icon size={18} color={a.color} />
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

// Fixed pixel layout for the flow diagram below (viewBox 0 0 960 400) - box
// positions and which arrow connects to which are hardcoded here (not
// translatable, only the box content is), keyed by the same icon id used in
// content/en.ts+de.ts howItConnects.zones[].steps[].icon. Rejected first cut
// (live feedback 2026-09-07: "this is a disjointed element... one table, one
// widget all together... an actual diagram") was four separate cards side by
// side with a plain chevron between them - no visible connection between any
// specific box and any other. This version is one SVG: every box has an
// explicit arrow to the box(es) it actually hands off to, fan-out from one
// entry point to three integration paths, fan-in back to one pipeline, ending
// in a dashed feedback arrow back to the start - the same "connected whole"
// shape as the Dialogflow reference image.
const HIC_BOX: Record<string, { x: number; y: number; w: number; h: number; n: number }> = {
  data:       { x: 40,  y: 170, w: 140, h: 60, n: 1 },
  mcp:        { x: 280, y: 55,  w: 160, h: 60, n: 2 },
  cli:        { x: 280, y: 170, w: 160, h: 60, n: 3 },
  dashboard:  { x: 280, y: 285, w: 160, h: 60, n: 4 },
  process:    { x: 540, y: 112, w: 160, h: 60, n: 5 },
  crosscheck: { x: 540, y: 228, w: 160, h: 60, n: 6 },
  deliver:    { x: 800, y: 112, w: 160, h: 60, n: 7 },
  act:        { x: 800, y: 228, w: 160, h: 60, n: 8 },
}
const HIC_ZONE_BANDS = [
  { x: 10,  w: 210 },
  { x: 240, w: 240 },
  { x: 500, w: 240 },
  { x: 760, w: 230 },
]
// Explicit orthogonal waypoints per arrow, NOT computed diagonals (live feedback
// 2026-09-07: "welcher pfeil geht wohin... diesen chaotischen pfeilen... lieber
// eckige pfeile machen, mit 90 grad kanten"). Every segment is strictly
// horizontal or vertical. The three fan-out arrows share one vertical bus at
// x=230 and the three fan-in arrows share one at x=490, so convergence reads as
// a single junction instead of three crossing lines - standard technical-diagram
// routing, same idea as the Dialogflow reference.
// `delay` groups arrows into pipeline stages rather than staggering one-by-one:
// the three fan-out arrows share delay 0 so a single pulse visibly SPLITS out of
// "Your Data" into all three integration paths at once, and the three fan-in
// arrows share the next delay so those three pulses visibly MERGE into the agent
// pipeline (live feedback 2026-09-07: "merges or splits into more dots or
// something like at crossroads").
const HIC_ARROWS: { id: string; pts: [number, number][]; delay: number; feedback?: boolean }[] = [
  { id: 'data-mcp',        pts: [[180, 200], [230, 200], [230, 85], [280, 85]], delay: 0 },
  { id: 'data-cli',        pts: [[180, 200], [280, 200]], delay: 0 },
  { id: 'data-dashboard',  pts: [[180, 200], [230, 200], [230, 315], [280, 315]], delay: 0 },
  { id: 'mcp-process',     pts: [[440, 85], [490, 85], [490, 142], [540, 142]], delay: 0.7 },
  { id: 'cli-process',     pts: [[440, 200], [490, 200], [490, 142], [540, 142]], delay: 0.7 },
  { id: 'dash-process',    pts: [[440, 315], [490, 315], [490, 142], [540, 142]], delay: 0.7 },
  { id: 'process-cross',   pts: [[620, 172], [620, 228]], delay: 1.4 },
  { id: 'cross-deliver',   pts: [[700, 258], [750, 258], [750, 142], [800, 142]], delay: 1.75 },
  { id: 'deliver-act',     pts: [[880, 172], [880, 228]], delay: 2.45 },
  { id: 'act-data',        pts: [[880, 288], [880, 425], [110, 425], [110, 230]], delay: 2.8, feedback: true },
]

// Real technical diagram (live feedback 2026-09-07, reference: a Dialogflow-style
// architecture diagram with colored zones, numbered steps, connected icon boxes).
// Four zones left to right (your systems -> connect -> the squad -> delivery),
// every box numbered and wired by right-angled arrows to the box(es) it hands off
// to. Two rejected earlier cuts, both quoted in the layout comments above: four
// disjointed cards with a chevron between them, then diagonal arrows that nobody
// could trace.
function HowItConnects() {
  const { t } = useLocale()
  const s = t.squad.howItConnects
  // Detail text lives in a click-triggered popover per box instead of a legend
  // block under the diagram (live feedback 2026-09-07: "wenn unten die legende
  // weg wär und nur als tiny popups kommen wenn man auf die nummern klickt, das
  // spart zeit definitiv") - the diagram stays scannable, detail is on demand.
  const [openStep, setOpenStep] = useState<string | null>(null)
  const allSteps = s.zones.flatMap(z => z.steps)
  const stepById = (id: string) => allSteps.find(st => st.icon === id)
  const openBox = openStep ? HIC_BOX[openStep] : null
  const openContent = openStep ? stepById(openStep) : null
  // Bottom-row boxes open their popover upward so it never overflows the
  // diagram's own scroll box.
  const openAbove = openBox ? openBox.y + openBox.h > 300 : false
  return (
    <section className="sq-connects wm-section">
      <div className="wm-wrap">
        <Reveal><div className="wm-section-head"><p className="wm-eyebrow">{s.eyebrow}</p><h2>{s.heading}</h2><p>{s.sub}</p></div></Reveal>
        <Reveal>
          <div className="hic-diagram">
            <div className="hic-canvas">
            <svg viewBox="0 0 1000 460" className="hic-svg" role="img" aria-label={s.heading}>
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
                  fill="var(--text2)">{zone.label.toUpperCase()}</text>
              ))}
              {HIC_ARROWS.map(a => (
                <polyline key={a.id} points={a.pts.map(p => p.join(',')).join(' ')}
                  fill="none" stroke="var(--accent-text)"
                  strokeWidth={a.feedback ? 1.5 : 2}
                  strokeDasharray={a.feedback ? '5 5' : undefined}
                  strokeLinejoin="round" strokeLinecap="round"
                  opacity={a.feedback ? 0.5 : 0.9}
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
                const active = openStep === id
                return (
                  <g key={id} className="hic-box-group" onClick={() => setOpenStep(active ? null : id)}
                    role="button" tabIndex={0} aria-expanded={active}
                    onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setOpenStep(active ? null : id) } }}>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill="var(--bg)"
                      stroke={active ? 'var(--accent-text)' : 'var(--wm-border)'} strokeWidth={active ? 2 : 1.5} />
                    <foreignObject x={b.x + 10} y={b.y} width={b.w - 20} height={b.h}>
                      <div className="hic-box-content">
                        <div className="hic-box-icon"><Icon size={17} stroke={1.8} /></div>
                        <div className="hic-box-title">{step.title}</div>
                      </div>
                    </foreignObject>
                    {/* Step number on the box corner, half outside the rect - the
                        click target's visual anchor, and what the popover below
                        is keyed to. */}
                    <circle cx={b.x} cy={b.y} r="11" fill="var(--accent-text)" />
                    <text x={b.x} y={b.y + 3.5} textAnchor="middle" fontSize="11" fontWeight="900" fill="var(--bg)">{b.n}</text>
                  </g>
                )
              })}
            </svg>
            {/* Positioned in percentages off the same viewBox coordinates the SVG
                uses, so the popover tracks its box exactly at any render width
                while still being real HTML (auto-height, wrapping text). */}
            {openBox && openContent && (
              <div className="hic-pop" style={{
                left: `${((openBox.x + openBox.w / 2) / 1000) * 100}%`,
                top: `${((openAbove ? openBox.y - 8 : openBox.y + openBox.h + 8) / 460) * 100}%`,
                transform: `translate(-50%, ${openAbove ? '-100%' : '0'})`,
              }}>
                <div className="hic-pop-head">
                  <span className="hic-legend-num">{openBox.n}</span>
                  <span className="hic-pop-title">{openContent.title}</span>
                  <button type="button" className="hic-pop-close" onClick={() => setOpenStep(null)} aria-label="Close">×</button>
                </div>
                <p className="hic-pop-body">{openContent.body}</p>
              </div>
            )}
            </div>
          </div>
        </Reveal>
        <p className="hic-hint">{s.hint}</p>
      </div>
    </section>
  )
}

function SquadNeedToKnow({ onRequestAccess }: { onRequestAccess: (keys: AgentKey[]) => void }) {
  const { t } = useLocale()
  const s = t.squad
  return (
    <section className="sq-need-to-know wm-section">
      <div className="wm-wrap">
        <Reveal><div className="wm-section-head"><p className="wm-eyebrow">{s.needToKnow.eyebrow}</p><h2>{s.needToKnow.heading}</h2><p>{s.needToKnow.sub}</p></div></Reveal>
        <div className="sq-cards-grid">
          {s.needToKnow.cards.map((card, i) => {
            const Icon = NEED_TO_KNOW_ICONS[i % NEED_TO_KNOW_ICONS.length]
            const tags = card.tags as AgentKey[]
            const cardColor = agentByKey(tags[0]).color
            return (
              <Reveal key={card.question} delay={i * 0.05}>
                <div className="sq-card wm-card" style={{ '--card-color': cardColor } as CSSProperties}>
                  <Icon size={26} color={cardColor} style={{ alignSelf: 'center' }} />
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
