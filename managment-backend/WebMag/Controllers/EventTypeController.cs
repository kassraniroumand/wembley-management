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
public class EventTypeController : ControllerBase
{
    private readonly IEventTypeService _eventTypeService;

    public EventTypeController(IEventTypeService eventTypeService)
    {
        _eventTypeService = eventTypeService;
    }

    // Event Type Management
    [HttpGet]
    public async Task<ActionResult<List<EventTypeDTO>>> GetAllEventTypes([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var eventTypes = await _eventTypeService.GetAllEventTypesAsync(page, pageSize);
        var eventTypeDtos = eventTypes.Adapt<List<EventTypeDTO>>();
        return Ok(eventTypeDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventTypeDTO>> GetEventTypeById(int id)
    {
        var eventType = await _eventTypeService.GetEventTypeByIdAsync(id);
        if (eventType == null)
            return NotFound();

        var eventTypeDto = eventType.Adapt<EventTypeDTO>();
        return Ok(eventTypeDto);
    }

    [HttpGet("{id}/with-resources")]
    public async Task<ActionResult<EventTypeWithResourcesDTO>> GetEventTypeWithResources(int id)
    {
        var result = await _eventTypeService.GetEventTypeWithResourcesAsync(id);
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("category/{category}")]
    public async Task<ActionResult<List<EventTypeDTO>>> GetEventTypesByCategory(
        string category,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var eventTypes = await _eventTypeService.GetEventTypesByCategoryAsync(category, page, pageSize);
        var eventTypeDtos = eventTypes.Adapt<List<EventTypeDTO>>();
        return Ok(eventTypeDtos);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventTypeDTO>> CreateEventType(CreateEventTypeDTO createEventTypeDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
        var eventType = await _eventTypeService.CreateEventTypeAsync(createEventTypeDto, userId);
        var eventTypeDto = eventType.Adapt<EventTypeDTO>();
        return CreatedAtAction(nameof(GetEventTypeById), new { id = eventTypeDto.Id }, eventTypeDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventTypeDTO>> UpdateEventType(int id, UpdateEventTypeDTO updateEventTypeDto)
    {
        if (updateEventTypeDto == null)
            return BadRequest("Update data cannot be null");

        // Validate required properties
        if (string.IsNullOrWhiteSpace(updateEventTypeDto.Name))
            return BadRequest("Name is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var updatedEventType = await _eventTypeService.UpdateEventTypeAsync(id, updateEventTypeDto, userId);
            var eventTypeDto = updatedEventType.Adapt<EventTypeDTO>();
            return Ok(eventTypeDto);
        }
        catch (Exception ex)
        {
            // Log exception here if you have logging configured
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteEventType([FromQuery] int id)
    {
        try
        {
            var result = await _eventTypeService.DeleteEventTypeAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Default Resources Management
    [HttpGet("{eventTypeId}/resources")]
    public async Task<ActionResult<List<EventTypeResourceDTO>>> GetEventTypeResources(int eventTypeId)
    {
        var resources = await _eventTypeService.GetEventTypeResourcesAsync(eventTypeId);
        return Ok(resources);
    }

    [HttpPost("resources")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventTypeResourceDTO>> AddDefaultResource(CreateEventTypeResourceDTO createResourceDto)
    {
        if (createResourceDto == null)
            return BadRequest("Resource data cannot be null");

        if (createResourceDto.EventTypeId <= 0)
            return BadRequest("Valid event type ID is required");

        if (createResourceDto.ResourceId <= 0)
            return BadRequest("Valid resource ID is required");

        if (createResourceDto.Quantity <= 0)
            return BadRequest("Quantity must be greater than zero");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var resource = await _eventTypeService.AddDefaultResourceAsync(createResourceDto, userId);
            return CreatedAtAction(nameof(GetEventTypeResources), new { eventTypeId = resource.EventTypeId }, resource);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("resources/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EventTypeResourceDTO>> UpdateDefaultResource(int id, UpdateEventTypeResourceDTO updateResourceDto)
    {
        if (updateResourceDto == null)
            return BadRequest("Update data cannot be null");

        // Validate required properties
        if (updateResourceDto.Quantity <= 0)
            return BadRequest("Quantity must be greater than zero");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var resource = await _eventTypeService.UpdateDefaultResourceAsync(id, updateResourceDto, userId);
            return Ok(resource);
        }
        catch (Exception ex)
        {
            // Log exception here if you have logging configured
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("resources/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> RemoveDefaultResource(int id)
    {
        var result = await _eventTypeService.RemoveDefaultResourceAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
