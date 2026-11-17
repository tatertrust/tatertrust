import process from "node:process";
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import {
  deleteCookie,
  getCookie,
  getRequestHeader,
  setCookie,
} from "@tanstack/react-start/server";
import { put } from "@vercel/blob";

import {
  defaults,
  ROLE_IDS,
  SECTION_IDS,
  type Content,
  type Role,
  type SectionId,
} from "./content";

// Server-only: storage, users/passwords, sessions, uploads. Never shipped to the browser.

/* ── Redis (Upstash REST, connected via Vercel → Storage) ── */

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(command: (string | number)[]) {
  const cfg = redisConfig();
  if (!cfg)
    throw new Error(
      "Storage is not connected (missing KV_REST_API_URL / KV_REST_API_TOKEN).",
    );
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}` },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Storage error ${res.status}`);
  return (await res.json()).result as unknown;
}

/* ── Site content: one key per section, per environment (dev edits never touch production) ── */

const env = () => process.env.VERCEL_ENV ?? "development";
// "impact" keeps the key it had before the admin panel grew, so saved numbers survive.
const sectionKey = (s: SectionId) =>
  s === "impact" ? `impact-stats:${env()}` : `content:${env()}:${s}`;

export async function readContent(): Promise<Content> {
  if (!redisConfig()) return defaults; // ponytail: no storage locally → built-in defaults
  const raw = (await redis(["MGET", ...SECTION_IDS.map(sectionKey)])) as (
    string | null
  )[];
  const out = { ...defaults } as Record<SectionId, unknown>;
  SECTION_IDS.forEach((s, i) => {
    if (!raw[i]) return;
    const saved = JSON.parse(raw[i]);
    out[s] = s === "impact" ? { ...defaults.impact, ...saved } : saved;
  });
  return out as Content;
}

export async function writeSection(s: SectionId, data: unknown) {
  await redis(["SET", sectionKey(s), JSON.stringify(data)]);
}

/* ── Users & passwords (shared by dev and live, so each person has one password) ── */

type UserRecord = { hash: string; ver: number };
type Users = Partial<Record<Role, UserRecord>>;

async function readUsers(): Promise<Users> {
  if (!redisConfig()) return {};
  const raw = await redis(["GET", "admin-users"]);
  return typeof raw === "string" ? JSON.parse(raw) : {};
}

function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 32).toString("hex")}`;
}

function verifyHash(pw: string, stored: string) {
  const [salt, hash] = stored.split(":");
  return timingSafeEqual(scryptSync(pw, salt, 32), Buffer.from(hash, "hex"));
}

function masterPassword() {
  const p = process.env.ADMIN_PASSWORD?.trim();
  if (!p) throw new Error("ADMIN_PASSWORD is not set.");
  return p;
}

const sha = (s: string) => createHash("sha256").update(s).digest();
const isMaster = (pw: string) =>
  timingSafeEqual(sha(pw), sha(masterPassword()));

export async function setPassword(role: Role, pw: string) {
  const users = await readUsers();
  users[role] = { hash: hashPassword(pw), ver: (users[role]?.ver ?? 0) + 1 }; // ver bump signs them out
  await redis(["SET", "admin-users", JSON.stringify(users)]);
}

export async function usersWithPassword(): Promise<Role[]> {
  const users = await readUsers();
  return ROLE_IDS.filter((r) => users[r]);
}

// Super Admin can always sign in with ADMIN_PASSWORD from Vercel: the master reset.
async function checkLogin(role: Role, pw: string): Promise<string | null> {
  if (role === "super" && isMaster(pw)) return "m";
  const u = (await readUsers())[role];
  return u && verifyHash(pw, u.hash) ? String(u.ver) : null;
}

export async function verifyOwnPassword(role: Role, pw: string) {
  return (await checkLogin(role, pw)) !== null;
}

/* ── Login throttle: 10 failures per user per IP → 15 minute lockout ── */

const failKey = (role: Role) =>
  `login-fail:${role}:${(getRequestHeader("x-forwarded-for") ?? "local").split(",")[0].trim()}`;

export async function login(role: Role, pw: string) {
  const key = failKey(role);
  if (redisConfig() && Number(await redis(["GET", key])) >= 10)
    throw new Error("Too many wrong attempts. Try again in 15 minutes.");
  const ver = await checkLogin(role, pw);
  if (!ver) {
    if (redisConfig()) {
      await redis(["INCR", key]);
      await redis(["EXPIRE", key, 900]);
    }
    throw new Error("Wrong password");
  }
  if (redisConfig()) await redis(["DEL", key]);
  startSession(role, ver);
}

/* ── Session cookie: role.exp.ver.signature ── */

const COOKIE = "admin_session";
const MAX_AGE_S = 60 * 60 * 24 * 7;
const sign = (msg: string) =>
  createHmac("sha256", masterPassword()).update(msg).digest("hex");

function startSession(role: Role, ver: string) {
  const msg = `${role}.${Date.now() + MAX_AGE_S * 1000}.${ver}`;
  setCookie(COOKIE, `${msg}.${sign(msg)}`, {
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

// Changing ADMIN_PASSWORD signs everyone out; resetting a user's password signs that user out.
export async function currentRole(): Promise<Role | null> {
  const parts = (getCookie(COOKIE) ?? "").split(".");
  if (parts.length !== 4) return null;
  const [role, exp, ver, sig] = parts;
  const expected = sign(`${role}.${exp}.${ver}`);
  if (
    sig.length !== expected.length ||
    !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  )
    return null;
  if (Number(exp) < Date.now() || !ROLE_IDS.includes(role as Role)) return null;
  if (ver !== "m" && String((await readUsers())[role as Role]?.ver) !== ver)
    return null;
  return role as Role;
}

/* ── Photo uploads → Vercel Blob (local dev without a token → public/uploads) ── */

export async function saveUpload(file: File) {
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const name = `uploads/${Date.now()}.${ext}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // ponytail: replaced photos stay in Blob storage; add cleanup if storage fills up.
    const blob = await put(name, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return blob.url;
  }
  if (process.env.NODE_ENV === "production")
    throw new Error(
      "Photo storage is not connected (missing BLOB_READ_WRITE_TOKEN).",
    );
  await mkdir("public/uploads", { recursive: true });
  await writeFile(`public/${name}`, Buffer.from(await file.arrayBuffer()));
  return `/${name}`;
}

/* ── Preview: unsaved section data, viewable by its secret link for 1 hour ── */

export async function savePreview(section: SectionId, data: unknown) {
  const token = randomBytes(16).toString("hex");
  await redis([
    "SET",
    `preview:${token}`,
    JSON.stringify({ section, data }),
    "EX",
    3600,
  ]);
  return token;
}

export async function readPreview(
  token: string,
): Promise<{ section: SectionId; data: unknown } | null> {
  if (!redisConfig()) return null;
  const raw = await redis(["GET", `preview:${token}`]);
  return typeof raw === "string" ? JSON.parse(raw) : null;
}

/* ── Change log: newest first, last 1000 kept, per environment ── */

export type LogEntry = {
  at: number;
  who: Role;
  what: string;
  section?: SectionId;
  details: string[];
};
const logKey = () => `audit:${env()}`;

export async function addLog(entry: Omit<LogEntry, "at">) {
  if (!redisConfig()) return;
  await redis([
    "LPUSH",
    logKey(),
    JSON.stringify({ at: Date.now(), ...entry }),
  ]);
  await redis(["LTRIM", logKey(), 0, 999]);
}

export async function readLog(): Promise<LogEntry[]> {
  if (!redisConfig()) return [];
  const raw = (await redis(["LRANGE", logKey(), 0, 299])) as string[];
  return raw.map((r) => JSON.parse(r));
}
