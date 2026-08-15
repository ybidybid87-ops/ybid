"use client";

import { adminQueries } from "@/services/query-options/admin";
import { useQuery } from "@tanstack/react-query";

export default function useAdminSalesPerformance(startDate: string, endDate: string) {
  return useQuery(adminQueries.salesPerformance(startDate, endDate));
}
