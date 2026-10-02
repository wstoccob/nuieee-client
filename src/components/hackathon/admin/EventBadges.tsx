import type { BigEventAdmin, BigEventStatus } from "@/dtos/hackathon";
import { Badge, type BadgeTone } from "../ui/Badge";
import { StarIcon } from "../ui/icons";

const STATUS: Record<BigEventStatus, { tone: BadgeTone; label: string }> = {
  draft: { tone: "neutral", label: "Draft" },
  published: { tone: "green", label: "Published" },
  archived: { tone: "amber", label: "Archived" },
};

export function EventBadges({ event }: { event: BigEventAdmin }) {
  const status = STATUS[event.status];
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <Badge tone={status.tone}>{status.label}</Badge>
      {event.isFeatured && (
        <Badge tone="blue" icon={<StarIcon className="size-3" />}>
          Featured
        </Badge>
      )}
      {event.kind === "conference" && <Badge>Conference</Badge>}
      {event.registrationOpen && <Badge tone="green">Registration open</Badge>}
    </span>
  );
}
