"use client";

import { PageStartLink as Link, usePageReturn } from "./page-start-link";
import { useEffect } from "react";

type BreadcrumbItem = {
  href: string;
  label: string;
};

const catalogLabels: Record<string, string> = {
  "/": "На главную",
  "/spektakli": "Вернуться к спектаклям",
  "/uslugi": "Вернуться к услугам",
  "/prazdniki": "Вернуться к праздникам",
  "/stati": "Вернуться к статьям",
};

export function StickyBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const pageReturn = usePageReturn();
  const current = items.at(-1);
  const visit = pageReturn?.visit;
  const source = visit && visit.href.split(/[?#]/)[0] === current?.href ? visit.back : undefined;
  const fallback = items.at(-2);
  const destination = source || fallback;
  const returnLabel = destination ? catalogLabels[destination.href.split(/[?#]/)[0]] || `Назад: ${destination.label}` : "";

  useEffect(() => {
    document.body.classList.add("has-header-breadcrumbs");
    return () => document.body.classList.remove("has-header-breadcrumbs");
  }, []);

  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      <div className="breadcrumbs-inner">
        {destination && (source ?
          <button className="page-return" type="button" onClick={pageReturn?.returnToSource} title={returnLabel}>
            <span aria-hidden="true">←</span><span>{returnLabel}</span>
          </button> :
          <Link className="page-return" href={destination.href} title={returnLabel}>
            <span aria-hidden="true">←</span><span>{returnLabel}</span>
          </Link>
        )}
        <ol>
          {items.map((item, index) => (
            <li key={item.href}>
              {index === items.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
