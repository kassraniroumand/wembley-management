// Resource DTOs
export interface ResourceDTO {
  id: number;
  name: string;
  type: string;
  isLimited: boolean;
  maxQuantity?: number;
  notes?: string;
}

export interface CreateResourceDTO {
  name: string;
  type: string;
  isLimited: boolean;
  maxQuantity?: number;
  notes?: string;
}

export interface UpdateResourceDTO {
  name: string;
  type: string;
  isLimited: boolean;
  maxQuantity?: number;
  notes?: string;
}

// ResourceAllocation DTOs
export interface ResourceAllocationDTO {
  id: number;
  eventId: number;
  eventName?: string;
  resourceId: number;
  resourceName?: string;
  quantity: number;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
}

export interface CreateResourceAllocationDTO {
  eventId: number;
  resourceId: number;
  quantity: number;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
}

export interface UpdateResourceAllocationDTO {
  resourceId: number;
  quantity: number;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
}

// Response DTOs for collections
export interface ResourceListResponseDTO {
  resources: ResourceDTO[];
  totalCount: number;
}

export interface ResourceAllocationListResponseDTO {
  allocations: ResourceAllocationDTO[];
  totalCount: number;
}

// Additional DTO for availability check
export interface ResourceAvailabilityRequestDTO {
  resourceId: number;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  excludeAllocationId?: number;
}

export interface ResourceAvailabilityResponseDTO {
  isAvailable: boolean;
  conflictingAllocations: ResourceAllocationDTO[];
}
