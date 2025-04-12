using Mapster;
using Microsoft.EntityFrameworkCore;
using WebMag.data;
using WebMag.Models.domain;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public interface IResourceService
{
    Task<List<Resource>> GetAllResourcesAsync(int page = 1, int pageSize = 20);
    Task<Resource> GetResourceByIdAsync(int id);
    Task<List<Resource>> GetResourcesByTypeAsync(string type, int page = 1, int pageSize = 20);
    Task<Resource> CreateResourceAsync(Resource dto, string userId);
    Task<Resource> UpdateResourceAsync(int id, UpdateResourceDTO dto, string userId);
    Task<bool> DeleteResourceAsync(int id);

    Task<ResourceAllocationListResponseDTO> GetResourceAllocationsAsync(int resourceId, DateTime? startDate = null,
        DateTime? endDate = null);

    Task<ResourceAllocationDTO> CreateResourceAllocationAsync(CreateResourceAllocationDTO dto, string userId);
    Task<ResourceAllocationDTO> UpdateResourceAllocationAsync(int id, UpdateResourceAllocationDTO dto, string userId);
    Task<bool> DeleteResourceAllocationAsync(int id);
    Task<ResourceAvailabilityResponseDTO> CheckResourceAvailabilityAsync(ResourceAvailabilityRequestDTO request);
}

public class ResourceService : IResourceService
{
    private readonly DomainDbContext domainDbContext;

    public ResourceService(DomainDbContext domainDbContext)
    {
        this.domainDbContext = domainDbContext;
    }

    public async Task<List<Resource>> GetAllResourcesAsync(int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;
        var resources = await this.domainDbContext.Resources
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
        return resources;
    }

    public async Task<Resource> GetResourceByIdAsync(int id)
    {
        return await domainDbContext.Resources.FindAsync(id);
    }

    public async Task<Resource> UpdateResourceAsync(int id, UpdateResourceDTO dto, string userId)
    {
        var resource = await domainDbContext.Resources.FindAsync(id);
        if (resource == null)
            throw new Exception($"Resource with ID {id} not found");

        // Update resource properties individually instead of using Adapt
        resource.Name = dto.Name;
        resource.Type = dto.Type;
        resource.IsLimited = dto.IsLimited;
        resource.MaxQuantity = dto.MaxQuantity;
        resource.Notes = dto.Notes;

        // Mark as modified explicitly
        domainDbContext.Entry(resource).State = EntityState.Modified;

        await domainDbContext.SaveChangesAsync();
        return resource;
    }

    public async Task<List<Resource>> GetResourcesByTypeAsync(string type, int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;
        var resources = await domainDbContext.Resources
            .Where(r => r.Type == type)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
        return resources;
    }

    public async Task<Resource> CreateResourceAsync(Resource dto, string userId)
    {
        domainDbContext.Resources.Add(dto);
        await this.domainDbContext.SaveChangesAsync();
        return dto;
    }

    public async Task<bool> DeleteResourceAsync(int id)
    {
        var resource = await domainDbContext.Resources.FindAsync(id);
        if (resource == null)
            return false;

        // Check if resource has allocations
        var hasAllocations = await domainDbContext.ResourceAllocations
            .AnyAsync(ra => ra.ResourceId == id);

        if (hasAllocations)
            throw new Exception("Cannot delete resource with existing allocations");

        domainDbContext.Resources.Remove(resource);
        await domainDbContext.SaveChangesAsync();
        return true;
    }

    public async Task<ResourceAllocationListResponseDTO> GetResourceAllocationsAsync(int resourceId,
        DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = domainDbContext.ResourceAllocations
            .Include(ra => ra.Event)
            .Include(ra => ra.Resource)
            .Where(ra => ra.ResourceId == resourceId);

        if (startDate.HasValue)
            query = query.Where(ra => ra.EndTime >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(ra => ra.StartTime <= endDate.Value);

        var allocations = await query.ToListAsync();
        var allocationDtos = allocations.Adapt<List<ResourceAllocationDTO>>();

        return new ResourceAllocationListResponseDTO
        {
            Allocations = allocationDtos,
            TotalCount = allocationDtos.Count
        };
    }

    public async Task<ResourceAllocationDTO> CreateResourceAllocationAsync(CreateResourceAllocationDTO dto, string userId)
    {
        // Check if resource exists
        var resource = await domainDbContext.Resources.FindAsync(dto.ResourceId);
        if (resource == null)
            throw new Exception($"Resource with ID {dto.ResourceId} not found");

        // Check if event exists
        var @event = await domainDbContext.Events.FindAsync(dto.EventId);
        if (@event == null)
            throw new Exception($"Event with ID {dto.EventId} not found");

        // Check if resource is available in the requested timeframe
        var availability = await CheckResourceAvailabilityInternalAsync(
            dto.ResourceId,
            dto.StartTime,
            dto.EndTime,
            null);

        if (!availability.IsAvailable)
            throw new Exception("Resource is not available in the requested timeframe");

        // Check quantity limits if applicable
        if (resource.IsLimited && resource.MaxQuantity.HasValue && dto.Quantity > resource.MaxQuantity.Value)
            throw new Exception($"Requested quantity exceeds maximum available quantity ({resource.MaxQuantity.Value})");

        // Create allocation
        var allocation = dto.Adapt<ResourceAllocation>();

        domainDbContext.ResourceAllocations.Add(allocation);
        await domainDbContext.SaveChangesAsync();

        // Load related entities
        await domainDbContext.Entry(allocation)
            .Reference(ra => ra.Resource)
            .LoadAsync();

        await domainDbContext.Entry(allocation)
            .Reference(ra => ra.Event)
            .LoadAsync();

        // Convert to DTO
        var allocationDto = allocation.Adapt<ResourceAllocationDTO>();
        return allocationDto;
    }

    public async Task<ResourceAllocationDTO> UpdateResourceAllocationAsync(int id, UpdateResourceAllocationDTO dto,
        string userId)
    {
        var allocation = await domainDbContext.ResourceAllocations
            .Include(ra => ra.Resource)
            .Include(ra => ra.Event)
            .FirstOrDefaultAsync(ra => ra.Id == id);

        if (allocation == null)
            throw new Exception($"Resource allocation with ID {id} not found");

        // Check if resource exists
        var resource = await domainDbContext.Resources.FindAsync(dto.ResourceId);
        if (resource == null)
            throw new Exception($"Resource with ID {dto.ResourceId} not found");

        // Check if the resource is available in the new timeframe
        var availability = await CheckResourceAvailabilityInternalAsync(
            dto.ResourceId,
            dto.StartTime,
            dto.EndTime,
            id);

        if (!availability.IsAvailable)
            throw new Exception("Resource is not available in the requested timeframe");

        // Check quantity limits if applicable
        if (resource.IsLimited && resource.MaxQuantity.HasValue && dto.Quantity > resource.MaxQuantity.Value)
            throw new Exception($"Requested quantity exceeds maximum available quantity ({resource.MaxQuantity.Value})");

        // Update allocation properties individually
        allocation.ResourceId = dto.ResourceId;
        allocation.Quantity = dto.Quantity;
        allocation.StartTime = dto.StartTime;
        allocation.EndTime = dto.EndTime;

        // Mark as modified explicitly
        domainDbContext.Entry(allocation).State = EntityState.Modified;

        await domainDbContext.SaveChangesAsync();

        // Reload related data
        await domainDbContext.Entry(allocation)
            .Reference(ra => ra.Resource)
            .LoadAsync();

        // Convert to DTO
        var allocationDto = allocation.Adapt<ResourceAllocationDTO>();
        return allocationDto;
    }

    public async Task<bool> DeleteResourceAllocationAsync(int id)
    {
        var allocation = await domainDbContext.ResourceAllocations.FindAsync(id);
        if (allocation == null)
            return false;

        domainDbContext.ResourceAllocations.Remove(allocation);
        await domainDbContext.SaveChangesAsync();
        return true;
    }

    public async Task<ResourceAvailabilityResponseDTO> CheckResourceAvailabilityAsync(ResourceAvailabilityRequestDTO request)
    {
        return await CheckResourceAvailabilityInternalAsync(
            request.ResourceId,
            request.StartTime,
            request.EndTime,
            request.ExcludeAllocationId);
    }

    private async Task<ResourceAvailabilityResponseDTO> CheckResourceAvailabilityInternalAsync(
        int resourceId,
        DateTime startTime,
        DateTime endTime,
        int? excludeAllocationId = null)
    {
        // Check if there are any conflicting allocations
        var query = domainDbContext.ResourceAllocations
            .Include(ra => ra.Resource)
            .Include(ra => ra.Event)
            .Where(ra => ra.ResourceId == resourceId)
            .Where(ra =>
                // Overlap conditions - either:
                // 1. The new start time is within an existing booking
                (ra.StartTime <= startTime && startTime < ra.EndTime) ||
                // 2. The new end time is within an existing booking
                (ra.StartTime < endTime && endTime <= ra.EndTime) ||
                // 3. The new booking completely contains an existing booking
                (startTime <= ra.StartTime && ra.EndTime <= endTime));

        // Exclude the current allocation if we're updating
        if (excludeAllocationId.HasValue)
            query = query.Where(ra => ra.Id != excludeAllocationId.Value);

        var conflictingAllocations = await query.ToListAsync();

        var response = new ResourceAvailabilityResponseDTO
        {
            IsAvailable = !conflictingAllocations.Any(),
            ConflictingAllocations = conflictingAllocations.Adapt<List<ResourceAllocationDTO>>()
        };

        return response;
    }
}
