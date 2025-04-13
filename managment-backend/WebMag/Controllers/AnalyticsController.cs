using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebMag.Models.DTOs;
using WebMag.Services;

namespace WebMag.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("counts")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EntityCountDTO>> GetEntityCounts()
    {
        var counts = await _analyticsService.GetEntityCountsAsync();
        return Ok(counts);
    }

    [HttpGet("counts/events")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetEventCount()
    {
        var count = await _analyticsService.GetEventCountAsync();
        return Ok(count);
    }

    [HttpGet("counts/event-types")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetEventTypeCount()
    {
        var count = await _analyticsService.GetEventTypeCountAsync();
        return Ok(count);
    }

    [HttpGet("counts/resources")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetResourceCount()
    {
        var count = await _analyticsService.GetResourceCountAsync();
        return Ok(count);
    }

    [HttpGet("counts/resource-allocations")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetResourceAllocationCount()
    {
        var count = await _analyticsService.GetResourceAllocationCountAsync();
        return Ok(count);
    }

    [HttpGet("counts/organizers")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetOrganizerCount()
    {
        var count = await _analyticsService.GetOrganizerCountAsync();
        return Ok(count);
    }

    [HttpGet("counts/event-configurations")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetEventConfigurationCount()
    {
        var count = await _analyticsService.GetEventConfigurationCountAsync();
        return Ok(count);
    }

    [HttpGet("counts/event-type-resources")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetEventTypeResourceCount()
    {
        var count = await _analyticsService.GetEventTypeResourceCountAsync();
        return Ok(count);
    }

    [HttpGet("counts/categories")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> GetCategoryCount()
    {
        var count = await _analyticsService.GetCategoryCountAsync();
        return Ok(count);
    }

    [HttpGet("events/monthly/{year}")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<YearlyEventStatsDTO>> GetYearlyEventStats(int year)
    {
        var stats = await _analyticsService.GetYearlyEventStatsAsync(year);
        return Ok(stats);
    }
}
