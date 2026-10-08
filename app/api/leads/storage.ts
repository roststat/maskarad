import { randomUUID } from "node:crypto";
import { mkdir, lstat, open, readdir, readFile, realpath, unlink } from "node:fs/promises";
import { isAbsolute, join, resolve, sep } from "node:path";

export type StoredLead = {
  id: string;
  name: string;
  phone: string;
  message: string;
  page: string;
  createdAt: string;
  consent: { accepted: true; version: string; recordedAt: string };
};

function storageDirectory() {
  const configured = process.env.LEAD_STORAGE_DIR;
  if (!configured || !isAbsolute(configured)) {
    throw new Error("LEAD_STORAGE_DIR must be an absolute path outside the application directory");
  }
  const directory = resolve(configured);
  const appDirectory = resolve(/* turbopackIgnore: true */ process.cwd());
  if (directory === appDirectory || directory.startsWith(`${appDirectory}${sep}`)) {
    throw new Error("LEAD_STORAGE_DIR must be outside the application directory");
  }
  return directory;
}

async function ensureStorageDirectory() {
  const directory = storageDirectory();
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const stat = await lstat(directory);
  if (!stat.isDirectory() || (stat.mode & 0o077) !== 0) {
    throw new Error("Lead storage directory must be a private directory (0700)");
  }
  const actual = await realpath(directory);
  const appDirectory = await realpath(/* turbopackIgnore: true */ process.cwd());
  if (actual === appDirectory || actual.startsWith(`${appDirectory}${sep}`)) {
    throw new Error("Lead storage resolves inside the application directory");
  }
  return directory;
}

export async function storeLead(lead: Omit<StoredLead, "id">) {
  const directory = await ensureStorageDirectory();
  const record: StoredLead = { ...lead, id: randomUUID() };
  const filename = `${record.createdAt.slice(0, 10)}-${record.id}.json`;
  const path = join(directory, filename);
  const handle = await open(path, "wx", 0o600);
  let completed = false;
  try {
    await handle.writeFile(JSON.stringify(record), "utf8");
    await handle.sync();
    completed = true;
  } finally {
    await handle.close();
    if (!completed) await unlink(path).catch(() => undefined);
  }
  return record.id;
}

export async function listLeads(limit = 100, offset = 0) {
  const directory = await ensureStorageDirectory();
  const filenames = (await readdir(directory)).filter((name) => /^\d{4}-\d{2}-\d{2}-[a-f0-9-]{36}\.json$/.test(name)).sort().reverse();
  const records = await Promise.all(filenames.slice(offset, offset + limit).map(async (filename) => {
    const raw = await readFile(join(directory, filename), "utf8");
    return JSON.parse(raw) as StoredLead;
  }));
  return { records, total: filenames.length };
}
