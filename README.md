# Маскарад — Next.js сайт

Первая современная версия сайта детского выездного театра «Маскарад» под Vercel.

Vercel URL: https://msk-maskarad-c02trzuis-mintallart-9640.vercel.app/

## Локальная работа

Перед началом сессии:

```bash
bash scripts/server/sync-check.sh
```

После проверки свежести читать:

1. `AGENTS.md` — правила работы агента в проекте.
2. `development-docs/PASSPORT.md` — рабочий паспорт проекта по системе стартера.
3. `development-docs/development-steps/current-steps.md` — текущий шаг и ближайшее действие.
4. `PROJECT_PASSPORT.md`, `MIGRATION_PLAN.md`, `POSITIONING_AND_SEO_STRATEGY.md` — продуктовый контекст Маскарада.

```bash
npm install
npm run dev
```

Локальный порт проекта «Маскарад» зарезервирован как `4310`, чтобы не конфликтовать с другими проектами на `3000`, `3001` или `3002`.

Локальный адрес:

```text
http://localhost:4310
```

Production-проверка:

```bash
npm run build
```

Проверка перед деплоем:

```bash
npm run seo:predeploy
```

Она проверяет покрытие старых URL, карту 301-редиректов, `alt` у изображений, TypeScript и production-сборку.

После публикации на открытом preview:

```bash
npm run seo:prelaunch -- https://your-vercel-preview.example
```

Preview должен быть доступен без страницы авторизации Vercel, иначе SEO-проверка не сможет получить robots, sitemap и HTML.

## Канал заявок

Форма заявки отправляет данные в `/api/leads`. Для production нужно задать переменную окружения:

```text
LEAD_WEBHOOK_URL=https://example.com/lead-webhook
```

Webhook должен принимать `POST` JSON. Без этой переменной форма показывает запасные действия: звонок, мессенджер и копирование текста заявки. WhatsApp не считать рабочим каналом для РФ: fallback нужно перенастроить вместе с CRM на отдельном шаге заявок.

## Публикация на Vercel

Проект уже опубликован на Vercel:

```text
https://msk-maskarad-c02trzuis-mintallart-9640.vercel.app/
```

Следующие шаги:

1. Проверить сайт на Vercel URL.
2. После проверки подключить домен `maskarad-teatr.ru`.
3. Убедиться, что старые URL отдают 301-редиректы на новые разделы.

Карта переноса старого сайта и список важных SEO-страниц лежат в `MIGRATION_PLAN.md`.

Полный паспорт проекта, правила по портам и этапы дальнейшей разработки лежат в `PROJECT_PASSPORT.md`.

Смысловая стратегия сайта, акцент на театрализованные праздники и будущие SEO-страницы описаны в `POSITIONING_AND_SEO_STRATEGY.md`.

Публично найденные материалы и идеи из Instagram `@maskarad_teatr` собраны в `INSTAGRAM_CONTENT_NOTES.md`.

## Система памяти проекта

В проект добавлена документация из стартера проектов. Она не заменяет продуктовые документы Маскарада, а задает порядок работы:

- `AGENTS.md` — постоянные правила входа в проект.
- `development-docs/PASSPORT.md` — краткий паспорт проекта с источниками фактов.
- `development-docs/development-steps/current-steps.md` — где работа сейчас.
- `development-docs/development-steps/new-steps/` — планы следующих шагов.
- `development-docs/development-steps/completed-steps/` — итоги закрытых подшагов.
- `development-docs/reports/` — отчеты по законченным фичам или крупным отказам.
- `development-docs/BACKLOG.md` — долги, которые не входят в текущий шаг.
- `development-docs/ANTI-PATTERNS.md` — короткие законы из ошибок.

Правило: решения по проекту не оставлять только в чате. После значимого решения обновлять паспорт, текущий шаг, backlog или профильный документ.
