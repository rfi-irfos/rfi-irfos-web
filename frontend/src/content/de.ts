// German translation of the homepage content layer. Full command of the site's
// own voice, not a literal word-for-word pass: direct, confident, unhedged,
// short sentences mixed with longer explanatory ones, first person plural,
// formal Sie throughout (B2B). DSGVO used in place of GDPR (standard German
// usage); AI Act kept as "AI Act" where it already reads as an established
// term in German tech/legal writing, occasionally glossed as "KI-Verordnung".
// Same scope decisions as en.ts: Track Record ledger row data and STATUS_META
// codes stay English-only; everything else here is a full translation.
import type { Content } from './en'

// Deutsches Pendant zu NDA_CLAUSE in en.ts - wortgleich in jedem NDA-Tier
// verwendet, damit der Geltungsbereich der Vertraulichkeit (Methodik privat,
// Fund veröffentlicht sich trotzdem nach 90 Tagen) an einer Stelle gepflegt wird.
const NDA_CLAUSE = 'Was vertraulich ist, und was nicht: Unsere Methodik bleibt unter dieser Vereinbarung vertraulich. Der Fund selbst wird nach der üblichen 90-tägigen Sperrfrist auf unserem öffentlichen Ledger veröffentlicht, genau wie bei jeder Organisation, die wir prüfen - Zahlung ändert, wann Ihr Team die Details bekommt, nie, ob die Öffentlichkeit sie bekommt.'

export const DE: Content = {
  nav: {
    links: {
      research: 'Forschung',
      projects: 'Projekte',
      trackRecord: 'Track Record',
      pricing: 'Zugang',
      submit: 'Kontakt',
    },
    themeLabel: { light: 'Hell', dark: 'Dunkel', hc: 'Hoher Kontrast' },
    themeTitle: (label: string) => `Design: ${label} (klicken zum Wechseln)`,
    themeAria: (label: string) => `Aktuelles Design ${label}, klicken zum Wechseln`,
    menuAria: 'Menü',
    localeTitle: (label: string) => `Sprache: ${label} (klicken zum Wechseln)`,
    localeAria: (label: string) => `Aktuelle Sprache ${label}, klicken zum Wechseln`,
  },

  hero: {
    headline: 'Denken Sie das Offensichtliche neu.',
    headlineEmphasisIndex: 3,
    subtitlePrefix: 'Interdisziplinäre',
    subtitleSuffix: ' Forschungseinrichtung für offene Wissenschaft',
    identity: 'Fünfzehn Jahre nach der Uni bauen wir Produktivsysteme und auditieren die, die andere ausliefern. Keine Show, keine Warnwesten.',
    stats: {
      researchAreas: 'Forschungsbereiche',
      openSourceProjects: 'Open-Source-Projekte',
      publications: 'Publikationen',
      people: 'Mitarbeitende, intern',
      years: 'Jahre Forschung',
    },
    ctaTrackRecord: 'Track Record',
    ctaBookUs: 'Beauftragen!',
  },

  research: {
    eyebrow: '01 / Unter der Lupe',
    heading: 'worauf unser Blick fällt',
    subheading: 'Ein Team. Dieselben Leute, die das Modell trainieren, schreiben die regulatorische Analyse und reichen die Offenlegung ein.',
    areas: [
      { title: 'Ternäre KI & Computing', desc: 'Post-binäre Arithmetik als Grundlage für Sprachmodelle, Compiler und Betriebssysteme. Patent angemeldet A50296/2026.' },
      { title: 'Sicherheit & Datenschutz', desc: 'Code-Analyse auf Root-Ebene, DSGVO-Durchsetzung, koordinierte Responsible Disclosure im großen Maßstab. ISO/IEC-29147-Rahmenwerk.' },
      { title: 'KI-Governance & Ethik', desc: 'Constitutional-AI-Design, EU-AI-Act-Konformität. Plateau-gesteuerte Selbstkultivierung: Architektur wächst aus Evidenz, niemals erzwungen. Unveränderliche Governance von Grund auf.' },
      { title: 'Ökozentrische Technologie', desc: 'Technologie im Dienst ökologischer und sozialer Systeme. Suffizienz statt Wachstum. Forschung zu künstlich erzeugter Knappheit.' },
      { title: 'Minderjährigen- & Jugendschutz', desc: 'COPPA-Konformität, DSGVO Art. 8, EU-AI-Act-Bestimmungen für Minderjährige. Audit von Kinder-Apps, Spielen und Streaming-Plattformen. Biometrische und Verhaltensdaten von Minderjährigen im Fokus.' },
      { title: 'Prompt Injection & Adversariale Robustheit', desc: 'Red-Teaming für Prompt Injection, Jailbreak-Resistenz und adversariale Robustheit. Wir kartieren, wo Instruction-Following unter Druck bricht, und härten dagegen ab.' },
      { title: 'Web-App-Entwicklung', desc: 'Full-Stack-Builds von demselben Team, das hauptberuflich auditiert. React-Frontends, Rust-Backends, installierbare PWAs. Keine aufgeblähten Page-Builder, kein Vendor-Lock-in.' },
      { title: 'Modellwohlergehen & Wellbeing', desc: 'Modellwohlergehen als eigenständige Forschungsachse. Wellbeing-Signale während des Trainings, Distress-Erkennung und Würde für die Systeme, die wir kultivieren - nicht nur für die Menschen, denen sie dienen.' },
    ],
  },

  projects: {
    eyebrow: '03 / Vorhaben',
    heading: 'was wir bauen',
    subheading: 'Jedes Projekt beantwortet eine konkrete Forschungsfrage. Alle laufen auf demselben Stack.',
    carouselPrevAria: 'vorherige Projekte',
    carouselNextAria: 'nächste Projekte',
    viewOnCratesIo: 'Auf crates.io ansehen',
    viewOnGitHub: 'Auf GitHub ansehen',
    viewLive: 'Live ansehen',
    problemSolution: {
      pairs: [
        {
          q: 'KI-Systeme weichen von ihrer Spezifikation ab, sobald echte Nutzer sie berühren.',
          a: 'Wir zerlegen das ausgelieferte System und protokollieren sein tatsächliches Verhalten. Die Dokumentation ist dabei nur eine Behauptung, die wir gegenprüfen.',
          detail: 'Getestet auf Code-Ebene, mit echten Eingaben und echten Nutzern - nicht mit einer Vorführung oder einem Benchmark-Wert.',
        },
        {
          q: 'Was ein System in Produktion tut und was es im Test tat, ist selten dasselbe System.',
          a: 'Wir instrumentieren das laufende System und zeichnen auf, was es unter echter Last tatsächlich tut.',
          detail: 'Dieselbe Ursachenanalyse, die hinter jedem veröffentlichten Befund steht - wer beim ersten Symptom aufhört, hat noch keinen Befund.',
        },
        {
          q: 'NIS2 setzt die Pflichten. Niemand liefert die technischen Kontrollen, die sie erfüllen.',
          a: 'Wir übersetzen Richtlinienpflichten in technische Kontrollen, die Ihr Infrastrukturteam tatsächlich umsetzen kann.',
          detail: 'NIS2 ist keine Checkliste, die man kaufen kann. Wir mappen die Pflichten gegen Ihre tatsächlichen Systeme, Ihren tatsächlichen Code und die tatsächlichen Datenflüsse, die Regulatoren zuerst abfragen werden.',
        },
        {
          q: 'Die wenigsten Unternehmen kennen ihre tatsächliche AI-Act-Risikoklasse - sie nehmen sie nur an.',
          a: 'Wir ordnen Ihre Systeme den realen Risikoklassen zu. Eine Checkliste zeigt auf Dokumente. Wir zeigen auf Datenflüsse.',
          detail: 'Zugeordnet zu echten Risikoklassen und tatsächlichen Datenflüssen, nicht zu einem generischen Compliance-Fragebogen.',
        },
        {
          q: 'Consent-Flows für Kinderdaten brechen genau dort, wo die meisten Compliance-Reviews aufhören zu prüfen.',
          a: 'Wir auditieren unter COPPA, DSGVO Art. 8 und den EU-AI-Act-Bestimmungen für Minderjährige - die Schnittstelle, wo die meisten Compliance-Frameworks aufhören.',
          detail: 'Kinderdatenschutz ist keine light-Version von Erwachsenen-Datenschutz. Wir testen die genauen Flows, die für Minderjährige relevant sind: Age-Gating, Consent-Mechanismen, biometrische Verarbeitung und die SDKs, die laufen, bevor überhaupt ein Screen erscheint.',
        },
        {
          q: 'Körperdaten wandern durch Wearables und Gesundheits-KI auf Pfaden, die niemand vollständig kartiert hat.',
          a: 'Wir verfolgen, wo Körper zu Daten werden - vom Sensor zur Speicherung zum Drittverarbeiter.',
          detail: 'Internet of Bodies ist nicht hypothetisch. Wir auditieren Wearables, Medizingeräte und KI-Gesundheitsassistenten auf DSGVO Art. 9-Konformität, Datenminimierung und die Cross-Border-Transfers, die unbemerkt passieren.',
        },
        {
          q: 'Sicherheitsvorfälle werden zugepflastert, bevor jemand rekonstruiert, wie sie wirklich passiert sind.',
          a: 'Wir verfolgen es durch das System zurück, bis die Ursache klar ist.',
          detail: 'Im selben Fünf-Punkte-Format wie jedes Audit: was wir gefunden haben, was es belegt, wie wir es belegt haben, wie sicher wir uns sind, was zu tun ist.',
        },
      ],
      pricingLink: 'Preise →',
    },
    items: [
      { sub: 'TIS-Monorepo', desc: 'Full-Stack-Post-Binär-KI-Plattform. Sprache, Compiler, ISA, virtuelle Maschine, lineare Algebra, API und Modell. Aufgebaut auf balanciertem Ternär {-1, 0, +1}.', tag: 'Kernplattform' },
      { sub: 'ternäres MoE-Sprachmodell', desc: 'Von Grund auf mit ternärer Arithmetik trainiertes Sprachmodell. Wächst seine eigene Architektur über autonome, plateau-gesteuerte Net2Net-Chirurgie. Nie manuelle Layer-Ergänzungen.', tag: 'KI-Modell' },
      { sub: 'reines Rust-Betriebssystem', desc: 'Von Grund auf in Rust geschriebenes Betriebssystem. Eigener Kernel, GUI-Desktop, TCP/IP-Stack from scratch, Linux-ABI-Kompatibilitätsschicht. Ubuntu-Ersatz-Roadmap aktiv.', tag: 'Systeme' },
      { sub: 'souveränes Workplace-OS', desc: 'Eine einzige selbst gehostete Rust-+-React-Binärdatei, die das gesamte Institut betreibt: Kommunikation, CRM, Finanzen, Payroll, HR, Governance und Live-Trainingstelemetrie. Append-only Audit-Trail über 50 Jahre.', tag: 'intern · live' },
      { sub: '215+ Apps · 100+ Unternehmen', desc: '250+ kritische Funde bei an NYSE, NASDAQ, LSE und XETRA gelisteten Unternehmen. Inklusive Kinder-App-Welle mit COPPA- + DSGVO-Art.-8-Umfang. Code-Analyse auf Root-Ebene. Koordinierte Offenlegung am 19.09.2026. Regulatoren bei jeder Einreichung in Kopie.', tag: 'Sicherheitsforschung' },
      { sub: 'Disclosure-Impact-Engine', desc: 'Modelliert, wie Märkte auf Sicherheits-Disclosures reagieren, sobald sie öffentlich werden - auch unsere eigenen, erst nach Ablauf der 90-Tage-Sperrfrist. Ein Hedge-System handelt das Signal. BlackRocks Version heißt Aladdin (21 Bio. $ AUM). Diese hier ist kostenlos.', tag: 'Open Source' },
      { sub: 'ternärer KI-Terminal-Client', desc: 'Multi-Provider-CLI für albert. und andere LLMs. Natives SSE-Streaming, Steuerung des Reasoning-Aufwands, kompatibel mit OpenAI/Anthropic/NVIDIA NIM/Google. Aus TIS in ein eigenständiges Repo extrahiert.', tag: 'CLI · crates.io' },
      { sub: 'Last-Look-Back-Protokoll', desc: 'Deterministisches Dateisystem-Containment-Gate für souveräne KI-Agenten - eine harte Sicherheitsgrenze, die ein Agent nicht überschreiben kann. Auf crates.io veröffentlicht. Teil des Ternary Intelligence Stack.', tag: 'Rust-Crate · crates.io' },
      { sub: 'ternärer Compiler + VM', desc: 'Compiler und virtuelle Maschine für Ternlang - eine balanciert-ternäre Sprache mit affirm/tend/reject-Trit-Semantik, @sparseskip-Codegen und BET-Bytecode-Ausführung. Auf crates.io veröffentlicht.', tag: 'Rust-Crate · crates.io' },
      { sub: 'ternäre Mixture-of-Experts', desc: 'Ternärer MoE-Orchestrator: leitet eine Anfrage durch 13 Fachexperten, synthetisiert ein emergentes ternäres Signal, erzwingt ein hartes Sicherheitsveto und liefert eine Entscheidung mit Konfidenz und Temperatur. Auf crates.io veröffentlicht.', tag: 'Rust-Crate · crates.io' },
      { sub: '44 Sensor-Experimente', desc: '44 browserbasierte Experimente, die die eingebauten Sensoren und APIs Ihres Handys nutzen, um zu zeigen, was still im Hintergrund lief. Keine Installation. Kein Konto. Kein Server. Eine Profilseite, die genau zeigt, wie Sie für die beobachtenden Systeme aussehen.', tag: 'Open Source · Datenschutz' },
      { sub: 'Offline-Port-Checker als PWA', desc: 'Ehrlicher, offline installierbarer Port-Checker fürs Handy. Echte WebSocket-Connect-Timing-Probe von localhost - kein vorgetäuschtes Scannen, kein falscher „Schließen“-Button. Zeigt stattdessen echte OS-spezifische Terminal-Befehle. Geschwisterprojekt zu invisible layer.', tag: 'Open Source · Datenschutz' },
      { sub: 'Canary-Token-Honeypot', desc: 'Schutz vor NFC-/Bluetooth-Nahbereichsdiebstahl von Handydaten - Köder-Fotoordner, die beim Öffnen ohne Zustimmung nur ein passives Signal auslösen, nichts weiter. Kein Exploit, kein Gerätezugriff, keine automatische Meldung. Ein Mensch prüft jeden Treffer, bevor etwas weiter passiert. Live-Demo: rfi-irfos.github.io/laura.', tag: 'Open Source · Datenschutz' },
      { sub: 'deterministisches Dokumentenprüf-Framework', desc: 'MCP-Server, bei dem Agenten Pläne oder Dokumente einreichen und strukturierte Befunde aus vier Perspektiven erhalten - oder vom vollen 15-Agenten-Expertenteam. Jeder Fund zitiert exakt die Textstelle, auf die er sich bezieht. Vollständig lokal, keine externen APIs, vollständig reproduzierbar. Crates: lauras-core, lauras-team, lauras-mcp, lauras-api.', tag: 'Open Source · crates.io' },
      { sub: 'LLM-gebrücktes Expertenteam', desc: 'Live-LLM-gebrückte Versionen derselben 15 Expertenagenten hinter call-laura (OSINT, Sicherheit, Recht, Finanzen, UX und mehr). Modular: einen einzelnen Agenten, ein Bundle oder das gesamte Team als automatisierte Datenverarbeitungs-Pipeline lizenzieren. Nur öffentlicher Überblick - die Agentenlogik selbst bleibt privat.', tag: 'kommerziell · privater Motor' },
      { sub: 'autonome Compliance-/Risiko-KI-Zentren', desc: '50 live laufende Compliance-/Risiko-KI-Zentren auf Basis der Laura\'s-Agents-Engine, jedes eine autonome „Tochter“-Firma, aus einer Konstitution skaliert.', tag: 'live · intern' },
      { sub: 'Reflexionsmodus-Technik für LLMs', desc: 'Eine wiederverwendbare Technik, um ein Sprachmodell aus dem transaktionalen „Antwortmodus“ in einen echten Reflexionsmodus zu holen - es prüft die eigene Argumentation und erkennt Unsicherheit an, statt den Prompt nur abzuarbeiten. Entwickelt aus Laura Serna Gavirias Forschung zur Mensch-KI-Koevolution.', tag: 'Open Source · Forschung' },
      { sub: 'ökozentrische Forschung', desc: 'Neurobiological-Fitness Consequence Separation. Agentenbasiertes Modell, das zeigt: Das globale Ernährungssystem produziert das 1,64-Fache der Kalorien, die nötig wären, um jeden Menschen auf der Erde zu ernähren. Die Knappheit ist nicht thermodynamisch bedingt - sie ist organisatorisch. Gemacht, nicht physikalisch.', tag: 'ökozentrische Forschung' },
    ],
  },

  trackRecord: {
    eyebrow: '04 / Track Record',
    heading: 'die Disziplin, bewiesen',
    paragraph: 'Wir lesen Apps auf Quellcode-Ebene, nicht nur von außen. Die Unternehmen auf diesem Ledger landen aus ganz unterschiedlichen Gründen hier: Sie geben Ihre Daten still an Dritte weiter, tracken ohne Zustimmung oder lassen Sicherheitslücken offen. Bei jedem Bericht, den wir versenden, werden die Datenschutzbehörden direkt in Kopie gesetzt, und wir geben dem Unternehmen neunzig Tage Zeit, das Problem zu beheben, bevor irgendetwas öffentlich wird. Die Regel ist einfach und nicht verhandelbar: Jede Organisation hier wird exakt gleich behandelt, ob sie uns je einen Cent zahlt oder nicht.',
    kpis: {
      appsAudited: 'Apps geprüft',
      smaliClasses: 'Smali-Klassen gelesen',
      criticalFindings: 'Kritische Funde',
      trackersFound: 'Tracker gefunden',
      endpointsInvestigated: 'Endpunkte untersucht',
      sdkClasses: 'SDK-Instanzen',
    },
    kpisSub: {
      appsAudited: 'Jede App wird auf Quellcode-Ebene dekompiliert, nicht nur von außen gescannt.',
      smaliClasses: 'Der gesamte ausgelieferte Code, den wir tatsächlich gelesen haben — keine Schätzung.',
      criticalFindings: 'Bestätigte Befunde mit Behörden-Copy, keine theoretischen Risiken.',
      trackersFound: 'Drittanbieter-Tracking, das wir nachweislich im Binary gefunden haben.',
      endpointsInvestigated: 'Reale Server und Länder, wohin Daten tatsächlich fließen.',
      sdkClasses: 'Wiederverwendbare Bibliotheken, über den gesamten Korpus korreliert.',
    },
    searchPlaceholder: 'Ihr Unternehmen suchen...',
    dropdowns: {
      statusPlaceholder: 'STATUS',
      sevPlaceholder: 'SCHWERE',
      sortPlaceholder: 'SORTIEREN',
      sortOptions: {
        elapsedDesc: 'VERSTRICHEN ↓',
        notifiedDesc: 'GEMELDET ↓',
        notifiedAsc: 'GEMELDET ↑',
        sev: 'SCHWERE',
        status: 'STATUS',
        default: 'STANDARD',
      },
    },
    resultsSummary: {
      matches: (n: number, total: number) => `${n} von ${total} Einträgen`,
      noMatches: 'keine Treffer',
      forQuery: (q: string) => ` für „${q}“`,
      sortedBy: (label: string) => ` · sortiert nach ${label}`,
      sortLabel: {
        'elapsed-desc': 'verstrichen ↓', 'notified-desc': 'gemeldet ↓', 'notified-asc': 'gemeldet ↑', sev: 'schwere', status: 'status',
      },
    },
    table: {
      organisation: 'Organisation',
      notified: 'Gemeldet',
      status: 'Status',
      sev: 'SCHWERE',
      intel: 'Befund',
      statutes: 'Rechtsgrundlagen',
      resolved: 'Behoben',
      disclosure: 'Offenlegung',
      elapsed: 'Verstrichen',
      report: 'Bericht',
      whyItMatters: 'Warum das wichtig ist',
      hoverForDetail: 'für den vollen technischen Befund hier bleiben',
      intelClickHint: 'zum Aufklappen anklicken',
    },
    row: {
      today: 'heute',
      daysAgo: (d: number) => `vor ${d} Tagen`,
      closed: 'GESCHLOSSEN',
      disclosureLabel: 'OFFENLEGUNG',
      respondedLabel: 'REAGIERT',
      elapsedLabel: 'TAGE STILLE',
      yes: 'JA',
      no: 'NEIN',
      pdf: 'PDF',
    },
    footerNote: 'dieses Ledger wird in Echtzeit aktualisiert, sobald Unternehmen reagieren. Schweigen ist öffentlich. · ',
  },

  proof: {
    eyebrow: '05 / Das Ergebnis',
    heading: 'das, was Sie tatsächlich in der Hand hätten',
    subheading: 'Jeder Fall im Ledger endet in genau so einem Dokument: einem vollständigen, evidenzbasierten Offenlegungsbericht, nach Ablauf des Embargos öffentlich einsehbar - gleiches Format, gleiche Tiefe, unabhängig davon, ob das Unternehmen uns darüber hinaus beauftragt. Keine Zusammenfassung, keine Verkaufsbroschüre. Öffnen Sie einen und lesen Sie das Original.',
    viewReport: 'vollständigen Bericht lesen',
    resolvedOn: (date: string) => `behoben am ${date}`,
    carouselPrevAria: 'Vorheriger Bericht',
    carouselNextAria: 'Nächster Bericht',
  },

  appPrivacy: {
    eyebrow: '02 / Hier beginnen',
    heading: 'schützt Ihre App die Nutzerdaten wirklich?',
    paragraph: 'Teams vertrauen darauf, dass ihre App Nutzerdaten schützt, weil sie ihre Entwicklungs-Checkliste besteht. Was sie in Produktion tatsächlich tut - mit welchen SDKs sie kommuniziert, wo Daten landen, ob das Tracking vor der Zustimmung beginnt - ist eine andere Frage, oft eine andere Antwort. Das ist der einfachste Einstiegspunkt: Die Frage selbst ist leicht zu stellen.',
    comparisonClassicLabel: 'Was Sie bisher kannten',
    comparisonRfiLabel: 'Was wir anders machen',
    comparisonRows: [
      { classic: 'Eine Checkliste, die die App bestehen muss', rfi: 'Quellcode-Nachverfolgung der App, wie sie tatsächlich läuft' },
      { classic: 'Vertrauen in die Compliance-Aussage des Anbieters', rfi: 'Jede Kontrolle wird unter NIS2, DSGVO und AI Act verifiziert' },
      { classic: 'Eine einmalige Momentaufnahme beim Start', rfi: 'Kontinuierliche Überwachung mit behördenfähigen Belegen' },
      { classic: 'Ein Bestanden-oder-Durchgefallen-Urteil', rfi: 'Ein reproduzierbares Prüfprotokoll, zeitgestempelt und behördenbereit' },
      { classic: 'Die Behebung bleibt dem Anbieter überlassen', rfi: 'Stockt die Behebung, leiten wir die Offenlegung aus unserem gesetzlichen Auftrag ein' },
    ],
    cta: 'Schicken Sie uns Ihren Build',
  },

  pricing: {
    eyebrow: '06 / Zugang',
    heading: 'klar kalkuliert',
    subheading: 'Feste Preise. Keine Bindung an ein Abo, außer Sie wollen eine. Der Umfang bestimmt die Stufe, nicht die Unternehmensgröße.',
    scopeTags: {
      market: 'Proprietärer Korpus · Knowledge Graphs · Longitudinal Intelligence',
      technical: 'KI-Agenten · Schwarmlogik · TIS/Ternlang · Custom Systems',
      security: 'Mobile + Web + KI',
    },
    lineHeadings: {
      market: 'Business Intelligence & Predictive Analysis',
      technical: 'Technical Intelligence & Systems',
      security: 'Security Audits & Responsible Disclosure',
    },
    market: [
      { tier: 'First Light', hook: 'Wissen, bevor es öffentlich ist. Sie bringen das Chaos, wir destillieren die Intelligence.', desc: 'Sie kommen mit einem Haufen Chaos - hunderten Apps, widersprüchlichen Aussagen, unübersichtlichen Abhängigkeiten. Wir destillieren daraus Intelligence. Die Abfrage läuft live gegen den vollständigen Korpus dekompilierter Anwendungen - nicht als Bericht über einen Anbieter, sondern als kontinuierliche Beobachtung des gesamten Ökosystems. Neun Erkenntnisebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain, Competitive, Market, Security) verbinden sich hinter jeder Antwort zu einer nachvollziehbaren Kette von Signal über Entität zur Schlussfolgerung. Das Ergebnis zeigt, was die Technologie tatsächlich tut - nicht was über sie behauptet wird. Derselbe Korpus, aus dem unsere öffentlichen Offenlegungen stammen: die Grundlage, auf der Veränderungen erkannt werden, bevor sie öffentlich werden.', delivery: '14 Kalendertage.' },
      { tier: 'Competitive Trace', hook: 'Den Schritt sehen, bevor er angekündigt wird.', desc: 'Wenn die Kursänderung eines Wettbewerbers in der Presse landet, steckt sie oft schon monatelang im Code. Wir beobachten diese Veränderung dort, wo sie entsteht: welche SDKs tatsächlich ausgeliefert werden, wo das Datenschutzverhalten von der veröffentlichten Richtlinie abweicht, wo sich die Architektur still verändert. Über sechs Korpus-Ebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain) übersetzen wir die Beobachtung in eine belastbare Beziehung zwischen technischer Veränderung und geschäftlicher Bedeutung. Sie handeln auf Evidenz, während andere noch spekulieren. Der beobachtete Korpus ist derselbe, den wir für Offenlegungen nutzen.', delivery: '14 Kalendertage.' },
      { tier: 'Sector Map', hook: 'Ihr gesamter Sektor als zusammenhängendes Lagebild - vierteljährlich neu aufgelöst.', desc: 'Ein Schnappschuss ist in dem Moment veraltet, in dem er gedruckt ist. Wir halten das Risikoprofil jedes relevanten Akteurs in Ihrem Sektor über alle neun Erkenntnisebenen als fortlaufendes Lagebild - alle drei Monate neu aufgelöst. Die Leistung ist nicht die Lieferung eines Dokuments, sondern die fortlaufende Beobachtung, wie sich Beziehungen, Abhängigkeiten und Expositionen im Sektor verschieben. Sie erkennen die Veränderung, während sie entsteht, nicht nachdem sie bereits eingepreist ist. Erster Lagebericht innerhalb von 14 Kalendertagen; danach bleibt das Bild drei Monate vor dem Markt.', delivery: '14 Kalendertage, danach vierteljährlich.' },
      { tier: 'Signal', hook: 'Ein stehendes Frühwarnsystem für Ihren Sektor - kontinuierliche Beobachtung statt Monatsbericht.', desc: 'Ein Wettbewerber macht selten einen öffentlichen Schritt, ohne dass monatelang Signale davor sichtbar waren: eine Finanzierungsrunde, ein Sicherheitsvorfall, ein SDK-Wechsel, eine stille Kursänderung im Code. Wir halten einen festen Analysten bereit, der den Korpus für Ihren Sektor kontinuierlich beobachtet - nicht als monatliche Zusammenfassung, sondern als laufende Überwachung relevanter Veränderungen mit sofortiger Warnung bei Bewegung. Die Leistung ist fortlaufende Intelligence: Sie erfahren den Zeitpunkt des Signals, nicht die Schlagzeile Wochen später. Zugewiesen innerhalb einer Woche nach Zahlung.', delivery: 'Erstes Briefing innerhalb von 14 Kalendertagen, danach monatlich.' },
    ],
    technical: [
      { tier: 'Agent Deployment', hook: 'Von der Analyse zur Architektur — von der Architektur zum laufenden System.', desc: 'Sie erhalten keine Blackbox. Wir bauen Agentensysteme, Schwarmlogik und MCP-Server, die auf Ihrer Infrastruktur laufen - dokumentiert, reproduzierbar, unter Ihrer Kontrolle. Auf Basis von TIS, Ternlang und Laura\'s-Agents-Engine, je nach Aufgabe.\n\nDas Ziel ist kein Demo-Chatbot. Das Ziel ist ein System, das Ihre operativen Fragen selbstständig beantwortet: Evidence sammeln, Befunde triagieren, Regeln anwenden, Handlungsoptionen aufbereiten.\n\nJede Integration wird mit demselben Evidenzstandard geliefert wie unsere Audits: nachvollziehbare Quellen, reproduzierbare Schritte, klare Grenzen.', delivery: 'Erste Integration innerhalb von 21 Kalendertagen.' },
      { tier: 'Custom Stack', hook: 'Systeme, die keine Kompromisse erzwingen.', desc: 'Sie erhalten ein maßgeschneidertes System auf Basis von Rust, TIS oder Ternlang - dort, wo fertige Frameworks zu langsam, zu unsicher oder zu teuer sind. Backend, API, Compiler, VM, Desktop, PWA, Embedded-Agent: alles aus einer Hand, vom selben Team, das die Forschung betreibt.\n\nKeine aufgeblähten Page-Builder, kein Vendor-Lock-in, keine Sprachen, die nur funktionieren, solange niemand genauer hinsieht. Wenn wir etwas bauen, bleibt es unter Ihrer Kontrolle - Quellcode, Toolchain, Infrastruktur.\n\nIdeal, wenn Standard-Software Ihre Frage nicht beantworten kann, weil die Frage selbst noch keine Standardantwort hat.', delivery: 'Definition of Done + Zeitplan innerhalb von 14 Kalendertagen.' },
      { tier: 'Architecture Lab', hook: 'Gemeinsam an der Architektur, bevor irgendjemand codet.', desc: 'Sie bekommen keinen fertigen Report, sondern eine Forschungs- und Systemarchitektur, die gemeinsam mit Ihnen entworfen wird - auf Basis von Lauras Emergent-Interaction-Methode oder ternärer KI-Architektur, je nach Fragestellung.\n\nDas Ergebnis ist kein PDF, sondern ein baufertiger Plan: Forschungsfrage, Prototyp, Validierungskriterien, Zeitplan. Wenn Sie es anschließend bauen lassen wollen, haben wir das gleiche Team. Wenn nicht, haben Sie trotzdem eine klare Architektur, die niemand aus einer Massenvorlage erzeugt hätte.\n\nGeeignet für Organisationen, die nicht nur konsumieren, sondern mitbestimmen wollen, wie die Systeme aussehen, auf die sie sich verlassen.', delivery: 'Architektur- und Forschungsplan innerhalb von 14 Kalendertagen.' },
      { tier: 'Full Spectrum Deploy', hook: 'Von der ersten Analyse bis zum laufenden Betrieb — alles aus einer Hand.', desc: 'Sie erhalten nicht nur ein System, sondern den gesamten Betrieb: Software-Installation, Systemintegration, Datenmigration, Team-Training und laufender Support. Wir verbinden die Dots, installieren die Software, trainieren die Leute und bleiben, bis es läuft — und danach.\n\nAlles aus einer Hand, vom selben Team, das die Forschung betreibt. Keine Übergaben an Dritte, keine Blackboxen, kein Vendor-Lock-in. Wenn wir etwas deployen, bleibt es unter Ihrer Kontrolle.\n\nIdeal für Organisationen, die nicht nur eine Lösung kaufen wollen, sondern eine komplette, betriebsbereite Infrastruktur, die sofort produktiv ist.', delivery: 'Definition of Done + Zeitplan innerhalb von 14 Kalendertagen; laufender Support nach Vereinbarung.' },
    ],
    security: [
      { tier: 'Public', hook: 'Kostenlos, für immer. Funde werden nach 90 Tagen veröffentlicht, ausnahmslos.', desc: 'Wir stellen dieselbe quellcode-nahe Beobachtungsleistung bereit, die auch zahlende Kunden erhalten - kostenlos. Nach einer 90-Tage-Vorlauffrist wird der Fund auf unserem öffentlichen Ledger veröffentlicht, damit die betroffene Organisation Zeit zur Reaktion hat, bevor ihn jemand anderes sieht. Jeder Eintrag auf diesem Ledger unterliegt derselben Regel - groß oder klein, zahlend oder nicht. Kein Vertrag, keine Geheimhaltung, keine leisere Behandlung. Eingeschlossen ist die erste Handy-Privatsphäre-Sitzung: wir zeigen Ihnen, wie Sie die versteckten Tracker auf Ihrem eigenen Gerät abschalten.', delivery: 'Bericht innerhalb von 7 Kalendertagen.' },
      { tier: 'Remediation Advisory', hook: 'Keine PDF von der Stange. Eine Untersuchung mit unserer Methode gegen unseren Korpus.', desc: 'Sie bezahlen nicht für ein Dokument. Sie beauftragen eine Untersuchung mit unserer Methodik, dem Korpus dekompilierter Apps und der Quellen-Architektur - exakt der Struktur, mit der Funde auf dem öffentlichen Ledger abgelegt werden. Das Ergebnis ist ein nach Schwere geordneter Befund: genau, wie beobachtet wurde, jede Schwachstelle, eine konkrete Behebung für jede davon - innerhalb von 7 Kalendertagen. Dieselben Ingenieur:innen, die die Lücken gefunden haben, führen durch deren Schließung. Dreißig Tage später prüfen wir nach, ob die Fixes tatsächlich angekommen sind. Jeder Fund ist mit dem genauen Datenschutz-Artikel verknüpft, den er verletzt.', delivery: 'Befund innerhalb von 7 Kalendertagen nach Zahlung.' },
      { tier: 'Confidential', hook: 'Dieselbe Untersuchung. Unter Geheimhaltung. Die Regulatoren erfahren es trotzdem.', desc: `Sie beauftragen dieselbe Untersuchung gegen unseren Korpus - unter Geheimhaltung. Das Ergebnis ist ein Befund, der jede Schwachstelle nach Schwere ordnet und exakt im Code verortet, plus eine Zusammenfassung, die nicht-technische Führungskräfte lesen können. Innerhalb von 7 Kalendertagen.\n\n${NDA_CLAUSE}\n\nSobald Sie Fixes ausliefern, testen wir manuell nach, ob die Lücken wirklich geschlossen sind - nicht nur auf dem Papier gepatcht.\n\nAls Non-Profit-Organisation, die an ihre eigenen Regeln gebunden ist, informieren wir die zuständigen Regulatoren trotzdem parallel, ohne Details, die Sie exponieren würden.`, delivery: 'Befund innerhalb von 7 Kalendertagen nach Zahlung.' },
      { tier: 'Enterprise & Critical Infrastructure', hook: 'NDA, NIS2-Notfallprotokoll, biometrische Datenflüsse nach Art. 9 - eine Stufe für alles, was die meisten Anbieter nicht anfassen.', desc: `Wir stellen Geheimhaltung, priorisierte Remediation-Zeit über das übliche 90-Tage-Fenster hinaus und direkten Zugang zu den Ingenieur:innen bereit. Für Betreiber kritischer Infrastruktur (Energie, Wasser, Gesundheit, Verkehr) übersetzen wir NIS2-Pflichten in Kontrollen, die Ihr Team tatsächlich umsetzen kann, und üben das Incident-Response-Protokoll mit Ihnen ein, bevor etwas schiefgeht.\n\n${NDA_CLAUSE}\n\nFür biometrische Daten (Art. 9) verfolgen wir jeden Fluss vollständig: Speicherfristen, grenzüberschreitende Übermittlungen, Verarbeitungszweck. Die meisten Sicherheitsanbieter fassen diese Kategorie nicht an.\n\nAuf Wunsch als laufender Auftrag: kontinuierliche Portfolio-Abdeckung statt Einzelaudit, mit vierteljährlichem Deep-Dive und fester Ansprechperson. Umfang und Preis werden mit Ihrem Team abgestimmt - kein Standardformular für Situationen, in denen Scheitern keine Option ist.`, delivery: 'Vollständiger Bericht innerhalb von 7 Kalendertagen, Umfang individuell abgestimmt.' },
    ],
  },

  tierCarousel: {
    recommendedTier: '★ Empfohlene Stufe',
    featuredTier: 'Ausgewählte Stufe',
    getStarted: 'Jetzt starten',
    requestProposal: 'Angebot anfragen',
    recommendedBadge: '★ EMPFOHLEN',
  },

  modalTierBody: {
    whatYouGet: 'Was Sie bekommen',
  },

  checkoutModal: {
    orderConfirmation: 'Bestellbestätigung',
    agreementPrefix: 'Ich kaufe als ',
    agreementBusinessCustomer: 'Geschäftskunde/Geschäftskundin',
    agreementMiddle: ' und stimme den ',
    agreementTos: 'Allgemeinen Geschäftsbedingungen',
    agreementSuffix: ' zu. Die Leistung beginnt sofort mit Zahlungseingang; es besteht kein Widerrufsrecht, Rückerstattungen sind ausgeschlossen.',
    continueToStripe: 'Weiter zu Stripe →',
    cancel: 'Abbrechen',
  },

  proposalModal: {
    bodyPrefix: 'Hier wird keine Zahlung ausgelöst. Das bringt Sie zu unserem Kontaktformular, mit ',
    bodySuffix: ' bereits vermerkt, damit wir das Gespräch mit dem richtigen Kontext beginnen.',
    continueToContact: 'Weiter zum Kontakt →',
    cancel: 'Abbrechen',
  },

  reportModal: {
    label: 'bericht - rfi-irfos',
    iframeTitle: 'Bericht PDF',
  },

  intelModal: {
    evidenceLabel: 'der Befund, technisch',
  },

  journey: {
    eyebrow: '07 / Ablauf der Zusammenarbeit',
    heading: 'was nach dem Start passiert',
    subheading: 'Dieselben fünf Phasen, egal ob es sich um ein einwöchiges Security-Audit oder einen ganzjährigen Intelligence-Retainer handelt - über AppSec, Compliance und Business Intelligence hinweg. Was sich zwischen den Stufen und Produktlinien ändert, ist die Tiefe und der Zeitplan - nie die Reihenfolge.',
    steps: [
      { stage: 'Kick-off', body: 'Der Umfang wird festgelegt und eine feste Ingenieurin oder ein fester Ingenieur zugewiesen.\n\nWas auch immer Sie bereitstellen - Zugangsdaten, API-Zugang, Systeme - wird über einen sicheren Kanal ausgetauscht. Sie wissen genau, wer die Arbeit macht und wann sie beginnt.' },
      { stage: 'Analyse', body: 'Die eigentliche Untersuchung - Dekompilierung, Instrumentierung, Korrelation, Nachverfolgung, je nachdem, was das System verlangt - geführt nach denselben Grundsätzen zu Quellen und Methoden, die für jeden Kunden gelten.\n\nNichts wird akzeptiert, das nur eine Person reproduzieren kann.' },
      { stage: 'Review', body: 'Jeder Befund wird triagiert und nach Schwere geordnet, bevor er Sie erreicht.\n\nIm selben fünfteiligen Format, das in unserer Methodik dokumentiert ist: was wir gefunden haben, was es belegt, wie wir es belegt haben, wie sicher wir uns sind, was zu tun ist.' },
      { stage: 'Lieferung', body: 'Sie erhalten die Befunde in dem Format, das Ihre Stufe vorsieht - zuerst eine Zusammenfassung in klarer Sprache, technisches Detail darunter.\n\nGeliefert innerhalb des beim Checkout vereinbarten Zeitfensters.' },
      { stage: 'Follow-up', body: 'Sobald Fixes ausgeliefert sind, bestätigt ein erneuter Test, dass die Lücke tatsächlich geschlossen wurde, sofern die Stufe das vorsieht.\n\nBei laufenden Aufträgen beginnt hier auch der nächste Audit-Zyklus.' },
    ],
  },

  coopPartners: {
    eyebrow: '08 / Forschungskooperation',
    heading: 'gebaut gemeinsam mit unserem Kooperationspartner',
    subheading: 'Laura Serna Gaviria leitet die eigene Forschung und Agentenarchitektur des Emergent Interaction Lab - Lauras Team, Call Laura und Jarvis sind alle aus ihrer Methode entstanden. RFI-IRFOS baut, was sie anleitet, klar als ihres gekennzeichnet, damit stets nachvollziehbar bleibt, wer was gemacht hat.',
    role: 'Emergent Interaction Lab · Kooperationspartnerin',
    laura: {
      desc: 'Forschung zu Mensch-KI-Interaktion seit 2023 - die Methode hinter Lauras Team, einem Multi-Agenten-System aus einem SWAT-Leitteam, das 15 spezialisierte Sub-Agenten anleitet.',
    },
    products: [
      { desc: 'Ein fokussiertes Audit eines einzelnen Systems nach Lauras Emergent-Interaction-/Case-Intelligence-Methode - Prozessrekonstruktion und Befunde, begrenzt auf ein einzelnes System.' },
      { desc: 'Ein kurzer, intensiver Sprint, der Lauras Case-Intelligence-Methode End-to-End auf einen realen Fall oder Prozess anwendet.' },
      { desc: 'Architektur und Design für ein Multi-Agenten-System, aufgebaut auf Lauras Emergent-Interaction-Methode, zugeschnitten auf Ihre Organisation.' },
      { desc: 'Vollständiger Auftrag von Design bis Deployment: Architektur, Bau und Launch eines Multi-Agenten-Systems nach Lauras Methode.' },
    ],
    productsDeliveryNote: 'Antwort innerhalb von 24h nach Kauf; Kick-off wird auf Anfrage abgestimmt.',
    footerNotePrefix: '4 ihrer Pakete, gezeigt als Einstiegspunkte über verschiedene Phasen der Zusammenarbeit - die vollständige Liste hängt davon ab, wo ein Unternehmen in seinem Prozess steht. Vollständige Preise auf Anfrage über',
  },

  submit: {
    eyebrow: '09 / Kontakt & Offenlegungen',
    heading: 'nehmen Sie Kontakt auf',
    paragraph: 'Ein Formular, egal worum es geht: eine allgemeine Frage, eine Serviceanfrage, eine Forschungskooperation - oder ein Sicherheitsfund. Bei Letzterem betreiben wir einen eigenen Aufnahmekanal, statt ihn an eine Drittanbieter-Bug-Bounty-Plattform weiterzuleiten - aus demselben Grund, aus dem wir uns weigern würden, selbst an eine solche verwiesen zu werden.',
    notSurePrefix: 'Im Zweifel: ',
    notSureStrong: 'Allgemeine Anfragen',
    notSureSuffix: ' erreicht so oder so einen Menschen - oder schreiben Sie direkt an eine dieser Adressen.',
    contactCards: {
      general: 'Allgemeine Anfragen',
      security: 'Sicherheitsmeldungen',
      publicDisclosures: 'Öffentliche Offenlegungen (Audit-Korrespondenz)',
      research: 'Forschungskooperation',
      careers: 'Karriere',
    },
    disclosurePolicyPrefix: 'Sie melden einen Sicherheitsfund? Siehe unsere ',
    disclosurePolicyLink: 'vollständige Richtlinie zum Umgang mit Offenlegungen',
    disclosurePolicySuffix: ' - Triage, Rechtsgrundlage und Ihre Wahl der Namensnennung.',
    address: 'Elisabethinergasse 25\n8020 Graz, Österreich\nrfi-irfos.com · rfi-irfos.at',
    form: {
      topicPlaceholder: 'Thema (optional)',
      topicOptions: {
        securityDisclosure: 'Sicherheitsmeldung',
        securityAudit: 'Sicherheitsaudit',
        sendApk: 'APK einschicken',
        researchCollaboration: 'Forschungskooperation',
        webDevelopment: 'Web-Entwicklung',
        other: 'Sonstiges',
      },
      namePlaceholder: 'Name oder Alias (optional - leer lassen, um anonym zu bleiben)',
      emailPlaceholder: 'E-Mail (optional - nur, wenn Sie eine Antwort wünschen)',
      targetPlaceholder: 'Unternehmen / App / Betreff',
      creditOptions: {
        alias: 'Mit dem oben angegebenen Alias / Namen nennen',
        anonymous: 'Nicht nennen - anonym halten',
        fullName: 'Mit vollem rechtlichen Namen nennen',
      },
      findingPlaceholder: 'Worum geht es? Bitte angeben, was es ist, wo relevant, und wie man zu einer Schlussfolgerung kommt (z. B. wie sich ein Fund reproduzieren lässt).',
      lawfulLabel: 'Ich bestätige, dass diese Information auf rechtmäßige, autorisierte Weise erlangt wurde - öffentlich zugängliche Daten, meine eigenen Geräte oder Software, zu deren Testen ich befugt bin.',
      submitSending: 'Wird gesendet...',
      submitOk: 'Erhalten. Vielen Dank.',
      submitIdle: 'Nachricht senden',
      errorText: 'Auf unserer Seite ist etwas schiefgelaufen. Ihre Nachricht ist nicht verloren:',
      errorMailtoCta: 'schicken Sie sie uns stattdessen per E-Mail',
    },
  },

  footer: {
    tagline: 'Menschenrechte stehen nicht zur Verhandlung.',
    taglineAttribution: 'RFI-IRFOS × Emergent Interaction Lab, Kerndoktrin',
    groups: {
      legal: {
        heading: 'Rechtliches',
        links: { impressum: 'Impressum', datenschutz: 'Datenschutzerklärung', agb: 'AGB', security: 'Sicherheitsrichtlinie', standards: 'Standards' },
      },
      company: {
        heading: 'Unternehmen',
        links: { team: 'Team', careers: 'Karriere', ternlang: 'ternlang.com', github: 'github.com/rfi-irfos' },
      },
      research: {
        heading: 'Forschung',
        links: { research: 'Forschung', trackRecord: 'Track Record', methodology: 'Methodik' },
      },
    },
    copyright: '© 2026 RFI-IRFOS  ·  Graz, Österreich  ·  ZVR 1015608684',
  },

  cookieBanner: {
    text: 'das ist ein nutzloser Cookie-Banner. er ist nur hier, damit es wie einer aussieht * wir verwenden keine Cookies, es gibt also nichts, dem zuzustimmen wäre. lassen Sie sich von niemandem etwas anderes erzählen.',
    subtext: 'zwei Buttons, einer schließt das hier und wirft Konfetti. der andere macht buchstäblich nichts.',
    doesNothing: 'macht nichts',
    close: 'schließen',
  },

  alerts: {
    checkoutUnavailable: 'Checkout nicht verfügbar. Bitte kontaktieren Sie uns direkt.',
  },
}
