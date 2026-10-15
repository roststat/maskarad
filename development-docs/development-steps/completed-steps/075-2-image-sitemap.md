# 075-2 — Портрет в карте сайта и поисковые превью

15 октября 2026. В записи персональной страницы sitemap добавлен image:loc с оригиналом портрета. Для страницы разрешены крупные изображения, текстовые и видео-превью без искусственных лимитов через max-image-preview:large, max-snippet:-1, max-video-preview:-1.

Доказательства: полный seo:predeploy успешен (124 URL, типы, сборка, FAQ, редиректы и alt); собранные XML/HTML отдельно проверены парсером. Сохранены один H1, пять iframe, canonical и Person/ProfilePage. Видимая страница не менялась, повторный визуальный просмотр не требуется.

Основание: документация установленной Next.js о sitemap images и документация Google https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps . Отдельный video sitemap с выдуманными uploadDate/thumbnail не создавался.
