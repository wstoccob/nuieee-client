import type { Event } from "@/dtos/event";
import { formatDateTime } from "@/lib/datetime";
import { Button, ButtonLink } from "@/components/hackathon/ui/Button";
import { TrashIcon } from "@/components/hackathon/ui/icons";

interface Props {
  event: Event;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

export function EventListItem({ event, onDelete, deleting }: Props) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-white">{event.title || "Untitled event"}</h2>
        <time dateTime={event.startsAt} className="mt-1 block text-sm font-medium text-hk-accent-fg">
          {formatDateTime(event.startsAt)}
        </time>
        {event.description && <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{event.description}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <ButtonLink to={`/events/${event.id}`} variant="secondary">
          View
        </ButtonLink>
        <Button variant="dangerGhost" loading={deleting} onClick={() => onDelete(event.id)}>
          {!deleting && <TrashIcon />}
          Delete
        </Button>
      </div>
    </li>
  );
}
