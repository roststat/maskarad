# 004-21 — ItemList schema для хабов SEO-портала

Дата: 2026-10-04

## Что сделано

Для хабов SEO-портала добавлена schema.org-разметка `ItemList`.

Теперь `/stati`, `/podboroki` и `/kejsy` отдают в JSON-LD не только `WebPage` и `BreadcrumbList`, но и структурированный список материалов с:

- `position`;
- `url`;
- `name`;
- `description`;
- `numberOfItems`.

Это помогает поисковику видеть хаб как список связанных материалов, а не просто страницу с набором ссылок.

## Доказательства

- `npm run build` прошел успешно; Next.js сгенерировал `84/84` статических страниц.
- HTML `/stati` содержит `WebPage`, `ItemList`, `BreadcrumbList` и `numberOfItems: 22`.
- Проверка JSON-LD локального preview показала:
  - `/stati`: `ItemList`, `numberOfItems: 22`;
  - `/podboroki`: `ItemList`, `numberOfItems: 17`;
  - `/kejsy`: `ItemList`, `numberOfItems: 2`.
- HTTP-проверка локального preview вернула `200` для `/stati`, `/podboroki`, `/kejsy`.
- CDP-проверка viewport `390×844` для трех хабов показала `scrollWidth=390`, `bodyScrollWidth=390`, `hasHorizontal=false`.

## Что дальше

Следующий полезный блок — добавить FAQ schema для SEO-материалов, где уже есть видимый FAQ. Это усилит статьи, подборки и кейсы без изменения интерфейса.
