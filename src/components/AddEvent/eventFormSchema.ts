import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(2, "Title too short").max(200),
  description: z.string().min(10, "Description too short").max(5000),
  startsAt: z.string().min(1, "Event date and time is required"),
  registrationLink: z.union([z.string().url("Invalid URL"), z.literal("")]),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
