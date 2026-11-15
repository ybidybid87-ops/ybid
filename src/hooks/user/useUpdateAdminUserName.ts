import { updateAdminUserName } from "@/services/actions/user/update-admin-user-name";
import { userKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateAdminUserName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminUserName,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
  });
}
