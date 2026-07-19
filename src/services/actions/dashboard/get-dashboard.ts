import { fetcher } from "@/services/fetcher";
import { DashboardResponse } from "@/types/dashboard";

type DashboardParams = {
  userId: string;
  page: number;
  pageSize: number;
};

export async function getDashboard({
  userId,
  page,
  pageSize,
}: DashboardParams): Promise<DashboardResponse> {
  const searchParams = new URLSearchParams({
    userId,
    page: String(page),
    pageSize: String(pageSize),
  });

  return fetcher(`/api/dashboard?${searchParams.toString()}`);
}
