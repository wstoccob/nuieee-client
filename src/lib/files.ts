export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

export function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot).toLowerCase();
}

export function describeExtensions(extensions: string[]): string {
  return extensions.map((ext) => ext.slice(1).toUpperCase()).join(", ");
}

export function validateFile(file: File, extensions: string[], maxBytes?: number): string | null {
  if (!extensions.includes(fileExtension(file.name))) {
    return `Only ${describeExtensions(extensions)} files are accepted.`;
  }
  if (file.size === 0) return "This file is empty.";
  if (maxBytes !== undefined && file.size > maxBytes) {
    return `This file is ${formatBytes(file.size)}. The limit is ${formatBytes(maxBytes)}.`;
  }
  return null;
}
