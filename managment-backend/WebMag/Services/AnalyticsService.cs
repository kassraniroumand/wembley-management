using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMag.data;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly DomainDbContext _dbContext;

    public AnalyticsService(DomainDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<EntityCountDTO> GetEntityCountsAsync()
    {
        return new EntityCountDTO
        {
            EventCount = await GetEventCountAsync(),
            EventTypeCount = await GetEventTypeCountAsync(),
            ResourceCount = await GetResourceCountAsync(),
            ResourceAllocationCount = await GetResourceAllocationCountAsync(),
            OrganizerCount = await GetOrganizerCountAsync(),
            EventConfigurationCount = await GetEventConfigurationCountAsync(),
            EventTypeResourceCount = await GetEventTypeResourceCountAsync(),
            CategoryCount = await GetCategoryCountAsync()
        };
    }

    public async Task<int> GetEventCountAsync()
    {
        return await _dbContext.Events.CountAsync();
    }

    public async Task<int> GetEventTypeCountAsync()
    {
        return await _dbContext.EventTypes.CountAsync();
    }

    public async Task<int> GetResourceCountAsync()
    {
        return await _dbContext.Resources.CountAsync();
    }

    public async Task<int> GetResourceAllocationCountAsync()
    {
        return await _dbContext.ResourceAllocations.CountAsync();
    }

    public async Task<int> GetOrganizerCountAsync()
    {
        return await _dbContext.Organizers.CountAsync();
    }

    public async Task<int> GetEventConfigurationCountAsync()
    {
        return await _dbContext.EventConfigurations.CountAsync();
    }

    public async Task<int> GetEventTypeResourceCountAsync()
    {
        return await _dbContext.EventTypeResources.CountAsync();
    }

    public async Task<int> GetCategoryCountAsync()
    {
        return await _dbContext.Categories.CountAsync();
    }

    public async Task<YearlyEventStatsDTO> GetYearlyEventStatsAsync(int year)
    {
        var startDate = new DateTime(year, 1, 1);
        var endDate = new DateTime(year, 12, 31);

        var monthlyStats = new List<MonthlyEventStatsDTO>();

        // Get events per month
        var eventsByMonth = await _dbContext.Events
            .Where(e => e.StartDate >= startDate && e.StartDate <= endDate)
            .GroupBy(e => e.StartDate.Month)
            .Select(g => new { Month = g.Key, Count = g.Count() })
            .ToListAsync();

        // Create a record for each month
        for (int month = 1; month <= 12; month++)
        {
            var monthName = new DateTime(year, month, 1).ToString("MMMM");
            var eventCount = eventsByMonth.FirstOrDefault(e => e.Month == month)?.Count ?? 0;

            monthlyStats.Add(new MonthlyEventStatsDTO
            {
                Month = month,
                MonthName = monthName,
                EventCount = eventCount
            });
        }

        return new YearlyEventStatsDTO
        {
            Year = year,
            MonthlyStats = monthlyStats
        };
    }
}
