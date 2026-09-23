import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminHeader from "@/components/Layouts/AdminPageLayout/AdminHeader";
import { EventListItem } from "@/components/AdminEvents/EventListItem";
import { EventsError, EventsSpinner } from "@/components/Event/EventsState";
import { ConfirmDialog } from "@/components/AdminEvents/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useDeleteEvent, useEvents } from "@/hooks/useEvents";
import { errorMessage } from "@/api/client";

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const { data: events = [], isPending, error } = useEvents();
  const deleteEvent = useDeleteEvent();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      ),
    [events]
  );

  const confirmDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteEvent.mutateAsync(confirmId);
      toast.success("Event deleted");
    } catch (err) {
      toast.error(errorMessage(err, "Delete failed"));
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none">
              events
            </h1>
            <p className="text-white text-[clamp(16px,2vw,24px)] font-inter font-semibold mt-4">
              Manage NU IEEE events and activities
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/events/addNewEvent")}
            className="bg-ieee-blue hover:bg-ieee-blue/90 text-white font-semibold text-lg px-8 py-6 h-auto rounded-md uppercase"
          >
            Add New Event
          </Button>
        </div>

        {isPending && <EventsSpinner />}
        {error && <EventsError message={errorMessage(error, "Failed to load events")} />}

        {!isPending && !error && sorted.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-ieee-blue/30 rounded-lg bg-black">
            <p className="text-white text-2xl font-inter font-bold mb-6">No events yet.</p>
            <Button
              onClick={() => navigate("/admin/events/addNewEvent")}
              className="bg-ieee-blue hover:bg-ieee-blue/90 text-white font-semibold px-6 py-3"
            >
              Create your first event
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {sorted.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onDelete={setConfirmId}
              deleting={deleteEvent.isPending && deleteEvent.variables === event.id}
            />
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel={deleteEvent.isPending ? "Deleting..." : "Delete"}
        busy={deleteEvent.isPending}
        onCancel={() => setConfirmId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
