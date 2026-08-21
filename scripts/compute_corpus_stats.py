#!/usr/bin/env python3
"""Recompute RFI-IRFOS corpus-depth KPIs from the canonical report tree.

Re-implements the extraction methodology documented in docs/data-asset-inventory.md
(originally run 2026-08-12, script itself was never committed). Scans every .md report
under ~/Desktop/projects/investigations/reports/ (the single canonical tree as of
2026-08-21, see reference_investigations_reports_path.md) for the same categories:
total smali classes, SDK class-count mentions, SDK/tracker/permission/endpoint mentions,
and severity-line counts.

Run manually whenever the report corpus grows (new R1, new watchtower re-audit):
    python3 scripts/compute_corpus_stats.py

Writes frontend/src/content/corpus-stats.json, which TrackRecord.tsx imports directly.
Also rewrites docs/data-asset-inventory.md with the fresh numbers so the doc and the
site never drift apart again.
"""
import json
import re
from pathlib import Path

REPORTS_ROOT = Path.home() / "Desktop/projects/investigations/reports"
OUT_JSON = Path(__file__).resolve().parent.parent / "frontend/src/content/corpus-stats.json"
OUT_DOC = Path(__file__).resolve().parent.parent / "docs/data-asset-inventory.md"

TOTAL_SMALI_RE = re.compile(r"total\s+smali\s+classes[^0-9]{0,40}?([\d,]{2,})", re.I)
SDK_CLASS_RE = re.compile(r"\(?\s*([\d,]{2,})\s+(?:smali\s+)?classes?\s*[),]", re.I)
SDK_MENTION_RE = re.compile(r"\bSDK\b", re.I)
TRACKER_MENTION_RE = re.compile(r"\btracker|tracking\b", re.I)
PERMISSION_MENTION_RE = re.compile(r"\bpermission\b", re.I)
ENDPOINT_RE = re.compile(r"\bhttps?://[a-zA-Z0-9][a-zA-Z0-9.\-]*\.[a-zA-Z]{2,}", re.I)
SEVERITY_RE = re.compile(r"\b(CRITICAL|HIGH|MEDIUM|LOW)\b")
PACKAGE_ID_RE = re.compile(r"\bcom\.[a-z0-9_]+(?:\.[a-z0-9_]+){1,}\b", re.I)


def to_int(s):
    return int(s.replace(",", ""))


EXCLUDE_DIRS = {"tooling", "_engagement_template"}  # cloned reference repos (owasp-mastg etc.) and an empty case template, not audit reports
EXCLUDE_FILENAMES = {"MASTER_REPORT_2026.md"}  # aggregates/restates findings already counted in per-target reports


def main():
    md_files = sorted(
        f for f in REPORTS_ROOT.rglob("*.md")
        if not EXCLUDE_DIRS & set(f.relative_to(REPORTS_ROOT).parts[:-1])
        and f.name not in EXCLUDE_FILENAMES
    )

    total_smali_from_totals = 0
    files_with_total = 0
    total_smali_from_sdk_counts = 0
    sdk_count_matches = 0
    sdk_mentions = 0
    tracker_mentions = 0
    permission_mentions = 0
    endpoint_matches = set()
    severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    package_ids = set()

    for f in md_files:
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue

        file_had_total_line = False
        seen_sdk_counts_this_file = set()  # same class-count fact often restated in a table AND prose AND a header
        for line in text.splitlines():
            m = TOTAL_SMALI_RE.search(line)
            if m:
                total_smali_from_totals += to_int(m.group(1))
                if not file_had_total_line:
                    files_with_total += 1
                    file_had_total_line = True
                continue  # a "Total smali classes" line never also counts as a per-SDK class mention

            for m in SDK_CLASS_RE.finditer(line):
                n = to_int(m.group(1))
                if n < 4:  # skip trivial "(3 classes)" style non-SDK noise, matches prior methodology's spirit
                    continue
                if n in seen_sdk_counts_this_file:
                    continue  # same SDK's class count restated elsewhere in the same report, count once
                seen_sdk_counts_this_file.add(n)
                total_smali_from_sdk_counts += n
                sdk_count_matches += 1

        sdk_mentions += len(SDK_MENTION_RE.findall(text))
        tracker_mentions += len(TRACKER_MENTION_RE.findall(text))
        permission_mentions += len(PERMISSION_MENTION_RE.findall(text))
        endpoint_matches.update(ENDPOINT_RE.findall(text))
        for sev in SEVERITY_RE.findall(text):
            severity_counts[sev] += 1
        package_ids.update(m.group(0).lower() for m in PACKAGE_ID_RE.finditer(text))

    total_smali = total_smali_from_totals + total_smali_from_sdk_counts
    total_severity_lines = sum(severity_counts.values())

    stats = {
        "generatedFrom": str(REPORTS_ROOT),
        "reportFilesScanned": len(md_files),
        "smaliClassesTotal": total_smali,
        "smaliClassesFromTotalsLines": total_smali_from_totals,
        "smaliClassesFromTotalsLinesFileCount": files_with_total,
        "smaliClassesFromSdkCounts": total_smali_from_sdk_counts,
        "sdkClassCountEntries": sdk_count_matches,
        "sdkMentions": sdk_mentions,
        "trackerMentions": tracker_mentions,
        "permissionMentions": permission_mentions,
        "endpointMentionsDistinct": len(endpoint_matches),
        "severityLinesTotal": total_severity_lines,
        "severityCounts": severity_counts,
        "distinctPackageIdStrings": len(package_ids),
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(stats, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {OUT_JSON}")
    print(json.dumps(stats, indent=2))

    doc = f"""# RFI-IRFOS Data-Asset-Inventory (T0)

> Automatisch aus `investigations/reports/*.md` extrahiert via `scripts/compute_corpus_stats.py`.
> Neu berechnet bei jedem Lauf des Skripts, zuletzt regeneriert im Rahmen der Baumkonsolidierung 2026-08-21.
> App-Anzahl kommt NICHT von hier, sondern direkt aus `AUDIT_HIGHLIGHTS.length` in `TrackRecord.tsx` (treibt dort die Live-KPI) - die {stats['distinctPackageIdStrings']} rohen Package-ID-Strings unten sind SDK-/Component-interne Namen mitgezaehlt, kein verlaesslicher App-Count, exakt wie in der Korrektur vom 2026-08-12 beschrieben.

## Korpus-Umfang

- **Report-Dateien (alle .md, kanonischer Baum):** {stats['reportFilesScanned']}
- **Rohe com.x.y-Package-ID-Strings (SDK-Component-Namen inklusive, kein App-Count):** {stats['distinctPackageIdStrings']}

## Technische Entitaetsebene (Layer 2)

- **Smali-Klassen (summiert aus Total- + SDK/Integration-Class-Zahlen):** {stats['smaliClassesTotal']:,}
  - davon aus 'Total smali classes'-Zeilen: {stats['smaliClassesFromTotalsLines']:,} (aus {stats['smaliClassesFromTotalsLinesFileCount']} Reports)
  - davon aus einzelnen SDK/Integration-Class-Zahlen: {stats['smaliClassesFromSdkCounts']:,} (aus {stats['sdkClassCountEntries']} Treffern)
- **SDK-Erwaehnungen (Wort "SDK"):** {stats['sdkMentions']:,}
- **Permission-Erwaehnungen:** {stats['permissionMentions']:,}
- **Tracker/Tracking-Erwaehnungen:** {stats['trackerMentions']:,}
- **Distinkte Endpoint-/URL-Treffer:** {stats['endpointMentionsDistinct']:,}

## Findings (Layer 7 / Enforcement-Beweis)

- **Severity-Zeilen ausgewertet:** {stats['severityLinesTotal']:,}
- **CRITICAL:** {stats['severityCounts']['CRITICAL']:,}
- **HIGH:** {stats['severityCounts']['HIGH']:,}
- **MEDIUM:** {stats['severityCounts']['MEDIUM']:,}
- **LOW:** {stats['severityCounts']['LOW']:,}

## Quelle & Caveats

Alle Zahlen aus `~/Desktop/projects/investigations/reports/` (kanonischer Baum seit 2026-08-21, siehe
`reference_investigations_reports_path` Memory - vorher zwei getrennte Baeume, die AI-Companion-Welle
(RosyTalk/Blush/CycleAI/HerAI/TalkMe) fehlte in der Version vom 2026-08-12 komplett).
- Smali-Summe ist eine Untergrenze (nur Reports mit expliziten Class-Zahlen), SDK-Class-Zahlen unter 4
  werden als Rauschen verworfen (kein SDK, z. B. "(3 classes)" in unrelated Kontext).
- Findings-Summe zaehlt Severity-Zeilen, nicht deduplizierte Findings.
- SDK-/Tracker-/Permission-Erwaehnungen sind Text-Mentions, keine normalisierten Entities.
- Re-run: `python3 scripts/compute_corpus_stats.py` nach jedem neuen R1 oder Watchtower-Re-Audit.
"""
    OUT_DOC.write_text(doc, encoding="utf-8")
    print(f"wrote {OUT_DOC}")


if __name__ == "__main__":
    main()
