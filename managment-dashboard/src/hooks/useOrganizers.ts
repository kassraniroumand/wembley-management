import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizerService } from '@/services';
import { CreateOrganizerDTO, UpdateOrganizerDTO } from '@/types';

// Organizer Query Keys
export const organizerKeys = {
  all: ['organizers'] as const,
  lists: () => [...organizerKeys.all, 'list'] as const,
  list: (filters: { page?: number; pageSize?: number; searchTerm?: string }) =>
    [...organizerKeys.lists(), filters] as const,
  details: () => [...organizerKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizerKeys.details(), id] as const,
  withEvents: (id: string, page?: number, pageSize?: number) =>
    [...organizerKeys.detail(id), 'events', { page, pageSize }] as const,
  eventCount: (id: string) => [...organizerKeys.detail(id), 'eventCount'] as const,
  nameCheck: (name: string, excludeId?: string) =>
    [...organizerKeys.all, 'nameCheck', name, excludeId] as const,
};

// Organizer Hooks
export const useOrganizers = (page = 1, pageSize = 20, searchTerm?: string) => {
  return useQuery({
    queryKey: organizerKeys.list({ page, pageSize, searchTerm }),
    queryFn: () => organizerService.getOrganizers(page, pageSize, searchTerm),
  });
};

export const useOrganizer = (id: string) => {
  return useQuery({
    queryKey: organizerKeys.detail(id),
    queryFn: () => organizerService.getOrganizerById(id),
    enabled: !!id,
  });
};

export const useOrganizerWithEvents = (id: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: organizerKeys.withEvents(id, page, pageSize),
    queryFn: () => organizerService.getOrganizerWithEvents(id, page, pageSize),
    enabled: !!id,
  });
};

export const useOrganizerEventCount = (id: string) => {
  return useQuery({
    queryKey: organizerKeys.eventCount(id),
    queryFn: () => organizerService.getEventCount(id),
    enabled: !!id,
  });
};

export const useCheckOrganizerNameUnique = (name: string, excludeId?: string) => {
  return useQuery({
    queryKey: organizerKeys.nameCheck(name, excludeId),
    queryFn: () => organizerService.isNameUnique(name, excludeId),
    enabled: !!name,
  });
};

export const useCreateOrganizer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizer: CreateOrganizerDTO) => organizerService.createOrganizer(organizer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizerKeys.lists() });
    },
  });
};

export const useUpdateOrganizer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, organizer }: { id: string; organizer: UpdateOrganizerDTO }) =>
      organizerService.updateOrganizer(id, organizer),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: organizerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: organizerKeys.lists() });
    },
  });
};

export const useDeleteOrganizer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizerService.deleteOrganizer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizerKeys.lists() });
    },
  });
};
