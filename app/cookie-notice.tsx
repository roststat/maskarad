"use client";

import { useEffect, useState } from "react";

const storageKey = "maskarad-cookie-notice-v3";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try { setVisible(localStorage.getItem(storageKey) !== "closed"); }
    catch { setVisible(true); }
  }, []);

  function close() {
    try { localStorage.setItem(storageKey, "closed"); } catch { /* Storage may be disabled. */ }
    setVisible(false);
  }

  if (!visible) return null;
  return <aside className="cookie-notice" aria-label="Информация об аналитике и cookies">
    <p>На сайте работают собственная серверная статистика и Яндекс Метрика. Собственный счётчик не записывает содержимое форм, IP или полный адрес источника. Подробнее — в <a href="/cookie-policy">Политике cookies</a>.</p>
    <button type="button" onClick={close}>Понятно</button>
  </aside>;
}
