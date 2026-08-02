import { queryOptions } from "@tanstack/react-query";
import { getAdminSalesPerformance } from "../actions/admin/admin";
import { getAdminDashboardStats } from "../actions/admin/dashboard-stats";
import { adminKeys } from "../query-keys";

export const adminQueries = {
  salesPerformance: (year: number, month: number) =>
    queryOptions({
      queryKey: adminKeys.salesPerformance(year, month),
      queryFn: () => getAdminSalesPerformance(year, month),
    }),

  dashboardStats: () =>
    queryOptions({
      queryKey: adminKeys.dashboardStats(),
      queryFn: getAdminDashboardStats,
    }),
};
