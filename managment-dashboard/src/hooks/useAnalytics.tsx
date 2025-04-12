import { analyticsService } from "@/services/analytics-service";
import { useQuery } from "@tanstack/react-query";

// Analytics Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  entityCounts: () => [...analyticsKeys.all, 'entityCounts'] as const,
  yearlyEventStats: (year: number) => [...analyticsKeys.all, 'yearlyEventStats', year] as const,
};

export const useCountsAnalytics = () => {
  return useQuery({
    queryKey: analyticsKeys.entityCounts(),
    queryFn: analyticsService.getEntityCounts,
  });
};

export const useYearlyEventStats = (year: number) => {
  return useQuery({
    queryKey: analyticsKeys.yearlyEventStats(year),
    queryFn: () => analyticsService.getYearlyEventStats(year),
    enabled: !!year,
  });
};
