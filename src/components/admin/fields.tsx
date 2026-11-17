import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { uploadImage } from "@/lib/content.functions";

// Admin UI building blocks. Deliberately no hover effects: state is shown by
// focus rings, colour and labels only.

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-green)] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-green)]",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-[var(--brand-brown)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]",
  icon: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground/70 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]",
  dangerSolid:
    "inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600",
  danger:
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-background text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
};

/* ── In-dashboard confirmation (instead of the browser's confirm() pop-up) ── */

type ConfirmOptions = {
  title: string;
  body?: string;
  confirmLabel: string;
  danger?: boolean;
};
const ConfirmContext = createContext<(o: ConfirmOptions) => Promise<boolean>>(
  async () => false,
);
// const ask = useConfirm(); if (await ask({...})) { ... }
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [req, setReq] = useState<
    (ConfirmOptions & { resolve: (ok: boolean) => void }) | null
  >(null);
  const ask = useCallback(
    (o: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setReq({ ...o, resolve })),
    [],
  );
  const close = (ok: boolean) => {
    req?.resolve(ok);
    setReq(null);
  };
  return (
    <ConfirmContext.Provider value={ask}>
      {children}
      <AlertDialog.Root open={!!req} onOpenChange={(o) => !o && close(false)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-[80] bg-black/40" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-background p-6 shadow-xl focus:outline-none">
            <AlertDialog.Title className="font-display text-2xl text-[var(--brand-brown)]">
              {req?.title}
            </AlertDialog.Title>
            <AlertDialog.Description
              className={
                req?.body ? "mt-2 text-sm text-foreground/70" : "sr-only"
              }
            >
              {req?.body ?? req?.title}
            </AlertDialog.Description>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <AlertDialog.Cancel className={btn.secondary}>
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className={req?.danger ? btn.dangerSolid : btn.primary}
                onClick={() => close(true)}
              >
                {req?.confirmLabel}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </ConfirmContext.Provider>
  );
}

export const inputCls =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base text-foreground disabled:bg-[var(--surface)] disabled:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/40 focus:border-[var(--brand-green)]";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--brand-brown)]"
      >
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-foreground/55">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  disabled,
  multiline,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  multiline?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id) =>
        multiline ? (
          <textarea
            id={id}
            rows={3}
            className={inputCls}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            id={id}
            className={inputCls}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      }
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: readonly T[] | { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  const opts = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  return (
    <Field label={label}>
      {(id) => (
        <select
          id={id}
          className={inputCls}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as T)}
        >
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        required
        className={`${inputCls} pr-12`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

/* ── Photos ── */

// Shrinks in the browser before upload: phone photos are often 5–10 MB, the
// server accepts 4 MB, and the website never shows more than ~2000px anyway.
async function prepareImage(file: File) {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    throw new Error("Couldn't read this image. Please use a JPG or PNG photo.");
  }
  const png = file.type === "image/png";
  const max = png ? 1200 : 2000;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  const type = png ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Couldn't process image"))),
      type,
      0.85,
    ),
  );
  return {
    file: new File([blob], png ? "photo.png" : "photo.jpg", { type }),
    ratio: w / h,
  };
}

export async function uploadPhoto(file: File) {
  const prepared = await prepareImage(file);
  const fd = new FormData();
  fd.append("file", prepared.file);
  const url = await uploadImage({ data: fd });
  return { url, ratio: Math.round(prepared.ratio * 1000) / 1000 };
}

export function PhotoField({
  label,
  value,
  onChange,
  shape = "rect",
  onRemove,
  stacked,
}: {
  label: string;
  value?: string;
  onChange: (url: string, ratio: number) => void;
  shape?: "circle" | "rect" | "logo";
  onRemove?: () => void;
  // Photo above the buttons, full width of a narrow column.
  stacked?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { url, ratio } = await uploadPhoto(file);
      onChange(url, ratio);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const frame =
    shape === "circle"
      ? "h-24 w-24 rounded-full object-cover"
      : shape === "logo"
        ? "h-20 w-32 rounded-xl object-contain bg-white p-2"
        : stacked
          ? "aspect-[4/3] w-full rounded-xl object-cover"
          : "h-28 w-40 rounded-xl object-cover";

  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-[var(--brand-brown)]">
        {label}
      </span>
      <div className={stacked ? "grid gap-3" : "flex items-center gap-4"}>
        {value ? (
          <img
            src={value}
            alt=""
            className={`${frame} border border-border shrink-0`}
          />
        ) : (
          <div
            className={`${frame} border border-dashed border-border bg-[var(--surface)] shrink-0 flex items-center justify-center text-xs text-foreground/50`}
          >
            No photo
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btn.secondary}
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {busy ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ImagePlus size={16} />
            )}
            {busy ? "Uploading…" : value ? "Change photo" : "Add photo"}
          </button>
          {value && onRemove && (
            <button type="button" className={btn.secondary} onClick={onRemove}>
              Remove
            </button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Lists: add / edit / delete / reorder ── */

// Moves `id` one step among `visible` ids (the ones currently on screen),
// swapping places with its neighbour in the full list.
export function moveItem<T extends { id: string }>(
  list: T[],
  id: string,
  dir: -1 | 1,
  visible = list.map((x) => x.id),
) {
  const vi = visible.indexOf(id);
  const other = visible[vi + dir];
  if (other === undefined) return list;
  const a = list.findIndex((x) => x.id === id);
  const b = list.findIndex((x) => x.id === other);
  const next = [...list];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

export const newId = () => crypto.randomUUID().slice(0, 8);

export function ListEditor<T extends { id: string }>({
  items,
  onChange,
  title,
  render,
  newItem,
  addLabel,
  canStructure,
  allItems,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  title: (item: T) => string;
  render: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  newItem?: () => T;
  addLabel?: string;
  canStructure: boolean;
  // When `items` is a filtered view, the full list to apply changes to.
  allItems?: T[];
}) {
  const ask = useConfirm();
  const all = allItems ?? items;
  const visible = items.map((x) => x.id);
  const update = (id: string, patch: Partial<T>) =>
    onChange(all.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-foreground/55">
          Nothing here yet.
        </p>
      )}
      {items.map((item, i) => (
        <div
          key={item.id}
          className="rounded-2xl border border-border bg-background p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="min-w-0 truncate font-medium text-[var(--brand-brown)]">
              <span className="text-foreground/40 tabular-nums mr-2">
                {i + 1}.
              </span>
              {title(item) || "Untitled"}
            </h3>
            {canStructure && (
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  className={btn.icon}
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => onChange(moveItem(all, item.id, -1, visible))}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  className={btn.icon}
                  aria-label="Move down"
                  disabled={i === items.length - 1}
                  onClick={() => onChange(moveItem(all, item.id, 1, visible))}
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  className={btn.danger}
                  aria-label="Delete"
                  onClick={async () => {
                    const name = title(item);
                    if (
                      await ask({
                        title: name ? `Delete “${name}”?` : "Delete this item?",
                        body: "It disappears from the website when you publish. Until then you can still Discard.",
                        confirmLabel: "Delete",
                        danger: true,
                      })
                    )
                      onChange(all.filter((x) => x.id !== item.id));
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 grid gap-4">
            {render(item, (patch) => update(item.id, patch))}
          </div>
        </div>
      ))}
      {canStructure && newItem && (
        <button
          type="button"
          className={btn.secondary}
          onClick={() => onChange([...all, newItem()])}
        >
          <Plus size={16} />
          {addLabel ?? "Add"}
        </button>
      )}
    </div>
  );
}
