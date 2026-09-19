import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/users";
import type { UserInput } from "@/dtos/user";

const USERS_KEY = ["users"] as const;

export function useUsers() {
  return useQuery({ queryKey: USERS_KEY, queryFn: usersApi.list });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserInput) => usersApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}
