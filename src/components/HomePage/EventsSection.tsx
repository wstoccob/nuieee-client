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

   const dummyEvents: EventDto[] = [
    {
        id: "1",
        title: "IEEE SPEED DATING",
        eventDateTime: "2026-02-16T00:00:00Z",
        description: "",
        hasRegistrationLink: false,  // Add this
        // Add any other required fields like:
        // registrationLink?: string,
        // location?: string,
        // imageUrl?: string,
    },
    {
        id: "2",
        title: "MINECRAFT REDSTONE COMPETITION",
        eventDateTime: "2026-02-07T00:00:00Z",
        description: "",
        hasRegistrationLink: false,
    },
    {
        id: "3",
        title: "ERASMUS MUNDUS EMIMEP WEBINAR",
        eventDateTime: "2026-02-04T00:00:00Z",
        description: "",
        hasRegistrationLink: false,
    },
    {
        id: "4",
        title: "INFO SESSION: ELECTRICAL & COMPUTER ENGINEERING (ELCE)",
        eventDateTime: "2026-01-26T00:00:00Z",
        description: "",
        hasRegistrationLink: false,
    },
    {
        id: "5",
        title: "RESEARCH ASSISTANT TALKS",
        eventDateTime: "2025-10-27T00:00:00Z",
        description: "",
        hasRegistrationLink: false,
    }
];
    // Then in your component, temporarily replace the API call:
    useEffect(() => {
        // Comment out API call and use dummy data
        setEvents(dummyEvents);
        setLoading(false);
        
        // Original API call (comment out for testing)
        // const fetchEvents = async () => {
        //     try {
        //         setLoading(true);
        //         const data = await eventsApi.getLastEvents(5);
        //         setEvents(data);
        //     } catch (error) {
        //         console.error('Failed to load events:', error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchEvents();
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
