"use client";

import { logoutUser } from "@/services/actions/user/logoutUser";
import { userKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: userKeys.all,
      });

      router.replace("/login");
      router.refresh();
    },
  });
}
