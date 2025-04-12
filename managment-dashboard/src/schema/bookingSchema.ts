import { z } from "zod";

export const bookingSchema = z.object({
  eventId: z.number({
    required_error: "Please select an event",
    invalid_type_error: "Event ID must be a number",
  }),
  ticketCount: z
    .number({
      required_error: "Please enter the number of tickets",
      invalid_type_error: "Ticket count must be a number",
    })
    .min(1, "You must book at least 1 ticket")
    .max(10, "You can book at most 10 tickets per booking"),
  notes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
