import { useNavigate, useParams } from "react-router-dom";
import { OrganizerForm } from "@/components/forms/OrganizerForm";
import { Button } from "@/components/ui/button";
import { useOrganizer } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export function EditOrganizerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: organizer, isLoading, error } = useOrganizer(id || "");

  const handleSuccess = () => {
    // Show success toast or message
    navigate(`/organizers/${id}`);
  };

  const handleCancel = () => {
    navigate(`/organizers/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Organizer</h2>
          <p className="text-gray-600 mb-4">
            Could not load the organizer with ID: {id}
          </p>
          <Button onClick={() => navigate("/organizers")}>Back to Organizers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Organizer: {organizer.name}</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <OrganizerForm
          organizer={organizer}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
