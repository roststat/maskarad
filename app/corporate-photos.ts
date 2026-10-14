import { newYearShowPhotos } from "./new-year-show-photos";

export const corporatePhotos = {
  "new-year-main-celebration": {
    src: "/images/corporate/new-year-main-ded-moroz.webp",
    width: 1536,
    height: 1024,
    alt: "Дед Мороз, Снегурочка, сказочные герои и дети на корпоративной новогодней ёлке"
  },
  "new-year-cast-and-children": newYearShowPhotos[0],
  "new-year-round-dance": newYearShowPhotos[1],
  "snegurochka-and-reindeer": newYearShowPhotos[2],
  "olaf-ded-moroz-confetti": newYearShowPhotos[3],
  "ded-moroz-snegurochka-children": newYearShowPhotos[4],
  "ded-moroz-bunny-game": newYearShowPhotos[5],
  "frozen-cast": newYearShowPhotos[6]
} as const;

export type CorporatePhotoKey = keyof typeof corporatePhotos;
