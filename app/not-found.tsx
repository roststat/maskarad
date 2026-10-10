import { PageStartLink as Link } from "./page-start-link";

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <span className="eyebrow">Страница не найдена</span>
      <h1 id="not-found-title">Похоже, этот маршрут закончился за кулисами</h1>
      <p>
        Вернитесь в каталог или выберите формат праздника. Мы поможем быстро найти спектакль и
        программу под вашу площадку.
      </p>
      <div className="hero-actions">
        <Link className="button primary" href="/">
          На главную
        </Link>
        <Link className="button ghost" href="/spektakli">
          Смотреть спектакли
        </Link>
        <Link className="button ghost" href="/stati">
          Читать статьи
        </Link>
      </div>
    </section>
  );
}
