import { EntityCount, YearlyEventStatsDTO } from '@/types';
import apiClient from './api-client';

export const analyticsService = {
  getEntityCounts: async (): Promise<EntityCount> => {
    const response = await apiClient.get<EntityCount>('/Analytics/counts');
    return response.data;
  },

  getYearlyEventStats: async (year: number): Promise<YearlyEventStatsDTO> => {
    const response = await apiClient.get<YearlyEventStatsDTO>(`/Analytics/events/monthly/${year}`);
    return response.data;
  }
};
