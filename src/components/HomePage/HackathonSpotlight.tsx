import type { BigEvent } from "@/dtos/hackathon";
import { formatDateRange, formatDateTime, formatRelative, isFuture } from "@/lib/datetime";
import { teamSizeLabel } from "@/lib/hackathonPhases";
import { Badge } from "@/components/hackathon/ui/Badge";
import { ButtonLink } from "@/components/hackathon/ui/Button";
import { ArrowRightIcon, CalendarIcon, ClockIcon, UsersIcon } from "@/components/hackathon/ui/icons";

function RegistrationBadge({ event }: { event: BigEvent }) {
  if (event.registrationOpen) return <Badge tone="green">Registration open</Badge>;
  if (isFuture(event.registrationOpensAt)) return <Badge tone="blue">Registration opens soon</Badge>;
  return <Badge>Registration closed</Badge>;
}

function registrationLine(event: BigEvent): string | null {
  if (event.registrationOpen) {
    return `Registration closes ${formatDateTime(event.registrationClosesAt)} (${formatRelative(event.registrationClosesAt)})`;
  }
  if (isFuture(event.registrationOpensAt)) return `Registration opens ${formatDateTime(event.registrationOpensAt)}`;
  return null;
}

export function HackathonSpotlight({ event }: { event: BigEvent }) {
  const registration = registrationLine(event);
  return (
    <section
      aria-labelledby="hackathon-spotlight"
      className="w-full rounded-2xl border border-hk-accent-fg/25 bg-black/60 p-5 text-left backdrop-blur-sm sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <RegistrationBadge event={event} />
          <h2 id="hackathon-spotlight" className="mt-3 text-2xl font-semibold text-balance text-white sm:text-3xl">
            {event.title}
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <CalendarIcon className="text-hk-accent-fg" />
              {formatDateRange(event.startsAt, event.endsAt)}
            </li>
            <li className="flex items-center gap-2">
              <UsersIcon className="text-hk-accent-fg" />
              {teamSizeLabel(event)}
            </li>
            {registration && (
              <li className="flex items-start gap-2">
                <ClockIcon className="mt-0.5 text-hk-accent-fg" />
                {registration}
              </li>
            )}
          </ul>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          {event.registrationOpen && (
            <ButtonLink to={`/hackathon/${event.slug}/register`} size="lg">
              Register your team
              <ArrowRightIcon />
            </ButtonLink>
          )}
          <ButtonLink to={`/hackathon/${event.slug}`} variant="secondary" size="lg">
            Event details
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
