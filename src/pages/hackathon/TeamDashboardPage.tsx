import { useEffect } from "react";
import { errorMessage, errorStatus } from "@/api/client";
import { useTeamDashboard } from "@/hooks/useHackathonTeam";
import { useTeamToken } from "@/hooks/useTeamToken";
import { forgetTeamToken, saveTeamToken } from "@/lib/teamToken";
import type { TeamDashboard } from "@/dtos/hackathon";
import { PublicShell } from "@/components/hackathon/Shells";
import { EventTimeline } from "@/components/hackathon/EventTimeline";
import { TeamLinkPanel } from "@/components/hackathon/TeamLinkPanel";
import { CaseSelection } from "@/components/hackathon/team/CaseSelection";
import { SubmissionPanel } from "@/components/hackathon/team/SubmissionPanel";
import { TeamOverview } from "@/components/hackathon/team/TeamOverview";
import { ButtonLink } from "@/components/hackathon/ui/Button";
import { Card, CardHeader } from "@/components/hackathon/ui/Card";
import { EmptyState, ErrorState, PageLoader } from "@/components/hackathon/ui/states";
import { CalendarIcon, LinkIcon, LockIcon } from "@/components/hackathon/ui/icons";

function MissingLink() {
  return (
    <EmptyState
      className="py-16"
      icon={<LinkIcon />}
      title="Open your team link"
      description="Your team page opens from the private link you got when you registered. Find it in your notes or ask a teammate to send it to you. If nobody has it, contact the organisers."
      action={
        <ButtonLink to="/hackathon" variant="secondary">
          Go to the hackathon page
        </ButtonLink>
      }
    />
  );
}

function InvalidLink() {
  return (
    <EmptyState
      className="py-16"
      icon={<LockIcon />}
      title="This team link is not valid anymore"
      description="It may have been replaced by a newer link. Ask the organisers for a new one, or ask a teammate whether they received it."
      action={
        <ButtonLink to="/hackathon" variant="secondary">
          Go to the hackathon page
        </ButtonLink>
      }
    />
  );
}

function Dashboard({ dashboard, token }: { dashboard: TeamDashboard; token: string }) {
  return (
    <div className="space-y-5">
      <TeamOverview dashboard={dashboard} token={token} />
      <Card>
        <CardHeader icon={<CalendarIcon />} title="Schedule" />
        <EventTimeline event={dashboard.event} />
      </Card>
      <CaseSelection dashboard={dashboard} token={token} />
      <SubmissionPanel dashboard={dashboard} token={token} />
      <Card>
        <CardHeader
          icon={<LinkIcon />}
          title="Team link"
          description="Anyone with this link can change your case and submission. Share it only with your teammates."
        />
        <TeamLinkPanel
          token={token}
          eventTitle={dashboard.event.title}
          memberEmails={dashboard.members.map((member) => member.email)}
        />
      </Card>
    </div>
  );
}

function TeamDashboardView({ token }: { token: string }) {
  const { data, error, isPending, isFetching, refetch } = useTeamDashboard(token);
  const rejected = errorStatus(error) === 401;
  const slug = data?.event.slug;

  useEffect(() => {
    if (slug) saveTeamToken(slug, token);
  }, [slug, token]);

  useEffect(() => {
    if (rejected) forgetTeamToken(token);
  }, [rejected, token]);

  if (rejected) return <InvalidLink />;
  if (data) return <Dashboard dashboard={data} token={token} />;
  if (isPending) return <PageLoader label="Opening your team page…" />;
  return (
    <ErrorState
      message={errorMessage(error, "Your team page could not be loaded. Check your connection.")}
      onRetry={() => refetch()}
      retrying={isFetching}
    />
  );
}

export default function TeamDashboardPage() {
  const token = useTeamToken();
  return <PublicShell>{token ? <TeamDashboardView key={token} token={token} /> : <MissingLink />}</PublicShell>;
}
