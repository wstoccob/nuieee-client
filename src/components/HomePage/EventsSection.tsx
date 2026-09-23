import { EventCard } from "./EventCard";
import { useEvents } from "@/hooks/useEvents";

const formatEventDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const EventsSection = () => {
  const { data: events = [], isPending } = useEvents(5);

  return (
    <section className="bg-black text-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-8">
          events
        </h2>

        {isPending && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-ieee-blue" />
          </div>
        )}

        {!isPending && events.length > 0 && (
          <div className="flex flex-col items-center space-y-6 mr-auto">
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title || "Untitled Event"}
                date={formatEventDate(event.startsAt)}
                location=""
                link={`/events/${event.id}`}
              />
            ))}
          </div>
        )}

        {!isPending && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70 text-xl">
              No events available yet. Check back soon!
            </p>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <a
            href="/events"
            className="px-8 py-4 bg-ieee-blue hover:bg-ieee-blue/90 text-white font-inter font-bold text-lg uppercase rounded-md transition-all hover:scale-105"
          >
            View All Events
          </a>
        </div>
      </div>
    </section>
  );
};
