import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "@/api/events";
import type { EventInput } from "@/dtos/event";

const EVENTS_KEY = ["events"] as const;

export function useEvents(limit?: number) {
  return useQuery({
    queryKey: [...EVENTS_KEY, { limit }],
    queryFn: () => eventsApi.list(limit),
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: [...EVENTS_KEY, id],
    queryFn: () => eventsApi.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EventInput) => eventsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
}
