import { chmod, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join } from "node:path";

const envFile = process.env.MAX_ENV_FILE || "/opt/maskarad/app/.env.production";
if (!isAbsolute(envFile)) throw new Error("MAX_ENV_FILE must be an absolute path");

const input = await readStdin();
const [token = "", chatId = ""] = input.split(/\r?\n/);

if (!/^\S{20,}$/.test(token)) throw new Error("MAX bot token is missing or malformed");
if (!/^-?\d+$/.test(chatId)) throw new Error("MAX chat ID is missing or malformed");

const original = await readFile(envFile, "utf8");
const replacements = new Map([
  ["MAX_BOT_TOKEN", token],
  ["MAX_CHAT_ID", chatId],
  ["NODE_EXTRA_CA_CERTS", "/opt/maskarad/app/certificates/russian-trusted-root-ca.pem"]
]);
const removed = new Set(["MAX_USER_ID"]);
const seen = new Set();
const output = [];

for (const line of original.split(/\r?\n/)) {
  const match = line.match(/^([A-Z][A-Z0-9_]*)=/);
  const key = match?.[1];
  if (!key) {
    output.push(line);
    continue;
  }
  if (removed.has(key)) continue;
  if (!replacements.has(key)) {
    output.push(line);
    continue;
  }
  if (!seen.has(key)) output.push(`${key}=${replacements.get(key)}`);
  seen.add(key);
}

for (const [key, value] of replacements) {
  if (!seen.has(key)) output.push(`${key}=${value}`);
}

const temporary = join(dirname(envFile), `.env.production.max-${process.pid}`);
await writeFile(temporary, `${output.filter((line, index, lines) => line || index < lines.length - 1).join("\n")}\n`, {
  encoding: "utf8",
  mode: 0o600,
  flag: "wx"
});
await rename(temporary, envFile);
await chmod(envFile, 0o600);
console.log("MAX production settings updated without printing secrets.");

function readStdin() {
  return new Promise((resolve, reject) => {
    let value = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => { value += chunk; });
    process.stdin.on("end", () => resolve(value));
    process.stdin.on("error", reject);
  });
}
