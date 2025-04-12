import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventForm } from "@/components/forms/EventForm";
import { EventFormValues } from "@/schema/eventSchema";
import { useEvent, useUpdateEvent } from "@/hooks/useEvents";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch the existing event
  const { data, isLoading, error } = useEvent(eventId);

  // Update mutation
  const { mutate: updateEvent, isPending } = useUpdateEvent();

  const handleSubmit = (formData: EventFormValues) => {
    console.log("Updating event with data:", formData);

    updateEvent(
      { id: eventId, data: formData },
      {
        onSuccess: (response) => {
          console.log("Event updated successfully:", response);
          toast({
            title: "Success",
            description: "Event updated successfully",
          });
          navigate(`/events/${eventId}`);
        },
        onError: (error) => {
          console.error("Failed to update event:", error);
          toast({
            title: "Error",
            description: "Failed to update event: " + error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleBack = () => {
    navigate(`/events/${eventId}`);
  };

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Error loading event: {error.message}</p>
          </div>
        </div>
        <Button onClick={handleBack} variant="outline" className="mt-4">
          Back to Event Details
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-40" /> : `Edit Event: ${data?.event.name}`}
          </h1>
          <p className="text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-60 mt-1" />
            ) : (
              `Update event details`
            )}
          </p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <EventForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            defaultValues={{
              name: data?.event.name || "",
              description: data?.event.description || "",
              startDate: new Date(data?.event.startDate || new Date()).toISOString(),
              endDate: new Date(data?.event.endDate || new Date()).toString(),
              status: data?.event.status || 0,
              isPublished: data?.event.isPublished || false,
              eventTypeId: data?.event.eventTypeId || 0,
              organizerId: data?.event.organizerId || "",
            }}
          />
        )}
      </div>
    </div>
  );
}
