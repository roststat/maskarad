import Link from "next/link";
import { contentHubs, contentPages, type ContentHubPath, type ContentPagePath } from "./content-data";
import { pages, type PagePath } from "./data";
import { landingPages, type LandingPath } from "./landing-data";

const siteUrl = "https://maskarad-teatr.ru";
const siteName = "Детский выездной театр «Маскарад»";

type BreadcrumbItem = {
  href: string;
  label: string;
};

const sectionLabels: Record<string, string> = {
  "dlya-detey": "Для детей",
  "dlya-vzroslyh": "Для взрослых",
  "dlya-biznesa": "Для бизнеса",
  spektakli: "Спектакли",
  uslugi: "Услуги",
  prazdniki: "Праздники",
  stati: "Идеи и кейсы",
  kejsy: "Кейсы",
  podboroki: "Подборки"
};

const customPageLabels: Record<string, string> = {
  "/prazdniki/korporativnyy-novogodniy-prazdnik": "Корпоративный новогодний праздник"
};

function getPageTitle(path: string) {
  if (path in customPageLabels) return customPageLabels[path];
  if (path in contentPages) return contentPages[path as ContentPagePath].title;
  if (path in contentHubs) return contentHubs[path as ContentHubPath].title;
  if (path in landingPages) return landingPages[path as LandingPath].title;
  if (path in pages) return pages[path as PagePath].title;
  return null;
}

function fallbackLabel(segment: string) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function buildBreadcrumbs(path: string): BreadcrumbItem[] {
  const segments = path.split("/").filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ href: "/", label: "Главная" }];

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    crumbs.push({
      href,
      label: getPageTitle(href) ?? sectionLabels[segment] ?? fallbackLabel(segment)
    });
  });

  return crumbs;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href}>
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${siteUrl}${item.href === "/" ? "" : item.href}`
    }))
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: siteName,
    url: siteUrl,
    telephone: "+79951219467",
    areaServed: ["Москва", "Московская область"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+79951219467",
      contactType: "customer service",
      availableLanguage: "Russian"
    }
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: siteName,
    inLanguage: "ru-RU",
    publisher: {
      "@id": `${siteUrl}#organization`
    }
  };
}

export function createWebPageJsonLd({
  path,
  title,
  description,
  image
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}${path}#webpage`,
    url: `${siteUrl}${path}`,
    name: title,
    description,
    inLanguage: "ru-RU",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: siteName
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: siteName,
      url: siteUrl,
      telephone: "+79951219467",
      areaServed: ["Москва", "Московская область"]
    },
    ...(image
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: `${siteUrl}${image}`
          }
        }
      : {})
  };
}

export function createArticleJsonLd({
  path,
  title,
  description,
  image,
  publishedAt,
  updatedAt
}: {
  path: string;
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  updatedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}${path}#article`,
    mainEntityOfPage: `${siteUrl}${path}`,
    headline: title,
    description,
    image: `${siteUrl}${image}`,
    datePublished: publishedAt,
    dateModified: updatedAt,
    inLanguage: "ru-RU",
    author: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: siteName,
      url: siteUrl,
      telephone: "+79951219467"
    }
  };
}

export function createItemListJsonLd({
  path,
  title,
  items
}: {
  path: string;
  title: string;
  items: {
    href: string;
    title: string;
    text: string;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}${path}#itemlist`,
    name: title,
    url: `${siteUrl}${path}`,
    inLanguage: "ru-RU",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}${item.href}`,
      name: item.title,
      description: item.text
    }))
  };
}

export function createFaqJsonLd({
  path,
  items
}: {
  path: string;
  items: {
    question: string;
    answer: string;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}${path}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function AdSlot({ id, label = "Рекламный блок" }: { id: string; label?: string }) {
  return (
    <aside className="ad-slot" data-ad-slot={id} aria-label={label}>
      <span>{label}</span>
      <p>Место под РСЯ, партнерский баннер или сезонное предложение.</p>
    </aside>
  );
}
