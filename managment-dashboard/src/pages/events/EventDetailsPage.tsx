import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEvent, usePublishEvent } from "@/hooks/useEvents";
import { format } from "date-fns";
import { EventStatus } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarClock, Users, Clipboard, Edit, Trash, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to render status badge
const getStatusBadge = (status: EventStatus) => {
  switch (status) {
    case EventStatus.Tentative:
      return <Badge variant="outline">Tentative</Badge>;
    case EventStatus.Confirmed:
      return <Badge variant="default">Confirmed</Badge>;
    case EventStatus.Cancelled:
      return <Badge variant="destructive">Cancelled</Badge>;
    case EventStatus.Completed:
      return <Badge variant="secondary">Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const eventId = id ? parseInt(id) : 0;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Set the active tab based on the URL path
  const [activeTab, setActiveTab] = useState("details");

  // Update the active tab when the URL changes
  useEffect(() => {
    if (location.pathname.includes('/resources')) {
      setActiveTab("resources");
    } else if (location.pathname.includes('/configurations')) {
      setActiveTab("configurations");
    } else {
      setActiveTab("details");
    }
  }, [location.pathname]);

  const { data, isLoading, error } = useEvent(eventId);
  const { mutate: publishEvent, isPending: isPublishing } = usePublishEvent();

  const handleEditEvent = () => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleBack = () => {
    navigate("/events");
  };

  const handleDeleteConfirm = () => {
    // This will be implemented once we create the delete function
    setIsDeleteDialogOpen(false);
  };

  const handlePublish = () => {
    if (!data) return;

    publishEvent(eventId, {
      onSuccess: () => {
        toast({
          title: "Event published",
          description: "The event has been successfully published.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to publish event: " + error.message,
          variant: "destructive",
        });
      },
    });
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
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-40" /> : data?.event.name}
          </h1>
          <p className="text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-60 mt-1" />
            ) : (
              `Event ID: ${data?.event.id}`
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>

          {!isLoading && data?.event && !data.event.isPublished && (
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish Event"}
            </Button>
          )}
          <Button onClick={handleEditEvent}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="configurations">Configurations</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Event Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <div className="mt-1">{getStatusBadge(data?.event.status!)}</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Published</p>
                        <div className="mt-1">
                          <Badge variant={data?.event.isPublished ? "default" : "outline"}>
                            {data?.event.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                      <p className="mt-1">{data?.event.eventTypeName}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Organizer</p>
                      <p className="mt-1">{data?.event.organizerName}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="mt-1">{data?.event.description || "No description provided"}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5" /> Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                        <p className="mt-1">
                          {format(new Date(data?.event.startDate!), "PPP")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">End Date</p>
                        <p className="mt-1">
                          {format(new Date(data?.event.endDate!), "PPP")}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Setup Start</p>
                        <p className="mt-1">
                          {format(new Date(data?.event.setupStartDate!), "PPP")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Teardown End</p>
                        <p className="mt-1">
                          {format(new Date(data?.event.teardownEndDate!), "PPP")}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Capacity & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Planned Capacity</p>
                      <p className="mt-1">{data?.event.plannedCapacity} attendees</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Notes</p>
                      <p className="mt-1 whitespace-pre-wrap">
                        {data?.event.notes || "No notes provided"}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocations</CardTitle>
              <CardDescription>
                Resources allocated for this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : data?.resourceAllocations && data.resourceAllocations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.resourceAllocations.map((allocation) => (
                      <TableRow key={allocation.id}>
                        <TableCell className="font-medium">{allocation.resourceName}</TableCell>
                        <TableCell>{allocation.quantity}</TableCell>
                        <TableCell>{format(new Date(allocation.startTime), "PPP")}</TableCell>
                        <TableCell>{format(new Date(allocation.endTime), "PPP")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No resources have been allocated for this event
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => navigate(`/events/${eventId}/resources`)}
                className="w-full"
              >
                Manage Resources
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="configurations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Configurations</CardTitle>
              <CardDescription>
                Additional configuration settings for this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : data?.configurations && data.configurations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Configuration Type</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.configurations.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell className="font-medium">{config.configurationType}</TableCell>
                        <TableCell>{config.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No configurations have been set for this event
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => navigate(`/events/${eventId}/configurations`)}
                className="w-full"
              >
                Manage Configurations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event and all its associated resources and configurations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
