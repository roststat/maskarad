import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { createHash } from "node:crypto";
import { PhotoOpenButton } from "./photo-viewer";
import { portfolioPhotos, photosForPage } from "./photo-library";

function photoScore(value: string) {
  return createHash("sha256").update(value).digest().readUInt32BE(0);
}

export function selectMiniGalleryPhotos(path: string) {
  const count = photoScore(path) % 3 === 0 ? 3 : 4;
  const related = photosForPage(path);
  const heroId = path === "/" ? 35 : path === "/prazdniki/korporativnyy-novogodniy-prazdnik" ? 77 : related[0]?.id;
  const rank = (a: typeof portfolioPhotos[number], b: typeof portfolioPhotos[number]) => photoScore(`${path}:${a.id}`) - photoScore(`${path}:${b.id}`) || a.id - b.id;
  const themed = related.filter(photo => photo.id !== heroId).sort(rank);
  const neutralIds = /novogod|novyy-god/.test(path)
    ? [27, 35, 38, 40, 47, 51, 53, 61, 65, 66, 73, 77, 89, 90, 92, 96, 97, 99, 100, 102]
    : [4, 5, 11, 13, 24, 27, 28, 35, 38, 40, 41, 42, 47, 50, 51, 53, 58, 61, 63, 65, 66, 68, 73, 76, 77, 82, 83, 84, 89, 90, 92, 95, 96, 97, 99, 100, 102];
  const neutral = portfolioPhotos.filter(photo => neutralIds.includes(photo.id) && photo.id !== heroId && !themed.some(item => item.id === photo.id)).sort(rank);
  return [...themed, ...neutral].slice(0, count);
}

export function MiniGallery({ path }: { path: string }) {
  const photos = selectMiniGalleryPhotos(path);
  const galleryHref = "/foto-video#portfolio-gallery-title";
  return (
    <section className="mini-gallery" aria-label="Фотографии театра">
      <div className="mini-gallery-heading">
        <span>Моменты наших праздников</span>
        <Link href={galleryHref}>Все фотографии <span aria-hidden="true">→</span></Link>
      </div>
      <div className="mini-gallery-photos" style={{ "--mini-photo-count": photos.length } as CSSProperties}>
        {photos.map((photo, index) => (
          <PhotoOpenButton key={photo.id} photos={photos} index={index}>
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 600px) 45vw, (max-width: 1200px) 23vw, 280px" loading="lazy" />
          </PhotoOpenButton>
        ))}
      </div>
    </section>
  );
}
