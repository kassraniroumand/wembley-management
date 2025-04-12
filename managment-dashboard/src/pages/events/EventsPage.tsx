import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents, useDeleteEvent, usePublishEvent, useUnpublishEvent, useUpdateEvent } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical, Plus, Search, Calendar, Trash2, Globe, EyeOff, CheckCircle, Clock, XCircle, CheckSquare } from "lucide-react";
import { EventStatus } from "@/types";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

// Helper function to render status badge
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
};

export function EventsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);
  const [isBatchPublishDialogOpen, setIsBatchPublishDialogOpen] = useState(false);
  const [isBatchUnpublishDialogOpen, setIsBatchUnpublishDialogOpen] = useState(false);
  const [isBatchStatusDialogOpen, setIsBatchStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | null>(null);

  // Filter state
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const { data, isLoading, error } = useEvents(page, pageSize, {
    fromDate,
    toDate,
    searchTerm: debouncedSearchTerm
  });

  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const { mutate: publishEvent, isPending: isPublishing } = usePublishEvent();
  const { mutate: unpublishEvent, isPending: isUnpublishing } = useUnpublishEvent();
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();

  // Handle search with debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Reset to first page when searching
    setPage(1);

    // Debounce search
    setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 500);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const goToCreateEvent = () => {
    navigate("/events/create");
  };

  const goToEventDetails = (id: number) => {
    navigate(`/events/${id}`);
  };

  const goToEditEvent = (id: number) => {
    navigate(`/events/${id}/edit`);
  };

  const confirmDelete = (id: number) => {
    setEventToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete, {
        onSuccess: () => {
          toast({
            title: "Event deleted",
            description: "The event has been successfully deleted.",
          });
          setIsDeleteDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to delete event. " + error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleBatchDelete = () => {
    if (selectedEvents.length === 0) return;

    // Delete each selected event
    selectedEvents.forEach(id => {
      deleteEvent(id, {
        onSuccess: () => {
          toast({
            title: "Events deleted",
            description: `Events ID ${id} has been successfully deleted.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete event ID ${id}. ${error.message}`,
            variant: "destructive",
          });
        },
      });
    });

    setIsBatchDeleteDialogOpen(false);
    setSelectedEvents([]);
  };

  const handleBatchPublish = () => {
    if (selectedEvents.length === 0) return;

    // Publish each selected event
    selectedEvents.forEach(id => {
      publishEvent(id, {
        onSuccess: () => {
          toast({
            title: "Event published",
            description: `Event ID ${id} has been successfully published.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to publish event ID ${id}. ${error.message}`,
            variant: "destructive",
          });
        },
      });
    });

    setIsBatchPublishDialogOpen(false);
    setSelectedEvents([]);
  };

  const handleBatchUnpublish = () => {
    if (selectedEvents.length === 0) return;

    // Unpublish each selected event
    selectedEvents.forEach(id => {
      unpublishEvent(id, {
        onSuccess: () => {
          toast({
            title: "Event unpublished",
            description: `Event ID ${id} has been successfully unpublished.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to unpublish event ID ${id}. ${error.message}`,
            variant: "destructive",
          });
        },
      });
    });

    setIsBatchUnpublishDialogOpen(false);
    setSelectedEvents([]);
  };

  const handleBatchStatusUpdate = () => {
    if (selectedEvents.length === 0 || !selectedStatus) return;

    // Update status for each selected event
    selectedEvents.forEach(id => {
      const event = data?.events.find(e => e.id === id);
      if (!event) return;

      updateEvent({
        id,
        event: {
          name: event.name,
          description: event.description,
          eventTypeId: event.eventTypeId,
          startDate: event.startDate,
          endDate: event.endDate,
          setupStartDate: event.setupStartDate,
          teardownEndDate: event.teardownEndDate,
          plannedCapacity: event.plannedCapacity,
          organizerId: event.organizerId,
          status: selectedStatus,
          notes: event.notes,
          isPublished: event.isPublished
        }
      }, {
        onSuccess: () => {
          toast({
            title: "Event updated",
            description: `Event ID ${id} status has been updated to ${selectedStatus}.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to update event ID ${id}. ${error.message}`,
            variant: "destructive",
          });
        },
      });
    });

    setIsBatchStatusDialogOpen(false);
    setSelectedStatus(null);
    setSelectedEvents([]);
  };

  // Calculate total pages
  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / pageSize) : 0;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if less than maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first and last page, and some pages around current
      let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
      const endPage = Math.min(totalPages, startPage + maxVisible - 1);

      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push(-1); // -1 represents ellipsis
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const events = data?.events || [];

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedEvents(events.map(event => event.id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, id]);
    } else {
      setSelectedEvents(selectedEvents.filter(i => i !== id));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex gap-2">
          {selectedEvents.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  Batch Actions ({selectedEvents.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsBatchPublishDialogOpen(true)}>
                  <Globe className="mr-2 h-4 w-4" /> Publish Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsBatchUnpublishDialogOpen(true)}>
                  <EyeOff className="mr-2 h-4 w-4" /> Unpublish Selected
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <CheckSquare className="mr-2 h-4 w-4" /> Update Status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => {
                        setSelectedStatus(EventStatus.Tentative);
                        setIsBatchStatusDialogOpen(true);
                      }}>
                        <Clock className="mr-2 h-4 w-4" /> Set as Tentative
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedStatus(EventStatus.Confirmed);
                        setIsBatchStatusDialogOpen(true);
                      }}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Set as Confirmed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedStatus(EventStatus.Cancelled);
                        setIsBatchStatusDialogOpen(true);
                      }}>
                        <XCircle className="mr-2 h-4 w-4" /> Set as Cancelled
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedStatus(EventStatus.Completed);
                        setIsBatchStatusDialogOpen(true);
                      }}>
                        <CheckSquare className="mr-2 h-4 w-4" /> Set as Completed
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setIsBatchDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button onClick={goToCreateEvent} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>

        {error ? (
          <div className="text-red-500">
            Error loading events: {error.message}
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={events.length > 0 && selectedEvents.length === events.length}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No events found
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedEvents.includes(event.id)}
                            onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectEvent(event.id, checked === true)}
                            aria-label={`Select event ${event.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {event.name}
                        </TableCell>
                        <TableCell>{event.eventTypeName}</TableCell>
                        <TableCell>{event.organizerName}</TableCell>
                        <TableCell>
                          {format(new Date(event.startDate), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(event.endDate), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(event.status)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={event.isPublished ? "default" : "outline"}>
                            {event.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                aria-label="Open menu"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => goToEventDetails(event.id)}
                              >
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => goToEditEvent(event.id)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => confirmDelete(event.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && handlePageChange(page - 1)}
                      aria-disabled={page === 1}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      href="#"
                    />
                  </PaginationItem>

                  {getPageNumbers().map((pageNum, i) => (
                    <PaginationItem key={i}>
                      {pageNum === -1 ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={pageNum === page}
                          onClick={() => handlePageChange(pageNum)}
                          href="#"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < totalPages && handlePageChange(page + 1)}
                      aria-disabled={page === totalPages}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                      href="#"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Batch Delete Dialog */}
      <AlertDialog open={isBatchDeleteDialogOpen} onOpenChange={setIsBatchDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Events</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedEvents.length} selected events?
              This action cannot be undone and will permanently delete these events and all their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {selectedEvents.length} Events
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Batch Publish Dialog */}
      <AlertDialog open={isBatchPublishDialogOpen} onOpenChange={setIsBatchPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Multiple Events</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish {selectedEvents.length} selected events?
              This will make these events visible to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchPublish}
              disabled={isPublishing}
            >
              {isPublishing ? "Publishing..." : `Publish ${selectedEvents.length} Events`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Batch Unpublish Dialog */}
      <AlertDialog open={isBatchUnpublishDialogOpen} onOpenChange={setIsBatchUnpublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish Multiple Events</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unpublish {selectedEvents.length} selected events?
              This will hide these events from users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchUnpublish}
              disabled={isUnpublishing}
            >
              {isUnpublishing ? "Unpublishing..." : `Unpublish ${selectedEvents.length} Events`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Batch Status Update Dialog */}
      <AlertDialog open={isBatchStatusDialogOpen} onOpenChange={setIsBatchStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Event Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the status of {selectedEvents.length} selected events to {selectedStatus}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchStatusUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : `Update ${selectedEvents.length} Events`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
