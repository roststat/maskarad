import Image from "next/image";
import Link from "next/link";
import { galleryImages, phone, phoneHref } from "./data";
import { HeaderNav } from "./header-nav";
import { LeadForm } from "./lead-form";
import { MobileQuickActions } from "./mobile-quick-actions";

export function Header() {
  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Маскарад, на главную">
          <Image
            className="brand-mark-image"
            src="/images/legacy/maskarad-mask-transparent.png"
            alt=""
            width={1282}
            height={1227}
            sizes="43px"
            priority
          />
          <span>
            <strong>Маскарад</strong>
            <small>детский выездной театр</small>
          </span>
        </Link>
        <HeaderNav />
        <div className="header-actions">
          <a className="header-phone" href={phoneHref}>
            {phone}
          </a>
          <a className="header-request" href="#zayavka">
            Заявка
          </a>
        </div>
      </header>
      <MobileQuickActions />
    </>
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
        <p>
          Чем больше деталей в первом сообщении, тем быстрее можно предложить спектакль, услуги, тайминг и ориентир
          по бюджету. Для срочного заказа лучше позвонить.
        </p>
      </div>
      <LeadForm label={label} />
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
