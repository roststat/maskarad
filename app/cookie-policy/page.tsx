import type { Metadata } from "next";
import { LegalPage, OperatorDetails } from "../legal-content";

export const metadata: Metadata = { title: "Политика cookies", alternates: { canonical: "/cookie-policy" }, robots: { index: false, follow: true } };

export default function CookiePolicyPage() {
  return <LegalPage title="Политика cookies и хранения в браузере">
    <OperatorDetails />
    <p>Раздел об аналитике обновлён 9 октября 2026 года.</p>
    <p>При открытии сайта загружается Яндекс Метрика (счётчик 113579092) для статистики посещений и работы страниц. Включены Вебвизор, карта кликов и учёт переходов по ссылкам. Метрика использует идентификаторы в cookies и localStorage; сведения об используемых ею файлах опубликованы в <a href="https://yandex.ru/support/metrica/ru/general/cookie-usage.html">справке Яндекса</a>. Google Analytics и рекламные пиксели на сайте не подключены.</p>
    <p>Для переходов между страницами сайт отправляет Метрике путь страницы без параметров URL. Содержимое полей заявки и окна запроса скрыто от Вебвизора; закрытая страница заявок не отслеживается. Сайт сохраняет в localStorage отметку о закрытии информационного сообщения под ключом <code>maskarad-cookie-notice-v2</code>. Эта отметка не содержит имени, телефона или текста заявки.</p>
    <p>Кнопка «Понятно» закрывает сообщение и не управляет сбором статистики. Ограничить cookies или удалить их можно через настройки браузера; также доступен <a href="https://yandex.ru/support/metrica/ru/general/opt-out">инструмент Яндекса для блокировки Метрики</a>.</p>
  </LegalPage>;
}
