import { fetcher } from "@/services/fetcher";
import { MonthlySalesRanking } from "@/types/monthly-sales-ranking";

export async function getMonthlySalesRankings() {
  return fetcher<MonthlySalesRanking[]>("/api/monthly-sales-rankings");
}
