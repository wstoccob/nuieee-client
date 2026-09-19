import type { Event } from "@/dtos/event";
const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
import ieeeSmallBlueIcon from "@/assets/icons/ieee_small_blue_icon.svg";
import { Button } from "@/components/ui/button";

interface Props {
  event: Event;
}

export const BaseEventPage: React.FC<Props> = ({ event }) => {
  return (
    <section className="bg-black text-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Event Title Section */}
        <div className="mb-12">
          <h1 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-6">
            {event.title || "Untitled Event"}
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <img src={ieeeSmallBlueIcon} alt="IEEE" className="w-12 h-12 md:w-16 md:h-16" />
            <p className="text-white text-[clamp(18px,2.5vw,30px)] font-inter font-semibold">
              {formatDateTime(event.startsAt)}
            </p>
          </div>
          {event.registrationLink && (
            <div className="mb-8">
              <Button asChild className="bg-ieee-blue hover:bg-ieee-blue/90 text-white font-semibold text-lg px-8 py-6 h-auto rounded-md uppercase">
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="max-w-7xl mb-16">
          <h2 className="text-[clamp(40px,6vw,60px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-6">
            about this event
          </h2>
          <p className="text-[clamp(18px,2.5vw,30px)] font-inter font-semibold leading-[1.2] text-white whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

        {/* Gallery */}
        {event.photos && event.photos.length > 0 && (
          <div>
            <h2 className="text-[clamp(40px,6vw,60px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-8">
              gallery
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {event.photos.map(p => (
                <figure
                  key={p.id}
                  className="bg-black rounded-lg overflow-hidden border-2 border-white hover:border-ieee-blue transition-colors duration-300"
                >
                  {p.photoUrl && (
                    <img
                      src={p.photoUrl}
                      alt={p.altText || "Event photo"}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  {p.altText && (
                    <figcaption className="text-white/80 text-sm font-inter p-3">
                      {p.altText}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
