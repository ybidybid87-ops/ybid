"use client";

import useDashboardSalesPerformance from "@/hooks/admin/useDashboardSalesPerformance";
import { AdminDashboardPeriod } from "@/types/admin-dashboard";
import SalesPerformanceTable from "../admin/SalesPerformanceTable";

type Props = {
  period: AdminDashboardPeriod;
};

export default function DashboardSalesPerformanceSection({ period }: Props) {
  const { data, isFetching } = useDashboardSalesPerformance(period);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">팀원별 영업 현황</h2>
          <p className="mt-1 text-sm text-muted-foreground">이번 달 기준 팀원별 영업 현황입니다.</p>
        </div>

        <p className="text-xs text-muted-foreground">이번 달 기준 순위</p>
      </div>

      <SalesPerformanceTable items={data?.items ?? []} isLoading={isFetching} mode="month" />
    </section>
  );
}
