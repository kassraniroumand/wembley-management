namespace WebMag.Models.DTOs;

// EventType DTOs
public class EventTypeDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public int DefaultCapacity { get; set; }
    public int SetupDays { get; set; }
    public int TeardownDays { get; set; }
    public bool RequiresPitchAccess { get; set; }
    public string DefaultConfigurations { get; set; }
}

public class CreateEventTypeDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public int DefaultCapacity { get; set; }
    public int SetupDays { get; set; }
    public int TeardownDays { get; set; }
    public bool RequiresPitchAccess { get; set; }
    public string DefaultConfigurations { get; set; }
}

public class UpdateEventTypeDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public int DefaultCapacity { get; set; }
    public int SetupDays { get; set; }
    public int TeardownDays { get; set; }
    public bool RequiresPitchAccess { get; set; }
    public string? DefaultConfigurations { get; set; }
}

// Response DTO for collections
public class EventTypeListResponseDTO
{
    public List<EventTypeDTO> EventTypes { get; set; }
    public int TotalCount { get; set; }
}

// EventTypeResource DTO for default resources
public class EventTypeResourceDTO
{
    public int Id { get; set; }
    public int EventTypeId { get; set; }
    public string EventTypeName { get; set; }
    public int ResourceId { get; set; }
    public string ResourceName { get; set; }
    public int Quantity { get; set; }
}

public class CreateEventTypeResourceDTO
{
    public int EventTypeId { get; set; }
    public int ResourceId { get; set; }
    public int Quantity { get; set; }
}

public class UpdateEventTypeResourceDTO
{
    public int Quantity { get; set; }
}

public class EventTypeWithResourcesDTO
{
    public EventTypeDTO EventType { get; set; }
    public List<EventTypeResourceDTO> DefaultResources { get; set; }
}
