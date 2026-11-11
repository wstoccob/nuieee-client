import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "@/hooks/useEvents";
import { errorMessage } from "@/api/client";
import { BaseEventPage } from "@/components/Event/BaseEventPage";
import { PublicShell } from "@/components/hackathon/Shells";
import { ErrorState, PageLoader } from "@/components/hackathon/ui/states";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isPending, error, refetch, isFetching } = useEvent(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <PublicShell size="wide">
      {isPending && <PageLoader label="Loading event…" />}
      {error && (
        <ErrorState
          message={errorMessage(error, "Couldn't load this event.")}
          onRetry={() => refetch()}
          retrying={isFetching}
        />
      )}
      {event && <BaseEventPage event={event} />}
    </PublicShell>
  );
}
