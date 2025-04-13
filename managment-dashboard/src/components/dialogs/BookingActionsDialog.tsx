import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Check, Eye, X, Trash2 } from "lucide-react";
import { BookingStatus, Booking } from "@/types/BookingType";

export interface BookingActionsDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onViewBookingDetails: (id: number) => void;
  onViewEvent: (eventId: number) => void;
  onConfirmBooking: (id: number) => void;
  onCancelBooking: (id: number) => void;
  onDeleteBooking?: (id: number) => void;
  setBookingToConfirm: (id: number | null) => void;
  setBookingToCancel: (id: number | null) => void;
  setBookingToDelete: (id: number | null) => void;
}

export function BookingActionsDialog({
  booking,
  isOpen,
  onOpenChange,
  onViewBookingDetails,
  onViewEvent,
  onDeleteBooking,
  setBookingToConfirm,
  setBookingToCancel,
  setBookingToDelete,
}: BookingActionsDialogProps) {
  const getStatusBadge = (status: BookingStatus) => {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Booking Actions</DialogTitle>
          <DialogDescription>
            {booking && (
              <div className="mt-2">
                <p className="font-medium">{booking.eventName}</p>
                <p className="text-sm text-muted-foreground">
                  Reference: {booking.reference}
                </p>
                <div className="mt-2">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              onClick={() => {
                if (booking) {
                  onViewBookingDetails(booking.id);
                  onOpenChange(false);
                }
              }}
            >
              <Eye className="h-5 w-5" />
              <span>View Details</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              onClick={() => {
                if (booking) {
                  onViewEvent(booking.eventId);
                  onOpenChange(false);
                }
              }}
            >
              <Calendar className="h-5 w-5" />
              <span>View Event</span>
            </Button>
          </div>

          {booking && booking.status === BookingStatus.Pending && (
            <Button
              variant="default"
              className="h-auto py-4 flex items-center justify-center gap-2"
              onClick={() => {
                if (booking) {
                  setBookingToConfirm(booking.id);
                  onOpenChange(false);
                }
              }}
            >
              <Check className="h-5 w-5" />
              <span>Confirm Booking</span>
            </Button>
          )}

          {booking && (booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed) && (
            <Button
              variant="destructive"
              className="h-auto py-4 flex items-center justify-center gap-2"
              onClick={() => {
                if (booking) {
                  setBookingToCancel(booking.id);
                  onOpenChange(false);
                }
              }}
            >
              <X className="h-5 w-5" />
              <span>Cancel Booking</span>
            </Button>
          )}

          {booking && onDeleteBooking && (
            <Button
              variant="destructive"
              className="h-auto py-4 flex items-center justify-center gap-2"
              onClick={() => {
                if (booking) {
                  setBookingToDelete(booking.id);
                  onOpenChange(false);
                }
              }}
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete Booking</span>
            </Button>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
