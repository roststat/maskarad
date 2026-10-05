# 004-60 — Информационная посадочная для праздника на теплоходе

## Результат

Добавлена страница `/prazdniki/detskiy-prazdnik-na-teplohode`.

Она переносит поисковый интент архивной аренды теплоходов без неподтвержденного обещания услуги: объясняет порядок проверки судна и договора, безопасность детей, маршрут, погоду, питание и запасной план.

На страницу направлены четыре варианта старого URL:

- `/detskie-uslugi/arenda-teplohodov.html`;
- `/detskie-uslugi/arenda-teplohodov/`;
- `/detskie-uslugi/arenda-teplohodov/index.html`;
- `/detskie-uslugi/arenda-teplohodov/vatel.html`.

## Доказательства

- `npm run seo:predeploy` прошел: покрытие 163 внутренних старых URL, аудит 179 правил, alt, TypeScript и production-сборка 125 статических страниц.
- `npm run seo:migration-relevance` показал 31 широкое тематическое назначение вместо 35; URL, покрытых только catch-all-правилом, нет.
