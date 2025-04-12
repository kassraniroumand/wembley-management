export interface MonthlyEventStatsDTO {
    month: number;
    monthName: string;
    eventCount: number;
}

export interface YearlyEventStatsDTO {
    year: number;
    monthlyStats: MonthlyEventStatsDTO[];
}
