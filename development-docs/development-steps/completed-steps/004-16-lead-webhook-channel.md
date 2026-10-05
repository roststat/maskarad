# 004-16 — надежный канал заявки через webhook

Дата: 2026-10-04

## Цель

Убрать зависимость формы заявки от одного WhatsApp-сценария и подготовить надежный серверный канал для CRM/email/Telegram/Make/Zapier через webhook.

## Что сделано

- Добавлен API route `/api/leads`.
- Форма `LeadForm` теперь отправляет заявку на сервер через `fetch('/api/leads')`.
- Серверный route отправляет заявку в `LEAD_WEBHOOK_URL`, если переменная окружения задана.
- Если webhook не настроен, форма честно показывает запасные действия: позвонить, отправить готовый текст в WhatsApp, скопировать текст заявки.
- Добавлен `.env.example` с описанием `LEAD_WEBHOOK_URL`.
- `.gitignore` дополнен `.env` и `.env*.local`, чтобы секреты не попадали в репозиторий.
- В `README.md` добавлена инструкция по подключению webhook на production.
- При проверке найден отсутствующий публичный файл `gallery6b.jpg`; файл вынесен из FTP-архива в `public/images/legacy/`.

## Доказательства

- `npm run build` прошел успешно; `/api/leads` появился как dynamic route.
- Без `LEAD_WEBHOOK_URL` POST `/api/leads` вернул `503` и `lead_webhook_not_configured`, что включает fallback-сценарий формы.
- С тестовым `LEAD_WEBHOOK_URL=http://127.0.0.1:4455/lead` POST `/api/leads` вернул `200 OK`.
- Тестовый webhook получил JSON заявки с полями `name`, `phone`, `occasion`, `date`, `age`, `location`, `message`, `page`, `leadText`, `createdAt`, `source`.
- Проверка путей изображений из `app/landing-data.ts`, `app/content-data.ts`, `app/data.ts`, `app/page.tsx` не нашла отсутствующих файлов.

## Осталось

- Выбрать реальный приемник заявок: email-сервис, Telegram-бот, CRM, Make/Zapier или другой webhook.
- Задать `LEAD_WEBHOOK_URL` в Vercel Environment Variables.
- После подключения реального приемника отправить тестовую заявку с production preview.
