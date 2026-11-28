// minHeight is 100vh / 0.9: index.css runs html at zoom 0.9, and 100vh under that zoom ends at 90% of the window,
// which left a grey browser strip below the page (reported 17.11.2026).
const BASE: React.CSSProperties = { position: 'relative', isolation: 'isolate', background: '#000', color: '#e8e8f0', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", minHeight: 'calc(100vh / 0.9)', padding: '80px 2rem' }

// Same backdrop as the homepage (page-structure-dark photo under a black tint, plus grain), fixed to the window so short pages never show the browser canvas.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
function PageBackdrop({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div aria-hidden="true" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.82)), url("/page-structure-dark.webp") center top / cover no-repeat' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: GRAIN, backgroundRepeat: 'repeat', backgroundSize: '180px 180px' }} />
    </motion.div>
  )
}

const TILE_ICONS: Record<string, typeof IconScale> = {
  impressum: IconScale, datenschutz: IconShieldLock, agb: IconFileText, security: IconShieldCheck,
  standards: IconCertificate, team: IconUsers, methodology: IconFlask, faq: IconHelpCircle,
}
const PROSE = { maxWidth: 1120, margin: '0 auto', lineHeight: 'var(--lh-body)' }
const H1 = { fontSize: 'var(--fs-h2)', fontWeight: 900, marginBottom: 8, color: '#e8e8f0' }
const H2: React.CSSProperties = { fontSize: 'var(--fs-small)', fontWeight: 700, marginTop: 32, marginBottom: 8, color: 'var(--accent-text)' }
const P = { color: '#a0a0b8', fontSize: 'var(--fs-body)', marginBottom: 12 }
const A = { color: 'var(--accent-text)', textDecoration: 'none' }

// Lighthouse R110/R112: FAQ, Methodology and Standards ended with no link in <main>, a dead end for readers who were convinced.
function NextSteps({ de, locale }: { de: boolean; locale: 'en' | 'de' }) {
  const l = (href: string, label: string) => <a href={href} style={A} className="rfi-inline-link">{label}</a>
  return de ? (
    <p style={{ ...P, marginTop: 32 }}>
      Wenn Sie das an Ihrem eigenen Produkt sehen wollen, {l(`${localePath(locale, '/')}#domain-check`, 'starten Sie den Quick Check')}.
      Pläne und Preise stehen unter {l(localePath(locale, '/access/'), 'Access')}, jede veröffentlichte Untersuchung im {l(localePath(locale, '/evidence/'), 'Evidence-Ledger')}.
    </p>
  ) : (
    <p style={{ ...P, marginTop: 32 }}>
      To see this applied to your own product, {l(`${localePath(locale, '/')}#domain-check`, 'start the Quick Check')}.
      Plans and prices are on {l(localePath(locale, '/access/'), 'Access')}, and every published investigation is in the {l(localePath(locale, '/evidence/'), 'evidence ledger')}.
    </p>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IconScale, IconShieldLock, IconFileText, IconShieldCheck, IconCertificate, IconUsers, IconFlask, IconHelpCircle } from '@tabler/icons-react'
import { RelatedTiles } from './RelatedTiles'
import { useLocale } from '../hooks/useLocale'
import { upsertJsonLd, breadcrumbJsonLd, faqPageJsonLd } from '../lib/structuredData'
import { attributionParams } from './sections/shared'
import auditStats from '../content/auditStats.json'
import { localePath } from './landingPages'
import { localeHref } from '../lib/localeHref'

const LIGHTHOUSE_PIXEL = '/api/track/pixel.gif'
const LIGHTHOUSE_TRACK = '/api/track'

// Client-side navigation between legal pages, and back to the homepage
// (2026-08-19, live feedback: clicking a quicklink did a full browser reload
// - "das ist nicht clean, das ist increment") - real <a href> stays for
// accessibility/middle-click/SEO, but a plain left-click is intercepted:
// pushState changes the URL without reloading, then a manually-dispatched
// PopStateEvent is what App.tsx's popstate listener picks up to actually
// update its `slug` state (pushState alone never fires popstate itself).
function navigate(e: React.MouseEvent, href: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  e.preventDefault()
  history.pushState(null, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// Reached via a real URL (/impressum etc) or the #p/slug hash - either way the
// document still carries the homepage's shared <title>/description until we set
// our own, so a search result or a browser tab would otherwise show "RFI-IRFOS -
// Rethink the Obvious." for every one of these instead of what the page is.
// titleDe/descriptionDe are set for every page except Team (2026-08-19: Security/
// Standards/Methodology got real German translations too, closing the gap live
// feedback flagged - "security policy is not translated...? how could that
// slip?"). Team stays English-only (names + short focus tags, not prose worth
// translating), so the effect below falls back to the English pair for it
// regardless of locale.
const META: Record<string, { title: string; description: string; titleDe?: string; descriptionDe?: string }> = {
  impressum: {
    title: 'Legal Notice · RFI-IRFOS', description: 'Legal notice for RFI-IRFOS, IT security provider in Graz, Austria: trade and registry data, contact, and the research association behind it.',
    titleDe: 'Impressum · RFI-IRFOS', descriptionDe: 'Impressum von RFI-IRFOS, IT-Sicherheitsdienstleister in Graz: Gewerbe- und Registerdaten, Kontakt und der Forschungsverein als Träger.',
  },
  datenschutz: {
    title: 'Privacy Policy · RFI-IRFOS', description: 'How RFI-IRFOS handles data under GDPR: what we collect, our processors, and your rights. No cookies, no profiles.',
    titleDe: 'Datenschutzerklärung · RFI-IRFOS', descriptionDe: 'Wie RFI-IRFOS mit Daten gemäß DSGVO umgeht: was wir erheben, unsere Auftragsverarbeiter und Ihre Rechte. Keine Cookies, keine Profile.',
  },
  agb: {
    title: 'Terms and Conditions · RFI-IRFOS', description: 'General Terms and Conditions for RFI-IRFOS security audits, software development, and research services. Business customers (B2B) only.',
    titleDe: 'AGB · RFI-IRFOS', descriptionDe: 'Allgemeine Geschäftsbedingungen für Sicherheitsaudits, Softwareentwicklung und Forschungsleistungen von RFI-IRFOS. Ausschließlich B2B.',
  },
  security: {
    // 2026-10-31: no sales terms on purpose - this is the institute's own disclosure policy,
    // not a service page; the title just says what a vulnerability reporter is looking for.
    title: 'Report a Vulnerability: Disclosure Policy · RFI-IRFOS', description: "Report a vulnerability to RFI-IRFOS. Coordinated disclosure per ISO/IEC 29147, 90-day embargo, regulators notified, safe harbor. No bug bounty program.",
    titleDe: 'Schwachstelle melden: Disclosure-Richtlinie · RFI-IRFOS', descriptionDe: 'Schwachstelle an RFI-IRFOS melden: koordinierte Offenlegung nach ISO/IEC 29147, 90-Tage-Embargo, Behörden informiert, Safe Harbor. Kein Bug-Bounty.',
  },
  standards: {
    // 2026-10-31: EN and DE carried the identical title "Standards & Compliance" (duplicate across
    // the hreflang pair, no buyer term). Now each names the frameworks people search for.
    title: 'NIS2, GDPR & EU AI Act: Audit Standards · RFI-IRFOS', description: 'The frameworks RFI-IRFOS audits against: NIS2 and NISG 2026, GDPR, EU AI Act, DSA, ISO/IEC 29147, 30111, 27001. See which statute backs each finding.',
    titleDe: 'NIS2, DSGVO & EU AI Act: Prüfstandards · RFI-IRFOS', descriptionDe: 'Die Rahmenwerke, gegen die RFI-IRFOS prüft: NIS2 und NISG 2026, DSGVO, EU AI Act, DSA, ISO/IEC 29147, 30111 und 27001. Welche Norm stützt welchen Befund.',
  },
  team: { title: 'Team Behind The Squad and DINGIR · RFI-IRFOS', description: "The people behind RFI-IRFOS's app security research, coordinated disclosure and ternary AI work in Graz, with their focus areas." },
  methodology: {
    title: 'Security Audit Methodology & Disclosure Rules · RFI-IRFOS', description: "The four principles behind every RFI-IRFOS audit: sources, methods, handling of results and disclosure. The same rules apply regardless of who is paying.",
    titleDe: 'Prüfmethodik & Offenlegungsregeln · RFI-IRFOS', descriptionDe: 'Die vier Prinzipien hinter jedem Audit von RFI-IRFOS: Quellen, Methoden, Umgang mit Ergebnissen, Offenlegung. Dieselben Regeln für jede Kundschaft.',
  },
  faq: {
    title: 'FAQ: Security Testing, Compliance, Managed SOC · RFI-IRFOS', description: 'Plain-language answers on security testing, compliance automation, the Managed SOC, findings and disclosure, agents, data systems, and the boundaries RFI-IRFOS keeps.',
    titleDe: 'FAQ: Sicherheitstests, Compliance, Managed SOC · RFI-IRFOS', descriptionDe: 'Verständliche Antworten zu Security Testing, Compliance-Automatisierung, Managed SOC, Funden und Offenlegung, Agenten, Datensystemen und den Grenzen, die RFI-IRFOS einhält.',
  },
}

// Short cross-links between the legal/reference pages themselves (2026-08-19,
// live feedback: "add quicklinks to the others"). Same slug set/order as
// App.tsx's LEGAL_SLUGS. labelDe only matters for the three pages that got a
// real German translation - the rest render their English label under both
// locales, same scope line as META above.
// Shortened 2026-08-19 (live feedback: "schreib halt einfach nur legal
// privacy security terms team methology, streich halt 'notice' 'policy2 und
// policy dann passts rein") - dropped the "Notice"/"Policy" qualifiers so
// the whole row fits on one line without wrapping.
const LEGAL_QUICKLINKS: { slug: string; labelEn: string; labelDe: string }[] = [
  { slug: 'impressum', labelEn: 'Legal', labelDe: 'Impressum' },
  { slug: 'datenschutz', labelEn: 'Privacy', labelDe: 'Datenschutz' },
  { slug: 'agb', labelEn: 'Terms', labelDe: 'AGB' },
  { slug: 'security', labelEn: 'Security', labelDe: 'Security' },
  { slug: 'standards', labelEn: 'Standards', labelDe: 'Standards' },
  { slug: 'team', labelEn: 'Team', labelDe: 'Team' },
  { slug: 'methodology', labelEn: 'Methodology', labelDe: 'Methodology' },
  { slug: 'faq', labelEn: 'FAQ', labelDe: 'FAQ' },
]

const FAQ_ITEMS: [string, string, string, string][] = [
  // Frontier cybersecurity (Simeon 20.11.): why agentic security matters now. The 43 days come from the Verizon DBIR 2026, which McKinsey cites.
  ['What are frontier cybersecurity capabilities, and why do they matter now?', 'Was sind Frontier-Cybersecurity-Fähigkeiten, und warum zählen sie gerade jetzt?',
    'Frontier cybersecurity capabilities use advanced AI and agentic systems to automate vulnerability discovery, exploit development, code review and defensive triage at machine speed. Because these tools are dual-use, they accelerate attackers and defenders alike. Frontier systems analyse code and generate exploits in hours where the same work once took months, which also lowers the technical bar for attackers. Agentic AI additionally plans across unfamiliar environments and carries out multi-stage operations over several hours with little human input. Meanwhile the median time organisations need to fully remediate known exploited vulnerabilities rose from 32 to 43 days according to the Verizon Data Breach Investigations Report 2026, while critical flaws are now exploited within hours of disclosure. Our agents are engineered for exactly this gap: they find, verify and fix with the same tempo, so you fix vulnerabilities fast enough to keep pace with the attackers.',
    'Frontier-Cybersecurity-Fähigkeiten nutzen fortgeschrittene KI und agentische Systeme, um Schwachstellensuche, Exploit-Entwicklung, Code-Review und defensive Triage in Maschinengeschwindigkeit zu automatisieren. Weil diese Werkzeuge doppelt nutzbar sind, beschleunigen sie Angriff und Verteidigung gleichermaßen. Frontier-Systeme analysieren Code und erzeugen Exploits in Stunden, wofür früher Monate nötig waren, und senken damit auch die technische Hürde für Angreifer. Agentische KI plant zudem in unbekannten Umgebungen und führt mehrstufige Operationen über Stunden mit wenig menschlichem Eingriff aus. Gleichzeitig stieg die mittlere Zeit bis zur vollständigen Behebung bekannter, bereits ausgenutzter Schwachstellen laut Verizon Data Breach Investigations Report 2026 von 32 auf 43 Tage, während kritische Lücken heute schon Stunden nach ihrer Veröffentlichung ausgenutzt werden. Genau für diese Lücke entwickeln wir unsere Agenten: Sie finden, prüfen und beheben im selben Tempo, damit Sie Schwachstellen schnell genug schließen, um mit den Angreifern Schritt zu halten.'],
  ['Which services do you offer?', 'Welche Leistungen bieten Sie an?', 'We test apps, APIs, cloud environments and source code, and take over ongoing protection if you want it. The pipeline is built for the agentic era: hundreds of agents cover the breadth in parallel, and specialists in Graz follow the attack paths and engineer the fix. App security audits, penetration tests, API and cloud assessments and secure code reviews all run through it. Beyond single investigations, the customer portal automates compliance checks, and the Managed SOC takes over monitoring, incident response and the fix itself, down to the code.', 'Wir prüfen Apps, APIs, Cloud-Umgebungen und Quellcode und übernehmen auf Wunsch den laufenden Schutz. Die Pipeline ist für das Zeitalter der Agenten gebaut: Hunderte Agenten decken die Breite parallel ab, und Fachleute in Graz verfolgen die Angriffswege und entwickeln die Behebung. App-Sicherheitsaudits, Penetrationstests, API- und Cloud-Prüfungen sowie Secure Code Reviews laufen alle durch sie. Über einzelne Untersuchungen hinaus automatisiert das Kundenportal Compliance-Prüfungen, und das Managed SOC übernimmt Überwachung, Reaktion auf Vorfälle und die Behebung selbst, bis in den Code.'],
  ['Which service fits my situation?', 'Welche Leistung passt zu meiner Situation?', 'Start from what you need to know. For an app you ship, the app security audit fits; for code you write, the secure code review; for systems that are reachable today, the penetration test; for AWS or Azure, the cloud assessment. If you want continuous monitoring with fixes, the Managed SOC fits, and if customers or auditors ask for proof, the portal with automated compliance checks and the Trust Center supplies it. A Quick Check of your domain shows where you stand before you decide.', 'Gehen Sie von dem aus, was Sie wissen müssen. Für eine App, die Sie ausliefern, passt das App-Sicherheitsaudit, für Code, den Sie schreiben, der Secure Code Review, für Systeme, die heute schon erreichbar sind, der Penetrationstest und für AWS oder Azure die Cloud-Prüfung. Wer laufende Überwachung samt Behebung möchte, ist im Managed SOC richtig, und wenn Kunden oder Prüfer einen Nachweis verlangen, liefert ihn das Portal mit automatisierten Compliance-Prüfungen und dem Trust Center. Ein Quick Check Ihrer Domain zeigt vorab, wo Sie stehen.'],
  ['Which platforms, languages and clouds do you cover?', 'Welche Plattformen, Sprachen und Clouds decken Sie ab?', 'Android and iOS apps together with the APIs and backends they talk to, REST and GraphQL interfaces, AWS and Azure environments, and source code in Python, Rust, Go, Java, JavaScript, TypeScript and mobile stacks. The scope is what you agree with us. A shipped build is enough for many findings, and source code allows a deeper review.', 'Android- und iOS-Apps samt den APIs und Backends, mit denen sie sprechen, REST- und GraphQL-Schnittstellen, AWS- und Azure-Umgebungen sowie Quellcode in Python, Rust, Go, Java, JavaScript, TypeScript und mobilen Stacks. Den Umfang legen Sie gemeinsam mit uns fest. Für viele Funde genügt ein ausgeliefertes Build, und mit Quellcode wird die Prüfung tiefer.'],
  ['What is the Agent OS?', 'Was ist das Agent OS?', 'The Agent OS is the control plane behind our agents: it orchestrates their work, routes tasks between them and holds a shared memory across every entry point, so a finding from one investigation is available to the next. You reach it through MCP and integrations in your existing agent tooling, or through the CLI and API from your own pipelines and CI.', 'Das Agent OS ist die Steuerungsebene hinter unseren Agenten: Es orchestriert ihre Arbeit, leitet Aufgaben zwischen ihnen weiter und hält ein gemeinsames Gedächtnis über alle Einstiegspunkte, sodass ein Fund aus einer Untersuchung der nächsten zur Verfügung steht. Sie erreichen es über MCP und Integrationen in Ihrem bestehenden Agenten-Werkzeug oder über CLI und API aus Ihren eigenen Pipelines und der CI.'],
  ['Which tools and connectors can I use?', 'Welche Werkzeuge und Connectors kann ich nutzen?', 'The portal connects to the tools your team already runs: GitHub and GitLab, Microsoft Entra ID, Kubernetes, Supabase, n8n, the OpenAI and Anthropic APIs, security tools such as Trivy, Wazuh, Suricata, Falco, Zeek, CrowdSec, Greenbone, OWASP ZAP, Nuclei, OpenSearch, DefectDojo, Dependency-Track and TheHive, a security event webhook and a private connector for your own systems. Connectors are plug and play in the customer portal and in the Agent OS: you click and connect. The private connector for your own systems has a simpler setup of its own: you download a small script, run two commands, and it only ever connects outward, so your network needs no open inbound port. MCP, CLI and API let your agents and pipelines work with them directly. The tools differ in kind, from source control and identity to infrastructure and agent tooling, so the documentation at docs.rfi-irfos.com lists the connection method of each one. All connectors are in preview today.', 'Das Portal bindet die Werkzeuge an, die Ihr Team ohnehin einsetzt: GitHub und GitLab, Microsoft Entra ID, Kubernetes, Supabase, n8n, die APIs von OpenAI und Anthropic, Sicherheitswerkzeuge wie Trivy, Wazuh, Suricata, Falco, Zeek, CrowdSec, Greenbone, OWASP ZAP, Nuclei, OpenSearch, DefectDojo, Dependency-Track und TheHive, einen Webhook für Sicherheitsereignisse und einen privaten Connector für Ihre eigenen Systeme. Connectors sind im Kundenportal und im Agent OS Plug and Play: Ihr klickt und verbindet. Der private Connector für Ihre eigenen Systeme hat ein eigenes, einfacheres Setup: Sie laden ein kleines Skript herunter, führen zwei Befehle aus, und er verbindet sich ausschließlich nach außen, sodass Ihr Netz keinen offenen eingehenden Port braucht. Über MCP, CLI und API arbeiten Ihre Agenten und Pipelines direkt damit. Die Werkzeuge unterscheiden sich in ihrer Art, von Quellcodeverwaltung und Identität bis zu Infrastruktur und Agenten-Werkzeugen, daher nennt die Dokumentation unter docs.rfi-irfos.com die Anbindungsart jedes einzelnen. Alle Connectors sind heute in der Vorschau.'],
  ['Who finds the vulnerabilities, agents or people?', 'Wer findet die Schwachstellen, Agenten oder Menschen?', 'Both, in a fixed order. Agents do the broad testing in parallel, and specialists in Graz follow the attack paths, judge the business risk and engineer the fixes. Each confirmed finding comes with a proof of concept that shows what an attacker could do with it.', 'Beide, in fester Reihenfolge. Agenten übernehmen die breite Prüfung parallel, und Fachleute in Graz verfolgen die Angriffswege, bewerten das Geschäftsrisiko und entwickeln die Behebung. Jeder bestätigte Fund kommt mit einem Proof of Concept, der zeigt, was ein Angreifer damit anstellen könnte.'],
  ['Do you help fix what you find?', 'Helfen Sie dabei, das Gefundene zu beheben?', 'Yes, from the Starter plan on. A specialist assesses every finding, rates it and adds clear fix guidance, including patch suggestions and the way to solve it in your code. Your team applies the change. From the Growth plan on we engineer the concrete fix down to the affected code, the Managed SOC delivers it within 24 hours, and a penetration test includes it as well.', 'Ja, ab dem Starter-Plan. Eine Fachperson bewertet jeden Fund, stuft ihn ein und liefert eine klare Anleitung zur Behebung, samt Patch-Vorschlägen und dem Lösungsweg für Ihren Code. Die Änderung setzt Ihr Team um. Ab dem Tarif Growth erarbeiten wir die konkrete Behebung bis in den betroffenen Code, das Managed SOC liefert sie binnen 24 Stunden, und auch ein Penetrationstest umfasst sie.'],
  ['Where is my data processed?', 'Wo werden meine Daten verarbeitet?', 'Your material, findings and portal data are processed on our own server in Graz. Wherever language models or agents work on a task that touches customers, we use European endpoints only.', 'Ihr Material, Ihre Funde und Ihre Portaldaten verarbeiten wir auf unserem eigenen Server in Graz. Überall dort, wo Sprachmodelle oder Agenten an einer Aufgabe mit Kundenkontakt arbeiten, nutzen wir ausschließlich europäische Endpunkte.'],
  // Trust facts (Register R1, Simeon 22.11.2026): instance, training, backup, contract end, own incidents, insurance. The SOC 2 self-certification entry was removed on 28.11.2026 (Simeon).
  ['Does each customer get their own instance?', 'Bekommt jeder Kunde eine eigene Instanz?', 'Yes. Your data lives in an instance of its own, separate from every other customer, and is stored encrypted. Only the team assigned to your account has access, and every access is logged.', 'Ja. Ihre Daten liegen in einer eigenen Instanz, getrennt von allen anderen Kunden, und werden verschlüsselt gespeichert. Zugriff hat ausschließlich das Team, das Ihrem Account zugeteilt ist, und jeder Zugriff wird protokolliert.'],
  ['Is my data used to train AI models?', 'Werden meine Daten zum Training von KI-Modellen verwendet?', 'Your data serves your engagement alone and trains none of the models we use. Language models that touch customer tasks run on European endpoints only.', 'Ihre Daten dienen allein Ihrem Auftrag und trainieren keines der Modelle, die wir einsetzen. Sprachmodelle, die an Kundenaufgaben arbeiten, laufen ausschließlich über europäische Endpunkte.'],
  ['How is my data backed up?', 'Wie werden meine Daten gesichert?', 'Every day, on a second storage medium in Graz. If our main site fails, a second site takes over operation.', 'Täglich, auf einem zweiten Datenträger in Graz. Fällt unser Hauptstandort aus, übernimmt ein zweiter Standort den Betrieb.'],
  ['What happens to my data when the contract ends?', 'Was passiert mit meinen Daten, wenn der Vertrag endet?', 'You receive an export of your data first. Within 30 days we then delete it from our systems, backups included, and confirm the deletion to you in writing.', 'Zuerst erhalten Sie einen Export Ihrer Daten. Binnen 30 Tagen löschen wir sie danach aus unseren Systemen, die Sicherungen eingeschlossen, und bestätigen Ihnen die Löschung schriftlich.'],
  ['What happens if you suffer a security incident yourselves?', 'Was passiert, wenn RFI-IRFOS selbst einen Sicherheitsvorfall hat?', 'We inform every affected customer within 24 hours, with what happened, which data is concerned and what we are doing about it. Our own systems are tested continuously by our own agents.', 'Wir informieren jeden betroffenen Kunden binnen 24 Stunden darüber, was geschehen ist, welche Daten betroffen sind und welche Schritte wir setzen. Unsere eigenen Systeme prüfen unsere Agenten laufend.'],
  ['Are you insured?', 'Ist RFI-IRFOS versichert?', 'Yes. Our work for customers is covered by insurance.', 'Ja. Unsere Arbeit für Kunden ist durch eine Versicherung abgedeckt.'],
  ['What is the Managed SOC?', 'Was ist das Managed SOC?', 'The Managed SOC is your outsourced security department. A dedicated team works together with our agents, monitors your systems around the clock, responds to incidents within one hour and delivers the fix within 24 hours, down to the code. It covers any number of systems, including agencies (MSP) and multi-tenant setups, and comes with white-label options and agreed SLAs. Because the scope differs for every organisation, it is priced by scope and offered in writing.', 'Das Managed SOC ist Ihre ausgelagerte Sicherheitsabteilung. Ein festes Team arbeitet mit unseren Agenten zusammen, überwacht Ihre Systeme rund um die Uhr, reagiert binnen einer Stunde auf Vorfälle und liefert die Behebung innerhalb von 24 Stunden, bis in den Code. Es deckt beliebig viele Systeme ab, auch Agenturen (MSP) und Multi-Tenant-Setups, und kommt mit White-Label-Optionen und vereinbarten SLAs. Da der Umfang je Organisation verschieden ist, richtet sich der Preis nach dem Umfang und wird schriftlich angeboten.'],
  ['Does the Managed SOC have anything to do with the SOC 2 standard?', 'Hat das Managed SOC etwas mit dem Standard SOC 2 zu tun?', 'The name describes a service, a security operations centre that works on your behalf. SOC 2 is a separate audit standard for service organisations that happens to share the letters. If SOC 2 is on your list, Compliance Automation prepares the evidence for it, while the certificate itself is issued by an accredited auditor.', 'Der Name beschreibt eine Dienstleistung, ein Security Operations Center, das für Sie arbeitet. SOC 2 ist ein eigener Prüfstandard für Dienstleistungsunternehmen, der zufällig dieselben Buchstaben trägt. Steht SOC 2 auf eurer Liste, bereitet Compliance Automation die Nachweise dafür vor, während das Zertifikat selbst von einer akkreditierten Prüfstelle ausgestellt wird.'],
  ['What is the customer portal, and who gets access?', 'Was ist das Kundenportal, und wer bekommt Zugang?', 'The customer portal is where you follow the findings, the state of each fix and the history for your systems. Access starts with the Starter plan and is included in every paid plan above it. Someone who has no credentials yet can request access on the portal sign-in page or from the Access page on this site.', 'Im Kundenportal verfolgen Sie die Funde, den Stand jeder Behebung und die Historie Ihrer Systeme. Der Zugang beginnt mit dem Tarif Starter und ist in jedem darüber liegenden bezahlten Tarif enthalten. Wer noch keine Zugangsdaten hat, kann den Zugang auf der Anmeldeseite des Portals oder über die Access-Seite dieser Website anfragen.'],
  ['What can I do in the customer portal?', 'Was kann ich im Kundenportal tun?', 'The portal is a workspace with ten areas. The Dashboard shows active alerts, monitored assets, open incidents and the live DNS, HTTP and TLS sensors. Investigations hold your scans and let you export a finished scan. Incidents run on a board of their own. Remediation is the board for fixes, Compliance holds your frameworks, controls and certificate or audit documents with a CSV export, and the Trust Center publishes the part you choose. Infrastructure lists your assets, the Vault stores documents and builds reports as PDF, and the Activity Log records what happened. In Settings you manage your team, your connectors and the security of your account, including two-factor authentication.', 'Das Portal ist ein Arbeitsbereich mit zehn Bereichen. Das Dashboard zeigt aktive Alarme, überwachte Assets, offene Vorfälle und die laufenden DNS-, HTTP- und TLS-Sensoren. Unter Investigations liegen Ihre Scans, und ein fertiger Scan lässt sich exportieren. Vorfälle laufen auf einem eigenen Board. Remediation ist das Board für Behebungen, Compliance enthält Ihre Frameworks, Kontrollen und Zertifikats- oder Audit-Dokumente mit CSV-Export, und das Trust Center veröffentlicht den Teil, den Sie auswählen. Infrastructure listet Ihre Assets, der Vault speichert Dokumente und erstellt Berichte als PDF, und das Activity Log hält fest, was geschehen ist. In den Einstellungen verwalten Sie Ihr Team, Ihre Connectors und die Sicherheit Ihres Kontos, darunter die Zwei-Faktor-Authentifizierung.'],
  ['How do I receive a fix in the portal?', 'Wie bekomme ich eine Behebung im Portal?', 'A fix arrives on its task either as a patch file or as step-by-step instructions. The patch works with every Git host: on a new branch you run git apply with the file, review the change, commit and push it and open the merge request where your team reviews code. Then you press Request retest, and the portal checks whether the finding is gone.', 'Eine Behebung kommt an der Aufgabe entweder als Patch-Datei oder als Anleitung in einzelnen Schritten an. Der Patch funktioniert mit jedem Git-Host: Auf einem neuen Branch führen Sie git apply mit der Datei aus, prüfen die Änderung, committen und pushen sie und eröffnen den Merge Request, in dem Ihr Team Code prüft. Danach drücken Sie auf Request retest, und das Portal prüft, ob der Fund verschwunden ist.'],
  ['Who can do what in the portal?', 'Wer darf im Portal was tun?', 'You invite your team by email and give each person a role: Admin, Engineer, Analyst or Auditor. Organization owners and admins manage the team, record your approval on a fix and decide what the Trust Center publishes. Only a person on your team can confirm a control as satisfied and link its document, so automatic checks never replace that decision.', 'Sie laden Ihr Team per E-Mail ein und geben jeder Person eine Rolle: Admin, Engineer, Analyst oder Auditor. Inhaberinnen, Inhaber und Admins der Organisation verwalten das Team, tragen Ihre Freigabe an einer Behebung ein und entscheiden, was das Trust Center veröffentlicht. Nur eine Person aus Ihrem Team kann eine Kontrolle als erfüllt bestätigen und ihr Dokument verknüpfen, sodass automatische Prüfungen diese Entscheidung nie ersetzen.'],
  ['Can my own AI agents work with the portal?', 'Können meine eigenen KI-Agenten mit dem Portal arbeiten?', 'Yes, through an MCP gateway over HTTPS. Your agent connects outbound with OAuth and PKCE, a signed-in person on your team approves the access, and the agent can read the compliance overview, the linked evidence, the list of connectors and the status of a scan. The access is read-only, so an agent cannot change a review, attach evidence, start a scan or perform a fix, and you can list and revoke every token yourself.', 'Ja, über ein MCP-Gateway per HTTPS. Ihr Agent verbindet sich ausgehend mit OAuth und PKCE, eine angemeldete Person aus Ihrem Team genehmigt den Zugriff, und der Agent kann die Compliance-Übersicht, die verknüpften Nachweise, die Liste der Connectors und den Stand eines Scans lesen. Der Zugriff ist schreibgeschützt, sodass ein Agent keine Bewertung ändern, keinen Nachweis anhängen, keinen Scan starten und keine Behebung durchführen kann, und Sie können jedes Token selbst einsehen und widerrufen.'],
  ['What is the Trust Center?', 'Was ist das Trust Center?', 'The Trust Center is a public page for your organisation at trust.rfi-irfos.com/your-name. It shows prospects and auditors which security frameworks you work to and which controls your team has confirmed, so a questionnaire round is often unnecessary and your sales team can answer security questions with a link. It is part of every paid plan from Starter, and you publish and unpublish it yourself in the portal.', 'Das Trust Center ist eine öffentliche Seite für Ihre Organisation unter trust.rfi-irfos.com/ihr-name. Sie zeigt Interessenten und Prüfern, nach welchen Sicherheitsstandards Sie arbeiten und welche Kontrollen Ihr Team bestätigt hat, sodass sich eine Fragebogenrunde oft erübrigt und Ihr Vertrieb Sicherheitsfragen mit einem Link beantwortet. Es gehört zu jedem bezahlten Tarif ab Starter, und Sie veröffentlichen es selbst im Portal und nehmen es dort auch wieder vom Netz.'],
  ['What does the Trust Center show, and what stays private?', 'Was zeigt das Trust Center, und was bleibt privat?', 'It shows only what you publish: the frameworks you switch on, for example EU CRA, ISO 27001, NIS2 and SOC 2, each control with its state, the time of the last real scan and, if you choose, the share of automatic checks that pass. Findings, asset and repository names, user names and documents never appear on the page. The page sets no cookies and loads nothing from third parties.', 'Es zeigt nur, was Sie veröffentlichen: die Standards, die Sie einschalten, zum Beispiel EU CRA, ISO 27001, NIS2 und SOC 2, jede Kontrolle mit ihrem Stand, den Zeitpunkt des letzten echten Scans und, wenn Sie das wollen, den Anteil der bestandenen automatischen Prüfungen. Funde, Namen von Systemen und Repositories, Nutzernamen und Dokumente erscheinen nie auf der Seite. Sie setzt keine Cookies und lädt nichts von Dritten nach.'],
  ['What do Confirmed by the company and Automatically checked mean?', 'Was bedeuten „Vom Unternehmen bestätigt“ und „Automatisch geprüft“?', 'Confirmed by the company means a person on your team set the control to satisfied and linked a document. Automatically checked means a real scan supports the control, and that mark disappears after seven days without a new scan, so an old page can never claim more than we currently know. A control that is still being worked on appears as In progress only if you decide to show it.', '„Vom Unternehmen bestätigt“ bedeutet, dass eine Person in eurem Team die Kontrolle auf erfüllt gesetzt und ein Dokument verknüpft hat. „Automatisch geprüft“ bedeutet, dass ein echter Scan die Kontrolle stützt, wobei die Markierung nach sieben Tagen ohne neuen Scan verschwindet, damit eine alte Seite nie mehr behauptet, als wir aktuell wissen. Eine Kontrolle, an der noch gearbeitet wird, erscheint nur dann als „In Arbeit“, wenn Sie sie zeigen wollen.'],
  ['What is automated compliance?', 'Was ist automatisierte Compliance?', 'From the Pro plan, the portal checks your scan results against the regulations that apply to your product and keeps the state of every control current, so you no longer assemble spreadsheets before an audit. The Business plan adds reports for management and auditors. This prepares the evidence and the picture of where you stand, while certification itself remains the job of an accredited auditor.', 'Ab dem Tarif Pro gleicht das Portal Ihre Scan-Ergebnisse mit den Vorschriften ab, die für Ihr Produkt gelten, und hält den Stand jeder Kontrolle aktuell, sodass Sie vor einem Audit keine Tabellen mehr zusammenstellen. Der Tarif Business ergänzt Berichte für Management und Prüfer. Das bereitet die Nachweise und das Bild Ihres Stands vor, während die Zertifizierung selbst Sache einer akkreditierten Prüfstelle bleibt.'],
  ['How fast can I get started, from payment to a running setup?', 'Wie schnell komme ich vom Kauf zu einem laufenden Setup?', 'Starter, Growth, Pro and Business are bought online on the Access page, and every step after that you do yourself. You pay through Stripe, receive your access code, set up two-factor authentication with an authenticator app, sign in and grant access to your codebase. The portal handles most of the preparation upfront, so no scoping call comes first. From that point the compliance checks run and the scan can start, and the whole path from payment to a running scan takes about five minutes. A report usually follows within 72 hours, depending on the scope. From the Pro plan you can then follow the compliance state of your controls.', 'Starter, Growth, Pro und Business kaufen Sie online auf der Access-Seite, und jeden Schritt danach erledigen Sie selbst. Sie bezahlen über Stripe, erhalten Ihren Zugangscode, richten die Zwei-Faktor-Authentifizierung mit einer Authenticator-App ein, melden sich an und erteilen den Zugriff auf Ihren Code. Das Portal übernimmt den Großteil der Vorbereitung von vornherein, sodass kein Abstimmungsgespräch vorausgeht. Ab diesem Punkt laufen die Compliance-Prüfungen und der Scan kann starten, und der gesamte Weg von der Zahlung bis zum laufenden Scan dauert etwa fünf Minuten. Einen Bericht erhalten Sie in der Regel innerhalb von 72 Stunden, je nach Umfang. Ab dem Tarif Pro verfolgen Sie danach den Compliance-Stand Ihrer Kontrollen.'],
  ['When do I need a written offer instead?', 'Wann brauche ich stattdessen ein schriftliches Angebot?', 'Managed SOC and Enterprise setups, meaning agencies (MSP), multi-tenant environments, white-label and agreed SLAs, are scoped in writing, because scope and service levels differ for every organisation. You describe what you run, and we answer with a written offer. Every plan below that is self-serve and starts immediately after payment.', 'Managed SOC und Enterprise, also Agenturen (MSP), Multi-Tenant-Umgebungen, White-Label und vereinbarte SLAs, werden schriftlich abgegrenzt, weil Umfang und Service-Level in jeder Organisation anders aussehen. Sie beschreiben, was Sie betreiben, und wir antworten mit einem schriftlichen Angebot. Jeder Tarif darunter läuft in Selbstbedienung und beginnt unmittelbar nach der Zahlung.'],
  ['How is this different from a compliance platform that connects to my cloud accounts?', 'Wie unterscheidet sich das von einer Compliance-Plattform, die sich an meine Cloud-Konten anbindet?', 'Many compliance platforms start from integrations with your cloud accounts and read configuration from there. We investigate the product itself: agents work through code, dependencies, APIs and configuration, and specialists follow the attack paths they uncover. The portal then maps this evidence to the controls of frameworks such as NIS2, ISO 27001 and SOC 2, so your auditor receives findings that come from real examination of your software.', 'Viele Compliance-Plattformen beginnen bei der Anbindung eurer Cloud-Konten und lesen von dort Konfigurationen aus. Wir untersuchen das Produkt selbst: Agenten arbeiten sich durch Code, Abhängigkeiten, APIs und Konfiguration, und Fachleute verifizieren, was sie finden. Das Portal ordnet diese Nachweise anschließend den Kontrollen von Standards wie NIS2, ISO 27001 und SOC 2 zu, sodass Ihre Prüferin oder Ihr Prüfer Funde erhält, die aus einer echten Untersuchung Ihrer Software stammen.'],
  ['Do you issue ISO 27001 or SOC 2 certificates?', 'Stellen Sie Zertifikate für ISO 27001 oder SOC 2 aus?', 'A certificate or attestation report is issued by an independent, accredited auditor. We supply the technical evidence, the trail of fixes and the Trust Center page that the auditor works from, so the audit starts with material that is already organised.', 'Ein Zertifikat oder ein Attestierungsbericht wird von einer unabhängigen, akkreditierten Prüfstelle ausgestellt. Wir liefern die technischen Nachweise, die Spur der Behebungen und die Trust-Center-Seite, mit denen die Prüfstelle arbeitet, sodass die Prüfung mit bereits geordnetem Material beginnt.'],
  ['Who works behind it?', 'Wer arbeitet dahinter?', 'Agents carry out the broad analysis, and a focused team of specialists in Graz follows the attack paths and fixes what they find. With the Managed SOC a dedicated team takes on your account. Being a focused team keeps contact direct, which is also why response times for the largest setups are agreed in writing.', 'Agenten übernehmen die breite Analyse, und ein fokussiertes Team von Fachleuten in Graz verfolgt die Angriffswege und behebt, was sie finden. Beim Managed SOC übernimmt ein festes Team Ihren Account. Als fokussiertes Team halten wir den Kontakt direkt, und deshalb werden die Reaktionszeiten für die größten Setups schriftlich vereinbart.'],
  ['How does a finding become proof for my auditor?', 'Wie wird aus einem Fund ein Nachweis für meine Prüfenden?', 'A specialist verifies the finding with a working proof of concept, rates it and adds fix guidance. After your team has applied the change, a retest, included from Starter, shows whether the problem is gone, and from Growth the portal keeps the history of findings and fixes. Every fix runs as a task on a remediation board with the states Open, Triaged, In Progress, Resolved and Canceled. A task bundles the findings it covers and shows its severity, repository and branch, the code fix, the pull request state, the deployment and your approval. It can be assigned to the person responsible, and you request the retest or mark it resolved right there. The portal then maps this evidence to the controls of the frameworks you work to, so each control carries its state and the time of the last real scan. Your auditor gets read-only access to the portal and can read the same picture, and the Trust Center shows prospects the part you choose to publish.', 'Eine Fachperson verifiziert den Fund mit einem funktionierenden Proof of Concept, stuft ihn ein und ergänzt eine Anleitung zur Behebung. Nachdem Ihr Team die Änderung umgesetzt hat, zeigt ein Retest, der ab Starter enthalten ist, ob das Problem behoben ist, und ab Growth führt das Portal die Historie von Funden und Behebungen. Jede Behebung läuft als Aufgabe auf einem Remediation-Board mit den Zuständen Open, Triaged, In Progress, Resolved und Canceled. Eine Aufgabe bündelt die Funde, die sie abdeckt, und zeigt Schweregrad, Repository und Branch, den Code-Fix, den Stand des Pull Requests, das Deployment und Ihre Freigabe. Sie lässt sich der verantwortlichen Person zuweisen, und den Retest fordern Sie direkt dort an oder markieren die Aufgabe als gelöst. Anschließend ordnet das Portal diese Belege den Kontrollen der Frameworks zu, nach denen Sie arbeiten, sodass jede Kontrolle ihren Stand und den Zeitpunkt des letzten echten Scans trägt. Ihre Prüfenden erhalten einen Lesezugriff auf das Portal und sehen dasselbe Bild, während das Trust Center Interessenten den Teil zeigt, den Sie veröffentlichen.'],
  ['Which compliance frameworks does the portal cover?', 'Welche Compliance-Frameworks deckt das Portal ab?', 'The catalog holds thirteen frameworks. Nine apply to every organisation: ISO 27001:2022, SOC 2, NIS2, the EU Cyber Resilience Act (EU CRA), NIST CSF 2.0, CIS Controls v8, GDPR, DORA and PCI DSS 4.0. Four more, the EU AI Act, COPPA, UK GDPR and HIPAA, count once you confirm that they concern your organisation.', 'Der Katalog umfasst dreizehn Frameworks. Neun gelten für jede Organisation: ISO 27001:2022, SOC 2, NIS2, der EU Cyber Resilience Act (EU CRA), NIST CSF 2.0, CIS Controls v8, DSGVO (GDPR), DORA und PCI DSS 4.0. Vier weitere, der EU AI Act, COPPA, UK GDPR und HIPAA, zählen, sobald Sie bestätigen, dass sie Ihre Organisation betreffen.'],
  ['Why do the EU AI Act, COPPA, UK GDPR and HIPAA work differently?', 'Warum verhalten sich EU AI Act, COPPA, UK GDPR und HIPAA anders?', 'These four frameworks apply only to certain organisations, for example those that handle children data, health data or AI systems in scope of the regulation. Until you confirm that one of them concerns you, it stays out of every score, so a regulation that does not affect you never pulls your results down.', 'Diese vier Frameworks gelten nur für bestimmte Organisationen, zum Beispiel für den Umgang mit Daten von Kindern, mit Gesundheitsdaten oder mit KI-Systemen im Anwendungsbereich der Verordnung. Solange Sie nicht bestätigen, dass eines davon Sie betrifft, bleibt es aus jeder Bewertung heraus, sodass eine Vorschrift, die Sie nicht betrifft, Ihre Ergebnisse nie herunterzieht.'],
  ['Do I need a call or a meeting before I can start?', 'Brauche ich ein Gespräch oder einen Termin, bevor ich starten kann?', 'No call is required. Starter, Growth, Pro and Business are self-serve: you pay online, receive your access code automatically, set up two-factor authentication, sign in and connect your product. Only the Managed SOC and Enterprise setups are scoped in writing.', 'Ein Gespräch ist nicht erforderlich. Starter, Growth, Pro und Business laufen in Selbstbedienung: Sie bezahlen online, erhalten Ihren Zugangscode automatisch, richten die Zwei-Faktor-Authentifizierung ein, melden sich an und binden Ihr Produkt an. Nur das Managed SOC und Enterprise-Setups werden schriftlich abgegrenzt.'],
  ['What exactly happens after I pay?', 'Was passiert genau nach der Zahlung?', 'The payment runs through Stripe, and your VAT ID is requested at checkout because we sell to businesses. Right after the payment your account is created automatically and your access code arrives by email. With that code you set up two-factor authentication, sign in to the customer portal and connect your product.', 'Die Zahlung läuft über Stripe, und Ihre USt-IdNr. wird beim Bezahlen abgefragt, weil wir an Unternehmen verkaufen. Direkt nach der Zahlung wird Ihr Konto automatisch angelegt, und Ihr Zugangscode kommt per E-Mail. Mit diesem Code richten Sie die Zwei-Faktor-Authentifizierung ein, melden sich im Kundenportal an und binden Ihr Produkt an.'],
  ['Do I have to set up two-factor authentication?', 'Muss ich die Zwei-Faktor-Authentifizierung einrichten?', 'Yes, it is part of the setup. You set it up once with your access code before your first sign-in, which protects the portal and everything you store in it, including the evidence for your audits.', 'Ja, sie gehört zum Setup. Sie richten sie einmal mit Ihrem Zugangscode ein, bevor Sie sich zum ersten Mal anmelden, und schützen damit das Portal und alles, was Sie darin ablegen, einschließlich der Nachweise für Ihre Audits.'],
  ['What does connecting my product mean?', 'Was bedeutet es, mein Produkt anzubinden?', 'You tell the portal which app, website or API you want examined. The portal handles most of the preparation upfront, so the first checks can run without a long onboarding project.', 'Ihr teilt dem Portal mit, welche App, Website oder API untersucht werden soll. Das Portal übernimmt den Großteil der Vorbereitung von vornherein, sodass die ersten Prüfungen ohne langes Onboarding-Projekt laufen können.'],
  ['Which plan do I need for the portal, the Trust Center and automated compliance?', 'Welchen Tarif brauche ich für das Portal, das Trust Center und die automatisierte Compliance?', 'The customer portal and the Trust Center are part of every paid plan from Starter. Automated compliance checks matched to the regulations that apply to your product start with the Pro plan, and Business adds reports for management and auditors. The Managed SOC includes everything in Business and adds the operation of your security department.', 'Das Kundenportal und das Trust Center gehören zu jedem bezahlten Tarif ab Starter. Automatisierte Compliance-Prüfungen, abgestimmt auf die Vorschriften, die für Ihr Produkt gelten, beginnen mit dem Tarif Pro, und Business ergänzt Berichte für Management und Prüfer. Das Managed SOC enthält alles aus Business und übernimmt zusätzlich den Betrieb eurer Sicherheitsabteilung.'],
  ['What does it cost to start?', 'Was kostet der Einstieg?', 'The Starter plan costs 99 euro per month, or 990 euro when billed yearly. Prices are in euro plus statutory VAT and apply to businesses. The Quick Check, an external read-only check of one website or application, is available at 0 euro.', 'Der Tarif Starter kostet 99 Euro pro Monat oder 990 Euro bei jährlicher Abrechnung. Die Preise verstehen sich in Euro zuzüglich gesetzlicher Umsatzsteuer und gelten für Unternehmen. Der Quick Check, eine externe, rein lesende Prüfung einer Website oder Anwendung, ist für 0 Euro verfügbar.'],
  ['Can I try something before I buy?', 'Kann ich etwas ausprobieren, bevor ich kaufe?', 'Yes, with the Quick Check at 0 euro. It examines one website or application from the outside and in read-only mode, covers domain, e-mail protection and certificates, is checked by a person and ends with a PDF report that names the next steps.', 'Ja, mit dem Quick Check für 0 Euro. Er untersucht eine Website oder Anwendung von außen und ausschließlich lesend, deckt Domain, E-Mail-Schutz und Zertifikate ab, wird von einer Person geprüft und endet in einem PDF-Bericht mit den nächsten Schritten.'],
  ['How often does the Trust Center update, and can search engines find it?', 'Wie oft aktualisiert sich das Trust Center, und finden Suchmaschinen es?', 'The page refreshes every hour and whenever you review a control. Search engines are kept out by default, and your page becomes searchable only after you switch on the setting that allows search engines to list it.', 'Die Seite aktualisiert sich jede Stunde und sobald Sie eine Kontrolle bewerten. Suchmaschinen bleiben standardmäßig außen vor, und Ihre Seite wird erst auffindbar, nachdem Sie die Einstellung einschalten, die Suchmaschinen das Listen erlaubt.'],
  ['Do you examine compiled apps and binaries as well as source code?', 'Untersuchen Sie kompilierte Apps und Binärdateien ebenso wie Quellcode?', 'Yes, examining binaries is the core of our research. Our agents decompile mobile apps, follow their code and data flows and trace every connection to the servers they reach. In reviews of your own product, agents also work through code, dependencies, APIs and configuration, and specialists follow the attack paths they uncover.', 'Ja, die Untersuchung von Binärdateien ist der Kern unserer Forschung. Unsere Agenten dekompilieren mobile Apps, verfolgen deren Code- und Datenflüsse und zeichnen jede Verbindung zu den erreichten Servern nach. Bei Prüfungen Ihres eigenen Produkts arbeiten sich die Agenten zusätzlich durch Code, Abhängigkeiten, APIs und Konfiguration, und Fachleute verfolgen die Angriffswege, die sie dabei finden.'],
  ['Who are we and what do we do?', 'Wer sind wir und was machen wir?', 'RFI-IRFOS is an IT security provider in Graz. We run penetration tests, app and software security audits, NIS2 consulting and a Managed SOC for companies in Styria, Austria and the DACH region, and every service is delivered by our registered trade for data processing and information technology (GISA 39261441). Behind it stands the RFI-IRFOS research association (ZVR 1015608684) as sponsoring body: it builds the technology we work with, from our own agent swarm to the DINGIR world model, and research that is ready for the market becomes a venture of its own. A share of what these ventures earn flows back into new research.', 'RFI-IRFOS ist ein IT-Sicherheitsdienstleister in Graz. Wir führen Penetrationstests, App- und Software-Audits, NIS2-Beratung und ein Managed SOC für Unternehmen in der Steiermark, in Österreich und im DACH-Raum durch, und sämtliche Leistungen erbringt unser Gewerbe für Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik (GISA 39261441). Dahinter steht der Forschungsverein RFI-IRFOS (ZVR 1015608684) als Träger: Er entwickelt die Technologie, mit der wir arbeiten, vom eigenen Agentenschwarm bis zum Weltmodell DINGIR, und marktreife Forschung wird zu einem eigenen Venture. Ein Anteil am Ertrag dieser Ventures fließt zurück in neue Forschung.'],
  ['What is an LLM?', 'Was ist ein LLM?', 'A large language model predicts and generates text from patterns in training data. It is one component we build with and around, not a complete system on its own, which is why we also train albert., our own ternary LLM, instead of treating an LLM as the whole product. A model that only predicts the next token cannot check what it just said against anything real, that check has to come from somewhere else in the system.', 'Ein Large Language Model sagt Text anhand gelernter Muster voraus und erzeugt ihn. Es ist eine Komponente, mit der und um die wir bauen, kein vollständiges System für sich, deshalb trainieren wir mit albert. auch unser eigenes ternäres LLM, statt ein LLM als das ganze Produkt zu behandeln. Ein Modell, das nur das nächste Token vorhersagt, kann nicht selbst prüfen, ob das eben Gesagte stimmt, diese Prüfung muss von woanders im System kommen.'],
  ['What is an agent?', 'Was ist ein Agent?', 'An agent combines a model, tools, and observations to pursue a goal and act on its own. We run agents across very different parts of our work: ingesting and validating claims into DINGIR, our world model, running task suites for client agent evaluations, and cross-checking evidence for the security research we publish, always with a human reviewing before anything ships. We keep that human gate because an agent that can act can also act on a wrong belief, and the cost of that mistake is real, not a retry.', 'Ein Agent verbindet ein Modell, Werkzeuge und Beobachtungen, um selbstständig ein Ziel zu verfolgen und zu handeln. Wir setzen Agenten in sehr unterschiedlichen Teilen unserer Arbeit ein: beim Einspeisen und Prüfen von Behauptungen in DINGIR, unser World Model, bei Aufgabensuiten für Kunden-Agent-Evaluationen, und beim Gegenprüfen von Evidenz für die Sicherheitsforschung, die wir veröffentlichen, immer mit einem Menschen, der prüft, bevor etwas rausgeht. Dieses menschliche Gate behalten wir, weil ein Agent, der handeln kann, auch auf einem falschen Befund handeln kann, und der Preis dafür ist real, kein einfacher Neuversuch.'],
  ['What is a world model?', 'Was ist ein World Model?', 'A world model keeps a structured, evolving picture of entities, relationships, and causes so a claim can be checked against reality instead of just sounding right. Ours is called DINGIR: a graph that learns its own topology with a neural network and stamps every claim with a ternary state, supported, unresolved, or refuted, never a flat yes. We refuse the flat yes on purpose, most systems that claim certainty are just hiding the cases where they were not sure.', 'Ein World Model hält ein strukturiertes, sich veränderndes Bild von Entitäten, Beziehungen und Ursachen bereit, damit eine Behauptung an der Realität geprüft werden kann, statt nur plausibel zu klingen. Unseres heißt DINGIR: ein Graph, der seine Topologie mit einem neuronalen Netz lernt und jede Behauptung mit einem ternären Zustand versieht, bestätigt, ungeklärt oder widerlegt, nie ein flaches Ja. Das flache Ja verweigern wir bewusst, die meisten Systeme, die Gewissheit behaupten, verstecken damit nur die Fälle, in denen sie sich nicht sicher waren.'],
  ['What is a data warehouse?', 'Was ist ein Data Warehouse?', 'A data warehouse pulls information from many sources into one consistent, queryable place. We build ours from the evidence our own research already produces, world-model observations, agent-safety trajectories, app-behaviour data, and offer it as structured, provenance-tracked data through our Data Solutions line, not just kept for internal use. The work of producing that evidence already happened once, we saw no reason to make a customer pay for us to do it again from scratch.', 'Ein Data Warehouse führt Informationen aus vielen Quellen an einem konsistenten, abfragbaren Ort zusammen. Unseres bauen wir aus der Evidenz, die unsere eigene Forschung ohnehin erzeugt, World-Model-Beobachtungen, Agent-Safety-Trajektorien, App-Verhaltensdaten, und bieten sie über unsere Data-Solutions-Linie als strukturierte, herkunftsnachvollziehbare Daten an, nicht nur intern gehalten. Die Arbeit, diese Evidenz zu erzeugen, ist bereits einmal passiert, wir sahen keinen Grund, eine Kundschaft dafür zahlen zu lassen, dass wir sie von Grund auf wiederholen.'],
  ['What do we build?', 'Was bauen wir?', 'Our own stack: a ternary logic runtime built from scratch, not borrowed from binary AI frameworks, albert., our self-trained ternary LLM, DINGIR, our evidence-graph world model, Rust and Axum backend services, and the tooling behind ' + auditStats.appsAudited + '+ Android and iOS app audits. Same team builds all of it, because a system we understand end to end is one we can actually stand behind when something in it is wrong.', 'Unseren eigenen Stack: eine von Grund auf gebaute ternäre Logik-Runtime, nicht aus binären KI-Frameworks abgeleitet, albert., unser selbst trainiertes ternäres LLM, DINGIR, unser Evidenzgraph-World-Model, Rust- und Axum-Backend-Services, und das Werkzeug hinter über ' + auditStats.appsAudited + ' Android- und iOS-App-Audits. Dasselbe Team baut alles davon, weil wir nur für ein System, das wir Ende-zu-Ende verstehen, wirklich einstehen können, wenn darin etwas nicht stimmt.'],
  ['What does whitebox mean?', 'Was bedeutet Whitebox?', 'Every step of what we build is traceable and inspectable, not hidden behind a vendor black box. We think of ourselves as the whitebox counterpart to systems like Palantir: the same category of capability, but you can see how a conclusion was reached instead of just being told to trust it. That distinction only means something if we hold ourselves to it too, so the same traceability applies to our own findings, not only to the systems we sell.', 'Jeder Schritt dessen, was wir bauen, ist nachvollziehbar und einsehbar, nicht hinter der Blackbox eines Anbieters versteckt. Wir verstehen uns als die Whitebox-Entsprechung zu Systemen wie Palantir: dieselbe Kategorie an Fähigkeit, aber man sieht, wie eine Schlussfolgerung zustande kam, statt sie nur glauben zu müssen. Dieser Unterschied zählt nur, wenn wir uns selbst daran halten, deshalb gilt dieselbe Nachvollziehbarkeit für unsere eigenen Befunde, nicht nur für die Systeme, die wir verkaufen.'],
  ['Do you keep audit trails?', 'Führen Sie Audit-Trails?', 'Yes, and we check them against tampering, not just log them. Our internal systems anchor audit history outside the database itself, so a restored backup or a rewritten row gets flagged automatically instead of being discovered by accident. A log that only the same database can vouch for is not really independent evidence, it is just a second copy of the same claim.', 'Ja, und wir prüfen sie auch auf Manipulation, nicht nur, dass sie geloggt werden. Unsere internen Systeme verankern die Audit-Historie außerhalb der eigentlichen Datenbank, damit ein wiederhergestelltes Backup oder eine nachträglich veränderte Zeile automatisch auffällt, statt zufällig entdeckt zu werden. Ein Log, für das nur dieselbe Datenbank bürgt, ist keine wirklich unabhängige Evidenz, sondern nur eine zweite Kopie derselben Behauptung.'],
  ['How do you handle personal data?', 'Wie gehen Sie mit personenbezogenen Daten um?', 'We agree the handling rules with a client before we touch anything, minimise what we collect, and keep test and research data isolated from anything identifying by default. For the security research we publish on behalf of our research partners, we go further, no personal data gets published either, only the technical facts and the company\'s own response, under a fixed embargo, whether they reply or not. Publication was never meant to depend on someone paying us to stay quiet, so it does not.', 'Wir vereinbaren die Umgangsregeln mit einer Kundschaft, bevor wir überhaupt etwas anfassen, minimieren was wir erheben, und halten Test- und Forschungsdaten standardmäßig von allem Identifizierenden getrennt. Bei der Sicherheitsforschung, die wir im Auftrag unserer Forschungspartner veröffentlichen, gehen wir weiter, es werden auch keine personenbezogenen Daten veröffentlicht, nur die technischen Fakten und die Antwort des Unternehmens, unter einem festen Embargo, egal ob geantwortet wird. Veröffentlichung sollte nie davon abhängen, ob uns jemand fürs Schweigen bezahlt, deshalb tut sie das auch nicht.'],
  ['Is client data published?', 'Werden Kundendaten veröffentlicht?', 'No. A client\'s private data, environments, and results stay private unless they explicitly approve publication. Separately, we also run security research into public apps on behalf of our research partners, and that follows a different, fixed 90 day disclosure clock that applies the same way regardless of payment, a paying client and an unrelated app vendor are not the same relationship and should not sit under the same rule.', 'Nein. Private Daten, Umgebungen und Ergebnisse einer Kundschaft bleiben privat, außer sie geben eine ausdrückliche Freigabe. Daneben betreiben wir im Auftrag unserer Forschungspartner auch Sicherheitsforschung zu öffentlichen Apps, die einer anderen, festen 90-Tage-Offenlegungsfrist folgt, die unabhängig von einer Zahlung gleich gilt, eine zahlende Kundschaft und ein unbeteiligter App-Anbieter sind nicht dieselbe Beziehung und sollten nicht derselben Regel unterliegen.'],
  ['Do you build mass-surveillance systems?', 'Bauen Sie Massenüberwachung?', 'No. We audit companies that overreach on data collection, we do not build the overreach ourselves. That line holds regardless of who is asking or what is on offer, because the whole reason our audits carry any weight is that we have never been on the other side of one.', 'Nein. Wir prüfen Unternehmen, die bei der Datenerhebung übers Ziel hinausschießen, wir bauen das Übersteigen nicht selbst. Diese Grenze gilt unabhängig davon, wer fragt oder was geboten wird, weil unsere Audits nur deshalb Gewicht haben, weil wir selbst nie auf der anderen Seite eines solchen standen.'],
  ['Do you do social engineering?', 'Machen Sie Social Engineering?', 'No. Every finding in our security disclosures comes from decompiling a public app binary or reading a company\'s own published policy, never from tricking an employee or a support contact into giving something up. That standard extends past disclosures too, we do not manipulate people to get information anywhere in our work, whatever the research question.', 'Nein. Jeder Befund in unseren Sicherheits-Offenlegungen stammt aus dem Dekompilieren einer öffentlichen App oder dem Lesen der eigenen veröffentlichten Richtlinie eines Unternehmens, nie daraus, eine Mitarbeiterin oder einen Support-Kontakt zur Herausgabe von etwas zu bewegen. Dieser Maßstab gilt über Offenlegungen hinaus, wir manipulieren nirgends in unserer Arbeit Menschen, um an Informationen zu kommen, egal um welche Forschungsfrage es geht.'],
  ['Are human rights negotiable?', 'Sind Menschenrechte verhandelbar?', 'No. It is the one line no scope negotiation ever moves, regardless of client, budget, or deadline. A boundary that bends under enough pressure was never really a boundary, it was a starting offer.', 'Nein. Das ist die eine Grenze, die sich bei keiner Scope-Verhandlung verschiebt, egal welche Kundschaft, welches Budget, welche Frist. Eine Grenze, die unter genug Druck nachgibt, war nie wirklich eine Grenze, sondern nur ein Startangebot.'],
  ['What does explainability by design mean?', 'Was bedeutet Explainability by Design?', 'We design in the answer to "why did the system do that" before writing the first line of code, not after an incident forces us to. Every DINGIR claim ships with its own confidence state and source chain for exactly this reason. Bolting on an explanation after the fact usually means reverse-engineering a story that fits, which is not the same thing as knowing why something actually happened.', 'Wir entwerfen die Antwort auf "warum hat das System das gemacht", bevor die erste Zeile Code geschrieben wird, nicht erst, nachdem uns ein Vorfall dazu zwingt. Jede DINGIR-Behauptung trägt genau deshalb ihren eigenen Vertrauenszustand und ihre Quellenkette. Eine Erklärung nachträglich anzuflicken heißt meist, sich im Nachhinein eine passende Geschichte zu suchen, das ist nicht dasselbe wie zu wissen, warum etwas wirklich passiert ist.'],
  ['How does the EU AI Act influence the stack?', 'Wie beeinflusst der EU AI Act den Stack?', 'Articles 13 (transparency), 14 (human oversight), and 15 (accuracy, robustness, cybersecurity) are reference points we design against directly, not compliance items bolted on once a system already ships. Building to a legal article after launch usually means retrofitting logs and disclaimers around decisions the system already made, which is the same shallow fix as after-the-fact explainability.', 'Artikel 13 (Transparenz), 14 (menschliche Aufsicht) und 15 (Genauigkeit, Robustheit, Cybersicherheit) sind Referenzpunkte, gegen die wir direkt entwerfen, keine Compliance-Punkte, die erst nachträglich draufgesetzt werden. Erst nach dem Launch auf einen Gesetzesartikel hinzubauen bedeutet meist, Logs und Disclaimer um bereits getroffene Entscheidungen herumzubauen, derselbe oberflächliche Fix wie nachträgliche Explainability.'],
  ['Can you evaluate an existing agent?', 'Können Sie einen bestehenden Agenten evaluieren?', 'Yes. We build task suites around your actual tools, instrument tool use step by step, label failure and safety categories, and hand back a report anchored in real trajectories, not a generic benchmark score. A benchmark score tells you how an agent did on someone else\'s tasks, not on yours, and those are rarely the same thing.', 'Ja. Wir bauen Aufgabensuiten um Ihre echten Werkzeuge, instrumentieren die Tool-Nutzung Schritt für Schritt, labeln Fehler- und Sicherheitskategorien und liefern einen Bericht, der in echten Trajektorien verankert ist, nicht in einem generischen Benchmark-Score. Ein Benchmark-Score sagt, wie ein Agent bei fremden Aufgaben abgeschnitten hat, nicht bei Ihren, und das ist selten dasselbe.'],
  ['Can you build a private test environment?', 'Können Sie eine private Testumgebung bauen?', 'Yes. Containerised, deterministic resets, controlled test credentials that never touch production, the same setup we use for our own agent-safety evaluations. We hold outside work to the same standard we hold ourselves to, otherwise the word "test" would not mean anything.', 'Ja. Containerisiert, deterministische Resets, kontrollierte Testzugänge, die nie an Produktivsysteme rühren, dasselbe Setup, das wir für unsere eigenen Agent-Safety-Evaluationen nutzen. Wir legen an fremde Arbeit denselben Maßstab an wie an unsere eigene, sonst würde das Wort "Test" nichts bedeuten.'],
  ['What does reproducible mean?', 'Was bedeutet reproduzierbar?', 'Run the same versioned input against the same environment a year from now and get an auditable trail of exactly what changed and why, not just a similar-looking result. A result that cannot be reproduced is an anecdote, however convincing it looked the first time.', 'Denselben versionierten Input auch in einem Jahr wieder gegen dieselbe Umgebung laufen lassen und einen prüfbaren Nachweis bekommen, was sich verändert hat und warum, nicht nur ein ähnlich aussehendes Ergebnis. Ein Ergebnis, das sich nicht reproduzieren lässt, ist eine Anekdote, egal wie überzeugend es beim ersten Mal wirkte.'],
  ['How do you report security findings?', 'Wie melden Sie Security-Funde?', 'We run a root level investigation into the app binary, not a surface scan, contact the affected company through a coordinated written channel with regulators copied in, and publish the findings after a fixed 90 day embargo whether they ever reply or not. Copying the regulator in from the start means we are never the only ones who know what we found, which is the point.', 'Wir führen eine Untersuchung auf Root-Ebene im App-Binary durch, keine Oberflächenprüfung, kontaktieren das betroffene Unternehmen über einen koordinierten, schriftlichen Kanal mit Aufsichtsbehörden in Kopie, und veröffentlichen die Befunde nach einem festen 90-Tage-Embargo, egal ob je geantwortet wird. Die Behörde von Anfang an in Kopie zu setzen heißt, dass wir nie die Einzigen sind, die wissen, was wir gefunden haben, genau das ist der Punkt.'],
  ['How can an organisation start?', 'Wie kann eine Organisation starten?', 'Send us one concrete objective, constraint, or system you actually want to understand, not a wishlist. We scope the smallest useful first step from there, because a first engagement that tries to prove everything at once usually proves nothing well.', 'Schicken Sie uns ein konkretes Ziel, eine Grenze oder ein System, das Sie wirklich verstehen wollen, keine Wunschliste. Wir definieren von da aus den kleinsten sinnvollen ersten Schritt, weil ein erstes Engagement, das alles auf einmal beweisen will, meist nichts davon richtig beweist.'],
]

function FaqPage({ locale }: { locale: 'en' | 'de' }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return <div style={PROSE}>
    <h1 style={H1}>{locale === 'de' ? 'Fragen, die man beantworten sollte' : 'Questions worth answering'}</h1>
    <p style={{ ...P, fontSize: 'var(--fs-body)' }}>{locale === 'de' ? 'Verständliche Antworten zu unserer Arbeit, unseren Systemen und unseren Grenzen.' : 'Plain-language answers about our work, our systems, and our boundaries.'}</p>
    <div className="legal-faq-list">
      {FAQ_ITEMS.map(([q, qDe, a, aDe], index) => {
        const open = openIndex === index
        return <div key={q} className={`legal-faq-item${open ? ' is-open' : ''}`}>
          <button type="button" className="legal-faq-question" aria-expanded={open} onClick={() => setOpenIndex(open ? null : index)}>
            <span>{locale === 'de' ? qDe : q}</span><span aria-hidden="true">+</span>
          </button>
          <div className="legal-faq-answer"><p style={{ ...P, color: 'var(--text)' }}>{locale === 'de' ? aDe : a}</p></div>
        </div>
      })}
    </div>
  </div>
}

export function LegalPage({ slug }: { slug: string }) {
  const footerRef = useRef<HTMLDivElement>(null)
  const { locale, setLocale } = useLocale()

  useEffect(() => {
    // Landing pages (2026-10-31) carry their own per-locale title/description/FAQ in
    // landingPages.ts instead of a META entry; same head writes, plus a BreadcrumbList and a
    // FAQPage built from the page's visible Q&A (the exact text rendered below, not a sample).
    const meta = META[slug]
    if (!meta) return
    const title = (locale === 'de' && meta.titleDe) ? meta.titleDe : meta.title
    const description = (locale === 'de' && meta.descriptionDe) ? meta.descriptionDe : meta.description
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description)

    const quicklink = LEGAL_QUICKLINKS.find(q => q.slug === slug)
    if (quicklink) {
      upsertJsonLd('ld-breadcrumb', breadcrumbJsonLd(locale === 'de' ? quicklink.labelDe : quicklink.labelEn, `${locale === 'de' ? '/de' : ''}/${slug}`))
    }
    // The 20 real Q&A pairs below are the only ones that exist for this site - not
    // a sample, the actual FAQPage content a crawler landing on /faq would see.
    if (slug === 'faq') {
      upsertJsonLd('ld-faqpage', faqPageJsonLd(FAQ_ITEMS.map(([q, qDe, a, aDe]) => locale === 'de' ? [qDe, aDe] : [q, a])))
    } else {
      document.getElementById('ld-faqpage')?.remove()
    }
  }, [slug, locale])

  // Same privacy-safe mechanism as the main site's section tracker: an in-memory-only
  // IntersectionObserver, no cookie/localStorage, no visitor id. This one watches the
  // footer identity block at the bottom of every legal/security page, so we can see
  // (in aggregate only, never per-visitor) whether people actually read to the end of
  // these pages, not just that the page loaded.
  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    let fired = false
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || fired) continue
        fired = true
        fetch(LIGHTHOUSE_TRACK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: location.pathname, section: `legal-${slug}`, site: 'rfi-irfos' }),
        }).catch(() => {})
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [slug])

  // Every page except Team branches on locale now (see each function below) -
  // the toggle still shows on /team too, for consistency and because it's
  // shared state with the homepage anyway, it just doesn't change anything
  // there.
  const reduce = useReducedMotion()
  return (
    <div style={BASE}>
      <PageBackdrop reduce={reduce} />
      <div style={PROSE}>
        {/* Glass card wrapping the whole page body (2026-08-18, live feedback:
            "wenigstens schaut sleek aus drunter si ne transparente glass box unter
            die texte") - .rfi-glass resolves against :root's dark token set even
            without a [data-theme] ancestor (LegalPage is always-dark, unlike
            PublicSite), so it's safe to use here unmodified. Backdrop-filter is
            fine on a single static wrapper - the "never on repeating content"
            rule is about the 311-row ledger/filmstrip re-sampling every scroll
            frame, not a one-off page shell. */}
        <motion.div className="rfi-glass" style={{ borderRadius: 20, padding: '36px 40px' }}
          initial={reduce ? false : { opacity: 0, y: 22, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        {/* Back button, quicklinks, and the DE/EN toggle all in ONE row now
            (2026-08-19, live feedback: "die pillen sollen zwischen dem back
            und dem DE button sitzen so alle auf einer reihe"). BUG FIXED same
            day: flexWrap:'wrap' was on this OUTER row, so once the row ran
            out of width the DE button (last child) wrapped onto its own
            second line, exactly the two-row layout this was meant to fix
            ("desch a witz oder"). nowrap here pins back/DE to the row
            permanently; only the quicklinks group in the middle (its own
            flexWrap below) is allowed to reflow onto extra internal lines. */}
        <div style={{ marginBottom: 40, display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          {/* Text link replaced with an icon button (2026-08-19, live feedback:
              "instead of '← rfi-irfos.com' just a nice green back button svg").
              Client-side nav via the `navigate` helper above - no more full
              reload on the way back to the homepage. */}
          <a
            href={localeHref('/', locale)}
            onClick={e => navigate(e, localeHref('/', locale))}
            aria-label={locale === 'de' ? 'Zurück zu rfi-irfos.com' : 'Back to rfi-irfos.com'}
            title={locale === 'de' ? 'Zurück zu rfi-irfos.com' : 'Back to rfi-irfos.com'}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,245,196,0.07)', border: '1px solid rgba(0,245,196,0.22)', color: '#8fe8d0',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>
          {/* Quicklinks to the other legal/reference pages (2026-08-19, live
              feedback) - jump between them directly instead of routing back
              through the homepage footer each time. Client-side via `navigate`
              (was a full-reload <a href> - "das ist nicht clean, das ist
              increment"), real href kept for middle-click/SEO/no-JS. */}
          <nav aria-label={locale === 'de' ? 'Verwandte Seiten' : 'Related pages'} style={{ display: 'flex', flexWrap: 'wrap', gap: 5, flex: '1 1 auto', justifyContent: 'center' }}>
            {LEGAL_QUICKLINKS.filter(q => q.slug !== slug).map(q => (
              // display: inline-flex + lineHeight: 1 (2026-08-19, live feedback:
              // "sollten die buttons net alle in einer reihe sauber sein?") -
              // plain inline <a> pills can render at subtly different heights
              // depending on their text length/line-box metrics; forcing a
              // flex box with centred content guarantees every pill is the
              // exact same height regardless of label length.
              <a key={q.slug} href={localeHref(`/${q.slug}/`, locale)} onClick={e => navigate(e, localeHref(`/${q.slug}/`, locale))} style={{
                display: 'inline-flex', alignItems: 'center', lineHeight: 'var(--lh-tight)',
                fontSize: 'var(--fs-label)', fontWeight: 700, color: '#8a8aa0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 999, padding: '5px 8px', textDecoration: 'none',
              }}>
                {locale === 'de' ? q.labelDe : q.labelEn}
              </a>
            ))}
          </nav>
          {/* Wrapped in a pill (2026-08-19, live feedback) - same chrome as the
              System Card modal's link pills, was bare text before. */}
          <button
            onClick={() => setLocale(locale === 'de' ? 'en' : 'de')}
            title={locale === 'de' ? 'Language: German (click to switch)' : 'Sprache: Englisch (klicken zum Wechseln)'}
            style={{
              flexShrink: 0,
              fontSize: 'var(--fs-label)', fontWeight: 700, color: '#8fe8d0', background: 'rgba(0,245,196,0.07)', border: '1px solid rgba(0,245,196,0.22)',
              borderRadius: 999, padding: '6px 14px', cursor: 'pointer',
            }}
          >
            {locale === 'de' ? 'EN' : 'DE'}
          </button>
        </div>
        {/* AnimatePresence + key={slug} (2026-08-19, live feedback: "not just
            instant change and dynamic animation") - a quicklink click now
            fades/slides the new page's content in instead of snapping
            instantly, the same "remount for a smooth swap" pattern already
            used by the Research area modal's cross-links. */}
        <AnimatePresence mode="wait">
          {/* <main> (Lighthouse R104): Leistungs-, Rechts- und Methodikseiten hatten keinen Hauptinhalt-Landmark,
              Screenreader, Reader-Modus und Text-Extraktoren fanden den Seiteninhalt nicht als Hauptteil. */}
          <motion.main
            key={slug}
            className="rfi-page-main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {slug === 'impressum'   && <Impressum />}
            {slug === 'datenschutz' && <Datenschutz />}
            {slug === 'agb'         && <AGB />}
            {slug === 'security'    && <Security />}
            {slug === 'standards'   && <Standards />}
            {slug === 'team'        && <Team />}
            {slug === 'methodology' && <Methodology />}
            {slug === 'faq'         && <FaqPage locale={locale} />}
            {(slug === 'faq' || slug === 'methodology' || slug === 'standards') && <NextSteps de={locale === 'de'} locale={locale} />}
            {!['impressum', 'datenschutz', 'agb', 'security', 'standards', 'team', 'methodology', 'faq'].includes(slug) && (
              <p style={P}>Seite nicht gefunden.</p>
            )}
            {LEGAL_QUICKLINKS.some(q => q.slug === slug) && (
              <RelatedTiles title={locale === 'de' ? 'Verwandte Seiten' : 'Related pages'} navigate={navigate}
                items={LEGAL_QUICKLINKS.filter(q => q.slug !== slug).map(q => ({ href: localeHref(`/${q.slug}/`, locale), label: locale === 'de' ? q.labelDe : q.labelEn, Icon: TILE_ICONS[q.slug] }))} />
            )}
          </motion.main>
        </AnimatePresence>
        <div ref={footerRef} style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>
          RFI-IRFOS &nbsp;&middot;&nbsp; ZVR 1015608684 &nbsp;&middot;&nbsp; GISA 39261441 &nbsp;&middot;&nbsp; GLN 9110038490191 &nbsp;&middot;&nbsp; UID ATU83405245 &nbsp;&middot;&nbsp; Steuernummer 68 696/8736 &nbsp;&middot;&nbsp; Elisabethinergasse 25/10, 8020 Graz
        </div>
        </motion.div>
        {/* Lighthouse monitoring pixel — page-view only, same mechanism disclosed in the privacy policy below.
            Carries the same first-touch gclid/utm_* attribution as the JSON beacon (see shared.tsx's
            attributionParams doc comment) - a visitor landing straight on a legal/FAQ page from a paid
            ad deserves the same "paid" classification a homepage landing gets, not "direct". */}
        <img src={`${LIGHTHOUSE_PIXEL}?${new URLSearchParams({ site: 'rfi-irfos', p: `/${slug}`, r: document.referrer, ...attributionParams() })}`}
          alt="" width="1" height="1" style={{ display: 'none' }} />
      </div>
    </div>
  )
}

// Impressum/Datenschutz/AGB (2026-08-18): these three carry actual legal weight
// for an Austrian audience under § 5 ECG / GDPR / KSchG, so they got real German
// translations rather than staying English-only like Security/Standards/Team/
// Methodology. Each function below branches on locale and renders one of two
// sibling components - kept as separate EN/DE components rather than one JSX
// tree with inline ternaries per line, since a legal text is exactly the kind
// of content where "which language is this sentence in" needs to be visually
// obvious while editing, not inferred from a ternary.
function Impressum() {
  const { locale } = useLocale()
  return locale === 'de' ? <ImpressumDE /> : <ImpressumEN />
}

function ImpressumEN() {
  return <>
    <h1 style={H1}>Legal Notice</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>Disclosure pursuant to § 5 ECG (Austrian E-Commerce Act) and § 25 MedienG (Austrian Media Act) &middot; Last updated: October 2026</p>

    <p style={P}>
      We publish under our own name, at a real street address, because coordinated disclosure only works if the institute doing it can be found, verified, and held to account — the same standard we hold everyone we audit to. Most of what follows on this page exists because the law requires it. A few lines exist because we think a legal notice page shouldn't feel like the one part of a website that nobody proofread.
    </p>

    <h2 style={H2}>Operator</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Research Focus Institute — Interdisciplinary Research Facility for Open Sciences</strong><br />
      Short name: RFI-IRFOS<br />
      Elisabethinergasse 25/10, 8020 Graz, Austria<br />
      E-Mail: <a href="mailto:contact@rfi-irfos.com" style={A} className="rfi-inline-link">contact@rfi-irfos.com</a><br />
      Website: <a href="https://rfi-irfos.com" style={A} className="rfi-inline-link">rfi-irfos.com</a>
    </p>

    <h2 style={H2}>Who Delivers the Services</h2>
    <p style={P}>
      RFI-IRFOS is an IT security provider in Graz for penetration testing, app and software security audits, NIS2 consulting and Managed SOC. All services are provided by the registered trade for services in automatic data processing and information technology (GISA 39261441). The trade is held by the RFI-IRFOS research association, which acts as sponsoring body: it develops the underlying technology and carries research that is ready for the market into ventures of their own.
    </p>

    <h2 style={H2}>Register &amp; Trade Data</h2>
    <p style={P}>
      Legal form of the trade holder: Registered association (regulated not-for-profit)<br />
      ZVR number (Austrian Central Register of Associations): 1015608684<br />
      GISA number (Trade Register): 39261441<br />
      GLN: 9110038490191<br />
      VAT ID (UID): ATU83405245<br />
      Tax number: 68 696/8736<br />
      Trade description: Services in automatic data processing and information technology<br />
      Governing trade law: Austrian Trade Regulation Act (Gewerbeordnung, GewO) &middot; WKO member (Austrian Federal Economic Chamber)<br />
      Competent authority pursuant to § 5(1)(5) ECG: Magistrate of the City of Graz<br />
      Trade registered: 19 March 2026
    </p>
    <p style={P}>
      All figures above are checkable against the public register, not just asserted here. That is deliberate: a legal notice that can't survive being cross-referenced against its own registry is not much of a legal notice.
    </p>

    <h2 style={H2}>Trade-Law Management</h2>
    <p style={P}>Simeon-Andreas Johann Manfred Kepp, responsible under Austrian trade law (GewO) for the licensed activity listed above.</p>

    <h2 style={H2}>Disclosure Pursuant to § 25 MedienG</h2>
    <p style={P}>
      Media owner: Research Focus Institute — Interdisciplinary Research Facility for Open Sciences (RFI-IRFOS), registered seat Graz, address as above.<br />
      Board of the association: Simeon-Andreas Johann Manfred Kepp (Chair) and Louis Ehrig (Treasurer). Under the statutes, both represent the association externally together.<br />
      Editorial line: independent publication of research results on the privacy and security of software, including the public disclosure ledger, and information about the institute's work.
    </p>

    <h2 style={H2}>Trademarks and Logos</h2>
    <p style={P}>
      All product names, company names and logos mentioned on this website are the property of their respective owners. They appear only to describe which systems our software works with. This does not imply a partnership, certification or endorsement by the owners. The logo drawings come from the public-domain collections simple-icons and Gil Barbara's logos (both CC0 1.0).
    </p>

    <h2 style={H2}>Consumer Dispute Resolution</h2>
    <p style={P}>
      We are neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board, as we contract exclusively with businesses. This is not us dodging accountability, it is the accurate legal consequence of running a B2B-only operation (see our Terms).
    </p>

    <h2 style={H2}>Disclaimer</h2>
    <p style={P}>
      The content of this website has been prepared with the greatest care. No liability is assumed for its accuracy, completeness, or currency. Where we link externally, for example to a regulator, a standard, or a piece of coverage about one of our disclosures, we do not control and are not responsible for that external content once you leave rfi-irfos.com.
    </p>

    <h2 style={H2}>Third-Party Names &amp; Trademarks</h2>
    <p style={P}>
      Company names, product names, app names, and trademarks referenced anywhere on this site, in our security research, or in our public disclosure ledger belong to their respective owners. Their appearance here documents that we examined their software; it does not imply endorsement, partnership, or affiliation in either direction.
    </p>

    <h2 style={H2}>Copyright</h2>
    <p style={P}>All content created by RFI-IRFOS is subject to Austrian copyright law. Reproduction or use beyond the limits of copyright law requires written consent. Quoting our disclosure findings with attribution, in the ordinary course of reporting on them, is fine, that is rather the point of publishing them.</p>

    <h2 style={H2}>Example pictures</h2>
    <p style={P}>The Trust Center example on this site shows a company called Alpenshop with demonstration data. Alpenshop is fictional, and any resemblance to a real company is coincidental.</p>

    <h2 style={H2}>Governing Law</h2>
    <p style={P}>The law of the Republic of Austria and the law of the European Union apply.</p>

    <h2 style={H2}>External Profiles</h2>
    <p style={P}>
      We publish our research and code openly. You can find us at:
    </p>
    <ul style={{ ...P, paddingLeft: 18, marginBottom: 16 }}>
      <li><strong style={{ color: '#e8e8f0' }}>OSF:</strong> <a href="https://osf.io/rzvyg" target="_blank" rel="noopener" style={A} className="rfi-inline-link">osf.io/rzvyg</a> — all research publications and preprints.</li>
      <li><strong style={{ color: '#e8e8f0' }}>GitHub:</strong> <a href="https://github.com/rfi-irfos" target="_blank" rel="noopener" style={A} className="rfi-inline-link">github.com/rfi-irfos</a> — open-source tools, models, and audit repositories.</li>
      <li><strong style={{ color: '#e8e8f0' }}>LinkedIn:</strong> <a href="https://linkedin.com/company/rfi-irfos" target="_blank" rel="noopener" style={A} className="rfi-inline-link">RFI-IRFOS</a> — institute presence and announcements.</li>
      <li><strong style={{ color: '#e8e8f0' }}>YouTube:</strong> <a href="https://www.youtube.com/@rfi-irfos-official" target="_blank" rel="noopener" style={A} className="rfi-inline-link">RFI-IRFOS Official</a> — videos and product films.</li>
    </ul>
  </>
}

function ImpressumDE() {
  return <>
    <h1 style={H1}>Impressum</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>Offenlegung gemäß § 5 ECG (E-Commerce-Gesetz) und § 25 MedienG (Mediengesetz) &middot; Letzte Aktualisierung: Oktober 2026</p>

    <p style={P}>
      Wir veröffentlichen unter eigenem Namen, mit einer echten Anschrift, weil koordinierte Offenlegung nur funktioniert, wenn das Institut, das sie durchführt, selbst auffindbar, überprüfbar und zur Verantwortung ziehbar ist — genau der Maßstab, den wir an jeden anlegen, den wir prüfen. Das meiste auf dieser Seite steht hier, weil es das Gesetz verlangt. Ein paar Zeilen stehen hier, weil wir finden, dass ein Impressum nicht der eine Teil einer Website sein sollte, den niemand Korrektur gelesen hat.
    </p>

    <h2 style={H2}>Betreiber</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Research Focus Institute — Interdisciplinary Research Facility for Open Sciences</strong><br />
      Kurzbezeichnung: RFI-IRFOS<br />
      Elisabethinergasse 25/10, 8020 Graz, Österreich<br />
      E-Mail: <a href="mailto:contact@rfi-irfos.com" style={A} className="rfi-inline-link">contact@rfi-irfos.com</a><br />
      Website: <a href="https://rfi-irfos.com" style={A} className="rfi-inline-link">rfi-irfos.com</a>
    </p>

    <h2 style={H2}>Wer die Leistungen erbringt</h2>
    <p style={P}>
      RFI-IRFOS ist ein IT-Sicherheitsdienstleister in Graz für Penetrationstests, App- und Software-Audits, NIS2-Beratung und Managed SOC. Sämtliche Leistungen erbringt das Gewerbe für Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik (GISA 39261441). Inhaber des Gewerbes ist der Forschungsverein RFI-IRFOS als Träger, der die zugrunde liegende Technologie entwickelt und marktreife Forschung in eigene Ventures überführt.
    </p>

    <h2 style={H2}>Register- &amp; Gewerbedaten</h2>
    <p style={P}>
      Rechtsform des Gewerbeinhabers: Eingetragener Verein (reguliert, nicht gewinnorientiert)<br />
      ZVR-Zahl (Zentrales Vereinsregister): 1015608684<br />
      GISA-Zahl (Gewerbeinformationssystem Austria): 39261441<br />
      GLN: 9110038490191<br />
      UID-Nummer: ATU83405245<br />
      Steuernummer: 68 696/8736<br />
      Gewerbewortlaut: Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik<br />
      Anzuwendendes Gewerberecht: Österreichische Gewerbeordnung (GewO) &middot; Mitglied der Wirtschaftskammer Österreich (WKO)<br />
      Behörde gemäß § 5 Abs. 1 Z 5 ECG: Magistrat der Stadt Graz<br />
      Gewerbeanmeldung: 19. März 2026
    </p>
    <p style={P}>
      Alle obigen Angaben sind gegen das öffentliche Register nachprüfbar, nicht nur hier behauptet. Das ist Absicht: Ein Impressum, das einen Abgleich mit seinem eigenen Register nicht überlebt, ist kein besonders gutes Impressum.
    </p>

    <h2 style={H2}>Gewerberechtliche Geschäftsführung</h2>
    <p style={P}>Simeon-Andreas Johann Manfred Kepp, verantwortlich nach der österreichischen Gewerbeordnung (GewO) für die oben angeführte, angemeldete Tätigkeit.</p>

    <h2 style={H2}>Offenlegung gemäß § 25 MedienG</h2>
    <p style={P}>
      Medieninhaber: Research Focus Institute — Interdisciplinary Research Facility for Open Sciences (RFI-IRFOS), Sitz Graz, Anschrift wie oben.<br />
      Vereinsvorstand: Simeon-Andreas Johann Manfred Kepp (Obmann) und Louis Ehrig (Kassier). Laut Statuten vertreten beide den Verein gemeinsam nach außen.<br />
      Grundlegende Richtung: unabhängige Veröffentlichung von Forschungsergebnissen zu Datenschutz und Sicherheit von Software, einschließlich des öffentlichen Offenlegungs-Ledgers, sowie Information über die Arbeit des Instituts.
    </p>

    <h2 style={H2}>Marken und Logos</h2>
    <p style={P}>
      Alle auf dieser Website genannten Produkt- und Firmennamen sowie Logos sind Eigentum ihrer jeweiligen Inhaber. Sie erscheinen ausschließlich, um zu beschreiben, mit welchen Systemen unsere Software zusammenarbeitet. Daraus folgt keine Partnerschaft, Zertifizierung oder Billigung durch die Inhaber. Die Logo-Zeichnungen stammen aus den gemeinfreien Sammlungen simple-icons und Gil Barbaras Logos (beide CC0 1.0).
    </p>

    <h2 style={H2}>Verbraucherschlichtung</h2>
    <p style={P}>
      Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen, da wir ausschließlich mit Unternehmen kontrahieren. Das ist kein Ausweichen vor Verantwortung, sondern die zutreffende rechtliche Folge eines reinen B2B-Geschäfts (siehe unsere AGB).
    </p>

    <h2 style={H2}>Haftungsausschluss</h2>
    <p style={P}>
      Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität wird keine Haftung übernommen. Soweit wir extern verlinken, etwa auf eine Behörde, eine Norm oder eine Berichterstattung zu einer unserer Offenlegungen, haben wir auf diese externen Inhalte keinen Einfluss und übernehmen dafür keine Verantwortung, sobald Sie rfi-irfos.com verlassen.
    </p>

    <h2 style={H2}>Fremde Namen &amp; Marken</h2>
    <p style={P}>
      Firmennamen, Produktnamen, App-Namen und Marken, die irgendwo auf dieser Website, in unserer Sicherheitsforschung oder in unserem öffentlichen Offenlegungsregister genannt werden, gehören ihren jeweiligen Inhabern. Ihre Nennung hier dokumentiert, dass wir die betreffende Software untersucht haben; sie impliziert weder Billigung noch Partnerschaft noch Zugehörigkeit in irgendeiner Richtung.
    </p>

    <h2 style={H2}>Urheberrecht</h2>
    <p style={P}>Alle von RFI-IRFOS erstellten Inhalte unterliegen dem österreichischen Urheberrecht. Vervielfältigung oder Nutzung über die Grenzen des Urheberrechts hinaus bedarf unserer schriftlichen Zustimmung. Das Zitieren unserer Offenlegungsergebnisse mit Quellenangabe, im gewöhnlichen Rahmen der Berichterstattung darüber, ist ausdrücklich in Ordnung — das ist ja der Sinn der Veröffentlichung.</p>

    <h2 style={H2}>Beispielbilder</h2>
    <p style={P}>Das Trust-Center-Beispiel auf dieser Seite zeigt ein Unternehmen namens Alpenshop mit Demodaten. Alpenshop ist fiktiv, und Ähnlichkeiten mit tatsächlichen Unternehmen sind zufällig.</p>

    <h2 style={H2}>Anwendbares Recht</h2>
    <p style={P}>Es gilt das Recht der Republik Österreich sowie das Recht der Europäischen Union.</p>

    <h2 style={H2}>Externe Profile</h2>
    <p style={P}>
      Wir veröffentlichen unsere Forschung und unseren Code offen. Sie finden uns unter:
    </p>
    <ul style={{ ...P, paddingLeft: 18, marginBottom: 16 }}>
      <li><strong style={{ color: '#e8e8f0' }}>OSF:</strong> <a href="https://osf.io/rzvyg" target="_blank" rel="noopener" style={A} className="rfi-inline-link">osf.io/rzvyg</a> — sämtliche Forschungspublikationen und Preprints.</li>
      <li><strong style={{ color: '#e8e8f0' }}>GitHub:</strong> <a href="https://github.com/rfi-irfos" target="_blank" rel="noopener" style={A} className="rfi-inline-link">github.com/rfi-irfos</a> — Open-Source-Werkzeuge, Modelle und Audit-Repositories.</li>
      <li><strong style={{ color: '#e8e8f0' }}>LinkedIn:</strong> <a href="https://linkedin.com/company/rfi-irfos" target="_blank" rel="noopener" style={A} className="rfi-inline-link">RFI-IRFOS</a> — institutionelle Präsenz und Ankündigungen.</li>
      <li><strong style={{ color: '#e8e8f0' }}>YouTube:</strong> <a href="https://www.youtube.com/@rfi-irfos-official" target="_blank" rel="noopener" style={A} className="rfi-inline-link">RFI-IRFOS Official</a> — Videos und Produktfilme.</li>
    </ul>
  </>
}

function Datenschutz() {
  const { locale } = useLocale()
  return locale === 'de' ? <DatenschutzDE /> : <DatenschutzEN />
}

function DatenschutzEN() {
  return <>
    <h1 style={H1}>Privacy Policy</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>Pursuant to the GDPR (EU) 2016/679 &middot; Last updated: November 2026</p>

    <p style={P}>
      This page has every section a privacy policy is supposed to have. We just refuse to pad any of them with the vague language that usually fills them, because we spend our working hours pointing out exactly that vague language in other people's apps. So: full sections, plain claims, and where a claim is checkable, we tell you how to check it.
    </p>

    <h2 style={H2}>Data Controller</h2>
    <p style={P}>
      RFI-IRFOS (Research Focus Institute — Interdisciplinary Research Facility for Open Sciences)<br />
      Elisabethinergasse 25/10, 8020 Graz, Austria<br />
      E-Mail: <a href="mailto:contact@rfi-irfos.com" style={A} className="rfi-inline-link">contact@rfi-irfos.com</a>
    </p>

    <h2 style={H2}>Data We Collect</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Server logs:</strong> IP address, access timestamp, URL, HTTP status code — collected on our own server in Graz, which hosts this website and its API. Requests reach it through Cloudflare (see Processors), which sees the same data in transit.<br />
      <strong style={{ color: '#e8e8f0' }}>Contact form:</strong> name, email, subject, message — sent to our own server only if you fill it in and press send, and delivered to our inbox through Brevo. Name, email and the message are also entered as a request in our customer management (Lighthouse, on our server in Graz), so that one person on our team owns the answer.<br />
      <strong style={{ color: '#e8e8f0' }}>Quick Check (domain check):</strong> the domain and the work email you enter, plus the time of the request — stored in our own database on our server in Graz so we can run the check and send you the result. Your IP address is used only in memory to limit repeated submissions and is not stored. On submission we receive an internal push alert (on our own push server in Graz) and an email copy (via Brevo), and you receive one confirmation email, sent through Brevo. The email and the domain are also entered as a request in our customer management (Lighthouse, on our server in Graz), so that one person on our team owns the check and the follow-up.<br />
      <strong style={{ color: '#e8e8f0' }}>Website check:</strong> when you test a domain in the check on the homepage, our server in Graz queries that domain from its own address: DNS records (resolved through Quad9), the TLS certificate, the HTTP security headers and the public mail records. The result goes to your browser and is not stored. Your IP address is held in memory for a short time only, to limit repeated requests. No active attack test takes place.<br />
      <strong style={{ color: '#e8e8f0' }}>Payment data:</strong> for purchases made through the website, payment data (card details, email, name) is processed by <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> (354 Oyster Point Blvd, South San Francisco, CA 94080, USA). RFI-IRFOS never receives or stores your card data. Stripe's privacy policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener" style={A} className="rfi-inline-link">stripe.com/privacy</a>.<br />
      <strong style={{ color: '#e8e8f0' }}>Google ad click:</strong> if you arrive through one of our search ads on Google, Google adds a click id (<code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>gclid</code>) to the address. The page keeps it only in your browser's working memory and passes it on in the address of the next page you open here, with no cookie, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>localStorage</code> or <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>sessionStorage</code>. If you then send the contact form or the Quick Check, or buy through Stripe, we store that click id with the name of the action (contact request, Quick Check, purchase), the time and, for a purchase, the amount, kept apart from your name and email. We upload these lines to our Google Ads account to see which ads lead to requests. Google receives neither your name nor your email address. Without an ad click no entry is created.<br />
      <strong style={{ color: '#e8e8f0' }}>Visit statistics:</strong> one first-party tracking pixel on this domain, evaluated in our own analytics system (Lighthouse, on our server in Graz), that logs a page view and a referrer, on every page including this one. On this legal/security page family specifically, we also log, in aggregate only, whether a visit scrolled all the way to the footer at the bottom of the page, the same in-memory, no-cookie mechanism as the section counters described in "Cookies" below, applied here to answer one question: are these pages actually being read to the end. On the homepage specifically, we also log, once per visit and in aggregate only, whether your browser's developer tools appear to be open (a passive window-size check, no timing tricks) — this exists purely because we left a message in the console for anyone who looks, and we're curious how often anyone actually does. No cookie, no device fingerprint, no cross-site identifier. See "Cookies" below for the unglamorous truth about what that pixel actually is.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>What we do not collect,</strong> for the avoidance of doubt: no location data of ordinary visitors (the only exception is the security log described above), no device fingerprinting, no advertising ID, no biometric data, no cross-site profile, nothing sold or shared with a data broker, and the only thing an ad network ever receives is the Google ad click id described above.
    </p>

    <h2 style={H2}>Security Log (Honeypot)</h2>
    <p style={P}>
      This site contains decoy paths that no ordinary visitor ever requests (for example <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>/.env</code>, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>/wp-login.php</code>, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>/phpmyadmin</code>), plus detection of attack tools and injection attempts (SQL injection, script injection, Log4Shell, path traversal, unusual HTTP methods). Whoever triggers one of these is logged with: full IP address, time, HTTP method, requested path, user agent, and an approximate location and network provider derived from the IP address. This is self-defence and cyber defence: we need to know where an attack on our systems came from, which decoy was touched, and whether the same source returns.<br />
      <strong style={{ color: '#e8e8f0' }}>Automatic block:</strong> repeated or serious hits block the IP address for 24 hours. Report a mistake to <a href="mailto:security@rfi-irfos.com" style={A} className="rfi-inline-link">security@rfi-irfos.com</a> and we lift the block.<br />
      <strong style={{ color: '#e8e8f0' }}>Alert:</strong> each hit is forwarded to an internal push channel on our own push server in Graz so the team sees it live. The channel name is secret.<br />
      <strong style={{ color: '#e8e8f0' }}>Location lookup:</strong> the approximate location and provider are read from a location database stored on our own server, so the IP address of such a hit stays within our systems. The location data comes from <a href="https://db-ip.com" target="_blank" rel="noopener noreferrer" style={A} className="rfi-inline-link">DB-IP</a> and is licensed under CC BY 4.0.<br />
      <strong style={{ color: '#e8e8f0' }}>Retention:</strong> 30 days, then automatic deletion. Longer only if a specific incident requires it for a report to an authority or for legal defence.
    </p>

    <h2 style={H2}>Legal Basis</h2>
    <p style={P}>
      Performance of a contract (Art. 6(1)(b) GDPR): payment processing, contact inquiries.<br />
      Legitimate interest (Art. 6(1)(f) GDPR): server logs for security and error analysis, the security log with IP address, location and automatic block described above (protection of our systems against attacks, Recital 49 GDPR), the single anonymized page-view pixel described above, and the upload of the Google ad click id described above to measure which of our ads work. Object by email and we delete the entry.
    </p>

    <h2 style={H2}>Processors</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> — payment processing. Data Processing Agreement (DPA) concluded pursuant to Art. 28 GDPR. Data transferred to the USA on the basis of Standard Contractual Clauses (Art. 46(2)(c) GDPR).<br />
      <strong style={{ color: '#e8e8f0' }}>Cloudflare, Inc.</strong> — secure connection (Cloudflare Tunnel) between visitors and our server in Graz; the traffic passes through Cloudflare's network. Data processing on the basis of the EU-US Data Privacy Framework and Standard Contractual Clauses.<br />
      <strong style={{ color: '#e8e8f0' }}>Quad9 Foundation (Zürich, Switzerland)</strong> — public DNS resolver that answers the lookups of the website check; it receives the domain name you enter, together with the address of our server.<br />
      <strong style={{ color: '#e8e8f0' }}>Brevo (Sendinblue SAS, Paris, France)</strong> — sends the confirmation email after a Quick Check request and the internal copy of every contact and Quick Check request to our inbox. Processing within the EU.<br />
      <strong style={{ color: '#e8e8f0' }}>Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Ireland)</strong> receives the uploaded ad click ids for ad measurement. Google acts as a separate controller under the Google Ads Controller-Controller Data Protection Terms; any transfer to Google LLC in the USA relies on the EU-US Data Privacy Framework.
    </p>

    <h2 style={H2}>International Transfers</h2>
    <p style={P}>
      Where a processor above is US-based, the transfer runs on Standard Contractual Clauses (Art. 46(2)(c) GDPR); for Cloudflare it additionally rests on the EU-US Data Privacy Framework, an adequacy decision of the European Commission. We list this plainly rather than burying it in a "may transfer data internationally" clause, because that phrase is doing a lot of quiet work on most privacy pages.
    </p>

    <h2 style={H2}>Cookies</h2>
    <p style={P}>
      We don't use cookies. Here is the part every privacy policy is expected to have, done as an actual answer instead of a checkbox. The standard four categories, quoted the way they usually get phrased, and our real answer underneath each one:
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>"Strictly necessary cookies, required for the website to function and cannot be switched off."</strong><br />
      We have none. Open your browser's dev tools, Application tab, Cookies, on this exact page, right now. It will be empty. Nothing is being "switched off" because nothing was ever switched on.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>"Functional cookies, used to remember your preferences."</strong><br />
      We do let you pick a light, dark, or high-contrast theme and a language, and we do remember that choice, in <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>localStorage</code>, not a cookie. It never leaves your device, carries no identifier, and is not readable by us.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>"Performance / analytics cookies, used to understand how visitors use our site."</strong><br />
      This is usually where the actual tracking lives, and this is usually the one place a privacy policy goes vague. We won't. This site loads a single 1&times;1 pixel image, self-hosted, no cookie, no consent needed for it because a cookie-consent requirement (ePrivacy Art. 5(3)) attaches to storing or reading something on <em>your</em> device, and this pixel never does either. Each page load sends exactly this, the literal tag that is live on this page right now, copy it and inspect it yourself:
    </p>
    <div style={{ background: '#0c0c16', border: '1px solid rgba(0,245,196,0.2)', borderRadius: 6, padding: '12px 16px', margin: '8px 0 16px 0', overflowX: 'auto' }}>
      <code style={{ fontSize: 'var(--fs-small)', color: 'var(--accent-text)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {'<img src="https://rfi-irfos.com/api/track/pixel.gif?site=rfi-irfos&p={page-path}&r={referrer}&utm_source={utm}" width="1" height="1" alt="" style="display:none">'}
      </code>
    </div>
    <p style={P}>
      What lands in our database from that request: the page path, the referring domain normalized into a channel bucket ("organic search", "direct", "referral", "linkedin", and so on, so we can tell a board member where visitors come from), and the site tag. That's it, in full: <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>path, source, referrer, utm_source, utm_medium, utm_campaign, site</code>. Our web server stores these fields and passes the same fields on to our analytics system Lighthouse, which runs on our own server in Graz. No IP address column exists in either table. No visitor-ID field is ever populated by this site's copy of the pixel, so two visits from the same person land as two independent, unlinked rows, not one growing profile. Full source, backend included: <a href="https://github.com/rfi-irfos/rfi-irfos-web" target="_blank" rel="noopener" style={A} className="rfi-inline-link">github.com/rfi-irfos/rfi-irfos-web</a>. We are not asking you to trust a sentence, we are pointing at the code that either does or doesn't match it.
    </p>
    <p style={P}>
      One more signal lands the same way: which section of this single-scrolling-page site came into view during your visit (the disclosure ledger, pricing, the tip-submission form, and so on), stored as one more anonymous <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>section</code> column on the same table. This is a hit-counter, not a viewer log — "the ledger section was seen 214 times today," never "visitor X looked at the ledger." The page keeps a plain JavaScript variable in memory so scrolling up and down past a section doesn't count it twice; that variable is never written to a cookie, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>localStorage</code>, or <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>sessionStorage</code>, and is gone the instant the page reloads. Same reasoning as the pixel above: nothing is stored on your device, so the ePrivacy consent trigger never applies, and nothing here identifies you, so it isn't personal data to begin with.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>"Targeting / advertising cookies, used to build a profile of your interests."</strong><br />
      We have none. We run search ads on Google, and this site loads no Google code and no Google cookies for them. A visit that arrives through an ad is recognised only by the click id in the address, as described under "Google ad click" above, and we build no profile of your interests from it.
    </p>
    <p style={P}>
      We could have shipped a cookie banner with a satisfying "Accept All" button anyway, because everyone expects one. We didn't, because a consent banner implies a decision is being made on your behalf, and there isn't one here to make. If that ever changes, this section changes with it, publicly, in the same commit history as everything else on this site.
    </p>

    <h2 style={H2}>Automated Decision-Making</h2>
    <p style={P}>None. We do not use profiling or automated decision-making that produces legal or similarly significant effects on you.</p>

    <h2 style={H2}>Retention</h2>
    <p style={P}>
      Contact inquiries are deleted once communication concludes, at the latest after 7 years per Austrian statutory retention rules. Payment receipts are retained for 7 years pursuant to § 132 BAO (Federal Fiscal Code). Server logs and pixel data are retained only as long as needed for security and traffic analysis, then rotated out. Google ad click entries are deleted automatically after 90 days.
    </p>

    <h2 style={H2}>Children's Privacy</h2>
    <p style={P}>This is a B2B research and disclosure site. It is not directed at children, and we do not knowingly collect data from anyone below the age required for consent under Art. 8 GDPR.</p>

    <h2 style={H2}>Your Rights (Art. 15–21 GDPR)</h2>
    <p style={P}>
      Access, rectification, erasure, restriction, data portability, and objection, all of it, at: <a href="mailto:contact@rfi-irfos.com" style={A} className="rfi-inline-link">contact@rfi-irfos.com</a>. Given what little we actually hold on any one person, most of these requests take us minutes, not weeks, to resolve.
    </p>

    <h2 style={H2}>Right to Lodge a Complaint</h2>
    <p style={P}>Austrian Data Protection Authority (Datenschutzbehörde): <a href="https://www.dsb.gv.at" target="_blank" rel="noopener" style={A} className="rfi-inline-link">dsb.gv.at</a></p>

    <h2 style={H2}>Changes to This Policy</h2>
    <p style={P}>Any change to what we actually collect gets reflected here first, with the "last updated" date above moved forward. We track changes to this page the same way we would expect anyone else to.</p>

    <h2 style={H2}>A Note on Consistency</h2>
    <p style={P}>We spend our research auditing other companies for exactly this kind of policy. This one describes what actually happens on this site, in the same evidence-first spirit — nothing here is aspirational, and the parts that are checkable are checkable by you, not just by us.</p>
  </>
}

function DatenschutzDE() {
  return <>
    <h1 style={H1}>Datenschutzerklärung</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>Gemäß DSGVO (EU) 2016/679 &middot; Letzte Aktualisierung: November 2026</p>

    <p style={P}>
      Diese Seite hat jeden Abschnitt, den eine Datenschutzerklärung haben soll. Wir weigern uns nur, sie mit der vagen Formulierung aufzublähen, die sie normalerweise füllt, weil wir unsere Arbeitszeit damit verbringen, genau diese vage Formulierung in fremden Apps aufzuzeigen. Also: vollständige Abschnitte, klare Aussagen, und wo eine Aussage nachprüfbar ist, sagen wir Ihnen, wie.
    </p>

    <h2 style={H2}>Verantwortlicher</h2>
    <p style={P}>
      RFI-IRFOS (Research Focus Institute — Interdisciplinary Research Facility for Open Sciences)<br />
      Elisabethinergasse 25/10, 8020 Graz, Österreich<br />
      E-Mail: <a href="mailto:contact@rfi-irfos.com" style={A} className="rfi-inline-link">contact@rfi-irfos.com</a>
    </p>

    <h2 style={H2}>Welche Daten wir erheben</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Serverprotokolle:</strong> IP-Adresse, Zugriffszeitpunkt, URL, HTTP-Statuscode — erhoben auf unserem eigenen Server in Graz, der diese Website und ihre API hostet. Anfragen erreichen ihn über Cloudflare (siehe Auftragsverarbeiter), das dieselben Daten auf dem Transportweg sieht.<br />
      <strong style={{ color: '#e8e8f0' }}>Kontaktformular:</strong> Name, E-Mail, Betreff, Nachricht — nur wenn Sie es ausfüllen und absenden, an unseren eigenen Server gesendet und über Brevo in unser Postfach zugestellt. Name, E-Mail und Nachricht tragen wir zusätzlich als Anfrage in unsere Kundenverwaltung ein (Lighthouse, auf unserem Server in Graz), damit eine Person in unserem Team die Antwort übernimmt.<br />
      <strong style={{ color: '#e8e8f0' }}>Quick Check (Domain-Check):</strong> die eingegebene Domain und die geschäftliche E-Mail-Adresse sowie der Zeitpunkt der Anfrage — gespeichert in unserer eigenen Datenbank auf unserem Server in Graz, damit wir den Check durchführen und Ihnen das Ergebnis schicken können. Ihre IP-Adresse wird nur im Arbeitsspeicher genutzt, um wiederholte Absendungen zu begrenzen, und nicht gespeichert. Beim Absenden erhalten wir einen internen Push-Hinweis (auf unserem eigenen Push-Server in Graz) und eine E-Mail-Kopie (über Brevo), und Sie erhalten eine Bestätigungsmail, versendet über Brevo. E-Mail-Adresse und Domain tragen wir zusätzlich als Anfrage in unsere Kundenverwaltung ein (Lighthouse, auf unserem Server in Graz), damit eine Person in unserem Team den Check und die Rückmeldung übernimmt.<br />
      <strong style={{ color: '#e8e8f0' }}>Website-Check:</strong> Wenn Sie auf der Startseite eine Domain prüfen, fragt unser Server in Graz diese Domain von seiner eigenen Adresse aus ab: DNS-Einträge (aufgelöst über Quad9), TLS-Zertifikat, HTTP-Sicherheits-Header und öffentliche Mail-Einträge. Das Ergebnis geht an Ihren Browser und wird nicht gespeichert. Ihre IP-Adresse liegt nur kurz im Arbeitsspeicher, um wiederholte Anfragen zu begrenzen. Ein aktiver Angriffstest findet nicht statt.<br />
      <strong style={{ color: '#e8e8f0' }}>Zahlungsdaten:</strong> Für Käufe über die Website werden Zahlungsdaten (Kartendetails, E-Mail, Name) von <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> verarbeitet (354 Oyster Point Blvd, South San Francisco, CA 94080, USA). RFI-IRFOS erhält oder speichert Ihre Kartendaten nie. Datenschutzerklärung von Stripe: <a href="https://stripe.com/privacy" target="_blank" rel="noopener" style={A} className="rfi-inline-link">stripe.com/privacy</a>.<br />
      <strong style={{ color: '#e8e8f0' }}>Google-Anzeigenklick:</strong> Kommen Sie über eine unserer Suchanzeigen bei Google, hängt Google eine Klick-Kennung (<code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>gclid</code>) an die Adresse. Die Seite hält sie nur im Arbeitsspeicher Ihres Browsers und gibt sie in der Adresse der nächsten Unterseite weiter, ohne Cookie, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>localStorage</code> oder <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>sessionStorage</code>. Senden Sie danach das Kontaktformular oder den Quick Check ab oder kaufen Sie über Stripe, speichern wir diese Kennung zusammen mit der Art der Handlung (Kontaktanfrage, Quick Check, Kauf), dem Zeitpunkt und beim Kauf dem Betrag, getrennt von Name und E-Mail. Diese Zeilen laden wir in unser Google-Ads-Konto hoch, um zu sehen, welche Anzeigen zu Anfragen führen. Ihren Namen und Ihre E-Mail-Adresse erhält Google dabei nicht. Ohne Anzeigenklick entsteht kein Eintrag.<br />
      <strong style={{ color: '#e8e8f0' }}>Besuchsstatistik:</strong> ein Tracking-Pixel auf dieser Domain, ausgewertet in unserem eigenen Analysesystem (Lighthouse, auf unserem Server in Graz), der einen Seitenaufruf und einen Referrer protokolliert, auf jeder Seite einschließlich dieser. Speziell auf dieser Familie von Rechts-/Sicherheitsseiten protokollieren wir zusätzlich, nur aggregiert, ob ein Besuch bis zur Fußzeile am Ende der Seite gescrollt hat — derselbe speicherinterne, cookielose Mechanismus wie die im Abschnitt "Cookies" unten beschriebenen Abschnittszähler, hier angewendet, um eine Frage zu beantworten: Werden diese Seiten tatsächlich bis zum Ende gelesen? Speziell auf der Startseite protokollieren wir außerdem, einmal pro Besuch und nur aggregiert, ob die Entwicklertools Ihres Browsers offenbar geöffnet sind (eine passive Fenstergrößen-Prüfung, keine Timing-Tricks) — das existiert einzig, weil wir in der Konsole eine Nachricht für alle hinterlassen haben, die dort nachsehen, und uns interessiert, wie oft das tatsächlich jemand tut. Kein Cookie, kein Geräte-Fingerprint, kein websiteübergreifender Identifikator. Die unglamouröse Wahrheit darüber, was dieser Pixel tatsächlich ist, steht unter "Cookies" weiter unten.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Was wir nicht erheben,</strong> zur Klarstellung: keine Standortdaten gewöhnlicher Besucher (einzige Ausnahme ist das oben beschriebene Sicherheitsprotokoll), kein Geräte-Fingerprinting, keine Werbe-ID, keine biometrischen Daten, kein websiteübergreifendes Profil, nichts wird an einen Datenhändler verkauft oder weitergegeben, und an ein Werbenetzwerk geht einzig die oben beschriebene Klick-Kennung einer Google-Anzeige.
    </p>

    <h2 style={H2}>Sicherheitsprotokoll (Honeypot)</h2>
    <p style={P}>
      Diese Website enthält Köderpfade, die kein gewöhnlicher Besucher aufruft (zum Beispiel <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>/.env</code>, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>/wp-login.php</code>, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>/phpmyadmin</code>), dazu eine Erkennung von Angriffswerkzeugen und Einschleusungsversuchen (SQL-Injection, Script-Einschleusung, Log4Shell, Pfad-Traversal, ungewöhnliche HTTP-Methoden). Wer so etwas auslöst, wird protokolliert: vollständige IP-Adresse, Zeitpunkt, HTTP-Methode, aufgerufener Pfad, User-Agent sowie ein aus der IP-Adresse abgeleiteter ungefährer Standort und Netzbetreiber. Das ist Selbstschutz und Cyberabwehr: Wir müssen wissen, woher ein Angriff auf unsere Systeme kam, welcher Köder berührt wurde und ob dieselbe Quelle wiederkehrt.<br />
      <strong style={{ color: '#e8e8f0' }}>Automatische Sperre:</strong> wiederholte oder schwere Treffer sperren die IP-Adresse für 24 Stunden. Einen Irrtum melden Sie an <a href="mailto:security@rfi-irfos.com" style={A} className="rfi-inline-link">security@rfi-irfos.com</a>, dann heben wir die Sperre auf.<br />
      <strong style={{ color: '#e8e8f0' }}>Alarm:</strong> Jeder Treffer geht an einen internen Push-Kanal auf unserem eigenen Push-Server in Graz, damit das Team ihn sofort sieht. Der Kanalname ist geheim.<br />
      <strong style={{ color: '#e8e8f0' }}>Standortabfrage:</strong> Ungefährer Standort und Anbieter stammen aus einer Standortdatenbank auf unserem eigenen Server, sodass die IP-Adresse eines solchen Treffers in unseren Systemen bleibt. Die Standortdaten stammen von <a href="https://db-ip.com" target="_blank" rel="noopener noreferrer" style={A} className="rfi-inline-link">DB-IP</a> und stehen unter der Lizenz CC BY 4.0.<br />
      <strong style={{ color: '#e8e8f0' }}>Speicherdauer:</strong> 30 Tage, danach automatische Löschung. Länger nur, wenn ein konkreter Vorfall es für eine Meldung an eine Behörde oder zur Rechtsverteidigung erfordert.
    </p>

    <h2 style={H2}>Rechtsgrundlage</h2>
    <p style={P}>
      Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO): Zahlungsabwicklung, Kontaktanfragen.<br />
      Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO): Serverprotokolle zur Sicherheits- und Fehleranalyse, das oben beschriebene Sicherheitsprotokoll mit IP-Adresse, Standort und automatischer Sperre (Schutz unserer Systeme vor Angriffen, Erwägungsgrund 49 DSGVO) der oben beschriebene einzelne, anonymisierte Seitenaufruf-Pixel sowie das Hochladen der oben beschriebenen Klick-Kennung an Google, um den Erfolg unserer Anzeigen zu messen. Widersprechen Sie per E-Mail, löschen wir den Eintrag.
    </p>

    <h2 style={H2}>Auftragsverarbeiter</h2>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Stripe, Inc.</strong> — Zahlungsabwicklung. Auftragsverarbeitungsvertrag (DPA) gemäß Art. 28 DSGVO abgeschlossen. Datenübermittlung in die USA auf Grundlage von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).<br />
      <strong style={{ color: '#e8e8f0' }}>Cloudflare, Inc.</strong> — sichere Verbindung (Cloudflare Tunnel) zwischen Besuchern und unserem Server in Graz; der Datenverkehr läuft über das Netz von Cloudflare. Verarbeitung auf Grundlage des EU-US Data Privacy Framework und von Standardvertragsklauseln.<br />
      <strong style={{ color: '#e8e8f0' }}>Quad9 Foundation (Zürich, Schweiz)</strong> — öffentlicher DNS-Auflöser, der die Abfragen des Website-Checks beantwortet; er erhält den eingegebenen Domainnamen zusammen mit der Adresse unseres Servers.<br />
      <strong style={{ color: '#e8e8f0' }}>Brevo (Sendinblue SAS, Paris, Frankreich)</strong> — versendet die Bestätigungsmail nach einer Quick-Check-Anfrage und die interne Kopie jeder Kontakt- und Quick-Check-Anfrage in unser Postfach. Verarbeitung innerhalb der EU.<br />
      <strong style={{ color: '#e8e8f0' }}>Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland)</strong> erhält die hochgeladenen Klick-Kennungen zur Anzeigenmessung. Google handelt dabei als eigener Verantwortlicher nach den Google Ads Controller-Controller Data Protection Terms; eine Übermittlung an Google LLC in den USA stützt sich auf das EU-US Data Privacy Framework.
    </p>

    <h2 style={H2}>Internationale Datenübermittlung</h2>
    <p style={P}>
      Wo ein oben genannter Auftragsverarbeiter in den USA sitzt, läuft die Übermittlung über Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO); bei Cloudflare stützt sie sich zusätzlich auf das EU-US Data Privacy Framework, einen Angemessenheitsbeschluss der Europäischen Kommission. Wir schreiben das offen hin, statt es in einer Klausel wie "Daten können international übermittelt werden" zu verstecken, denn dieser Satz erledigt auf den meisten Datenschutzseiten eine Menge stille Arbeit.
    </p>

    <h2 style={H2}>Cookies</h2>
    <p style={P}>
      Wir verwenden keine Cookies. Hier ist der Teil, den jede Datenschutzerklärung haben soll, als echte Antwort statt als Checkbox. Die üblichen vier Kategorien, so formuliert, wie sie meist formuliert werden, und darunter jeweils unsere tatsächliche Antwort:
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>„Technisch notwendige Cookies, erforderlich für die Funktion der Website und nicht deaktivierbar."</strong><br />
      Wir haben keine. Öffnen Sie jetzt, auf genau dieser Seite, die Entwicklertools Ihres Browsers, Reiter Application, Cookies. Es wird leer sein. Nichts wird „deaktiviert", weil nie etwas aktiviert wurde.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>„Funktionale Cookies, zum Merken Ihrer Einstellungen."</strong><br />
      Sie können ein helles, dunkles oder kontrastreiches Theme sowie eine Sprache wählen, und wir merken uns diese Wahl — in <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>localStorage</code>, nicht in einem Cookie. Das verlässt nie Ihr Gerät, trägt keinen Identifikator und ist für uns nicht lesbar.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>„Performance-/Analyse-Cookies, um zu verstehen, wie Besucher unsere Website nutzen."</strong><br />
      Hier steckt normalerweise das eigentliche Tracking, und hier wird eine Datenschutzerklärung normalerweise vage. Wir nicht. Diese Website lädt ein einzelnes, selbst gehostetes 1×1-Pixelbild, kein Cookie, keine Einwilligung dafür nötig, weil die Cookie-Einwilligungspflicht (ePrivacy Art. 5 Abs. 3) am Speichern oder Auslesen von etwas auf <em>Ihrem</em> Gerät ansetzt, und dieser Pixel tut keines von beiden. Jeder Seitenaufruf sendet genau das, den wortwörtlichen Tag, der genau jetzt live auf dieser Seite liegt — kopieren Sie ihn und prüfen Sie ihn selbst:
    </p>
    <div style={{ background: '#0c0c16', border: '1px solid rgba(0,245,196,0.2)', borderRadius: 6, padding: '12px 16px', margin: '8px 0 16px 0', overflowX: 'auto' }}>
      <code style={{ fontSize: 'var(--fs-small)', color: 'var(--accent-text)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {'<img src="https://rfi-irfos.com/api/track/pixel.gif?site=rfi-irfos&p={page-path}&r={referrer}&utm_source={utm}" width="1" height="1" alt="" style="display:none">'}
      </code>
    </div>
    <p style={P}>
      Was durch diese Anfrage in unserer Datenbank landet: der Seitenpfad, die verweisende Domain normalisiert auf einen Kanal ("organische Suche", "direkt", "Referral", "linkedin" und so weiter, damit wir einem Vorstandsmitglied sagen können, woher Besucher kommen) und das Site-Tag. Das ist alles, vollständig: <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>path, source, referrer, utm_source, utm_medium, utm_campaign, site</code>. Unser Webserver speichert diese Felder und gibt dieselben Felder an unser Analysesystem Lighthouse weiter, das auf unserem eigenen Server in Graz läuft. Es gibt in keiner der beiden Tabellen eine IP-Adress-Spalte. Kein Besucher-ID-Feld wird von dieser Pixel-Kopie je befüllt, daher landen zwei Besuche derselben Person als zwei unabhängige, nicht verknüpfte Zeilen, nicht als ein wachsendes Profil. Vollständiger Quellcode, Backend inklusive: <a href="https://github.com/rfi-irfos/rfi-irfos-web" target="_blank" rel="noopener" style={A} className="rfi-inline-link">github.com/rfi-irfos/rfi-irfos-web</a>. Wir bitten Sie nicht, einem Satz zu vertrauen, wir zeigen auf den Code, der entweder dazu passt oder nicht.
    </p>
    <p style={P}>
      Ein weiteres Signal landet auf demselben Weg: welcher Abschnitt dieser einzelnen, scrollenden Seite während Ihres Besuchs sichtbar wurde (das Offenlegungsregister, Preise, das Hinweis-Formular und so weiter), gespeichert als eine weitere anonyme <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>section</code>-Spalte in derselben Tabelle. Das ist ein Zähler, kein Betrachtungsprotokoll — "der Registerabschnitt wurde heute 214 Mal gesehen", niemals "Besucher X hat sich das Register angesehen." Die Seite hält eine einfache JavaScript-Variable im Speicher, damit Hoch- und Herunterscrollen über einen Abschnitt ihn nicht doppelt zählt; diese Variable wird nie in ein Cookie, <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>localStorage</code> oder <code style={{ background: '#151520', padding: '1px 5px', borderRadius: 3, fontSize: 'var(--fs-small)' }}>sessionStorage</code> geschrieben und ist beim nächsten Laden der Seite sofort weg. Dieselbe Begründung wie beim Pixel oben: Auf Ihrem Gerät wird nichts gespeichert, daher greift der ePrivacy-Einwilligungstatbestand nie, und nichts davon identifiziert Sie, daher sind es von vornherein keine personenbezogenen Daten.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>„Targeting-/Werbe-Cookies, zum Erstellen eines Profils Ihrer Interessen."</strong><br />
      Wir haben keine. Wir schalten Suchanzeigen bei Google, und diese Seite lädt dafür weder Code noch Cookies von Google. Einen Besuch über eine Anzeige erkennen wir allein an der Klick-Kennung in der Adresse, wie oben unter „Google-Anzeigenklick“ beschrieben, und ein Profil Ihrer Interessen entsteht daraus bei uns nicht.
    </p>
    <p style={P}>
      Wir hätten trotzdem einen Cookie-Banner mit einem befriedigenden "Alle akzeptieren"-Knopf einbauen können, weil ihn jeder erwartet. Haben wir nicht, weil ein Einwilligungsbanner suggeriert, dass in Ihrem Namen eine Entscheidung getroffen wird, und hier gibt es keine zu treffen. Sollte sich das je ändern, ändert sich dieser Abschnitt mit — öffentlich, in derselben Commit-Historie wie alles andere auf dieser Website.
    </p>

    <h2 style={H2}>Automatisierte Entscheidungsfindung</h2>
    <p style={P}>Keine. Wir setzen kein Profiling und keine automatisierte Entscheidungsfindung ein, die rechtliche oder ähnlich bedeutsame Wirkung für Sie entfaltet.</p>

    <h2 style={H2}>Speicherdauer</h2>
    <p style={P}>
      Kontaktanfragen werden nach Abschluss der Kommunikation gelöscht, spätestens nach 7 Jahren gemäß österreichischen gesetzlichen Aufbewahrungsvorschriften. Zahlungsbelege werden gemäß § 132 BAO (Bundesabgabenordnung) 7 Jahre aufbewahrt. Serverprotokolle und Pixel-Daten werden nur so lange aufbewahrt, wie es für Sicherheits- und Traffic-Analyse nötig ist, und danach rotiert. Einträge zu Google-Anzeigenklicks werden nach 90 Tagen automatisch gelöscht.
    </p>

    <h2 style={H2}>Datenschutz für Minderjährige</h2>
    <p style={P}>Dies ist eine B2B-Forschungs- und Offenlegungsseite. Sie richtet sich nicht an Kinder, und wir erheben wissentlich keine Daten von Personen unterhalb des nach Art. 8 DSGVO für die Einwilligung erforderlichen Alters.</p>

    <h2 style={H2}>Ihre Rechte (Art. 15–21 DSGVO)</h2>
    <p style={P}>
      Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch, alles davon, unter: <a href="mailto:contact@rfi-irfos.com" style={A} className="rfi-inline-link">contact@rfi-irfos.com</a>. Angesichts dessen, wie wenig wir tatsächlich über eine einzelne Person vorhalten, erledigen wir die meisten dieser Anfragen in Minuten, nicht in Wochen.
    </p>

    <h2 style={H2}>Beschwerderecht</h2>
    <p style={P}>Österreichische Datenschutzbehörde: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener" style={A} className="rfi-inline-link">dsb.gv.at</a></p>

    <h2 style={H2}>Änderungen dieser Erklärung</h2>
    <p style={P}>Jede Änderung dessen, was wir tatsächlich erheben, wird zuerst hier abgebildet, mit vorgezogenem "Letzte Aktualisierung"-Datum oben. Wir verfolgen Änderungen an dieser Seite nach demselben Maßstab, den wir von jedem anderen erwarten würden.</p>

    <h2 style={H2}>Ein Wort zur Konsistenz</h2>
    <p style={P}>Wir verbringen unsere Forschungszeit damit, andere Unternehmen genau für diese Art von Erklärung zu prüfen. Diese hier beschreibt, was auf dieser Website tatsächlich passiert, im selben evidenzbasierten Geist — nichts hier ist Wunschdenken, und die nachprüfbaren Teile sind von Ihnen nachprüfbar, nicht nur von uns.</p>
  </>
}

function AGB() {
  const { locale } = useLocale()
  return locale === 'de' ? <AGBDE /> : <AGBEN />
}

function AGBEN() {
  return <>
    <h1 style={H1}>General Terms and Conditions</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>RFI-IRFOS &middot; Last updated: October 2026</p>

    <p style={P}>
      Thirteen sections, no filler clause, nothing in here that exists only to look thorough. If a paragraph below feels short, that's because the short version was the accurate one.
    </p>

    <h2 style={H2}>1. Scope — B2B Only</h2>
    <p style={P}>
      These Terms apply to all services provided by RFI-IRFOS (ZVR 1015608684, Elisabethinergasse 25/10, 8020 Graz) — in particular security audits, software development, and research services.<br /><br />
      This offer is directed <strong style={{ color: '#e8e8f0' }}>exclusively at business entities</strong> within the meaning of § 1(2) of the Austrian Consumer Protection Act (KSchG). Contracts with consumers within the meaning of the KSchG are excluded. By placing an order, the client confirms that they are acting within the scope of their commercial or professional activity.
    </p>

    <h2 style={H2}>2. Service Delivery</h2>
    <p style={P}>Scope and terms are agreed in writing, per engagement, before work starts. Website descriptions and price listings on this site are indicative and do not constitute binding offers, actual scope is confirmed in writing with each client.</p>

    <h2 style={H2}>3. Pricing &amp; Payment</h2>
    <p style={P}>
      Prices are in Euro, plus statutory VAT. Payment is made <strong style={{ color: '#e8e8f0' }}>in full, upfront</strong>, before work begins — exclusively via the payment methods offered on the website (Stripe).<br /><br />
      Service delivery begins <strong style={{ color: '#e8e8f0' }}>immediately</strong> upon receipt of payment. The client expressly consents to this immediate commencement. Accordingly, no right of withdrawal exists (§ 18(1)(1) of the Austrian Distance and Off-Premises Contracts Act, FAGG). Cancellation or refund is excluded once payment has been received.
    </p>

    <h2 style={H2}>4. Confidentiality &amp; NDA</h2>
    <p style={P}>
      Security audit findings are subject to strict confidentiality until coordinated disclosure (90-day embargo, ISO/IEC 29147). Regulatory authorities are notified independently of NDA status, in fulfillment of our statutory reporting obligations. Our NDA covers the client's confidential material; it does not, and cannot, cover findings we are legally obliged to report to a supervisory authority.
    </p>

    <h2 style={H2}>5. Liability</h2>
    <p style={P}>Liability is limited to intent and gross negligence. Maximum liability: the invoice value of the respective service. Consequential damages are excluded to the extent permitted by law.</p>

    <h2 style={H2}>6. No Warranty of Completeness (Security Research)</h2>
    <p style={P}>Security and privacy assessments reflect the state of the audited system at the time of testing, within the depth of access and duration of the engagement. RFI-IRFOS does not warrant that all vulnerabilities have been identified. Anyone who tells you a security assessment is exhaustive is selling you something, and this is us saying so about our own reports too.</p>

    <h2 style={H2}>7. Intellectual Property</h2>
    <p style={P}>Reports, source code, and research output remain the property of RFI-IRFOS until payment is received in full. Upon receipt of payment, the client receives the agreed usage rights.</p>

    <h2 style={H2}>8. Communication</h2>
    <p style={P}>Research and disclosure work is conducted in writing (email), for the audit trail this creates on both sides. Every paying client has direct access to us through the customer portal. Clients of our Managed SOC also reach us around the clock by phone; incidents are answered within one hour.</p>

    <h2 style={H2}>9. Force Majeure</h2>
    <p style={P}>Neither party is liable for delay or failure to perform caused by circumstances beyond its reasonable control, provided the affected party notifies the other without undue delay.</p>

    <h2 style={H2}>10. Governing Law &amp; Jurisdiction</h2>
    <p style={P}>Austrian law applies, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). Place of jurisdiction: Graz, Austria.</p>

    <h2 style={H2}>11. Consumer Dispute Resolution</h2>
    <p style={P}>
      As we contract exclusively with businesses, we are not obligated to participate in consumer arbitration proceedings.
    </p>

    <h2 style={H2}>12. Severability</h2>
    <p style={P}>Should any provision of these Terms be or become invalid, the validity of the remaining provisions shall remain unaffected.</p>

    <h2 style={H2}>13. Contact</h2>
    <p style={P}><a href="mailto:contact@rfi-irfos.com" style={A} className="rfi-inline-link">contact@rfi-irfos.com</a></p>

    <h2 style={H2}>14. Use of Revenue</h2>
    <p style={P}>
      Services under these Terms are provided by the trade of the RFI-IRFOS research association (GISA 39261441, ZVR 1015608684). Surplus that remains with the association is used for its statutory purposes, in particular research, infrastructure and the development of new technologies.
    </p>
  </>
}

function AGBDE() {
  return <>
    <h1 style={H1}>Allgemeine Geschäftsbedingungen</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>RFI-IRFOS &middot; Letzte Aktualisierung: Oktober 2026</p>

    <p style={P}>
      Vierzehn Abschnitte, keine Füllklausel, nichts hier, das nur existiert, um gründlich zu wirken. Wenn ein Absatz unten kurz wirkt, dann weil die kurze Fassung die zutreffende war.
    </p>

    <h2 style={H2}>1. Geltungsbereich — Ausschließlich B2B</h2>
    <p style={P}>
      Diese Bedingungen gelten für alle von RFI-IRFOS (ZVR 1015608684, Elisabethinergasse 25/10, 8020 Graz) erbrachten Leistungen — insbesondere Sicherheitsaudits, Softwareentwicklung und Forschungsleistungen.<br /><br />
      Dieses Angebot richtet sich <strong style={{ color: '#e8e8f0' }}>ausschließlich an Unternehmer</strong> im Sinne des § 1 Abs. 2 Konsumentenschutzgesetz (KSchG). Verträge mit Verbrauchern im Sinne des KSchG sind ausgeschlossen. Mit Erteilung eines Auftrags bestätigt der Kunde, im Rahmen seiner gewerblichen oder beruflichen Tätigkeit zu handeln.
    </p>

    <h2 style={H2}>2. Leistungserbringung</h2>
    <p style={P}>Umfang und Bedingungen werden schriftlich, pro Auftrag, vor Arbeitsbeginn vereinbart. Leistungsbeschreibungen und Preislisten auf dieser Website sind unverbindlich und stellen kein bindendes Angebot dar, der tatsächliche Leistungsumfang wird mit jedem Kunden schriftlich bestätigt.</p>

    <h2 style={H2}>3. Preise &amp; Zahlung</h2>
    <p style={P}>
      Preise verstehen sich in Euro, zuzüglich gesetzlicher Umsatzsteuer. Die Zahlung erfolgt <strong style={{ color: '#e8e8f0' }}>vollständig im Voraus</strong>, vor Arbeitsbeginn — ausschließlich über die auf der Website angebotenen Zahlungsmethoden (Stripe).<br /><br />
      Die Leistungserbringung beginnt <strong style={{ color: '#e8e8f0' }}>unmittelbar</strong> nach Zahlungseingang. Der Kunde stimmt diesem unmittelbaren Beginn ausdrücklich zu. Dementsprechend besteht kein Rücktrittsrecht (§ 18 Abs. 1 Z 1 Fern- und Auswärtsgeschäfte-Gesetz, FAGG). Stornierung oder Rückerstattung sind nach Zahlungseingang ausgeschlossen.
    </p>

    <h2 style={H2}>4. Vertraulichkeit &amp; Geheimhaltungsvereinbarung</h2>
    <p style={P}>
      Ergebnisse von Sicherheitsaudits unterliegen strenger Vertraulichkeit bis zur koordinierten Offenlegung (90-Tage-Embargo, ISO/IEC 29147). Aufsichtsbehörden werden unabhängig vom Status einer Geheimhaltungsvereinbarung benachrichtigt, in Erfüllung unserer gesetzlichen Meldepflichten. Unsere Geheimhaltungsvereinbarung deckt das vertrauliche Material des Kunden ab; sie deckt Befunde, zu deren Meldung an eine Aufsichtsbehörde wir gesetzlich verpflichtet sind, nicht ab und kann dies auch nicht.
    </p>

    <h2 style={H2}>5. Haftung</h2>
    <p style={P}>Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Höchsthaftung: der Rechnungswert der jeweiligen Leistung. Folgeschäden sind, soweit gesetzlich zulässig, ausgeschlossen.</p>

    <h2 style={H2}>6. Kein Vollständigkeitsanspruch (Sicherheitsforschung)</h2>
    <p style={P}>Sicherheits- und Datenschutzbewertungen spiegeln den Zustand des geprüften Systems zum Zeitpunkt der Prüfung wider, im Rahmen der Zugriffstiefe und Dauer des jeweiligen Auftrags. RFI-IRFOS gewährleistet nicht, dass alle Schwachstellen identifiziert wurden. Wer Ihnen sagt, eine Sicherheitsbewertung sei erschöpfend, verkauft Ihnen etwas — und das sagen wir hiermit auch über unsere eigenen Berichte.</p>

    <h2 style={H2}>7. Geistiges Eigentum</h2>
    <p style={P}>Berichte, Quellcode und Forschungsergebnisse bleiben Eigentum von RFI-IRFOS, bis die Zahlung vollständig eingegangen ist. Nach Zahlungseingang erhält der Kunde die vereinbarten Nutzungsrechte.</p>

    <h2 style={H2}>8. Kommunikation</h2>
    <p style={P}>Forschungs- und Offenlegungsarbeit erfolgt schriftlich (E-Mail), wegen des dadurch für beide Seiten entstehenden Nachweispfads. Jeder zahlende Kunde hat über das Kundenportal direkten Zugang zu uns. Kunden unseres Managed SOC erreichen uns zusätzlich rund um die Uhr telefonisch; Incidents beantworten wir binnen einer Stunde.</p>

    <h2 style={H2}>9. Höhere Gewalt</h2>
    <p style={P}>Keine der Parteien haftet für Verzögerungen oder Nichterfüllung, die durch Umstände außerhalb ihrer zumutbaren Kontrolle verursacht werden, sofern die betroffene Partei die andere Partei unverzüglich benachrichtigt.</p>

    <h2 style={H2}>10. Anwendbares Recht &amp; Gerichtsstand</h2>
    <p style={P}>Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand: Graz, Österreich.</p>

    <h2 style={H2}>11. Verbraucherschlichtung</h2>
    <p style={P}>
      Da wir ausschließlich mit Unternehmen kontrahieren, sind wir nicht verpflichtet, an Verfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
    </p>

    <h2 style={H2}>12. Salvatorische Klausel</h2>
    <p style={P}>Sollte eine Bestimmung dieser Bedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.</p>

    <h2 style={H2}>13. Kontakt</h2>
    <p style={P}><a href="mailto:contact@rfi-irfos.com" style={A} className="rfi-inline-link">contact@rfi-irfos.com</a></p>

    <h2 style={H2}>14. Verwendung der Einnahmen</h2>
    <p style={P}>
      Die Leistungen nach diesen Bedingungen erbringt das Gewerbe des Forschungsvereins RFI-IRFOS (GISA 39261441, ZVR 1015608684). Überschüsse, die beim Verein verbleiben, verwendet er für seine statutarischen Zwecke, insbesondere Forschung, Infrastruktur und die Entwicklung neuer Technologien.
    </p>
  </>
}

function Security() {
  const { locale } = useLocale()
  return locale === 'de' ? <SecurityDE /> : <SecurityEN />
}

function SecurityEN() {
  return <>
    <h1 style={H1}>Responsible Disclosure &amp; Security Policy</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>Coordinated Disclosure &middot; ISO/IEC 29147 &amp; ISO/IEC 30111</p>

    <h2 style={H2}>Our Method</h2>
    <p style={P}>
      We are a research institute, not a vendor chasing customers. We perform root level code analysis on publicly distributed software and disclose what we find - to the company, and to the regulator, at the same time. Here is what that means in practice, and why it holds up. We publish what we do; the specific techniques behind any single finding stay in the report we send the company, not on this page.
    </p>
    <ul style={{ ...P, paddingLeft: 18, marginBottom: 16 }}>
      <li><strong style={{ color: '#e8e8f0' }}>Free, unconditional disclosure.</strong> Public disclosure is Tier 1. It happens after the 90-day embargo, regardless of payment, regardless of reply. Nothing is held back for money.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Coordinated, not cold outreach.</strong> We follow ISO/IEC 29147. Supervisory authorities are CC'd from day one - visibly, not blind-copied, not informed only if things go nowhere.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Evidence, not allegation.</strong> Every finding points to a specific artifact in the software as actually shipped - a declared permission, a compiled SDK class, a hardcoded key. Any competent third party can independently verify it.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Not-for-profit, by structure.</strong> RFI-IRFOS is a registered not-for-profit. There are no shareholders; surplus is reinvested into research. Paid advisory tiers are optional and separate - never a condition of free disclosure.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Research, not extortion.</strong> Our work is grounded in the freedom of scientific research (Art. 17 StGG, Austrian Basic Law of 1867, constitutional rank) and GDPR Art. 89. We report on companies' own distributed software - never private, stolen, or unauthorized-access data.</li>
      <li><strong style={{ color: '#e8e8f0' }}>No disruption, ever.</strong> No denial-of-service, no load testing. Findings come from static analysis of the software as shipped, never from attacking it in production.</li>
      <li><strong style={{ color: '#e8e8f0' }}>No dynamic testing without an agreement, no social engineering.</strong> Live calls against a company's own systems happen only under a signed engagement. We never phish, pretext, or manipulate staff to obtain access.</li>
      <li><strong style={{ color: '#e8e8f0' }}>No fabricated progress, not even from our own tools.</strong> Every in-house agentic tool runs under a written truth policy: never claim a file exists, code ran, or a test passed unless it was actually verified.</li>
    </ul>

    <h2 style={H2}>Our Disclosure Framework</h2>
    <p style={P}>
      Root level code analysis. Regulators in CC on every submission - national DPA + EDPS. 90-day coordinated disclosure. Our framework. Our timeline.
    </p>
    <p style={P}>
      We do not operate bug bounty programs, HackerOne, or any third-party vulnerability reward platforms. All findings are published under <strong style={{ color: '#e8e8f0' }}>the freedom of science (Art. 17 StGG)</strong> and constitute free scientific knowledge sharing within the EU research framework - independent of commercial incentive.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Disclosure is unconditional.</strong> Every organization on our ledger receives identical treatment - same embargo, same publication, same regulator notification - whether or not they engage RFI-IRFOS commercially.
    </p>
    <p style={P}>
      90-day coordinated embargo from initial notification to public disclosure. Regulators (DSB, EDPB, CERT.at) notified in parallel — not after the fact, not only "if this goes nowhere." Extensions considered case-by-case, for genuine remediation in progress, never for stalling.
    </p>

    <p style={P}>
      We spend most of our time finding the things other companies didn't want found. Fair's fair — here's how to find one in ours. Real institute, real street address in Graz, Austria, no bug-bounty theater, no chatbot standing between you and the person who actually reads this.
    </p>

    <h2 style={H2}>Reporting a Vulnerability</h2>
    <p style={P}>
      E-Mail: <a href="mailto:security@rfi-irfos.com" style={A} className="rfi-inline-link">security@rfi-irfos.com</a><br />
      PGP key available on request. We acknowledge all reports within 48 hours — from a human, not a ticket number.
    </p>

    <h2 style={H2}>How We Handle What You Send Us</h2>
    <p style={P}>ISO/IEC 30111 triage: reproduce it, scope it, fix it, credit you. No finding gets buried because it's inconvenient — that's the entire complaint we file against everyone else, and we're not exempting ourselves from it.</p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Lawful basis only.</strong> We accept findings obtained through publicly accessible information, your own devices, or software you're authorized to test — the same standard our own root-level code analysis holds to. If what you send us shows evidence of unauthorized access to a system you don't control, we do not publish or credit it under this program. We report it directly to the relevant authorities, the same way we'd expect to be treated if the roles were reversed.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Credit, your choice.</strong> Full name, alias, or fully anonymous — exactly as set out in our <a href="/agb/" style={A} className="rfi-inline-link">terms</a>. No call, no meeting. Everything stays written, same as every disclosure we send.
    </p>

    <h2 style={H2}>Scope</h2>
    <p style={P}>rfi-irfos.com &middot; ternlang.com &middot; lighthouse.rfi-irfos.com &middot; github.com/rfi-irfos/*</p>

    <h2 style={H2}>Out of Scope</h2>
    <p style={P}>Social engineering, physical attacks, DoS/DDoS. We do not operate a bug bounty program — no points, no swag, no leaderboard. This isn't a platform, it's an inbox.</p>

    <h2 style={H2}>Hall of Fame</h2>
    <p style={P}>Responsible reporters credited publicly (with consent) in our disclosure reports. Your name, where it's earned — nothing gamified about it.</p>

    <h2 style={H2}>Safe Harbor</h2>
    <p style={P}>
      Good-faith security research conducted in line with this policy, reported to us privately and given reasonable time to be triaged, will not trigger a civil or criminal complaint from us. We will not treat your report as unauthorized access, we will treat it as the thing it is.
    </p>

    <h2 style={H2}>Why We Publish This Page At All</h2>
    <p style={P}>
      Because a research institute that discloses other people's undocumented tracking mechanisms, hardcoded keys, and pre-consent SDK inits, while not publishing its own security policy, would be exactly the kind of double standard we call out in our own reports. This page exists so nobody has to take that on faith either.
    </p>

    <h2 style={H2}>A Word on Tone</h2>
    <p style={P}>
      We work out of Graz, Austria — closer to the Alps than to a glass tower. We follow ISO/IEC 29147 to the letter, we file with regulators before anyone makes us, and we still think most corporate security pages read like they were written by the incident they're supposed to prevent. This one wasn't.
    </p>
  </>
}

function SecurityDE() {
  return <>
    <h1 style={H1}>Responsible Disclosure &amp; Sicherheitsrichtlinie</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>Koordinierte Offenlegung &middot; ISO/IEC 29147 &amp; ISO/IEC 30111</p>

    <h2 style={H2}>Unsere Methode</h2>
    <p style={P}>
      Wir sind ein Forschungsinstitut, kein Anbieter auf Kundenjagd. Wir führen Root-Level-Codeanalysen an öffentlich vertriebener Software durch und legen offen, was wir finden - gegenüber dem Unternehmen und der Aufsichtsbehörde, gleichzeitig. Hier ist, was das in der Praxis bedeutet, und warum es trägt. Wir veröffentlichen, was wir tun; die konkreten Techniken hinter einem einzelnen Fund bleiben im Bericht, den wir dem Unternehmen schicken, nicht auf dieser Seite.
    </p>
    <ul style={{ ...P, paddingLeft: 18, marginBottom: 16 }}>
      <li><strong style={{ color: '#e8e8f0' }}>Kostenlose, bedingungslose Offenlegung.</strong> Öffentliche Offenlegung ist Tier 1. Sie erfolgt nach dem 90-Tage-Embargo, unabhängig von Zahlung, unabhängig von Antwort. Nichts wird für Geld zurückgehalten.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Koordiniert, keine Kaltakquise.</strong> Wir folgen ISO/IEC 29147. Aufsichtsbehörden werden von Tag eins an in CC gesetzt - sichtbar, nicht verdeckt, nicht erst informiert, wenn nichts vorangeht.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Evidenz, keine Behauptung.</strong> Jeder Fund verweist auf ein konkretes Artefakt in der tatsächlich ausgelieferten Software - eine deklarierte Berechtigung, eine kompilierte SDK-Klasse, einen hartkodierten Schlüssel. Jeder kompetente Dritte kann das unabhängig nachprüfen.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Nicht gewinnorientiert, strukturell.</strong> RFI-IRFOS ist ein eingetragener, nicht gewinnorientierter Verein. Es gibt keine Anteilseigner; Überschüsse werden in Forschung reinvestiert. Kostenpflichtige Beratungsstufen sind optional und getrennt - nie eine Bedingung für kostenlose Offenlegung.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Forschung, keine Erpressung.</strong> Unsere Arbeit gründet auf der Freiheit der Wissenschaft (Art. 17 StGG, Verfassungsrang) und Art. 89 DSGVO. Wir berichten über die eigene, vertriebene Software von Unternehmen - nie über private, gestohlene Daten oder Daten aus unbefugtem Zugriff.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Niemals Störung.</strong> Kein Denial-of-Service, keine Lasttests. Funde stammen aus statischer Analyse der ausgelieferten Software, nie aus Angriffen auf die Produktivumgebung.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Keine dynamischen Tests ohne Vereinbarung, kein Social Engineering.</strong> Live-Tests gegen die eigenen Systeme eines Unternehmens finden nur unter einem unterschriebenen Auftrag statt. Wir phishen nie, täuschen nie vor, manipulieren nie Personal, um Zugang zu erhalten.</li>
      <li><strong style={{ color: '#e8e8f0' }}>Kein erfundener Fortschritt, auch nicht von unseren eigenen Werkzeugen.</strong> Jedes hausinterne Agenten-Tool läuft unter einer schriftlichen Wahrheitsrichtlinie: nie behaupten, dass eine Datei existiert, Code gelaufen ist oder ein Test bestanden wurde, ohne dass es tatsächlich verifiziert wurde.</li>
    </ul>

    <h2 style={H2}>Unser Offenlegungsrahmen</h2>
    <p style={P}>
      Root-Level-Codeanalyse. Aufsichtsbehörden bei jeder Einreichung in CC - nationale Datenschutzbehörde + EDSB. 90 Tage koordinierte Offenlegung. Unser Rahmen. Unser Zeitplan.
    </p>
    <p style={P}>
      Wir betreiben keine Bug-Bounty-Programme, kein HackerOne und keine Drittanbieter-Plattformen für Schwachstellenprämien. Alle Funde werden unter der <strong style={{ color: '#e8e8f0' }}>Freiheit der Wissenschaft (Art. 17 StGG)</strong> veröffentlicht und stellen freien wissenschaftlichen Wissensaustausch im EU-Forschungsrahmen dar - unabhängig von kommerziellem Anreiz.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Offenlegung ist bedingungslos.</strong> Jede Organisation auf unserem Ledger erhält dieselbe Behandlung - dasselbe Embargo, dieselbe Veröffentlichung, dieselbe Behördenbenachrichtigung - unabhängig davon, ob sie RFI-IRFOS kommerziell beauftragt.
    </p>
    <p style={P}>
      90 Tage koordiniertes Embargo von der Erstbenachrichtigung bis zur öffentlichen Offenlegung. Aufsichtsbehörden (DSB, EDSA, CERT.at) werden parallel benachrichtigt — nicht im Nachhinein, nicht nur, „falls das hier zu nichts führt". Verlängerungen werden von Fall zu Fall geprüft, bei echter laufender Behebung, nie zum Hinauszögern.
    </p>

    <p style={P}>
      Wir verbringen das meiste unserer Zeit damit, Dinge zu finden, die andere Unternehmen nicht gefunden haben wollten. Fairerweise: So findet man eines bei uns. Echtes Institut, echte Anschrift in Graz, Österreich, kein Bug-Bounty-Theater, kein Chatbot zwischen Ihnen und der Person, die das hier tatsächlich liest.
    </p>

    <h2 style={H2}>Eine Schwachstelle melden</h2>
    <p style={P}>
      E-Mail: <a href="mailto:security@rfi-irfos.com" style={A} className="rfi-inline-link">security@rfi-irfos.com</a><br />
      PGP-Schlüssel auf Anfrage verfügbar. Wir bestätigen jede Meldung innerhalb von 48 Stunden — von einem Menschen, nicht einer Ticketnummer.
    </p>

    <h2 style={H2}>Wie wir mit Ihren Einsendungen umgehen</h2>
    <p style={P}>ISO/IEC-30111-Triage: reproduzieren, eingrenzen, beheben, Sie kreditieren. Kein Fund wird begraben, weil er unbequem ist — genau das ist die gesamte Beschwerde, die wir gegen alle anderen erheben, und wir nehmen uns davon nicht aus.</p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Nur rechtmäßige Grundlage.</strong> Wir akzeptieren Funde, die über öffentlich zugängliche Informationen, Ihre eigenen Geräte oder Software, zu deren Test Sie berechtigt sind, gewonnen wurden — derselbe Maßstab, an den sich auch unsere eigene Root-Level-Codeanalyse hält. Zeigt das, was Sie uns schicken, Hinweise auf unbefugten Zugriff auf ein System, das Sie nicht kontrollieren, veröffentlichen oder kreditieren wir es unter diesem Programm nicht. Wir melden es direkt an die zuständigen Behörden, genauso, wie wir behandelt werden wollten, wenn die Rollen vertauscht wären.
    </p>
    <p style={P}>
      <strong style={{ color: '#e8e8f0' }}>Namensnennung, Ihre Wahl.</strong> Vollständiger Name, Alias oder vollständig anonym — genau wie in unseren <a href="/de/agb/" style={A} className="rfi-inline-link">AGB</a> festgelegt. Kein Anruf, kein Treffen. Alles bleibt schriftlich, wie bei jeder Offenlegung, die wir versenden.
    </p>

    <h2 style={H2}>Geltungsbereich</h2>
    <p style={P}>rfi-irfos.com &middot; ternlang.com &middot; lighthouse.rfi-irfos.com &middot; github.com/rfi-irfos/*</p>

    <h2 style={H2}>Nicht im Geltungsbereich</h2>
    <p style={P}>Social Engineering, physische Angriffe, DoS/DDoS. Wir betreiben kein Bug-Bounty-Programm — keine Punkte, kein Merchandise, keine Bestenliste. Das hier ist keine Plattform, das ist ein Postfach.</p>

    <h2 style={H2}>Ehrentafel</h2>
    <p style={P}>Verantwortungsvolle Melder werden (mit Zustimmung) öffentlich in unseren Offenlegungsberichten genannt. Ihr Name, wo er verdient ist — nichts davon ist gamifiziert.</p>

    <h2 style={H2}>Safe Harbor</h2>
    <p style={P}>
      Sicherheitsforschung in gutem Glauben, die im Einklang mit dieser Richtlinie durchgeführt, uns privat gemeldet und mit angemessener Zeit zur Triage versehen wird, löst von unserer Seite keine zivil- oder strafrechtliche Anzeige aus. Wir behandeln Ihre Meldung nicht als unbefugten Zugriff, sondern als das, was sie ist.
    </p>

    <h2 style={H2}>Warum wir diese Seite überhaupt veröffentlichen</h2>
    <p style={P}>
      Weil ein Forschungsinstitut, das die undokumentierten Tracking-Mechanismen, hartkodierten Schlüssel und SDK-Initialisierungen vor Einwilligung anderer offenlegt, ohne seine eigene Sicherheitsrichtlinie zu veröffentlichen, genau der doppelte Standard wäre, den wir in unseren eigenen Berichten anprangern. Diese Seite existiert, damit niemand das auch hier nur glauben muss.
    </p>

    <h2 style={H2}>Ein Wort zum Ton</h2>
    <p style={P}>
      Wir arbeiten von Graz, Österreich aus — näher an den Alpen als an einem Glasturm. Wir folgen ISO/IEC 29147 buchstabengetreu, wir melden bei Behörden, bevor uns jemand dazu zwingt, und wir finden trotzdem, dass die meisten Sicherheitsseiten von Unternehmen klingen, als wären sie von dem Vorfall geschrieben worden, den sie eigentlich verhindern sollen. Diese hier nicht.
    </p>
  </>
}

function Standards() {
  const { locale } = useLocale()
  return locale === 'de' ? <StandardsDE /> : <StandardsEN />
}

function StandardsEN() {
  return <>
    <h1 style={H1}>Standards &amp; Compliance</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>The frameworks we file every audit against &middot; Last updated: November 2026</p>

    {/* Core doctrine line, moved here from the footer (Simeon 2026-11-10). */}
    <p style={{ ...P, color: 'var(--accent-text)', fontWeight: 700 }}>Human rights are not subject to negotiation.</p>

    <p style={P}>
      Every audit RFI-IRFOS runs is filed against current EU and Austrian law. We track new standards as they enter force and keep our methodology up to date. This page lists what that actually means in practice — the specific frameworks, not just a claim that we "follow best practice."
    </p>

    <h2 style={H2}>NIS-2 · NISG 2026</h2>
    <p style={P}>
      The EU directive for a high common level of cybersecurity, transposed into Austrian law as <strong style={{ color: '#e8e8f0' }}>NISG 2026</strong>. It mandates state-of-the-art risk management, strict incident reporting to national authorities, and <strong style={{ color: '#e8e8f0' }}>personal liability for company management</strong>. In Austria it directly impacts roughly 4,000 essential and important entities, plus an estimated 50,000 supply-chain partners.
    </p>
    <p style={P}>
      In practice this covers three things: <strong style={{ color: '#e8e8f0' }}>risk management</strong> (cryptography, access control, supply-chain security), <strong style={{ color: '#e8e8f0' }}>incident response</strong> (mandatory reporting within strict timeframes), and <strong style={{ color: '#e8e8f0' }}>corporate accountability</strong> (management personally liable for non-compliance). Scope: ~4,000 entities directly, ~50,000 supply-chain partners — see <a href="https://www.nis.gv.at" target="_blank" rel="noopener" style={A} className="rfi-inline-link">nis.gv.at</a>.
    </p>

    <h2 style={H2}>GDPR &middot; EU 2016/679</h2>
    <p style={P}>Art. 6 lawful basis, Art. 9 special-category (health/biometric), Art. 8 children, Art. 33 breach notification. The backbone of every disclosure we file.</p>

    <h2 style={H2}>EU AI Act &middot; EU 2024/1689</h2>
    <p style={P}>Risk-tiered obligations for AI systems: transparency, governance, prohibited-practice analysis for the models we audit and build.</p>

    <h2 style={H2}>EU DSA &middot; EU 2022/2065</h2>
    <p style={P}>Digital Services Act. Systemic-risk and illegal-content obligations. Filed directly with the Irish Digital Services Coordinator (Coimisiún na Meán) on platform findings.</p>

    <h2 style={H2}>ISO/IEC 29147 &middot; International</h2>
    <p style={P}>Vulnerability disclosure. Our coordinated framework follows the 90-day embargo + regulator-notification standard — see our <a href="/security/" onClick={e => navigate(e, '/security/')} style={A} className="rfi-inline-link">Security Policy</a> for the process itself.</p>

    <h2 style={H2}>ISO/IEC 30111 &middot; International</h2>
    <p style={P}>Vulnerability handling processes. The internal triage, validation, and remediation-tracking workflow behind every coordinated disclosure we run.</p>

    <h2 style={H2}>ISO/IEC 27001 &middot; International</h2>
    <p style={P}>Information security management. The control set behind our handling of evidence, NDAs, and client data.</p>

    <h2 style={H2}>COPPA &middot; US · 15 U.S.C. §6501</h2>
    <p style={P}>Children's online privacy. Applied across our minor-protection audits of apps, games, and streaming platforms.</p>

    <h2 style={H2}>EU MDR &middot; EU 2017/745</h2>
    <p style={P}>Medical Device Regulation. Class IIb scrutiny for health/wearable apps processing Internet-of-Bodies data.</p>

    <h2 style={H2}>eIDAS / Trust Services &middot; EU 910/2014</h2>
    <p style={P}>Electronic identification + trust services. Relevant to the biometric + identity-verification SDKs under our magnification.</p>

    <h2 style={H2}>ePrivacy Directive &middot; EU 2002/58/EC</h2>
    <p style={P}>Consent for tracking, access to terminal equipment, electronic communications confidentiality. Art. 5(3) is the legal backbone of every SDK-consent finding we publish.</p>
  </>
}

function StandardsDE() {
  return <>
    <h1 style={H1}>Standards &amp; Compliance</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>Die Rahmenwerke, gegen die wir jedes Audit führen &middot; Letzte Aktualisierung: November 2026</p>

    {/* Leitsatz, aus dem Footer hierher verschoben (Simeon 2026-11-10). */}
    <p style={{ ...P, color: 'var(--accent-text)', fontWeight: 700 }}>Menschenrechte sind nicht verhandelbar.</p>

    <p style={P}>
      Jedes Audit, das RFI-IRFOS durchführt, wird gegen geltendes EU- und österreichisches Recht geführt. Wir verfolgen neue Standards, sobald sie in Kraft treten, und halten unsere Methodik aktuell. Diese Seite listet auf, was das in der Praxis tatsächlich bedeutet — die konkreten Rahmenwerke, nicht nur die Behauptung, wir würden „Best Practices" befolgen.
    </p>

    <h2 style={H2}>NIS-2 · NISG 2026</h2>
    <p style={P}>
      Die EU-Richtlinie für ein hohes gemeinsames Cybersicherheitsniveau, umgesetzt in österreichisches Recht als <strong style={{ color: '#e8e8f0' }}>NISG 2026</strong>. Sie verlangt Risikomanagement nach dem Stand der Technik, strenge Vorfallsmeldung an nationale Behörden und <strong style={{ color: '#e8e8f0' }}>persönliche Haftung der Unternehmensführung</strong>. In Österreich betrifft sie direkt rund 4.000 wesentliche und wichtige Einrichtungen, plus geschätzte 50.000 Lieferkettenpartner.
    </p>
    <p style={P}>
      In der Praxis umfasst das drei Dinge: <strong style={{ color: '#e8e8f0' }}>Risikomanagement</strong> (Kryptografie, Zugriffskontrolle, Lieferkettensicherheit), <strong style={{ color: '#e8e8f0' }}>Vorfallsreaktion</strong> (verpflichtende Meldung innerhalb strenger Fristen) und <strong style={{ color: '#e8e8f0' }}>Unternehmensverantwortung</strong> (Geschäftsführung persönlich haftbar bei Nichteinhaltung). Umfang: ~4.000 Einrichtungen direkt, ~50.000 Lieferkettenpartner — siehe <a href="https://www.nis.gv.at" target="_blank" rel="noopener" style={A} className="rfi-inline-link">nis.gv.at</a>.
    </p>

    <h2 style={H2}>DSGVO &middot; EU 2016/679</h2>
    <p style={P}>Art. 6 Rechtsgrundlage, Art. 9 besondere Kategorien (Gesundheit/Biometrie), Art. 8 Kinder, Art. 33 Meldung von Verletzungen. Das Rückgrat jeder Offenlegung, die wir einreichen.</p>

    <h2 style={H2}>EU AI Act &middot; EU 2024/1689</h2>
    <p style={P}>Risikogestufte Pflichten für KI-Systeme: Transparenz, Governance, Analyse verbotener Praktiken für die Modelle, die wir prüfen und bauen.</p>

    <h2 style={H2}>EU DSA &middot; EU 2022/2065</h2>
    <p style={P}>Digital Services Act. Pflichten zu systemischen Risiken und illegalen Inhalten. Bei Plattform-Funden direkt beim irischen Digital Services Coordinator (Coimisiún na Meán) eingereicht.</p>

    <h2 style={H2}>ISO/IEC 29147 &middot; International</h2>
    <p style={P}>Offenlegung von Schwachstellen. Unser koordinierter Rahmen folgt dem Standard aus 90-Tage-Embargo und Behördenbenachrichtigung — siehe unsere <a href="/de/security/" onClick={e => navigate(e, '/de/security/')} style={A} className="rfi-inline-link">Sicherheitsrichtlinie</a> für den Prozess selbst.</p>

    <h2 style={H2}>ISO/IEC 30111 &middot; International</h2>
    <p style={P}>Prozesse zur Behandlung von Schwachstellen. Der interne Triage-, Validierungs- und Nachverfolgungs-Workflow hinter jeder koordinierten Offenlegung, die wir durchführen.</p>

    <h2 style={H2}>ISO/IEC 27001 &middot; International</h2>
    <p style={P}>Informationssicherheits-Management. Das Kontrollset hinter unserem Umgang mit Evidenz, NDAs und Kundendaten.</p>

    <h2 style={H2}>COPPA &middot; US · 15 U.S.C. §6501</h2>
    <p style={P}>Online-Datenschutz für Kinder. Angewendet über unsere Minderjährigenschutz-Audits von Apps, Spielen und Streaming-Plattformen hinweg.</p>

    <h2 style={H2}>EU MDR &middot; EU 2017/745</h2>
    <p style={P}>Medizinprodukteverordnung. Klasse-IIb-Prüfung für Gesundheits-/Wearable-Apps, die Internet-of-Bodies-Daten verarbeiten.</p>

    <h2 style={H2}>eIDAS / Trust Services &middot; EU 910/2014</h2>
    <p style={P}>Elektronische Identifizierung und Vertrauensdienste. Relevant für die biometrischen und Identitätsprüfungs-SDKs unter unserer Lupe.</p>

    <h2 style={H2}>ePrivacy-Richtlinie &middot; EU 2002/58/EG</h2>
    <p style={P}>Einwilligung für Tracking, Zugriff auf Endgeräte, Vertraulichkeit der elektronischen Kommunikation. Art. 5 Abs. 3 ist das rechtliche Rückgrat jedes SDK-Einwilligungsfundes, den wir veröffentlichen.</p>
  </>
}

// The people - mirrors ternlang.com's roster. Kept as data so a departure/new-hire is
// one array edit, not a hunt through JSX (see the Lisa Scharler removal, 2026-07-04).
// Moved off the homepage onto its own page (was `#team`, a full mainpage section) -
// decision space vs. trust space: a first-time visitor cares "what can you do" before
// "who are you," per the website-repositioning plan. Lives under "Company" in the
// footer now, not under "Legal" - team bios aren't a legal document, just no longer a
// mainpage section either.
//
// Name + one focus line, not a stacked "bold title + separate description" - a
// generated "Head of X & Y" title format made distinct people read as filling the
// same org-chart slot (Ana Diez/Brennan Bell specifically read as near-duplicates:
// both titles combined "welfare" + "model safety" in different words). Simeon is the
// one deliberate exception: his contribution isn't a domain like everyone else's, it's
// the methodology/investigation approach itself, so he keeps a role title rather than
// a focus tag.
//
// Ana/Brennan's focus lines are grounded in their actual signed offer letters
// (~/Desktop/Documents/RFI-IRFOS_Offer_{Ana_Diez,Brennan_Bell}_...pdf), not guessed:
// the "model-welfare framework / long-horizon rubric" clause is word-for-word
// identical in both letters (genuinely shared responsibility, not a differentiator).
// The real difference: Ana's letter has her leading "our entire research and
// model-wellbeing arm" including "growth and mentoring of the research team as we
// scale" (research-org leadership); Brennan's letter has him owning "the model safety
// research agenda" specifically plus "collaboration with... external academic
// partners" (he's PhD-track and publishing - the academic-facing safety-research seat).
// One grid, no group labels: the team first, the co-founders underneath.
const TEAM = [
  { name: 'Louis Ehrig',         gh: 'louisuhr',               focus: 'Press & Public Affairs' },
  { name: 'Ana Diez',            gh: 'anadiezmartini',         focus: 'Model Safety & Wellbeing' },
  { name: 'Brennan Bell',        gh: '496crows',               focus: 'Safety Research & Academic Partnerships' },
  { name: 'Simeon Kepp',         gh: 'simeon-kepp',            focus: 'Co-Founder & CTO' },
  { name: 'Zabih Karimi',        gh: 'zabih-sudo',             focus: 'Co-Founder & CEO' },
  { name: 'Laura Serna Gaviria', gh: 'emergentinteractionlab', focus: 'Co-Founder & COO' },
]

function TeamCard({ p }: { p: { name: string; gh: string; focus: string } }) {
  return (
    <a href={p.gh ? `https://github.com/${p.gh}` : undefined} target="_blank" rel="noopener"
       style={{
         display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
         background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.09)',
         borderRadius: 14, padding: 20, textAlign: 'center', textDecoration: 'none',
         transition: 'border-color 0.15s', cursor: p.gh ? 'pointer' : 'default',
       }}
       onMouseEnter={e => { if (p.gh) e.currentTarget.style.borderColor = 'rgba(0,245,196,0.4)' }}
       onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }}>
      <div>
        <p style={{ fontSize: 'var(--fs-body)', fontWeight: 700, color: '#e8e8f0' }}>{p.name}</p>
        <p style={{ fontSize: 'var(--fs-label)', color: 'var(--accent-text)', marginTop: 4, fontWeight: 700 }}>{p.focus}</p>
        {p.gh && <p style={{ fontSize: 'var(--fs-label)', color: 'var(--text2)', marginTop: 6 }}>@{p.gh}</p>}
      </div>
    </a>
  )
}

function Team() {
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginTop: 32 } as const
  return <>
    <h1 style={H1}>Team</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>One team, everything in-house</p>
    <div style={grid}>{TEAM.map(p => <TeamCard key={p.name} p={p} />)}</div>
  </>
}

// Moved off the mainpage entirely (previously a "Methodology" block folded into
// the Research section) per live feedback: these four rules read as reference
// material for whoever wants to check our process, not something that needs to
// compete for mainpage scroll - same reasoning as Team moving to its own page.
const METHODOLOGY_PRINCIPLES = [
  {
    title: 'Sources',
    body: 'We only work from what we\'re lawfully entitled to see: publicly accessible information, devices we own or are authorized to test, and software we\'re authorized to analyze. If material crosses into unauthorized access to a system we don\'t control, we don\'t use it - we report it to the relevant authority instead, the same way we\'d want to be treated in reverse.',
  },
  {
    title: 'Methods',
    body: 'Investigate first, judge second: we trace root cause instead of stopping at the first symptom, and every step has to be reproducible by someone other than the person who ran it the first time. A finding that only one person can reproduce isn\'t a finding yet.',
  },
  {
    title: 'Handling results',
    body: 'Severity gets ranked, not asserted - and every client, paying or not, gets the same triage discipline (ISO/IEC 30111: reproduce it, scope it, fix it, credit the reporter). What changes between tiers is how much of the report stays private and how fast we move - never whether the finding publishes, never the rigor of the underlying work.',
  },
  {
    title: 'Disclosure',
    body: 'A fixed public heads-up window applies before anything goes on the public ledger, giving the organization real time to fix a problem before anyone else sees it. Regulators are told in parallel where our own rules require it, without exposing detail that would put a client at risk before they\'ve had the chance to fix it.',
  },
]

// Moved off the mainpage entirely (previously the "#evidence" section) per
// live feedback: a real, already-public disclosed finding (MC-01, Merge
// Chicken) demonstrating the Finding/Evidence/Method/Confidence/
// Recommendation format - reference material for whoever wants to check how
// a finding actually gets proven, same reasoning as the four principles above.
const EVIDENCE_COLUMNS = [
  { label: 'Finding', body: 'A Google Play app rated PEGI 3 ("suitable for all ages") and listed as a casual merge puzzle game functioned as an unlicensed, no-KYC real-money online casino - not present on the face of the submitted build.' },
  { label: 'Evidence', body: 'The gambling UI and logic were absent from the reviewed binary and gated behind a server-controlled switch (Firebase Remote Config), with the live payload served from separately-controlled infrastructure after install.' },
  { label: 'Method', body: 'Static root-level analysis of the published release APK: apktool decompilation, dex/string inspection, manifest review, plus open-source corroboration of the developer entity. No production servers or user accounts were probed.' },
  { label: 'Confidence', body: 'Confirmed - reported directly to Google Play & Android Security as abuse, not negotiated as a vendor disclosure. Google\'s own security team confirmed removal from the Play Store.' },
  { label: 'Recommendation', body: 'Reported 2026-06-25; app removed from the Play Store 2026-06-30 - 5 days to resolution, the first publicly documented enforcement outcome of the RFI-IRFOS 2026 Android audit programme.' },
]

const METHODOLOGY_PRINCIPLES_DE = [
  {
    title: 'Quellen',
    body: 'Wir arbeiten nur mit dem, wozu wir rechtmäßig Einsicht haben: öffentlich zugängliche Informationen, Geräte, die wir besitzen oder zu deren Test wir berechtigt sind, und Software, zu deren Analyse wir befugt sind. Wenn Material in unbefugten Zugriff auf ein System übergeht, das wir nicht kontrollieren, nutzen wir es nicht - wir melden es stattdessen der zuständigen Behörde, genauso, wie wir umgekehrt behandelt werden wollten.',
  },
  {
    title: 'Methoden',
    body: 'Erst untersuchen, dann urteilen: Wir verfolgen die Grundursache, statt beim ersten Symptom stehenzubleiben, und jeder Schritt muss von jemand anderem als der Person, die ihn zuerst ausgeführt hat, reproduzierbar sein. Ein Fund, den nur eine Person reproduzieren kann, ist noch kein Fund.',
  },
  {
    title: 'Umgang mit Ergebnissen',
    body: 'Schweregrade werden eingestuft, nicht behauptet - und jeder Kunde, zahlend oder nicht, bekommt dieselbe Triage-Disziplin (ISO/IEC 30111: reproduzieren, eingrenzen, beheben, den Melder kreditieren). Was sich zwischen den Stufen ändert, ist, wie viel vom Bericht privat bleibt und wie schnell wir vorgehen - nie, ob der Fund veröffentlicht wird, nie die Sorgfalt der zugrundeliegenden Arbeit.',
  },
  {
    title: 'Offenlegung',
    body: 'Ein fixes öffentliches Vorlauffenster gilt, bevor irgendetwas auf das öffentliche Ledger kommt, und gibt der Organisation echte Zeit, ein Problem zu beheben, bevor es sonst jemand sieht. Behörden werden parallel informiert, wo unsere eigenen Regeln das verlangen, ohne Details preiszugeben, die einen Kunden gefährden würden, bevor er die Chance hatte, es zu beheben.',
  },
]

const EVIDENCE_COLUMNS_DE = [
  { label: 'Fund', body: 'Eine mit PEGI 3 („für alle Altersgruppen geeignet") bewertete Google-Play-App, gelistet als beiläufiges Merge-Puzzle-Spiel, funktionierte als unlizenziertes Echtgeld-Online-Casino ohne KYC-Prüfung - im eingereichten Build auf den ersten Blick nicht erkennbar.' },
  { label: 'Evidenz', body: 'Die Glücksspiel-UI und -Logik fehlten in der geprüften Binärdatei und waren hinter einem serverseitig gesteuerten Schalter (Firebase Remote Config) versteckt, wobei die Live-Payload nach der Installation von separat kontrollierter Infrastruktur ausgeliefert wurde.' },
  { label: 'Methode', body: 'Statische Root-Level-Analyse der veröffentlichten Release-APK: apktool-Dekompilierung, dex-/String-Inspektion, Manifest-Prüfung, plus Open-Source-Bestätigung der Entwicklerentität. Keine Produktionsserver oder Nutzerkonten wurden untersucht.' },
  { label: 'Konfidenz', body: 'Bestätigt - direkt an Google Play & Android Security als Missbrauch gemeldet, nicht als Anbieter-Offenlegung verhandelt. Googles eigenes Sicherheitsteam bestätigte die Entfernung aus dem Play Store.' },
  { label: 'Empfehlung', body: 'Gemeldet am 25.06.2026; App am 30.06.2026 aus dem Play Store entfernt - 5 Tage bis zur Lösung, das erste öffentlich dokumentierte Durchsetzungsergebnis des RFI-IRFOS-Android-Audit-Programms 2026.' },
]

function Methodology() {
  const { locale } = useLocale()
  return locale === 'de' ? <MethodologyDE /> : <MethodologyEN />
}

function MethodologyEN() {
  return <>
    <h1 style={H1}>Methodology</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>The same rules, whoever the client is</p>
    <p style={P}>
      An investigator who bends the rules for a paying client isn't an investigator anymore - just a vendor with a fancier vocabulary. These four principles govern where we look, how we test, what we do with what we find, and when it becomes public, regardless of who's paying.
    </p>
    <div style={{ display: 'grid', gap: 24, marginTop: 24, marginBottom: 40 }}>
      {METHODOLOGY_PRINCIPLES.map(p => (
        <div key={p.title}>
          <h2 style={H2}>{p.title}</h2>
          <p style={P}>{p.body}</p>
        </div>
      ))}
    </div>

    <h2 style={H2}>A claim you can't trace back isn't evidence</h2>
    <p style={P}>
      Most reports stop at a severity label: critical, high, medium. That tells you how worried to be, but not why - and a client's own legal or engineering team can't check work they can't see the steps of. So every finding we deliver is required to answer five questions in order, not just the last one: what did we find, what proves it, how did we prove it, how sure are we, and what should you do about it.
    </p>
    <div style={{
      background: 'rgba(0,224,193,0.06)', border: '1px solid rgba(0,224,193,0.25)',
      borderRadius: 10, padding: '12px 16px', margin: '16px 0',
    }}>
      <p style={{ ...P, marginBottom: 0, fontSize: 'var(--fs-small)' }}>
        <strong style={{ color: '#00e0c1' }}>Real, disclosed finding.</strong> From "Merge Chicken" (com.Merge.o98Chickens), reported to Google Play &amp; Android Security 2026-06-25, removed from the Play Store 2026-06-30.{' '}
        <a href="/reports/merge-chicken-2026.pdf" target="_blank" rel="noopener" style={A} className="rfi-inline-link">Full report (PDF)</a>
      </p>
    </div>
    <div style={{ display: 'grid', gap: 20, marginTop: 20 }}>
      {EVIDENCE_COLUMNS.map(col => (
        <div key={col.label}>
          <h2 style={H2}>{col.label}</h2>
          <p style={P}>{col.body}</p>
        </div>
      ))}
    </div>
  </>
}

function MethodologyDE() {
  return <>
    <h1 style={H1}>Methodik</h1>
    <p style={{ ...P, fontSize: 'var(--fs-label)', color: 'var(--text2)' }}>Dieselben Regeln, unabhängig vom Kunden</p>
    <p style={P}>
      Ein Ermittler, der die Regeln für einen zahlenden Kunden beugt, ist kein Ermittler mehr - nur ein Dienstleister mit besserem Vokabular. Diese vier Prinzipien bestimmen, wohin wir schauen, wie wir prüfen, was wir mit unseren Funden machen und wann sie öffentlich werden, unabhängig davon, wer zahlt.
    </p>
    <div style={{ display: 'grid', gap: 24, marginTop: 24, marginBottom: 40 }}>
      {METHODOLOGY_PRINCIPLES_DE.map(p => (
        <div key={p.title}>
          <h2 style={H2}>{p.title}</h2>
          <p style={P}>{p.body}</p>
        </div>
      ))}
    </div>

    <h2 style={H2}>Eine Behauptung, die man nicht zurückverfolgen kann, ist keine Evidenz</h2>
    <p style={P}>
      Die meisten Berichte enden bei einem Schweregrad-Label: kritisch, hoch, mittel. Das sagt Ihnen, wie besorgt Sie sein sollten, aber nicht warum - und das eigene Rechts- oder Engineering-Team eines Kunden kann keine Arbeit prüfen, deren Schritte es nicht sehen kann. Deshalb muss jeder Fund, den wir liefern, fünf Fragen der Reihe nach beantworten, nicht nur die letzte: Was haben wir gefunden, was beweist es, wie haben wir es bewiesen, wie sicher sind wir, und was sollten Sie dagegen tun.
    </p>
    <div style={{
      background: 'rgba(0,224,193,0.06)', border: '1px solid rgba(0,224,193,0.25)',
      borderRadius: 10, padding: '12px 16px', margin: '16px 0',
    }}>
      <p style={{ ...P, marginBottom: 0, fontSize: 'var(--fs-small)' }}>
        <strong style={{ color: '#00e0c1' }}>Echter, offengelegter Fund.</strong> Aus „Merge Chicken" (com.Merge.o98Chickens), gemeldet an Google Play &amp; Android Security am 25.06.2026, aus dem Play Store entfernt am 30.06.2026.{' '}
        <a href="/reports/merge-chicken-2026.pdf" target="_blank" rel="noopener" style={A} className="rfi-inline-link">Vollständiger Bericht (PDF)</a>
      </p>
    </div>
    <div style={{ display: 'grid', gap: 20, marginTop: 20 }}>
      {EVIDENCE_COLUMNS_DE.map(col => (
        <div key={col.label}>
          <h2 style={H2}>{col.label}</h2>
          <p style={P}>{col.body}</p>
        </div>
      ))}
    </div>
  </>
}
