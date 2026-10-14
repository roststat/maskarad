"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type GoalEvent = "lead_open" | "lead_saved" | "lead_error" | "program_select" | "contact_click";
type GoalDetail = { event: GoalEvent; offer?: "corporate_new_year"; target?: "phone" | "email" | "messenger" };
type Attribution = { source: string; utmSource?: string; utmMedium?: string; utmCampaign?: string };

const sessionKey = "maskarad-analytics-session-v1";
const attributionKey = "maskarad-analytics-attribution-v1";
const goalEventName = "maskarad:analytics";

export function trackFirstPartyEvent(event: GoalEvent, detail: Omit<GoalDetail, "event"> = {}) {
  try { window.dispatchEvent(new CustomEvent(goalEventName, { detail: { event, ...detail } })); }
  catch { /* Analytics never interrupts the visitor flow. */ }
}

export function FirstPartyAnalytics() {
  const pathname = usePathname();
  const currentPath = useRef(pathname);
  const lastPageView = useRef<string | null>(null);
  const activeSeconds = useRef(0);
  const lastTick = useRef(Date.now());
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (lastPageView.current && lastPageView.current !== pathname) flushActive(currentPath.current, activeSeconds);
    currentPath.current = pathname;
    if (lastPageView.current !== pathname) {
      send({ event: "page_view", path: pathname });
      lastPageView.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const markActivity = () => { lastActivity.current = Date.now(); };
    const tick = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.min(5, Math.max(0, Math.round((now - lastTick.current) / 1000)));
      lastTick.current = now;
      if (document.visibilityState === "visible" && now - lastActivity.current <= 60_000) activeSeconds.current += elapsed;
      if (activeSeconds.current >= 15) flushActive(currentPath.current, activeSeconds);
    }, 5000);
    const onHidden = () => { if (document.visibilityState === "hidden") flushActive(currentPath.current, activeSeconds, true); };
    const onPageHide = () => flushActive(currentPath.current, activeSeconds, true);
    const onGoal = (event: Event) => {
      const detail = (event as CustomEvent<GoalDetail>).detail;
      if (detail?.event) send({ ...detail, path: currentPath.current });
    };
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const href = anchor?.getAttribute("href") || "";
      if (href.startsWith("tel:")) send({ event: "contact_click", target: "phone", path: currentPath.current });
      else if (href.startsWith("mailto:")) send({ event: "contact_click", target: "email", path: currentPath.current });
      else if (/^https?:\/\/(?:wa\.me|max\.ru|t\.me)\//i.test(href)) send({ event: "contact_click", target: "messenger", path: currentPath.current });
    };
    for (const name of ["pointerdown", "keydown", "scroll", "touchstart"] as const) window.addEventListener(name, markActivity, { passive: true });
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener(goalEventName, onGoal);
    document.addEventListener("click", onClick);
    return () => {
      window.clearInterval(tick);
      for (const name of ["pointerdown", "keydown", "scroll", "touchstart"] as const) window.removeEventListener(name, markActivity);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener(goalEventName, onGoal);
      document.removeEventListener("click", onClick);
      flushActive(currentPath.current, activeSeconds, true);
    };
  }, [pathname]);

  return null;
}

function flushActive(path: string, counter: { current: number }, beacon = false) {
  const seconds = Math.min(60, Math.floor(counter.current));
  if (seconds < 1) return;
  counter.current -= seconds;
  send({ event: "active_time", path, activeSeconds: seconds }, beacon);
}

function send(payload: Record<string, unknown>, beacon = false) {
  try {
    const body = JSON.stringify({ ...payload, sessionId: sessionId(), ...attribution() });
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([body], { type: "text/plain" }));
      return;
    }
    void fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "text/plain" }, body, keepalive: true }).catch(() => undefined);
  } catch { /* Storage and privacy settings may disable browser storage. */ }
}

function sessionId() {
  try {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) return saved;
    const created = crypto.randomUUID().replaceAll("-", "");
    sessionStorage.setItem(sessionKey, created);
    return created;
  } catch {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
}

function attribution(): Attribution {
  try {
    const saved = sessionStorage.getItem(attributionKey);
    if (saved) return JSON.parse(saved) as Attribution;
    const query = new URLSearchParams(window.location.search);
    const referrer = document.referrer ? new URL(document.referrer) : null;
    const value: Attribution = {
      source: referrer && referrer.origin !== window.location.origin ? referrer.hostname.toLowerCase() : "direct",
      ...label("utmSource", query.get("utm_source")),
      ...label("utmMedium", query.get("utm_medium")),
      ...label("utmCampaign", query.get("utm_campaign"))
    };
    sessionStorage.setItem(attributionKey, JSON.stringify(value));
    return value;
  } catch { return { source: "direct" }; }
}

function label(key: "utmSource" | "utmMedium" | "utmCampaign", value: string | null) {
  const text = value?.trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 100);
  return text ? { [key]: text } : {};
}
