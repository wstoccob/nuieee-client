import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import type { Event } from "@/dtos/event";
// Lightweight date formatting (avoid extra dependency)
const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

interface Props {
  event: Event;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

export const EventListItem: React.FC<Props> = ({ event, onDelete, deleting }) => {
  const navigate = useNavigate();

  const handleOpen = () => navigate(`/events/${event.id}`);
  const handleDelete = () => onDelete(event.id);

  return (
    <div className="group rounded-lg border-2 border-white bg-black p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center hover:border-ieee-blue transition-all duration-300">
      <div className="flex-1 min-w-0">
        <h3 className="text-[clamp(24px,3vw,35px)] font-inter font-semibold text-white mb-2 uppercase">
          {event.title || "Untitled Event"}
        </h3>
        <p className="text-ieee-blue text-lg md:text-xl font-semibold mb-3">
          {formatDateTime(event.startsAt)}
        </p>
        {event.description && (
          <p className="text-white/80 text-base md:text-lg line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 md:flex-col md:gap-4">
        <Button 
          variant="outline" 
          onClick={handleOpen}
          className="border-ieee-blue text-ieee-blue hover:bg-ieee-blue hover:text-white font-semibold uppercase px-6 py-2"
        >
          View
        </Button>
        <Button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold uppercase px-6 py-2"
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};
