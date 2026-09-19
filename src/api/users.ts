import client from "./client";
import type { User, UserInput } from "@/dtos/user";

export const usersApi = {
  async list(): Promise<User[]> {
    const { data } = await client.get<User[]>("/users");
    return data;
  },

  async create(payload: UserInput): Promise<User> {
    const { data } = await client.post<User>("/users", payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await client.delete(`/users/${id}`);
  },
};
