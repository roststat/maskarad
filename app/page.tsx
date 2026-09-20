import Image from "next/image";
import Link from "next/link";
import { CTA, GalleryStrip } from "./components";
import { celebrations, services, shows } from "./data";

const stats = [
  ["с 2005", "создаем детские праздники"],
  ["10%", "скидка при повторном заказе"],
  ["Москва", "и Московская область"]
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Детский выездной театр</span>
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
            src="https://maskarad-teatr.ru/files/image/mainart1.jpg"
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
        <Feature title="Спектакли" href="/spektakli" items={shows.slice(0, 5)} />
        <Feature title="Услуги" href="/uslugi" items={services.slice(0, 5)} />
        <Feature title="Праздники" href="/prazdniki" items={celebrations.slice(0, 5)} />
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

      <GalleryStrip />
      <CTA />
    </>
  );
}

function Feature({ title, href, items }: { title: string; href: string; items: string[] }) {
  return (
    <article className="feature-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link href={href}>Подробнее</Link>
    </article>
  );
}
