// EventType DTOs
export interface EventTypeDTO {
  id: number;
  name: string;
  description?: string;
  category: string;
  defaultCapacity: number;
  setupDays: number;
  teardownDays: number;
  requiresPitchAccess: boolean;
  defaultConfigurations?: string;
}

export interface CreateEventTypeDTO {
  name: string;
  description?: string;
  category: string;
  defaultCapacity: number;
  setupDays: number;
  teardownDays: number;
  requiresPitchAccess: boolean;
  defaultConfigurations?: string;
}

export interface UpdateEventTypeDTO {
  name: string;
  description?: string;
  category: string;
  defaultCapacity: number;
  setupDays: number;
  teardownDays: number;
  requiresPitchAccess: boolean;
  defaultConfigurations?: string;
}

// Response DTO for collections
export interface EventTypeListResponseDTO {
  eventTypes: EventTypeDTO[];
  totalCount: number;
}

// EventTypeResource DTO for default resources
export interface EventTypeResourceDTO {
  id: number;
  eventTypeId: number;
  eventTypeName?: string;
  resourceId: number;
  resourceName?: string;
  quantity: number;
}

export interface CreateEventTypeResourceDTO {
  eventTypeId: number;
  resourceId: number;
  quantity: number;
}

export interface UpdateEventTypeResourceDTO {
  quantity: number;
}

export interface EventTypeWithResourcesDTO {
  eventType: EventTypeDTO;
  defaultResources: EventTypeResourceDTO[];
}
