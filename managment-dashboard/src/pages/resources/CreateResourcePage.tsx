import { useNavigate } from "react-router-dom";
import { ResourceForm } from "@/components/forms/ResourceForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { resource } from "@/types/CONSTANT";

export function CreateResourcePage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(resource.resourcesListUrl);

  };

  const handleCancel = () => {
    navigate(resource.resourcesListUrl);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Resource</h1>
        <Button variant="outline" onClick={handleCancel}>
          Back to Resources
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>
            Add a new resource to the system. Resources can be allocated to events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
}
