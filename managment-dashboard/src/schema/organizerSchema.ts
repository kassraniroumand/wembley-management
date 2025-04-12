import * as z from "zod";
import { OrganizerType } from "@/types/OrganizerTypes";

export const organizerFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  contactPerson: z.string().max(100, { message: "Contact person must be less than 100 characters" }).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal("")),
  phone: z.string().max(20, { message: "Phone must be less than 20 characters" }).optional().or(z.literal("")),
  type: z.nativeEnum(OrganizerType),
  notes: z.string().max(500, { message: "Notes must be less than 500 characters" }).optional().or(z.literal(""))
});

export type OrganizerFormValues = z.infer<typeof organizerFormSchema>;

// Helper function to get organizer type display names
export function getOrganizerTypeDisplayName(type: OrganizerType): string {
  switch (type) {
    case OrganizerType.FootballAssociation:
      return "Football Association";
    case OrganizerType.ConcertPromoter:
      return "Concert Promoter";
    case OrganizerType.CorporateClient:
      return "Corporate Client";
    case OrganizerType.CharityOrganization:
      return "Charity Organization";
    case OrganizerType.InternalTeam:
      return "Internal Team";
    default:
      return "Unknown";
  }
}

// Create options array for the select input
export const organizerTypeOptions = Object.values(OrganizerType)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value.toString(),
    label: getOrganizerTypeDisplayName(value as OrganizerType)
  }));
