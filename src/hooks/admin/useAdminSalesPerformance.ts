"use client";

import { adminQueries } from "@/services/query-options/admin";
import { useQuery } from "@tanstack/react-query";

export default function useAdminSalesPerformance(year: number, month: number) {
  return useQuery(adminQueries.salesPerformance(year, month));
}

/* 사용법
const { data, isPending, isError } =
  useAdminSalesPerformance(2026, 7); */

/* 응답예시
  {
  year: 2026,
  month: 7,
  items: [
    {
      rank: 1,
      userId: "user-id-1",
      name: "김영업",
      companyCount: 45,
      contactCount: 62,
      callCount: 32,
      contractCount: 5,
    },
  ];
} */
