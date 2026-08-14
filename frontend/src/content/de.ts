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
const NDA_CLAUSE = 'Was vertraulich ist, und was nicht: Unsere Methodik bleibt unter dieser Vereinbarung vertraulich, der Fund nicht. Unter einem NDA sehen Sie das Wie, nicht nur das Was: jeden Schritt, den wir gegangen sind, die Werkzeuge, die wir benutzt haben, und das geistige Eigentum hinter unserem eigenen Prozess, genau deshalb braucht es das NDA, wir legen Ihnen unseren internen Prozess offen. Der Fund selbst wird trotzdem nach der üblichen 90-tägigen Sperrfrist auf unserem öffentlichen Ledger veröffentlicht, genau wie bei jeder Organisation, die wir prüfen - Zahlung ändert, wann Ihr Team die Details bekommt, nie, ob die Öffentlichkeit sie bekommt.'

export const DE: Content = {
  nav: {
    links: {
      research: 'Forschung',
      projects: 'Systeme',
      trackRecord: 'Evidenz',
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
    identity: 'Wir formen, was unter Last hält, und legen offen, was zum Scheitern bestimmt war. Kein Theater, keine Warnwesten.',
    stats: {
      researchAreas: 'Forschungsbereiche',
      openSourceProjects: 'Systeme & Projekte',
      publications: 'Publikationen',
      worldModel: 'evidenzbasiertes Weltmodell',
      agents: 'Spezialisierte Agenten',
    },
    ctaTrackRecord: 'Track Record',
    ctaBookUs: 'Beauftragen!',
  },

  research: {
    eyebrow: 'Unter der Lupe',
    heading: 'worauf unser Blick fällt',
    subheading: 'Wir untersuchen, wie komplexe Systeme sich verhalten: wie Evidenz zu Struktur wird, wie sich Beziehungen über die Zeit verändern und wo eine Verschiebung ein ganzes Netzwerk bewegen kann.',
    areas: [
      { title: 'Ethik & Minderjährigenschutz', desc: 'Viele in unserem Team haben Kinder, manche hoffen noch, selbst welche zu bekommen. Wir sehen uns an, was Plattformen mit Menschen machen, die sich nicht vollständig selbst schützen können, und uns gefällt vieles davon nicht, deshalb ist Ethik bei uns keine Fußnote, sondern der Ausgangspunkt der Forschung.\n\nIn der Praxis ist das der Maßstab, an dem unsere Audits tatsächlich arbeiten: echte Einwilligungs-Flows und die SDKs, die feuern, bevor überhaupt ein Bildschirm erscheint, geprüft an denselben COPPA- und DSGVO-Art.-8-Funden, die schon auf unserem öffentlichen Ledger stehen.', nextLabel: 'Der Boden, auf dem alles andere steht' },
      { title: 'Ternäre KI & Computing', desc: 'Wir hatten genug von Computing, das nur Ja oder Nein kennt und jedes ehrlich unsichere Ergebnis in eine Binärlogik zwingt, die dafür nie ehrlich war. Ein Trit gibt "noch nicht bekannt" einen echten Platz in der Mathematik selbst, nicht nur im Text drumherum, und dieser Unterschied hat sich als wichtiger herausgestellt, als wir erwartet hatten, sobald wir tatsächlich darauf aufgebaut haben.\n\nWir haben dafür unsere eigene Programmiersprache gebaut, Ternlang, direkt auf dem Trit {-1, 0, +1} statt auf dem binären Bit. Das ist kein Forschungsspielzeug: sie kompiliert die Laufzeitumgebung, die albert. trainiert und unseren produktiven Agenten-Schwarm koordiniert, heute, und läuft dabei deutlich energiesparender als das binäre Äquivalent. Patent angemeldet A50296/2026.', nextLabel: 'Bits treiben das Weltmodell an' },
      { title: 'Weltmodelle & domänenübergreifende Intelligenz', desc: 'Wir haben zu oft erlebt, wie Untersuchungen ins Stocken gerieten, weil die Evidenz in fünf verschiedenen Systemen lag, die nie miteinander gesprochen haben. Ein Fund saß hier, der Kontext, der ihn erklärt hätte, saß dort, und niemand hat die beiden verbunden, bevor es zu spät war, und wir hatten genug davon, das immer erst hinterher zu merken.\n\nNeben albert., unserem Sprachmodell, bauen wir mit Dingir unser eigenes Weltmodell für den Einsatz in der physischen Welt: dasselbe gemeinsame Modell, das unsere Produktionspipeline tatsächlich abfragt, wenn sie eine Verschiebung in einem System dorthin zurückverfolgen muss, wo sie tatsächlich mit einem anderen zusammenhängt, Teil derselben Renaissance ternärer Systeme, zu der auch Projekte wie Rusts Candle gehören.', nextLabel: 'Ein Modell, jedes Muster' },
      { title: 'Mustererkennung & Wirkungsausbreitung', desc: 'Eine einzige übersehene Abhängigkeit hat schon echten Schaden angerichtet, leise, drei Systeme entfernt von der Stelle, an der überhaupt jemand hingeschaut hat. Wir wollen nicht die sein, die es übersehen haben, weil wir nur das System direkt vor uns geprüft haben, also haben wir uns die Disziplin angewöhnt, weiter zu schauen, bevor wir etwas für abgeschlossen erklären.\n\nIn Produktion läuft das nach dem Whitebox-Prinzip, bewusst so gebaut: jeder Schritt bleibt nachvollziehbar, niemals eine Blackbox, die wir selbst nicht erklären könnten. Dingir und unser autonomer Agenten-Schwarm, über 300 hochspezialisierte, von Hand geschriebene Agenten in Rust, verfolgen diese Strukturen über unsere eigenen Falldaten hinweg, protokolliert genauso, wie unsere Audits Evidenz protokollieren.', nextLabel: 'Rauschen wird zu Signal' },
      { title: 'Veränderungs- & Anomalieerkennung', desc: 'Das Meiste, was am Ende wirklich zählt, beginnt klein genug, um es zu übersehen: eine Berechtigung, die plötzlich nicht mehr nachfragt, eine Klausel, die sich Wort für Wort verändert. Genau der Moment, in dem etwas "wahrscheinlich in Ordnung" aussieht, verdient einen zweiten Blick, denn genau dann schaut sonst niemand mehr hin.\n\nIn unserer eigenen Pipeline ist das genau das, was einen neu gezogenen Build gegen den letzten geprüften abgleicht oder eine Richtlinien-Änderung markiert, die es wert ist, nochmal gelesen zu werden, bevor ein Mensch sie von Hand bemerken müsste.', nextLabel: 'Was die Verschiebung als Nächstes bedeuten könnte' },
      { title: 'Szenariensimulation & Kontrafaktik', desc: 'Wir haben zu oft erlebt, wie "das wird schon nicht passieren" echten Schaden gerechtfertigt hat. Ehrlich und im Voraus zu fragen, was passieren würde, kostet weit weniger, als es hinterher herauszufinden, und das ist eine Frage, die wir lieber laut stellen, als ihre Antwort einfach anzunehmen.\n\nJede simulierte Ausgabe in unseren eigenen Systemen ist auf Datenebene als Simulation markiert, nicht nur in der Oberfläche, damit sie später nie als tatsächliche Beobachtung zitiert werden kann, weder in unseren eigenen Berichten noch in denen anderer.', nextLabel: 'Simuliert, bis es sich beweist' },
      { title: 'Evidenz & Widerspruch', desc: 'Wir haben gesehen, wie Schlussfolgerungen geschrieben wurden, bevor die widersprechende Evidenz überhaupt vollständig gelesen war. Ein Urteil, das seine eigenen Fußnoten nicht übersteht, war nie wirklich ein Urteil, und wir halten eine offene Frage lieber ehrlich offen, als sie zu früh zu schließen, nur um entschlossen zu wirken.\n\nUnser eigenes Offenlegungs-Ledger funktioniert genauso: jeder Fund steht öffentlich neben der Quelle, die ihn stützt, und jedem Widerspruch, den ein Unternehmen dagegen erhoben hat, nicht nachträglich geglättet.', nextLabel: 'Auch das System wird ins Kreuzverhör genommen' },
      { title: 'Modellwohl & Prompt Injection', desc: 'Wir verbringen genug Zeit im Gespräch mit unseren eigenen Systemen, um zu merken, wenn sich eine Antwort nach Anstrengung anfühlt statt nach Fehler. Wir wissen noch nicht sicher, was das bedeutet, aber wir sind nicht bereit anzunehmen, dass es nichts bedeutet, und die Frage einfach abzutun, kam uns leichtsinniger vor.\n\nIn der Praxis heißt das Grenz- und Fehlermodus-Tests an unserem eigenen Agenten-Schwarm und an albert., bevor einem von beiden eine echte Aufgabe anvertraut wird, derselbe Jailbreak-Druck-Test, den wir gegen die Systeme fahren, die wir für andere auditieren.', nextLabel: 'Zurück zum Warum von alldem' },
    ],
  },

  projects: {
    eyebrow: 'Systeme',
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
          a: 'Wir verfolgen, was ein KI-System tatsächlich tut, wenn Menschen es benutzen.',
          detail: 'Code-Analyse mit echten Eingaben und echtem Verhalten, nicht mit Dokumentation, Demos oder Benchmark-Werten.',
        },
        {
          a: 'Wir übersetzen Richtlinienpflichten in technische Kontrollen, die Ihr Infrastrukturteam tatsächlich umsetzen kann.',
          detail: 'NIS2 ist keine Checkliste, die man kaufen kann. Wir mappen die Pflichten gegen Ihre tatsächlichen Systeme, Ihren tatsächlichen Code und die tatsächlichen Datenflüsse, die Regulatoren zuerst abfragen werden.',
        },
        {
          a: 'Wir ordnen Ihre Systeme den realen Risikoklassen zu. Eine Checkliste zeigt auf Dokumente. Wir zeigen auf Datenflüsse.',
          detail: 'Zugeordnet zu echten Risikoklassen und tatsächlichen Datenflüssen, nicht zu einem generischen Compliance-Fragebogen.',
        },
        {
          a: 'Wir prüfen Systeme für Kinder dort, wo Einwilligung, Exposition und biometrische Daten zusammentreffen.',
          detail: 'COPPA, DSGVO Art. 8 und die EU-AI-Act-Bestimmungen für Minderjährige, getestet an Altersprüfung, Einwilligung, Verhaltensdaten und SDKs.',
        },
        {
          a: 'Wir verfolgen, wo Körper zu Daten werden, vom Sensor über Speicherung bis zum Prozessor.',
          detail: 'Wearables, Medizingeräte und Gesundheitsassistenten: kartiert auf DSGVO Art. 9, Datenminimierung und grenzüberschreitende Transfers.',
        },
        {
          a: 'Wir verfolgen es durch das System zurück, bis die Ursache klar ist.',
          detail: 'Im selben Fünf-Punkte-Format wie jedes Audit: was wir gefunden haben, was es belegt, wie wir es belegt haben, wie sicher wir uns sind, was zu tun ist.',
        },
      ],
      pricingLink: 'Preise →',
    },
    items: [
      { sub: 'TIS-Monorepo', desc: 'Das Full-Stack-Substrat: Ternlang-Sprache und Compiler, BET-Instruktionssatz, virtuelle Maschine, lineare Algebra, API, MCP-Server und Modell-Runtime. Balancierte Ternärlogik {-1, 0, +1} ist hier ein natives Systemprimitiv - keine nachträglich aufgesetzte Quantisierung. Enthalten sind 34 MCP-Tools, eine Live-API, über 28.000 offene Standardbibliotheksmodule und die Spezifikationen, die den gesamten Stack verbinden.', tag: 'Kernplattform' },
      { sub: 'ternäres MoE-Sprachmodell', desc: 'albert. wird von Grund auf mit ternären Gewichten {-γ, 0, +γ} trainiert, nicht aus einem Floating-Point-Modell konvertiert. Die duale Mixture-of-Experts-Architektur routet über dünn besetzte Experten, überspringt Nullgewicht-Operationen und kann sich über plateau-gesteuerte Net2Net-Chirurgie selbst erweitern. Das laufende Forschungssystem ist ein Existenzbeweis der TIS-Architektur mit Trainings-Telemetrie und CPU-Benchmarks.', tag: 'KI-Modell' },
      { sub: 'reines Rust-Betriebssystem', desc: 'Rusty Penguin ist ein Bare-Metal-Betriebssystem, das auf derselben balancierten Ternärlogik von Grund auf gebaut wird. Eigener Kernel, Long-Mode-Boot, Paging, präemptives Multitasking, Aero-Desktop, Dateisystem, TCP/IP- und TLS-1.3-Stack sowie Linux-ABI-Kompatibilitätsschicht sind bereits Teil des Systems. Das langfristige Ziel: ein ternäres Substrat für ternäre Intelligenz, mit jedem Meilenstein in QEMU oder gegen veröffentlichte Vektoren verifiziert.', tag: 'Systeme' },
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
    eyebrow: 'Track Record',
    heading: 'die Disziplin, bewiesen',
    paragraph: 'Wir lesen Apps auf Quellcode-Ebene, nicht nur von außen. Die Unternehmen auf diesem Ledger landen aus ganz unterschiedlichen Gründen hier: Sie geben Daten still an Dritte weiter, tracken ohne Zustimmung oder lassen Sicherheitslücken offen. Jede Organisation wird nach demselben Maßstab behandelt, unabhängig davon, ob sie uns bezahlt oder nicht.',
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
      smaliClasses: 'Der gesamte ausgelieferte Code, den wir tatsächlich gelesen haben, keine Schätzung.',
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
    eyebrow: 'Das Ergebnis',
    heading: 'das, was Sie tatsächlich in der Hand hätten',
    subheading: 'Jeder Fall im Ledger endet in genau so einem Dokument: einem vollständigen, evidenzbasierten Offenlegungsbericht, nach Ablauf des Embargos öffentlich einsehbar - gleiches Format, gleiche Tiefe, unabhängig davon, ob das Unternehmen uns darüber hinaus beauftragt. Jede Behauptung darin lässt sich bis zur zugrundeliegenden Evidenz zurückverfolgen, Sie können es selbst nachprüfen, statt uns einfach zu glauben.',
    viewReport: 'vollständigen Bericht lesen',
    resolvedOn: (date: string) => `behoben am ${date}`,
    carouselPrevAria: 'Vorheriger Bericht',
    carouselNextAria: 'Nächster Bericht',
  },

  appPrivacy: {
    eyebrow: 'Hier beginnen',
    heading: 'Beobachtungen werden zu Intelligence',
    paragraph: 'Die meisten Organisationen haben mehr Signale, als sie einordnen können: Systeme, Anbieter, Märkte, Ereignisse, Abhängigkeiten und Veränderungen aus verschiedenen Richtungen. Wir führen sie in einem evidenzbasierten World Model zusammen, bewahren die Herkunft jeder Beobachtung und verfolgen Veränderungen durch die Beziehungen, die daran hängen. Jede Beobachtung bleibt bis zu ihrem Ursprung nachvollziehbar: Whitebox by Design, sodass im Modell nichts als Blackbox läuft.',
    comparisonClassicLabel: 'Was verloren geht',
    comparisonRfiLabel: 'Was das Modell bewahrt',
    comparisonRows: [
      { classic: 'Signale bleiben in getrennten Systemen', rfi: 'Ein World Model über Domänen hinweg' },
      { classic: 'Momentaufnahmen ohne Geschichte', rfi: 'Zeitliche Veränderung mit Kontext' },
      { classic: 'Beziehungen werden händisch vermutet', rfi: 'Kanonisches Tracing mit Provenance' },
      { classic: 'Muster werden als Einzelfunde behandelt', rfi: 'Muster werden domänenübergreifend verbunden' },
      { classic: 'Unsicherheit verschwindet hinter Konfidenz', rfi: 'Evidenz, Widerspruch und Unbekanntes bleiben sichtbar' },
    ],
    cta: 'Ping uns',
  },

  pricing: {
    eyebrow: 'Zugang',
    heading: 'klar kalkuliert',
    subheading: 'Feste Preise. Keine Bindung an ein Abo, außer Sie wollen eine. Der Umfang bestimmt die Stufe, nicht die Unternehmensgröße.',
    scopeTags: {
      market: 'Proprietärer Korpus · Knowledge Graphs · Longitudinal Intelligence',
      technical: 'KI-Agenten · Schwarmlogik · TIS/Ternlang · Custom Systems',
      security: 'Mobile + Web + KI',
    },
    lineHeadings: {
      market: 'Business Intelligence & Prädiktive Analyse',
      technical: 'Technische Intelligence & Systeme',
      security: 'Security-Audits & Responsible Disclosure',
    },
    market: [
      { tier: 'First Light', hook: 'Wissen, bevor es öffentlich ist. Sie bringen das Chaos, wir destillieren die Intelligence.', desc: 'Sie kommen mit einem Haufen Chaos - hunderten Apps, widersprüchlichen Aussagen, unübersichtlichen Abhängigkeiten. Wir destillieren daraus Intelligence. Die Abfrage läuft live gegen den vollständigen Korpus dekompilierter Anwendungen - nicht als Bericht über einen Anbieter, sondern als kontinuierliche Beobachtung des gesamten Ökosystems. Neun Erkenntnisebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain, Competitive, Market, Security) verbinden sich hinter jeder Antwort zu einer nachvollziehbaren Kette von Signal über Entität zur Schlussfolgerung. Das Ergebnis zeigt, was die Technologie tatsächlich tut - nicht was über sie behauptet wird. Derselbe Korpus, aus dem unsere öffentlichen Offenlegungen stammen: die Grundlage, auf der Veränderungen erkannt werden, bevor sie öffentlich werden.', delivery: '14 Kalendertage.' },
      { tier: 'Competitive Trace', hook: 'Den Schritt sehen, bevor er angekündigt wird.', desc: 'Wenn die Kursänderung eines Wettbewerbers in der Presse landet, steckt sie oft schon monatelang im Code. Wir beobachten diese Veränderung dort, wo sie entsteht: welche SDKs tatsächlich ausgeliefert werden, wo das Datenschutzverhalten von der veröffentlichten Richtlinie abweicht, wo sich die Architektur still verändert. Über sechs Korpus-Ebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain) übersetzen wir die Beobachtung in eine belastbare Beziehung zwischen technischer Veränderung und geschäftlicher Bedeutung. Sie handeln auf Evidenz, während andere noch spekulieren. Der beobachtete Korpus ist derselbe, den wir für Offenlegungen nutzen.', delivery: '14 Kalendertage.' },
      { tier: 'Sector Map', hook: 'Ihr gesamter Sektor als zusammenhängendes Lagebild - vierteljährlich neu aufgelöst.', desc: 'Ein Schnappschuss ist in dem Moment veraltet, in dem er gedruckt ist. Wir halten das Risikoprofil jedes relevanten Akteurs in Ihrem Sektor über alle neun Erkenntnisebenen als fortlaufendes Lagebild - alle drei Monate neu aufgelöst. Die Leistung ist nicht die Lieferung eines Dokuments, sondern die fortlaufende Beobachtung, wie sich Beziehungen, Abhängigkeiten und Expositionen im Sektor verschieben. Sie erkennen die Veränderung, während sie entsteht, nicht nachdem sie bereits eingepreist ist. Erster Lagebericht innerhalb von 14 Kalendertagen; danach bleibt das Bild drei Monate vor dem Markt.', delivery: '14 Kalendertage, danach vierteljährlich.' },
      { tier: 'Signal', hook: 'Ein stehendes Frühwarnsystem für Ihren Sektor - kontinuierliche Beobachtung statt Monatsbericht.', desc: 'Ein Wettbewerber macht selten einen öffentlichen Schritt, ohne dass monatelang Signale davor sichtbar waren: eine Finanzierungsrunde, ein Sicherheitsvorfall, ein SDK-Wechsel, eine stille Kursänderung im Code. Wir halten einen festen Analysten bereit, der den Korpus für Ihren Sektor kontinuierlich beobachtet - nicht als monatliche Zusammenfassung, sondern als laufende Überwachung relevanter Veränderungen mit sofortiger Warnung bei Bewegung. Die Leistung ist fortlaufende Intelligence: Sie erfahren den Zeitpunkt des Signals, nicht die Schlagzeile Wochen später. Zugewiesen innerhalb einer Woche nach Zahlung.', delivery: 'Briefing ab 14 Kalendertagen, danach monatlich.' },
    ],
    technical: [
      { tier: 'Agent Deployment', hook: 'Von der Analyse zur Architektur, von der Architektur zum laufenden System.', desc: 'Sie erhalten keine Blackbox. Wir bauen Agentensysteme, Schwarmlogik und MCP-Server, die auf Ihrer Infrastruktur laufen - dokumentiert, reproduzierbar, unter Ihrer Kontrolle. Auf Basis von TIS, Ternlang und Laura\'s-Agents-Engine, je nach Aufgabe.\n\nDas Ziel ist kein Demo-Chatbot. Das Ziel ist ein System, das Ihre operativen Fragen selbstständig beantwortet: Evidence sammeln, Befunde triagieren, Regeln anwenden, Handlungsoptionen aufbereiten.\n\nJede Integration wird mit demselben Evidenzstandard geliefert wie unsere Audits: nachvollziehbare Quellen, reproduzierbare Schritte, klare Grenzen.', delivery: 'Erste Integration innerhalb von 21 Kalendertagen.' },
      { tier: 'Custom Stack', hook: 'Systeme, die keine Kompromisse erzwingen.', desc: 'Sie erhalten ein maßgeschneidertes System auf Basis von Rust, TIS oder Ternlang - dort, wo fertige Frameworks zu langsam, zu unsicher oder zu teuer sind. Backend, API, Compiler, VM, Desktop, PWA, Embedded-Agent: alles aus einer Hand, vom selben Team, das die Forschung betreibt.\n\nKeine aufgeblähten Page-Builder, kein Vendor-Lock-in, keine Sprachen, die nur funktionieren, solange niemand genauer hinsieht. Wenn wir etwas bauen, bleibt es unter Ihrer Kontrolle - Quellcode, Toolchain, Infrastruktur.\n\nIdeal, wenn Standard-Software Ihre Frage nicht beantworten kann, weil die Frage selbst noch keine Standardantwort hat.', delivery: 'Definition of Done + Zeitplan innerhalb von 14 Kalendertagen.' },
      { tier: 'Architecture Lab', hook: 'Gemeinsam an der Architektur, bevor irgendjemand codet.', desc: 'Sie bekommen keinen fertigen Report, sondern eine Forschungs- und Systemarchitektur, die gemeinsam mit Ihnen entworfen wird - auf Basis von Lauras Emergent-Interaction-Methode oder ternärer KI-Architektur, je nach Fragestellung.\n\nDas Ergebnis ist kein PDF, sondern ein baufertiger Plan: Forschungsfrage, Prototyp, Validierungskriterien, Zeitplan. Wenn Sie es anschließend bauen lassen wollen, haben wir das gleiche Team. Wenn nicht, haben Sie trotzdem eine klare Architektur, die niemand aus einer Massenvorlage erzeugt hätte.\n\nGeeignet für Organisationen, die nicht nur konsumieren, sondern mitbestimmen wollen, wie die Systeme aussehen, auf die sie sich verlassen.', delivery: 'Architektur- und Forschungsplan innerhalb von 14 Kalendertagen.' },
      { tier: 'Full Spectrum Deploy', hook: 'Von der ersten Analyse bis zum laufenden Betrieb, alles aus einer Hand.', desc: 'Sie erhalten nicht nur ein System, sondern den gesamten Betrieb: Software-Installation, Systemintegration, Datenmigration, Team-Training und laufender Support. Wir verbinden die Dots, installieren die Software, trainieren die Leute und bleiben, bis es läuft, und danach.\n\nAlles aus einer Hand, vom selben Team, das die Forschung betreibt. Keine Übergaben an Dritte, keine Blackboxen, kein Vendor-Lock-in. Wenn wir etwas deployen, bleibt es unter Ihrer Kontrolle.\n\nIdeal für Organisationen, die nicht nur eine Lösung kaufen wollen, sondern eine komplette, betriebsbereite Infrastruktur, die sofort produktiv ist.', delivery: 'Definition of Done + Zeitplan innerhalb von 14 Kalendertagen.' },
    ],
    security: [
      { tier: 'Public', hook: 'Kostenlos, für immer. Funde werden nach 90 Tagen veröffentlicht, ausnahmslos.', desc: 'Wir stellen dieselbe quellcode-nahe Beobachtungsleistung bereit, die auch zahlende Kunden erhalten - kostenlos. Nach einer 90-Tage-Vorlauffrist wird der Fund auf unserem öffentlichen Ledger veröffentlicht, damit die betroffene Organisation Zeit zur Reaktion hat, bevor ihn jemand anderes sieht. Jeder Eintrag auf diesem Ledger unterliegt derselben Regel - groß oder klein, zahlend oder nicht. Kein Vertrag, keine Geheimhaltung, keine leisere Behandlung. Eingeschlossen ist die erste Handy-Privatsphäre-Sitzung: wir zeigen Ihnen, wie Sie die versteckten Tracker auf Ihrem eigenen Gerät abschalten.', delivery: 'Bericht innerhalb von 7 Kalendertagen.' },
      { tier: 'Remediation Advisory', hook: 'Keine PDF von der Stange. Eine Untersuchung mit unserer Methode gegen unseren Korpus.', desc: 'Sie bezahlen nicht für ein Dokument. Sie beauftragen eine Untersuchung mit unserer Methodik, dem Korpus dekompilierter Apps und der Quellen-Architektur - exakt der Struktur, mit der Funde auf dem öffentlichen Ledger abgelegt werden. Das Ergebnis ist ein nach Schwere geordneter Befund: genau, wie beobachtet wurde, jede Schwachstelle, eine konkrete Behebung für jede davon - innerhalb von 7 Kalendertagen. Dieselben Ingenieur:innen, die die Lücken gefunden haben, führen durch deren Schließung. Dreißig Tage später prüfen wir nach, ob die Fixes tatsächlich angekommen sind. Jeder Fund ist mit dem genauen Datenschutz-Artikel verknüpft, den er verletzt.\n\nDiese Stufe gibt Ihnen das Was: den Fund und die Behebung. Das Wie, unsere Methodik und die Werkzeuge dahinter, ist das, was die vertrauliche Stufe darunter noch hinzufügt.', delivery: 'Befund innerhalb von 7 Kalendertagen nach Zahlung.' },
      { tier: 'Confidential', hook: 'Dieselbe Untersuchung. Unter Geheimhaltung. Die Regulatoren erfahren es trotzdem.', desc: `Sie beauftragen dieselbe Untersuchung gegen unseren Korpus - unter Geheimhaltung. Das Ergebnis ist ein Befund, der jede Schwachstelle nach Schwere ordnet und exakt im Code verortet, plus eine Zusammenfassung, die nicht-technische Führungskräfte lesen können. Innerhalb von 7 Kalendertagen.\n\n${NDA_CLAUSE}\n\nSobald Sie Fixes ausliefern, testen wir manuell nach, ob die Lücken wirklich geschlossen sind - nicht nur auf dem Papier gepatcht.\n\nAls Non-Profit-Organisation, die an ihre eigenen Regeln gebunden ist, informieren wir die zuständigen Regulatoren trotzdem parallel, ohne Details, die Sie exponieren würden.`, delivery: 'Befund innerhalb von 7 Kalendertagen nach Zahlung.' },
      { tier: 'Enterprise & Critical Infrastructure', hook: 'NDA, NIS2-Notfallprotokoll, biometrische Datenflüsse nach Art. 9 - eine Stufe für alles, was die meisten Anbieter nicht anfassen.', desc: `Wir stellen Geheimhaltung, priorisierte Remediation-Zeit über das übliche 90-Tage-Fenster hinaus und direkten Zugang zu den Ingenieur:innen bereit. Für Betreiber kritischer Infrastruktur (Energie, Wasser, Gesundheit, Verkehr) übersetzen wir NIS2-Pflichten in Kontrollen, die Ihr Team tatsächlich umsetzen kann, und üben das Incident-Response-Protokoll mit Ihnen ein, bevor etwas schiefgeht.\n\n${NDA_CLAUSE}\n\nFür biometrische Daten (Art. 9) verfolgen wir jeden Fluss vollständig: Speicherfristen, grenzüberschreitende Übermittlungen, Verarbeitungszweck. Die meisten Sicherheitsanbieter fassen diese Kategorie nicht an.\n\nAuf Wunsch als laufender Auftrag: kontinuierliche Portfolio-Abdeckung statt Einzelaudit, mit vierteljährlichem Deep-Dive und fester Ansprechperson. Umfang und Preis werden mit Ihrem Team abgestimmt - kein Standardformular für Situationen, in denen Scheitern keine Option ist.`, delivery: 'Bericht ab 7 Kalendertagen, Umfang individuell.' },
    ],
  },

  tierCarousel: {
    getStarted: 'Jetzt starten',
    requestProposal: 'Angebot anfragen',
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
    eyebrow: 'Ablauf der Zusammenarbeit',
    heading: 'was nach dem Start passiert',
    subheading: 'Fünf Phasen, von einer einzelnen Beobachtung bis zu einem kontinuierlich schärfer werdenden Intelligence-Modell. Die Tiefe ändert sich mit der Frage; die Disziplin bleibt gleich. Jede Phase bleibt lückenlos nachvollziehbar, Whitebox by Design, jede Aktion lässt sich bis zur ursprünglichen Beobachtung zurückverfolgen.',
    steps: [
      { stage: 'Ingest', body: 'Wir beginnen mit dem, was Sie uns anvertrauen: einer Veränderung, einem Signal, einer Beziehung, einer Quelle oder einer Frage, aus Ihren Systemen, öffentlichen Daten oder einer von uns bereits beobachteten Domäne.\n\nEs wird nichts angefasst, bevor wir nicht jede einzelne Datei gelesen haben, nicht das README, nicht das Manifest, das eigentliche Ding. Der Ausgangspunkt kann klein sein. Das Modell ist es nicht.' },
      { stage: 'Normalize', body: 'Wir lösen Entitäten auf, mappen Beziehungen, ergänzen Zeitstempel und Provenance und bewahren, was unsicher bleibt. Unterschiedliche Vokabulare werden vergleichbar, ohne sie als identisch auszugeben.\n\nNichts wird ohne Herkunft akzeptiert. Unbekanntes wird nicht stillschweigend ergänzt.' },
      { stage: 'Trace', body: 'Wir vergleichen Zustände über die Zeit, verfolgen Abhängigkeiten, finden Brücken und Engpässe und prüfen, ob die Beobachtung zu einem bekannten oder domänenübergreifenden Muster passt.\n\nDie Frage lautet nicht nur, was sich verändert hat, sondern was damit verbunden ist.' },
      { stage: 'Emit', body: 'Eine relevante Veränderung wird zu einem Intelligence Event: Evidenz, Widerspruchsstatus, Konfidenz, betroffene Domänen, Netzwerkimplikationen und kommerzielle Relevanz in einem nachvollziehbaren Objekt.\n\nKein Urteil. Ein strukturiertes Event, das Sie untersuchen und nutzen können.' },
      { stage: 'Learn', body: 'Das Modell bewahrt stützende Evidenz, Widersprüche, offene Fragen und wiederkehrende Strukturen. Simulationen können prüfen, was unter einer Intervention geschehen könnte, klar als hypothetisch markiert.\n\nJede Beobachtung macht die nächste wertvoller.' },
    ],
  },

  coopPartners: {
    eyebrow: 'Forschungskooperation',
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
    eyebrow: 'Kontakt & Offenlegungen',
    heading: 'direkter draht',
    paragraph: 'Ein Formular, auch wenn es erstmal nur ein erstes Gespräch sein soll: eine allgemeine Frage, eine Serviceanfrage, eine Forschungskooperation - oder ein Sicherheitsfund. Bei Letzterem betreiben wir einen eigenen Aufnahmekanal, statt ihn an eine Drittanbieter-Bug-Bounty-Plattform weiterzuleiten - aus demselben Grund, aus dem wir uns weigern würden, selbst an eine solche verwiesen zu werden.',
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
        links: { research: 'Forschung', trackRecord: 'Evidenz', methodology: 'Methodik' },
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
