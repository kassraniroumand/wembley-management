import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventTypeService } from '@/services';
import {
  CreateEventTypeDTO,
  CreateEventTypeResourceDTO,
  UpdateEventTypeDTO,
  UpdateEventTypeResourceDTO
} from '@/types';

// Event Type Query Keys
export const eventTypeKeys = {
  all: ['eventTypes'] as const,
  lists: () => [...eventTypeKeys.all, 'list'] as const,
  list: (filters: { page?: number; pageSize?: number; category?: string }) =>
    [...eventTypeKeys.lists(), filters] as const,
  details: () => [...eventTypeKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventTypeKeys.details(), id] as const,
  withResources: (id: number) => [...eventTypeKeys.detail(id), 'resources'] as const,
  resources: () => [...eventTypeKeys.all, 'resources'] as const,
  eventTypeResources: (eventTypeId: number) => [...eventTypeKeys.resources(), eventTypeId] as const,
};

// Event Type Hooks
export const useEventTypes = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: eventTypeKeys.list({ page, pageSize }),
    queryFn: () => eventTypeService.getAllEventTypes(page, pageSize),
  });
};

export const useEventTypesByCategory = (category: string, page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: eventTypeKeys.list({ category, page, pageSize }),
    queryFn: () => eventTypeService.getEventTypesByCategory(category, page, pageSize),
    enabled: !!category,
  });
};

export const useEventType = (id: number) => {
  return useQuery({
    queryKey: eventTypeKeys.detail(id),
    queryFn: () => eventTypeService.getEventTypeById(id),
    enabled: !!id,
  });
};

export const useEventTypeWithResources = (id: number) => {
  return useQuery({
    queryKey: eventTypeKeys.withResources(id),
    queryFn: () => eventTypeService.getEventTypeWithResources(id),
    enabled: !!id,
  });
};

export const useCreateEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventType: CreateEventTypeDTO) => eventTypeService.createEventType(eventType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.lists() });
    },
  });
};

export const useUpdateEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, eventType }: { id: number; eventType: UpdateEventTypeDTO }) =>
      eventTypeService.updateEventType(id, eventType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.withResources(variables.id) });
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.lists() });
    },
  });
};

export const useDeleteEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventTypeService.deleteEventType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.lists() });
    },
  });
};

// Event Type Resources
export const useEventTypeResources = (eventTypeId: number) => {
  return useQuery({
    queryKey: eventTypeKeys.eventTypeResources(eventTypeId),
    queryFn: () => eventTypeService.getEventTypeResources(eventTypeId),
    enabled: !!eventTypeId,
  });
};

export const useAddDefaultResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resource: CreateEventTypeResourceDTO) =>
      eventTypeService.addDefaultResource(resource),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventTypeKeys.eventTypeResources(variables.eventTypeId)
      });
      queryClient.invalidateQueries({
        queryKey: eventTypeKeys.withResources(variables.eventTypeId)
      });
    },
  });
};

export const useUpdateDefaultResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resource }: { id: number; resource: UpdateEventTypeResourceDTO }) =>
      eventTypeService.updateDefaultResource(id, resource),
    onSuccess: (_, variables) => {
      if (variables.resource.eventTypeId) {
        queryClient.invalidateQueries({
          queryKey: eventTypeKeys.eventTypeResources(variables.resource.eventTypeId)
        });
        queryClient.invalidateQueries({
          queryKey: eventTypeKeys.withResources(variables.resource.eventTypeId)
        });
      }
    },
  });
};

export const useRemoveDefaultResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; eventTypeId: number }) =>
      eventTypeService.removeDefaultResource(params.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventTypeKeys.eventTypeResources(variables.eventTypeId)
      });
      queryClient.invalidateQueries({
        queryKey: eventTypeKeys.withResources(variables.eventTypeId)
      });
    },
  });
};
