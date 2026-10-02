import { useRef, useState } from "react";
import { toast } from "sonner";
import { errorMessage } from "@/api/client";
import { hackathonAdminApi } from "@/api/hackathonAdmin";
import { CASE_ATTACHMENT_EXTENSIONS } from "@/config/hackathon";
import { useCaseAttachmentUpload, useRemoveCaseAttachment } from "@/hooks/useHackathonAdmin";
import { openFetchedLink } from "@/lib/download";
import { describeExtensions, formatBytes } from "@/lib/files";
import type { Case } from "@/dtos/hackathon";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/Dialog";
import { ProgressBar } from "../ui/ProgressBar";
import { DownloadIcon, FileIcon, TrashIcon, UploadIcon } from "../ui/icons";

export function CaseAttachment({ eventId, item }: { eventId: string; item: Case }) {
  const input = useRef<HTMLInputElement>(null);
  const upload = useCaseAttachmentUpload(eventId, item.id);
  const removeAttachment = useRemoveCaseAttachment(eventId);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [opening, setOpening] = useState(false);

  const onFile = async (file: File) => {
    if (await upload.upload(file)) toast.success(`Attached ${file.name}`);
  };

  const download = async () => {
    setOpening(true);
    try {
      await openFetchedLink(() => hackathonAdminApi.attachmentUrl(item.id));
    } catch (error) {
      toast.error(errorMessage(error, "Couldn't open the attachment."));
    } finally {
      setOpening(false);
    }
  };

  const remove = async () => {
    try {
      await removeAttachment.mutateAsync(item.id);
      toast.success("Attachment removed");
      setConfirmRemove(false);
    } catch (error) {
      toast.error(errorMessage(error, "Couldn't remove the attachment."));
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={input}
        type="file"
        hidden
        accept={CASE_ATTACHMENT_EXTENSIONS.join(",")}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onFile(file);
        }}
      />

      {upload.busy ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/30 p-3" aria-live="polite">
          <div className="flex justify-between gap-3 text-sm">
            <span className="truncate text-white">{upload.fileName}</span>
            <span className="shrink-0 text-zinc-400">
              {upload.phase === "uploading" ? `${Math.round(upload.progress * 100)}%` : "Working…"}
            </span>
          </div>
          <ProgressBar value={upload.progress} label={`Uploading ${upload.fileName}`} indeterminate={upload.phase !== "uploading"} />
        </div>
      ) : item.hasAttachment ? (
        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/30 p-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <FileIcon className="size-5 text-zinc-400" />
            <div className="min-w-0">
              <p className="truncate text-sm text-white">{item.attachmentFilename}</p>
              {item.attachmentSizeBytes !== null && (
                <p className="text-xs text-zinc-500">{formatBytes(item.attachmentSizeBytes)}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" onClick={download} loading={opening}>
              {!opening && <DownloadIcon />}
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={() => input.current?.click()}>
              <UploadIcon />
              Replace
            </Button>
            <Button variant="dangerGhost" size="sm" onClick={() => setConfirmRemove(true)}>
              <TrashIcon />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => input.current?.click()}>
            <UploadIcon />
            Upload attachment
          </Button>
          <span className="text-xs text-zinc-500">{describeExtensions(CASE_ATTACHMENT_EXTENSIONS)}</span>
        </div>
      )}

      {upload.error && (
        <Alert tone="error" title={`Couldn't upload ${upload.fileName ?? "the file"}`}>
          {upload.error}
        </Alert>
      )}

      <ConfirmDialog
        open={confirmRemove}
        title="Remove the attachment?"
        description={`Teams will no longer be able to download ${item.attachmentFilename ?? "it"}.`}
        confirmLabel="Remove"
        busy={removeAttachment.isPending}
        onConfirm={remove}
        onClose={() => setConfirmRemove(false)}
      />
    </div>
  );
}
