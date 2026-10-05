import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LeadPayload = {
  name?: string;
  phone?: string;
  occasion?: string;
  date?: string;
  age?: string;
  location?: string;
  message?: string;
  page?: string;
  leadText?: string;
};

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const phone = normalizeText(payload.phone);

  if (phone.length < 6) {
    return NextResponse.json({ ok: false, error: "phone_required" }, { status: 400 });
  }

  const lead = {
    name: normalizeText(payload.name),
    phone,
    occasion: normalizeText(payload.occasion),
    date: normalizeText(payload.date),
    age: normalizeText(payload.age),
    location: normalizeText(payload.location),
    message: normalizeText(payload.message),
    page: normalizePath(payload.page),
    leadText: normalizeText(payload.leadText),
    createdAt: new Date().toISOString(),
    source: "maskarad-site"
  };

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ ok: false, error: "lead_webhook_not_configured" }, { status: 503 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(lead),
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "lead_webhook_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "lead_webhook_unavailable" }, { status: 502 });
  }
}

function normalizeText(value: unknown) {
  return String(value || "").trim().slice(0, 1200);
}

function normalizePath(value: unknown) {
  const path = normalizeText(value);
  return path.startsWith("/") ? path.slice(0, 240) : "/";
}
