import { fetcher } from "@/services/fetcher";
import { AdminDashboardPeriod, AdminDashboardStatsResponse } from "@/types/admin-dashboard";

export async function getAdminDashboardStats(
  period: AdminDashboardPeriod,
): Promise<AdminDashboardStatsResponse> {
  const searchParams = new URLSearchParams({
    period,
  });

  return fetcher(`/api/admin/dashboard-stats?${searchParams.toString()}`);
}
