import Image from "next/image";
import Link from "next/link";
import { portfolioPhotos, photosForPage } from "./photo-library";

export function PhotoRibbon({ path }: { path?: string }) {
  const related = path ? photosForPage(path) : [];
  const photos = related.length ? related : portfolioPhotos.filter(photo => [35, 90, 65].includes(photo.id));
  return (
    <section className="portfolio-ribbon">
      <div className="portfolio-ribbon-heading">
        <div><span className="eyebrow">Фотографии театра</span><h2>{related.length ? "Костюмы, герои и участие детей" : "Живые моменты наших программ"}</h2></div>
        <Link href="/foto-video">Все фотографии →</Link>
      </div>
      <div className="portfolio-grid">
        {photos.slice(0, 6).map(photo => <figure key={photo.id}>
          <a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`Открыть фото: ${photo.alt}`}><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1000px) 45vw, 360px" loading="lazy" /></a>
          <figcaption>{photo.alt}</figcaption>
        </figure>)}
      </div>
    </section>
  );
}
