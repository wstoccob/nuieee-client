import client from "./client";
import type { Event, EventInput } from "@/dtos/event";

export const eventsApi = {
  async list(limit?: number): Promise<Event[]> {
    const { data } = await client.get<Event[]>("/events", {
      params: limit ? { limit } : undefined,
    });
    return data;
  },

  async get(id: string): Promise<Event> {
    const { data } = await client.get<Event>(`/events/${id}`);
    return data;
  },

  async create(payload: EventInput): Promise<Event> {
    const { data } = await client.post<Event>("/events", payload);
    return data;
  },

  async update(id: string, payload: EventInput): Promise<Event> {
    const { data } = await client.put<Event>(`/events/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await client.delete(`/events/${id}`);
  },
};
