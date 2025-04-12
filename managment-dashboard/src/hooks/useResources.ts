import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resourceService } from '@/services';
import {
  CreateResourceDTO,
  CreateResourceAllocationDTO,
  ResourceAvailabilityRequestDTO,
  UpdateResourceDTO,
  UpdateResourceAllocationDTO
} from '@/types';

// Resource Query Keys
export const resourceKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (filters: { page?: number; pageSize?: number; type?: string }) =>
    [...resourceKeys.lists(), filters] as const,
  details: () => [...resourceKeys.all, 'detail'] as const,
  detail: (id: number) => [...resourceKeys.details(), id] as const,
  allocations: () => [...resourceKeys.all, 'allocations'] as const,
  allocation: (resourceId: number, filters?: { startDate?: Date; endDate?: Date }) =>
    [...resourceKeys.allocations(), resourceId, filters] as const,
};

// Resource Hooks
export const useResources = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: resourceKeys.list({ page, pageSize }),
    queryFn: () => resourceService.getAllResources(page, pageSize),
  });
};

export const useResourcesByType = (type: string, page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: resourceKeys.list({ type, page, pageSize }),
    queryFn: () => resourceService.getResourcesByType(type, page, pageSize),
  });
};

export const useResource = (id: number) => {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => resourceService.getResourceById(id),
    enabled: !!id,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resource: CreateResourceDTO) => resourceService.createResource(resource),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resource }: { id: number; resource: UpdateResourceDTO }) =>
      resourceService.updateResource(id, resource),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => resourceService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
};

// Resource Allocation Hooks
export const useResourceAllocations = (
  resourceId: number,
  options?: { startDate?: Date; endDate?: Date }
) => {
  return useQuery({
    queryKey: resourceKeys.allocation(resourceId, options),
    queryFn: () => resourceService.getResourceAllocations(
      resourceId,
      options?.startDate,
      options?.endDate
    ),
    enabled: !!resourceId,
  });
};

export const useCreateResourceAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (allocation: CreateResourceAllocationDTO) =>
      resourceService.createResourceAllocation(allocation),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: resourceKeys.allocation(variables.resourceId)
      });
    },
  });
};

export const useUpdateResourceAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, allocation }: { id: number; allocation: UpdateResourceAllocationDTO }) =>
      resourceService.updateResourceAllocation(id, allocation),
    onSuccess: (_, variables) => {
      // We may not know which resource this allocation belongs to from this context
      // So invalidate all allocations
      queryClient.invalidateQueries({ queryKey: resourceKeys.allocations() });
    },
  });
};

export const useDeleteResourceAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => resourceService.deleteResourceAllocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.allocations() });
    },
  });
};

export const useCheckResourceAvailability = () => {
  return useMutation({
    mutationFn: (request: ResourceAvailabilityRequestDTO) =>
      resourceService.checkResourceAvailability(request),
  });
};
