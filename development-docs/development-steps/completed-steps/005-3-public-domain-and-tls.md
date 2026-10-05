# 005-3 — Публичный домен и HTTPS

## Результат

После переноса DNS создан отдельный Nginx-виртуальный хост для `maskarad-teatr.ru` и `www.maskarad-teatr.ru`. Он проксирует только в изолированное приложение `maskarad-site` на `127.0.0.1:3200`.

Для обоих имён выпущен Let’s Encrypt-сертификат с автоматическим продлением. HTTP перенаправляет посетителей на HTTPS.

## Доказательства

- `http://maskarad-teatr.ru/` вернул `301` на HTTPS; `https://maskarad-teatr.ru/` и `/sitemap.xml` вернули `200`.
- Старый `/detskie-prazdniki/film.html` на публичном домене вернул `308` на релевантную статью.
- `pm2` подтвердил статусы `online` для `maskarad-site`, `maxflok-site` и `fractera-app`.
