import { ApiService } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const useUsersWithRoles = () =>
    useQuery({
      queryKey: ['usersWithRoles'],
      queryFn: ApiService.getUsersWithRoles,
    });

    return {
      useUsersWithRoles
    };
}
