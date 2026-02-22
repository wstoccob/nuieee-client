import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import AdminHeader from "@/components/Layouts/AdminPageLayout/AdminHeader";
import { Button } from "@/components/ui/button";
import eventsApi from "@/api/eventsApi";
import minioApi from "@/api/minioApi";
import type { CreateEventCommand } from "@/dtos/Events/EventDto";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MAX_PHOTOS = parseInt(import.meta.env.VITE_MAX_EVENT_PHOTOS || "20", 10);
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface PhotoUpload {
  id: string;
  file: File;
  preview: string;
  alternativeText: string;
  uploadedUrl?: string;
  uploading: boolean;
  error?: string;
}

const schema = z.object({
  title: z.string().min(2, "Title too short").max(200),
  description: z.string().min(10, "Description too short").max(5000),
  eventDateTime: z.string(), // we'll ensure it's valid before submit
  registrationLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export default function AddNewEventPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      eventDateTime: "",
      registrationLink: "",
    },
  });

  // Generate unique ID for photo
  const generatePhotoId = () => `photo_${Date.now()}_${Math.random()}`;

  // Validate file
  const isValidFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`Invalid file type: ${file.name}. Only images allowed.`);
      return false;
    }
    return true;
  };

  // Handle file selection from input or drop
  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    const newPhotos: PhotoUpload[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!isValidFile(file)) continue;

      // Check max photos limit
      if (photos.length + newPhotos.length >= MAX_PHOTOS) {
        toast.error(`Maximum ${MAX_PHOTOS} photos allowed`);
        break;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setPhotos((prev) => [
          ...prev,
          {
            id: generatePhotoId(),
            file,
            preview,
            alternativeText: "",
            uploading: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag over
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelection(e.dataTransfer.files);
  };

  // Remove photo
  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  // Update alternative text
  const updateAltText = (id: string, text: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, alternativeText: text } : p))
    );
  };

  // Upload a single photo
  const uploadPhoto = async (photo: PhotoUpload): Promise<string> => {
    try {
      // Get pre-signed URL and confirmed fileName from backend
      const { uploadUrl, fileName } = await minioApi.getUploadUrl(photo.file.name);

      // Update uploading state
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, uploading: true } : p
        )
      );

      // Upload file to pre-signed URL
      await minioApi.uploadFile(uploadUrl, photo.file);

      // Construct the permanent URL
      const permanentUrl = minioApi.constructPermanentUrl(fileName);

      // Clear uploading state and store the permanent URL
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? { ...p, uploading: false, uploadedUrl: permanentUrl }
            : p
        )
      );

      return permanentUrl;
    } catch (error: any) {
      const errorMsg =
        error?.message || "Failed to upload photo";
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? { ...p, uploading: false, error: errorMsg }
            : p
        )
      );
      throw error;
    }
  };

  // Upload all photos
  const uploadAllPhotos = async (): Promise<string[]> => {
    const uploadPromises = photos.map((photo) => uploadPhoto(photo));

    const results = await Promise.allSettled(uploadPromises);

    const uploadedUrls = results
      .map((result, idx) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          console.error(
            `Upload failed for photo ${idx}:`,
            result.reason
          );
          return null;
        }
      })
      .filter((url): url is string => url !== null);

    // Check if any uploads failed
    const failedUploads = results.some(
      (result) => result.status === "rejected"
    );
    if (failedUploads) {
      throw new Error("Some photos failed to upload. Please retry or remove failed photos.");
    }

    return uploadedUrls;
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      if (!values.eventDateTime) {
        toast.error("Event date/time required");
        return;
      }

      // Upload photos if any exist
      let uploadedPhotoUrls: string[] = [];
      if (photos.length > 0) {
        toast.loading("Uploading photos...");
        uploadedPhotoUrls = await uploadAllPhotos();
        toast.dismiss();
      }

      const payload: CreateEventCommand = {
        title: values.title,
        description: values.description,
        eventDateTime: new Date(values.eventDateTime).toISOString(),
        registrationLink: values.registrationLink || undefined,
        photos: uploadedPhotoUrls.map((url, idx) => ({
          alternativeText: photos[idx]?.alternativeText || "",
          photoLink: url,
        })),
      };

      const created = await eventsApi.createEvent(payload);
      toast.success("Event created");
      navigate(`/events/${created.id}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <h1 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-12">
          add new event
        </h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-4xl space-y-8 bg-black border-2 border-white rounded-lg shadow-2xl p-8 md:p-12"
        >
          {/* Title */}
          <div>
            <label className="block text-white text-xl font-inter font-semibold mb-3 uppercase">
              Title
            </label>
            <input
              type="text"
              {...form.register("title")}
              className="w-full rounded-md border-2 border-white bg-black text-white px-4 py-3 text-lg font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue placeholder-white/50"
              placeholder="Amazing Engineering Talk"
            />
            {form.formState.errors.title && (
              <p className="text-red-400 text-sm mt-2 font-semibold">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* DateTime */}
          <div>
            <label className="block text-white text-xl font-inter font-semibold mb-3 uppercase">
              Event Date & Time
            </label>
            <input
              type="datetime-local"
              {...form.register("eventDateTime")}
              className="w-full rounded-md border-2 border-white bg-black text-white px-4 py-3 text-lg font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue"
            />
            {form.formState.errors.eventDateTime && (
              <p className="text-red-400 text-sm mt-2 font-semibold">
                {form.formState.errors.eventDateTime.message}
              </p>
            )}
          </div>

          {/* Registration Link */}
          <div>
            <label className="block text-white text-xl font-inter font-semibold mb-3 uppercase">
              Registration Link (optional)
            </label>
            <input
              type="url"
              {...form.register("registrationLink")}
              className="w-full rounded-md border-2 border-white bg-black text-white px-4 py-3 text-lg font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue placeholder-white/50"
              placeholder="https://"
            />
            {form.formState.errors.registrationLink && (
              <p className="text-red-400 text-sm mt-2 font-semibold">
                {form.formState.errors.registrationLink.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-white text-xl font-inter font-semibold mb-3 uppercase">
              Description
            </label>
            <textarea
              rows={6}
              {...form.register("description")}
              className="w-full rounded-md border-2 border-white bg-black text-white px-4 py-3 text-lg font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue placeholder-white/50"
              placeholder="Describe the event..."
            />
            {form.formState.errors.description && (
              <p className="text-red-400 text-sm mt-2 font-semibold">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Photos */}
          <div>
            <label className="block text-white text-xl font-inter font-semibold mb-3 uppercase">
              Photos ({photos.length}/{MAX_PHOTOS})
            </label>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-ieee-blue bg-ieee-blue/10"
                  : "border-white/50 bg-black/30 hover:border-white/70"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelection(e.target.files)}
                className="hidden"
              />
              <div className="space-y-2">
                <p className="text-white text-lg font-semibold">
                  Drag & drop photos here
                </p>
                <p className="text-white/60 text-sm">or click to select files</p>
                <p className="text-white/50 text-xs">
                  Supported: JPG, PNG, WebP, GIF (Max {MAX_PHOTOS} photos)
                </p>
              </div>
            </div>

            {/* Photos Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="border-2 border-white/30 rounded-lg overflow-hidden bg-black/50"
                  >
                    {/* Preview Image */}
                    <div className="relative w-full h-40 bg-black flex items-center justify-center overflow-hidden">
                      <img
                        src={photo.preview}
                        alt={photo.alternativeText || "Preview"}
                        className="w-full h-full object-cover"
                      />

                      {/* Upload Progress Overlay */}
                      {photo.uploading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ieee-blue mx-auto mb-2"></div>
                            <p className="text-white text-sm">Uploading...</p>
                          </div>
                        </div>
                      )}

                      {/* Error Overlay */}
                      {photo.error && (
                        <div className="absolute inset-0 bg-red-600/70 flex items-center justify-center">
                          <div className="text-center p-2">
                            <p className="text-white text-xs font-semibold">
                              ⚠ Upload Failed
                            </p>
                            <p className="text-white text-xs mt-1">
                              {photo.error}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Success Check */}
                      {photo.uploadedUrl && !photo.uploading && !photo.error && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Alt Text Input */}
                    <div className="p-3 space-y-2">
                      <input
                        type="text"
                        value={photo.alternativeText}
                        onChange={(e) =>
                          updateAltText(photo.id, e.target.value)
                        }
                        placeholder="Alternative text"
                        className="w-full rounded-md border border-white/50 bg-black text-white px-2 py-1 text-sm font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue placeholder-white/40"
                        disabled={photo.uploading}
                      />
                      <Button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        disabled={photo.uploading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 text-sm disabled:opacity-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {photos.length === 0 && (
              <p className="text-white/60 text-base italic">
                No photos added yet.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/events")}
              className="border-white text-white hover:bg-white/10 font-semibold uppercase text-lg px-8 py-3"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
              className="bg-ieee-blue hover:bg-ieee-blue/90 text-white font-semibold uppercase text-lg px-8 py-3"
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
