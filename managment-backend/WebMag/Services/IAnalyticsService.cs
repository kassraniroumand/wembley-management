using System.Threading.Tasks;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public interface IAnalyticsService
{
    Task<EntityCountDTO> GetEntityCountsAsync();
    Task<int> GetEventCountAsync();
    Task<int> GetEventTypeCountAsync();
    Task<int> GetResourceCountAsync();
    Task<int> GetResourceAllocationCountAsync();
    Task<int> GetOrganizerCountAsync();
    Task<int> GetEventConfigurationCountAsync();
    Task<int> GetEventTypeResourceCountAsync();
    Task<int> GetCategoryCountAsync();
    Task<YearlyEventStatsDTO> GetYearlyEventStatsAsync(int year);
}
