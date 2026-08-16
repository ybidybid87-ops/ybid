import { DashboardDetailParams } from "@/types/dashboard";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getDashboard, getDashboardDetails } from "../actions/dashboard";
import { dashboardKeys } from "../query-keys";

export const dashboardQueries = {
  summary: (params: { userId: string; page: number; pageSize: number }) =>
    queryOptions({
      queryKey: dashboardKeys.summary(params),

      queryFn: () => getDashboard(params),

      enabled: !!params.userId,

      refetchOnMount: "always",
    }),

  detail: (params: DashboardDetailParams) =>
    queryOptions({
      queryKey: dashboardKeys.detail(params),

      queryFn: () => getDashboardDetails(params),

      placeholderData: keepPreviousData,

      refetchOnMount: "always",
    }),
};
