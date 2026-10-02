import { useState } from "react";
import { useParams } from "react-router-dom";
import { useHackathon } from "@/hooks/useHackathons";
import { formatDateTime, isFuture } from "@/lib/datetime";
import type { BigEvent } from "@/dtos/hackathon";
import { BackLink, PageHeader, PublicShell } from "@/components/hackathon/Shells";
import { EventGate } from "@/components/hackathon/EventStates";
import { RegistrationForm, type Registered } from "@/components/hackathon/registration/RegistrationForm";
import { RegistrationSuccess } from "@/components/hackathon/registration/RegistrationSuccess";
import { ButtonLink } from "@/components/hackathon/ui/Button";
import { EmptyState } from "@/components/hackathon/ui/states";
import { ClockIcon, LockIcon } from "@/components/hackathon/ui/icons";

function RegistrationUnavailable({ event }: { event: BigEvent }) {
  const notYet = isFuture(event.registrationOpensAt);
  return (
    <EmptyState
      icon={notYet ? <ClockIcon /> : <LockIcon />}
      title={notYet ? "Registration hasn't opened yet" : "Registration is closed"}
      description={
        notYet
          ? `You can register from ${formatDateTime(event.registrationOpensAt)}.`
          : `Registration for ${event.title} closed on ${formatDateTime(event.registrationClosesAt)}.`
      }
      action={
        <ButtonLink to={`/hackathon/${event.slug}`} variant="secondary">
          Back to the event
        </ButtonLink>
      }
    />
  );
}

function Registration({ event }: { event: BigEvent }) {
  const [registered, setRegistered] = useState<Registered | null>(null);

  if (registered) return <RegistrationSuccess eventTitle={event.title} registered={registered} />;

  return (
    <>
      <BackLink to={`/hackathon/${event.slug}`}>{event.title}</BackLink>
      <PageHeader
        title="Register your team"
        description="Fill this in once for the whole team. It takes about five minutes."
      />
      {event.registrationOpen ? (
        <RegistrationForm key={event.id} event={event} onRegistered={setRegistered} />
      ) : (
        <RegistrationUnavailable event={event} />
      )}
    </>
  );
}

export default function TeamRegistrationPage() {
  const { slug } = useParams<{ slug: string }>();
  const query = useHackathon(slug);

  return (
    <PublicShell>
      <EventGate query={query}>{(event) => <Registration event={event} />}</EventGate>
    </PublicShell>
  );
}
