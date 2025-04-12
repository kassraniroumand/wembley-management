import apiClient from './api-client';
import {
  CreateEventDTO,
  EventDTO,
  EventDetailsDTO,
  EventListResponseDTO,
  UpdateEventDTO
} from '../types';

export const eventService = {
  getEvents: async (
    page = 1,
    pageSize = 20,
    fromDate?: Date,
    toDate?: Date,
    searchTerm?: string
  ): Promise<EventListResponseDTO> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (fromDate) params.append('fromDate', fromDate.toISOString());
    if (toDate) params.append('toDate', toDate.toISOString());
    if (searchTerm) params.append('searchTerm', searchTerm);

    const response = await apiClient.get<EventListResponseDTO>(`/event?${params.toString()}`);
    return response.data;
  },

  getEventById: async (id: number): Promise<EventDetailsDTO> => {
    const response = await apiClient.get<EventDetailsDTO>(`/event/${id}`);
    return response.data;
  },

  createEvent: async (event: CreateEventDTO): Promise<EventDTO> => {
    const response = await apiClient.post<EventDTO>('/event', event);
    return response.data;
  },

  updateEvent: async (id: number, event: UpdateEventDTO): Promise<EventDTO> => {
    const response = await apiClient.put<EventDTO>(`/event/${id}`, event);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await apiClient.delete(`/event/${id}`);
  },

  publishEvent: async (id: number): Promise<void> => {
    await apiClient.post(`/event/${id}/publish`);
  },

  unpublishEvent: async (id: number): Promise<void> => {
    await apiClient.post(`/event/${id}/unpublish`);
  }
};
