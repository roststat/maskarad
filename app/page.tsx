import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTA, GalleryStrip } from "./components";
import { MiniGallery } from "./mini-gallery";
import { Breadcrumbs, JsonLd, buildBreadcrumbs, createFaqJsonLd } from "./seo";

export const metadata: Metadata = {
  description:
    "Выездные спектакли и детские праздники театра «Маскарад» в Москве и Московской области. Программы для дня рождения, детского сада, школы и компаний."
};

const stats = [
  ["с 2005", "создаем детские праздники"],
  ["200+", "спектаклей и программ"],
  ["Москва", "и Московская область"]
];

const audienceRoutes = [
  {
    href: "/prazdniki/detskiy-den-rozhdeniya",
    label: "День рождения",
    text: "Сценарий вокруг именинника, герои, интерактив и услуги под площадку."
  },
  {
    href: "/prazdniki/detskiy-sad",
    label: "Детский сад",
    text: "Утренники, выпускные и тематические праздники для группы."
  },
  {
    href: "/prazdniki/shkolnyy-prazdnik",
    label: "Школа",
    text: "Программы для класса, актового зала, выпускного или сезонного события."
  },
  {
    href: "/prazdniki/vypusknoy",
    label: "Выпускной",
    text: "От детского сада до старших классов: сценарий, шоу, фото и финал."
  }
];

const featureGroups = [
  {
    title: "Спектакли",
    href: "/spektakli",
    items: [
      { label: "Золушка", href: "/spektakli/zolushka" },
      { label: "Алиса в стране чудес", href: "/spektakli/alisa-v-strane-chudes" },
      { label: "Пеппи Длинный Чулок", href: "/spektakli/peppi-dlinnyy-chulok" },
      { label: "Пираты карибского моря", href: "/spektakli/piraty-karibskogo-morya" }
    ]
  },
  {
    title: "Услуги",
    href: "/uslugi",
    items: [
      { label: "Аквагрим", href: "/uslugi/akvagrim" },
      { label: "Шоу мыльных пузырей", href: "/uslugi/shou-mylnyh-puzyrey" },
      { label: "Мастер-классы", href: "/uslugi/master-klassy" },
      { label: "Оформление и съемка", href: "/uslugi" }
    ]
  },
  {
    title: "Праздники",
    href: "/prazdniki",
    items: [
      { label: "День рождения ребенка", href: "/prazdniki/detskiy-den-rozhdeniya" },
      { label: "Праздник в детском саду", href: "/prazdniki/detskiy-sad" },
      { label: "Школьный праздник", href: "/prazdniki/shkolnyy-prazdnik" },
      { label: "Выпускной", href: "/prazdniki/vypusknoy" }
    ]
  }
];

const homeFaq = [
  {
    question: "Где можно провести праздник с театром «Маскарад»?",
    answer: "Мы проводим выездные спектакли и праздники в Москве и Московской области: дома, в детском саду, школе, ресторане, лофте или детском центре. Программу адаптируем под площадку."
  },
  {
    question: "Как подобрать спектакль для детей разного возраста?",
    answer: "Расскажите возраст детей, количество гостей, площадку и пожелания к сюжету. Мы предложим подходящий спектакль и подстроим темп интерактива под группу."
  },
  {
    question: "Можно ли дополнить спектакль другими услугами?",
    answer: "Да. К спектаклю можно добавить мастер-класс, аквагрим, шоу мыльных пузырей, оформление или съемку. Состав программы обсуждаем перед заказом."
  },
  {
    question: "Проводите ли вы праздники для детских садов и школ?",
    answer: "Да. Для детских садов и школ есть выездные спектакли, утренники, выпускные и тематические программы. Формат подбираем под возраст, размер группы и помещение."
  },
  {
    question: "Как узнать стоимость и оставить заявку?",
    answer: "Посмотрите раздел «Цены и форматы» или оставьте имя и телефон в форме на сайте. Мы уточним дату, место и состав программы, затем предложим подходящий вариант."
  }
];

export default function Home() {
  return (
    <>
      <JsonLd data={createFaqJsonLd({ path: "/", items: homeFaq })} />
      <Breadcrumbs items={buildBreadcrumbs("/")} />
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Театр праздника</span>
          <h1>Спектакль, где ребенок становится частью сказки</h1>
          <p>
            «Маскарад» привозит актеров, костюмы, декорации и интерактивную программу домой, в сад,
            школу, ресторан или лофт. Теплый праздник для детей и родителей без лишней суеты.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#zayavka">
              Заказать праздник
            </a>
            <Link className="button ghost" href="/spektakli">
              Смотреть спектакли
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/corporate/children-and-actors.webp"
            alt="Дети участвуют в спектакле вместе с актёрами театра Маскарад"
            width={1600}
            height={1052}
            sizes="(max-width: 1000px) calc(100vw - 32px), 580px"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </section>

      <MiniGallery path="/" />

      <section className="stats" aria-label="Коротко о театре">
        {stats.map(([value, label]) => (
          <div key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="audience-routes" aria-label="Быстрый выбор праздника">
        <div className="intro">
          <span className="eyebrow">Быстрый выбор</span>
          <h2>Начните с задачи, а не с каталога</h2>
          <p>
            Выберите повод: день рождения, праздник в детском саду, школьную программу или выпускной.
            Возраст и количество детей помогут подобрать сюжет, темп и состав праздника.
          </p>
        </div>
        <div>
          {audienceRoutes.map((route) => (
            <Link href={route.href} key={route.href}>
              <strong>{route.label}</strong>
              <span>{route.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-grid">
        <div className="intro">
          <span className="eyebrow">Что делает театр</span>
          <h2>Собирает праздник вокруг живой истории</h2>
          <p>
            Начните со спектакля, в котором дети участвуют в сюжете. К программе можно добавить
            мастер-класс, аквагрим, шоу мыльных пузырей или оформление. Состав и длительность
            обсудим с учётом возраста детей, площадки и ваших пожеланий.
          </p>
        </div>
        {featureGroups.map((group) => (
          <Feature title={group.title} href={group.href} items={group.items} key={group.href} />
        ))}
      </section>

      <section className="process">
        <span className="eyebrow">Как заказать</span>
        <h2>Три шага до готового праздника</h2>
        <ol>
          <li>
            <strong>Расскажите вводные</strong>
            <span>Дата, возраст, площадка, любимые герои и примерное количество гостей.</span>
          </li>
          <li>
            <strong>Получите программу</strong>
            <span>Театр предложит сценарий, состав актеров, декорации и дополнительные услуги.</span>
          </li>
          <li>
            <strong>Встречайте сказку</strong>
            <span>Команда приезжает на площадку и проводит праздник для детей и родителей.</span>
          </li>
        </ol>
      </section>

      <section className="new-year-band">
        <div>
          <span className="eyebrow">Для компаний</span>
          <h2>Новогодняя елка как театральное событие</h2>
          <p>
            Для детей сотрудников собираем программу со сценарием, актерами, Дедом Морозом,
            Снегурочкой, интерактивом и мастер-классами под вашу площадку: офис, зал, ресторан,
            школу, ДК или лофт.
          </p>
        </div>
        <Link className="button primary" href="/prazdniki/korporativnyy-novogodniy-prazdnik">
          Новогодние корпоративы
        </Link>
      </section>

      <section className="ny-faq" aria-labelledby="home-faq-title">
        <span className="eyebrow">Частые вопросы</span>
        <h2 id="home-faq-title">Ответы перед заказом праздника</h2>
        <div>
          {homeFaq.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <GalleryStrip />
      <CTA />
    </>
  );
}

function Feature({ title, href, items }: { title: string; href: string; items: { label: string; href: string }[] }) {
  return (
    <article className="feature-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <Link href={href}>Подробнее</Link>
    </article>
  );
}
