import { useNavigate, useParams } from "react-router-dom";
import { useOrganizer, useOrganizerEventCount, useOrganizerWithEvents } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrganizerTypeDisplayName } from "@/schema/organizerSchema";
import { ArrowLeft, Calendar, Edit, Mail, Phone, Tag, User } from "lucide-react";

export function OrganizerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: organizer, isLoading, error } = useOrganizer(id || "");
  const { data: eventCount } = useOrganizerEventCount(id || "");
  const { data: organizerWithEvents } = useOrganizerWithEvents(id || "", 1, 5);

  const handleEdit = () => {
    navigate(`/organizers/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/organizers");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-24 mr-4" />
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
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
          <Button onClick={handleBack}>Back to Organizers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{organizer.name}</h1>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Organizer Details</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Type
              </h3>
              <p className="mt-1 text-lg">
                {getOrganizerTypeDisplayName(organizer.type)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Contact Person
              </h3>
              <p className="mt-1 text-lg">
                {organizer.contactPerson || "No contact person specified"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </h3>
                <p className="mt-1 text-lg">
                  {organizer.email || "No email specified"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </h3>
                <p className="mt-1 text-lg">
                  {organizer.phone || "No phone specified"}
                </p>
              </div>
            </div>

            {organizer.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-gray-800 whitespace-pre-line">
                  {organizer.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Events
            </h2>
            <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">
              {eventCount || 0} total
            </div>
          </div>

          {organizerWithEvents?.events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events for this organizer
            </div>
          ) : (
            <div className="space-y-4">
              {organizerWithEvents?.events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <h3 className="font-medium">{event.name}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}

              {(organizerWithEvents?.totalEventCount || 0) > 5 && (
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate(`/events?organizer=${id}`)}
                >
                  View All Events
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
