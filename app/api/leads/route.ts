import { NextResponse } from "next/server";
import { consentVersion } from "../../legal-data";
import { storeLead } from "./storage";

export const runtime = "nodejs";

type LeadPayload = {
  name?: string;
  phone?: string;
  message?: string;
  page?: string;
  consent?: boolean;
  consentVersion?: string;
};

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const phone = normalizeText(payload.phone);

  if (phone.length < 6) {
    return NextResponse.json({ ok: false, error: "phone_required" }, { status: 400 });
  }

  if (payload.consent !== true || payload.consentVersion !== consentVersion) {
    return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });
  }

  const recordedAt = new Date().toISOString();
  const lead = {
    name: normalizeText(payload.name),
    phone,
    message: normalizeText(payload.message),
    page: normalizePath(payload.page),
    createdAt: recordedAt,
    consent: { accepted: true as const, version: consentVersion, recordedAt }
  };
  try {
    await storeLead(lead);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "lead_storage_unavailable" }, { status: 503 });
  }
}

function normalizeText(value: unknown) {
  return String(value || "").trim().slice(0, 1200);
}

function normalizePath(value: unknown) {
  const path = normalizeText(value);
  return path.startsWith("/") ? path.slice(0, 240) : "/";
}
