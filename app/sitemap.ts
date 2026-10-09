import type { MetadataRoute } from "next";
import { contentHubs, contentPages } from "./content-data";
import { pages } from "./data";
import { landingPages } from "./landing-data";

const base = "https://maskarad-teatr.ru";
const defaultUpdatedAt = new Date("2026-10-04");
const homeUpdatedAt = new Date("2026-10-09");
// Substantive programme photos and the corporate offer released on 9 October.
const photoReleasePaths = new Set([
  "/foto-video",
  "/prazdniki/korporativnyy-novogodniy-prazdnik",
  "/prazdniki/maslenitsa",
  "/spektakli/alisa-v-strane-chudes",
  "/spektakli/madagaskar",
  "/spektakli/novogodnyaya-belosnezhka",
  "/spektakli/peppi-dlinnyy-chulok",
  "/spektakli/piraty-karibskogo-morya",
  "/spektakli/piter-pen",
  "/spektakli/skazka-shreka",
  "/spektakli/smurfiki",
  "/spektakli/supergeroi",
  "/spektakli/vinni-puh",
  "/spektakli/zolushka",
  "/uslugi/akvagrim",
  "/uslugi/detskiy-tort",
  "/uslugi/oformlenie-sharami",
  "/uslugi/shou-mylnyh-puzyrey"
]);
function pageUpdatedAt(path: string) {
  return photoReleasePaths.has(path) ? homeUpdatedAt : defaultUpdatedAt;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const priorityPages = [
    "/prazdniki/korporativnyy-novogodniy-prazdnik",
    ...Object.keys(landingPages)
  ];

  return [
    {
      url: base,
      lastModified: homeUpdatedAt,
      changeFrequency: "weekly",
      priority: 1
    },
    ...priorityPages.map((path) => ({
      url: `${base}${path}`,
      lastModified: pageUpdatedAt(path),
      changeFrequency: "monthly" as const,
      priority: 0.95
    })),
    ...Object.keys(pages).map((path) => ({
      url: `${base}${path}`,
      lastModified: pageUpdatedAt(path),
      changeFrequency: "weekly" as const,
      priority: path === "/kontakty" ? 0.9 : 0.8
    })),
    ...Object.keys(contentHubs).map((path) => ({
      url: `${base}${path}`,
      lastModified: pageUpdatedAt(path),
      changeFrequency: "daily" as const,
      priority: 0.78
    })),
    ...Object.keys(contentPages).map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(contentPages[path as keyof typeof contentPages].updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.72
    }))
  ];
}
