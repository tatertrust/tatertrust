import { useState, type ReactNode } from "react";
import { ImagePlus, Loader2, MapPin, X } from "lucide-react";

import { STATES } from "@/components/indiaStatesData";
import { INDIA_MAP_VIEWBOX } from "@/components/IndiaMap";
import {
  GALLERY_CATS,
  TIMELINE_ICONS,
  WORK_CATS,
  impactFields,
  type Content,
  type SectionId,
} from "@/lib/content";
import {
  Field,
  ListEditor,
  PhotoField,
  SelectField,
  TextField,
  btn,
  inputCls,
  newId,
  uploadPhoto,
} from "./fields";

type EditorProps<K extends SectionId> = {
  value: Content[K];
  onChange: (v: Content[K]) => void;
  imagesOnly: boolean;
};

export const SECTION_INFO: Record<SectionId, { label: string; help: string }> =
  {
    impact: {
      label: "Impact numbers",
      help: "The counters in “Our Impact” and the strip under the top banner.",
    },
    contact: {
      label: "Contact details",
      help: "Address, phone, email and office hours in the Contact section.",
    },
    bank: {
      label: "Bank details",
      help: "Shown in the Donate section. Double-check before saving.",
    },
    hero: {
      label: "Top banner photo",
      help: "The faded background photo at the very top of the homepage.",
    },
    founders: {
      label: "In Loving Memory",
      help: "Photos, names and years of the founders.",
    },
    work: {
      label: "Our Work",
      help: "Programmes listed under “Programmes that move quietly, reach widely”.",
    },
    timeline: {
      label: "Timeline",
      help: "Milestones under “From 2011 to today”.",
    },
    reach: {
      label: "Geographic reach",
      help: "States and cities in “Where we work” and on the map.",
    },
    partners: { label: "Partners", help: "Institutions and their logos." },
    trustees: {
      label: "Leadership",
      help: "Trustees shown under “Our Trustees”.",
    },
    gallery: { label: "Gallery", help: "Photos in “Moments from the field”." },
  };

/* ── Simple forms ── */

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 sm:p-6 grid gap-5">
      {children}
    </div>
  );
}

function ImpactEditor({ value, onChange }: EditorProps<"impact">) {
  return (
    <Card>
      {impactFields.map((f) => (
        <Field
          key={f.id}
          label={f.label}
          hint={`Shown as ${f.prefix ?? ""}${new Intl.NumberFormat(f.format === "inr" ? "en-IN" : "en-US").format(value[f.id] ?? 0)}${f.suffix ?? ""}`}
        >
          {(id) => (
            <input
              id={id}
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              required
              className={inputCls}
              value={value[f.id] ?? 0}
              onChange={(e) =>
                onChange({
                  ...value,
                  [f.id]: Math.max(0, Math.floor(Number(e.target.value) || 0)),
                })
              }
            />
          )}
        </Field>
      ))}
    </Card>
  );
}

function ContactEditor({ value, onChange }: EditorProps<"contact">) {
  const set = (k: keyof typeof value) => (v: string) =>
    onChange({ ...value, [k]: v });
  return (
    <Card>
      <TextField
        label="Address"
        value={value.address}
        onChange={set("address")}
        multiline
      />
      <TextField label="Phone" value={value.phone} onChange={set("phone")} />
      <TextField label="Email" value={value.email} onChange={set("email")} />
      <TextField
        label="Office hours"
        value={value.hours}
        onChange={set("hours")}
      />
    </Card>
  );
}

function BankEditor({ value, onChange }: EditorProps<"bank">) {
  const set = (k: keyof typeof value) => (v: string) =>
    onChange({ ...value, [k]: v });
  return (
    <Card>
      <TextField
        label="Account name"
        value={value.accountName}
        onChange={set("accountName")}
      />
      <TextField
        label="Bank name"
        value={value.bankName}
        onChange={set("bankName")}
      />
      <TextField
        label="Account number"
        value={value.accountNumber}
        onChange={set("accountNumber")}
      />
      <TextField label="IFSC" value={value.ifsc} onChange={set("ifsc")} />
    </Card>
  );
}

function HeroEditor({ value, onChange }: EditorProps<"hero">) {
  return (
    <Card>
      <PhotoField
        label="Banner photo"
        value={value.img}
        onChange={(img) => onChange({ img })}
      />
    </Card>
  );
}

/* ── People ── */

function FoundersEditor({
  value,
  onChange,
  imagesOnly,
}: EditorProps<"founders">) {
  return (
    <ListEditor
      items={value}
      onChange={onChange}
      canStructure={!imagesOnly}
      title={(f) => f.name}
      addLabel="Add person"
      newItem={() => ({ id: newId(), name: "", years: "", img: "" })}
      render={(f, up) => (
        <>
          <PhotoField
            label="Photo"
            shape="circle"
            value={f.img || undefined}
            onChange={(img) => up({ img })}
          />
          <TextField
            label="Name"
            value={f.name}
            onChange={(name) => up({ name })}
            disabled={imagesOnly}
          />
          <TextField
            label="Years"
            value={f.years}
            onChange={(years) => up({ years })}
            disabled={imagesOnly}
            placeholder="1933 – 2011"
          />
        </>
      )}
    />
  );
}

function TrusteesEditor({
  value,
  onChange,
  imagesOnly,
}: EditorProps<"trustees">) {
  return (
    <ListEditor
      items={value}
      onChange={onChange}
      canStructure={!imagesOnly}
      title={(t) => t.name}
      addLabel="Add trustee"
      newItem={() => ({ id: newId(), name: "", img: "" })}
      render={(t, up) => (
        <>
          <PhotoField
            label="Photo"
            shape="circle"
            value={t.img || undefined}
            onChange={(img) => up({ img })}
          />
          <TextField
            label="Name"
            value={t.name}
            onChange={(name) => up({ name })}
            disabled={imagesOnly}
          />
        </>
      )}
    />
  );
}

function PartnersEditor({
  value,
  onChange,
  imagesOnly,
}: EditorProps<"partners">) {
  return (
    <ListEditor<Content["partners"][number]>
      items={value}
      onChange={onChange}
      canStructure={!imagesOnly}
      title={(p) => p.name}
      addLabel="Add partner"
      newItem={() => ({ id: newId(), name: "" })}
      render={(p, up) => (
        <>
          <PhotoField
            label="Logo (optional)"
            shape="logo"
            value={p.logo}
            onChange={(logo) => up({ logo })}
            onRemove={() => up({ logo: undefined })}
          />
          <TextField
            label="Name"
            value={p.name}
            onChange={(name) => up({ name })}
            disabled={imagesOnly}
          />
        </>
      )}
    />
  );
}

/* ── Category filter chips (Our Work, Gallery) ── */

function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] ${
            value === o.value
              ? "bg-[var(--brand-brown)] text-white"
              : "border border-border bg-background text-foreground/70"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const WORK_LABELS: Record<(typeof WORK_CATS)[number], string> = {
  Education: "Education",
  Healthcare: "Healthcare",
  Community: "Community",
  Animal: "Animal Welfare",
};

function WorkEditor({ value, onChange }: EditorProps<"work">) {
  const [cat, setCat] = useState<(typeof WORK_CATS)[number]>("Education");
  return (
    <div className="space-y-5">
      <Chips
        options={WORK_CATS.map((c) => ({
          value: c,
          label: `${WORK_LABELS[c]} (${value.filter((w) => w.cat === c).length})`,
        }))}
        value={cat}
        onChange={setCat}
      />
      <ListEditor
        items={value.filter((w) => w.cat === cat)}
        allItems={value}
        onChange={onChange}
        canStructure
        title={(w) => w.name}
        addLabel={`Add ${WORK_LABELS[cat]} programme`}
        newItem={() => ({
          id: newId(),
          cat,
          name: "",
          location: "",
          impact: "",
          desc: "",
        })}
        render={(w, up) => (
          <>
            <TextField
              label="Programme name"
              value={w.name}
              onChange={(name) => up({ name })}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField
                label="Location"
                value={w.location}
                onChange={(location) => up({ location })}
              />
              <TextField
                label="Highlight badge"
                value={w.impact}
                onChange={(impact) => up({ impact })}
                hint="Short, e.g. “4,820 Students”"
              />
            </div>
            <TextField
              label="Description"
              value={w.desc}
              onChange={(desc) => up({ desc })}
              multiline
            />
            <SelectField
              label="Category"
              value={w.cat}
              options={WORK_CATS.map((c) => ({
                value: c,
                label: WORK_LABELS[c],
              }))}
              onChange={(c) => up({ cat: c })}
            />
          </>
        )}
      />
    </div>
  );
}

function TimelineEditor({ value, onChange }: EditorProps<"timeline">) {
  return (
    <ListEditor
      items={value}
      onChange={onChange}
      canStructure
      title={(t) => `${t.year} · ${t.title}`}
      addLabel="Add milestone"
      newItem={() => ({
        id: newId(),
        year: String(new Date().getFullYear()),
        title: "",
        text: "",
        icon: "Heart" as const,
        stats: [],
      })}
      render={(t, up) => (
        <>
          <div className="grid sm:grid-cols-[10rem_1fr] gap-4">
            <TextField
              label="Year"
              value={t.year}
              onChange={(year) => up({ year })}
            />
            <TextField
              label="Title"
              value={t.title}
              onChange={(title) => up({ title })}
            />
          </div>
          <TextField
            label="Description"
            value={t.text}
            onChange={(text) => up({ text })}
            multiline
          />
          <TextField
            label="Highlights"
            hint="One per line, e.g. “456 students”. Leave empty for none."
            multiline
            value={t.stats.join("\n")}
            onChange={(v) => up({ stats: v.split("\n").slice(0, 10) })}
          />
          <SelectField
            label="Icon"
            value={t.icon}
            options={TIMELINE_ICONS}
            onChange={(icon) => up({ icon })}
          />
        </>
      )}
    />
  );
}

/* ── Geographic reach: click the map to place a city ── */

function PickMap({
  dots,
  pending,
  onPick,
}: {
  dots: { name: string; x: number; y: number }[];
  pending: { x: number; y: number } | null;
  onPick: (x: number, y: number) => void;
}) {
  return (
    <svg
      viewBox={INDIA_MAP_VIEWBOX}
      className="w-full max-w-sm rounded-xl border border-border bg-white cursor-crosshair"
      role="img"
      aria-label="Map of India. Click to place the new city."
      onClick={(e) => {
        const svg = e.currentTarget;
        const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
          svg.getScreenCTM()!.inverse(),
        );
        onPick(Math.round(pt.x * 10) / 10, Math.round(pt.y * 10) / 10);
      }}
    >
      {STATES.map((s) => (
        <path
          key={s.name}
          d={s.d}
          fill="#DCE3E2"
          stroke="white"
          strokeWidth={1}
        />
      ))}
      {dots.map((d) => (
        <circle
          key={d.name}
          cx={d.x}
          cy={d.y}
          r={3}
          fill="var(--brand-green)"
        />
      ))}
      {pending && (
        <circle
          cx={pending.x}
          cy={pending.y}
          r={5}
          fill="var(--brand-brown)"
          stroke="white"
          strokeWidth={1.5}
        />
      )}
    </svg>
  );
}

function CityAdder({
  dots,
  onAdd,
}: {
  dots: { name: string; x: number; y: number }[];
  // Returns an error message to show, or nothing on success.
  onAdd: (c: { name: string; x: number; y: number }) => string | void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);
  const ready = name.trim() && pt;
  return (
    <div className="rounded-xl bg-[var(--surface)] p-4 space-y-3">
      <p className="text-sm font-medium text-[var(--brand-brown)]">
        Add a city
      </p>
      <TextField label="City name" value={name} onChange={setName} />
      <p className="text-xs text-foreground/60">
        {pt
          ? "Placed. Click again to move it."
          : "Now click on the map where the city is."}
      </p>
      <PickMap dots={dots} pending={pt} onPick={(x, y) => setPt({ x, y })} />
      <button
        type="button"
        className={btn.secondary}
        disabled={!ready}
        onClick={() => {
          const err = onAdd({ name: name.trim(), ...pt! });
          setError(err ?? "");
          if (err) return;
          setName("");
          setPt(null);
        }}
      >
        <MapPin size={16} /> Add city
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function ReachEditor({ value, onChange }: EditorProps<"reach">) {
  const allNames = new Set(
    value.flatMap((r) => r.cities.map((c) => c.name.toLowerCase())),
  );
  return (
    <ListEditor
      items={value}
      onChange={onChange}
      canStructure
      title={(r) => r.state}
      addLabel="Add state"
      newItem={() => ({ id: newId(), state: "", cities: [] })}
      render={(r, up) => (
        <>
          <TextField
            label="State"
            value={r.state}
            onChange={(state) => up({ state })}
          />
          <div>
            <span className="block text-sm font-medium text-[var(--brand-brown)]">
              Cities
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {r.cities.length === 0 && (
                <span className="text-sm text-foreground/55">
                  No cities yet.
                </span>
              )}
              {r.cities.map((c) => (
                <span
                  key={c.name}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background pl-3 pr-1 py-1 text-sm"
                >
                  {c.name}
                  <button
                    type="button"
                    aria-label={`Remove ${c.name}`}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)]"
                    onClick={() =>
                      up({ cities: r.cities.filter((x) => x.name !== c.name) })
                    }
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <CityAdder
            dots={r.cities}
            onAdd={(c) => {
              if (allNames.has(c.name.toLowerCase()))
                return `${c.name} is already on the map.`;
              up({ cities: [...r.cities, c] });
            }}
          />
        </>
      )}
    />
  );
}

/* ── Gallery ── */

type GalleryFilter = "All" | (typeof GALLERY_CATS)[number];

function GalleryEditor({ value, onChange }: EditorProps<"gallery">) {
  const [filter, setFilter] = useState<GalleryFilter>("All");
  const [uploading, setUploading] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState("");
  const items =
    filter === "All" ? value : value.filter((g) => g.cat === filter);

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const list = [...files];
    setUploading({ done: 0, total: list.length });
    const added: Content["gallery"] = [];
    for (const [i, file] of list.entries()) {
      try {
        const { url, ratio } = await uploadPhoto(file);
        added.push({
          id: newId(),
          cat: filter === "All" ? "Community" : filter,
          caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          ratio,
          img: url,
        });
      } catch (e) {
        setError(
          `${file.name}: ${e instanceof Error ? e.message : "upload failed"}`,
        );
      }
      setUploading({ done: i + 1, total: list.length });
    }
    // New photos go first so they're easy to find and caption.
    onChange([...added, ...value]);
    setUploading(null);
  }

  return (
    <div className="space-y-5">
      <Chips
        options={(["All", ...GALLERY_CATS] as GalleryFilter[]).map((c) => ({
          value: c,
          label: `${c} (${c === "All" ? value.length : value.filter((g) => g.cat === c).length})`,
        }))}
        value={filter}
        onChange={setFilter}
      />
      <label className={`${btn.primary} cursor-pointer w-fit`}>
        {uploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ImagePlus size={16} />
        )}
        {uploading
          ? `Uploading ${uploading.done}/${uploading.total}…`
          : "Add photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={!!uploading}
          onChange={(e) => {
            addPhotos(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      <p className="text-xs text-foreground/55">
        You can select several photos at once. New photos appear at the top
        {filter === "All" ? " in “Community”" : ` in “${filter}”`}. Remember to
        add captions, then Save.
      </p>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <ListEditor
        items={items}
        allItems={value}
        onChange={onChange}
        canStructure
        title={(g) => g.caption}
        render={(g, up) => (
          <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
            <PhotoField
              label="Photo"
              stacked
              value={g.previewImg ?? g.img}
              onChange={(img, ratio) =>
                up({ img, ratio, previewImg: undefined })
              }
            />
            <div className="grid gap-4 content-start">
              <TextField
                label="Caption"
                value={g.caption}
                onChange={(caption) => up({ caption })}
              />
              <SelectField
                label="Category"
                value={g.cat}
                options={GALLERY_CATS}
                onChange={(cat) => up({ cat })}
              />
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-[var(--brand-green)]"
                  checked={!!g.hideFromAll}
                  onChange={(e) =>
                    up({ hideFromAll: e.target.checked || undefined })
                  }
                />
                Hide from the “All” tab (still shows in its category)
              </label>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export const EDITORS: { [K in SectionId]: (p: EditorProps<K>) => ReactNode } = {
  impact: ImpactEditor,
  contact: ContactEditor,
  bank: BankEditor,
  hero: HeroEditor,
  founders: FoundersEditor,
  work: WorkEditor,
  timeline: TimelineEditor,
  reach: ReachEditor,
  partners: PartnersEditor,
  trustees: TrusteesEditor,
  gallery: GalleryEditor,
};
