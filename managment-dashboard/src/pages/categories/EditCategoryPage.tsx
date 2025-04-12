import { useNavigate, useParams } from "react-router-dom";
import { useCategory, useUpdateCategory } from "@/hooks/useCategories";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { CategoryFormValues } from "@/schema/categorySchema";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function EditCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const categoryId = id ? parseInt(id) : 0;
  const { toast } = useToast();

  const { data: category, isLoading, error } = useCategory(categoryId);
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const handleSubmit = (data: CategoryFormValues) => {
    updateCategory(
      { id: categoryId, category: data },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Category updated successfully",
          });
          navigate("/categories");
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update category: " + error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-5 w-40 mt-2" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-red-500">
            Error loading category: {error.message}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-red-500">Category not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <p className="text-muted-foreground">
          Update the category information
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <CategoryForm
          defaultValues={{
            name: category.name,
            description: category.description,
            isActive: category.isActive,
          }}
          categoryId={categoryId}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
}
