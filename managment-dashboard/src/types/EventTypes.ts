// Enums first (from C# models)
export enum EventStatus {
  Tentative = 0,
  Confirmed = 1,
  Cancelled = 2,
  Completed = 3
}

// Event DTOs
export interface EventDTO {
  id: number;
  name: string;
  description?: string;
  eventTypeId: number;
  eventTypeName?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  setupStartDate: string; // ISO date string
  teardownEndDate: string; // ISO date string
  plannedCapacity: number;
  organizerId: string;
  organizerName?: string;
  status: EventStatus;
  notes?: string;
  isPublished: boolean;
}

export interface CreateEventDTO {
  name: string;
  description?: string;
  eventTypeId: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  setupStartDate?: string; // ISO date string
  teardownEndDate?: string; // ISO date string
  plannedCapacity?: number;
  organizerId: string;
  status: EventStatus;
  notes?: string;
  isPublished: boolean;
  useEventTypeDefaultResources: boolean;
}

export interface UpdateEventDTO {
  name: string;
  description?: string;
  eventTypeId: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  setupStartDate: string; // ISO date string
  teardownEndDate: string; // ISO date string
  plannedCapacity: number;
  organizerId: string;
  status: EventStatus;
  notes?: string;
  isPublished: boolean;
}

export interface EventListResponseDTO {
  events: EventDTO[];
  totalCount: number;
}

export interface EventDetailsDTO {
  event: EventDTO;
  resourceAllocations: ResourceAllocationDTO[];
  configurations: EventConfigurationDTO[];
}

// Event Configuration DTOs
export interface EventConfigurationDTO {
  id: number;
  eventId: number;
  configurationType: string;
  value: string;
}

export interface CreateEventConfigurationDTO {
  eventId: number;
  configurationType: string;
  value: string;
}

export interface UpdateEventConfigurationDTO {
  value: string;
}

// Import from ResourceTypes.ts
import { ResourceAllocationDTO } from './ResourceTypes';
