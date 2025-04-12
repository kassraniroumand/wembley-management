using System.Security.Claims;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebMag.Models.domain;
using WebMag.Models.DTOs;
using WebMag.Services;

namespace WebMag.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventController(IEventService eventService)
    {
        _eventService = eventService;
    }

    // Event endpoints
    [HttpGet]
    public async Task<ActionResult<EventListResponseDTO>> GetEvents(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? searchTerm = null)
    {
        var events = await _eventService.GetEventsAsync(page, pageSize, fromDate, toDate, searchTerm);
        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDetailsDTO>> GetEventById(int id)
    {
        var eventDetails = await _eventService.GetEventByIdAsync(id);
        if (eventDetails == null)
            return NotFound();

        return Ok(eventDetails);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventDTO>> CreateEvent(CreateEventDTO createEventDto)
    {
        if (createEventDto == null)
            return BadRequest("Event data cannot be null");

        // Validate required fields
        if (string.IsNullOrWhiteSpace(createEventDto.Name))
            return BadRequest("Event name is required");

        if (createEventDto.EventTypeId <= 0)
            return BadRequest("Valid event type is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var @event = await _eventService.CreateEventAsync(createEventDto, userId);
            var eventDto = @event.Adapt<EventDTO>();
            return CreatedAtAction(nameof(GetEventById), new { id = eventDto.Id }, eventDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventDTO>> UpdateEvent(int id, UpdateEventDTO updateEventDto)
    {
        if (updateEventDto == null)
            return BadRequest("Update data cannot be null");

        // Validate required fields
        if (string.IsNullOrWhiteSpace(updateEventDto.Name))
            return BadRequest("Event name is required");

        if (updateEventDto.EventTypeId <= 0)
            return BadRequest("Valid event type is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var @event = await _eventService.UpdateEventAsync(id, updateEventDto, userId);
            var eventDto = @event.Adapt<EventDTO>();
            return Ok(eventDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteEvent(int id)
    {
        try
        {
            var result = await _eventService.DeleteEventAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{id}/publish")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> PublishEvent(int id)
    {
        var result = await _eventService.PublishEventAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPost("{id}/unpublish")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UnpublishEvent(int id)
    {
        var result = await _eventService.UnpublishEventAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    // Event Configuration endpoints
    [HttpGet("{eventId}/configurations")]
    public async Task<ActionResult<List<EventConfigurationDTO>>> GetEventConfigurations(int eventId)
    {
        var configurations = await _eventService.GetEventConfigurationsAsync(eventId);
        return Ok(configurations);
    }

    [HttpPost("configurations")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventConfigurationDTO>> AddEventConfiguration(CreateEventConfigurationDTO createConfigDto)
    {
        if (createConfigDto == null)
            return BadRequest("Configuration data cannot be null");

        if (createConfigDto.EventId <= 0)
            return BadRequest("Valid event ID is required");

        if (string.IsNullOrWhiteSpace(createConfigDto.ConfigurationType))
            return BadRequest("Configuration type is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var configuration = await _eventService.AddEventConfigurationAsync(createConfigDto, userId);
            return CreatedAtAction(nameof(GetEventConfigurations), new { eventId = configuration.EventId }, configuration);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("configurations/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventConfigurationDTO>> UpdateEventConfiguration(int id, UpdateEventConfigurationDTO updateConfigDto)
    {
        if (updateConfigDto == null)
            return BadRequest("Update data cannot be null");

        if (string.IsNullOrWhiteSpace(updateConfigDto.Value))
            return BadRequest("Configuration value is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var configuration = await _eventService.UpdateEventConfigurationAsync(id, updateConfigDto, userId);
            return Ok(configuration);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("configurations/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteEventConfiguration(int id)
    {
        var result = await _eventService.DeleteEventConfigurationAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
