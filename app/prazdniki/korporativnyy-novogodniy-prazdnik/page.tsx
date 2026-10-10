import type { Metadata } from "next";
import { PageStartLink as Link } from "../../page-start-link";
import { MiniGallery } from "../../mini-gallery";
import { SectionTransition } from "../../section-transition";
import { CorporatePhoto } from "../../corporate-photo";
import { CorporateNewYearRequest } from "../../corporate-new-year-request";
import { CorporateRequestButton } from "../../corporate-request-button";
import { phone, phoneHref } from "../../data";
import { Breadcrumbs, JsonLd, buildBreadcrumbs, createBreadcrumbJsonLd, createFaqJsonLd, createWebPageJsonLd } from "../../seo";

const pagePath = "/prazdniki/korporativnyy-novogodniy-prazdnik";
const pageTitle = "Корпоративная ёлка для детей сотрудников в Москве";
const pageDescription =
  "Авторские корпоративные ёлки для детей сотрудников: спектакли и развлекательные зоны. От камерных событий до масштабных праздников. Индивидуальный состав и бюджет.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pagePath
  }
};

const formats = [
  { title: "Интерактивный спектакль с Дедом Морозом и Снегурочкой", photo: "ribbon-game", caption: "Игры со сказочными героями" },
  { title: "Сценарий под возраст детей и формат компании", photo: "children-playing", caption: "Дети участвуют в действии" },
  { title: "Мастер-классы: роспись игрушек, открытки, творческие станции", photo: "face-painting", caption: "Аквагрим — один из вариантов дополнительной зоны" },
  { title: "Тематические шоу, фото, видео, оформление и сладкий стол", photo: "paper-show", caption: "Бумажное шоу" }
] as const;

const places = ["офис", "ресторан", "лофт", "ДК", "школа", "детский центр", "банкетный зал", "загородная площадка"];

const stages = [
  ["Бриф", "Уточняем возраст детей, количество гостей, площадку, тайминг и корпоративные ограничения."],
  ["Сценарий", "Собираем историю: герои, интерактив, финал, подарки, дополнительные зоны и темп события."],
  ["Режиссура", "Продумываем входы актеров, переходы, музыку, вовлечение детей и работу с площадкой."],
  ["Праздник", "Команда приезжает на площадку и проводит согласованную новогоднюю программу."]
];

const faq = [
  ["Какие корпоративные праздники вы организуете?", "Камерные события до 100 гостей, средние до 250–300 и масштабные более 500 гостей. Это ориентиры по общему количеству гостей. Для события на 300–500 гостей или при неизвестном количестве состав и масштаб подберём индивидуально."],
  ["Что входит в программу?", "Все программы авторские и содержат спектакли и развлекательные зоны. Конкретные спектакли, зоны и дополнительные услуги согласуем под задачу компании и площадку."],
  ["Сколько стоит корпоративная ёлка?", "Бюджет согласуется индивидуально. Для расчёта уточним дату, площадку, общее число гостей, число и возраст детей, желаемый состав программы и дополнительные услуги."],
  ["Что нужно учесть для офисной площадки и детей разного возраста?", "Уточним пространство, звук, время подготовки и ограничения помещения, а также количество и возраст детей отдельно от общего числа гостей. По этим данным обсудим подходящий состав спектакля и зон."],
  ["Что происходит после отправки заявки?", "Организатор получает ваш запрос с выбранным масштабом события. Дальше обсудим дату, площадку и состав участников, согласуем программу и индивидуальный расчёт."],
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
          <span className="eyebrow">Новый год для детей сотрудников</span>
          <h1>Корпоративная ёлка для детей сотрудников</h1>
          <p>
            Авторские спектакли и развлекательные зоны для детей сотрудников.
            От камерного события до большого праздника — программу и бюджет согласуем под вашу компанию.
          </p>
          <div className="hero-actions">
            <CorporateRequestButton>
              Получить предложение под вашу компанию
            </CorporateRequestButton>
            <a className="button ghost" href={phoneHref}>
              {phone}
            </a>
          </div>
        </div>
        <div className="ny-hero-visual">
          <CorporatePhoto photo="fairytale-actors" eager className="ny-hero-photo" caption="Сказочные герои театра «Маскарад»" />
          <aside className="ny-card" aria-label="Что входит">
          <p>Один праздник — индивидуальный состав. Обсудим задачу компании, площадку и участие детей.</p>
          <ul>
            <li>авторские спектакли;</li>
            <li>развлекательные зоны;</li>
            <li>масштаб от камерного до большого;</li>
            <li>индивидуальный бюджет.</li>
          </ul>
          </aside>
        </div>
      </section>

      <MiniGallery path={pagePath} />

      <CorporateNewYearRequest />

      <section className="ny-proof">
        <article>
          <CorporatePhoto photo="children-and-actors" sizes="(max-width: 760px) calc(100vw - 32px), 360px" />
          <span>01</span>
          <h2>Не набор конкурсов</h2>
          <p>У праздника есть сюжет, роли, переходы и финал. Дети не просто ждут подарки, а проходят историю вместе с героями.</p>
        </article>
        <article>
          <CorporatePhoto photo="interactive-show" sizes="(max-width: 760px) calc(100vw - 32px), 360px" />
          <span>02</span>
          <h2>Под конкретную площадку</h2>
          <p>Учитываем входы, звук, гардероб, подарки, фотозону, поток гостей и ограничения офисного или ресторанного пространства.</p>
        </article>
        <article>
          <CorporatePhoto photo="stage-performance" sizes="(max-width: 760px) calc(100vw - 32px), 360px" />
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
          <p className="ny-photo-context">На фотографиях — наши спектакли и развлечения. Состав вашей корпоративной ёлки обсудим отдельно.</p>
        </div>
        <div className="ny-grid">
          {formats.map((item) => (
            <article key={item.title}>
              <CorporatePhoto photo={item.photo} caption={item.caption} />
              <h3>{item.title}</h3>
              <p>Состав и условия этого элемента обсудим отдельно при подготовке программы.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ny-places">
        <div>
          <span className="eyebrow">Площадки</span>
          <h2>Приезжаем туда, где проходит ваш праздник</h2>
          <ul>
            {places.map((place) => (
              <li key={place}>{place}</li>
            ))}
          </ul>
        </div>
        <CorporatePhoto photo="restaurant-performance" caption="Театральное выступление на площадке ресторана" />
      </section>

      <section className="ny-section ny-photo-pair" aria-label="Театральные детали и реквизит">
        <CorporatePhoto photo="show-performer" caption="Актёрская подача и интерактивный реквизит" />
        <CorporatePhoto photo="theatrical-prop" caption="Костюмы и театральные детали" />
      </section>

      <SectionTransition path={pagePath} />

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

      <section className="ny-budget ny-section" aria-labelledby="ny-budget-title">
        <div className="intro">
          <span className="eyebrow">Прозрачный расчёт</span>
          <h2 id="ny-budget-title">Бюджет зависит от вашего события</h2>
          <p>У нас нет единого тарифа на все корпоративные ёлки. Спектакль, развлекательные зоны и дополнительные услуги собираем в индивидуальное предложение.</p>
        </div>
        <div className="ny-grid">
          <article><h3>Масштаб и участники</h3><p>Общее число гостей, количество и возраст детей, дата и желаемая продолжительность события.</p></article>
          <article><h3>Спектакли и зоны</h3><p>Театральная программа, интерактив и выбранные развлечения. Конкретный состав согласуем с вами.</p></article>
          <article><h3>Площадка и дополнения</h3><p>Место проведения, условия подготовки и дополнительные услуги. До согласования уточним, что входит в расчёт и что оплачивается отдельно.</p></article>
        </div>
        <CorporateRequestButton>Запросить индивидуальный расчёт</CorporateRequestButton>
      </section>

      <section className="ny-section" aria-labelledby="ny-programs-title">
        <div className="intro">
          <span className="eyebrow">Знакомство с театром</span>
          <h2 id="ny-programs-title">Посмотрите наши новогодние спектакли</h2>
          <p>Эти страницы помогут познакомиться с сюжетами. Для корпоративной ёлки состав спектаклей и зон обсудим отдельно.</p>
        </div>
        <div className="ny-grid ny-program-links">
          <Link href="/spektakli/novogodnyy-ekspress"><strong>Новогодний экспресс</strong><span>Посмотреть программу →</span></Link>
          <Link href="/spektakli/novyy-god-na-snezhnoy-planete"><strong>Новый год на снежной планете</strong><span>Посмотреть программу →</span></Link>
          <Link href="/spektakli/novogodnyaya-belosnezhka"><strong>Новогодняя Белоснежка</strong><span>Посмотреть программу →</span></Link>
        </div>
      </section>
      <SectionTransition path={pagePath} moment="photos" />
      <section className="ny-section ny-photo-gallery" aria-labelledby="ny-photo-title">
        <div className="intro">
          <span className="eyebrow">Моменты праздника</span>
          <h2 id="ny-photo-title">Герои, игры и детские эмоции</h2>
          <p>Фотографии из программ театра «Маскарад». Нажмите на кадр, чтобы рассмотреть его крупнее.</p>
          <Link className="button ghost" href="/foto-video">Посмотреть все фотографии театра</Link>
        </div>
        <div className="ny-photo-gallery-grid">
          <CorporatePhoto photo="fairytale-costumes" caption="Костюмы и праздничное оформление" />
          <CorporatePhoto photo="fairytale-group" caption="Дети встречают сказочных героев" />
          <CorporatePhoto photo="superhero-group" caption="Приключения с супергероями" />
          <CorporatePhoto photo="balloon-game" caption="Игры с воздушными шарами" />
          <CorporatePhoto photo="colourful-character" caption="Встречи с яркими персонажами" />
          <CorporatePhoto photo="costumed-actors" caption="Театральные костюмы и реквизит" />
        </div>
      </section>

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

      <SectionTransition path={pagePath} moment="request" />
      <section className="ny-final-request">
        <CorporatePhoto photo="actor-and-child" className="ny-final-photo" />
        <div>
        <span className="eyebrow">Начнём с вашей задачи</span>
        <h2>Какая ёлка нужна вашей компании?</h2>
        <p>Выберите масштаб и оставьте контакт. Состав авторской программы и бюджет согласуем индивидуально.</p>
        <CorporateRequestButton>Получить предложение под вашу компанию</CorporateRequestButton>
        </div>
      </section>
    </>
  );
}
