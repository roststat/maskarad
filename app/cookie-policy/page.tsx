import type { Metadata } from "next";
import { LegalPage, OperatorDetails } from "../legal-content";

export const metadata: Metadata = { title: "Политика cookies", alternates: { canonical: "/cookie-policy" }, robots: { index: false, follow: true } };

export default function CookiePolicyPage() {
  return <LegalPage title="Политика cookies и хранения в браузере">
    <OperatorDetails />
    <p>В текущей версии сайта не подключены Яндекс.Метрика, Google Analytics и рекламные пиксели. Сайт не устанавливает собственные аналитические или рекламные cookies. При дальнейших изменениях технические cookies инфраструктуры будут отражены здесь после проверки опубликованной версии.</p>
    <p>Сайт сохраняет в localStorage только отметку о том, что информационное сообщение о cookies уже закрыто. Эта отметка не содержит имени, телефона или текста заявки. Удалить её можно через настройки браузера. Вводимые в форму данные не сохраняются в localStorage.</p>
    <p>Если позже будут добавлены аналитика или реклама, до их запуска мы обновим эту страницу и предложим отдельный выбор для необязательных технологий. Настройки браузера позволяют ограничить cookies, но некоторые технические функции могут работать иначе.</p>
  </LegalPage>;
}
