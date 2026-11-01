import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const xml = fs.readFileSync(path.join(root, ".next/server/app/sitemap.xml.body"), "utf8");
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const errors = [];
const counts = new Map();

function decode(value) {
  return value.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

for (const url of urls) {
  // Utility navigation page has no editorial FAQ or FAQPage markup.
  if (url === "/karta-sayta") continue;
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
  if (visible.length < 1 || faqSchemas.length !== 1 || entries.length !== visible.length) {
    errors.push(`${url}: видимых ответов ${visible.length}, FAQPage ${faqSchemas.length}, элементов JSON-LD ${entries.length}`);
    continue;
  }
  counts.set(visible.length, (counts.get(visible.length) ?? 0) + 1);
  const normalize = (text) => decode(text.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim().toLocaleLowerCase("ru");
  const outsideFaq = html.replace(/<section class="ny-faq"[^>]*>[\s\S]*?<\/section>/g, "");
  const paragraphs = new Set([...outsideFaq.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)].map((match) => normalize(match[1])));
  const questions = new Set();
  const answers = new Set();
  for (let index = 0; index < visible.length; index += 1) {
    const question = normalize(visible[index].question);
    const answer = normalize(visible[index].answer);
    if (questions.has(question) || answers.has(answer) || paragraphs.has(answer) || /Как применить совет|Что важно знать о теме/.test(visible[index].question)) {
      errors.push(`${url}: ответ ${index + 1} повторяет текст страницы или другой FAQ`);
    }
    if (!question || !answer) errors.push(`${url}: пустой вопрос/ответ ${index + 1}`);
    questions.add(question);
    answers.add(answer);
    if (entries[index].name !== visible[index].question || entries[index].acceptedAnswer?.text !== visible[index].answer) {
      errors.push(`${url}: ответ ${index + 1} в HTML и JSON-LD не совпадает`);
    }
  }
}

console.log(`FAQ audit: ${urls.filter(url => url !== "/karta-sayta").length} содержательных URL; служебная карта проверяется отдельно`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`FAQ audit passed: ${JSON.stringify(Object.fromEntries(counts))}; неповторные ответы, один FAQPage и точное совпадение JSON-LD`);
}
