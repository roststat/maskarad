# 075-3 — SEO-настройки опубликованы и проверены

15 октября 2026. Приложение `36360ad` опубликовано через origin/main и штатный maskarad-auto-deploy.service. Серверный HEAD и маркер успешного выпуска совпадают, Result=success.

Внешний seo:prelaunch прошёл 12/12. Дополнительно запрос с User-Agent Googlebot получил 200 без X-Robots-Tag noindex. Проверены canonical, один именной профиль Person/ProfilePage, FAQPage/BreadcrumbList, пять iframe, разрешения на крупные превью и image:loc портрета в sitemap. В sitemap 124 URL. Машинный итог: `development-docs/reports/075-public-seo-verification.json`.

Search Console принимал тот же адрес sitemap в 064; актуальная обработка новой страницы и её индексация не подтверждены. Ручной запрос на переобход не отправлен: инструмент управления браузером остановил сессию из-за запрета текущего URL. Обходить запрет не пытались. Страница и её портрет открыты для автоматического обхода.

Доказательства: серверный HEAD/маркер и systemd success + публичные HTML/XML/robots и внешний SEO smoke-test. Видимая страница не менялась относительно браузерной проверки 074.
