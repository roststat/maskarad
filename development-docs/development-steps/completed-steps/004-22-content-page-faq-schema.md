# 004-22 — FAQ schema для SEO-материалов

Дата: 2026-10-04

## Что сделано

Для SEO-материалов добавлена schema.org-разметка `FAQPage`.

Разметка строится из уже видимого блока FAQ на странице, поэтому поисковику отдается тот же контент, который видит пользователь:

- `FAQPage`;
- `Question`;
- `Answer`;
- `@id` вида `https://maskarad-teatr.ru/...#faq`.

Разметка подключена к статьям, подборкам и кейсам. На хабах `/stati`, `/podboroki`, `/kejsy` она не добавляется, потому что там нет видимого FAQ-блока.

## Доказательства

- `npm run build` прошел успешно; Next.js сгенерировал `84/84` статических страниц.
- Проверка JSON-LD локального preview показала:
  - `/stati/kak-vybrat-spektakl-na-den-rozhdeniya`: `FAQPage`, 2 вопроса;
  - `/podboroki/spektakli-dlya-5-7-let`: `FAQPage`, 2 вопроса;
  - `/kejsy/piratskiy-den-rozhdeniya-7-let`: `FAQPage`, 2 вопроса;
  - `/stati`: `FAQPage` отсутствует, как и должно быть для хаба.
- HTTP-проверка локального preview вернула `200` для проверенных материалов и `/stati`.
- CDP-проверка viewport `390×844` для трех материалов и `/stati` показала `scrollWidth=390`, `bodyScrollWidth=390`, `hasHorizontal=false`.

## Что дальше

Следующий полезный блок — проверить и усилить индексационный слой: `robots.txt`, sitemap-поля, canonical и базовые Open Graph/Twitter metadata для ключевых страниц.
