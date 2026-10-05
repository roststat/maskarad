# 003-6 — Исправление app icon перед доменом

Дата: 2026-10-03.

## Что сделано

- Исправлена настройка favicon/icon по правилам Next.js 16.
- `app/favicon.svg` заменен на `app/icon.svg`, потому что `favicon` в `app/` поддерживает только `.ico`, а SVG должен идти через convention `icon.svg`.
- Из `metadata` удалена ручная ссылка `icons.icon: "/favicon.svg"`, которая давала локальный `404`.

## Доказательства

- `npm run build` прошел успешно.
- В production route list появился `/icon.svg`.
- `curl -I http://localhost:4310/icon.svg` вернул `200 OK`.
- HTML главной содержит `<link rel="icon" href="/icon.svg?...">`.

## Следующее

- В финальной UI-polish фазе проверить отсутствие других 404 по статике.
