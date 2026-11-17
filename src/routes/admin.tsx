import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Loader2,
  LogOut,
  Users,
} from "lucide-react";

import trustLogo from "@/assets/trust-logo-upscaled.webp";
import { EDITORS, SECTION_INFO } from "@/components/admin/editors";
import { PasswordInput, btn, inputCls } from "@/components/admin/fields";
import {
  ROLE_IDS,
  ROLES,
  type Content,
  type Role,
  type SectionId,
} from "@/lib/content";
import {
  changeOwnPassword,
  getAdminState,
  login,
  logout,
  resetUserPassword,
  saveSection,
} from "@/lib/content.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Tater Trust" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  headers: () => ({ "Cache-Control": "no-store" }),
  component: Admin,
});

const errMsg = (e: unknown) =>
  e instanceof Error ? e.message : "Something went wrong";

function Admin() {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-state"],
    queryFn: () => getAdminState(),
    refetchOnWindowFocus: false,
  });
  const [notice, setNotice] = useState("");

  if (isPending)
    return (
      <Screen>
        <Loader2
          className="mx-auto mt-32 animate-spin text-foreground/40"
          aria-label="Loading"
        />
      </Screen>
    );
  if (!data?.role)
    return (
      <LoginPage
        notice={notice}
        onSuccess={() => {
          setNotice("");
          refetch();
        }}
      />
    );
  return (
    <Dashboard
      role={data.role}
      content={data.content}
      usersWithPassword={data.usersWithPassword}
      refetch={refetch}
      onSignedOut={(msg) => {
        setNotice(msg);
        refetch();
      }}
    />
  );
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--surface)] text-foreground">
      {children}
    </div>
  );
}

/* ───────────── Login ───────────── */

function LoginPage({
  onSuccess,
  notice,
}: {
  onSuccess: () => void;
  notice: string;
}) {
  const [role, setRole] = useState<Role>("super");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const userId = useId();
  const pwId = useId();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login({ data: { role, password } });
      onSuccess();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-3xl border border-border bg-background p-6 sm:p-10 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.35)]">
          <img
            src={trustLogo}
            alt=""
            className="mx-auto h-16 w-16 object-contain"
          />
          <h1 className="mt-4 text-center font-display text-3xl text-[var(--brand-brown)]">
            Admin sign in
          </h1>
          <p className="mt-2 text-center text-sm text-foreground/60">
            Update the Tater Trust website.
          </p>

          {notice && (
            <p
              role="status"
              className="mt-6 rounded-xl bg-[var(--brand-green)]/10 px-4 py-3 text-sm text-[var(--brand-green)]"
            >
              {notice}
            </p>
          )}

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor={userId}
                className="block text-sm font-medium text-[var(--brand-brown)]"
              >
                Who are you?
              </label>
              <select
                id={userId}
                className={inputCls}
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                {ROLE_IDS.map((r) => (
                  <option key={r} value={r}>
                    {ROLES[r].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor={pwId}
                className="block text-sm font-medium text-[var(--brand-brown)]"
              >
                Password
              </label>
              <PasswordInput
                id={pwId}
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className={`${btn.primary} w-full py-3`}
              disabled={busy}
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <details className="mt-6 text-sm text-foreground/65">
            <summary className="cursor-pointer font-medium text-[var(--brand-green)]">
              Forgot password?
            </summary>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <b>Akshit Tater</b> or <b>Developer</b>: ask the Super Admin to
                set a new password for you (Admin → Users).
              </li>
              <li>
                <b>Super Admin</b>: sign in with the master password (
                <code>ADMIN_PASSWORD</code> in Vercel → Settings → Environment
                Variables). It always works for Super Admin.
              </li>
            </ul>
          </details>
        </div>
      </main>
    </Screen>
  );
}

/* ───────────── Dashboard ───────────── */

type View = SectionId | "users" | "account";

function Dashboard({
  role,
  content,
  usersWithPassword,
  refetch,
  onSignedOut,
}: {
  role: Role;
  content: Content;
  usersWithPassword: Role[];
  refetch: () => void;
  onSignedOut: (msg: string) => void;
}) {
  const access = ROLES[role];
  const views: { id: View; label: string }[] = [
    ...access.sections.map((s) => ({
      id: s as View,
      label: SECTION_INFO[s].label,
    })),
    ...(role === "super"
      ? [{ id: "users" as View, label: "Users & passwords" }]
      : []),
    { id: "account", label: "My password" },
  ];
  const [view, setView] = useState<View>(views[0].id);
  const [dirty, setDirty] = useState(false);

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  function go(v: View) {
    if (v === view) return;
    if (dirty && !confirm("You have unsaved changes. Leave without saving?"))
      return;
    setDirty(false);
    setView(v);
  }

  async function signOut() {
    if (dirty && !confirm("You have unsaved changes. Sign out anyway?")) return;
    await logout();
    onSignedOut("You've been signed out.");
  }

  return (
    <Screen>
      {/* Mobile header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img src={trustLogo} alt="" className="h-8 w-8 object-contain" />
            <span className="truncate text-sm font-medium text-[var(--brand-brown)]">
              {access.label}
            </span>
          </div>
          <button type="button" className={btn.secondary} onClick={signOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
        <label className="sr-only" htmlFor="section-select">
          Section
        </label>
        <select
          id="section-select"
          className={`${inputCls} mt-3`}
          value={view}
          onChange={(e) => go(e.target.value as View)}
        >
          {views.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </header>

      <div className="lg:grid lg:grid-cols-[17rem_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex sticky top-0 h-dvh flex-col border-r border-border bg-background p-5">
          <div className="flex items-center gap-3 px-2">
            <img src={trustLogo} alt="" className="h-10 w-10 object-contain" />
            <div>
              <div className="font-display text-lg leading-tight text-[var(--brand-brown)]">
                Tater Trust
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-foreground/50">
                Admin
              </div>
            </div>
          </div>
          <nav
            className="mt-8 flex-1 space-y-1 overflow-y-auto"
            aria-label="Sections"
          >
            {views.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => go(v.id)}
                aria-current={view === v.id ? "page" : undefined}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] ${
                  view === v.id
                    ? "bg-[var(--brand-brown)] text-white font-medium"
                    : "text-foreground/75"
                }`}
              >
                {v.id === "users" && <Users size={16} />}
                {v.id === "account" && <KeyRound size={16} />}
                {v.label}
              </button>
            ))}
          </nav>
          <div className="border-t border-border pt-4 space-y-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 text-sm text-[var(--brand-green)]"
            >
              View website <ExternalLink size={14} />
            </a>
            <div className="px-3 text-xs text-foreground/55">
              Signed in as <b className="text-foreground/80">{access.label}</b>
            </div>
            <button
              type="button"
              className={`${btn.secondary} w-full`}
              onClick={signOut}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-8 lg:py-10">
          <div className="mx-auto max-w-3xl">
            {view === "users" ? (
              <UsersPanel
                usersWithPassword={usersWithPassword}
                onChanged={refetch}
              />
            ) : view === "account" ? (
              <AccountPanel
                onChanged={() =>
                  onSignedOut(
                    "Password changed. Please sign in with your new password.",
                  )
                }
              />
            ) : (
              <SectionPanel
                key={view}
                section={view}
                initial={content[view]}
                imagesOnly={access.imagesOnly.includes(view)}
                onDirty={setDirty}
                onSaved={refetch}
              />
            )}
          </div>
        </main>
      </div>
    </Screen>
  );
}

function PanelHeader({ title, help }: { title: string; help: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl sm:text-4xl text-[var(--brand-brown)]">
        {title}
      </h1>
      <p className="mt-2 text-foreground/65">{help}</p>
    </div>
  );
}

/* ───────────── Section editor with sticky save bar ───────────── */

function SectionPanel<K extends SectionId>({
  section,
  initial,
  imagesOnly,
  onDirty,
  onSaved,
}: {
  section: K;
  initial: Content[K];
  imagesOnly: boolean;
  onDirty: (d: boolean) => void;
  onSaved: () => void;
}) {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => onDirty(dirty), [dirty, onDirty]);

  const Editor = EDITORS[section] as (p: {
    value: Content[K];
    onChange: (v: Content[K]) => void;
    imagesOnly: boolean;
  }) => ReactNode;

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      await saveSection({ data: { section, data: draft } });
      setSaved(draft);
      queryClient.invalidateQueries({ queryKey: ["admin-state"] });
      onSaved();
      setStatus({
        ok: true,
        msg: "Saved. The website will show it within a minute.",
      });
    } catch (e) {
      setStatus({ ok: false, msg: errMsg(e) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pb-28">
      <PanelHeader
        title={SECTION_INFO[section].label}
        help={SECTION_INFO[section].help}
      />
      {imagesOnly && (
        <p className="mb-5 rounded-xl bg-[var(--brand-gold)]/25 px-4 py-3 text-sm text-[var(--brand-brown)]">
          You can change photos here. Text is read-only for your account.
        </p>
      )}
      <Editor value={draft} onChange={setDraft} imagesOnly={imagesOnly} />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur lg:left-[17rem]">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div role="status" aria-live="polite" className="min-w-0 text-sm">
            {status ? (
              <span
                className={
                  status.ok
                    ? "inline-flex items-center gap-1.5 text-[var(--brand-green)]"
                    : "text-red-600"
                }
              >
                {status.ok && <CheckCircle2 size={16} />}
                {status.msg}
              </span>
            ) : dirty ? (
              <span className="text-[var(--brand-brown)]">
                You have unsaved changes.
              </span>
            ) : (
              <span className="text-foreground/50">All changes saved.</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className={btn.secondary}
              disabled={!dirty || busy}
              onClick={() => {
                setDraft(saved);
                setStatus(null);
              }}
            >
              Discard
            </button>
            <button
              type="button"
              className={btn.primary}
              disabled={!dirty || busy}
              onClick={save}
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Passwords ───────────── */

function PasswordForm({
  fields,
  submitLabel,
  onSubmit,
}: {
  fields: { key: string; label: string; autoComplete: string }[];
  submitLabel: string;
  onSubmit: (v: Record<string, string>) => Promise<string | void>;
}) {
  const [v, setV] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const baseId = useId();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const msg = await onSubmit(v);
      setV({});
      if (msg) setStatus({ ok: true, msg });
    } catch (err) {
      setStatus({ ok: false, msg: errMsg(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <label
            htmlFor={baseId + f.key}
            className="block text-sm font-medium text-[var(--brand-brown)]"
          >
            {f.label}
          </label>
          <PasswordInput
            id={baseId + f.key}
            value={v[f.key] ?? ""}
            onChange={(x) => setV({ ...v, [f.key]: x })}
            autoComplete={f.autoComplete}
          />
        </div>
      ))}
      {status && (
        <p
          role={status.ok ? "status" : "alert"}
          className={`text-sm ${status.ok ? "text-[var(--brand-green)]" : "text-red-600"}`}
        >
          {status.msg}
        </p>
      )}
      <button type="submit" className={btn.primary} disabled={busy}>
        {busy && <Loader2 size={16} className="animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}

function UsersPanel({
  usersWithPassword,
  onChanged,
}: {
  usersWithPassword: Role[];
  onChanged: () => void;
}) {
  return (
    <div>
      <PanelHeader
        title="Users & passwords"
        help="Set or reset a password for each person. Setting a new password signs that person out everywhere."
      />
      <div className="space-y-5">
        {ROLE_IDS.map((r) => (
          <div
            key={r}
            className="rounded-2xl border border-border bg-background p-4 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl text-[var(--brand-brown)]">
                {ROLES[r].label}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  usersWithPassword.includes(r)
                    ? "bg-[var(--brand-green)]/10 text-[var(--brand-green)]"
                    : "bg-[var(--brand-gold)]/30 text-[var(--brand-brown)]"
                }`}
              >
                {usersWithPassword.includes(r)
                  ? "Password set"
                  : r === "super"
                    ? "Master password only"
                    : "Can't sign in yet"}
              </span>
            </div>
            <p className="mt-1 mb-4 text-sm text-foreground/60">
              Can edit:{" "}
              {ROLES[r].sections.map((s) => SECTION_INFO[s].label).join(", ")}
              {ROLES[r].imagesOnly.length > 0 &&
                " (photos only in " +
                  ROLES[r].imagesOnly
                    .map((s) => SECTION_INFO[s].label)
                    .join(", ") +
                  ")"}
            </p>
            <PasswordForm
              fields={[
                {
                  key: "next",
                  label: "New password",
                  autoComplete: "new-password",
                },
                {
                  key: "confirm",
                  label: "Type it again",
                  autoComplete: "new-password",
                },
              ]}
              submitLabel="Set password"
              onSubmit={async ({ next = "", confirm = "" }) => {
                if (next !== confirm)
                  throw new Error("The two passwords don't match.");
                await resetUserPassword({ data: { role: r, next } });
                onChanged();
                return `Password set for ${ROLES[r].label}. Share it with them privately.`;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountPanel({ onChanged }: { onChanged: () => void }) {
  return (
    <div>
      <PanelHeader
        title="My password"
        help="Change the password you use to sign in. You'll be asked to sign in again."
      />
      <div className="rounded-2xl border border-border bg-background p-4 sm:p-6">
        <PasswordForm
          fields={[
            {
              key: "current",
              label: "Current password",
              autoComplete: "current-password",
            },
            {
              key: "next",
              label: "New password (at least 8 characters)",
              autoComplete: "new-password",
            },
            {
              key: "confirm",
              label: "Type new password again",
              autoComplete: "new-password",
            },
          ]}
          submitLabel="Change password"
          onSubmit={async ({ current = "", next = "", confirm = "" }) => {
            if (next !== confirm)
              throw new Error("The two new passwords don't match.");
            await changeOwnPassword({ data: { current, next } });
            onChanged();
          }}
        />
      </div>
    </div>
  );
}
