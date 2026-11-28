// Showcase layout for the service pages (2026-11-22). Built on the Data Solutions vocabulary on
// purpose (data-* classes from App.css): section head, numbered icon cards with their own hue, an
// action button, the five-stage pipeline with its control aside, the numbered start cards.
// House rules applied: one voice per panel, KPIs under the hero are plain labels, no eyebrows,
// body copy at full contrast (no grey for information a buyer needs).
import type { CSSProperties } from 'react'
import { Reveal } from './sections/shared'
import { localePath, type LandingLocale } from './landingPages'
import { type ShowcaseDoc } from './serviceShowcase'
import { DraggableBoard } from './DraggableBoard'
import {
  IconRadar2, IconAlarm, IconCode, IconListCheck, IconUsersGroup, IconBuildingSkyscraper, IconEye, IconFilterSearch,
  IconShieldBolt, IconTools, IconFileCheck, IconRocket, IconMapPin, IconWorld, IconUserShield, IconLockCheck, IconTrendingUp, IconBuilding,
  IconAdjustmentsAlt, IconAntenna, IconApi, IconTargetArrow, IconBook, IconBriefcase, IconBug, IconBuildingBank, IconCertificate, IconChartBar, IconChartDots3, IconClipboardCheck, IconClipboardList, IconClipboardText, IconClock, IconCloudLock, IconCloudComputing, IconDeviceMobile, IconDevices, IconFileCertificate, IconFileCode, IconFileImport, IconFileReport, IconFileSpreadsheet, IconFileText, IconFingerprint, IconGitCompare, IconHeartbeat, IconHelpCircle, IconInbox, IconKey, IconLayoutDashboard, IconListDetails, IconListSearch, IconLock, IconLockOpen, IconMail, IconMap2, IconMessageChatbot, IconMessages, IconMoodKid, IconNetwork, IconPackage, IconPackages, IconPencil, IconPercentage, IconRefresh, IconRobot, IconRoute, IconScale, IconSearch, IconSend, IconServer, IconSettings, IconShieldHalf, IconShieldCheck, IconShieldLock, IconSortDescending, IconStack2, IconSwords, IconTarget, IconTruck, IconUserCheck, IconUsers, IconVideo, IconWorldWww, IconZoomIn,
} from '@tabler/icons-react'
import { IconFlask, IconMessageCircle, IconSitemap } from '@tabler/icons-react'
import type { Icon as TablerIcon } from '@tabler/icons-react'
import { DEMO_START_URL } from '../lib/demoInstance'

const CONTROL_ICONS = [IconMapPin, IconWorld, IconUserShield, IconLockCheck]
const HUES = ['#36cdb2', '#4f8cf0', '#8f76f2', '#ee6a98', '#f0ad3c', '#f27a54']
const hue = (i: number) => { const ib = HUES[i % HUES.length]; return { '--ib': ib, '--hue-bg': `color-mix(in srgb, ${ib} 11%, transparent)`, '--hue-border': `color-mix(in srgb, ${ib} 40%, transparent)` } as CSSProperties }
const CAP_ICONS = [IconRadar2, IconAlarm, IconCode, IconListCheck, IconUsersGroup, IconBuildingSkyscraper]
const STEP_ICONS = [IconEye, IconFilterSearch, IconShieldBolt, IconTools, IconFileCheck]
const AUD_ICONS = [IconRocket, IconTrendingUp, IconBuilding]
// Per-page icon sets (Simeon 2026-11-22): each tile, step and audience card gets an icon that fits its title.
const PAGE_ICONS: Record<string, [TablerIcon[], TablerIcon[], TablerIcon[]]> = {
  'ai-llm-security-testing': [[IconMessages, IconStack2, IconRobot, IconShieldBolt, IconChartBar, IconFingerprint], [IconListDetails, IconSwords, IconFileCode, IconTools, IconRefresh], [IconMessageChatbot, IconRobot, IconScale]],
  'security-architecture-review': [[IconSitemap, IconStack2, IconTarget, IconRefresh, IconTargetArrow, IconNetwork], [IconBook, IconRoute, IconTargetArrow, IconShieldLock, IconRefresh], [IconTrendingUp, IconScale, IconCloudLock]],
  'threat-intelligence': [[IconAlarm, IconChartDots3, IconSwords, IconFingerprint, IconEye, IconServer], [IconInbox, IconGitCompare, IconAlarm, IconShieldCheck, IconFileReport], [IconUsersGroup, IconBuildingBank, IconUserShield]],
  'vendor-risk-management': [[IconSearch, IconPercentage, IconSortDescending, IconEye, IconPackages, IconClipboardText], [IconListDetails, IconSortDescending, IconSearch, IconChartBar, IconEye], [IconCertificate, IconBriefcase, IconBuildingSkyscraper]],
  'penetration-testing': [[IconTargetArrow, IconRoute, IconBug, IconCode, IconDevices, IconFileReport], [IconTarget, IconRadar2, IconBug, IconTools, IconRefresh], [IconRocket, IconPackage, IconClipboardCheck]],
  'api-security-testing': [[IconKey, IconLockOpen, IconMap2, IconApi, IconCode, IconFileReport], [IconListSearch, IconRadar2, IconSwords, IconTools, IconRefresh], [IconApi, IconDeviceMobile, IconClipboardCheck]],
  'cloud-security-assessment': [[IconAdjustmentsAlt, IconServer, IconWorld, IconRoute, IconCode, IconEye], [IconListDetails, IconSearch, IconRoute, IconTools, IconEye], [IconCloudLock, IconCloudComputing, IconClipboardList]],
  'app-security-audit': [[IconFileCode, IconKey, IconNetwork, IconPackages, IconCode, IconFileReport], [IconSend, IconFileCode, IconSearch, IconTools, IconFileCheck], [IconRocket, IconBriefcase, IconLock]],
  'gdpr-app-audit': [[IconClock, IconScale, IconWorld, IconHeartbeat, IconFileText, IconCode], [IconFileCode, IconClock, IconRoute, IconScale, IconTools], [IconShieldLock, IconWorld, IconHeartbeat]],
  'app-tracker-sdk-check': [[IconPackages, IconClock, IconNetwork, IconAntenna, IconGitCompare, IconCode], [IconFileCode, IconListDetails, IconClock, IconScale, IconTools], [IconUsersGroup, IconScale, IconBriefcase]],
  'ai-app-privacy-audit': [[IconPackages, IconMessages, IconLock, IconVideo, IconFingerprint, IconRobot], [IconFileCode, IconClock, IconMessages, IconScale, IconTools], [IconMessageChatbot, IconRobot, IconMoodKid]],
  'nis2-software-vendors': [[IconPackages, IconKey, IconLock, IconNetwork, IconChartDots3, IconCode], [IconSettings, IconBook, IconListCheck, IconFileReport, IconTools], [IconPackage, IconRocket, IconBriefcase]],
  'nis2-consulting': [[IconHelpCircle, IconClipboardText, IconListDetails, IconSortDescending, IconKey, IconFileCertificate], [IconHelpCircle, IconListDetails, IconSearch, IconFileCheck, IconTools], [IconBriefcase, IconServer, IconTruck]],
  'compliance-automation': [[IconListCheck, IconStack2, IconPercentage, IconUserCheck, IconFileSpreadsheet, IconShieldCheck], [IconSearch, IconListCheck, IconPercentage, IconUserCheck, IconSend], [IconCertificate, IconRocket, IconBuildingBank]],
  'it-security-graz': [[IconBug, IconScale, IconRadar2, IconFileCheck, IconWorld, IconLayoutDashboard], [IconMessages, IconSearch, IconFileCheck, IconTools, IconRefresh], [IconBuilding, IconMapPin, IconHelpCircle]],
  'secure-code-review': [[IconCode, IconPackage, IconPackages, IconKey, IconRoute, IconFileCode], [IconFileImport, IconSearch, IconScale, IconTools, IconRefresh], [IconPackage, IconRocket, IconClock]],
  'vulnerability-remediation': [[IconInbox, IconBug, IconChartBar, IconFileCode, IconRefresh, IconClock], [IconInbox, IconBug, IconScale, IconTools, IconRefresh], [IconStack2, IconBug, IconClipboardList]],
  'domain-security-test': [[IconWorldWww, IconCertificate, IconMail, IconShieldHalf, IconEye, IconFileText], [IconPencil, IconUserCheck, IconRadar2, IconFileText, IconZoomIn], [IconRocket, IconUsers, IconSearch]],
}

export function ShowcaseTop({ doc, locale, slug, onTalk }: { doc: ShowcaseDoc; locale: LandingLocale; slug: string; onTalk?: () => void }) {
  const de = locale === 'de'
  const [capIcons, stepIcons, audIcons] = PAGE_ICONS[slug] ?? [CAP_ICONS, STEP_ICONS, AUD_ICONS]
  return <>
    <header className="data-hero">
      <Reveal><h1>{doc.h1}</h1></Reveal>
      <Reveal delay={1}><p className="data-lede">{doc.lede}</p></Reveal>
      <Reveal delay={2}><div className="svc-hero-actions">
        {/* Simeon 28.11.2026: the left hero button opens the demo instance (was "Plans and prices"). */}
        <a href={DEMO_START_URL} className="svc-secondary"><IconFlask size={18} stroke={2} aria-hidden />{de ? 'Hier ausprobieren' : 'Put it to the test'}</a>
        {/* Simeon 23.11.2026: "Talk to us" opens the enquiry pop-up for this service (was "Start the Quick Check"). */}
        {onTalk
          ? <button type="button" onClick={onTalk} className="data-cta"><IconMessageCircle size={18} stroke={2} aria-hidden />{de ? 'Sprechen Sie mit uns' : 'Talk to us'}</button>
          : <a href={localePath(locale, '/#contact')} className="data-cta"><IconMessageCircle size={18} stroke={2} aria-hidden />{de ? 'Sprechen Sie mit uns' : 'Talk to us'}</a>}
      </div></Reveal>
    </header>

    <section className="data-section">
      {/* Simeon 2026-11-22: no visible title over the cards (same as the Data Solutions dataset grid);
          the h2 stays for screen readers so the outline still reads h1 > h2 > h3. */}
      <h2 className="data-sr-only">{doc.capabilitiesH2}</h2>
      <div className="data-product-grid">{doc.capabilities.map(([title, body], i) => { const Icon = capIcons[i % capIcons.length]; return <Reveal key={title} delay={(i % 3) + 1}>
        <article className="data-product svc-card rfi-glass-flat rfi-glass-solid rfi-hover-card" style={hue(i)}><div className="data-icon rfi-ri-box"><Icon size={26} stroke={1.6} /></div><h3>{title}</h3><p>{body}</p></article>
      </Reveal> })}</div>
    </section>

    <section className="data-section">
      <div className="svc-prose">
        <Reveal><h2>{doc.prose.h2}</h2></Reveal>
        {doc.prose.p.map((para, i) => <Reveal key={i}><p>{para}</p></Reveal>)}
        {/* Simeon 2026-11-22: the access button sits after the prose, before the pipeline. */}
        <Reveal><div className="svc-cta-row"><a href={localePath(locale, '/access/')} className="data-cta">{doc.capabilitiesCta} <span aria-hidden="true">→</span></a></div></Reveal>
      </div>
    </section>

    <section className="data-section">
      <Reveal><div className="data-section-head"><h2>{doc.pipelineH2}</h2></div></Reveal>
      <div className="data-pipeline">{doc.pipeline.map(([title, body], i) => { const Icon = stepIcons[i % stepIcons.length]; return <Reveal key={title} delay={(i % 3) + 1}>
        <article className="data-pipeline-module rfi-glass-flat rfi-glass-solid rfi-hover-card" data-stage={i}><div className="data-pipeline-icon rfi-ri-box"><Icon size={30} stroke={1.5} /></div><div className="data-pipeline-copy"><h3>{title}</h3><p>{body}</p></div></article>
      </Reveal> })}</div>
      {/* Simeon 2026-11-22: the data-location box became four small tiles, one icon each, under its own heading. */}
      <Reveal><div className="data-section-head svc-control-head"><h2>{doc.controlH2}</h2></div></Reveal>
      <div className="svc-control">{doc.control.map((item, i) => { const Icon = CONTROL_ICONS[i % CONTROL_ICONS.length]; return <Reveal key={item} delay={(i % 4) + 1}>
        <div className="svc-control-tile rfi-glass-flat rfi-glass-solid" style={hue(i)}><div className="data-icon rfi-ri-box"><Icon size={24} stroke={1.6} /></div><p>{item}</p></div>
      </Reveal> })}</div>
    </section>

    <section className="data-section">
      <Reveal><div className="data-section-head"><h2>{doc.boardH2}</h2><p>{doc.boardIntro}</p></div></Reveal>
      <Reveal><DraggableBoard board={doc.board} locale={locale} tag={doc.boardTag} /></Reveal>
      {/* Simeon 28.11.2026: under the board widget a second way into the demo instance, where the real board runs. */}
      <Reveal><div className="svc-cta-row"><a href={DEMO_START_URL} className="data-cta">{de ? 'Einen ersten Blick werfen' : 'Get a first look'} <span aria-hidden="true">→</span></a></div></Reveal>
    </section>

    <section className="data-section">
      <Reveal><div className="data-section-head"><h2>{doc.audienceH2}</h2></div></Reveal>
      <div className="data-start-grid">{doc.audience.map(([title, body], i) => { const Icon = audIcons[i % audIcons.length]; return <Reveal key={title} delay={i + 1}>
        <article className="svc-card rfi-glass-flat rfi-glass-solid rfi-hover-card" style={hue(i + 2)}><div className="data-icon rfi-ri-box"><Icon size={26} stroke={1.6} /></div><h3>{title}</h3><p>{body}</p></article>
      </Reveal> })}</div>
    </section>
  </>
}
