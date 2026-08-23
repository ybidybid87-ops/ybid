"use client";

import useDashboardSalesPerformance from "@/hooks/admin/useDashboardSalesPerformance";
import { AdminDashboardPeriod } from "@/types/admin-dashboard";
import SalesPerformanceTable from "../admin/SalesPerformanceTable";

type Props = {
  period: AdminDashboardPeriod;
};

export default function DashboardSalesPerformanceSection({ period }: Props) {
  const { data, isFetching } = useDashboardSalesPerformance(period);

  const isAll = period === "all";

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">팀원별 영업 현황</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isAll
                ? "전체 누적 영업 실적을 기준으로 팀원별 현황을 확인합니다."
                : "이번 달 영업 실적을 기준으로 팀원별 현황을 확인합니다."}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            {isAll ? "전체 누적 기준 순위" : "이번 달 기준 순위"}
          </p>
        </div>

        {/* <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <p>• 담당 업체 수와 담당자 연락처 수는 현재 보유 현황을 기준으로 표시됩니다.</p>
          <p>• 콜 수와 계약 건수는 {isAll ? "전체 누적 기간" : "이번 달"}을 기준으로 집계됩니다.</p>
          <p>• 팀원 이름을 클릭하면 현재 담당 업체를 확인할 수 있습니다.</p>
          <p>• 콜 수는 실제로 연락 완료 처리한 직원에게 집계됩니다.</p>
          <p>
            • 계약 건수는 계약 완료 당시 담당자에게 집계되며, 이후 담당자가 변경되어도 기존 담당자의
            실적으로 유지됩니다.
          </p>
          <p>
            • 계약 완료된 업체는 계약 취소 후 삭제할 수 있으며, 계약을 취소하면 해당 계약 실적에서도
            제외됩니다.
          </p>
          <p>• 업체를 삭제하면 해당 업체의 연락 완료 기록도 삭제되어 콜 수가 감소합니다.</p>
        </div> */}
      </div>

      <SalesPerformanceTable items={data?.items ?? []} isLoading={isFetching} />
    </section>
  );
}
