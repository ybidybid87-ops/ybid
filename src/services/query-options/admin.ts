import { AdminDashboardPeriod } from "@/types/admin-dashboard";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAdminSalesPerformance, getDashboardSalesPerformance } from "../actions/admin/admin";
import { getAdminDashboardStats } from "../actions/admin/dashboard-stats";
import { adminKeys } from "../query-keys";

export const adminQueries = {
  salesPerformance: (startDate: string, endDate: string) =>
    queryOptions({
      queryKey: adminKeys.salesPerformance(startDate, endDate),
      queryFn: () => getAdminSalesPerformance(startDate, endDate),
      placeholderData: keepPreviousData,
      refetchOnMount: "always",
    }),

  dashboardStats: (period: AdminDashboardPeriod) =>
    queryOptions({
      queryKey: adminKeys.dashboardStats(period),
      queryFn: () => getAdminDashboardStats(period),
      refetchOnMount: "always",
    }),

  dashboardSalesPerformance: (period: AdminDashboardPeriod) =>
    queryOptions({
      queryKey: adminKeys.dashboardSalesPerformance(period),
      queryFn: () => getDashboardSalesPerformance(period),
      refetchOnMount: "always",
    }),
};
