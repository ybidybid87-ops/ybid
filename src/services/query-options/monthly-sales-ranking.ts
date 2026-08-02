import { queryOptions } from "@tanstack/react-query";
import { getMonthlySalesRankings } from "../actions/monthly-sales-ranking/get-monthly-sales-rankings";
import { monthlySalesRankingKeys } from "../query-keys";

export const monthlySalesRankingQueries = {
  list: () =>
    queryOptions({
      queryKey: monthlySalesRankingKeys.list(),
      queryFn: getMonthlySalesRankings,
      refetchInterval: 60000, // 1분
    }),
};
