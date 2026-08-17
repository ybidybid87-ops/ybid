import { dashboardQueries } from "@/services/query-options/dashboard";
import { DashboardDetailParams } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useDashboardDetails(params: DashboardDetailParams) {
  return useQuery(dashboardQueries.detail(params));
}
