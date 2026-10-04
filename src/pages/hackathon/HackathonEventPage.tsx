import { useParams } from "react-router-dom";
import { useHackathon } from "@/hooks/useHackathons";
import { formatDateRange, formatDateTime, formatRelative, isFuture } from "@/lib/datetime";
import { teamSizeLabel } from "@/lib/hackathonPhases";
import type { BigEvent } from "@/dtos/hackathon";
import { PublicShell } from "@/components/hackathon/Shells";
import { EventGate } from "@/components/hackathon/EventStates";
import { EventTimeline } from "@/components/hackathon/EventTimeline";
import { Badge } from "@/components/hackathon/ui/Badge";
import { ButtonLink } from "@/components/hackathon/ui/Button";
import { Card, CardHeader } from "@/components/hackathon/ui/Card";
import { ArrowRightIcon, CalendarIcon, ClockIcon, LockIcon, UsersIcon } from "@/components/hackathon/ui/icons";

function RegistrationStatus({ event }: { event: BigEvent }) {
  if (event.registrationOpen) {
    return (
      <>
        <Badge tone="green">Registration open</Badge>
        <p className="mt-3 text-sm text-zinc-300">
          Registration closes {formatDateTime(event.registrationClosesAt)}{" "}
          <span className="text-zinc-500">({formatRelative(event.registrationClosesAt)})</span>
        </p>
      </>
    );
  }
  if (isFuture(event.registrationOpensAt)) {
    return (
      <div className="flex items-start gap-3">
        <ClockIcon className="mt-0.5 size-5 text-hk-accent-fg" />
        <div>
          <p className="font-medium text-white">Registration opens {formatDateTime(event.registrationOpensAt)}</p>
          <p className="mt-1 text-sm text-zinc-400">That's {formatRelative(event.registrationOpensAt)}. Come back then to sign up your team.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3">
      <LockIcon className="mt-0.5 size-5 text-zinc-400" />
      <div>
        <p className="font-medium text-white">Registration is closed</p>
        <p className="mt-1 text-sm text-zinc-400">It closed on {formatDateTime(event.registrationClosesAt)}.</p>
      </div>
    </div>
  );
}

function RegistrationCard({ event }: { event: BigEvent }) {
  return (
    <Card className={event.registrationOpen ? "border-hk-accent-fg/30 bg-hk-accent/[0.07]" : undefined}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <RegistrationStatus event={event} />
        </div>
        {event.registrationOpen && (
          <ButtonLink to={`/hackathon/${event.slug}/register`} size="lg" className="w-full shrink-0 sm:w-auto">
            Register your team
            <ArrowRightIcon />
          </ButtonLink>
        )}
      </div>
    </Card>
  );
}

function EventDetails({ event }: { event: BigEvent }) {
  return (
    <div className="space-y-5">
      {event.heroImageUrl && (
        <img
          src={event.heroImageUrl}
          alt=""
          className="aspect-[2/1] w-full rounded-2xl border border-white/10 object-cover sm:aspect-[21/9]"
        />
      )}

      <header className="space-y-4 pt-2">
        <p className="text-sm font-medium text-hk-accent-fg">NU IEEE {event.kind === "hackathon" ? "Hackathon" : "Conference"}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">{event.title}</h1>
        <ul className="flex flex-col gap-2 text-sm text-zinc-300 sm:flex-row sm:flex-wrap sm:gap-x-6">
          <li className="flex items-center gap-2">
            <CalendarIcon className="text-zinc-500" />
            {formatDateRange(event.startsAt, event.endsAt)}
          </li>
          <li className="flex items-center gap-2">
            <UsersIcon className="text-zinc-500" />
            {teamSizeLabel(event)}
            {event.capacity !== null && <span className="text-zinc-500">· up to {event.capacity} teams</span>}
          </li>
        </ul>
      </header>

      <RegistrationCard event={event} />

      <Card>
        <CardHeader title="Schedule" description="Key dates for your team." />
        <EventTimeline event={event} />
      </Card>

      {event.description.trim() && (
        <Card>
          <CardHeader title="About" />
          <p className="text-[15px] leading-relaxed whitespace-pre-line text-zinc-300">{event.description}</p>
        </Card>
      )}
    </div>
  );
}

export default function HackathonEventPage() {
  const { slug } = useParams<{ slug: string }>();
  const query = useHackathon(slug);

  return (
    <PublicShell>
      <EventGate query={query}>{(event) => <EventDetails event={event} />}</EventGate>
    </PublicShell>
  );
}
