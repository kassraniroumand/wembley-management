import React, { useState, useEffect } from 'react'
import { formatDate, DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEvents } from '@/hooks/useEvents'
import { EventDTO, EventStatus } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from 'react-router-dom'
import { useCreateBooking, useEventBookings, useDeleteBooking, useConfirmBooking, useCancelBooking } from '@/hooks/useBookings'
import { BookingForm } from '@/components/forms/BookingForm'
import { BookingFormValues } from '@/schema/bookingSchema'
import { BookingActionsDialog } from '@/components/dialogs/BookingActionsDialog'
import { Booking } from '@/types/BookingType'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BookingStatus } from '@/types/BookingType'

export default function BookingCalendar() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventDTO | null>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [eventsWithBookings, setEventsWithBookings] = useState<Set<number>>(new Set())
  const [userBookings, setUserBookings] = useState<Record<number, number>>({}) // Map of eventId to bookingId
  const [userBookedEvents, setUserBookedEvents] = useState<Set<number>>(new Set()) // Set of eventIds that the user has booked
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null)
  const [bookingToConfirm, setBookingToConfirm] = useState<number | null>(null)
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null)

  // Fetch all events with a large page size to get all events
  const { data: eventsData, isLoading } = useEvents(1, 1000)

  // Booking mutations
  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking()
  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking()
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()

  // Fetch bookings for each event to determine which events have bookings
  useEffect(() => {
    if (eventsData?.events) {
      const eventsWithBookingsSet = new Set<number>();
      const bookingsMap: Record<number, number> = {};
      const userBookedEventsSet = new Set<number>();

      // Check each event for bookings
      eventsData.events.forEach(event => {
        // In a real app, you would fetch bookings for each event
        // For now, we'll simulate some events having bookings
        if (event.id % 3 === 0) { // Every third event has bookings
          eventsWithBookingsSet.add(event.id);
          // Simulate a booking ID for this event
          bookingsMap[event.id] = event.id * 10; // Create a booking ID based on event ID

          // Simulate user bookings (every fifth event is booked by the user)
          if (event.id % 5 === 0) {
            userBookedEventsSet.add(event.id);
          }
        }
      });

      setEventsWithBookings(eventsWithBookingsSet);
      setUserBookings(bookingsMap);
      setUserBookedEvents(userBookedEventsSet);
    }
  }, [eventsData]);

  const { mutate: createBooking, isPending: isCreating } = useCreateBooking()

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  function handleEventClick(clickInfo: EventClickArg) {
    const eventId = parseInt(clickInfo.event.id)
    const event = eventsData?.events.find(e => e.id === eventId)
    if (event) {
      setSelectedEvent(event)
      setShowBookingDialog(true)
    }
  }

  function renderEventContent(eventInfo: EventContentArg) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

  const handleCreateBooking = (data: BookingFormValues) => {
    if (!selectedEvent) return

    createBooking({
      ...data,
      eventId: selectedEvent.id
    }, {
      onSuccess: (response) => {
        toast({
          title: "Success",
          description: "Event booked successfully"
        })
        setShowBookingDialog(false)
        setSelectedEvent(null)

        // Add the event to the set of events with bookings
        setEventsWithBookings(prev => {
          const newSet = new Set(prev);
          newSet.add(selectedEvent.id);
          return newSet;
        });

        // Add the event to the set of user booked events
        setUserBookedEvents(prev => {
          const newSet = new Set(prev);
          newSet.add(selectedEvent.id);
          return newSet;
        });

        // Add the booking ID to the map
        setUserBookings(prev => ({
          ...prev,
          [selectedEvent.id]: response.id
        }));
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to book event: " + error.message,
          variant: "destructive"
        })
      }
    })
  }

  const handleViewBookingDetails = (id: number) => {
    navigate(`/bookings/${id}`);
  };

  const handleViewEvent = (eventId: number) => {
    navigate(`/events/${eventId}`);
  };

  const handleConfirmBooking = (id: number) => {
    confirmBooking(id, {
      onSuccess: () => {
        toast({
          title: "Booking Confirmed",
          description: "The booking has been confirmed successfully.",
        });
        setBookingToConfirm(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to confirm booking: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleCancelBooking = (id: number) => {
    cancelBooking(id, {
      onSuccess: () => {
        toast({
          title: "Booking Cancelled",
          description: "The booking has been cancelled successfully.",
        });
        setBookingToCancel(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to cancel booking: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDeleteBooking = (id: number) => {
    deleteBooking(id, {
      onSuccess: () => {
        toast({
          title: "Booking Deleted",
          description: "The booking has been deleted successfully.",
        });

        // Remove the event from the set of events with bookings
        if (selectedEvent) {
          setEventsWithBookings(prev => {
            const newSet = new Set(prev);
            newSet.delete(selectedEvent.id);
            return newSet;
          });

          // Remove the event from the set of user booked events
          setUserBookedEvents(prev => {
            const newSet = new Set(prev);
            newSet.delete(selectedEvent.id);
            return newSet;
          });

          // Remove the booking ID from the map
          setUserBookings(prev => {
            const newMap = { ...prev };
            delete newMap[selectedEvent.id];
            return newMap;
          });
        }
        setBookingToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete booking: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  const events = eventsData?.events
    .map((event: EventDTO) => {
      const eventId = event.id;
      const isBookedByUser = userBookedEvents.has(eventId);
      const hasBookings = eventsWithBookings.has(eventId);

      return {
        id: String(event.id),
        title: event.name,
        start: event.startDate,
        end: event.endDate,
        allDay: false,
        backgroundColor: '#3788d8', // Use a consistent blue color for all events
        borderColor: '#1976D2',
        extendedProps: {
          description: event.description,
          eventTypeName: event.eventTypeName,
          organizerName: event.organizerName,
          status: event.status,
          isPublished: event.isPublished,
          hasBookings,
          isBookedByUser
        }
      };
    }) || []

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.Tentative:
        return <Badge variant="outline">Tentative</Badge>;
      case EventStatus.Confirmed:
        return <Badge variant="default">Confirmed</Badge>;
      case EventStatus.Cancelled:
        return <Badge variant="destructive">Cancelled</Badge>;
      case EventStatus.Completed:
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  }

  // Create a mock booking object for the dialog
  const createMockBooking = (eventId: number): Booking => {
    const event = eventsData?.events.find(e => e.id === eventId);
    return {
      id: userBookings[eventId] || 0,
      eventId: eventId,
      eventName: event?.name || "",
      userId: "current-user-id",
      userName: "Current User",
      ticketCount: 1,
      bookingDate: new Date().toISOString(),
      status: BookingStatus.Pending,
      statusString: "Pending",
      reference: `BK-${eventId}-${Math.floor(Math.random() * 1000)}`,
      notes: "",
      startDate: event?.startDate || "",
      endDate: event?.endDate || ""
    };
  };

  return (
    <div className='demo-app container mx-auto mt-4'>
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={false}
          selectable={false}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          loading={(isLoading) => {
            // You can add a loading indicator here if needed
          }}
        />
      </div>

      {/* Event Details and Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Event Type</span>
              <span className="col-span-3">{selectedEvent?.eventTypeName}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Organizer</span>
              <span className="col-span-3">{selectedEvent?.organizerName}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Start Date</span>
              <span className="col-span-3">
                {selectedEvent?.startDate && format(new Date(selectedEvent.startDate), "PPP p")}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">End Date</span>
              <span className="col-span-3">
                {selectedEvent?.endDate && format(new Date(selectedEvent.endDate), "PPP p")}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Status</span>
              <span className="col-span-3">
                {selectedEvent?.status && getStatusBadge(selectedEvent.status)}
              </span>
            </div>
            {selectedEvent && eventsWithBookings.has(selectedEvent.id) && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Bookings</span>
                <span className="col-span-3">
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    Has Bookings
                  </Badge>
                </span>
              </div>
            )}
            {selectedEvent && userBookedEvents.has(selectedEvent.id) && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Your Booking</span>
                <span className="col-span-3">
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                    You've Booked This Event
                  </Badge>
                </span>
              </div>
            )}
          </div>
          <div className="mt-4">
            {selectedEvent && !userBookedEvents.has(selectedEvent.id) ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Book This Event</h3>
                <BookingForm
                  onSubmit={handleCreateBooking}
                  isSubmitting={isCreating}
                  defaultValues={{
                    eventId: selectedEvent?.id || 0,
                    ticketCount: 1,
                    notes: ""
                  }}
                  event={selectedEvent || undefined}
                />
              </>
            ) : selectedEvent && userBookedEvents.has(selectedEvent.id) ? (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedBooking(createMockBooking(selectedEvent.id));
                    setIsActionDialogOpen(true);
                    setShowBookingDialog(false);
                  }}
                >
                  Manage Your Booking
                </Button>
              </div>
            ) : null}
          </div>
          <DialogFooter className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/my-bookings')}
            >
              View My Bookings
            </Button>
            {selectedEvent && eventsWithBookings.has(selectedEvent.id) && !userBookedEvents.has(selectedEvent.id) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedBooking(createMockBooking(selectedEvent.id));
                  setIsActionDialogOpen(true);
                  setShowBookingDialog(false);
                }}
              >
                Manage Booking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Actions Dialog */}
      {selectedBooking && (
        <BookingActionsDialog
          booking={selectedBooking}
          isOpen={isActionDialogOpen}
          onOpenChange={setIsActionDialogOpen}
          onViewBookingDetails={handleViewBookingDetails}
          onViewEvent={handleViewEvent}
          onConfirmBooking={handleConfirmBooking}
          onCancelBooking={handleCancelBooking}
          onDeleteBooking={handleDeleteBooking}
          setBookingToConfirm={setBookingToConfirm}
          setBookingToCancel={setBookingToCancel}
          setBookingToDelete={setBookingToDelete}
        />
      )}

      {/* Confirm Booking Dialog */}
      <AlertDialog open={!!bookingToConfirm} onOpenChange={() => setBookingToConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this booking? This will update the booking status to "Confirmed".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (bookingToConfirm) {
                  handleConfirmBooking(bookingToConfirm);
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Booking Dialog */}
      <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (bookingToCancel) {
                  handleCancelBooking(bookingToCancel);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Booking Dialog */}
      <AlertDialog open={!!bookingToDelete} onOpenChange={() => setBookingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone and will permanently remove the booking from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (bookingToDelete) {
                  handleDeleteBooking(bookingToDelete);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
