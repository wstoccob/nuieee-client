import { useCallback, useState } from "react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { storageApi } from "@/api/storage";
import type { EventPhotoInput } from "@/dtos/event";
import { 
  COMPRESSION_OPTIONS, 
  ALLOWED_PHOTO_TYPES, 
  MAX_EVENT_PHOTOS 
} from "@/config/constants";

export interface PendingPhoto {
  id: string;
  file: File;
  preview: string;
  altText: string;
  status: "compressing" | "ready";
  originalSize: number;
  compressedSize?: number;
}

export function usePhotoUploads() {
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [uploading, setUploading] = useState(false);

  const compressSingleFile = async (id: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      setPhotos((current) =>
        current.map((p) =>
          p.id === id ? { ...p, status: "ready", compressedSize: file.size } : p
        )
      );
      return;
    }

    try {
      const compressedBlob = await imageCompression(file, COMPRESSION_OPTIONS);
      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type || file.type,
        lastModified: Date.now(),
      });

      const finalFile = compressedFile.size < file.size ? compressedFile : file;

      setPhotos((current) =>
        current.map((p) =>
          p.id === id
            ? {
                ...p,
                file: finalFile,
                status: "ready",
                compressedSize: finalFile.size,
              }
            : p
        )
      );
    } catch (error) {
      console.error("Compression failed, using original:", error);
      setPhotos((current) =>
        current.map((p) =>
          p.id === id ? { ...p, status: "ready", compressedSize: file.size } : p
        )
      );
    }
  };

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const valid = Array.from(files).filter((file) => {
      if ((ALLOWED_PHOTO_TYPES as readonly string[]).includes(file.type)) return true;
      toast.error(`Invalid file type: ${file.name}. Only images allowed.`);
      return false;
    });

    if (valid.length === 0) return;

    setPhotos((current) => {
      const availableSlots = Math.max(0, MAX_EVENT_PHOTOS - current.length);
      if (valid.length > availableSlots) {
        toast.error(
          `Maximum ${MAX_EVENT_PHOTOS} photos allowed. Only adding the first ${availableSlots}.`
        );
      }
      const accepted = valid.slice(0, availableSlots);

      const newItems: PendingPhoto[] = accepted.map((file) => {
        const id = crypto.randomUUID();
        compressSingleFile(id, file);

        return {
          id,
          file,
          preview: URL.createObjectURL(file),
          altText: "",
          status: "compressing",
          originalSize: file.size,
        };
      });

      return [...current, ...newItems];
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

  return {
    photos,
    uploading,
    addFiles,
    removePhoto,
    setAltText,
    uploadAll,
    MAX_PHOTOS: MAX_EVENT_PHOTOS,
  };
}