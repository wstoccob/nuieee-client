import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminHeader from "@/components/Layouts/AdminPageLayout/AdminHeader";
import { Button } from "@/components/ui/button";
import { EventFormField, fieldClassName } from "@/components/AddEvent/EventFormField";
import { PhotoDropzone } from "@/components/AddEvent/PhotoDropzone";
import { usePhotoUploads } from "@/hooks/usePhotoUploads";
import { useCreateEvent } from "@/hooks/useEvents";
import { errorMessage } from "@/api/client";

const schema = z.object({
  title: z.string().min(2, "Title too short").max(200),
  description: z.string().min(10, "Description too short").max(5000),
  startsAt: z.string().min(1, "Event date and time is required"),
  registrationLink: z.union([z.string().url("Invalid URL"), z.literal("")]),
});

type FormValues = z.infer<typeof schema>;

export default function AddNewEventPage() {
  const navigate = useNavigate();
  const createEvent = useCreateEvent();
  const uploads = usePhotoUploads();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      startsAt: "",
      registrationLink: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const toastId = toast.loading("Processing event...");
    try {
      if (uploads.photos.length > 0) {
        toast.loading("Uploading photos...", { id: toastId });
      }
      const photos = await uploads.uploadAll();
      const created = await createEvent.mutateAsync({
        title: values.title,
        description: values.description,
        startsAt: new Date(values.startsAt).toISOString(),
        registrationLink: values.registrationLink || null,
        photos,
      });
      toast.success("Event created", { id: toastId });
      navigate(`/events/${created.id}`);
    } catch (err) {
      toast.error(errorMessage(err, "Failed to create event"), { id: toastId });
    }
  };

  const busy = uploads.uploading || createEvent.isPending;
  const { errors } = form.formState;

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <h1 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-12">
          add new event
        </h1>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-4xl space-y-8 bg-black border-2 border-[#555] rounded-lg shadow-2xl p-8 md:p-12"
        >
          <EventFormField label="Title" error={errors.title?.message}>
            <input
              type="text"
              {...form.register("title")}
              className={fieldClassName}
              placeholder="Amazing Engineering Podcast"
            />
          </EventFormField>

          <EventFormField label="Event Date & Time" error={errors.startsAt?.message}>
            <input
              type="datetime-local"
              {...form.register("startsAt")}
              className={`${fieldClassName} [color-scheme:dark]`}
            />
          </EventFormField>

          <EventFormField
            label="Registration Link (Optional)"
            error={errors.registrationLink?.message}
          >
            <input
              type="url"
              {...form.register("registrationLink")}
              className={fieldClassName}
              placeholder="https://"
            />
          </EventFormField>

          <EventFormField label="Description" error={errors.description?.message}>
            <textarea
              rows={6}
              {...form.register("description")}
              className={fieldClassName}
              placeholder="Describe the event..."
            />
          </EventFormField>

          <PhotoDropzone
            photos={uploads.photos}
            maxPhotos={uploads.MAX_PHOTOS}
            disabled={busy}
            onAdd={uploads.addFiles}
            onRemove={uploads.removePhoto}
            onAltTextChange={uploads.setAltText}
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={busy}
              className="bg-ieee-blue hover:bg-ieee-blue/90 text-white font-semibold text-lg px-8 py-6 h-auto rounded-md uppercase"
            >
              {uploads.uploading
                ? "Uploading photos..."
                : createEvent.isPending
                  ? "Creating..."
                  : "Create Event"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => navigate("/admin/events")}
              className="border-[#555] text-black font-semibold text-lg px-8 py-6 h-auto rounded-md uppercase"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
