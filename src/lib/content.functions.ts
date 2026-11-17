import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  addLog,
  currentRole,
  endSession,
  login as doLogin,
  readContent,
  readLog,
  readPreview,
  savePreview,
  saveUpload,
  setPassword,
  usersWithPassword,
  verifyOwnPassword,
  writeSection,
} from "./admin.server";
import {
  LOG_VIEWER,
  ROLE_IDS,
  ROLES,
  SECTION_IDS,
  describeChange,
  schemas,
  withoutImages,
  type Role,
  type SectionId,
} from "./content";

const previewToken = z.string().regex(/^[a-f0-9]{32}$/);

// Public. With a valid preview token, one section is swapped for its unsaved draft.
export const getSiteContent = createServerFn({ method: "GET" })
  .validator(z.object({ preview: previewToken.optional() }))
  .handler(async ({ data }) => {
    const content = await readContent();
    const draft = data.preview ? await readPreview(data.preview) : null;
    if (draft) Object.assign(content, { [draft.section]: draft.data });
    return { content, preview: !!draft };
  });

export const getAdminState = createServerFn({ method: "GET" }).handler(
  async () => {
    const role = await currentRole();
    if (!role) return { role: null };
    return {
      role,
      content: await readContent(),
      usersWithPassword: role === "super" ? await usersWithPassword() : [],
    };
  },
);

const roleSchema = z
  .enum(ROLE_IDS as [string, ...string[]])
  .transform((r) => r as Role);
const newPassword = z.string().min(8, "Use at least 8 characters").max(200);

export const login = createServerFn({ method: "POST" })
  .validator(
    z.object({ role: roleSchema, password: z.string().min(1).max(200) }),
  )
  .handler(async ({ data }) => {
    await doLogin(data.role, data.password);
    return true;
  });

export const logout = createServerFn({ method: "POST" }).handler(() => {
  endSession();
  return true;
});

async function requireRole() {
  const role = await currentRole();
  if (!role) throw new Error("Your session has ended. Please sign in again.");
  return role;
}

const sectionInput = z.object({
  section: z.enum(SECTION_IDS as [SectionId, ...SectionId[]]),
  data: z.unknown(),
});

// Shared by Save and Preview: who may change what, and is the data valid.
async function checkEdit(section: SectionId, data: unknown) {
  const role = await requireRole();
  const access = ROLES[role];
  if (!access.sections.includes(section))
    throw new Error("You can't edit this section.");
  const parsed = schemas[section].safeParse(data);
  if (!parsed.success)
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid data");
  const current = (await readContent())[section];
  if (
    access.imagesOnly.includes(section) &&
    JSON.stringify(withoutImages(current)) !==
      JSON.stringify(withoutImages(parsed.data))
  )
    throw new Error("You can only change photos in this section.");
  return { role, data: parsed.data, current };
}

// Publishing requires a preview: the client sends the preview token and the
// server publishes exactly the data that was previewed.
export const saveSection = createServerFn({ method: "POST" })
  .validator(z.object({ token: previewToken }))
  .handler(async ({ data: { token } }) => {
    const draft = await readPreview(token);
    if (!draft)
      throw new Error("This preview has expired. Please preview again.");
    const edit = await checkEdit(draft.section, draft.data);
    await writeSection(draft.section, edit.data);
    await addLog({
      who: edit.role,
      what: "Saved",
      section: draft.section,
      details: describeChange(edit.current, edit.data),
    });
    return true;
  });

export const createPreview = createServerFn({ method: "POST" })
  .validator(sectionInput)
  .handler(async ({ data: { section, data } }) => {
    const edit = await checkEdit(section, data);
    return savePreview(section, edit.data);
  });

export const getChangeLog = createServerFn({ method: "GET" }).handler(
  async () => {
    if ((await requireRole()) !== LOG_VIEWER)
      throw new Error("The change log is only available to the Developer.");
    return readLog();
  },
);

export const uploadImage = createServerFn({ method: "POST" })
  .validator((d: FormData) => {
    const file = d.get("file");
    if (!(file instanceof File)) throw new Error("No file");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      throw new Error("Please upload a JPG, PNG or WebP image.");
    if (file.size > 4 * 1024 * 1024)
      throw new Error("Image is too large (max 4 MB after resizing).");
    return file;
  })
  .handler(async ({ data: file }) => {
    await requireRole();
    return saveUpload(file);
  });

export const changeOwnPassword = createServerFn({ method: "POST" })
  .validator(z.object({ current: z.string().max(200), next: newPassword }))
  .handler(async ({ data }) => {
    const role = await requireRole();
    if (!(await verifyOwnPassword(role, data.current)))
      throw new Error("Current password is wrong.");
    await setPassword(role, data.next);
    await addLog({ who: role, what: "Changed own password", details: [] });
    endSession(); // new password bumps the version; sign in again with it
    return true;
  });

export const resetUserPassword = createServerFn({ method: "POST" })
  .validator(z.object({ role: roleSchema, next: newPassword }))
  .handler(async ({ data }) => {
    const role = await requireRole();
    if (role !== "super")
      throw new Error("Only Super Admin can reset passwords.");
    await setPassword(data.role, data.next);
    await addLog({
      who: role,
      what: `Set password for ${ROLES[data.role].label}`,
      details: [],
    });
    return true;
  });
