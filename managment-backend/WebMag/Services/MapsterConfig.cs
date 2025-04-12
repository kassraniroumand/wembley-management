using Mapster;
using WebMag.Models.domain;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public static class MapsterConfig
{
    public static void RegisterMappings()
    {
        RegisterResourceMappings();
        RegisterEventTypeMappings();
        RegisterCategoryMappings();
        RegisterEventMappings();
        RegisterOrganizerMappings();
    }

    public static void RegisterResourceMappings()
    {
        // Resource -> ResourceDTO
        TypeAdapterConfig<Resource, ResourceDTO>.NewConfig();

        // CreateResourceDTO -> Resource
        TypeAdapterConfig<CreateResourceDTO, Resource>.NewConfig()
            .Ignore(dest => dest.Id);
            // .Ignore(dest => dest.CreatedAt)
            // .Ignore(dest => dest.CreatedBy)
            // .Ignore(dest => dest.UpdatedAt)
            // .Ignore(dest => dest.UpdatedBy);

        // UpdateResourceDTO -> Resource
        TypeAdapterConfig<UpdateResourceDTO, Resource>.NewConfig()
            .Ignore(dest => dest.Id);
            // .Ignore(dest => dest.CreatedAt)
            // .Ignore(dest => dest.CreatedBy)
            // .Ignore(dest => dest.UpdatedAt)
            // .Ignore(dest => dest.UpdatedBy);

        // ResourceAllocation -> ResourceAllocationDTO
        TypeAdapterConfig<ResourceAllocation, ResourceAllocationDTO>.NewConfig()
            .Map(dest => dest.EventName, src => src.Event != null ? src.Event.Name : null)
            .Map(dest => dest.ResourceName, src => src.Resource != null ? src.Resource.Name : null);

        // CreateResourceAllocationDTO -> ResourceAllocation
        TypeAdapterConfig<CreateResourceAllocationDTO, ResourceAllocation>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.Event)
            .Ignore(dest => dest.Resource);

        // UpdateResourceAllocationDTO -> ResourceAllocation
        TypeAdapterConfig<UpdateResourceAllocationDTO, ResourceAllocation>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.EventId)
            .Ignore(dest => dest.Event)
            .Ignore(dest => dest.Resource);
    }

    public static void RegisterEventTypeMappings()
    {
        // EventType -> EventTypeDTO
        TypeAdapterConfig<EventType, EventTypeDTO>.NewConfig();

        // CreateEventTypeDTO -> EventType
        TypeAdapterConfig<CreateEventTypeDTO, EventType>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.DefaultResources);

        // UpdateEventTypeDTO -> EventType
        TypeAdapterConfig<UpdateEventTypeDTO, EventType>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.DefaultResources);

        // EventTypeResource -> EventTypeResourceDTO
        TypeAdapterConfig<EventTypeResource, EventTypeResourceDTO>.NewConfig()
            .Map(dest => dest.EventTypeName, src => src.EventType != null ? src.EventType.Name : null)
            .Map(dest => dest.ResourceName, src => src.Resource != null ? src.Resource.Name : null);

        // CreateEventTypeResourceDTO -> EventTypeResource
        TypeAdapterConfig<CreateEventTypeResourceDTO, EventTypeResource>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.EventType)
            .Ignore(dest => dest.Resource);
    }

    public static void RegisterCategoryMappings()
    {
        // Category -> CategoryDTO
        TypeAdapterConfig<Category, CategoryDTO>.NewConfig();

        // CreateCategoryDTO -> Category
        TypeAdapterConfig<CreateCategoryDTO, Category>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedBy)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.UpdatedBy);

        // UpdateCategoryDTO -> Category
        TypeAdapterConfig<UpdateCategoryDTO, Category>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedBy)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.UpdatedBy);
    }

    public static void RegisterEventMappings()
    {
        // Event -> EventDTO
        TypeAdapterConfig<Event, EventDTO>.NewConfig()
            .Map(dest => dest.EventTypeName, src => src.Type != null ? src.Type.Name : null)
            .Map(dest => dest.OrganizerName, src => src.Organizer != null ? src.Organizer.Name : null);

        // CreateEventDTO -> Event
        TypeAdapterConfig<CreateEventDTO, Event>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.Type)
            .Ignore(dest => dest.Organizer)
            .Ignore(dest => dest.ResourceAllocations)
            .Ignore(dest => dest.Configurations)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedBy)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.UpdatedBy)
            .Map(dest => dest.SetupStartDate, src => src.SetupStartDate.HasValue ? src.SetupStartDate.Value : src.StartDate.AddDays(-1))
            .Map(dest => dest.TeardownEndDate, src => src.TeardownEndDate.HasValue ? src.TeardownEndDate.Value : src.EndDate.AddDays(1))
            .Map(dest => dest.PlannedCapacity, src => src.PlannedCapacity.HasValue ? src.PlannedCapacity.Value : 0);

        // UpdateEventDTO -> Event
        TypeAdapterConfig<UpdateEventDTO, Event>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.Type)
            .Ignore(dest => dest.Organizer)
            .Ignore(dest => dest.ResourceAllocations)
            .Ignore(dest => dest.Configurations)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.CreatedBy)
            .Ignore(dest => dest.UpdatedAt)
            .Ignore(dest => dest.UpdatedBy);

        // EventConfiguration -> EventConfigurationDTO
        TypeAdapterConfig<EventConfiguration, EventConfigurationDTO>.NewConfig();

        // CreateEventConfigurationDTO -> EventConfiguration
        TypeAdapterConfig<CreateEventConfigurationDTO, EventConfiguration>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.Event);

        // UpdateEventConfigurationDTO -> EventConfiguration
        TypeAdapterConfig<UpdateEventConfigurationDTO, EventConfiguration>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.EventId)
            .Ignore(dest => dest.Event)
            .Ignore(dest => dest.ConfigurationType);
    }

    public static void RegisterOrganizerMappings()
    {
        // Organizer -> OrganizerDTO
        TypeAdapterConfig<Organizer, OrganizerDTO>.NewConfig();

        // CreateOrganizerDTO -> Organizer
        TypeAdapterConfig<CreateOrganizerDTO, Organizer>.NewConfig()
            .Ignore(dest => dest.Id);

        // UpdateOrganizerDTO -> Organizer
        TypeAdapterConfig<UpdateOrganizerDTO, Organizer>.NewConfig()
            .Ignore(dest => dest.Id);
    }
}
