import { archiveCompany } from "@/services/actions/company";
import { adminKeys, companyKeys, dashboardKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useArchiveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveCompany,

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
