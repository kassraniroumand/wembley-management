import * as z from "zod";

export const eventTypeFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  description: z.string().max(500, { message: "Description must be less than 500 characters" }).optional(),
  category: z.string()
    .min(2, { message: "Category must be at least 2 characters" })
    .max(50, { message: "Category must be less than 50 characters" }),
  defaultCapacity: z.number()
    .int({ message: "Capacity must be a whole number" })
    .min(1, { message: "Capacity must be at least 1" }),
  setupDays: z.number()
    .int({ message: "Setup days must be a whole number" })
    .min(0, { message: "Setup days must be 0 or more" }),
  teardownDays: z.number()
    .int({ message: "Teardown days must be a whole number" })
    .min(0, { message: "Teardown days must be 0 or more" }),
  requiresPitchAccess: z.boolean(),
  defaultConfigurations: z.string().max(1000, { message: "Default configurations must be less than 1000 characters" }).optional(),
});

export type EventTypeFormValues = z.infer<typeof eventTypeFormSchema>;

// Helper for resource allocations in event types
export const eventTypeResourceSchema = z.object({
  resourceId: z.number(),
  quantity: z.number()
    .int({ message: "Quantity must be a whole number" })
    .min(1, { message: "Quantity must be at least 1" }),
});

export type EventTypeResourceFormValues = z.infer<typeof eventTypeResourceSchema>;
