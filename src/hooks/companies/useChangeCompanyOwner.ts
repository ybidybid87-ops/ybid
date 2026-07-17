// 담당자 변경 mutation 훅

import { companyOwnerApi } from "@/services/api/company-owner.api";
import { adminKeys, companyKeys } from "@/services/query-keys";
import { ChangeCompanyOwnerRequest } from "@/types/company-owner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Variables = {
  companyId: string;
  request: ChangeCompanyOwnerRequest;
};

export default function useChangeCompanyOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, request }: Variables) => companyOwnerApi.change(companyId, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(variables.companyId),
      });

      queryClient.invalidateQueries({
        queryKey: companyKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: adminKeys.all,
      });
    },
  });
}
