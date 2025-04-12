import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckCategoryNameUnique } from "@/hooks/useCategories";
import { categorySchema, CategoryFormValues } from "@/schema/categorySchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

interface CategoryFormProps {
  defaultValues?: {
    name: string;
    description?: string;
    isActive: boolean;
  };
  onSubmit: (data: CategoryFormValues) => void;
  isSubmitting: boolean;
  categoryId?: number;
}

export function CategoryForm({
  defaultValues = {
    name: "",
    description: "",
    isActive: true,
  },
  onSubmit,
  isSubmitting,
  categoryId,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const watchedName = form.watch("name");
  const { data: isNameUnique, isLoading: isCheckingName, error: nameCheckError } = useCheckCategoryNameUnique(
    watchedName,
    categoryId
  );

  useEffect(() => {
    // Only check when there's actually a name to check and we're not already submitting
    if (watchedName && watchedName.trim().length > 0) {
      if (isNameUnique === false) {
        // If name is NOT unique, show error
        form.setError("name", {
          type: "manual",
          message: "This category name is already taken",
        });
      } else if (isNameUnique === true) {
        // If name IS unique, clear error
        form.clearErrors("name");
      }
    }

    if (nameCheckError) {
      console.error("Error checking category name:", nameCheckError);
    }
  }, [isNameUnique, form, watchedName, nameCheckError]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Category name"
                  {...field}
                  className={isNameUnique === false ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
              </FormControl>
              {isCheckingName && watchedName && watchedName.trim().length > 0 && (
                <p className="text-sm text-muted-foreground">Checking name availability...</p>
              )}
              {isNameUnique === true && watchedName && watchedName.trim().length > 0 && !isCheckingName && (
                <p className="text-sm text-green-600">This name is available</p>
              )}
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
                  placeholder="Category description (optional)"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Active</FormLabel>
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

        <Button
          type="submit"
          disabled={isSubmitting || isNameUnique === false || isCheckingName}
        >
          {isSubmitting ? "Saving..." : "Save Category"}
        </Button>
      </form>
    </Form>
  );
}
