import { monthlySalesRankingQueries } from "@/services/query-options/monthly-sales-ranking";
import { useQuery } from "@tanstack/react-query";

export default function useMonthlySalesRankings() {
  return useQuery(monthlySalesRankingQueries.list());
}
