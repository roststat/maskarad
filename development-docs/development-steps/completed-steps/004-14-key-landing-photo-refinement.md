# 004-14 — уточнение фото ключевых посадочных

Дата: 2026-10-04

## Цель

Сделать ключевые SEO-посадочные визуально точнее: `детский сад`, `выпускной`, `мастер-классы`, `кукольный спектакль`.

## Что сделано

- Из FTP-архива старого сайта отобраны и вынесены в `public/images/legacy/` четыре более релевантных изображения:
  - `detskiy-sad-teatr.jpg`;
  - `vypusknoy-detskiy-prazdnik.jpg`;
  - `master-klassy-deti.jpg`;
  - `kukolnyy-spektakl-archive.jpg`.
- В `app/landing-data.ts` обновлены hero-медиа, alt-тексты и подписи для страниц:
  - `/prazdniki/detskiy-sad`;
  - `/prazdniki/vypusknoy`;
  - `/uslugi/master-klassy`;
  - `/uslugi/kukolnyy-spektakl`.
- Убрана слишком общая визуальная подача там, где страница должна сразу подтверждать конкретный формат.

## Доказательства

- `npm run build` прошел успешно; Next.js сгенерировал `68` статических страниц.
- Проверка локального preview на `http://localhost:4311` вернула `200` для `/prazdniki/detskiy-sad`, `/prazdniki/vypusknoy`, `/uslugi/master-klassy`, `/uslugi/kukolnyy-spektakl`.
- HTML этих страниц содержит новые изображения и alt-тексты: `detskiy-sad-teatr`, `vypusknoy-detskiy-prazdnik`, `master-klassy-deti`, `kukolnyy-spektakl-archive`.

## Осталось

- Позже заменить архивные кадры на современные реальные фото, если владелец даст свежий фотоматериал.
- Следующий продуктовый приоритет: новый пакет материалов SEO-портала или надежный канал заявки вместо WhatsApp.
