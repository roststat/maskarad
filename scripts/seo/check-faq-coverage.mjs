import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const xml = fs.readFileSync(path.join(root, ".next/server/app/sitemap.xml.body"), "utf8");
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const errors = [];

function decode(value) {
  return value.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

for (const url of urls) {
  const file = path.join(root, ".next/server/app", url === "/" ? "index.html" : `${url.slice(1)}.html`);
  if (!fs.existsSync(file)) {
    errors.push(`${url}: нет prerendered HTML`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const section = html.match(/<section class="ny-faq"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  const visible = section
    ? [...section.matchAll(/<h3>([\s\S]*?)<\/h3><p>([\s\S]*?)<\/p>/g)].map((match) => ({
        question: decode(match[1]),
        answer: decode(match[2])
      }))
    : [];
  const scripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const schemas = scripts.flatMap((match) => {
    try {
      const parsed = JSON.parse(match[1]);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      errors.push(`${url}: невалидный JSON-LD`);
      return [];
    }
  });
  const faqSchemas = schemas.filter((schema) => schema["@type"] === "FAQPage");
  const entries = faqSchemas[0]?.mainEntity ?? [];
  if (visible.length !== 5 || faqSchemas.length !== 1 || entries.length !== 5) {
    errors.push(`${url}: видимых ответов ${visible.length}, FAQPage ${faqSchemas.length}, элементов JSON-LD ${entries.length}`);
    continue;
  }
  for (let index = 0; index < 5; index += 1) {
    if (entries[index].name !== visible[index].question || entries[index].acceptedAnswer?.text !== visible[index].answer) {
      errors.push(`${url}: ответ ${index + 1} в HTML и JSON-LD не совпадает`);
    }
  }
}

console.log(`FAQ audit: ${urls.length} URL из sitemap`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("FAQ audit passed: везде пять видимых ответов, один FAQPage и точное совпадение JSON-LD");
}
