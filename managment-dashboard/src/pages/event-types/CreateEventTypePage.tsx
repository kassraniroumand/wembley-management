import { useNavigate } from "react-router-dom";
import { EventTypeForm } from "@/components/forms/EventTypeForm";
import { EventTypeFormValues } from "@/schema/eventTypeSchema";
import { useCreateEventType } from "@/hooks/useEventTypes";
import { useToast } from "@/components/ui/use-toast";

export function CreateEventTypePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: createEventType, isPending } = useCreateEventType();

  const handleSubmit = (data: EventTypeFormValues) => {
    console.log("Submitting event type form with data:", data);

    createEventType(data, {
      onSuccess: (response) => {
        console.log("Event type created successfully:", response);
        toast({
          title: "Success",
          description: "Event type created successfully",
        });
        navigate(`/event-types/${response.id}`);
      },
      onError: (error) => {
        console.error("Failed to create event type:", error);
        toast({
          title: "Error",
          description: "Failed to create event type: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Event Type</h1>
        <p className="text-muted-foreground">
          Add a new event type to the system
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <EventTypeForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
}
