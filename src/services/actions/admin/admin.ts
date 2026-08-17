import { fetcher } from "@/services/fetcher";
import { AdminSalesPerformanceResponse } from "@/types/admin-sales-performance";

export function getAdminSalesPerformance(startDate: string, endDate: string) {
  const searchParams = new URLSearchParams({
    startDate,
    endDate,
  });

  return fetcher<AdminSalesPerformanceResponse>(
    `/api/admin/sales-performance?${searchParams.toString()}`,
  );
}
