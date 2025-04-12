import { useNavigate, useParams } from "react-router-dom";
import { EventTypeForm } from "@/components/forms/EventTypeForm";
import { EventTypeFormValues } from "@/schema/eventTypeSchema";
import { useEventType, useUpdateEventType } from "@/hooks/useEventTypes";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function EditEventTypePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const eventTypeId = id ? parseInt(id) : 0;
  const { toast } = useToast();

  const { data: eventType, isLoading, error } = useEventType(eventTypeId);
  const { mutate: updateEventType, isPending } = useUpdateEventType();

  const handleSubmit = (data: EventTypeFormValues) => {
    console.log("Updating event type with data:", data);

    updateEventType(
      { id: eventTypeId, eventType: data },
      {
        onSuccess: (response) => {
          console.log("Event type updated successfully:", response);
          toast({
            title: "Success",
            description: "Event type updated successfully",
          });
          navigate(`/event-types/${eventTypeId}`);
        },
        onError: (error) => {
          console.error("Failed to update event type:", error);
          toast({
            title: "Error",
            description: "Failed to update event type: " + error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-5 w-40 mt-2" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-red-500">
            Error loading event type: {error.message}
          </div>
        </div>
      </div>
    );
  }

  if (!eventType) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-red-500">Event type not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Event Type</h1>
        <p className="text-muted-foreground">
          Update the event type information
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <EventTypeForm
          defaultValues={{
            name: eventType.name,
            description: eventType.description,
            category: eventType.category,
            defaultCapacity: eventType.defaultCapacity,
            setupDays: eventType.setupDays,
            teardownDays: eventType.teardownDays,
            requiresPitchAccess: eventType.requiresPitchAccess,
            defaultConfigurations: eventType.defaultConfigurations,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
}
