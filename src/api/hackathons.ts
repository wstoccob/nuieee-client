import client from "./client";
import type { BigEvent, RegistrationResult, TeamRegistration } from "@/dtos/hackathon";

export const hackathonsApi = {
  async featured(): Promise<BigEvent | null> {
    const { data, status } = await client.get<BigEvent | "">("/big-events/featured");
    return status === 204 || !data ? null : data;
  },

  async get(slug: string): Promise<BigEvent> {
    const { data } = await client.get<BigEvent>(`/big-events/${encodeURIComponent(slug)}`);
    return data;
  },

  async registerTeam(slug: string, payload: TeamRegistration): Promise<RegistrationResult> {
    const { data } = await client.post<RegistrationResult>(
      `/big-events/${encodeURIComponent(slug)}/teams`,
      payload
    );
    return data;
  },
};
