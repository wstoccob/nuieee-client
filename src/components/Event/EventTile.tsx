import { Link } from "react-router-dom";
import { formatDate } from "@/lib/datetime";
import { trackPointer } from "@/lib/pointerEffects";
import { cn } from "@/lib/utils";
import type { Event } from "@/dtos/event";
import ieeeSmallBlueIcon from "@/assets/icons/ieee_small_blue_icon.svg";
import { Badge } from "@/components/hackathon/ui/Badge";
import { focusRing } from "@/components/hackathon/ui/styles";

export function EventTile({ event, className }: { event: Event; className?: string }) {
  const cover = event.photos[0];
  return (
    <li className={cn("reveal", className)}>
      <Link
        to={`/events/${event.id}`}
        onPointerMove={trackPointer}
        className={cn(
          "spotlight group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-hk-accent-fg/40",
          focusRing
        )}
      >
        <div className="aspect-[16/10] overflow-hidden bg-hk-accent/10">
          {cover ? (
            <img
              src={cover.photoUrl}
              alt={cover.altText || ""}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          ) : (
            <div className="grid size-full place-items-center">
              <img src={ieeeSmallBlueIcon} alt="" className="size-14 opacity-50" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <time dateTime={event.startsAt} className="text-sm font-medium text-hk-accent-fg">
              {formatDate(event.startsAt)}
            </time>
            {event.hasRegistrationLink && <Badge tone="green">Registration open</Badge>}
          </div>
          <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-white">{event.title || "Untitled event"}</h3>
          {event.description && <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{event.description}</p>}
        </div>
      </Link>
    </li>
  );
}

export function EventTileSkeleton({ className }: { className?: string }) {
  return (
    <li aria-hidden="true" className={cn("overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]", className)}>
      <div className="aspect-[16/10] animate-pulse bg-white/[0.05] motion-reduce:animate-none" />
      <div className="space-y-2 p-5">
        <div className="h-4 w-20 rounded bg-white/[0.06]" />
        <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
      </div>
    </li>
  );
}
