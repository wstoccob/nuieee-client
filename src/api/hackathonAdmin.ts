import client from "./client";
import type {
  AdminTeam,
  BigEventAdmin,
  BigEventWrite,
  Case,
  CaseWrite,
  DownloadLink,
  PostUploadTarget,
  UploadConfirm,
  UploadRequest,
} from "@/dtos/hackathon";

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

  async listCases(eventId: string): Promise<Case[]> {
    const { data } = await client.get<Case[]>(`/admin/big-events/${eventId}/cases`);
    return data;
  },

  async createCase(eventId: string, payload: CaseWrite): Promise<Case> {
    const { data } = await client.post<Case>(`/admin/big-events/${eventId}/cases`, payload);
    return data;
  },

  async updateCase(caseId: string, payload: CaseWrite): Promise<Case> {
    const { data } = await client.put<Case>(`/admin/cases/${caseId}`, payload);
    return data;
  },

  async deleteCase(caseId: string): Promise<void> {
    await client.delete(`/admin/cases/${caseId}`);
  },

  async attachmentTarget(caseId: string, payload: UploadRequest): Promise<PostUploadTarget> {
    const { data } = await client.post<PostUploadTarget>(
      `/admin/cases/${caseId}/attachment/upload-target`,
      payload
    );
    return data;
  },

  async confirmAttachment(caseId: string, payload: UploadConfirm): Promise<Case> {
    const { data } = await client.put<Case>(`/admin/cases/${caseId}/attachment`, payload);
    return data;
  },

  async removeAttachment(caseId: string): Promise<Case> {
    const { data } = await client.delete<Case>(`/admin/cases/${caseId}/attachment`);
    return data;
  },

  async attachmentUrl(caseId: string): Promise<string> {
    const { data } = await client.get<DownloadLink>(`/admin/cases/${caseId}/attachment`);
    return data.url;
  },

  async listTeams(eventId: string): Promise<AdminTeam[]> {
    const { data } = await client.get<AdminTeam[]>(`/admin/big-events/${eventId}/teams`);
    return data;
  },

  async teamsCsv(eventId: string): Promise<Blob> {
    const { data } = await client.get<Blob>(`/admin/big-events/${eventId}/teams.csv`, {
      responseType: "blob",
    });
    return data;
  },

  async rotateTeamToken(teamId: string): Promise<string> {
    const { data } = await client.post<{ accessToken: string }>(
      `/admin/teams/${teamId}/access-token`
    );
    return data.accessToken;
  },

  async deleteTeam(teamId: string): Promise<void> {
    await client.delete(`/admin/teams/${teamId}`);
  },

  async submissionUrl(teamId: string): Promise<string> {
    const { data } = await client.get<DownloadLink>(`/admin/teams/${teamId}/submission`);
    return data.url;
  },
};
