import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTA, GalleryStrip, SectionHero } from "../components";
import {
  contentHubs,
  contentPages,
  type ContentHub,
  type ContentHubPath,
  type ContentPage as PortalContentPage,
  type ContentPagePath
} from "../content-data";
import { pages, type CatalogItem, type PagePath } from "../data";
import { landingPages, type LandingPath } from "../landing-data";
import {
  AdSlot,
  Breadcrumbs,
  JsonLd,
  buildBreadcrumbs,
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  createFaqJsonLd,
  createItemListJsonLd,
  createWebPageJsonLd
} from "../seo";

type Params = {
  params: Promise<{ slug: string[] }>;
};

function createSocialMetadata({
  path,
  title,
  description,
  image = "/images/legacy/interaktiv01.jpg",
  type = "website"
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type,
      locale: "ru_RU",
      url: path,
      siteName: "Детский выездной театр «Маскарад»",
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

function pathFromSlug(slug: string[]): PagePath | null {
  const path = `/${slug.join("/")}`;
  return path in pages ? (path as PagePath) : null;
}

function landingPathFromSlug(slug: string[]): LandingPath | null {
  const path = `/${slug.join("/")}`;
  return path in landingPages ? (path as LandingPath) : null;
}

function contentHubPathFromSlug(slug: string[]): ContentHubPath | null {
  const path = `/${slug.join("/")}`;
  return path in contentHubs ? (path as ContentHubPath) : null;
}

function contentPagePathFromSlug(slug: string[]): ContentPagePath | null {
  const path = `/${slug.join("/")}`;
  return path in contentPages ? (path as ContentPagePath) : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const contentPagePath = contentPagePathFromSlug(slug);
  if (contentPagePath) {
    const page: PortalContentPage = contentPages[contentPagePath];

    return {
      title: page.title,
      description: page.description,
      alternates: {
        canonical: contentPagePath
      },
      ...createSocialMetadata({
        path: contentPagePath,
        title: page.title,
        description: page.description,
        image: page.image.src,
        type: "article"
      })
    };
  }

  const contentHubPath = contentHubPathFromSlug(slug);
  if (contentHubPath) {
    const page: ContentHub = contentHubs[contentHubPath];

    return {
      title: page.title,
      description: page.description,
      alternates: {
        canonical: contentHubPath
      },
      ...createSocialMetadata({
        path: contentHubPath,
        title: page.title,
        description: page.description
      })
    };
  }

  const landingPath = landingPathFromSlug(slug);
  if (landingPath) {
    const page = landingPages[landingPath];

    return {
      title: page.title,
      description: page.description,
      alternates: {
        canonical: landingPath
      },
      ...createSocialMetadata({
        path: landingPath,
        title: page.title,
        description: page.description,
        image: page.media?.src
      })
    };
  }

  const path = pathFromSlug(slug);
  if (!path) return {};
  const page = pages[path];

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path
    },
    ...createSocialMetadata({
      path,
      title: page.title,
      description: page.description
    })
  };
}

export function generateStaticParams() {
  return [...Object.keys(pages), ...Object.keys(landingPages), ...Object.keys(contentHubs), ...Object.keys(contentPages)].map((path) => ({
    slug: path.slice(1).split("/")
  }));
}

export default async function ContentPage({ params }: Params) {
  const { slug } = await params;
  const contentPagePath = contentPagePathFromSlug(slug);
  if (contentPagePath) {
    const page: PortalContentPage = contentPages[contentPagePath];
    const breadcrumbs = buildBreadcrumbs(contentPagePath);
    const jsonLd = [
      createWebPageJsonLd({
        path: contentPagePath,
        title: page.title,
        description: page.description,
        image: page.image.src
      }),
      createArticleJsonLd({
        path: contentPagePath,
        title: page.title,
        description: page.description,
        image: page.image.src,
        publishedAt: page.publishedAt,
        updatedAt: page.updatedAt
      }),
      createFaqJsonLd({
        path: contentPagePath,
        items: page.faq
      }),
      createBreadcrumbJsonLd(breadcrumbs)
    ];

    return (
      <>
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={breadcrumbs} />
        <article className="article-shell">
          <header className="article-hero">
            <div>
              <span className="eyebrow">{page.kicker}</span>
              <h1>{page.title}</h1>
              <p>{page.intro}</p>
              <div className="article-meta">
                <span>Опубликовано: {formatDate(page.publishedAt)}</span>
                <span>Обновлено: {formatDate(page.updatedAt)}</span>
              </div>
              <ContentDisclosure kind={page.kind} />
            </div>
            <figure className="landing-media">
              <Image src={page.image.src} alt={page.image.alt} width={680} height={480} priority />
              <figcaption>{page.image.caption}</figcaption>
            </figure>
          </header>

          <section className="landing-facts" aria-label="Коротко">
            {page.facts.map((fact) => (
              <article key={fact}>
                <span />
                <strong>{fact}</strong>
              </article>
            ))}
          </section>

          <div className="article-layout">
            <div className="article-content">
              {page.sections.map((section, index) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                  {index === (page.adSlots?.inlineAfterSection ?? 0) && <AdSlot id="ad-inline-article" />}
                </section>
              ))}
              {page.authorNote && (
                <aside className="article-note">
                  <span className="eyebrow">Практика</span>
                  <h2>{page.authorNote.title}</h2>
                  <p>{page.authorNote.text}</p>
                </aside>
              )}
            </div>
            <aside className="article-aside">
              <AdSlot id="ad-sidebar-desktop" label={page.adSlots?.sidebarLabel ?? "Баннер"} />
              <div>
                <span className="eyebrow">Связано</span>
                {page.related.map((item) => (
                  <Link href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </aside>
          </div>

          {page.gallery && (
            <section className="article-gallery">
              <div>
                <span className="eyebrow">Фото</span>
                <h2>Визуальные опоры страницы</h2>
              </div>
              <div>
                {page.gallery.map((item) => (
                  <figure key={item.src + item.caption}>
                    <Image src={item.src} alt={item.alt} width={520} height={360} />
                    <figcaption>{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {page.adSlots?.midPage && <AdSlot id="ad-mid-content-page" label="Рекламное место в материале" />}

          {page.nextSteps && (
            <section className="article-next">
              <span className="eyebrow">Что выбрать дальше</span>
              <h2>Следующий шаг по задаче</h2>
              <div>
                {page.nextSteps.map((item) => (
                  <Link href={item.href} key={item.href}>
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="ny-faq">
            <span className="eyebrow">Вопросы</span>
            <h2>Что уточнить</h2>
            <div>
              {page.faq.map((item) => (
                <article key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </article>

        <CTA label={page.cta} />
      </>
    );
  }

  const contentHubPath = contentHubPathFromSlug(slug);
  if (contentHubPath) {
    const page: ContentHub = contentHubs[contentHubPath];
    const groups = page.groups ?? [];
    const breadcrumbs = buildBreadcrumbs(contentHubPath);
    const jsonLd = [
      createWebPageJsonLd({
        path: contentHubPath,
        title: page.title,
        description: page.description
      }),
      createItemListJsonLd({
        path: contentHubPath,
        title: page.title,
        items: page.items
      }),
      createBreadcrumbJsonLd(breadcrumbs)
    ];

    return (
      <>
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={breadcrumbs} />
        <SectionHero kicker={page.kicker} title={page.title} description={page.intro} cta={page.cta} />
        {groups.length > 0 && (
          <section className="hub-groups" aria-label="Быстрый выбор материалов">
            <div className="listing-heading hub-groups-heading">
              <span className="eyebrow">Быстрый выбор</span>
              <h2>Найти материал по задаче</h2>
            </div>
            <div className="hub-group-grid">
              {groups.map((group) => (
                <article className="hub-group-card" key={group.title}>
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.text}</p>
                  </div>
                  <div className="hub-group-links">
                    {group.links.map((link) => (
                      <Link href={link.href} key={link.href}>
                        <span>{link.tag}</span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        <AdSlot id="ad-inline-content-hub" />
        <section className="listing-heading">
          <span className="eyebrow">Материалы</span>
          <h2>Страницы для роста трафика</h2>
        </section>
        <section className="listing">
          {page.items.map((item) => (
            <CatalogCard item={item} key={item.href} />
          ))}
        </section>
        <CTA label={page.cta} />
      </>
    );
  }

  const landingPath = landingPathFromSlug(slug);
  if (landingPath) {
    const page = landingPages[landingPath];
    const breadcrumbs = buildBreadcrumbs(landingPath);
    const jsonLd = [
      createWebPageJsonLd({
        path: landingPath,
        title: page.title,
        description: page.description,
        image: page.media?.src
      }),
      createBreadcrumbJsonLd(breadcrumbs)
    ];

    return (
      <>
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={breadcrumbs} />
        <section className={page.media ? "section-hero landing-hero landing-hero-media" : "section-hero landing-hero"}>
          <div>
            <span className="eyebrow">{page.kicker}</span>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
            <div className="hero-actions">
              <a className="button primary" href="#zayavka">
                {page.cta}
              </a>
              <Link className="button ghost" href="/tseny">
                Цены и форматы
              </Link>
            </div>
          </div>
          {page.media && (
            <figure className="landing-media">
              <Image src={page.media.src} alt={page.media.alt} width={680} height={480} priority />
              <figcaption>{page.media.caption}</figcaption>
            </figure>
          )}
        </section>

        <section className="landing-facts" aria-label="Коротко о программе">
          {page.facts.map((fact) => (
            <article key={fact}>
              <span />
              <strong>{fact}</strong>
            </article>
          ))}
        </section>

        <section className="landing-sections">
          {page.sections.map((section) => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </section>

        <AdSlot id="ad-inline-after-intro" />

        <section className="ny-places landing-includes">
          <div>
            <span className="eyebrow">Что входит</span>
            <h2>Наполнение подбирается под задачу</h2>
          </div>
          <ul>
            {page.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <GalleryStrip />

        <section className="ny-faq">
          <span className="eyebrow">Вопросы</span>
          <h2>Что уточнить перед заказом</h2>
          <div>
            {page.faq.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ny-related">
          <h2>Полезно посмотреть рядом</h2>
          <div>
            {page.related.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="source-note">
          <span>SEO-источник старой страницы:</span>
          <code>{page.sourceUrl}</code>
        </section>

        <CTA label={page.cta} />
      </>
    );
  }

  const path = pathFromSlug(slug);
  if (!path) notFound();

  const page = pages[path];
  const breadcrumbs = buildBreadcrumbs(path);
  const jsonLd = [
    createWebPageJsonLd({
      path,
      title: page.title,
      description: page.description
    }),
    createBreadcrumbJsonLd(breadcrumbs)
  ];
  const showGallery = path === "/foto-video" || path === "/spektakli";
  const isContactPage = path === "/kontakty";

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={breadcrumbs} />
      <SectionHero kicker={page.kicker} title={page.title} description={page.description} cta={page.cta} />
      <CatalogSummary items={page.items} cta={page.cta} />
      <AdSlot id="ad-inline-after-summary" />
      <CatalogRelated page={page} isContactPage={isContactPage} />
      <section className="listing-heading">
        <span className="eyebrow">{isContactPage ? "Связаться" : "Каталог"}</span>
        <h2>{isContactPage ? "Выберите удобный способ" : "Популярные направления"}</h2>
      </section>
      <section className="listing">
        {page.items.map((item) => (
          <CatalogCard item={item} key={item.title} />
        ))}
      </section>
      {path === "/tseny" && (
        <section className="note-band" id="discount">
          <h2>Повторный заказ</h2>
          <p>Для семей, которые уже приглашали театр «Маскарад», сохраняем скидку 10%.</p>
        </section>
      )}
      {showGallery && <GalleryStrip />}
      <CTA label={page.cta} />
    </>
  );
}

function ContentDisclosure({ kind }: { kind: PortalContentPage["kind"] }) {
  const disclosure =
    kind === "case"
      ? {
          label: "Редакционный кейс",
          text: "Материал показывает возможную структуру праздника и не выдается за подтвержденный отчет без отдельной отметки."
        }
      : kind === "collection"
        ? {
            label: "Подборка",
            text: "Редакционный материал для выбора формата: сценарии, услуги и площадки нужно уточнять под дату, возраст и группу."
          }
        : {
            label: "Гайд",
            text: "Редакционный материал на основе структуры услуг и опыта выездного театра; финальные условия уточняются перед заявкой."
          };

  return (
    <div className="content-disclosure">
      <strong>{disclosure.label}</strong>
      <span>{disclosure.text}</span>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function CatalogRelated({ page, isContactPage }: { page: (typeof pages)[PagePath]; isContactPage: boolean }) {
  return (
    <section className="catalog-related">
      <div>
        <span className="eyebrow">{isContactPage ? "Маршруты" : "Быстрый выбор"}</span>
        <h2>{page.relatedTitle}</h2>
      </div>
      <div>
        {page.related.map((item) => (
          <Link href={item.href} key={item.href}>
            <strong>{item.label}</strong>
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CatalogSummary({ items, cta }: { items: CatalogItem[]; cta: string }) {
  const linkedCount = items.filter((item) => item.href && !item.href.startsWith("#") && !item.href.startsWith("tel:")).length;
  const pendingCount = items.length - linkedCount;

  return (
    <section className="catalog-summary" aria-label="Кратко о разделе">
      <div>
        <strong>{items.length}</strong>
        <span>направлений в разделе</span>
      </div>
      <div>
        <strong>{linkedCount}</strong>
        <span>страниц уже раскрыты подробно</span>
      </div>
      <div>
        <strong>{pendingCount}</strong>
        <span>{pendingCount === 0 ? "без черновых карточек" : "еще ждут точного переноса"}</span>
      </div>
      <a href="#zayavka">{cta}</a>
    </section>
  );
}

function CatalogCard({ item }: { item: CatalogItem }) {
  const content = (
    <>
      <span className="listing-mark" />
      <div>
        <small>{item.tag}</small>
        <h2>{item.title}</h2>
      </div>
      <p>{item.text}</p>
      {item.href && <strong>{item.href.startsWith("tel:") || item.href.startsWith("#") ? "Перейти" : "Подробнее"}</strong>}
    </>
  );

  if (item.href) {
    return (
      <Link className="listing-card listing-card-link" href={item.href}>
        {content}
      </Link>
    );
  }

  return <article className="listing-card">{content}</article>;
}
