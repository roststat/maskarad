import { randomUUID } from "node:crypto";
import { lstat, mkdir, open, readFile, readdir, realpath } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";
import type { AnalyticsInput } from "./contract";

export type DeviceKind = "desktop" | "mobile" | "tablet";

export type StoredAnalyticsEvent = AnalyticsInput & {
  id: string;
  receivedAt: string;
  day: string;
  device: DeviceKind;
};

function storageDirectory() {
  const configured = process.env.ANALYTICS_STORAGE_DIR
    || (process.env.LEAD_STORAGE_DIR ? join(dirname(process.env.LEAD_STORAGE_DIR), "analytics") : "");
  if (!configured || !isAbsolute(configured)) {
    throw new Error("ANALYTICS_STORAGE_DIR or LEAD_STORAGE_DIR must identify external storage");
  }
  const directory = resolve(configured);
  const appDirectory = resolve(/* turbopackIgnore: true */ process.cwd());
  if (directory === appDirectory || directory.startsWith(`${appDirectory}${sep}`)) {
    throw new Error("Analytics storage must be outside the application directory");
  }
  return directory;
}

async function ensureStorageDirectory() {
  const directory = storageDirectory();
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const stat = await lstat(directory);
  if (!stat.isDirectory() || (stat.mode & 0o077) !== 0) {
    throw new Error("Analytics storage directory must be private (0700)");
  }
  const actual = await realpath(directory);
  const appDirectory = await realpath(/* turbopackIgnore: true */ process.cwd());
  if (actual === appDirectory || actual.startsWith(`${appDirectory}${sep}`)) {
    throw new Error("Analytics storage resolves inside the application directory");
  }
  return directory;
}

function moscowDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export async function storeAnalyticsEvent(input: AnalyticsInput, device: DeviceKind) {
  const directory = await ensureStorageDirectory();
  const now = new Date();
  const record: StoredAnalyticsEvent = {
    ...input,
    id: randomUUID(),
    receivedAt: now.toISOString(),
    day: moscowDay(now),
    device
  };
  const handle = await open(join(directory, `${record.day}.ndjson`), "a", 0o600);
  try { await handle.writeFile(`${JSON.stringify(record)}\n`, "utf8"); }
  finally { await handle.close(); }
}

export async function listAnalyticsEvents(days: number) {
  const directory = await ensureStorageDirectory();
  const earliest = moscowDay(new Date(Date.now() - (days - 1) * 86_400_000));
  const files = (await readdir(directory))
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.ndjson$/.test(name) && name.slice(0, 10) >= earliest)
    .sort();
  const records: StoredAnalyticsEvent[] = [];
  for (const file of files) {
    const text = await readFile(join(directory, file), "utf8");
    for (const line of text.split("\n")) {
      if (!line) continue;
      try { records.push(JSON.parse(line) as StoredAnalyticsEvent); }
      catch { /* A partial final line must not hide the rest of the report. */ }
    }
  }
  return records;
}
