import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "@/hooks/useEvents";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Pencil, Trash } from "lucide-react";
import { ResourceAllocationDTO, CreateResourceAllocationDTO, UpdateResourceAllocationDTO } from "@/types";
import { ResourceAllocationForm } from "@/components/forms/ResourceAllocationForm";
import { useCreateEventResourceAllocation, useUpdateEventResourceAllocation, useDeleteResourceAllocation } from "@/hooks/useResourceAllocations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export function EventResourcesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const eventId = id ? parseInt(id) : 0;

  const { data: eventData, isLoading: isEventLoading } = useEvent(eventId);

  // State for resource allocation management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<ResourceAllocationDTO | null>(null);
  const [allocationToDelete, setAllocationToDelete] = useState<number | null>(null);

  // Mutations for managing resource allocations
  const { mutate: createAllocation, isPending: isCreating } = useCreateEventResourceAllocation();
  const { mutate: updateAllocation, isPending: isUpdating } = useUpdateEventResourceAllocation();
  const { mutate: deleteAllocation, isPending: isDeleting } = useDeleteResourceAllocation();

  const isSubmitting = isCreating || isUpdating;

  // Helpers to open forms
  const openAddForm = () => {
    setSelectedAllocation(null);
    setIsFormOpen(true);
  };

  const openEditForm = (allocation: ResourceAllocationDTO) => {
    setSelectedAllocation(allocation);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedAllocation(null);
  };

  // Confirm delete dialog
  const openDeleteConfirm = (id: number) => {
    setAllocationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
    setAllocationToDelete(null);
  };

  // Handle form submission for creating/updating allocations
  const handleSubmit = (values: {
    resourceId: number;
    quantity: number;
    startTime: string;
    endTime: string;
  }) => {
    if (selectedAllocation) {
      // Update existing allocation
      updateAllocation(
        {
          id: selectedAllocation.id,
          allocation: values as UpdateResourceAllocationDTO,
          eventId
        },
        {
          onSuccess: () => {
            toast({
              title: "Resource allocation updated",
              description: "The resource allocation has been updated successfully.",
            });
            closeForm();
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to update resource allocation: " + error.message,
              variant: "destructive",
            });
          },
        }
      );
    } else {
      // Create new allocation
      createAllocation(
        {
          ...values,
          eventId,
        } as CreateResourceAllocationDTO,
        {
          onSuccess: () => {
            toast({
              title: "Resource allocation added",
              description: "The resource has been allocated successfully.",
            });
            closeForm();
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to allocate resource: " + error.message,
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  // Handle allocation deletion
  const handleDelete = () => {
    if (allocationToDelete) {
      deleteAllocation(allocationToDelete, {
        onSuccess: () => {
          toast({
            title: "Resource allocation removed",
            description: "The resource allocation has been removed successfully.",
          });
          closeDeleteConfirm();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to remove resource allocation: " + error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleBack = () => {
    navigate(`/events/${eventId}`);
  };

  if (isEventLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Get resource allocations from event data
  const resourceAllocations = eventData?.resourceAllocations || [];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{eventData?.event.name} - Resources</h1>
          <p className="text-muted-foreground">
            Manage resources for this event
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resource Allocations</CardTitle>
            <CardDescription>
              Allocate resources for this event
            </CardDescription>
          </div>
          <Button onClick={openAddForm}>
            <Plus className="mr-2 h-4 w-4" /> Add Resource
          </Button>
        </CardHeader>
        <CardContent>
          {resourceAllocations.length === 0 ? (
            <div className="bg-muted p-6 rounded-md text-center">
              <p className="text-muted-foreground">
                No resources have been allocated for this event yet.
              </p>
              <p className="mt-2">
                Click "Add Resource" to allocate a resource for this event.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resourceAllocations.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell className="font-medium">{allocation.resourceName}</TableCell>
                    <TableCell>{allocation.quantity}</TableCell>
                    <TableCell>{format(new Date(allocation.startTime), "PPP")}</TableCell>
                    <TableCell>{format(new Date(allocation.endTime), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(allocation)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteConfirm(allocation.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={handleBack}>
            Done
          </Button>
        </CardFooter>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAllocation ? "Edit Resource Allocation" : "Add Resource Allocation"}
            </DialogTitle>
            <DialogDescription>
              {selectedAllocation
                ? "Update the details of this resource allocation"
                : "Allocate a resource for this event"}
            </DialogDescription>
          </DialogHeader>
          <ResourceAllocationForm
            eventId={eventId}
            eventStartDate={eventData?.event.startDate}
            eventEndDate={eventData?.event.endDate}
            existingAllocation={selectedAllocation || undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this resource allocation from the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteConfirm}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
