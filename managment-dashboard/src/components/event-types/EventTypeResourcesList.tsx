import { useEventTypeResources } from "@/hooks/useEventTypes";
import { useResources } from "@/hooks";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface EventTypeResourcesListProps {
  eventTypeId: number;
  eventTypeName: string;
  compact?: boolean;
}

export function EventTypeResourcesList({
  eventTypeId,
  eventTypeName,
  compact = false,
}: EventTypeResourcesListProps) {
  const { data: resources } = useResources();
  const { data: eventTypeResources, isLoading } = useEventTypeResources(eventTypeId);

  const getResourceName = (resourceId: number) => {
    const resource = resources?.find((r) => r.id === resourceId);
    return resource ? resource.name : "Unknown Resource";
  };

  const getResourceCategory = (resourceId: number) => {
    const resource = resources?.find((r) => r.id === resourceId);
    return resource?.category || "Unknown";
  };

  // If compact is true, we'll render a simpler version
  if (compact) {
    return (
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !eventTypeResources || eventTypeResources.length === 0 ? (
          <div className="text-sm text-muted-foreground">No resources</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {eventTypeResources.map((resource) => (
              <Badge key={resource.id} variant="outline" className="text-xs">
                {resource.resourceName || getResourceName(resource.resourceId)} ({resource.quantity})
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full card version
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
        <CardDescription>
          Standard resources required for {eventTypeName} events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !eventTypeResources || eventTypeResources.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No resources assigned to this event type.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypeResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    {resource.resourceName || getResourceName(resource.resourceId)}
                  </TableCell>
                  <TableCell>
                    {getResourceCategory(resource.resourceId)}
                  </TableCell>
                  <TableCell className="text-right">{resource.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
