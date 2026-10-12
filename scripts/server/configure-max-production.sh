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

printf '%s\n%s\n' "$max_token" "$max_chat_id" |
  ssh -p 2222 -o BatchMode=yes -o ConnectTimeout=20 avtozabota-test \
    "cd /opt/maskarad/app && node scripts/server/update-max-env.mjs && pm2 reload maskarad-site && pm2 save --force"

unset max_token
printf 'MAX подключён к production-процессу.\n'
