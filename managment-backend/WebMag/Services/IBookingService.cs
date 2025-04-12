using WebMag.Models.domain;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public interface IBookingService
{
    Task<Booking> CreateBookingAsync(CreateBookingDTO createBookingDto, string userId);
    Task<BookingDTO> GetBookingByIdAsync(int id, string userId);
    Task<BookingListResponseDTO> GetUserBookingsAsync(string userId, int page = 1, int pageSize = 20);
    Task<BookingListResponseDTO> GetEventBookingsAsync(int eventId, int page = 1, int pageSize = 20);
    Task<BookingListResponseDTO> GetAllBookingsAsync(int page = 1, int pageSize = 20);
    Task<Booking> UpdateBookingAsync(int id, UpdateBookingDTO updateBookingDto, string userId);
    Task<bool> CancelBookingAsync(int id, string userId);
    Task<bool> DeleteBookingAsync(int id);
}
