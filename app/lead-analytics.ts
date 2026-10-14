"use client";

import { trackFirstPartyEvent } from "./first-party-analytics";

export function reportLeadEvent(
  event: "lead_saved" | "lead_error" | "program_select",
  category?: "corporate_new_year",
) {
  trackFirstPartyEvent(event, category ? { offer: category } : {});
  // Analytics must not affect saving a request. Only the offer category is sent.
  try {
    window.ym?.(113579092, "reachGoal", event, category ? { offer: category } : undefined);
  } catch {
    // The request still works when analytics is unavailable or blocked.
  }
}
