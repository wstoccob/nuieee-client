import { useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/api/client";
import { useAdminCases, useCreateCase, useDeleteCase, useUpdateCase } from "@/hooks/useHackathonAdmin";
import { cn } from "@/lib/utils";
import type { Case, CaseWrite } from "@/dtos/hackathon";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ConfirmDialog } from "../ui/Dialog";
import { EmptyState, ErrorState, PageLoader } from "../ui/states";
import { FileIcon, PencilIcon, PlusIcon, TrashIcon } from "../ui/icons";
import { CaseAttachment } from "./CaseAttachment";
import { CaseForm } from "./CaseForm";

interface CaseItemProps {
  eventId: string;
  item: Case;
  onDelete: () => void;
}

function CaseItem({ eventId, item, onDelete }: CaseItemProps) {
  const [editing, setEditing] = useState(false);
  const updateCase = useUpdateCase(eventId);

  const save = async (payload: CaseWrite) => {
    await updateCase.mutateAsync({ caseId: item.id, payload });
    toast.success("Case saved");
    setEditing(false);
  };

  if (editing) {
    return (
      <Card>
        <CaseForm initial={item} defaultSortOrder={item.sortOrder} submitLabel="Save case" onSubmit={save} onCancel={() => setEditing(false)} />
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="grid h-7 min-w-7 shrink-0 place-items-center rounded-lg bg-white/[0.06] px-1.5 text-xs font-semibold text-zinc-300" title="Sort order">
            {item.sortOrder}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">{item.company}</p>
            <h3 className="font-semibold text-white">{item.title}</h3>
            {item.description && (
              <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-zinc-400">{item.description}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <PencilIcon />
            Edit
          </Button>
          <Button variant="dangerGhost" size="sm" onClick={onDelete}>
            <TrashIcon />
            Delete
          </Button>
        </div>
      </div>
      <CaseAttachment eventId={eventId} item={item} />
    </Card>
  );
}

export function CasesTab({ eventId }: { eventId: string }) {
  const { data: cases, isPending, error, refetch, isFetching } = useAdminCases(eventId);
  const createCase = useCreateCase(eventId);
  const deleteCase = useDeleteCase(eventId);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<Case | null>(null);

  if (isPending) return <PageLoader label="Loading cases…" />;
  if (error) {
    return <ErrorState message={errorMessage(error, "Couldn't load the cases.")} onRetry={() => refetch()} retrying={isFetching} />;
  }

  const sorted = [...cases].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
  const nextSortOrder = sorted.length ? Math.max(...sorted.map((c) => c.sortOrder)) + 1 : 1;

  const create = async (payload: CaseWrite) => {
    await createCase.mutateAsync(payload);
    toast.success("Case added");
    setAdding(false);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteCase.mutateAsync(toDelete.id);
      toast.success("Case deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't delete the case."));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          Teams see cases in this order once case selection opens. Attachments are downloadable by every team.
        </p>
        {!adding && (
          <Button onClick={() => setAdding(true)}>
            <PlusIcon />
            Add case
          </Button>
        )}
      </div>

      {adding && (
        <Card className={cn("border-hk-accent-fg/30")}>
          <h3 className="mb-4 font-semibold text-white">New case</h3>
          <CaseForm defaultSortOrder={nextSortOrder} submitLabel="Add case" onSubmit={create} onCancel={() => setAdding(false)} />
        </Card>
      )}

      {sorted.length === 0 && !adding && (
        <EmptyState
          icon={<FileIcon />}
          title="No cases yet"
          description="Add the cases teams will choose from. You can attach a brief to each one."
          action={<Button onClick={() => setAdding(true)}>Add the first case</Button>}
        />
      )}

      {sorted.map((item) => (
        <CaseItem key={item.id} eventId={eventId} item={item} onDelete={() => setToDelete(item)} />
      ))}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this case?"
        description={
          <>
            <span className="font-medium text-zinc-200">{toDelete?.title}</span> and its attachment will be deleted.
            Teams that chose it will need to pick another case. This can't be undone.
          </>
        }
        confirmLabel="Delete case"
        busy={deleteCase.isPending}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
