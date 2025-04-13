using System.Security.Claims;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebMag.Models.domain;
using WebMag.Models.DTOs;
using WebMag.Services;

namespace WebMag.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<ActionResult<BookingDTO>> CreateBooking(CreateBookingDTO createBookingDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var booking = await _bookingService.CreateBookingAsync(createBookingDto, userId);
            var bookingDto = booking.Adapt<BookingDTO>();

            return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, bookingDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDTO>> GetBookingById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var booking = await _bookingService.GetBookingByIdAsync(id, userId);

            if (booking == null)
            {
                return NotFound();
            }

            return Ok(booking);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("my-bookings")]
    public async Task<ActionResult<BookingListResponseDTO>> GetMyBookings([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var bookings = await _bookingService.GetUserBookingsAsync(userId, page, pageSize);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("event/{eventId}")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BookingListResponseDTO>> GetEventBookings(int eventId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var bookings = await _bookingService.GetEventBookingsAsync(eventId, page, pageSize);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BookingListResponseDTO>> GetAllBookings([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var bookings = await _bookingService.GetAllBookingsAsync(page, pageSize);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BookingDTO>> UpdateBooking(int id, UpdateBookingDTO updateBookingDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var booking = await _bookingService.UpdateBookingAsync(id, updateBookingDto, userId);
            var bookingDto = booking.Adapt<BookingDTO>();

            return Ok(bookingDto);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/cancel")]
    public async Task<ActionResult> CancelBooking(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var result = await _bookingService.CancelBookingAsync(id, userId);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteBooking(int id)
    {
        try
        {
            var result = await _bookingService.DeleteBookingAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
