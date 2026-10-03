import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { errorMessage } from "@/api/client";
import { EventForm } from "@/components/AddEvent/EventForm";
import {
  eventFormSchema,
  type EventFormValues,
} from "@/components/AddEvent/eventFormSchema";
import type { PhotoPreview } from "@/components/AddEvent/PhotoDropzone";
import { EventsError, EventsSpinner } from "@/components/Event/EventsState";
import AdminHeader from "@/components/Layouts/AdminPageLayout/AdminHeader";
import type { EventPhoto } from "@/dtos/event";
import { useEvent, useUpdateEvent } from "@/hooks/useEvents";
import { usePhotoUploads } from "@/hooks/usePhotoUploads";
import { fromDatetimeLocal, toDatetimeLocal } from "@/lib/eventDateTime";

const EXISTING_PREFIX = "existing:";
const NEW_PREFIX = "new:";

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const eventQuery = useEvent(id);
  const updateEvent = useUpdateEvent();
  const [existingPhotos, setExistingPhotos] = useState<EventPhoto[]>([]);
  const [initializedId, setInitializedId] = useState<string | null>(null);
  const uploads = usePhotoUploads(existingPhotos.length);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startsAt: "",
      registrationLink: "",
    },
  });

  useEffect(() => {
    const event = eventQuery.data;
    if (!event || initializedId === event.id) return;

    form.reset({
      title: event.title,
      description: event.description,
      startsAt: toDatetimeLocal(event.startsAt),
      registrationLink: event.registrationLink ?? "",
    });
    setExistingPhotos(event.photos);
    setInitializedId(event.id);
  }, [eventQuery.data, form, initializedId]);

  const photos = useMemo<PhotoPreview[]>(
    () => [
      ...existingPhotos.map((photo) => ({
        id: `${EXISTING_PREFIX}${photo.id}`,
        preview: photo.photoUrl,
        altText: photo.altText,
        name: "existing event photo",
      })),
      ...uploads.photos.map((photo) => ({
        ...photo,
        id: `${NEW_PREFIX}${photo.id}`,
      })),
    ],
    [existingPhotos, uploads.photos]
  );

  const removePhoto = (photoId: string) => {
    if (photoId.startsWith(EXISTING_PREFIX)) {
      const idToRemove = photoId.slice(EXISTING_PREFIX.length);
      setExistingPhotos((current) => current.filter((photo) => photo.id !== idToRemove));
      return;
    }
    uploads.removePhoto(photoId.slice(NEW_PREFIX.length));
  };

  const changeAltText = (photoId: string, altText: string) => {
    if (photoId.startsWith(EXISTING_PREFIX)) {
      const idToUpdate = photoId.slice(EXISTING_PREFIX.length);
      setExistingPhotos((current) =>
        current.map((photo) =>
          photo.id === idToUpdate ? { ...photo, altText } : photo
        )
      );
      return;
    }
    uploads.setAltText(photoId.slice(NEW_PREFIX.length), altText);
  };

  const onSubmit = async (values: EventFormValues) => {
    if (!id) return;

    const toastId = toast.loading("Processing event...");
    try {
      if (uploads.photos.length > 0) {
        toast.loading("Uploading photos...", { id: toastId });
      }
      const newPhotos = await uploads.uploadAll();
      await updateEvent.mutateAsync({
        id,
        payload: {
          title: values.title,
          description: values.description,
          startsAt: fromDatetimeLocal(values.startsAt),
          registrationLink: values.registrationLink || null,
          photos: [
            ...existingPhotos.map(({ photoUrl, altText }) => ({ photoUrl, altText })),
            ...newPhotos,
          ],
        },
      });
      toast.success("Event updated", { id: toastId });
      navigate("/admin/events");
    } catch (err) {
      toast.error(errorMessage(err, "Failed to update event"), { id: toastId });
    }
  };

  const busy = uploads.uploading || updateEvent.isPending;

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <h1 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-12">
          edit event
        </h1>

        {eventQuery.isPending && <EventsSpinner />}
        {eventQuery.error && (
          <EventsError message={errorMessage(eventQuery.error, "Failed to load event")} />
        )}
        {eventQuery.data && initializedId === eventQuery.data.id && (
          <EventForm
            form={form}
            onSubmit={onSubmit}
            photos={photos}
            maxPhotos={uploads.MAX_PHOTOS}
            busy={busy}
            uploading={uploads.uploading}
            saving={updateEvent.isPending}
            submitLabel="Save Changes"
            savingLabel="Saving..."
            onAddPhotos={uploads.addFiles}
            onRemovePhoto={removePhoto}
            onAltTextChange={changeAltText}
            onCancel={() => navigate("/admin/events")}
          />
        )}
      </div>
    </div>
  );
}
