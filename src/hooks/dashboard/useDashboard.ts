import { dashboardQueries } from "@/services/query-options/dashboard";
import { useQuery } from "@tanstack/react-query";

type DashboardParams = {
  userId: string;
  page: number;
  pageSize: number;
};

export function useDashboard(params: DashboardParams) {
  return useQuery(dashboardQueries.summary(params));
}
