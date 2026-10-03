import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminHeader from "@/components/Layouts/AdminPageLayout/AdminHeader";
import { EventForm } from "@/components/AddEvent/EventForm";
import {
  eventFormSchema,
  type EventFormValues,
} from "@/components/AddEvent/eventFormSchema";
import { usePhotoUploads } from "@/hooks/usePhotoUploads";
import { useCreateEvent } from "@/hooks/useEvents";
import { errorMessage } from "@/api/client";
import { fromDatetimeLocal } from "@/lib/eventDateTime";

export default function AddNewEventPage() {
  const navigate = useNavigate();
  const createEvent = useCreateEvent();
  const uploads = usePhotoUploads();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startsAt: "",
      registrationLink: "",
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    const toastId = toast.loading("Processing event...");
    try {
      if (uploads.photos.length > 0) {
        toast.loading("Uploading photos...", { id: toastId });
      }
      const photos = await uploads.uploadAll();
      const created = await createEvent.mutateAsync({
        title: values.title,
        description: values.description,
        startsAt: fromDatetimeLocal(values.startsAt),
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
  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <h1 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-12">
          add new event
        </h1>

        <EventForm
          form={form}
          onSubmit={onSubmit}
          photos={uploads.photos}
          maxPhotos={uploads.MAX_PHOTOS}
          busy={busy}
          uploading={uploads.uploading}
          saving={createEvent.isPending}
          submitLabel="Create Event"
          savingLabel="Creating..."
          onAddPhotos={uploads.addFiles}
          onRemovePhoto={uploads.removePhoto}
          onAltTextChange={uploads.setAltText}
          onCancel={() => navigate("/admin/events")}
        />
      </div>
    </div>
  );
}
