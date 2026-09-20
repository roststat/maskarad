import type { Metadata } from "next";
import { Footer, Header } from "./components";
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
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
