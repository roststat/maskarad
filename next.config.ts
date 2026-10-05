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
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/error.html", destination: "/", permanent: true },
      { source: "/maskarad/index.html", destination: "/o-teatre", permanent: true },
      { source: "/maskarad", destination: "/o-teatre", permanent: true },
      { source: "/maskarad/blagotvoritelnost.html", destination: "/o-teatre", permanent: true },
      { source: "/maskarad/klienty.html", destination: "/otzyvy-pressa", permanent: true },
      { source: "/maskarad/klienty1.html", destination: "/otzyvy-pressa", permanent: true },
      { source: "/maskarad/price.html", destination: "/tseny", permanent: true },
      { source: "/maskarad/zakaz.html", destination: "/kontakty", permanent: true },
      { source: "/maskarad/contacts.html", destination: "/kontakty", permanent: true },
      { source: "/maskarad/kniga-otzyvov.html", destination: "/otzyvy-pressa", permanent: true },
      { source: "/maskarad/kniga-otzyvov1.html", destination: "/otzyvy-pressa", permanent: true },
      { source: "/maskarad/pressa.html", destination: "/otzyvy-pressa", permanent: true },
      { source: "/maskarad/rabota.html", destination: "/kontakty", permanent: true },
      { source: "/maskarad/sotrudnichestvo.html", destination: "/kontakty", permanent: true },
      { source: "/maskarad/opros", destination: "/otzyvy-pressa", permanent: true },
      { source: "/maskarad/:path*", destination: "/o-teatre", permanent: true },
      { source: "/foto", destination: "/foto-video", permanent: true },
      { source: "/foto/galereya/", destination: "/foto-video", permanent: true },
      { source: "/foto/video.html", destination: "/foto-video", permanent: true },
      { source: "/foto/:path*", destination: "/foto-video", permanent: true },
      { source: "/news", destination: "/stati", permanent: true },
      { source: "/news/:path*", destination: "/stati", permanent: true },
      { source: "/partnery", destination: "/o-teatre", permanent: true },
      { source: "/partnery/index.html", destination: "/o-teatre", permanent: true },
      { source: "/partnery/list/", destination: "/o-teatre", permanent: true },
      { source: "/partnery/list/art/m/1076/p/96/", destination: "/o-teatre", permanent: true },
      { source: "/partnery/:path*", destination: "/o-teatre", permanent: true },
      { source: "/links/links.html", destination: "/o-teatre", permanent: true },
      { source: "/links/:path*", destination: "/o-teatre", permanent: true },
      { source: "/teatr", destination: "/", permanent: true },
      { source: "/teatr/index.html", destination: "/", permanent: true },
      { source: "/teatr/maskarad/contacts.html", destination: "/kontakty", permanent: true },
      { source: "/teatr/maskarad/price.html", destination: "/tseny", permanent: true },
      { source: "/teatr/maskarad/zakaz.html", destination: "/kontakty", permanent: true },
      { source: "/teatr/maskarad/kniga-otzyvov.html", destination: "/otzyvy-pressa", permanent: true },
      { source: "/teatr/maskarad/klienty.html", destination: "/otzyvy-pressa", permanent: true },
      { source: "/teatr/maskarad/", destination: "/o-teatre", permanent: true },
      { source: "/teatr/maskarad/index.html", destination: "/o-teatre", permanent: true },
      { source: "/teatr/maskarad/:path*", destination: "/o-teatre", permanent: true },
      { source: "/teatr/teatr/", destination: "/spektakli", permanent: true },
      { source: "/teatr/teatr/index.html", destination: "/spektakli", permanent: true },
      { source: "/teatr/teatr/:path*", destination: "/spektakli", permanent: true },
      { source: "/teatr/spektakl/", destination: "/spektakli", permanent: true },
      { source: "/teatr/spektakl/index.html", destination: "/spektakli", permanent: true },
      { source: "/teatr/spektakl/zolushka.html", destination: "/spektakli/zolushka", permanent: true },
      { source: "/teatr/spektakl/madagaskar.html", destination: "/spektakli/madagaskar", permanent: true },
      { source: "/teatr/spektakl/vinni-puh.html", destination: "/spektakli/vinni-puh", permanent: true },
      { source: "/teatr/spektakl/:path*", destination: "/spektakli", permanent: true },
      { source: "/teatr/:path*", destination: "/", permanent: true },
      { source: "/detskie-uslugi/index.html", destination: "/uslugi", permanent: true },
      { source: "/detskie-uslugi/", destination: "/uslugi", permanent: true },
      { source: "/detskie-uslugi/akvagrim.html", destination: "/uslugi/akvagrim", permanent: true },
      {
        source: "/detskie-uslugi/shou-mylnyh-puzyrei.html",
        destination: "/uslugi/shou-mylnyh-puzyrey",
        permanent: true
      },
      { source: "/detskie-uslugi/master-klassy.html", destination: "/uslugi/master-klassy", permanent: true },
      { source: "/detskie-uslugi/fokusy.html", destination: "/uslugi/cirkovye-fokusy", permanent: true },
      {
        source: "/detskie-uslugi/kukolnyy-spektakl.html",
        destination: "/uslugi/kukolnyy-spektakl",
        permanent: true
      },
      { source: "/detskie-uslugi/oformlenie-sharami.html", destination: "/uslugi/oformlenie-sharami", permanent: true },
      { source: "/detskie-uslugi/foto.html", destination: "/uslugi/foto-video", permanent: true },
      { source: "/detskie-uslugi/video.html", destination: "/uslugi/foto-video", permanent: true },
      { source: "/detskie-uslugi/keitering.html", destination: "/uslugi/keytering", permanent: true },
      {
        source: "/detskie-uslugi/spetsialnye-effekty.html",
        destination: "/uslugi/spetsialnye-effekty",
        permanent: true
      },
      { source: "/detskie-uslugi/attraktsiony.html", destination: "/uslugi/attraktsiony", permanent: true },
      { source: "/detskie-uslugi/feierverki-salyuty.html", destination: "/uslugi/spetsialnye-effekty", permanent: true },
      { source: "/detskie-uslugi/ognennoe-shou.html", destination: "/uslugi/spetsialnye-effekty", permanent: true },
      { source: "/detskie-uslugi/pesni.html", destination: "/uslugi/pozdravitelnaya-pesnya", permanent: true },
      { source: "/detskie-uslugi/arenda-teplohodov.html", destination: "/prazdniki/detskiy-prazdnik-na-teplohode", permanent: true },
      { source: "/detskie-uslugi/arenda-teplohodov/", destination: "/prazdniki/detskiy-prazdnik-na-teplohode", permanent: true },
      { source: "/detskie-uslugi/arenda-teplohodov/index.html", destination: "/prazdniki/detskiy-prazdnik-na-teplohode", permanent: true },
      { source: "/detskie-uslugi/arenda-teplohodov/vatel.html", destination: "/prazdniki/detskiy-prazdnik-na-teplohode", permanent: true },
      { source: "/detskie-uslugi/dressirovanye-zhivotnye.html", destination: "/uslugi/shou-s-zhivotnymi", permanent: true },
      { source: "/detskie-uslugi/torty.html", destination: "/uslugi/detskiy-tort", permanent: true },
      { source: "/detskie-uslugi/:path*", destination: "/uslugi", permanent: true },
      { source: "/detskie-prazdniki", destination: "/prazdniki", permanent: true },
      { source: "/detskie-prazdniki/index.html", destination: "/prazdniki", permanent: true },
      { source: "/detskie-prazdniki/spektakli.html", destination: "/spektakli", permanent: true },
      { source: "/detskie-prazdniki/den-znanii.html", destination: "/prazdniki/shkolnyy-prazdnik", permanent: true },
      {
        source: "/detskie-prazdniki/korporativnye-prazdniki.html",
        destination: "/prazdniki/korporativnyy-novogodniy-prazdnik",
        permanent: true
      },
      { source: "/detskie-prazdniki/exlusive.html", destination: "/prazdniki/individualnyy-detskiy-prazdnik", permanent: true },
      { source: "/detskie-prazdniki/film.html", destination: "/stati/semka-filma-s-detmi-na-prazdnike", permanent: true },
      { source: "/detskie-prazdniki/individualnye-prazdniki.html", destination: "/prazdniki/individualnyy-detskiy-prazdnik", permanent: true },
      { source: "/detskie-prazdniki/interaktiv.html", destination: "/podboroki/interaktivnye-spektakli-dlya-detey", permanent: true },
      { source: "/detskie-prazdniki/maslenitsa.html", destination: "/prazdniki/maslenitsa", permanent: true },
      { source: "/detskie-prazdniki/obrazovatelnye-prazdniki.html", destination: "/prazdniki/obrazovatelnyy-detskiy-prazdnik", permanent: true },
      {
        source: "/detskie-prazdniki/detskii-den-rozhdeniya.html",
        destination: "/prazdniki/detskiy-den-rozhdeniya",
        permanent: true
      },
      {
        source: "/detskie-prazdniki/detskii-sad-prazdnik.html",
        destination: "/prazdniki/detskiy-sad",
        permanent: true
      },
      {
        source: "/detskie-prazdniki/shkolnye-prazdniki.html",
        destination: "/prazdniki/shkolnyy-prazdnik",
        permanent: true
      },
      {
        source: "/detskie-prazdniki/detskii-novogodnii-prazdnik.html",
        destination: "/prazdniki/korporativnyy-novogodniy-prazdnik",
        permanent: true
      },
      {
        source: "/detskie-prazdniki/vypusknoi",
        destination: "/prazdniki/vypusknoy",
        permanent: true
      },
      {
        source: "/detskie-prazdniki/vypusknoi/index.html",
        destination: "/prazdniki/vypusknoy",
        permanent: true
      },
      {
        source: "/detskie-prazdniki/vypusknoi/detskii-sad.html",
        destination: "/prazdniki/vypusknoy-v-detskom-sadu",
        permanent: true
      },
      {
        source: "/detskie-prazdniki/vypusknoi/mladsheklassniki.html",
        destination: "/prazdniki/vypusknoy-v-nachalnoy-shkole",
        permanent: true
      },
      {
        source: "/detskie-prazdniki/vypusknoi/starsheklassniki.html",
        destination: "/prazdniki/vypusknoy-v-11-klasse",
        permanent: true
      },
      { source: "/detskie-prazdniki/:path*", destination: "/prazdniki", permanent: true },
      { source: "/detskii-prazdnik/index.html", destination: "/podboroki/interaktivnye-spektakli-dlya-detey", permanent: true },
      { source: "/detskii-prazdnik/", destination: "/spektakli", permanent: true },
      { source: "/detskii-prazdnik/interaktivnie-programmy.html", destination: "/podboroki/interaktivnye-spektakli-dlya-detey", permanent: true },
      { source: "/detskii-prazdnik/vozrastnie-spektakli.html", destination: "/podboroki/interaktivnye-spektakli-dlya-detey", permanent: true },
      { source: "/detskii-prazdnik/vinni-puh.html", destination: "/spektakli/vinni-puh", permanent: true },
      { source: "/detskii-spektakl", destination: "/spektakli", permanent: true },
      { source: "/detskii-spektakl/vinni-puh.html", destination: "/spektakli/vinni-puh", permanent: true },
      { source: "/detskii-spektakl/:path*", destination: "/spektakli", permanent: true },
      { source: "/detskii-prazdnik/zolushka.html", destination: "/spektakli/zolushka", permanent: true },
      {
        source: "/detskii-prazdnik/alisa.html",
        destination: "/spektakli/alisa-v-strane-chudes",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/peppi-dlinnii-chulok.html",
        destination: "/spektakli/peppi-dlinnyy-chulok",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/piraty-karibskogo-morya.html",
        destination: "/spektakli/piraty-karibskogo-morya",
        permanent: true
      },
      {
        source: "/detkii-prazdnik/piraty-karibskogo-morya.html",
        destination: "/spektakli/piraty-karibskogo-morya",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/belosnezhka.html",
        destination: "/spektakli/belosnezhka-i-sem-gnomov",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/mary-poppins.html",
        destination: "/spektakli/mary-poppins",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/sinbad-morehod.html",
        destination: "/spektakli/priklyucheniya-sindbada-morehoda",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/karlson.html",
        destination: "/spektakli/malysh-i-karlson",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/bremenskie-muzykanty.html",
        destination: "/spektakli/bremenskie-muzykanty",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/novogodnyaya-belosnezhka.html",
        destination: "/spektakli/novogodnyaya-belosnezhka",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/novyi-god",
        destination: "/spektakli/novogodnie-spektakli",
        permanent: true
      },
      {
        source: "/detskii-prazdnik/novyi-god/index.html",
        destination: "/spektakli/novogodnie-spektakli",
        permanent: true
      },
      { source: "/detskii-prazdnik/exspress.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novogodnyaya-skazka.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novogodnee-show.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novogodnii-ledn-period.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novogodnii-piter-pen.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novogodnii-vinny-puh.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novogodnii-zolotoi-klyuchik.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novogodnyaa-zolushka.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novogodnyaya-strana-chudes.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novoii-god-madagaskar.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/novoii-god-simpsons.html", destination: "/spektakli/novogodnie-spektakli", permanent: true },
      { source: "/detskii-prazdnik/alladin-zhasmin.html", destination: "/spektakli/alladin-i-zhasmin", permanent: true },
      { source: "/detskii-prazdnik/neznaika-v-tsvetochnom-gorode.html", destination: "/spektakli/neznaika-v-tsvetochnom-gorode", permanent: true },
      { source: "/detskii-prazdnik/piter-pen.html", destination: "/spektakli/piter-pen", permanent: true },
      { source: "/detskii-prazdnik/avatar.html", destination: "/spektakli/avatar", permanent: true },
      { source: "/detskii-prazdnik/balaganchik.html", destination: "/spektakli/skazochnyy-balaganchik", permanent: true },
      { source: "/detskii-prazdnik/fashion.html", destination: "/prazdniki/vypusknoy-v-stile-fashion", permanent: true },
      { source: "/detskii-prazdnik/holodnoe-serdce.html", destination: "/spektakli/holodnoe-serdtse", permanent: true },
      { source: "/detskii-prazdnik/istoriya-igrushek.html", destination: "/spektakli/istoriya-igrushek", permanent: true },
      { source: "/detskii-prazdnik/ivan-da-maria.html", destination: "/spektakli/ivan-da-marya", permanent: true },
      { source: "/detskii-prazdnik/kot-leopold.html", destination: "/spektakli/kot-leopold", permanent: true },
      { source: "/detskii-prazdnik/lednikovyi-period.html", destination: "/spektakli/lednikovyy-period", permanent: true },
      { source: "/detskii-prazdnik/madagaskar.html", destination: "/spektakli/madagaskar", permanent: true },
      { source: "/detskii-prazdnik/piraty.html", destination: "/spektakli/piraty-karibskogo-morya", permanent: true },
      { source: "/detskii-prazdnik/polyarnyi-ekspress.html", destination: "/spektakli/novogodnyy-ekspress", permanent: true },
      { source: "/detskii-prazdnik/pyatyi-element.html", destination: "/spektakli/pyatyy-element", permanent: true },
      { source: "/detskii-prazdnik/simpsony.html", destination: "/spektakli/simpsony", permanent: true },
      { source: "/detskii-prazdnik/skazka-elfov.html", destination: "/spektakli/skazka-elfov", permanent: true },
      { source: "/detskii-prazdnik/skazka-shreka.html", destination: "/spektakli/skazka-shreka", permanent: true },
      { source: "/detskii-prazdnik/smurfiki.html", destination: "/spektakli/smurfiki", permanent: true },
      { source: "/detskii-prazdnik/supergeroi.html", destination: "/spektakli/supergeroi", permanent: true },
      { source: "/detskii-prazdnik/tainy-snejnoi-planety.html", destination: "/spektakli/novyy-god-na-snezhnoy-planete", permanent: true },
      { source: "/detskii-prazdnik/tri-mushketera.html", destination: "/spektakli/tri-mushketera", permanent: true },
      { source: "/detskii-prazdnik/volshebnaya-feya.html", destination: "/spektakli/volshebnaya-feya", permanent: true },
      { source: "/detskii-prazdnik/winx.html", destination: "/spektakli/shkola-volshebnic", permanent: true },
      { source: "/detskii-prazdnik/zolotoi-klyuchik.html", destination: "/spektakli/zolotoy-klyuchik", permanent: true },
      { source: "/detkii-prazdnik/alladin-zhasmin.html", destination: "/spektakli/alladin-i-zhasmin", permanent: true },
      { source: "/detkii-prazdnik/neznaika-v-tsvetochnom-gorode.html", destination: "/spektakli/neznaika-v-tsvetochnom-gorode", permanent: true },
      { source: "/detkii-prazdnik/piter-pen.html", destination: "/spektakli/piter-pen", permanent: true },
      { source: "/detskii-prazdnik/:path*", destination: "/spektakli", permanent: true },
      { source: "/detkii-prazdnik/:path*", destination: "/spektakli", permanent: true },
      { source: "/scenarii/", destination: "/podboroki/scenarii-detskih-prazdnikov", permanent: true },
      { source: "/scenarii/index.html", destination: "/podboroki/scenarii-detskih-prazdnikov", permanent: true },
      {
        source: "/scenarii/detskii-novogodnii-prazdnik.html",
        destination: "/podboroki/novogodnie-programmy-dlya-detey",
        permanent: true
      },
      {
        source: "/scenarii/novogodnyaya-elka.html",
        destination: "/podboroki/novogodnie-programmy-dlya-detey",
        permanent: true
      },
      {
        source: "/scenarii/rozhdestvo.html",
        destination: "/podboroki/novogodnie-programmy-dlya-detey",
        permanent: true
      },
      {
        source: "/scenarii/detskii-prazdnik-den-znaniy.html",
        destination: "/stati/prazdnik-v-shkole-kak-sobrat-programmu",
        permanent: true
      },
      {
        source: "/scenarii/den-uchitelya.html",
        destination: "/stati/prazdnik-v-shkole-kak-sobrat-programmu",
        permanent: true
      },
      { source: "/scenarii/den-imeninnika.html", destination: "/prazdniki/detskiy-den-rozhdeniya", permanent: true },
      { source: "/scenarii/halloween.html", destination: "/stati/detskiy-prazdnik-na-hellouin", permanent: true },
      { source: "/scenarii/maslenitsa.html", destination: "/prazdniki/maslenitsa", permanent: true },
      { source: "/scenarii/aforizmy.html", destination: "/podboroki/scenarii-detskih-prazdnikov", permanent: true },
      { source: "/scenarii/detskii-prazdnik-bukvarya.html", destination: "/stati/prazdnik-bukvarya-scenariy-dlya-1-klassa", permanent: true },
      { source: "/scenarii/detskii-prazdnik-chudesnaya-karusel.html", destination: "/stati/igrovoy-scenariy-dlya-detskogo-prazdnika", permanent: true },
      { source: "/scenarii/detskii-prazdnik-gorod-masterov.html", destination: "/stati/igrovoy-scenariy-dlya-detskogo-prazdnika", permanent: true },
      { source: "/scenarii/detskii-prazdnik-igraem-nesmeyana.html", destination: "/stati/igrovoy-scenariy-dlya-detskogo-prazdnika", permanent: true },
      { source: "/scenarii/detskii-prazdnik-polyana-igr.html", destination: "/stati/igrovoy-scenariy-dlya-detskogo-prazdnika", permanent: true },
      { source: "/scenarii/detskii-prazdnik-surprisy-oseni.html", destination: "/stati/prazdnik-oseni-dlya-detey", permanent: true },
      { source: "/scenarii/detskii-prazdnik-tsaritsy-oseni.html", destination: "/stati/prazdnik-oseni-dlya-detey", permanent: true },
      { source: "/scenarii/karnaval-skazochnyh-geroev.html", destination: "/stati/igrovoy-scenariy-dlya-detskogo-prazdnika", permanent: true },
      { source: "/scenarii/skazka-sheherezada.html", destination: "/stati/skazki-sheherezady-scenariy-dlya-detey", permanent: true },
      { source: "/scenarii/skazki-pushkina.html", destination: "/stati/prazdnik-po-skazkam-pushkina-dlya-detey", permanent: true },
      { source: "/scenarii/:path*", destination: "/stati", permanent: true },
      { source: "/karta.html", destination: "/", permanent: true }
    ];
  }
};

export default nextConfig;
