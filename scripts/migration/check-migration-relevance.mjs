import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const urlsPath = path.join(root, "development-docs/reports/old-site-inventory/urls.csv");
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
const redirects = [...config.matchAll(/source:\s*"([^"]+)"[\s\S]*?destination:\s*"([^"]+)"/g)].map((match) => ({
  source: match[1],
  destination: match[2],
  regex: sourceToRegex(match[1])
}));

const rows = fs
  .readFileSync(urlsPath, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map(parseCsvLine)
  .filter((cells) => cells[0]);

const broadDestinations = new Set(["/", "/prazdniki", "/spektakli", "/uslugi", "/o-teatre", "/stati"]);
const candidates = rows
  .map(([url, group, name, title]) => {
    const redirect = redirects.find((item) => item.regex.test(url));
    return redirect && broadDestinations.has(redirect.destination)
      ? { url, group, name, title, destination: redirect.destination }
      : null;
  })
  .filter(Boolean);

const grouped = new Map();
for (const candidate of candidates) {
  const key = `${candidate.group} -> ${candidate.destination}`;
  grouped.set(key, (grouped.get(key) ?? 0) + 1);
}

console.log(`Migration relevance audit: ${rows.length} inventory URLs`);
console.log(`Broad-destination candidates: ${candidates.length}`);
for (const [key, count] of [...grouped.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${count} ${key}`);
}

console.log("Review candidates:");
for (const candidate of candidates) {
  console.log(`  [${candidate.group}] ${candidate.name} — ${candidate.url} -> ${candidate.destination}`);
}
