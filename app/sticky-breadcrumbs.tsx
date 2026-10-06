"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type BreadcrumbItem = {
  href: string;
  label: string;
};

export function StickyBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    document.body.classList.add("has-header-breadcrumbs");
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY < 24 || scrollY < lastScrollY.current - 6) {
        setIsExpanded(true);
      } else if (scrollY > lastScrollY.current + 6) {
        setIsExpanded(false);
      }

      lastScrollY.current = scrollY;
    };

    const revealBreadcrumbs = () => setIsExpanded(true);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("header-menu-hover", revealBreadcrumbs);

    return () => {
      document.body.classList.remove("has-header-breadcrumbs");
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("header-menu-hover", revealBreadcrumbs);
    };
  }, []);

  return (
    <nav
      className={isExpanded ? "breadcrumbs breadcrumbs-expanded" : "breadcrumbs breadcrumbs-collapsed"}
      aria-label="Хлебные крошки"
      onPointerEnter={() => setIsExpanded(true)}
    >
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href}>
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href} tabIndex={isExpanded ? 0 : -1}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
