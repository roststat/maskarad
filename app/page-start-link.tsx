"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";

type PagePosition = { href: string; label: string; scrollY: number };
type PageVisit = PagePosition & { back?: PagePosition };
type PendingNavigation = { pathname: string; back?: PagePosition; restore?: PagePosition; startsPage?: boolean };
const historyKey = "maskaradPageVisit";
const PageStartContext = createContext<((href: string, replace?: boolean, startsPage?: boolean) => void) | null>(null);
const PageReturnContext = createContext<{ visit: PageVisit | null; returnToSource: () => void } | null>(null);

// Store only our metadata, preserving Next's own history state. No global history-length
// or referrer guesses: a return is available only after a known in-site transition.
function readPosition(value: unknown): PagePosition | undefined {
  if (!value || typeof value !== "object") return;
  const position = value as Partial<PagePosition>;
  if (typeof position.href !== "string" || !position.href.startsWith("/") || position.href.startsWith("//") ||
    typeof position.label !== "string" || typeof position.scrollY !== "number" || !Number.isFinite(position.scrollY)) return;
  const url = new URL(position.href, window.location.origin);
  if (url.origin !== window.location.origin) return;
  return { href: `${url.pathname}${url.search}${url.hash}`, label: position.label.slice(0, 160), scrollY: Math.max(0, position.scrollY) };
}

function readVisit(): PageVisit | null {
  const stored = window.history.state?.[historyKey];
  const position = readPosition(stored);
  if (!position || new URL(position.href, window.location.origin).pathname !== window.location.pathname) return null;
  return { ...position, back: readPosition(stored.back) };
}

function saveVisit(visit: PageVisit) {
  window.history.replaceState({ ...window.history.state, [historyKey]: visit }, "");
}

function pagePosition(): PagePosition {
  const label = document.querySelector('.breadcrumbs [aria-current="page"]')?.textContent || document.querySelector("main h1")?.textContent || "Предыдущая страница";
  return { href: `${window.location.pathname}${window.location.search}${window.location.hash}`, label: label.trim(), scrollY: window.scrollY };
}

export function usePageReturn() {
  return useContext(PageReturnContext);
}

// The root provider survives navigation even when the clicked card is unmounted.
export function PageStartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pendingNavigation = useRef<PendingNavigation | null>(null);
  const activeVisit = useRef<PageVisit | null>(null);
  const [visit, setVisit] = useState<PageVisit | null>(null);

  useLayoutEffect(() => {
    const pending = pendingNavigation.current;
    pendingNavigation.current = null;
    const isExpectedPage = pending?.pathname === window.location.pathname;
    const nextVisit = isExpectedPage && !pending.restore
      ? { ...pagePosition(), scrollY: 0, back: pending.back }
      : readVisit() || pagePosition();
    saveVisit(nextVisit);
    activeVisit.current = nextVisit;
    setVisit(nextVisit);

    if (!isExpectedPage) return;
    if (!pending.restore && pending.startsPage === false) return;
    const targetScrollY = pending.restore?.scrollY ?? 0;
    if (!pending.restore) window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Let the destination render before restoring its position. A short second pass
    // accommodates history restoration and the breadcrumb body offset on remount;
    // stop if the visitor takes over.
    const restore = () => window.scrollTo({ top: targetScrollY, left: 0, behavior: "instant" });
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(restore); });
    const timer = window.setTimeout(restore, 150);
    const stop = () => { cancelAnimationFrame(frame); window.clearTimeout(timer); };
    window.addEventListener("wheel", stop, { once: true, passive: true });
    window.addEventListener("touchstart", stop, { once: true, passive: true });
    window.addEventListener("keydown", stop, { once: true });
    return () => {
      stop();
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [pathname]);

  useEffect(() => {
    const onPopState = () => {
      const pending = pendingNavigation.current;
      let currentVisit = readVisit();
      // Native hash links may create a state-less entry while staying on this page.
      // Retain its source instead of treating that anchor as a fresh external visit.
      if (!currentVisit && activeVisit.current && new URL(activeVisit.current.href, window.location.origin).pathname === window.location.pathname) {
        currentVisit = { ...pagePosition(), back: activeVisit.current.back };
        saveVisit(currentVisit);
      }
      if (pending?.restore && window.location.pathname !== pending.pathname) {
        // In-page anchors can add history entries between this page and its source.
        // Skip only entries carrying the same known source; never walk into an external history.
        if (currentVisit?.back?.href === pending.restore.href) router.back();
        else router.replace(pending.restore.href, { scroll: false });
        return;
      }
      activeVisit.current = currentVisit;
      setVisit(currentVisit);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [router]);

  const prepareNavigation = useCallback((href: string, replace = false, startsPage = true) => {
    if (new URL(href, window.location.href).pathname === pathname) {
      pendingNavigation.current = null;
      if (startsPage) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else {
      const source = pagePosition();
      const currentVisit = { ...source, back: (readVisit() || activeVisit.current)?.back };
      saveVisit(currentVisit);
      pendingNavigation.current = { pathname: new URL(href, window.location.href).pathname, back: replace ? currentVisit.back : source, startsPage };
    }
  }, [pathname]);

  const returnToSource = useCallback(() => {
    const source = (readVisit() || activeVisit.current)?.back;
    if (!source) return;
    pendingNavigation.current = { pathname: new URL(source.href, window.location.origin).pathname, restore: source };
    router.back();
  }, [router]);

  return <PageStartContext.Provider value={prepareNavigation}>
    <PageReturnContext.Provider value={{ visit, returnToSource }}>{children}</PageReturnContext.Provider>
  </PageStartContext.Provider>;
}

// Only ordinary in-site page navigation resets scroll; hashes and history are untouched.
export function PageStartLink({ href, children, onNavigate, scroll, replace, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const prepareNavigation = useContext(PageStartContext);
  const isInternal = href.startsWith("/") && !href.startsWith("//");
  const startsPage = isInternal && !href.includes("#") && scroll !== false;

  return <Link {...props} href={href} replace={replace} scroll={startsPage ? false : scroll} onNavigate={(event) => {
    let prevented = false;
    onNavigate?.({ preventDefault: () => { prevented = true; event.preventDefault(); } });
    if (!prevented && isInternal) prepareNavigation?.(href, replace, startsPage);
  }}>{children}</Link>;
}
