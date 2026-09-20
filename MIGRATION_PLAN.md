# Карта переноса сайта maskarad-teatr.ru

## Что проверено

- Текущая папка была пустой и не являлась git-репозиторием.
- Признаков проекта «Автозаботы» в папке нет.
- Старый сайт использован как источник контента: главная, навигация, списки спектаклей, услуг, праздников, цены, отзывы, пресса, фото и контакты.

## Новая структура

- `/` — главная страница с позиционированием, быстрым выбором направления и заявкой.
- `/spektakli` — интерактивные спектакли и сказочные программы.
- `/uslugi` — дополнительные услуги для праздника.
- `/prazdniki` — типы детских праздников.
- `/tseny` — цены, форматы и скидка 10% при повторном заказе.
- `/otzyvy-pressa` — отзывы, пресса, клиенты.
- `/foto-video` — фото и видео.
- `/kontakty` — контакты и заявка.
- `/o-teatre` — страница о театре.

## Старые разделы и куда они переезжают

- `/maskarad/index.html` → `/o-teatre`
- `/maskarad/price.html` → `/tseny`
- `/maskarad/zakaz.html` → `/kontakty`
- `/maskarad/contacts.html` → `/kontakty`
- `/maskarad/kniga-otzyvov.html` → `/otzyvy-pressa`
- `/maskarad/pressa.html` → `/otzyvy-pressa`
- `/foto/` → `/foto-video`
- `/detskie-uslugi/*` → `/uslugi`
- `/detskie-prazdniki/*` → `/prazdniki`
- `/detskii-prazdnik/*` → `/spektakli`
- `/detkii-prazdnik/*` → `/spektakli` для старой опечатки в URL.
- `/teatr/spektakl/*` → `/spektakli`
- `/scenarii/*` → `/prazdniki`

Эти правила уже добавлены в `next.config.ts`.

## SEO-страницы, которые важно сохранить через URL или редиректы

При первой публикации достаточно 301-редиректов на новые разделы. На следующем этапе лучше сделать отдельные посадочные страницы для самых ценных запросов:

- `/detskie-prazdniki/detskii-den-rozhdeniya.html` — день рождения ребенка.
- `/detskie-prazdniki/detskii-sad-prazdnik.html` — праздники в детском саду.
- `/detskie-prazdniki/shkolnye-prazdniki.html` — праздники в школе.
- `/detskie-prazdniki/vypusknoi/` — выпускные.
- `/detskie-prazdniki/detskii-novogodnii-prazdnik.html` — новогодний праздник.
- `/detskii-prazdnik/zolushka.html` — спектакль «Золушка».
- `/detskii-prazdnik/alisa.html` — спектакль «Алиса в стране чудес».
- `/detskii-prazdnik/peppi-dlinnii-chulok.html` — спектакль «Пеппи Длинный Чулок».
- `/detskii-prazdnik/piraty-karibskogo-morya.html` — спектакль «Пираты карибского моря».
- `/detskie-uslugi/shou-mylnyh-puzyrei.html` — шоу мыльных пузырей.
- `/detskie-uslugi/akvagrim.html` — аквагрим.
- `/detskie-uslugi/master-klassy.html` — мастер-классы.

## Подготовка к Vercel

- Проект использует Next.js App Router.
- Добавлены `vercel.json`, `next.config.ts`, sitemap и robots.
- Для публикации: создать Git-репозиторий, загрузить на GitHub/GitLab/Bitbucket и импортировать проект в Vercel как Next.js.
- Домен `maskarad-teatr.ru` подключить в Vercel после проверки редиректов и DNS.
