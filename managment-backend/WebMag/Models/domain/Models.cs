namespace WebMag.Models.domain;

public class Event
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public EventType Type { get; set; }
    public int EventTypeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime SetupStartDate { get; set; }
    public DateTime TeardownEndDate { get; set; }
    public int PlannedCapacity { get; set; }
    public string OrganizerId { get; set; }
    public Organizer Organizer { get; set; }
    public EventStatus Status { get; set; }
    public string Notes { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }

    public ICollection<ResourceAllocation> ResourceAllocations { get; set; }
    public ICollection<EventConfiguration> Configurations { get; set; }
}

public enum EventStatus
{
    Tentative,
    Confirmed,
    Cancelled,
    Completed
}

public class EventType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; } // Football, Concert, Corporate, etc.
    public int DefaultCapacity { get; set; }
    public int SetupDays { get; set; }
    public int TeardownDays { get; set; }
    public bool RequiresPitchAccess { get; set; }
    public string DefaultConfigurations { get; set; } // JSON string of default configurations

    public ICollection<EventTypeResource> DefaultResources { get; set; }
}

public class EventTypeResource
{
    public int Id { get; set; }
    public int EventTypeId { get; set; }
    public EventType EventType { get; set; }
    public int ResourceId { get; set; }
    public Resource Resource { get; set; }
    public int Quantity { get; set; }
}

public class Resource
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; } // Room, Equipment, Staff Category
    public bool IsLimited { get; set; }
    public int? MaxQuantity { get; set; }
    public string Notes { get; set; }
}

public class ResourceAllocation
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public Event Event { get; set; }
    public int ResourceId { get; set; }
    public Resource Resource { get; set; }
    public int Quantity { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}

public class Organizer
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string ContactPerson { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public OrganizerType Type { get; set; }
    public string Notes { get; set; }
}

public enum OrganizerType
{
    FootballAssociation,
    ConcertPromoter,
    CorporateClient,
    CharityOrganization,
    InternalTeam
}

public class EventConfiguration
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public Event Event { get; set; }
    public string ConfigurationType { get; set; } // Stage, Seating, Pitch, etc.
    public string Value { get; set; } // JSON configuration
}


public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
