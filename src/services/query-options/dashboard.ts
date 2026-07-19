import { queryOptions } from "@tanstack/react-query";
import { getDashboard } from "../actions/dashboard";
import { dashboardKeys } from "../query-keys";

export const dashboardQueries = {
  summary: (params: { userId: string; page: number; pageSize: number }) =>
    queryOptions({
      queryKey: dashboardKeys.summary(params),

      queryFn: () => getDashboard(params),

      enabled: !!params.userId,

      refetchOnMount: "always",
    }),
};
