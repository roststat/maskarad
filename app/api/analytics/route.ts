import { NextRequest } from "next/server";
import { storeAnalyticsEvent, type DeviceKind } from "./storage";
import { parseAnalyticsInput } from "./contract";

export const runtime = "nodejs";

const rateBySession = new Map<string, { minute: number; count: number }>();

export async function POST(request: NextRequest) {
  if (!sameOrigin(request) || Number(request.headers.get("content-length") || 0) > 4096) {
    return Response.json({ ok: false }, { status: 400 });
  }
  const userAgent = request.headers.get("user-agent") || "";
  if (isBot(userAgent)) return new Response(null, { status: 204 });

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > 4096) throw new Error("too_large");
    raw = JSON.parse(text);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const input = parseAnalyticsInput(raw);
  if (!input || !withinRateLimit(input.sessionId)) {
    return Response.json({ ok: false }, { status: 400 });
  }
  try {
    await storeAnalyticsEvent(input, deviceKind(userAgent));
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    const requestedHost = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").split(",")[0].trim();
    return new URL(origin).host === requestedHost;
  } catch { return false; }
}

function withinRateLimit(sessionId: string) {
  const minute = Math.floor(Date.now() / 60_000);
  const current = rateBySession.get(sessionId);
  if (!current || current.minute !== minute) {
    rateBySession.set(sessionId, { minute, count: 1 });
    if (rateBySession.size > 10_000) rateBySession.clear();
    return true;
  }
  current.count += 1;
  return current.count <= 30;
}

function isBot(userAgent: string) {
  return /bot|crawler|spider|slurp|lighthouse|pagespeed|headless/i.test(userAgent);
}

function deviceKind(userAgent: string): DeviceKind {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return "mobile";
  return "desktop";
}
