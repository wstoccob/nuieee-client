import client from "./client";
import type { User } from "@/dtos/user";

interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export const authApi = {
  async login(username: string, password: string): Promise<TokenResponse> {
    const { data } = await client.post<TokenResponse>("/auth/login", {
      username,
      password,
    });
    return data;
  },

  async me(): Promise<User> {
    const { data } = await client.get<User>("/auth/me");
    return data;
  },
};
