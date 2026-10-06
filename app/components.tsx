import Image from "next/image";
import Link from "next/link";
import { galleryImages, phone, phoneHref } from "./data";
import { HeaderNav } from "./header-nav";
import { LeadForm } from "./lead-form";
import { MobileQuickActions } from "./mobile-quick-actions";
import { PartyAssistantWidget } from "./party-assistant-widget";

export function Header() {
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <HeaderNav />
          <div className="brand">
            <PartyAssistantWidget />
            <Link className="brand-link" href="/" aria-label="Маскарад, на главную">
            <span>
              <strong>Маскарад</strong>
              <small>театр праздника</small>
            </span>
            </Link>
          </div>
          <div className="header-actions">
            <a className="header-phone" href={phoneHref}>
              <svg className="header-phone-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="7" y="2.5" width="10" height="19" rx="2" />
                <path d="M10 5h4M11.25 18.5h1.5M19 6.5c1.7 1.5 1.7 3.5 0 5M21 4.5c2.8 2.7 2.8 6.3 0 9" />
              </svg>
              <span className="header-phone-text">{phone}</span>
            </a>
          </div>
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
        <strong>Театр праздника «Маскарад»</strong>
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
