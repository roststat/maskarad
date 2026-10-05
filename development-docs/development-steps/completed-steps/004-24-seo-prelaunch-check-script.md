# 004-24 — SEO pre-launch check

Дата: 2026-10-04

## Задача

Добавить воспроизводимую проверку перед переносом домена и перед production-деплоем, чтобы не держать критические SEO-проверки только в чате.

## Сделано

- Добавлен скрипт `scripts/seo/prelaunch-check.mjs`.
- Добавлена npm-команда `npm run seo:prelaunch`.
- Скрипт можно запускать:
  - без аргументов против локального preview `http://localhost:4311`;
  - с URL аргументом против Vercel preview или боевого домена;
  - через `SEO_CHECK_BASE_URL`.
- Проверяются:
  - `robots.txt`;
  - `sitemap.xml`;
  - canonical, Open Graph и Twitter metadata для главной, хаба, статьи и посадочной;
  - несколько критичных старых 301-редиректов.

## Доказательства

- `npm run seo:prelaunch` против `http://localhost:4311` прошел успешно: `SEO prelaunch check passed: 11/11`.
- `npm run build` прошел успешно: Next.js собрал `84/84` статические страницы.

## Следствие

Перед заменой старого сайта можно запускать один короткий smoke-test и быстро видеть, не сломались ли sitemap, robots, metadata или ключевые редиректы.
