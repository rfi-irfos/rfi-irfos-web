// READ-ONLY-ish: edits only desc/hook prose inside de.ts + en.ts.
// Tier names, prices, deliveries, features, NDA clauses untouched.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'frontend', 'src', 'content');

// Helper: replace first occurrence of `from` with `to` in a string (plain, no regex).
function swap(s, from, to) {
  const i = s.indexOf(from);
  if (i === -1) {
    console.error('NOT FOUND:', JSON.stringify(from).slice(0, 80));
    process.exitCode = 1;
    return s;
  }
  return s.slice(0, i) + to + s.slice(i + from.length);
}

// ---- DE replacements (only inner prose) ----
const de = fs.readFileSync(path.join(root, 'de.ts'), 'utf8');
let d = de;

// First Light
d = swap(d,
  "Während Ihre Konkurrenz auf eine Pressemitteilung wartet, wissen Sie es schon. Wir beantworten eine Frage gegen den vollständigen dekompilierten App-Korpus - kein Dokument über einen Anbieter, eine Live-Query gegen das ganze Ökosystem.\\n\\nNeun Intelligenz-Ebenen laufen hinter jeder Antwort: Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain, Competitive, Market, Security. Keine Meinungen, kein Marketingtext. Was der Code tatsächlich tut, jetzt gerade.\\n\\nDerselbe Korpus, aus dem unsere öffentlichen Offenlegungen stammen. Wenn sich irgendwo etwas zusammenbraut, sehen wir es entstehen, bevor es zur Schlagzeile wird - und Sie auch.",
  "RFI-IRFOS löst eine konkrete Frage gegen den vollständigen Korpus dekompilierter Anwendungen - nicht als Bericht über einen Anbieter, sondern als live ausgeführte Abfrage über das gesamte Ökosystem. Neun Erkenntnisebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain, Competitive, Market, Security) verbinden sich hinter jeder Antwort zu einer nachvollziehbaren Kette von Signal über Entität zur Schlussfolgerung. Das Ergebnis zeigt, was die Technologie tatsächlich tut - nicht was über sie behauptet wird. Derselbe Korpus, aus dem die öffentlichen Offenlegungen von RFI-IRFOS stammen: die Grundlage, auf der Veränderungen erkannt werden, bevor sie öffentlich werden.");
// First Light hook
d = swap(d,
  "Wissen, bevor es öffentlich ist. Eine Query, Hunderte Apps, eine Antwort, die sonst niemand ziehen kann.",
  "Wissen, bevor es öffentlich ist. Eine Frage, das gesamte App-Ökosystem, eine Antwort mit Nachweiskette.");

// Competitive Trace
d = swap(d,
  "Wenn die Kurskorrektur eines Wettbewerbers in der Presse landet, steckt sie oft schon monatelang im Code. Wir lesen den Code zuerst: welche SDKs tatsächlich ausgeliefert werden, wo das Datenschutzverhalten von der veröffentlichten Richtlinie abweicht, wo sich die Architektur still verändert.\\n\\nBenchmarkt über sechs Ebenen des Korpus - Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain -, damit Sie auf Beweisen handeln, während andere noch im Vorstandszimmer spekulieren.\\n\\nDerselbe Korpus, den wir für Offenlegungen nutzen. Die andere Seite hat keine Ahnung, dass gerade hingesehen wird.",
  "Wenn die Kursänderung eines Wettbewerbers in der Presse landet, steckt sie oft schon monatelang im Code. RFI-IRFOS beobachtet diese Veränderung dort, wo sie entsteht: welche SDKs tatsächlich ausgeliefert werden, wo das Datenschutzverhalten von der veröffentlichten Richtlinie abweicht, wo sich die Architektur still verändert. Über sechs Korpus-Ebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain) wird die Beobachtung in eine belastbare Beziehung zwischen technischer Veränderung und geschäftlicher Bedeutung übersetzt. Sie handeln auf Evidenz, während andere noch spekulieren. Der beobachtete Korpus ist derselbe, den RFI-IRFOS für Offenlegungen nutzt.");

// Sector Map
d = swap(d,
  "Ein Schnappschuss ist in dem Moment veraltet, in dem er gedruckt ist. Sie erhalten das Risikoprofil jedes relevanten Akteurs in Ihrem Sektor, über alle neun Intelligenz-Ebenen, alle drei Monate neu - damit Sie die Verschiebung sehen, während sie noch entsteht, nicht nachdem sie längst eingepreist ist.\\n\\nErster Bericht innerhalb von 14 Kalendertagen. Danach liegen Sie dem Sektor immer drei Monate voraus, während andere noch den Marktbericht vom letzten Jahr lesen.",
  "Ein Schnappschuss ist in dem Moment veraltet, in dem er gedruckt ist. RFI-IRFOS hält das Risikoprofil jedes relevanten Akteurs in Ihrem Sektor über alle neun Erkenntnisebenen als fortlaufendes Lagebild - alle drei Monate neu aufgelöst. Die Leistung ist nicht die Lieferung eines Dokuments, sondern die fortlaufende Beobachtung, wie sich Beziehungen, Abhängigkeiten und Expositionen im Sektor verschieben. Sie erkennen die Veränderung, während sie entsteht, nicht nachdem sie bereits eingepreist ist. Erster Lagebericht innerhalb von 14 Kalendertagen; danach bleibt das Bild drei Monate vor dem Markt.");
// Sector Map hook
d = swap(d,
  "Der ganze Sektor kartiert und aktualisiert, bevor die Konkurrenz merkt, dass sich der Boden bewegt hat.",
  "Ihr gesamter Sektor als zusammenhängendes Lagebild - vierteljährlich neu aufgelöst.");

// Signal
d = swap(d,
  "Ein Wettbewerber macht selten einen öffentlichen Schritt, ohne dass monatelang Signale davor sichtbar waren - eine Finanzierungsrunde, ein Sicherheitsvorfall, ein SDK-Wechsel, eine stille Kurskorrektur im Code. Sie bekommen die Warnung, sobald das Signal auftaucht, nicht die Schlagzeile Wochen später.\\n\\nEin fester Analyst beobachtet den Korpus für Ihren Sektor kontinuierlich: ein Briefing im Monat, sofortige Warnung bei Bewegung. Zugewiesen innerhalb einer Woche nach Zahlung.",
  "Ein Wettbewerber macht selten einen öffentlichen Schritt, ohne dass monatelang Signale davor sichtbar waren: eine Finanzierungsrunde, ein Sicherheitsvorfall, ein SDK-Wechsel, eine stille Kursänderung im Code. RFI-IRFOS hält einen festen Analysten bereit, der den Korpus für Ihren Sektor kontinuierlich beobachtet - nicht als monatliche Zusammenfassung, sondern als laufende Überwachung relevanter Veränderungen mit sofortiger Warnung bei Bewegung. Die Leistung ist fortlaufende Intelligence: Sie erfahren den Zeitpunkt des Signals, nicht die Schlagzeile Wochen später. Zugewiesen innerhalb einer Woche nach Zahlung.");
// Signal hook
d = swap(d,
  "Ein stehendes Frühwarnsystem für Ihren Sektor. Damit Sie nie die oder der Letzte sind, der es erfährt.",
  "Ein stehendes Frühwarnsystem für Ihren Sektor - kontinuierliche Beobachtung statt Monatsbericht.");

// Public
d = swap(d,
  "Sie erhalten dasselbe Audit auf Quellcode-Ebene, das wir für zahlende Kunden durchführen - kostenlos. Nach 90 Tagen Vorlauf landet der Fund auf unserem öffentlichen Ledger, damit die Organisation Zeit hat zu reagieren, bevor es jemand anderes sieht.\\n\\nJeder Name auf diesem Ledger unterliegt derselben Regel, groß oder klein, zahlend oder nicht. Kein Vertrag, keine Geheimhaltung, keine leisere Behandlung für irgendjemanden.\\n\\nIhre erste Handy-Privatsphäre-Sitzung ist inklusive: Wir zeigen Ihnen, wie Sie die versteckten Tracker auf Ihrem eigenen Gerät abschalten.",
  "RFI-IRFOS stellt dieselbe quellcode-nahe Beobachtungsleistung bereit, die auch zahlende Kunden erhalten - kostenlos. Nach einer 90-Tage-Vorlauffrist wird der Fund auf dem öffentlichen Ledger von RFI-IRFOS veröffentlicht, damit die betroffene Organisation Zeit zur Reaktion hat, bevor ihn jemand anderes sieht. Jeder Eintrag auf diesem Ledger unterliegt derselben Regel - groß oder klein, zahlend oder nicht. Kein Vertrag, keine Geheimhaltung, keine leisere Behandlung. Eingeschlossen ist die erste Handy-Privatsphäre-Sitzung: RFI-IRFOS zeigt Ihnen, wie Sie die versteckten Tracker auf Ihrem eigenen Gerät abschalten.");

// Remediation Advisory
d = swap(d,
  "Sie bezahlen nicht für ein Dokument. Sie beauftragen eine Untersuchung mit unserer Methodik, unserem Korpus dekompilierter Apps und unserer Quellen-Architektur - exakt der, mit der wir Funde auf dem öffentlichen Ledger ablegen. Das Ergebnis ist ein nach Schwere geordneter Befund: genau, wie wir getestet haben, jede Schwachstelle, eine konkrete Behebung für jede davon - innerhalb von 7 Kalendertagen.\\n\\nDieselben Ingenieur:innen, die die Lücken gefunden haben, führen Sie durch deren Schließung. Keine Liste, die jemand anderem zur Interpretation übergeben wird.\\n\\nDreißig Tage später prüfen wir nach, ob die Fixes tatsächlich angekommen sind - nicht, ob jemand behauptet hat, sie seien es. Jeder Fund ist mit dem genauen Datenschutz-Artikel verknüpft, den er verletzt.",
  "Sie bezahlen nicht für ein Dokument. Sie beauftragen eine Untersuchung mit der Methodik von RFI-IRFOS, dem Korpus dekompilierter Apps und der Quellen-Architektur - exakt der Struktur, mit der Funde auf dem öffentlichen Ledger abgelegt werden. Das Ergebnis ist ein nach Schwere geordneter Befund: genau, wie beobachtet wurde, jede Schwachstelle, eine konkrete Behebung für jede davon - innerhalb von 7 Kalendertagen. Dieselben Ingenieur:innen, die die Lücken gefunden haben, führen durch deren Schließung. Dreißig Tage später prüft RFI-IRFOS nach, ob die Fixes tatsächlich angekommen sind. Jeder Fund ist mit dem genauen Datenschutz-Artikel verknüpft, den er verletzt.");

// Confidential (template literal - careful)
d = swap(d,
  "Sie beauftragen dieselbe Untersuchung gegen unseren Korpus - mit Geheimhaltung. Das Ergebnis: ein Befund, der jede Schwachstelle nach Schwere ordnet und exakt im Code verortet, plus eine Zusammenfassung, die auch nicht-technische Führungskräfte lesen können. Innerhalb von 7 Kalendertagen.",
  "Sie beauftragen dieselbe Untersuchung gegen den Korpus von RFI-IRFOS - unter Geheimhaltung. Das Ergebnis ist ein Befund, der jede Schwachstelle nach Schwere ordnet und exakt im Code verortet, plus eine Zusammenfassung, die nicht-technische Führungskräfte lesen können. Innerhalb von 7 Kalendertagen.");

// Enterprise (template literal)
d = swap(d,
  "Sie erhalten Geheimhaltung, priorisierte Remediation-Zeit über das übliche 90-Tage-Fenster hinaus, und direkten Zugang zu den Ingenieur:innen für die Behebung. Für Betreiber kritischer Infrastruktur (Energie, Wasser, Gesundheit, Verkehr) übersetzen wir NIS2-Pflichten in Kontrollen, die Ihr Team tatsächlich umsetzen kann, und üben das Incident-Response-Protokoll mit Ihnen ein, bevor etwas schiefgeht.",
  "RFI-IRFOS stellt Geheimhaltung, priorisierte Remediation-Zeit über das übliche 90-Tage-Fenster hinaus und direkten Zugang zu den Ingenieur:innen bereit. Für Betreiber kritischer Infrastruktur (Energie, Wasser, Gesundheit, Verkehr) übersetzt RFI-IRFOS NIS2-Pflichten in Kontrollen, die Ihr Team tatsächlich umsetzen kann, und übt das Incident-Response-Protokoll mit Ihnen ein, bevor etwas schiefgeht.");

fs.writeFileSync(path.join(root, 'de.ts'), d, 'utf8');
console.log('de.ts written');

// ---- EN replacements ----
const en = fs.readFileSync(path.join(root, 'en.ts'), 'utf8');
let e = en;

// First Light
e = swap(e,
  "While your competitors wait for a press release, you already know. We answer one question against the full decompiled-app corpus - not a report about one vendor, a live query run across the whole ecosystem.\\n\\nNine intelligence layers run behind every answer: Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain, Competitive, Market, Security. Not opinions, not marketing copy - what the code actually does, right now.\\n\\nThe same corpus our public disclosures come from. If something is about to break, we see it forming before it becomes a headline - and so do you.",
  "RFI-IRFOS resolves a concrete question against the complete corpus of decompiled applications - not as a report about one vendor, but as a live query run across the entire ecosystem. Nine intelligence layers (code, SDK, data-flow, trackers, privacy, supply-chain, competitive, market, security) combine behind every answer into a traceable chain from signal to entity to conclusion. The result shows what the technology actually does, not what is claimed about it. This is the same corpus our public disclosures draw from: the basis on which change is detected before it becomes public.");
e = swap(e,
  "Know before it's public. One query, hundreds of apps, an answer nobody else can pull.",
  "Know before it's public. One question, the full app ecosystem, an answer with a provenance chain.");

// Competitive Trace
e = swap(e,
  "By the time a competitor's pivot hits the press, it has usually been sitting in their code for months. We read the code first: which SDKs they actually ship, where their privacy behaviour diverges from the policy they publish, where the architecture is quietly changing.\\n\\nBenchmarked across six layers of the corpus - code, SDK, data-flow, tracker, privacy, supply-chain - so you're acting on evidence while everyone else is still speculating in the boardroom.\\n\\nThe same corpus we use for disclosures. They have no idea they're being watched.",
  "A competitor's strategic shift usually sits in their code for months before it reaches the press. RFI-IRFOS observes that change where it forms: which SDKs they actually ship, where their privacy behaviour diverges from the policy they publish, where the architecture is quietly changing. Across six corpus layers (code, SDK, data-flow, trackers, privacy, supply-chain), the observation is translated into a defensible relationship between technical change and business meaning. You act on evidence while others are still speculating. The observed corpus is the same one RFI-IRFOS uses for disclosures.");

// Sector Map
e = swap(e,
  "A snapshot is stale the moment it prints. You get the risk profile of every major player in your sector, across all nine intelligence layers, refreshed every quarter - so you see the shift while it's still forming, not after it's already priced in.\\n\\nFirst report within 14 calendar days. After that, you're always looking at the sector three months ahead of whoever is still reading last year's market report.",
  "A snapshot is stale the moment it prints. RFI-IRFOS maintains the risk profile of every relevant actor in your sector across all nine intelligence layers as a continuous intelligence picture - refreshed every quarter. The capability is not the delivery of a document, but the continuous observation of how relationships, dependencies and exposures shift across the sector. You see the change forming, not after it has already been priced in. First picture within 14 calendar days; after that the view stays three months ahead of the market.");
e = swap(e,
  "The whole sector, mapped and refreshed before your competitors know the ground moved.",
  "Your entire sector as a connected intelligence picture - re-resolved every quarter.");

// Signal
e = swap(e,
  "A competitor rarely makes one move in public without months of signal first - a funding round, a security incident, an SDK swap, a quiet pivot in the code. You get the alert the moment the signal appears, not the headline weeks later.\\n\\nOne dedicated analyst watches the corpus for your sector continuously: a monthly briefing, an immediate alert on movement. Assigned within a week of payment.",
  "A competitor rarely makes one public move without months of signal first - a funding round, a security incident, an SDK swap, a quiet pivot in the code. RFI-IRFOS maintains a dedicated analyst who observes the corpus for your sector continuously - not as a monthly summary, but as ongoing monitoring of relevant change with immediate alert on movement. The capability is continuous intelligence: you learn the moment the signal appears, not the headline weeks later. Assigned within a week of payment.");
e = swap(e,
  "A standing early-warning system for your sector. Built so you're never the last to know.",
  "A standing early-warning system for your sector - continuous observation, not a monthly report.");

// Public
e = swap(e,
  "You get the same source-code-level audit we run for paying clients, at no cost. Findings publish on our public ledger after a 90-day heads-up window, giving the organization time to react before anyone else sees it.\\n\\nEvery name on that ledger is held to the identical rule, big or small, paying or not. No contract, no secrecy, no quieter treatment for anyone.\\n\\nYour first phone privacy session is included: we walk you through switching off the hidden trackers running on your own device.",
  "RFI-IRFOS provides the same source-code-level observation capability that paying clients receive - at no cost. After a 90-day heads-up window, the finding is published on the public ledger of RFI-IRFOS, giving the affected organization time to react before anyone else sees it. Every entry on that ledger is held to the identical rule - big or small, paying or not. No contract, no secrecy, no quieter treatment. Included is your first phone privacy session: RFI-IRFOS walks you through switching off the hidden trackers running on your own device.");

// Remediation Advisory
e = swap(e,
  "You are not paying for a document. You are commissioning an investigation using our methodology, our corpus of decompiled apps, and our source architecture - the same one we use to log findings on the public ledger. The output is a severity-ranked finding: exactly how we tested, every weakness, a concrete fix for each one - within 7 calendar days.\\n\\nThe same engineers who found the holes walk you through closing them. Never a list handed off to someone else to interpret.\\n\\nThirty days later we check back to confirm the fixes actually landed, not that someone claimed they did. Every finding is tied to the exact privacy-law article it breaks.",
  "You are not paying for a document. You are commissioning an investigation using the methodology of RFI-IRFOS, our corpus of decompiled apps and our source architecture - the exact structure used to log findings on the public ledger. The output is a severity-ranked finding: exactly how it was observed, every weakness, a concrete fix for each one - within 7 calendar days. The same engineers who found the holes walk you through closing them. Thirty days later RFI-IRFOS checks back to confirm the fixes actually landed. Every finding is tied to the exact privacy-law article it breaks.");

// Confidential (template literal)
e = swap(e,
  "You commission the same investigation against our corpus - under secrecy. The output: a finding that ranks every weakness by severity and pins it to the exact spot in your code, plus a plain-language summary your non-technical leadership can actually read. Within 7 calendar days.",
  "You commission the same investigation against our corpus - under secrecy. The output is a finding that ranks every weakness by severity and pins it to the exact spot in your code, plus a plain-language summary your non-technical leadership can actually read. Within 7 calendar days.");

// Enterprise (template literal)
e = swap(e,
  "You get secrecy, priority path beyond the standard 90-day remediation window, and direct engineer access to fix it. For operators of critical infrastructure (energy, water, health, transport) we translate NIS2 obligations into controls your team can actually implement, and rehearse the incident-response protocol with you before anything goes wrong.",
  "RFI-IRFOS provides secrecy, priority remediation time beyond the standard 90-day window, and direct engineer access to fix it. For operators of critical infrastructure (energy, water, health, transport) RFI-IRFOS translates NIS2 obligations into controls your team can actually implement, and rehearses the incident-response protocol with you before anything goes wrong.");

fs.writeFileSync(path.join(root, 'en.ts'), e, 'utf8');
console.log('en.ts written');
