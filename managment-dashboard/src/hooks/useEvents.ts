import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services';
import { CreateEventDTO, UpdateEventDTO } from '@/types';

// Event Query Keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: {
    page?: number;
    pageSize?: number;
    fromDate?: Date;
    toDate?: Date;
    searchTerm?: string;
  }) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
};

// Event Hooks
export const useEvents = (
  page = 1,
  pageSize = 20,
  filters?: {
    fromDate?: Date;
    toDate?: Date;
    searchTerm?: string
  }
) => {
  return useQuery({
    queryKey: eventKeys.list({
      page,
      pageSize,
      fromDate: filters?.fromDate,
      toDate: filters?.toDate,
      searchTerm: filters?.searchTerm
    }),
    queryFn: () => eventService.getEvents(
      page,
      pageSize,
      filters?.fromDate,
      filters?.toDate,
      filters?.searchTerm
    ),
  });
};

export const useEvent = (id: number) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: CreateEventDTO) => eventService.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, event }: { id: number; event: UpdateEventDTO }) =>
      eventService.updateEvent(id, event),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const usePublishEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventService.publishEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useUnpublishEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventService.unpublishEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};
