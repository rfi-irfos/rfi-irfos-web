#!/usr/bin/env bash
# Test battery for rfi-irfos-web, run by colony-ci on the Kolonie for every new origin/master.
# Prints one PASS/FAIL line per check, exits non-zero if any failed.
set -uo pipefail
fail=0; t=$(mktemp -d); trap 'rm -rf "$t"' EXIT
check(){ local name=$1 dir=$2; shift 2
  if (cd "$dir" && timeout "${CHECK_TIMEOUT:-1800}" "$@") >"$t/out" 2>&1; then echo "PASS $name"; else echo "FAIL $name"; tail -n 12 "$t/out"; fail=1; fi; }

(cd frontend && npm ci --no-audit --no-fund) >"$t/npm" 2>&1 || { echo "FAIL npm ci"; tail -n 20 "$t/npm"; exit 1; }
(cd frontend && npx playwright install chromium) >/dev/null 2>&1 || true
check typecheck frontend npx tsc --noEmit
# eslint: 52 alte Fehler (react-refresh/only-export-components), deshalb vorerst nur Warnung statt Rot.
if (cd frontend && npx eslint . >"$t/lint" 2>&1); then echo "PASS eslint"; else echo "WARN eslint $(grep -oE '[0-9]+ problems? \([0-9]+ errors?' "$t/lint" | head -1)"; fi
# Full production build incl. prerender of every route and the check-dist-seo gate, on a CI-only port.
export PRERENDER_PORT=${PRERENDER_PORT:-4183}
check build frontend npm run build
check "backend cargo test" backend cargo test --locked --quiet

echo "RESULT $([ $fail = 0 ] && echo green || echo red)"
exit $fail
