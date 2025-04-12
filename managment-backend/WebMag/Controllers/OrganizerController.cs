using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebMag.Models.DTOs;
using WebMag.Services;

namespace WebMag.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganizerController : ControllerBase
{
    private readonly IOrganizerService _organizerService;

    public OrganizerController(IOrganizerService organizerService)
    {
        _organizerService = organizerService;
    }

    [HttpGet]
    public async Task<ActionResult<OrganizerListResponseDTO>> GetOrganizers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null)
    {
        var result = await _organizerService.GetOrganizersAsync(page, pageSize, searchTerm);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrganizerDTO>> GetOrganizerById(string id)
    {
        var organizer = await _organizerService.GetOrganizerByIdAsync(id);
        if (organizer == null)
            return NotFound();

        return Ok(organizer);
    }

    [HttpGet("{id}/with-events")]
    public async Task<ActionResult<OrganizerWithEventsDTO>> GetOrganizerWithEvents(
        string id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _organizerService.GetOrganizerWithEventsAsync(id, page, pageSize);
        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("{id}/event-count")]
    public async Task<ActionResult<int>> GetEventCount(string id)
    {
        var count = await _organizerService.GetEventCountAsync(id);
        return Ok(count);
    }

    [HttpGet("check-name")]
    public async Task<ActionResult<bool>> IsNameUnique(
        [FromQuery] string name,
        [FromQuery] string? excludeId = null)
    {
        var isUnique = await _organizerService.IsNameUniqueAsync(name, excludeId);
        return Ok(isUnique);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrganizerDTO>> CreateOrganizer(CreateOrganizerDTO createOrganizerDto)
    {
        if (createOrganizerDto == null)
            return BadRequest("Organizer data cannot be null");

        if (string.IsNullOrWhiteSpace(createOrganizerDto.Name))
            return BadRequest("Organizer name is required");

        try
        {
            var organizer = await _organizerService.CreateOrganizerAsync(createOrganizerDto);
            return CreatedAtAction(nameof(GetOrganizerById), new { id = organizer.Id }, organizer);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrganizerDTO>> UpdateOrganizer(string id, UpdateOrganizerDTO updateOrganizerDto)
    {
        if (updateOrganizerDto == null)
            return BadRequest("Update data cannot be null");

        if (string.IsNullOrWhiteSpace(updateOrganizerDto.Name))
            return BadRequest("Organizer name is required");

        try
        {
            var organizer = await _organizerService.UpdateOrganizerAsync(id, updateOrganizerDto);
            return Ok(organizer);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteOrganizer(string id)
    {
        try
        {
            var result = await _organizerService.DeleteOrganizerAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
