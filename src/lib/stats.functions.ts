import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  checkPassword,
  endSession,
  isAdmin,
  readStatValues,
  startSession,
  writeStatValues,
} from "./admin.server";

// Built-in values. Shown until saved values load, and whenever nothing is saved.
export const impactDefaults = [
  { id: "students", value: 4820, label: "Students awarded scholarships" },
  {
    id: "scholarshipAmount",
    value: 19766858,
    label: "Scholarship amount disbursed",
    prefix: "₹",
    format: "inr" as const,
  },
  { id: "babies", value: 6360, label: "Babies delivered at Trust's hospital in Merta" },
  { id: "eyeScreenings", value: 166011, label: "Eye camp screenings" },
  { id: "eyeSurgeries", value: 50448, label: "Eye surgeries" },
  { id: "spectacles", value: 14339, label: "Spectacles distributed" },
  { id: "eyeCamps", value: 1307, label: "Eye camps conducted" },
  { id: "disabled", value: 2000, label: "Disabled people benefited", suffix: "+" },
  { id: "dialysis", value: 2, label: "Dialysis machines donated" },
];

export type ImpactValues = Record<string, number>;

export function withValues(values: ImpactValues | undefined) {
  return impactDefaults.map((s) => ({ ...s, value: values?.[s.id] ?? s.value }));
}

export const getImpactValues = createServerFn({ method: "GET" }).handler(() => readStatValues());

export const getAdminState = createServerFn({ method: "GET" }).handler(async () => {
  const admin = isAdmin();
  return { isAdmin: admin, values: admin ? await readStatValues() : {} };
});

export const login = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1).max(200) }))
  .handler(({ data }) => {
    if (!checkPassword(data.password)) throw new Error("Wrong password");
    startSession();
    return true;
  });

export const logout = createServerFn({ method: "POST" }).handler(() => {
  endSession();
  return true;
});

const ids = impactDefaults.map((s) => s.id) as [string, ...string[]];

export const saveImpactValues = createServerFn({ method: "POST" })
  .validator(z.record(z.enum(ids), z.number().int().min(0).max(1e12)))
  .handler(async ({ data }) => {
    if (!isAdmin()) throw new Error("Not signed in");
    await writeStatValues(data);
    return true;
  });
