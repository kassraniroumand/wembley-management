import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking-service";
import { Booking, CreateBooking, UpdateBooking } from "@/types/BookingType";

// Hook to fetch all bookings with pagination
export const useBookings = (page = 1, pageSize = 10, eventId?: number, userId?: string) => {
  return useQuery({
    queryKey: ["bookings", page, pageSize, eventId, userId],
    queryFn: () => bookingService.getBookings(page, pageSize, eventId, userId),
  });
};

// Hook to fetch a single booking by ID
export const useBooking = (id: number) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,
  });
};

// Hook to fetch bookings for a specific user
export const useUserBookings = (userId: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["userBookings", userId, page, pageSize],
    queryFn: () => bookingService.getUserBookings(userId, page, pageSize),
    enabled: !!userId,
  });
};

// Hook to fetch bookings for a specific event
export const useEventBookings = (eventId: number, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["eventBookings", eventId, page, pageSize],
    queryFn: () => bookingService.getEventBookings(eventId, page, pageSize),
    enabled: !!eventId,
  });
};

// Hook to create a new booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: CreateBooking) => bookingService.createBooking(booking),
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["eventBookings"] });
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
    },
  });
};

// Hook to update an existing booking
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, booking }: { id: number; booking: UpdateBooking }) =>
      bookingService.updateBooking(id, booking),
    onSuccess: (updatedBooking) => {
      // Update the specific booking in the cache
      queryClient.setQueryData(["booking", updatedBooking.id], updatedBooking);

      // Invalidate relevant queries to refetch lists
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["eventBookings", updatedBooking.eventId]
      });
      queryClient.invalidateQueries({
        queryKey: ["userBookings", updatedBooking.userId]
      });
    },
  });
};

// Hook to cancel a booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookingService.cancelBooking(id),
    onSuccess: (updatedBooking) => {
      // Update the specific booking in the cache
      // queryClient.setQueryData(["booking", updatedBooking.id], updatedBooking);

      // Invalidate relevant queries to refetch lists
      // queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      queryClient.invalidateQueries({
        queryKey: ["eventBookings", updatedBooking.eventId]
      });
      queryClient.invalidateQueries({
        queryKey: ["userBookings","current-user-id",1,10]
      });
    },
  });
};

// Hook to confirm a booking
export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookingService.confirmBooking(id),
    onSuccess: (updatedBooking) => {
      // Update the specific booking in the cache
      queryClient.setQueryData(["booking", updatedBooking.id], updatedBooking);

      // Invalidate relevant queries to refetch lists
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["eventBookings", updatedBooking.eventId]
      });
      queryClient.invalidateQueries({
        queryKey: ["userBookings", updatedBooking.userId]
      });
    },
  });
};

// Hook to delete a booking
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookingService.deleteBooking(id),
    onSuccess: (_, id) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["eventBookings"] });
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });

      // Remove the specific booking from the cache
      queryClient.removeQueries({ queryKey: ["booking", id] });
    },
  });
};
