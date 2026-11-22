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
      title: 'App Security Audit Graz · Android & iOS · RFI-IRFOS',
      description: 'App security audit from Graz: human-powered, multi-agent. We read your shipped build, find hardcoded keys and network flaws, report with evidence.',
      label: 'App Security Audit',
      h1: 'App Security Audit for Android and iOS',
      lead: 'The Squad examines the shipped build of your Android or iOS app at source-code level: decompiled code, embedded keys, network configuration, third-party SDKs and every data flow that leaves the device. Engineers in Graz turn each finding into a fix down to the code. You receive a written report with the evidence behind every result.',
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
            'Four steps carry every review. Send: you hand over the material. Examine: our team and one, several or all of our agents work through source, configuration and data flows together. Remediate: engineers turn every finding into a ready-to-apply patch before the report goes out. Evidence: we document the examination in writing, with the evidence for each finding.',
            'The report checks exploitability, meaning what an attacker could realistically do with a finding, ranks severity with CVSS where applicable, and gives remediation guidance, with concrete fixes down to the affected code from the Growth plan. Testing follows OWASP ASVS, the OWASP Top 10 and CWE. Every report ships with a base knowledge graph that links the findings. Setup takes about five minutes and the first scan can start right after it. A report usually arrives within 72 hours, depending on the scope.',
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
      startH2: 'Start with the Quick Check',
      startText: [
        'The Quick Check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. The result is an initial external assessment and does not replace a source-code review.',
        'A full app security audit starts from the plans on the Access page.',
      ],
      faqH2: 'Questions about app security audits',
      faq: [
        ['Can you audit an app without its source code?', 'Yes, and that is how we start. We take the shipped build from the store and decompile it, analyse the binary, follow data flows from the user\'s input to the network and read the network configuration. The result shows what every attacker with the same build can see; source code, if you share it, deepens the review in the [secure code review](/secure-code-review/).'],
        ['Which standards does the audit follow?', 'The audit maps every finding to OWASP MASVS, the verification standard for mobile apps, and to the OWASP MASWE weakness list, plus CWE where a category exists. Privacy findings also carry the GDPR article they touch, which the [GDPR app audit](/gdpr-app-audit/) covers in depth.'],
        ['What does the audit report contain?', 'Each finding comes with its location in the code, the evidence, a severity rating, the standard it violates and the concrete fix. A summary for management sits on top, and the [published reports](/evidence/) show the format.'],
        ['Which platforms do you cover?', 'Android and iOS apps, together with the APIs and backends they talk to, within the scope you agree.'],
        ['What happens when you find a weakness in our app?', 'In a commissioned audit the finding goes to you alone, together with the fix. Weaknesses we find in independent research follow coordinated vulnerability disclosure: the vendor receives the report first and has 90 days to fix it, as described on our [security page](/security/).'],
        ['What does an app security audit cost?', 'The [Access page](/access/) lists the plans from Starter to Business with their scope. Each plan states what you receive, and larger engagements get a written offer.'],
      ],
    },
    de: {
      title: 'App-Sicherheitsprüfung Graz · Android & iOS · RFI-IRFOS',
      description: 'App-Sicherheitsprüfung aus Graz: menschlich geprüft, Multi-Agent. Wir lesen Ihren Build, finden Schlüssel und Netzwerkfehler. Bericht mit Belegen.',
      label: 'App-Sicherheitsprüfung',
      h1: 'App-Sicherheitsprüfung für Android und iOS',
      lead: 'The Squad untersucht den ausgelieferten Build Ihrer Android- oder iOS-App auf Quellcode-Ebene: dekompilierter Code, eingebettete Schlüssel, Netzwerkkonfiguration, Drittanbieter-SDKs und jeder Datenfluss, der das Gerät verlässt. Ingenieure in Graz machen aus jedem Befund einen Fix bis in den Code. Sie erhalten einen schriftlichen Bericht mit den Belegen hinter jedem Ergebnis.',
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
            'Vier Schritte tragen jede Prüfung. Senden: Sie übergeben das Material. Untersuchen: unser Team und ein, mehrere oder alle unsere Agenten arbeiten gemeinsam durch Quellcode, Konfiguration und Datenflüsse. Beheben: Ingenieure machen aus jedem Befund einen Patch zum direkten Einspielen, bevor der Bericht hinausgeht. Belegen: wir dokumentieren die Untersuchung schriftlich, mit dem Beleg zu jedem Befund.',
            'Der Bericht prüft die Ausnutzbarkeit, also was ein Angreifer mit einem Befund realistisch anfangen kann, gewichtet den Schweregrad wo anwendbar mit CVSS und gibt Hinweise zur Behebung, ab dem Growth-Plan mit konkreten Fixes bis in den betroffenen Code. Die Tests folgen OWASP ASVS, den OWASP Top 10 und CWE. Jeder Bericht enthält einen Basis-Knowledge-Graph, der die Befunde verknüpft. Die Einrichtung dauert etwa fünf Minuten, und der erste Scan kann direkt danach starten. Einen Bericht erhalten Sie in der Regel innerhalb von 72 Stunden, je nach Umfang.',
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
      startH2: 'Starten Sie mit dem Quick Check',
      startText: [
        'Der Quick Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Das Ergebnis ist eine erste externe Einschätzung und ersetzt keine Quellcode-Prüfung.',
        'Eine vollständige App-Sicherheitsprüfung beginnt bei den Plänen auf der Seite Zugang.',
      ],
      faqH2: 'Fragen zur App-Sicherheitsprüfung',
      faq: [
        ['Lässt sich eine App ohne Quellcode prüfen?', 'Ja, genau so beginnen wir. Wir nehmen den ausgelieferten Build aus dem Store, dekompilieren ihn, analysieren das Binary, verfolgen Datenflüsse von der Eingabe bis ins Netz und lesen die Netzwerkkonfiguration. Das Ergebnis zeigt, was jeder Angreifer mit demselben Build sieht; teilen Sie den Quellcode, vertieft ihn die [Secure Code Review](/de/secure-code-review/).'],
        ['Nach welchen Standards wird geprüft?', 'Jeder Fund wird dem OWASP MASVS zugeordnet, dem Prüfstandard für Mobile-Apps, außerdem der Schwachstellenliste OWASP MASWE und, wo es eine Kategorie gibt, CWE. Datenschutzbefunde tragen zusätzlich den betroffenen DSGVO-Artikel, den die [DSGVO-Prüfung für Apps](/de/gdpr-app-audit/) vertieft.'],
        ['Was steht im Prüfbericht?', 'Jeder Fund steht mit Fundstelle im Code, Beleg, Schweregrad, verletztem Standard und konkreter Behebung im Bericht. Darüber liegt eine Zusammenfassung für die Geschäftsleitung, und die [veröffentlichten Berichte](/de/evidence/) zeigen das Format.'],
        ['Welche Plattformen deckt das Audit ab?', 'Android- und iOS-Apps samt den APIs und Backends, mit denen sie sprechen, im vereinbarten Umfang.'],
        ['Was passiert mit einer gefundenen Schwachstelle?', 'Bei einem beauftragten Audit geht der Fund ausschließlich an Sie, zusammen mit der Behebung. Für Schwachstellen aus unabhängiger Forschung gilt Coordinated Vulnerability Disclosure: Der Hersteller bekommt den Bericht zuerst und hat 90 Tage Zeit zur Behebung, wie es unsere [Sicherheitsseite](/de/security/) beschreibt.'],
        ['Was kostet ein App Security Audit?', 'Die [Seite Zugang](/de/access/) listet die Tarife von Starter bis Business mit ihrem Umfang. Jeder Tarif nennt, was Sie erhalten, und größere Aufträge bekommen ein schriftliches Angebot.'],
      ],
    },
  },

  'gdpr-app-audit': {
    en: {
      title: 'GDPR App Audit Austria: Tracking Before Consent · RFI-IRFOS',
      description: 'GDPR app audit from Graz, Austria: we decompile your Android or iOS app and show which SDKs run before consent, where data flows and which articles apply.',
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
            'The Squad is human-powered multi-agent security investigation. Agents built and trained in house execute the broad testing across code, dependencies, APIs and configurations. Engineers examine each result in its technical context and turn every finding into a fix before the report goes out. The entire pipeline runs on our own server in Graz.',
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
      startH2: 'Start with the Quick Check',
      startText: [
        'The Quick Check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. You receive a short written report with findings, likely attack scenarios, potential financial impact and next steps, plus a knowledge graph. It is an initial external assessment, so it complements a full GDPR app audit and does not replace it.',
        'The plans for a full audit are on the Access page.',
      ],
      faqH2: 'Questions about GDPR app audits',
      faq: [
        ['Does our app need a data protection impact assessment?', 'Article 35 GDPR requires a DPIA when processing is likely to result in a high risk, for example with health data, location tracking or large-scale profiling. The audit supplies the technical facts a DPIA builds on: which data leaves the device, where it goes and on what basis. Whether your case requires one stays the decision of your data protection officer.'],
        ['Which GDPR articles does the audit refer to?', 'Typically Article 5 (principles), Article 6 (lawful basis), Article 7 (consent), Article 8 (children), Article 9 (special categories), Articles 44 to 46 (third-country transfers) and Article 33 (breach notification), together with Article 5(3) of the ePrivacy Directive for terminal-equipment access.'],
        ['Does the audit show whether our consent banner works?', 'It shows what the build does before and independent of the banner: which SDKs initialise at start, which consent defaults the code sets and which endpoints receive data.'],
        ['Can we prove that personal data gets deleted?', 'The audit maps every place personal data travels to, including third-party SDKs and their servers. That map shows which systems a deletion request has to reach and forms the basis for verifying retention periods and deletion.'],
        ['What applies to apps for children?', 'Children\'s data enjoys special protection: Article 8 GDPR sets rules for their consent, and in the United States COPPA restricts data collection from children under 13. The audit checks which SDKs and data flows start in such an app and flags the advertising and tracking libraries these rules exclude.'],
        ['Is a GDPR app audit the same as a mobile app privacy audit?', 'For apps offered in Europe, yes. A mobile app privacy audit under EU law checks the app against the GDPR and the ePrivacy rules, and that is exactly the scope of this audit, for Android and iOS. The report documents technical facts and maps them to articles, while the legal assessment stays with your counsel.'],
      ],
    },
    de: {
      title: 'DSGVO-Prüfung für Apps in Österreich · RFI-IRFOS',
      description: 'DSGVO-Prüfung für Apps aus Graz: Wir dekompilieren Ihre Android- oder iOS-App und zeigen, welche SDKs vor der Einwilligung laufen und wohin Daten fließen.',
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
            'The Squad ist menschlich verantwortete Multi-Agenten-Sicherheitsuntersuchung. Selbst gebaute und trainierte Agenten führen die breite Testarbeit über Code, Abhängigkeiten, APIs und Konfigurationen aus. Ingenieure ordnen jedes Ergebnis in seinen technischen Kontext ein und machen aus jedem Befund einen Fix, bevor der Bericht hinausgeht. Die komplette Pipeline läuft auf unserem eigenen Server in Graz.',
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
      startH2: 'Starten Sie mit dem Quick Check',
      startText: [
        'Der Quick Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Sie erhalten einen kurzen schriftlichen Report mit Funden, möglichen Angriffsszenarien, dem wirtschaftlichen Schaden und nächsten Schritten, dazu einen Knowledge Graph. Der Check ist eine erste externe Einschätzung und ergänzt eine vollständige DSGVO-Prüfung der App, ohne sie zu ersetzen.',
        'Die Pläne für eine vollständige Prüfung stehen auf der Seite Zugang.',
      ],
      faqH2: 'Fragen zur DSGVO-Prüfung für Apps',
      faq: [
        ['Braucht unsere App eine Datenschutz-Folgenabschätzung?', 'Artikel 35 DSGVO verlangt eine DSFA, wenn eine Verarbeitung voraussichtlich ein hohes Risiko mit sich bringt, etwa bei Gesundheitsdaten, Standortverfolgung oder umfangreichem Profiling. Das Audit liefert die technischen Fakten, auf denen eine DSFA aufbaut: welche Daten das Gerät verlassen, wohin sie gehen und auf welcher Grundlage. Ob Ihr Fall eine DSFA verlangt, entscheidet Ihre Datenschutzbeauftragte oder Ihr Datenschutzbeauftragter.'],
        ['Auf welche DSGVO-Artikel bezieht sich die Prüfung?', 'In der Regel auf Art. 5 (Grundsätze), Art. 6 (Rechtsgrundlage), Art. 7 (Einwilligung), Art. 8 (Kinder), Art. 9 (besondere Kategorien), Art. 44 bis 46 (Drittlandübermittlung) und Art. 33 (Meldung von Verletzungen), dazu Art. 5 Abs. 3 der ePrivacy-Richtlinie für den Zugriff auf Endgeräte.'],
        ['Zeigt die Prüfung, ob unser Consent-Banner funktioniert?', 'Sie zeigt, was der Build vor dem Banner und unabhängig von ihm tut: welche SDKs beim Start initialisieren, welche Consent-Standardwerte der Code setzt und welche Endpunkte Daten empfangen.'],
        ['Lässt sich nachweisen, dass personenbezogene Daten gelöscht werden?', 'Das Audit verzeichnet jeden Ort, an den personenbezogene Daten gelangen, einschließlich der SDKs von Drittanbietern und ihrer Server. Diese Übersicht zeigt, welche Systeme ein Löschantrag erreichen muss, und bildet die Grundlage, um Aufbewahrungsfristen und Löschung zu belegen.'],
        ['Was gilt für Apps, die sich an Kinder richten?', 'Daten von Kindern stehen unter besonderem Schutz: Artikel 8 DSGVO regelt ihre Einwilligung, und in den USA beschränkt COPPA die Datenerhebung bei Kindern unter 13 Jahren. Das Audit prüft, welche SDKs und Datenflüsse in einer solchen App starten, und markiert die Werbe- und Tracking-Bibliotheken, die diese Regeln ausschließen.'],
        ['Ist eine DSGVO-Prüfung für Apps dasselbe wie ein Datenschutz-Audit für mobile Apps?', 'Für Apps, die in Europa angeboten werden, ja. Ein Datenschutz-Audit für mobile Apps nach EU-Recht prüft die App gegen die DSGVO und die ePrivacy-Regeln, und genau das ist der Umfang dieser Prüfung, für Android und iOS.'],
      ],
    },
  },

  'nis2-software-vendors': {
    en: {
      title: 'NIS2 for Software Vendors in Austria · RFI-IRFOS',
      description: 'NIS2 and Austria’s NISG 2026 for software vendors: we turn supply-chain and risk duties into technical evidence about the code, keys and SDKs you ship.',
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
            'A written report with the evidence behind each finding, severity ranked with CVSS where applicable, an analysis of what an attacker could realistically do, and remediation guidance, with concrete fixes down to the affected code from the Growth plan. Every report includes a base knowledge graph that links findings, SDKs, endpoints and weaknesses. Engineers turn every finding into a fix down to the code.',
            'The report is technical evidence for your risk-management documentation. It carries no certificate. Setup takes about five minutes and the first scan can start right after it. A report usually arrives within 72 hours, depending on the scope.',
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
      startH2: 'Start with the Quick Check',
      startText: [
        'The Quick Check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. It is an initial external assessment and does not replace a source-code review.',
        'See the plans for a full audit on the Access page, and the frameworks we audit against on the Standards page.',
      ],
      faqH2: 'Questions about NIS2 and software vendors',
      faq: [
        ['What does the Cyber Resilience Act require of software manufacturers?', 'The EU CRA requires manufacturers of products with digital elements to handle vulnerabilities throughout the support period, to ship security updates and to run a coordinated vulnerability disclosure process. Actively exploited vulnerabilities must be reported from 11 September 2026, and the full obligations apply from 11 December 2027.'],
        ['What is an SBOM, and do we need one?', 'A software bill of materials lists every component of your product with its version, much like a list of ingredients. The CRA requires manufacturers to draw one up, and NIS2 customers increasingly ask for it. The audit shows which components your build actually contains, the basis for an SBOM that matches what you ship.'],
        ['What is a vulnerability disclosure policy?', 'A public page that tells researchers how to report a vulnerability to you and what happens next. Our [benchmark of 398 apps](/research/european-cyberresilience-benchmark-2026/) shows how often this channel fails: a human answer came for 29.2 percent of the apps. We help you set up the policy and the process behind it, and our own [security page](/security/) shows one in practice.'],
        ['Does NIS2 apply to our company?', 'That depends on sector, size and role in a supply chain. The national authority\'s information at nis.gv.at is the reference. The audit supplies technical facts and leaves the applicability decision to you and your counsel.'],
        ['Do you certify NIS2 compliance?', 'No certificate is issued. The deliverable is a written technical report with evidence for your risk-management documentation.'],
        ['How long does an audit take?', 'Setup takes about five minutes and the first scan can start right after it. A report usually arrives within 72 hours, depending on the scope.'],
      ],
    },
    de: {
      title: 'NIS2 für Softwareanbieter in Österreich · RFI-IRFOS',
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
            'Einen schriftlichen Bericht mit dem Beleg zu jedem Befund, nach CVSS gewichtetem Schweregrad wo anwendbar, einer Analyse dessen, was ein Angreifer realistisch tun kann, und Hinweisen zur Behebung, ab dem Growth-Plan mit konkreten Fixes bis in den betroffenen Code. Jeder Bericht enthält einen Basis-Knowledge-Graph, der Befunde, SDKs, Endpunkte und Schwachstellen verknüpft. Ingenieure machen aus jedem Befund einen Fix bis in den Code.',
            'Der Bericht ist ein technischer Beleg für Ihre Risikomanagement-Dokumentation. Er trägt kein Zertifikat. Die Einrichtung dauert etwa fünf Minuten, und der erste Scan kann direkt danach starten. Einen Bericht erhalten Sie in der Regel innerhalb von 72 Stunden, je nach Umfang.',
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
      startH2: 'Starten Sie mit dem Quick Check',
      startText: [
        'Der Quick Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Der Check ist eine erste externe Einschätzung und ersetzt keine Quellcode-Prüfung.',
        'Die Pläne für eine vollständige Prüfung stehen auf der Seite Zugang, die Rahmenwerke, gegen die wir prüfen, auf der Seite Standards.',
      ],
      faqH2: 'Fragen zu NIS2 und Softwareanbietern',
      faq: [
        ['Was verlangt der Cyber Resilience Act von Softwareherstellern?', 'Der EU CRA verpflichtet Hersteller von Produkten mit digitalen Elementen, Schwachstellen über den gesamten Supportzeitraum zu behandeln, Sicherheitsupdates auszuliefern und einen Prozess für die koordinierte Offenlegung von Schwachstellen zu betreiben. Aktiv ausgenutzte Schwachstellen sind ab 11. September 2026 meldepflichtig, die vollen Pflichten gelten ab 11. Dezember 2027.'],
        ['Was ist eine SBOM, und brauchen wir eine?', 'Eine Software Bill of Materials listet jede Komponente Ihres Produkts mit ihrer Version, ähnlich einer Zutatenliste. Der CRA verlangt sie von Herstellern, und Kunden unter NIS2 fragen zunehmend danach. Das Audit zeigt, welche Komponenten Ihr Build tatsächlich enthält, die Grundlage für eine SBOM, die zu Ihrer ausgelieferten Software passt.'],
        ['Was ist eine Vulnerability Disclosure Policy?', 'Eine öffentliche Seite, die Forschenden erklärt, wie sie Ihnen eine Schwachstelle melden und was danach geschieht. Unser [Benchmark über 398 Apps](/research/european-cyberresilience-benchmark-2026/) zeigt, wie oft dieser Weg scheitert: Eine Antwort von einem Menschen kam bei 29,2 Prozent der Apps. Wir helfen Ihnen, die Policy und den Prozess dahinter aufzusetzen, und unsere eigene [Sicherheitsseite](/de/security/) zeigt eine solche in der Praxis.'],
        ['Gilt NIS2 für unser Unternehmen?', 'Das hängt von Sektor, Größe und Rolle in einer Lieferkette ab. Die Informationen der nationalen Behörde unter nis.gv.at sind die Referenz. Die Prüfung liefert technische Tatsachen und überlässt die Entscheidung über die Anwendbarkeit Ihnen und Ihrer Rechtsvertretung.'],
        ['Zertifizieren Sie die NIS2-Konformität?', 'Es wird kein Zertifikat ausgestellt. Geliefert wird ein schriftlicher technischer Bericht mit Belegen für Ihre Risikomanagement-Dokumentation.'],
        ['Wie lange dauert eine Prüfung?', 'Die Einrichtung dauert etwa fünf Minuten, und der erste Scan kann direkt danach starten. Einen Bericht erhalten Sie in der Regel innerhalb von 72 Stunden, je nach Umfang.'],
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
            'A written report with one entry per SDK: name, version, class count, trigger, endpoints and data categories, each with its evidence from the binary. Engineers turn every finding into a fix down to the code. The base knowledge graph that ships with the report links SDKs, endpoints and findings. For teams that need the same view across many apps, the Data offer builds SDK and tracker graphs. See the Access page for scope and plans.',
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
      startH2: 'Start with the Quick Check',
      startText: [
        'The Quick Check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. It is an initial external assessment, so it complements the SDK inventory of a full audit and does not replace it.',
        'The plans for a full audit are on the Access page.',
      ],
      faqH2: 'Questions about tracker and SDK checks',
      faq: [
        ['Which third parties receive data from our app?', 'The check lists every SDK in the shipped build, the moment it starts, what it collects and which servers it contacts. You see at a glance which vendors receive data from your users, including those that start before consent is given.'],
        ['Which SDKs does the check find?', 'Analytics, attribution, advertising, session replay, push, tag-manager tags and advertising APIs. Every library in the build is listed, and the report marks the ones that act on user data.'],
        ['Why is an SDK a supply chain risk?', 'Every SDK is code from another company that runs with the permissions of your app. A vulnerable version, a changed data practice or a takeover of the vendor reaches your users through your app. The check lists each library with its version, which makes known vulnerabilities and pending updates traceable, the core of software supply chain security for mobile apps.'],
        ['Does the check cover open-source licences?', 'Yes. Alongside the data flows, the report shows the licences of the libraries in the build, so obligations such as attribution or the disclosure of source code become visible before the next release.'],
        ['Do you need our source code?', 'A built package is enough. You can also send a GitHub link, a repository archive or an API specification.'],
        ['Does the check cover the legal side?', 'Findings are anchored to the relevant GDPR and ePrivacy articles. The [GDPR app audit](/gdpr-app-audit/) covers that part in depth.'],
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
            'Einen schriftlichen Bericht mit einem Eintrag je SDK: Name, Version, Klassenzahl, Auslöser, Endpunkte und Datenkategorien, jeweils mit dem Beleg aus dem Binary. Ingenieure machen aus jedem Befund einen Fix bis in den Code. Der Basis-Knowledge-Graph im Bericht verknüpft SDKs, Endpunkte und Befunde. Für Teams, die dieselbe Sicht über viele Apps brauchen, baut das Data-Angebot SDK- und Tracker-Graphen. Umfang und Pläne stehen auf der Seite Zugang.',
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
      startH2: 'Starten Sie mit dem Quick Check',
      startText: [
        'Der Quick Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Der Check ist eine erste externe Einschätzung und ergänzt das SDK-Inventar einer vollständigen Prüfung, ohne es zu ersetzen.',
        'Die Pläne für eine vollständige Prüfung stehen auf der Seite Zugang.',
      ],
      faqH2: 'Fragen zum Tracker- und SDK-Check',
      faq: [
        ['Welche Drittanbieter erhalten Daten aus unserer App?', 'Der Check listet jedes SDK im ausgelieferten Build, den Zeitpunkt seines Starts, die Daten, die es sammelt, und die Server, mit denen es spricht. So sehen Sie auf einen Blick, welche Anbieter Daten Ihrer Nutzer erhalten, auch jene, die schon vor der Einwilligung starten.'],
        ['Welche SDKs findet der Check?', 'Analytics, Attribution, Werbung, Session Replay, Push, Tag-Manager-Tags und Werbe-APIs. Jede Bibliothek im Build steht in der Liste, und der Bericht markiert jene, die mit Nutzerdaten arbeiten.'],
        ['Warum ist ein SDK ein Risiko in der Lieferkette?', 'Jedes SDK ist Code eines anderen Unternehmens, der mit den Berechtigungen Ihrer App läuft. Eine verwundbare Version, eine geänderte Datenpraxis oder die Übernahme des Anbieters erreicht Ihre Nutzer über Ihre App. Der Check führt jede Bibliothek mit ihrer Version auf, wodurch bekannte Schwachstellen und ausstehende Updates nachvollziehbar werden, der Kern von Software Supply Chain Security für Mobile-Apps.'],
        ['Prüft der Check auch Open-Source-Lizenzen?', 'Ja. Neben den Datenflüssen zeigt der Bericht die Lizenzen der Bibliotheken im Build, wodurch Pflichten wie Namensnennung oder die Offenlegung von Quellcode vor dem nächsten Release sichtbar werden.'],
        ['Ist der Quellcode Voraussetzung?', 'Ein gebautes Paket genügt. Ebenso können Sie einen GitHub-Link, ein Archiv des Codes oder eine API-Spezifikation schicken.'],
        ['Deckt der Check auch die rechtliche Seite ab?', 'Die Befunde sind den einschlägigen Artikeln der DSGVO und der ePrivacy-Richtlinie zugeordnet. Diesen Teil vertieft die [DSGVO-Prüfung für Apps](/de/gdpr-app-audit/).'],
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
            'The Squad is human-powered multi-agent security investigation. Agents built and trained in house decompile the build and test code, dependencies, endpoints and configuration in parallel. Engineers examine every result in context and turn each finding into a fix before the report goes out. The entire pipeline runs on our own server in Graz.',
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
      startH2: 'Start with the Quick Check',
      startText: [
        'The Quick Check examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day. It is an initial external assessment, so it complements a full AI app privacy audit and does not replace it.',
        'The plans for a full audit are on the Access page.',
      ],
      faqH2: 'Questions about AI app privacy audits',
      faq: [
        ['Where do conversations with an AI app end up?', 'We trace every request the app sends, to the model provider, to analytics and to crash reporting, together with what each request carries. The report shows which recipients receive conversations and personal data and which of them sit outside the EU.'],
        ['Do you also test the model against attacks?', 'Yes. Prompt injection, agent and MCP permissions and guardrails are covered by our [AI and LLM security testing](/ai-llm-security-testing/), and both reviews can run together.'],
        ['Which frameworks does the audit follow?', 'Findings are mapped to the OWASP Top 10 for LLM Applications and to MITRE ATLAS, the knowledge base of attacks on AI systems. On the privacy side, each finding carries the GDPR article it touches.'],
        ['What does the EU AI Act require?', 'The EU AI Act sets obligations by risk class. High-risk systems, for instance, must meet requirements for accuracy, robustness and cybersecurity under Article 15. The audit supplies technical evidence for these requirements, while the classification of your system stays with you and your counsel.'],
        ['Do you need access to our model or training data?', 'The audit works on the shipped app and its network traffic. A built package is enough.'],
        ['Which AI apps have you already investigated?', 'Character.AI, DeepSeek, ChatGPT, Grok, Perplexity and Gemini. Each report is public in the ledger, with its evidence and the articles it cites.'],
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
            'The Squad ist human-powered multi-agent security investigation. Im Haus gebaute und trainierte Agenten dekompilieren den Build und testen Code, Abhängigkeiten, Endpunkte und Konfiguration parallel. Ingenieure ordnen jedes Ergebnis in seinen Zusammenhang ein und machen aus jedem Befund einen Fix, bevor er in den Bericht kommt. Die komplette Pipeline läuft auf unserem eigenen Server in Graz.',
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
      startH2: 'Starten Sie mit dem Quick Check',
      startText: [
        'Der Quick Check untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags. Der Check ist eine erste externe Einschätzung und ergänzt ein vollständiges Datenschutz-Audit für KI-Apps, ohne es zu ersetzen.',
        'Die Pläne für eine vollständige Prüfung stehen auf der Seite Zugang.',
      ],
      faqH2: 'Fragen zum Datenschutz-Audit für KI-Apps',
      faq: [
        ['Wohin gelangen Gespräche mit einer KI-App?', 'Wir verfolgen jede Anfrage, die die App sendet, an den Modellanbieter, an Analysedienste und an die Absturzberichte, samt dem, was jede Anfrage enthält. Der Bericht zeigt, welche Empfänger Gespräche und personenbezogene Daten erhalten und welche davon außerhalb der EU sitzen.'],
        ['Testen Sie auch das Modell gegen Angriffe?', 'Ja. Prompt Injection, die Rechte von Agenten und MCP-Servern sowie Guardrails behandelt unser [AI und LLM Security Testing](/de/ai-llm-security-testing/), und beide Prüfungen lassen sich verbinden.'],
        ['Nach welchen Rahmenwerken wird geprüft?', 'Die Befunde sind den OWASP Top 10 für LLM-Anwendungen und MITRE ATLAS zugeordnet, der Wissensbasis zu Angriffen auf KI-Systeme. Auf der Datenschutzseite trägt jeder Befund den betroffenen DSGVO-Artikel.'],
        ['Was verlangt der EU AI Act?', 'Der EU AI Act knüpft Pflichten an Risikoklassen. Hochrisiko-Systeme etwa müssen nach Artikel 15 Anforderungen an Genauigkeit, Robustheit und Cybersicherheit erfüllen. Das Audit liefert technische Nachweise zu diesen Anforderungen, die Einstufung Ihres Systems bleibt bei Ihnen und Ihrer Rechtsberatung.'],
        ['Braucht das Audit Zugriff auf unser Modell oder unsere Trainingsdaten?', 'Das Audit arbeitet mit der ausgelieferten App und ihrem Netzwerkverkehr. Ein gebautes Paket genügt.'],
        ['Welche KI-Apps wurden bereits untersucht?', 'Character.AI, DeepSeek, ChatGPT, Grok, Perplexity und Gemini. Jeder Bericht ist im Verzeichnis öffentlich, mit Belegen und den zitierten Artikeln.'],
      ],
    },
  },
  'managed-soc': {
    en: {
      title: 'Managed SOC from Graz, Austria · RFI-IRFOS',
      description: 'Outsourced security operations center: 24/7 monitoring, incident response within one hour, fixes within 24 hours down to the code. From RFI-IRFOS in Graz.',
      label: 'Outsourced SOC',
      h1: 'Managed SOC from Graz: your outsourced security department',
      lead: 'Startups and companies without in-house security capacity hand us their security operations center. We monitor around the clock, respond to incidents within one hour and fix the finding ourselves within 24 hours, down to the code. One dedicated team works as your security department.',
      sections: [
        {
          h2: 'What the Managed SOC includes',
          p: [
            'Agents we built ourselves watch your systems. Engineers turn every finding into a fix before it reaches you.',
          ],
          ul: [
            'Monitoring around the clock, 24/7.',
            'Incident response within 1 hour.',
            'Fix within 24 hours, down to the code.',
            'One dedicated team as your security department.',
            'Custom surfaces for MSP and multi-tenant setups.',
            'White-label delivery and agreed SLAs.',
            'Compliance automation for your auditor (see the Compliance Automation page).',
          ],
        },
        {
          h2: 'Who it is for',
          p: [
            'The offer fits startups that sell to larger customers and receive security questionnaires. It fits growing companies that have no security team yet, and enterprises that want an additional team on call. Managed service providers can run it with their own surfaces and their own branding.',
            'The name Managed SOC describes a service. It has no connection to the SOC 2 audit standard, which the Compliance Automation page explains.',
          ],
        },
        {
          h2: 'How a SOC engagement starts',
          p: [
            'Every engagement begins with a look at your public attack surface, so scope and price rest on facts. The Domain Security Test is that first look. Prices depend on scope and are offered in writing.',
          ],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show how we document what we find:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Start with the Domain Security Test',
      startText: [
        'The Domain Security Test examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day.',
        'To request a Managed SOC, use the Managed SOC card on the Access page.',
      ],
      faqH2: 'Frequently asked questions',
      faq: [
        ['What is a Managed SOC?', 'A Managed SOC is a security operations center run for you by an external team: the people and tools that watch your systems, detect attacks, investigate alerts and handle incidents. Companies choose it when covering every hour of the week with their own staff would take several hires.'],
        ['Who responds at night, on weekends and on public holidays?', 'A person, at any hour. Our team is staffed around the clock, including nights, weekends and public holidays, and the one-hour response applies at 3 a.m. exactly as it does at noon. Agents raise the alert, and an engineer takes over the incident and traces the attack path.'],
        ['What does a Managed SOC cost?', 'The price follows the scope: how many systems, locations and cloud accounts we monitor, and which response times you need. Every engagement starts with the Domain Security Test, a look at your public attack surface, so the offer rests on facts. You then receive a written offer with a fixed monthly price, which covers monitoring, incident response and the fixes.'],
        ['Does a Managed SOC help with NIS2 reporting?', 'NIS2 and the Austrian NISG 2026 require covered companies to send the authority an early warning within 24 hours of a significant incident, an incident notification within 72 hours and a final report within one month. The Managed SOC supplies what these reports rest on: the detection, a documented incident timeline and the technical analysis. Your company files the reports itself, and our material is prepared so that it can go straight into them. Whether your company falls under NIS2 is the subject of our [NIS2 consulting](/nis2-consulting/).'],
        ['Where is our data processed, and is it used to train AI models?', "On our own server in Graz, Austria, where every customer runs in an instance of their own, separate from all other customers. Wherever language models work on customer content, we use European endpoints only, and your data is never used to train any model, ours or anyone else's."],
        ['Does a Managed SOC replace our IT team?', 'It takes over monitoring, incident response and the technical fixes. Companies without security staff use it as their security function, while companies with an IT team keep their people on daily operations. Decisions about risk and the legal duties under NIS2 remain with your management.'],
      ],
    },
    de: {
      title: 'Managed SOC aus Graz: ausgelagertes SOC · RFI-IRFOS',
      description: 'Ausgelagertes Security Operations Center: Überwachung rund um die Uhr, Incident Response binnen einer Stunde, Fix in 24 Stunden bis in den Code. Aus Graz.',
      label: 'Ausgelagertes SOC',
      h1: 'Managed SOC aus Graz: Ihre ausgelagerte Sicherheitsabteilung',
      lead: 'Startups und Unternehmen ohne eigene Sicherheitskapazität übergeben uns ihr Security Operations Center. Wir überwachen rund um die Uhr, reagieren im Ernstfall binnen einer Stunde und beheben den Fund innerhalb von 24 Stunden selbst, bis in den Code. Ein festes Team arbeitet als Ihre Sicherheitsabteilung.',
      sections: [
        {
          h2: 'Was das Managed SOC umfasst',
          p: [
            'Agenten, die wir selbst gebaut haben, beobachten Ihre Systeme. Ingenieure aus unserem Team machen aus jedem Befund einen Fix, bevor er bei Ihnen ankommt.',
          ],
          ul: [
            'Überwachung rund um die Uhr, 24/7.',
            'Incident Response binnen 1 Stunde.',
            'Fix binnen 24 Stunden, bis in den Code.',
            'Ein festes Team als Ihre Sicherheitsabteilung.',
            'Individuelle Oberflächen für MSP und Multi-Tenant.',
            'White-Label und vereinbarte SLAs.',
            'Compliance-Automatisierung für Ihre Prüfstelle (siehe Seite Compliance-Automatisierung).',
          ],
        },
        {
          h2: 'Für wen das Angebot gedacht ist',
          p: [
            'Das Angebot passt zu Startups, die an größere Kunden verkaufen und Sicherheitsfragebögen erhalten. Es passt zu wachsenden Unternehmen, die noch kein Sicherheitsteam haben, und zu Konzernen, die ein zusätzliches Team in Bereitschaft wollen. Managed Service Provider betreiben es mit eigenen Oberflächen und unter eigenem Namen.',
            'Der Name Managed SOC beschreibt einen Dienst. Mit dem Prüfstandard SOC 2 hat er keine Verbindung, die Seite Compliance-Automatisierung erklärt den Standard.',
          ],
        },
        {
          h2: 'Wie ein SOC-Auftrag beginnt',
          p: [
            'Jeder Auftrag beginnt mit einem Blick auf Ihre öffentliche Angriffsfläche, damit Umfang und Preis auf Fakten ruhen. Dieser erste Blick ist der Domain Security Test. Der Preis richtet sich nach dem Umfang und wird schriftlich angeboten.',
          ],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen, wie wir unsere Funde dokumentieren:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Starten Sie mit dem Domain Security Test',
      startText: [
        'Der Domain Security Test untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.',
        'Ein Managed SOC fragen Sie über die Karte Managed SOC auf der Seite Zugang an.',
      ],
      faqH2: 'Häufige Fragen',
      faq: [
        ['Was ist ein Managed SOC?', 'Ein Managed SOC ist ein Security Operations Center, das ein externes Team für Sie betreibt: Menschen und Werkzeuge, die Ihre Systeme überwachen, Angriffe erkennen, Alarme untersuchen und Vorfälle bearbeiten. Unternehmen entscheiden sich dafür, wenn eine Besetzung rund um die Uhr mit eigenem Personal mehrere Neueinstellungen bräuchte.'],
        ['Wer reagiert nachts, am Wochenende und an Feiertagen?', 'Ein Mensch, zu jeder Stunde. Unser Team ist rund um die Uhr besetzt, auch nachts, am Wochenende und an Feiertagen, und die Reaktion binnen einer Stunde gilt um drei Uhr früh genauso wie zu Mittag. Agenten schlagen Alarm, ein Engineer übernimmt den Vorfall und verfolgt den Angriffsweg.'],
        ['Was kostet ein Managed SOC?', 'Der Preis richtet sich nach dem Umfang: wie viele Systeme, Standorte und Cloud-Konten wir überwachen und welche Reaktionszeiten Sie brauchen. Jede Zusammenarbeit beginnt mit dem Domain Security Test, einem Blick auf Ihre öffentliche Angriffsfläche, damit das Angebot auf Fakten steht. Danach erhalten Sie ein schriftliches Angebot mit festem Monatspreis, der Überwachung, Reaktion auf Vorfälle und die Behebungen abdeckt.'],
        ['Hilft ein Managed SOC bei den NIS2-Meldepflichten?', 'NIS2 und das österreichische NISG 2026 verpflichten betroffene Unternehmen, der Behörde binnen 24 Stunden nach einem erheblichen Vorfall eine Frühwarnung zu schicken, binnen 72 Stunden eine Vorfallsmeldung und binnen eines Monats einen Abschlussbericht. Das Managed SOC liefert, worauf diese Meldungen beruhen: die Erkennung, eine dokumentierte Zeitleiste des Vorfalls und die technische Analyse. Die Meldungen reicht Ihr Unternehmen selbst ein, und unsere Unterlagen sind so aufbereitet, dass sie direkt darin einfließen. Ob Ihr Unternehmen unter NIS2 fällt, klärt unsere [NIS2-Beratung](/de/nis2-consulting/).'],
        ['Wo werden unsere Daten verarbeitet, und dienen sie zum Training von KI-Modellen?', 'Auf unserem eigenen Server in Graz, wo jeder Kunde eine eigene Instanz hat, getrennt von allen anderen Kunden. Wo Sprachmodelle an Kundeninhalten arbeiten, nutzen wir ausschließlich europäische Endpunkte, und Ihre Daten trainieren kein Modell, weder unsere noch die anderer Anbieter.'],
        ['Ersetzt ein Managed SOC unser IT-Team?', 'Es übernimmt Überwachung, Reaktion auf Vorfälle und die technischen Behebungen. Unternehmen ohne Sicherheitspersonal nutzen es als ihre Sicherheitsfunktion, Unternehmen mit IT-Team lassen ihre Leute beim Tagesgeschäft. Entscheidungen über Risiken und die gesetzlichen Pflichten aus NIS2 bleiben bei Ihrer Geschäftsleitung.'],
      ],
    },
  },
  'compliance-automation': {
    en: {
      title: 'Compliance Automation: NIS2, ISO 27001, SOC 2 · RFI-IRFOS',
      description: 'We map findings and evidence to the controls of NIS2, ISO 27001 and SOC 2 in the customer portal. Pay online, start within minutes. Your auditor audits.',
      label: 'Compliance Automation',
      h1: 'Compliance Automation for NIS2, ISO 27001 and SOC 2',
      lead: 'Audits ask for evidence. We map the findings and evidence from our reviews to the controls of NIS2, ISO 27001 and SOC 2, so your auditor receives them sorted by control. Ten more frameworks follow the same method, from DORA to HIPAA. Your auditor audits, we deliver the evidence.',
      sections: [
        {
          h2: 'What compliance automation means here',
          p: [
            'Each framework lists controls: rules your company has to meet and show proof for. Our reviews produce technical facts about your software and systems. Compliance automation connects the two. Every finding and every piece of evidence carries the control it belongs to, so the proof is ready when the audit starts.',
            'Compliance automation is part of the Managed SOC, and it works as an add-on to the audit reports described on the other pages.',
          ],
        },
        {
          h2: 'The frameworks',
          p: ['We map to ten frameworks. For each one you see the share of controls that already carry evidence, in percent, across your whole organisation.'],
          ul: [
            'NIS2, in Austria the NISG 2026: risk management, cryptography, access control and supply-chain security.',
            'ISO/IEC 27001:2022: the standard for an information security management system.',
            'SOC 2: an audit standard for service providers. It has no connection to the Managed SOC, which is a service we run for you.',
            'EU Cyber Resilience Act (CRA): security requirements for products with digital elements, from vulnerability handling to updates.',
            'DORA: the EU regulation on digital operational resilience for financial entities and their ICT providers.',
            'EU AI Act: the EU regulation on artificial intelligence, with duties graded by risk class.',
            'GDPR: the technical and organisational measures that protect personal data.',
            'PCI DSS 4.0: the security standard for systems that process card payments.',
            'NIST CSF 2.0: the cybersecurity framework of the US standards institute, organised in six functions.',
            'CIS Controls v8: eighteen prioritised safeguards for IT systems and data.',
          ],
        },
        {
          h2: 'Who does what',
          p: [
            'Your auditor audits and issues the certificate or the report. We deliver the technical evidence in the form the auditor works with. A certificate is not part of our service.',
          ],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show how we document what we find:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Start with the Domain Security Test',
      startText: [
        'The Domain Security Test examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day.',
        'Compliance automation is part of the Managed SOC. Plans and prices are on the Access page.',
      ],
      faqH2: 'Questions about compliance automation',
      faq: [
        ['How does a finding become evidence for our auditor?', 'Each finding is verified with a proof of concept, rated and fixed, and a retest confirms the fix. The portal links that trail to the controls it satisfies, so your auditor sees control, finding, fix and retest in one place, sorted by framework.'],
        ['Can we cover several frameworks at once?', 'Yes. One control often satisfies requirements in several frameworks, access control for example in ISO 27001, SOC 2 and NIS2. The portal maps each piece of evidence to every requirement it supports, so the same work counts everywhere.'],
        ['Do you help with security questionnaires from customers?', 'Yes. The evidence collected in the portal supplies the answers, and the Trust Center shows prospects which frameworks you work to and which controls are in place before they send a questionnaire at all.'],
        ['Do you certify us for ISO 27001 or SOC 2?', 'Your auditor certifies. We deliver the technical evidence that the auditor needs.'],
        ['Which frameworks do you cover?', 'ISO/IEC 27001:2022, SOC 2, NIS2 (NISG 2026 in Austria), the EU Cyber Resilience Act, NIST CSF 2.0, CIS Controls v8, GDPR, DORA, PCI DSS 4.0, the EU AI Act, COPPA, UK GDPR and HIPAA. The last four apply once you confirm that they concern your organisation.'],
        ['Which plan includes compliance automation?', 'Automated compliance is part of the plans from Pro and of the [Managed SOC](/managed-soc/). The [Access page](/access/) lists what each plan contains.'],
      ],
    },
    de: {
      title: 'Compliance-Automatisierung: NIS2 und SOC 2 · RFI-IRFOS',
      description: 'Wir ordnen Befunde und Belege im Kundenportal den Kontrollen von NIS2, ISO 27001 und SOC 2 zu. Online bezahlen, in Minuten starten. Ihre Prüfstelle prüft.',
      label: 'Compliance-Automatisierung',
      h1: 'Compliance-Automatisierung für NIS2, ISO 27001 und SOC 2',
      lead: 'Audits verlangen Belege. Wir ordnen die Befunde und Belege aus unseren Prüfungen den Kontrollen von NIS2, ISO 27001 und SOC 2 zu, damit Ihre Prüfstelle sie nach Kontrollen sortiert erhält. Zehn weitere Rahmenwerke folgen derselben Methode, von DORA bis HIPAA. Ihre Prüfstelle prüft, wir liefern die Belege.',
      sections: [
        {
          h2: 'Was Compliance-Automatisierung hier bedeutet',
          p: [
            'Jedes Rahmenwerk listet Kontrollen: Regeln, die Ihr Unternehmen einhalten und belegen muss. Unsere Prüfungen liefern technische Fakten über Ihre Software und Ihre Systeme. Die Compliance-Automatisierung verbindet beides. Jeder Befund und jeder Beleg trägt die Kontrolle, zu der er gehört, und der Nachweis liegt bereit, wenn das Audit beginnt.',
            'Die Compliance-Automatisierung gehört zum Managed SOC und ergänzt die Prüfberichte, die auf den anderen Seiten beschrieben sind.',
          ],
        },
        {
          h2: 'Die Rahmenwerke',
          p: ['Wir ordnen zehn Rahmenwerken zu. Für jedes sehen Sie in Prozent, wie viele Kontrollen in Ihrer gesamten Organisation schon einen Beleg tragen.'],
          ul: [
            'NIS2, in Österreich das NISG 2026: Risikomanagement, Kryptografie, Zugriffskontrolle und Sicherheit der Lieferkette.',
            'ISO/IEC 27001:2022: der Standard für ein Informationssicherheits-Managementsystem.',
            'SOC 2: ein Prüfstandard für Dienstleister. Mit dem Managed SOC, einem Dienst, den wir für Sie betreiben, hat er keine Verbindung.',
            'EU Cyber Resilience Act (CRA): Sicherheitsanforderungen für Produkte mit digitalen Elementen, vom Umgang mit Schwachstellen bis zu Updates.',
            'DORA: die EU-Verordnung über die digitale operationale Resilienz von Finanzunternehmen und ihren IT-Dienstleistern.',
            'EU AI Act: die EU-Verordnung über künstliche Intelligenz, mit Pflichten je nach Risikoklasse.',
            'DSGVO: die technischen und organisatorischen Maßnahmen zum Schutz personenbezogener Daten.',
            'PCI DSS 4.0: der Sicherheitsstandard für Systeme, die Kartenzahlungen verarbeiten.',
            'NIST CSF 2.0: das Cybersicherheits-Rahmenwerk der US-Normungsbehörde, gegliedert in sechs Funktionen.',
            'CIS Controls v8: achtzehn priorisierte Schutzmaßnahmen für IT-Systeme und Daten.',
          ],
        },
        {
          h2: 'Wer was tut',
          p: [
            'Ihre Prüfstelle prüft und stellt das Zertifikat oder den Bericht aus. Wir liefern die technischen Belege in der Form, mit der die Prüfstelle arbeitet. Ein Zertifikat gehört nicht zu unserer Leistung.',
          ],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen, wie wir unsere Funde dokumentieren:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Starten Sie mit dem Domain Security Test',
      startText: [
        'Der Domain Security Test untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.',
        'Die Compliance-Automatisierung gehört zum Managed SOC. Pläne und Preise stehen auf der Seite Zugang.',
      ],
      faqH2: 'Fragen zur Compliance-Automatisierung',
      faq: [
        ['Wie wird aus einem Fund ein Prüfnachweis?', 'Jeder Fund wird mit einem Proof of Concept belegt, bewertet und behoben, und ein Retest bestätigt die Behebung. Das Portal verknüpft diese Spur mit den Kontrollen, die sie erfüllt, sodass Ihre Prüfenden Kontrolle, Fund, Behebung und Retest an einem Ort sehen, geordnet nach Framework.'],
        ['Lassen sich mehrere Frameworks gleichzeitig abdecken?', 'Ja. Eine Kontrolle erfüllt oft Anforderungen mehrerer Frameworks, die Zugriffskontrolle etwa in ISO 27001, SOC 2 und NIS2. Das Portal ordnet jeden Nachweis allen Anforderungen zu, die er stützt, damit dieselbe Arbeit überall zählt.'],
        ['Unterstützen Sie bei Sicherheitsfragebögen von Kunden?', 'Ja. Die im Portal gesammelten Nachweise liefern die Antworten, und das Trust Center zeigt Interessenten schon vor dem ersten Fragebogen, nach welchen Frameworks Sie arbeiten und welche Kontrollen umgesetzt sind.'],
        ['Zertifizieren Sie uns nach ISO 27001 oder SOC 2?', 'Die Zertifizierung erteilen Ihre Prüfenden. Wir liefern die technischen Nachweise, die sie dafür brauchen.'],
        ['Welche Frameworks decken Sie ab?', 'ISO/IEC 27001:2022, SOC 2, NIS2 (in Österreich NISG 2026), EU Cyber Resilience Act, NIST CSF 2.0, CIS Controls v8, DSGVO, DORA, PCI DSS 4.0, EU AI Act, COPPA, UK GDPR und HIPAA. Die letzten vier gelten, sobald Sie bestätigen, dass sie Ihre Organisation betreffen.'],
        ['Welcher Tarif enthält die Compliance-Automatisierung?', 'Die automatisierte Compliance gehört zu den Tarifen ab Pro und zum [Managed SOC](/de/managed-soc/). Die [Seite Zugang](/de/access/) listet, was jeder Tarif enthält.'],
      ],
    },
  },
  'domain-security-test': {
    en: {
      title: 'Domain Security Test: DNS, TLS, E-Mail · RFI-IRFOS',
      description: 'External, read-only test of your domain: DNS, certificates, e-mail protection and security headers. A person checks every finding. Written report.',
      label: 'Domain Security Test',
      h1: 'Domain Security Test for your domain',
      lead: 'Find out what your security tools might be missing. We test your domain from the outside, read-only, with no login and no payloads. Every finding enters a written report with its risk and the next step.',
      sections: [
        {
          h2: 'What the test covers',
          p: ['The test looks at the publicly accessible attack surface of one domain:'],
          ul: [
            'DNS and the records around it, including CAA.',
            'TLS and the certificate.',
            'E-mail protection with SPF, DKIM and DMARC.',
            'Security headers of your website.',
          ],
        },
        {
          h2: 'How it works',
          p: [
            'You enter your domain and your work e-mail address and confirm that you own the domain or may test it. A researcher reviews your request before testing begins and replies within one business day. The check runs once, read-only and from a European IP address. It makes no changes to your systems.',
          ],
        },
        {
          h2: 'What you receive',
          p: [
            'A short written report with our findings, likely attack scenarios, potential financial impact and recommended next steps. Each finding carries a CVSS severity. An exportable security intelligence graph connects the findings.',
            'The test is an initial external assessment. It does not replace a source-code review and does not guarantee that your application is secure.',
          ],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show how we document what we find:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Test your domain',
      startText: [
        'Enter your domain below. A researcher reviews your request and replies within one business day.',
        'After the test, the Access page shows what a full examination covers and costs.',
      ],
      faqH2: 'Questions about the Domain Security Test',
      faq: [
        ['What is an external attack surface?', 'Everything about your company that anyone on the internet can reach: domains and subdomains, mail servers, certificates, login pages and forgotten test systems. External attack surface management (EASM) keeps an inventory of these assets, and the domain security test is its first step, read from the outside exactly as an attacker sees it.'],
        ['What does the test check?', 'Among other things DNS and CAA records, TLS certificates and their expiry, e-mail protection with SPF, DKIM and DMARC, and the security headers of your website. The written report names every finding with its risk and the next step.'],
        ['What is shadow IT, and how does it show up?', 'Shadow IT means systems that run under your name while nobody in IT keeps track of them: an old campaign site, a staging server, a forgotten cloud service. Such systems leave traces in public DNS records and certificates, so findings in those areas often point to assets your team has lost sight of.'],
        ['Do you change anything on our systems?', 'The test reads only what is publicly visible, without a login and without payloads. The Quick Check runs once, and a short reply at any time is enough to stop it.'],
        ['Can the attack surface be monitored continuously?', 'Yes. The dashboard in the customer portal runs live DNS, HTTP and TLS sensors, so an expiring certificate or a changed record shows up as it happens. The portal is part of every plan from Starter, as the [Access page](/access/) shows.'],
        ['Is this a penetration test?', 'The domain security test is an initial external assessment of your public attack surface. A [penetration test](/penetration-testing/) goes further and actively attacks applications and infrastructure within a scope agreed in writing.'],
      ],
    },
    de: {
      title: 'Domain Security Test: DNS, TLS und E-Mail prüfen · RFI-IRFOS',
      description: 'Externer, lesender Test Ihrer Domain: DNS, Zertifikate, E-Mail-Schutz und Security-Header. Ein Mensch prüft jeden Befund. Schriftlicher Bericht.',
      label: 'Domain Security Test',
      h1: 'Domain Security Test für Ihre Domain',
      lead: 'Finden Sie heraus, was Ihre Sicherheitswerkzeuge übersehen könnten. Wir testen Ihre Domain von außen, ausschließlich lesend, ohne Login und ohne Payloads. Jeder Befund steht mit seinem Risiko und dem nächsten Schritt im schriftlichen Bericht.',
      sections: [
        {
          h2: 'Was der Test abdeckt',
          p: ['Der Test betrachtet die öffentlich erreichbare Angriffsfläche einer Domain:'],
          ul: [
            'DNS und die Einträge darum, auch CAA.',
            'TLS und das Zertifikat.',
            'E-Mail-Schutz mit SPF, DKIM und DMARC.',
            'Security-Header Ihrer Website.',
          ],
        },
        {
          h2: 'So läuft er ab',
          p: [
            'Sie geben Ihre Domain und Ihre Arbeits-E-Mail-Adresse an und bestätigen, dass die Domain Ihnen gehört oder Sie sie testen dürfen. Ein Researcher sieht Ihre Anfrage durch, bevor der Test beginnt, und meldet sich innerhalb eines Werktags. Die Prüfung läuft einmal, ausschließlich lesend und von einer europäischen IP-Adresse aus. Ihre Systeme bleiben unverändert.',
          ],
        },
        {
          h2: 'Was Sie erhalten',
          p: [
            'Einen kurzen schriftlichen Bericht mit unseren Befunden, wahrscheinlichen Angriffsszenarien, möglichen finanziellen Folgen und empfohlenen nächsten Schritten. Jeder Befund trägt eine CVSS-Bewertung. Ein exportierbarer Security-Intelligence-Graph verbindet die Befunde.',
            'Der Test ist eine erste externe Einschätzung. Eine Prüfung des Quellcodes ersetzt er nicht, und er garantiert nicht, dass Ihre Anwendung sicher ist.',
          ],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen, wie wir unsere Funde dokumentieren:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Testen Sie Ihre Domain',
      startText: [
        'Geben Sie unten Ihre Domain an. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.',
        'Nach dem Test zeigt die Seite Zugang, was eine vollständige Prüfung umfasst und kostet.',
      ],
      faqH2: 'Fragen zum Domain Security Test',
      faq: [
        ['Was ist eine externe Angriffsfläche?', 'Alles, was jeder im Internet von Ihrem Unternehmen erreicht: Domains und Subdomains, Mailserver, Zertifikate, Anmeldeseiten und vergessene Testsysteme. External Attack Surface Management (EASM) führt über diese Werte ein Inventar, und der Domain Security Test ist der erste Schritt dorthin, von außen gelesen, so wie ein Angreifer sie sieht.'],
        ['Was prüft der Test?', 'Unter anderem DNS- und CAA-Einträge, TLS-Zertifikate samt Ablaufdatum, den E-Mail-Schutz mit SPF, DKIM und DMARC sowie die Security-Header Ihrer Website. Der schriftliche Bericht nennt jeden Befund mit seinem Risiko und dem nächsten Schritt.'],
        ['Was ist Schatten-IT, und wie zeigt sie sich?', 'Schatten-IT sind Systeme, die unter Ihrem Namen laufen, während niemand in der IT sie im Blick hat: eine alte Kampagnenseite, ein Staging-Server, ein vergessener Cloud-Dienst. Solche Systeme hinterlassen Spuren in öffentlichen DNS-Einträgen und Zertifikaten, weshalb Befunde in diesen Bereichen oft auf Werte zeigen, die Ihr Team aus den Augen verloren hat.'],
        ['Verändert der Test etwas an unseren Systemen?', 'Der Test liest ausschließlich, was öffentlich sichtbar ist, ohne Anmeldung und ohne Payloads. Der Quick Check läuft einmal, und eine kurze Antwort genügt jederzeit, um ihn zu beenden.'],
        ['Lässt sich die Angriffsfläche laufend überwachen?', 'Ja. Das Dashboard im Kundenportal betreibt Live-Sensoren für DNS, HTTP und TLS, sodass ein ablaufendes Zertifikat oder ein geänderter Eintrag sofort sichtbar wird. Das Portal gehört zu jedem Tarif ab Starter, wie die [Seite Zugang](/de/access/) zeigt.'],
        ['Ist das ein Penetrationstest?', 'Der Domain Security Test ist eine erste externe Bewertung Ihrer öffentlichen Angriffsfläche. Ein [Penetrationstest](/de/penetration-testing/) geht weiter und greift Anwendungen und Infrastruktur in einem schriftlich vereinbarten Umfang aktiv an.'],
      ],
    },
  },
  'penetration-testing': {
    en: {
      title: 'Penetration Testing Graz: Apps, APIs, Cloud · RFI-IRFOS',
      description: 'Penetration testing from Graz for web apps, mobile apps, APIs and cloud. Agents test in parallel, engineers fix down to the code.',
      label: 'Penetration Testing',
      h1: 'Penetration testing in Graz for web apps, mobile apps, APIs and cloud',
      lead: 'We test your application like an attacker would. Agents we built run thousands of tests in parallel, our engineers trace the attack path of every finding and build the fix down to the code. Built for SaaS companies, startups and software vendors.',
      sections: [
        {
          h2: 'What we test',
          p: ['One engagement can cover every surface a company runs:'],
          ul: ['Web applications and their backends.', 'Mobile apps for Android and iOS.', 'APIs, REST and GraphQL.', 'Cloud environments on AWS and Azure.', 'Infrastructure and the external attack surface.'],
        },
        {
          h2: 'How an engagement works',
          p: ['Agents run the broad part: thousands of parallel tests across code, configuration and network behavior. Engineers take over where context matters. They confirm each finding with a proof of concept, follow how an attacker would move through the system and rank the consequences. We test only systems you own or may test.'],
        },
        {
          h2: 'What you receive',
          p: ['A written report with the evidence behind each finding, a CVSS severity, the attack path and fix guidance. From the Growth plan we engineer the fix itself down to the affected code and retest it. The report is technical evidence, not a certificate.'],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show how we document what we find:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Start with the Domain Security Test',
      startText: ['The Domain Security Test examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day.', 'Plans and prices are on the Access page, the agents behind every review on The Squad page.'],
      faqH2: 'Questions about penetration testing',
      faq: [
        ['What is the difference between a penetration test and red teaming?', 'A penetration test examines a defined scope, such as an application, an API or a cloud account, and looks for as many exploitable weaknesses as possible within it. Red teaming pursues one goal, for example access to customer data, and emulates a real adversary across every route that leads there, including lateral movement between systems. We run every form of teaming: red teaming that attacks, blue teaming that strengthens your detection and defence, and purple teaming where both sides work together and every attack immediately improves a detection rule. The first conversation settles which one answers your question.'],
        ['How is a penetration test different from a vulnerability scan?', 'A scanner lists possible weaknesses by matching versions and signatures. We confirm each finding with a proof of concept, show what an attacker could actually reach with it and chain individual findings into the attack path that matters for your business.'],
        ['Why do the reports show whole attack paths?', 'Attackers rarely need one critical flaw; they combine several medium ones. Our security knowledge graph maps every finding to CWE, CAPEC and MITRE ATT&CK and connects them into an attack graph, so remediation starts with the step that cuts the most paths at once.'],
        ['What does a penetration test cover?', 'Web and mobile applications, REST and GraphQL APIs, AWS and Azure environments and the infrastructure behind them, within the scope we agree in writing. Deeper tests of single areas have their own pages: [API security testing](/api-security-testing/) and [cloud security assessment](/cloud-security-assessment/).'],
        ['Do you fix what you find?', 'Yes. Our engineers write the fix down to the affected code, deliver it as a change your developers can apply directly and confirm it with a retest. Findings that stay open move into [vulnerability remediation](/vulnerability-remediation/), where they are tracked until closed.'],
        ['How long does a penetration test take, and what does it cost?', 'Both depend on scope: the number of applications, roles and environments and whether the test runs as a single project or as part of continuous testing. You receive a written offer before anything starts; the plans for continuous testing are on the [Access page](/access/).'],
      ],
    },
    de: {
      title: 'Penetrationstest Graz: Apps, APIs und Cloud · RFI-IRFOS',
      description: 'Penetrationstest aus Graz für Web, mobile Apps, APIs und Cloud. Agenten testen parallel, Ingenieure beheben bis in den Code.',
      label: 'Penetrationstest',
      h1: 'Penetrationstest in Graz für Webanwendungen, mobile Apps, APIs und Cloud',
      lead: 'Wir testen Ihre Anwendung so, wie ein Angreifer es täte. Agenten, die wir selbst gebaut haben, führen Tausende Tests parallel aus. Unsere Ingenieure verfolgen den Angriffspfad jedes Befunds und entwickeln den Fix bis in den Code. Gebaut für SaaS-Unternehmen, Startups und Softwareanbieter.',
      sections: [
        {
          h2: 'Was wir testen',
          p: ['Ein Auftrag kann jede Oberfläche abdecken, die ein Unternehmen betreibt:'],
          ul: ['Webanwendungen und ihre Backends.', 'Mobile Apps für Android und iOS.', 'APIs, REST und GraphQL.', 'Cloud-Umgebungen auf AWS und Azure.', 'Infrastruktur und die externe Angriffsfläche.'],
        },
        {
          h2: 'So läuft ein Auftrag',
          p: ['Agenten übernehmen den breiten Teil: Tausende parallele Tests über Code, Konfiguration und Netzwerkverhalten. Ingenieure übernehmen, wo Zusammenhang zählt. Sie bestätigen jeden Befund mit einem Proof of Concept, verfolgen, wie sich ein Angreifer durch das System bewegen würde, und ordnen die Folgen ein. Wir testen nur Systeme, die Ihnen gehören oder die Sie testen dürfen.'],
        },
        {
          h2: 'Was Sie erhalten',
          p: ['Einen schriftlichen Bericht mit den Belegen zu jedem Befund, einer CVSS-Bewertung, dem Angriffspfad und Hinweisen zur Behebung. Ab dem Plan Growth entwickeln wir den Fix selbst bis in den betroffenen Code und prüfen ihn erneut. Der Bericht ist ein technischer Beleg und kein Zertifikat.'],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen, wie wir unsere Funde dokumentieren:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Starten Sie mit dem Domain Security Test',
      startText: ['Der Domain Security Test untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.', 'Pläne und Preise stehen auf der Seite Zugang, die Agenten hinter jeder Prüfung auf der Seite The Squad.'],
      faqH2: 'Fragen zum Penetrationstest',
      faq: [
        ['Was unterscheidet einen Penetrationstest von Red Teaming?', 'Ein Penetrationstest untersucht einen festgelegten Umfang, etwa eine Anwendung, eine API oder ein Cloud-Konto, und sucht darin möglichst viele ausnutzbare Schwachstellen. Red Teaming verfolgt dagegen ein einzelnes Ziel, zum Beispiel den Zugriff auf Kundendaten, und ahmt einen echten Angreifer auf jedem Weg dorthin nach, einschließlich der Bewegung von System zu System. Wir bieten jede Form von Teaming an: Red Teaming, das angreift, Blue Teaming, das Ihre Erkennung und Abwehr stärkt, und Purple Teaming, bei dem beide Seiten zusammenarbeiten und jeder Angriff sofort eine Erkennungsregel verbessert. Im ersten Gespräch klären wir, was Ihre Frage beantwortet.'],
        ['Worin liegt der Unterschied zu einem Schwachstellen-Scan?', 'Ein Scanner listet mögliche Schwachstellen anhand von Versionen und Signaturen auf. Wir bestätigen jeden Fund mit einem Proof of Concept, zeigen, was ein Angreifer damit tatsächlich erreicht, und verknüpfen einzelne Funde zu dem Angriffsweg, der für Ihr Geschäft zählt.'],
        ['Warum zeigen die Berichte ganze Angriffswege?', 'Angreifer brauchen selten eine einzelne kritische Lücke, meist verbinden sie mehrere mittlere. Unser Sicherheits-Wissensgraph ordnet jeden Fund nach CWE, CAPEC und MITRE ATT&CK ein und verbindet die Funde zu einem Angriffsgraphen, sodass die Behebung bei dem Schritt beginnt, der die meisten Wege auf einmal schließt.'],
        ['Was deckt ein Penetrationstest ab?', 'Web- und Mobile-Anwendungen, REST- und GraphQL-APIs, AWS- und Azure-Umgebungen sowie die Infrastruktur dahinter, jeweils im schriftlich vereinbarten Umfang. Vertiefte Prüfungen einzelner Bereiche haben eigene Seiten: [API Security Testing](/de/api-security-testing/) und [Cloud Security Assessment](/de/cloud-security-assessment/).'],
        ['Wer behebt die gefundenen Schwachstellen?', 'Unsere Engineers schreiben die Behebung bis in den betroffenen Code, liefern sie als Änderung, die Ihre Entwickler direkt einspielen, und bestätigen sie mit einem Retest. Funde, die offen bleiben, wandern in die [Schwachstellenbehebung](/de/vulnerability-remediation/) und werden dort bis zum Abschluss verfolgt.'],
        ['Wie lange dauert ein Penetrationstest, und was kostet er?', 'Beides hängt vom Umfang ab: wie viele Anwendungen, Rollen und Umgebungen geprüft werden und ob der Test als einzelnes Projekt oder als Teil laufender Prüfungen stattfindet. Vor dem Start erhalten Sie ein schriftliches Angebot, die Tarife für laufende Prüfungen stehen auf der [Seite Zugang](/de/access/).'],
      ],
    },
  },
  'api-security-testing': {
    en: {
      title: 'API Security Testing: REST and GraphQL · RFI-IRFOS',
      description: 'API security testing for REST and GraphQL: authentication, authorization and attack surface. Every finding verified by a person, fixes down to the code.',
      label: 'API Security Testing',
      h1: 'API Security Testing for REST and GraphQL',
      lead: 'APIs expose your data and your logic to anyone who can reach them. We test authentication, authorization and the attack surface of your APIs, verify every finding with a proof of concept and engineer the fix down to the code.',
      sections: [
        {
          h2: 'What the test covers',
          p: ['The assessment looks at how your API behaves under attack:'],
          ul: ['Authentication: how users and services prove who they are.', 'Authorization: whether one user can reach another user\'s data.', 'The API attack surface: endpoints, parameters and what each one exposes.', 'REST and GraphQL interfaces.', 'Vulnerability scanning of the API, followed by human verification.'],
        },
        {
          h2: 'Why a person checks the findings',
          p: ['Scanners find patterns. Authorization flaws depend on context, for example which user may see which record. Our engineers test those cases by hand and confirm each one with a proof of concept.'],
        },
        {
          h2: 'What you receive',
          p: ['A written report with the evidence behind each finding, a CVSS severity and fix guidance. From the Growth plan, which covers up to three web apps, mobile apps or APIs, we engineer the fix down to the affected code and retest it.'],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show how we document what we find:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Start with the Domain Security Test',
      startText: ['The Domain Security Test examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day.', 'Plans and prices are on the Access page, the agents behind every review on The Squad page.'],
      faqH2: 'Questions about API security testing',
      faq: [
        ['What is API security testing?', 'API security testing examines the interfaces through which your apps, partners and customers reach your data: who may log in, who may see which records and what happens when requests are manipulated. It combines an assessment of the whole interface with hands-on attack tests of its weak spots, so every result is backed by a working proof of concept.'],
        ['Which risks does the OWASP API Security Top 10 describe?', 'The list names the ten most common weaknesses of APIs, led by broken object level authorization: an attacker changes an ID in a request and receives someone else\'s data. Further entries include broken authentication, excessive data exposure at property level, missing rate limits and unsafe consumption of third-party APIs. Our tests work through every category and add the logic flaws specific to your product.'],
        ['Can you test without harming production?', 'Yes. We agree test accounts, time windows and rate limits in advance, and we prefer a staging environment that mirrors production. Tests that could change or delete data run only where you approve them in writing.'],
        ['Do you test REST, GraphQL and authentication flows?', 'We test REST and GraphQL APIs together with their authentication: tokens, sessions, API keys and the rules that decide which user may access which object. Keys that sit hardcoded in a mobile app are part of the test, because attackers extract them the same way; the [app security audit](/app-security-audit/) covers that side in depth.'],
        ['Is this an API audit or a penetration test?', 'Both in one engagement. The audit part reviews the design, documentation and configuration of the interface, while the test part attacks it the way an outsider would. A full [penetration test](/penetration-testing/) also covers the applications and infrastructure around the API.'],
        ['What does an API security test cost?', 'The price follows the number of endpoints, roles and environments. Continuous testing runs within the plans on the [Access page](/access/), and a single project receives a written offer.'],
      ],
    },
    de: {
      title: 'API-Sicherheitstest: REST und GraphQL · RFI-IRFOS',
      description: 'API-Sicherheitstest für REST und GraphQL: Authentifizierung, Autorisierung und Angriffsfläche. Jeder Befund von Menschen geprüft, Fix bis in den Code.',
      label: 'API-Sicherheitstest',
      h1: 'API-Sicherheitstest für REST und GraphQL',
      lead: 'APIs machen Ihre Daten und Ihre Logik für jeden erreichbar, der sie ansprechen kann. Wir testen Authentifizierung, Autorisierung und Angriffsfläche Ihrer APIs, bestätigen jeden Befund mit einem Proof of Concept und entwickeln den Fix bis in den Code.',
      sections: [
        {
          h2: 'Was der Test abdeckt',
          p: ['Die Prüfung betrachtet, wie sich Ihre API unter Angriff verhält:'],
          ul: ['Authentifizierung: wie sich Nutzer und Dienste ausweisen.', 'Autorisierung: ob ein Nutzer an die Daten eines anderen kommt.', 'Die Angriffsfläche der API: Endpunkte, Parameter und was jeder davon preisgibt.', 'REST- und GraphQL-Schnittstellen.', 'Schwachstellenscan der API, danach Prüfung durch Menschen.'],
        },
        {
          h2: 'Warum ein Mensch die Befunde prüft',
          p: ['Scanner finden Muster. Fehler in der Autorisierung hängen vom Zusammenhang ab, etwa davon, welcher Nutzer welchen Datensatz sehen darf. Unsere Ingenieure testen diese Fälle von Hand und bestätigen jeden mit einem Proof of Concept.'],
        },
        {
          h2: 'Was Sie erhalten',
          p: ['Einen schriftlichen Bericht mit den Belegen zu jedem Befund, einer CVSS-Bewertung und Hinweisen zur Behebung. Ab dem Plan Growth, der bis zu drei Web-Apps, mobile Apps oder APIs abdeckt, entwickeln wir den Fix bis in den betroffenen Code und prüfen ihn erneut.'],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen, wie wir unsere Funde dokumentieren:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Starten Sie mit dem Domain Security Test',
      startText: ['Der Domain Security Test untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.', 'Pläne und Preise stehen auf der Seite Zugang, die Agenten hinter jeder Prüfung auf der Seite The Squad.'],
      faqH2: 'Fragen zum API-Sicherheitstest',
      faq: [
        ['Was ist API Security Testing?', 'API Security Testing untersucht die Schnittstellen, über die Ihre Apps, Partner und Kunden auf Ihre Daten zugreifen: wer sich anmelden darf, wer welche Datensätze sieht und was passiert, wenn jemand Anfragen manipuliert. Dabei verbinden wir die Bewertung der gesamten Schnittstelle mit gezielten Angriffstests an den Schwachstellen, sodass hinter jedem Ergebnis ein funktionierender Proof of Concept steht.'],
        ['Welche Risiken beschreibt die OWASP API Security Top 10?', 'Die Liste nennt die zehn häufigsten Schwachstellen von APIs, angeführt von Broken Object Level Authorization: Ein Angreifer ändert eine ID in der Anfrage und erhält fremde Daten. Dazu kommen unter anderem fehlerhafte Authentifizierung, zu viele preisgegebene Datenfelder, fehlende Rate Limits und der unsichere Umgang mit Drittanbieter-APIs. Unsere Tests gehen jede Kategorie durch und ergänzen die Logikfehler, die nur Ihr Produkt hat.'],
        ['Lässt sich testen, ohne den Produktivbetrieb zu gefährden?', 'Ja. Testkonten, Zeitfenster und Grenzwerte vereinbaren wir vorab, und am liebsten testen wir in einer Staging-Umgebung, die der Produktion entspricht. Tests, die Daten verändern oder löschen könnten, laufen nur dort, wo Sie es schriftlich freigeben.'],
        ['Welche API-Arten und Anmeldeverfahren werden geprüft?', 'Wir prüfen REST- und GraphQL-APIs samt ihrer Authentifizierung: Tokens, Sessions, API-Schlüssel und die Regeln, die festlegen, welcher Nutzer auf welches Objekt zugreifen darf. Schlüssel, die fest in einer Mobile-App stecken, gehören dazu, weil Angreifer sie genauso auslesen; diese Seite deckt das [App Security Audit](/de/app-security-audit/) im Detail ab.'],
        ['Ist das ein API-Audit oder ein Penetrationstest?', 'Beides in einem Auftrag. Der Audit-Teil bewertet Aufbau, Dokumentation und Konfiguration der Schnittstelle, der Test-Teil greift sie so an, wie es ein Außenstehender täte. Ein vollständiger [Penetrationstest](/de/penetration-testing/) umfasst zusätzlich die Anwendungen und die Infrastruktur rund um die API.'],
        ['Was kostet ein API-Sicherheitstest?', 'Der Preis richtet sich nach der Zahl der Endpunkte, Rollen und Umgebungen. Laufende Prüfungen sind in den Tarifen auf der [Seite Zugang](/de/access/) enthalten, ein einzelnes Projekt bekommt ein schriftliches Angebot.'],
      ],
    },
  },
  'cloud-security-assessment': {
    en: {
      title: 'Cloud Security Assessment for AWS and Azure · RFI-IRFOS',
      description: 'Cloud security assessment for AWS and Azure: misconfigurations, vulnerabilities and the external attack surface. Findings verified by people, with fixes.',
      label: 'Cloud Security Assessment',
      h1: 'Cloud Security Assessment for AWS and Azure',
      lead: 'Cloud environments grow faster than anyone reviews them. We assess your AWS and Azure setup for misconfigurations and vulnerabilities, map the external attack surface and show which findings an attacker could actually use.',
      sections: [
        {
          h2: 'What we assess',
          p: ['The assessment covers the parts of a cloud environment that decide your exposure:'],
          ul: ['Misconfigurations in cloud services and access rules.', 'Cloud vulnerabilities in the workloads you run.', 'The external attack surface: what the internet can reach.', 'Infrastructure security, from network paths to hosts.', 'Cloud penetration testing of the paths an attacker would take.'],
        },
        {
          h2: 'How findings are rated',
          p: ['Not every misconfiguration matters. Our engineers follow the path an attacker would take through your environment, rank the consequences and build the fix, so your team starts with the findings that count.'],
        },
        {
          h2: 'What you receive',
          p: ['A written report with evidence, a CVSS severity and fix guidance for each finding. Ongoing coverage is available through the Managed SOC, which includes monitoring around the clock and fixes within 24 hours.'],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show how we document what we find:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Start with the Domain Security Test',
      startText: ['The Domain Security Test examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day.', 'Plans and prices are on the Access page, the agents behind every review on The Squad page.'],
      faqH2: 'Questions about cloud security assessments',
      faq: [
        ['What is the difference between CSPM and CIEM?', 'Cloud security posture management (CSPM) looks for misconfigurations such as public storage buckets, open ports or missing encryption. Cloud infrastructure entitlement management (CIEM) looks at identities and permissions: which user, role or service account may do what, and which rights nobody needs. The assessment covers both, because most cloud breaches combine one misconfiguration with one excessive permission.'],
        ['Which cloud platforms do you cover?', 'AWS and Azure, including hybrid setups where the cloud connects to servers in your own data centre.'],
        ['Do you check Kubernetes and containers?', 'Yes. We review cluster configuration, admission control, workload identities and network policies, scan container images for known vulnerabilities and check what a compromised container could reach.'],
        ['Is this a penetration test or an audit?', 'It combines a configuration audit against benchmarks such as CIS with penetration testing of the paths that matter. Findings come ranked by whether an attacker could actually use them from the outside.'],
        ['What happens after the assessment?', 'Configuration drifts as teams ship. The [Managed SOC](/managed-soc/) monitors the environment around the clock afterwards, and findings that need a code change go to [vulnerability remediation](/vulnerability-remediation/).'],
        ['What does a cloud security assessment cost?', 'The price depends on the number of accounts, subscriptions and clusters. Continuous checks run within the plans on the [Access page](/access/), and a one-off assessment receives a written offer.'],
      ],
    },
    de: {
      title: 'Cloud-Sicherheitsprüfung für AWS und Azure · RFI-IRFOS',
      description: 'Cloud-Sicherheitsprüfung für AWS und Azure: Fehlkonfigurationen, Schwachstellen und externe Angriffsfläche. Befunde von Menschen geprüft, mit Fixes.',
      label: 'Cloud-Sicherheitsprüfung',
      h1: 'Cloud-Sicherheitsprüfung für AWS und Azure',
      lead: 'Cloud-Umgebungen wachsen schneller, als jemand sie prüft. Wir untersuchen Ihr AWS- und Azure-Setup auf Fehlkonfigurationen und Schwachstellen, erfassen die externe Angriffsfläche und zeigen, welche Befunde ein Angreifer tatsächlich nutzen könnte.',
      sections: [
        {
          h2: 'Was wir prüfen',
          p: ['Die Prüfung umfasst die Teile einer Cloud-Umgebung, die Ihre Angreifbarkeit bestimmen:'],
          ul: ['Fehlkonfigurationen in Cloud-Diensten und Zugriffsregeln.', 'Schwachstellen in den Workloads, die Sie betreiben.', 'Die externe Angriffsfläche: was das Internet erreichen kann.', 'Infrastruktursicherheit, von Netzwerkpfaden bis zu Hosts.', 'Cloud-Penetrationstest der Wege, die ein Angreifer nehmen würde.'],
        },
        {
          h2: 'Wie wir Befunde bewerten',
          p: ['Nicht jede Fehlkonfiguration zählt. Unsere Ingenieure verfolgen den Weg, den ein Angreifer durch Ihre Umgebung nähme, und ordnen die Folgen ein. Ihr Team beginnt so mit den Befunden, die wirklich zählen.'],
        },
        {
          h2: 'Was Sie erhalten',
          p: ['Einen schriftlichen Bericht mit Belegen, einer CVSS-Bewertung und Hinweisen zur Behebung je Befund. Laufende Abdeckung bietet das Managed SOC mit Überwachung rund um die Uhr und Fixes binnen 24 Stunden.'],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen, wie wir unsere Funde dokumentieren:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Starten Sie mit dem Domain Security Test',
      startText: ['Der Domain Security Test untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.', 'Pläne und Preise stehen auf der Seite Zugang, die Agenten hinter jeder Prüfung auf der Seite The Squad.'],
      faqH2: 'Fragen zur Cloud-Sicherheitsprüfung',
      faq: [
        ['Was unterscheidet CSPM von CIEM?', 'Cloud Security Posture Management (CSPM) sucht Fehlkonfigurationen wie öffentliche Speicher-Buckets, offene Ports oder fehlende Verschlüsselung. Cloud Infrastructure Entitlement Management (CIEM) betrachtet Identitäten und Berechtigungen: welcher Nutzer, welche Rolle oder welches Dienstkonto was darf und welche Rechte niemand braucht. Das Assessment deckt beides ab, weil die meisten Cloud-Vorfälle eine Fehlkonfiguration mit einer zu weiten Berechtigung verbinden.'],
        ['Welche Cloud-Plattformen werden geprüft?', 'AWS und Azure, einschließlich hybrider Umgebungen, in denen die Cloud mit Servern im eigenen Rechenzentrum verbunden ist.'],
        ['Gehören Kubernetes und Container dazu?', 'Ja. Wir prüfen Cluster-Konfiguration, Admission Control, Workload-Identitäten und Network Policies, scannen Container-Images auf bekannte Schwachstellen und untersuchen, was ein kompromittierter Container erreichen könnte.'],
        ['Ist das ein Penetrationstest oder ein Audit?', 'Es verbindet ein Konfigurations-Audit nach Benchmarks wie CIS mit Penetrationstests auf den entscheidenden Wegen. Die Funde sind danach gereiht, ob ein Angreifer sie von außen tatsächlich nutzen könnte.'],
        ['Wie geht es nach dem Assessment weiter?', 'Konfigurationen verändern sich mit jedem Release. Danach überwacht das [Managed SOC](/de/managed-soc/) die Umgebung rund um die Uhr, und Funde, die eine Codeänderung brauchen, gehen in die [Schwachstellenbehebung](/de/vulnerability-remediation/).'],
        ['Was kostet ein Cloud Security Assessment?', 'Der Preis hängt von der Zahl der Konten, Subscriptions und Cluster ab. Laufende Prüfungen sind in den Tarifen auf der [Seite Zugang](/de/access/) enthalten, ein einmaliges Assessment bekommt ein schriftliches Angebot.'],
      ],
    },
  },
  'secure-code-review': {
    en: {
      title: 'Secure Code Review and Source Code Analysis · RFI-IRFOS',
      description: 'Secure code review that starts where scanners stop: tool output as raw material, agent-led attack-path analysis and fixes engineered into the code of web, mobile and backend software.',
      label: 'Secure Code Review',
      h1: 'Secure Code Review and Source Code Vulnerability Analysis',
      lead: 'Scanners match known patterns, while attackers follow paths through the whole application. Our review runs the established analysis tools as its first layer, traces every candidate across code, libraries and configuration with our agents and engineers the fix into the code, working from your source or, when no source is available, from the shipped build.',
      sections: [
        {
          h2: 'Three layers, one investigation',
          p: ['Each layer builds on the output of the one before:'],
          ul: [
            'Tools: Semgrep with our own rule set for static analysis, Trivy for known CVEs and misconfigurations, Gitleaks for secrets and, for shipped builds, APKTool, JADX, Ghidra, Frida and TruffleHog. Their output is the raw material.',
            'Agents and the NYX knowledge graph: every candidate is mapped to CWE, CAPEC and MITRE ATT&CK, followed across components and tested for reachability until it becomes a concrete attack path with a proof of concept or drops out.',
            'Engineers: they rate the risk for your business, write the fix into the affected code and retest it once your team has applied it.',
          ],
        },
        {
          h2: 'What we analyze',
          p: ['The review follows the code and what it does at runtime:'],
          ul: ['Source code of web, mobile and backend software.', 'Shipped builds, decompiled where needed, for hardcoded keys and credentials.', 'Third-party libraries and SDKs with their versions.', 'Authentication, authorization and cryptography in the code.', 'Data flows and trust boundaries.'],
        },
        {
          h2: 'What you receive',
          p: ['A written report with the evidence, the attack path, a CVSS severity and fix guidance for every finding, down to the affected code. From the Growth plan we engineer the fix itself and retest it. The report is technical evidence, not a certificate.'],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show how we document what we find:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Start with the Domain Security Test',
      startText: ['The Domain Security Test examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day.', 'Plans and prices are on the Access page, the agents behind every review on The Squad page.'],
      faqH2: 'Questions about secure code review',
      faq: [
        ['How does this compare with Semgrep, CodeQL or Snyk?', 'Semgrep runs inside our review as part of the first layer, and alerts you already hold from CodeQL, GitHub code scanning or Snyk can be sent along as an export. That output is where our investigation begins: agents follow each alert through the application, link it with other weaknesses into attack paths and test whether an attacker can actually reach it. A single rule match thereby becomes a demonstrated attack path with its fix, while alerts that lead nowhere close before they cost your team any time.'],
        ['What do you find that a scanner misses?', 'Weaknesses that only show in context: a third-party SDK that sends user data to a server abroad, a security configuration that is present yet protects nothing, or an authorization check that holds on one route and is missing on the next. Finding these means following data and permissions across the whole application, which is the work of the second layer. The reports below document such cases from shipped apps.'],
        ['We already use GitHub Advanced Security. Is a review still worth it?', 'Yes, above all when alerts pile up faster than your team can close them. We take your existing alerts as input, separate the reachable ones from the noise and deliver fixes for those that matter. Your checks on each pull request stay in place, and our review covers what lies beyond a single change: flows between services, libraries and the shipped build.'],
        ['Why combine so many tools when scanners already exist?', 'Every analysis engine sees the code from its own angle and has its own blind spots. We therefore run many open-source and specialised tools side by side, merge their duplicates and let our agents connect what each tool only sees in isolation: a leaked key from one, an outdated library from another and a missing permission check from a third combine into one attack path. A single scanner, however good, delivers one of these views.'],
        ['Can we add our own rules and policies?', 'Yes. You can store your own checks, such as Semgrep rules for in-house frameworks, together with policies that define which severity counts as urgent for you. They run in every review alongside ours, and their findings go through the same analysis and fix process.'],
        ['What is the difference between SAST and SCA?', 'Static application security testing (SAST) reads your own code and finds weaknesses such as injection, unsafe deserialisation or broken access checks. Software composition analysis (SCA) checks the open-source libraries you depend on for known vulnerabilities and license risks. Both are part of the first layer of our review, together with secrets detection for keys and passwords in the code.'],
        ['Can the review run alongside our CI/CD pipeline?', 'Yes. From the Growth plan, checks run on your cadence, up to every 15 minutes, new findings appear in the portal and fixes arrive as a patch file that applies with git apply on any Git host. That makes security a fixed part of a secure SDLC, release after release.'],
        ['Do you need our source code?', 'We work with the material you send. A shipped build is enough for many findings, and source code allows a deeper review including data flow and taint analysis across the whole application.'],
        ['Which languages do you cover?', 'Python, Rust, Go, Java, JavaScript, TypeScript and the mobile stacks for Android and iOS.'],
        ['What is ASPM, and do we need it?', 'Application security posture management (ASPM) collects the findings of every test, from code review to penetration test, in one place, removes duplicates and ranks them by risk. The customer portal does this for you: one remediation board per application, with the status of every finding and its fix.'],
        ['Do you write the fix as well?', 'Yes, from the Growth plan. Our engineers write the fix into the affected code, explain the change and confirm it with a retest, and your team reviews and merges it like any other change. Starter includes fix guidance for every finding, as the [Access page](/access/) shows.'],
        ['How much work stays with our team?', 'Three steps: grant read access to the repository or send the build, review the patch and merge it. Triage, reproduction, attack-path analysis, the fix and the retest sit with us, and the remediation board shows at any time where each finding stands. AI fix suggestions such as Copilot Autofix leave review and testing with your developers, whereas our patches arrive together with the retest that proves them.'],
      ],
    },
    de: {
      title: 'Secure Code Review und Quellcode-Analyse · RFI-IRFOS',
      description: 'Secure Code Review, das dort ansetzt, wo Scanner aufhören: Werkzeugausgabe als Rohmaterial, Angriffspfad-Analyse durch Agenten und Fixes direkt im Code von Web-, Mobil- und Backend-Software.',
      label: 'Secure Code Review',
      h1: 'Secure Code Review und Quellcode-Schwachstellenanalyse',
      lead: 'Scanner erkennen bekannte Muster, Angreifer dagegen folgen Wegen durch die gesamte Anwendung. Unsere Prüfung setzt die etablierten Analysewerkzeuge als erste Schicht ein, verfolgt jeden Kandidaten mit unseren Agenten über Code, Bibliotheken und Konfiguration hinweg und entwickelt den Fix direkt im Code, ausgehend von Ihrem Quellcode oder, falls keiner vorliegt, vom ausgelieferten Build.',
      sections: [
        {
          h2: 'Drei Schichten, eine Untersuchung',
          p: ['Jede Schicht baut auf dem Ergebnis der vorherigen auf:'],
          ul: [
            'Werkzeuge: Semgrep mit unserem eigenen Regelwerk für die statische Analyse, Trivy für bekannte CVEs und Fehlkonfigurationen, Gitleaks für Geheimnisse im Code und für ausgelieferte Builds APKTool, JADX, Ghidra, Frida und TruffleHog. Ihre Ausgabe ist das Rohmaterial.',
            'Agenten und der Wissensgraph NYX: Jeder Kandidat wird CWE, CAPEC und MITRE ATT&CK zugeordnet, über Komponenten hinweg verfolgt und auf Erreichbarkeit getestet, bis daraus ein konkreter Angriffspfad mit Proof of Concept wird oder er ausscheidet.',
            'Engineers: Sie bewerten das Risiko für Ihr Geschäft, schreiben den Fix in den betroffenen Code und testen ihn erneut, sobald Ihr Team ihn eingespielt hat.',
          ],
        },
        {
          h2: 'Was wir analysieren',
          p: ['Die Prüfung folgt dem Code und dem, was er zur Laufzeit tut:'],
          ul: ['Quellcode von Web-, Mobil- und Backend-Software.', 'Ausgelieferte Builds, bei Bedarf dekompiliert, auf hartkodierte Schlüssel und Zugangsdaten.', 'Drittanbieter-Bibliotheken und SDKs mit ihren Versionen.', 'Authentifizierung, Autorisierung und Kryptografie im Code.', 'Datenflüsse und Vertrauensgrenzen.'],
        },
        {
          h2: 'Was Sie erhalten',
          p: ['Einen schriftlichen Bericht mit Belegen, Angriffspfad, CVSS-Bewertung und Anleitung zur Behebung für jeden Befund, bis in den betroffenen Code. Ab dem Growth-Plan entwickeln wir den Fix selbst und prüfen ihn erneut. Der Bericht ist ein technischer Beleg und kein Zertifikat.'],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen, wie wir unsere Funde dokumentieren:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Starten Sie mit dem Domain Security Test',
      startText: ['Der Domain Security Test untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.', 'Pläne und Preise stehen auf der Seite Zugang, die Agenten hinter jeder Prüfung auf der Seite The Squad.'],
      faqH2: 'Fragen zum Secure Code Review',
      faq: [
        ['Wie verhält sich das zu Semgrep, CodeQL oder Snyk?', 'Semgrep läuft in unserer Prüfung als Teil der ersten Schicht, und Meldungen, die Sie bereits aus CodeQL, GitHub Code Scanning oder Snyk haben, können Sie als Export mitschicken. Diese Ausgabe ist der Ausgangspunkt der Untersuchung: Agenten verfolgen jede Meldung durch die Anwendung, verknüpfen sie mit weiteren Schwächen zu Angriffspfaden und testen, ob ein Angreifer sie tatsächlich erreicht. Aus einem einzelnen Regeltreffer wird so ein nachgewiesener Angriffspfad samt Fix, während Meldungen ohne Folgen geschlossen werden, bevor sie Ihr Team Zeit kosten.'],
        ['Was findet ihr, das ein Scanner übersieht?', 'Schwächen, die erst im Zusammenhang sichtbar werden: ein Drittanbieter-SDK, das Nutzerdaten an einen Server im Ausland sendet, eine Sicherheitskonfiguration, die vorhanden ist und trotzdem nichts schützt, oder eine Berechtigungsprüfung, die auf einer Route greift und auf der nächsten fehlt. Um sie zu finden, verfolgt die zweite Schicht Daten und Berechtigungen durch die gesamte Anwendung. Die Berichte weiter unten dokumentieren solche Fälle aus ausgelieferten Apps.'],
        ['Wir nutzen bereits GitHub Advanced Security. Lohnt sich die Prüfung trotzdem?', 'Ja, vor allem wenn Meldungen schneller auflaufen, als Ihr Team sie schließen kann. Wir übernehmen Ihre vorhandenen Meldungen als Eingabe, trennen die erreichbaren vom Rauschen und liefern Fixes für jene, die zählen. Ihre Prüfungen an jedem Pull Request bleiben bestehen, und unsere Prüfung deckt ab, was über eine einzelne Änderung hinausreicht: Flüsse zwischen Diensten, Bibliotheken und den ausgelieferten Build.'],
        ['Warum so viele Werkzeuge kombinieren, wenn es doch Scanner gibt?', 'Jede Analyse-Engine betrachtet den Code aus ihrem eigenen Blickwinkel und hat eigene blinde Flecken. Deshalb lassen wir zahlreiche Open-Source- und Spezialwerkzeuge nebeneinander laufen, führen ihre Doppelungen zusammen und lassen unsere Agenten verbinden, was jedes Werkzeug nur für sich sieht: Ein offengelegter Schlüssel aus dem einen, eine veraltete Bibliothek aus dem zweiten und eine fehlende Berechtigungsprüfung aus dem dritten ergeben zusammen einen Angriffspfad. Ein einzelner Scanner, so gut er sein mag, liefert davon eine Sicht.'],
        ['Können wir eigene Prüfregeln und Richtlinien hinterlegen?', 'Ja. Sie hinterlegen eigene Prüfungen, etwa Semgrep-Regeln für hauseigene Frameworks, sowie Richtlinien, ab welchem Schweregrad ein Fund für Sie dringend ist. Diese laufen bei jeder Prüfung neben unseren mit, und ihre Funde durchlaufen dieselbe Analyse und Behebung.'],
        ['Was ist der Unterschied zwischen SAST und SCA?', 'Static Application Security Testing (SAST) liest Ihren eigenen Code und findet Schwachstellen wie Injection, unsichere Deserialisierung oder fehlerhafte Zugriffsprüfungen. Software Composition Analysis (SCA) prüft die Open-Source-Bibliotheken, von denen Sie abhängen, auf bekannte Schwachstellen und Lizenzrisiken. Beides gehört zur ersten Schicht unserer Prüfung, ergänzt um Secrets Detection für Schlüssel und Passwörter im Code.'],
        ['Lässt sich die Prüfung neben unserer CI/CD-Pipeline betreiben?', 'Ja. Ab dem Growth-Plan laufen die Prüfungen in Ihrem Takt, bis zu alle 15 Minuten, neue Funde erscheinen im Portal, und Behebungen kommen als Patch-Datei, die sich mit git apply auf jedem Git-Host einspielen lässt. So wird Sicherheit fester Teil eines Secure SDLC und begleitet jedes Release.'],
        ['Ist der Quellcode Voraussetzung?', 'Wir arbeiten mit dem Material, das Sie schicken. Für viele Funde reicht ein ausgelieferter Build, der Quellcode erlaubt eine tiefere Prüfung einschließlich Datenfluss- und Taint-Analyse über die gesamte Anwendung.'],
        ['Welche Programmiersprachen deckt die Prüfung ab?', 'Python, Rust, Go, Java, JavaScript, TypeScript sowie die Mobile-Stacks für Android und iOS.'],
        ['Was ist ASPM, und brauchen wir das?', 'Application Security Posture Management (ASPM) sammelt die Funde aller Prüfungen, von der Code Review bis zum Penetrationstest, an einem Ort, entfernt Doppelungen und ordnet sie nach Risiko. Das Kundenportal übernimmt das für Sie: ein Remediation-Board pro Anwendung mit dem Stand jedes Fundes und seiner Behebung.'],
        ['Wer schreibt die Behebung?', 'Ab dem Growth-Plan schreiben unsere Engineers die Behebung direkt in den betroffenen Code, erklären die Änderung und bestätigen sie mit einem Retest, und Ihr Team prüft und übernimmt sie wie jede andere Änderung. Im Starter-Plan erhalten Sie zu jedem Befund eine Anleitung zur Behebung, wie die [Seite Zugang](/de/access/) zeigt.'],
        ['Wie viel Arbeit bleibt bei unserem Team?', 'Drei Schritte: Lesezugriff auf das Repository geben oder den Build schicken, den Patch ansehen und ihn übernehmen. Triage, Reproduktion, Angriffspfad-Analyse, Fix und Retest liegen bei uns, und das Remediation-Board zeigt jederzeit, wo jeder Befund steht. KI-Fixvorschläge wie Copilot Autofix überlassen Prüfung und Test Ihren Entwicklern, unsere Patches hingegen kommen gemeinsam mit dem Retest, der sie belegt.'],
      ],
    },
  },
  // Remediation page (Simeon 20.11.): for buyers who already hold findings and lack the hands to fix them; the 43 days are the Verizon DBIR 2026.
  'vulnerability-remediation': {
    en: {
      title: 'Vulnerability Remediation Service · Fix Faster · RFI-IRFOS',
      description: 'Vulnerability remediation from Graz: we turn scanner, pentest and audit findings into verified fixes down to the code, tracked on your remediation board.',
      label: 'Vulnerability Remediation',
      h1: 'Vulnerability Remediation, from Open Finding to Verified Fix',
      lead: 'Attackers now exploit critical flaws within hours of disclosure, while the median time to fully remediate known exploited vulnerabilities rose from 32 to 43 days according to the Verizon Data Breach Investigations Report 2026. We close that gap: our team takes on your open findings, engineers the fix down to the affected code and retests it until the weakness is gone.',
      sections: [
        {
          h2: 'Which findings we take on',
          p: ['You bring the backlog, whichever tool or team produced it:'],
          ul: ['Findings from your own scanners, static analysis and dependency checks.', 'Reports from earlier penetration tests and external audits.', 'Third-party libraries and SDKs with known CVEs.', 'Misconfigurations in cloud environments, APIs and authentication.', 'Findings from our own investigations with The Squad.'],
        },
        {
          h2: 'How a fix comes together',
          p: ['Our agents reproduce each finding and trace where it sits in your code. Specialists then confirm whether it can be exploited, rate its risk for your business and write the change, ready to apply where possible. Your engineers review it before it ships, and once it is live we retest it.'],
        },
        {
          h2: 'Every step stays traceable',
          p: ['Each fix runs as a task on the remediation board in your customer portal, moving through Open, Triaged, In Progress, Resolved and Canceled. The history of findings and fixes stays there, ready for your next audit or customer questionnaire.'],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show how we document what we find:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Start with the Domain Security Test',
      startText: ['The Domain Security Test examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day.', 'Plans and prices are on the Access page, the agents behind every review on The Squad page.'],
      faqH2: 'Questions about vulnerability remediation',
      faq: [
        ['How do you prioritise vulnerabilities?', 'By the risk to your business. We combine the CVSS severity with EPSS, the probability of exploitation within the next 30 days, and with the KEV catalogue of vulnerabilities already exploited in the wild. A medium flaw that attackers exploit today therefore moves ahead of a critical one that nobody targets.'],
        ['Do we receive a finished fix or instructions?', 'That depends on the plan. From Starter, every finding comes with fix guidance and patch suggestions, and from Growth our engineers write the fix into your code. The [Access page](/access/) shows the details.'],
        ['How do you confirm that a fix works?', 'After your team applies the change, a retest runs the original proof of concept again. The finding closes once the attack fails, and the closed finding with its retest becomes evidence for your next audit.'],
        ['Can you fix findings that another vendor reported?', 'Yes. Send us the report or the scanner export, and our agents reproduce each finding in your code before we work on it.'],
        ['Do you need access to our code?', 'Read access to the repository is enough for us to write the fix. Your team decides what gets merged.'],
        ['How fast is a fix?', 'With the Managed SOC we fix findings within 24 hours, down to the code. In the other plans the pace follows the scope we agree with you.'],
      ],
    },
    de: {
      title: 'Schwachstellen beheben · Remediation · RFI-IRFOS',
      description: 'Schwachstellen beheben aus Graz: Wir machen aus Scanner-, Pentest- und Audit-Befunden geprüfte Fixes bis in den Code, verfolgt auf Ihrem Remediation-Board.',
      label: 'Schwachstellen beheben',
      h1: 'Schwachstellen beheben, vom offenen Befund zum geprüften Fix',
      lead: 'Angreifer nutzen kritische Lücken heute schon Stunden nach ihrer Veröffentlichung aus, während die mittlere Zeit bis zur vollständigen Behebung bekannter, bereits ausgenutzter Schwachstellen laut Verizon Data Breach Investigations Report 2026 von 32 auf 43 Tage stieg. Diese Lücke schließen wir: Unser Team übernimmt Ihre offenen Befunde, entwickelt den Fix bis in den betroffenen Code und prüft ihn erneut, bis die Schwäche verschwunden ist.',
      sections: [
        {
          h2: 'Welche Befunde wir übernehmen',
          p: ['Sie bringen den Rückstand mit, egal welches Werkzeug oder Team ihn erzeugt hat:'],
          ul: ['Befunde aus Ihren eigenen Scannern, statischer Analyse und Abhängigkeitsprüfungen.', 'Berichte aus früheren Penetrationstests und externen Audits.', 'Drittanbieter-Bibliotheken und SDKs mit bekannten CVEs.', 'Fehlkonfigurationen in Cloud-Umgebungen, APIs und Authentifizierung.', 'Befunde aus unseren eigenen Untersuchungen mit The Squad.'],
        },
        {
          h2: 'Wie ein Fix entsteht',
          p: ['Unsere Agenten reproduzieren jeden Befund und verfolgen, wo er in Ihrem Code sitzt. Ingenieure bestätigen anschließend, ob er sich ausnutzen lässt, bewerten sein Risiko für Ihr Geschäft und schreiben die Änderung, wo möglich direkt anwendbar. Ihre Entwickler prüfen sie vor der Auslieferung, und sobald sie live ist, testen wir sie erneut.'],
        },
        {
          h2: 'Jeder Schritt bleibt nachvollziehbar',
          p: ['Jeder Fix läuft als Aufgabe auf dem Remediation-Board in Ihrem Kundenportal und durchläuft die Zustände Open, Triaged, In Progress, Resolved und Canceled. Die Geschichte von Befunden und Fixes bleibt dort erhalten, bereit für Ihr nächstes Audit oder den nächsten Kundenfragebogen.'],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen, wie wir unsere Funde dokumentieren:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Starten Sie mit dem Domain Security Test',
      startText: ['Der Domain Security Test untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.', 'Pläne und Preise stehen auf der Seite Zugang, die Agenten hinter jeder Prüfung auf der Seite The Squad.'],
      faqH2: 'Fragen zur Behebung von Schwachstellen',
      faq: [
        ['Wie priorisieren Sie Schwachstellen?', 'Nach dem Risiko für Ihr Geschäft. Wir verbinden den Schweregrad nach CVSS mit EPSS, der Wahrscheinlichkeit einer Ausnutzung in den nächsten 30 Tagen, und mit dem KEV-Katalog bereits aktiv ausgenutzter Schwachstellen. Eine mittlere Lücke, die Angreifer heute nutzen, rückt deshalb vor eine kritische, auf die es niemand abgesehen hat.'],
        ['Bekommen wir einen fertigen Fix oder eine Anleitung?', 'Das hängt vom Tarif ab. Ab Starter kommt jeder Fund mit einer Anleitung zur Behebung und Vorschlägen für den Patch, ab Growth schreiben unsere Engineers den Fix direkt in Ihren Code. Die Einzelheiten stehen auf der [Seite Zugang](/de/access/).'],
        ['Wie wird bestätigt, dass ein Fix wirkt?', 'Sobald Ihr Team die Änderung eingespielt hat, führt ein Retest den ursprünglichen Proof of Concept erneut aus. Der Fund schließt, wenn der Angriff scheitert, und der geschlossene Fund samt Retest dient als Nachweis für Ihr nächstes Audit.'],
        ['Beheben Sie auch Befunde, die ein anderer Anbieter gemeldet hat?', 'Ja. Schicken Sie uns den Bericht oder den Scanner-Export, und unsere Agenten reproduzieren jeden Befund in Ihrem Code, bevor wir daran arbeiten.'],
        ['Brauchen Sie Zugriff auf unseren Code?', 'Lesezugriff auf das Repository genügt, damit wir den Fix schreiben. Ihr Team entscheidet, was gemergt wird.'],
        ['Wie schnell kommt ein Fix?', 'Mit dem Managed SOC beheben wir Befunde binnen 24 Stunden, bis in den Code. In den anderen Plänen richtet sich das Tempo nach dem Umfang, den wir mit Ihnen vereinbaren.'],
      ],
    },
  },
  // Graz-Sichtbarkeit (Simeon 21.11.2026): eigene Seiten für „IT-Sicherheit Graz“ und
  // „NIS2-Beratung Steiermark“, Ziel der Google-Ads-Gruppen „Graz DE“. Ausnahme von der
  // Preisregel oben: beide Seiten nennen den Starter-Preis (99 €), weil die Anzeigen ihn versprechen.
  // Quelle Preis: de.ts/en.ts pricing; NISG-Daten: BGBl. I Nr. 94/2025 (in Kraft 1.10.2026, § 29 Registrierung binnen drei Monaten).
  'it-security-graz': {
    en: {
      title: 'IT Security Graz: Pentest, NIS2, Managed SOC · RFI-IRFOS',
      description: 'IT security from Graz for companies in Styria: penetration testing, NIS2 implementation and a managed SOC around the clock. Plans start at €99 a month.',
      label: 'IT Security Graz',
      h1: 'IT security from Graz for companies in Styria',
      lead: 'Companies in Graz and across Styria bring us the security work they lack the time or the people for in house. It ranges from a single penetration test and preparation for Austria\'s NISG 2026 to a managed SOC that watches your systems day and night.',
      sections: [
        {
          h2: 'Services for companies in the region',
          p: ['Each service has its own page with scope, process and questions. An overview:'],
          ul: [
            'Penetration testing for web apps, mobile apps, APIs and cloud, every finding backed by a proof of concept.',
            'NIS2 consulting: clarify whether the law applies, prepare the registration and evidence the Art. 21 measures on your systems.',
            'Managed SOC with monitoring around the clock, response within one hour and a fix within 24 hours.',
            'Compliance automation for NIS2, ISO 27001 and SOC 2.',
            'Domain Security Test as a first outside look at DNS, TLS and email.',
          ],
        },
        {
          h2: 'Plans from €99 a month',
          p: ['The Starter plan costs €99 a month. It covers one focused vulnerability hunt per month for a web app, mobile app or API, a working proof of concept for every finding and a retest of fixed findings, along with the customer portal including its compliance workspace and your public Trust Center. Growth, Pro and Business cover larger scopes.'],
        },
      ],
      evidenceH2: 'Evidence from audited software',
      evidenceIntro: 'The public ledger lists {apps}+ audited apps and {critical}+ critical findings. These full reports show how we document what we find:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'A Chinese push SDK in a field-service app, and Firebase keys hardcoded across five apps.' },
        { slug: 'nike', label: 'Nike', note: 'Development and production push credentials hardcoded in the shipped build.' },
        { slug: 'strava', label: 'Strava', note: 'A hardcoded key and a security configuration that protects nothing.' },
        { slug: 'revolut', label: 'Revolut', note: 'The largest third-party SDK in the series and what it sends to a US company.' },
      ],
      startH2: 'Start with the Domain Security Test',
      startText: ['The Domain Security Test examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day.'],
      faqH2: 'Questions about IT security in Graz',
      faq: [
        ['Where is our data stored?', 'On our own server in Graz. Each customer has their own instance, stored encrypted and backed up daily to a second storage medium in Graz. Language models that work on customer tasks run on European endpoints only, and your data trains none of them.'],
        ['Can we meet you in person?', 'Yes. Our team works in Graz, and a first meeting with us or at your premises in Styria is easy to arrange. The reviews themselves run remotely.'],
        ['Do you only work for companies in Graz?', 'Graz is our home, and we serve companies across Austria and the German-speaking region. Reviews run remotely, so distance makes no difference to the process.'],
        ['We have no security staff of our own. Can you still help?', 'That is exactly what the offer is built for. We take over testing and remediation, and with the managed SOC a dedicated team acts as your security department.'],
        ['What does it cost to start?', 'The Starter plan costs €99 a month. Larger penetration tests and the managed SOC are priced by scope and offered in writing.'],
        ['Does NIS2 apply to us?', 'That depends on sector, size and your role in a supply chain. The [NIS2 consulting](/nis2-consulting/) page explains how we work that out with you.'],
      ],
    },
    de: {
      title: 'IT-Sicherheit Graz: Pentest, NIS2 und SOC · RFI-IRFOS',
      description: 'IT-Sicherheit aus Graz für Unternehmen in der Steiermark: Penetrationstest, NIS2-Umsetzung und Managed SOC rund um die Uhr. Pläne ab 99 € im Monat.',
      label: 'IT-Sicherheit Graz',
      h1: 'IT-Sicherheit aus Graz für Unternehmen in der Steiermark',
      lead: 'Unternehmen in Graz und der ganzen Steiermark holen sich bei uns die Sicherheitsarbeit, für die intern Zeit oder Fachleute fehlen. Das reicht vom einzelnen Penetrationstest über die Vorbereitung auf das NISG 2026 bis zum Managed SOC, das Ihre Systeme Tag und Nacht überwacht.',
      sections: [
        {
          h2: 'Leistungen für Unternehmen in der Region',
          p: ['Jede Leistung hat eine eigene Seite mit Umfang, Ablauf und Fragen. Im Überblick:'],
          ul: [
            'Penetrationstest für Webanwendungen, mobile Apps, APIs und Cloud, jeder Befund mit Proof of Concept belegt.',
            'NIS2-Beratung: Betroffenheit klären, Registrierung vorbereiten und die Maßnahmen nach Art. 21 an Ihren Systemen belegen.',
            'Managed SOC mit Überwachung rund um die Uhr, Reaktion binnen einer Stunde und Fix binnen 24 Stunden.',
            'Compliance-Automatisierung für NIS2, ISO 27001 und SOC 2.',
            'Domain Security Test als erster Blick von außen auf DNS, TLS und E-Mail.',
          ],
        },
        {
          h2: 'Pläne ab 99 € im Monat',
          p: ['Der Plan Starter kostet 99 € im Monat. Er umfasst eine fokussierte Schwachstellenjagd pro Monat für eine Web-App, mobile App oder API, einen funktionierenden Proof of Concept zu jedem Befund und den Retest behobener Befunde, dazu das Kundenportal mit Compliance-Arbeitsbereich und Ihrem öffentlichen Trust Center. Größere Umfänge decken die Pläne Growth, Pro und Business ab.'],
        },
      ],
      evidenceH2: 'Belege aus geprüfter Software',
      evidenceIntro: 'Das öffentliche Verzeichnis führt {apps}+ geprüfte Apps und {critical}+ kritische Befunde. Diese vollständigen Berichte zeigen, wie wir unsere Funde dokumentieren:',
      evidence: [
        { slug: 'sap', label: 'SAP', note: 'Ein chinesisches Push-SDK in einer Außendienst-App und hartkodierte Firebase-Schlüssel in fünf Apps.' },
        { slug: 'nike', label: 'Nike', note: 'Entwicklungs- und Produktiv-Push-Zugangsdaten hartkodiert im ausgelieferten Build.' },
        { slug: 'strava', label: 'Strava', note: 'Ein hartkodierter Schlüssel und eine Sicherheitskonfiguration, die nichts schützt.' },
        { slug: 'revolut', label: 'Revolut', note: 'Das größte Drittanbieter-SDK der Serie und was es an ein US-Unternehmen sendet.' },
      ],
      startH2: 'Starten Sie mit dem Domain Security Test',
      startText: ['Der Domain Security Test untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.'],
      faqH2: 'Fragen zur IT-Sicherheit in Graz',
      faq: [
        ['Wo liegen unsere Daten?', 'Auf unserem eigenen Server in Graz. Jeder Kunde hat eine eigene Instanz, verschlüsselt gespeichert und täglich auf einem zweiten Datenträger in Graz gesichert. Sprachmodelle, die an Kundenaufgaben arbeiten, laufen ausschließlich über europäische Endpunkte, und Ihre Daten trainieren keines davon.'],
        ['Können wir Sie persönlich treffen?', 'Ja. Unser Team arbeitet in Graz, und ein erstes Treffen bei uns oder in Ihrem Unternehmen in der Steiermark lässt sich unkompliziert vereinbaren. Die Prüfungen selbst laufen aus der Ferne.'],
        ['Arbeiten Sie nur für Unternehmen in Graz?', 'Graz ist unser Sitz, und wir betreuen Unternehmen in ganz Österreich und im deutschsprachigen Raum. Prüfungen laufen aus der Ferne, daher spielt die Entfernung für den Ablauf keine Rolle.'],
        ['Wir haben keine eigenen Sicherheitsleute. Können Sie trotzdem helfen?', 'Genau dafür ist das Angebot gebaut. Wir übernehmen Prüfung und Behebung, und mit dem Managed SOC arbeitet ein festes Team als Ihre Sicherheitsabteilung.'],
        ['Was kostet der Einstieg?', 'Der Plan Starter kostet 99 € im Monat. Größere Penetrationstests und das Managed SOC bieten wir nach Umfang schriftlich an.'],
        ['Betrifft uns NIS2?', 'Das hängt von Branche, Größe und Ihrer Rolle in einer Lieferkette ab. Die Seite zur [NIS2-Beratung](/de/nis2-consulting/) erklärt, wie wir das gemeinsam mit Ihnen klären.'],
      ],
    },
  },
  'nis2-consulting': {
    en: {
      title: 'NIS2 Consulting Austria: NISG 2026 in Practice · RFI-IRFOS',
      description: 'NIS2 consulting from Graz: we clarify whether the NISG 2026 applies, prepare the registration and evidence the required measures on your systems.',
      label: 'NIS2 Consulting',
      h1: 'NIS2 consulting in Styria: putting the NISG 2026 into practice',
      lead: 'Austria\'s NISG 2026 has applied since 1 October 2026. Entities in scope must register within three months, so by the end of 2026, demonstrate state-of-the-art risk management and report incidents on time. We guide companies from Graz and across Styria from the question of whether the law applies to them all the way to the evidence an inspection asks for.',
      sections: [
        {
          h2: 'Does the law apply to you?',
          p: [
            'Sector, size and role in a supply chain decide whether an entity is in scope. Around 4,000 entities in Austria are directly affected, and an estimated 50,000 supply-chain partners feel the requirements through their customers.',
            'The authority\'s information at nis.gv.at remains the reference, and you settle applicability together with your legal counsel. We supply the technical facts that decision rests on.',
          ],
        },
        {
          h2: 'From obligation to measure',
          p: ['Under § 31 NISG 2026 management carries personal liability, which is why every measure needs evidence behind it. We map the obligations to your systems:'],
          ul: [
            'Inventory: which systems, applications and suppliers your operation depends on.',
            'Risk management: find and prioritise vulnerabilities in applications, cloud and the external attack surface.',
            'Cryptography and access control: keys, TLS configuration and permissions.',
            'Supply chain: third-party dependencies and SDKs with their versions.',
            'Incident reporting: monitoring and response set up so the Art. 23 deadlines stay achievable.',
          ],
        },
        {
          h2: 'What you receive',
          p: ['A written report with evidence for your risk-management documentation and, from the Growth plan, concrete fixes engineered down to the affected code. The evidence sits in the compliance workspace of the customer portal, where your auditor can read it, and on request the managed SOC takes over continuous monitoring.'],
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
      startH2: 'Start with the Domain Security Test',
      startText: ['The Domain Security Test examines one domain from the outside: read-only, from a European IP address, with no login and no payloads. A researcher reviews your request and replies within one business day.'],
      faqH2: 'Questions about NIS2 consulting',
      faq: [
        ['Does NIS2 apply to our company?', 'That depends on sector, size and your role in supply chains, so the applicability assessment comes first. We work through the criteria of the NISG 2026 with you and document the result, with the information of the authority at nis.gv.at as the reference.'],
        ['What does NIS2 require of the management?', 'Management approves the risk-management measures, oversees their implementation and is liable for them, and its members have to attend training. We help you assign responsibilities, set up a security committee and prepare the evidence that management has met these duties.'],
        ['What does NIS2 require for our supply chain?', 'Article 21 requires entities to address the security of their suppliers and service providers. We assess your key suppliers, define which evidence to request from them and fold their risks into your risk management. Software vendors who receive such requests have [a page of their own](/nis2-software-vendors/).'],
        ['Which reporting deadlines apply?', 'A significant incident requires an early warning within 24 hours, an incident notification within 72 hours and a final report within one month. With the [Managed SOC](/managed-soc/), detection, classification and the documentation for these reports run in one place.'],
        ['Do you certify NIS2 compliance?', 'We deliver a technical report with evidence for your documentation. A certificate is not part of it.'],
        ['What does it cost, and how fast can we start?', 'The Starter plan starts at €99 a month, and setup takes about five minutes, so the first scan can start right after. Comprehensive support is priced by scope and offered in writing.'],
      ],
    },
    de: {
      title: 'NIS2-Beratung Steiermark: NISG 2026 umsetzen · RFI-IRFOS',
      description: 'NIS2-Beratung aus Graz: Wir klären, ob das NISG 2026 Sie betrifft, bereiten die Registrierung vor und belegen die Pflichtmaßnahmen an Ihren Systemen.',
      label: 'NIS2-Beratung',
      h1: 'NIS2-Beratung in der Steiermark: das NISG 2026 umsetzen',
      lead: 'Seit 1. Oktober 2026 gilt in Österreich das NISG 2026. Betroffene Einrichtungen müssen sich binnen drei Monaten registrieren, also bis Ende 2026, Risikomanagement nach dem Stand der Technik nachweisen und Vorfälle fristgerecht melden. Wir begleiten Unternehmen aus Graz und der Steiermark von der Frage, ob das Gesetz sie trifft, bis zu den Belegen, die eine Prüfung verlangt.',
      sections: [
        {
          h2: 'Betrifft Sie das Gesetz?',
          p: [
            'Ob eine Einrichtung darunter fällt, entscheiden Sektor, Größe und Rolle in der Lieferkette. Rund 4.000 Einrichtungen in Österreich sind direkt betroffen, außerdem spüren geschätzt 50.000 Lieferkettenpartner die Anforderungen über ihre Kunden.',
            'Die Informationen der Behörde unter nis.gv.at bleiben die Referenz, und über die Anwendbarkeit entscheiden Sie gemeinsam mit Ihrer Rechtsvertretung. Wir liefern die technischen Tatsachen, auf denen diese Entscheidung ruht.',
          ],
        },
        {
          h2: 'Von der Pflicht zur Maßnahme',
          p: ['Nach § 31 NISG 2026 haftet die Geschäftsleitung persönlich, deshalb braucht jede Maßnahme einen Beleg. Wir ordnen die Pflichten Ihren Systemen zu:'],
          ul: [
            'Bestandsaufnahme: welche Systeme, Anwendungen und Lieferanten Ihren Betrieb tragen.',
            'Risikomanagement: Schwachstellen in Anwendungen, Cloud und externer Angriffsfläche finden und priorisieren.',
            'Kryptografie und Zugriffskontrolle: Schlüssel, TLS-Konfiguration und Berechtigungen.',
            'Lieferkette: Drittanbieter-Abhängigkeiten und SDKs samt Versionen.',
            'Vorfallsmeldung: Überwachung und Reaktion so aufgestellt, dass die Fristen nach Art. 23 einhaltbar bleiben.',
          ],
        },
        {
          h2: 'Was Sie erhalten',
          p: ['Einen schriftlichen Bericht mit Belegen für Ihre Risikomanagement-Dokumentation und ab dem Plan Growth konkrete Fixes bis in den betroffenen Code. Die Nachweise liegen im Compliance-Arbeitsbereich des Kundenportals, wo Ihre Prüfstelle sie lesen kann, und auf Wunsch übernimmt das Managed SOC die laufende Überwachung.'],
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
      startH2: 'Starten Sie mit dem Domain Security Test',
      startText: ['Der Domain Security Test untersucht eine Domain von außen: ausschließlich lesend, von einer europäischen IP-Adresse aus, ohne Login und ohne Payloads. Ein Researcher sieht Ihre Anfrage durch und meldet sich innerhalb eines Werktags.'],
      faqH2: 'Fragen zur NIS2-Beratung',
      faq: [
        ['Fällt unser Unternehmen unter NIS2?', 'Das hängt von Branche, Größe und Ihrer Rolle in Lieferketten ab, deshalb steht die Prüfung der Betroffenheit am Anfang. Wir gehen die Kriterien des NISG 2026 mit Ihnen durch und dokumentieren das Ergebnis, mit den Informationen der Behörde unter nis.gv.at als Maßstab.'],
        ['Was verlangt NIS2 von der Geschäftsleitung?', 'Die Geschäftsleitung billigt die Maßnahmen des Risikomanagements, überwacht ihre Umsetzung und haftet dafür, zudem müssen ihre Mitglieder an Schulungen teilnehmen. Wir helfen dabei, Zuständigkeiten festzulegen, ein Sicherheitsgremium einzurichten und die Nachweise vorzubereiten, dass die Geschäftsleitung diese Pflichten erfüllt.'],
        ['Was verlangt NIS2 für die Lieferkette?', 'Artikel 21 verpflichtet Einrichtungen, die Sicherheit ihrer Lieferanten und Dienstleister zu berücksichtigen. Wir bewerten Ihre wichtigsten Lieferanten, legen fest, welche Nachweise Sie von ihnen anfordern, und binden ihre Risiken in Ihr Risikomanagement ein. Softwareanbieter, die solche Anfragen erhalten, finden [eine eigene Seite](/de/nis2-software-vendors/).'],
        ['Welche Meldefristen gelten?', 'Ein erheblicher Sicherheitsvorfall verlangt eine Frühwarnung binnen 24 Stunden, eine Meldung binnen 72 Stunden und einen Abschlussbericht binnen eines Monats. Mit dem [Managed SOC](/de/managed-soc/) laufen Erkennung, Einstufung und die Dokumentation für diese Meldungen an einer Stelle zusammen.'],
        ['Zertifizieren Sie die NIS2-Konformität?', 'Wir liefern einen technischen Bericht mit Belegen für Ihre Dokumentation. Ein Zertifikat gehört nicht dazu.'],
        ['Was kostet es, und wie schnell können wir starten?', 'Der Tarif Starter beginnt bei 99 € im Monat, und die Einrichtung dauert rund fünf Minuten, sodass der erste Scan gleich danach starten kann. Eine umfassende Begleitung wird nach Umfang kalkuliert und schriftlich angeboten.'],
      ],
    },
  },
  'ai-llm-security-testing': {
    en: {
      title: 'AI and LLM Security Testing, Prompt Injection · RFI-IRFOS',
      description: 'AI security testing from Graz: prompt injection, RAG security, agent and MCP access, guardrails and hallucination checks, mapped to OWASP LLM Top 10.',
      label: 'AI & LLM Security Testing',
      h1: 'AI and LLM Security Testing for Applications and Agents',
      lead: 'We attack your AI application the way an adversary would, from prompt injection to agents with too many rights, and deliver the fix with every finding.',
      sections: [],
      evidenceH2: '', evidenceIntro: '', evidence: [],
      startH2: '', startText: [],
      faqH2: 'Questions about AI and LLM security testing',
      faq: [
        ['What is prompt injection?', 'Prompt injection smuggles instructions into text a language model reads. In the direct form a user types them into the chat, and in the indirect form they hide in a web page, an e-mail or a document the model processes later. We test both and show which instructions your model follows.'],
        ['How do you secure AI agents?', 'We map every tool an agent may call, the data it reaches and the actions that need a person\'s approval. Then we test what an injected instruction could make the agent do and narrow its permissions to what the task requires.'],
        ['Do you also test MCP servers?', 'Yes. MCP servers decide which tools and data a model reaches, so we check their authentication, the scope of each tool and whether a manipulated answer from one server can steer actions on another.'],
        ['Which frameworks do you map findings to?', 'Every finding is mapped to the OWASP Top 10 for LLM Applications and to MITRE ATLAS. The evidence also supports the requirements of the EU AI Act and management systems under ISO/IEC 42001.'],
        ['Do you test against our live system?', 'Attacks run against a copy of your setup or a staging environment, so production data and customers stay untouched. For agent evaluation we build a private test environment with task suites from your own work.'],
        ['How does this relate to the AI app privacy audit?', 'The [AI app privacy audit](/ai-app-privacy-audit/) follows where an AI app sends conversations and personal data. This page covers the attacks on the model and its agents, and both reviews can run together.'],
      ],
    },
    de: {
      title: 'AI und LLM Security Testing, Prompt Injection · RFI-IRFOS',
      description: 'AI Security Testing aus Graz: Prompt Injection, RAG Security, Agenten- und MCP-Zugriffe, Guardrails und Halluzinationen, zugeordnet zu OWASP LLM Top 10.',
      label: 'AI & LLM Security Testing',
      h1: 'AI und LLM Security Testing für Anwendungen und Agenten',
      lead: 'Wir greifen Ihre KI-Anwendung so an, wie es ein Angreifer täte, von der Prompt Injection bis zum Agenten mit zu weiten Rechten, und liefern zu jedem Befund die Behebung.',
      sections: [],
      evidenceH2: '', evidenceIntro: '', evidence: [],
      startH2: '', startText: [],
      faqH2: 'Fragen zu AI und LLM Security Testing',
      faq: [
        ['Was ist Prompt Injection?', 'Bei einer Prompt Injection gelangen Anweisungen in einen Text, den ein Sprachmodell liest. Direkt tippt sie ein Nutzer in den Chat, indirekt stecken sie in einer Webseite, einer E-Mail oder einem Dokument, das das Modell später verarbeitet. Wir testen beide Formen und zeigen, welchen Anweisungen Ihr Modell folgt.'],
        ['Wie sichern Sie KI-Agenten ab?', 'Wir erfassen jedes Werkzeug, das ein Agent aufrufen darf, die Daten, die er erreicht, und die Aktionen, die eine Freigabe durch eine Person brauchen. Danach testen wir, wozu eine eingeschleuste Anweisung den Agenten bringen könnte, und engen seine Rechte auf das ein, was die Aufgabe verlangt.'],
        ['Prüfen Sie auch MCP-Server?', 'Ja. MCP-Server bestimmen, welche Werkzeuge und Daten ein Modell erreicht, deshalb prüfen wir ihre Anmeldung, den Umfang jedes Werkzeugs und ob eine manipulierte Antwort eines Servers Aktionen auf einem anderen steuern kann.'],
        ['Welchen Regelwerken ordnen Sie die Befunde zu?', 'Jeder Befund wird den OWASP Top 10 für LLM-Anwendungen und MITRE ATLAS zugeordnet. Die Nachweise stützen außerdem die Anforderungen des EU AI Act und Managementsysteme nach ISO/IEC 42001.'],
        ['Testen Sie gegen unser Live-System?', 'Die Angriffe laufen gegen eine Kopie Ihres Aufbaus oder eine Staging-Umgebung, sodass Produktionsdaten und Kunden unberührt bleiben. Für die Bewertung von Agenten bauen wir eine private Testumgebung mit Aufgaben aus Ihrer eigenen Arbeit.'],
        ['Wie hängt das mit dem KI-App-Datenschutz-Audit zusammen?', 'Das [KI-App-Datenschutz-Audit](/de/ai-app-privacy-audit/) verfolgt, wohin eine KI-App Gespräche und personenbezogene Daten sendet. Diese Seite behandelt die Angriffe auf das Modell und seine Agenten, und beide Prüfungen lassen sich verbinden.'],
      ],
    },
  },
  'security-architecture-review': {
    en: {
      title: 'Security Architecture Review and Resilience Testing · RFI-IRFOS',
      description: 'Security architecture review from Graz: defense in depth, single points of failure, redundancy and recovery, tested with fault injection and chaos engineering.',
      label: 'Architecture & Resilience Review',
      h1: 'Security Architecture and Resilience Review',
      lead: 'We examine how your systems fit together and what happens when one part fails or falls to an attacker, and we test the answer under controlled faults.',
      sections: [],
      evidenceH2: '', evidenceIntro: '', evidence: [],
      startH2: '', startText: [],
      faqH2: 'Questions about the architecture and resilience review',
      faq: [
        ['What does a security architecture review cover?', 'Data flows, identities, network boundaries and the dependencies between your systems. The result shows where one component trusts another blindly, where a single point of failure carries the operation and where a second layer of protection is missing.'],
        ['What is chaos engineering?', 'Chaos engineering triggers controlled faults, such as a failed database or a slow network, and observes how the system reacts. It shows whether failover, alerts and runbooks work before a real outage tests them.'],
        ['Is fault injection risky for our operation?', 'Every test runs in staging first, with agreed time windows and stop conditions. Tests in production follow only with your approval and with a defined way back.'],
        ['Which documents do you need?', 'Existing diagrams, an overview of your cloud and network setup and the recovery targets you have set are enough to start. Whatever is missing we map together with your team in the first sessions.'],
        ['Does the review help with NIS2 and DORA?', 'Yes. Both ask for evidence of business continuity and disaster recovery, and the measured recovery times and test records supply it. How the requirements apply to you is covered by our [NIS2 consulting](/nis2-consulting/).'],
        ['How does this differ from a penetration test?', 'A [penetration test](/penetration-testing/) follows concrete attack paths into your systems. The architecture review looks at the design behind them and at how the operation holds up when parts fail, and the two complement each other.'],
      ],
    },
    de: {
      title: 'Security Architecture Review und Resilienztest · RFI-IRFOS',
      description: 'Security Architecture Review aus Graz: Defense in Depth, Single Points of Failure, Redundanz und Wiederanlauf, geprüft mit Fault Injection und Chaos Engineering.',
      label: 'Architektur- & Resilienz-Review',
      h1: 'Security Architecture Review und Resilienzprüfung',
      lead: 'Wir prüfen, wie Ihre Systeme zusammenhängen und was passiert, wenn ein Teil ausfällt oder in die Hände eines Angreifers gerät, und testen die Antwort unter kontrollierten Fehlern.',
      sections: [],
      evidenceH2: '', evidenceIntro: '', evidence: [],
      startH2: '', startText: [],
      faqH2: 'Fragen zum Architektur- und Resilienz-Review',
      faq: [
        ['Was umfasst ein Security Architecture Review?', 'Datenflüsse, Identitäten, Netzgrenzen und die Abhängigkeiten zwischen Ihren Systemen. Das Ergebnis zeigt, wo eine Komponente einer anderen blind vertraut, wo ein Single Point of Failure den Betrieb trägt und wo eine zweite Schutzschicht fehlt.'],
        ['Was ist Chaos Engineering?', 'Chaos Engineering löst kontrollierte Fehler aus, etwa eine ausgefallene Datenbank oder ein langsames Netz, und beobachtet, wie das System reagiert. So zeigt sich, ob Failover, Alarme und Runbooks greifen, bevor ein echter Ausfall sie prüft.'],
        ['Ist Fault Injection riskant für unseren Betrieb?', 'Jeder Test läuft zuerst in Staging, mit vereinbarten Zeitfenstern und Abbruchbedingungen. Tests in der Produktion folgen nur mit Ihrer Freigabe und mit einem festgelegten Weg zurück.'],
        ['Welche Unterlagen brauchen Sie?', 'Vorhandene Diagramme, eine Übersicht Ihrer Cloud- und Netzaufstellung und Ihre festgelegten Wiederanlaufziele reichen für den Start. Was fehlt, erfassen wir in den ersten Terminen gemeinsam mit Ihrem Team.'],
        ['Hilft das Review bei NIS2 und DORA?', 'Ja. Beide verlangen Nachweise für Business Continuity und Disaster Recovery, und die gemessenen Wiederanlaufzeiten samt Testprotokollen liefern sie. Wie die Anforderungen für Sie gelten, klärt unsere [NIS2-Beratung](/de/nis2-consulting/).'],
        ['Worin unterscheidet es sich von einem Penetrationstest?', 'Ein [Penetrationstest](/de/penetration-testing/) verfolgt konkrete Angriffswege in Ihre Systeme. Das Architektur-Review betrachtet den Entwurf dahinter und wie der Betrieb standhält, wenn Teile ausfallen, und beide ergänzen einander.'],
      ],
    },
  },
  'threat-intelligence': {
    en: {
      title: 'Cyber Threat Intelligence and Early Warning · RFI-IRFOS',
      description: 'Cyber threat intelligence from Graz: campaign analysis, early warnings and indicators of compromise, matched against the systems you actually run.',
      label: 'Threat Intelligence',
      h1: 'Cyber Threat Intelligence for Your Systems',
      lead: 'We follow attacker campaigns, new vulnerabilities and indicators and tie each report to the systems you actually run.',
      sections: [],
      evidenceH2: '', evidenceIntro: '', evidence: [],
      startH2: '', startText: [],
      faqH2: 'Questions about threat intelligence',
      faq: [
        ['What is cyber threat intelligence?', 'Knowledge about attackers, their campaigns and their techniques, prepared so that it leads to a decision. It ranges from strategic situation reports for management to technical indicators that monitoring can use directly.'],
        ['How do you decide what concerns us?', 'Every report is matched against the assets, versions and sector recorded in your portal. You receive an early warning only when a vulnerability or campaign meets a system you run.'],
        ['What does an early warning contain?', 'The system at risk, the campaign or vulnerability behind it, how likely an attack is and the step that protects you. Vulnerabilities land on the remediation board as tasks at the same time.'],
        ['How does threat intelligence work with the Managed SOC?', 'Within the [Managed SOC](/managed-soc/) indicators of compromise feed straight into monitoring, threat hunting and detection rules, which shortens the time to detection.'],
        ['Which models and sources do you use?', 'Public vulnerability catalogues, campaign reports and indicator feeds, linked by our world model DINGIR into causal chains and by our knowledge graph NYX to CWE, CAPEC and MITRE ATT&CK.'],
        ['How do you prioritise vulnerabilities from the reports?', 'With CVSS, EPSS and the catalogue of known exploited vulnerabilities, weighed against how exposed your affected system is. The approach is described under [vulnerability remediation](/vulnerability-remediation/).'],
      ],
    },
    de: {
      title: 'Cyber Threat Intelligence und Frühwarnung · RFI-IRFOS',
      description: 'Cyber Threat Intelligence aus Graz: Kampagnenanalyse, Frühwarnungen und Indicators of Compromise, abgeglichen mit den Systemen, die Sie tatsächlich betreiben.',
      label: 'Threat Intelligence',
      h1: 'Cyber Threat Intelligence für Ihre Systeme',
      lead: 'Wir verfolgen Angriffskampagnen, neue Schwachstellen und Indikatoren und verknüpfen jede Meldung mit den Systemen, die Sie tatsächlich betreiben.',
      sections: [],
      evidenceH2: '', evidenceIntro: '', evidence: [],
      startH2: '', startText: [],
      faqH2: 'Fragen zu Threat Intelligence',
      faq: [
        ['Was ist Cyber Threat Intelligence?', 'Wissen über Angreifer, ihre Kampagnen und ihre Vorgehensweisen, so aufbereitet, dass daraus eine Entscheidung folgt. Es reicht vom strategischen Lagebild für die Geschäftsleitung bis zu technischen Indikatoren, die eine Überwachung direkt nutzt.'],
        ['Wie entscheiden Sie, was uns betrifft?', 'Jede Meldung wird mit den Assets, Versionen und der Branche abgeglichen, die in Ihrem Portal erfasst sind. Eine Frühwarnung erhalten Sie nur, wenn eine Schwachstelle oder Kampagne auf ein System trifft, das Sie betreiben.'],
        ['Was enthält eine Frühwarnung?', 'Das gefährdete System, die Kampagne oder Schwachstelle dahinter, die Wahrscheinlichkeit eines Angriffs und den Schritt, der Sie schützt. Schwachstellen landen zugleich als Aufgabe im Remediation-Board.'],
        ['Wie arbeitet Threat Intelligence mit dem Managed SOC zusammen?', 'Im [Managed SOC](/de/managed-soc/) fließen Indicators of Compromise direkt in Überwachung, Threat Hunting und Erkennungsregeln, wodurch sich die Zeit bis zur Erkennung verkürzt.'],
        ['Welche Modelle und Quellen nutzen Sie?', 'Öffentliche Schwachstellenkataloge, Kampagnenberichte und Indikator-Feeds, die unser Weltmodell DINGIR zu Ursachenketten verknüpft und unser Wissensgraph NYX CWE, CAPEC und MITRE ATT&CK zuordnet.'],
        ['Wie priorisieren Sie Schwachstellen aus den Meldungen?', 'Mit CVSS, EPSS und dem Katalog bekannt ausgenutzter Schwachstellen, gewichtet danach, wie exponiert Ihr betroffenes System ist. Das Vorgehen beschreibt die Seite [Schwachstellen beheben](/de/vulnerability-remediation/).'],
      ],
    },
  },
  'vendor-risk-management': {
    en: {
      title: 'Vendor Risk Management and Security Questionnaires · RFI-IRFOS',
      description: 'Vendor risk management from Graz: due diligence, scoring, tiering and continuous monitoring of suppliers, plus answers to your customers\' security questionnaires.',
      label: 'Vendor Risk Management',
      h1: 'Vendor Risk Management and Security Questionnaires',
      lead: 'Your suppliers, software vendors and cloud services carry part of your risk. We assess them before you sign, rank them by impact and keep their attack surface in view.',
      sections: [],
      evidenceH2: '', evidenceIntro: '', evidence: [],
      startH2: '', startText: [],
      faqH2: 'Questions about vendor risk management',
      faq: [
        ['How do you assess a vendor?', 'We examine its public attack surface read-only, read its certificates, policies and answers to a questionnaire and compare what it claims with what its systems show. Where the vendor is part of your software, its SDKs are included.'],
        ['Do you need the vendor\'s consent?', 'The external review only reads what is publicly visible, so no consent is needed. Deeper tests on a vendor\'s systems happen only with its written approval.'],
        ['What does tiering mean?', 'Tiering sorts suppliers by the data and access they hold at your company. Critical vendors receive deeper reviews and continuous monitoring, while low-impact ones need little effort.'],
        ['Does this cover the NIS2 supply chain requirements?', 'Article 21 of the NIS2 Directive requires entities to address the security of their suppliers, and the ratings with their evidence document exactly that. Applicability is clarified by our [NIS2 consulting](/nis2-consulting/).'],
        ['Can you help us answer questionnaires from our own customers?', 'Yes. Evidence from the [compliance workspace](/compliance-automation/) and your Trust Center answers most questions, and we prepare the rest with your team.'],
        ['How does this relate to the SDK check?', 'The [app tracker and SDK check](/app-tracker-sdk-check/) examines the libraries inside one app in depth. Vendor risk management covers all your suppliers and uses those results for software vendors.'],
      ],
    },
    de: {
      title: 'Vendor Risk Management und Sicherheitsfragebögen · RFI-IRFOS',
      description: 'Vendor Risk Management aus Graz: Due Diligence, Scoring, Tiering und laufende Beobachtung Ihrer Lieferanten, dazu Antworten auf Sicherheitsfragebögen.',
      label: 'Vendor Risk Management',
      h1: 'Vendor Risk Management und Sicherheitsfragebögen',
      lead: 'Ihre Lieferanten, Softwareanbieter und Cloud-Dienste tragen einen Teil Ihres Risikos. Wir prüfen sie vor der Unterschrift, reihen sie nach Auswirkung und behalten ihre Angriffsfläche im Blick.',
      sections: [],
      evidenceH2: '', evidenceIntro: '', evidence: [],
      startH2: '', startText: [],
      faqH2: 'Fragen zum Vendor Risk Management',
      faq: [
        ['Wie prüfen Sie einen Anbieter?', 'Wir untersuchen seine öffentliche Angriffsfläche ausschließlich lesend, werten Zertifikate, Richtlinien und Antworten auf einen Fragebogen aus und vergleichen seine Angaben mit dem, was seine Systeme zeigen. Ist der Anbieter Teil Ihrer Software, prüfen wir auch seine SDKs.'],
        ['Braucht es die Zustimmung des Anbieters?', 'Die externe Prüfung liest nur, was öffentlich sichtbar ist, und kommt daher ohne Zustimmung aus. Tiefere Tests an den Systemen eines Anbieters erfolgen nur mit dessen schriftlicher Freigabe.'],
        ['Was bedeutet Tiering?', 'Tiering ordnet Lieferanten nach den Daten und Zugriffen, die sie bei Ihnen haben. Kritische Anbieter werden tiefer geprüft und laufend beobachtet, während Anbieter mit geringer Auswirkung wenig Aufwand brauchen.'],
        ['Deckt das die NIS2-Anforderungen an die Lieferkette ab?', 'Artikel 21 der NIS2-Richtlinie verlangt, dass Einrichtungen die Sicherheit ihrer Lieferanten berücksichtigen, und die Bewertungen samt Belegen dokumentieren genau das. Ob die Pflichten Sie betreffen, klärt unsere [NIS2-Beratung](/de/nis2-consulting/).'],
        ['Helfen Sie uns bei Fragebögen unserer eigenen Kunden?', 'Ja. Nachweise aus dem [Compliance-Bereich](/de/compliance-automation/) und Ihrem Trust Center beantworten die meisten Fragen, den Rest bereiten wir mit Ihrem Team vor.'],
        ['Wie hängt das mit dem SDK-Check zusammen?', 'Der [Tracker- und SDK-Check](/de/app-tracker-sdk-check/) untersucht die Bibliotheken einer App in der Tiefe. Das Vendor Risk Management umfasst alle Ihre Lieferanten und nutzt diese Ergebnisse für Softwareanbieter.'],
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
