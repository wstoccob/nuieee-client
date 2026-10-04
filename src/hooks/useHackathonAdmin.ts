import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hackathonAdminApi } from "@/api/hackathonAdmin";
import type { BigEventAdmin, BigEventWrite } from "@/dtos/hackathon";

const ADMIN_EVENTS_KEY = ["admin", "big-events"] as const;
const eventKey = (id: string) => [...ADMIN_EVENTS_KEY, id] as const;
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

export function useAdminTeams(eventId: string) {
  return useQuery({
    queryKey: teamsKey(eventId),
    queryFn: () => hackathonAdminApi.listTeams(eventId),
  });
}

export function useDeleteTeam(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId: string) => hackathonAdminApi.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamsKey(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKey(eventId), exact: true });
      queryClient.invalidateQueries({ queryKey: ADMIN_EVENTS_KEY, exact: true });
    },
  });
}
