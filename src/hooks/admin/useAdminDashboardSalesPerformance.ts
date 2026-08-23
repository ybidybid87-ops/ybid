// app/hooks/admin/useAdminDashboardSalesPerformance.ts

import { adminQueries } from "@/services/query-options/admin";
import { AdminDashboardPeriod } from "@/types/admin-dashboard";
import { useQuery } from "@tanstack/react-query";

export default function useAdminDashboardSalesPerformance(period: AdminDashboardPeriod) {
  return useQuery(adminQueries.dashboardSalesPerformance(period));
}
