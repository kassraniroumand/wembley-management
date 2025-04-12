import { useNavigate } from "react-router-dom";
import { useResources, useDeleteResource } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { useState } from "react";

export function ResourcesPage() {
  const navigate = useNavigate();
  const [resourceToDelete, setResourceToDelete] = useState<number | null>(null);

  const { data, isLoading, error } = useResources();
  const deleteResourceMutation = useDeleteResource();

  // Display raw data as is
  const resources = Array.isArray(data) ? data : data?.resources || [];

  const goToCreateResource = () => {
    navigate("/resources/create");
  };

  const goToEditResource = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/resources/${id}/edit`);
  };

  const goToViewResource = (id: number) => {
    navigate(`/resources/${id}`);
  };

  const confirmDeleteResource = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setResourceToDelete(id);
  };

  const handleDeleteResource = async () => {
    if (resourceToDelete) {
      try {
        await deleteResourceMutation.mutateAsync(resourceToDelete);
        setResourceToDelete(null);
      } catch (error) {
        console.error("Failed to delete resource:", error);
      }
    }
  };

  const cancelDelete = () => {
    setResourceToDelete(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        <Button onClick={goToCreateResource}>
          <Plus className="h-4 w-4 mr-2" /> Add Resource
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Failed to load resources</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No resources found
                    </TableCell>
                  </TableRow>
                ) : (
                  resources.map((resource) => (
                    <TableRow
                      key={resource.id}
                      onClick={() => goToViewResource(resource.id)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">{resource.name}</TableCell>
                      <TableCell>{resource.type}</TableCell>
                      <TableCell>
                        {resource.isLimited
                          ? `Limited (${resource.maxQuantity})`
                          : "Unlimited"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {resource.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => goToViewResource(resource.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => goToEditResource(resource.id, e)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => confirmDeleteResource(resource.id, e)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={resourceToDelete !== null} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource
              and any associated allocations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResource} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
