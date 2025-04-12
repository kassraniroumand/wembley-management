import apiClient from './api-client';
import {
  CreateEventConfigurationDTO,
  EventConfigurationDTO,
  UpdateEventConfigurationDTO
} from '../types';

export const eventConfigurationService = {
  getConfigurationsForEvent: async (eventId: number): Promise<EventConfigurationDTO[]> => {
    const response = await apiClient.get<EventConfigurationDTO[]>(`/events/configurations/event/${eventId}`);
    return response.data;
  },

  getConfigurationById: async (id: number): Promise<EventConfigurationDTO> => {
    const response = await apiClient.get<EventConfigurationDTO>(`/events/configurations/${id}`);
    return response.data;
  },

  getConfigurationsByType: async (eventId: number, configurationType: string): Promise<EventConfigurationDTO[]> => {
    const response = await apiClient.get<EventConfigurationDTO[]>(
      `/events/configurations/event/${eventId}/type/${configurationType}`
    );
    return response.data;
  },

  createConfiguration: async (configuration: CreateEventConfigurationDTO): Promise<EventConfigurationDTO> => {
    const response = await apiClient.post<EventConfigurationDTO>('/events/configurations', configuration);
    return response.data;
  },

  updateConfiguration: async (id: number, configuration: UpdateEventConfigurationDTO): Promise<EventConfigurationDTO> => {
    const response = await apiClient.put<EventConfigurationDTO>(`/events/configurations/${id}`, configuration);
    return response.data;
  },

  deleteConfiguration: async (id: number): Promise<void> => {
    await apiClient.delete(`/events/configurations/${id}`);
  }
};
