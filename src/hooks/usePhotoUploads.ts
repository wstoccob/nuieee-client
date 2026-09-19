import { useCallback, useState } from "react";
import { toast } from "sonner";
import { storageApi } from "@/api/storage";
import type { EventPhotoInput } from "@/dtos/event";

const MAX_PHOTOS = Number(import.meta.env.VITE_MAX_EVENT_PHOTOS ?? 20);
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface PendingPhoto {
  id: string;
  file: File;
  preview: string;
  altText: string;
}

export function usePhotoUploads() {
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const valid = Array.from(files).filter((file) => {
      if (ALLOWED_TYPES.includes(file.type)) return true;
      toast.error(`Invalid file type: ${file.name}. Only images allowed.`);
      return false;
    });

    setPhotos((current) => {
      const availableSlots = Math.max(0, MAX_PHOTOS - current.length);
      if (valid.length > availableSlots) {
        toast.error(
          `Maximum ${MAX_PHOTOS} photos allowed. Only adding the first ${availableSlots}.`
        );
      }
      const accepted = valid.slice(0, availableSlots).map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        altText: "",
      }));
      return [...current, ...accepted];
    });
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos((current) => {
      const target = current.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((p) => p.id !== id);
    });
  }, []);

  const setAltText = useCallback((id: string, altText: string) => {
    setPhotos((current) =>
      current.map((p) => (p.id === id ? { ...p, altText } : p))
    );
  }, []);

  /**
   * Upload every pending photo and return them as event payload entries.
   *
   * Each result keeps its own altText rather than being re-indexed against a
   * filtered array, which previously misaligned captions when an upload failed.
   */
  const uploadAll = useCallback(async (): Promise<EventPhotoInput[]> => {
    if (photos.length === 0) return [];

    setUploading(true);
    try {
      return await Promise.all(
        photos.map(async (photo) => {
          const target = await storageApi.createUploadTarget(photo.file.name);
          await storageApi.uploadToTarget(target.uploadUrl, photo.file);
          return { photoUrl: target.publicUrl, altText: photo.altText };
        })
      );
    } finally {
      setUploading(false);
    }
  }, [photos]);

  return { photos, uploading, addFiles, removePhoto, setAltText, uploadAll, MAX_PHOTOS };
}
