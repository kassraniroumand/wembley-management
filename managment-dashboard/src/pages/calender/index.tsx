import React, { useState, useCallback } from 'react'
import { formatDate, DateSelectArg, EventClickArg, EventDropArg, EventContentArg, EventApi } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEvents } from '@/hooks/useEvents'
import { EventDTO, UpdateEventDTO, EventStatus } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import { useUpdateEvent, useCreateEvent, useDeleteEvent } from '@/hooks/useEvents'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from 'react-router-dom'
import { EventForm } from '@/components/forms/EventForm'
import { EventFormValues } from '@/schema/eventSchema'
import { Trash2 } from 'lucide-react'

export default function Calendar() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventDTO | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null)
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data: eventsData, isLoading } = useEvents(1, 100, {
    fromDate: dateRange.start,
    toDate: dateRange.end
  })

  const { mutate: updateEvent } = useUpdateEvent()
  const { mutate: createEvent, isPending: isCreating } = useCreateEvent()
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent()

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  function handleDateSelect(selectInfo: DateSelectArg) {
    // Create new date objects with the selected dates but set to noon to avoid timezone issues
    const startDate = new Date(selectInfo.start);
    startDate.setHours(12, 0, 0, 0);

    // For end date, we need to subtract one day to avoid the one-day offset
    // FullCalendar's end date is exclusive (it's the day after the last day)
    const endDate = new Date(selectInfo.end);
    endDate.setDate(endDate.getDate() - 1); // Subtract one day to make it inclusive
    endDate.setHours(12, 0, 0, 0);

    setSelectedDateRange({
      start: startDate,
      end: endDate
    });
    setShowCreateDialog(true);
  }

  function handleEventClick(clickInfo: EventClickArg) {
    const eventId = parseInt(clickInfo.event.id)
    const event = eventsData?.events.find(e => e.id === eventId)
    if (event) {
      setSelectedEvent(event)
    }
  }

  const handleEventDrop = useCallback(async (dropInfo: EventDropArg) => {
    const { event } = dropInfo
    const eventId = parseInt(event.id)

    if (isNaN(eventId)) {
      dropInfo.revert()
      return
    }

    // Find the original event data
    const originalEvent = eventsData?.events.find(e => e.id === eventId)
    if (!originalEvent) {
      dropInfo.revert()
      return
    }

    try {
      const updateData: UpdateEventDTO = {
        name: originalEvent.name,
        description: originalEvent.description,
        eventTypeId: originalEvent.eventTypeId,
        startDate: event.start?.toISOString() || originalEvent.startDate,
        endDate: event.end?.toISOString() || originalEvent.endDate,
        setupStartDate: originalEvent.setupStartDate,
        teardownEndDate: originalEvent.teardownEndDate,
        plannedCapacity: originalEvent.plannedCapacity,
        organizerId: originalEvent.organizerId,
        status: originalEvent.status,
        notes: originalEvent.notes,
        isPublished: originalEvent.isPublished
      }

      await updateEvent({
        id: eventId,
        event: updateData
      })

      toast({
        title: "Success",
        description: "Event date updated successfully"
      })
    } catch (error) {
      dropInfo.revert()
      toast({
        title: "Error",
        description: "Failed to update event date",
        variant: "destructive"
      })
    }
  }, [updateEvent, toast, eventsData])

  function renderEventContent(eventInfo: EventContentArg) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

  const handleCreateEvent = (data: EventFormValues) => {
    createEvent(data, {
      onSuccess: (response) => {
        toast({
          title: "Success",
          description: "Event created successfully"
        })
        setShowCreateDialog(false)
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create event: " + error.message,
          variant: "destructive"
        })
      }
    })
  }

  const events = eventsData?.events.map((event: EventDTO) => ({
    id: String(event.id),
    title: event.name,
    start: event.startDate,
    end: event.endDate,
    allDay: false,
    extendedProps: {
      description: event.description,
      eventTypeName: event.eventTypeName,
      organizerName: event.organizerName,
      status: event.status,
      isPublished: event.isPublished
    }
  })) || []

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

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    deleteEvent(selectedEvent.id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Event deleted successfully"
        });
        setIsDeleteDialogOpen(false);
        setSelectedEvent(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete event: " + error.message,
          variant: "destructive"
        });
      }
    });
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
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={events}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          datesSet={(dateInfo) => {
            setDateRange({
              start: dateInfo.start,
              end: dateInfo.end
            })
          }}
          loading={(isLoading) => {
            // You can add a loading indicator here if needed
          }}
        />
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[425px]">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Published</span>
              <span className="col-span-3">
                <Badge variant={selectedEvent?.isPublished ? "default" : "outline"}>
                  {selectedEvent?.isPublished ? "Yes" : "No"}
                </Badge>
              </span>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedEvent) {
                    navigate(`/events/${selectedEvent.id}/edit`)
                  }
                }}
              >
                Edit Event
              </Button>
              <Button
                onClick={() => {
                  if (selectedEvent) {
                    navigate(`/events/${selectedEvent.id}`)
                  }
                }}
              >
                View Details
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event "{selectedEvent?.name}" and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details for your new event
            </DialogDescription>
          </DialogHeader>
          <EventForm
            onSubmit={handleCreateEvent}
            isSubmitting={isCreating}
            defaultValues={{
              startDate: selectedDateRange?.start.toISOString() || new Date().toISOString(),
              endDate: selectedDateRange?.end.toISOString() || new Date().toISOString(),
              status: EventStatus.Tentative,
              isPublished: false,
              useEventTypeDefaultResources: true
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
