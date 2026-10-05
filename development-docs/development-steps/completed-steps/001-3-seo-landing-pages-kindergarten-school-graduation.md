# 001-3 — SEO-посадочные: детский сад, школа, выпускной

Дата: 2026-10-02.

## Что сделано

- Добавлены новые посадочные страницы:
  - `/prazdniki/detskiy-sad`;
  - `/prazdniki/shkolnyy-prazdnik`;
  - `/prazdniki/vypusknoy`.
- Страницы написаны заново по смыслу старых URL: без механического копирования текстов старого сайта.
- Добавлены точные редиректы:
  - `/detskie-prazdniki/detskii-sad-prazdnik.html` → `/prazdniki/detskiy-sad`;
  - `/detskie-prazdniki/shkolnye-prazdniki.html` → `/prazdniki/shkolnyy-prazdnik`;
  - `/detskie-prazdniki/vypusknoi` → `/prazdniki/vypusknoy`;
  - `/detskie-prazdniki/vypusknoi/index.html` → `/prazdniki/vypusknoy`;
  - `/detskie-prazdniki/vypusknoi/detskii-sad.html` → `/prazdniki/vypusknoy`;
  - `/detskie-prazdniki/vypusknoi/mladsheklassniki.html` → `/prazdniki/vypusknoy`;
  - `/detskie-prazdniki/vypusknoi/starsheklassniki.html` → `/prazdniki/vypusknoy`.
- `MIGRATION_PLAN.md` обновлен: сад, школа и выпускной перенесены из кандидатов в уже вынесенные страницы.

## Доказательства

- `npm run build` прошел успешно.
- `curl -I http://localhost:4310/prazdniki/detskiy-sad` вернул `200 OK`.
- `curl -I http://localhost:4310/prazdniki/shkolnyy-prazdnik` вернул `200 OK`.
- `curl -I http://localhost:4310/prazdniki/vypusknoy` вернул `200 OK`.
- `curl -I http://localhost:4310/detskie-prazdniki/detskii-sad-prazdnik.html` вернул постоянный редирект на `/prazdniki/detskiy-sad`.
- `curl -I http://localhost:4310/detskie-prazdniki/shkolnye-prazdniki.html` вернул постоянный редирект на `/prazdniki/shkolnyy-prazdnik`.
- `curl -I http://localhost:4310/detskie-prazdniki/vypusknoi` вернул постоянный редирект на `/prazdniki/vypusknoy`.
- Локальный `sitemap.xml` содержит `/prazdniki/detskiy-sad`, `/prazdniki/shkolnyy-prazdnik`, `/prazdniki/vypusknoy`.

## Осталось в шаге 001

- Продолжить точечный перенос спектаклей из `show`-URL.
- Продолжить точечный перенос сильных услуг из `service`-URL.
- Для старого `/detskie-prazdniki/vypusknoi/` учесть стандартную нормализацию слэша Next.js: сначала идет переход на URL без слэша, затем на новую посадочную.
