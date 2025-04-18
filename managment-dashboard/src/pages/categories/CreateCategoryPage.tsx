import { useNavigate } from "react-router-dom";
import { useCreateCategory } from "@/hooks/useCategories";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { CategoryFormValues } from "@/schema/categorySchema";
import { useToast } from "@/components/ui/use-toast";
import { category } from "@/types/CONSTANT";

export function CreateCategoryPage() {
  const navigate = useNavigate();
  const { mutate: createCategory, isPending } = useCreateCategory();
  const { toast } = useToast();

  const handleSubmit = (data: CategoryFormValues) => {
    console.log("Submitting category form with data:", data);

    createCategory(data, {
      onSuccess: (response) => {
        console.log("Category created successfully:", response);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
        navigate(category.categoriesListUrl);

      },
      onError: (error) => {
        console.error("Failed to create category:", error);
        toast({
          title: "Error",
          description: "Failed to create category: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Category</h1>
        <p className="text-muted-foreground">
          Add a new category to the system
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <CategoryForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
}
