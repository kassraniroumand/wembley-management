export enum BookingStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Attended = "Attended",
  NoShow = "NoShow"
}

export interface Booking {
  id: number;
  eventId: number;
  eventName: string;
  userId: string;
  userName: string;
  ticketCount: number;
  bookingDate: string;
  status: BookingStatus;
  statusString: string;
  reference: string;
  notes: string;
  startDate: string;
  endDate: string;
}

export interface CreateBooking {
  eventId: number;
  ticketCount: number;
  notes?: string;
}

export interface UpdateBooking {
  ticketCount?: number;
  status?: BookingStatus;
  notes?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  totalCount: number;
  page: number;
  pageSize: number;
}
