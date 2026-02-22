import axiosInstance from "../services/axiosInstance";
import type { EventDto, CreateEventCommand, UpdateEventCommand } from "../dtos/Events/EventDto";

// Centralized Events API wrapper
export const eventsApi = {
  async getEvents(): Promise<EventDto[]> {
    const res = await axiosInstance.get("/events");
    // Expect array of EventDto
    return res.data as EventDto[];
  },
  async getEvent(id: string): Promise<EventDto> {
    const res = await axiosInstance.get(`/events/${id}`);
    return res.data as EventDto;
  },
  async getLastEvents(count: number): Promise<EventDto[]> {
    const res = await axiosInstance.get(`/events/last/${count}`);
    return res.data as EventDto[];
  },
  async createEvent(payload: CreateEventCommand): Promise<EventDto> {
    const res = await axiosInstance.post("/events/create-event", payload);
    // Backend returns just the ID as a string, so we create a minimal EventDto object
    return {
      id: res.data as string,
    } as EventDto;
  },
  async updateEvent(payload: UpdateEventCommand): Promise<EventDto> {
    const res = await axiosInstance.put("/events/update-event", payload);
    return res.data as EventDto;
  },
  async deleteEvent(id: string): Promise<void> {
    await axiosInstance.delete(`/events/delete-event/${id}`);
  },
};

export default eventsApi;