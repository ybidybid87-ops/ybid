"use client";

import useAdminSalesPerformance from "@/hooks/admin/useAdminSalesPerformance";
import SalesPerformanceTable from "./SalesPerformanceTable";

export default function SalesPerformanceSection() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data, isPending } = useAdminSalesPerformance(year, month);

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">팀원별 영업 현황</h2>

          <p className="mt-1 text-sm text-muted-foreground">팀원별 당월 영업 실적을 확인합니다.</p>

          <p className="mt-2 text-xs text-muted-foreground">
            콜 수는 업체 담당자와 관계없이 실제로 연락 완료 처리한 팀원을 기준으로 집계됩니다.
          </p>
        </div>

        <div className="text-sm font-medium text-muted-foreground">
          {year}년 {month}월
        </div>
      </div>

      <SalesPerformanceTable items={data?.items ?? []} isPending={isPending} />
    </section>
  );
}
