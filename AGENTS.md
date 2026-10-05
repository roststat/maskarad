# AGENTS.md — вход в проект для агента

Этот файл читается в начале каждой сессии. Он задаёт систему работы, а не продуктовые решения.

## Обязательный вход в сессию

1. Запусти `bash scripts/server/sync-check.sh`.
2. Если проверка говорит, что репозиторий, сервер или рабочее дерево могут быть устаревшими, сначала разберись со свежестью. Не строй по памяти.
3. Прочитай `development-docs/PASSPORT.md`.
4. Прочитай `development-docs/development-steps/current-steps.md`.
5. Если работа касается конкретной области, прочитай соответствующие планы/итоги в `development-docs/development-steps/`.

## Память проекта

| Где | Для чего |
|---|---|
| `development-docs/PASSPORT.md` | что это за проект, зачем он, границы, решения владельца |
| `development-docs/development-steps/current-steps.md` | где работа сейчас и что делать дальше |
| `development-docs/development-steps/new-steps/` | планы предстоящих шагов |
| `development-docs/development-steps/completed-steps/` | итоги завершённых подшагов и шагов |
| `development-docs/reports/` | отчёты по законченным фичам или крупным отказам |
| `development-docs/ANTI-PATTERNS.md` | короткие законы из оплаченных ошибок |
| `development-docs/GLOSSARY.md` | термины предметной области |
| `development-docs/BACKLOG.md` | долги, которые не входят в текущий шаг |
| `development-docs/CANCELLED.md` | отменённые решения и почему они не возвращаются |

## Закон старта

Разработка не начинается, пока из паспорта не понятен минимально достаточный набор данных о проекте. Если в светофоре запуска есть `⛔`, сначала задаются вопросы владельцу.

## Как вести работу

- Любая работа ведётся шагом, даже если правка маленькая.
- Шаг дробится на 2–10 подшагов.
- Подшаг заканчивается результатом, который можно доказать одной строкой.
- У завершённого подшага есть итог в `completed-steps/`.
- После завершения подшага обновляется `current-steps.md`.
- После завершения группы шагов пишется feature report.

## Доказательства

Слово «готово» доступно только после проверки. Хороший итог содержит два доказательства из разных плоскостей: например типы + браузер, API + база, сборка + серверный healthcheck. Если проверка невозможна, это пишется явно.

## Запреты

- Не заводить параллельные папки учёта вроде `Migration/`, `tasks/`, `plans/`.
- Не хранить решения только в чате.
- Не пересказывать решение владельца, если важна формулировка: записывать дословно.
- Не переносить историю другого проекта в новый проект.
- Не трогать секреты и боевые данные без прямого подтверждения владельца.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
