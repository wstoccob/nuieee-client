import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "@/hooks/useEvents";
import { errorMessage } from "@/api/client";
import { BaseEventPage } from "@/components/Event/BaseEventPage";
import { EventsError, EventsSpinner } from "@/components/Event/EventsState";
import { MainLayout } from "@/components/Layouts/MainLayout/MainLayout";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isPending, error } = useEvent(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-black">
        {isPending && <EventsSpinner />}
        {error && (
          <div className="container mx-auto px-4 py-16">
            <EventsError message={errorMessage(error, "Failed to load event")} />
          </div>
        )}
        {event && <BaseEventPage event={event} />}
      </div>
    </MainLayout>
  );
}
