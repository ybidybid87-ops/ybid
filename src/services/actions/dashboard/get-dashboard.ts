import { fetcher } from "@/services/fetcher";
import {
  DashboardDetailParams,
  DashboardDetailResponse,
  DashboardResponse,
} from "@/types/dashboard";

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

export async function getDashboardDetails({
  type,
  scope = "me",
  period,
  startDate,
  endDate,
  page,
  pageSize,
}: DashboardDetailParams): Promise<DashboardDetailResponse> {
  const searchParams = new URLSearchParams({
    type,
    scope,
    page: String(page),
    pageSize: String(pageSize),
  });

  if (period) {
    searchParams.set("period", period);
  }

  if (startDate) {
    searchParams.set("startDate", startDate);
  }

  if (endDate) {
    searchParams.set("endDate", endDate);
  }

  return fetcher(`/api/dashboard/details?${searchParams.toString()}`);
}
