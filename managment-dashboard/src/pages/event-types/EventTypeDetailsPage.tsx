import { useNavigate, useParams } from "react-router-dom";
import { useEventTypeWithResources, useDeleteEventType } from "@/hooks/useEventTypes";
import { EventTypeResourceManager } from "@/components/event-types/EventTypeResourceManager";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash, ArrowLeft } from "lucide-react";
import { useState } from "react";

export function EventTypeDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const eventTypeId = id ? parseInt(id) : 0;
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useEventTypeWithResources(eventTypeId);
  const { mutate: deleteEventType, isPending: isDeleting } = useDeleteEventType();

  const handleEdit = () => {
    navigate(`/event-types/${eventTypeId}/edit`);
  };

  const handleDelete = () => {
    deleteEventType(eventTypeId, {
      onSuccess: () => {
        toast({
          title: "Event Type deleted",
          description: "The event type has been successfully deleted.",
        });
        navigate("/event-types");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete event type. " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center">
          <Skeleton className="h-10 w-10 mr-4" />
          <Skeleton className="h-8 w-60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
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

  if (!data || !data.eventType) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-red-500">Event type not found</div>
        </div>
      </div>
    );
  }

  const { eventType } = data;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-4"
            onClick={() => navigate("/event-types")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{eventType.name}</h1>
            <p className="text-muted-foreground">
              {eventType.category}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Event Type Details</CardTitle>
            <CardDescription>Information about this event type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{eventType.description || "No description provided"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Default Capacity</h3>
                <p className="mt-1">{eventType.defaultCapacity}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Pitch Access</h3>
                <Badge
                  className="mt-1"
                  variant={eventType.requiresPitchAccess ? "default" : "outline"}
                >
                  {eventType.requiresPitchAccess ? "Required" : "Not Required"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Setup Days</h3>
                <p className="mt-1">{eventType.setupDays}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Teardown Days</h3>
                <p className="mt-1">{eventType.teardownDays}</p>
              </div>
            </div>

            {eventType.defaultConfigurations && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Default Configurations</h3>
                <p className="mt-1 whitespace-pre-line">{eventType.defaultConfigurations}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <EventTypeResourceManager
          eventTypeId={eventTypeId}
          eventTypeName={eventType.name}
        />
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event type "{eventType.name}" and all its associated data.
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
