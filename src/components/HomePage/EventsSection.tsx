import { useEffect, useState } from 'react';
import { EventCard } from './EventCard';
import eventsApi from '@/api/eventsApi';
import type { EventDto } from '@/dtos/Events/EventDto';

const formatEventDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const EventsSection = () => {
    const [events, setEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchEvents = async () => {
             try {
                 setLoading(true);
                 const data = await eventsApi.getLastEvents(5);
                 setEvents(data);
             } catch (error) {
                 console.error('Failed to load events:', error);
             } finally {
                 setLoading(false);
             }
        };
        fetchEvents();
    }, []);

    return (
        <section className="bg-black text-white py-16 lg:py-24">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <h2 className="text-[clamp(50px,7vw,83px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-8">
                    events
                </h2>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-ieee-blue" />
                    </div>
                )}

                {/* Events Grid */}
                {!loading && events.length > 0 && (
                    <div className="flex flex-col items-center space-y-6 mr-auto">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                title={event.title || 'Untitled Event'}
                                date={formatEventDate(event.eventDateTime)}
                                location="" // No location in event model
                                link={`/events/${event.id}`}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && events.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white/70 text-xl">No events available yet. Check back soon!</p>
                    </div>
                )}

                {/* View All Events Button */}
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
