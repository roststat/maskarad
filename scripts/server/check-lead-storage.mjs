import { lstat, realpath } from "node:fs/promises";
import { isAbsolute, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const configured = process.env.LEAD_STORAGE_DIR;
const hash = process.env.LEAD_ADMIN_PASSWORD_HASH;
if (!configured || !isAbsolute(configured)) {
  throw new Error("LEAD_STORAGE_DIR must be an absolute path");
}
if (!/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash || "")) {
  throw new Error("LEAD_ADMIN_PASSWORD_HASH is missing or malformed");
}

const directory = resolve(configured);
const application = await realpath(fileURLToPath(new URL("../..", import.meta.url)));
const actual = await realpath(directory);
const stat = await lstat(directory);
if (!stat.isDirectory() || (stat.mode & 0o077) !== 0) {
  throw new Error("Lead storage must be a private directory (0700)");
}
if (actual === application || actual.startsWith(`${application}${sep}`)) {
  throw new Error("Lead storage must be outside the application directory");
}
if (process.getuid && stat.uid !== process.getuid()) {
  throw new Error("Lead storage must belong to the application user");
}
console.log("Lead storage path and admin password hash are configured.");
