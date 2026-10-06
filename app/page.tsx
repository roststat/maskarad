import Image from "next/image";
import Link from "next/link";
import { CTA, GalleryStrip } from "./components";
import { Breadcrumbs, buildBreadcrumbs } from "./seo";

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

export default function Home() {
  return (
    <>
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
            src="/images/legacy/interaktiv01.jpg"
            alt="Иммерсивный спектакль театра Маскарад на детский праздник"
            width={760}
            height={560}
            priority
          />
        </div>
      </section>

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
            Родителю, воспитателю, учителю и HR нужны разные маршруты. Поэтому основные сценарии
            вынесены ближе к первому экрану и ведут сразу на сильные посадочные страницы.
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
            В старой версии сайта было много отдельных направлений. В новой структуре они собраны в
            понятный путь: выбрать спектакль, добавить услуги, уточнить формат праздника и быстро
            отправить заявку.
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
