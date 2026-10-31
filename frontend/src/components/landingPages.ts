// Search-facing landing pages (2026-10-31, Search-Console analysis): 98 % of the clicks on
// rfi-irfos.com came from brand searches, and the buyer queries ("app security audit",
// "DSGVO Prüfung App", "NIS2 Softwareanbieter", "Tracker SDK App prüfen") had zero
// impressions because no title, h1 or URL on the site carried those words, although the
// offer itself (The Squad, human-powered multi-agent security investigations, plus the free
// check) was already on the page. Each entry below is one real, prerendered route with its
// own h1, title, description, canonical, hreflang pair, BreadcrumbList and FAQPage JSON-LD.
//
// Content rule (binding): every claim here restates something already published on the
// site (en.ts/de.ts appPrivacy + pricing + trackRecord copy, LegalPage Standards/FAQ, the
// public ledger). No new prices, certificates, guarantees or customer names. Prices are
// only linked (/access/), never repeated. Counts come from auditStats.json at render time
// (see LandingPage.tsx), not from this file.
//
// Plain data on purpose: the renderer in LandingPage.tsx draws every page from the same
// shape, so a fifth page is one more entry here + one slug in App.tsx/prerender.mjs.

export type LandingLocale = 'en' | 'de'

export type LandingDoc = {
  /** <title>, <= 60 chars, search term first, brand last. */
  title: string
  /** meta description, 120-155 chars. */
  description: string
  /** Short label for breadcrumb, footer and quicklink pills. */
  label: string
  h1: string
  lead: string
  sections: { h2: string; p: string[]; ul?: string[] }[]
  /** Evidence block: intro sentence, links to /evidence/<slug>/ reports. */
  evidenceH2: string
  evidenceIntro: string
  evidence: { slug: string; label: string; note: string }[]
  /** Free-check block above the embedded form. */
  startH2: string
  startText: string[]
  faqH2: string
  faq: [string, string][]
}

import type { LandingSlug } from './landingSlugs'
import { LANDING_SLUGS } from './landingSlugs'
export { LANDING_SLUGS, type LandingSlug } from './landingSlugs'

export const LANDING: Record<LandingSlug, Record<LandingLocale, LandingDoc>> = {
  'app-security-audit': {
    en: {
      title: 'App Security Audit for Android & iOS · RFI-IRFOS',
      description: 'App security audit by The Squad: human-powered, multi-agent. We read your shipped build, find hardcoded keys and network flaws, report with evidence.',
      label: 'App Security Audit',
      h1: 'App Security Audit for Android and iOS',
      lead: 'The Squad examines the shipped build of your Android or iOS app at source-code level: decompiled code, embedded keys, network configuration, third-party SDKs and every data flow that leaves the device. Human specialists re-verify each finding. You receive a written report with the evidence behind every result.',
      sections: [
        {
          h2: 'What the audit covers',
          p: [
            'A mobile app is a bundle of your own code, third-party libraries and configuration that the app store delivers to every phone. The audit treats that bundle as the object of study. Our in-house agents run thousands of parallel tests across code, dependencies, APIs, configurations and attack surfaces, then correlate the results to separate isolated signals from broader security issues.',
            'Five areas make up the scope of every review:',
          ],
          ul: [
            'Source and dependencies: code, third-party libraries and their versions.',
            'Authorization and actions: permissions, data access and abuse paths.',
            'API authorization logic: authentication, access control and trust boundaries.',
            'Credentials and data flows: exposed keys, embedded SDKs, flows to third parties.',
            'Misconfigurations and bugs: insecure defaults, overly broad permissions, software defects.',
          ],
        },
        {
          h2: 'Deep Scan of the build as shipped',
          p: [
            'The investigation decompiles the binary that the store distributes and reads it. That shows what the app does today, which can differ from the documentation, the privacy policy and the data-safety form in the store. Every claim in a report traces back to a specific manifest entry, permission or decompiled class.',
            'You decide what we examine. Send a GitHub link, a repository archive, a package build or an API specification. The audit needs no access to your live systems.',
          ],
        },
        {
          h2: 'Typical findings in an app security audit',
          p: ['These finding classes appear again and again in the audits we have published:'],
          ul: [
            'Hardcoded keys and credentials: cloud API keys, push-notification credentials and backend tokens inside the installable package.',
            'Network configuration: cleartext traffic permitted, an empty network security config, missing certificate pinning, user-installed certificate authorities trusted on a payment app.',
            'Backup and storage: Android backup enabled without exclusions, locally stored data without encryption.',
            'Over-broad permissions: microphone or location declared with no feature that needs them.',
            'Leftovers from development: debug overlays and staging backend domains shipped in the production build.',
          ],
        },
        {
          h2: 'How an audit runs',
          p: [
            'Four steps carry every review. Send: you hand over the material. Examine: our team and one, several or all of our agents work through source, configuration and data flows together. Re-verify: human specialists check every finding before it reaches the report. Evidence: we document the examination in writing, with the evidence for each finding.',
            'The report checks exploitability, meaning what an attacker could realistically do with a finding, ranks severity with CVSS where applicable, and gives remediation guidance. Testing follows OWASP ASVS, the OWASP Top 10 and CWE. Every report ships with a base knowledge graph that links the findings. The Security offer on the Access page states a delivery estimate of 5 business days.',
          ],
        },
      ],
      evidenceH2: 'Evidence from audited apps',
      evidenceIntro: 'Our public ledger lists {apps}+ audited Android and iOS apps and {critical}+ critical findings, each with its full report. These reports show the finding classes above in real apps:',
      evidence: [
        { slug: 'starbucks', label: 'Starbucks Austria', note: 'Two hardcoded Firebase keys, one shared verbatim with a competing brand.' },
        { slug: 'soundcloud', label: 'SoundCloud', note: 'Seven hardcoded production API credentials in one installable package.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials both hardcoded in the Play Store build.' },
        { slug: 'strava', label: 'Strava', note: 'A network security configuration that exists but is empty, with no certificate pinning.' },
      ],
      startH2: 'Start with the free check',
      startText: [
        'The free check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. The result is an initial external assessment and does not replace a source-code review.',
        'A full app security audit starts from the plans on the Access page.',
      ],
      faqH2: 'Questions about app security audits',
      faq: [
        ['What does an app security audit cost?', 'The Access page lists the plans from Starter to Business with their prices, plus an Enterprise option for custom surfaces. Each plan states its scope and what you receive.'],
        ['Which platforms do you cover?', 'Android and iOS apps, together with the APIs and backends they talk to, within the scope you agree.'],
        ['Do you need access to our production systems?', 'No. You choose what we examine and send us the material. We need no access to your live systems.'],
        ['Who verifies the findings?', 'Human specialists re-verify every finding before it reaches the report. Agents do the broad testing, people decide what counts as a finding.'],
        ['Does a client report become public?', 'A client\'s private data, environments and results stay private unless the client approves publication in writing.'],
      ],
    },
    de: {
      title: 'App-Sicherheitsprüfung für Android & iOS · RFI-IRFOS',
      description: 'App-Sicherheitsprüfung durch The Squad: menschlich geprüft, Multi-Agent. Wir lesen Ihren Build, finden Schlüssel und Netzwerkfehler. Bericht mit Belegen.',
      label: 'App-Sicherheitsprüfung',
      h1: 'App-Sicherheitsprüfung für Android und iOS',
      lead: 'The Squad untersucht den ausgelieferten Build Ihrer Android- oder iOS-App auf Quellcode-Ebene: dekompilierter Code, eingebettete Schlüssel, Netzwerkkonfiguration, Drittanbieter-SDKs und jeder Datenfluss, der das Gerät verlässt. Menschliche Fachleute prüfen jeden Befund erneut. Sie erhalten einen schriftlichen Bericht mit den Belegen hinter jedem Ergebnis.',
      sections: [
        {
          h2: 'Was die Prüfung umfasst',
          p: [
            'Eine mobile App ist ein Paket aus Ihrem eigenen Code, Drittanbieter-Bibliotheken und Konfiguration, das der App-Store auf jedes Telefon ausliefert. Die Prüfung macht dieses Paket zum Untersuchungsgegenstand. Unsere selbst gebauten Agenten führen Tausende parallele Tests über Code, Abhängigkeiten, APIs, Konfigurationen und Angriffsflächen aus und korrelieren die Ergebnisse, um einzelne Signale von umfassenderen Sicherheitsproblemen zu trennen.',
            'Fünf Bereiche bilden den Umfang jeder Prüfung:',
          ],
          ul: [
            'Quellcode und Abhängigkeiten: Code, Drittanbieter-Bibliotheken und ihre Versionen.',
            'Autorisierung und Aktionen: Berechtigungen, Datenzugriff und Missbrauchspfade.',
            'API-Autorisierungslogik: Authentifizierung, Zugriffskontrolle und Vertrauensgrenzen.',
            'Zugangsdaten und Datenflüsse: offengelegte Schlüssel, eingebettete SDKs, Flüsse an Dritte.',
            'Fehlkonfigurationen und Bugs: unsichere Standardwerte, zu weite Berechtigungen, Softwarefehler.',
          ],
        },
        {
          h2: 'Deep Scan des Builds, wie er ausgeliefert wird',
          p: [
            'Die Untersuchung dekompiliert das Binary, das der Store verteilt, und liest es. Das zeigt, was die App heute tatsächlich tut. Das kann von der Dokumentation, der Datenschutzerklärung und den Angaben zur Datensicherheit im Store abweichen. Jede Aussage in einem Bericht lässt sich auf einen konkreten Manifest-Eintrag, eine Berechtigung oder eine dekompilierte Klasse zurückführen.',
            'Sie bestimmen, was wir untersuchen. Senden Sie einen GitHub-Link, ein Repository-Archiv, einen Paket-Build oder eine API-Spezifikation. Die Prüfung braucht keinen Zugriff auf Ihre Live-Systeme.',
          ],
        },
        {
          h2: 'Typische Befunde einer App-Sicherheitsprüfung',
          p: ['Diese Befundklassen tauchen in den veröffentlichten Audits immer wieder auf:'],
          ul: [
            'Hartkodierte Schlüssel und Zugangsdaten: Cloud-API-Schlüssel, Push-Zugangsdaten und Backend-Tokens im installierbaren Paket.',
            'Netzwerkkonfiguration: erlaubter Klartextverkehr, leere Network-Security-Config, fehlendes Certificate Pinning, benutzerinstallierte Zertifizierungsstellen in einer Zahlungs-App.',
            'Backup und Speicherung: aktiviertes Android-Backup ohne Ausnahmen, lokal gespeicherte Daten ohne Verschlüsselung.',
            'Zu weite Berechtigungen: Mikrofon oder Standort deklariert, ohne dass eine Funktion sie braucht.',
            'Entwicklungsreste: Debug-Overlays und Staging-Backend-Domains im Produktiv-Build.',
          ],
        },
        {
          h2: 'So läuft eine Prüfung ab',
          p: [
            'Vier Schritte tragen jede Prüfung. Senden: Sie übergeben das Material. Untersuchen: unser Team und ein, mehrere oder alle unsere Agenten arbeiten gemeinsam durch Quellcode, Konfiguration und Datenflüsse. Erneut prüfen: menschliche Fachleute kontrollieren jeden Befund, bevor er in den Bericht kommt. Belegen: wir dokumentieren die Untersuchung schriftlich, mit dem Beleg zu jedem Befund.',
            'Der Bericht prüft die Ausnutzbarkeit, also was ein Angreifer mit einem Befund realistisch anfangen kann, gewichtet den Schweregrad wo anwendbar mit CVSS und gibt Hinweise zur Behebung. Die Tests folgen OWASP ASVS, den OWASP Top 10 und CWE. Jeder Bericht enthält einen Basis-Knowledge-Graph, der die Befunde verknüpft. Das Security-Angebot auf der Seite Zugang nennt eine Lieferzeit von 5 Werktagen.',
          ],
        },
      ],
      evidenceH2: 'Belege aus geprüften Apps',
      evidenceIntro: 'Unser öffentliches Verzeichnis führt {apps}+ geprüfte Android- und iOS-Apps und {critical}+ kritische Befunde, jeweils mit vollständigem Bericht. Diese Berichte zeigen die oben genannten Befundklassen in echten Apps:',
      evidence: [
        { slug: 'starbucks', label: 'Starbucks Österreich', note: 'Zwei hartkodierte Firebase-Schlüssel, einer wortgleich mit einer konkurrierenden Marke geteilt.' },
        { slug: 'soundcloud', label: 'SoundCloud', note: 'Sieben hartkodierte produktive API-Zugangsdaten in einem installierbaren Paket.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten beide hartkodiert im Play-Store-Build.' },
        { slug: 'strava', label: 'Strava', note: 'Eine Network-Security-Konfiguration, die existiert, aber leer ist, ohne Certificate Pinning.' },
      ],
      startH2: 'Starten Sie mit dem kostenlosen Check',
      startText: [
        'Der kostenlose Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Das Ergebnis ist eine erste externe Einschätzung und ersetzt keine Quellcode-Prüfung.',
        'Eine vollständige App-Sicherheitsprüfung beginnt bei den Plänen auf der Seite Zugang.',
      ],
      faqH2: 'Fragen zur App-Sicherheitsprüfung',
      faq: [
        ['Was kostet eine App-Sicherheitsprüfung?', 'Die Seite Zugang listet die Pläne von Starter bis Business mit ihren Preisen, dazu eine Enterprise-Option für individuelle Flächen. Jeder Plan nennt seinen Umfang und das, was Sie erhalten.'],
        ['Welche Plattformen decken Sie ab?', 'Android- und iOS-Apps, zusammen mit den APIs und Backends, mit denen sie sprechen, im vereinbarten Umfang.'],
        ['Brauchen Sie Zugriff auf unsere Produktivsysteme?', 'Nein. Sie bestimmen, was wir untersuchen, und senden uns das Material. Wir brauchen keinen Zugriff auf Ihre Live-Systeme.'],
        ['Wer prüft die Befunde?', 'Menschliche Fachleute prüfen jeden Befund erneut, bevor er in den Bericht kommt. Agenten übernehmen die breite Testarbeit, Menschen entscheiden, was als Befund zählt.'],
        ['Wird ein Kundenbericht öffentlich?', 'Private Daten, Umgebungen und Ergebnisse einer Kundschaft bleiben privat, solange sie die Veröffentlichung nicht schriftlich freigibt.'],
      ],
    },
  },

  'gdpr-app-audit': {
    en: {
      title: 'GDPR App Audit: Tracking Before Consent · RFI-IRFOS',
      description: 'GDPR app audit: we decompile your Android or iOS app and show which SDKs run before consent, where data flows and which articles apply.',
      label: 'GDPR App Audit',
      h1: 'GDPR App Audit: Tracking, Consent and Data Flows',
      lead: 'A GDPR app audit establishes what your app does with personal data from the first moment after launch. The Squad decompiles the shipped build, lists every SDK and endpoint, and checks the findings against the articles that regulators ask about first: lawfulness, consent, transfers to third countries and special-category data.',
      sections: [
        {
          h2: 'Tracking before consent',
          p: [
            'The most frequent finding in our ledger is an SDK that starts before the consent screen appears. Content providers declared in the manifest initialise when the process starts, so analytics and advertising libraries run before the user has chosen anything. Consent-mode defaults set to "granted" inside the binary have the same effect.',
            'Article 5(3) of the ePrivacy Directive covers access to the terminal equipment and is the legal backbone of every SDK-consent finding we publish. GDPR Article 6 (lawful basis) and Article 7 (conditions for consent) sit next to it, together with the principles in Article 5.',
          ],
        },
        {
          h2: 'Mobile app privacy audit for Europe',
          p: [
            'A mobile app privacy audit for the European market asks whether the app handles personal data the way EU law requires in every country where it is offered. The GDPR applies across the EU and the EEA, and the ePrivacy rules on access to the device come on top. This audit covers both, for Android and iOS builds, with each finding mapped to the articles that European data protection authorities apply.',
            'Teams that publish one app in several European countries get one audit of the shared build. Country-specific points, such as the national age of digital consent under Article 8, which ranges from 13 to 16 across member states, appear as separate notes in the report.',
          ],
        },
        {
          h2: 'Data flows to third countries',
          p: [
            'The audit reconstructs where data goes: every endpoint the app contacts, the company behind it and the country it resolves to. Transfers to third countries need a legal basis under Articles 44 to 46. The ledger documents apps that send data to a country without an adequacy decision or a documented safeguard, and an app whose own consent page still cites the EU-U.S. Privacy Shield.',
            'A transfer finding names the SDK or endpoint, shows the evidence in the binary and states which data categories travel.',
          ],
        },
        {
          h2: 'Special-category and children\'s data',
          p: [
            'Microphone, camera, health and biometric data fall under Article 9. Children\'s apps add Article 8 and COPPA. The audit looks for permissions without a feature that explains them, for biometric data flowing to third parties, and for age gates and consent mechanisms that the code never enforces.',
          ],
        },
        {
          h2: 'Code against policy',
          p: [
            'The central method is a comparison. Your privacy policy, your consent screen and your store disclosures describe what the app should do. The binary shows what it does. Every difference becomes a finding with its evidence. Where policy and code agree, the report says so too.',
            'The report follows the same five questions as every audit we deliver: what we found, what proves it, how we proved it, how sure we are, and what to do about it.',
          ],
        },
        {
          h2: 'Who does the work',
          p: [
            'The Squad is human-powered multi-agent security investigation. Agents built and trained in house execute the broad testing across code, dependencies, APIs and configurations. Human specialists examine each result in its technical context and re-verify every finding before it reaches the report. Reviews run on infrastructure in Europe, with processing in Graz.',
          ],
        },
      ],
      evidenceH2: 'Evidence from audited apps',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show the GDPR finding classes in real apps:',
      evidence: [
        { slug: 'geizhals', label: 'Geizhals', note: 'Facebook and Firebase SDKs start automatically before the consent screen.' },
        { slug: 'coinbase', label: 'Coinbase', note: 'Consent-mode defaults hardcoded to "granted", with no consent management platform in the binary.' },
        { slug: 'dundle', label: 'Dundle', note: 'Tracking consent defaults to granted before any user choice.' },
        { slug: 'deepseek', label: 'DeepSeek', note: 'Personal data stored in the People\'s Republic of China per the app\'s own policy, plus SDKs that start behind a single "Agree" button.' },
        { slug: 'revolut', label: 'Revolut', note: 'A financial-relationship graph sent to a US company with no EU adequacy decision.' },
      ],
      startH2: 'Start with the free check',
      startText: [
        'The free check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. You receive a short written report with findings, likely attack scenarios, potential financial impact and next steps, plus a knowledge graph. It is an initial external assessment, so it complements a full GDPR app audit and does not replace it.',
        'The plans for a full audit are on the Access page.',
      ],
      faqH2: 'Questions about GDPR app audits',
      faq: [
        ['Which GDPR articles does the audit refer to?', 'Typically Article 5 (principles), Article 6 (lawful basis), Article 7 (consent), Article 8 (children), Article 9 (special categories), Articles 44 to 46 (third-country transfers) and Article 33 (breach notification), together with Article 5(3) of the ePrivacy Directive for terminal-equipment access.'],
        ['Does the audit show whether our consent banner works?', 'It shows what the build does before and independent of the banner: which SDKs initialise at start, which consent defaults the code sets and which endpoints receive data.'],
        ['Is a GDPR app audit the same as a mobile app privacy audit?', 'For apps offered in Europe, yes. A mobile app privacy audit under EU law checks the app against the GDPR and the ePrivacy rules, and that is exactly the scope of this audit, for Android and iOS.'],
        ['Is the report legal advice?', 'The report documents technical facts and maps them to articles. The legal assessment stays with your data protection officer or counsel.'],
        ['Do you also cover SDKs from vendors we do not control?', 'Yes. Third-party libraries and their versions are part of the scope, because their behaviour is part of what your app does.'],
      ],
    },
    de: {
      title: 'DSGVO-Prüfung für Apps: Tracking & Einwilligung · RFI-IRFOS',
      description: 'DSGVO-Prüfung für Apps: Wir dekompilieren Ihre Android- oder iOS-App und zeigen, welche SDKs vor der Einwilligung laufen und wohin Daten fließen.',
      label: 'DSGVO-Prüfung für Apps',
      h1: 'DSGVO-Prüfung für Apps: Tracking, Einwilligung und Datenflüsse',
      lead: 'Eine DSGVO-Prüfung für Apps stellt fest, was Ihre App ab dem ersten Moment nach dem Start mit personenbezogenen Daten tut. The Squad dekompiliert den ausgelieferten Build, listet jedes SDK und jeden Endpunkt auf und prüft die Befunde gegen die Artikel, nach denen Aufsichtsbehörden zuerst fragen: Rechtmäßigkeit, Einwilligung, Übermittlung in Drittländer und besondere Datenkategorien.',
      sections: [
        {
          h2: 'Tracking vor der Einwilligung',
          p: [
            'Der häufigste Befund in unserem Verzeichnis ist ein SDK, das startet, bevor der Einwilligungsbildschirm erscheint. Im Manifest deklarierte Content Provider initialisieren sich beim Prozessstart, deshalb laufen Analyse- und Werbebibliotheken, bevor die Nutzerin oder der Nutzer irgendetwas gewählt hat. Consent-Mode-Standardwerte, die im Binary auf „granted“ stehen, haben dieselbe Wirkung.',
            'Art. 5 Abs. 3 der ePrivacy-Richtlinie regelt den Zugriff auf Endgeräte und ist das rechtliche Rückgrat jedes SDK-Einwilligungsbefunds, den wir veröffentlichen. Daneben stehen Art. 6 DSGVO (Rechtsgrundlage) und Art. 7 DSGVO (Bedingungen für die Einwilligung) sowie die Grundsätze in Art. 5 DSGVO.',
          ],
        },
        {
          h2: 'Datenschutz-Audit für mobile Apps in Europa',
          p: [
            'Ein Datenschutz-Audit für mobile Apps auf dem europäischen Markt klärt, ob die App personenbezogene Daten in jedem Land, in dem sie angeboten wird, so behandelt, wie es das EU-Recht verlangt. Die DSGVO gilt in der gesamten EU und im EWR, dazu kommen die ePrivacy-Regeln zum Zugriff auf das Gerät. Diese Prüfung deckt beides ab, für Android- und iOS-Builds, und ordnet jeden Befund den Artikeln zu, die europäische Datenschutzbehörden anwenden.',
            'Teams, die eine App in mehreren europäischen Ländern veröffentlichen, erhalten eine Prüfung des gemeinsamen Builds. Länderspezifische Punkte, etwa das nationale Mindestalter für die digitale Einwilligung nach Art. 8 DSGVO, das in den Mitgliedstaaten zwischen 13 und 16 Jahren liegt, stehen als eigene Hinweise im Bericht.',
          ],
        },
        {
          h2: 'Datenflüsse in Drittländer',
          p: [
            'Die Prüfung rekonstruiert, wohin Daten gehen: jeder Endpunkt, den die App kontaktiert, das Unternehmen dahinter und das Land, in dem er auflöst. Übermittlungen in Drittländer brauchen eine Rechtsgrundlage nach Art. 44 bis 46 DSGVO. Das Verzeichnis dokumentiert Apps, die Daten in ein Land ohne Angemessenheitsbeschluss oder dokumentierte Garantie senden, und eine App, deren eigene Einwilligungsseite sich weiter auf den EU-US-Privacy-Shield beruft.',
            'Ein Übermittlungsbefund benennt das SDK oder den Endpunkt, zeigt den Beleg im Binary und nennt, welche Datenkategorien übertragen werden.',
          ],
        },
        {
          h2: 'Besondere Kategorien und Daten von Kindern',
          p: [
            'Mikrofon, Kamera, Gesundheits- und biometrische Daten fallen unter Art. 9 DSGVO. Kinder-Apps bringen Art. 8 DSGVO und COPPA hinzu. Die Prüfung sucht nach Berechtigungen ohne erklärende Funktion, nach biometrischen Daten, die an Dritte fließen, und nach Altersabfragen und Einwilligungsmechanismen, die der Code nie durchsetzt.',
          ],
        },
        {
          h2: 'Code gegen Richtlinie',
          p: [
            'Die zentrale Methode ist ein Vergleich. Ihre Datenschutzerklärung, Ihr Einwilligungsbildschirm und Ihre Store-Angaben beschreiben, was die App tun soll. Das Binary zeigt, was sie tut. Jeder Unterschied wird zu einem Befund mit Beleg. Wo Richtlinie und Code übereinstimmen, hält der Bericht das ebenfalls fest.',
            'Der Bericht folgt denselben fünf Fragen wie jedes Audit, das wir liefern: was wir gefunden haben, was es belegt, wie wir es belegt haben, wie sicher wir sind und was zu tun ist.',
          ],
        },
        {
          h2: 'Wer die Arbeit macht',
          p: [
            'The Squad ist menschlich verantwortete Multi-Agenten-Sicherheitsuntersuchung. Selbst gebaute und trainierte Agenten führen die breite Testarbeit über Code, Abhängigkeiten, APIs und Konfigurationen aus. Menschliche Fachleute prüfen jedes Ergebnis in seinem technischen Kontext und kontrollieren jeden Befund erneut, bevor er in den Bericht kommt. Reviews laufen auf Infrastruktur in Europa, die Verarbeitung findet in Graz statt.',
          ],
        },
      ],
      evidenceH2: 'Belege aus geprüften Apps',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen die DSGVO-Befundklassen in echten Apps:',
      evidence: [
        { slug: 'geizhals', label: 'Geizhals', note: 'Facebook- und Firebase-SDKs starten automatisch vor dem Einwilligungsbildschirm.' },
        { slug: 'coinbase', label: 'Coinbase', note: 'Consent-Mode-Standardwerte hartkodiert auf „granted“, ohne Consent-Management-Plattform im Binary.' },
        { slug: 'dundle', label: 'Dundle', note: 'Die Tracking-Einwilligung steht standardmäßig auf erlaubt, bevor eine Nutzerentscheidung vorliegt.' },
        { slug: 'deepseek', label: 'DeepSeek', note: 'Personenbezogene Daten laut eigener Richtlinie in der Volksrepublik China gespeichert, dazu SDKs, die hinter einem einzigen „Agree“-Button starten.' },
        { slug: 'revolut', label: 'Revolut', note: 'Ein finanzieller Beziehungsgraph geht an ein US-Unternehmen ohne EU-Angemessenheitsbeschluss.' },
      ],
      startH2: 'Starten Sie mit dem kostenlosen Check',
      startText: [
        'Der kostenlose Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Sie erhalten einen kurzen schriftlichen Report mit Funden, möglichen Angriffsszenarien, dem wirtschaftlichen Schaden und nächsten Schritten, dazu einen Knowledge Graph. Der Check ist eine erste externe Einschätzung und ergänzt eine vollständige DSGVO-Prüfung der App, ohne sie zu ersetzen.',
        'Die Pläne für eine vollständige Prüfung stehen auf der Seite Zugang.',
      ],
      faqH2: 'Fragen zur DSGVO-Prüfung für Apps',
      faq: [
        ['Auf welche DSGVO-Artikel bezieht sich die Prüfung?', 'In der Regel auf Art. 5 (Grundsätze), Art. 6 (Rechtsgrundlage), Art. 7 (Einwilligung), Art. 8 (Kinder), Art. 9 (besondere Kategorien), Art. 44 bis 46 (Drittlandübermittlung) und Art. 33 (Meldung von Verletzungen), dazu Art. 5 Abs. 3 der ePrivacy-Richtlinie für den Zugriff auf Endgeräte.'],
        ['Zeigt die Prüfung, ob unser Consent-Banner funktioniert?', 'Sie zeigt, was der Build vor dem Banner und unabhängig von ihm tut: welche SDKs beim Start initialisieren, welche Consent-Standardwerte der Code setzt und welche Endpunkte Daten empfangen.'],
        ['Ist eine DSGVO-Prüfung für Apps dasselbe wie ein Datenschutz-Audit für mobile Apps?', 'Für Apps, die in Europa angeboten werden, ja. Ein Datenschutz-Audit für mobile Apps nach EU-Recht prüft die App gegen die DSGVO und die ePrivacy-Regeln, und genau das ist der Umfang dieser Prüfung, für Android und iOS.'],
        ['Ist der Bericht eine Rechtsberatung?', 'Der Bericht dokumentiert technische Tatsachen und ordnet sie Artikeln zu. Die rechtliche Bewertung bleibt bei Ihrer oder Ihrem Datenschutzbeauftragten oder bei Ihrer Rechtsvertretung.'],
        ['Decken Sie auch SDKs von Anbietern ab, die wir nicht kontrollieren?', 'Ja. Drittanbieter-Bibliotheken und ihre Versionen gehören zum Umfang, weil ihr Verhalten Teil dessen ist, was Ihre App tut.'],
      ],
    },
  },

  'nis2-software-vendors': {
    en: {
      title: 'NIS2 for Software Vendors: Technical Evidence · RFI-IRFOS',
      description: 'NIS2 and NISG 2026 for software vendors: we turn supply-chain and risk-management duties into technical evidence about the code, keys and SDKs you ship.',
      label: 'NIS2 for Software Vendors',
      h1: 'NIS2 and NISG 2026 for Software Vendors',
      lead: 'NIS2, in Austria the NISG 2026, reaches software vendors through the supply chain. Roughly 4,000 essential and important entities in Austria are directly in scope, plus an estimated 50,000 supply-chain partners. The Squad turns the directive\'s obligations into technical evidence about the software you ship.',
      sections: [
        {
          h2: 'Why software vendors are in scope',
          p: [
            'The directive demands state-of-the-art risk management, strict incident reporting to national authorities and personal liability for company management. Risk management covers cryptography, access control and supply-chain security (Article 21). Entities in scope must manage the risk of their suppliers, so the questions arrive at software vendors in procurement: what is inside your app, which libraries and versions, which keys, which endpoints?',
            'The national authority\'s information at nis.gv.at is the reference for whether and how the law applies to your company. The audit does not decide applicability. It supplies the technical facts that your answers depend on.',
          ],
        },
        {
          h2: 'From obligation to technical control',
          p: [
            'No checklist replaces looking at the actual systems. We map the obligations against your code, your configuration and your data flows, and translate them into controls your infrastructure team can implement:',
          ],
          ul: [
            'Cryptography: hardcoded keys and credentials, TLS and network security configuration, certificate pinning.',
            'Access control: authorization logic, permissions and API authorization, trust boundaries between app and backend.',
            'Supply-chain security: third-party dependencies and SDKs with their versions, and the companies behind the endpoints your app contacts.',
            'Incident readiness: Article 23 sets strict reporting timeframes. A complete inventory of components and data flows is what makes those timeframes workable.',
          ],
        },
        {
          h2: 'What you receive',
          p: [
            'A written report with the evidence behind each finding, severity ranked with CVSS where applicable, an analysis of what an attacker could realistically do, and remediation guidance. Every report includes a base knowledge graph that links findings, SDKs, endpoints and weaknesses. Human specialists re-verify every finding.',
            'The report is technical evidence for your risk-management documentation. It carries no certificate. The Security offer on the Access page states a delivery estimate of 5 business days.',
          ],
        },
        {
          h2: 'Method and independence',
          p: [
            'The audit reads the software as shipped. It follows OWASP ASVS, the OWASP Top 10 and CWE, and uses the same method as our public ledger. The Squad is built for software security investigation, and the institute behind it publishes its methodology, its disclosure policy and the frameworks it audits against: NIS-2, GDPR, the EU AI Act and ISO/IEC 29147, 30111 and 27001.',
          ],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show supply-chain and cryptography findings in software from established vendors:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Start with the free check',
      startText: [
        'The free check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. It is an initial external assessment and does not replace a source-code review.',
        'See the plans for a full audit on the Access page, and the frameworks we audit against on the Standards page.',
      ],
      faqH2: 'Questions about NIS2 and software vendors',
      faq: [
        ['Does NIS2 apply to our company?', 'That depends on sector, size and role in a supply chain. The national authority\'s information at nis.gv.at is the reference. The audit supplies technical facts and leaves the applicability decision to you and your counsel.'],
        ['Do you certify NIS2 compliance?', 'No certificate is issued. The deliverable is a written technical report with evidence for your risk-management documentation.'],
        ['How long does an audit take?', 'The Security offer on the Access page states a delivery estimate of 5 business days.'],
        ['Do you test our live systems?', 'No. You send the material you want examined, and the audit works on that material.'],
      ],
    },
    de: {
      title: 'NIS2 für Softwareanbieter: Technische Belege · RFI-IRFOS',
      description: 'NIS2 und NISG 2026 für Softwareanbieter: Wir machen Lieferketten- und Risikomanagement-Pflichten zu technischen Belegen über Code, Schlüssel und SDKs.',
      label: 'NIS2 für Softwareanbieter',
      h1: 'NIS2 und NISG 2026 für Softwareanbieter',
      lead: 'NIS2, in Österreich das NISG 2026, erreicht Softwareanbieter über die Lieferkette. Rund 4.000 wesentliche und wichtige Einrichtungen in Österreich fallen direkt darunter, dazu geschätzt 50.000 Lieferkettenpartner. The Squad macht die Pflichten der Richtlinie zu technischen Belegen über die Software, die Sie ausliefern.',
      sections: [
        {
          h2: 'Warum Softwareanbieter betroffen sind',
          p: [
            'Die Richtlinie verlangt Risikomanagement nach dem Stand der Technik, strenge Vorfallsmeldung an nationale Behörden und persönliche Haftung der Geschäftsleitung. Das Risikomanagement umfasst Kryptografie, Zugriffskontrolle und Sicherheit der Lieferkette (Art. 21). Betroffene Einrichtungen müssen das Risiko ihrer Lieferanten steuern, deshalb kommen die Fragen im Einkauf bei Softwareanbietern an: was steckt in Ihrer App, welche Bibliotheken in welchen Versionen, welche Schlüssel, welche Endpunkte?',
            'Die Informationen der nationalen Behörde unter nis.gv.at sind die Referenz dafür, ob und wie das Gesetz auf Ihr Unternehmen anwendbar ist. Die Prüfung entscheidet die Anwendbarkeit nicht. Sie liefert die technischen Tatsachen, von denen Ihre Antworten abhängen.',
          ],
        },
        {
          h2: 'Von der Pflicht zur technischen Maßnahme',
          p: [
            'Keine Checkliste ersetzt den Blick auf die tatsächlichen Systeme. Wir ordnen die Pflichten Ihrem Code, Ihrer Konfiguration und Ihren Datenflüssen zu und übersetzen sie in Maßnahmen, die Ihr Infrastruktur-Team umsetzen kann:',
          ],
          ul: [
            'Kryptografie: hartkodierte Schlüssel und Zugangsdaten, TLS- und Network-Security-Konfiguration, Certificate Pinning.',
            'Zugriffskontrolle: Autorisierungslogik, Berechtigungen und API-Autorisierung, Vertrauensgrenzen zwischen App und Backend.',
            'Sicherheit der Lieferkette: Drittanbieter-Abhängigkeiten und SDKs mit ihren Versionen sowie die Unternehmen hinter den Endpunkten, die Ihre App kontaktiert.',
            'Vorfallsbereitschaft: Art. 23 setzt strenge Meldefristen. Ein vollständiges Inventar von Komponenten und Datenflüssen macht diese Fristen handhabbar.',
          ],
        },
        {
          h2: 'Was Sie erhalten',
          p: [
            'Einen schriftlichen Bericht mit dem Beleg zu jedem Befund, nach CVSS gewichtetem Schweregrad wo anwendbar, einer Analyse dessen, was ein Angreifer realistisch tun kann, und Hinweisen zur Behebung. Jeder Bericht enthält einen Basis-Knowledge-Graph, der Befunde, SDKs, Endpunkte und Schwachstellen verknüpft. Menschliche Fachleute kontrollieren jeden Befund erneut.',
            'Der Bericht ist ein technischer Beleg für Ihre Risikomanagement-Dokumentation. Er trägt kein Zertifikat. Das Security-Angebot auf der Seite Zugang nennt eine Lieferzeit von 5 Werktagen.',
          ],
        },
        {
          h2: 'Methode und Unabhängigkeit',
          p: [
            'Die Prüfung liest die Software, wie sie ausgeliefert wird. Sie folgt OWASP ASVS, den OWASP Top 10 und CWE und nutzt dieselbe Methode wie unser öffentliches Verzeichnis. The Squad ist für die Sicherheitsuntersuchung von Software gebaut, und das Institut dahinter veröffentlicht seine Methodik, seine Offenlegungsrichtlinie und die Rahmenwerke, gegen die es prüft: NIS-2, DSGVO, EU AI Act sowie ISO/IEC 29147, 30111 und 27001.',
          ],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen Lieferketten- und Kryptografie-Befunde in Software etablierter Anbieter:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Starten Sie mit dem kostenlosen Check',
      startText: [
        'Der kostenlose Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Der Check ist eine erste externe Einschätzung und ersetzt keine Quellcode-Prüfung.',
        'Die Pläne für eine vollständige Prüfung stehen auf der Seite Zugang, die Rahmenwerke, gegen die wir prüfen, auf der Seite Standards.',
      ],
      faqH2: 'Fragen zu NIS2 und Softwareanbietern',
      faq: [
        ['Gilt NIS2 für unser Unternehmen?', 'Das hängt von Sektor, Größe und Rolle in einer Lieferkette ab. Die Informationen der nationalen Behörde unter nis.gv.at sind die Referenz. Die Prüfung liefert technische Tatsachen und überlässt die Entscheidung über die Anwendbarkeit Ihnen und Ihrer Rechtsvertretung.'],
        ['Zertifizieren Sie die NIS2-Konformität?', 'Es wird kein Zertifikat ausgestellt. Geliefert wird ein schriftlicher technischer Bericht mit Belegen für Ihre Risikomanagement-Dokumentation.'],
        ['Wie lange dauert eine Prüfung?', 'Das Security-Angebot auf der Seite Zugang nennt eine Lieferzeit von 5 Werktagen.'],
        ['Testen Sie unsere Live-Systeme?', 'Nein. Sie senden das Material, das untersucht werden soll, und die Prüfung arbeitet an diesem Material.'],
      ],
    },
  },

  'app-tracker-sdk-check': {
    en: {
      title: 'App Tracker & SDK Check: Find Every SDK · RFI-IRFOS',
      description: 'Find every tracker and SDK in your app: name, version, start time, endpoints and data categories, read from the shipped build. Report with evidence.',
      label: 'Tracker & SDK Check',
      h1: 'Find Trackers and SDKs in Your App',
      lead: 'Every app ships with libraries nobody on the team wrote: analytics, advertising, crash reporting, push, payments, session replay. The Squad lists each SDK in the shipped build and shows when it starts, what it collects and which servers it talks to.',
      sections: [
        {
          h2: 'What counts as a tracker or SDK finding',
          p: ['The check separates the libraries that merely sit in the package from the ones that act. These are the classes we document:'],
          ul: [
            'Analytics and attribution SDKs, including ad-identifier linkage across apps.',
            'Advertising networks that receive purchase or behaviour data.',
            'Session-replay tools and screen overlays that record how people use the app.',
            'Push SDKs, including vendor SDKs with a history of public controversy.',
            'Tags that a tag manager deploys remotely, without an app update.',
            'Privacy Sandbox and similar advertising APIs declared in the manifest.',
          ],
        },
        {
          h2: 'How the SDKs are found',
          p: [
            'We decompile the build and read it. The manifest shows declared providers, receivers, services and permissions. The decompiled classes show which SDK sits behind them and how large it is: one report counts 315 classes for a push SDK, another 3,622 classes for a messaging platform. Class counts separate a stub from a fully integrated SDK.',
            'Each library is correlated across our whole corpus of audited apps, so a finding comes with context: who else ships the same SDK, in which version, and what it did there.',
          ],
        },
        {
          h2: 'When it starts',
          p: [
            'Timing decides the legal weight of a finding. The check records whether an SDK initialises at process start through the manifest, whether it waits for consent, and whether it begins working after a device restart before the app was ever opened. A location-marketing tool that starts at boot and a content provider that initialises before the consent screen are different findings with different consequences.',
          ],
        },
        {
          h2: 'What changes between releases',
          p: [
            'A new build is checked against the last audited version, permission by permission and SDK by SDK. Apps change their stack with every release, and a tracker that was absent in the last version can be present in this one. The comparison makes that visible.',
          ],
        },
        {
          h2: 'What you receive',
          p: [
            'A written report with one entry per SDK: name, version, class count, trigger, endpoints and data categories, each with its evidence from the binary. Human specialists re-verify every finding. The base knowledge graph that ships with the report links SDKs, endpoints and findings. For teams that need the same view across many apps, the Data offer builds SDK and tracker graphs. See the Access page for scope and plans.',
          ],
        },
      ],
      evidenceH2: 'Evidence from audited apps',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show SDK findings in real apps:',
      evidence: [
        { slug: 'tchibo', label: 'Tchibo', note: 'A session-replay tool starting automatically, and 22 tracking tags deployable remotely.' },
        { slug: 'meindm', label: 'dm', note: 'Three advertising networks receiving purchase data from which health status can be inferred.' },
        { slug: 'geizhals', label: 'Geizhals', note: 'A permanent device fingerprint and four advertising APIs the app does not disclose.' },
        { slug: 'sap', label: 'SAP', note: 'A push SDK with 315 classes in a field-service app.' },
        { slug: 'gemini', label: 'Gemini', note: 'The counter-example: zero third-party tracking SDKs in the app.' },
      ],
      startH2: 'Start with the free check',
      startText: [
        'The free check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. It is an initial external assessment, so it complements the SDK inventory of a full audit and does not replace it.',
        'The plans for a full audit are on the Access page.',
      ],
      faqH2: 'Questions about tracker and SDK checks',
      faq: [
        ['Which SDKs does the check find?', 'Analytics, attribution, advertising, session replay, push, tag-manager tags and advertising APIs. Every library in the build is listed, and the report marks the ones that act on user data.'],
        ['Do you need our source code?', 'A built package is enough. You can also send a GitHub link, a repository archive or an API specification.'],
        ['What if an app has no trackers?', 'Then the report says so. One audited AI assistant app shows zero third-party tracking SDKs, zero hardcoded credentials and no pre-consent auto-initialisation, and the report lists exactly that.'],
        ['Does the check cover the legal side?', 'Findings are anchored to the relevant GDPR and ePrivacy articles. The GDPR app audit page describes that part in detail.'],
      ],
    },
    de: {
      title: 'Tracker & SDKs in Apps finden: SDK-Check · RFI-IRFOS',
      description: 'Tracker und SDKs in Ihrer App finden: Name, Version, Startzeitpunkt, Endpunkte, Datenkategorien, gelesen aus dem Build. Bericht mit Belegen.',
      label: 'Tracker- & SDK-Check',
      h1: 'Tracker und SDKs in Ihrer App finden',
      lead: 'Jede App liefert Bibliotheken aus, die niemand im Team geschrieben hat: Analyse, Werbung, Absturzberichte, Push, Zahlungen, Session Replay. The Squad listet jedes SDK im ausgelieferten Build auf und zeigt, wann es startet, was es erhebt und mit welchen Servern es spricht.',
      sections: [
        {
          h2: 'Was als Tracker- oder SDK-Befund zählt',
          p: ['Der Check trennt Bibliotheken, die im Paket nur liegen, von solchen, die handeln. Diese Klassen dokumentieren wir:'],
          ul: [
            'Analyse- und Attributions-SDKs, auch mit Verknüpfung der Werbe-ID über mehrere Apps.',
            'Werbenetzwerke, die Kauf- oder Verhaltensdaten empfangen.',
            'Session-Replay-Werkzeuge und Bildschirm-Overlays, die aufzeichnen, wie Menschen die App nutzen.',
            'Push-SDKs, darunter Anbieter-SDKs mit öffentlich umstrittener Vorgeschichte.',
            'Tags, die ein Tag-Manager aus der Ferne ausrollt, ohne App-Update.',
            'Privacy-Sandbox- und ähnliche Werbe-APIs, die im Manifest deklariert sind.',
          ],
        },
        {
          h2: 'Wie die SDKs gefunden werden',
          p: [
            'Wir dekompilieren den Build und lesen ihn. Das Manifest zeigt deklarierte Provider, Receiver, Services und Berechtigungen. Die dekompilierten Klassen zeigen, welches SDK dahintersteckt und wie groß es ist: ein Bericht zählt 315 Klassen für ein Push-SDK, ein anderer 3.622 Klassen für eine Messaging-Plattform. Die Klassenzahl trennt einen Platzhalter von einem voll integrierten SDK.',
            'Jede Bibliothek wird über unser gesamtes Korpus geprüfter Apps korreliert. Ein Befund kommt deshalb mit Kontext: wer dasselbe SDK noch ausliefert, in welcher Version und was es dort getan hat.',
          ],
        },
        {
          h2: 'Wann es startet',
          p: [
            'Der Zeitpunkt entscheidet über das rechtliche Gewicht eines Befunds. Der Check hält fest, ob ein SDK beim Prozessstart über das Manifest initialisiert, ob es auf die Einwilligung wartet und ob es nach einem Neustart des Geräts zu arbeiten beginnt, bevor die App je geöffnet wurde. Ein Standort-Marketing-Werkzeug, das beim Booten startet, und ein Content Provider, der vor dem Einwilligungsbildschirm initialisiert, sind verschiedene Befunde mit verschiedenen Folgen.',
          ],
        },
        {
          h2: 'Was sich zwischen Releases ändert',
          p: [
            'Ein neuer Build wird gegen die zuletzt geprüfte Version abgeglichen, Berechtigung für Berechtigung und SDK für SDK. Apps verändern ihren Stack mit jedem Release, und ein Tracker, der in der letzten Version fehlte, kann in dieser vorhanden sein. Der Vergleich macht das sichtbar.',
          ],
        },
        {
          h2: 'Was Sie erhalten',
          p: [
            'Einen schriftlichen Bericht mit einem Eintrag je SDK: Name, Version, Klassenzahl, Auslöser, Endpunkte und Datenkategorien, jeweils mit dem Beleg aus dem Binary. Menschliche Fachleute kontrollieren jeden Befund erneut. Der Basis-Knowledge-Graph im Bericht verknüpft SDKs, Endpunkte und Befunde. Für Teams, die dieselbe Sicht über viele Apps brauchen, baut das Data-Angebot SDK- und Tracker-Graphen. Umfang und Pläne stehen auf der Seite Zugang.',
          ],
        },
      ],
      evidenceH2: 'Belege aus geprüften Apps',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen SDK-Befunde in echten Apps:',
      evidence: [
        { slug: 'tchibo', label: 'Tchibo', note: 'Ein Session-Replay-Werkzeug startet automatisch, dazu 22 aus der Ferne ausrollbare Tracking-Tags.' },
        { slug: 'meindm', label: 'dm', note: 'Drei Werbenetzwerke empfangen Kaufdaten, aus denen sich der Gesundheitszustand ableiten lässt.' },
        { slug: 'geizhals', label: 'Geizhals', note: 'Ein dauerhafter Geräte-Fingerabdruck und vier Werbe-APIs, die die App nicht offenlegt.' },
        { slug: 'sap', label: 'SAP', note: 'Ein Push-SDK mit 315 Klassen in einer Außendienst-App.' },
        { slug: 'gemini', label: 'Gemini', note: 'Das Gegenbeispiel: null Tracking-SDKs von Drittanbietern in der App.' },
      ],
      startH2: 'Starten Sie mit dem kostenlosen Check',
      startText: [
        'Der kostenlose Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Der Check ist eine erste externe Einschätzung und ergänzt das SDK-Inventar einer vollständigen Prüfung, ohne es zu ersetzen.',
        'Die Pläne für eine vollständige Prüfung stehen auf der Seite Zugang.',
      ],
      faqH2: 'Fragen zum Tracker- und SDK-Check',
      faq: [
        ['Welche SDKs findet der Check?', 'Analyse, Attribution, Werbung, Session Replay, Push, Tag-Manager-Tags und Werbe-APIs. Jede Bibliothek im Build wird aufgeführt, und der Bericht markiert die, die auf Nutzerdaten wirken.'],
        ['Brauchen Sie unseren Quellcode?', 'Ein gebautes Paket genügt. Sie können auch einen GitHub-Link, ein Repository-Archiv oder eine API-Spezifikation senden.'],
        ['Was, wenn eine App keine Tracker hat?', 'Dann hält der Bericht das fest. Eine geprüfte KI-Assistenten-App zeigt null Tracking-SDKs von Drittanbietern, null hartkodierte Zugangsdaten und keine Initialisierung vor der Einwilligung, und der Bericht listet genau das.'],
        ['Deckt der Check die rechtliche Seite ab?', 'Befunde werden den einschlägigen Artikeln der DSGVO und der ePrivacy-Richtlinie zugeordnet. Die Seite zur DSGVO-Prüfung für Apps beschreibt diesen Teil im Detail.'],
      ],
    },
  },
  // Lighthouse R99 (2026-10-31): Brave showed no RFI-IRFOS result for "AI companion app privacy
  // investigation" although the ledger holds six AI assistant/companion reports. Notes restate
  // the published report summaries only.
  'ai-app-privacy-audit': {
    en: {
      title: 'AI App Privacy Audit: Chatbots & Companions · RFI-IRFOS',
      description: 'Privacy audit for AI chatbot, assistant and companion apps: what runs before consent, where conversations go and how they are protected in transit.',
      label: 'AI App Privacy Audit',
      h1: 'AI App Privacy Audit: Chatbots, Assistants and AI Companions',
      lead: 'People tell AI apps things they tell nobody else. An AI app privacy audit checks what the shipped app does with that: which SDKs start before consent, where conversations are stored, whether the connection that carries them can be verified, and which permissions reach beyond the chat. The Squad has investigated six widely used AI assistant and companion apps, and every report is public.',
      sections: [
        {
          h2: 'What an AI companion app privacy investigation looks at',
          p: [
            'Conversations with an AI companion or assistant often contain health, relationship and other special-category data under Article 9 GDPR. The investigation follows that data from the first second after launch: the SDKs in the build, the endpoints the app contacts, the country those endpoints resolve to and the consent flow in front of them.',
          ],
          ul: [
            'Tracking and advertising SDKs that start before consent or before an age gate',
            'Session replay or analytics running on conversation screens',
            'Storage and transfer of chats to third countries (Articles 44 to 46 GDPR)',
            'Transport security of conversation traffic, including certificate pinning',
            'Biometric identity checks and their legal basis under Article 9',
            'Assistant permissions that reach SMS, contacts, calendar or notifications',
          ],
        },
        {
          h2: 'Minors and age gates',
          p: [
            'Several AI companion apps are used by teenagers. The audit checks whether the age gate actually comes first in the code, or whether advertising identifiers are read before the app asks for an age. Article 8 GDPR and, for US audiences, COPPA apply here.',
          ],
        },
        {
          h2: 'Who does the work',
          p: [
            'The Squad is human-powered multi-agent security investigation. Agents built and trained in house decompile the build and test code, dependencies, endpoints and configuration in parallel. Human specialists examine every result in context and re-verify each finding before it reaches the report. Reviews run on infrastructure in Europe, with processing in Graz.',
          ],
        },
      ],
      evidenceH2: 'AI apps in the public ledger',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These reports cover AI assistants and companions:',
      evidence: [
        { slug: 'characterai', label: 'Character.AI', note: 'A 12-network ad and analytics stack starts before the age gate, so an advertising identifier is read before a minor is asked their age.' },
        { slug: 'deepseek', label: 'DeepSeek', note: 'The app\'s own privacy policy states that chats are stored in the People\'s Republic of China, and SDKs start behind a single "Agree" button.' },
        { slug: 'chatgpt', label: 'ChatGPT', note: 'Firebase initialises before consent, and a biometric identity check runs without a disclosed Article 9 basis.' },
        { slug: 'grok', label: 'Grok', note: 'Conversation data travels without a network security configuration, so the encrypted connection cannot be verified.' },
        { slug: 'perplexity', label: 'Perplexity', note: 'The app\'s own strings say anyone holding the phone can use the assistant without unlocking it.' },
        { slug: 'gemini', label: 'Gemini', note: 'The cleanest AI assistant in the series: zero third-party tracking SDKs, but no certificate pinning for conversation traffic.' },
      ],
      startH2: 'Start with the free check',
      startText: [
        'The free check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. It is an initial external assessment, so it complements a full AI app privacy audit and does not replace it.',
        'The plans for a full audit are on the Access page.',
      ],
      faqH2: 'Questions about AI app privacy audits',
      faq: [
        ['Do you need access to our model or training data?', 'The audit works on the shipped app and its network traffic. A built package is enough.'],
        ['Does the audit cover AI companion apps as well as assistants?', 'Yes. Companion, assistant and chatbot apps share the same risks: intimate conversations, third-party SDKs and transfers. The ledger includes both kinds.'],
        ['Which AI apps have you already investigated?', 'Character.AI, DeepSeek, ChatGPT, Grok, Perplexity and Gemini. Each report is public in the ledger, with its evidence and the articles it cites.'],
        ['Is the report legal advice?', 'The report documents technical facts and maps them to articles. The legal assessment stays with your data protection officer or counsel.'],
      ],
    },
    de: {
      title: 'Datenschutz-Audit für KI-Apps & Chatbots · RFI-IRFOS',
      description: 'Datenschutz-Audit für KI-Chatbots, Assistenten und AI-Companion-Apps: was vor der Einwilligung läuft, wohin Gespräche gehen und wie sie geschützt sind.',
      label: 'Datenschutz-Audit für KI-Apps',
      h1: 'Datenschutz-Audit für KI-Apps: Chatbots, Assistenten und AI Companions',
      lead: 'Menschen erzählen KI-Apps Dinge, die sie sonst niemandem erzählen. Ein Datenschutz-Audit für KI-Apps prüft, was die ausgelieferte App damit tut: welche SDKs vor der Einwilligung starten, wo Gespräche gespeichert werden, ob sich die Verbindung, die sie trägt, überprüfen lässt, und welche Berechtigungen über den Chat hinausreichen. The Squad hat sechs verbreitete KI-Assistenten- und Companion-Apps untersucht, und jeder Bericht ist öffentlich.',
      sections: [
        {
          h2: 'Was eine Untersuchung einer AI-Companion-App prüft',
          p: [
            'Gespräche mit einem KI-Companion oder Assistenten enthalten oft Gesundheits-, Beziehungs- und andere besondere Daten nach Art. 9 DSGVO. Die Untersuchung verfolgt diese Daten ab der ersten Sekunde nach dem Start: die SDKs im Build, die Endpunkte, die die App kontaktiert, das Land, in dem sie auflösen, und den Einwilligungsablauf davor.',
          ],
          ul: [
            'Tracking- und Werbe-SDKs, die vor der Einwilligung oder vor einer Altersabfrage starten',
            'Session Replay oder Analyse auf Gesprächsbildschirmen',
            'Speicherung und Übermittlung von Chats in Drittländer (Art. 44 bis 46 DSGVO)',
            'Transportsicherheit des Gesprächsverkehrs, einschließlich Certificate Pinning',
            'Biometrische Identitätsprüfungen und ihre Rechtsgrundlage nach Art. 9',
            'Assistenten-Berechtigungen für SMS, Kontakte, Kalender oder Benachrichtigungen',
          ],
        },
        {
          h2: 'Minderjährige und Altersabfragen',
          p: [
            'Mehrere AI-Companion-Apps werden von Jugendlichen genutzt. Das Audit prüft, ob die Altersabfrage im Code tatsächlich zuerst kommt oder ob Werbe-IDs gelesen werden, bevor die App nach dem Alter fragt. Hier gelten Art. 8 DSGVO und, für US-Publikum, COPPA.',
          ],
        },
        {
          h2: 'Wer die Arbeit macht',
          p: [
            'The Squad ist human-powered multi-agent security investigation. Im Haus gebaute und trainierte Agenten dekompilieren den Build und testen Code, Abhängigkeiten, Endpunkte und Konfiguration parallel. Menschliche Fachleute prüfen jedes Ergebnis im Zusammenhang und verifizieren jeden Befund erneut, bevor er in den Bericht kommt. Die Prüfungen laufen auf Infrastruktur in Europa, mit Verarbeitung in Graz.',
          ],
        },
      ],
      evidenceH2: 'KI-Apps im öffentlichen Verzeichnis',
      evidenceIntro: 'Das öffentliche Verzeichnis listet {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese Berichte betreffen KI-Assistenten und Companions:',
      evidence: [
        { slug: 'characterai', label: 'Character.AI', note: 'Ein Werbe- und Analyse-Stack mit 12 Netzwerken startet vor der Altersabfrage, die Werbe-ID wird also gelesen, bevor Minderjährige nach ihrem Alter gefragt werden.' },
        { slug: 'deepseek', label: 'DeepSeek', note: 'Die eigene Datenschutzerklärung sagt, dass Chats in der Volksrepublik China gespeichert werden, und SDKs starten hinter einem einzigen „Zustimmen“-Knopf.' },
        { slug: 'chatgpt', label: 'ChatGPT', note: 'Firebase initialisiert vor der Einwilligung, und eine biometrische Identitätsprüfung läuft ohne offengelegte Grundlage nach Art. 9.' },
        { slug: 'grok', label: 'Grok', note: 'Gesprächsdaten laufen ohne Network Security Configuration, die verschlüsselte Verbindung lässt sich also nicht überprüfen.' },
        { slug: 'perplexity', label: 'Perplexity', note: 'Die eigenen Texte der App sagen, dass jede Person mit dem Telefon in der Hand den Assistenten ohne Entsperren nutzen kann.' },
        { slug: 'gemini', label: 'Gemini', note: 'Der sauberste KI-Assistent der Serie: null Tracking-SDKs von Drittanbietern, aber kein Certificate Pinning für den Gesprächsverkehr.' },
      ],
      startH2: 'Starten Sie mit dem kostenlosen Check',
      startText: [
        'Der kostenlose Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Der Check ist eine erste externe Einschätzung und ergänzt ein vollständiges Datenschutz-Audit für KI-Apps, ohne es zu ersetzen.',
        'Die Pläne für eine vollständige Prüfung stehen auf der Seite Zugang.',
      ],
      faqH2: 'Fragen zum Datenschutz-Audit für KI-Apps',
      faq: [
        ['Brauchen Sie Zugang zu unserem Modell oder den Trainingsdaten?', 'Das Audit arbeitet mit der ausgelieferten App und ihrem Netzwerkverkehr. Ein gebautes Paket genügt.'],
        ['Deckt das Audit AI-Companion-Apps genauso ab wie Assistenten?', 'Ja. Companion-, Assistenten- und Chatbot-Apps teilen dieselben Risiken: vertrauliche Gespräche, SDKs von Drittanbietern und Übermittlungen. Das Verzeichnis enthält beide Arten.'],
        ['Welche KI-Apps haben Sie schon untersucht?', 'Character.AI, DeepSeek, ChatGPT, Grok, Perplexity und Gemini. Jeder Bericht ist im Verzeichnis öffentlich, mit Belegen und den zitierten Artikeln.'],
        ['Ist der Bericht eine Rechtsberatung?', 'Der Bericht dokumentiert technische Tatsachen und ordnet sie Artikeln zu. Die rechtliche Bewertung bleibt bei Ihrer oder Ihrem Datenschutzbeauftragten oder bei Ihrer Rechtsvertretung.'],
      ],
    },
  },
}

export function isLandingSlug(slug: string): slug is LandingSlug {
  return (LANDING_SLUGS as readonly string[]).includes(slug)
}

export function landingDoc(slug: LandingSlug, locale: LandingLocale): LandingDoc {
  return LANDING[slug][locale]
}

/** Locale-prefixed path for an app route (/de/... twin for German, plain for English). */
export function localePath(locale: LandingLocale, path: string) {
  return locale === 'de' ? `/de${path}` : path
}
