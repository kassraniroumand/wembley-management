import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEventTypes, useDeleteEventType } from "@/hooks/useEventTypes";
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
import { MoreVertical, Plus, Search } from "lucide-react";
import { EventTypeResourcesList } from "@/components/event-types/EventTypeResourcesList";

export function EventTypesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventTypeToDelete, setEventTypeToDelete] = useState<number | null>(null);

  const { data, isLoading, error } = useEventTypes(page, pageSize);
  console.log("data", data);
  const { mutate: deleteEventType, isPending: isDeleting } = useDeleteEventType();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const goToCreateEventType = () => {
    navigate("/event-types/create");
  };

  const goToEventTypeDetails = (id: number) => {
    navigate(`/event-types/${id}`);
  };

  const goToEditEventType = (id: number) => {
    navigate(`/event-types/${id}/edit`);
  };

  const confirmDelete = (id: number) => {
    setEventTypeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (eventTypeToDelete) {
      deleteEventType(eventTypeToDelete, {
        onSuccess: () => {
          toast({
            title: "Event Type deleted",
            description: "The event type has been successfully deleted.",
          });
          setIsDeleteDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to delete event type. " + error.message,
            variant: "destructive",
          });
        },
      });
    }
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
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

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

  const eventTypes = data || [];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Types</h1>
        <Button onClick={goToCreateEventType} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Add Event Type
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {error ? (
          <div className="text-red-500">
            Error loading event types: {error.message}
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
                    <TableHead>Event Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Default Capacity</TableHead>
                    <TableHead>Resources</TableHead>
                    <TableHead className="text-center">Pitch Access</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventTypes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No event types found
                      </TableCell>
                    </TableRow>
                  ) : (
                    eventTypes.map((eventType) => (
                      <TableRow key={eventType.id}>
                        <TableCell className="font-medium">
                          {eventType.name}
                        </TableCell>
                        <TableCell>{eventType.category}</TableCell>
                        <TableCell>{eventType.defaultCapacity}</TableCell>
                        <TableCell>
                          <EventTypeResourcesList
                            eventTypeId={eventType.id}
                            eventTypeName={eventType.name}
                            compact={true}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={eventType.requiresPitchAccess ? "default" : "outline"}
                          >
                            {eventType.requiresPitchAccess ? "Required" : "Not Required"}
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
                                onClick={() => goToEventTypeDetails(eventType.id)}
                              >
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => goToEditEventType(eventType.id)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => confirmDelete(eventType.id)}
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
              event type and all its associated data.
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
    </div>
  );
}
