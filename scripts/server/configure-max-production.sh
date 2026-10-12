#!/usr/bin/env bash
set -euo pipefail

read -r -s -p "Токен MAX (ввод скрыт): " max_token
printf '\n'
read -r -p "MAX_CHAT_ID закрытой группы: " max_chat_id

if [[ ! "$max_token" =~ ^[^[:space:]]{20,}$ ]]; then
  printf 'Токен отсутствует или имеет неверный формат.\n' >&2
  exit 1
fi
if [[ ! "$max_chat_id" =~ ^-?[0-9]+$ ]]; then
  printf 'MAX_CHAT_ID должен быть числом.\n' >&2
  exit 1
fi

configured=false
for attempt in 1 2 3; do
  if printf '%s\n%s\n' "$max_token" "$max_chat_id" |
    ssh -p 2222 \
      -o BatchMode=yes \
      -o ConnectTimeout=45 \
      -o ServerAliveInterval=10 \
      -o ServerAliveCountMax=3 \
      avtozabota-test \
      "cd /opt/maskarad/app && node scripts/server/update-max-env.mjs && pm2 reload maskarad-site && pm2 save --force"; then
    configured=true
    break
  fi
  printf 'SSH недоступен, повтор %s из 3…\n' "$attempt" >&2
  sleep 5
done

unset max_token
if [[ "$configured" != true ]]; then
  printf 'VPS не принял SSH-соединение после трёх попыток. Настройки не изменены.\n' >&2
  exit 1
fi
printf 'MAX подключён к production-процессу.\n'
