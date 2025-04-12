import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useResources } from "@/hooks/useResources";
import { ResourceDTO, ResourceAllocationDTO } from "@/types";

// Schema for the form
const resourceAllocationSchema = z.object({
  resourceId: z.number({ required_error: "Resource is required" }),
  quantity: z.number()
    .int({ message: "Quantity must be a whole number" })
    .min(1, { message: "Quantity must be at least 1" }),
  startTime: z.date({ required_error: "Start time is required" }),
  endTime: z.date({ required_error: "End time is required" }),
}).superRefine((data, ctx) => {
  if (data.startTime && data.endTime && data.endTime < data.startTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End time must be after or equal to start time",
      path: ["endTime"],
    });
  }
});

type ResourceAllocationFormValues = z.infer<typeof resourceAllocationSchema>;

interface ResourceAllocationFormProps {
  eventId: number;
  eventStartDate?: string;
  eventEndDate?: string;
  existingAllocation?: ResourceAllocationDTO;
  onSubmit: (values: {
    resourceId: number;
    quantity: number;
    startTime: string;
    endTime: string;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ResourceAllocationForm({
  eventId,
  eventStartDate,
  eventEndDate,
  existingAllocation,
  onSubmit,
  onCancel,
  isSubmitting,
}: ResourceAllocationFormProps) {
  // Fetch resources for dropdown
  const { data: resourcesData, isLoading: isLoadingResources } = useResources();
  const resources = resourcesData || [];

  // Get default values from existing allocation or create new defaults
  const defaultValues: Partial<ResourceAllocationFormValues> = {
    resourceId: existingAllocation?.resourceId,
    quantity: existingAllocation?.quantity,
    startTime: existingAllocation?.startTime ? new Date(existingAllocation.startTime) :
               eventStartDate ? new Date(eventStartDate) : undefined,
    endTime: existingAllocation?.endTime ? new Date(existingAllocation.endTime) :
             eventEndDate ? new Date(eventEndDate) : undefined,
  };

  const form = useForm<ResourceAllocationFormValues>({
    resolver: zodResolver(resourceAllocationSchema),
    defaultValues,
  });

  // Track selected resource for resource-specific validation
  const [selectedResource, setSelectedResource] = useState<ResourceDTO | null>(null);
  const watchedResourceId = form.watch("resourceId");
  const watchedQuantity = form.watch("quantity");

  // Update selected resource when resourceId changes
  useEffect(() => {
    if (watchedResourceId) {
      const resource = resources.find((r: ResourceDTO) => r.id === watchedResourceId);
      if (resource) {
        setSelectedResource(resource);

        // If the resource is limited and current quantity exceeds max, cap it
        if (resource.isLimited &&
            resource.maxQuantity !== undefined &&
            watchedQuantity > resource.maxQuantity) {
          form.setValue("quantity", resource.maxQuantity);
        }
      }
    }
  }, [watchedResourceId, resources, form, watchedQuantity]);

  const handleSubmit = (values: ResourceAllocationFormValues) => {
    onSubmit({
      resourceId: values.resourceId,
      quantity: values.quantity,
      startTime: values.startTime.toISOString(),
      endTime: values.endTime.toISOString(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="resourceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resource" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingResources ? (
                    <SelectItem value="loading" disabled>
                      Loading resources...
                    </SelectItem>
                  ) : resources.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No resources available
                    </SelectItem>
                  ) : (
                    resources.map((resource: ResourceDTO) => (
                      <SelectItem key={resource.id} value={resource.id.toString()}>
                        {resource.name} {resource.isLimited && resource.maxQuantity !== undefined &&
                          `(Max: ${resource.maxQuantity})`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the resource to allocate for this event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={selectedResource?.isLimited ? selectedResource.maxQuantity : undefined}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                {selectedResource?.isLimited && selectedResource.maxQuantity !== undefined
                  ? `This resource is limited to a maximum of ${selectedResource.maxQuantity} units`
                  : "How many units of this resource do you need?"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the resource allocation begins
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the resource allocation ends
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : existingAllocation ? "Update" : "Add Resource"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
