"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PortfolioPhoto } from "./photo-library";

export function PhotoGallery({ photos }: { photos: PortfolioPhoto[] }) {
  const [category, setCategory] = useState("Все фотографии");
  const [limit, setLimit] = useState(24);
  const categories = ["Все фотографии", ...new Set(photos.map(photo => photo.category))];
  const featuredIds = [35, 77, 90, 65, 47, 97, 40, 61, 53, 59, 51, 27];
  const ordered = [...featuredIds.flatMap(id => photos.filter(photo => photo.id === id)), ...photos.filter(photo => !featuredIds.includes(photo.id))];
  const filtered = category === categories[0] ? ordered : ordered.filter(photo => photo.category === category);
  return (
    <section className="portfolio-gallery" aria-labelledby="portfolio-gallery-title">
      <div className="intro">
        <span className="eyebrow">Наши праздники в фотографиях</span>
        <h2 id="portfolio-gallery-title">Посмотрите, как всё происходит</h2>
        <p>Актёры и дети, спектакли и игры, костюмы и оформление. Выберите, что интересно вам, и откройте любой кадр крупнее.</p>
      </div>
      <div className="portfolio-filters" role="group" aria-label="Темы фотографий">
        {categories.map(item => <button key={item} type="button" aria-pressed={item === category} onClick={() => { setCategory(item); setLimit(24); }}>{item} <span>{item === categories[0] ? photos.length : photos.filter(photo => photo.category === item).length}</span></button>)}
      </div>
      <p className="portfolio-count" role="status">Показано {Math.min(limit, filtered.length)} из {filtered.length} фотографий</p>
      <div className="portfolio-grid">
        {filtered.slice(0, limit).map(photo => (
          <figure key={photo.id}>
            <a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`Открыть фото: ${photo.alt}`}>
              <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1000px) 45vw, 360px" loading="lazy" />
            </a>
            <figcaption>{photo.alt}{photo.href && <Link href={photo.href}>Посмотреть программу →</Link>}</figcaption>
          </figure>
        ))}
      </div>
      {limit < filtered.length && <button className="button ghost portfolio-more" type="button" onClick={() => setLimit(value => value + 24)}>Показать ещё фотографии</button>}
    </section>
  );
}
