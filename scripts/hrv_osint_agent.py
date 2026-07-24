#!/usr/bin/env python3
"""
HRV OSINT Agent — public-source collector for the Human Rights Violations Ledger.

What it does
------------
Periodically searches publicly available sources (regulators, NGOs, parliaments,
quality press) for documented human-rights / labour / environmental rights
violations inside or affecting the European sphere, and emits structured
candidate entries in the EXACT shape the HRV Ledger expects.

Output is NOT auto-published. Every candidate lands in a human-review queue
(review_queue/*.json) so a person confirms sourcing + severity before it ever
touches the live ledger. This is the same discipline the public tip form uses:
reviewed by a human before publication, never auto-posted.

Run
---
  python3 scripts/hrv_osint_agent.py            # one pass, writes queue
  python3 scripts/hrv_osint_agent.py --dry-run  # print candidates, write nothing
  python3 scripts/hrv_osint_agent.py --limit 5 # cap candidates per query

Requires: the hermes web_search tool (via execute_code) OR a plain web_search
shim. This file is self-contained and only needs stdlib + the search callback
injected at runtime. When run under Hermes execute_code, pass `search_fn`.
"""
from __future__ import annotations
import json, sys, os, datetime, hashlib, re
from pathlib import Path

# ---- candidate shape must match the HRV Ledger SEED entry fields ----
FIELDS = ["id", "date", "entity", "type_en", "type_de",
          "sev", "region_en", "region_de", "sources", "article_en", "article_de"]

SEV_MAP = {
    "critical": "crit", "crit": "crit",
    "high": "high", "medium": "med", "med": "med", "low": "med",
}

# Curated, public, Europe-relevant source queries. Each returns recent,
# documented cases. The agent flags anything with a primary source link.
QUERIES = [
    "European Union labour rights violation fine 2025 documented report",
    "EU workplace safety violation investigation regulator report 2025",
    "minor protection online safety app investigation Europe GDPR 2025",
    "forced labor supply chain EU due diligence violation 2025",
    "environmental community rights violation Europe chemical spill 2025",
    "platform worker employment status court ruling Europe 2025",
]

REVIEW_DIR = Path(__file__).resolve().parent.parent / "humanrights_review_queue"


def _slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:48]


def _make_id(entity: str, date: str) -> str:
    h = hashlib.sha1(f"{entity}|{date}".encode()).hexdigest()[:8]
    return f"osint-{_slug(entity)[:24]}-{h}"


def build_candidate(raw: dict) -> dict:
    """Normalise a raw search hit into the HRV Ledger entry shape."""
    sev = SEV_MAP.get(str(raw.get("severity", "med")).lower(), "med")
    entity = raw.get("entity") or raw.get("title") or "Unnamed entity"
    date = raw.get("date") or datetime.date.today().isoformat()
    region_en = raw.get("region_en") or "European Union"
    region_de = raw.get("region_de") or region_en
    sources = raw.get("sources") or []
    if isinstance(sources, str):
        sources = [{"label": sources, "url": sources}]
    summary = raw.get("summary") or ""
    return {
        "id": _make_id(entity, date),
        "date": date,
        "entity": entity,
        "type_en": raw.get("type_en") or "Labor / Occupational Safety",
        "type_de": raw.get("type_de") or "Arbeit / Arbeitsschutz",
        "sev": sev,
        "region_en": region_en,
        "region_de": region_de,
        "sources": sources,
        "article_en": [
            {"h": "What was reported", "p": summary},
            {"h": "Documented record", "p": raw.get("doc") or "Awaiting human review of primary sources."},
            {"h": "Open questions / discussion", "p": raw.get("open") or "To be summarised by reviewer."},
        ],
        "article_de": [
            {"h": "Was berichtet wurde", "p": summary},
            {"h": "Dokumentierte Fakten", "p": raw.get("doc") or "Quellenprüfung durch Menschen ausstehend."},
            {"h": "Offene Fragen / Diskussion", "p": raw.get("open") or "Vom Reviewer zu zusammenfassen."},
        ],
        "_meta": {
            "origin": "osint-agent",
            "captured": datetime.datetime.now().isoformat(timespec="seconds"),
            "query": raw.get("query", ""),
            "needs_human_review": True,
        },
    }


def collect(search_fn, limit: int = 8, dry_run: bool = False) -> list[dict]:
    """Run the curated queries, structure hits, dedupe, write review queue."""
    candidates = []
    seen_ids = set()
    for q in QUERIES:
        try:
            hits = search_fn(q, limit=limit)
        except Exception as e:
            print(f"[warn] query failed: {q!r} -> {e}", file=sys.stderr)
            continue
        for h in hits or []:
            cand = build_candidate({**h, "query": q})
            if cand["id"] in seen_ids:
                continue
            seen_ids.add(cand["id"])
            candidates.append(cand)

    if not dry_run:
        REVIEW_DIR.mkdir(parents=True, exist_ok=True)
        stamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        out = REVIEW_DIR / f"batch_{stamp}.json"
        out.write_text(json.dumps(candidates, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"[ok] wrote {len(candidates)} candidates -> {out}")
    else:
        print(f"[dry-run] {len(candidates)} candidates (not written)")
    return candidates


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit", type=int, default=8)
    args = ap.parse_args()

    # When run standalone (no live search_fn), use a tiny demo seed so the
    # queue format is exercised end-to-end. Replace search_fn with the real
    # web_search integration under Hermes execute_code.
    def demo_search(query, limit=8):
        return [{
            "entity": "Demo Entity from: " + query[:30],
            "date": datetime.date.today().isoformat(),
            "severity": "high",
            "region_en": "European Union",
            "sources": [{"label": "Source", "url": "https://example.com"}],
            "summary": f"Publicly documented case matching query: {query}",
        }]

    collect(demo_search, limit=args.limit, dry_run=args.dry_run)
