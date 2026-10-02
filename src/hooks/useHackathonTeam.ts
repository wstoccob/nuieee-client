import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "@/api/hackathons";
import { errorStatus } from "@/api/client";
import { SUBMISSION_EXTENSIONS } from "@/config/hackathon";
import { useDirectUpload } from "./useDirectUpload";
import type { PostUploadTarget, TeamDashboard } from "@/dtos/hackathon";

const teamKey = (token: string | null) => ["hackathon-team", token] as const;

export function useTeamDashboard(token: string | null) {
  return useQuery({
    queryKey: teamKey(token),
    queryFn: () => teamApi.dashboard(token!),
    enabled: Boolean(token),
    retry: (failureCount, error) => errorStatus(error) !== 401 && failureCount < 1,
  });
}

export function useSelectCase(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caseId: string) => teamApi.selectCase(token, caseId),
    onSuccess: (dashboard) => queryClient.setQueryData(teamKey(token), dashboard),
  });
}

export function useSubmissionUpload(token: string, maxBytes: number) {
  const queryClient = useQueryClient();

  const requestTarget = useCallback(
    (file: File) => teamApi.submissionTarget(token, { filename: file.name, sizeBytes: file.size }),
    [token]
  );
  const confirm = useCallback(
    (target: PostUploadTarget, file: File) =>
      teamApi.confirmSubmission(token, { objectKey: target.objectKey, filename: file.name }),
    [token]
  );
  const onSuccess = useCallback(
    (dashboard: TeamDashboard) => queryClient.setQueryData(teamKey(token), dashboard),
    [queryClient, token]
  );

  return useDirectUpload({
    extensions: SUBMISSION_EXTENSIONS,
    maxBytes,
    requestTarget,
    confirm,
    onSuccess,
  });
}
