// Showcase content for the service pages (Simeon + Zabih 2026-11-22: "mach uns schöne service seiten
// draus, data solutions hat n misch aus widgets, visualisierungen, kacheln und text").
// One structured doc per service and locale. A slug with an entry here renders ServiceShowcase
// (hero widget, KPI strip, titled hue cards, pipeline, portal board, control checklist, audience);
// a slug without one keeps the plain LandingBody layout until its showcase copy is written.
// SEO meta, evidence, start text and FAQ stay in landingPages.ts and are shared by both layouts.
//
// Facts used here are sourced: portal areas, remediation board columns, roles, read-only MCP and
// the patch-file fix from the portal code (memory reference_customer_portal_capabilities_faq,
// 19.11.2026); data location Graz and EU LLM endpoints confirmed by Simeon 19.11.2026; 1 h / 24 h
// response and fix times from the existing managed-soc copy.
import type { LandingSlug } from './landingSlugs'

export type ShowcaseDoc = {
  h1: string
  lede: string
  kpis: [value: string, label: string][]
  capabilitiesH2: string
  capabilities: [title: string, body: string][]
  /** Action button under the capability cards (Data Solutions pattern), links to /access/. */
  capabilitiesCta: string
  /** Search-facing prose: connected sentences that carry the buyer terms of this service. */
  prose: { h2: string; p: string[] }
  pipelineH2: string
  pipeline: [title: string, body: string][]
  boardH2: string
  boardIntro: string
  boardTag: string
  board: { column: string; cards: [severity: 'critical' | 'high' | 'medium' | 'low', title: string, where: string][] }[]
  controlH2: string
  control: string[]
  audienceH2: string
  audience: [title: string, body: string][]
}

const SEV_DE = { critical: 'Kritisch', high: 'Hoch', medium: 'Mittel', low: 'Niedrig' } as const
const SEV_EN = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' } as const
export const severityLabel = (locale: 'en' | 'de', s: keyof typeof SEV_EN) => (locale === 'de' ? SEV_DE : SEV_EN)[s]

export const SHOWCASE: Partial<Record<LandingSlug, { en: ShowcaseDoc; de: ShowcaseDoc }>> = {
  'managed-soc': {
    de: {
      h1: 'Managed SOC aus Graz: Ihre Sicherheitsabteilung rund um die Uhr',
      lede: 'Wir überwachen Ihre Systeme Tag und Nacht, reagieren binnen einer Stunde auf jeden Vorfall und liefern die Behebung innerhalb von 24 Stunden als Änderung an Ihrem Code.',
      kpis: [['24/7', 'Überwachung'], ['< 1 h', 'bis zur ersten Reaktion'], ['< 24 h', 'bis zum Fix im Code'], ['Graz', 'Verarbeitung auf eigenem Server']],
      capabilitiesH2: 'Was Ihr SOC übernimmt',
      capabilities: [
        ['Überwachung rund um die Uhr', 'Sensoren für DNS, HTTP und TLS beobachten Ihre Domains und Dienste, Alarme und Assets laufen in einem Dashboard zusammen.'],
        ['Reaktion binnen einer Stunde', 'Jeder Alarm landet im Incidents-Board. Ein Ingenieur übernimmt, dämmt den Vorfall ein und hält Sie auf dem Laufenden.'],
        ['Fix bis in den Code', 'Die Behebung kommt als Patch-Datei, die sich mit git apply auf jedem Git-Host einspielen lässt, und ein Retest bestätigt sie.'],
        ['Compliance läuft mit', 'Kontrollen, Nachweise und Audit-Dokumente sammeln sich im Portal, sodass Ihr nächstes Audit auf vollständigen Belegen aufbaut.'],
        ['Ein festes Team', 'Dieselben Ingenieure betreuen Ihre Systeme, kennen Ihre Architektur und sprechen mit Ihnen Deutsch oder Englisch.'],
        ['Für Managed Service Provider', 'Mandantenfähig, unter eigenem Namen und mit vereinbarten SLAs betreiben Sie das SOC für Ihre eigenen Kunden.'],
      ],
      capabilitiesCta: 'Umfang und Preis auf Zugang ansehen',
      prose: {
        h2: 'Managed SOC und 24/7 Security Monitoring für Unternehmen in Österreich',
        p: [
          'Ein Security Operations Center (SOC) erkennt Cyberangriffe, bewertet sie und leitet die Abwehr ein, bevor aus einem Sicherheitsvorfall ein Betriebsausfall wird. Weil ein eigenes SOC mit Schichtbetrieb das Budget vieler kleiner und mittlerer Unternehmen übersteigt, übernehmen wir diese Aufgabe als Managed SOC aus Graz: Wir betreiben Ihr Security Monitoring rund um die Uhr, führen die Incident Response und schließen jede Lücke dort, wo sie entsteht, im Quellcode.',
          'Damit verbindet unser SOC as a Service die Erkennung und Abwehr von Angriffen, wie sie Managed Detection and Response (MDR) beschreibt, mit der Behebung von Schwachstellen bis in Ihr Repository. Agenten werten Signale aus DNS, HTTP und TLS laufend aus, ordnen jeden Alarm nach Asset und Schweregrad ein und sortieren Fehlalarme früh aus. Anschließend übernimmt ein Ingenieur aus unserem Team, reagiert binnen einer Stunde und liefert den Fix innerhalb von 24 Stunden als Patch, den Ihre Entwickler direkt einspielen.',
          'Zugleich stützt das ausgelagerte SOC Ihre NIS2-Vorbereitung, denn die Behandlung von Sicherheitsvorfällen und die Meldung erheblicher Vorfälle gehören zu den Pflichten der NIS2-Richtlinie. Sämtliche Nachweise liegen im Kundenportal, verarbeitet in Graz auf unserem eigenen Server. So erhalten Startups, KMU und Konzerne in Graz, der Steiermark, Wien und dem gesamten DACH-Raum eine Cybersecurity-Abteilung, die mit ihrem Unternehmen wächst.',
        ],
      },
      pipelineH2: 'Vom Alarm zum Fix in fünf Schritten',
      pipeline: [
        ['Erkennen', 'Sensoren und Agenten melden Auffälligkeiten an Domains, Diensten und Code.'],
        ['Einordnen', 'Jeder Alarm bekommt Asset, Schweregrad und Kontext, Fehlalarme fallen früh heraus.'],
        ['Reagieren', 'Binnen einer Stunde dämmt ein Ingenieur den Vorfall ein und informiert Ihr Team.'],
        ['Beheben', 'Innerhalb von 24 Stunden liegt der Fix als Patch oder Anleitung im Remediation-Board.'],
        ['Nachweisen', 'Retest, Verlauf und Bericht bleiben im Portal, bereit für Audit und Versicherung.'],
      ],
      boardH2: 'Jeder Fund hat seinen Platz im Portal',
      boardIntro: 'Das Remediation-Board zeigt, was offen ist, wer daran arbeitet und welcher Fix auf Ihre Freigabe wartet.',
      boardTag: 'Beispielansicht',
      board: [
        { column: 'Offen', cards: [['high', 'Admin-Login ohne Rate-Limit', 'api · main'], ['medium', 'TLS 1.0 noch aktiv', 'edge']] },
        { column: 'Eingeordnet', cards: [['critical', 'Schlüssel im App-Build', 'android · release']] },
        { column: 'In Arbeit', cards: [['high', 'Log-Bucket öffentlich lesbar', 'infra']] },
        { column: 'Behoben', cards: [['medium', 'Security-Header fehlen', 'web · main'], ['low', 'Veraltete Bibliothek', 'api']] },
      ],
      controlH2: 'Datenort und Kontrolle',
      control: [
        'Verarbeitung in Graz auf unserem eigenen Server',
        'KI-Aufrufe mit Kundenkontakt laufen über europäische Endpunkte',
        'Rollen für Admin, Engineer, Analyst und Auditor, Anmeldung mit 2FA',
        'KI-Assistenten lesen über MCP nur mit, Tokens widerrufen Sie selbst',
      ],
      audienceH2: 'Für wen das SOC gedacht ist',
      audience: [
        ['Startups im Enterprise-Vertrieb', 'Sicherheitsfragebögen großer Kunden beantworten Sie mit Belegen direkt aus dem Portal.'],
        ['Wachsende Unternehmen', 'Ihre Sicherheitsabteilung steht ab dem ersten Tag, und eigene Stellen planen Sie in Ruhe.'],
        ['Konzerne und MSPs', 'Ein zusätzliches Team in Bereitschaft oder ein SOC unter eigenem Namen für Ihre Kunden.'],
      ],
    },
    en: {
      h1: 'Managed SOC from Graz: your security department, around the clock',
      lede: 'We monitor your systems day and night, respond to every incident within one hour and deliver the fix within 24 hours as a change to your code.',
      kpis: [['24/7', 'monitoring'], ['< 1 h', 'to first response'], ['< 24 h', 'to the fix in code'], ['Graz', 'processing on our own server']],
      capabilitiesH2: 'What your SOC takes on',
      capabilities: [
        ['Monitoring around the clock', 'DNS, HTTP and TLS sensors watch your domains and services, with alerts and assets in one dashboard.'],
        ['Response within one hour', 'Every alert lands on the incidents board. An engineer takes it, contains the incident and keeps you informed.'],
        ['Fixes down to the code', 'The fix arrives as a patch file you apply with git apply on any Git host, and a retest confirms it.'],
        ['Compliance runs alongside', 'Controls, evidence and audit documents collect in the portal, so your next audit builds on complete records.'],
        ['One dedicated team', 'The same engineers look after your systems, know your architecture and work with you in English or German.'],
        ['For managed service providers', 'Multi-tenant, under your own name and with agreed SLAs, you run the SOC for your own clients.'],
      ],
      capabilitiesCta: 'See scope and price on Access',
      prose: {
        h2: 'Managed SOC and 24/7 security monitoring for companies in Austria and the EU',
        p: [
          'A security operations center (SOC) detects cyberattacks, assesses them and starts the defence before a security incident turns into downtime. Because an in-house SOC with shift coverage exceeds the budget of most small and mid-sized businesses, we take on that job as a managed SOC from Graz: we run your security monitoring around the clock, lead the incident response and close every gap where it starts, in the source code.',
          'Our SOC as a service therefore combines the detection and response that managed detection and response (MDR) describes with vulnerability remediation down to your repository. Agents analyse DNS, HTTP and TLS signals continuously, triage every alert by asset and severity and filter false positives early. An engineer from our team then takes over, responds within one hour and delivers the fix within 24 hours as a patch your developers apply directly.',
          'The outsourced SOC also supports your NIS2 readiness, since incident handling and the reporting of significant incidents are duties under the NIS2 Directive. All evidence sits in the customer portal, processed in Graz on our own server. Startups, SMEs and enterprises across Austria, Germany, Switzerland and the wider EU get a cybersecurity department that grows with their business.',
        ],
      },
      pipelineH2: 'From alert to fix in five steps',
      pipeline: [
        ['Detect', 'Sensors and agents report anomalies across domains, services and code.'],
        ['Triage', 'Every alert gets asset, severity and context, and false positives drop out early.'],
        ['Respond', 'Within one hour an engineer contains the incident and informs your team.'],
        ['Fix', 'Within 24 hours the fix sits on the remediation board as a patch or a guide.'],
        ['Prove', 'Retest, history and report stay in the portal, ready for audit and insurance.'],
      ],
      boardH2: 'Every finding has its place in the portal',
      boardIntro: 'The remediation board shows what is open, who is working on it and which fix is waiting for your approval.',
      boardTag: 'Example view',
      board: [
        { column: 'Open', cards: [['high', 'Admin login without rate limit', 'api · main'], ['medium', 'TLS 1.0 still enabled', 'edge']] },
        { column: 'Triaged', cards: [['critical', 'Key in the app build', 'android · release']] },
        { column: 'In progress', cards: [['high', 'Log bucket publicly readable', 'infra']] },
        { column: 'Resolved', cards: [['medium', 'Security headers missing', 'web · main'], ['low', 'Outdated library', 'api']] },
      ],
      controlH2: 'Data location and control',
      control: [
        'Processing in Graz on our own server',
        'AI calls that touch customer data run through European endpoints',
        'Roles for admin, engineer, analyst and auditor, sign-in with 2FA',
        'AI assistants read along over MCP only, and you revoke tokens yourself',
      ],
      audienceH2: 'Who the SOC is for',
      audience: [
        ['Startups selling to enterprises', 'Answer security questionnaires from large customers with evidence straight from the portal.'],
        ['Growing companies', 'Your security department is in place from day one, and you plan your own hires calmly.'],
        ['Enterprises and MSPs', 'An extra team on standby, or a SOC under your own name for your clients.'],
      ],
    },
  },
}
