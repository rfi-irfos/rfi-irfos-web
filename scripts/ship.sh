#!/usr/bin/env bash
# rfi-irfos-web deploy chain: build on the Colony (heavy work never runs on
# the ZBook - npm, Playwright prerender across ~200 routes, docker build all
# need real CPU/RAM), ship the image to the ZBook, push to the Fly registry,
# deploy. Run from the repo root: ./scripts/ship.sh [SHA]
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
colony-run -a frontend/dist -- 'cd frontend && npm ci --no-audit --no-fund >/dev/null 2>&1; set -o pipefail; npm run build 2>&1 | tail -8'
test -f frontend/dist/index.html
ssh colony 'rm -rf ~/work/rfi-web-img && mkdir -p ~/work/rfi-web-img'
git archive HEAD | ssh colony 'tar -x -C ~/work/rfi-web-img'
tar -C frontend -c dist | ssh colony 'tar -x -C ~/work/rfi-web-img/frontend'
ssh colony "cd ~/work/rfi-web-img && sudo -n nice -n 10 docker build -t rfi-web-img:$SHA . >/tmp/docker_build.log 2>&1; code=\$?; tail -5 /tmp/docker_build.log; exit \$code"
ssh colony "sudo -n docker save rfi-web-img:$SHA" | docker load | tail -1
docker tag rfi-web-img:$SHA registry.fly.io/rfi-irfos-web-2:$SHA
fly auth whoami
fly auth docker >/dev/null 2>&1
for i in 1 2 3; do docker push registry.fly.io/rfi-irfos-web-2:$SHA >/tmp/push.log 2>&1 && break; fly auth docker >/dev/null 2>&1; sleep 5; done; tail -2 /tmp/push.log
fly deploy -a rfi-irfos-web-2 --image registry.fly.io/rfi-irfos-web-2:$SHA 2>&1 | tail -6
ssh colony 'rm -rf ~/work/rfi-web-img ~/work/rfi-irfos-web-*; sudo -n docker image prune -f >/dev/null'
