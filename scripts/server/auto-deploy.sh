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
git fetch --quiet origin "$BRANCH"

current_commit="$(git rev-parse HEAD)"
target_commit="$(git rev-parse "origin/$BRANCH")"
[ "$current_commit" = "$target_commit" ] && exit 0

git reset --hard "$target_commit"
npm ci
npm run seo:predeploy
pm2 reload "$PROCESS" --update-env
printf '===MASKARAD_AUTO_DEPLOY_OK=== %s\n' "$target_commit"
