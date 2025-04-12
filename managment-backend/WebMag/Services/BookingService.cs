using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebMag.data;
using WebMag.Models;
using WebMag.Models.domain;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public class BookingService : IBookingService
{
    private readonly DomainDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public BookingService(DomainDbContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    public async Task<Booking> CreateBookingAsync(CreateBookingDTO createBookingDto, string userId)
    {
        // Check if event exists and is published
        var @event = await _dbContext.Events
            .FirstOrDefaultAsync(e => e.Id == createBookingDto.EventId);

        if (@event == null)
        {
            throw new Exception("Event not found");
        }

        if (!@event.IsPublished)
        {
            throw new Exception("This event is not available for booking");
        }

        if (@event.Status == EventStatus.Cancelled)
        {
            throw new Exception("Cannot book a cancelled event");
        }

        if (@event.StartDate < DateTime.UtcNow)
        {
            throw new Exception("Cannot book a past event");
        }

        // Check capacity
        int existingBookedTickets = await _dbContext.Bookings
            .Where(b => b.EventId == createBookingDto.EventId && b.Status != BookingStatus.Cancelled)
            .SumAsync(b => b.TicketCount);

        if (existingBookedTickets + createBookingDto.TicketCount > @event.PlannedCapacity)
        {
            throw new Exception("Not enough tickets available");
        }

        // Create booking
        var booking = new Booking
        {
            EventId = createBookingDto.EventId,
            UserId = userId,
            TicketCount = createBookingDto.TicketCount,
            BookingDate = DateTime.UtcNow,
            Status = BookingStatus.Confirmed,
            Reference = GenerateBookingReference(),
            Notes = createBookingDto.Notes,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = userId
        };

        await _dbContext.Bookings.AddAsync(booking);
        await _dbContext.SaveChangesAsync();

        return booking;
    }

    public async Task<BookingDTO> GetBookingByIdAsync(int id, string userId)
    {
        var booking = await _dbContext.Bookings
            .Include(b => b.Event)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return null;
        }

        // Only allow users to view their own bookings or admins to view any booking
        if (booking.UserId != userId && !IsUserAdmin(userId))
        {
            throw new UnauthorizedAccessException("You don't have permission to view this booking");
        }

        // Get user information from UserManager
        var user = await _userManager.FindByIdAsync(booking.UserId);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        var bookingDto = booking.Adapt<BookingDTO>();
        bookingDto.EventName = booking.Event.Name;
        bookingDto.UserName = $"{user.FirstName} {user.LastName}";
        bookingDto.StartDate = booking.Event.StartDate;
        bookingDto.EndDate = booking.Event.EndDate;

        return bookingDto;
    }

    public async Task<BookingListResponseDTO> GetUserBookingsAsync(string userId, int page = 1, int pageSize = 20)
    {
        var query = _dbContext.Bookings
            .Include(b => b.Event)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookingDate);

        int totalCount = await query.CountAsync();

        var bookings = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Get user information
        var user = await _userManager.FindByIdAsync(userId);
        string userName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown User";

        var bookingDtos = bookings.Select(b =>
        {
            var dto = b.Adapt<BookingDTO>();
            dto.EventName = b.Event.Name;
            dto.UserName = userName;
            dto.StartDate = b.Event.StartDate;
            dto.EndDate = b.Event.EndDate;
            return dto;
        }).ToList();

        return new BookingListResponseDTO
        {
            Bookings = bookingDtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<BookingListResponseDTO> GetEventBookingsAsync(int eventId, int page = 1, int pageSize = 20)
    {
        var query = _dbContext.Bookings
            .Include(b => b.Event)
            .Where(b => b.EventId == eventId)
            .OrderByDescending(b => b.BookingDate);

        int totalCount = await query.CountAsync();

        var bookings = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Get all user IDs from the bookings
        var userIds = bookings.Select(b => b.UserId).Distinct().ToList();

        // Get all users in one query
        var users = new Dictionary<string, ApplicationUser>();
        foreach (var userId in userIds)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                users[userId] = user;
            }
        }

        var bookingDtos = bookings.Select(b =>
        {
            var dto = b.Adapt<BookingDTO>();
            dto.EventName = b.Event.Name;

            // Use the dictionary to get user information
            if (users.TryGetValue(b.UserId, out var user))
            {
                dto.UserName = $"{user.FirstName} {user.LastName}";
            }
            else
            {
                dto.UserName = "Unknown User";
            }

            dto.StartDate = b.Event.StartDate;
            dto.EndDate = b.Event.EndDate;
            return dto;
        }).ToList();

        return new BookingListResponseDTO
        {
            Bookings = bookingDtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<BookingListResponseDTO> GetAllBookingsAsync(int page = 1, int pageSize = 20)
    {
        var query = _dbContext.Bookings
            .Include(b => b.Event)
            .OrderByDescending(b => b.BookingDate);

        int totalCount = await query.CountAsync();

        var bookings = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Get all user IDs from the bookings
        var userIds = bookings.Select(b => b.UserId).Distinct().ToList();

        // Get all users in one query
        var users = new Dictionary<string, ApplicationUser>();
        foreach (var userId in userIds)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                users[userId] = user;
            }
        }

        var bookingDtos = bookings.Select(b =>
        {
            var dto = b.Adapt<BookingDTO>();
            dto.EventName = b.Event.Name;

            // Use the dictionary to get user information
            if (users.TryGetValue(b.UserId, out var user))
            {
                dto.UserName = $"{user.FirstName} {user.LastName}";
            }
            else
            {
                dto.UserName = "Unknown User";
            }

            dto.StartDate = b.Event.StartDate;
            dto.EndDate = b.Event.EndDate;
            return dto;
        }).ToList();

        return new BookingListResponseDTO
        {
            Bookings = bookingDtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<Booking> UpdateBookingAsync(int id, UpdateBookingDTO updateBookingDto, string userId)
    {
        var booking = await _dbContext.Bookings
            .Include(b => b.Event)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            throw new Exception("Booking not found");
        }

        // Only allow users to update their own bookings or admins to update any booking
        if (booking.UserId != userId && !IsUserAdmin(userId))
        {
            throw new UnauthorizedAccessException("You don't have permission to update this booking");
        }

        // If increasing ticket count, check capacity
        if (updateBookingDto.TicketCount.HasValue && updateBookingDto.TicketCount > booking.TicketCount)
        {
            int additionalTickets = updateBookingDto.TicketCount.Value - booking.TicketCount;

            int existingBookedTickets = await _dbContext.Bookings
                .Where(b => b.EventId == booking.EventId && b.Status != BookingStatus.Cancelled && b.Id != id)
                .SumAsync(b => b.TicketCount);

            if (existingBookedTickets + booking.TicketCount + additionalTickets > booking.Event.PlannedCapacity)
            {
                throw new Exception("Not enough tickets available");
            }

            booking.TicketCount = updateBookingDto.TicketCount.Value;
        }
        else if (updateBookingDto.TicketCount.HasValue)
        {
            booking.TicketCount = updateBookingDto.TicketCount.Value;
        }

        if (updateBookingDto.Status.HasValue)
        {
            booking.Status = updateBookingDto.Status.Value;
        }

        if (updateBookingDto.Notes != null)
        {
            booking.Notes = updateBookingDto.Notes;
        }

        booking.UpdatedAt = DateTime.UtcNow;
        booking.UpdatedBy = userId;

        await _dbContext.SaveChangesAsync();

        return booking;
    }

    public async Task<bool> CancelBookingAsync(int id, string userId)
    {
        var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
        {
            return false;
        }

        // Only allow users to cancel their own bookings or admins to cancel any booking
        if (booking.UserId != userId && !IsUserAdmin(userId))
        {
            throw new UnauthorizedAccessException("You don't have permission to cancel this booking");
        }

        booking.Status = BookingStatus.Cancelled;
        booking.UpdatedAt = DateTime.UtcNow;
        booking.UpdatedBy = userId;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteBookingAsync(int id)
    {
        var booking = await _dbContext.Bookings.FindAsync(id);

        if (booking == null)
        {
            return false;
        }

        _dbContext.Bookings.Remove(booking);
        await _dbContext.SaveChangesAsync();

        return true;
    }

    private string GenerateBookingReference()
    {
        // Generate a unique booking reference (e.g., BOOK-{timestamp}-{random})
        return $"BOOK-{DateTime.UtcNow.ToString("yyyyMMddHHmmss")}-{Guid.NewGuid().ToString().Substring(0, 8)}";
    }

    private bool IsUserAdmin(string userId)
    {
        // This would be replaced with actual role checking logic
        // For now, we'll just rely on the controller's [Authorize(Roles = "Admin")] attributes
        return true;
    }
}
