# 011-2 — локальная HTML-проверка

9 октября 2026 года проверена production-сборка `.next/server/app/index.html`: `<meta name="yandex-verification" content="9b3ead6f9d06c9c0"` встречается ровно один раз и находится до `</head>`.

После разрешения владельца коммит `5e06bc2` отправлен в `origin/main`. Публичный HTML `https://maskarad-teatr.ru/` содержит код ровно один раз внутри `<head>`. Внешний `npm run seo:prelaunch -- https://maskarad-teatr.ru` прошёл 12/12. Владелец должен нажать «Подтвердить» в кабинете Вебмастера; статус прав из кабинета нами не проверен.
