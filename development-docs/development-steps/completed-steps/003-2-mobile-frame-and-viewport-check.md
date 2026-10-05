# 003-2 — Мобильный каркас и viewport-проверка

Дата: 2026-10-03.

## Что сделано

- Добавлена мобильная нижняя панель быстрых действий:
  - `Позвонить`;
  - `Оставить заявку`.
- На мобильном экране скрыты hero-кнопки главной, чтобы не дублировать нижнюю панель и не создавать перекрытий.
- Уменьшен размер hero-заголовков на узких экранах.
- Проверены mobile и desktop viewport главной страницы.

## Доказательства

- `npm run build` прошел успешно.
- Viewport `390×844`:
  - `hasHorizontalOverflow: false`;
  - `.mobile-quick-actions`: `display: grid`;
  - `.hero .hero-actions`: `display: none`;
  - `scrollWidth: 390`, `clientWidth: 390`.
- Viewport `1440×1000`:
  - `hasHorizontalOverflow: false`;
  - `.mobile-quick-actions`: `display: none`;
  - `.hero .hero-actions`: `display: flex`;
  - `scrollWidth: 1440`, `clientWidth: 1440`.
- Скриншоты:
  - `development-docs/reports/003-mobile-ux/home-mobile-390-final.png`;
  - `development-docs/reports/003-mobile-ux/home-desktop-1440-final.png`.

## Следующее

- Проверить мобильный вид SEO-посадочной, каталога и формы заявки.
- Продолжить привязку тематических фото к посадочным.
- Выбрать канал доставки формы заявки.
