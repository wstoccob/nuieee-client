import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { EventFormField, fieldClassName } from "./EventFormField";
import { PhotoDropzone, type PhotoPreview } from "./PhotoDropzone";
import type { EventFormValues } from "./eventFormSchema";

interface Props {
  form: UseFormReturn<EventFormValues>;
  onSubmit: SubmitHandler<EventFormValues>;
  photos: PhotoPreview[];
  maxPhotos: number;
  busy: boolean;
  uploading: boolean;
  saving: boolean;
  submitLabel: string;
  savingLabel: string;
  onAddPhotos: (files: FileList | null) => void;
  onRemovePhoto: (id: string) => void;
  onAltTextChange: (id: string, text: string) => void;
  onCancel: () => void;
}

export function EventForm({
  form,
  onSubmit,
  photos,
  maxPhotos,
  busy,
  uploading,
  saving,
  submitLabel,
  savingLabel,
  onAddPhotos,
  onRemovePhoto,
  onAltTextChange,
  onCancel,
}: Props) {
  const { errors } = form.formState;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-4xl space-y-8 bg-black border-2 border-[#555] rounded-lg shadow-2xl p-8 md:p-12"
    >
      <EventFormField htmlFor="event-title" label="Title" error={errors.title?.message}>
        <input
          id="event-title"
          type="text"
          {...form.register("title")}
          className={fieldClassName}
          placeholder="Amazing Engineering Podcast"
        />
      </EventFormField>

      <EventFormField
        htmlFor="event-starts-at"
        label="Event Date & Time"
        error={errors.startsAt?.message}
      >
        <input
          id="event-starts-at"
          type="datetime-local"
          step="0.001"
          {...form.register("startsAt")}
          className={`${fieldClassName} [color-scheme:dark]`}
        />
      </EventFormField>

      <EventFormField
        htmlFor="event-registration-link"
        label="Registration Link (Optional)"
        error={errors.registrationLink?.message}
      >
        <input
          id="event-registration-link"
          type="url"
          {...form.register("registrationLink")}
          className={fieldClassName}
          placeholder="https://"
        />
      </EventFormField>

      <EventFormField
        htmlFor="event-description"
        label="Description"
        error={errors.description?.message}
      >
        <textarea
          id="event-description"
          rows={6}
          {...form.register("description")}
          className={fieldClassName}
          placeholder="Describe the event..."
        />
      </EventFormField>

      <PhotoDropzone
        photos={photos}
        maxPhotos={maxPhotos}
        disabled={busy}
        onAdd={onAddPhotos}
        onRemove={onRemovePhoto}
        onAltTextChange={onAltTextChange}
      />

      <div className="flex flex-wrap gap-4">
        <Button
          type="submit"
          disabled={busy}
          className="bg-ieee-blue hover:bg-ieee-blue/90 text-white font-semibold text-lg px-8 py-6 h-auto rounded-md uppercase"
        >
          {uploading ? "Uploading photos..." : saving ? savingLabel : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={onCancel}
          className="border-[#555] text-black font-semibold text-lg px-8 py-6 h-auto rounded-md uppercase"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
