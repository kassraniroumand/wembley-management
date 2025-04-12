import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResourceDTO, CreateResourceDTO, UpdateResourceDTO } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { resourceFormSchema, ResourceFormValues, commonResourceTypes } from "@/schema/resourceSchema";
import { useCreateResource, useUpdateResource } from "@/hooks";

interface ResourceFormProps {
  resource?: ResourceDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ResourceForm({ resource, onSuccess, onCancel }: ResourceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the mutation <hooks></hooks>
  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();

  // Initialize the form with default values or existing resource data
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      name: resource?.name || "",
      type: resource?.type || "",
      isLimited: resource?.isLimited || false,
      maxQuantity: resource?.maxQuantity || null,
      notes: resource?.notes || "",
    },
  });

  // Watch for changes to isLimited to conditionally render maxQuantity field
  const isLimited = form.watch("isLimited");


  // Handle form submission
  const onSubmit = async (values: ResourceFormValues) => {
    try {
      setIsSubmitting(true);

      // Prepare the data for API
      const resourceData: CreateResourceDTO | UpdateResourceDTO = {
        name: values.name,
        type: values.type,
        isLimited: values.isLimited,
        maxQuantity: values.isLimited && values.maxQuantity ? values.maxQuantity : undefined,
        notes: values.notes || undefined,
      };

      if (resource) {
        // Update existing resource
        await updateResourceMutation.mutateAsync({
          id: resource.id,
          resource: resourceData as UpdateResourceDTO
        });
      } else {
        // Create new resource
        await createResourceMutation.mutateAsync(resourceData as CreateResourceDTO);
      }

      setIsSubmitting(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting resource form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter resource name" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive name for the resource.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Type*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {commonResourceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The category this resource belongs to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isLimited"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Limited Quantity</FormLabel>
                  <FormDescription>
                    Toggle if this resource has a maximum available quantity.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />


            <FormField
              control={form.control}
              name="maxQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Quantity*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter maximum quantity"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          field.onChange(null);
                        } else {
                          const numValue = parseInt(value, 10);
                          if (!isNaN(numValue)) {
                            field.onChange(numValue);
                          }
                        }
                      }}
                      value={field.value === null ? "" : field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    The maximum quantity of this resource that can be allocated.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information about this resource..."
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Optional details about the resource, such as specific requirements or usage instructions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : resource ? "Update Resource" : "Create Resource"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
