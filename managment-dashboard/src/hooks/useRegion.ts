import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/lib/api';

// Type definitions
export interface Region {
  id: string;
  name: string;
  code: string;
  // Add other region properties as needed
}

export interface CreateRegionDto {
  name: string;
  code: string;
  // Add other properties needed for creation
}

export interface UpdateRegionDto {
  id: string;
  name?: string;
  code?: string;
  // Add other updatable properties
}

export const useRegion = () => {
  const queryClient = useQueryClient();

  // Get all regions
  const useRegions = () =>
    useQuery({
      queryKey: ['regions'],
      queryFn: ApiService.allRegion,
    });

  // Get a single region by id
  const useRegionById = (id: string) =>
    useQuery({
      queryKey: ['region', id],
      queryFn: () => ApiService.getRegionById(id),
      enabled: !!id, // Only run if id is provided
    });

  // Create a new region
  const useCreateRegion = () =>
    useMutation({
      mutationFn: ApiService.createRegion,
      onSuccess: () => {
        // Invalidate the regions query to refetch the list
        queryClient.invalidateQueries({ queryKey: ['regions'] });
      },
    });

  // Update an existing region
  const useUpdateRegion = () =>
    useMutation({
      mutationFn: ApiService.updateRegion,
      onSuccess: (data: Region) => {
        // Update both the list and the individual region
        queryClient.invalidateQueries({ queryKey: ['regions'] });
        queryClient.invalidateQueries({ queryKey: ['region', data.id] });
      },
    });

  // Delete a region
  const useDeleteRegion = () =>
    useMutation({
      mutationFn: ApiService.deleteRegion,
      onSuccess: () => {
        // Invalidate the regions query to refetch the list
        queryClient.invalidateQueries({ queryKey: ['regions'] });
      },
    });

  return {
    useRegions,
    useRegionById,
    useCreateRegion,
    useUpdateRegion,
    useDeleteRegion,
  };
};

export default useRegion;
