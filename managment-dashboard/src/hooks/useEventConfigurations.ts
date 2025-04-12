import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventConfigurationService } from '@/services';
import { CreateEventConfigurationDTO, UpdateEventConfigurationDTO } from '@/types';

// Event Configuration Query Keys
export const eventConfigKeys = {
  all: ['eventConfigurations'] as const,
  lists: () => [...eventConfigKeys.all, 'list'] as const,
  list: (eventId: number) => [...eventConfigKeys.lists(), eventId] as const,
  listByType: (eventId: number, type: string) => [...eventConfigKeys.list(eventId), type] as const,
  details: () => [...eventConfigKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventConfigKeys.details(), id] as const,
};

// Event Configuration Hooks
export const useEventConfigurations = (eventId: number) => {
  return useQuery({
    queryKey: eventConfigKeys.list(eventId),
    queryFn: () => eventConfigurationService.getConfigurationsForEvent(eventId),
    enabled: !!eventId,
  });
};

export const useEventConfigurationsByType = (eventId: number, configurationType: string) => {
  return useQuery({
    queryKey: eventConfigKeys.listByType(eventId, configurationType),
    queryFn: () => eventConfigurationService.getConfigurationsByType(eventId, configurationType),
    enabled: !!eventId && !!configurationType,
  });
};

export const useEventConfiguration = (id: number) => {
  return useQuery({
    queryKey: eventConfigKeys.detail(id),
    queryFn: () => eventConfigurationService.getConfigurationById(id),
    enabled: !!id,
  });
};

export const useCreateEventConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (configuration: CreateEventConfigurationDTO) =>
      eventConfigurationService.createConfiguration(configuration),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventConfigKeys.list(variables.eventId)
      });
    },
  });
};

export const useUpdateEventConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, configuration }: { id: number; configuration: UpdateEventConfigurationDTO }) =>
      eventConfigurationService.updateConfiguration(id, configuration),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventConfigKeys.detail(variables.id)
      });

      // We need to know which event this configuration belongs to
      // to invalidate the correct list query
      if (variables.configuration.eventId) {
        queryClient.invalidateQueries({
          queryKey: eventConfigKeys.list(variables.configuration.eventId)
        });
      }
    },
  });
};

export const useDeleteEventConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; eventId: number }) =>
      eventConfigurationService.deleteConfiguration(params.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventConfigKeys.list(variables.eventId)
      });
    },
  });
};
