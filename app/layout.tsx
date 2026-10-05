import type { Metadata } from "next";
import { Footer, Header } from "./components";
import { JsonLd, createOrganizationJsonLd, createWebsiteJsonLd } from "./seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maskarad-teatr.ru"),
  title: {
    default: "Детский выездной театр «Маскарад» в Москве",
    template: "%s | Театр «Маскарад»"
  },
  description:
    "Современный сайт детского выездного театра «Маскарад»: спектакли, детские праздники, услуги, цены, отзывы и заявка.",
  keywords: [
    "детский театр",
    "выездной театр",
    "детский праздник",
    "день рождения ребенка",
    "детские спектакли Москва",
    "театр Маскарад"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Детский выездной театр «Маскарад»",
    title: "Детский выездной театр «Маскарад» в Москве",
    description:
      "Выездные спектакли, детские праздники, выпускные, программы для сада, школы и бизнеса в Москве и Московской области.",
    images: [
      {
        url: "/images/legacy/interaktiv01.jpg",
        width: 1200,
        height: 630,
        alt: "Детский выездной театр Маскарад"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Детский выездной театр «Маскарад» в Москве",
    description:
      "Выездные спектакли, детские праздники, выпускные, программы для сада, школы и бизнеса в Москве и Московской области.",
    images: ["/images/legacy/interaktiv01.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <JsonLd data={[createOrganizationJsonLd(), createWebsiteJsonLd()]} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
