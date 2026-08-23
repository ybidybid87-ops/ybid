import { adminQueries } from "@/services/query-options/admin";
import { AdminDashboardPeriod } from "@/types/admin-dashboard";
import { useQuery } from "@tanstack/react-query";

export default function useAdminDashboardStats(period: AdminDashboardPeriod) {
  return useQuery(adminQueries.dashboardStats(period));
}
