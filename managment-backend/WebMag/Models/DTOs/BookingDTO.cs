using System.ComponentModel.DataAnnotations;
using WebMag.Models.domain;

namespace WebMag.Models.DTOs;

public class BookingDTO
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public string EventName { get; set; }
    public string UserId { get; set; }
    public string UserName { get; set; }
    public int TicketCount { get; set; }
    public DateTime BookingDate { get; set; }
    public BookingStatus Status { get; set; }
    public string StatusString => Status.ToString();
    public string Reference { get; set; }
    public string Notes { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class CreateBookingDTO
{
    [Required]
    public int EventId { get; set; }

    [Required]
    [Range(1, 100, ErrorMessage = "Ticket count must be between 1 and 100")]
    public int TicketCount { get; set; }

    public string Notes { get; set; }
}

public class UpdateBookingDTO
{
    [Range(1, 100, ErrorMessage = "Ticket count must be between 1 and 100")]
    public int? TicketCount { get; set; }

    public BookingStatus? Status { get; set; }

    public string Notes { get; set; }
}

public class BookingListResponseDTO
{
    public List<BookingDTO> Bookings { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
