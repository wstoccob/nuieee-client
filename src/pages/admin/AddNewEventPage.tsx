import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PhotoDropzone } from "@/components/AddEvent/PhotoDropzone";
import { AdminShell, BackLink, PageHeader } from "@/components/hackathon/Shells";
import { Button } from "@/components/hackathon/ui/Button";
import { Card } from "@/components/hackathon/ui/Card";
import { Field, Input, Textarea } from "@/components/hackathon/ui/form";
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
    <AdminShell>
      <BackLink to="/admin/events">All events</BackLink>
      <PageHeader title="New event" description="It appears on the public Events page as soon as you create it." />

      <Card className="max-w-3xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Field label="Title" error={errors.title?.message}>
            {(control) => (
              <Input {...control} type="text" placeholder="Amazing Engineering Podcast" {...form.register("title")} />
            )}
          </Field>

          <Field label="Date and time" error={errors.startsAt?.message}>
            {(control) => <Input {...control} type="datetime-local" {...form.register("startsAt")} />}
          </Field>

          <Field label="Registration link" optional error={errors.registrationLink?.message}>
            {(control) => (
              <Input {...control} type="url" placeholder="https://" {...form.register("registrationLink")} />
            )}
          </Field>

          <Field label="Description" error={errors.description?.message}>
            {(control) => (
              <Textarea {...control} rows={6} placeholder="Describe the event…" {...form.register("description")} />
            )}
          </Field>

          <PhotoDropzone
            photos={uploads.photos}
            maxPhotos={uploads.MAX_PHOTOS}
            disabled={busy}
            onAdd={uploads.addFiles}
            onRemove={uploads.removePhoto}
            onAltTextChange={uploads.setAltText}
          />

          <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={busy} onClick={() => navigate("/admin/events")}>
              Cancel
            </Button>
            <Button type="submit" loading={busy}>
              {uploads.uploading ? "Uploading photos…" : createEvent.isPending ? "Creating…" : "Create event"}
            </Button>
          </div>
        </form>
      </Card>
    </AdminShell>
  );
}
