using Mapster;
using Microsoft.EntityFrameworkCore;
using WebMag.data;
using WebMag.Models.domain;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public interface IEventService
{
    // Event CRUD
    Task<EventListResponseDTO> GetEventsAsync(int page = 1, int pageSize = 20,
        DateTime? fromDate = null, DateTime? toDate = null, string? searchTerm = null);
    Task<EventDetailsDTO> GetEventByIdAsync(int id);
    Task<Event> CreateEventAsync(CreateEventDTO dto, string userId);
    Task<Event> UpdateEventAsync(int id, UpdateEventDTO dto, string userId);
    Task<bool> DeleteEventAsync(int id);
    Task<bool> PublishEventAsync(int id);
    Task<bool> UnpublishEventAsync(int id);

    // Event Configuration
    Task<List<EventConfigurationDTO>> GetEventConfigurationsAsync(int eventId);
    Task<EventConfigurationDTO> AddEventConfigurationAsync(CreateEventConfigurationDTO dto, string userId);
    Task<EventConfigurationDTO> UpdateEventConfigurationAsync(int id, UpdateEventConfigurationDTO dto, string userId);
    Task<bool> DeleteEventConfigurationAsync(int id);
}

public class EventService : IEventService
{
    private readonly DomainDbContext _dbContext;
    private readonly IEventTypeService _eventTypeService;

    public EventService(DomainDbContext dbContext, IEventTypeService eventTypeService)
    {
        _dbContext = dbContext;
        _eventTypeService = eventTypeService;
    }

    public async Task<EventListResponseDTO> GetEventsAsync(int page = 1, int pageSize = 20,
        DateTime? fromDate = null, DateTime? toDate = null, string? searchTerm = null)
    {
        var query = _dbContext.Events
            .Include(e => e.Type)
            .Include(e => e.Organizer)
            .AsQueryable();

        // Apply filters
        if (fromDate.HasValue)
            query = query.Where(e => e.EndDate > fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(e => e.StartDate <= toDate.Value);

        if (!string.IsNullOrWhiteSpace(searchTerm))
            query = query.Where(e =>
                e.Name.Contains(searchTerm) ||
                e.Description.Contains(searchTerm) ||
                e.Type.Name.Contains(searchTerm));

        // Get total count for pagination
        var totalCount = await query.CountAsync();

        // Apply pagination
        var skip = (page - 1) * pageSize;
        var events = await query
            .OrderBy(e => e.StartDate)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        // Map to DTOs
        var eventDtos = events.Adapt<List<EventDTO>>();

        return new EventListResponseDTO
        {
            Events = eventDtos,
            TotalCount = totalCount
        };
    }

    public async Task<EventDetailsDTO> GetEventByIdAsync(int id)
    {
        var @event = await _dbContext.Events
            .Include(e => e.Type)
            .Include(e => e.Organizer)
            .Include(e => e.ResourceAllocations)
                .ThenInclude(ra => ra.Resource)
            .Include(e => e.Configurations)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (@event == null)
            return null;

        // Map event and related entities to DTOs
        var eventDto = @event.Adapt<EventDTO>();
        var resourceAllocations = @event.ResourceAllocations.Adapt<List<ResourceAllocationDTO>>();
        var configurations = @event.Configurations.Adapt<List<EventConfigurationDTO>>();

        return new EventDetailsDTO
        {
            Event = eventDto,
            ResourceAllocations = resourceAllocations,
            Configurations = configurations
        };
    }

    public async Task<Event> CreateEventAsync(CreateEventDTO dto, string userId)
    {
        // Validate event type exists
        var eventType = await _dbContext.EventTypes.FindAsync(dto.EventTypeId);
        if (eventType == null)
            throw new Exception($"Event type with ID {dto.EventTypeId} not found");

        // Validate organizer exists
        var organizer = await _dbContext.Organizers.FindAsync(dto.OrganizerId);
        if (organizer == null)
            throw new Exception($"Organizer with ID {dto.OrganizerId} not found");

        // Validate dates
        if (dto.EndDate <= dto.StartDate)
            throw new Exception("End date must be after start date");

        // Create the event
        var @event = dto.Adapt<Event>();
        @event.CreatedAt = DateTime.UtcNow;
        @event.CreatedBy = userId;
        @event.UpdatedAt = DateTime.UtcNow;
        @event.UpdatedBy = userId;

        _dbContext.Events.Add(@event);
        await _dbContext.SaveChangesAsync();

        // If requested, copy default resources from event type
        if (dto.UseEventTypeDefaultResources)
        {
            await CreateDefaultResourceAllocations(@event, userId);
        }

        return @event;
    }

    private async Task CreateDefaultResourceAllocations(Event @event, string userId)
    {
        // Get default resources for this event type
        var defaultResources = await _dbContext.EventTypeResources
            .Include(etr => etr.Resource)
            .Where(etr => etr.EventTypeId == @event.EventTypeId)
            .ToListAsync();

        // Create resource allocations for each default resource
        foreach (var defaultResource in defaultResources)
        {
            var allocation = new ResourceAllocation
            {
                EventId = @event.Id,
                ResourceId = defaultResource.ResourceId,
                Quantity = defaultResource.Quantity,
                StartTime = @event.StartDate,
                EndTime = @event.EndDate
            };

            _dbContext.ResourceAllocations.Add(allocation);
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task<Event> UpdateEventAsync(int id, UpdateEventDTO dto, string userId)
    {
        var @event = await _dbContext.Events.FindAsync(id);
        if (@event == null)
            throw new Exception($"Event with ID {id} not found");

        // Validate event type exists
        var eventType = await _dbContext.EventTypes.FindAsync(dto.EventTypeId);
        if (eventType == null)
            throw new Exception($"Event type with ID {dto.EventTypeId} not found");

        // Validate organizer exists
        var organizer = await _dbContext.Organizers.FindAsync(dto.OrganizerId);
        if (organizer == null)
            throw new Exception($"Organizer with ID {dto.OrganizerId} not found");

        // Validate dates
        if (dto.EndDate <= dto.StartDate)
            throw new Exception("End date must be after start date");

        // Update properties
        @event.Name = dto.Name;
        @event.Description = dto.Description;
        @event.EventTypeId = dto.EventTypeId;
        @event.StartDate = dto.StartDate;
        @event.EndDate = dto.EndDate;
        @event.SetupStartDate = dto.SetupStartDate;
        @event.TeardownEndDate = dto.TeardownEndDate;
        @event.PlannedCapacity = dto.PlannedCapacity;
        @event.OrganizerId = dto.OrganizerId;
        @event.Status = dto.Status;
        @event.Notes = dto.Notes;
        @event.IsPublished = dto.IsPublished;
        @event.UpdatedAt = DateTime.UtcNow;
        @event.UpdatedBy = userId;

        // Mark as modified
        _dbContext.Entry(@event).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();

        return @event;
    }

    public async Task<bool> DeleteEventAsync(int id)
    {
        var @event = await _dbContext.Events.FindAsync(id);
        if (@event == null)
            return false;

        // Delete associated allocations and configurations
        var allocations = await _dbContext.ResourceAllocations
            .Where(ra => ra.EventId == id)
            .ToListAsync();

        var configurations = await _dbContext.EventConfigurations
            .Where(ec => ec.EventId == id)
            .ToListAsync();

        _dbContext.ResourceAllocations.RemoveRange(allocations);
        _dbContext.EventConfigurations.RemoveRange(configurations);
        _dbContext.Events.Remove(@event);

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> PublishEventAsync(int id)
    {
        var @event = await _dbContext.Events.FindAsync(id);
        if (@event == null)
            return false;

        @event.IsPublished = true;
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnpublishEventAsync(int id)
    {
        var @event = await _dbContext.Events.FindAsync(id);
        if (@event == null)
            return false;

        @event.IsPublished = false;
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<List<EventConfigurationDTO>> GetEventConfigurationsAsync(int eventId)
    {
        var configurations = await _dbContext.EventConfigurations
            .Where(ec => ec.EventId == eventId)
            .ToListAsync();

        return configurations.Adapt<List<EventConfigurationDTO>>();
    }

    public async Task<EventConfigurationDTO> AddEventConfigurationAsync(CreateEventConfigurationDTO dto, string userId)
    {
        // Validate event exists
        var @event = await _dbContext.Events.FindAsync(dto.EventId);
        if (@event == null)
            throw new Exception($"Event with ID {dto.EventId} not found");

        // Create configuration
        var configuration = dto.Adapt<EventConfiguration>();
        _dbContext.EventConfigurations.Add(configuration);
        await _dbContext.SaveChangesAsync();

        return configuration.Adapt<EventConfigurationDTO>();
    }

    public async Task<EventConfigurationDTO> UpdateEventConfigurationAsync(int id, UpdateEventConfigurationDTO dto, string userId)
    {
        var configuration = await _dbContext.EventConfigurations.FindAsync(id);
        if (configuration == null)
            throw new Exception($"Event configuration with ID {id} not found");

        // Update value
        configuration.Value = dto.Value;

        // Mark as modified
        _dbContext.Entry(configuration).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();

        return configuration.Adapt<EventConfigurationDTO>();
    }

    public async Task<bool> DeleteEventConfigurationAsync(int id)
    {
        var configuration = await _dbContext.EventConfigurations.FindAsync(id);
        if (configuration == null)
            return false;

        _dbContext.EventConfigurations.Remove(configuration);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}
