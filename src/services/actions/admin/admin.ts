import { fetcher } from "@/services/fetcher";
import { AdminDashboardPeriod } from "@/types/admin-dashboard";
import { AdminSalesPerformanceResponse } from "@/types/admin-sales-performance";

// 팀원별 현황 - 사용자가 선택한 기간 조회
export function getAdminSalesPerformance(startDate: string, endDate: string) {
  const searchParams = new URLSearchParams({
    startDate,
    endDate,
  });

  return fetcher<AdminSalesPerformanceResponse>(
    `/api/admin/sales-performance?${searchParams.toString()}`,
  );
}

// 관리자/당월 대시보드 - 페이지에 고정된 기간 조회
export function getDashboardSalesPerformance(period: AdminDashboardPeriod) {
  const searchParams = new URLSearchParams({
    period,
  });

  return fetcher<AdminSalesPerformanceResponse>(
    `/api/admin/sales-performance?${searchParams.toString()}`,
  );
}
