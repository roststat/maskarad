# 001-8 — оставшиеся сильные посадочные услуг

## Задача

Закрыть оставшиеся сильные `service`-URL старого сайта, которые уже были видны в карте миграции: фото, видео, кейтеринг, специальные эффекты и аттракционы.

## Что сделано

- Добавлена страница `/uslugi/foto-video`, объединяющая старые страницы фотосъемки и видеосъемки.
- Добавлена страница `/uslugi/keytering` для кейтеринга.
- Добавлена страница `/uslugi/spetsialnye-effekty` для дымовых, снежных, конфетти и других эффектов.
- Добавлена страница `/uslugi/attraktsiony` для активных игровых зон и аттракционов.
- Карточки каталога `/uslugi` теперь ведут на эти страницы, поэтому в разделе услуг больше нет черновых карточек.
- Из FTP-архива перенесены исходные изображения старых страниц в `public/images/legacy/`.
- Добавлены точные постоянные редиректы со старых URL:
  - `/detskie-uslugi/foto.html` → `/uslugi/foto-video`;
  - `/detskie-uslugi/video.html` → `/uslugi/foto-video`;
  - `/detskie-uslugi/keitering.html` → `/uslugi/keytering`;
  - `/detskie-uslugi/spetsialnye-effekty.html` → `/uslugi/spetsialnye-effekty`;
  - `/detskie-uslugi/attraktsiony.html` → `/uslugi/attraktsiony`.

## Доказательства

- `npm run build` прошел успешно.
- Локальная production-проверка вернула `200 OK` для `/uslugi/foto-video`, `/uslugi/keytering`, `/uslugi/spetsialnye-effekty`, `/uslugi/attraktsiony`.
- Старые URL вернули постоянный редирект на новые страницы.
- `sitemap.xml` содержит `/uslugi/foto-video`, `/uslugi/keytering`, `/uslugi/spetsialnye-effekty`, `/uslugi/attraktsiony`.
- HTML `/uslugi` содержит ссылки на все новые карточки и показывает `10 страниц уже раскрыты подробно`, `без черновых карточек`.

## Следствие

Кластер услуг стал полноценной SEO-развилкой: пользователь видит объем агентства, а поисковые старые URL получают точные новые цели вместо общего редиректа на каталог.
