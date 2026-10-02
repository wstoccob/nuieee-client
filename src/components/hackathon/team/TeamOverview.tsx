import { Link } from "react-router-dom";
import { YEAR_OF_STUDY_LABELS } from "@/config/hackathon";
import { formatDate } from "@/lib/datetime";
import { teamLink } from "@/lib/teamToken";
import type { Member, TeamDashboard } from "@/dtos/hackathon";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { CopyButton } from "../ui/Copy";
import { ArrowLeftIcon } from "../ui/icons";
import { focusRing } from "../ui/styles";

export function MemberRow({ member }: { member: Member }) {
  const details = [member.nuId ? `NU ID ${member.nuId}` : null, YEAR_OF_STUDY_LABELS[member.yearOfStudy], member.major]
    .filter(Boolean)
    .join(" · ");
  return (
    <li className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-white">{member.fullName}</span>
        {member.isCaptain && <Badge tone="blue">Captain</Badge>}
      </div>
      <span className="text-sm break-all text-zinc-400">{member.email}</span>
      <span className="text-xs text-zinc-500">{details}</span>
    </li>
  );
}

export function TeamOverview({ dashboard, token }: { dashboard: TeamDashboard; token: string }) {
  const { event, members } = dashboard;
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            to={`/hackathon/${event.slug}`}
            className={`inline-flex items-center gap-1.5 rounded text-sm font-medium text-hk-accent-fg hover:underline ${focusRing}`}
          >
            <ArrowLeftIcon />
            {event.title}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight break-words text-white sm:text-3xl">{dashboard.name}</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {members.length} members · registered {formatDate(dashboard.createdAt)}
          </p>
        </div>
        <CopyButton text={teamLink(token)} label="Copy team link" className="w-full sm:w-auto" />
      </div>
      <ul className="mt-6 divide-y divide-white/10 border-t border-white/10 pt-4">
        {members.map((member) => (
          <MemberRow key={member.email} member={member} />
        ))}
      </ul>
    </Card>
  );
}
