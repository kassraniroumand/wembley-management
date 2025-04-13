import { useNavigate } from "react-router-dom";
import { OrganizerForm } from "@/components/forms/OrganizerForm";
import { Button } from "@/components/ui/button";
import { organization } from "@/types/CONSTANT";

export function CreateOrganizerPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Show success toast or message
    navigate(organization.organizersListUrl);
  };

  const handleCancel = () => {
    navigate(organization.organizersListUrl);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Organizer</h1>
        <Button variant="outline" onClick={handleCancel}>
          Back to Organizers
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <OrganizerForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}
