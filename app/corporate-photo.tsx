import Image from "next/image";
import { corporatePhotos, type CorporatePhotoKey } from "./corporate-photos";

export function CorporatePhoto({ photo, caption, className = "", eager = false, sizes = "(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) 45vw, 560px" }: {
  photo: CorporatePhotoKey;
  caption?: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const image = corporatePhotos[photo];
  return (
    <figure className={`ny-photo ${className}`}>
      <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label={`Открыть фото: ${image.alt}`}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} />
      </a>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
