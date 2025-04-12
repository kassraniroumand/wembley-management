import * as z from "zod";

export const resourceFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  type: z.string()
    .min(2, { message: "Type must be at least 2 characters" })
    .max(50, { message: "Type must be less than 50 characters" }),
  isLimited: z.boolean(),
  maxQuantity: z.number()
    .int({ message: "Quantity must be a whole number" })
    .min(1, { message: "Quantity must be at least 1" })
    .optional()
    .nullable()
    .refine(
      (val) => !val || val >= 1,
      { message: "If specified, max quantity must be at least 1" }
    ),
  notes: z.string().max(500, { message: "Notes must be less than 500 characters" }).optional(),
}).refine(
  (data) => {
    // If isLimited is true, maxQuantity must not be null
    return !data.isLimited || (data.maxQuantity !== null && data.maxQuantity !== undefined);
  },
  {
    message: "Max quantity is required for limited resources",
    path: ["maxQuantity"], // Path to the field that has the error
  }
);

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;

// Common resource types for select dropdown
export const commonResourceTypes = [
  "Venue",
  "Equipment",
  "Staff",
  "Vehicle",
  "Technology",
  "Furniture",
  "Catering",
  "Decor",
  "Security",
  "Other"
];
