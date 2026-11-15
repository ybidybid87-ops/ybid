import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAdminUserData } from "@/services/actions/user/delete-admin-user-data";
import {
  adminKeys,
  companyKeys,
  contactHistoryKeys,
  contactScheduleKeys,
  contractKeys,
  dashboardKeys,
  monthlySalesRankingKeys,
  notificationKeys,
  userKeys,
} from "@/services/query-keys";

export default function useDeleteAdminUserData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminUserData,

    onSuccess: async () => {
      await Promise.all([
        // 사용자 목록 및 사용자 관련 캐시
        queryClient.invalidateQueries({
          queryKey: userKeys.all,
        }),

        // 업체 목록 및 상세
        queryClient.invalidateQueries({
          queryKey: companyKeys.all,
        }),

        // 연락 이력
        queryClient.invalidateQueries({
          queryKey: contactHistoryKeys.all,
        }),

        // 연락 일정 및 달력
        queryClient.invalidateQueries({
          queryKey: contactScheduleKeys.all,
        }),

        // 월별 계약 현황
        queryClient.invalidateQueries({
          queryKey: contractKeys.all,
        }),

        // 개인 대시보드
        queryClient.invalidateQueries({
          queryKey: dashboardKeys.all,
        }),

        // 월별 영업 랭킹
        queryClient.invalidateQueries({
          queryKey: monthlySalesRankingKeys.all,
        }),

        // 알림 목록 및 읽지 않은 알림 수
        queryClient.invalidateQueries({
          queryKey: notificationKeys.all,
        }),

        // 관리자 대시보드 및 팀원별 실적
        queryClient.invalidateQueries({
          queryKey: adminKeys.all,
        }),
      ]);
    },
  });
}
