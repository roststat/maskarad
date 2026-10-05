# Vercel preview: внешний SEO smoke-test заблокирован

Дата: 2026-10-04

## Проверка

Запущена команда:

```bash
npm run seo:prelaunch -- https://msk-maskarad-c02trzuis-mintallart-9640.vercel.app
```

## Результат

Проверка остановилась до запросов `robots.txt`, `sitemap.xml` и HTML страниц:

```text
Base URL is unavailable: https://msk-maskarad-c02trzuis-mintallart-9640.vercel.app
```

## Вывод

SEO-контракт проекта локально проверен, но внешний preview сейчас нельзя использовать как доказательство доступности. Перед следующей публикационной проверкой нужно открыть deployment для внешнего запроса или предоставить штатный доступ без добавления секретов в репозиторий.
