// 담당자 후보 조회 훅

import { companyOwnerApi } from "@/services/api/company-owner.api";
import { companyKeys } from "@/services/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function useCompanyOwnerCandidates(companyId: string, enabled = true) {
  return useQuery({
    queryKey: companyKeys.ownerCandidates(companyId),
    queryFn: () => companyOwnerApi.getCandidates(companyId),
    enabled: Boolean(companyId) && enabled, // 다이얼로그가 닫혀 있을 때는 요청하지 않고, 열렸을 때만 요청하도록 enabled를 받는다.
  });
}
