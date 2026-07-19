import { createCompany } from "@/services/actions/company";
import { adminKeys, companyKeys, dashboardKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: adminKeys.all,
      });
    },
  });
}
