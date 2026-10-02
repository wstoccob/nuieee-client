import { useEffect } from "react";
import { Alert } from "../ui/Alert";
import { ButtonLink } from "../ui/Button";
import { Card } from "../ui/Card";
import { ArrowRightIcon, CheckIcon } from "../ui/icons";
import { TeamLinkPanel } from "../TeamLinkPanel";
import type { Registered } from "./RegistrationForm";

interface RegistrationSuccessProps {
  eventTitle: string;
  registered: Registered;
}

export function RegistrationSuccess({ eventTitle, registered }: RegistrationSuccessProps) {
  const { token, teamName, memberEmails, linkEmailed } = registered;

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

      {linkEmailed && (
        <Alert tone="success" title="We emailed this link to your team">
          Every member ({memberEmails.length}) should get it within a few minutes. If it isn't there, check
          the spam folder, and save the link below anyway.
        </Alert>
      )}

      <Card className="border-hk-accent-fg/30 bg-hk-accent/[0.07]">
        <h2 className="text-lg font-semibold text-white">Your team link</h2>
        <p className="mt-1 mb-5 text-sm leading-relaxed text-zinc-300">
          This is how your team chooses a case and uploads its solution. Save it somewhere safe right now.
        </p>
        <TeamLinkPanel token={token} eventTitle={eventTitle} memberEmails={memberEmails} showQrByDefault />
      </Card>

      <Alert tone="warning" title="This link is the only way back in">
        We can't show it again, and there are no passwords. Share it only with your teammates: anyone who
        has it can change your case and your submission. It is also saved in this browser, so this device
        can reopen the team page from the hackathon page.
      </Alert>

      <ButtonLink to={{ pathname: "/hackathon/team", hash: token }} size="lg" className="w-full sm:w-auto">
        Open team page
        <ArrowRightIcon />
      </ButtonLink>
    </div>
  );
}
