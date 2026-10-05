"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "./data";

const audienceNav = [
  { href: "/dlya-detey", label: "Для детей" },
  { href: "/dlya-vzroslyh", label: "Для взрослых" },
  { href: "/dlya-biznesa", label: "Для бизнеса" }
];

export function HeaderNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="header-nav-shell">
      <nav className="audience-nav" aria-label="Навигация по аудитории">
        {audienceNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link href={item.href} key={item.href} aria-current={isActive ? "page" : undefined}>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button className="menu-toggle" type="button" aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
        <span>Меню</span>
        <i aria-hidden="true" />
      </button>
      <nav className={isOpen ? "nav nav-open" : "nav"} aria-label="Полное меню">
        {navItems.slice(1).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link href={item.href} key={item.href} aria-current={isActive ? "page" : undefined} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
