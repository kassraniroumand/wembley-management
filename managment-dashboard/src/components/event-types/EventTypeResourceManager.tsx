import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResources } from "@/hooks";
import {
  useEventTypeResources,
  useAddDefaultResource,
  useUpdateDefaultResource,
  useRemoveDefaultResource,
} from "@/hooks/useEventTypes";
import { eventTypeResourceSchema, EventTypeResourceFormValues } from "@/schema/eventTypeSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Pencil, Plus, Trash } from "lucide-react";

interface EventTypeResourceManagerProps {
  eventTypeId: number;
  eventTypeName: string;
}

export function EventTypeResourceManager({
  eventTypeId,
  eventTypeName,
}: EventTypeResourceManagerProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<{
    id: number;
    resourceId: number;
    quantity: number;
  } | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data: resources, isLoading: isLoadingResources } = useResources();

  const { data: eventTypeResources, isLoading: isLoadingEventTypeResources } =
    useEventTypeResources(eventTypeId);

  const { mutate: addResource, isPending: isAddingResource } = useAddDefaultResource();
  const { mutate: updateResource, isPending: isUpdatingResource } = useUpdateDefaultResource();
  const { mutate: removeResource, isPending: isDeletingResource } = useRemoveDefaultResource();

  // Form for adding a new resource
  const addForm = useForm<EventTypeResourceFormValues>({
    resolver: zodResolver(eventTypeResourceSchema),
    defaultValues: {
      resourceId: 0,
      quantity: 1,
    },
  });

  // Form for editing an existing resource
  const editForm = useForm<EventTypeResourceFormValues>({
    resolver: zodResolver(eventTypeResourceSchema),
    defaultValues: {
      resourceId: editingResource?.resourceId || 0,
      quantity: editingResource?.quantity || 1,
    },
  });

  // Set up form when editing a resource
  useState(() => {
    if (editingResource) {
      editForm.reset({
        resourceId: editingResource.resourceId,
        quantity: editingResource.quantity,
      });
    }
  }, [editingResource, editForm]);

  const handleAddResource = (data: EventTypeResourceFormValues) => {
    addResource(
      {
        eventTypeId,
        resourceId: data.resourceId,
        quantity: data.quantity,
      },
      {
        onSuccess: () => {
          toast({
            title: "Resource added",
            description: `Resource has been added to ${eventTypeName}.`,
          });
          setShowAddDialog(false);
          addForm.reset();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to add resource: ${error.message}`,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleUpdateResource = (data: EventTypeResourceFormValues) => {
    if (editingResource) {
      updateResource(
        {
          id: editingResource.id,
          resource: {
            quantity: data.quantity,
            eventTypeId: eventTypeId,
          } as any,
        },
        {
          onSuccess: () => {
            toast({
              title: "Resource updated",
              description: `Resource quantity has been updated.`,
            });
            setEditingResource(null);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to update resource: ${error.message}`,
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleDeleteResource = () => {
    if (resourceToDelete) {
      removeResource(
        {
          id: resourceToDelete.id,
          eventTypeId,
        },
        {
          onSuccess: () => {
            toast({
              title: "Resource removed",
              description: `${resourceToDelete.name} has been removed from ${eventTypeName}.`,
            });
            setResourceToDelete(null);
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: `Failed to remove resource: ${error.message}`,
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const getResourceName = (resourceId: number) => {
    const resource = resources?.resources?.find((r) => r.id === resourceId);
    return resource ? resource.name : "Unknown Resource";
  };

  const isResourceAlreadyAdded = (resourceId: number) => {
    return eventTypeResources?.some((r) => r.resourceId === resourceId);
  };

  const availableResources = resources?.filter(
    (r) => !isResourceAlreadyAdded(r.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Resources</CardTitle>
        <CardDescription>
          Define the standard resources needed for {eventTypeName} events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingEventTypeResources ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !eventTypeResources || eventTypeResources.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No resources assigned to this event type yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypeResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    {resource.resourceName || getResourceName(resource.resourceId)}
                  </TableCell>
                  <TableCell className="text-right">{resource.quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setEditingResource({
                            id: resource.id,
                            resourceId: resource.resourceId,
                            quantity: resource.quantity,
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setResourceToDelete({
                            id: resource.id,
                            name: resource.resourceName || getResourceName(resource.resourceId),
                          })
                        }
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
      <CardFooter>
        <Button
          onClick={() => setShowAddDialog(true)}
          // disabled={ isAddingResource || !availableResources || availableResources.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </CardFooter>

      {/* Add Resource Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Default Resource</DialogTitle>
            <DialogDescription>
              Add a resource that will be automatically allocated to this event type.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddResource)} className="space-y-6">
              <FormField
                control={addForm.control}
                name="resourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource</FormLabel>
                    <Select
                      disabled={isLoadingResources}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {isLoadingResources ? (
                            <div className="flex items-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading resources...
                            </div>
                          ) : (
                            <SelectValue placeholder="Select a resource" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableResources?.map((resource) => (
                          <SelectItem key={resource.id} value={resource.id.toString()}>
                            {resource.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAddingResource}>
                  {isAddingResource ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Resource"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={!!editingResource} onOpenChange={(open) => !open && setEditingResource(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource Quantity</DialogTitle>
            <DialogDescription>
              Update the quantity of{" "}
              {editingResource
                ? editingResource.resourceId
                  ? getResourceName(editingResource.resourceId)
                  : "this resource"
                : ""}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateResource)} className="space-y-6">
              <FormField
                control={editForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingResource(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingResource}>
                  {isUpdatingResource ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <AlertDialog
        open={!!resourceToDelete}
        onOpenChange={(open) => !open && setResourceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {resourceToDelete?.name} from {eventTypeName}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResourceToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteResource}
              disabled={isDeletingResource}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeletingResource ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
