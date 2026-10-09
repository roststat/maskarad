"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const counterId = 113579092;
const tagUrl = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;

type Ym = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };

declare global {
  interface Window { ym?: Ym }
}

function startCounter() {
  if (!window.ym) {
    const queue: Ym = (...args) => { (queue.a ??= []).push(args); };
    queue.l = Date.now();
    window.ym = queue;
  }
  if (!document.querySelector(`script[src="${tagUrl}"]`)) {
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = tagUrl;
    tag.dataset.yandexMetrica = String(counterId);
    document.head.appendChild(tag);
  }
  window.ym(counterId, "init", {
    defer: true,
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    accurateTrackBounce: true,
    trackLinks: true,
    sendTitle: false
  });
}

export function YandexMetrica() {
  const pathname = usePathname();
  const active = useRef(false);
  const lastHit = useRef<string | null>(null);

  useEffect(() => {
    const allowed = !pathname.startsWith("/admin");
    if (!allowed) {
      if (active.current) window.ym?.(counterId, "destruct");
      active.current = false;
      lastHit.current = null;
      return;
    }
    if (!active.current) {
      startCounter();
      active.current = true;
    }
    // URL queries can contain user input; public reports only need the page path.
    if (lastHit.current !== pathname) {
      window.ym?.(counterId, "hit", pathname);
      lastHit.current = pathname;
    }
  }, [pathname]);

  return null;
}
