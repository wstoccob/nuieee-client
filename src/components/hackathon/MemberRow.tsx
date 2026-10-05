import { YEAR_OF_STUDY_LABELS } from "@/config/hackathon";
import type { Member } from "@/dtos/hackathon";
import { Badge } from "./ui/Badge";

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
