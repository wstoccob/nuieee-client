import { useEffect } from "react";
import { toast } from "sonner";
import { SUBMISSION_EXTENSIONS } from "@/config/hackathon";
import { useSubmissionUpload } from "@/hooks/useHackathonTeam";
import { formatDateTime, formatRelative, isFuture } from "@/lib/datetime";
import { describeExtensions, formatBytes } from "@/lib/files";
import type { Submission, TeamDashboard } from "@/dtos/hackathon";
import type { UploadPhase } from "@/hooks/useDirectUpload";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Card, CardHeader } from "../ui/Card";
import { Dropzone } from "../ui/Dropzone";
import { ProgressBar } from "../ui/ProgressBar";
import { EmptyState } from "../ui/states";
import { ClockIcon, FileIcon, LockIcon, UploadIcon } from "../ui/icons";

export function SubmittedFile({ submission }: { submission: Submission }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-300">
        <FileIcon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white" title={submission.originalFilename}>
          {submission.originalFilename}
        </p>
        <p className="text-xs text-zinc-500">
          {formatBytes(submission.sizeBytes)} · submitted {formatDateTime(submission.submittedAt)}
        </p>
      </div>
      <Badge tone="green">Submitted</Badge>
    </div>
  );
}

const PHASE_LABEL: Record<UploadPhase, string> = {
  idle: "",
  preparing: "Preparing upload…",
  uploading: "Uploading",
  finishing: "Saving your submission…",
  error: "",
};

function UploadProgress({ fileName, phase, progress }: { fileName: string; phase: UploadPhase; progress: number }) {
  const label = phase === "uploading" ? `${PHASE_LABEL.uploading} ${Math.round(progress * 100)}%` : PHASE_LABEL[phase];
  return (
    <div className="space-y-2.5 rounded-xl border border-white/10 bg-black/30 p-4" aria-live="polite">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-medium text-white">{fileName}</span>
        <span className="shrink-0 text-zinc-400">{label}</span>
      </div>
      <ProgressBar value={progress} label={`Uploading ${fileName}`} indeterminate={phase !== "uploading"} />
      <p className="text-xs text-zinc-500">Keep this page open until the upload finishes.</p>
    </div>
  );
}

function useWarnBeforeLeaving(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [active]);
}

function OpenSubmission({ dashboard, token }: { dashboard: TeamDashboard; token: string }) {
  const { submission, submissionMaxBytes } = dashboard;
  const upload = useSubmissionUpload(token, submissionMaxBytes);
  useWarnBeforeLeaving(upload.busy);

  const onFile = async (file: File) => {
    if (await upload.upload(file)) toast.success("Your submission was uploaded");
  };

  return (
    <div className="space-y-4">
      {submission && <SubmittedFile submission={submission} />}
      {upload.busy && upload.fileName ? (
        <UploadProgress fileName={upload.fileName} phase={upload.phase} progress={upload.progress} />
      ) : (
        <Dropzone
          accept={SUBMISSION_EXTENSIONS.join(",")}
          title={submission ? "Replace your submission" : "Choose a file or drag it here"}
          hint={`${describeExtensions(SUBMISSION_EXTENSIONS)}, up to ${formatBytes(submissionMaxBytes)}`}
          onFile={onFile}
        />
      )}
      {upload.error && (
        <Alert tone="error" title={`Couldn't upload ${upload.fileName ?? "the file"}`}>
          {upload.error}
        </Alert>
      )}
      {submission && (
        <p className="text-xs text-zinc-500">Uploading a new file replaces the current one. Only the latest file is judged.</p>
      )}
    </div>
  );
}

function ClosedSubmission({ dashboard }: { dashboard: TeamDashboard }) {
  const { event, submission } = dashboard;
  if (isFuture(event.submissionsOpenAt)) {
    return (
      <EmptyState
        icon={<ClockIcon />}
        title={`Submissions open ${formatDateTime(event.submissionsOpenAt!)}`}
        description={`You'll upload one ${describeExtensions(SUBMISSION_EXTENSIONS)} file, up to ${formatBytes(dashboard.submissionMaxBytes)}.`}
      />
    );
  }
  if (!event.submissionsOpenAt) {
    return <EmptyState icon={<ClockIcon />} title="Submission dates will be announced" />;
  }
  return (
    <div className="space-y-4">
      <Alert tone="info" title="Submissions are closed">
        {submission ? "This is the file that will be judged." : "Your team didn't submit a file."}
      </Alert>
      {submission && <SubmittedFile submission={submission} />}
    </div>
  );
}

function deadlineText({ event }: TeamDashboard): string | undefined {
  if (!event.submissionsOpen || !event.submissionsCloseAt) return undefined;
  return `Deadline ${formatDateTime(event.submissionsCloseAt)} (${formatRelative(event.submissionsCloseAt)}).`;
}

export function SubmissionPanel({ dashboard, token }: { dashboard: TeamDashboard; token: string }) {
  const { event, case: chosen } = dashboard;
  const icon = event.submissionsOpen ? <UploadIcon /> : <LockIcon />;

  return (
    <Card aria-labelledby="submission-heading">
      <CardHeader id="submission-heading" icon={icon} title="Submission" description={deadlineText(dashboard)} />
      {!event.submissionsOpen ? (
        <ClosedSubmission dashboard={dashboard} />
      ) : !chosen ? (
        <EmptyState
          icon={<FileIcon />}
          title="Choose a case first"
          description="Submissions are open, but your team needs to pick a case before uploading."
        />
      ) : (
        <OpenSubmission dashboard={dashboard} token={token} />
      )}
    </Card>
  );
}
