import type { Metadata } from "next";
import { Footer, Header } from "./components";
import { PartyAssistantProvider } from "./party-assistant-widget";
import { JsonLd, createOrganizationJsonLd, createWebsiteJsonLd } from "./seo";
import { YandexMetrica } from "./yandex-metrica";
import { PhotoViewerProvider } from "./photo-viewer";
import { PageStartProvider } from "./page-start-link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maskarad-teatr.ru"),
  title: {
    default: "Театр праздника «Маскарад» в Москве",
    template: "%s | Театр «Маскарад»"
  },
  description:
    "Современный сайт театра праздника «Маскарад»: спектакли, детские праздники, услуги, цены, отзывы и заявка.",
  verification: {
    yandex: "9b3ead6f9d06c9c0"
  },
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
    siteName: "Театр праздника «Маскарад»",
    title: "Театр праздника «Маскарад» в Москве",
    description:
      "Выездные спектакли, детские праздники, выпускные, программы для сада, школы и бизнеса в Москве и Московской области.",
    images: [
      {
        url: "/images/legacy/interaktiv01.jpg",
        width: 1200,
        height: 630,
        alt: "Театр праздника Маскарад"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Театр праздника «Маскарад» в Москве",
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
        <YandexMetrica />
        <noscript><div><img src="https://mc.yandex.ru/watch/113579092" style={{ position: "absolute", left: -9999 }} alt="" /></div></noscript>
        <PageStartProvider><PartyAssistantProvider>
          <Header />
          <PhotoViewerProvider><main>{children}</main></PhotoViewerProvider>
          <Footer />
        </PartyAssistantProvider></PageStartProvider>
      </body>
    </html>
  );
}
