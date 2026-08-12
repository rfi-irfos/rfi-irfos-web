# RFI-IRFOS Data-Asset-Inventory (T0)

> Automatisch aus `investigations/reports/*.md` extrahiert am 2026-08-12. **Nur echte, in den Reports stehende Zahlen — keine Schaetzung.**
> App-Anzahl ueber Package-Identifikatoren (com.x.y) dedupliziert, nicht ueber Ordner — manche Targets (SAP, ORF, outfit7) umfassen mehrere Apps.

## Korpus-Umfang

- **Apps (eindeutige Package-IDs):** 649
- **Report-Dateien (alle .md):** 572
- **Reports mit 'Apps Analyzed'-Tabelle:** 1

## Technische Entitaetsebene (Layer 2)

- **Smali-Klassen (summiert aus Total- + SDK/Integration-Class-Zahlen):** 1,253,757
  - davon aus 'Total smali classes': 609,840 (aus 13 Reports)
  - davon aus einzelnen SDK/Integration-Class-Zahlen: 643,917 (aus 214 Matches)
- **SDK-Class-Eintraege (einzeln gezaehlt):** 214
- **SDK-Erwaehnungen (gesamt):** 1,553
- **Permission-Erwaehnungen:** 1,811
- **Tracker/Tracking-Erwaehnungen:** 662
- **Data-Flow-/Exfiltration-Erwaehnungen:** 55
- **Domain-/Endpoint-Erwaehnungen (URL-Matches):** 441
- **App-Versionen (versionCode/code):** 132
- **EU-Controller/Publisher-Angaben:** 2

## Findings (Layer 7 / Enforcement-Beweis)

- **Severity-Zeilen ausgewertet:** 296
- **CRITICAL (summiert):** 80
- **HIGH (summiert):** 146
- **MEDIUM (summiert):** 57
- **LOW (summiert):** 13

## Quelle & Caveats

Alle Zahlen aus `Desktop/projects/investigations/reports/`.
- App-Anzahl = deduplizierte Package-IDs (com.x.y) ueber ALLE .md Reports.
- Smali-Summe ist eine Untergrenze (nur Reports mit expliziten Class-Zahlen).
- Findings-Summe zaehlt Severity-Zeilen, nicht deduplizierte Findings.
- SDK-/Tracker-/Datenfluss sind Text-Mentions, keine normalisierten Entities.

### Sample Package-IDs (erste 40)
- com.a9.fez.share.arfileprovider
- com.abide.magellantv.facebookinitprovider
- com.abide.magellantv.firebaseinitprovider
- com.acesso.acessobio_android.activities.selfiexactivity
- com.acesso.acessobio_android.document.documentxactivity
- com.action.consumerapp.permission.push_provider
- com.action.consumerapp.permission.push_write_provider
- com.activision.callofduty.shooter
- com.adjust.preinstall.read_permission
- com.adjust.sdk.activityhandler
- com.adjust.sdk.adjust
- com.adjust.sdk.adjustconfig
- com.adjust.sdk.adjustconfig.smali
- com.adjust.sdk.adjustevent
- com.adjust.sdk.adjustpreinstallreferrerreceiver
- com.adjust.sdk.adjustreferrerreceiver
- com.adjust.sdk.huawei.util
- com.adjust.sdk.imei.util
- com.adjust.sdk.meta.util
- com.adjust.sdk.oaid.hmssdkclient
- com.adjust.sdk.oaid.msasdkclient
- com.adjust.sdk.oaid.util
- com.adjust.sdk.packagehandler
- com.adjust.sdk.samsung.clouddev.util
- com.adjust.sdk.samsung.util
- com.adjust.sdk.sdkclickhandler
- com.adjust.sdk.systemlifecyclecontentprovider
- com.adjust.sdk.vivo.util
- com.adjust.sdk.xiaomi.util
- com.adobe.marketing.mobile
- com.adobe.marketing.mobile.analytics
- com.adobe.marketing.mobile.assurance
- com.adobe.marketing.mobile.core
- com.adobe.marketing.mobile.edge
- com.adobe.marketing.mobile.identity
- com.adobe.marketing.mobile.launch
- com.adobe.marketing.mobile.lifecycle
- com.adobe.marketing.mobile.optimize
- com.adobe.marketing.mobile.rulesengine
- com.adobe.marketing.mobile.signal
