import apiClient from './api-client';
import {
  CreateOrganizerDTO,
  OrganizerDTO,
  OrganizerListResponseDTO,
  OrganizerWithEventsDTO,
  UpdateOrganizerDTO
} from '../types';

export const organizerService = {
  getOrganizers: async (page = 1, pageSize = 20, searchTerm?: string): Promise<OrganizerListResponseDTO> => {
    let url = `/organizer?page=${page}&pageSize=${pageSize}`;
    if (searchTerm) {
      url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }
    const response = await apiClient.get<OrganizerListResponseDTO>(url);
    return response.data;
  },

  getOrganizerById: async (id: string): Promise<OrganizerDTO> => {
    const response = await apiClient.get<OrganizerDTO>(`/organizer/${id}`);
    return response.data;
  },

  getOrganizerWithEvents: async (id: string, page = 1, pageSize = 10): Promise<OrganizerWithEventsDTO> => {
    const response = await apiClient.get<OrganizerWithEventsDTO>(
      `/organizer/${id}/with-events?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  getEventCount: async (id: string): Promise<number> => {
    const response = await apiClient.get<number>(`/organizer/${id}/event-count`);
    return response.data;
  },

  isNameUnique: async (name: string, excludeId?: string): Promise<boolean> => {
    let url = `/Organizer/check-name?name=${encodeURIComponent(name)}`;
    if (excludeId) {
      url += `&excludeId=${encodeURIComponent(excludeId)}`;
    }

    const response = await apiClient.get<boolean>(url);
    return response.data;
  },

  createOrganizer: async (organizer: CreateOrganizerDTO): Promise<OrganizerDTO> => {
    const response = await apiClient.post<OrganizerDTO>('/organizer', organizer);
    return response.data;
  },

  updateOrganizer: async (id: string, organizer: UpdateOrganizerDTO): Promise<OrganizerDTO> => {
    const response = await apiClient.put<OrganizerDTO>(`/organizer/${id}`, organizer);
    return response.data;
  },

  deleteOrganizer: async (id: string): Promise<void> => {
    await apiClient.delete(`/organizer/${id}`);
  }
};
