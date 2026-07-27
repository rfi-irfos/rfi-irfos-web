#!/usr/bin/env python3
"""Free-search backend for the HRV OSINT agent (NO Firecrawl / web_search).

Chains free, unauthenticated public sources:
  1. Wikipedia REST search  (always works, real article URLs)
  2. GitHub search API      (works unauthenticated, for docs/code/case repos)
Falls back gracefully if one source is blocked. No API key, no billing.
"""
from __future__ import annotations
import urllib.request, ssl, json, urllib.parse, re

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"


def _fetch(url: str, headers: dict | None = None, timeout: int = 12) -> str:
    req = urllib.request.Request(url, headers=headers or {"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=timeout, context=CTX).read().decode("utf-8", "ignore")


def _wiki(query: str, limit: int = 8) -> list[dict]:
    url = ("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="
           + urllib.parse.quote(query) + "&format=json&srlimit=" + str(limit))
    try:
        data = json.loads(_fetch(url, {"User-Agent": UA}))
    except Exception:
        return []
    out = []
    for h in data.get("query", {}).get("search", []):
        title = h["title"]
        out.append({
            "entity": title[:80], "date": "", "severity": "high",
            "region_en": "European Union",
            "sources": [{"label": "Wikipedia: " + title,
                         "url": "https://en.wikipedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"))}],
            "summary": re.sub(r"<[^>]+>", "", h.get("snippet", "")).strip()[:300],
        })
    return out


def _github(query: str, limit: int = 8) -> list[dict]:
    url = ("https://api.github.com/search/repositories?q=" + urllib.parse.quote(query)
           + "&per_page=" + str(limit))
    try:
        data = json.loads(_fetch(url, {"User-Agent": UA, "Accept": "application/vnd.github+json"}))
    except Exception:
        return []
    out = []
    for it in data.get("items", [])[:limit]:
        out.append({
            "entity": it["full_name"][:80], "date": "", "severity": "med",
            "region_en": "Global",
            "sources": [{"label": "GitHub: " + it["full_name"], "url": it["html_url"]}],
            "summary": (it.get("description") or "")[:300],
        })
    return out


def search_fn(query: str, limit: int = 8) -> list[dict]:
    """Combined free search: Wikipedia first, GitHub as fallback/supplement."""
    hits = _wiki(query, limit)
    if len(hits) < limit:
        try:
            hits += _github(query, limit - len(hits))
        except Exception:
            pass
    return hits[:limit]


if __name__ == "__main__":
    import sys
    q = sys.argv[1] if len(sys.argv) > 1 else "European Union labour rights violation 2025"
    for h in search_fn(q, 5):
        print(h["entity"], "->", h["sources"][0]["url"])
