#!/bin/bash
# Funnel health check for rfi-irfos.com (Lighthouse round 54, 2026-10-31). The site had no
# Fly health check and no outside probe, so a dead /api/initial-review would only show up
# when a DLT lead's free check silently failed. Runs from the colony's crontab every 15 min.
# The API probe sends consent=false: review.rs answers 400 "Consent is required." before any
# insert, ntfy or mail, so the probe never creates a request. Alerts only after 2 failed runs
# in a row (the app scales to zero; a cold start can miss once) and once more on recovery.
set -u
BASE="https://rfi-irfos.com"
TOPIC_FILE="$HOME/.config/rfi-irfos-web-health/ntfy_topic"
TOPIC="$(cat "$TOPIC_FILE" 2>/dev/null || echo rfi-irfos-web-contact)"
STATE="$HOME/.local/state/rfi-irfos-web-health"
mkdir -p "$STATE"
fails=()

page() { # path, expected text
  local body code
  body="$(curl -s -m 25 -w '\n%{http_code}' "$BASE$1")"; code="${body##*$'\n'}"
  if [ "$code" != 200 ]; then fails+=("$1 -> HTTP $code")
  elif ! grep -qF "$2" <<<"$body"; then fails+=("$1 -> \"$2\" fehlt")
  fi
}
page "/" "What we examine"
page "/de/" "Was wir prüfen"
page "/access/" "Starter"
page "/evidence/" "Evidence"
page "/evidence/feed.xml" "<entry>"
page "/.well-known/security.txt" "security@rfi-irfos.com"

api="$(curl -s -m 25 -o /dev/null -w '%{http_code}' -X POST "$BASE/api/initial-review" \
  -H 'Content-Type: application/json' \
  -d '{"domain":"healthcheck.invalid","email":"healthcheck@rfi-irfos.com","consent":false,"botcheck":"","locale":"en"}')"
[ "$api" = 400 ] || fails+=("POST /api/initial-review -> $api (expected 400)")

now="$(date -u +%FT%TZ)"
prev="$(cat "$STATE/streak" 2>/dev/null || echo 0)"
if [ ${#fails[@]} -eq 0 ]; then
  if [ -f "$STATE/alerted" ]; then
    curl -s -o /dev/null -H "Title: rfi-irfos.com wieder OK" -H "Tags: white_check_mark" \
      -d "Alle Funnel-Prüfungen grün ($now)." "https://ntfy.sh/$TOPIC"
    rm -f "$STATE/alerted"
  fi
  echo 0 > "$STATE/streak"; echo "$now OK"; exit 0
fi
streak=$((prev + 1)); echo "$streak" > "$STATE/streak"
echo "$now FAIL($streak): ${fails[*]}"
if [ "$streak" -ge 2 ] && [ ! -f "$STATE/alerted" ]; then
  curl -s -o /dev/null -H "Title: rfi-irfos.com Funnel gestört" -H "Priority: high" -H "Tags: warning" \
    -d "$(printf '%s\n' "${fails[@]}") (seit 2 Läufen, $now)" "https://ntfy.sh/$TOPIC"
  touch "$STATE/alerted"
fi
exit 1
