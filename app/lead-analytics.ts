"use client";

export function reportLeadEvent(
  event: "lead_saved" | "lead_error" | "program_select",
  category: "corporate_new_year",
) {
  // Analytics must not affect saving a request. Only the offer category is sent.
  try {
    window.ym?.(113579092, "reachGoal", event, { offer: category });
  } catch {
    // The request still works when analytics is unavailable or blocked.
  }
}
