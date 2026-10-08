import { scryptSync, timingSafeEqual } from "node:crypto";
import { listLeads } from "../../api/leads/storage";

export const runtime = "nodejs";

const privateHeaders = {
  "Cache-Control": "no-store, private",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow"
};

export async function GET(request: Request) {
  if (!authorized(request.headers.get("authorization"))) {
    return new Response("Для просмотра заявок нужен доступ владельца.", {
      status: 401,
      headers: { ...privateHeaders, "WWW-Authenticate": 'Basic realm="Maskarad leads", charset="UTF-8"' }
    });
  }

  try {
    const requestedPage = Number(new URL(request.url).searchParams.get("page") || "1");
    const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const { records, total } = await listLeads(100, (page - 1) * 100);
    const cards = records.map((lead) => `<article><div class="meta">${escapeHtml(lead.createdAt)} · ${escapeHtml(lead.page)}</div><h2>${escapeHtml(lead.name || "Без имени")}</h2><p><strong>Телефон:</strong> ${escapeHtml(lead.phone)}</p><p class="message">${escapeHtml(lead.message || "Без дополнительных пожеланий")}</p><small>Согласие: ${escapeHtml(lead.consent.version)} · ${escapeHtml(lead.consent.recordedAt)}</small></article>`).join("");
    const navigation = `<nav>${page > 1 ? `<a href="?page=${page - 1}">← Назад</a>` : ""}${page * 100 < total ? `<a href="?page=${page + 1}">Далее →</a>` : ""}</nav>`;
    return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Заявки — Маскарад</title><style>body{font:16px/1.5 system-ui,sans-serif;background:#fffaf8;color:#2d1820;margin:0;padding:2rem 1rem}main{max-width:860px;margin:auto}h1{font-size:2rem}article{background:white;border:1px solid #e7d9dc;border-radius:16px;padding:1rem 1.25rem;margin:1rem 0;overflow-wrap:anywhere}h2{font-size:1.2rem;margin:.35rem 0}.meta,small{color:#6f5961}.message{white-space:pre-wrap}nav{display:flex;gap:1rem;margin:1rem 0}a{color:#7d2245}</style></head><body><main><h1>Заявки</h1><p>Всего: ${total}. Страница ${page}. Доступ только владельцу. Данные находятся в закрытом каталоге сервера.</p>${navigation}${cards || "<p>На этой странице заявок нет.</p>"}${navigation}</main></body></html>`, {
      headers: { ...privateHeaders, "Content-Type": "text/html; charset=utf-8" }
    });
  } catch {
    return new Response("Хранилище заявок недоступно.", { status: 503, headers: privateHeaders });
  }
}

function authorized(header: string | null) {
  const configured = process.env.LEAD_ADMIN_PASSWORD_HASH;
  if (!configured || !header?.startsWith("Basic ") || header.length > 512) return false;
  const [salt, expectedHex] = configured.split(":");
  if (!/^[a-f0-9]{32}$/.test(salt || "") || !/^[a-f0-9]{128}$/.test(expectedHex || "")) return false;
  let credentials: string;
  try { credentials = Buffer.from(header.slice(6), "base64").toString("utf8"); }
  catch { return false; }
  const separator = credentials.indexOf(":");
  if (separator < 0 || credentials.slice(0, separator) !== "owner") return false;
  const actual = scryptSync(credentials.slice(separator + 1), salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return timingSafeEqual(actual, expected);
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
