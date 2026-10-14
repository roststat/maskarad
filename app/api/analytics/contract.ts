export const analyticsEvents = ["page_view", "active_time", "lead_open", "lead_saved", "lead_stored", "lead_error", "program_select", "contact_click"] as const;
export type AnalyticsEventName = typeof analyticsEvents[number];
export type AnalyticsInput = {
  event: AnalyticsEventName;
  sessionId: string;
  path: string;
  activeSeconds?: number;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  offer?: "corporate_new_year";
  target?: "phone" | "email" | "messenger";
};

export function parseAnalyticsInput(value: unknown): AnalyticsInput | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (!analyticsEvents.includes(item.event as AnalyticsInput["event"])) return null;
  if (typeof item.sessionId !== "string" || !/^[a-z0-9_-]{16,64}$/i.test(item.sessionId)) return null;
  if (typeof item.path !== "string" || !/^\/(?!admin(?:\/|$)|api(?:\/|$))[^?#]{0,239}$/.test(item.path)) return null;
  const result: AnalyticsInput = { event: item.event as AnalyticsInput["event"], sessionId: item.sessionId, path: item.path };
  if (result.event === "active_time") {
    if (!Number.isInteger(item.activeSeconds) || Number(item.activeSeconds) < 1 || Number(item.activeSeconds) > 60) return null;
    result.activeSeconds = Number(item.activeSeconds);
  }
  const source = cleanHost(item.source);
  if (source) result.source = source;
  for (const [inputKey, outputKey] of [["utmSource", "utmSource"], ["utmMedium", "utmMedium"], ["utmCampaign", "utmCampaign"]] as const) {
    const cleaned = cleanLabel(item[inputKey]);
    if (cleaned) result[outputKey] = cleaned;
  }
  if (item.offer === "corporate_new_year") result.offer = item.offer;
  if (["phone", "email", "messenger"].includes(String(item.target))) result.target = item.target as AnalyticsInput["target"];
  return result;
}

function cleanHost(value: unknown) {
  if (value === "direct") return value;
  if (typeof value !== "string") return undefined;
  const text = value.toLowerCase().slice(0, 100);
  return /^[a-z0-9.-]+$/.test(text) ? text : undefined;
}

function cleanLabel(value: unknown) {
  if (typeof value !== "string") return undefined;
  const text = value.trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 100);
  return text || undefined;
}
