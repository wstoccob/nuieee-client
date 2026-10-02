import { useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/api/client";
import { teamApi } from "@/api/hackathons";
import { useSelectCase } from "@/hooks/useHackathonTeam";
import { formatDateTime } from "@/lib/datetime";
import { openFetchedLink } from "@/lib/download";
import { formatBytes } from "@/lib/files";
import { cn } from "@/lib/utils";
import type { Case, TeamDashboard } from "@/dtos/hackathon";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardHeader } from "../ui/Card";
import { EmptyState } from "../ui/states";
import { CheckIcon, DownloadIcon, FileIcon, LockIcon } from "../ui/icons";

interface CaseCardProps {
  item: Case;
  current: boolean;
  checked: boolean;
  selectable: boolean;
  onPick: () => void;
  onDownload: () => void;
  downloading: boolean;
}

function CaseCard({ item, current, checked, selectable, onPick, onDownload, downloading }: CaseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const long = item.description.length > 280;

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border transition-colors",
        current ? "border-hk-accent-fg/50 bg-hk-accent/[0.08]" : "border-white/10 bg-white/[0.02]",
        checked && !current && "border-white/40 bg-white/[0.05]"
      )}
    >
      <label
        className={cn(
          "flex flex-1 gap-3 rounded-2xl p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-hk-accent-fg/70 sm:p-5",
          selectable ? "cursor-pointer" : "cursor-default"
        )}
      >
        <input
          type="radio"
          name="team-case"
          value={item.id}
          checked={checked}
          disabled={!selectable}
          onChange={onPick}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
            checked ? "border-hk-accent-fg bg-hk-accent-fg text-black" : "border-white/25"
          )}
        >
          {checked && <CheckIcon className="size-3" strokeWidth={3} />}
        </span>
        <span className="min-w-0 flex-1 space-y-1.5">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">{item.company}</span>
            {current && <Badge tone="blue">Your case</Badge>}
          </span>
          <span className="block font-semibold text-white">{item.title}</span>
          {item.description && (
            <span
              className={cn(
                "block text-sm leading-relaxed whitespace-pre-line text-zinc-400",
                long && !expanded && "line-clamp-4"
              )}
            >
              {item.description}
            </span>
          )}
        </span>
      </label>
      {(long || item.hasAttachment) && (
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-4 py-3 sm:px-5">
          {item.hasAttachment && (
            <Button variant="secondary" size="sm" onClick={onDownload} loading={downloading}>
              {!downloading && <DownloadIcon />}
              Case brief
              {item.attachmentSizeBytes !== null && (
                <span className="text-zinc-500">{formatBytes(item.attachmentSizeBytes)}</span>
              )}
            </Button>
          )}
          {long && (
            <Button variant="ghost" size="sm" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Show less" : "Read more"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function CaseSelection({ dashboard, token }: { dashboard: TeamDashboard; token: string }) {
  const { event, cases, case: chosen } = dashboard;
  const selectCase = useSelectCase(token);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const selectable = event.caseSelectionOpen;
  const checkedId = pendingId ?? chosen?.id ?? null;
  const pending = pendingId && pendingId !== chosen?.id ? cases.find((c) => c.id === pendingId) : undefined;
  const sorted = [...cases].sort((a, b) => a.sortOrder - b.sortOrder);

  const confirm = async () => {
    if (!pending) return;
    try {
      await selectCase.mutateAsync(pending.id);
      toast.success(`You're working on “${pending.title}”`);
      setPendingId(null);
    } catch (error) {
      toast.error(errorMessage(error, "Couldn't save your case. Please try again."));
    }
  };

  const download = async (caseId: string) => {
    setDownloadingId(caseId);
    try {
      await openFetchedLink(() => teamApi.caseAttachmentUrl(token, caseId));
    } catch (error) {
      toast.error(errorMessage(error, "Couldn't open the case brief. Please try again."));
    } finally {
      setDownloadingId(null);
    }
  };

  const description = chosen
    ? `Your team is working on “${chosen.title}”.`
    : "Choose the case your team will solve.";

  return (
    <Card aria-labelledby="case-heading">
      <CardHeader id="case-heading" icon={<FileIcon />} title="Case" description={event.casesVisible ? description : undefined} />

      {!event.casesVisible ? (
        <EmptyState
          icon={<LockIcon />}
          title="Cases are not revealed yet"
          description={
            event.caseSelectionOpensAt
              ? `They will appear here on ${formatDateTime(event.caseSelectionOpensAt)}. Come back then to pick one.`
              : "They will appear here once the organisers publish them."
          }
        />
      ) : sorted.length === 0 ? (
        <EmptyState icon={<FileIcon />} title="No cases yet" description="The organisers haven't added any cases. Check back soon." />
      ) : (
        <div className="space-y-4">
          {!selectable && (
            <Alert tone="info" title="Case selection is closed">
              {chosen ? "Your choice is locked in." : "Your team didn't choose a case. Contact the organisers."}
            </Alert>
          )}
          {selectable && chosen && event.submissionsCloseAt && (
            <p className="text-sm text-zinc-400">
              You can switch cases until submissions close on {formatDateTime(event.submissionsCloseAt)}.
            </p>
          )}
          <fieldset>
            <legend className="sr-only">Choose a case</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {sorted.map((item) => (
                <CaseCard
                  key={item.id}
                  item={item}
                  current={item.id === chosen?.id}
                  checked={item.id === checkedId}
                  selectable={selectable && !selectCase.isPending}
                  onPick={() => setPendingId(item.id)}
                  onDownload={() => download(item.id)}
                  downloading={downloadingId === item.id}
                />
              ))}
            </div>
          </fieldset>

          {selectable && pending && (
            <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-white/15 bg-zinc-900/95 p-4 shadow-xl shadow-black/50 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-200">
                {chosen ? "Switch to" : "Choose"} <span className="font-semibold text-white">“{pending.title}”</span>?
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1 sm:flex-none" onClick={() => setPendingId(null)} disabled={selectCase.isPending}>
                  Cancel
                </Button>
                <Button className="flex-1 sm:flex-none" onClick={confirm} loading={selectCase.isPending}>
                  Confirm case
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
