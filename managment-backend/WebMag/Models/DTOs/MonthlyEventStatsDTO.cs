using System.Collections.Generic;

namespace WebMag.Models.DTOs;

public class MonthlyEventStatsDTO
{
    public int Month { get; set; }
    public string MonthName { get; set; }
    public int EventCount { get; set; }
}

public class YearlyEventStatsDTO
{
    public int Year { get; set; }
    public List<MonthlyEventStatsDTO> MonthlyStats { get; set; }
}
