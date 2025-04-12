import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resourceService } from '@/services';
import {
  CreateResourceAllocationDTO,
  UpdateResourceAllocationDTO
} from '@/types';

// Resource Allocation Query Keys
export const resourceAllocationKeys = {
  all: ['resourceAllocations'] as const,
  lists: () => [...resourceAllocationKeys.all, 'list'] as const,
  list: (filters: { eventId?: number }) =>
    [...resourceAllocationKeys.lists(), filters] as const,
  details: () => [...resourceAllocationKeys.all, 'detail'] as const,
  detail: (id: number) => [...resourceAllocationKeys.details(), id] as const,
  event: (eventId: number) => [...resourceAllocationKeys.all, 'event', eventId] as const,
};

// Resource Allocation Hooks for Event
export const useDeleteResourceAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => resourceService.deleteResourceAllocation(id),
    onSuccess: () => {
      // Invalidate all allocations queries since we don't know which event this belonged to
      queryClient.invalidateQueries({ queryKey: resourceAllocationKeys.lists() });
      // Also invalidate event-specific queries
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useCreateEventResourceAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (allocation: CreateResourceAllocationDTO) =>
      resourceService.createResourceAllocation(allocation),
    onSuccess: (_, variables) => {
      // Invalidate the resource allocations for this event
      queryClient.invalidateQueries({
        queryKey: resourceAllocationKeys.event(variables.eventId)
      });
      // Also invalidate the event details query to update the ResourceAllocations list
      queryClient.invalidateQueries({
        queryKey: ['events', 'detail', variables.eventId]
      });
    },
  });
};

export const useUpdateEventResourceAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, allocation, eventId }: {
      id: number;
      allocation: UpdateResourceAllocationDTO;
      eventId: number;
    }) => resourceService.updateResourceAllocation(id, allocation),
    onSuccess: (_, variables) => {
      // Invalidate the resource allocations for this event
      queryClient.invalidateQueries({
        queryKey: resourceAllocationKeys.event(variables.eventId)
      });
      // Also invalidate the event details query
      queryClient.invalidateQueries({
        queryKey: ['events', 'detail', variables.eventId]
      });
    },
  });
};
