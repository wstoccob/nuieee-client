import {EventCard} from './EventCard';

export const EventsSection = () => {
    const events = [
        {
            title: "AVENGINEERS",
            date: "28.03.2025",
            location: "NU LIBRARY",
            link: "/events"
        },
        {
            title: "HACKATHON",
            date: "03.11.2024",
            location: "NAZARBAYEV UNIVERSITY",
            link: "/hackathon"
        },
        {
            title: "PODCASTS",
            date: "XX.XX.2024",
            location: "NAZARBAYEV UNIVERSITY",
            link: "/events"
        },
        {
            title: "RA TALKS",
            date: "XX.XX.2024",
            location: "NAZARBAYEV UNIVERSITY",
            link: "/events"
        },
        {
            title: "ARDUINO WORKSHOP",
            date: "XX.XX.2024",
            location: "NAZARBAYEV UNIVERSITY",
            link: "/events"
        },
        {
            title: "FIELD TRIP TO GHALAM",
            date: "XX.XX.2024",
            location: "KABANBAY BATYRA",
            link: "/events"
        }
    ];

    return (
        <section className="bg-black text-white py-16 lg:py-24">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <h2 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-8">
                    events
                </h2>

                {/* Events Grid */}
                <div className="flex flex-col items-center space-y-6 mr-auto">
                    {events.map((event, index) => (
                        <EventCard
                            key={index}
                            title={event.title}
                            date={event.date}
                            location={event.location}
                            link={event.link}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
