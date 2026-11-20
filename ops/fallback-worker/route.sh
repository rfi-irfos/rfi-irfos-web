#!/usr/bin/env bash
# Hängt den Notbetrieb-Worker vor rfi-irfos.com (on) oder nimmt ihn wieder weg (off).
#   ./route.sh on | off | status
set -euo pipefail
M="$HOME/.claude/projects/-home-eri-irfos/memory/cloudflare_vanish_api_token.md"
T="$(grep -oE 'cfat_[A-Za-z0-9_-]+' "$M" | head -1)"
Z=04e9d3aa6317b1a71f5ddb3b051d8001
API="https://api.cloudflare.com/client/v4/zones/$Z/workers/routes"
PATTERNS=("rfi-irfos.com/*" "www.rfi-irfos.com/*")
cf() { curl -s -H "Authorization: Bearer $T" -H 'content-type: application/json' "$@"; }

case "${1:-status}" in
  on)
    for p in "${PATTERNS[@]}"; do
      cf -X POST -d "{\"pattern\":\"$p\",\"script\":\"rfi-web-fallback\"}" "$API" \
        | python3 -c 'import sys,json;d=json.load(sys.stdin);print("on ", d["success"], d.get("errors") or d["result"]["pattern"])'
    done ;;
  off)
    cf "$API" | python3 -c '
import sys,json
for r in json.load(sys.stdin)["result"]:
    if r.get("script")=="rfi-web-fallback": print(r["id"])' | while read -r id; do
      cf -X DELETE "$API/$id" | python3 -c 'import sys,json;print("off", json.load(sys.stdin)["success"])'
    done ;;
  status)
    cf "$API" | python3 -c 'import sys,json;d=json.load(sys.stdin);print(d.get("errors") or [(r["pattern"],r.get("script")) for r in d["result"]])' ;;
esac
