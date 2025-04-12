import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBooking } from "@/hooks/useBookings";

import { BookingForm } from "@/components/forms/BookingForm";
import { BookingFormValues } from "@/schema/bookingSchema";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EventDTO } from "@/types";
import { useEvent, useEvents } from "@/hooks";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function CreateBookingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Set default fromDate to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [fromDate, setFromDate] = useState<Date>(today);

  // Fetch events with filter
  const { data: eventsData, isLoading: isLoadingEvents, error: eventsError } = useEvents(1, 20, {
    fromDate
  });

  // Create booking mutation
  const { mutate: createBooking, isPending } = useCreateBooking();

  // Get the selected event from the list
  const selectedEvent = selectedEventId ?
    eventsData?.events.find(event => event.id === selectedEventId) :
    null;

  const handleSubmit = (formData: BookingFormValues) => {
    createBooking(
      {
        eventId: formData.eventId,
        ticketCount: formData.ticketCount,
        notes: formData.notes
      },
      {
        onSuccess: (response) => {
          toast({
            title: "Booking Confirmed",
            description: `Your booking has been created successfully.`,
          });
          navigate("/my-bookings");
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to create booking: " + error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleBack = () => {
    navigate("/my-bookings");
  };

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(parseInt(eventId));
  };

  // Handle date change
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      date.setHours(0, 0, 0, 0);
      setFromDate(date);
      setSelectedEventId(null); // Reset selected event when date changes
    }
  };

  if (eventsError) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Error loading events: {eventsError.message}</p>
          </div>
        </div>
        <Button onClick={handleBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={handleBack} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Booking</h1>
          <p className="text-muted-foreground">Complete your booking details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Show Events From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fromDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-select">Select an Event</Label>
                    <Select
                      onValueChange={handleEventSelect}
                      value={selectedEventId?.toString() || "none"}
                    >
                      <SelectTrigger id="event-select">
                        <SelectValue placeholder="Choose an event to book" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select an event</SelectItem>
                        {eventsData?.events
                          .filter(event => event.isPublished)
                          .map(event => (
                            <SelectItem key={event.id} value={event.id.toString()}>
                              {event.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedEvent && (
                    <BookingForm
                      onSubmit={handleSubmit}
                      isSubmitting={isPending}
                      event={selectedEvent}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedEvent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" /> Event Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Event</h3>
                    <p>{selectedEvent.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Organizer</h3>
                    <p>{selectedEvent.organizerName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Date & Time</h3>
                    <p>
                      {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Event Type</h3>
                    <p>{selectedEvent.eventTypeName}</p>
                  </div>
                  {selectedEvent.description && (
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="text-sm">{selectedEvent.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
