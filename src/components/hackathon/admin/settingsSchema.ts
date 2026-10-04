import { z } from "zod";
import { SLUG_PATTERN } from "@/config/hackathon";
import { fromDateTimeLocal, toDateTimeLocal } from "@/lib/datetime";
import type { BigEventAdmin, BigEventWrite } from "@/dtos/hackathon";

const required = z.string().min(1, "Required");
const wholeNumber = (min: number, max: number) =>
  z.string().refine((value) => /^\d+$/.test(value) && Number(value) >= min && Number(value) <= max, `Enter a whole number from ${min} to ${max}`);

const time = (value: string) => (value ? new Date(value).getTime() : null);

// Mirrors the API's own window checks so mistakes show next to the field instead of as a 422.
export const settingsSchema = z
  .object({
    title: z.string().trim().min(2, "At least 2 characters").max(255, "Keep it under 255 characters"),
    slug: z
      .string()
      .trim()
      .min(2, "At least 2 characters")
      .max(100, "Keep it under 100 characters")
      .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens, like spring-hack-2026"),
    kind: z.enum(["hackathon", "conference"]),
    status: z.enum(["draft", "published", "archived"]),
    isFeatured: z.boolean(),
    description: z.string(),
    heroImageUrl: z
      .string()
      .trim()
      .refine((value) => value === "" || /^https?:\/\/\S+$/.test(value), "Enter a full URL starting with https://"),
    startsAt: required,
    endsAt: required,
    registrationOpensAt: required,
    registrationClosesAt: required,
    minTeamSize: wholeNumber(1, 20),
    maxTeamSize: wholeNumber(1, 20),
    capacity: z
      .string()
      .trim()
      .refine((value) => value === "" || (/^\d+$/.test(value) && Number(value) >= 1), "Enter 1 or more, or leave it empty"),
  })
  .superRefine((v, ctx) => {
    const issue = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (v.startsAt && v.endsAt && time(v.endsAt)! < time(v.startsAt)!) {
      issue("endsAt", "The event must end after it starts");
    }
    if (v.registrationOpensAt && v.registrationClosesAt && time(v.registrationClosesAt)! <= time(v.registrationOpensAt)!) {
      issue("registrationClosesAt", "Registration must close after it opens");
    }
    if (Number(v.minTeamSize) > Number(v.maxTeamSize)) {
      issue("maxTeamSize", "Can't be smaller than the minimum");
    }
  });

export type SettingsValues = z.infer<typeof settingsSchema>;

export const DEFAULT_SETTINGS: SettingsValues = {
  title: "",
  slug: "",
  kind: "hackathon",
  status: "draft",
  isFeatured: false,
  description: "",
  heroImageUrl: "",
  startsAt: "",
  endsAt: "",
  registrationOpensAt: "",
  registrationClosesAt: "",
  minTeamSize: "4",
  maxTeamSize: "5",
  capacity: "",
};

export function settingsFromEvent(event: BigEventAdmin): SettingsValues {
  return {
    title: event.title,
    slug: event.slug,
    kind: event.kind,
    status: event.status,
    isFeatured: event.isFeatured,
    description: event.description,
    heroImageUrl: event.heroImageUrl ?? "",
    startsAt: toDateTimeLocal(event.startsAt),
    endsAt: toDateTimeLocal(event.endsAt),
    registrationOpensAt: toDateTimeLocal(event.registrationOpensAt),
    registrationClosesAt: toDateTimeLocal(event.registrationClosesAt),
    minTeamSize: String(event.minTeamSize),
    maxTeamSize: String(event.maxTeamSize),
    capacity: event.capacity === null ? "" : String(event.capacity),
  };
}

export function settingsToWrite(v: SettingsValues): BigEventWrite {
  return {
    title: v.title.trim(),
    slug: v.slug.trim(),
    kind: v.kind,
    status: v.status,
    isFeatured: v.isFeatured,
    description: v.description,
    heroImageUrl: v.heroImageUrl.trim() || null,
    startsAt: fromDateTimeLocal(v.startsAt)!,
    endsAt: fromDateTimeLocal(v.endsAt)!,
    registrationOpensAt: fromDateTimeLocal(v.registrationOpensAt)!,
    registrationClosesAt: fromDateTimeLocal(v.registrationClosesAt)!,
    minTeamSize: Number(v.minTeamSize),
    maxTeamSize: Number(v.maxTeamSize),
    capacity: v.capacity.trim() ? Number(v.capacity) : null,
  };
}

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/, "");
}
