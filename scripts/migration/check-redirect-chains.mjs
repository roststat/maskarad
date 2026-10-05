import fs from "node:fs";
import path from "node:path";

const configPath = path.join(process.cwd(), "next.config.ts");
const config = fs.readFileSync(configPath, "utf8");
const routeSources = ["app/data.ts", "app/landing-data.ts", "app/content-data.ts"];

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

const redirects = [...config.matchAll(/source:\s*"([^"]+)"[\s\S]*?destination:\s*"([^"]+)"/g)].map((match) => ({
  source: match[1],
  destination: match[2],
  regex: sourceToRegex(match[1])
}));
const permanentRuleCount = (config.match(/permanent:\s*true/g) ?? []).length;

const knownPaths = new Set(["/"]);
for (const relativePath of routeSources) {
  const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
  for (const match of source.matchAll(/^\s*"(\/[^"#]+)":\s*\{/gm)) knownPaths.add(match[1]);
}
knownPaths.add("/prazdniki/korporativnyy-novogodniy-prazdnik");

function firstMatchingRule(pathname) {
  return redirects.find(({ regex }) => regex.test(pathname));
}

const chains = [];
const cycles = [];
const shadowed = [];
const unknownDestinations = [];

for (const [index, redirect] of redirects.entries()) {
  if (!redirect.destination.includes(":" ) && !knownPaths.has(redirect.destination)) {
    unknownDestinations.push(redirect);
  }

  if (!redirect.source.includes(":")) {
    const earlier = redirects.slice(0, index).find(({ regex }) => regex.test(redirect.source));
    if (earlier) shadowed.push({ redirect, earlier });
  }

  const next = firstMatchingRule(redirect.destination);
  if (!next) continue;
  if (next.source === redirect.source) {
    cycles.push(redirect);
  } else {
    chains.push({ redirect, next });
  }
}

console.log(`Redirect audit: ${redirects.length} rules`);

if (permanentRuleCount !== redirects.length) {
  console.error(`Non-permanent redirect rules: expected ${redirects.length}, found ${permanentRuleCount}`);
  process.exit(1);
}

if (cycles.length > 0) {
  console.error(`Redirect cycles: ${cycles.length}`);
  for (const item of cycles) console.error(`  ${item.source} -> ${item.destination}`);
  process.exit(1);
}

if (shadowed.length > 0) {
  console.error(`Shadowed exact rules: ${shadowed.length}`);
  for (const { redirect, earlier } of shadowed) {
    console.error(`  ${redirect.source} is hidden by ${earlier.source}`);
  }
  process.exit(1);
}

if (unknownDestinations.length > 0) {
  console.error(`Unknown redirect destinations: ${unknownDestinations.length}`);
  for (const redirect of unknownDestinations) {
    console.error(`  ${redirect.source} -> ${redirect.destination}`);
  }
  process.exit(1);
}

if (chains.length > 0) {
  console.error(`Redirect chains: ${chains.length}`);
  for (const { redirect, next } of chains) {
    console.error(`  ${redirect.source} -> ${redirect.destination} -> ${next.destination}`);
  }
  process.exit(1);
}

console.log("Redirect audit passed: no redirect chains or cycles detected");
