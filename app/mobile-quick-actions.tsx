"use client";

import { usePathname } from "next/navigation";
import { phoneHref } from "./data";

const actionLabels = [
  { prefix: "/spektakli", label: "Подобрать спектакль" },
  { prefix: "/uslugi", label: "Собрать программу" },
  { prefix: "/prazdniki", label: "Обсудить праздник" },
  { prefix: "/tseny", label: "Уточнить цену" },
  { prefix: "/kontakty", label: "Написать" }
];

export function MobileQuickActions() {
  const pathname = usePathname();
  const label = actionLabels.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`))?.label;

  return (
    <div className="mobile-quick-actions" aria-label="Быстрые действия">
      <a href={phoneHref}>Позвонить</a>
      <a href="#zayavka">{label || "Оставить заявку"}</a>
    </div>
  );
}
