import { readdir, unlink } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const configured = process.env.LEAD_STORAGE_DIR;
const application = resolve(fileURLToPath(new URL("../..", import.meta.url)));
if (!configured || !isAbsolute(configured)) {
  throw new Error("LEAD_STORAGE_DIR must be an absolute path");
}
const directory = resolve(configured);
if (directory === application || directory.startsWith(`${application}${sep}`)) {
  throw new Error("Lead storage cannot be inside the application directory");
}

const now = new Date();
let removed = 0;
for (const filename of await readdir(directory)) {
  if (!/^\d{4}-\d{2}-\d{2}-[a-f0-9-]{36}\.json$/.test(filename)) continue;
  const expiry = new Date(`${filename.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(expiry.valueOf())) continue;
  expiry.setUTCFullYear(expiry.getUTCFullYear() + 3);
  if (expiry <= now) {
    await unlink(join(directory, filename));
    removed++;
  }
}
console.log(`Expired lead records removed: ${removed}`);

const analyticsConfigured = process.env.ANALYTICS_STORAGE_DIR || join(dirname(directory), "analytics");
if (!isAbsolute(analyticsConfigured)) throw new Error("Analytics storage must be an absolute path");
const analyticsDirectory = resolve(analyticsConfigured);
if (analyticsDirectory === application || analyticsDirectory.startsWith(`${application}${sep}`)) {
  throw new Error("Analytics storage cannot be inside the application directory");
}
let analyticsRemoved = 0;
try {
  for (const filename of await readdir(analyticsDirectory)) {
    if (!/^\d{4}-\d{2}-\d{2}\.ndjson$/.test(filename)) continue;
    const expiry = new Date(`${filename.slice(0, 10)}T00:00:00Z`);
    if (Number.isNaN(expiry.valueOf())) continue;
    expiry.setUTCDate(expiry.getUTCDate() + 180);
    if (expiry <= now) {
      await unlink(join(analyticsDirectory, filename));
      analyticsRemoved++;
    }
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
console.log(`Expired analytics files removed: ${analyticsRemoved}`);
