# 004 FAQ — подшаг 3: проверка

2026-10-09. `npm run seo:predeploy` завершился успешно: legal gate, аудит 163 старых URL, 179 редиректов, image alt, TypeScript и production build. Новый `seo:faq-coverage` разобрал 122 HTML-файла из production-сборки по sitemap: на каждом ровно 5 видимых пар вопрос–ответ, один `FAQPage`, 5 `mainEntity`; вопросы и ответы JSON-LD посимвольно совпадают с видимым HTML после декодирования HTML-сущностей. `git diff --check` без ошибок.

После разрешения владельца коммит `e60fc44` отправлен в `origin/main`. Публичный `/spektakli` сначала отдавал старую версию, затем после автодеплоя показал 5 видимых вопросов и 5 элементов `FAQPage`. На публичных `/spektakli/zolushka` и `/stati/kak-vybrat-spektakl-na-den-rozhdeniya` также проверено 5/5 и ровно один `FAQPage`; внешний `npm run seo:prelaunch -- https://maskarad-teatr.ru` прошёл 12/12. Прямой серверный маркер деплоя не читался.
