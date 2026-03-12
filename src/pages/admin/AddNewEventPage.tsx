import { useForm, Controller } from "react-hook-form";
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

// New imports for the Date/Time Picker Popover
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
  eventDateTime: z.date({
    required_error: "Event date and time is required",
  }),
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
      eventDateTime: undefined,
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

    // 1. Filter out invalid files first
    const validFiles = Array.from(files).filter(isValidFile);

    // 2. Calculate exactly how many slots are left
    const availableSlots = MAX_PHOTOS - photos.length;

    if (validFiles.length > availableSlots) {
      toast.error(`Maximum ${MAX_PHOTOS} photos allowed. Only adding the first ${availableSlots}.`);
    }

    // 3. Slice the array to only allow the permitted amount
    const filesToAdd = validFiles.slice(0, Math.max(0, availableSlots));

    // 4. Create new photo objects synchronously using Object URLs
    const newPhotosToAdd: PhotoUpload[] = filesToAdd.map((file) => ({
      id: generatePhotoId(),
      file,
      preview: URL.createObjectURL(file), // Much faster than FileReader
      alternativeText: "",
      uploading: false,
    }));

    setPhotos((prev) => [...prev, ...newPhotosToAdd]);
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
      const { uploadUrl, fileName } = await minioApi.getUploadUrl(photo.file.name);

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id ? { ...p, uploading: true } : p
        )
      );

      await minioApi.uploadFile(uploadUrl, photo.file);

      const permanentUrl = minioApi.constructPermanentUrl(fileName);

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? { ...p, uploading: false, uploadedUrl: permanentUrl }
            : p
        )
      );

      return permanentUrl;
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to upload photo";
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
          console.error(`Upload failed for photo ${idx}:`, result.reason);
          return null;
        }
      })
      .filter((url): url is string => url !== null);

    const failedUploads = results.some(
      (result) => result.status === "rejected"
    );
    if (failedUploads) {
      throw new Error("Some photos failed to upload. Please retry or remove failed photos.");
    }

    return uploadedUrls;
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const toastId = toast.loading("Processing event...");
    try {
      // Upload photos if any exist
      let uploadedPhotoUrls: string[] = [];
      if (photos.length > 0) {
        toast.loading("Uploading photos...", { id: toastId });
        uploadedPhotoUrls = await uploadAllPhotos();
      }

      const payload: CreateEventCommand = {
        title: values.title,
        description: values.description,
        eventDateTime: values.eventDateTime.toISOString(),
        registrationLink: values.registrationLink || undefined,
        photos: photos.map((photo, idx) => ({
          alternativeText: photo.alternativeText || "",
          photoLink: uploadedPhotoUrls[idx],
        })),
      };

      const created = await eventsApi.createEvent(payload);
      toast.success("Event created", { id: toastId });
      navigate(`/events/${created.id}`);

    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to create event", { id: toastId });
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
            <label className="block text-white text-xl font-inter font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              {...form.register("title")}
              className="w-full rounded-md border-2 border-[#555] hover:border-ieee-blue bg-black text-white px-4 py-3 text-lg font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue placeholder-white/50 transition-colors"
              placeholder="Amazing Engineering Podcast"
            />
            {form.formState.errors.title && (
              <p className="text-red-400 text-m font-semibold">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* DateTime Picker Popover */}
          <div>
            <label className="block text-white text-xl font-inter font-semibold mb-2">
              Event Date & Time
            </label>
            <Controller
              control={form.control}
              name="eventDateTime"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-start text-left rounded-md border-2 border-[#555] hover:border-ieee-blue bg-black text-white px-4 py-3 text-lg font-inter focus:outline-none focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue transition-colors",
                        !field.value && "text-white/50"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 opacity-70" />
                      {field.value ? (
                        format(field.value, "PPP 'at' HH:mm")
                      ) : (
                        <span>Select a date and time</span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border-2 border-[#555] text-white">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (!date) return;
                        if (field.value) {
                          date.setHours(field.value.getHours());
                          date.setMinutes(field.value.getMinutes());
                        }
                        field.onChange(date);
                      }}
                      initialFocus
                      className="bg-black text-white rounded-t-md"
                    />
                    <div className="p-4 border-t-2 border-[#555] bg-black/50 flex flex-col gap-3 rounded-b-md">
                      <span className="text-base font-inter font-semibold text-white">
                        Select Time
                      </span>

                      {/* Native Time Input - Forced 24-hour format with lang="en-GB" */}
                      <input
                        type="time"
                        lang="en-GB"
                        className="w-full rounded-md border-2 border-[#555] hover:border-ieee-blue bg-black text-white px-4 py-3 text-lg font-inter focus:outline-none focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue transition-colors [color-scheme:dark]"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(e) => {
                          const timeStr = e.target.value;
                          const newDate = field.value ? new Date(field.value) : new Date();

                          if (!timeStr) {
                            newDate.setHours(0, 0, 0, 0);
                          } else {
                            const [hours, minutes] = timeStr.split(":").map(Number);
                            newDate.setHours(hours, minutes, 0, 0);
                          }

                          field.onChange(newDate);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            />
            {form.formState.errors.eventDateTime && (
              <p className="text-red-400 text-m font-semibold mt-1">
                {form.formState.errors.eventDateTime.message}
              </p>
            )}
          </div>

          {/* Registration Link */}
          <div>
            <label className="block text-white text-xl font-inter font-semibold mb-2">
              Registration Link (Optional)
            </label>
            <input
              type="url"
              {...form.register("registrationLink")}
              className="w-full rounded-md border-2 border-[#555] hover:border-ieee-blue bg-black text-white px-4 py-3 text-lg font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue placeholder-white/50 transition-colors"
              placeholder="https://"
            />
            {form.formState.errors.registrationLink && (
              <p className="text-red-400 text-m font-semibold">
                {form.formState.errors.registrationLink.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-white text-xl font-inter font-semibold mb-2">
              Description
            </label>
            <textarea
              rows={6}
              {...form.register("description")}
              className="w-full rounded-md border-2 border-[#555] hover:border-ieee-blue bg-black text-white px-4 py-3 text-lg font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue placeholder-white/50 transition-colors"
              placeholder="Describe the event..."
            />
            {form.formState.errors.description && (
              <p className="text-red-400 text-m font-semibold">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Photos */}
          <div>
            <label className="block text-white text-xl font-inter font-semibold mb-2">
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
                  : "border-[#555] bg-black/30 hover:border-ieee-blue"
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
                    className="border-2 border-[#555] rounded-lg overflow-hidden bg-black/50"
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
                        className="w-full rounded-md border border-[#555] hover:border-ieee-blue bg-black text-white px-2 py-1 text-sm font-inter focus:ring-2 focus:ring-ieee-blue focus:border-ieee-blue placeholder-white/40 transition-colors"
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
              onClick={() => navigate("/admin/events")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold uppercase text-lg px-8 py-3 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-ieee-blue hover:bg-ieee-blue/90 text-white font-semibold uppercase text-lg px-8 py-3 transition-colors"
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}