const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'frontend', 'src', 'content');
function swap(s, from, to) {
  const i = s.indexOf(from);
  if (i === -1) { console.error('NOT FOUND:', JSON.stringify(from).slice(0,90)); process.exitCode = 1; return s; }
  return s.slice(0, i) + to + s.slice(i + from.length);
}

// ===================== DE =====================
let d = fs.readFileSync(path.join(root, 'de.ts'), 'utf8');

// First Light — Wir lösen alle Fragen, Chaos -> Intelligence
d = swap(d,
  "RFI-IRFOS löst eine konkrete Frage gegen den vollständigen Korpus dekompilierter Anwendungen - nicht als Bericht über einen Anbieter, sondern als live ausgeführte Abfrage über das gesamte Ökosystem. Neun Erkenntnisebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain, Competitive, Market, Security) verbinden sich hinter jeder Antwort zu einer nachvollziehbaren Kette von Signal über Entität zur Schlussfolgerung. Das Ergebnis zeigt, was die Technologie tatsächlich tut - nicht was über sie behauptet wird. Derselbe Korpus, aus dem die öffentlichen Offenlegungen von RFI-IRFOS stammen: die Grundlage, auf der Veränderungen erkannt werden, bevor sie öffentlich werden.",
  "Sie kommen mit einem Haufen Chaos - hunderten Apps, widersprüchlichen Aussagen, unübersichtlichen Abhängigkeiten. Wir destillieren daraus Intelligence. Die Abfrage läuft live gegen den vollständigen Korpus dekompilierter Anwendungen - nicht als Bericht über einen Anbieter, sondern als kontinuierliche Beobachtung des gesamten Ökosystems. Neun Erkenntnisebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain, Competitive, Market, Security) verbinden sich hinter jeder Antwort zu einer nachvollziehbaren Kette von Signal über Entität zur Schlussfolgerung. Das Ergebnis zeigt, was die Technologie tatsächlich tut - nicht was über sie behauptet wird. Derselbe Korpus, aus dem unsere öffentlichen Offenlegungen stammen: die Grundlage, auf der Veränderungen erkannt werden, bevor sie öffentlich werden.");
d = swap(d,
  "Wissen, bevor es öffentlich ist. Eine Frage, das gesamte App-Ökosystem, eine Antwort mit Nachweiskette.",
  "Wissen, bevor es öffentlich ist. Sie bringen das Chaos, wir destillieren die Intelligence.");

// Competitive Trace
d = swap(d,
  "Wenn die Kursänderung eines Wettbewerbers in der Presse landet, steckt sie oft schon monatelang im Code. RFI-IRFOS beobachtet diese Veränderung dort, wo sie entsteht: welche SDKs tatsächlich ausgeliefert werden, wo das Datenschutzverhalten von der veröffentlichten Richtlinie abweicht, wo sich die Architektur still verändert. Über sechs Korpus-Ebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain) wird die Beobachtung in eine belastbare Beziehung zwischen technischer Veränderung und geschäftlicher Bedeutung übersetzt. Sie handeln auf Evidenz, während andere noch spekulieren. Der beobachtete Korpus ist derselbe, den RFI-IRFOS für Offenlegungen nutzt.",
  "Wenn die Kursänderung eines Wettbewerbers in der Presse landet, steckt sie oft schon monatelang im Code. Wir beobachten diese Veränderung dort, wo sie entsteht: welche SDKs tatsächlich ausgeliefert werden, wo das Datenschutzverhalten von der veröffentlichten Richtlinie abweicht, wo sich die Architektur still verändert. Über sechs Korpus-Ebenen (Code, SDK, Data-Flow, Tracker, Privacy, Supply-Chain) übersetzen wir die Beobachtung in eine belastbare Beziehung zwischen technischer Veränderung und geschäftlicher Bedeutung. Sie handeln auf Evidenz, während andere noch spekulieren. Der beobachtete Korpus ist derselbe, den wir für Offenlegungen nutzen.");

// Sector Map
d = swap(d,
  "Ein Schnappschuss ist in dem Moment veraltet, in dem er gedruckt ist. RFI-IRFOS hält das Risikoprofil jedes relevanten Akteurs in Ihrem Sektor über alle neun Erkenntnisebenen als fortlaufendes Lagebild - alle drei Monate neu aufgelöst. Die Leistung ist nicht die Lieferung eines Dokuments, sondern die fortlaufende Beobachtung, wie sich Beziehungen, Abhängigkeiten und Expositionen im Sektor verschieben. Sie erkennen die Veränderung, während sie entsteht, nicht nachdem sie bereits eingepreist ist. Erster Lagebericht innerhalb von 14 Kalendertagen; danach bleibt das Bild drei Monate vor dem Markt.",
  "Ein Schnappschuss ist in dem Moment veraltet, in dem er gedruckt ist. Wir halten das Risikoprofil jedes relevanten Akteurs in Ihrem Sektor über alle neun Erkenntnisebenen als fortlaufendes Lagebild - alle drei Monate neu aufgelöst. Die Leistung ist nicht die Lieferung eines Dokuments, sondern die fortlaufende Beobachtung, wie sich Beziehungen, Abhängigkeiten und Expositionen im Sektor verschieben. Sie erkennen die Veränderung, während sie entsteht, nicht nachdem sie bereits eingepreist ist. Erster Lagebericht innerhalb von 14 Kalendertagen; danach bleibt das Bild drei Monate vor dem Markt.");

// Signal
d = swap(d,
  "Ein Wettbewerber macht selten einen öffentlichen Schritt, ohne dass monatelang Signale davor sichtbar waren: eine Finanzierungsrunde, ein Sicherheitsvorfall, ein SDK-Wechsel, eine stille Kursänderung im Code. RFI-IRFOS hält einen festen Analysten bereit, der den Korpus für Ihren Sektor kontinuierlich beobachtet - nicht als monatliche Zusammenfassung, sondern als laufende Überwachung relevanter Veränderungen mit sofortiger Warnung bei Bewegung. Die Leistung ist fortlaufende Intelligence: Sie erfahren den Zeitpunkt des Signals, nicht die Schlagzeile Wochen später. Zugewiesen innerhalb einer Woche nach Zahlung.",
  "Ein Wettbewerber macht selten einen öffentlichen Schritt, ohne dass monatelang Signale davor sichtbar waren: eine Finanzierungsrunde, ein Sicherheitsvorfall, ein SDK-Wechsel, eine stille Kursänderung im Code. Wir halten einen festen Analysten bereit, der den Korpus für Ihren Sektor kontinuierlich beobachtet - nicht als monatliche Zusammenfassung, sondern als laufende Überwachung relevanter Veränderungen mit sofortiger Warnung bei Bewegung. Die Leistung ist fortlaufende Intelligence: Sie erfahren den Zeitpunkt des Signals, nicht die Schlagzeile Wochen später. Zugewiesen innerhalb einer Woche nach Zahlung.");

// Public
d = swap(d,
  "RFI-IRFOS stellt dieselbe quellcode-nahe Beobachtungsleistung bereit, die auch zahlende Kunden erhalten - kostenlos. Nach einer 90-Tage-Vorlauffrist wird der Fund auf dem öffentlichen Ledger von RFI-IRFOS veröffentlicht, damit die betroffene Organisation Zeit zur Reaktion hat, bevor ihn jemand anderes sieht. Jeder Eintrag auf diesem Ledger unterliegt derselben Regel - groß oder klein, zahlend oder nicht. Kein Vertrag, keine Geheimhaltung, keine leisere Behandlung. Eingeschlossen ist die erste Handy-Privatsphäre-Sitzung: RFI-IRFOS zeigt Ihnen, wie Sie die versteckten Tracker auf Ihrem eigenen Gerät abschalten.",
  "Wir stellen dieselbe quellcode-nahe Beobachtungsleistung bereit, die auch zahlende Kunden erhalten - kostenlos. Nach einer 90-Tage-Vorlauffrist wird der Fund auf unserem öffentlichen Ledger veröffentlicht, damit die betroffene Organisation Zeit zur Reaktion hat, bevor ihn jemand anderes sieht. Jeder Eintrag auf diesem Ledger unterliegt derselben Regel - groß oder klein, zahlend oder nicht. Kein Vertrag, keine Geheimhaltung, keine leisere Behandlung. Eingeschlossen ist die erste Handy-Privatsphäre-Sitzung: wir zeigen Ihnen, wie Sie die versteckten Tracker auf Ihrem eigenen Gerät abschalten.");

// Remediation
d = swap(d,
  "Sie bezahlen nicht für ein Dokument. Sie beauftragen eine Untersuchung mit der Methodik von RFI-IRFOS, dem Korpus dekompilierter Apps und der Quellen-Architektur - exakt der Struktur, mit der Funde auf dem öffentlichen Ledger abgelegt werden. Das Ergebnis ist ein nach Schwere geordneter Befund: genau, wie beobachtet wurde, jede Schwachstelle, eine konkrete Behebung für jede davon - innerhalb von 7 Kalendertagen. Dieselben Ingenieur:innen, die die Lücken gefunden haben, führen durch deren Schließung. Dreißig Tage später prüft RFI-IRFOS nach, ob die Fixes tatsächlich angekommen sind. Jeder Fund ist mit dem genauen Datenschutz-Artikel verknüpft, den er verletzt.",
  "Sie bezahlen nicht für ein Dokument. Sie beauftragen eine Untersuchung mit unserer Methodik, dem Korpus dekompilierter Apps und der Quellen-Architektur - exakt der Struktur, mit der Funde auf dem öffentlichen Ledger abgelegt werden. Das Ergebnis ist ein nach Schwere geordneter Befund: genau, wie beobachtet wurde, jede Schwachstelle, eine konkrete Behebung für jede davon - innerhalb von 7 Kalendertagen. Dieselben Ingenieur:innen, die die Lücken gefunden haben, führen durch deren Schließung. Dreißig Tage später prüfen wir nach, ob die Fixes tatsächlich angekommen sind. Jeder Fund ist mit dem genauen Datenschutz-Artikel verknüpft, den er verletzt.");

// Confidential
d = swap(d,
  "Sie beauftragen dieselbe Untersuchung gegen den Korpus von RFI-IRFOS - unter Geheimhaltung. Das Ergebnis ist ein Befund, der jede Schwachstelle nach Schwere ordnet und exakt im Code verortet, plus eine Zusammenfassung, die nicht-technische Führungskräfte lesen können. Innerhalb von 7 Kalendertagen.",
  "Sie beauftragen dieselbe Untersuchung gegen unseren Korpus - unter Geheimhaltung. Das Ergebnis ist ein Befund, der jede Schwachstelle nach Schwere ordnet und exakt im Code verortet, plus eine Zusammenfassung, die nicht-technische Führungskräfte lesen können. Innerhalb von 7 Kalendertagen.");

// Enterprise
d = swap(d,
  "RFI-IRFOS stellt Geheimhaltung, priorisierte Remediation-Zeit über das übliche 90-Tage-Fenster hinaus und direkten Zugang zu den Ingenieur:innen bereit. Für Betreiber kritischer Infrastruktur (Energie, Wasser, Gesundheit, Verkehr) übersetzt RFI-IRFOS NIS2-Pflichten in Kontrollen, die Ihr Team tatsächlich umsetzen kann, und übt das Incident-Response-Protokoll mit Ihnen ein, bevor etwas schiefgeht.",
  "Wir stellen Geheimhaltung, priorisierte Remediation-Zeit über das übliche 90-Tage-Fenster hinaus und direkten Zugang zu den Ingenieur:innen bereit. Für Betreiber kritischer Infrastruktur (Energie, Wasser, Gesundheit, Verkehr) übersetzen wir NIS2-Pflichten in Kontrollen, die Ihr Team tatsächlich umsetzen kann, und üben das Incident-Response-Protokoll mit Ihnen ein, bevor etwas schiefgeht.");

fs.writeFileSync(path.join(root, 'de.ts'), d, 'utf8');
console.log('de.ts rewritten (Wir + chaos->intelligence)');

// ===================== EN =====================
let e = fs.readFileSync(path.join(root, 'en.ts'), 'utf8');

// First Light
e = swap(e,
  "RFI-IRFOS resolves a concrete question against the complete corpus of decompiled applications - not as a report about one vendor, but as a live query run across the entire ecosystem. Nine intelligence layers (code, SDK, data-flow, trackers, privacy, supply-chain, competitive, market, security) combine behind every answer into a traceable chain from signal to entity to conclusion. The result shows what the technology actually does, not what is claimed about it. This is the same corpus our public disclosures draw from: the basis on which change is detected before it becomes public.",
  "You arrive with a pile of chaos - hundreds of apps, contradictory claims, tangled dependencies. We distill intelligence from it. The query runs live against the complete corpus of decompiled applications - not as a report about one vendor, but as a continuous observation of the entire ecosystem. Nine intelligence layers (code, SDK, data-flow, trackers, privacy, supply-chain, competitive, market, security) combine behind every answer into a traceable chain from signal to entity to conclusion. The result shows what the technology actually does, not what is claimed about it. This is the same corpus our public disclosures draw from: the basis on which change is detected before it becomes public.");
e = swap(e,
  "Know before it\\'s public. One question, the full app ecosystem, an answer with a provenance chain.",
  "Know before it\\'s public. You bring the chaos, we distill the intelligence.");

// Competitive Trace
e = swap(e,
  "A competitor's strategic shift usually sits in their code for months before it reaches the press. RFI-IRFOS observes that change where it forms: which SDKs they actually ship, where their privacy behaviour diverges from the policy they publish, where the architecture is quietly changing. Across six corpus layers (code, SDK, data-flow, trackers, privacy, supply-chain), the observation is translated into a defensible relationship between technical change and business meaning. You act on evidence while others are still speculating. The observed corpus is the same one RFI-IRFOS uses for disclosures.",
  "A competitor's strategic shift usually sits in their code for months before it reaches the press. We observe that change where it forms: which SDKs they actually ship, where their privacy behaviour diverges from the policy they publish, where the architecture is quietly changing. Across six corpus layers (code, SDK, data-flow, trackers, privacy, supply-chain), we translate the observation into a defensible relationship between technical change and business meaning. You act on evidence while others are still speculating. The observed corpus is the same one we use for disclosures.");

// Sector Map
e = swap(e,
  "A snapshot is stale the moment it prints. RFI-IRFOS maintains the risk profile of every relevant actor in your sector across all nine intelligence layers as a continuous intelligence picture - refreshed every quarter. The capability is not the delivery of a document, but the continuous observation of how relationships, dependencies and exposures shift across the sector. You see the change forming, not after it has already been priced in. First picture within 14 calendar days; after that the view stays three months ahead of the market.",
  "A snapshot is stale the moment it prints. We maintain the risk profile of every relevant actor in your sector across all nine intelligence layers as a continuous intelligence picture - refreshed every quarter. The capability is not the delivery of a document, but the continuous observation of how relationships, dependencies and exposures shift across the sector. You see the change forming, not after it has already been priced in. First picture within 14 calendar days; after that the view stays three months ahead of the market.");

// Signal
e = swap(e,
  "A competitor rarely makes one public move without months of signal first - a funding round, a security incident, an SDK swap, a quiet pivot in the code. RFI-IRFOS maintains a dedicated analyst who observes the corpus for your sector continuously - not as a monthly summary, but as ongoing monitoring of relevant change with immediate alert on movement. The capability is continuous intelligence: you learn the moment the signal appears, not the headline weeks later. Assigned within a week of payment.",
  "A competitor rarely makes one public move without months of signal first - a funding round, a security incident, an SDK swap, a quiet pivot in the code. We maintain a dedicated analyst who observes the corpus for your sector continuously - not as a monthly summary, but as ongoing monitoring of relevant change with immediate alert on movement. The capability is continuous intelligence: you learn the moment the signal appears, not the headline weeks later. Assigned within a week of payment.");

// Public
e = swap(e,
  "RFI-IRFOS provides the same source-code-level observation capability that paying clients receive - at no cost. After a 90-day heads-up window, the finding is published on the public ledger of RFI-IRFOS, giving the affected organization time to react before anyone else sees it. Every entry on that ledger is held to the identical rule - big or small, paying or not. No contract, no secrecy, no quieter treatment. Included is your first phone privacy session: RFI-IRFOS walks you through switching off the hidden trackers running on your own device.",
  "We provide the same source-code-level observation capability that paying clients receive - at no cost. After a 90-day heads-up window, the finding is published on our public ledger, giving the affected organization time to react before anyone else sees it. Every entry on that ledger is held to the identical rule - big or small, paying or not. No contract, no secrecy, no quieter treatment. Included is your first phone privacy session: we walk you through switching off the hidden trackers running on your own device.");

// Remediation
e = swap(e,
  "You are not paying for a document. You are commissioning an investigation using the methodology of RFI-IRFOS, our corpus of decompiled apps and our source architecture - the exact structure used to log findings on the public ledger. The output is a severity-ranked finding: exactly how it was observed, every weakness, a concrete fix for each one - within 7 calendar days. The same engineers who found the holes walk you through closing them. Thirty days later RFI-IRFOS checks back to confirm the fixes actually landed. Every finding is tied to the exact privacy-law article it breaks.",
  "You are not paying for a document. You are commissioning an investigation using our methodology, our corpus of decompiled apps and our source architecture - the exact structure used to log findings on the public ledger. The output is a severity-ranked finding: exactly how it was observed, every weakness, a concrete fix for each one - within 7 calendar days. The same engineers who found the holes walk you through closing them. Thirty days later we check back to confirm the fixes actually landed. Every finding is tied to the exact privacy-law article it breaks.");

// Confidential
e = swap(e,
  "You commission the same investigation against our corpus - under secrecy. The output is a finding that ranks every weakness by severity and pins it to the exact spot in your code, plus a plain-language summary your non-technical leadership can actually read. Within 7 calendar days.",
  "You commission the same investigation against our corpus - under secrecy. The output is a finding that ranks every weakness by severity and pins it to the exact spot in your code, plus a plain-language summary your non-technical leadership can actually read. Within 7 calendar days.");

// Enterprise
e = swap(e,
  "RFI-IRFOS provides secrecy, priority remediation time beyond the standard 90-day window, and direct engineer access to fix it. For operators of critical infrastructure (energy, water, health, transport) RFI-IRFOS translates NIS2 obligations into controls your team can actually implement, and rehearses the incident-response protocol with you before anything goes wrong.",
  "We provide secrecy, priority remediation time beyond the standard 90-day window, and direct engineer access to fix it. For operators of critical infrastructure (energy, water, health, transport) we translate NIS2 obligations into controls your team can actually implement, and rehearse the incident-response protocol with you before anything goes wrong.");

fs.writeFileSync(path.join(root, 'en.ts'), e, 'utf8');
console.log('en.ts rewritten (We + chaos->intelligence)');
