import { ib2 } from '../../lib/iconTone'
import { lazy, Suspense, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLocale } from '../../hooks/useLocale'
import { localeHref } from '../../lib/localeHref'
import type { Content } from '../../content/en'
import { Reveal } from './shared'
import { SVC_ICONS } from './serviceIcons'
import {
  IconRadar, IconTargetArrow, IconCode, IconScale, IconTool, IconArrowRight, IconArrowLeft,
  IconShieldCheck, IconWorldSearch, IconMapPin, IconBug, IconApi, IconCloud, IconWorldWww, IconBrain,
  IconFileCode, IconDeviceMobile, IconRadio, IconLock, IconRobot, IconCertificate, IconBuildingFactory,
  IconChecklist, IconTruckDelivery, IconWand, IconSitemap, IconPlugConnected,
} from '@tabler/icons-react'

// Services hub (Zabih + Simeon 23.11.2026): the top bar gets "Services", which opens an overview of
// five areas; each area has its own page listing its services, and each service links to the landing
// page that already exists. Three levels, so no service has to be found by chance in the footer.
// Area pages live at /services/<area>/ and are a view of PublicSite like Data Solutions.

type FooterKey = keyof Content['footer']['groups']['services']['links']
type Svc = { slug: string; key: FooterKey; Icon: typeof IconRadar }

export const SERVICE_GROUPS = [
  { id: 'monitoring', Icon: IconRadar, ib: '#36cdb2', services: [
    { slug: 'managed-soc', key: 'managedSoc', Icon: IconShieldCheck },
    { slug: 'threat-intelligence', key: 'threatIntel', Icon: IconWorldSearch },
    { slug: 'it-security-graz', key: 'itSecurityGraz', Icon: IconMapPin },
  ] },
  { id: 'testing', Icon: IconTargetArrow, ib: '#f0ad3c', services: [
    { slug: 'penetration-testing', key: 'pentest', Icon: IconBug },
    { slug: 'api-security-testing', key: 'apiSecurity', Icon: IconApi },
    { slug: 'cloud-security-assessment', key: 'cloud', Icon: IconCloud },
    { slug: 'domain-security-test', key: 'domainCheck', Icon: IconWorldWww },
  ] },
  { id: 'code-and-apps', Icon: IconCode, ib: '#4f8cf0', services: [
    { slug: 'secure-code-review', key: 'codeReview', Icon: IconFileCode },
    { slug: 'app-security-audit', key: 'appSecurityAudit', Icon: IconDeviceMobile },
    { slug: 'app-tracker-sdk-check', key: 'trackerSdk', Icon: IconRadio },
    { slug: 'gdpr-app-audit', key: 'gdprAppAudit', Icon: IconLock },
  ] },
  { id: 'ai-security', Icon: IconBrain, ib: '#f06a8a', services: [
    { slug: 'ai-llm-security-testing', key: 'aiLlm', Icon: IconBrain },
    { slug: 'ai-app-privacy-audit', key: 'aiApp', Icon: IconRobot },
  ] },
  { id: 'compliance', Icon: IconScale, ib: '#8f76f2', services: [
    { slug: 'nis2-consulting', key: 'nis2Consulting', Icon: IconCertificate },
    { slug: 'nis2-software-vendors', key: 'nis2', Icon: IconBuildingFactory },
    { slug: 'compliance-automation', key: 'compliance', Icon: IconChecklist },
    { slug: 'vendor-risk-management', key: 'vendorRisk', Icon: IconTruckDelivery },
  ] },
  { id: 'fix-and-harden', Icon: IconTool, ib: '#36cdb2', services: [
    { slug: 'vulnerability-remediation', key: 'remediation', Icon: IconWand },
    { slug: 'security-architecture-review', key: 'architecture', Icon: IconSitemap },
  ] },
] as const satisfies readonly { id: string; Icon: typeof IconRadar; ib: string; services: readonly Svc[] }[]

export type ServiceGroupId = typeof SERVICE_GROUPS[number]['id']
export const SERVICE_GROUP_IDS = SERVICE_GROUPS.map(g => g.id) as readonly ServiceGroupId[]

export const HUB_COPY = {
  en: {
    title: 'Services',
    intro: 'Six areas, from round-the-clock monitoring to the evidence an auditor asks for. Pick the area that matches your question and go one level deeper.',
    // Simeon 28.11.2026: the AI stays on our side, written into every area page (no stand-alone block on the hub).
    aiTitle: 'Add us to your workflow, the AI stays with us',
    ai: {
      'monitoring': 'Our agents keep watch on our side while your team keeps its own tools, and you hear from us when an alert needs a decision.',
      'testing': 'Reconnaissance and attack paths run through our agents on our side, so your team keeps working as it does today and receives proven findings in the portal.',
      'code-and-apps': 'Our agents read your code and apps on our side. What reaches your team are the findings, a pull request or patch file, and the report.',
      'ai-security': 'We attack your models and AI apps with our own agents, so your team needs nothing extra to run the test and receives the findings together with the fixes.',
      'compliance': 'Checks and evidence run through our agents. Your auditor works in the portal or the evidence lands in Vanta or Drata, and your team keeps its process.',
      'fix-and-harden': 'Our agents and engineers write the fix on our side, and you review it as a pull request or patch file and merge it the way you always do.',
    },
    all: 'All services',
    others: 'Need something else?',
    faq: 'Common questions',
    groups: {
      'monitoring': ['Monitor and respond', 'Our agents watch your systems day and night, detect attacks early and contain them before they spread.'],
      'testing': ['Test and attack', 'We attack your network, APIs, cloud and domains the way a real attacker would, and prove every finding.'],
      'code-and-apps': ['Code and apps', 'From source code to the finished app in the store, we find weaknesses, trackers and data flows your users never agreed to.'],
      'ai-security': ['AI security', 'We test your language models and AI apps against prompt injection, data leaks and misuse, and show which personal data they process.'],
      'compliance': ['Compliance and supply chain', 'NIS2, GDPR and supplier risk, mapped to evidence that stays current and holds up in an audit.'],
      'fix-and-harden': ['Fix and harden', 'Findings turn into fixes in your code, and a review of your architecture leaves the next weakness less room.'],
    },
  },
  de: {
    title: 'Leistungen',
    intro: 'Sechs Bereiche, von der Überwachung rund um die Uhr bis zu den Nachweisen, die Prüfer verlangen. Wählen Sie den Bereich, der zu Ihrer Frage passt, und gehen Sie eine Ebene tiefer.',
    aiTitle: 'Holen Sie uns in Ihren Ablauf, die KI bleibt bei uns',
    ai: {
      'monitoring': 'Unsere Agenten halten auf unserer Seite Wache, während Ihr Team bei seinen Werkzeugen bleibt, und Sie hören von uns, sobald ein Alarm eine Entscheidung braucht.',
      'testing': 'Aufklärung und Angriffspfade laufen über unsere Agenten bei uns, daher arbeitet Ihr Team weiter wie bisher und erhält belegte Befunde im Portal.',
      'code-and-apps': 'Unsere Agenten lesen Ihren Code und Ihre Apps auf unserer Seite. Bei Ihrem Team kommen die Befunde, ein Pull Request oder eine Patch-Datei und der Bericht an.',
      'ai-security': 'Wir greifen Ihre Modelle und KI-Apps mit unseren eigenen Agenten an, sodass Ihr Team für den Test nichts zusätzlich aufbauen muss und Befunde samt Korrekturen erhält.',
      'compliance': 'Prüfungen und Nachweise laufen über unsere Agenten. Ihr Prüfer arbeitet im Portal oder die Nachweise landen in Vanta oder Drata, und Ihr Team behält seinen Prozess.',
      'fix-and-harden': 'Unsere Agenten und Ingenieure schreiben die Korrektur bei uns, und Sie sehen sie als Pull Request oder Patch-Datei durch und übernehmen sie wie gewohnt.',
    },
    all: 'Alle Leistungen',
    others: 'Sie suchen etwas anderes?',
    faq: 'Häufige Fragen',
    groups: {
      'monitoring': ['Überwachen und reagieren', 'Unsere Agenten überwachen Ihre Systeme Tag und Nacht, erkennen Angriffe früh und dämmen sie ein, bevor sie sich ausbreiten.'],
      'testing': ['Testen und angreifen', 'Wir greifen Netzwerk, Schnittstellen, Cloud und Domains so an, wie es ein echter Angreifer täte, und belegen jeden Befund.'],
      'code-and-apps': ['Code und Apps', 'Vom Quellcode bis zur fertigen App im Store finden wir Schwachstellen, Tracker und Datenflüsse, denen Ihre Nutzer nie zugestimmt haben.'],
      'ai-security': ['KI-Sicherheit', 'Wir prüfen Ihre Sprachmodelle und KI-Apps auf Prompt Injection, Datenabfluss und Missbrauch und zeigen, welche personenbezogenen Daten sie verarbeiten.'],
      'compliance': ['Compliance und Lieferkette', 'NIS2, DSGVO und Lieferantenrisiken, abgebildet in Nachweisen, die aktuell bleiben und einer Prüfung standhalten.'],
      'fix-and-harden': ['Beheben und härten', 'Befunde werden zu Korrekturen in Ihrem Code, und die Prüfung Ihrer Architektur lässt der nächsten Schwachstelle weniger Raum.'],
    },
  },
} as const

/** '/services/testing/' -> 'testing'; '/services/' or anything unknown -> null (the overview). */
export function serviceGroupFromSection(section?: string | null): ServiceGroupId | null {
  const m = /^services\/([a-z-]+)\/?$/.exec(section ?? '')
  return m && (SERVICE_GROUP_IDS as readonly string[]).includes(m[1]) ? (m[1] as ServiceGroupId) : null
}

// Lazy: the FAQ copy lives in landingPages.ts (~240 KB), which only service pages load.
const AreaFaq = lazy(() => import('../LandingPage').then(m => ({ default: m.AreaFaq })))

// Arrow sits right after the title (Simeon 23.11.2026); the last word and the arrow share a nowrap span,
// so a two-line title never leaves the arrow alone on a line.
function TitleArrow({ text }: { text: string }) {
  const i = text.lastIndexOf(' ')
  return <>{i > 0 ? text.slice(0, i + 1) : ''}<span className="svc-tail">{text.slice(i + 1)}<IconArrowRight className="svc-arrow" size={17} stroke={2} aria-hidden /></span></>
}

const tileStyle = (ib: string) => ({ '--ib': ib, '--ib2': ib2(ib) }) as CSSProperties

// Dive (Simeon 23.11.2026, "click on it and it dives into this area"): going deeper, the current page
// zooms toward the clicked tile and blurs away while the next one rises out of the depth; going back
// (all services) runs the same motion in reverse. transform-origin = the clicked tile's centre.
const EASE = [0.22, 1, 0.36, 1] as const
type Dir = 1 | -1
const dive = {
  initial: (d: Dir) => ({ opacity: 0, scale: d > 0 ? 0.82 : 1.18, filter: 'blur(10px)' }),
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
  exit: (d: Dir) => ({ opacity: 0, scale: d > 0 ? 1.35 : 0.85, filter: 'blur(12px)', transition: { duration: 0.42, ease: EASE } }),
}

function DiveStage({ k, dir, origin, children }: { k: string; dir: Dir; origin: string; children: ReactNode }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return <AnimatePresence mode="wait" custom={dir} initial={false}>
    <motion.div key={k} custom={dir} variants={dive} initial="initial" animate="animate" exit="exit" style={{ transformOrigin: origin }}>
      {children}
    </motion.div>
  </AnimatePresence>
}

export function ServicesHubSection(props: Parameters<typeof HubPage>[0]) {
  // Direction and origin are decided at click time, before the URL (and so `group`) changes.
  const [dir, setDir] = useState<Dir>(1)
  const [origin, setOrigin] = useState('50% 30%')
  const stage = useRef<HTMLDivElement>(null)
  const onOpen = (e: MouseEvent, path: string) => {
    const deeper = path !== '/services/'
    setDir(deeper ? 1 : -1)
    const box = stage.current?.getBoundingClientRect()
    const tile = (e.currentTarget as HTMLElement).getBoundingClientRect()
    if (box && deeper) setOrigin(`${tile.left + tile.width / 2 - box.left}px ${tile.top + tile.height / 2 - box.top}px`)
    else setOrigin('50% 30%')
    props.onOpen(e, path)
  }
  return <div ref={stage} style={{ overflow: 'hidden' }}>
    <DiveStage k={props.group ?? 'overview'} dir={dir} origin={origin}><HubPage {...props} onOpen={onOpen} /></DiveStage>
  </div>
}

function HubPage({ t, group, onOpen }: {
  t: Content
  group: ServiceGroupId | null
  /** Client-side navigation for every link on the page (hub, area, service); receives the EN path. */
  onOpen: (e: MouseEvent, path: string) => void
}) {
  const { locale } = useLocale()
  const c = HUB_COPY[locale]
  const href = (p: string) => localeHref(p, locale)
  const links = t.footer.groups.services.links
  const g = group ? SERVICE_GROUPS.find(x => x.id === group)! : null

  if (!g) return <div className="data-solutions svc-hub">
    <header className="data-hero data-wrap">
      <Reveal><h1>{c.title}</h1></Reveal>
      <Reveal delay={1}><p className="data-lede">{c.intro}</p></Reveal>
    </header>
    <section className="data-section svc-section"><div className="data-wrap">
      <div className="svc-grid">{SERVICE_GROUPS.map((x, i) => <Reveal key={x.id} delay={(i % 3) + 1}>
        <a href={href(`/services/${x.id}/`)} onClick={e => onOpen(e, `/services/${x.id}/`)} className="svc-tile rfi-icon-tile svc-tile--area rfi-glass-flat rfi-glass-solid rfi-hover-card" style={tileStyle(x.ib)}>
          <div className="data-icon rfi-ri-box">{SVC_ICONS[x.id]}</div>
          <h2>{c.groups[x.id][0]}</h2>
        </a>
      </Reveal>)}</div>
    </div></section>
  </div>

  const [title, intro] = c.groups[g.id]
  return <div className="data-solutions svc-hub">
    <header className="data-hero data-wrap svc-area-head">
      <div className="svc-title-row">
        <Reveal><h1>{title}</h1></Reveal>
        <a className="svc-back svc-secondary" href={href('/services/')} onClick={e => onOpen(e, '/services/')} aria-label={c.all} title={c.all}><IconArrowLeft size={20} stroke={2} aria-hidden /></a>
      </div>
      <Reveal delay={1}><p className="data-lede">{intro}</p></Reveal>
    </header>
    <section className="data-section svc-section"><div className="data-wrap">
      <div className="svc-grid svc-grid--4">{g.services.map((s, i) => <Reveal key={s.slug} delay={(i % 3) + 1}>
        <a href={href(`/${s.slug}/`)} onClick={e => onOpen(e, `/${s.slug}/`)} className="svc-tile rfi-icon-tile rfi-glass-flat rfi-glass-solid rfi-hover-card" style={tileStyle(g.ib)}>
          <div className="data-icon rfi-ri-box">{SVC_ICONS[s.slug]}</div>
          <h2><TitleArrow text={links[s.key]} /></h2>
        </a>
      </Reveal>)}</div>
      <div className="svc-area-faq">
        <h2 className="data-sr-only">{c.faq}</h2>
        <Suspense fallback={null}><AreaFaq area={g.id} locale={locale} /></Suspense>
      </div>
      <Reveal><div className="svc-ask svc-ai-card rfi-glass-flat rfi-glass-solid">
        <div className="data-icon rfi-ri-box"><IconPlugConnected size={26} stroke={1.6} aria-hidden /></div>
        <div className="svc-ask-copy">
          <h2>{c.aiTitle}</h2>
          <p>{c.ai[g.id]}</p>
        </div>
      </div></Reveal>
      <nav className="svc-others" aria-label={c.others}>
        <span>{c.others}</span>
        {SERVICE_GROUPS.filter(x => x.id !== g.id).map(x => <a key={x.id} href={href(`/services/${x.id}/`)} onClick={e => onOpen(e, `/services/${x.id}/`)}><x.Icon size={16} stroke={1.8} aria-hidden />{c.groups[x.id][0]}</a>)}
      </nav>
    </div></section>
  </div>
}
