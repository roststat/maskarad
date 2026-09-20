import Image from "next/image";
import Link from "next/link";
import { galleryImages, navItems, phone, phoneHref } from "./data";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Маскарад, на главную">
        <span className="brand-mark">М</span>
        <span>
          <strong>Маскарад</strong>
          <small>детский выездной театр</small>
        </span>
      </Link>
      <nav className="nav" aria-label="Основная навигация">
        {navItems.slice(1).map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <a className="header-phone" href={phoneHref}>
        {phone}
      </a>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>Детский выездной театр «Маскарад»</strong>
        <p>Спектакли, праздники и программы под ключ в Москве и Московской области.</p>
      </div>
      <a href={phoneHref}>{phone}</a>
    </footer>
  );
}

export function CTA({ label = "Оставить заявку" }: { label?: string }) {
  return (
    <div className="cta-panel" id="zayavka">
      <div>
        <span className="eyebrow">Заявка</span>
        <h2>Расскажите о празднике, а театр предложит программу</h2>
        <p>Достаточно даты, возраста детей, площадки и любимой темы. Для срочного заказа лучше позвонить.</p>
      </div>
      <form className="lead-form">
        <label>
          Имя
          <input name="name" placeholder="Как к вам обращаться" />
        </label>
        <label>
          Телефон
          <input name="phone" placeholder="+7 ..." inputMode="tel" />
        </label>
        <label>
          Что планируете
          <textarea name="message" placeholder="День рождения, спектакль, выпускной..." />
        </label>
        <button type="button">{label}</button>
      </form>
    </div>
  );
}

export function GalleryStrip() {
  return (
    <div className="gallery-strip">
      {galleryImages.map((image) => (
        <figure key={image.src}>
          <Image src={image.src} alt={image.alt} width={520} height={360} />
        </figure>
      ))}
    </div>
  );
}

export function SectionHero({
  kicker,
  title,
  description,
  cta
}: {
  kicker: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <section className="section-hero">
      <span className="eyebrow">{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="hero-actions">
        <a className="button primary" href="#zayavka">
          {cta}
        </a>
        <a className="button ghost" href={phoneHref}>
          Позвонить
        </a>
      </div>
    </section>
  );
}
