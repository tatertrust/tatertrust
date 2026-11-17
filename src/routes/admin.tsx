import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAdminState,
  impactDefaults,
  login,
  logout,
  saveImpactValues,
  withValues,
} from "@/lib/stats.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin · Tater Trust" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Admin,
});

// Fetched client-side (not in a loader) because the site is prerendered at build time.
function Admin() {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["admin-state"],
    queryFn: () => getAdminState(),
  });

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl">Admin</h1>
        {isPending ? (
          <p className="mt-6 text-foreground/60">Loading…</p>
        ) : data?.isAdmin ? (
          <StatsEditor values={data.values} onLogout={() => refetch()} />
        ) : (
          <LoginForm onSuccess={() => refetch()} />
        )}
      </div>
    </main>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login({ data: { password } });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

function StatsEditor({
  values,
  onLogout,
}: {
  values: Record<string, number>;
  onLogout: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() =>
    Object.fromEntries(withValues(values).map((s) => [s.id, String(s.value)])),
  );
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const data = Object.fromEntries(Object.entries(form).map(([id, v]) => [id, Number(v)]));
      await saveImpactValues({ data });
      queryClient.invalidateQueries({ queryKey: ["impact-values"] });
      setStatus("Saved. The website shows the new numbers now.");
    } catch (err) {
      setStatus(`Could not save: ${err instanceof Error ? err.message : "unknown error"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="mt-8 space-y-6">
      <h2 className="text-lg font-semibold">Our Impact numbers</h2>
      {impactDefaults.map((s) => (
        <div key={s.id} className="space-y-2">
          <Label htmlFor={s.id}>{s.label}</Label>
          <Input
            id={s.id}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            required
            value={form[s.id]}
            onChange={(e) => setForm({ ...form, [s.id]: e.target.value })}
          />
        </div>
      ))}
      {status && (
        <p role="status" className="text-sm">
          {status}
        </p>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            await logout();
            onLogout();
          }}
        >
          Sign out
        </Button>
      </div>
    </form>
  );
}
