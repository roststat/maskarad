"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useLayoutEffect, useRef, type ComponentProps, type ReactNode } from "react";

const PageStartContext = createContext<((href: string) => void) | null>(null);

// The root provider survives navigation even when the clicked card is unmounted.
export function PageStartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pendingNavigation = useRef(false);

  useLayoutEffect(() => {
    if (!pendingNavigation.current) return;
    pendingNavigation.current = false;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  const prepareNavigation = useCallback((href: string) => {
    if (new URL(href, window.location.href).pathname === pathname) {
      pendingNavigation.current = false;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else {
      pendingNavigation.current = true;
    }
  }, [pathname]);

  return <PageStartContext.Provider value={prepareNavigation}>{children}</PageStartContext.Provider>;
}

// Only ordinary in-site page navigation resets scroll; hashes and history are untouched.
export function PageStartLink({ href, children, onNavigate, scroll, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const prepareNavigation = useContext(PageStartContext);
  const startsPage = href.startsWith("/") && !href.startsWith("//") && !href.includes("#") && scroll !== false;

  return <Link {...props} href={href} scroll={startsPage ? false : scroll} onNavigate={(event) => {
    let prevented = false;
    onNavigate?.({ preventDefault: () => { prevented = true; event.preventDefault(); } });
    if (!prevented && startsPage) prepareNavigation?.(href);
  }}>{children}</Link>;
}
