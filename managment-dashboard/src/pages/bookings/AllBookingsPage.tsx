import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookings, useCancelBooking, useConfirmBooking, useDeleteBooking } from "@/hooks/useBookings";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { BookingStatus } from "@/types/BookingType";
import { BookingsTable } from "@/components/tables/BookingsTable";
import { event } from "@/types/CONSTANT";

export function AllBookingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch bookings data
  const { data, isLoading, error } = useBookings(page, pageSize);

  // Mutations
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking();
  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would trigger a search with the API
    console.log("Searching for:", searchTerm);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    // In a real implementation, this would trigger a filter with the API
    console.log("Filtering by status:", status);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewBookingDetails = (id: number) => {
    // In a real implementation, navigate to a booking details page
    console.log("View booking details:", id);
    toast({
      title: "View Booking",
      description: `Viewing details for booking #${id}`,
    });
  };

  const handleCancelBooking = (id: number) => {
    cancelBooking(id, {
      onSuccess: () => {
        toast({
          title: "Booking Cancelled",
          description: "The booking has been cancelled successfully.",
        });
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

  const handleConfirmBooking = (id: number) => {
    confirmBooking(id, {
      onSuccess: () => {
        toast({
          title: "Booking Confirmed",
          description: "The booking has been confirmed successfully.",
        });
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

  const handleDeleteBooking = (id: number) => {
    deleteBooking(id, {
      onSuccess: () => {
        toast({
          title: "Booking Deleted",
          description: "The booking has been deleted successfully.",
        });
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

  const handleViewEvent = (eventId: any) => {
    navigate(event.eventsDetailUrl(eventId));

  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Bookings</h1>
          <p className="text-muted-foreground">
            Manage and view all bookings in the system
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="icon" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <Select
            onValueChange={handleStatusFilterChange}
            value={statusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={BookingStatus.Pending}>Pending</SelectItem>
              <SelectItem value={BookingStatus.Confirmed}>Confirmed</SelectItem>
              <SelectItem value={BookingStatus.Cancelled}>Cancelled</SelectItem>
              <SelectItem value={BookingStatus.Attended}>Attended</SelectItem>
              <SelectItem value={BookingStatus.NoShow}>No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Records</CardTitle>
          <CardDescription>
            Showing all bookings {data ? `(${data.totalCount} total)` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingsTable
            bookings={data?.bookings || []}
            totalCount={data?.totalCount || 0}
            isLoading={isLoading}
            error={error}
            onCancelBooking={handleCancelBooking}
            onConfirmBooking={handleConfirmBooking}
            onDeleteBooking={handleDeleteBooking}
            onViewBookingDetails={handleViewBookingDetails}
            onViewEvent={handleViewEvent}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
