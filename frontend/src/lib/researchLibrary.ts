// Research library: the documents under the Research page's slideshow.
// One entry per PDF in public/research/<slug>.pdf. Each gets its own crawlable page
// /research/<slug>/ (prerender.mjs reads RESEARCH_DOCS), a share link and the same
// PDF modal feel as the Evidence reports.
// Text rules (rfi-web-deploy skill): both languages together, no dash, no "not X but Y",
// no company names in running text, title and subtitle say different things.

export type Locale = 'en' | 'de'
type L = Record<Locale, string>

export type ResearchDoc = {
  slug: string
  kind: 'report' | 'paper' | 'method'
  date: string // ISO, first publication or report end
  title: L
  blurb: L
  doi?: string // e.g. 10.17605/OSF.IO/UXCJE
  pages?: number
}

export const RESEARCH_DOCS: ResearchDoc[] = [
  {
    slug: 'wirkungsbericht-2025-26', kind: 'report', date: '2026-11-16', pages: 49,
    title: { en: 'Impact Report 2025/26', de: 'Wirkungsbericht 2025/26' },
    blurb: {
      en: 'The association\'s first year in 49 pages: a ternary language model with 331 million parameters, 292 specialised agents, six publications with DOI, 41 open repositories and 387+ public apps checked. Every figure carries its source.',
      de: 'Das erste Vereinsjahr auf 49 Seiten: ein ternäres Sprachmodell mit 331 Mio. Parametern, 292 spezialisierte Agenten, sechs Veröffentlichungen mit DOI, 41 offene Repositories und 387+ geprüfte öffentliche Apps. Jede Zahl nennt ihre Quelle.',
    },
  },
  {
    slug: 'ternary-ground-2026', kind: 'paper', date: '2026-07-19', doi: '10.17605/OSF.IO/UXCJE',
    title: {
      en: 'Human–AI Co-Evolution as Ternary Logic: Distinguishing Output, Emergent Signal, and Hallucination in Real Human–AI Systems',
      de: 'Human–AI Co-Evolution as Ternary Logic: Distinguishing Output, Emergent Signal, and Hallucination in Real Human–AI Systems',
    },
    blurb: {
      en: 'Expected output, a new pattern from real interaction and an invention without basis often look the same from outside. The paper describes how the Emergent Interaction Lab software keeps the three apart in code.',
      de: 'Erwartete Ausgabe, ein neues Muster aus echter Interaktion und eine Erfindung ohne Grundlage sehen von außen oft gleich aus. Das Paper beschreibt, wie die Software des Emergent Interaction Lab die drei im Code auseinanderhält.',
    },
  },
  {
    slug: 'call-laura-2026', kind: 'paper', date: '2026-07-12', doi: '10.17605/OSF.IO/QCVJB',
    title: {
      en: 'CALL LAURA: An Automatic Data-Processing Multi-Agent Framework (the "Agent SWAT Team" Methodology)',
      de: 'CALL LAURA: An Automatic Data-Processing Multi-Agent Framework (the "Agent SWAT Team" Methodology)',
    },
    blurb: {
      en: 'A document runs in parallel through a configurable team of deterministic review agents. Every finding quotes the exact text passage, names a severity and carries a provenance tag. Available as library, MCP server and hosted service.',
      de: 'Ein Dokument läuft parallel durch ein einstellbares Team deterministischer Prüfagenten. Jeder Befund zitiert die Textstelle, nennt eine Schwere und trägt einen Herkunftsvermerk. Verfügbar als Bibliothek, MCP-Server und gehosteter Dienst.',
    },
  },
  {
    slug: 'jarvis-2026', kind: 'paper', date: '2026-07-12', doi: '10.17605/OSF.IO/HC9ZB',
    title: {
      en: 'JARVIS: A Recursive, Self-Learning Human–AI Co-Evolution Agent Operating in Bidirectional Copilot Mode',
      de: 'JARVIS: A Recursive, Self-Learning Human–AI Co-Evolution Agent Operating in Bidirectional Copilot Mode',
    },
    blurb: {
      en: 'An agent that records how meaning, vocabulary and reasoning structure develop over many sessions, so adaptation becomes visible in both directions between human and AI.',
      de: 'Ein Agent, der festhält, wie sich Bedeutung, Wortschatz und Denkstruktur über viele Sitzungen entwickeln. So wird die Anpassung zwischen Mensch und KI in beiden Richtungen sichtbar.',
    },
  },
  {
    slug: 'ternary-intelligence-stack-2026', kind: 'paper', date: '2026-04-01', doi: '10.17605/OSF.IO/CYN28',
    title: {
      en: 'The Ternary Intelligence Stack: An End-to-End Balanced-Ternary Alternative to Binary AI Infrastructure',
      de: 'The Ternary Intelligence Stack: An End-to-End Balanced-Ternary Alternative to Binary AI Infrastructure',
    },
    blurb: {
      en: 'A toolchain on balanced ternary arithmetic where 0 means an active hold: programming language, 51-opcode instruction set, virtual machine, sparse ternary routines and an inference step that skips zero values.',
      de: 'Ein Werkzeugstapel auf balanciert ternärer Arithmetik, in dem die 0 ein aktives Halten bedeutet: Programmiersprache, Befehlssatz mit 51 Opcodes, virtuelle Maschine, ternäre Rechenroutinen und ein Inferenzschritt, der Nullwerte überspringt.',
    },
  },
  {
    slug: 'physical-ai-blueprint-2025', kind: 'paper', date: '2025-07-27', doi: '10.17605/OSF.IO/M3VG6',
    title: {
      en: 'Operational Blueprint for Physical AI Deployment: An Ethics-First Architecture for Robust and Reproducible Physical AI Agents in Open-World Environments',
      de: 'Operational Blueprint for Physical AI Deployment: An Ethics-First Architecture for Robust and Reproducible Physical AI Agents in Open-World Environments',
    },
    blurb: {
      en: 'An architecture for agents in the physical world with several sensor channels, an SQL-backed memory, a ternary decision algebra and a self-check loop. Two diagnostic metrics are introduced and backed by simulations.',
      de: 'Eine Architektur für Agenten in der physischen Welt mit mehreren Sinneskanälen, SQL-gestütztem Gedächtnis, ternärer Entscheidungsalgebra und einer Schleife zur Selbstprüfung. Zwei Diagnosemetriken werden eingeführt und durch Simulationen belegt.',
    },
  },
  {
    slug: 'pedalgate-2025', kind: 'paper', date: '2025-07-25', doi: '10.17605/OSF.IO/H5U8F',
    title: {
      en: 'PedalGate v1.0: Dispatch Disparity, Platform Gaslighting & the Collapse of Courier Trust in Austria\'s Gig Economy',
      de: 'PedalGate v1.0: Dispatch Disparity, Platform Gaslighting & the Collapse of Courier Trust in Austria\'s Gig Economy',
    },
    blurb: {
      en: 'A 101-day field study (15 April to 25 July 2025) of delivery platforms in Austria: how orders are dispatched, how the platforms communicate and how couriers are classified. Based on testimonies, observation and correspondence. Findings are the study\'s own statements.',
      de: 'Eine Feldstudie über 101 Tage (15. April bis 25. Juli 2025) zu Lieferplattformen in Österreich: wie Aufträge verteilt werden, wie die Plattformen kommunizieren und wie Fahrerinnen und Fahrer eingestuft werden. Grundlage sind Zeugenaussagen, Beobachtungen und Schriftwechsel. Die Befunde sind Aussagen der Studie.',
    },
  },
]

export const RESEARCH_DOC_SLUGS = RESEARCH_DOCS.map(d => d.slug)

export function getResearchDoc(slug: string | null | undefined): ResearchDoc | undefined {
  return slug ? RESEARCH_DOCS.find(d => d.slug === slug) : undefined
}

export const docPdfUrl = (d: ResearchDoc) => `/research/${d.slug}.pdf`
export const docPageUrl = (d: ResearchDoc) => `https://rfi-irfos.com/research/${d.slug}/`
export const docDoiUrl = (d: ResearchDoc) => (d.doi ? `https://doi.org/${d.doi}` : undefined)

export const LIBRARY_TEXT = {
  heading: { en: 'Read it yourself', de: 'Selbst nachlesen' },
  subheading: {
    en: 'Our impact report and six papers, each as a PDF with its own link.',
    de: 'Unser Wirkungsbericht und sechs Papers, jeweils als PDF mit eigenem Link.',
  },
  kind: {
    report: { en: 'Report', de: 'Bericht' },
    paper: { en: 'Paper', de: 'Paper' },
    method: { en: 'Method', de: 'Methodik' },
  },
  open: { en: 'Read the PDF', de: 'PDF lesen' },
  doi: { en: 'Cite via DOI', de: 'Per DOI zitieren' },
  prev: { en: 'Previous document', de: 'Vorheriges Dokument' },
  next: { en: 'Next document', de: 'Nächstes Dokument' },
  modalLabel: { en: 'RESEARCH DOCUMENT', de: 'FORSCHUNGSDOKUMENT' },
  iframeTitle: { en: 'Document viewer', de: 'Dokumentansicht' },
  mobileHint: {
    en: 'Your browser cannot show PDFs inline. Open the document in a new tab.',
    de: 'Dein Browser zeigt PDFs nicht direkt an. Öffne das Dokument in einem neuen Tab.',
  },
  mobileOpen: { en: 'Open PDF', de: 'PDF öffnen' },
  share: { en: 'Share document', de: 'Dokument teilen' },
  copyLink: { en: 'Copy link', de: 'Link kopieren' },
  copied: { en: 'Copied', de: 'Kopiert' },
  close: { en: 'Close', de: 'Schließen' },
} as const
