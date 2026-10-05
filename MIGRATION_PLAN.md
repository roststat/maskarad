# Карта переноса сайта maskarad-teatr.ru

## Принцип миграции

Это не копирование старого сайта один в один, а SEO-миграция: сохранить поисковую ценность старых URL,
забрать полезный контент, убрать устаревшее и собрать новую структуру вокруг сильных посадочных страниц.

## Что желательно получить от владельца старого сайта

- Доступ к хостингу/серверу старого сайта или архив файлов.
- Если есть CMS/база — доступ к админке или дамп базы.
- Папки с фото, видео и документами.
- `sitemap.xml`, `robots.txt`, `.htaccess`, список старых редиректов.
- Доступ к домену/DNS для финального переезда.
- По возможности — Яндекс.Метрика, Яндекс.Вебмастер, Google Search Console.

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

При первой публикации достаточно 301-редиректов на новые разделы. На следующем этапе лучше сделать отдельные посадочные страницы для самых ценных запросов.

Уже вынесены в отдельные страницы:

- `/detskie-prazdniki/detskii-novogodnii-prazdnik.html` → `/prazdniki/korporativnyy-novogodniy-prazdnik`
- `/detskie-prazdniki/detskii-den-rozhdeniya.html` → `/prazdniki/detskiy-den-rozhdeniya`
- `/detskii-prazdnik/zolushka.html` → `/spektakli/zolushka`
- `/detskii-prazdnik/alisa.html` → `/spektakli/alisa-v-strane-chudes`
- `/detskii-prazdnik/peppi-dlinnii-chulok.html` → `/spektakli/peppi-dlinnyy-chulok`
- `/detskii-prazdnik/piraty-karibskogo-morya.html` → `/spektakli/piraty-karibskogo-morya`
- `/detskie-uslugi/akvagrim.html` → `/uslugi/akvagrim`
- `/detskie-uslugi/shou-mylnyh-puzyrei.html` → `/uslugi/shou-mylnyh-puzyrey`
- `/detskie-uslugi/master-klassy.html` → `/uslugi/master-klassy`
- `/detskie-prazdniki/detskii-sad-prazdnik.html` → `/prazdniki/detskiy-sad`
- `/detskie-prazdniki/shkolnye-prazdniki.html` → `/prazdniki/shkolnyy-prazdnik`
- `/detskie-prazdniki/vypusknoi/` → `/prazdniki/vypusknoy`
- `/detskie-prazdniki/vypusknoi/index.html` → `/prazdniki/vypusknoy`
- `/detskie-prazdniki/vypusknoi/detskii-sad.html` → `/prazdniki/vypusknoy`
- `/detskie-prazdniki/vypusknoi/mladsheklassniki.html` → `/prazdniki/vypusknoy`
- `/detskie-prazdniki/vypusknoi/starsheklassniki.html` → `/prazdniki/vypusknoy`

Следующие кандидаты:

- точные спектакли из `/teatr/spektakl/*` и `/detskii-prazdnik/*`, которые сейчас уходят в общий `/spektakli`;
- сильные услуги из `/detskie-uslugi/*`, которые сейчас уходят в общий `/uslugi`;
- сценарии из `/scenarii/*`: решить, что объединять в праздники, а что не переносить отдельными страницами.

## Рабочий процесс для каждой старой страницы

- Собрать старый URL, title, description, H1, основные тексты, изображения и внутренние ссылки.
- Отметить актуальность услуги, спектакля, цены, телефона, соцсетей и фото.
- Решить судьбу страницы: отдельная посадочная, объединение в раздел, частичный перенос, 301-редирект или исключение.
- Переписать текст под новую стратегию: театрализованный праздник, режиссура, сценарий, актеры, интерактив.
- Добавить FAQ, CTA, внутренние ссылки и уникальные метаданные.
- Настроить `старый URL → новый URL`, проверить редирект и sitemap.

## Подготовка к Vercel

- Проект использует Next.js App Router.
- Добавлены `vercel.json`, `next.config.ts`, sitemap и robots.
- Для публикации: создать Git-репозиторий, загрузить на GitHub/GitLab/Bitbucket и импортировать проект в Vercel как Next.js.
- Домен `maskarad-teatr.ru` подключить в Vercel после проверки редиректов и DNS.
