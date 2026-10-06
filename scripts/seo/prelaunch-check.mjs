const DEFAULT_BASE_URL = "http://localhost:4311";
const baseUrl = normalizeBaseUrl(process.argv[2] ?? process.env.SEO_CHECK_BASE_URL ?? DEFAULT_BASE_URL);

const checks = [];

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function absolute(path) {
  return `${baseUrl}${path}`;
}

function addCheck(name, run) {
  checks.push({ name, run });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchText(path, options = {}) {
  const response = await fetch(absolute(path), options);
  const text = await response.text();
  return { response, text };
}

async function assertPreviewAccessible() {
  let result;
  try {
    result = await fetchText("/robots.txt", { redirect: "manual" });
  } catch {
    throw new Error(`Base URL is unavailable: ${baseUrl}`);
  }

  const { response, text } = result;
  const location = response.headers.get("location") ?? "";
  const looksProtected =
    [401, 403].includes(response.status) ||
    (response.status >= 300 && response.status < 400 && /vercel|auth|login/i.test(location)) ||
    /authentication required|vercel authentication|deployment protection/i.test(text);

  if (looksProtected) {
    throw new Error(
      "Preview requires authentication or Deployment Protection access. Make the Vercel preview public before running SEO checks."
    );
  }
}

function readMeta(html, attribute, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern =
    attribute === "property"
      ? new RegExp(`<meta property="${escaped}" content="([^"]+)"`)
      : new RegExp(`<meta name="${escaped}" content="([^"]+)"`);
  return html.match(pattern)?.[1] ?? "";
}

function readCanonical(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
}

function expectMeta({ path, canonical, ogType, ogImageIncludes }) {
  addCheck(`metadata ${path}`, async () => {
    const { response, text } = await fetchText(path);
    assert(response.status === 200, `Expected 200 for ${path}, got ${response.status}`);
    assert(readCanonical(text) === canonical, `Wrong canonical for ${path}`);
    assert(readMeta(text, "property", "og:type") === ogType, `Wrong og:type for ${path}`);
    assert(readMeta(text, "name", "twitter:card") === "summary_large_image", `Missing twitter card for ${path}`);
    assert(readMeta(text, "property", "og:image").includes(ogImageIncludes), `Wrong og:image for ${path}`);
  });
}

function expectRedirect(source, destination) {
  addCheck(`redirect ${source}`, async () => {
    const { response } = await fetchText(source, { redirect: "manual" });
    assert([301, 308].includes(response.status), `Expected permanent redirect for ${source}, got ${response.status}`);
    const location = response.headers.get("location") ?? "";
    assert(location === destination || location === absolute(destination), `Wrong redirect for ${source}: ${location}`);
  });
}

addCheck("robots.txt", async () => {
  const { response, text } = await fetchText("/robots.txt");
  assert(response.status === 200, `Expected 200 for robots.txt, got ${response.status}`);
  assert(text.includes("User-Agent: *"), "robots.txt must define User-Agent");
  assert(text.includes("Allow: /"), "robots.txt must allow public pages");
  assert(text.includes("Disallow: /api/"), "robots.txt must close /api/");
  assert(text.includes("Sitemap: https://maskarad-teatr.ru/sitemap.xml"), "robots.txt must point to production sitemap");
});

addCheck("sitemap.xml", async () => {
  const { response, text } = await fetchText("/sitemap.xml");
  assert(response.status === 200, `Expected 200 for sitemap.xml, got ${response.status}`);
  for (const path of [
    "",
    "/spektakli/zolushka",
    "/stati",
    "/podboroki",
    "/kejsy",
    "/stati/kak-vybrat-spektakl-na-den-rozhdeniya"
  ]) {
    assert(text.includes(`<loc>https://maskarad-teatr.ru${path}</loc>`), `Sitemap misses ${path || "/"}`);
  }
  assert(text.includes("<lastmod>"), "Sitemap misses lastmod");
  assert(text.includes("<changefreq>"), "Sitemap misses changefreq");
  assert(text.includes("<priority>"), "Sitemap misses priority");
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert(locs.length > 0, "Sitemap has no URLs");
  assert(new Set(locs).size === locs.length, "Sitemap contains duplicate URLs");
  assert(locs.every((url) => url.startsWith("https://maskarad-teatr.ru")), "Sitemap contains a non-production URL");
});

addCheck("structured data /", async () => {
  const { response, text } = await fetchText("/");
  assert(response.status === 200, `Expected 200 for /, got ${response.status}`);
  const blocks = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (match) => match[1]
  );
  assert(blocks.length > 0, "Homepage has no JSON-LD blocks");
  for (const block of blocks) {
    try {
      JSON.parse(block);
    } catch {
      throw new Error("Homepage contains malformed JSON-LD");
    }
  }
  assert(text.includes('"@type":"Organization"'), "Homepage misses Organization schema");
  assert(text.includes('"@id":"https://maskarad-teatr.ru#organization"'), "Organization schema has wrong @id");
  assert(text.includes('"@type":"WebSite"'), "Homepage misses WebSite schema");
  assert(text.includes('"@id":"https://maskarad-teatr.ru#website"'), "WebSite schema has wrong @id");
});

expectMeta({
  path: "/",
  canonical: "https://maskarad-teatr.ru",
  ogType: "website",
  ogImageIncludes: "/images/legacy/interaktiv01.jpg"
});

expectMeta({
  path: "/stati",
  canonical: "https://maskarad-teatr.ru/stati",
  ogType: "website",
  ogImageIncludes: "/images/legacy/interaktiv01.jpg"
});

expectMeta({
  path: "/stati/kak-vybrat-spektakl-na-den-rozhdeniya",
  canonical: "https://maskarad-teatr.ru/stati/kak-vybrat-spektakl-na-den-rozhdeniya",
  ogType: "article",
  ogImageIncludes: "/images/legacy/interaktiv01.jpg"
});

expectMeta({
  path: "/spektakli/zolushka",
  canonical: "https://maskarad-teatr.ru/spektakli/zolushka",
  ogType: "website",
  ogImageIncludes: "/images/legacy/teatr-zolushka-enhanced.jpg"
});

expectRedirect("/index.html", "/");
expectRedirect("/maskarad/contacts.html", "/kontakty");
expectRedirect("/detskii-prazdnik/zolushka.html", "/spektakli/zolushka");
expectRedirect("/detskie-uslugi/akvagrim.html", "/uslugi/akvagrim");
expectRedirect("/detskie-prazdniki/vypusknoi", "/prazdniki/vypusknoy");

let failed = 0;

console.log(`SEO prelaunch check: ${baseUrl}`);

try {
  await assertPreviewAccessible();
} catch (error) {
  console.error("SEO prelaunch check stopped before page checks");
  console.error(`  ${error.message}`);
  process.exit(2);
}

for (const check of checks) {
  try {
    await check.run();
    console.log(`ok ${check.name}`);
  } catch (error) {
    failed += 1;
    console.error(`fail ${check.name}`);
    console.error(`  ${error.message}`);
  }
}

if (failed > 0) {
  console.error(`SEO prelaunch check failed: ${failed}/${checks.length}`);
  process.exit(1);
}

console.log(`SEO prelaunch check passed: ${checks.length}/${checks.length}`);
