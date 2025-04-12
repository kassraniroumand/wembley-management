// Analytics Types

// Entity Count DTO
export interface EntityCount {
  categoryCount: number;
  eventCount: number;
  resourceCount: number;
  resourceAllocationCount: number;
  eventConfigurationCount: number;
  eventTypeCount: number;
  organizerCount: number;
  eventTypeResourceCount: number;
}

// Monthly Event Stats DTO
export interface MonthlyEventStats {
  month: number;
  year: number;
  count: number;
  tentativeCount: number;
  confirmedCount: number;
  cancelledCount: number;
  completedCount: number;
}

// Yearly Event Stats DTO
export interface YearlyEventStatsDTO {
  year: number;
  totalEvents: number;
  monthlyStats: MonthlyEventStats[];
  eventTypeDistribution: {
    eventTypeId: number;
    eventTypeName: string;
    count: number;
  }[];
  statusDistribution: {
    status: number;
    statusName: string;
    count: number;
  }[];
  organizerDistribution: {
    organizerId: string;
    organizerName: string;
    count: number;
  }[];
}
