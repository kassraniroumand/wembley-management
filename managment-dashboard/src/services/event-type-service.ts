import apiClient from './api-client';
import {
  CreateEventTypeDTO,
  CreateEventTypeResourceDTO,
  EventTypeDTO,
  EventTypeListResponseDTO,
  EventTypeResourceDTO,
  EventTypeWithResourcesDTO,
  UpdateEventTypeDTO,
  UpdateEventTypeResourceDTO
} from '../types';

export const eventTypeService = {
  getAllEventTypes: async (page = 1, pageSize = 20): Promise<EventTypeListResponseDTO> => {
    const response = await apiClient.get<EventTypeListResponseDTO>(`/eventtype?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  getEventTypeById: async (id: number): Promise<EventTypeDTO> => {
    const response = await apiClient.get<EventTypeDTO>(`/eventtype/${id}`);
    return response.data;
  },

  getEventTypeWithResources: async (id: number): Promise<EventTypeWithResourcesDTO> => {
    const response = await apiClient.get<EventTypeWithResourcesDTO>(`/eventtype/${id}/with-resources`);
    return response.data;
  },

  getEventTypesByCategory: async (category: string, page = 1, pageSize = 20): Promise<EventTypeListResponseDTO> => {
    const response = await apiClient.get<EventTypeListResponseDTO>(
      `/eventtype/category/${category}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  createEventType: async (eventType: CreateEventTypeDTO): Promise<EventTypeDTO> => {
    const response = await apiClient.post<EventTypeDTO>('/eventtype', eventType);
    return response.data;
  },

  updateEventType: async (id: number, eventType: UpdateEventTypeDTO): Promise<EventTypeDTO> => {
    const response = await apiClient.put<EventTypeDTO>(`/eventtype/${id}`, eventType);
    return response.data;
  },

  deleteEventType: async (id: number): Promise<void> => {
    await apiClient.delete(`/eventtype/${id}`);
  },

  // Default resources
  getEventTypeResources: async (eventTypeId: number): Promise<EventTypeResourceDTO[]> => {
    const response = await apiClient.get<EventTypeResourceDTO[]>(`/eventtype/${eventTypeId}/resources`);
    return response.data;
  },

  addDefaultResource: async (resource: CreateEventTypeResourceDTO): Promise<EventTypeResourceDTO> => {
    const response = await apiClient.post<EventTypeResourceDTO>('/eventtype/resources', resource);
    return response.data;
  },

  updateDefaultResource: async (id: number, resource: UpdateEventTypeResourceDTO): Promise<EventTypeResourceDTO> => {
    const response = await apiClient.put<EventTypeResourceDTO>(`/eventtype/resources/${id}`, resource);
    return response.data;
  },

  removeDefaultResource: async (id: number): Promise<void> => {
    await apiClient.delete(`/eventtype/resources/${id}`);
  }
};
