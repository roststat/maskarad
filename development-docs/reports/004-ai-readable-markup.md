# Машиночитаемая разметка программ

Внедрены применимые части предоставленного примера: `Service`, `FAQPage` и Markdown alternate. Базовые title, description, canonical, Open Graph, Twitter Cards, Organization, WebSite, WebPage и BreadcrumbList уже были на сайте и сохранены.

Пример ошибочно называет `/.well-known/agent.json` манифестом A2A. Спецификация A2A описывает `/.well-known/agent-card.json` для действующего агента. У сайта нет A2A-агента и API бронирования, поэтому Agent Card, OpenAPI и `ReserveAction` не опубликованы. FAQ-разметка не гарантирует расширенный результат в поиске.

Проверка: `npm run seo:predeploy` прошёл; локальный HTTP подтвердил `200` Markdown и наличие ссылок и JSON-LD в HTML. Серверный релиз этим подшагом не выполнялся.
