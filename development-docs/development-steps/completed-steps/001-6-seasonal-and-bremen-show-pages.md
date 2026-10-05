# 001-6 — Бременские музыканты и новогодний спектакль-кластер

Дата завершения: 2026-10-03.

## Что сделано

Добавлены отдельные SEO-посадочные:

- `/spektakli/bremenskie-muzykanty`;
- `/spektakli/novogodnyaya-belosnezhka`;
- `/spektakli/novogodnie-spektakli`.

Тексты написаны заново: старые URL, заголовки и метаданные использованы только как источник направления и поискового интента.

## Редиректы

Добавлены точные постоянные редиректы:

- `/detskii-prazdnik/bremenskie-muzykanty.html` → `/spektakli/bremenskie-muzykanty`;
- `/detskii-prazdnik/novogodnyaya-belosnezhka.html` → `/spektakli/novogodnyaya-belosnezhka`;
- `/detskii-prazdnik/novyi-god/` → `/spektakli/novogodnie-spektakli`;
- `/detskii-prazdnik/novyi-god/index.html` → `/spektakli/novogodnie-spektakli`.

Для `/detskii-prazdnik/novyi-god/` Next.js сначала нормализует trailing slash до `/detskii-prazdnik/novyi-god`, затем срабатывает точный редирект на новую страницу.

## Медиа

Из FTP-архива старого сайта в `public/images/legacy/` добавлены:

- `bremenskie-muzykanty.jpg`;
- `novogodnyaya-belosnezhka.jpg`;
- `novogodnie-spektakli.jpg`.

## Доказательства

- `npm run build` прошел успешно; количество статических страниц выросло до 33.
- Локальный сервер `4311` вернул `200 OK` для всех трех новых страниц.
- Старые URL вернули постоянные редиректы на новые страницы.
- `sitemap.xml` содержит все три новых URL.

## Что осталось

- Следующий SEO-пакет логично делать по услугам из `service`-URL: `Цирковые фокусы`, `Кукольные спектакли`, `Оформление шарами`.
- Отдельно проверить мобильный вид каталога `/spektakli`, потому что после расширения он стал значительно длиннее.
