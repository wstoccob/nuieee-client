import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { formatDate } from "@/lib/datetime";
import type { Event } from "@/dtos/event";
import ieeeSmallBlueIcon from "@/assets/icons/ieee_small_blue_icon.svg";
import { ArrowRightIcon } from "@/components/hackathon/ui/icons";
import { focusRing } from "@/components/hackathon/ui/styles";

const EVENT_COUNT = 6;
// Phones show fewer so the page stays short; "All events" covers the rest.
const PHONE_EVENT_COUNT = 3;

function EventTile({ event, phoneHidden }: { event: Event; phoneHidden: boolean }) {
  const cover = event.photos[0];
  return (
    <li className={phoneHidden ? "hidden sm:block" : undefined}>
      <Link
        to={`/events/${event.id}`}
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20 ${focusRing}`}
      >
        <div className="aspect-[16/10] overflow-hidden bg-hk-accent/10">
          {cover ? (
            <img
              src={cover.photoUrl}
              alt={cover.altText || ""}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          ) : (
            <div className="grid size-full place-items-center">
              <img src={ieeeSmallBlueIcon} alt="" className="size-14 opacity-50" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <time dateTime={event.startsAt} className="text-sm font-medium text-hk-accent-fg">
            {formatDate(event.startsAt)}
          </time>
          <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-white">{event.title}</h3>
          {event.description && <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{event.description}</p>}
        </div>
      </Link>
    </li>
  );
}

function TileSkeleton({ phoneHidden }: { phoneHidden: boolean }) {
  return (
    <li aria-hidden="true" className={`${phoneHidden ? "hidden sm:block" : ""} overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]`}>
      <div className="aspect-[16/10] animate-pulse bg-white/[0.05] motion-reduce:animate-none" />
      <div className="space-y-2 p-5">
        <div className="h-4 w-20 rounded bg-white/[0.06]" />
        <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
      </div>
    </li>
  );
}

export const EventsSection = () => {
  const { data: events = [], isPending, isError } = useEvents(EVENT_COUNT);

  return (
    <section aria-labelledby="events-title" className="py-12 sm:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="events-title" className="text-2xl font-semibold text-white sm:text-3xl">
            Events
          </h2>
          <p className="mt-2 text-zinc-400">What we have been up to lately.</p>
        </div>
        <Link
          to="/events"
          className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg text-sm font-medium text-hk-accent-fg hover:text-white ${focusRing}`}
        >
          All events
          <ArrowRightIcon />
        </Link>
      </div>

      {isError ? (
        <p className="mt-8 text-zinc-400">Couldn't load events right now. Please try again later.</p>
      ) : !isPending && events.length === 0 ? (
        <p className="mt-8 text-zinc-400">No events yet. Check back soon.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: EVENT_COUNT }, (_, i) => <TileSkeleton key={i} phoneHidden={i >= PHONE_EVENT_COUNT} />)
            : events.map((event, i) => <EventTile key={event.id} event={event} phoneHidden={i >= PHONE_EVENT_COUNT} />)}
        </ul>
      )}
    </section>
  );
};
