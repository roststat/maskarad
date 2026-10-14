import { scryptSync, timingSafeEqual } from "node:crypto";

export function ownerAuthorized(header: string | null) {
  const configured = process.env.LEAD_ADMIN_PASSWORD_HASH;
  if (!configured || !header?.startsWith("Basic ") || header.length > 512) return false;
  const [salt, expectedHex] = configured.split(":");
  if (!/^[a-f0-9]{32}$/.test(salt || "") || !/^[a-f0-9]{128}$/.test(expectedHex || "")) return false;
  let credentials: string;
  try { credentials = Buffer.from(header.slice(6), "base64").toString("utf8"); }
  catch { return false; }
  const separator = credentials.indexOf(":");
  if (separator < 0 || credentials.slice(0, separator) !== "owner") return false;
  const actual = scryptSync(credentials.slice(separator + 1), salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return timingSafeEqual(actual, expected);
}
