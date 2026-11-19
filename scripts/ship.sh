#!/usr/bin/env bash
# rfi-irfos-web deploy chain: build on the Colony (heavy work never runs on
# the ZBook - npm, Playwright prerender across ~200 routes, docker build all
# need real CPU/RAM), then start it right there with docker compose (the site
# runs on the Colony in Graz since the move off Fly.io; Fly stays untouched as a
# fallback and is no longer deployed). Run from the repo root: ./scripts/ship.sh [SHA]
# SHA defaults to the current HEAD short hash - pass one explicitly only to
# re-deploy an older already-built image tag.
set -e; set -o pipefail
cd "$(dirname "$0")/.."
SHA="${1:-$(git rev-parse --short HEAD)}"
echo "shipping $SHA"
ssh colony 'pkill -f "[v]ite --host" || true'
rm -rf frontend/dist
# 2026-10-24 fix: the quoted command below runs in its OWN bash -lc on the
# Colony - it does NOT inherit this script's `set -o pipefail` (that only
# covers this local shell). Without pipefail in that remote shell, `npm run
# build | tail -N` reports the exit code of `tail` (always 0), not of the
# build - a failing build (including the check-dist-seo.mjs gate) would ship
# to production looking like a success. Caught live 2026-10-24 (the deploy
# that shipped 59766d0 had 3 gate findings in the tail'd output that colony-run
# still reported as exit 0 - turned out to be a false positive in the gate
# itself, not a bad build, but the masking was real either way: a genuinely
# broken build would have shipped silently the same way). Both this step and
# the docker-build step below now `set -o pipefail`/capture the real exit
# code inside their own remote shell before deciding to continue.
# `npx playwright install chromium` runs every time, inside this same
# colony-run invocation, right before the build that needs it (not as a
# separate earlier command) - fix for a real failure chain hit 2026-10-24.
# playwright-core pins an exact browser revision (e.g. chromium-1234) and
# tracks which on-disk project needs it via a `.links` registry entry in the
# shared `~/.cache/ms-playwright` (shared across every project on the Colony,
# not per-repo). Installing it from a workdir and then deleting that workdir
# (as this script always does, win or lose) orphans that `.links` entry; the
# next `npm ci` anywhere on the box (this repo's next deploy, or any other
# project sharing the Colony) runs Playwright's own GC, finds the dangling
# link, and deletes the revision again - so a one-off manual install here
# keeps getting silently undone. Installing fresh inside the very colony-run
# that's about to consume it means the revision is always present when
# needed, regardless of what any other project's cache GC did in between.
colony-run -a frontend/dist -- "cd frontend && npm ci --no-audit --no-fund >/dev/null 2>&1; npx playwright install chromium >/dev/null 2>&1; set -o pipefail; npm run build 2>&1 | tail -8"
test -f frontend/dist/index.html
ssh colony 'rm -rf ~/work/rfi-web-img && mkdir -p ~/work/rfi-web-img'
git archive HEAD | ssh colony 'tar -x -C ~/work/rfi-web-img'
tar -C frontend -c dist | ssh colony 'tar -x -C ~/work/rfi-web-img/frontend'
ssh colony "cd ~/work/rfi-web-img && sudo -n nice -n 10 docker build -t rfi-web-img:$SHA . >/tmp/docker_build.log 2>&1; code=\$?; tail -5 /tmp/docker_build.log; exit \$code"
ssh colony 'mkdir -p ~/services/rfi-web'
scp -q deploy/graz/docker-compose.yml colony:services/rfi-web/docker-compose.yml
ssh colony "cd ~/services/rfi-web && RFI_WEB_TAG=$SHA sudo -n --preserve-env=RFI_WEB_TAG docker compose -p rfi-web up -d --remove-orphans"
for i in $(seq 1 30); do
  st=$(ssh colony "sudo -n docker inspect -f '{{.State.Health.Status}}' rfi-web-web-1 2>/dev/null" || true)
  [ "$st" = healthy ] && break; sleep 5
done
echo "container health: ${st:-unknown}"
[ "$st" = healthy ] || { echo "deploy failed: rfi-web-web-1 not healthy" >&2; ssh colony 'sudo -n docker logs --tail 20 rfi-web-web-1' >&2; exit 1; }
# keep the last 5 image tags for ./scripts/ship.sh <old sha> rollbacks
ssh colony 'sudo -n docker images rfi-web-img --format "{{.Tag}}" | tail -n +6 | xargs -r -I{} sudo -n docker rmi rfi-web-img:{} >/dev/null 2>&1; rm -rf ~/work/rfi-web-img ~/work/rfi-irfos-web-*; sudo -n docker image prune -f >/dev/null'
