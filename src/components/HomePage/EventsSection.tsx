import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { EventTile, EventTileSkeleton } from "@/components/Event/EventTile";
import { ArrowRightIcon } from "@/components/hackathon/ui/icons";
import { focusRing } from "@/components/hackathon/ui/styles";

const EVENT_COUNT = 6;
// Phones show fewer so the page stays short; "All events" covers the rest.
const PHONE_EVENT_COUNT = 3;

const phoneHidden = (index: number) => (index >= PHONE_EVENT_COUNT ? "hidden sm:block" : undefined);

export const EventsSection = () => {
  const { data: events = [], isPending, isError } = useEvents(EVENT_COUNT);

  return (
    <section aria-labelledby="events-title" className="border-t border-white/10 py-12 sm:py-16">
      <div className="reveal flex items-end justify-between gap-4">
        <div>
          <h2 id="events-title" className="text-2xl font-semibold text-white sm:text-3xl">
            Events
          </h2>
          <p className="mt-2 text-zinc-400">What we have been up to lately.</p>
        </div>
        <Link
          to="/events"
          className={`group/all inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg text-sm font-medium text-hk-accent-fg transition-colors hover:text-white ${focusRing}`}
        >
          All events
          <ArrowRightIcon className="transition-transform duration-200 group-hover/all:translate-x-1 motion-reduce:transition-none" />
        </Link>
      </div>

      {isError ? (
        <p className="mt-8 text-zinc-400">Couldn't load events right now. Please try again later.</p>
      ) : !isPending && events.length === 0 ? (
        <p className="mt-8 text-zinc-400">No events yet. Check back soon.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: EVENT_COUNT }, (_, i) => <EventTileSkeleton key={i} className={phoneHidden(i)} />)
            : events.map((event, i) => <EventTile key={event.id} event={event} className={phoneHidden(i)} />)}
        </ul>
      )}
    </section>
  );
};
