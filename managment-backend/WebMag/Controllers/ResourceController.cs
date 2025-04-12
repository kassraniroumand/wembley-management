using System.Security.Claims;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebMag.data;
using WebMag.Models.domain;
using WebMag.Models.DTOs;
using WebMag.Services;

namespace WebMag.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourceController : ControllerBase
{
    private readonly DomainDbContext _domainDbContext;
    private readonly IResourceService _resourceService;

    public ResourceController(DomainDbContext domainDbContext, IResourceService resourceService)
    {
        _domainDbContext = domainDbContext;
        _resourceService = resourceService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResourceDTO>> CreateResource(CreateResourceDTO createResourceDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
        var resource = createResourceDto.Adapt<Resource>();
        resource = await _resourceService.CreateResourceAsync(resource, userId);
        var resourceDto = resource.Adapt<ResourceDTO>();
        return resourceDto;
    }

    [HttpGet]
    public async Task<ActionResult<List<ResourceDTO>>> GetAllResources([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var resources = await _resourceService.GetAllResourcesAsync(page, pageSize);
        var resourceDtos = resources.Adapt<List<ResourceDTO>>();
        return Ok(resourceDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ResourceDTO>> GetResourceById(int id)
    {
        var resource = await _resourceService.GetResourceByIdAsync(id);
        if (resource == null)
            return NotFound();

        var resourceDto = resource.Adapt<ResourceDTO>();
        return Ok(resourceDto);
    }

    [HttpGet("type/{type}")]
    public async Task<ActionResult<List<ResourceDTO>>> GetResourcesByType(string type, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var resources = await _resourceService.GetResourcesByTypeAsync(type, page, pageSize);
        var resourceDtos = resources.Adapt<List<ResourceDTO>>();
        return Ok(resourceDtos);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResourceDTO>> UpdateResource(int id, UpdateResourceDTO updateResourceDto)
    {
        if (updateResourceDto == null)
            return BadRequest("Update data cannot be null");

        // Validate required properties
        if (string.IsNullOrWhiteSpace(updateResourceDto.Name))
            return BadRequest("Name is required");

        if (string.IsNullOrWhiteSpace(updateResourceDto.Type))
            return BadRequest("Type is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
        try
        {
            var updatedResource = await _resourceService.UpdateResourceAsync(id, updateResourceDto, userId);
            var resourceDto = updatedResource.Adapt<ResourceDTO>();
            return Ok(resourceDto);
        }
        catch (Exception ex)
        {
            // Log exception here if you have logging configured
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteResource(int id)
    {
        var result = await _resourceService.DeleteResourceAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("{resourceId}/allocations")]
    public async Task<ActionResult<ResourceAllocationListResponseDTO>> GetResourceAllocations(
        int resourceId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var allocations = await _resourceService.GetResourceAllocationsAsync(resourceId, startDate, endDate);
        return Ok(allocations);
    }

    [HttpPost("allocations")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResourceAllocationDTO>> CreateResourceAllocation(CreateResourceAllocationDTO createAllocationDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
        var allocation = await _resourceService.CreateResourceAllocationAsync(createAllocationDto, userId);
        return Ok(allocation);
    }

    [HttpPut("allocations/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResourceAllocationDTO>> UpdateResourceAllocation(int id, UpdateResourceAllocationDTO updateAllocationDto)
    {
        if (updateAllocationDto == null)
            return BadRequest("Update data cannot be null");

        // Validate required properties
        if (updateAllocationDto.ResourceId <= 0)
            return BadRequest("Valid ResourceId is required");

        if (updateAllocationDto.Quantity <= 0)
            return BadRequest("Quantity must be greater than zero");

        if (updateAllocationDto.StartTime >= updateAllocationDto.EndTime)
            return BadRequest("End time must be after start time");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
        try
        {
            var updatedAllocation = await _resourceService.UpdateResourceAllocationAsync(id, updateAllocationDto, userId);
            return Ok(updatedAllocation);
        }
        catch (Exception ex)
        {
            // Log exception here if you have logging configured
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("allocations/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteResourceAllocation(int id)
    {
        var result = await _resourceService.DeleteResourceAllocationAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPost("check-availability")]
    public async Task<ActionResult<ResourceAvailabilityResponseDTO>> CheckResourceAvailability(ResourceAvailabilityRequestDTO request)
    {
        var availability = await _resourceService.CheckResourceAvailabilityAsync(request);
        return Ok(availability);
    }
}
