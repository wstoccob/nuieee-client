import { useMemo, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { errorMessage } from "@/api/client";
import type { Event } from "@/dtos/event";
import { EventTile, EventTileSkeleton } from "@/components/Event/EventTile";
import { PageHeader, PublicShell } from "@/components/hackathon/Shells";
import { EmptyState, ErrorState } from "@/components/hackathon/ui/states";
import { TabPanel, Tabs, type TabItem } from "@/components/hackathon/ui/Tabs";
import { CalendarIcon } from "@/components/hackathon/ui/icons";

type Filter = "all" | "upcoming" | "past";

const FILTERS: TabItem<Filter>[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
];

const EMPTY_TITLES: Record<Filter, string> = {
  all: "No events yet",
  upcoming: "No upcoming events scheduled",
  past: "No past events",
};

const SKELETON_COUNT = 6;
const startTime = (event: Event) => new Date(event.startsAt).getTime();

function filterEvents(events: Event[], filter: Filter): Event[] {
  const now = Date.now();
  const newestFirst = [...events].sort((a, b) => startTime(b) - startTime(a));
  if (filter === "all") return newestFirst;
  return newestFirst.filter((event) => (filter === "upcoming" ? startTime(event) >= now : startTime(event) < now));
}

export default function EventsListPage() {
  const { data: events = [], isPending, error, refetch, isFetching } = useEvents();
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(() => filterEvents(events, filter), [events, filter]);

  return (
    <PublicShell size="wide">
      <PageHeader
        title="Events"
        description="Workshops, hackathons, talks and networking events for the engineering community at Nazarbayev University."
      />
      <Tabs tabs={FILTERS} value={filter} idPrefix="events" onChange={setFilter} />
      <TabPanel idPrefix="events" id={filter}>
        {error ? (
          <ErrorState
            message={errorMessage(error, "Couldn't load events.")}
            onRetry={() => refetch()}
            retrying={isFetching}
          />
        ) : !isPending && visible.length === 0 ? (
          <EmptyState icon={<CalendarIcon />} title={EMPTY_TITLES[filter]} description="Check back soon for updates." />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isPending
              ? Array.from({ length: SKELETON_COUNT }, (_, i) => <EventTileSkeleton key={i} />)
              : visible.map((event) => <EventTile key={event.id} event={event} />)}
          </ul>
        )}
      </TabPanel>
    </PublicShell>
  );
}
