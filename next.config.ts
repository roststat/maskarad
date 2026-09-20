import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maskarad-teatr.ru"
      }
    ]
  },
  async redirects() {
    return [
      { source: "/maskarad/index.html", destination: "/o-teatre", permanent: true },
      { source: "/maskarad/price.html", destination: "/tseny", permanent: true },
      { source: "/maskarad/zakaz.html", destination: "/kontakty", permanent: true },
      { source: "/maskarad/contacts.html", destination: "/kontakty", permanent: true },
      { source: "/maskarad/kniga-otzyvov.html", destination: "/otzyvy-pressa", permanent: true },
      { source: "/maskarad/pressa.html", destination: "/otzyvy-pressa", permanent: true },
      { source: "/foto", destination: "/foto-video", permanent: true },
      { source: "/foto/:path*", destination: "/foto-video", permanent: true },
      { source: "/detskie-uslugi/index.html", destination: "/uslugi", permanent: true },
      { source: "/detskie-uslugi/:path*", destination: "/uslugi", permanent: true },
      { source: "/detskie-prazdniki/index.html", destination: "/prazdniki", permanent: true },
      { source: "/detskie-prazdniki/:path*", destination: "/prazdniki", permanent: true },
      { source: "/detskii-prazdnik/index.html", destination: "/spektakli", permanent: true },
      { source: "/detskii-prazdnik/:path*", destination: "/spektakli", permanent: true },
      { source: "/detkii-prazdnik/:path*", destination: "/spektakli", permanent: true },
      { source: "/teatr/spektakl/:path*", destination: "/spektakli", permanent: true },
      { source: "/scenarii/:path*", destination: "/prazdniki", permanent: true },
      { source: "/karta.html", destination: "/", permanent: true }
    ];
  }
};

export default nextConfig;
