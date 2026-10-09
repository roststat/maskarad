# 010-1 — способ установки и исходный аудит

2026-10-09. По официальной инструкции Яндекс Метрики для SPA выбран `defer: true` и явный `ym(..., 'hit', path)` при смене страницы. Код счётчика 113579092 предоставлен владельцем. Next.js App Router использует переходы без полной перезагрузки; CMS и тег-менеджер в проекте не используются.

До изменения на сайте не было Метрики, а cookie-баннер и политика явно утверждали отсутствие аналитических cookies. Яндекс подтверждает использование Метрикой cookies и localStorage; Вебвизор может записывать содержимое полей, если его не скрыть. Источники: https://yandex.ru/support/metrica/ru/code/counter-spa-setup, https://yandex.ru/support/metrica/ru/general/cookie-usage.html, https://yandex.ru/support/metrica/ru/webvisor/settings.
