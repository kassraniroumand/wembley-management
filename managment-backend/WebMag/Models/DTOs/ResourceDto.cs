namespace WebMag.Models.DTOs;

// Resource DTOs
public class ResourceDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public bool IsLimited { get; set; }
    public int? MaxQuantity { get; set; }
    public string Notes { get; set; }
}

public class CreateResourceDTO
{
    public string Name { get; set; }
    public string Type { get; set; }
    public bool IsLimited { get; set; }
    public int? MaxQuantity { get; set; }
    public string Notes { get; set; }
}

public class UpdateResourceDTO
{
    public string Name { get; set; }
    public string Type { get; set; }
    public bool IsLimited { get; set; }
    public int? MaxQuantity { get; set; }
    public string Notes { get; set; }
}

// ResourceAllocation DTOs
public class ResourceAllocationDTO
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public string EventName { get; set; }
    public int ResourceId { get; set; }
    public string ResourceName { get; set; }
    public int Quantity { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}

public class CreateResourceAllocationDTO
{
    public int EventId { get; set; }
    public int ResourceId { get; set; }
    public int Quantity { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}

public class UpdateResourceAllocationDTO
{
    public int ResourceId { get; set; }
    public int Quantity { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}

// Response DTOs for collections
public class ResourceListResponseDTO
{
    public List<ResourceDTO> Resources { get; set; }
    public int TotalCount { get; set; }
}

public class ResourceAllocationListResponseDTO
{
    public List<ResourceAllocationDTO> Allocations { get; set; }
    public int TotalCount { get; set; }
}

// Additional DTO for availability check
public class ResourceAvailabilityRequestDTO
{
    public int ResourceId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int? ExcludeAllocationId { get; set; }
}

public class ResourceAvailabilityResponseDTO
{
    public bool IsAvailable { get; set; }
    public List<ResourceAllocationDTO> ConflictingAllocations { get; set; }
}