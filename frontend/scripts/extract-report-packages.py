#!/usr/bin/env python3
"""Extract the app package IDs (e.g. com.nintendo.znca) named on the first pages of each published
disclosure PDF and write src/content/reportPackages.json, keyed by the same slug as
reportSlug() in TrackRecord.tsx. Why: the per-report HTML pages never contained the package ID,
while Search Console shows people searching exactly for it ("com.nintendo.znca": 201 impressions,
0 clicks) and the PDF (which does contain it) competing with the HTML page for that query.

Deterministic and read-only on the PDFs: re-run after adding a report, review the diff.
Usage: python3 scripts/extract-report-packages.py   (needs `pdftotext` from poppler-utils)"""
import glob
import json
import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
REPORTS = os.path.join(HERE, "..", "public", "reports")
OUT = os.path.join(HERE, "..", "src", "content", "reportPackages.json")
PKG_RE = re.compile(r"([A-Z0-9][^\n()]{1,60}?)\s*\(([a-z][a-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*){2,})")
MAX_PKGS = 3


def slug(filename):
    # mirrors reportSlug() in TrackRecord.tsx
    return re.sub(r"-2026(-report)?$", "", re.sub(r"\.pdf$", "", filename, flags=re.I), flags=re.I)


def extract(pdf):
    text = subprocess.run(["pdftotext", "-l", "2", pdf, "-"], capture_output=True, text=True).stdout[:3000]
    seen, out = set(), []
    for app, pkg in PKG_RE.findall(text):
        if pkg not in seen:
            seen.add(pkg)
            out.append({"app": app.strip(), "pkg": pkg})
    return out[:MAX_PKGS]


def main():
    result = {}
    for pdf in sorted(glob.glob(os.path.join(REPORTS, "*.pdf"))):
        found = extract(pdf)
        if found:
            result[slug(os.path.basename(pdf))] = found
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1, sort_keys=True)
        f.write("\n")
    print(f"{len(result)} reports with package IDs -> {os.path.relpath(OUT)}")


if __name__ == "__main__":
    main()
