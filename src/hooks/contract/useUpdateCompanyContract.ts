import { updateCompanyContract } from "@/services/actions/contract";
import {
  adminKeys,
  companyKeys,
  contractKeys,
  dashboardKeys,
  notificationKeys,
} from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/* 사용예시
const contractMutation = useUpdateCompanyContract();

contractMutation.mutate({
  companyId,
  action: "complete",
  memo: "대표 계약 완료",
  contractedAt: "2026-09-06",
  contractDurationDays: 10,
});

contractMutation.mutate({
  companyId,
  action: "cancel",
});
*/

export default function useUpdateCompanyContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      action,
      memo,
      contractedAt,
      contractDurationDays,
    }: {
      companyId: string;
      action: "complete" | "cancel";
      memo?: string;
      contractedAt?: string;
      contractDurationDays?: number;
    }) =>
      updateCompanyContract(companyId, {
        action,
        memo,
        contractedAt,
        contractDurationDays,
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(variables.companyId),
      });
      queryClient.invalidateQueries({
        queryKey: companyKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: contractKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: adminKeys.all,
      });
    },
  });
}
