import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  currentRole,
  endSession,
  login as doLogin,
  readContent,
  saveUpload,
  setPassword,
  usersWithPassword,
  verifyOwnPassword,
  writeSection,
} from "./admin.server";
import {
  ROLE_IDS,
  ROLES,
  SECTION_IDS,
  schemas,
  withoutImages,
  type SectionId,
} from "./content";

export const getSiteContent = createServerFn({ method: "GET" }).handler(() =>
  readContent(),
);

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
  .transform((r) => r as keyof typeof ROLES);
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

export const saveSection = createServerFn({ method: "POST" })
  .validator(
    z.object({
      section: z.enum(SECTION_IDS as [SectionId, ...SectionId[]]),
      data: z.unknown(),
    }),
  )
  .handler(async ({ data: { section, data } }) => {
    const role = await requireRole();
    const access = ROLES[role];
    if (!access.sections.includes(section))
      throw new Error("You can't edit this section.");
    const parsed = schemas[section].safeParse(data);
    if (!parsed.success)
      throw new Error(parsed.error.issues[0]?.message ?? "Invalid data");
    if (access.imagesOnly.includes(section)) {
      const current = (await readContent())[section];
      if (
        JSON.stringify(withoutImages(current)) !==
        JSON.stringify(withoutImages(parsed.data))
      )
        throw new Error("You can only change photos in this section.");
    }
    await writeSection(section, parsed.data);
    return true;
  });

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
    endSession(); // new password bumps the version; sign in again with it
    return true;
  });

export const resetUserPassword = createServerFn({ method: "POST" })
  .validator(z.object({ role: roleSchema, next: newPassword }))
  .handler(async ({ data }) => {
    if ((await requireRole()) !== "super")
      throw new Error("Only Super Admin can reset passwords.");
    await setPassword(data.role, data.next);
    return true;
  });
