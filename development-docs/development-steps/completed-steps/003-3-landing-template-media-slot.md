# 003-3 — Медиа-слот в шаблоне SEO-посадочной

Дата: 2026-10-03.

## Что сделано

- В тип `LandingPage` добавлено поле `media`:
  - `src`;
  - `alt`;
  - `caption`.
- Шаблон SEO-посадочной в `app/[...slug]/page.tsx` теперь умеет показывать hero-блок с текстом и тематическим изображением.
- Медиа привязаны к ключевым посадочным:
  - `/spektakli/zolushka`;
  - `/spektakli/alisa-v-strane-chudes`;
  - `/spektakli/peppi-dlinnyy-chulok`;
  - `/spektakli/piraty-karibskogo-morya`;
  - `/prazdniki/detskiy-den-rozhdeniya`;
  - `/prazdniki/detskiy-sad`;
  - `/prazdniki/shkolnyy-prazdnik`;
  - `/prazdniki/vypusknoy`;
  - `/uslugi/akvagrim`;
  - `/uslugi/shou-mylnyh-puzyrey`;
  - `/uslugi/master-klassy`.
- На мобильном hero-кнопки верхних секций скрываются, чтобы не дублировать нижнюю панель быстрых действий.

## Доказательства

- `npm run build` прошел успешно.
- `/spektakli/zolushka` локально отвечает `200 OK`.
- Viewport `/spektakli/zolushka` `390×844`:
  - `hasHorizontalOverflow: false`;
  - `hasLandingMedia: true`;
  - `.mobile-quick-actions`: `display: grid`;
  - `.landing-hero .hero-actions`: `display: none`;
  - `scrollWidth: 390`, `clientWidth: 390`.
- Viewport `/spektakli/zolushka` `1440×1000`:
  - `hasHorizontalOverflow: false`;
  - `hasLandingMedia: true`;
  - `.mobile-quick-actions`: `display: none`;
  - `.landing-hero .hero-actions`: `display: flex`.
- Скриншоты:
  - `development-docs/reports/003-landing-template/zolushka-mobile-390-final.png`;
  - `development-docs/reports/003-landing-template/zolushka-desktop-1440.png`.

## Следующее

- Проверить мобильный вид каталога и формы заявки.
- Отобрать более точные фото для страниц `детский сад`, `выпускной`, `мастер-классы`, если в архиве есть лучшие варианты.
- Продолжить перенос сильных спектаклей и услуг из старой SEO-карты.
