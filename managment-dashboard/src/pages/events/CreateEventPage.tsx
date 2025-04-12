import { useNavigate } from "react-router-dom";
import { EventForm } from "@/components/forms/EventForm";
import { EventFormValues } from "@/schema/eventSchema";
import { useCreateEvent } from "@/hooks/useEvents";
import { useToast } from "@/components/ui/use-toast";

export function CreateEventPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: createEvent, isPending } = useCreateEvent();

  const handleSubmit = (data: EventFormValues) => {
    console.log("Submitting event form with data:", data);

    createEvent(data, {
      onSuccess: (response) => {
        console.log("Event created successfully:", response);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        navigate(`/events/${response.id}`);
      },
      onError: (error) => {
        console.error("Failed to create event:", error);
        toast({
          title: "Error",
          description: "Failed to create event: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Event</h1>
        <p className="text-muted-foreground">
          Schedule a new event in the system
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <EventForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
}
