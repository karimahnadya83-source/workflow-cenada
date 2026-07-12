import { z } from "zod";

export const contactStageEnum = z.enum([
  "NEW_LEAD",
  "CONTACTED",
  "TRIAL_SCHEDULED",
  "TEST_DONE",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
]);

export const leadSourceEnum = z.enum([
  "WHATSAPP",
  "INSTAGRAM",
  "FACEBOOK",
  "REFERRAL",
  "WALK_IN",
  "WEBSITE",
  "OTHER",
]);

export const leadTemperatureEnum = z.enum(["HOT", "WARM", "COLD"]);

export const createContactSchema = z.object({
  fullName: z.string().min(1, "Nama wajib diisi").max(100),
  phone: z
    .string()
    .min(9, "Nomor HP minimal 9 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .regex(/^[0-9+]+$/, "Nomor HP hanya boleh angka"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
  source: leadSourceEnum,
  temperature: leadTemperatureEnum.default("WARM"),
  stage: contactStageEnum.default("NEW_LEAD"),
});

export type CreateContactInput = z.input<typeof createContactSchema>;
export type CreateContactOutput = z.output<typeof createContactSchema>;