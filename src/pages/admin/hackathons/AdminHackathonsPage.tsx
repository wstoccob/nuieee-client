import { Link } from "react-router-dom";
import { errorMessage } from "@/api/client";
import { useAdminHackathons } from "@/hooks/useHackathonAdmin";
import { formatDateRange, formatDateTimeRange } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import type { BigEventAdmin } from "@/dtos/hackathon";
import { AdminShell, PageHeader } from "@/components/hackathon/Shells";
import { EventBadges } from "@/components/hackathon/admin/EventBadges";
import { ButtonLink } from "@/components/hackathon/ui/Button";
import { EmptyState, ErrorState, PageLoader } from "@/components/hackathon/ui/states";
import { CalendarIcon, PlusIcon } from "@/components/hackathon/ui/icons";
import { focusRing } from "@/components/hackathon/ui/styles";

function EventRow({ event }: { event: BigEventAdmin }) {
  return (
    <li>
      <Link
        to={`/admin/hackathons/${event.id}`}
        className={cn(
          "flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05] sm:flex-row sm:items-center sm:justify-between sm:p-5",
          focusRing
        )}
      >
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-white">{event.title}</h2>
            <EventBadges event={event} />
          </div>
          <p className="font-mono text-xs text-zinc-500">/hackathon/{event.slug}</p>
          <dl className="grid gap-1 text-sm text-zinc-400 sm:grid-cols-[auto_1fr] sm:gap-x-3">
            <dt className="text-zinc-500">Event</dt>
            <dd>{formatDateRange(event.startsAt, event.endsAt)}</dd>
            <dt className="text-zinc-500">Registration</dt>
            <dd>{formatDateTimeRange(event.registrationOpensAt, event.registrationClosesAt)}</dd>
          </dl>
        </div>
        <div className="flex shrink-0 items-baseline gap-1.5 sm:flex-col sm:items-end sm:gap-0">
          <span className="text-2xl font-semibold text-white tabular-nums">{event.teamCount}</span>
          <span className="text-sm text-zinc-500">
            {event.capacity ? `of ${event.capacity} teams` : event.teamCount === 1 ? "team" : "teams"}
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function AdminHackathonsPage() {
  const { data: events, isPending, error, refetch, isFetching } = useAdminHackathons();
  const sorted = [...(events ?? [])].sort((a, b) => b.startsAt.localeCompare(a.startsAt));

  return (
    <AdminShell>
      <PageHeader
        title="Hackathons"
        description="Create events, publish them and follow team registrations."
        actions={
          <ButtonLink to="/admin/hackathons/new">
            <PlusIcon />
            New hackathon
          </ButtonLink>
        }
      />
      {isPending && <PageLoader label="Loading hackathons…" />}
      {error && (
        <ErrorState message={errorMessage(error, "Couldn't load the hackathons.")} onRetry={() => refetch()} retrying={isFetching} />
      )}
      {events && sorted.length === 0 && (
        <EmptyState
          icon={<CalendarIcon />}
          title="No hackathons yet"
          description="Create one to open registration. It stays a draft until you publish it."
          action={<ButtonLink to="/admin/hackathons/new">Create a hackathon</ButtonLink>}
        />
      )}
      {sorted.length > 0 && (
        <ul className="space-y-3">
          {sorted.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
