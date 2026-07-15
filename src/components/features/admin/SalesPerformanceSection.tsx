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

          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p>팀원 이름을 클릭하면 해당 팀원이 담당하고 있는 업체 목록을 확인할 수 있습니다.</p>

            <p>콜 수는 업체 담당자와 관계없이 실제로 연락 완료 처리한 인원이 카운트 됩니다.</p>
            <p>업체 삭제 시 해당 업체의 연락 완료 기록이 함께 삭제되어 콜 수도 감소합니다.</p>
          </div>
        </div>

        <div className="text-sm font-medium text-muted-foreground">
          {year}년 {month}월
        </div>
      </div>

      <SalesPerformanceTable items={data?.items ?? []} isPending={isPending} />
    </section>
  );
}
