# RFI-IRFOS Data-Asset-Inventory (T0)

> Automatisch aus `investigations/reports/*.md` extrahiert via `scripts/compute_corpus_stats.py`.
> Neu berechnet bei jedem Lauf des Skripts, zuletzt regeneriert im Rahmen der Baumkonsolidierung 2026-08-21.
> App-Anzahl kommt NICHT von hier, sondern direkt aus `AUDIT_HIGHLIGHTS.length` in `TrackRecord.tsx` (treibt dort die Live-KPI) - die 1062 rohen Package-ID-Strings unten sind SDK-/Component-interne Namen mitgezaehlt, kein verlaesslicher App-Count, exakt wie in der Korrektur vom 2026-08-12 beschrieben.

## Korpus-Umfang

- **Report-Dateien (alle .md, kanonischer Baum):** 634
- **Rohe com.x.y-Package-ID-Strings (SDK-Component-Namen inklusive, kein App-Count):** 1062

## Technische Entitaetsebene (Layer 2)

- **Smali-Klassen (summiert aus Total- + SDK/Integration-Class-Zahlen):** 1,026,899
  - davon aus 'Total smali classes'-Zeilen: 614,840 (aus 14 Reports)
  - davon aus einzelnen SDK/Integration-Class-Zahlen: 412,059 (aus 126 Treffern)
- **SDK-Erwaehnungen (Wort "SDK"):** 1,830
- **Permission-Erwaehnungen:** 1,734
- **Tracker/Tracking-Erwaehnungen:** 783
- **Distinkte Endpoint-/URL-Treffer:** 379

## Findings (Layer 7 / Enforcement-Beweis)

- **Severity-Zeilen ausgewertet:** 2,644
- **CRITICAL:** 741
- **HIGH:** 1,305
- **MEDIUM:** 489
- **LOW:** 109

## Quelle & Caveats

Alle Zahlen aus `~/Desktop/projects/investigations/reports/` (kanonischer Baum seit 2026-08-21, siehe
`reference_investigations_reports_path` Memory - vorher zwei getrennte Baeume, die AI-Companion-Welle
(RosyTalk/Blush/CycleAI/HerAI/TalkMe) fehlte in der Version vom 2026-08-12 komplett).
- Smali-Summe ist eine Untergrenze (nur Reports mit expliziten Class-Zahlen), SDK-Class-Zahlen unter 4
  werden als Rauschen verworfen (kein SDK, z. B. "(3 classes)" in unrelated Kontext).
- Findings-Summe zaehlt Severity-Zeilen, nicht deduplizierte Findings.
- SDK-/Tracker-/Permission-Erwaehnungen sind Text-Mentions, keine normalisierten Entities.
- Re-run: `python3 scripts/compute_corpus_stats.py` nach jedem neuen R1 oder Watchtower-Re-Audit.
