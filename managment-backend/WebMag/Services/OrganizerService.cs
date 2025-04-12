using Mapster;
using Microsoft.EntityFrameworkCore;
using WebMag.data;
using WebMag.Models.domain;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public interface IOrganizerService
{
    Task<OrganizerListResponseDTO> GetOrganizersAsync(int page = 1, int pageSize = 20, string? searchTerm = null);
    Task<OrganizerDTO> GetOrganizerByIdAsync(string id);
    Task<OrganizerWithEventsDTO> GetOrganizerWithEventsAsync(string id, int page = 1, int pageSize = 10);
    Task<OrganizerDTO> CreateOrganizerAsync(CreateOrganizerDTO dto);
    Task<OrganizerDTO> UpdateOrganizerAsync(string id, UpdateOrganizerDTO dto);
    Task<bool> DeleteOrganizerAsync(string id);
    Task<bool> IsNameUniqueAsync(string name, string? excludeId = null);
    Task<int> GetEventCountAsync(string organizerId);
}

public class OrganizerService : IOrganizerService
{
    private readonly DomainDbContext _dbContext;

    public OrganizerService(DomainDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OrganizerListResponseDTO> GetOrganizersAsync(int page = 1, int pageSize = 20, string? searchTerm = null)
    {
        var query = _dbContext.Organizers.AsQueryable();

        // Apply search filter if provided
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(o =>
                o.Name.Contains(searchTerm) ||
                o.ContactPerson.Contains(searchTerm) ||
                o.Email.Contains(searchTerm));
        }

        // Get total count for pagination
        var totalCount = await query.CountAsync();

        // Apply pagination
        var skip = (page - 1) * pageSize;
        var organizers = await query
            .OrderBy(o => o.Name)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        // Map to DTOs
        var organizerDtos = organizers.Adapt<List<OrganizerDTO>>();

        return new OrganizerListResponseDTO
        {
            Organizers = organizerDtos,
            TotalCount = totalCount
        };
    }

    public async Task<OrganizerDTO> GetOrganizerByIdAsync(string id)
    {
        var organizer = await _dbContext.Organizers.FindAsync(id);
        if (organizer == null)
            return null;

        return organizer.Adapt<OrganizerDTO>();
    }

    public async Task<OrganizerWithEventsDTO> GetOrganizerWithEventsAsync(string id, int page = 1, int pageSize = 10)
    {
        var organizer = await _dbContext.Organizers.FindAsync(id);
        if (organizer == null)
            return null;

        // Get events with pagination
        var skip = (page - 1) * pageSize;
        var eventsQuery = _dbContext.Events
            .Include(e => e.Type)
            .Where(e => e.OrganizerId == id)
            .OrderByDescending(e => e.StartDate);

        var totalEventCount = await eventsQuery.CountAsync();

        var events = await eventsQuery
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        // Map to DTOs
        var organizerDto = organizer.Adapt<OrganizerDTO>();
        var eventDtos = events.Adapt<List<EventDTO>>();

        return new OrganizerWithEventsDTO
        {
            Organizer = organizerDto,
            Events = eventDtos,
            TotalEventCount = totalEventCount
        };
    }

    public async Task<OrganizerDTO> CreateOrganizerAsync(CreateOrganizerDTO dto)
    {
        // Validate unique name
        var nameExists = await _dbContext.Organizers
            .AnyAsync(o => o.Name.ToLower() == dto.Name.ToLower());

        if (nameExists)
            throw new Exception("An organizer with this name already exists");

        // Validate email format
        if (!string.IsNullOrEmpty(dto.Email) && !IsValidEmail(dto.Email))
            throw new Exception("The provided email is not valid");

        // Create organizer with a new GUID as the Id
        var organizer = dto.Adapt<Organizer>();
        organizer.Id = Guid.NewGuid().ToString();

        _dbContext.Organizers.Add(organizer);
        await _dbContext.SaveChangesAsync();

        return organizer.Adapt<OrganizerDTO>();
    }

    public async Task<OrganizerDTO> UpdateOrganizerAsync(string id, UpdateOrganizerDTO dto)
    {
        var organizer = await _dbContext.Organizers.FindAsync(id);
        if (organizer == null)
            throw new Exception($"Organizer with ID {id} not found");

        // Validate unique name (excluding current organizer)
        var nameExists = await _dbContext.Organizers
            .AnyAsync(o => o.Id != id && o.Name.ToLower() == dto.Name.ToLower());

        if (nameExists)
            throw new Exception("An organizer with this name already exists");

        // Validate email format
        if (!string.IsNullOrEmpty(dto.Email) && !IsValidEmail(dto.Email))
            throw new Exception("The provided email is not valid");

        // Update properties
        organizer.Name = dto.Name;
        organizer.ContactPerson = dto.ContactPerson;
        organizer.Email = dto.Email;
        organizer.Phone = dto.Phone;
        organizer.Type = dto.Type;
        organizer.Notes = dto.Notes;

        // Mark as modified
        _dbContext.Entry(organizer).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();

        return organizer.Adapt<OrganizerDTO>();
    }

    public async Task<bool> DeleteOrganizerAsync(string id)
    {
        var organizer = await _dbContext.Organizers.FindAsync(id);
        if (organizer == null)
            return false;

        // Check if organizer has events
        var hasEvents = await _dbContext.Events
            .AnyAsync(e => e.OrganizerId == id);

        if (hasEvents)
            throw new Exception("Cannot delete organizer that has associated events");

        _dbContext.Organizers.Remove(organizer);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsNameUniqueAsync(string name, string? excludeId = null)
    {
        var query = _dbContext.Organizers.AsQueryable();

        if (!string.IsNullOrEmpty(excludeId))
            query = query.Where(o => o.Id != excludeId);

        return !await query.AnyAsync(o => o.Name.ToLower() == name.ToLower());
    }

    public async Task<int> GetEventCountAsync(string organizerId)
    {
        return await _dbContext.Events
            .CountAsync(e => e.OrganizerId == organizerId);
    }

    // Helper method to validate email format
    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}
