import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganizerDTO,
  CreateOrganizerDTO,
  UpdateOrganizerDTO,
  OrganizerType
} from "@/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Textarea } from "@/components/ui/textarea";
import { organizerFormSchema, OrganizerFormValues, organizerTypeOptions } from "@/schema/organizerSchema";
import { useCreateOrganizer, useUpdateOrganizer, useCheckOrganizerNameUnique } from "@/hooks";

interface OrganizerFormProps {
  organizer?: OrganizerDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OrganizerForm({ organizer, onSuccess, onCancel }: OrganizerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form
  const form = useForm<OrganizerFormValues>({
    resolver: zodResolver(organizerFormSchema),
    defaultValues: organizer ? {
      name: organizer.name,
      contactPerson: organizer.contactPerson || "",
      email: organizer.email || "",
      phone: organizer.phone || "",
      type: organizer.type,
      notes: organizer.notes || ""
    } : {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      type: OrganizerType.CorporateClient, // Default type
      notes: ""
    },
  });

  // Get form values for name check
  const currentName = form.watch("name");

  // Unique name check query
  const { data: isNameUnique, isLoading: isCheckingName } = useCheckOrganizerNameUnique(
    currentName,
    organizer?.id
  );

  // Mutations
  const createOrganizerMutation = useCreateOrganizer();
  const updateOrganizerMutation = useUpdateOrganizer();

  // Handle form submission
  const onSubmit = async (values: OrganizerFormValues) => {
    try {
      setIsSubmitting(true);

      // Check if name is unique before submitting
      if (!isNameUnique && currentName !== organizer?.name) {
        form.setError("name", {
          type: "manual",
          message: "An organizer with this name already exists"
        });
        setIsSubmitting(false);
        return;
      }

      if (organizer) {
        // Update existing organizer
        await updateOrganizerMutation.mutateAsync({
          id: organizer.id,
          organizer: values as UpdateOrganizerDTO
        });
      } else {
        // Create new organizer
        await createOrganizerMutation.mutateAsync(values as CreateOrganizerDTO);
      }

      // Reset form and call success callback
      if (!organizer) {
        form.reset();
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save organizer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Organizer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <Input placeholder="Contact person name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizer Type*</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organizer type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {organizerTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information about the organizer"
                  {...field}
                />
              </FormControl>
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
          <Button
            type="submit"
            disabled={isSubmitting || isCheckingName}
          >
            {isSubmitting ? 'Saving...' : organizer ? 'Update Organizer' : 'Create Organizer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
