using WebMag.Models.domain;

namespace WebMag.Models.DTOs;

public class OrganizerDTO
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string ContactPerson { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public OrganizerType Type { get; set; }
    public string Notes { get; set; }
}

public class CreateOrganizerDTO
{
    public string Name { get; set; }
    public string ContactPerson { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public OrganizerType Type { get; set; }
    public string Notes { get; set; }
}

public class UpdateOrganizerDTO
{
    public string Name { get; set; }
    public string ContactPerson { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public OrganizerType Type { get; set; }
    public string Notes { get; set; }
}

public class OrganizerListResponseDTO
{
    public List<OrganizerDTO> Organizers { get; set; }
    public int TotalCount { get; set; }
}

public class OrganizerWithEventsDTO
{
    public OrganizerDTO Organizer { get; set; }
    public List<EventDTO> Events { get; set; }
    public int TotalEventCount { get; set; }
}
