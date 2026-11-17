import process from "node:process";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

// Server-only: Redis storage + admin session cookie. Never shipped to the browser.

/* ── Storage (Upstash Redis REST API, connected via Vercel → Storage) ── */

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(command: string[]) {
  const cfg = redisConfig();
  if (!cfg) throw new Error("Storage is not connected (missing KV_REST_API_URL / KV_REST_API_TOKEN).");
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}` },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Storage error ${res.status}`);
  return (await res.json()).result as unknown;
}

// Separate keys per environment so editing the dev site never touches production.
const statsKey = () => `impact-stats:${process.env.VERCEL_ENV ?? "development"}`;

export async function readStatValues(): Promise<Record<string, number>> {
  if (!redisConfig()) return {}; // ponytail: no storage locally → site shows built-in defaults
  const raw = await redis(["GET", statsKey()]);
  return typeof raw === "string" ? JSON.parse(raw) : {};
}

export async function writeStatValues(values: Record<string, number>) {
  await redis(["SET", statsKey(), JSON.stringify(values)]);
}

/* ── Auth: one shared password, signed expiring cookie ── */

const COOKIE = "admin_session";
const MAX_AGE_S = 60 * 60 * 24 * 7;

function adminPassword() {
  const p = process.env.ADMIN_PASSWORD?.trim();
  if (!p) throw new Error("ADMIN_PASSWORD is not set.");
  return p;
}

const sign = (exp: string) => createHmac("sha256", adminPassword()).update(exp).digest("hex");
const sha = (s: string) => createHash("sha256").update(s).digest();

// ponytail: no rate limiting on login; relies on a long password. Add an Upstash INCR lockout if abused.
export function checkPassword(input: string) {
  return timingSafeEqual(sha(input), sha(adminPassword()));
}

export function startSession() {
  const exp = String(Date.now() + MAX_AGE_S * 1000);
  setCookie(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export function endSession() {
  deleteCookie(COOKIE, { path: "/" });
}

// Changing ADMIN_PASSWORD in Vercel signs everyone out.
export function isAdmin() {
  const [exp, sig] = (getCookie(COOKIE) ?? "").split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
