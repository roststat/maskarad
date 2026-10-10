"use client";

import { usePartyAssistant } from "./party-assistant-widget";
import type { ReactNode } from "react";

export function CorporateRequestButton({ children, className = "button primary" }: { children: ReactNode; className?: string }) {
  const open = usePartyAssistant();
  return <button type="button" className={className} aria-haspopup="dialog" onClick={() => open({ corporate: true })}>{children}</button>;
}
