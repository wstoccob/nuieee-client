import type { BigEventKind, BigEventStatus, YearOfStudy } from "@/dtos/hackathon";

export const YEAR_OF_STUDY_OPTIONS: { value: YearOfStudy; label: string }[] = [
  { value: "1", label: "1st year" },
  { value: "2", label: "2nd year" },
  { value: "3", label: "3rd year" },
  { value: "4", label: "4th year" },
  { value: "na", label: "Not applicable (NUFYP etc.)" },
];

export const YEAR_OF_STUDY_LABELS = Object.fromEntries(
  YEAR_OF_STUDY_OPTIONS.map(({ value, label }) => [value, label])
) as Record<YearOfStudy, string>;

export const STATUS_OPTIONS: { value: BigEventStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export const KIND_OPTIONS: { value: BigEventKind; label: string }[] = [
  { value: "hackathon", label: "Hackathon" },
  { value: "conference", label: "Conference" },
];

export const ORGANISER_EMAIL = "ieee@nu.edu.kz";

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const TURNSTILE_SITE_KEY: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY || undefined;
