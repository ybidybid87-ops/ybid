import { queryOptions } from "@tanstack/react-query";
import { getAdminSalesPerformance } from "../actions/admin/admin";
import { adminKeys } from "../query-keys";

export const adminQueries = {
  salesPerformance: (year: number, month: number) =>
    queryOptions({
      queryKey: adminKeys.salesPerformance(year, month),
      queryFn: () => getAdminSalesPerformance(year, month),
    }),
};
