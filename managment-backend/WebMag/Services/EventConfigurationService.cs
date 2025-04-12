using Mapster;
using Microsoft.EntityFrameworkCore;
using WebMag.data;
using WebMag.Models.domain;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public interface IEventConfigurationService
{
    Task<List<EventConfigurationDTO>> GetConfigurationsForEventAsync(int eventId);
    Task<EventConfigurationDTO> GetConfigurationByIdAsync(int id);
    Task<List<EventConfigurationDTO>> GetConfigurationsByTypeAsync(int eventId, string configurationType);
    Task<EventConfigurationDTO> CreateConfigurationAsync(CreateEventConfigurationDTO dto, string userId);
    Task<EventConfigurationDTO> UpdateConfigurationAsync(int id, UpdateEventConfigurationDTO dto, string userId);
    Task<bool> DeleteConfigurationAsync(int id);
    Task<bool> EventExistsAsync(int eventId);
}

public class EventConfigurationService : IEventConfigurationService
{
    private readonly DomainDbContext _dbContext;

    public EventConfigurationService(DomainDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<EventConfigurationDTO>> GetConfigurationsForEventAsync(int eventId)
    {
        var configurations = await _dbContext.EventConfigurations
            .Where(ec => ec.EventId == eventId)
            .OrderBy(ec => ec.ConfigurationType)
            .ToListAsync();

        return configurations.Adapt<List<EventConfigurationDTO>>();
    }

    public async Task<EventConfigurationDTO> GetConfigurationByIdAsync(int id)
    {
        var configuration = await _dbContext.EventConfigurations.FindAsync(id);
        if (configuration == null)
            return null;

        return configuration.Adapt<EventConfigurationDTO>();
    }

    public async Task<List<EventConfigurationDTO>> GetConfigurationsByTypeAsync(int eventId, string configurationType)
    {
        var configurations = await _dbContext.EventConfigurations
            .Where(ec => ec.EventId == eventId && ec.ConfigurationType == configurationType)
            .ToListAsync();

        return configurations.Adapt<List<EventConfigurationDTO>>();
    }

    public async Task<EventConfigurationDTO> CreateConfigurationAsync(CreateEventConfigurationDTO dto, string userId)
    {
        // Validate event exists
        var eventExists = await _dbContext.Events.AnyAsync(e => e.Id == dto.EventId);
        if (!eventExists)
            throw new Exception($"Event with ID {dto.EventId} not found");

        // Validate that we don't already have this type for the same event if it's meant to be unique
        // This is optional and depends on your business rules - uncomment if needed
        /*
        var exists = await _dbContext.EventConfigurations
            .AnyAsync(ec => ec.EventId == dto.EventId && ec.ConfigurationType == dto.ConfigurationType);
        if (exists)
            throw new Exception($"A configuration of type '{dto.ConfigurationType}' already exists for this event");
        */

        var configuration = dto.Adapt<EventConfiguration>();

        _dbContext.EventConfigurations.Add(configuration);
        await _dbContext.SaveChangesAsync();

        return configuration.Adapt<EventConfigurationDTO>();
    }

    public async Task<EventConfigurationDTO> UpdateConfigurationAsync(int id, UpdateEventConfigurationDTO dto, string userId)
    {
        var configuration = await _dbContext.EventConfigurations.FindAsync(id);
        if (configuration == null)
            throw new Exception($"Configuration with ID {id} not found");

        // Update value
        configuration.Value = dto.Value;

        // Mark as modified
        _dbContext.Entry(configuration).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();

        return configuration.Adapt<EventConfigurationDTO>();
    }

    public async Task<bool> DeleteConfigurationAsync(int id)
    {
        var configuration = await _dbContext.EventConfigurations.FindAsync(id);
        if (configuration == null)
            return false;

        _dbContext.EventConfigurations.Remove(configuration);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> EventExistsAsync(int eventId)
    {
        return await _dbContext.Events.AnyAsync(e => e.Id == eventId);
    }
}
