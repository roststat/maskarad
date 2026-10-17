import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const built = path.join(root, ".next/server/app");
const errors = [];
const xml = fs.readFileSync(path.join(built, "sitemap.xml.body"), "utf8");
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
const html = fs.readFileSync(path.join(built, "karta-sayta.html"), "utf8");
// Read only the visible listing, excluding footer links and serialized React data.
const listing = html.split("data-sitemap-links=\"true\"")[1]?.split("</main>")[0] ?? "";
const links = [...listing.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(match => match[1]);
const docs = ["/privacy-policy", "/personal-data-consent", "/cookie-policy", "/terms"];
const expected = new Set([...urls, ...docs]);
for (const url of expected) {
  if (links.filter(link => link === url).length !== 1) errors.push(`${url}: требуется ровно одна ссылка в оглавлении`);
}
for (const url of links) {
  if (!expected.has(url)) errors.push(`${url}: лишняя ссылка в оглавлении`);
}
if (new Set(urls).size !== urls.length) errors.push("Дубли URL в XML-карте");
if (!html.includes('<link rel="canonical" href="https://maskarad-teatr.ru/karta-sayta"')) errors.push("Неверный canonical карты");
if (html.includes('"@type":"FAQPage"')) errors.push("Служебной карте не нужен FAQPage");

function inspect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { inspect(file); continue; }
    if (!entry.name.endsWith(".html")) continue;
    // Next-generated error documents are not public routes.
    if (directory === built && ["_global-error.html", "_not-found.html"].includes(entry.name)) continue;
    const source = fs.readFileSync(file, "utf8");
    const relative = path.relative(built, file).replaceAll(path.sep, "/");
    const url = relative === "index.html" ? "/" : `/${relative.slice(0, -5)}`;
    if (source.match(/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/)) continue;
    if (!urls.includes(url)) errors.push(`${url}: индексируемая страница отсутствует в XML и HTML картах`);
  }
}
inspect(built);
for (const url of expected) {
  const file = path.join(built, url === "/" ? "index.html" : `${url.slice(1)}.html`);
  if (!fs.existsSync(file)) errors.push(`${url}: нет собранной страницы`);
}
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(`HTML sitemap passed: ${urls.length} индексируемых страниц + ${docs.length} документа; все ссылки однократные, покрытие полное.`);
