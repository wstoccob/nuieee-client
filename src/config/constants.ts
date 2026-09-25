export const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  initialQuality: 0.8,
  useWebWorker: true,
  preserveExif: false,
} as const;

export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_EVENT_PHOTOS = Number(import.meta.env.VITE_MAX_EVENT_PHOTOS ?? 20);