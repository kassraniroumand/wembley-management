using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebMag.Models.domain;

public class Booking
{
    public int Id { get; set; }

    [Required]
    public int EventId { get; set; }

    [ForeignKey("EventId")]
    public Event Event { get; set; }

    [Required]
    public string UserId { get; set; }

    public int TicketCount { get; set; }

    public DateTime BookingDate { get; set; }

    public BookingStatus Status { get; set; }

    public string Reference { get; set; }

    public string Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public string CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? UpdatedBy { get; set; }
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Attended,
    NoShow
}
