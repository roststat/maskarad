# 001-2 — SEO-посадочные: Пеппи, Пираты, мастер-классы

Дата: 2026-10-02.

## Что сделано

- Добавлены новые посадочные страницы:
  - `/spektakli/peppi-dlinnyy-chulok`;
  - `/spektakli/piraty-karibskogo-morya`;
  - `/uslugi/master-klassy`.
- Для каждой страницы добавлены уникальные `title`, `description`, intro, факты, смысловые блоки, состав услуги/программы, FAQ и внутренние ссылки.
- Добавлены точные редиректы:
  - `/detskii-prazdnik/peppi-dlinnii-chulok.html` → `/spektakli/peppi-dlinnyy-chulok`;
  - `/detskii-prazdnik/piraty-karibskogo-morya.html` → `/spektakli/piraty-karibskogo-morya`;
  - `/detskie-uslugi/master-klassy.html` → `/uslugi/master-klassy`.
- `MIGRATION_PLAN.md` обновлен: эти URL перенесены из кандидатов в уже вынесенные страницы.

## Доказательства

- `npm run build` прошел успешно.
- `curl -I http://localhost:4310/spektakli/peppi-dlinnyy-chulok` вернул `200 OK`.
- `curl -I http://localhost:4310/spektakli/piraty-karibskogo-morya` вернул `200 OK`.
- `curl -I http://localhost:4310/uslugi/master-klassy` вернул `200 OK`.
- `curl -I http://localhost:4310/detskii-prazdnik/peppi-dlinnii-chulok.html` вернул постоянный редирект на `/spektakli/peppi-dlinnyy-chulok`.
- `curl -I http://localhost:4310/detskii-prazdnik/piraty-karibskogo-morya.html` вернул постоянный редирект на `/spektakli/piraty-karibskogo-morya`.
- `curl -I http://localhost:4310/detskie-uslugi/master-klassy.html` вернул постоянный редирект на `/uslugi/master-klassy`.
- Локальный `sitemap.xml` содержит `/spektakli/peppi-dlinnyy-chulok`, `/spektakli/piraty-karibskogo-morya`, `/uslugi/master-klassy`.

## Осталось в шаге 001

- Сделать отдельные посадочные для праздников: детский сад, школа, выпускной.
- При получении архива старого сайта уточнить фактические старые title, description, изображения и тексты без механического копирования.
