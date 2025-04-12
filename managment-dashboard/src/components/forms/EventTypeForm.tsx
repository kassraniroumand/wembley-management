import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/hooks/useCategories";
import { eventTypeFormSchema, EventTypeFormValues } from "@/schema/eventTypeSchema";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface EventTypeFormProps {
  defaultValues?: Partial<EventTypeFormValues>;
  onSubmit: (data: EventTypeFormValues) => void;
  isSubmitting: boolean;
}

export function EventTypeForm({
  defaultValues = {
    name: "",
    description: "",
    category: "",
    defaultCapacity: 10,
    setupDays: 0,
    teardownDays: 0,
    requiresPitchAccess: false,
    defaultConfigurations: "",
  },
  onSubmit,
  isSubmitting,
}: EventTypeFormProps) {
  const form = useForm<EventTypeFormValues>({
    resolver: zodResolver(eventTypeFormSchema),
    defaultValues,
  });

  // Load categories for the select dropdown
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories = categoriesData || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type Name</FormLabel>
              <FormControl>
                <Input placeholder="Event type name" {...field} />
              </FormControl>
              <FormDescription>
                The name of this event type (e.g., Conference, Workshop, Concert)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Event type description (optional)"
                  className="h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Describe this event type and its typical requirements
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                disabled={isLoadingCategories}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    {isLoadingCategories ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading categories...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a category" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The category this event type belongs to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="defaultCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Typical number of attendees for this event type
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiresPitchAccess"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <FormLabel>Requires Pitch Access</FormLabel>
                  <FormDescription>
                    Whether this event type requires access to the pitch/field
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="setupDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setup Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Number of days required for setup before the event
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teardownDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teardown Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Number of days required for teardown after the event
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="defaultConfigurations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Configurations</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Default configurations or setup instructions (optional)"
                  className="h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Standard configurations or setup instructions for this event type
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Event Type"
          )}
        </Button>
      </form>
    </Form>
  );
}
