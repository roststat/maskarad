import { PageStartLink as Link } from "./page-start-link";
import { legalData } from "./legal-data";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="legal-page">
    <nav aria-label="Документы сайта"><Link href="/">Главная</Link><span aria-hidden="true"> / </span>{title}</nav>
    <h1>{title}</h1>
    {!legalData.approvedForPublication && <p className="legal-draft">Проект документа. Размещение хранилища и обязанности оператора проверяются до публикации окончательной версии.</p>}
    <p className="legal-updated">Дата утверждения: {legalData.effectiveDate}</p>
    {children}
  </article>;
}

export function OperatorDetails() {
  return <>
    <p>Оператор персональных данных: {legalData.operator}, ИНН {legalData.inn}.</p>
    <p>Адрес для обращений: {legalData.address}. Email: {legalData.email}. Телефон: +7 995 121-94-67.</p>
  </>;
}
