import Image from "next/image";
import { PhotoOpenButton } from "./photo-viewer";
import { corporatePhotos, type CorporatePhotoKey } from "./corporate-photos";

const corporatePhotoList = Object.values(corporatePhotos);

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
      <PhotoOpenButton photos={corporatePhotoList} index={corporatePhotoList.findIndex(item => item.src === image.src)}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} />
      </PhotoOpenButton>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
