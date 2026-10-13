import Image from "next/image";
import { PageStartLink as Link } from "./page-start-link";
import { PhotoOpenButton, type GalleryPhoto } from "./photo-viewer";
import { portfolioPhotos, photosForPage } from "./photo-library";

export function PhotoRibbon({ path, photos: suppliedPhotos }: { path?: string; photos?: readonly GalleryPhoto[] }) {
  const related = path ? photosForPage(path) : [];
  const photos = suppliedPhotos ?? (related.length ? related : portfolioPhotos.filter(photo => [35, 90, 65].includes(photo.id))).slice(0, 6);
  const isThemed = Boolean(suppliedPhotos?.length || related.length);
  return (
    <section className="portfolio-ribbon">
      <div className="portfolio-ribbon-heading">
        <div><span className="eyebrow">Фотографии театра</span><h2>{isThemed ? "Костюмы, герои и участие детей" : "Живые моменты наших программ"}</h2></div>
        <Link href="/foto-video">Все фотографии →</Link>
      </div>
      <div className="portfolio-grid">
        {photos.map((photo, index) => <figure key={photo.src}>
          <PhotoOpenButton photos={photos} index={index}><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1000px) 45vw, 360px" loading="lazy" /></PhotoOpenButton>
          <figcaption>{photo.alt}</figcaption>
        </figure>)}
      </div>
    </section>
  );
}
