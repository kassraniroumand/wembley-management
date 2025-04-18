import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventTypes } from "@/hooks/useEventTypes";
import { useOrganizers } from "@/hooks/useOrganizers";
import { eventFormSchema, EventFormValues } from "@/schema/eventSchema";
import { EventStatus, EventTypeDTO } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (data: EventFormValues) => void;
  isSubmitting: boolean;
}

export function EventForm({
  defaultValues = {
    name: "",
    description: "",
    eventTypeId: undefined,
    startDate: "",
    endDate: "",
    plannedCapacity: undefined,
    organizerId: "",
    status: EventStatus.Tentative,
    notes: "",
    isPublished: false,
    useEventTypeDefaultResources: true,
  },
  onSubmit,
  isSubmitting,
}: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  const [selectedEventType, setSelectedEventType] = useState<EventTypeDTO | null>(null);

  // Load event types
  const { data: eventTypesData } = useEventTypes();
  const eventTypes = eventTypesData || [];

  // Load organizers
  const { data: organizersData } = useOrganizers();
  const organizers = organizersData?.organizers || [];

  // Watch for eventTypeId changes to update capacity
  const watchedEventTypeId = form.watch("eventTypeId");

  useEffect(() => {
    if (watchedEventTypeId) {
      const eventType = eventTypes.find(et => et.id === watchedEventTypeId);
      if (eventType) {
        setSelectedEventType(eventType);

        // If plannedCapacity is not set by user, use the event type's default capacity
        if (!form.getValues("plannedCapacity")) {
          form.setValue("plannedCapacity", eventType.defaultCapacity);
        }

        // When event type changes, update setup/teardown dates if start/end dates are set
        const startDate = form.getValues("startDate");
        const endDate = form.getValues("endDate");

        if (startDate && endDate) {
          updateSetupTeardownDates(new Date(startDate), new Date(endDate), eventType);
        }
      }
    }
  }, [watchedEventTypeId, eventTypes, form]);

  // Function to calculate setup and teardown dates based on event type
  const updateSetupTeardownDates = (start: Date, end: Date, eventType: EventTypeDTO) => {
    // Calculate setup start date (event start date - setup days)
    const setupStartDate = new Date(start);
    setupStartDate.setDate(setupStartDate.getDate() - eventType.setupDays);

    // Calculate teardown end date (event end date + teardown days)
    const teardownEndDate = new Date(end);
    teardownEndDate.setDate(teardownEndDate.getDate() + eventType.teardownDays);

    // Update form values
    form.setValue("setupStartDate", setupStartDate.toISOString());
    form.setValue("teardownEndDate", teardownEndDate.toISOString());
  };

  // Handle changes to start/end dates
  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    if (!date) return;

    // Create a new date object with the selected date but set to noon to avoid timezone issues
    const adjustedDate = new Date(date);
    adjustedDate.setHours(12, 0, 0, 0);

    // For end date, we need to add one day to make it inclusive of the entire day
    // This ensures the event is displayed correctly on the calendar
    if (field === "endDate") {
      adjustedDate.setDate(adjustedDate.getDate() + 1);
    }

    const formattedDate = adjustedDate.toISOString();
    form.setValue(field, formattedDate);

    const startDate = field === "startDate" ? adjustedDate : form.getValues("startDate") ? new Date(form.getValues("startDate")) : undefined;
    const endDate = field === "endDate" ? adjustedDate : form.getValues("endDate") ? new Date(form.getValues("endDate")) : undefined;

    // If both dates are set and we have an event type, update setup/teardown dates
    if (startDate && endDate && selectedEventType) {
      updateSetupTeardownDates(startDate, endDate, selectedEventType);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Event name" {...field} />
              </FormControl>
              <FormDescription>
                Give your event a clear, descriptive name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Event description (optional)"
                  className="h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Provide details about the event purpose and activities
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eventTypes.map((eventType) => (
                    <SelectItem key={eventType.id} value={eventType.id.toString()}>
                      {eventType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the type of event you are organizing
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" >
                    <CalendarComponent
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => handleDateChange("startDate", date)}
                      // initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The first day of your event
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => handleDateChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The last day of your event
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="plannedCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Planned Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder={selectedEventType ? selectedEventType.defaultCapacity.toString() : "Enter capacity"}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  value={field.value === undefined ? "" : field.value}
                />
              </FormControl>
              <FormDescription>
                Expected number of attendees (defaults to event type's capacity)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizer</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organizer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {organizers.map((organizer) => (
                    <SelectItem key={organizer.id} value={organizer.id}>
                      {organizer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Who is responsible for this event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EventStatus.Tentative.toString()}>Tentative</SelectItem>
                  <SelectItem value={EventStatus.Confirmed.toString()}>Confirmed</SelectItem>
                  <SelectItem value={EventStatus.Cancelled.toString()}>Cancelled</SelectItem>
                  <SelectItem value={EventStatus.Completed.toString()}>Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Current status of the event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes (optional)"
                  className="h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Any additional information that might be helpful
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Publish Event</FormLabel>
                  <FormDescription>
                    Make this event visible to all users
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="useEventTypeDefaultResources"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Use Default Resources</FormLabel>
                  <FormDescription>
                    Automatically allocate resources defined for this event type
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Create Event"
          )}
        </Button>
      </form>
    </Form>
  );
}
