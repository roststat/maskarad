import { listAnalyticsEvents, type StoredAnalyticsEvent } from "../../api/analytics/storage";
import { ownerAuthorized } from "../owner-auth";

export const runtime = "nodejs";

const privateHeaders = {
  "Cache-Control": "no-store, private",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow"
};

export async function GET(request: Request) {
  if (!ownerAuthorized(request.headers.get("authorization"))) {
    return new Response("Для просмотра статистики нужен доступ владельца.", {
      status: 401,
      headers: { ...privateHeaders, "WWW-Authenticate": 'Basic realm="Maskarad analytics", charset="UTF-8"' }
    });
  }
  const requestedDays = Number(new URL(request.url).searchParams.get("days") || "30");
  const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;
  try {
    const records = await listAnalyticsEvents(days);
    return new Response(renderReport(records, days), { headers: { ...privateHeaders, "Content-Type": "text/html; charset=utf-8" } });
  } catch {
    return new Response("Хранилище статистики недоступно.", { status: 503, headers: privateHeaders });
  }
}

function renderReport(records: StoredAnalyticsEvent[], days: number) {
  const views = records.filter((item) => item.event === "page_view");
  const sessions = new Set(views.map((item) => item.sessionId));
  const activeSeconds = sum(records.filter((item) => item.event === "active_time"), (item) => item.activeSeconds || 0);
  const leads = records.filter((item) => item.event === "lead_saved").length;
  const storedLeads = records.filter((item) => item.event === "lead_stored").length;
  const corporate = records.filter((item) => item.offer === "corporate_new_year");
  const corporateGoals = countValues(corporate.filter((item) => !["page_view", "active_time"].includes(item.event)).map((item) => item.event));
  const pageStats = group(views, (item) => item.path);
  const activeByPage = totals(records.filter((item) => item.event === "active_time"), (item) => item.path, (item) => item.activeSeconds || 0);
  const sourceBySession = new Map<string, string>();
  for (const item of views) if (!sourceBySession.has(item.sessionId)) sourceBySession.set(item.sessionId, item.utmSource || item.source || "direct");
  const sourceStats = countValues([...sourceBySession.values()]);
  const deviceBySession = new Map<string, string>();
  for (const item of views) if (!deviceBySession.has(item.sessionId)) deviceBySession.set(item.sessionId, item.device);
  const deviceStats = countValues([...deviceBySession.values()]);
  const goals = countValues(records.filter((item) => !["page_view", "active_time"].includes(item.event)).map((item) => item.event));
  const daysMap = new Map<string, { views: number; sessions: Set<string>; active: number; leads: number }>();
  for (const item of records) {
    const row = daysMap.get(item.day) || { views: 0, sessions: new Set<string>(), active: 0, leads: 0 };
    if (item.event === "page_view") { row.views += 1; row.sessions.add(item.sessionId); }
    if (item.event === "active_time") row.active += item.activeSeconds || 0;
    if (item.event === "lead_saved") row.leads += 1;
    daysMap.set(item.day, row);
  }
  const pageRows = [...pageStats.entries()].map(([path, items]) => ({
    label: path,
    count: items.length,
    sessions: new Set(items.map((item) => item.sessionId)).size,
    active: activeByPage.get(path) || 0
  })).sort((a, b) => b.count - a.count).slice(0, 30);

  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Статистика — Маскарад</title><style>
  :root{color-scheme:light}body{font:15px/1.45 system-ui,sans-serif;background:#fff8f6;color:#2d1820;margin:0;padding:1.5rem}main{max-width:1100px;margin:auto}h1{margin:.2rem 0}h2{margin:2rem 0 .7rem}nav,.cards{display:flex;gap:.65rem;flex-wrap:wrap}.cards{margin:1.3rem 0}.card,section{background:white;border:1px solid #eadadd;border-radius:16px}.card{padding:1rem;min-width:145px;flex:1}.card strong{display:block;font-size:1.75rem;color:#7d2245}.muted{color:#735e65}a{color:#7d2245}nav a{padding:.4rem .7rem;border-radius:999px;background:#f5e8eb;text-decoration:none}table{width:100%;border-collapse:collapse;background:white;border-radius:16px;overflow:hidden}th,td{text-align:left;padding:.65rem .75rem;border-bottom:1px solid #eee}th{font-size:.8rem;color:#735e65}td.num,th.num{text-align:right}section{padding:1rem;overflow:auto}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}.empty{padding:2rem;text-align:center}
  </style></head><body><main><h1>Статистика сайта</h1><p class="muted">Собственный счётчик · данные на сервере сайта · период ${days} дней</p><nav><a href="?days=7">7 дней</a><a href="?days=30">30 дней</a><a href="?days=90">90 дней</a><a href="/admin/leads">Заявки</a></nav>
  <div class="cards"><div class="card"><strong>${sessions.size}</strong>сессий</div><div class="card"><strong>${views.length}</strong>просмотров</div><div class="card"><strong>${formatDuration(activeSeconds)}</strong>активного времени</div><div class="card"><strong>${leads}</strong>отправлено заявок</div><div class="card"><strong>${storedLeads}</strong>сохранено без уведомления</div></div>
  ${records.length ? `<h2>По дням</h2><section>${table(["Дата", "Сессии", "Просмотры", "Активное время", "Заявки"], [...daysMap.entries()].sort(([a], [b]) => b.localeCompare(a)).map(([day, row]) => [day, row.sessions.size, row.views, formatDuration(row.active), row.leads]))}</section>
  <h2>Страницы</h2><section>${table(["Страница", "Сессии", "Просмотры", "Активное время"], pageRows.map((row) => [row.label, row.sessions, row.count, formatDuration(row.active)]))}</section>
  <h2>Источники и устройства</h2><div class="grid"><section><h3>Источники</h3>${simpleTable(sourceStats)}</section><section><h3>Устройства</h3>${simpleTable(deviceStats)}</section><section><h3>Цели</h3>${simpleTable(goals)}</section><section><h3>Корпоративная ёлка</h3>${simpleTable(corporateGoals)}</section></div>` : `<section class="empty">За выбранный период событий пока нет.</section>`}
  <p class="muted">Сессия — одна вкладка браузера. Активное время учитывается только при видимой вкладке и недавнем действии посетителя. Позиции и показы в поиске смотрите отдельно в сервисах поисковых систем.</p></main></body></html>`;
}

function table(headers: string[], rows: Array<Array<string | number>>) {
  return `<table><thead><tr>${headers.map((item, index) => `<th${index ? ' class="num"' : ""}>${escapeHtml(item)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((item, index) => `<td${index ? ' class="num"' : ""}>${escapeHtml(String(item))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function simpleTable(values: Map<string, number>) {
  const labels: Record<string, string> = { direct: "Прямые", desktop: "Компьютеры", mobile: "Телефоны", tablet: "Планшеты", lead_open: "Открытие заявки", lead_saved: "Заявка отправлена", lead_stored: "Сохранена без уведомления", lead_error: "Ошибка заявки", program_select: "Выбор программы", contact_click: "Клик по контакту" };
  return table(["", "Количество"], [...values.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => [labels[label] || label, count]));
}

function group<T>(items: T[], key: (item: T) => string) {
  const result = new Map<string, T[]>();
  for (const item of items) result.set(key(item), [...(result.get(key(item)) || []), item]);
  return result;
}

function totals<T>(items: T[], key: (item: T) => string, value: (item: T) => number) {
  const result = new Map<string, number>();
  for (const item of items) result.set(key(item), (result.get(key(item)) || 0) + value(item));
  return result;
}

function countValues(items: string[]) {
  const result = new Map<string, number>();
  for (const item of items) result.set(item, (result.get(item) || 0) + 1);
  return result;
}

function sum<T>(items: T[], value: (item: T) => number) { return items.reduce((total, item) => total + value(item), 0); }
function formatDuration(seconds: number) { return seconds < 60 ? `${seconds} с` : seconds < 3600 ? `${Math.round(seconds / 60)} мин` : `${(seconds / 3600).toFixed(1)} ч`; }
function escapeHtml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
