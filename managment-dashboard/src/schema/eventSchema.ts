import * as z from "zod";
import { EventStatus } from "@/types";

export const eventFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  description: z.string().max(500, { message: "Description must be less than 500 characters" }).optional(),
  eventTypeId: z.number({ required_error: "Event type is required" }),
  startDate: z.string({ required_error: "Start date is required" }),
  endDate: z.string({ required_error: "End date is required" }),
  plannedCapacity: z.number()
    .int({ message: "Capacity must be a whole number" })
    .min(1, { message: "Capacity must be at least 1" })
    .optional(),
  organizerId: z.string({ required_error: "Organizer is required" }),
  status: z.nativeEnum(EventStatus),
  notes: z.string().max(1000, { message: "Notes must be less than 1000 characters" }).optional(),
  isPublished: z.boolean(),
  useEventTypeDefaultResources: z.boolean(),
}).refine(
  (data) => new Date(data.endDate) >= new Date(data.startDate),
  {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }
);

export type EventFormValues = z.infer<typeof eventFormSchema>;
