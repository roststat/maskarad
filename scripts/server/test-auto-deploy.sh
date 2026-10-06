#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$(mktemp -d)"
export MASKARAD_APP_DIR="$TEST_DIR"
export MASKARAD_DEPLOY_LOCK="$TEST_DIR/lock"
export MASKARAD_DEPLOY_STATE="$TEST_DIR/deployed"
export TEST_LOG="$TEST_DIR/calls"
export TEST_COMMIT="0123456789abcdef"
mkdir -p "$TEST_DIR/.next/types"
touch "$TEST_DIR/.next/types/old-validator.ts"

git() {
  case "$*" in
    "rev-parse HEAD"|"rev-parse origin/main") printf '%s\n' "$TEST_COMMIT" ;;
    "fetch --quiet origin main") return 0 ;;
    *) printf 'Unexpected git command: %s\n' "$*" >&2; return 1 ;;
  esac
}

flock() { return 0; }
npm() {
  printf 'npm %s\n' "$*" >>"$TEST_LOG"
  [ "$*" = "run seo:predeploy" ] && touch "$MASKARAD_APP_DIR/.next/BUILD_ID"
  return 0
}
pm2() {
  printf 'pm2 %s\n' "$*" >>"$TEST_LOG"
  [ "${FAIL_RELOAD:-0}" = 0 ]
}
export -f git flock npm pm2

export FAIL_RELOAD=1
if bash "$SCRIPT_DIR/auto-deploy.sh" >/dev/null 2>&1; then
  printf 'Expected the first reload to fail\n' >&2
  exit 1
fi
[ ! -e "$MASKARAD_DEPLOY_STATE" ]
[ ! -e "$TEST_DIR/.next/types/old-validator.ts" ]
[ -f "$TEST_DIR/.next/BUILD_ID" ]

export FAIL_RELOAD=0
bash "$SCRIPT_DIR/auto-deploy.sh" >/dev/null
[ "$(cat "$MASKARAD_DEPLOY_STATE")" = "$TEST_COMMIT" ]

bash "$SCRIPT_DIR/auto-deploy.sh" >/dev/null
[ "$(wc -l <"$TEST_LOG")" -eq 6 ]

rm "$TEST_DIR/.next/BUILD_ID"
bash "$SCRIPT_DIR/auto-deploy.sh" >/dev/null
[ "$(wc -l <"$TEST_LOG")" -eq 9 ]

printf 'Auto-deploy retry test passed\n'
