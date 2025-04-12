import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Check, Eye, MoreHorizontal, Ticket, X, ArrowUpDown, Trash2, ExternalLink } from "lucide-react";
import { BookingStatus, Booking } from "@/types/BookingType";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { BookingActionsDialog } from "@/components/dialogs/BookingActionsDialog";
import { Checkbox } from "@/components/ui/checkbox";

interface BookingsTableProps {
  bookings: Booking[];
  totalCount: number;
  isLoading: boolean;
  error: any;
  onCancelBooking: (id: number) => void;
  onConfirmBooking: (id: number) => void;
  onDeleteBooking?: (id: number) => void;
  onViewBookingDetails: (id: number) => void;
  onViewEvent: (eventId: number) => void;
  searchTerm: string;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function BookingsTable({
  bookings,
  totalCount,
  isLoading,
  error,
  onCancelBooking,
  onConfirmBooking,
  onDeleteBooking,
  onViewBookingDetails,
  onViewEvent,
  searchTerm,
  statusFilter,
  onStatusFilterChange,
}: BookingsTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // TanStack Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  const [bookingToConfirm, setBookingToConfirm] = useState<number | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  // Batch selection state
  const [selectedBookings, setSelectedBookings] = useState<Set<number>>(new Set());
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);

  // Status badge component
  const getStatusBadge = useCallback((status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Pending:
        return <Badge variant="outline">Pending</Badge>;
      case BookingStatus.Confirmed:
        return <Badge variant="default">Confirmed</Badge>;
      case BookingStatus.Cancelled:
        return <Badge variant="destructive">Cancelled</Badge>;
      case BookingStatus.Attended:
        return <Badge variant="secondary">Attended</Badge>;
      case BookingStatus.NoShow:
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  }, []);

  // Row click handler
  const handleRowClick = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setIsActionDialogOpen(true);
  }, []);

  // Batch selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allBookingIds = bookings.map(booking => booking.id);
      setSelectedBookings(new Set(allBookingIds));
    } else {
      setSelectedBookings(new Set());
    }
  }, [bookings]);

  const handleSelectBooking = useCallback((bookingId: number, checked: boolean) => {
    setSelectedBookings(prev => {
      const newSelectedBookings = new Set(prev);
      if (checked) {
        newSelectedBookings.add(bookingId);
      } else {
        newSelectedBookings.delete(bookingId);
      }
      return newSelectedBookings;
    });
  }, []);

  const handleBatchDelete = useCallback(() => {
    setIsBatchDeleteDialogOpen(true);
  }, []);

  const confirmBatchDelete = useCallback(() => {
    if (onDeleteBooking && selectedBookings.size > 0) {
      // Delete each selected booking
      selectedBookings.forEach(bookingId => {
        onDeleteBooking(bookingId);
      });

      // Clear selection after deletion
      setSelectedBookings(new Set());
      setIsBatchDeleteDialogOpen(false);

      toast({
        title: "Batch Delete Successful",
        description: `${selectedBookings.size} booking(s) have been deleted.`,
      });
    }
  }, [onDeleteBooking, selectedBookings, toast]);

  // Define columns for TanStack Table
  const columns = useMemo<ColumnDef<Booking>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked) => {
            table.toggleAllPageRowsSelected(!!checked);
            handleSelectAll(!!checked);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => {
            row.toggleSelected(!!checked);
            handleSelectBooking(row.original.id, !!checked);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "reference",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Reference
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "eventName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "bookingDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("bookingDate"));
        return <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{date.toLocaleDateString()}</span>
        </div>;
      },
    },
    {
      accessorKey: "ticketCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tickets
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="flex items-center">
          <Ticket className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("ticketCount")}</span>
        </div>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return getStatusBadge(row.getValue("status"));
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewBookingDetails(booking.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewEvent(booking.eventId)}>
                <Calendar className="mr-2 h-4 w-4" />
                View Event
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {booking.status === BookingStatus.Pending && (
                <DropdownMenuItem onClick={() => setBookingToConfirm(booking.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Booking
                </DropdownMenuItem>
              )}

              {(booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed) && (
                <DropdownMenuItem
                  onClick={() => setBookingToCancel(booking.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Booking
                </DropdownMenuItem>
              )}

              {onDeleteBooking && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setBookingToDelete(booking.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Booking
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [onViewBookingDetails, onViewEvent, onDeleteBooking, handleSelectAll, handleSelectBooking, getStatusBadge]);

  // Initialize TanStack Table
  const table = useReactTable({
    data: bookings || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchTerm,
    },
  });

  // Status filter handler
  const handleStatusFilterChange = useCallback((value: string) => {
    onStatusFilterChange(value);
    table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value);
  }, [onStatusFilterChange, table]);

  // Status filter options
  const statusFilterOptions = useMemo(() => [
    { value: "all", label: "All" },
    { value: BookingStatus.Pending, label: "Pending" },
    { value: BookingStatus.Confirmed, label: "Confirmed" },
    { value: BookingStatus.Cancelled, label: "Cancelled" },
    { value: BookingStatus.Attended, label: "Attended" },
    { value: BookingStatus.NoShow, label: "No Show" },
  ], []);

  return (
    <>
      {/* Table Header with Filters and Batch Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status: {statusFilter === "all" ? "All" : statusFilter}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusFilterOptions.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleStatusFilterChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedBookings.size > 0 && onDeleteBooking && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBatchDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selectedBookings.size})
          </Button>
        )}
      </div>

      {/* Bookings Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-destructive">
                  Error loading bookings: {error.message}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{" "}
          {totalCount || 0} row(s) total.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Booking Actions Dialog */}
      <BookingActionsDialog
        booking={selectedBooking}
        isOpen={isActionDialogOpen}
        onOpenChange={setIsActionDialogOpen}
        onViewBookingDetails={onViewBookingDetails}
        onViewEvent={onViewEvent}
        onConfirmBooking={onConfirmBooking}
        onCancelBooking={onCancelBooking}
        onDeleteBooking={onDeleteBooking}
        setBookingToConfirm={setBookingToConfirm}
        setBookingToCancel={setBookingToCancel}
        setBookingToDelete={setBookingToDelete}
      />

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
                  onConfirmBooking(bookingToConfirm);
                  setBookingToConfirm(null);
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
                  onCancelBooking(bookingToCancel);
                  setBookingToCancel(null);
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
      {onDeleteBooking && (
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
                    onDeleteBooking(bookingToDelete);
                    setBookingToDelete(null);
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Batch Delete Dialog */}
      {onDeleteBooking && (
        <AlertDialog open={isBatchDeleteDialogOpen} onOpenChange={setIsBatchDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Selected Bookings</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedBookings.size} selected booking(s)? This action cannot be undone and will permanently remove these bookings from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmBatchDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Selected
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
