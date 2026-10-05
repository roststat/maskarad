import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const urlsPath = path.join(root, "development-docs/reports/old-site-inventory/urls.csv");
const pagesPath = path.join(root, "development-docs/reports/old-site-inventory/pages.csv");
const configPath = path.join(root, "next.config.ts");

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];

    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }
    if (character === '"') {
      quoted = !quoted;
      continue;
    }
    if (character === "," && !quoted) {
      cells.push(cell);
      cell = "";
      continue;
    }
    cell += character;
  }

  cells.push(cell);
  return cells;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sourceToRegex(source) {
  let pattern = "";
  let cursor = 0;
  const tokenPattern = /:[a-zA-Z]+\*/g;
  let match;

  while ((match = tokenPattern.exec(source))) {
    pattern += escapeRegex(source.slice(cursor, match.index));
    pattern += ".*";
    cursor = match.index + match[0].length;
  }

  pattern += escapeRegex(source.slice(cursor));
  return new RegExp(`^${pattern}/?$`);
}

const config = fs.readFileSync(configPath, "utf8");
const redirectSources = [...config.matchAll(/source:\s*"([^"]+)"/g)].map((match) => ({
  source: match[1],
  regex: sourceToRegex(match[1])
}));

const lines = fs.readFileSync(urlsPath, "utf8").trim().split(/\r?\n/);
const rows = lines.slice(1).map(parseCsvLine).filter((cells) => cells[0]);
const groupByUrl = new Map(rows.map((cells) => [cells[0], cells[1] || "other"]));
const pageLines = fs.readFileSync(pagesPath, "utf8").trim().split(/\r?\n/);
const pageRows = pageLines.slice(1).map(parseCsvLine).filter((cells) => cells[3]);
const pageByUrl = new Map(
  pageRows.map((cells) => [
    cells[3],
    {
      name: cells[2] || "Без названия",
      active: cells[7] === "1",
      sort: Number.parseInt(cells[8], 10) || Number.MAX_SAFE_INTEGER
    }
  ])
);
const urls = [
  ...new Set(
    rows
      .map((cells) => cells[0])
      .filter((url) => url.startsWith("/") && !url.startsWith("//") && !url.includes("@"))
  )
];
const uncovered = urls.filter((url) => !redirectSources.some(({ regex }) => regex.test(url)));
const broadOnly = urls.filter((url) => {
  const matches = redirectSources.filter(({ regex }) => regex.test(url));
  return matches.length > 0 && matches.every(({ source }) => source.includes(":path*"));
});
const broadOnlyByGroup = broadOnly.reduce((groups, url) => {
  const group = groupByUrl.get(url) ?? "other";
  groups.set(group, (groups.get(group) ?? 0) + 1);
  return groups;
}, new Map());

console.log(`Old URL coverage: ${urls.length} URLs, ${redirectSources.length} redirect rules`);
console.log(`Catch-all-only URLs: ${broadOnly.length}`);
console.log(
  `Catch-all-only by group: ${[...broadOnlyByGroup.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([group, count]) => `${group}=${count}`)
    .join(", ")}`
);

const priorityCandidates = broadOnly
  .map((url) => ({ url, ...pageByUrl.get(url) }))
  .filter((page) => page.name && page.active)
  .sort((left, right) => left.sort - right.sort)
  .slice(0, 12);

if (priorityCandidates.length > 0) {
  console.log("Priority active pages still behind catch-all:");
  for (const page of priorityCandidates) {
    console.log(`  [${page.sort}] ${page.name} — ${page.url}`);
  }
}

if (uncovered.length > 0) {
  console.error(`Uncovered old URLs: ${uncovered.length}`);
  for (const url of uncovered) console.error(`  ${url}`);
  process.exit(1);
}

if (broadOnly.length > 0) {
  console.warn("Review these URLs for a more precise landing page or redirect:");
  for (const url of broadOnly) console.warn(`  ${url}`);
}

console.log("Old URL coverage passed: every inventory URL matches a redirect rule");
