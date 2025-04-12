import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookingSchema, BookingFormValues } from "@/schema/bookingSchema";
import { EventDTO } from "@/types";

interface BookingFormProps {
  onSubmit: (data: BookingFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<BookingFormValues>;
  event?: EventDTO;
}

export function BookingForm({
  onSubmit,
  isSubmitting,
  defaultValues = {
    ticketCount: 1,
    notes: "",
  },
  event,
}: BookingFormProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      ...defaultValues,
      eventId: event?.id,
    },
  });

  // Update form values when event changes
  useEffect(() => {
    if (event) {
      form.setValue("eventId", event.id);
    }
  }, [event, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden Event ID field */}
        <input
          type="hidden"
          {...form.register("eventId", { valueAsNumber: true })}
        />

        {/* Event details display */}
        {event && (
          <div className="bg-muted/50 p-4 rounded-md">
            <h3 className="font-medium text-lg">{event.name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Ticket Count */}
        <FormField
          control={form.control}
          name="ticketCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Tickets</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                How many tickets would you like to book? (Maximum 10)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requirements or notes for your booking"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional: Add any special requirements or notes for the organizers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Processing..." : "Complete Booking"}
        </Button>
      </form>
    </Form>
  );
}
