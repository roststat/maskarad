import type { Metadata } from "next";
import Link from "next/link";
import { CTA, GalleryStrip } from "../../components";
import { phone, phoneHref } from "../../data";
import { Breadcrumbs, JsonLd, buildBreadcrumbs, createBreadcrumbJsonLd, createFaqJsonLd, createWebPageJsonLd } from "../../seo";

const pagePath = "/prazdniki/korporativnyy-novogodniy-prazdnik";
const pageTitle = "Новогодние корпоративные праздники для детей сотрудников";
const pageDescription =
  "Театрализованные новогодние елки и корпоративные детские праздники: сценарий, режиссура, актеры, Дед Мороз, Снегурочка, мастер-классы и программа под площадку.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pagePath
  }
};

const formats = [
  "Интерактивный спектакль с Дедом Морозом и Снегурочкой",
  "Сценарий под возраст детей и формат компании",
  "Мастер-классы: роспись игрушек, открытки, творческие станции",
  "Тематические шоу, фото, видео, оформление и сладкий стол"
];

const places = ["офис", "ресторан", "лофт", "ДК", "школа", "детский центр", "банкетный зал", "загородная площадка"];

const stages = [
  ["Бриф", "Уточняем возраст детей, количество гостей, площадку, тайминг и корпоративные ограничения."],
  ["Сценарий", "Собираем историю: герои, интерактив, финал, подарки, дополнительные зоны и темп события."],
  ["Режиссура", "Продумываем входы актеров, переходы, музыку, вовлечение детей и работу с площадкой."],
  ["Праздник", "Команда приезжает на площадку и проводит новогоднюю программу без хаоса для родителей и HR."]
];

const faq = [
  ["Можно ли провести елку прямо в офисе?", "Да. Программу можно адаптировать под переговорную, холл, актовый зал, ресторан или арендованную площадку."],
  ["Подходит ли программа для детей разного возраста?", "Да. Обычно делаем сценарий с несколькими уровнями участия, чтобы младшие дети не терялись, а старшим было интересно."],
  ["Можно ли добавить бренд компании?", "Да. Можно аккуратно встроить корпоративную тему, ценности, фирменные цвета, поздравление руководства или брендированные подарки."],
  ["Это просто аниматоры?", "Нет. Основа программы — театральный сценарий, актерское ведение, режиссура и интерактив, где дети становятся участниками истории."],
  ["Что сообщить для подготовки предложения?", "Укажите возраст и количество детей, дату, площадку, желаемый тайминг и корпоративные ограничения. По этим данным можно собрать подходящий сценарий."]
];

export default function CorporateNewYearPage() {
  const breadcrumbs = buildBreadcrumbs(pagePath);
  const jsonLd = [
    createWebPageJsonLd({
      path: pagePath,
      title: pageTitle,
      description: pageDescription
    }),
    createBreadcrumbJsonLd(breadcrumbs),
    createFaqJsonLd({ path: pagePath, items: faq.map(([question, answer]) => ({ question, answer })) })
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="ny-hero">
        <div>
          <span className="eyebrow">Новогодние корпоративы</span>
          <h1>Елка для детей сотрудников как настоящий спектакль</h1>
          <p>
            «Маскарад» создает театрализованные новогодние праздники для компаний: со сценарием,
            режиссурой, актерами, интерактивом и программой под вашу площадку.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#zayavka">
              Обсудить корпоратив
            </a>
            <a className="button ghost" href={phoneHref}>
              {phone}
            </a>
          </div>
        </div>
        <aside className="ny-card" aria-label="Что входит">
          <strong>Для HR и event-команд</strong>
          <p>Собираем детскую новогоднюю программу, которую удобно согласовать, провести и показать родителям.</p>
          <ul>
            <li>тайминг под площадку;</li>
            <li>сценарий под возраст;</li>
            <li>актеры и интерактив;</li>
            <li>дополнительные зоны.</li>
          </ul>
        </aside>
      </section>

      <section className="ny-proof">
        <article>
          <span>01</span>
          <h2>Не набор конкурсов</h2>
          <p>У праздника есть сюжет, роли, переходы и финал. Дети не просто ждут подарки, а проходят историю вместе с героями.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Под конкретную площадку</h2>
          <p>Учитываем входы, звук, гардероб, подарки, фотозону, поток гостей и ограничения офисного или ресторанного пространства.</p>
        </article>
        <article>
          <span>03</span>
          <h2>С режиссурой</h2>
          <p>Программу собирает команда театра: актерская подача, темп, внимание к детям и мягкое управление группой.</p>
        </article>
      </section>

      <section className="ny-section">
        <div className="intro">
          <span className="eyebrow">Что можно включить</span>
          <h2>Один сценарий, несколько зон праздника</h2>
          <p>
            Базой может быть интерактивный спектакль, а вокруг него добавляются мастер-классы,
            шоу, оформление, фото, видео и подарки. Так корпоративная елка ощущается цельной, а не
            собранной из случайных подрядчиков.
          </p>
        </div>
        <div className="ny-grid">
          {formats.map((item) => (
            <article key={item}>
              <h3>{item}</h3>
              <p>Подберем длительность и наполнение после короткого брифа по площадке, возрасту и задаче.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ny-places">
        <div>
          <span className="eyebrow">Площадки</span>
          <h2>Приезжаем туда, где проходит ваш праздник</h2>
        </div>
        <ul>
          {places.map((place) => (
            <li key={place}>{place}</li>
          ))}
        </ul>
      </section>

      <section className="ny-timeline">
        <span className="eyebrow">Процесс</span>
        <h2>Как готовится корпоративная елка</h2>
        <div>
          {stages.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <GalleryStrip />

      <section className="ny-faq">
        <span className="eyebrow">Вопросы</span>
        <h2>Что обычно уточняют до заказа</h2>
        <div>
          {faq.map(([question, answer]) => (
            <article key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ny-related">
        <h2>Полезно посмотреть рядом</h2>
        <div>
          <Link href="/spektakli">Интерактивные спектакли</Link>
          <Link href="/uslugi">Дополнительные услуги</Link>
          <Link href="/tseny">Цены и форматы</Link>
        </div>
      </section>

      <CTA label="Обсудить новогоднюю программу" />
    </>
  );
}
