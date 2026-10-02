import axios from "axios";
import client, { API_BASE_URL } from "./client";
import type {
  BigEvent,
  DownloadLink,
  PostUploadTarget,
  RegistrationResult,
  TeamDashboard,
  TeamRegistration,
  UploadConfirm,
  UploadRequest,
} from "@/dtos/hackathon";

// Team endpoints authenticate with X-Team-Token rather than the admin session, so they get
// their own instance: a rejected team link must never trigger the admin login redirect.
const teamClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const asTeam = (token: string) => ({ headers: { "X-Team-Token": token } });

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

export const teamApi = {
  async dashboard(token: string): Promise<TeamDashboard> {
    const { data } = await teamClient.get<TeamDashboard>("/team", asTeam(token));
    return data;
  },

  async selectCase(token: string, caseId: string): Promise<TeamDashboard> {
    const { data } = await teamClient.put<TeamDashboard>("/team/case", { caseId }, asTeam(token));
    return data;
  },

  async caseAttachmentUrl(token: string, caseId: string): Promise<string> {
    const { data } = await teamClient.get<DownloadLink>(
      `/team/cases/${caseId}/attachment`,
      asTeam(token)
    );
    return data.url;
  },

  async submissionTarget(token: string, payload: UploadRequest): Promise<PostUploadTarget> {
    const { data } = await teamClient.post<PostUploadTarget>(
      "/team/submission/upload-target",
      payload,
      asTeam(token)
    );
    return data;
  },

  async confirmSubmission(token: string, payload: UploadConfirm): Promise<TeamDashboard> {
    const { data } = await teamClient.put<TeamDashboard>("/team/submission", payload, asTeam(token));
    return data;
  },
};
