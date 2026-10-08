"use client";

import { useEffect, useState } from "react";

const storageKey = "maskarad-cookie-notice-v1";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try { setVisible(localStorage.getItem(storageKey) !== "closed"); }
    catch { setVisible(true); }
  }, []);

  function close() {
    try { localStorage.setItem(storageKey, "closed"); } catch { /* Browser storage may be disabled. */ }
    setVisible(false);
  }

  if (!visible) return null;
  return <aside className="cookie-notice" aria-label="Информация о cookies">
    <p>Сейчас сайт не использует рекламные и аналитические cookies. Подробнее — в <a href="/cookie-policy">Политике cookies</a>.</p>
    <button type="button" onClick={close}>Понятно</button>
  </aside>;
}
