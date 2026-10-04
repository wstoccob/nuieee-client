import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/api/client";
import { hackathonAdminApi } from "@/api/hackathonAdmin";
import { useAdminTeams, useDeleteTeam } from "@/hooks/useHackathonAdmin";
import { formatDateTime } from "@/lib/datetime";
import { saveBlob } from "@/lib/download";
import { cn } from "@/lib/utils";
import type { AdminTeam, BigEventAdmin } from "@/dtos/hackathon";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/Dialog";
import { Input } from "../ui/form";
import { EmptyState, ErrorState, PageLoader } from "../ui/states";
import { ChevronDownIcon, DownloadIcon, SearchIcon, TrashIcon, UsersIcon } from "../ui/icons";
import { MemberRow } from "../MemberRow";

function matches(team: AdminTeam, query: string): boolean {
  const haystack = [
    team.name,
    ...team.members.flatMap((m) => [m.fullName, m.email, m.nuId ?? ""]),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-0.5 text-xl font-semibold text-white tabular-nums">{value}</p>
    </div>
  );
}

interface TeamRowProps {
  team: AdminTeam;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function TeamRow({ team, expanded, onToggle, onDelete }: TeamRowProps) {
  const captain = team.members.find((m) => m.isCaptain);
  const detailsId = `team-${team.id}-members`;

  return (
    <Fragment>
      <tr className={cn("border-t border-white/10 align-top", expanded && "bg-white/[0.02]")}>
        <td className="py-3 pr-3 pl-4">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={detailsId}
            className="flex cursor-pointer items-start gap-2 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-hk-accent-fg/70"
          >
            <ChevronDownIcon className={cn("mt-0.5 text-zinc-500 transition-transform", expanded && "rotate-180")} />
            <span>
              <span className="block font-medium text-white">{team.name}</span>
              <span className="block text-xs text-zinc-500">{formatDateTime(team.createdAt)}</span>
            </span>
          </button>
        </td>
        <td className="px-3 py-3 text-zinc-300 tabular-nums">{team.members.length}</td>
        <td className="px-3 py-3">
          {captain ? (
            <>
              <span className="block text-zinc-200">{captain.fullName}</span>
              <span className="block text-xs break-all text-zinc-500">{captain.email}</span>
            </>
          ) : (
            <span className="text-zinc-500">—</span>
          )}
        </td>
        <td className="py-3 pr-4 pl-3">
          <div className="flex justify-end gap-1">
            <Button variant="dangerGhost" size="icon" onClick={onDelete} aria-label={`Delete ${team.name}`}>
              <TrashIcon />
            </Button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr id={detailsId} className="bg-white/[0.02]">
          <td colSpan={4} className="px-4 pt-1 pb-5">
            <ul className="grid gap-x-6 gap-y-1 rounded-xl border border-white/10 bg-black/30 p-4 sm:grid-cols-2 [&>li]:py-2">
              {team.members.map((member) => (
                <MemberRow key={member.email} member={member} />
              ))}
            </ul>
          </td>
        </tr>
      )}
    </Fragment>
  );
}

export function TeamsTab({ event }: { event: BigEventAdmin }) {
  const { data: teams, isPending, error, refetch, isFetching } = useAdminTeams(event.id);
  const deleteTeam = useDeleteTeam(event.id);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AdminTeam | null>(null);
  const [exporting, setExporting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...(teams ?? [])].sort((a, b) => a.name.localeCompare(b.name));
    return q ? list.filter((team) => matches(team, q)) : list;
  }, [teams, query]);

  if (isPending) return <PageLoader label="Loading teams…" />;
  if (error) {
    return <ErrorState message={errorMessage(error, "Couldn't load the teams.")} onRetry={() => refetch()} retrying={isFetching} />;
  }

  const exportCsv = async () => {
    setExporting(true);
    try {
      saveBlob(await hackathonAdminApi.teamsCsv(event.id), `${event.slug}-teams.csv`);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't download the CSV."));
    } finally {
      setExporting(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteTeam.mutateAsync(toDelete.id);
      toast.success(`Deleted ${toDelete.name}`);
      setToDelete(null);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't delete the team."));
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Teams" value={teams.length} />
        <Stat label="Participants" value={teams.reduce((sum, t) => sum + t.members.length, 0)} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500" />
          <Input
            type="search"
            aria-label="Search teams"
            placeholder="Search by team, member, email or NU ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary" onClick={exportCsv} loading={exporting} disabled={teams.length === 0}>
          {!exporting && <DownloadIcon />}
          Download CSV
        </Button>
      </div>

      {teams.length === 0 ? (
        <EmptyState icon={<UsersIcon />} title="No teams yet" description="Teams appear here as soon as they register." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<SearchIcon />} title="No matches" description={`Nothing matches “${query}”.`} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Registered teams</caption>
            <thead className="bg-white/[0.03] text-xs font-medium text-zinc-500">
              <tr>
                <th scope="col" className="py-3 pr-3 pl-4 font-medium">Team</th>
                <th scope="col" className="px-3 py-3 font-medium">Members</th>
                <th scope="col" className="px-3 py-3 font-medium">Captain</th>
                <th scope="col" className="py-3 pr-4 pl-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((team) => (
                <TeamRow
                  key={team.id}
                  team={team}
                  expanded={expandedId === team.id}
                  onToggle={() => setExpandedId((id) => (id === team.id ? null : team.id))}
                  onDelete={() => setToDelete(team)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {query && filtered.length > 0 && (
        <p className="text-xs text-zinc-500">
          Showing {filtered.length} of {teams.length} teams
        </p>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this team?"
        description={`${toDelete?.name ?? "The team"}, and its members will be deleted. This can't be undone.`}
        confirmLabel="Delete team"
        busy={deleteTeam.isPending}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
