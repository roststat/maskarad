import type { Metadata } from "next";
import { PageStartLink as Link } from "../page-start-link";
import sitemap from "../sitemap";
import { Breadcrumbs, JsonLd, buildBreadcrumbs, createBreadcrumbJsonLd, getPageTitle } from "../seo";
import styles from "./sitemap.module.css";

const path = "/karta-sayta";
const title = "Карта сайта";
const description = "Все разделы театра «Маскарад»: праздники, спектакли, услуги, статьи, кейсы, фотографии и контакты.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: path },
  openGraph: { title, description, url: path },
  twitter: { card: "summary_large_image", title, description }
};

const sections = [
  { id: "theatre", title: "О театре и основные разделы", prefixes: [] as string[] },
  { id: "parties", title: "Праздники", prefixes: ["/prazdniki"] },
  { id: "shows", title: "Спектакли", prefixes: ["/spektakli"] },
  { id: "services", title: "Услуги", prefixes: ["/uslugi"] },
  { id: "articles", title: "Статьи и советы", prefixes: ["/stati"] },
  { id: "cases", title: "Кейсы", prefixes: ["/kejsy"] },
  { id: "collections", title: "Подборки", prefixes: ["/podboroki"] }
];
const documents = [
  { href: "/privacy-policy", title: "Политика обработки персональных данных" },
  { href: "/personal-data-consent", title: "Согласие на обработку персональных данных" },
  { href: "/cookie-policy", title: "Политика cookies" },
  { href: "/terms", title: "Условия использования сайта" }
];

export default function SitemapPage() {
  const crumbs = buildBreadcrumbs(path);
  const groups = sections.map(section => ({ ...section, items: [] as { href: string; title: string }[] }));
  for (const entry of sitemap()) {
    const href = new URL(entry.url).pathname;
    const label = href === "/" ? "Главная" : getPageTitle(href);
    if (!label) throw new Error(`Нет названия страницы для карты сайта: ${href}`);
    const group = groups.find(section => section.prefixes.some(prefix => href === prefix || href.startsWith(`${prefix}/`))) ?? groups[0];
    group.items.push({ href, title: label });
  }
  for (const group of groups) {
    group.items.sort((a, b) => a.href.split("/").filter(Boolean).length - b.href.split("/").filter(Boolean).length || a.title.localeCompare(b.title, "ru"));
  }
  const visibleGroups = [...groups.filter(group => group.items.length), { id: "documents", title: "Документы сайта", items: documents }];
  return <>
    <Breadcrumbs items={crumbs} />
    <JsonLd data={createBreadcrumbJsonLd(crumbs)} />
    <div className={styles.map}>
      <header className={styles.intro}>
        <span className="eyebrow">Все разделы</span>
        <h1>Карта сайта</h1>
        <p>Найдите спектакль, выберите формат праздника или почитайте советы по его подготовке.</p>
      </header>
      <nav className={styles.contents} aria-label="Разделы карты сайта">
        {visibleGroups.map(group => <a key={group.id} href={`#${group.id}`}>{group.title}</a>)}
      </nav>
      <div className={styles.grid} data-sitemap-links>
        {visibleGroups.map(group => <section key={group.id} id={group.id} className={styles.section} aria-labelledby={`${group.id}-title`}>
          <h2 id={`${group.id}-title`}>{group.title}</h2>
          <ul>{group.items.map(item => <li key={item.href}><Link href={item.href}>{item.title}</Link></li>)}</ul>
        </section>)}
      </div>
    </div>
  </>;
}
