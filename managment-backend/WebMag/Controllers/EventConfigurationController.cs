using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebMag.Models.DTOs;
using WebMag.Services;

namespace WebMag.Controllers;

[ApiController]
[Route("api/events/configurations")]
public class EventConfigurationController : ControllerBase
{
    private readonly IEventConfigurationService _configurationService;

    public EventConfigurationController(IEventConfigurationService configurationService)
    {
        _configurationService = configurationService;
    }

    [HttpGet("event/{eventId}")]
    public async Task<ActionResult<List<EventConfigurationDTO>>> GetConfigurationsForEvent(int eventId)
    {
        var eventExists = await _configurationService.EventExistsAsync(eventId);
        if (!eventExists)
            return NotFound($"Event with ID {eventId} not found");

        var configurations = await _configurationService.GetConfigurationsForEventAsync(eventId);
        return Ok(configurations);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventConfigurationDTO>> GetConfigurationById(int id)
    {
        var configuration = await _configurationService.GetConfigurationByIdAsync(id);
        if (configuration == null)
            return NotFound();

        return Ok(configuration);
    }

    [HttpGet("event/{eventId}/type/{configurationType}")]
    public async Task<ActionResult<List<EventConfigurationDTO>>> GetConfigurationsByType(int eventId, string configurationType)
    {
        var eventExists = await _configurationService.EventExistsAsync(eventId);
        if (!eventExists)
            return NotFound($"Event with ID {eventId} not found");

        var configurations = await _configurationService.GetConfigurationsByTypeAsync(eventId, configurationType);
        return Ok(configurations);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventConfigurationDTO>> CreateConfiguration(CreateEventConfigurationDTO createConfigDto)
    {
        if (createConfigDto == null)
            return BadRequest("Configuration data cannot be null");

        if (createConfigDto.EventId <= 0)
            return BadRequest("Valid event ID is required");

        if (string.IsNullOrWhiteSpace(createConfigDto.ConfigurationType))
            return BadRequest("Configuration type is required");

        if (string.IsNullOrWhiteSpace(createConfigDto.Value))
            return BadRequest("Configuration value is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var configuration = await _configurationService.CreateConfigurationAsync(createConfigDto, userId);
            return CreatedAtAction(nameof(GetConfigurationById), new { id = configuration.Id }, configuration);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventConfigurationDTO>> UpdateConfiguration(int id, UpdateEventConfigurationDTO updateConfigDto)
    {
        if (updateConfigDto == null)
            return BadRequest("Update data cannot be null");

        if (string.IsNullOrWhiteSpace(updateConfigDto.Value))
            return BadRequest("Configuration value is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var configuration = await _configurationService.UpdateConfigurationAsync(id, updateConfigDto, userId);
            return Ok(configuration);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteConfiguration(int id)
    {
        var result = await _configurationService.DeleteConfigurationAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
