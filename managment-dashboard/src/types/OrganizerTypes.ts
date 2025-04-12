// Enums first (from C# models)
export enum OrganizerType {
  FootballAssociation = 0,
  ConcertPromoter = 1,
  CorporateClient = 2,
  CharityOrganization = 3,
  InternalTeam = 4
}

// Organizer DTOs
export interface OrganizerDTO {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  type: OrganizerType;
  notes?: string;
}

export interface CreateOrganizerDTO {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  type: OrganizerType;
  notes?: string;
}

export interface UpdateOrganizerDTO {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  type: OrganizerType;
  notes?: string;
}

export interface OrganizerListResponseDTO {
  organizers: OrganizerDTO[];
  totalCount: number;
}

export interface OrganizerWithEventsDTO {
  organizer: OrganizerDTO;
  events: EventDTO[];
  totalEventCount: number;
}

// Import from EventTypes.ts
import { EventDTO } from './EventTypes';
