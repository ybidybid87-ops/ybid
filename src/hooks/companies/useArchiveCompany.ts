import { archiveCompany } from "@/services/actions/company";
import { adminKeys, companyKeys, dashboardKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useArchiveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveCompany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: adminKeys.all,
      });
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "업체를 삭제하는 중 오류가 발생했습니다.",
      );
    },
  });
}
