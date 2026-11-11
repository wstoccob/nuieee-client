import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EventListItem } from "@/components/AdminEvents/EventListItem";
import { AdminShell, PageHeader } from "@/components/hackathon/Shells";
import { ButtonLink } from "@/components/hackathon/ui/Button";
import { ConfirmDialog } from "@/components/hackathon/ui/Dialog";
import { EmptyState, ErrorState, PageLoader } from "@/components/hackathon/ui/states";
import { CalendarIcon, PlusIcon } from "@/components/hackathon/ui/icons";
import { useDeleteEvent, useEvents } from "@/hooks/useEvents";
import { errorMessage } from "@/api/client";

const NEW_EVENT_PATH = "/admin/events/addNewEvent";

export default function AdminEventsPage() {
  const { data: events = [], isPending, error, refetch, isFetching } = useEvents();
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
    <AdminShell>
      <PageHeader
        title="Events"
        description="Manage NU IEEE events and activities."
        actions={
          <ButtonLink to={NEW_EVENT_PATH}>
            <PlusIcon />
            New event
          </ButtonLink>
        }
      />

      {isPending && <PageLoader label="Loading events…" />}
      {error && (
        <ErrorState message={errorMessage(error, "Couldn't load events.")} onRetry={() => refetch()} retrying={isFetching} />
      )}
      {!isPending && !error && sorted.length === 0 && (
        <EmptyState
          icon={<CalendarIcon />}
          title="No events yet"
          description="Events you create appear on the public Events page."
          action={<ButtonLink to={NEW_EVENT_PATH}>Create your first event</ButtonLink>}
        />
      )}

      {sorted.length > 0 && (
        <ul className="space-y-3">
          {sorted.map((event) => (
            <EventListItem
              key={event.id}
              event={event}
              onDelete={setConfirmId}
              deleting={deleteEvent.isPending && deleteEvent.variables === event.id}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        busy={deleteEvent.isPending}
        onClose={() => setConfirmId(null)}
        onConfirm={confirmDelete}
      />
    </AdminShell>
  );
}
