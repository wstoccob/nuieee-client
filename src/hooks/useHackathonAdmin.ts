import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hackathonAdminApi } from "@/api/hackathonAdmin";
import { CASE_ATTACHMENT_EXTENSIONS } from "@/config/hackathon";
import { useDirectUpload } from "./useDirectUpload";
import type { BigEventAdmin, BigEventWrite, Case, CaseWrite, PostUploadTarget } from "@/dtos/hackathon";

const ADMIN_EVENTS_KEY = ["admin", "big-events"] as const;
const eventKey = (id: string) => [...ADMIN_EVENTS_KEY, id] as const;
const casesKey = (eventId: string) => [...eventKey(eventId), "cases"] as const;
const teamsKey = (eventId: string) => [...eventKey(eventId), "teams"] as const;

export function useAdminHackathons() {
  return useQuery({ queryKey: ADMIN_EVENTS_KEY, queryFn: hackathonAdminApi.listEvents });
}

export function useAdminHackathon(id: string | undefined) {
  return useQuery({
    queryKey: eventKey(id ?? ""),
    queryFn: () => hackathonAdminApi.getEvent(id!),
    enabled: Boolean(id),
  });
}

function useInvalidateEvents() {
  const queryClient = useQueryClient();
  return (saved?: BigEventAdmin) => {
    if (saved) queryClient.setQueryData(eventKey(saved.id), saved);
    // Featuring one event un-features another, and public pages read the same data.
    queryClient.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY, exact: true });
    queryClient.invalidateQueries({ queryKey: ["big-events"] });
  };
}

export function useCreateHackathon() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (payload: BigEventWrite) => hackathonAdminApi.createEvent(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateHackathon(id: string) {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (payload: BigEventWrite) => hackathonAdminApi.updateEvent(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteHackathon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hackathonAdminApi.deleteEvent(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: eventKey(id) });
      queryClient.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY, exact: true });
      queryClient.invalidateQueries({ queryKey: ["big-events"] });
    },
  });
}

export function useAdminCases(eventId: string) {
  return useQuery({
    queryKey: casesKey(eventId),
    queryFn: () => hackathonAdminApi.listCases(eventId),
  });
}

function useCaseCacheWriter(eventId: string) {
  const queryClient = useQueryClient();
  return useCallback(
    (updated: Case) =>
      queryClient.setQueryData<Case[]>(casesKey(eventId), (cases = []) =>
        cases.some((c) => c.id === updated.id)
          ? cases.map((c) => (c.id === updated.id ? updated : c))
          : [...cases, updated]
      ),
    [queryClient, eventId]
  );
}

export function useCreateCase(eventId: string) {
  const writeCase = useCaseCacheWriter(eventId);
  return useMutation({
    mutationFn: (payload: CaseWrite) => hackathonAdminApi.createCase(eventId, payload),
    onSuccess: writeCase,
  });
}

export function useUpdateCase(eventId: string) {
  const writeCase = useCaseCacheWriter(eventId);
  return useMutation({
    mutationFn: ({ caseId, payload }: { caseId: string; payload: CaseWrite }) =>
      hackathonAdminApi.updateCase(caseId, payload),
    onSuccess: writeCase,
  });
}

export function useDeleteCase(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caseId: string) => hackathonAdminApi.deleteCase(caseId),
    onSuccess: (_, caseId) => {
      queryClient.setQueryData<Case[]>(casesKey(eventId), (cases = []) =>
        cases.filter((c) => c.id !== caseId)
      );
      queryClient.invalidateQueries({ queryKey: teamsKey(eventId) });
    },
  });
}

export function useRemoveCaseAttachment(eventId: string) {
  const writeCase = useCaseCacheWriter(eventId);
  return useMutation({
    mutationFn: (caseId: string) => hackathonAdminApi.removeAttachment(caseId),
    onSuccess: writeCase,
  });
}

export function useCaseAttachmentUpload(eventId: string, caseId: string) {
  const writeCase = useCaseCacheWriter(eventId);

  const requestTarget = useCallback(
    (file: File) =>
      hackathonAdminApi.attachmentTarget(caseId, { filename: file.name, sizeBytes: file.size }),
    [caseId]
  );
  const confirm = useCallback(
    (target: PostUploadTarget, file: File) =>
      hackathonAdminApi.confirmAttachment(caseId, { objectKey: target.objectKey, filename: file.name }),
    [caseId]
  );

  return useDirectUpload({
    extensions: CASE_ATTACHMENT_EXTENSIONS,
    requestTarget,
    confirm,
    onSuccess: writeCase,
  });
}

export function useAdminTeams(eventId: string) {
  return useQuery({
    queryKey: teamsKey(eventId),
    queryFn: () => hackathonAdminApi.listTeams(eventId),
  });
}

export function useRotateTeamToken() {
  return useMutation({
    mutationFn: (teamId: string) => hackathonAdminApi.rotateTeamToken(teamId),
  });
}

export function useDeleteTeam(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) => hackathonAdminApi.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamsKey(eventId) });
      queryClient.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY, exact: true });
    },
  });
}
