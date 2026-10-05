# Priority migration map

Дата: 2026-10-02.

Источник: `development-docs/reports/old-site-inventory/*.csv`, собранные из локальной FTP-выгрузки старого сайта и актуального SQL-дампа `old-site-source/db/maskarad-phpmyadmin-2026-10-02.sql`.

В карту не включались таблицы заказов, пользователей, администраторов и другие непубличные данные.

## Уже вынесено в отдельные посадочные

| Старый URL | Новый URL | Тип |
|---|---|---|
| `/detskii-prazdnik/zolushka.html` | `/spektakli/zolushka` | спектакль |
| `/detskii-prazdnik/alisa.html` | `/spektakli/alisa-v-strane-chudes` | спектакль |
| `/detskii-prazdnik/peppi-dlinnii-chulok.html` | `/spektakli/peppi-dlinnyy-chulok` | спектакль |
| `/detskii-prazdnik/piraty-karibskogo-morya.html` | `/spektakli/piraty-karibskogo-morya` | спектакль |
| `/detskii-prazdnik/belosnezhka.html` | `/spektakli/belosnezhka-i-sem-gnomov` | спектакль |
| `/detskii-prazdnik/mary-poppins.html` | `/spektakli/mary-poppins` | спектакль |
| `/detskii-prazdnik/sinbad-morehod.html` | `/spektakli/priklyucheniya-sindbada-morehoda` | спектакль |
| `/detskii-prazdnik/karlson.html` | `/spektakli/malysh-i-karlson` | спектакль |
| `/detskii-prazdnik/bremenskie-muzykanty.html` | `/spektakli/bremenskie-muzykanty` | спектакль |
| `/detskii-prazdnik/novogodnyaya-belosnezhka.html` | `/spektakli/novogodnyaya-belosnezhka` | спектакль |
| `/detskii-prazdnik/novyi-god/` | `/spektakli/novogodnie-spektakli` | спектакль |
| `/detskii-prazdnik/novyi-god/index.html` | `/spektakli/novogodnie-spektakli` | спектакль |
| `/detskie-prazdniki/detskii-den-rozhdeniya.html` | `/prazdniki/detskiy-den-rozhdeniya` | праздник |
| `/detskie-prazdniki/detskii-sad-prazdnik.html` | `/prazdniki/detskiy-sad` | праздник |
| `/detskie-prazdniki/shkolnye-prazdniki.html` | `/prazdniki/shkolnyy-prazdnik` | праздник |
| `/detskie-prazdniki/vypusknoi/` | `/prazdniki/vypusknoy` | праздник |
| `/detskie-prazdniki/vypusknoi/index.html` | `/prazdniki/vypusknoy` | праздник |
| `/detskie-prazdniki/vypusknoi/detskii-sad.html` | `/prazdniki/vypusknoy` | праздник |
| `/detskie-prazdniki/vypusknoi/mladsheklassniki.html` | `/prazdniki/vypusknoy` | праздник |
| `/detskie-prazdniki/vypusknoi/starsheklassniki.html` | `/prazdniki/vypusknoy` | праздник |
| `/detskie-uslugi/akvagrim.html` | `/uslugi/akvagrim` | услуга |
| `/detskie-uslugi/shou-mylnyh-puzyrei.html` | `/uslugi/shou-mylnyh-puzyrey` | услуга |
| `/detskie-uslugi/master-klassy.html` | `/uslugi/master-klassy` | услуга |
| `/detskie-uslugi/fokusy.html` | `/uslugi/cirkovye-fokusy` | услуга |
| `/detskie-uslugi/kukolnyy-spektakl.html` | `/uslugi/kukolnyy-spektakl` | услуга |
| `/detskie-uslugi/oformlenie-sharami.html` | `/uslugi/oformlenie-sharami` | услуга |
| `/detskie-uslugi/foto.html` | `/uslugi/foto-video` | услуга |
| `/detskie-uslugi/video.html` | `/uslugi/foto-video` | услуга |
| `/detskie-uslugi/keitering.html` | `/uslugi/keytering` | услуга |
| `/detskie-uslugi/spetsialnye-effekty.html` | `/uslugi/spetsialnye-effekty` | услуга |
| `/detskie-uslugi/attraktsiony.html` | `/uslugi/attraktsiony` | услуга |

## Следующая очередь

| Группа | Что делать |
|---|---|
| Спектакли | Разобрать `show`-URL из `urls.csv`, выбрать спектакли с уникальной коммерческой ценностью и дать им отдельные страницы вместо общего редиректа на `/spektakli`. |
| Услуги | Проверить оставшиеся низкоприоритетные `service`-URL: дрессированные животные, фейерверки, огненное шоу, торты, песни, аренда теплоходов. Часть оставить общим редиректом, часть использовать как идеи для FAQ и перелинковки. |
| Сценарии | Раздел `/scenarii/*` не переносить механически. Использовать как источник идей для FAQ, тематических блоков и внутренней перелинковки. |
| Медиа | `media.csv` использовать для выбора настоящих фото под страницы, но не тянуть все изображения в новый сайт без отбора и оптимизации. |

## Правило переноса

- Старый URL получает точный 301, если у него есть отдельная новая смысловая страница.
- Если старая страница дублирует кластер, редирект ведет на сильную родительскую страницу.
- Тексты старого сайта используются как источник фактов, но новые страницы пишутся заново под современный UX, доверие, мобильный интерфейс и поисковые интенты.
