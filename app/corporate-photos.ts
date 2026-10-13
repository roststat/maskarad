export const corporatePhotos = {
  "new-year-elsa-reindeer": {
    src: "/images/corporate/new-year-elsa-reindeer.webp",
    width: 750,
    height: 500,
    alt: "Эльза и северный олень в новогодней декорации"
  },
  "new-year-confetti": {
    src: "/images/corporate/new-year-confetti.webp",
    width: 800,
    height: 800,
    alt: "Дети играют с Олафом и сказочными героями под праздничным конфетти"
  },
  "new-year-olaf-snowball": {
    src: "/images/corporate/new-year-olaf-snowball.webp",
    width: 800,
    height: 800,
    alt: "Олаф проводит новогоднюю игру с большим снежком"
  },
  "new-year-cast": {
    src: "/images/corporate/new-year-cast.webp",
    width: 1280,
    height: 1072,
    alt: "Команда новогоднего спектакля в костюмах сказочных героев"
  },
  "new-year-cast-venue": {
    src: "/images/corporate/new-year-cast-venue.webp",
    width: 719,
    height: 1280,
    alt: "Герои новогодней программы на праздничной площадке"
  },
  "corporate-aladdin-camel": {
    src: "/images/corporate/corporate-aladdin-camel.webp",
    width: 1024,
    height: 1280,
    alt: "Актёры восточной сказочной программы с верблюдом"
  },
  "corporate-alice-group": {
    src: "/images/corporate/corporate-alice-group.webp",
    width: 1280,
    height: 853,
    alt: "Дети и актёры программы по мотивам Алисы в Стране чудес"
  },
  "new-year-elsa-reindeer-second": {
    src: "/images/corporate/new-year-elsa-reindeer-second.webp",
    width: 750,
    height: 500,
    alt: "Эльза рядом с северным оленем в праздничной фотозоне"
  }
} as const;

export type CorporatePhotoKey = keyof typeof corporatePhotos;
