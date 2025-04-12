using WebMag.Models.domain;

namespace WebMag.Models.DTOs;

public class EventDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int EventTypeId { get; set; }
    public string EventTypeName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime SetupStartDate { get; set; }
    public DateTime TeardownEndDate { get; set; }
    public int PlannedCapacity { get; set; }
    public string OrganizerId { get; set; }
    public string OrganizerName { get; set; }
    public EventStatus Status { get; set; }
    public string Notes { get; set; }
    public bool IsPublished { get; set; }
}

public class CreateEventDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int EventTypeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? SetupStartDate { get; set; }
    public DateTime? TeardownEndDate { get; set; }
    public int? PlannedCapacity { get; set; }
    public string OrganizerId { get; set; }
    public EventStatus Status { get; set; } = EventStatus.Tentative;
    public string Notes { get; set; }
    public bool IsPublished { get; set; } = false;
    public bool UseEventTypeDefaultResources { get; set; } = true;
}

public class UpdateEventDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int EventTypeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime SetupStartDate { get; set; }
    public DateTime TeardownEndDate { get; set; }
    public int PlannedCapacity { get; set; }
    public string OrganizerId { get; set; }
    public EventStatus Status { get; set; }
    public string Notes { get; set; }
    public bool IsPublished { get; set; }
}

public class EventListResponseDTO
{
    public List<EventDTO> Events { get; set; }
    public int TotalCount { get; set; }
}

public class EventDetailsDTO
{
    public EventDTO Event { get; set; }
    public List<ResourceAllocationDTO> ResourceAllocations { get; set; }
    public List<EventConfigurationDTO> Configurations { get; set; }
}

public class EventConfigurationDTO
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public string ConfigurationType { get; set; }
    public string Value { get; set; }
}

public class CreateEventConfigurationDTO
{
    public int EventId { get; set; }
    public string ConfigurationType { get; set; }
    public string Value { get; set; }
}

public class UpdateEventConfigurationDTO
{
    public string Value { get; set; }
}
