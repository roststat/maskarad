import type { MetadataRoute } from "next";
import { pages } from "./data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://maskarad-teatr.ru";
  return [
    {
      url: base,
      lastModified: new Date(),
      priority: 1
    },
    ...Object.keys(pages).map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      priority: path === "/kontakty" ? 0.9 : 0.8
    }))
  ];
}
