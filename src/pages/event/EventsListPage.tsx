import { useEffect, useState } from "react";
import { MainLayout } from "@/components/Layouts/MainLayout/MainLayout";
import eventsApi from "@/api/eventsApi";
import type { EventDto } from "@/dtos/Events/EventDto";
import { EventPreviewCard } from "@/components/Event/EventPreviewCard";

export default function EventsListPage() {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsApi.getEvents();
        // Sort by date descending (newest first)
        const sorted = [...data].sort(
          (a, b) => new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime()
        );
        setEvents(sorted);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDateTime);
    if (filter === "upcoming") return eventDate >= now;
    if (filter === "past") return eventDate < now;
    return true;
  });

  return (
    <MainLayout>
      <section className="bg-black text-white py-16 lg:py-24 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-6">
              events
            </h1>
            <p className="text-white text-[clamp(18px,2.5vw,30px)] font-inter font-semibold leading-[1.2] max-w-4xl">
              Discover our upcoming workshops, hackathons, talks, and networking events designed to inspire and connect the engineering community at Nazarbayev University.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 font-inter font-semibold uppercase text-sm md:text-base rounded-md border-2 transition-all ${
                filter === "all"
                  ? "bg-ieee-blue border-ieee-blue text-white"
                  : "bg-transparent border-white text-white hover:border-ieee-blue hover:text-ieee-blue"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-6 py-3 font-inter font-semibold uppercase text-sm md:text-base rounded-md border-2 transition-all ${
                filter === "upcoming"
                  ? "bg-ieee-blue border-ieee-blue text-white"
                  : "bg-transparent border-white text-white hover:border-ieee-blue hover:text-ieee-blue"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-6 py-3 font-inter font-semibold uppercase text-sm md:text-base rounded-md border-2 transition-all ${
                filter === "past"
                  ? "bg-ieee-blue border-ieee-blue text-white"
                  : "bg-transparent border-white text-white hover:border-ieee-blue hover:text-ieee-blue"
              }`}
            >
              Past Events
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ieee-blue" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-900/30 border-2 border-red-500 text-red-400 p-8 rounded-lg mb-8">
              <h3 className="text-2xl font-bold mb-2">Error Loading Events</h3>
              <p className="text-lg">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-32 border-2 border-dashed border-white/30 rounded-lg">
              <p className="text-white text-2xl font-inter font-bold mb-4">
                {filter === "upcoming" && "No upcoming events scheduled."}
                {filter === "past" && "No past events found."}
                {filter === "all" && "No events available yet."}
              </p>
              <p className="text-white/60 text-lg">Check back soon for updates!</p>
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventPreviewCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}