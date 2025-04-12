using Mapster;
using Microsoft.EntityFrameworkCore;
using WebMag.data;
using WebMag.Models.domain;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public interface IEventTypeService
{
    Task<List<EventType>> GetAllEventTypesAsync(int page = 1, int pageSize = 20);
    Task<EventType> GetEventTypeByIdAsync(int id);
    Task<EventTypeWithResourcesDTO> GetEventTypeWithResourcesAsync(int id);
    Task<List<EventType>> GetEventTypesByCategoryAsync(string category, int page = 1, int pageSize = 20);
    Task<EventType> CreateEventTypeAsync(CreateEventTypeDTO dto, string userId);
    Task<EventType> UpdateEventTypeAsync(int id, UpdateEventTypeDTO dto, string userId);
    Task<bool> DeleteEventTypeAsync(int id);

    // Default resource management
    Task<List<EventTypeResourceDTO>> GetEventTypeResourcesAsync(int eventTypeId);
    Task<EventTypeResourceDTO> AddDefaultResourceAsync(CreateEventTypeResourceDTO dto, string userId);
    Task<EventTypeResourceDTO> UpdateDefaultResourceAsync(int id, UpdateEventTypeResourceDTO dto, string userId);
    Task<bool> RemoveDefaultResourceAsync(int id);
}

public class EventTypeService : IEventTypeService
{
    private readonly DomainDbContext _domainDbContext;

    public EventTypeService(DomainDbContext domainDbContext)
    {
        _domainDbContext = domainDbContext;
    }

    public async Task<List<EventType>> GetAllEventTypesAsync(int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;
        var eventTypes = await _domainDbContext.EventTypes
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
        return eventTypes;
    }

    public async Task<EventType> GetEventTypeByIdAsync(int id)
    {
        return await _domainDbContext.EventTypes.FindAsync(id);
    }

    public async Task<EventTypeWithResourcesDTO> GetEventTypeWithResourcesAsync(int id)
    {
        var eventType = await _domainDbContext.EventTypes
            .Include(et => et.DefaultResources)
            .ThenInclude(etr => etr.Resource)
            .FirstOrDefaultAsync(et => et.Id == id);

        if (eventType == null)
            return null;

        var eventTypeDto = eventType.Adapt<EventTypeDTO>();
        var resourceDtos = eventType.DefaultResources.Adapt<List<EventTypeResourceDTO>>();

        return new EventTypeWithResourcesDTO
        {
            EventType = eventTypeDto,
            DefaultResources = resourceDtos
        };
    }

    public async Task<List<EventType>> GetEventTypesByCategoryAsync(string category, int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;
        var eventTypes = await _domainDbContext.EventTypes
            .Where(et => et.Category == category)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
        return eventTypes;
    }

    public async Task<EventType> CreateEventTypeAsync(CreateEventTypeDTO dto, string userId)
    {
        var eventType = dto.Adapt<EventType>();
        _domainDbContext.EventTypes.Add(eventType);
        await _domainDbContext.SaveChangesAsync();
        return eventType;
    }

    public async Task<EventType> UpdateEventTypeAsync(int id, UpdateEventTypeDTO dto, string userId)
    {
        var eventType = await _domainDbContext.EventTypes.FindAsync(id);
        if (eventType == null)
            throw new Exception($"EventType with ID {id} not found");

        // Update properties individually to ensure EF knows they've changed
        eventType.Name = dto.Name;
        eventType.Description = dto.Description;
        eventType.Category = dto.Category;
        eventType.DefaultCapacity = dto.DefaultCapacity;
        eventType.SetupDays = dto.SetupDays;
        eventType.TeardownDays = dto.TeardownDays;
        eventType.RequiresPitchAccess = dto.RequiresPitchAccess;
        eventType.DefaultConfigurations = dto.DefaultConfigurations;

        // Instead of using Adapt which may not properly trigger change tracking
        // dto.Adapt(eventType);

        // Mark as modified explicitly
        _domainDbContext.Entry(eventType).State = EntityState.Modified;

        await _domainDbContext.SaveChangesAsync();
        return eventType;
    }

    public async Task<bool> DeleteEventTypeAsync(int id)
    {
        var eventType = await _domainDbContext.EventTypes.FindAsync(id);
        if (eventType == null)
            return false;

        // Check if this event type is used by any events
        var isUsed = await _domainDbContext.Events
            .AnyAsync(e => e.EventTypeId == id);

        if (isUsed)
            throw new Exception("Cannot delete event type that is used by existing events");

        // Delete associated default resources
        var defaultResources = await _domainDbContext.EventTypeResources
            .Where(etr => etr.EventTypeId == id)
            .ToListAsync();

        _domainDbContext.EventTypeResources.RemoveRange(defaultResources);
        _domainDbContext.EventTypes.Remove(eventType);
        await _domainDbContext.SaveChangesAsync();
        return true;
    }

    public async Task<List<EventTypeResourceDTO>> GetEventTypeResourcesAsync(int eventTypeId)
    {
        var resources = await _domainDbContext.EventTypeResources
            .Include(etr => etr.Resource)
            .Include(etr => etr.EventType)
            .Where(etr => etr.EventTypeId == eventTypeId)
            .ToListAsync();

        return resources.Adapt<List<EventTypeResourceDTO>>();
    }

    public async Task<EventTypeResourceDTO> AddDefaultResourceAsync(CreateEventTypeResourceDTO dto, string userId)
    {
        // Validate event type exists
        var eventType = await _domainDbContext.EventTypes.FindAsync(dto.EventTypeId);
        if (eventType == null)
            throw new Exception($"EventType with ID {dto.EventTypeId} not found");

        // Validate resource exists
        var resource = await _domainDbContext.Resources.FindAsync(dto.ResourceId);
        if (resource == null)
            throw new Exception($"Resource with ID {dto.ResourceId} not found");

        // Check if this resource is already added
        var existing = await _domainDbContext.EventTypeResources
            .FirstOrDefaultAsync(etr =>
                etr.EventTypeId == dto.EventTypeId &&
                etr.ResourceId == dto.ResourceId);

        if (existing != null)
            throw new Exception("This resource is already associated with this event type");

        // Create new association
        var eventTypeResource = dto.Adapt<EventTypeResource>();
        _domainDbContext.EventTypeResources.Add(eventTypeResource);
        await _domainDbContext.SaveChangesAsync();

        // Load related entities
        await _domainDbContext.Entry(eventTypeResource)
            .Reference(etr => etr.Resource)
            .LoadAsync();

        await _domainDbContext.Entry(eventTypeResource)
            .Reference(etr => etr.EventType)
            .LoadAsync();

        // Convert to DTO
        return eventTypeResource.Adapt<EventTypeResourceDTO>();
    }

    public async Task<EventTypeResourceDTO> UpdateDefaultResourceAsync(int id, UpdateEventTypeResourceDTO dto, string userId)
    {
        var eventTypeResource = await _domainDbContext.EventTypeResources
            .Include(etr => etr.Resource)
            .Include(etr => etr.EventType)
            .FirstOrDefaultAsync(etr => etr.Id == id);

        if (eventTypeResource == null)
            throw new Exception($"EventTypeResource with ID {id} not found");

        // Update quantity
        eventTypeResource.Quantity = dto.Quantity;

        // Mark as modified explicitly
        _domainDbContext.Entry(eventTypeResource).State = EntityState.Modified;

        await _domainDbContext.SaveChangesAsync();

        // Convert to DTO
        return eventTypeResource.Adapt<EventTypeResourceDTO>();
    }

    public async Task<bool> RemoveDefaultResourceAsync(int id)
    {
        var eventTypeResource = await _domainDbContext.EventTypeResources.FindAsync(id);
        if (eventTypeResource == null)
            return false;

        _domainDbContext.EventTypeResources.Remove(eventTypeResource);
        await _domainDbContext.SaveChangesAsync();
        return true;
    }
}
