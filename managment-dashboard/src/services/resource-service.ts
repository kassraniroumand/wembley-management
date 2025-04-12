import apiClient from './api-client';
import {
  CreateResourceDTO,
  CreateResourceAllocationDTO,
  ResourceAvailabilityRequestDTO,
  ResourceAvailabilityResponseDTO,
  ResourceDTO,
  ResourceAllocationDTO,
  ResourceAllocationListResponseDTO,
  ResourceListResponseDTO,
  UpdateResourceDTO,
  UpdateResourceAllocationDTO
} from '../types';

export const resourceService = {
  // Resource endpoints
  getAllResources: async (page = 1, pageSize = 20): Promise<ResourceListResponseDTO> => {
    const response = await apiClient.get<ResourceListResponseDTO>(`/resource?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  getResourceById: async (id: number): Promise<ResourceDTO> => {
    const response = await apiClient.get<ResourceDTO>(`/resource/${id}`);
    return response.data;
  },

  getResourcesByType: async (type: string, page = 1, pageSize = 20): Promise<ResourceListResponseDTO> => {
    const response = await apiClient.get<ResourceListResponseDTO>(
      `/resource/type/${type}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  createResource: async (resource: CreateResourceDTO): Promise<ResourceDTO> => {
    const response = await apiClient.post<ResourceDTO>('/resource', resource);
    return response.data;
  },

  updateResource: async (id: number, resource: UpdateResourceDTO): Promise<ResourceDTO> => {
    const response = await apiClient.put<ResourceDTO>(`/resource/${id}`, resource);
    return response.data;
  },

  deleteResource: async (id: number): Promise<void> => {
    await apiClient.delete(`/resource/${id}`);
  },

  // Resource allocation endpoints
  getResourceAllocations: async (resourceId: number, startDate?: Date, endDate?: Date): Promise<ResourceAllocationListResponseDTO> => {
    let url = `/resource/${resourceId}/allocations`;

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await apiClient.get<ResourceAllocationListResponseDTO>(url);
    return response.data;
  },

  createResourceAllocation: async (allocation: CreateResourceAllocationDTO): Promise<ResourceAllocationDTO> => {
    const response = await apiClient.post<ResourceAllocationDTO>('/resource/allocations', allocation);
    return response.data;
  },

  updateResourceAllocation: async (id: number, allocation: UpdateResourceAllocationDTO): Promise<ResourceAllocationDTO> => {
    const response = await apiClient.put<ResourceAllocationDTO>(`/resource/allocations/${id}`, allocation);
    return response.data;
  },

  deleteResourceAllocation: async (id: number): Promise<void> => {
    await apiClient.delete(`/resource/allocations/${id}`);
  },

  // Resource availability
  checkResourceAvailability: async (request: ResourceAvailabilityRequestDTO): Promise<ResourceAvailabilityResponseDTO> => {
    const response = await apiClient.post<ResourceAvailabilityResponseDTO>('/resource/check-availability', request);
    return response.data;
  }
};
