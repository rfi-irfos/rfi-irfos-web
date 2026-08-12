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
          q: 'Ihre KI verhält sich nicht so, wie sie sollte?',
          a: 'Wir zerlegen das ausgelieferte System und protokollieren sein tatsächliches Verhalten. Die Dokumentation ist dabei nur eine Behauptung, die wir gegenprüfen.',
          detail: 'Getestet auf Code-Ebene, mit echten Eingaben und echten Nutzern - nicht mit einer Vorführung oder einem Benchmark-Wert.',
        },
        {
          q: 'Ihre Software verhält sich in Produktion anders als im Test?',
          a: 'Wir instrumentieren das laufende System und zeichnen auf, was es unter echter Last tatsächlich tut.',
          detail: 'Dieselbe Ursachenanalyse, die hinter jedem veröffentlichten Befund steht - wer beim ersten Symptom aufhört, hat noch keinen Befund.',
        },
        {
          q: 'Sie brauchen NIS2-konforme Incident Response, wissen aber nicht, welche Kontrollen wirklich zu Ihrem Stack passen?',
          a: 'Wir übersetzen Richtlinienpflichten in technische Kontrollen, die Ihr Infrastrukturteam tatsächlich umsetzen kann.',
          detail: 'NIS2 ist keine Checkliste, die man kaufen kann. Wir mappen die Pflichten gegen Ihre tatsächlichen Systeme, Ihren tatsächlichen Code und die tatsächlichen Datenflüsse, die Regulatoren zuerst abfragen werden.',
        },
        {
          q: 'Sie machen sich Sorgen wegen des AI Act und wissen nicht, wo Sie wirklich stehen?',
          a: 'Wir ordnen Ihre Systeme den realen Risikoklassen zu. Eine Checkliste zeigt auf Dokumente. Wir zeigen auf Datenflüsse.',
          detail: 'Zugeordnet zu echten Risikoklassen und tatsächlichen Datenflüssen, nicht zu einem generischen Compliance-Fragebogen.',
        },
        {
          q: 'Ihre App verarbeitet Kinderdaten und Sie sind sich nicht sicher, ob der Consent-Flow wirklich standhält?',
          a: 'Wir auditieren unter COPPA, DSGVO Art. 8 und den EU-AI-Act-Bestimmungen für Minderjährige - die Schnittstelle, wo die meisten Compliance-Frameworks aufhören.',
          detail: 'Kinderdatenschutz ist keine light-Version von Erwachsenen-Datenschutz. Wir testen die genauen Flows, die für Minderjährige relevant sind: Age-Gating, Consent-Mechanismen, biometrische Verarbeitung und die SDKs, die laufen, bevor überhaupt ein Screen erscheint.',
        },
        {
          q: 'Sie bauen KI-Gesundheits- oder Wearable-Produkte und der biometrische Datenpfad ist unklar?',
          a: 'Wir verfolgen, wo Körper zu Daten werden - vom Sensor zur Speicherung zum Drittverarbeiter.',
          detail: 'Internet of Bodies ist nicht hypothetisch. Wir auditieren Wearables, Medizingeräte und KI-Gesundheitsassistenten auf DSGVO Art. 9-Konformität, Datenminimierung und die Cross-Border-Transfers, die unbemerkt passieren.',
        },
        {
          q: 'Es gibt ein Sicherheitsproblem und niemand kann erklären, wie es passiert ist?',
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
      companiesNotified: 'Unternehmen benachrichtigt',
      criticalFindings: 'Kritische Funde',
      regulatorsNotified: 'Regulatoren benachrichtigt',
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
      security: 'Mobile + Web + KI',
      market: 'Desk Research + technische Analyse',
      web: 'Nur Web',
      mobile: 'Nur Mobile (Android + iOS)',
    },
    lineHeadings: {
      security: 'Sicherheitsaudits & Responsible Disclosure',
      market: 'Marktforschung & Wettbewerbsanalyse',
      web: 'Web-Entwicklung',
      mobile: 'Mobile-App-Entwicklung & -Fixes',
    },
    security: [
      { tier: 'Public', hook: 'Kostenlos, für immer - Funde werden nach 90 Tagen veröffentlicht, egal was passiert.', desc: 'Sie erhalten dasselbe Audit auf Quellcode-Ebene, das wir für zahlende Kunden durchführen - kostenlos. Funde werden nach einer 90-tägigen Vorlauffrist auf unserem öffentlichen Ledger veröffentlicht, damit die Organisation Zeit hat, das Problem zu beheben, bevor es jemand anderes sieht.\n\nJeder Name auf diesem Ledger unterliegt derselben Regel, groß oder klein, zahlend oder nicht. Kein Vertrag, keine Geheimhaltungsvereinbarung, keine leisere Behandlung für irgendjemanden.\n\nIhre erste Handy-Privatsphäre-Sitzung ist inklusive: Wir zeigen Ihnen, wie Sie die versteckten Tracker auf Ihrem eigenen Gerät abschalten. Dieses Angebot läuft nicht ab.', delivery: 'Bericht innerhalb von 7 Kalendertagen.' },
      { tier: 'Security Retainer', hook: 'Laufende Sicherheitsabdeckung zwischen den Audits, keine einmalige Momentaufnahme.', desc: 'Ein einzelnes Audit ist ein Foto, das an einem Tag aufgenommen wird; echte Sicherheit verschiebt sich in dem Moment, in dem Sie neuen Code ausliefern. Dieser Retainer ersetzt die Momentaufnahme durch laufende Abdeckung.\n\nFür 1.500 Euro im Monat überwachen wir Ihr Produkt kontinuierlich, führen alle drei Monate ein vollständiges Deep-Dive-Audit durch und stellen Sie an die Spitze der Warteschlange, sobald etwas Dringendes auftaucht.\n\nSie erhalten eine:n namentlich benannte:n Ingenieur:in, der/die Ihr System bereits kennt, damit ein Panikanruf nie damit beginnt, das eigene Setup zu erklären. Die Abdeckung beginnt innerhalb weniger Tage nach Ihrer ersten Zahlung.\n\nStellen Sie es sich vor wie ein ständig verfügbares Sicherheitsteam, ohne eines einzustellen.', delivery: 'Bericht innerhalb von 7 Kalendertagen nach Audit-Abschluss.' },
      { tier: 'Remediation Advisory', hook: 'Ein nach Schwere geordneter Bericht, plus ein Walkthrough mit den Ingenieur:innen, die es gefunden haben.', desc: 'Sie erhalten einen nach Schwere geordneten Bericht in klarer Sprache: genau, wie wir getestet haben, jede gefundene Schwachstelle und eine konkrete Behebung für jede davon, geliefert innerhalb von 7 Kalendertagen nach Zahlung.\n\nDie Ingenieur:innen, die die Lücken gefunden haben, führen Sie durch deren Schließung. Das ist nie eine Liste von Problemen, die jemand anderem zur Interpretation übergeben wird.\n\nDreißig Tage später prüfen wir nach, ob die Fixes tatsächlich angekommen sind - nicht, ob jemand behauptet hat, sie seien es. Jeder Fund ist mit dem genauen Datenschutz-Artikel verknüpft, den er verletzt, damit Ihr Rechtsteam eine Landkarte statt einer Vermutung bekommt.\n\nDas ist der Unterschied zwischen „einen Bericht haben“ und „tatsächlich behoben sein“.', delivery: 'Bericht innerhalb von 7 Kalendertagen nach Zahlung.' },
      { tier: 'Confidential', hook: 'Derselbe geordnete Bericht, unter strikter Geheimhaltungsvereinbarung vertraulich gehalten.', desc: `Sie erhalten einen schriftlichen Bericht, der jede Schwachstelle nach Schwere ordnet und exakt an der Stelle in Ihrem Code verortet, plus eine Zusammenfassung in klarer Sprache, die auch nicht-technische Führungskräfte tatsächlich lesen können. Geliefert innerhalb von 7 Kalendertagen nach Zahlung.\n\n${NDA_CLAUSE}\n\nSobald Sie Fixes ausliefern, testen wir manuell nach, um zu bestätigen, dass die Lücken tatsächlich geschlossen sind - nicht nur auf dem Papier gepatcht.\n\nEines ändert sich nicht: Als Non-Profit-Organisation, die an ihre eigenen Regeln gebunden ist, werden die zuständigen Regulatoren trotzdem parallel informiert, ohne Details, die Sie exponieren würden. Diskretion, wo sie zählt, Beweise, wo es darauf ankommt.`, delivery: 'Bericht innerhalb von 7 Kalendertagen nach Zahlung.' },
      { tier: 'Enterprise NDA', hook: 'Privater Bericht, priorisierter Zugang zu mehr Remediation-Zeit, direkter Zugang zu den Ingenieur:innen für die Behebung.', desc: `Sie erhalten denselben geordneten Bericht wie in der Confidential-Stufe, mit einem Unterschied: Wenn Ihr Team mehr als das übliche 90-Tage-Fenster braucht, um die Dinge richtig zu reparieren, setzen wir uns für die maximale Verlängerung ein, die unsere Fall-für-Fall-Regel für echte Remediation erlaubt - dieselbe Regel, die für jede Organisation gilt, die wir prüfen, kein exklusives Feature dieser Stufe.\n\n${NDA_CLAUSE}\n\nSie arbeiten direkt mit den Ingenieur:innen an der Behebung. Ihre Anwält:innen erhalten ein vollständiges Beweispaket, das sie direkt an die Rechtsvertretung weitergeben können.\n\nWir starten innerhalb weniger Tage nach Zahlung, und jede Folgearbeit springt an die Spitze der Warteschlange. Gebaut für Organisationen, bei denen alles innerhalb von 90 Tagen zu beheben nicht realistisch ist.`, delivery: 'Vollständiger Bericht innerhalb von 7 Kalendertagen.' },
      { tier: 'Critical Infrastructure', hook: 'NIS2-konforme Notfallreaktion für regulierte Betreiber.', desc: `Sie erhalten eine Prüfung mit vollem Umfang unter Geheimhaltungsvereinbarung, unsere eigene Rechtsprüfung und ein mit Ihrem Team gemeinsam eingeübtes Incident-Response-Protokoll, bevor irgendetwas schiefgeht. Für Betreiber von Energie-, Wasser-, Gesundheits- oder Verkehrsinfrastruktur ist ein Vorfall ein Ereignis der öffentlichen Sicherheit, kein IT-Ticket.\n\n${NDA_CLAUSE}\n\nWir übersetzen NIS2-Pflichten in technische Kontrollen, die Ihr Infrastrukturteam tatsächlich umsetzen kann, und sprechen in Ihrem Namen direkt mit den zuständigen österreichischen und deutschen Behörden. Sie erhalten ein ständiges Notfallreaktionsprotokoll, damit der schlimmste Tag im Voraus eingeübt ist und nicht spontan erfunden werden muss.\n\nWir mobilisieren innerhalb weniger Tage nach Zahlung. Das ist die Stufe für Situationen, in denen Scheitern keine Option ist.`, delivery: 'Vollständiger Bericht innerhalb von 7 Kalendertagen.' },
      { tier: 'IoB / Art. 9', hook: 'Eine vollständige Nachverfolgung biometrischer Daten - die Kategorie, die die meisten Anbieter nicht anfassen.', desc: `Sie erhalten eine vollständige Nachverfolgung jedes Flusses biometrischer Daten durch Ihr Produkt: Speicherfristen, grenzüberschreitende Übermittlungen und Verarbeitungszweck, kartiert gegen die strengste Kategorie des europäischen Datenschutzrechts.\n\n${NDA_CLAUSE}\n\nDer Preis spiegelt die Tiefe der Arbeit wider. Sie behalten dieselbe Geheimhaltungsvereinbarung und denselben Regulatorkontakt wie in der Enterprise-Stufe. Die meisten Sicherheitsanbieter fassen diese Kategorie nicht an; wir haben uns darauf spezialisiert, weil die betroffenen Daten buchstäblich die Körper von Menschen sind.\n\nWir starten innerhalb weniger Tage nach Zahlung.`, delivery: 'Quartalsberichte innerhalb von 7 Kalendertagen.' },
      { tier: 'Annual Intelligence Retainer', hook: 'Eine externe Sicherheits- und Compliance-Abteilung, das ganze Jahr über.', desc: 'Sie erhalten ein volles Jahr unseres Flaggschiff-Service: kontinuierliche Abdeckung Ihres gesamten App-Portfolios, keine Stichprobe, mit einem tiefgehenden Audit alle drei Monate.\n\nIhre feste Ansprechperson spricht direkt mit den relevanten Regulatoren, von den österreichischen und deutschen Datenschutzbehörden bis zur britischen ICO. Sie erhalten jeden Monat ein Bedrohungsbriefing und sofortige Benachrichtigung, sobald wir einen sich anbahnenden Vorfall sehen.\n\nWir übernehmen innerhalb einer Woche nach Zahlung und agieren von Tag eins an als Ihre externe Sicherheits- und Compliance-Abteilung.', delivery: 'Quartalsberichte innerhalb von 7 Kalendertagen.' },
    ],
    market: [
      { tier: 'Market Overview', hook: 'Eine zehnseitige, jargonfreie Landkarte Ihres Sektors, in 14 Tagen.', desc: 'Sie erhalten eine Landkarte Ihres Sektors in klarer Sprache: die wichtigsten Akteure, wie Regulierung für sie tatsächlich funktioniert, und wo die echten Chancen liegen. Geliefert innerhalb von 14 Kalendertagen.\n\nSie umfasst mindestens zehn Seiten, kein Fachjargon, kein zweihundert-Folien-Deck, geschrieben, damit ein Gründer bzw. eine Gründerin es in einem Zug lesen kann.\n\nDie Recherche beginnt innerhalb weniger Tage nach Zahlung.', delivery: '14 Kalendertage.' },
      { tier: 'Competitor Intelligence', hook: 'Drei bis fünf Wettbewerber auseinandergenommen: Technik, Datenschutz, Positionierung.', desc: 'Wir nehmen drei bis fünf Ihrer Wettbewerber auseinander: welche Technologie sie einsetzen, wie sie Nutzerdatenschutz tatsächlich handhaben im Vergleich zu dem, was sie behaupten, wie sie sich positionieren, und wo sie strategisch schwach sind.\n\nDas Ergebnis ist ein realistisches Bild des Feldes, inklusive Lücken, die Sie nutzen können, und solchen, die Sie schließen müssen. Das ist die Hausaufgabe, die die meisten Teams überspringen und später bereuen.\n\nGeliefert innerhalb von 14 Kalendertagen nach Zahlung.', delivery: '14 Kalendertage.' },
      { tier: 'Sector Intelligence Report', hook: 'Markt, Regulierung und Technologie - vierteljährlich aktualisiert.', desc: 'Sie erhalten das vollständige Bild Ihres Sektors: Markt, Regulierung und Technologie, mit dem Risikoprofil jedes wichtigen Akteurs in Zahlen ausbuchstabiert, nicht in vagen Behauptungen.\n\nWeil sich Märkte bewegen, ist das kein einmaliges Dokument. Sie erhalten alle drei Monate ein frisches Update, damit Sie immer wissen, wohin sich der Sektor entwickelt.\n\nErster Bericht innerhalb von 14 Kalendertagen nach Zahlung, danach vierteljährlich aktualisiert.', delivery: '14 Kalendertage.' },
      { tier: 'Ongoing Intelligence Briefing', hook: 'Ein fester Analyst, der Ihre Wettbewerber Monat für Monat beobachtet.', desc: 'Sie erhalten eine kontinuierliche Beobachtung Ihrer Wettbewerber: ein richtiges Briefing jeden Monat und eine sofortige Warnung, sobald einer von ihnen einen bedeutenden Schritt macht - eine Finanzierungsrunde, eine Kurskorrektur, einen Sicherheitsvorfall oder eine Schlüsseleinstellung.\n\nEin fester Analyst, der Ihr Feld kennt, übernimmt das, damit Sie vom Launch eines Wettbewerbers am Tag erfahren, an dem er passiert - nicht danach.\n\nIhr Analyst wird innerhalb einer Woche nach Zahlung zugewiesen; das erste Briefing landet Ende des ersten Monats.', delivery: 'Erstes Briefing innerhalb von 14 Kalendertagen, danach monatlich.' },
    ],
    web: [
      { tier: 'Full Build', hook: 'Der komplette individuelle Bau, kein Template, kein Page-Builder.', desc: 'Sie erhalten eine vollständige, individuell gebaute Website oder Plattform: mehrseitig, mit einem Content-Editor, den Ihr Team tatsächlich nutzen kann, und einem Backend, das mit Ihrem Betrieb mitwächst statt an seine Grenzen zu stoßen.\n\nWir planen den Umfang mit Ihnen in der ersten Woche nach Zahlung: welche Integrationen Sie brauchen, ob ein eigenes Backend in Rust sinnvoll ist, wie tief die Authentifizierung gehen muss. Gebaut von demselben Team, das Apps auf Sicherheit prüft, also standardmäßig sauber, kein nachträglicher Gedanke.\n\nKein Page-Builder-Lock-in: Sie besitzen den Code und können ihn überallhin mitnehmen. Für Organisationen, bei denen die Website das Geschäft ist, keine Broschüre.', delivery: '14-28 Kalendertage, je nach Umfang.' },
      { tier: 'Native App Bundle', hook: 'Echte native Apps für Android und iPhone, auf demselben Backend wie Ihr Full Build.', desc: 'Sie erhalten echte native Android- und iPhone-Apps, kein als App verkleideter Web-Wrapper, gebaut auf demselben Backend wie Ihr Full-Build-Projekt.\n\nWir übernehmen auch die Einreichung im Play Store und App Store, genau dort, wo die meisten Builds hängen bleiben.\n\nAls Erweiterung zum Full Build geplant, kein separates Projekt mit eigener Infrastruktur.', delivery: '14-28 Kalendertage, parallel zum Full Build.' },
      { tier: 'Ongoing Care & Iteration', hook: 'Laufende Pflege und Weiterentwicklung nach dem Launch, kein Verrotten.', desc: 'Sie erhalten einen stetigen Rhythmus an Updates, Sicherheits-Patches und kleinen Weiterentwicklungen, nachdem Ihre Seite live ist - eine feste Ansprechperson, die Ihren Build bereits kennt.\n\nDafür braucht ein Panikanruf nie damit zu beginnen, das eigene Setup zu erklären.\n\nBeginnt, sobald Ihr Full Build live ist, kein separates Onboarding.', delivery: 'Laufender Auftrag; erster Check innerhalb von 14 Kalendertagen.' },
      { tier: 'Enterprise & Compliance', hook: 'Geheimhaltungsvereinbarung, dedizierte Infrastruktur und Priorität, für eigene Compliance-Anforderungen.', desc: 'Sie erhalten dedizierte Infrastruktur statt geteilter Ressourcen, eine Geheimhaltungsvereinbarung vor Projektstart und priorisierten Zugang zu unserem Team für alles, was danach kommt.\n\nWir planen die genauen Anforderungen direkt mit Ihrer Rechts- und IT-Abteilung, statt sie im Voraus zu erraten.\n\nFür Organisationen, bei denen Standard-Hosting oder ein geteiltes Backend keine Option ist.', delivery: 'Individueller Zeitplan, nach Kick-off abgestimmt.' },
    ],
    mobile: [
      { tier: 'Maintenance Retainer', hook: 'Regelmäßige Patches und Dependency-Pflege, damit Ihre App nicht verrottet.', desc: 'Sie erhalten einen stetigen Rhythmus an Patches, App-Store-Compliance-Überwachung, damit eine Richtlinienänderung Sie nie überrascht, und saubere Dependency-Pflege, damit alte Bibliotheken nicht zur Notlage von morgen werden.\n\nEine feste Ansprechperson und priorisierte Reaktionszeit; die erste Prüfung landet innerhalb einer Woche nach Zahlung.\n\nRuhige, kontinuierliche Pflege, damit Ihre App nicht still vor sich hin verrottet.', delivery: 'Laufender Auftrag; erster Patch innerhalb von 14 Kalendertagen.' },
      { tier: 'APK Review & Bugfix', hook: 'Schicken Sie Ihren Build, erhalten Sie Antworten auf Root-Ebene in einer Woche.', desc: 'Sie schicken uns Ihren Build; wir lesen den tatsächlichen Code, nicht das Marketing. Deckt Android und iPhone ab.\n\nWir identifizieren Abstürze und echte Schwachstellen und geben Ihnen dann konkrete Anleitung, jede davon zu beheben - mit festem Umfang und einer Durchlaufzeit von einer Woche ab dem Tag, an dem Sie den Build schicken.\n\nEine klare Antwort, schnell, statt eines sechswöchigen Audits, auf das Sie nicht vorbereitet waren.', delivery: '1 Woche / 7 Kalendertage.' },
      { tier: 'App Build', hook: 'Ihre native App, Kotlin und Swift, im eigenen Haus von null bis zum Launch gebaut.', desc: 'Sie erhalten Ihre native App, von null bis zum Launch gebaut: Kotlin für Android, Swift für iPhone, mit einem Rust-Backend darunter.\n\nWir machen alles im eigenen Haus, mit dem Team, mit dem Sie bereits sprechen, keine Offshore-Übergabe. Wir übernehmen auch die Einreichung im Play Store und App Store, genau dort, wo die meisten Builds hängen bleiben.\n\nWir starten innerhalb einer Woche nach Zahlung. Ein Team, eine Codebasis, ein Launch.', delivery: '14-28 Kalendertage, je nach Umfang.' },
      { tier: 'Full Mobile Product', hook: 'Von der Skizze auf einer Serviette bis zur gelaunchten App, gemeinsam durchgezogen.', desc: 'Sie erhalten das gesamte Mobile-Produkt, von einer Skizze auf einer Serviette bis zur gelaunchten App: individuelle Infrastruktur, API-Design, native Apps und ein festes Team, das dranbleibt.\n\nDas ist ein laufender Auftrag, weil ein echtes Produkt sich nach dem Launch weiterentwickelt.\n\nWir starten innerhalb einer Woche nach Zahlung und bauen mit Ihnen weiter, während es wächst. Für den Fall, dass Sie ein mobiles Geschäft aufgebaut brauchen, nicht nur eine App gemacht.', delivery: 'Individueller Zeitplan nach Kick-off.' },
    ],
  },

  tierCarousel: {
    recommendedTier: '★ Empfohlene Stufe',
    featuredTier: 'Ausgewählte Stufe',
    getStarted: 'Jetzt starten',
    requestProposal: 'Angebot anfragen',
    recommendedBadge: '★ EMPFOHLEN',
    prevTierAria: 'Vorherige Stufe',
    nextTierAria: 'Nächste Stufe',
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
    subheading: 'Dieselben fünf Phasen, egal ob es sich um ein einwöchiges APK-Review oder einen ganzjährigen Retainer handelt. Was sich zwischen den Stufen ändert, ist die Tiefe und der Zeitplan - nie die Reihenfolge.',
    steps: [
      { stage: 'Kick-off', body: 'Der Umfang wird festgelegt und eine feste Ingenieurin oder ein fester Ingenieur zugewiesen.\n\nWas auch immer Sie bereitstellen - ein Build, API-Zugang, ein Gerät - wird über einen sicheren Kanal ausgetauscht. Sie wissen genau, wer die Arbeit macht und wann sie beginnt.' },
      { stage: 'Analyse', body: 'Die eigentliche Untersuchung, geführt nach denselben Grundsätzen zu Quellen und Methoden, die für jeden Kunden gelten.\n\nTests auf Quellcode-Ebene, Verfolgung bis zur eigentlichen Ursache - nichts wird akzeptiert, das nur eine Person reproduzieren kann.' },
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
