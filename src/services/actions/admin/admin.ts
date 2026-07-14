import { fetcher } from "@/services/fetcher";
import { AdminSalesPerformanceResponse } from "@/types/admin-sales-performance";

export function getAdminSalesPerformance(year: number, month: number) {
  const searchParams = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  return fetcher<AdminSalesPerformanceResponse>(
    `/api/admin/sales-performance?${searchParams.toString()}`,
  );
}
