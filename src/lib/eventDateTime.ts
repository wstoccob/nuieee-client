const pad = (value: number) => String(value).padStart(2, "0");

export function toDatetimeLocal(iso: string): string {
  const date = new Date(iso);

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
    ":",
    pad(date.getSeconds()),
    ".",
    String(date.getMilliseconds()).padStart(3, "0"),
  ].join("");
}

export function fromDatetimeLocal(value: string): string {
  return new Date(value).toISOString();
}
