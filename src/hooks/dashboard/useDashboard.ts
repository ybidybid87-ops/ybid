import { dashboardQueries } from "@/services/query-options/dashboard";
import { DashboardParams } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useDashboard(params: DashboardParams) {
  return useQuery(dashboardQueries.summary(params));
}
