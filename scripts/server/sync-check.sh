#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

status=0

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git remote get-url origin >/dev/null 2>&1; then
    if git fetch --quiet origin; then
      branch="$(git rev-parse --abbrev-ref HEAD)"
      upstream="origin/${branch}"
      if git rev-parse --verify "$upstream" >/dev/null 2>&1; then
        local_sha="$(git rev-parse HEAD)"
        remote_sha="$(git rev-parse "$upstream")"
        if [ "$local_sha" = "$remote_sha" ]; then
          echo "✅ РЕПОЗИТОРИЙ: синхронизирован с $upstream."
        else
          echo "❌ РЕПОЗИТОРИЙ: локальный HEAD отличается от $upstream."
          status=1
        fi
      else
        echo "⚠️  РЕПОЗИТОРИЙ: upstream $upstream не найден."
      fi
    else
      echo "❌ РЕПОЗИТОРИЙ: fetch origin не удался."
      status=1
    fi
  else
    echo "⚠️  РЕПОЗИТОРИЙ: origin не настроен."
  fi
else
  echo "⚠️  РЕПОЗИТОРИЙ: это ещё не git-репозиторий."
fi

if [ -n "${APP_HEALTH_URL:-}" ]; then
  if command -v curl >/dev/null 2>&1; then
    if curl -fsS --max-time 10 "$APP_HEALTH_URL" >/tmp/project-health.$$ 2>/tmp/project-health-err.$$; then
      echo "✅ СЕРВЕР: health ответил ($APP_HEALTH_URL)."
      rm -f /tmp/project-health.$$ /tmp/project-health-err.$$
    else
      echo "⚠️  СЕРВЕР: health не ответил ($APP_HEALTH_URL)."
      status=1
      rm -f /tmp/project-health.$$ /tmp/project-health-err.$$
    fi
  else
    echo "⚠️  СЕРВЕР: curl не найден, health не проверен."
  fi
else
  echo "⚠️  СЕРВЕР: APP_HEALTH_URL не задан, сервер не проверялся."
fi

if [ "$status" -eq 0 ]; then
  echo "===SYNC_OK==="
else
  echo "===SYNC_STALE==="
fi
exit "$status"
