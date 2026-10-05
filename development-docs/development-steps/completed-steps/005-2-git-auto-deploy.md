# 005-2 — Git-автодеплой изолированного контура

## Результат

GitHub-репозиторий `origin/main` стал источником кода для `/opt/maskarad/app`. На сервере установлен отдельный `maskarad-auto-deploy.timer`, который каждые две минуты проверяет новые коммиты. При изменении он запускает `npm ci`, `npm run seo:predeploy` и перезагружает только процесс PM2 `maskarad-site`.

Fractera и Maxflok не входят ни в путь, ни в команды этого сценария.

## Доказательства

- `systemctl` подтвердил: timer `active`, последний запуск сервиса завершился с `Result=success` и `ExecMainStatus=0`.
- `pm2` подтвердил `maskarad-site=online` и `restarts=0` после настройки.
