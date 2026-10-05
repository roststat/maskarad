# 004-23 — индексационный слой и metadata

Дата: 2026-10-04

## Задача

Усилить базовый слой индексации SEO-портала: `robots.txt`, `sitemap.xml`, canonical, Open Graph и Twitter metadata для главной, каталогов, посадочных, хабов и материалов.

## Сделано

- `robots.txt` закрывает служебный `/api/`, оставляет публичный сайт открытым и указывает sitemap.
- `sitemap.xml` получил стабильные `lastmod`, `changefreq` и `priority` для главной, посадочных, каталогов, хабов и материалов.
- Root metadata получила canonical, Open Graph и Twitter preview для главной.
- Динамические страницы получили Open Graph/Twitter metadata:
  - статьи, подборки и кейсы отдаются как `article`;
  - посадочные и хабы отдаются как `website`;
  - посадочные используют свою hero-картинку, если она задана.

## Доказательства

- `npm run build` прошел успешно: Next.js собрал `84/84` статические страницы, `/robots.txt` и `/sitemap.xml`.
- Локальная проверка `http://localhost:4311/robots.txt` показала `Disallow: /api/`, `Host: https://maskarad-teatr.ru`, `Sitemap: https://maskarad-teatr.ru/sitemap.xml`.
- Локальная проверка `http://localhost:4311/sitemap.xml` показала `lastmod`, `changefreq` и `priority`, включая новые страницы портала.
- Локальная проверка meta-тегов:
  - `/` отдает canonical `https://maskarad-teatr.ru`, `og:type=website`, `twitter:card=summary_large_image`;
  - `/stati/kak-vybrat-spektakl-na-den-rozhdeniya` отдает `og:type=article`;
  - `/spektakli/zolushka` отдает `og:image=https://maskarad-teatr.ru/images/legacy/teatr-zolushka.jpg`;
  - `/stati` отдает canonical и social preview хаба.

## Следствие

Перед будущей заменой старого сайта у нового проекта уже есть базовая карта для поисковых роботов и превью-слой для ссылок. Следующий крупный SEO-блок логично делать вокруг pre-launch checklist: production preview, 301, Вебмастер/Метрика, Search Console, финальная сверка sitemap и robots на домене.
