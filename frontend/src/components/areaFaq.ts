// Area FAQs for the Services hub (/services/<area>/), 23.11.2026. Answers may contain [label](/path/) links.
export type AreaFaqId = 'monitoring' | 'testing' | 'code-and-apps' | 'ai-security' | 'compliance' | 'fix-and-harden'
export const AREA_FAQ: Record<AreaFaqId, { en: [string, string][]; de: [string, string][] }> = {
  monitoring: {
    en: [
      [
        "How do I know if someone is already inside our network?",
        "Intruders rarely trigger one loud alarm. They leave faint traces in several places: a login from an unusual country, a new process on a server, an outbound connection a few minutes later. Our SOC runs on a SIEM we operate ourselves in Graz, Wazuh with OpenSearch, and our agents work through your sources around the clock without waiting for a ticket, correlating them into one incident with a timeline. Anything critical reaches you within one hour. See [Managed SOC](/managed-soc/).",
      ],
      [
        "Who watches our systems at night, on weekends and on public holidays?",
        "Our team is staffed around the clock, so the one-hour response applies at 3 a.m. exactly as it does at noon. Agents raise the alert, and an engineer takes over the incident and traces the attack path. For startups without a security team, and for companies that answer security questionnaires from larger customers, that is a complete night shift without a single new hire. See [Managed SOC](/managed-soc/).",
      ],
      [
        "Which of the new vulnerabilities in the news affect the systems we run?",
        "Every report is matched against the assets, versions and sector recorded in your portal. You receive an early warning only when a vulnerability or a campaign meets a system you run, and it names the system at risk, the campaign behind it, how likely an attack is and the step that protects you. The same vulnerability lands on your remediation board as a task. See [Threat Intelligence](/threat-intelligence/).",
      ],
      [
        "We already pay for a vendor-run detection service. What does your SOC do that it does not?",
        "Such services build on one vendor's agents or cloud. Ours takes in events from the tools you already use, including Suricata, Zeek, Falco, CrowdSec and TheHive, and correlates them on a SIEM in Graz where every customer has an instance of their own. When an incident needs a code change, we write the fix within 24 hours. A detection service ends at the alert, whereas our work ends at the fix. See [Managed SOC](/managed-soc/).",
      ],
      [
        "Our local IT provider already looks after our systems. Why add a security specialist?",
        "A local IT provider keeps your systems running, and security is one task among many. We work on security alone, with our own scanners and SIEM, more than forty open-source and specialised tools across code, apps, cloud and AI, and agents that connect their results into attack paths with fixes. We meet you in Graz or at your premises in Styria for the first conversation, and from there the work runs remotely. See [IT security from Graz](/it-security-graz/).",
      ],
      [
        "What do we have to do to get a managed SOC running?",
        "Install the Wazuh agent or connect the sources you already run, and name a contact for escalations. Monitoring, triage, investigation, the response plan and the fixes sit with us. Every engagement begins with the Domain Security Test, a look at your public attack surface, so the written offer with its fixed monthly price rests on facts. See [Managed SOC](/managed-soc/).",
      ],
    ],
    de: [
      [
        "Woran erkenne ich, ob jemand bereits in unserem Netzwerk ist?",
        "Eindringlinge lösen selten einen lauten Alarm aus. Sie hinterlassen schwache Spuren an mehreren Stellen: eine Anmeldung aus einem ungewöhnlichen Land, einen neuen Prozess auf einem Server, wenige Minuten später eine ausgehende Verbindung. Unser SOC läuft auf einem SIEM, das wir selbst in Graz betreiben, Wazuh mit OpenSearch, und unsere Agenten arbeiten Ihre Quellen rund um die Uhr selbstständig ab und führen sie zu einem Vorfall mit Zeitverlauf zusammen. Alles Kritische erreicht Sie innerhalb einer Stunde. Mehr unter [Managed SOC](/managed-soc/).",
      ],
      [
        "Wer überwacht unsere Systeme nachts, am Wochenende und an Feiertagen?",
        "Unser Team ist rund um die Uhr besetzt, die Reaktion binnen einer Stunde gilt also um 3 Uhr morgens genauso wie mittags. Agenten lösen den Alarm aus, ein Ingenieur übernimmt den Vorfall und verfolgt den Angriffsweg. Für Startups ohne Sicherheitsteam und für Unternehmen, die Sicherheitsfragebögen größerer Kunden beantworten müssen, ist das eine vollständige Nachtschicht ohne eine einzige Neueinstellung. Mehr unter [Managed SOC](/managed-soc/).",
      ],
      [
        "Welche der neuen Schwachstellen aus den Nachrichten betreffen die Systeme, die wir betreiben?",
        "Jede Meldung wird mit den Assets, Versionen und der Branche abgeglichen, die in Ihrem Portal hinterlegt sind. Eine Frühwarnung erhalten Sie nur, wenn eine Schwachstelle oder Kampagne auf ein System trifft, das Sie einsetzen. Sie nennt das gefährdete System, die Kampagne dahinter, die Wahrscheinlichkeit eines Angriffs und den Schritt, der Sie schützt. Dieselbe Schwachstelle erscheint zugleich als Aufgabe auf Ihrem Remediation-Board. Mehr unter [Threat Intelligence](/threat-intelligence/).",
      ],
      [
        "Wir nutzen bereits einen Erkennungsdienst eines Herstellers. Was leistet Ihr SOC darüber hinaus?",
        "Solche Dienste bauen auf die Agenten oder die Cloud eines einzelnen Herstellers. Unser SOC übernimmt Ereignisse aus den Werkzeugen, die Sie bereits einsetzen, darunter Suricata, Zeek, Falco, CrowdSec und TheHive, und korreliert sie auf einem SIEM in Graz, in dem jeder Kunde eine eigene Instanz hat. Erfordert ein Vorfall eine Code-Änderung, schreiben wir den Fix innerhalb von 24 Stunden. Ein Erkennungsdienst endet beim Alarm, unsere Arbeit endet beim Fix. Mehr unter [Managed SOC](/managed-soc/).",
      ],
      [
        "Unser lokaler IT-Dienstleister betreut bereits unsere Systeme. Wozu noch ein Sicherheitsspezialist?",
        "Ein lokaler IT-Dienstleister hält Ihre Systeme am Laufen, Sicherheit ist dabei eine Aufgabe unter vielen. Wir arbeiten ausschließlich an Sicherheit, mit eigenen Scannern und eigenem SIEM, mehr als vierzig Open-Source- und Spezialwerkzeugen für Code, Apps, Cloud und KI sowie Agenten, die deren Ergebnisse zu Angriffspfaden mit Fixes verbinden. Das erste Gespräch führen wir in Graz oder bei Ihnen in der Steiermark, danach läuft die Arbeit aus der Ferne. Mehr unter [IT-Sicherheit aus Graz](/it-security-graz/).",
      ],
      [
        "Was müssen wir tun, damit ein Managed SOC läuft?",
        "Installieren Sie den Wazuh-Agenten oder binden Sie die Quellen an, die Sie bereits betreiben, und nennen Sie eine Ansprechperson für Eskalationen. Überwachung, Triage, Untersuchung, Reaktionsplan und Fixes übernehmen wir. Jedes Projekt beginnt mit dem Domain Security Test, einem Blick auf Ihre öffentliche Angriffsfläche, damit das schriftliche Angebot mit festem Monatspreis auf Fakten beruht. Mehr unter [Managed SOC](/managed-soc/).",
      ],
    ],
  },
  testing: {
    en: [
      [
        "How do I find out which weaknesses in my web app an attacker could really exploit?",
        "Our agents run thousands of tests in parallel, chain individual weaknesses into attack paths and try them against your systems within the scope we agree in writing. Each path that succeeds comes with a proof of concept and its fix. You get the handful of routes that lead to your data, ranked by what an attacker can actually reach. See [Penetration Testing](/penetration-testing/).",
      ],
      [
        "Can a logged-in user of my API read another customer's data?",
        "This is the most common API gap: a user changes an ID in a request and receives someone else's invoice. Our agents replay every request with the identities of different users and roles, so object-level and function-level authorization gaps surface with a proof of concept. We cover REST and GraphQL together with their tokens, sessions and API keys. See [API Security Testing](/api-security-testing/).",
      ],
      [
        "Is our AWS or Azure setup misconfigured, and what could an attacker reach from outside?",
        "Create a read-only role with the policy we provide, and we inventory your accounts and clusters, scan container images with Trivy and map the external attack surface. Our agents then work out which findings an attacker can chain from the outside into your data. You receive the few paths that matter, each with its fix, out of hundreds of individual settings. See [Cloud Security Assessment](/cloud-security-assessment/).",
      ],
      [
        "We already run Nessus or Qualys. What does a penetration test find that a scanner does not?",
        "A scanner checks hosts against a catalogue and reports every weakness on its own. We take that material as the starting point, and our agents combine a forgotten test subdomain, a role with one admin function too many and a medium flaw that opens the way to a critical one into the path that matters. Your team receives one ranked route to close instead of a long list of single findings. See [Penetration Testing](/penetration-testing/).",
      ],
      [
        "My security rating or SSL Labs grade is poor. What exactly do I change?",
        "A rating tells you that something is wrong, whereas our Domain Security Test names the setting. Our own scanner covers HTTP, TLS, DNS, SPF, DKIM, DMARC, security headers and embedded trackers, rates each finding with CVSS 3.1 and states in plain language what an attacker could do with it: which subdomain accepts outdated TLS, which DMARC setting lets others send mail in your name. See [Domain Security Test](/domain-security-test/).",
      ],
      [
        "How much effort is a first test, and what do we receive?",
        "For the Domain Security Test you enter one domain. The test reads only what is publicly visible, from a European IP address, with no login and no payloads, so no access, installation or test window is needed. A researcher reviews your request and replies within one business day, and the short written report names each finding with its CVSS severity and the next step. Larger tests receive a written offer before anything starts. See [Domain Security Test](/domain-security-test/).",
      ],
    ],
    de: [
      [
        "Wie finde ich heraus, welche Schwachstellen meiner Web-App ein Angreifer tatsächlich ausnutzen könnte?",
        "Unsere Agenten führen Tausende Tests parallel aus, verketten einzelne Schwachstellen zu Angriffspfaden und probieren sie innerhalb des schriftlich vereinbarten Umfangs an Ihren Systemen aus. Jeder gelungene Pfad kommt mit Proof of Concept und Fix. Sie erhalten die wenigen Wege, die zu Ihren Daten führen, geordnet danach, was ein Angreifer wirklich erreicht. Mehr unter [Penetrationstest](/penetration-testing/).",
      ],
      [
        "Kann ein angemeldeter Nutzer meiner API die Daten eines anderen Kunden lesen?",
        "Das ist die häufigste Lücke bei APIs: Ein Nutzer ändert eine ID in der Anfrage und erhält die Rechnung eines anderen. Unsere Agenten spielen jede Anfrage mit den Identitäten unterschiedlicher Nutzer und Rollen erneut ab, sodass Autorisierungslücken auf Objekt- und Funktionsebene mit Proof of Concept sichtbar werden. Wir prüfen REST und GraphQL samt Tokens, Sessions und API-Schlüsseln. Mehr unter [API-Sicherheitstest](/api-security-testing/).",
      ],
      [
        "Ist unsere AWS- oder Azure-Umgebung falsch konfiguriert, und was erreicht ein Angreifer von außen?",
        "Sie legen eine Rolle mit reinem Lesezugriff nach unserer Vorlage an. Wir inventarisieren Ihre Konten und Cluster, scannen Container-Images mit Trivy und erfassen die externe Angriffsfläche. Unsere Agenten ermitteln dann, welche Funde ein Angreifer von außen bis zu Ihren Daten verketten kann. Sie erhalten die wenigen Pfade, auf die es ankommt, jeweils mit Fix, aus Hunderten einzelner Einstellungen herausgefiltert. Mehr unter [Cloud-Sicherheitsprüfung](/cloud-security-assessment/).",
      ],
      [
        "Wir setzen schon Nessus oder Qualys ein. Was findet ein Penetrationstest, das ein Scanner übersieht?",
        "Ein Scanner gleicht Hosts mit einem Katalog ab und meldet jede Schwachstelle einzeln. Dieses Material nehmen wir als Ausgangspunkt, und unsere Agenten verbinden eine vergessene Test-Subdomain, eine Rolle mit einer Admin-Funktion zu viel und einen mittleren Fund, der den Weg zu einem kritischen öffnet, zu dem Pfad, der für Sie zählt. Ihr Team erhält einen geordneten Weg, den es schließen kann, statt einer langen Liste einzelner Funde. Mehr unter [Penetrationstest](/penetration-testing/).",
      ],
      [
        "Mein Security-Rating oder meine SSL-Labs-Note ist schlecht. Was genau muss ich ändern?",
        "Ein Rating sagt Ihnen, dass etwas nicht stimmt, während unser Domain Security Test die Einstellung nennt. Unser eigener Scanner prüft HTTP, TLS, DNS, SPF, DKIM, DMARC, Security-Header und eingebettete Tracker, bewertet jeden Fund nach CVSS 3.1 und erklärt in einfachen Worten, was ein Angreifer damit anfangen kann: welche Subdomain veraltetes TLS akzeptiert, welche DMARC-Einstellung anderen erlaubt, in Ihrem Namen Mails zu senden. Mehr unter [Domain Security Test](/domain-security-test/).",
      ],
      [
        "Wie aufwendig ist ein erster Test, und was erhalten wir?",
        "Für den Domain Security Test geben Sie eine Domain an. Der Test liest nur, was öffentlich sichtbar ist, von einer europäischen IP-Adresse, ohne Login und ohne Payloads, es braucht also weder Zugang noch Installation noch ein Testfenster. Eine Forscherin oder ein Forscher prüft Ihre Anfrage und antwortet innerhalb eines Werktags, und der kurze schriftliche Bericht nennt jeden Fund mit CVSS-Schweregrad und nächstem Schritt. Größere Tests erhalten vor dem Start ein schriftliches Angebot. Mehr unter [Domain Security Test](/domain-security-test/).",
      ],
    ],
  },
  'code-and-apps': {
    en: [
      [
        "Is my app sending user data to third parties without consent?",
        "Our tools decompile the shipped build and observe its traffic, and our agents compare every data flow with your privacy policy, the consent given and the legal basis you rely on. That exposes transfers that happen before consent, data sent to a processor your policy never mentions and SDKs that collect more than their stated purpose. Each gap arrives as a finding with evidence and the change that closes it. See [GDPR App Audit](/gdpr-app-audit/).",
      ],
      [
        "Which trackers and SDKs are hidden inside my app?",
        "We list every SDK in the shipped build, the moment it starts, what it collects and which servers it contacts. That includes SDKs that are renamed or bundled inside other libraries and endpoints of a third party that sit on your own domain. A built package is enough, and the report marks every library that acts on user data. See [App Tracker and SDK Check](/app-tracker-sdk-check/).",
      ],
      [
        "Can someone pull API keys and secrets out of my published Android or iOS app?",
        "Anyone with the same build can try, so we try first. We decompile the shipped app with tools such as APKTool, JADX and Ghidra, search it for hardcoded keys with TruffleHog and follow each key to see whether it unlocks a production backend. You need no source code for this, and the report names the location of every finding together with its fix. See [App Security Audit](/app-security-audit/).",
      ],
      [
        "We use Semgrep, CodeQL or Snyk. What does a secure code review add?",
        "Semgrep runs inside our review as the first layer, and exports from CodeQL, GitHub code scanning or Snyk go in as input. Our agents then follow each alert through the whole application, link it with other weaknesses and test whether an attacker can reach it. A rule match becomes a demonstrated attack path with a fix, and alerts that lead nowhere close before they cost your team time. See [Secure Code Review](/secure-code-review/).",
      ],
      [
        "How does an app audit differ from a MobSF or NowSecure scan?",
        "Those tools scan a build against a catalogue of mobile weaknesses and produce a report per app. Our audit runs a chain of tools over the shipped build, among them APKTool, aapt2, JADX, Ghidra, Frida and TruffleHog, and the NYX knowledge graph links what they find to CWE, CAPEC and MITRE ATT&CK. Agents trace which key, SDK or endpoint leads somewhere, so each finding arrives as an attack path with its evidence and fix. See [App Security Audit](/app-security-audit/).",
      ],
      [
        "How much work does a code review take on our side?",
        "Three steps: grant read access to the repository or send the build, review the patch and merge it. Triage, reproduction, attack-path analysis, the fix and the retest sit with us, and the remediation board shows where each finding stands. From the Growth plan, checks run on your cadence, up to every 15 minutes, and fixes arrive as a patch file that applies with git apply on any Git host. See [Secure Code Review](/secure-code-review/).",
      ],
    ],
    de: [
      [
        "Sendet meine App Nutzerdaten ohne Einwilligung an Dritte?",
        "Unsere Werkzeuge dekompilieren den ausgelieferten Build und beobachten seinen Datenverkehr, unsere Agenten vergleichen jeden Datenfluss mit Ihrer Datenschutzerklärung, der erteilten Einwilligung und der Rechtsgrundlage, auf die Sie sich stützen. So treten Übermittlungen vor der Einwilligung zutage, Daten an einen Auftragsverarbeiter, den Ihre Erklärung nie nennt, und SDKs, die mehr sammeln als ihr erklärter Zweck. Jede Lücke kommt als Fund mit Beleg und der Änderung, die sie schließt. Mehr unter [DSGVO-App-Audit](/gdpr-app-audit/).",
      ],
      [
        "Welche Tracker und SDKs stecken in meiner App?",
        "Wir listen jedes SDK im ausgelieferten Build auf, den Zeitpunkt seines Starts, was es erfasst und welche Server es kontaktiert. Dazu zählen umbenannte oder in andere Bibliotheken eingebettete SDKs und Endpunkte Dritter, die auf Ihrer eigenen Domain liegen. Ein gebautes Paket genügt, und der Bericht kennzeichnet jede Bibliothek, die auf Nutzerdaten zugreift. Mehr unter [Tracker- und SDK-Check](/app-tracker-sdk-check/).",
      ],
      [
        "Kann jemand API-Schlüssel und Geheimnisse aus meiner veröffentlichten Android- oder iOS-App auslesen?",
        "Jeder mit demselben Build kann es versuchen, also versuchen wir es zuerst. Wir dekompilieren die ausgelieferte App mit Werkzeugen wie APKTool, JADX und Ghidra, durchsuchen sie mit TruffleHog nach fest eingebauten Schlüsseln und folgen jedem Schlüssel bis zu der Frage, ob er ein Produktivsystem öffnet. Quellcode brauchen Sie dafür nicht, und der Bericht nennt zu jedem Fund die Fundstelle und den Fix. Mehr unter [App-Sicherheitsaudit](/app-security-audit/).",
      ],
      [
        "Wir nutzen Semgrep, CodeQL oder Snyk. Was bringt ein Secure Code Review zusätzlich?",
        "Semgrep läuft in unserem Review als erste Schicht mit, Exporte aus CodeQL, GitHub Code Scanning oder Snyk fließen als Eingabe ein. Unsere Agenten verfolgen dann jeden Alarm durch die gesamte Anwendung, verknüpfen ihn mit weiteren Schwächen und prüfen, ob ein Angreifer ihn erreichen kann. Aus einem Regeltreffer wird ein belegter Angriffspfad mit Fix, und Alarme, die ins Leere führen, sind erledigt, bevor sie Ihr Team Zeit kosten. Mehr unter [Secure Code Review](/secure-code-review/).",
      ],
      [
        "Worin unterscheidet sich ein App-Audit von einem Scan mit MobSF oder NowSecure?",
        "Diese Werkzeuge gleichen einen Build mit einem Katalog mobiler Schwachstellen ab und liefern pro App einen Bericht. Unser Audit lässt eine ganze Werkzeugkette über den ausgelieferten Build laufen, darunter APKTool, aapt2, JADX, Ghidra, Frida und TruffleHog, und der NYX-Wissensgraph verknüpft die Funde mit CWE, CAPEC und MITRE ATT&CK. Agenten verfolgen, welcher Schlüssel, welches SDK und welcher Endpunkt tatsächlich irgendwohin führt, jeder Fund kommt deshalb als Angriffspfad mit Beleg und Fix. Mehr unter [App-Sicherheitsaudit](/app-security-audit/).",
      ],
      [
        "Wie viel Arbeit bleibt bei einem Code Review auf unserer Seite?",
        "Drei Schritte: Lesezugriff auf das Repository gewähren oder den Build senden, den Patch prüfen und einspielen. Triage, Nachstellung, Angriffspfad-Analyse, Fix und Retest übernehmen wir, und das Remediation-Board zeigt, wo jeder Fund steht. Ab dem Growth-Tarif laufen die Prüfungen in Ihrem Takt, bis hin zu alle 15 Minuten, und Fixes kommen als Patch-Datei, die sich auf jedem Git-Host mit git apply einspielen lässt. Mehr unter [Secure Code Review](/secure-code-review/).",
      ],
    ],
  },
  'ai-security': {
    en: [
      [
        "Can someone hijack our chatbot or AI agent with a hidden instruction?",
        "Yes, that is prompt injection. In the direct form a user types the instruction into the chat, in the indirect form it hides in a web page, an e-mail or a support ticket the model reads later. We test both, show which instructions your model follows and narrow the permissions of your agents to what the task requires. See [AI and LLM Security Testing](/ai-llm-security-testing/).",
      ],
      [
        "Where do conversations with our AI app end up, and do any of them leave the EU?",
        "We trace every request the app sends, to the model provider, to analytics and to crash reporting, together with what each request carries. The report shows which recipients receive conversations and personal data and which of them sit outside the EU. Findings carry the GDPR article they touch and are mapped to the OWASP Top 10 for LLM Applications and to MITRE ATLAS. See [AI App Privacy Audit](/ai-app-privacy-audit/).",
      ],
      [
        "How do I test an MCP server or an agent with too many permissions?",
        "We map every tool an agent may call, the data it reaches and the actions that need a person's approval. For MCP servers we examine authentication, the scope of each tool and whether a manipulated answer from one server can steer actions on another. Then we test what an injected instruction could make the agent do and deliver the fix down to prompts, permissions and code. See [AI and LLM Security Testing](/ai-llm-security-testing/).",
      ],
      [
        "We looked at Garak, Promptfoo and Lakera. What does your testing do beyond that?",
        "Our agents run Garak and nineteen further open-source tools such as Spikee, PromptMap, FuzzyAI, AgentDojo, LLM Guard and Rebuff, all from our own public AI security toolkit. Each probes one class of weakness, and the agents combine the hits with your architecture: which data sources the model reads, which tools an agent may call, where a person approves an action. A runtime filter such as Lakera shields inputs, whereas our test shows which attacks get through your whole setup, filter included, and delivers the fix. See [AI and LLM Security Testing](/ai-llm-security-testing/).",
      ],
      [
        "The app store privacy label says our AI app is safe. Why audit it anyway?",
        "A store label is written by the developer and describes what the app is supposed to do. Our audit decompiles the build, observes its traffic and follows every conversation to the model provider, analytics service or storage location it reaches, so declared and observed behaviour can be compared line by line. It uncovers chats stored outside the EU, prompts forwarded to analytics and keys that let anyone read the chat history. Our public reports on Character.AI, DeepSeek, ChatGPT, Grok, Perplexity and Gemini show the format. See [AI App Privacy Audit](/ai-app-privacy-audit/).",
      ],
      [
        "What do you need from us, and do you attack our live system?",
        "No, your live system stays out of reach. Attacks run against a staging copy or a test endpoint, so production data and customers stay untouched. From you we need that copy and a description of the intended behaviour of the assistant or agent, and you approve the changes we propose. Mapping, attacks, evidence, the fix and the retest sit with us. See [AI and LLM Security Testing](/ai-llm-security-testing/).",
      ],
    ],
    de: [
      [
        "Kann jemand unseren Chatbot oder KI-Agenten mit einer versteckten Anweisung übernehmen?",
        "Ja, das nennt sich Prompt Injection. Bei der direkten Form tippt ein Nutzer die Anweisung in den Chat, bei der indirekten steckt sie in einer Webseite, einer E-Mail oder einem Support-Ticket, das das Modell später liest. Wir testen beide, zeigen, welchen Anweisungen Ihr Modell folgt, und beschränken die Rechte Ihrer Agenten auf das, was die Aufgabe braucht. Mehr unter [KI- und LLM-Sicherheitstests](/ai-llm-security-testing/).",
      ],
      [
        "Wo landen die Gespräche mit unserer KI-App, und verlässt etwas davon die EU?",
        "Wir verfolgen jede Anfrage der App, an den Modellanbieter, an Analytics und an die Absturzberichte, samt dem, was jede Anfrage enthält. Der Bericht zeigt, welche Empfänger Gespräche und personenbezogene Daten erhalten und welche davon außerhalb der EU sitzen. Die Funde nennen den berührten DSGVO-Artikel und sind der OWASP Top 10 für LLM-Anwendungen sowie MITRE ATLAS zugeordnet. Mehr unter [KI-App-Datenschutzaudit](/ai-app-privacy-audit/).",
      ],
      [
        "Wie teste ich einen MCP-Server oder einen Agenten mit zu vielen Rechten?",
        "Wir erfassen jedes Werkzeug, das ein Agent aufrufen darf, die Daten, die er erreicht, und die Aktionen, die eine Freigabe durch einen Menschen brauchen. Bei MCP-Servern prüfen wir die Authentifizierung, den Umfang jedes Werkzeugs und ob eine manipulierte Antwort eines Servers Aktionen auf einem anderen steuern kann. Danach testen wir, wozu eine eingeschleuste Anweisung den Agenten bringen kann, und liefern den Fix bis hinunter zu Prompts, Rechten und Code. Mehr unter [KI- und LLM-Sicherheitstests](/ai-llm-security-testing/).",
      ],
      [
        "Wir haben uns Garak, Promptfoo und Lakera angesehen. Was leisten Ihre Tests darüber hinaus?",
        "Unsere Agenten setzen Garak und neunzehn weitere Open-Source-Werkzeuge wie Spikee, PromptMap, FuzzyAI, AgentDojo, LLM Guard und Rebuff ein, alle aus unserem eigenen öffentlichen KI-Sicherheits-Toolkit. Jedes prüft eine Klasse von Schwächen, und die Agenten verbinden die Treffer mit Ihrer Architektur: welche Datenquellen das Modell liest, welche Werkzeuge ein Agent aufrufen darf, wo ein Mensch eine Aktion freigibt. Ein Laufzeitfilter wie Lakera schirmt Eingaben ab, unser Test zeigt dagegen, welche Angriffe durch Ihren gesamten Aufbau samt Filter gelangen, und liefert den Fix. Mehr unter [KI- und LLM-Sicherheitstests](/ai-llm-security-testing/).",
      ],
      [
        "Das Datenschutzlabel im App-Store sagt, unsere KI-App sei sicher. Wozu dann ein Audit?",
        "Ein Store-Label schreibt der Entwickler selbst, und es beschreibt, was die App tun soll. Unser Audit dekompiliert den Build, beobachtet den Datenverkehr und folgt jedem Gespräch bis zum Modellanbieter, Analysedienst oder Speicherort, den es erreicht, sodass erklärtes und beobachtetes Verhalten Zeile für Zeile vergleichbar werden. So kommen Chats zutage, die außerhalb der EU liegen, Prompts, die an Analytics weitergereicht werden, und Schlüssel, mit denen jeder den Chatverlauf lesen kann. Unsere öffentlichen Berichte zu Character.AI, DeepSeek, ChatGPT, Grok, Perplexity und Gemini zeigen das Format. Mehr unter [KI-App-Datenschutzaudit](/ai-app-privacy-audit/).",
      ],
      [
        "Was brauchen Sie von uns, und greifen Sie unser Livesystem an?",
        "Nein, Ihr Livesystem bleibt außer Reichweite. Die Angriffe laufen gegen eine Staging-Kopie oder einen Test-Endpunkt, Produktivdaten und Kunden bleiben unberührt. Von Ihnen brauchen wir diese Kopie und eine Beschreibung des beabsichtigten Verhaltens des Assistenten oder Agenten, die vorgeschlagenen Änderungen geben Sie frei. Erfassung, Angriffe, Belege, Fix und Retest übernehmen wir. Mehr unter [KI- und LLM-Sicherheitstests](/ai-llm-security-testing/).",
      ],
    ],
  },
  compliance: {
    en: [
      [
        "What does NIS2 require from a company with 50 employees?",
        "That depends on sector, size and your role in supply chains, so the applicability check comes first. Austria's NISG 2026 has applied since 1 October 2026: entities in scope register within three months, demonstrate state-of-the-art risk management and report incidents on time, with management approving the measures and answering for them. We work through the criteria with you, document the result and take you on to the evidence an inspection asks for. See [NIS2 Consulting](/nis2-consulting/).",
      ],
      [
        "A customer that falls under NIS2 is asking us about our software. What will they want to know?",
        "The questions arrive in procurement: what is inside your app, which libraries in which versions, which keys, which endpoints. We map the NIS2 obligations against your code, configuration and data flows, and Trivy produces the software bill of materials that matches what you really ship. The result is technical evidence you can hand over, with fixes and retests behind it. See [NIS2 for Software Vendors](/nis2-software-vendors/).",
      ],
      [
        "How do I check whether our suppliers are secure before we sign?",
        "We examine each vendor's public attack surface read-only, read its certificates, policies and questionnaire answers and compare what it claims with what its systems show. Where the vendor ships software or an app into your environment, our code and app audit tools look inside it. Suppliers are ranked by impact, so critical ones receive deeper reviews and continuous monitoring. See [Vendor Risk Management](/vendor-risk-management/).",
      ],
      [
        "We are comparing compliance platforms. What does your compliance automation do that others do not?",
        "Other platforms collect evidence that controls exist, mostly from configuration and policy documents. We add technical proof that the controls hold: Semgrep, Gitleaks, Trivy and ClamAV scan your code and artefacts continuously, and every finding passes through analysis, fix and retest before it becomes evidence in the portal. Your auditor sees control, finding, fix and retest in one place, sorted by framework, while manual work drops for up to 90% of your compliance tasks. See [Compliance Automation](/compliance-automation/).",
      ],
      [
        "How is your NIS2 work different from a classic consultancy?",
        "A consultancy usually delivers a gap analysis and a set of policies. We add the operational side that Article 21 asks for: our domain scanner, code and cloud checks and the Managed SOC measure where your technical measures stand, findings are fixed and retested, and the portal keeps the evidence for the authority and your management in one place. That exposes measures that exist on paper and fail in practice, such as a multi-factor login that leaves one admin account out. See [NIS2 Consulting](/nis2-consulting/).",
      ],
      [
        "How do we stop answering the same security questionnaire for every deal?",
        "Publish your security posture in a branded Trust Center. Buyers get self-service access to your security documentation and live controls, access approvals and NDAs are automated, and the evidence stays current because continuous scans feed it. Security reviews stop stalling your deals, and your team gets that time back. See [Compliance Automation](/compliance-automation/).",
      ],
      [
        "How fast can we start, and do you certify us?",
        "Setup takes about five minutes, and the first scan can start right after it. You receive a written technical report with evidence for your risk-management documentation. A certificate is not part of it, because your auditor certifies, and we deliver what the auditor needs. See [NIS2 Consulting](/nis2-consulting/).",
      ],
    ],
    de: [
      [
        "Was verlangt NIS2 von einem Unternehmen mit 50 Mitarbeitenden?",
        "Das hängt von Branche, Größe und Ihrer Rolle in Lieferketten ab, die Prüfung der Betroffenheit steht deshalb am Anfang. Das österreichische NISG 2026 gilt seit dem 1. Oktober 2026: Betroffene Einrichtungen melden sich innerhalb von drei Monaten an, weisen ein Risikomanagement nach dem Stand der Technik nach und melden Vorfälle fristgerecht, die Geschäftsleitung genehmigt die Maßnahmen und haftet dafür. Wir gehen die Kriterien gemeinsam mit Ihnen durch, dokumentieren das Ergebnis und begleiten Sie bis zu den Nachweisen, die eine Prüfung verlangt. Mehr unter [NIS2-Beratung](/nis2-consulting/).",
      ],
      [
        "Ein Kunde, der unter NIS2 fällt, fragt uns nach unserer Software. Was will er wissen?",
        "Die Fragen kommen im Einkauf: Was steckt in Ihrer App, welche Bibliotheken in welchen Versionen, welche Schlüssel, welche Endpunkte. Wir ordnen die NIS2-Pflichten Ihrem Code, Ihrer Konfiguration und Ihren Datenflüssen zu, und Trivy erzeugt die Software-Stückliste, die dem entspricht, was Sie tatsächlich ausliefern. Sie erhalten technische Nachweise zum Weitergeben, mit Fixes und Retests dahinter. Mehr unter [NIS2 für Softwareanbieter](/nis2-software-vendors/).",
      ],
      [
        "Wie prüfe ich vor der Vertragsunterzeichnung, ob unsere Lieferanten sicher sind?",
        "Wir untersuchen die öffentliche Angriffsfläche jedes Anbieters rein lesend, lesen seine Zertifikate, Richtlinien und Fragebogenantworten und stellen dem, was er behauptet, gegenüber, was seine Systeme zeigen. Liefert der Anbieter Software oder eine App in Ihre Umgebung, prüfen unsere Code- und App-Audit-Werkzeuge ihr Inneres. Lieferanten werden nach Auswirkung eingestuft, kritische erhalten tiefere Prüfungen und laufende Überwachung. Mehr unter [Lieferantenrisikomanagement](/vendor-risk-management/).",
      ],
      [
        "Wir vergleichen Compliance-Plattformen. Was leistet Ihre Compliance-Automatisierung, was andere nicht leisten?",
        "Andere Plattformen sammeln Belege dafür, dass Kontrollen existieren, meist aus Konfigurationen und Richtliniendokumenten. Wir liefern den technischen Beweis, dass die Kontrollen greifen: Semgrep, Gitleaks, Trivy und ClamAV scannen Ihren Code und Ihre Artefakte laufend, und jeder Fund durchläuft Analyse, Fix und Retest, bevor er im Portal zum Nachweis wird. Ihre Prüferin oder Ihr Prüfer sieht Kontrolle, Fund, Fix und Retest an einem Ort, nach Regelwerk sortiert, und die manuelle Arbeit sinkt bei bis zu 90 % Ihrer Compliance-Aufgaben. Mehr unter [Compliance-Automatisierung](/compliance-automation/).",
      ],
      [
        "Wie unterscheidet sich Ihre NIS2-Arbeit von einer klassischen Beratung?",
        "Eine Beratung liefert meist eine Lückenanalyse und ein Set an Richtlinien. Wir ergänzen die operative Seite, die Artikel 21 verlangt: Unser Domain-Scanner, die Code- und Cloud-Prüfungen und das Managed SOC messen, wo Ihre technischen Maßnahmen stehen, Funde werden behoben und erneut getestet, und das Portal hält die Nachweise für Behörde und Geschäftsleitung an einem Ort. So fallen Maßnahmen auf, die auf dem Papier bestehen und in der Praxis versagen, etwa eine Mehrfaktor-Anmeldung, die ein Admin-Konto auslässt. Mehr unter [NIS2-Beratung](/nis2-consulting/).",
      ],
      [
        "Wie hören wir auf, bei jedem Abschluss dieselben Sicherheitsfragen zu beantworten?",
        "Veröffentlichen Sie Ihre Sicherheitslage in einem Trust Center im eigenen Auftritt. Käufer erhalten Selbstbedienungszugang zu Ihrer Sicherheitsdokumentation und zu den laufenden Kontrollen, Zugriffsfreigaben und NDAs laufen automatisch, und die Nachweise bleiben aktuell, weil laufende Scans sie speisen. Sicherheitsprüfungen bremsen Ihre Abschlüsse nicht mehr, und Ihr Team bekommt die Zeit zurück. Mehr unter [Compliance-Automatisierung](/compliance-automation/).",
      ],
      [
        "Wie schnell können wir starten, und zertifizieren Sie uns?",
        "Die Einrichtung dauert etwa fünf Minuten, der erste Scan kann direkt danach beginnen. Sie erhalten einen schriftlichen technischen Bericht mit Nachweisen für Ihre Risikomanagement-Dokumentation. Ein Zertifikat gehört nicht dazu, denn zertifizieren darf Ihr Auditor, und wir liefern, was er dafür braucht. Mehr unter [NIS2-Beratung](/nis2-consulting/).",
      ],
    ],
  },
  'fix-and-harden': {
    en: [
      [
        "We have hundreds of open findings from scanners and audits. How do we get them fixed?",
        "Send the report or scanner export and grant read access to the repository. Our agents reproduce each finding in your code, group them by root cause, which often turns one problem reported twenty times into a single fix, and set aside alerts in code that never runs. Our engineers write the fix down to the affected code, and your team reviews and merges each change. See [Vulnerability Remediation](/vulnerability-remediation/).",
      ],
      [
        "Which vulnerabilities should we patch first?",
        "The ones that carry the most risk for your business. We combine the CVSS severity with EPSS, the probability of exploitation within the next 30 days, and with the KEV catalogue of vulnerabilities already exploited in the wild. A medium flaw that attackers use today moves ahead of a critical one that nobody targets. See [Vulnerability Remediation](/vulnerability-remediation/).",
      ],
      [
        "What happens to our operation if one component fails or is breached?",
        "We map data flows, identities, network boundaries and the dependencies between your systems, and show where one component trusts another blindly and where a single point of failure carries the operation. Controlled fault injection then tests whether failover and recovery hold, in staging first with agreed time windows and stop conditions. You receive measured recovery times and prioritised recommendations. See [Security Architecture Review](/security-architecture-review/).",
      ],
      [
        "We use Copilot Autofix and automated fix pull requests. What do you do differently?",
        "Automated suggestions change the flagged line and leave review, testing and the question of whether the flaw was real with your developers. We start one step earlier: our agents reproduce each finding, Trivy, Semgrep and Gitleaks check the surrounding code, and engineers write a fix that removes the cause. Then we rerun the original proof of concept as a retest, so the patch arrives together with its proof. See [Vulnerability Remediation](/vulnerability-remediation/).",
      ],
      [
        "Why review the architecture when we already draw threat models?",
        "Threat modeling tools such as Microsoft Threat Modeling Tool or IriusRisk derive threats from a diagram you draw. Our review starts from the systems as they run: read-only cloud and Kubernetes inventories, scanner results and the NYX knowledge graph show the real data flows and trust relationships. That finds the service that still calls a retired database, the credential shared between staging and production and the failover that depends on the region it is meant to replace. See [Security Architecture Review](/security-architecture-review/).",
      ],
      [
        "How do we know a fix works, and how fast does it arrive?",
        "After your team applies the change, a retest runs the original proof of concept again, and the finding closes once the attack fails. The closed finding with its retest then serves as evidence for your next audit. With the Managed SOC we fix findings within 24 hours, down to the code. From Growth, our engineers write the fix into your code, and Starter includes fix guidance for every finding. See [Vulnerability Remediation](/vulnerability-remediation/).",
      ],
    ],
    de: [
      [
        "Wir haben Hunderte offene Funde aus Scannern und Audits. Wie bekommen wir sie behoben?",
        "Senden Sie uns den Bericht oder den Scanner-Export und gewähren Sie Lesezugriff auf das Repository. Unsere Agenten stellen jeden Fund in Ihrem Code nach, gruppieren sie nach Ursache, wodurch aus einem zwanzigfach gemeldeten Problem oft ein einziger Fix wird, und legen Alarme in Code beiseite, der nie ausgeführt wird. Unsere Ingenieure schreiben den Fix bis in den betroffenen Code, Ihr Team prüft und übernimmt jede Änderung. Mehr unter [Schwachstellen-Behebung](/vulnerability-remediation/).",
      ],
      [
        "Welche Schwachstellen sollen wir zuerst patchen?",
        "Die mit dem größten Risiko für Ihr Geschäft. Wir verbinden den CVSS-Schweregrad mit EPSS, der Wahrscheinlichkeit einer Ausnutzung in den nächsten 30 Tagen, und mit dem KEV-Katalog der Schwachstellen, die bereits aktiv ausgenutzt werden. Eine mittlere Schwachstelle, die Angreifer heute nutzen, rückt vor eine kritische, auf die niemand zielt. Mehr unter [Schwachstellen-Behebung](/vulnerability-remediation/).",
      ],
      [
        "Was geschieht mit unserem Betrieb, wenn eine Komponente ausfällt oder angegriffen wird?",
        "Wir erfassen Datenflüsse, Identitäten, Netzgrenzen und die Abhängigkeiten zwischen Ihren Systemen und zeigen, wo eine Komponente einer anderen blind vertraut und wo ein einzelner Ausfallpunkt den Betrieb trägt. Gezielte Fehlerinjektion prüft anschließend, ob Failover und Wiederherstellung halten, zuerst in Staging, mit vereinbarten Zeitfenstern und Abbruchbedingungen. Sie erhalten gemessene Wiederherstellungszeiten und priorisierte Empfehlungen. Mehr unter [Sicherheitsarchitektur-Review](/security-architecture-review/).",
      ],
      [
        "Wir nutzen Copilot Autofix und automatische Fix-Pull-Requests. Was machen Sie anders?",
        "Automatische Vorschläge ändern die markierte Zeile und überlassen Prüfung, Test und die Frage, ob die Schwachstelle echt war, Ihren Entwicklern. Wir setzen einen Schritt früher an: Unsere Agenten stellen jeden Fund nach, Trivy, Semgrep und Gitleaks untersuchen den umgebenden Code, und Ingenieure schreiben einen Fix, der die Ursache beseitigt. Danach lassen wir den ursprünglichen Proof of Concept als Retest erneut laufen, der Patch kommt also zusammen mit seinem Beweis. Mehr unter [Schwachstellen-Behebung](/vulnerability-remediation/).",
      ],
      [
        "Warum eine Architekturprüfung, wenn wir bereits Bedrohungsmodelle zeichnen?",
        "Werkzeuge wie das Microsoft Threat Modeling Tool oder IriusRisk leiten Bedrohungen aus einem Diagramm ab, das Sie selbst zeichnen. Unser Review geht von den Systemen aus, wie sie laufen: Cloud- und Kubernetes-Inventare mit reinem Lesezugriff, Scanner-Ergebnisse und der NYX-Wissensgraph zeigen die echten Datenflüsse und Vertrauensbeziehungen. So finden wir den Dienst, der noch eine stillgelegte Datenbank aufruft, die Zugangsdaten, die Staging und Produktion teilen, und das Failover, das von der Region abhängt, die es ersetzen soll. Mehr unter [Sicherheitsarchitektur-Review](/security-architecture-review/).",
      ],
      [
        "Woran erkennen wir, dass ein Fix wirkt, und wie schnell kommt er?",
        "Nachdem Ihr Team die Änderung eingespielt hat, läuft der ursprüngliche Proof of Concept erneut, und der Fund schließt, sobald der Angriff scheitert. Der geschlossene Fund samt Retest dient dann als Nachweis für Ihr nächstes Audit. Mit dem Managed SOC beheben wir Funde innerhalb von 24 Stunden, bis hinunter in den Code. Ab Growth schreiben unsere Ingenieure den Fix in Ihren Code, und Starter enthält zu jedem Fund eine Fix-Anleitung. Mehr unter [Schwachstellen-Behebung](/vulnerability-remediation/).",
      ],
    ],
  },
}
