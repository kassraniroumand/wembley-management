import apiClient from './api-client';
import { Booking, BookingListResponse, CreateBooking, UpdateBooking } from '@/types/BookingType';

const BOOKING = "Booking"

export const bookingService = {
  getBookings: async (page = 1, pageSize = 10, eventId?: number, userId?: string): Promise<BookingListResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (eventId) params.append('eventId', eventId.toString());
    if (userId) params.append('userId', userId);

    const response = await apiClient.get<BookingListResponse>(`/${BOOKING}?${params.toString()}`);
    return response.data;
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/${BOOKING}/${id}`);
    return response.data;
  },

  getUserBookings: async (userId: string, page = 1, pageSize = 10): Promise<BookingListResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await apiClient.get<BookingListResponse>(`/${BOOKING}/my-bookings?${params.toString()}`);
    return response.data;
  },

  getEventBookings: async (eventId: number, page = 1, pageSize = 10): Promise<BookingListResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await apiClient.get<BookingListResponse>(`/${BOOKING}/event/${eventId}?${params.toString()}`);
    return response.data;
  },

  createBooking: async (booking: CreateBooking): Promise<Booking> => {
    const response = await apiClient.post<Booking>(`/${BOOKING}`, booking);
    return response.data;
  },

  updateBooking: async (id: number, booking: UpdateBooking): Promise<Booking> => {
    const response = await apiClient.put<Booking>(`/${BOOKING}/${id}`, booking);
    return response.data;
  },

  cancelBooking: async (id: number): Promise<Booking> => {
    console.log("Cancelling booking", id);
    const response = await apiClient.put<Booking>(`/${BOOKING}/${id}/cancel`);
    return response.data;
  },

  confirmBooking: async (id: number): Promise<Booking> => {
    const response = await apiClient.post<Booking>(`/${BOOKING}/${id}/confirm`);
    return response.data;
  },

  deleteBooking: async (id: number): Promise<void> => {
    await apiClient.delete(`/${BOOKING}/${id}`);
  }
};
