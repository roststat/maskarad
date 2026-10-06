"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const audienceNav = [
  { key: "children", href: "/dlya-detey", label: "Для детей" },
  { key: "adults", href: "/dlya-vzroslyh", label: "Для взрослых" },
  { key: "business", href: "/dlya-biznesa", label: "Для бизнеса" }
];

type AudienceKey = (typeof audienceNav)[number]["key"];

type MenuGroup = {
  href: string;
  label: string;
  links: { href: string; label: string }[];
};

const menuGroupsByAudience: Record<AudienceKey, MenuGroup[]> = {
  children: [
  {
    href: "/prazdniki",
    label: "Праздники",
    links: [
      { href: "/prazdniki/detskiy-den-rozhdeniya", label: "День рождения" },
      { href: "/prazdniki/detskiy-sad", label: "Для детского сада" },
      { href: "/prazdniki/shkolnyy-prazdnik", label: "Для школы" },
      { href: "/prazdniki/vypusknoy", label: "Выпускной" }
    ]
  },
  {
    href: "/spektakli",
    label: "Спектакли",
    links: [
      { href: "/spektakli/zolushka", label: "Золушка" },
      { href: "/spektakli/alisa-v-strane-chudes", label: "Алиса в Стране чудес" },
      { href: "/spektakli/peppi-dlinnyy-chulok", label: "Пеппи Длинный Чулок" },
      { href: "/spektakli/novogodnie-spektakli", label: "Новогодние программы" }
    ]
  },
  {
    href: "/uslugi",
    label: "Услуги",
    links: [
      { href: "/uslugi/master-klassy", label: "Мастер-классы" },
      { href: "/uslugi/shou-mylnyh-puzyrey", label: "Шоу мыльных пузырей" },
      { href: "/uslugi/akvagrim", label: "Аквагрим" },
      { href: "/uslugi/oformlenie-sharami", label: "Оформление" }
    ]
  },
  {
    href: "/o-teatre",
    label: "О театре",
    links: [
      { href: "/tseny", label: "Цены" },
      { href: "/otzyvy-pressa", label: "Отзывы и пресса" },
      { href: "/stati", label: "Идеи и кейсы" },
      { href: "/kontakty", label: "Контакты" }
    ]
  }
  ],
  adults: [
    {
      href: "/dlya-vzroslyh",
      label: "Семейные праздники",
      links: [
        { href: "/prazdniki/detskiy-den-rozhdeniya", label: "День рождения" },
        { href: "/spektakli", label: "Спектакль для семьи" },
        { href: "/uslugi/keytering", label: "Кейтеринг" },
        { href: "/prazdniki/novogodniy-detskiy-prazdnik", label: "Новогодний праздник" }
      ]
    },
    {
      href: "/uslugi",
      label: "Красивое событие",
      links: [
        { href: "/uslugi/oformlenie-sharami", label: "Оформление" },
        { href: "/uslugi/foto-video", label: "Фото и видео" },
        { href: "/uslugi/shou-mylnyh-puzyrey", label: "Шоу мыльных пузырей" },
        { href: "/uslugi/spetsialnye-effekty", label: "Спецэффекты" }
      ]
    },
    {
      href: "/spektakli",
      label: "Программа для детей",
      links: [
        { href: "/spektakli/zolushka", label: "Золушка" },
        { href: "/spektakli/alisa-v-strane-chudes", label: "Алиса в Стране чудес" },
        { href: "/uslugi/master-klassy", label: "Мастер-классы" },
        { href: "/uslugi/akvagrim", label: "Аквагрим" }
      ]
    },
    {
      href: "/o-teatre",
      label: "О театре",
      links: [
        { href: "/tseny", label: "Цены" },
        { href: "/otzyvy-pressa", label: "Отзывы и пресса" },
        { href: "/stati", label: "Идеи и кейсы" },
        { href: "/kontakty", label: "Контакты" }
      ]
    }
  ],
  business: [
    {
      href: "/dlya-biznesa",
      label: "Корпоративные программы",
      links: [
        { href: "/prazdniki/korporativnyy-novogodniy-prazdnik", label: "Новогодний корпоратив" },
        { href: "/prazdniki/novogodniy-detskiy-prazdnik", label: "Праздник для детей сотрудников" },
        { href: "/spektakli/novogodnie-spektakli", label: "Новогодние спектакли" },
        { href: "/prazdniki/detskiy-den-rozhdeniya", label: "Семейный день компании" }
      ]
    },
    {
      href: "/uslugi",
      label: "Event-наполнение",
      links: [
        { href: "/uslugi/master-klassy", label: "Мастер-классы" },
        { href: "/uslugi/foto-video", label: "Фото и видео" },
        { href: "/uslugi/oformlenie-sharami", label: "Оформление" },
        { href: "/uslugi/spetsialnye-effekty", label: "Спецэффекты" }
      ]
    },
    {
      href: "/spektakli",
      label: "Театральные форматы",
      links: [
        { href: "/spektakli/piraty-karibskogo-morya", label: "Пиратская программа" },
        { href: "/spektakli/zolushka", label: "Сказочный спектакль" },
        { href: "/uslugi/shou-mylnyh-puzyrey", label: "Шоу мыльных пузырей" },
        { href: "/uslugi/akvagrim", label: "Аквагрим" }
      ]
    },
    {
      href: "/o-teatre",
      label: "Работа с театром",
      links: [
        { href: "/tseny", label: "Цены" },
        { href: "/otzyvy-pressa", label: "Отзывы и пресса" },
        { href: "/stati", label: "Идеи и кейсы" },
        { href: "/kontakty", label: "Контакты" }
      ]
    }
  ]
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeAudience, setActiveAudience] = useState<AudienceKey>(() => {
    return audienceNav.find((item) => pathname.startsWith(item.href))?.key ?? "children";
  });
  const navigationRef = useRef<HTMLDivElement>(null);
  const menuGroups = menuGroupsByAudience[activeAudience];

  useEffect(() => {
    setIsOpen(false);
    const routeAudience = audienceNav.find((item) => pathname.startsWith(item.href));

    if (routeAudience) setActiveAudience(routeAudience.key);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [isOpen]);

  return (
    <div
      ref={navigationRef}
      className="header-nav-shell"
      onPointerEnter={() => window.dispatchEvent(new Event("header-menu-hover"))}
    >
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="site-catalog-menu"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>{isOpen ? "Закрыть" : "Меню"}</span>
        <i className="menu-icon" aria-hidden="true" />
      </button>
      <nav id="site-catalog-menu" className={isOpen ? "mega-menu mega-menu-open" : "mega-menu"} aria-label="Каталог сайта">
        <div className="mega-menu-audience" aria-label="Выбор по аудитории">
          <span>Подобрать по задаче</span>
          <div>
            {audienceNav.map((item) => (
              <button
                type="button"
                key={item.href}
                aria-pressed={activeAudience === item.key}
                onClick={() => setActiveAudience(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mega-menu-groups">
          {menuGroups.map((group) => {
            const groupIsActive = isActivePath(pathname, group.href);

            return (
              <section className="mega-menu-group" key={group.href}>
                <Link className="mega-menu-heading" href={group.href} aria-current={groupIsActive ? "page" : undefined}>
                  {group.label}
                </Link>
                <ul>
                  {group.links.map((item) => {
                    const isActive = isActivePath(pathname, item.href);

                    return (
                      <li key={item.href}>
                        <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
