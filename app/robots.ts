import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"]
      }
    ],
    sitemap: "https://maskarad-teatr.ru/sitemap.xml",
    host: "https://maskarad-teatr.ru"
  };
}
