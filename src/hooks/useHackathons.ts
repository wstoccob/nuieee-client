import { useMutation, useQuery } from "@tanstack/react-query";
import { hackathonsApi } from "@/api/hackathons";
import { errorStatus } from "@/api/client";
import type { TeamRegistration } from "@/dtos/hackathon";

const BIG_EVENTS_KEY = ["big-events"] as const;

const retryUnlessNotFound = (failureCount: number, error: Error) =>
  errorStatus(error) !== 404 && failureCount < 1;

export function useFeaturedHackathon() {
  return useQuery({
    queryKey: [...BIG_EVENTS_KEY, "featured"],
    queryFn: hackathonsApi.featured,
  });
}

export function useHackathon(slug: string | undefined) {
  return useQuery({
    queryKey: [...BIG_EVENTS_KEY, slug],
    queryFn: () => hackathonsApi.get(slug!),
    enabled: Boolean(slug),
    retry: retryUnlessNotFound,
  });
}

export function useRegisterTeam(slug: string) {
  return useMutation({
    mutationFn: (payload: TeamRegistration) => hackathonsApi.registerTeam(slug, payload),
  });
}
