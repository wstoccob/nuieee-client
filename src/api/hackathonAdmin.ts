import client from "./client";
import type { AdminTeam, BigEventAdmin, BigEventWrite } from "@/dtos/hackathon";

export type TeamsExportFormat = "xlsx" | "csv";

export const hackathonAdminApi = {
  async listEvents(): Promise<BigEventAdmin[]> {
    const { data } = await client.get<BigEventAdmin[]>("/admin/big-events");
    return data;
  },

  async getEvent(id: string): Promise<BigEventAdmin> {
    const { data } = await client.get<BigEventAdmin>(`/admin/big-events/${id}`);
    return data;
  },

  async createEvent(payload: BigEventWrite): Promise<BigEventAdmin> {
    const { data } = await client.post<BigEventAdmin>("/admin/big-events", payload);
    return data;
  },

  async updateEvent(id: string, payload: BigEventWrite): Promise<BigEventAdmin> {
    const { data } = await client.put<BigEventAdmin>(`/admin/big-events/${id}`, payload);
    return data;
  },

  async deleteEvent(id: string): Promise<void> {
    await client.delete(`/admin/big-events/${id}`);
  },

  async listTeams(eventId: string): Promise<AdminTeam[]> {
    const { data } = await client.get<AdminTeam[]>(`/admin/big-events/${eventId}/teams`);
    return data;
  },

  async teamsExport(eventId: string, format: TeamsExportFormat): Promise<Blob> {
    const { data } = await client.get<Blob>(`/admin/big-events/${eventId}/teams.${format}`, {
      responseType: "blob",
    });
    return data;
  },

  async deleteTeam(teamId: string): Promise<void> {
    await client.delete(`/admin/teams/${teamId}`);
  },
};
