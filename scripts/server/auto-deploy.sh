#!/usr/bin/env bash
# Автодеплой только для изолированного контура «Маскарада».
set -euo pipefail

APP_DIR="${MASKARAD_APP_DIR:-/opt/maskarad/app}"
BRANCH="${MASKARAD_DEPLOY_BRANCH:-main}"
PROCESS="${MASKARAD_PM2_PROCESS:-maskarad-site}"
LOCK_FILE="${MASKARAD_DEPLOY_LOCK:-/var/lock/maskarad-deploy.lock}"

exec 9>"$LOCK_FILE"
flock -n 9 || exit 0

cd "$APP_DIR"
STATE_FILE="${MASKARAD_DEPLOY_STATE:-$(git rev-parse --git-path maskarad-last-successful-deploy)}"
git fetch --quiet origin "$BRANCH"

current_commit="$(git rev-parse HEAD)"
target_commit="$(git rev-parse "origin/$BRANCH")"
deployed_commit="$(cat "$STATE_FILE" 2>/dev/null || true)"
[ "$current_commit" = "$target_commit" ] && [ "$deployed_commit" = "$target_commit" ] && [ -f .next/BUILD_ID ] && exit 0

[ "$current_commit" = "$target_commit" ] || git reset --hard "$target_commit"
npm ci
# Route validators from an older build can reference pages removed in this commit.
rm -rf .next/types
npm run seo:predeploy
pm2 reload "$PROCESS" --update-env
printf '%s\n' "$target_commit" >"$STATE_FILE.tmp"
mv "$STATE_FILE.tmp" "$STATE_FILE"
printf '===MASKARAD_AUTO_DEPLOY_OK=== %s\n' "$target_commit"
