import { useEffect } from "react";
import { ORGANISER_EMAIL } from "@/config/hackathon";
import { Alert } from "../ui/Alert";
import { ButtonLink } from "../ui/Button";
import { Card } from "../ui/Card";
import { ArrowLeftIcon, CheckIcon } from "../ui/icons";
import { MemberRow } from "../MemberRow";
import type { Registered } from "./RegistrationForm";

interface RegistrationSuccessProps {
  eventTitle: string;
  eventSlug: string;
  registered: Registered;
}

export function RegistrationSuccess({ eventTitle, eventSlug, registered }: RegistrationSuccessProps) {
  const { teamName, members } = registered;
  const captain = members.find((member) => member.isCaptain);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start gap-4">
        <span className="grid size-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
          <CheckIcon className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Your team is registered</h1>
          <p className="mt-2 text-zinc-400">
            <span className="font-medium text-zinc-200">{teamName}</span> is signed up for {eventTitle}.
          </p>
        </div>
      </div>

      <Alert tone="success" title="What happens next">
        The organisers will contact your captain
        {captain && (
          <>
            {" "}at <span className="font-medium break-all text-white">{captain.email}</span>
          </>
        )}{" "}
        from <span className="font-medium text-white">{ORGANISER_EMAIL}</span>. Keep an eye on that inbox,
        including the spam folder.
      </Alert>

      <Card>
        <h2 className="text-lg font-semibold text-white">{teamName}</h2>
        <p className="mt-1 text-sm text-zinc-400">{members.length} members</p>
        <ul className="mt-5 divide-y divide-white/10 border-t border-white/10 pt-4">
          {members.map((member) => (
            <MemberRow key={member.email} member={member} />
          ))}
        </ul>
      </Card>

      <ButtonLink to={`/hackathon/${eventSlug}`} variant="secondary" className="w-full sm:w-auto">
        <ArrowLeftIcon />
        Back to the event
      </ButtonLink>
    </div>
  );
}
