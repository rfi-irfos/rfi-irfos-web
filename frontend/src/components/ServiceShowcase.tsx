// Showcase layout for the service pages (2026-11-22). Built on the Data Solutions vocabulary on
// purpose (data-* classes from App.css): section head, numbered icon cards with their own hue, an
// action button, the five-stage pipeline with its control aside, the numbered start cards.
// House rules applied: one voice per panel, KPIs under the hero are plain labels, no eyebrows,
// body copy at full contrast (no grey for information a buyer needs).
import type { CSSProperties } from 'react'
import { Reveal } from './sections/shared'
import { localePath, type LandingLocale } from './landingPages'
import { severityLabel, type ShowcaseDoc } from './serviceShowcase'
import {
  IconRadar2, IconAlarm, IconCode, IconListCheck, IconUsersGroup, IconBuildingSkyscraper, IconEye, IconFilter,
  IconShieldBolt, IconTool, IconFileCheck, IconShieldCheck, IconCircleCheck, IconRocket, IconTrendingUp, IconBuilding,
} from '@tabler/icons-react'

const HUES = ['#36cdb2', '#4f8cf0', '#8f76f2', '#ee6a98', '#f0ad3c', '#f27a54']
const hue = (i: number) => { const ib = HUES[i % HUES.length]; return { '--ib': ib, '--hue-bg': `color-mix(in srgb, ${ib} 11%, transparent)`, '--hue-border': `color-mix(in srgb, ${ib} 40%, transparent)` } as CSSProperties }
const CAP_ICONS = [IconRadar2, IconAlarm, IconCode, IconListCheck, IconUsersGroup, IconBuildingSkyscraper]
const STEP_ICONS = [IconEye, IconFilter, IconShieldBolt, IconTool, IconFileCheck]
const AUD_ICONS = [IconRocket, IconTrendingUp, IconBuilding]

export function ShowcaseTop({ doc, locale }: { doc: ShowcaseDoc; locale: LandingLocale }) {
  const de = locale === 'de'
  return <>
    <header className="data-hero">
      <Reveal><h1>{doc.h1}</h1></Reveal>
      <Reveal delay={1}><p className="data-lede">{doc.lede}</p></Reveal>
      <Reveal delay={2}><div className="svc-hero-actions">
        <a href={localePath(locale, '/#domain-check')} className="data-cta">{de ? 'Quick Check starten' : 'Start the Quick Check'} <span aria-hidden="true">→</span></a>
        <a href={localePath(locale, '/access/')} className="svc-secondary">{de ? 'Pläne und Preise' : 'Plans and prices'}</a>
      </div></Reveal>
    </header>

    <section className="data-section">
      {/* Simeon 2026-11-22: no visible title over the cards (same as the Data Solutions dataset grid);
          the h2 stays for screen readers so the outline still reads h1 > h2 > h3. */}
      <h2 className="data-sr-only">{doc.capabilitiesH2}</h2>
      <div className="data-product-grid">{doc.capabilities.map(([title, body], i) => { const Icon = CAP_ICONS[i % CAP_ICONS.length]; return <Reveal key={title} delay={(i % 3) + 1}>
        <article className="data-product rfi-glass-flat rfi-glass-solid rfi-hover-card" style={hue(i)}><div className="data-icon rfi-ri-box"><Icon size={30} stroke={1.6} /></div><span>0{i + 1}</span><h3>{title}</h3><p>{body}</p></article>
      </Reveal> })}</div>
      <Reveal><div className="svc-cta-row"><a href={localePath(locale, '/access/')} className="data-cta">{doc.capabilitiesCta} <span aria-hidden="true">→</span></a></div></Reveal>
    </section>

    <section className="data-section">
      <div className="svc-prose">
        <Reveal><h2>{doc.prose.h2}</h2></Reveal>
        {doc.prose.p.map((para, i) => <Reveal key={i}><p>{para}</p></Reveal>)}
      </div>
    </section>

    <section className="data-section">
      <Reveal><div className="data-section-head"><h2>{doc.pipelineH2}</h2></div></Reveal>
      <div className="data-pipeline">{doc.pipeline.map(([title, body], i) => { const Icon = STEP_ICONS[i % STEP_ICONS.length]; return <Reveal key={title} delay={(i % 3) + 1}>
        <article className="data-pipeline-module rfi-glass-flat rfi-glass-solid rfi-hover-card" data-stage={i}><div className="data-pipeline-icon rfi-ri-box"><Icon size={30} stroke={1.5} /></div><div className="data-pipeline-stage"><span>0{i + 1}</span></div><div className="data-pipeline-copy"><h3>{title}</h3><p>{body}</p></div></article>
      </Reveal> })}</div>
      <Reveal><aside className="data-quality rfi-glass-flat rfi-glass-solid"><div className="data-quality-title"><div className="data-icon data-icon--row rfi-ri-box"><IconShieldCheck size={28} /></div><h3>{doc.controlH2}</h3></div><ul>{doc.control.map(item => <li key={item}><IconCircleCheck size={17} />{item}</li>)}</ul></aside></Reveal>
    </section>

    <section className="data-section">
      <Reveal><div className="data-section-head"><h2>{doc.boardH2}</h2><p>{doc.boardIntro}</p></div></Reveal>
      <Reveal><div className="svc-board rfi-glass-flat rfi-glass-solid">
        <div className="svc-board-bar"><strong>Remediation</strong><span>{doc.boardTag}</span></div>
        <div className="svc-board-cols">{doc.board.map(col => <div key={col.column} className="svc-board-col">
          <div className="svc-board-colhead">{col.column}<em>{col.cards.length}</em></div>
          {col.cards.map(([sev, title, where]) => <div key={title} className="svc-board-card">
            <span className={`svc-sev svc-sev--${sev}`}>{severityLabel(locale, sev)}</span>
            <strong>{title}</strong>
            <code>{where}</code>
          </div>)}
        </div>)}</div>
      </div></Reveal>
    </section>

    <section className="data-section">
      <Reveal><div className="data-section-head"><h2>{doc.audienceH2}</h2></div></Reveal>
      <div className="data-start-grid">{doc.audience.map(([title, body], i) => { const Icon = AUD_ICONS[i % AUD_ICONS.length]; return <Reveal key={title} delay={i + 1}>
        <article className="rfi-glass-flat rfi-glass-solid rfi-hover-card" style={hue(i + 2)}><span>0{i + 1}</span><div className="data-icon rfi-ri-box" style={{ margin: '12px auto 0' }}><Icon size={28} stroke={1.6} /></div><h3>{title}</h3><p>{body}</p></article>
      </Reveal> })}</div>
    </section>
  </>
}
