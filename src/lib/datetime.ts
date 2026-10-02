// The interface is written in English, so dates must be too. Leaving this to the
// browser produced Russian month names next to English copy for many participants.
// The time zone is still the visitor's own.
const LOCALE = "en-GB";

const sameYear = (date: Date) => date.getFullYear() === new Date().getFullYear();

function dateTimeFormat(date: Date, withWeekday = true) {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: withWeekday ? "short" : undefined,
    day: "numeric",
    month: "short",
    year: sameYear(date) ? undefined : "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return dateTimeFormat(date).format(date);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: sameYear(date) ? undefined : "numeric",
  }).format(date);
}

export function formatDateTimeRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return dateTimeFormat(start).formatRange(start, end);
}

export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatRange(start, end);
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

export function formatRelative(iso: string, now = Date.now()): string {
  const diff = new Date(iso).getTime() - now;
  const format = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms) return format.format(Math.round(diff / ms), unit);
  }
  return format.format(0, "minute");
}

export function isFuture(iso: string | null): boolean {
  return iso !== null && new Date(iso).getTime() > Date.now();
}

export const localTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const pad = (value: number) => String(value).padStart(2, "0");

export function toDateTimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// A datetime-local value has no offset, and the Date constructor reads it as local time.
export function fromDateTimeLocal(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}
