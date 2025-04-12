import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services';
import { CreateCategoryDTO, UpdateCategoryDTO } from '@/types';

// Category Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: { page?: number; pageSize?: number }) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  eventTypeCount: (id: number) => [...categoryKeys.detail(id), 'eventTypeCount'] as const,
  nameCheck: (name: string, excludeId?: number) =>
    [...categoryKeys.all, 'nameCheck', name, excludeId] as const,
};

// Category Hooks
export const useCategories = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: categoryKeys.list({ page, pageSize }),
    queryFn: () => categoryService.getAllCategories(page, pageSize),
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
  });
};

export const useEventTypeCount = (id: number) => {
  return useQuery({
    queryKey: categoryKeys.eventTypeCount(id),
    queryFn: () => categoryService.getEventTypeCount(id),
    enabled: !!id,
  });
};

export const useCheckCategoryNameUnique = (name: string, excludeId?: number) => {
  return useQuery({
    queryKey: categoryKeys.nameCheck(name, excludeId),
    queryFn: () => categoryService.checkNameUnique(name, excludeId),
    enabled: !!name,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: CreateCategoryDTO) => categoryService.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, category }: { id: number; category: UpdateCategoryDTO }) =>
      categoryService.updateCategory(id, category),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};
