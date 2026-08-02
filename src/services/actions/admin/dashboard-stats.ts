import { fetcher } from "@/services/fetcher";
import { AdminDashboardStatsResponse } from "@/types/admin-dashboard";

export async function getAdminDashboardStats(): Promise<AdminDashboardStatsResponse> {
  return fetcher("/api/admin/dashboard-stats");
}
