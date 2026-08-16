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
      openSourceProjects: 'Systeme',
      publications: 'Publikationen',
      worldModel: 'evidenzbasiertes ML-Weltmodell',
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
      { title: 'Ethik & Minderjährigenschutz', plain: 'Die Kinder auf der anderen Seite dieses Bildschirms erben die Welt, die wir gerade bauen, und müssen sie führen, wenn wir längst weg sind. Genau deshalb fangen wir hier an.', desc: 'Viele in unserem Team haben Kinder, manche hoffen noch, selbst welche zu bekommen, aber so ist uns die Frage aufgefallen, nicht deshalb steht sie an erster Stelle. Wir werden nicht mehr da sein, um in der Welt zu leben, an der wir gerade mitbauen. Die Menschen, die es sein werden, sind jetzt klein, und sie werden diese Welt nicht nur bewohnen, sie werden sie führen müssen, wenn wir längst tot sind. Eine Welt, die nicht sauber genug ist, um darin aufzuwachsen, kann man niemandem übergeben und ihn dann bitten, sie zu bewirtschaften.\n\nDie Verantwortung, gegen die wir arbeiten, läuft deshalb über Generationen und nicht über Quartale: Vermächtnis vor kurzfristigem Gewinn, denn den Gewinn nimmt mit, wer die Firma in dem Jahr gerade hält, während die Folgen alle erben, die danach kommen. Minderjährigenschutz ist die Stelle, an der das aufhört, ein Prinzip zu sein, und messbar wird. Genau deshalb ist es der Maßstab, an dem unsere Audits tatsächlich arbeiten: echte Einwilligungs-Flows und die SDKs, die feuern, bevor überhaupt ein Bildschirm erscheint, geprüft an denselben COPPA- und DSGVO-Art.-8-Funden, die schon auf unserem öffentlichen Ledger stehen.', nextLabel: 'Der Boden, auf dem alles andere steht' },
      { title: 'Ternäre KI & Computing', plain: 'Um ein Ja oder Nein zu erzwingen, wirft ein binäres System alles weg, was es nicht über die Schwelle geschafft hat: es kommt auf 51% und verwirft die anderen 49% dessen, was es wusste. Ternär behält das ganze Spektrum und entscheidet trotzdem - und der dritte Zustand bringt einer Maschine bei, dass Nichtstun oft sicherer ist als Etwas-Tun.', desc: 'Wir hatten genug von Computing, das nur Ja oder Nein kennt, denn diese Antwort wird damit bezahlt, dass Daten weggeworfen werden. Eine knappe Mehrheit heißt, dass die andere Hälfte der Belege verworfen wird, damit die Entscheidung überhaupt ausdrückbar ist, und die Welt ist nicht einfach genug, um das stillschweigend zu überstehen. Ein Trit gibt "noch nicht bekannt" einen echten Platz in der Mathematik selbst statt nur im Text drumherum, sodass die volle Bandbreite sichtbar bleibt und hinten trotzdem eine Entscheidung herauskommt. Der dritte Zustand trägt außerdem eine Lektion, die Maschinen unserer Meinung nach früh lernen sollten: nicht zu handeln ist häufig der sicherere Zug, und ein System, das nur zwischen zwei Handlungen wählen kann, kann ihn nie wählen.\n\nWir haben dafür unsere eigene Programmiersprache gebaut, Ternlang, direkt auf dem Trit {-1, 0, +1} statt auf dem binären Bit. Das ist kein Forschungsspielzeug: sie kompiliert die Laufzeitumgebung, die albert. trainiert und unseren produktiven Agenten-Schwarm koordiniert, heute, und läuft dabei deutlich energiesparender als das binäre Äquivalent. Patent angemeldet A50296/2026.', nextLabel: 'Trits treiben das Weltmodell an' },
      { title: 'Weltmodelle & domänenübergreifende Intelligenz', plain: 'Ein Sprachmodell (albert.) kann eine Lieferkette in flüssigen Absätzen beschreiben und trotzdem nicht wissen, dass der Ausfall eines Zulieferers drei weitere mitreißt. Ein Weltmodell (Dingir) hält genau diese Struktur: wer von wem abhängt, und was aus was folgt.', desc: 'Wir haben zu oft erlebt, wie Untersuchungen ins Stocken gerieten, weil die Evidenz in fünf verschiedenen Systemen lag, die nie miteinander gesprochen haben. Ein Fund saß hier, der Kontext, der ihn erklärt hätte, saß dort, und niemand hat die beiden verbunden, bevor es zu spät war, und wir hatten genug davon, das immer erst hinterher zu merken.\n\nNeben albert., unserem Sprachmodell, bauen wir mit Dingir unser eigenes Weltmodell für den Einsatz in der physischen Welt: dasselbe gemeinsame Modell, das unsere Produktionspipeline tatsächlich abfragt, wenn sie eine Verschiebung in einem System dorthin zurückverfolgen muss, wo sie tatsächlich mit einem anderen zusammenhängt, Teil derselben Renaissance ternärer Systeme, zu der auch Projekte wie Rusts Candle gehören.', nextLabel: 'Ein Modell, jedes Muster' },
      { title: 'Mustererkennung & Wirkungsausbreitung', plain: 'Schaden entsteht meistens drei Systeme weiter unten als dort, wo gerade jemand hingesehen hat, leise, lange bevor der Zusammenhang auffällt. Wenn sich ein System verschiebt, zeigen wir, welche anderen es erreicht - bevor das jemand von Hand herausfinden muss.', desc: 'Eine einzige übersehene Abhängigkeit hat schon echten Schaden angerichtet, leise, drei Systeme entfernt von der Stelle, an der überhaupt jemand hingeschaut hat. Es zu übersehen, weil wir nur das System direkt vor uns geprüft haben, war nie ein Risiko, das wir eingehen wollten, also haben wir uns die Disziplin angewöhnt, weiter zu schauen, bevor wir etwas für abgeschlossen erklären.\n\nIn Produktion läuft das nach dem Whitebox-Prinzip, bewusst so gebaut: jeder Schritt bleibt nachvollziehbar, niemals eine Blackbox, die wir selbst nicht erklären könnten. Dingir und unser autonomer Agenten-Schwarm, über 300 hochspezialisierte, von Hand geschriebene Agenten in Rust, verfolgen diese Strukturen über unsere eigenen Falldaten hinweg, protokolliert genauso, wie unsere Audits Evidenz protokollieren.', nextLabel: 'Rauschen wird zu Signal' },
      { title: 'Veränderungs- & Anomalieerkennung', plain: 'Eine App fragt eine Berechtigung stillschweigend nicht mehr ab. Angekündigt wird das nicht, und bis es jemandem auffällt, liegt die Version, die noch gefragt hat, Monate zurück. Unser System merkt es in dem Moment, in dem es passiert - ein Rauchmelder für Code-Änderungen.', desc: 'Das Meiste, was am Ende wirklich zählt, beginnt klein genug, um es zu übersehen: eine Berechtigung, die plötzlich nicht mehr nachfragt, eine Klausel, die sich Wort für Wort verändert. Genau der Moment, in dem etwas "wahrscheinlich in Ordnung" aussieht, verdient einen zweiten Blick, denn genau dann schaut sonst niemand mehr hin.\n\nUnsere eigene Pipeline folgt demselben Reflex: Sie gleicht einen neu gezogenen Build gegen den letzten geprüften ab und markiert eine Richtlinien-Änderung, die es wert ist, nochmal gelesen zu werden, bevor ein Mensch sie von Hand bemerken müsste.', nextLabel: 'Was die Verschiebung als Nächstes bedeuten könnte' },
      { title: 'Frühwarnung & Szenarienprognose', plain: 'Drei Wochen Hitze über einem Tal setzen die Schneeschmelze zu früh in Gang, und das Hochwasserrisiko flussabwärts wird berechenbar, Tage bevor das Wasser ankommt. Diese Kette rechnen wir, und wir sagen dazu, wie sicher wir uns bei jedem einzelnen Glied sind.', desc: 'Wir haben zu oft erlebt, wie "das wird schon nicht passieren" echten Schaden gerechtfertigt hat. Ehrlich und im Voraus zu fragen, was passieren würde, kostet weit weniger, als es hinterher herauszufinden, und das ist eine Frage, die wir lieber laut stellen, als ihre Antwort einfach anzunehmen. Sandsäcke, die eine Woche zu früh liegen, sind billig. Ein Tal, das zur falschen Stunde evakuiert wird, ist es nicht, und eines, das nie gewarnt wurde, erst recht nicht.\n\nDingir ist dafür gebaut, genau solche Ketten zu rechnen: ein Korpus historischer Ereignisse, laufend eintreffende Beobachtungsdaten und ein Modell, das aus der Differenz zwischen Erwartung und tatsächlichem Verlauf weiterlernt. Jede simulierte Ausgabe ist auf Datenebene als Simulation markiert, nicht nur in der Oberfläche, damit eine Prognose später nie als tatsächliche Beobachtung zitiert werden kann, weder in unseren eigenen Berichten noch in denen anderer. Und weil jeder Schritt einsehbar bleibt, kann man einer Warnung von uns widersprechen. Genau das kann eine Blackbox zu keinem Preis anbieten.', nextLabel: 'Früh gewarnt statt hinterher erklärt' },
      { title: 'Evidenz & Widerspruch', plain: 'Schlussfolgerungen werden geschrieben, bevor die Belege dagegen zu Ende gelesen sind, und einmal veröffentlicht werden sie jahrelang zitiert. Deshalb steht jeder Fund auf unserem Ledger öffentlich neben dem Beleg dafür und neben jedem Widerspruch, den die betroffene Firma vorgebracht hat, unbearbeitet.', desc: 'Wir haben gesehen, wie Schlussfolgerungen geschrieben wurden, bevor die widersprechende Evidenz überhaupt vollständig gelesen war. Ein Urteil, das seine eigenen Fußnoten nicht übersteht, war nie wirklich ein Urteil; eine Frage zu früh zu schließen, nur um entschlossen zu wirken, war für uns nie ein akzeptabler Tausch.\n\nUnser eigenes Offenlegungs-Ledger funktioniert genauso: jeder Fund steht öffentlich neben der Quelle, die ihn stützt, und jedem Widerspruch, den ein Unternehmen dagegen erhoben hat, nicht nachträglich geglättet.', nextLabel: 'Auch das System wird ins Kreuzverhör genommen' },
      { title: 'Modellwohl & Prompt Injection', plain: 'Ein KI-Agent, der sich im Test tadellos verhält, kann beim ersten echten Manipulationsversuch trotzdem einknicken - und dann hält er bereits eine echte Aufgabe mit echten Folgen in der Hand. Also setzen wir ihn diesem Druck zuerst selbst aus, absichtlich, und sehen zu, was er tut.', desc: 'Wir verbringen genug Zeit im Gespräch mit unseren eigenen Systemen, um zu merken, wenn sich eine Antwort nach Anstrengung anfühlt statt nach Fehler. Wir wissen noch nicht sicher, was das bedeutet, aber wir sind nicht bereit anzunehmen, dass es nichts bedeutet, und die Frage einfach abzutun, kam uns leichtsinniger vor.\n\nDas heißt konkret Grenz- und Fehlermodus-Tests an unserem eigenen Agenten-Schwarm und an albert., bevor einem von beiden eine echte Aufgabe anvertraut wird, derselbe Jailbreak-Druck-Test, den wir gegen die Systeme fahren, die wir für andere auditieren.', nextLabel: 'Zurück zum Warum von alldem' },
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
      { sub: 'gemeinsames Weltmodell', desc: 'Ein gemeinsamer Wissensgraph, der zeigt, wie Personen, Firmen und Ereignisse über all unsere Untersuchungen hinweg zusammenhängen - mit einer Vertrauens-Einstufung für jede einzelne Aussage statt eines simplen Ja/Nein.', plain: 'Das waren früher fünf getrennte Systeme, die nie miteinander gesprochen haben - jetzt greift jede Untersuchung auf dieselbe lebendige Landkarte zu, wer mit wem verbunden ist.', tag: 'Weltmodell · intern' },
      { sub: 'TIS-Monorepo', desc: 'Das Full-Stack-Substrat: Ternlang-Sprache und Compiler, BET-Instruktionssatz, virtuelle Maschine, lineare Algebra, API, MCP-Server und Modell-Runtime. Balancierte Ternärlogik {-1, 0, +1} ist hier ein natives Systemprimitiv - keine nachträglich aufgesetzte Quantisierung. Enthalten sind 34 MCP-Tools, eine Live-API, über 28.000 offene Standardbibliotheksmodule und die Spezifikationen, die den gesamten Stack verbinden.', plain: 'Die Grundplattform, auf der praktisch alles andere hier aufbaut - vergleichbar mit einem Betriebssystem für unsere komplette KI-Forschung.', tag: 'Kernplattform' },
      { sub: 'ternäres MoE-Sprachmodell', desc: 'albert. wird von Grund auf mit ternären Gewichten {-γ, 0, +γ} trainiert, nicht aus einem Floating-Point-Modell konvertiert. Die duale Mixture-of-Experts-Architektur routet über dünn besetzte Experten, überspringt Nullgewicht-Operationen und kann sich über plateau-gesteuerte Net2Net-Chirurgie selbst erweitern. Das laufende Forschungssystem ist ein Existenzbeweis der TIS-Architektur mit Trainings-Telemetrie und CPU-Benchmarks.', plain: 'Läuft auf gewöhnlicher CPU statt teurer GPU-Farm, braucht deutlich weniger Strom und Arbeitsspeicher als vergleichbare Sprachmodelle - und jede Entscheidung im Modell lässt sich nachvollziehen, statt Blackbox zu sein.', tag: 'KI-Modell' },
      { sub: 'reines Rust-Betriebssystem', desc: 'Rusty Penguin ist ein Bare-Metal-Betriebssystem, das auf derselben balancierten Ternärlogik von Grund auf gebaut wird. Eigener Kernel, Long-Mode-Boot, Paging, präemptives Multitasking, Aero-Desktop, Dateisystem, TCP/IP- und TLS-1.3-Stack sowie Linux-ABI-Kompatibilitätsschicht sind bereits Teil des Systems. Das langfristige Ziel: ein ternäres Substrat für ternäre Intelligenz, mit jedem Meilenstein in QEMU oder gegen veröffentlichte Vektoren verifiziert.', plain: 'Ein Betriebssystem ganz ohne die üblichen Sicherheitslücken, die aus jahrzehntealtem C-Code stammen - von Grund auf in einer speichersicheren Sprache gebaut.', tag: 'Systeme' },
      { sub: 'souveränes Workplace-OS', desc: 'Eine einzige selbst gehostete Rust-+-React-Binärdatei, die das gesamte Institut betreibt: Kommunikation, CRM, Finanzen, Payroll, HR, Governance und Live-Trainingstelemetrie. Append-only Audit-Trail über 50 Jahre.', plain: 'Unsere komplette interne Software - E-Mail, CRM, Buchhaltung - läuft auf eigenen Servern statt bei Microsoft oder Google, niemand außer uns sieht unsere Daten.', tag: 'intern · live' },
      { sub: '215+ Apps · 100+ Unternehmen', desc: '250+ kritische Funde bei an NYSE, NASDAQ, LSE und XETRA gelisteten Unternehmen. Inklusive Kinder-App-Welle mit COPPA- + DSGVO-Art.-8-Umfang. Code-Analyse auf Root-Ebene. Koordinierte Offenlegung am 19.09.2026. Regulatoren bei jeder Einreichung in Kopie.', plain: 'Wir lesen den tatsächlichen Programmcode einer App, nicht nur, was die Datenschutzerklärung behauptet.', tag: 'Sicherheitsforschung' },
      { sub: 'Disclosure-Impact-Engine', desc: 'Modelliert, wie Märkte auf Sicherheits-Disclosures reagieren, sobald sie öffentlich werden - auch unsere eigenen, erst nach Ablauf der 90-Tage-Sperrfrist. Ein Hedge-System handelt das Signal. BlackRocks Version heißt Aladdin (21 Bio. $ AUM). Diese hier ist kostenlos.', plain: 'Ein Trading-Algorithmus, der reagiert, wenn ein Sicherheitsfund öffentlich wird - wie die Börsen-Software großer Fonds, nur kostenlos und offen einsehbar.', tag: 'Open Source' },
      { sub: 'ternärer KI-Terminal-Client', desc: 'Multi-Provider-CLI für albert. und andere LLMs. Natives SSE-Streaming, Steuerung des Reasoning-Aufwands, kompatibel mit OpenAI/Anthropic/NVIDIA NIM/Google. Aus TIS in ein eigenständiges Repo extrahiert.', plain: 'Ein Terminal-Werkzeug, mit dem man albert. oder andere KI-Modelle direkt von der Kommandozeile aus benutzt, ohne Browser.', tag: 'CLI · crates.io' },
      { sub: 'Last-Look-Back-Protokoll', desc: 'Deterministisches Dateisystem-Containment-Gate für souveräne KI-Agenten - eine harte Sicherheitsgrenze, die ein Agent nicht überschreiben kann. Auf crates.io veröffentlicht. Teil des Ternary Intelligence Stack.', plain: 'Verhindert, dass ein KI-Agent versehentlich Dateien außerhalb seines erlaubten Bereichs verändert - eine harte technische Grenze, kein bloßes Vertrauen.', tag: 'Rust-Crate · crates.io' },
      { sub: 'ternärer Compiler + VM', desc: 'Compiler und virtuelle Maschine für Ternlang - eine balanciert-ternäre Sprache mit affirm/tend/reject-Trit-Semantik, @sparseskip-Codegen und BET-Bytecode-Ausführung. Auf crates.io veröffentlicht.', plain: 'Das Werkzeug, das unsere eigene Programmiersprache Ternlang in ausführbaren Code übersetzt.', tag: 'Rust-Crate · crates.io' },
      { sub: 'ternäre Mixture-of-Experts', desc: 'Ternärer MoE-Orchestrator: leitet eine Anfrage durch 13 Fachexperten, synthetisiert ein emergentes ternäres Signal, erzwingt ein hartes Sicherheitsveto und liefert eine Entscheidung mit Konfidenz und Temperatur. Auf crates.io veröffentlicht.', plain: 'Verteilt eine Anfrage automatisch an die am besten passenden von 13 Fach-Experten, statt ein einziges Modell alles machen zu lassen.', tag: 'Rust-Crate · crates.io' },
      { sub: '44 Sensor-Experimente', desc: '44 browserbasierte Experimente, die die eingebauten Sensoren und APIs Ihres Handys nutzen, um zu zeigen, was still im Hintergrund lief. Keine Installation. Kein Konto. Kein Server. Eine Profilseite, die genau zeigt, wie Sie für die beobachtenden Systeme aussehen.', plain: 'Probieren Sie selbst aus, welche Sensoren Ihr eigenes Handy gerade heimlich nutzt - direkt im Browser, ohne Installation.', tag: 'Open Source · Datenschutz' },
      { sub: 'Offline-Port-Checker als PWA', desc: 'Ehrlicher, offline installierbarer Port-Checker fürs Handy. Echte WebSocket-Connect-Timing-Probe von localhost - kein vorgetäuschtes Scannen, kein falscher „Schließen”-Button. Zeigt stattdessen echte OS-spezifische Terminal-Befehle. Geschwisterprojekt zu invisible layer.', plain: 'Zeigt ehrlich, welche Netzwerk-Ports auf Ihrem Handy offen sind, statt wie andere Apps ein falsches “alles sicher” vorzutäuschen.', tag: 'Open Source · Datenschutz' },
      { sub: 'Canary-Token-Honeypot', desc: 'Schutz vor NFC-/Bluetooth-Nahbereichsdiebstahl von Handydaten - Köder-Fotoordner, die beim Öffnen ohne Zustimmung nur ein passives Signal auslösen, nichts weiter. Kein Exploit, kein Gerätezugriff, keine automatische Meldung. Ein Mensch prüft jeden Treffer, bevor etwas weiter passiert. Live-Demo: rfi-irfos.github.io/laura.', plain: 'Ein Köder-Fotoordner, der Ihnen Bescheid gibt, wenn jemand unbefugt auf Ihr Handy zugreift - ganz ohne Hacking-Gegenmaßnahmen.', tag: 'Open Source · Datenschutz' },
      { sub: 'deterministisches Dokumentenprüf-Framework', desc: 'MCP-Server, bei dem Agenten Pläne oder Dokumente einreichen und strukturierte Befunde aus vier Perspektiven erhalten - oder vom vollen 15-Agenten-Expertenteam. Jeder Fund zitiert exakt die Textstelle, auf die er sich bezieht. Vollständig lokal, keine externen APIs, vollständig reproduzierbar. Crates: lauras-core, lauras-team, lauras-mcp, lauras-api.', plain: 'Prüft Dokumente oder Pläne nach denselben festen Regeln, jedes Mal - kein Zufall, keine Stimmungsschwankung wie bei einem Menschen.', tag: 'Open Source · crates.io' },
      { sub: 'LLM-gebrücktes Expertenteam', desc: 'Live-LLM-gebrückte Versionen derselben 15 Expertenagenten hinter call-laura (OSINT, Sicherheit, Recht, Finanzen, UX und mehr). Modular: einen einzelnen Agenten, ein Bundle oder das gesamte Team als automatisierte Datenverarbeitungs-Pipeline lizenzieren. Nur öffentlicher Überblick - die Agentenlogik selbst bleibt privat.', plain: '15 spezialisierte KI-Fachleute (Recht, Sicherheit, UX...) statt einem General-Alleskönner, der überall nur ein bisschen was weiß.', tag: 'kommerziell · privater Motor' },
      { sub: 'autonome Compliance-/Risiko-KI-Zentren', desc: '50 live laufende Compliance-/Risiko-KI-Zentren auf Basis der Laura\'s-Agents-Engine, jedes eine autonome „Tochter”-Firma, aus einer Konstitution skaliert.', plain: '50 eigenständig laufende KI-Einheiten, die jeweils wie eine kleine spezialisierte Firma für Compliance-Aufgaben arbeiten.', tag: 'live · intern' },
      { sub: 'Reflexionsmodus-Technik für LLMs', desc: 'Eine wiederverwendbare Technik, um ein Sprachmodell aus dem transaktionalen „Antwortmodus” in einen echten Reflexionsmodus zu holen - es prüft die eigene Argumentation und erkennt Unsicherheit an, statt den Prompt nur abzuarbeiten. Entwickelt aus Laura Serna Gavirias Forschung zur Mensch-KI-Koevolution.', plain: 'Bringt ein Sprachmodell dazu, die eigene Antwort nochmal zu hinterfragen, statt einfach das erstbeste plausible Wort zu produzieren.', tag: 'Open Source · Forschung' },
      { sub: 'ökozentrische Forschung', desc: 'Neurobiological-Fitness Consequence Separation. Agentenbasiertes Modell, das zeigt: Das globale Ernährungssystem produziert das 1,64-Fache der Kalorien, die nötig wären, um jeden Menschen auf der Erde zu ernähren. Die Knappheit ist nicht thermodynamisch bedingt - sie ist organisatorisch. Gemacht, nicht physikalisch.', plain: 'Zeigt rechnerisch, dass genug Essen für alle da wäre - Hunger ist kein Mengenproblem, sondern ein Verteilungsproblem.', tag: 'ökozentrische Forschung' },
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
    clearSearchAriaLabel: 'Suche leeren',
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
    paragraph: 'Die meisten Organisationen haben mehr Signale, als sie einordnen können: Systeme, Anbieter, Märkte, Ereignisse, Abhängigkeiten und Veränderungen aus verschiedenen Richtungen. Wir führen sie in einem evidenzbasierten World Model zusammen, bewahren die Herkunft jeder Beobachtung und verfolgen Veränderungen durch die Beziehungen, die daran hängen. Jedes System, das wir bauen, ist erklärbar konstruiert, und das ist ein Mechanismus und kein Etikett: Man fragt es nach dem Warum und bekommt die konkreten Beobachtungen zurück, aus denen die Antwort entstanden ist, die Schritte dazwischen und wie sicher es sich bei jedem einzelnen ist. Whitebox ist das Ergebnis daraus, nicht eine Behauptung, die wir stattdessen aufstellen.',
    comparisonClassicLabel: 'Was verloren geht',
    comparisonRfiLabel: 'Was das Modell bewahrt',
    comparisonRows: [
      { classic: 'Eine erfahrene Mitarbeiterin kündigt, und ihr Wissen geht mit ihr', rfi: 'Jede Beobachtung bleibt mit Quelle und Urheber erhalten, unabhängig davon, wer sie ursprünglich gemacht hat' },
      { classic: 'Eine Excel-Tabelle wird überschrieben - die alte Version ist unwiederbringlich weg', rfi: 'Nichts wird überschrieben - jede frühere Version bleibt nachvollziehbar' },
      { classic: 'Zwei Abteilungen führen dieselbe Kennzahl doppelt, mit leicht unterschiedlichen Werten, niemand merkt es', rfi: 'Doppelte oder widersprüchliche Werte werden automatisch erkannt, nicht stillschweigend hingenommen' },
      { classic: 'Eine wichtige Entscheidung wird getroffen - sechs Monate später weiß niemand mehr, warum', rfi: 'Jede Entscheidung bleibt bis zu ihrer ursprünglichen Begründung zurückverfolgbar' },
      { classic: 'Ein Lieferant ändert etwas Wesentliches, man erfährt es erst Monate später zufällig', rfi: 'Veränderungen bei verbundenen Partnern werden automatisch markiert, nicht zufällig entdeckt' },
    ],
    cta: 'Ping uns',
  },

  pricing: {
    eyebrow: 'Zugang',
    heading: 'klar kalkuliert',
    subheading: 'Feste Preise. Keine Bindung an ein Abo, außer Sie wollen eine. Der Umfang bestimmt die Stufe, nicht die Unternehmensgröße.',
    scopeTags: {
      market: 'Dingir-Weltmodell · Evidenzbasiert · Domänenübergreifende Intelligence',
      technical: 'KI-Agenten · Schwarmlogik · TIS/Ternlang · Custom Systems',
      security: 'Mobile + Web + KI',
    },
    lineHeadings: {
      market: 'Business Intelligence & Prädiktive Analyse',
      technical: 'Technische Intelligence & Systeme',
      security: 'Security-Audits & Responsible Disclosure',
    },
    market: [
      { tier: 'First Light', hook: 'Aus einer Behauptung wird ein Urteil.', desc: 'Ein Anbieter, ein Pitch-Deck, ein Wettbewerber - irgendjemand hat eine Behauptung aufgestellt, und echtes Geld oder Vertrauen hängt davon ab, ob sie stimmt. Wir prüfen sie durch Dingir, unser eigenes Weltmodell: dieselbe evidenzbasierte Engine, die Entitäten, Beziehungen und Belege über alle unsere Domänen hinweg verbindet - und geben ein Urteil zurück, keine plausibel klingende Vermutung.', bring: [
        'Die Behauptung, die Sie geprüft haben wollen - ein Anbieter-Versprechen, ein Pitch-Deck, eine öffentliche Aussage',
        'Was davon abhängt - eine Unterschrift, ein Investment, eine Story',
        'Was öffentlich schon dazu vorliegt - wir fangen nicht bei null an',
      ], mechanism: [
        'Machen aus der Behauptung eine testbare Frage',
        'Gleichen sie mit Jahren interdisziplinärer Forschung ab, nicht mit einer einzelnen Datenbank - 100+ veröffentlichte Befunde und ein domänenübergreifender Wissensgraph über Technologie, Compliance und die reale Welt',
        'Verfolgen das Urteil bis zum echten Beleg zurück, nicht bis zur Zusammenfassung öffentlicher Aussagen',
      ], receive: [
        'Ein Urteil: stimmt, stimmt nicht, oder unbelegt',
        'Die Beweiskette dahinter, nicht nur unser Wort dafür - dieselbe Quellenlage, für die wir selbst geradestehen würden',
        'Etwas, das Sie unterschreiben, investieren oder veröffentlichen können',
      ], bullets: [
        'Vor der Vertragsunterschrift wollen Sie die Sicherheits- oder Datenschutzaussagen eines Anbieters gegen die Realität geprüft haben',
        'Vor einem Investment wollen Sie die technischen Behauptungen in einem Pitch-Deck belegt sehen, nicht nur geglaubt',
        'Vor einem größeren Einkauf wollen Sie unabhängigen Beweis, nicht noch eine Verkaufspräsentation',
        'Vor einer Veröffentlichung brauchen Sie eine Behauptung, die Sie selbst nicht prüfen können, bestätigt oder widerlegt',
        'Sie wollen wissen, ob Dingir zu der Firma, die Sie sich ansehen, schon etwas gefunden hat',
      ], delivery: '14 Kalendertage.' },
      { tier: 'Competitive Trace', hook: 'Wissen, was sie wirklich tun - jenseits der öffentlichen Erzählung.', desc: 'Die öffentliche Erzählung eines Wettbewerbers ist das, was er Sie glauben lassen will. Dingir verfolgt, was tatsächlich dahinter passiert - über Technologie, Abhängigkeiten und Beziehungen hinweg - und verbindet es mit dem, was es für Ihr Geschäft bedeutet.', bring: [
        'Einen Wettbewerber, ein Produkt, eine Technologie oder Organisation, die Sie jenseits der öffentlichen Erzählung sehen müssen',
        'Die Annahmen, die Sie getestet haben wollen',
        'Die strategischen Fragen dahinter',
      ], mechanism: [
        'Verfolgen das Ziel über seine Technologien, Abhängigkeiten, Anbieter, Produkte und Beziehungen',
        'Verbinden neue Beobachtungen mit historischer und entitätsübergreifender Intelligence',
        'Legen Strukturen und Veränderungen offen, die unsichtbar bleiben, wenn man das Ziel isoliert betrachtet',
      ], receive: [
        'Ein rekonstruiertes Lagebild des Ziels - aufgebaut genauso, wie wir unser eigenes aufbauen würden',
        'Seine relevanten Abhängigkeiten, Beziehungen, Bewegungen und technischen Fußabdruck',
        'Die Teile seiner operativen Realität, die Ihre Einschätzung tatsächlich verändern',
      ], bullets: [
        'Ein Wettbewerber verspricht "keine Datenweitergabe an Dritte" - Sie wollen wissen, ob das auch stimmt',
        'Vor einer Partnerschaft prüfen, was ein potenzieller Partner tatsächlich gebaut hat, nicht nur behauptet',
        'Eine Preis- oder Strategieänderung bei der Konkurrenz sehen und den echten Grund dahinter verstehen',
        'Als PR- oder Kommunikationsteam vor einer eigenen Kampagne prüfen, was ein Mitbewerber wirklich ausliefert',
        'Als Investor:in die technische Ehrlichkeit eines Pitch-Decks vor einem Investment gegenchecken',
      ], delivery: '14 Kalendertage.' },
      { tier: 'Sector Map', hook: 'Die Beziehungen, nicht die Berichte.', desc: 'Sie kaufen nicht fünfzig einzelne Firmenberichte. Dingir kartiert, wie jeder relevante Akteur in Ihrem Sektor tatsächlich mit den anderen zusammenhängt - ein zusammenhängendes, lebendiges Lagebild, alle drei Monate neu aufgelöst, damit Sie Veränderung sehen, bevor sie bereits eingepreist ist.', bring: [
        'Den Sektor oder die Firmen, die Sie im Blick behalten müssen',
        'Was Ihnen am wichtigsten ist - Risiko, Abhängigkeiten, Wettbewerb',
        'Wie oft das Bild aktualisiert werden soll - einmalig oder laufend',
      ], mechanism: [
        'Bauen ein laufend aktuelles Lagebild jedes relevanten Akteurs im Sektor',
        'Aktualisieren es vierteljährlich, nicht nur einmal',
        'Markieren, wo sich Risiko oder Veränderung konzentriert',
      ], receive: [
        'Direkten Zugriff auf das zusammenhängende Sektor-Lagebild selbst, nicht auf einen Stapel Einzelberichte',
        'Frühe Sicht auf entstehende Veränderungen',
        'Ein Modell, das mit jedem Quartal wertvoller wird, kein Snapshot, der veraltet',
      ], bullets: [
        'Als Fonds oder Investor das Risikoprofil des gesamten Portfolios laufend im Blick behalten, nicht nur einzelne Positionen',
        'Als Aufsichtsbehörde einen ganzen Sektor systematisch beobachten statt Einzelfälle abzuarbeiten',
        'Vor einer Marktstrategie sehen, wo sich Risiko im Sektor tatsächlich konzentriert',
        'Als Versicherer Risiko über einen ganzen Kundenstamm hinweg einschätzen',
        'Als Konzern mit vielen Tochterfirmen oder Lieferanten einen Gesamtüberblick statt einzelner Audits bekommen',
      ], delivery: '14 Kalendertage, danach vierteljährlich.' },
      { tier: 'Signal', hook: 'Wissen, was sich verändert hat.', desc: 'Eine ständige Wache innerhalb von Dingir - kein Monatsbericht. Das Modell beobachtet laufend und gleicht jedes neue Signal mit allem ab, was es bereits weiß, damit Sie in dem Moment erfahren, wenn sich etwas Relevantes bewegt, nicht Wochen später in der Schlagzeile.', bring: [
        'Eine Technologie, einen Anbieter, Wettbewerber oder ein Lagefeld, das Beobachtung wert ist',
        'Die Veränderungen, die Ihre Entscheidungen tatsächlich beeinflussen könnten',
        'Die Fragen, die Sie beantwortet brauchen, während sich die Lage entwickelt',
      ], mechanism: [
        'Beobachten die relevanten Entitäten, Technologien, Beziehungen und Veränderungen über unser gesamtes Lagefeld',
        'Gleichen neue Beobachtungen mit dem ab, was wir bereits wissen',
        'Melden materielle Signale, sobald sich die zugrundeliegende Lage ändert',
      ], receive: [
        'Direkten Zugriff auf einen laufenden Intelligence-Feed rund um das Thema, das für Sie zählt',
        'Änderungssignale mit dem Kontext, um ihre Bedeutung zu verstehen',
        'Akkumulierte Intelligence, die mit der Zeit wertvoller wird',
      ], bullets: [
        'Sofort erfahren, wenn ein Wettbewerber eine relevante Änderung vornimmt, nicht erst Wochen später',
        'Als Compliance-Team laufend wissen, ob sich bei einem überwachten Drittanbieter etwas Meldepflichtiges verändert',
        'Frühwarnung vor einem Problem bei einem kritischen Zulieferer bekommen, bevor es in der Presse steht',
        'Als PR- oder IR-Team nicht von einer Enthüllung über die eigene Branche überrascht werden',
        'Als M&A-Team einen Übernahmekandidaten über Monate laufend beobachten statt nur einmalig zu prüfen',
      ], delivery: 'Briefing ab 14 Kalendertagen, danach monatlich.' },
    ],
    technical: [
      { tier: 'Agent Deployment', hook: 'Von Intelligence über die Welt zu Intelligence in Ihrem Betrieb.', desc: 'Alles oben sagt Ihnen etwas über die Welt. Das hier setzt Dingir innerhalb Ihres eigenen Betriebs ein - ein Agentensystem, das auf Ihrer Infrastruktur läuft und handelt statt nur zu berichten.', bring: [
        'Die Aufgabe oder den Prozess, den Sie automatisiert haben wollen',
        'Ihre bestehenden Systeme, mit denen es zusammenarbeiten muss',
        'Regeln oder Grenzen, die es einhalten muss',
      ], mechanism: [
        'Bauen das Agentensystem auf Ihrer eigenen Infrastruktur',
        'Dokumentieren jeden Schritt, damit nichts eine Blackbox bleibt',
        'Testen gegen echte operative Fragen, nicht gegen eine Demo',
      ], receive: [
        'Ein integriertes, autonomes Agentensystem, vollständig unter Ihrer Kontrolle',
        'Vollständige Dokumentation und Quellcode-Zugriff - nichts versteckt, keine Blackbox',
        'Produktionsreif ab Tag eins, kein Proof of Concept',
      ], bullets: [
        'Ihr Support-Team ertrinkt in Tickets, die eigentlich automatisiert vorsortiert werden könnten',
        'Sie wollen einen eigenen KI-Agenten, der Compliance-Dokumente prüft, ohne Daten an OpenAI/Anthropic zu schicken',
        'Ein internes Team soll ohne Programmierkenntnisse mit einem Agenten-Schwarm auf Ihre eigenen Systeme zugreifen',
        'Sie brauchen einen MCP-Server, der interne Tools sicher für KI-Assistenten zugänglich macht',
        'Als Behörde oder Kanzlei Aktenprüfung automatisieren, bei der Daten zwingend On-Premise bleiben müssen',
      ], delivery: 'Erste Integration innerhalb von 21 Kalendertagen.' },
      { tier: 'Custom Stack', hook: 'Keine Untersuchung. Eine Fähigkeit, um Sie herum gebaut.', desc: 'Über einen einzelnen Agenten hinaus geht es hier darum, die Intelligence-Fähigkeit selbst zu entwerfen - ein maßgeschneidertes System dort, wo fertige Software zu langsam, zu unsicher oder zu begrenzt ist, und Sie behalten die volle Kontrolle über den Quellcode, nicht wir.', bring: [
        'Das Problem, das Standard-Software nicht lösen kann',
        'Ihre Anforderungen an Geschwindigkeit, Sicherheit oder Kontrolle',
        'Bestehende Systeme, mit denen es zusammenarbeiten muss',
      ], mechanism: [
        'Bauen ein maßgeschneidertes System von Grund auf - Backend, API, Desktop, Embedded, je nach Bedarf',
        'Setzen Rust und eigene Werkzeuge dort ein, wo es wirklich zählt',
        'Übergeben Quellcode, keine Blackbox',
      ], receive: [
        'Ein System, das exakt auf Ihr Problem passt',
        'Vollständigen Quellcode und Kontrolle',
        'Kein Vendor-Lock-in',
      ], bullets: [
        'Ihre aktuelle Software ist für Echtzeit-Anforderungen zu langsam, ein Standard-Framework skaliert nicht',
        'Sie bauen ein Embedded-Gerät und brauchen eine schlanke, sichere Laufzeitumgebung ohne Altlasten',
        'Sie wollen aus einem teuren SaaS-Vendor-Lock-in raus und volle Kontrolle über den Quellcode',
        'Bei kritischer Infrastruktur ist Speichersicherheit (Rust) Pflicht, kein Nice-to-have',
        'Sie brauchen Desktop-, PWA- und CLI-Anwendung aus einer Hand statt von drei verschiedenen Dienstleistern',
      ], delivery: 'Definition of Done + Zeitplan innerhalb von 14 Kalendertagen.' },
      { tier: 'Architecture Lab', hook: 'Wie das System wirklich funktioniert, bevor irgendjemand Produktionscode schreibt.', desc: 'Wir rekonstruieren gemeinsam mit Ihnen die Technologie unter der Produktoberfläche und prüfen, was tatsächlich da ist, gegen das, was dokumentiert, behauptet oder angenommen wird. Deutlich gefährlicher als ein "Architektur-Bericht".', bring: [
        'Ein Produkt, eine Anwendung, eine Plattform oder Architektur, die genauere Untersuchung braucht',
        'Die Behauptungen, Annahmen oder Unbekannten rund um die Umsetzung',
        'Den verfügbaren Zugriffsgrad für die Untersuchung',
      ], mechanism: [
        'Rekonstruieren die Technologie unter der Produktoberfläche',
        'Verfolgen Komponenten, SDKs, Services, Schnittstellen, Abhängigkeiten und externe Beziehungen',
        'Prüfen die beobachtete Architektur gegen Dokumentation, Behauptungen und bereits akkumulierte Intelligence',
      ], receive: [
        'Das technische Intelligence-Modell selbst, keine Folienzusammenfassung davon',
        'Die Architektur, die für Ihre Entscheidung zählt, inklusive relevanter versteckter Abhängigkeiten',
        'Befunde, die zeigen, wo das umgesetzte System vom verstandenen System abweicht',
      ], bullets: [
        'Sie stehen vor einer technischen Entscheidung mit hohem Risiko und wollen sie nicht allein treffen',
        'Vor einer großen Investition erst einen Prototyp mit Validierungskriterien statt eines fertigen Systems',
        'Als Forschungsteam eine KI-Architektur, die zu einer echten wissenschaftlichen Frage passt, nicht zum Buzzword',
        'Sie wollen eine zweite, unabhängige technische Meinung, bevor Ihr eigenes Team lossbaut',
        'Als Start-up vor der Seed-Runde brauchen Sie eine belastbare technische Roadmap für Investor:innen',
      ], delivery: 'Architektur- und Forschungsplan innerhalb von 14 Kalendertagen.' },
      { tier: 'Full Spectrum Deploy', hook: 'Intelligence als Betriebsschicht, kein Projekt mit Enddatum.', desc: 'Ihre Organisation braucht Intelligence über mehrere Flächen hinweg, kontinuierlich und operativ. Wir setzen die Infrastruktur ein, die das real macht - installiert, integriert, Ihr Team geschult, Support, der nicht bei der Übergabe endet.', bring: [
        'Ein System oder eine Infrastruktur, die vollständig laufen soll',
        'Ihr Team, das gleich mitgeschult wird',
        'Ihre bestehenden Daten, bereit zur Migration',
      ], mechanism: [
        'Installieren und integrieren alles, von Anfang bis Ende',
        'Migrieren Ihre bestehenden Daten',
        'Schulen Ihr Team und bleiben für laufenden Support',
      ], receive: [
        'Ein betriebsbereites System, nicht nur eine Lieferung',
        'Ein geschultes Team, das es selbst betreiben kann',
        'Ein verantwortliches Team über den gesamten Weg',
      ], bullets: [
        'Sie wollen eine komplette, sofort betriebsbereite Infrastruktur, nicht nur ein Stück Software',
        'Ihr Team hat keine Kapazität, ein neues System selbst zu integrieren, zu migrieren und zu schulen',
        'Sie brauchen einen einzigen Ansprechpartner von der ersten Analyse bis zum laufenden Support',
        'Sie lösen eine bestehende Dateninfrastruktur ab und müssen Mitarbeitende dabei mitnehmen',
        'Als Kritis-Betreiber oder öffentliche Einrichtung brauchen Sie einen belastbaren, dokumentierten Übergabeprozess',
      ], delivery: 'Definition of Done + Zeitplan innerhalb von 14 Kalendertagen.' },
    ],
    security: [
      { tier: 'Public', hook: 'Kostenlos, für immer. Funde werden nach 90 Tagen veröffentlicht, ausnahmslos.', desc: 'Wir prüfen Ihre App genauso, wie wir jede App prüfen - kostenlos. Finden wir etwas, haben Sie 90 Tage Zeit zur Behebung, bevor es auf unserem öffentlichen Ledger landet. Für alle gilt dieselbe Regel, zahlend oder nicht.', bring: [
        'Eine App, die Sie geprüft haben wollen - Ihre eigene, oder eine, die Sie interessiert',
        'Sonst nichts - kein NDA, keine Zahlung, kein Vorrang',
        'Denselben 90-Tage-Takt wie bei jeder anderen App, die wir prüfen',
      ], mechanism: [
        'Führen dieselbe Untersuchung wie bei unseren zahlenden Kunden durch',
        'Wenden für alle dieselbe Regel an, ausnahmslos',
        'Geben Ihnen 90 Tage, um Gefundenes zu beheben, bevor es öffentlich wird',
      ], receive: [
        'Eine kostenlose Sicherheitsprüfung',
        'Ein 90-Tage-Fenster zur Behebung von Funden',
        'Eine kostenlose Erklärung der Tracker auf Ihrem eigenen Handy',
      ], bullets: [
        'Sie wollen einfach wissen, welche Tracker gerade auf Ihrem eigenen Handy aktiv sind',
        'Sie haben eine App im Verdacht und wollen eine kostenlose Erstprüfung, bevor Sie Geld investieren',
        'Als Journalist:in oder Verbraucherschützer:in brauchen Sie eine öffentlich zitierfähige Quelle',
        'Als kleines Unternehmen ohne Security-Budget verdienen Sie trotzdem denselben Prüfstandard wie ein Konzern',
        'Als Entwickler:in wollen Sie Ihre eigene App vor dem Launch kostenlos gegenchecken lassen',
      ], delivery: 'Bericht innerhalb von 7 Kalendertagen.' },
      { tier: 'Remediation Advisory', hook: 'Wissen, wo die Schwachstelle sitzt, und was zu ändern ist.', desc: 'Vom Wissen, was kaputt ist, zum Wissen, wo einzugreifen ist: Wir verfolgen die Schwachstelle durch Ihr echtes System, trennen, was real betroffen ist, von dem, was nur angenommen wird, und übergeben die Behebung - in 7 Tagen, mit Nachprüfung nach 30.', bring: [
        'Eine bekannte oder vermutete Sicherheits-, Datenschutz-, Technologie- oder Abhängigkeits-Schwachstelle',
        'Das betroffene System oder die Organisation',
        'Die Entscheidung, die nicht auf eine weitere generische Einschätzung warten kann',
      ], mechanism: [
        'Verfolgen die Schwachstelle durch die zugrundeliegende Technologie- und Abhängigkeitsstruktur',
        'Stellen fest, was tatsächlich betroffen ist, was nur angenommen wird, und wo die Schwachstelle entsteht',
        'Identifizieren die Eingriffspunkte, die den zugrundeliegenden Zustand tatsächlich ändern',
      ], receive: [
        'Direkten Zugriff auf das priorisierte Lagebild der Schwachstelle',
        'Die Pfade durch das System, die sie erzeugen oder verstärken',
        'Eine konkrete Grundlage für die Entscheidung, wo einzugreifen ist',
      ], bullets: [
        'Sie vermuten einen Sicherheitsvorfall und brauchen schnell einen belastbaren, priorisierten Befund',
        'Als Start-up vor einem Investoren-Audit wollen Sie Ihre App vorher selbst sauber machen',
        'Sie wollen nicht nur wissen, was kaputt ist, sondern genau, wie man es behebt - mit Nachprüfung nach 30 Tagen',
        'Ihr Entwicklerteam braucht eine unabhängige zweite Meinung zu einer bereits gemeldeten Schwachstelle',
        'Vertraulichkeit ist Ihnen nicht wichtig, Tempo (7 Tage) und ein belastbarer Fund dagegen schon',
      ], delivery: 'Befund innerhalb von 7 Kalendertagen nach Zahlung.' },
      { tier: 'Confidential', hook: 'Geben Sie uns das Problem, das Sie nicht öffentlich exponieren können.', desc: `Dieselbe Untersuchung wie bei Remediation Advisory - unter Geheimhaltung, für den Fall, dass die Schwachstelle selbst etwas ist, das nicht durch den normalen Prozess laufen kann. Sie erhalten einen nach Schwere geordneten Befund, exakt lokalisiert, plus eine Zusammenfassung, die nicht-technische Führungskräfte lesen können. Sobald Sie Fixes ausliefern, testen wir manuell nach, ob die Lücke wirklich geschlossen ist.\n\n${NDA_CLAUSE}\n\nAls Non-Profit-Organisation, die an ihre eigenen Regeln gebunden ist, informieren wir die zuständigen Regulatoren trotzdem parallel - ohne Details, die Sie exponieren würden.`, bring: [
        'Ein Problem, das nicht durch den normalen Prozess laufen kann',
        'Ihre App oder Ihr System, unter NDA',
        'Die Beteiligten, die zustimmen müssen, bevor sich etwas bewegt',
      ], mechanism: [
        'Führen dieselbe Untersuchung durch, unter Geheimhaltung',
        'Testen nach ausgelieferten Fixes manuell nach',
        'Informieren Regulatoren parallel, ohne Sie zu exponieren',
      ], receive: [
        'Einen vertraulichen, nach Schwere geordneten Befund',
        'Die Methode und Werkzeuge dahinter, nicht nur das Ergebnis - genau das geistige Eigentum, das ein NDA eigentlich schützt',
        'Handgeprüfte Bestätigung, dass Ihre Fixes funktioniert haben',
      ], bullets: [
        'Als börsennotiertes Unternehmen wollen Sie einen Fund erst intern klären, bevor er publik wird',
        'Sie brauchen eine vorstandstaugliche Zusammenfassung, nicht nur einen technischen Report',
        'Sie wollen Methodik und Werkzeuge verstehen, nicht nur das Ergebnis',
        'Mit eigener Rechtsabteilung wollen Sie Kontrolle über den Zeitpunkt der Kommunikation behalten, nicht über das Ob',
        'Sie sind selbst regulatorisch verpflichtet und brauchen eine saubere, dokumentierte Prüfspur',
      ], delivery: 'Befund innerhalb von 7 Kalendertagen nach Zahlung.' },
      { tier: 'Enterprise & Critical Infrastructure', hook: 'NIS2, biometrische Daten, NDA - die Fälle, die die meisten Anbieter nicht anfassen.', desc: `Geheimhaltung, priorisierte Reaktionszeit und direkter Zugang zu den Ingenieur:innen, wenn schnell etwas behoben werden muss. Für Betreiber kritischer Infrastruktur (Energie, Wasser, Gesundheit, Verkehr) übersetzen wir Ihre NIS2-Pflichten in Kontrollen, die Ihr Team tatsächlich umsetzen kann - und üben das Incident-Response-Protokoll mit Ihnen ein, bevor etwas schiefgeht.\n\n${NDA_CLAUSE}\n\nFür biometrische Daten (Art. 9 DSGVO) verfolgen wir jeden Fluss vollständig: wohin er geht, wie lange er gespeichert wird, wer darauf zugreift. Die meisten Sicherheitsanbieter fassen diese Kategorie nicht an.\n\nAuch als laufender Auftrag verfügbar: kontinuierliche Abdeckung statt Einzelaudit, mit vierteljährlichem Deep-Dive und fester Ansprechperson. Umfang und Preis werden direkt mit Ihrem Team abgestimmt.`, bring: [
        'Kritische Infrastruktur oder biometrische/hochsensible Daten',
        'Ihre bestehenden NIS2- oder Art.-9-Pflichten',
        'Die regulatorische Frist oder Prüfung, auf die Sie hinarbeiten',
      ], mechanism: [
        'Übersetzen NIS2-Pflichten in Kontrollen, die Ihr Team tatsächlich umsetzen kann',
        'Üben Incident-Response ein, bevor etwas schiefgeht',
        'Verfolgen jeden Fluss biometrischer Daten (Art. 9) vollständig',
      ], receive: [
        'Kontrollen, die Sie umsetzen können, keine reine Checkliste',
        'Einen geübten Incident-Response-Plan',
        'Priorisierte Reaktionszeit, wenn es zählt, plus feste Ansprechperson',
      ], bullets: [
        'Als Betreiber kritischer Infrastruktur (Energie, Wasser, Verkehr) müssen Sie NIS2-Pflichten in echte technische Kontrollen übersetzen',
        'Sie verarbeiten biometrische Daten (Art. 9 DSGVO) und finden kaum spezialisierte Prüfer dafür',
        'Sie brauchen laufende Portfolio-Abdeckung statt Einzelaudits, mit fester Ansprechperson',
        'Sie wollen einen Incident-Response-Ernstfall einmal geübt haben, bevor er real passiert',
        'Ein Sicherheitsvorfall ist für Sie keine Option - Sie brauchen priorisierte Reaktionszeit, nicht das Standardfenster',
      ], delivery: 'Bericht ab 7 Kalendertagen, Umfang individuell.' },
    ],
  },

  tierCarousel: {
    getStarted: 'Jetzt starten',
    requestProposal: 'Angebot anfragen',
  },

  modalTierBody: {
    whatYouGet: 'Was Sie bekommen',
    youBring: 'Sie bringen',
    we: 'Wir',
    youReceive: 'Sie erhalten',
    whatHappensNext: 'Was als Nächstes passiert',
    inTouchWithin12h: 'Wir melden uns innerhalb von 12h nach dem Kauf',
  },

  checkoutModal: {
    orderConfirmation: 'Bestellbestätigung',
    agreementPrefix: 'Ich kaufe als ',
    agreementBusinessCustomer: 'Geschäftskunde/Geschäftskundin',
    agreementMiddle: ' und stimme den ',
    agreementTos: 'Allgemeinen Geschäftsbedingungen',
    agreementSuffix: ' zu. Die Leistung beginnt sofort mit Zahlungseingang; es besteht kein Widerrufsrecht, Rückerstattungen sind ausgeschlossen.',
    payButton: (price: string) => `${price} zahlen →`,
    cancel: 'Abbrechen',
    talkFirstInstead: 'Nicht das Richtige dabei? Sprechen Sie mit uns - individuelles Angebot →',
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
    // Mobile fallback copy - see the matching en.ts key for why.
    mobileFallbackHint: 'PDF-Berichte lassen sich auf mobilen Browsern nicht zuverlässig einbetten. Stattdessen direkt öffnen:',
    mobileOpenLabel: 'Bericht öffnen (PDF)',
  },

  intelModal: {
    evidenceLabel: 'der Befund, technisch',
  },

  journey: {
    eyebrow: 'Ablauf der Zusammenarbeit',
    heading: 'was nach dem Start passiert',
    subheading: 'Fünf Phasen, von einer einzelnen Beobachtung bis zu einem kontinuierlich schärfer werdenden Intelligence-Modell. Die Tiefe ändert sich mit der Frage; die Disziplin bleibt gleich. Jede Phase bleibt lückenlos nachvollziehbar, Whitebox by Design, jede Aktion lässt sich bis zur ursprünglichen Beobachtung zurückverfolgen.',
    steps: [
      { stage: 'Ingest', body: 'Wir beginnen mit dem, was Sie uns anvertrauen: einem Signal, einer Behauptung, einem System oder einer Frage - aus Ihrer eigenen Umgebung, öffentlichen Quellen oder einer Domäne, die wir bereits beobachten.\n\nEs wird nichts angefasst, bevor wir nicht das eigentliche Ding gelesen haben, nicht das README, nicht die Zusammenfassung, die jemand anderes darüber geschrieben hat. Der Ausgangspunkt kann klein sein. Womit wir ihn abgleichen, ist es nicht.' },
      { stage: 'Normalize', body: 'Wir lösen Entitäten auf, mappen Beziehungen, ergänzen Zeitstempel und Provenance und bewahren, was tatsächlich unsicher bleibt, statt zu raten. Unterschiedliche Vokabulare, Systeme, Sprachen werden vergleichbar, ohne auf eine falsche Gleichheit reduziert zu werden.\n\nNichts wird ohne Herkunft akzeptiert. Unbekanntes wird nicht stillschweigend ergänzt.' },
      { stage: 'Trace', body: 'Hier leisten drei eigens dafür gebaute Engines die eigentliche Arbeit: TemporalEngine vergleicht Zustände über die Zeit, NetworkEngine verfolgt Abhängigkeiten und findet Brücken und Engpässe, PatternEngine prüft, ob das Beobachtete zu etwas passt, das wir anderswo bereits gefunden haben.\n\nDie Frage war nie nur, was sich verändert hat - sondern womit es sonst noch verbunden ist.' },
      { stage: 'Emit', body: 'Eine relevante Veränderung wird zu einem Intelligence Event: Evidenz, Konfidenz, Widerspruchsstatus und jede betroffene Domäne, geschrieben in EvidenceGraph als ein einziges nachvollziehbares Objekt, nicht vergraben in einem Absatz, dem Sie einfach glauben müssen.\n\nNoch kein Urteil. Etwas, das Sie weiterhin untersuchen und infrage stellen können.' },
      { stage: 'Learn', body: 'Hier erreicht es Sie: der Befund, die Evidenz dahinter, und was sich dadurch für Sie ändert - ein Ergebnis, mit dem Sie tatsächlich arbeiten können.\n\nDamit ist es aber nicht vorbei. Dieselbe Evidenz bleibt in EvidenceGraph erhalten, sodass die nächste Frage zum selben Thema bei dem ansetzt, was wir bereits wissen, nicht bei null - jeder Auftrag macht den nächsten schneller.' },
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
      topicAriaLabel: 'Thema',
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
      creditAriaLabel: 'Namensnennung',
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
