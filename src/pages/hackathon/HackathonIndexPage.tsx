import { Navigate } from "react-router-dom";
import { errorMessage } from "@/api/client";
import { useFeaturedHackathon } from "@/hooks/useHackathons";
import { PublicShell } from "@/components/hackathon/Shells";
import { ButtonLink } from "@/components/hackathon/ui/Button";
import { EmptyState, ErrorState, PageLoader } from "@/components/hackathon/ui/states";
import { CalendarIcon } from "@/components/hackathon/ui/icons";

export default function HackathonIndexPage() {
  const { data: featured, isPending, error, refetch, isFetching } = useFeaturedHackathon();

  if (featured) return <Navigate to={`/hackathon/${featured.slug}`} replace />;

  return (
    <PublicShell>
      {isPending && <PageLoader />}
      {error && (
        <ErrorState
          message={errorMessage(error, "We couldn't check for an open hackathon. Check your connection.")}
          onRetry={() => refetch()}
          retrying={isFetching}
        />
      )}
      {!isPending && !error && (
        <EmptyState
          className="py-16"
          icon={<CalendarIcon />}
          title="No hackathon is open right now"
          description="When the next NU IEEE hackathon is announced, registration will open on this page. In the meantime, take a look at our other events."
          action={
            <ButtonLink to="/events" variant="secondary">
              Browse events
            </ButtonLink>
          }
        />
      )}
    </PublicShell>
  );
}
