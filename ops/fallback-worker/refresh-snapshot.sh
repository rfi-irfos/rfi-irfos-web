#!/usr/bin/env bash
# Zieht /app/dist aus dem laufenden Graz-Container als neues Notbetrieb-Abbild
# und deployt den Worker. Nur bewusst aufrufen: das Abbild ist ein fester Stand.
set -euo pipefail
cd "$(dirname "$0")"

M="$HOME/.claude/projects/-home-eri-irfos/memory/cloudflare_vanish_api_token.md"
export CLOUDFLARE_API_TOKEN="$(grep -oE 'cfat_[A-Za-z0-9_-]+' "$M" | head -1)"
export CLOUDFLARE_ACCOUNT_ID="$(grep -oE '7c3a73e0[0-9a-f]+' "$M" | head -1)"

image=$(ssh colony 'sudo -n docker inspect rfi-web-web-1 --format "{{.Config.Image}}"')
ssh colony 'rm -rf /tmp/rfi-snap && mkdir /tmp/rfi-snap \
  && sudo -n docker cp rfi-web-web-1:/app/dist /tmp/rfi-snap/ \
  && sudo -n chown -R "$(id -u):$(id -g)" /tmp/rfi-snap'
rsync -a --delete colony:/tmp/rfi-snap/dist/ snapshot/
echo "${image##*:} $(date -u +%FT%TZ)" > snapshot/.snapshot-version
ssh colony 'rm -rf /tmp/rfi-snap'

npx --yes wrangler@latest deploy
echo "Abbild: $(cat snapshot/.snapshot-version)"
