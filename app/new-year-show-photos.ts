import type { GalleryPhoto } from "./photo-viewer";

export const newYearShowPhotos = [
  {
    src: "/images/new-year-shows/new-year-cast-and-children.webp",
    alt: "Дед Мороз, Снегурочка, сказочные герои и дети после новогоднего спектакля",
    width: 1536,
    height: 1024
  },
  {
    src: "/images/new-year-shows/new-year-round-dance.webp",
    alt: "Дед Мороз, Олаф и дети водят новогодний хоровод",
    width: 1024,
    height: 572
  },
  {
    src: "/images/new-year-shows/snegurochka-and-reindeer.webp",
    alt: "Снегурочка верхом на сказочном северном олене",
    width: 1024,
    height: 683
  },
  {
    src: "/images/new-year-shows/olaf-and-ded-moroz-confetti.webp",
    alt: "Олаф и Дед Мороз встречают детей под серебряным конфетти",
    width: 1024,
    height: 1024
  },
  {
    src: "/images/new-year-shows/ded-moroz-snegurochka-children.webp",
    alt: "Дед Мороз, Снегурочка и дети на новогодней фотосессии",
    width: 1536,
    height: 1024
  },
  {
    src: "/images/new-year-shows/ded-moroz-and-bunny-game.webp",
    alt: "Дед Мороз и сказочный Заяц проводят игру с детьми",
    width: 931,
    height: 1024
  },
  {
    src: "/images/new-year-shows/frozen-cast.webp",
    alt: "Дед Мороз, Снегурочка, Олаф, северный олень и герои зимней сказки",
    width: 1024,
    height: 858
  }
] as const satisfies readonly GalleryPhoto[];
