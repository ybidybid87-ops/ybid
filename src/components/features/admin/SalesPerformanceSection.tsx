"use client";

import DateRangeFilter from "@/components/common/DateRangeFilter";
import useAdminSalesPerformance from "@/hooks/admin/useAdminSalesPerformance";
import { DateRange, getThisMonthDateRange } from "@/lib/date";
import { useState } from "react";
import SalesPerformanceTable from "./SalesPerformanceTable";

export default function SalesPerformanceSection() {
  // 실제 API 조회에 사용되는 기간
  const [selectedRange, setSelectedRange] = useState<DateRange>(() => getThisMonthDateRange());

  const { data, isFetching, refetch } = useAdminSalesPerformance(
    selectedRange.startDate,
    selectedRange.endDate,
  );

  const handleSearch = (range: DateRange) => {
    const isSameRange =
      range.startDate === selectedRange.startDate && range.endDate === selectedRange.endDate;

    // 현재 조회 중인 기간과 같다면 Query Key가 바뀌지 않으므로 직접 재조회
    if (isSameRange) {
      refetch();
      return;
    }

    // 기간이 변경되면 Query Key가 변경되면서 자동으로 새로운 데이터를 조회
    setSelectedRange(range);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">팀원별 영업 현황</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          현재 담당 현황과 선택한 기간의 영업 실적을 확인합니다.
        </p>

        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <p>• 담당 업체 수와 담당자 연락처 수는 현재 보유 현황을 기준으로 표시됩니다.</p>

          <p>• 콜 수와 계약 건수는 선택한 기간을 기준으로 집계됩니다.</p>

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
        </div>
      </div>

      <DateRangeFilter
        value={selectedRange}
        onSearch={handleSearch}
        isLoading={isFetching}
        title="실적 조회 기간"
        description="콜 수와 계약 건수에 적용되는 기간입니다."
      />

      <div className="flex items-center justify-end">
        <p className="text-xs text-muted-foreground">선택 기간 기준 순위</p>
      </div>

      <SalesPerformanceTable items={data?.items ?? []} isLoading={isFetching} />
    </section>
  );
}
