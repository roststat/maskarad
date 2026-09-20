import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTA, GalleryStrip, SectionHero } from "../components";
import { pages, type PagePath } from "../data";

type Params = {
  params: Promise<{ slug: string[] }>;
};

function pathFromSlug(slug: string[]): PagePath | null {
  const path = `/${slug.join("/")}`;
  return path in pages ? (path as PagePath) : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  if (!path) return {};
  const page = pages[path];

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path
    }
  };
}

export function generateStaticParams() {
  return Object.keys(pages).map((path) => ({ slug: path.slice(1).split("/") }));
}

export default async function ContentPage({ params }: Params) {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  if (!path) notFound();

  const page = pages[path];
  const showGallery = path === "/foto-video" || path === "/spektakli";

  return (
    <>
      <SectionHero kicker={page.kicker} title={page.title} description={page.description} cta={page.cta} />
      <section className="listing">
        {page.items.map((item) => (
          <article key={item}>
            <span />
            <h2>{item}</h2>
            <p>
              Подберем длительность, наполнение и площадку под возраст детей, формат события и настроение
              вашей семьи или команды.
            </p>
          </article>
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
