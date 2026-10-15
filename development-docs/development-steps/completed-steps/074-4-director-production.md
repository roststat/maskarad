# 074-4 — Публикация страницы художественного руководителя

15 октября 2026. Версия приложения `dab38df` отправлена в origin/main и опубликована штатным автодеплоем. Серверные HEAD и маркер `.git/maskarad-last-successful-deploy` совпали; systemd Result=success, журнал подтвердил полный SEO gate (124 URL) и reload только `maskarad-site`.

Публичная страница, sitemap и портрет ответили успешно. Проверены один H1, пять VK iframe, canonical, ProfilePage/Person, FAQPage, BreadcrumbList. Публичный портрет побайтово совпал с переданным файлом. В браузере на основном домене видны корректный первый экран, портрет и лонгрид.

Доказательства: серверный HEAD/маркер и журнал + HTTP/HTML/sitemap и публичный браузер. Машинный итог — `development-docs/reports/074-public-verification.json`. Именная индексация и позиции ещё не подтверждены.
