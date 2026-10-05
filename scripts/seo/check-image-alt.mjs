import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "app");
const files = [];

function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(entryPath);
    else if (/\.(tsx|jsx)$/.test(entry.name)) files.push(entryPath);
  }
}

collect(root);

const issues = [];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const tag of source.matchAll(/<(?:Image|img)\b[\s\S]*?>/g)) {
    if (!/\balt\s*=/.test(tag[0])) issues.push(`${path.relative(process.cwd(), file)}: ${tag[0].split("\n")[0].trim()}`);
  }
}

console.log(`Image alt audit: ${files.length} JSX/TSX files scanned`);

if (issues.length > 0) {
  console.error(`Images without alt: ${issues.length}`);
  for (const issue of issues) console.error(`  ${issue}`);
  process.exit(1);
}

console.log("Image alt audit passed: every Image/img tag has an alt attribute");
