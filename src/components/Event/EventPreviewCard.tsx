import { useNavigate } from "react-router-dom";
import type { EventDto } from "@/dtos/Events/EventDto";
import ieeeSmallBlueIcon from "@/assets/icons/ieee_small_blue_icon.svg";

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

interface Props {
  event: EventDto;
}

export const EventPreviewCard: React.FC<Props> = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  const truncateDescription = (text: string | null | undefined, maxLength: number = 150) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Get first photo for preview
  const previewPhoto = event.photos && event.photos.length > 0 ? event.photos[0] : null;

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-black border-2 border-white rounded-lg overflow-hidden hover:border-ieee-blue transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Image Section */}
      {previewPhoto?.photoLink ? (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={previewPhoto.photoLink}
            alt={previewPhoto.alternativeText || event.title || "Event"}
            className="w-full h-77 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/57 to-transparent" />
          {/* IEEE Icon Overlay */}
          <div className="absolute top-4 right-4">
            <img src={ieeeSmallBlueIcon} alt="IEEE" className="w-12 h-12 opacity-90" />
          </div>
        </div>
      ) : (
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-ieee-blue/20 to-black flex items-center justify-center">
          <img src={ieeeSmallBlueIcon} alt="IEEE" className="w-24 h-24 opacity-40" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 md:p-8">
        {/* Date */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-ieee-blue rounded-full"></div>
          <p className="text-ieee-blue text-sm md:text-base font-semibold uppercase tracking-wide">
            {formatDateTime(event.eventDateTime)}
          </p>
        </div>

        {/* Title */}
        <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-inter font-bold uppercase mb-4 line-clamp-2 group-hover:text-ieee-blue transition-colors">
          {event.title || "Untitled Event"}
        </h3>

        {/* Description */}
        <p className="text-white/70 text-base md:text-lg font-inter leading-relaxed mb-6 line-clamp-3">
          {truncateDescription(event.description, 180)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <span className="text-ieee-blue font-semibold uppercase text-sm tracking-wider group-hover:underline">
            Explore More →
          </span>
          {event.hasRegistrationLink && (
            <span className="px-3 py-1 bg-ieee-blue/20 border border-ieee-blue text-ieee-blue text-xs font-bold uppercase rounded">
              Registration Open
            </span>
          )}
        </div>
      </div>
    </div>
  );
};