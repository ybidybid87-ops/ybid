"use client";

import DateRangeFilter from "@/components/common/DateRangeFilter";
import useAdminSalesPerformance from "@/hooks/admin/useAdminSalesPerformance";
import { DateRange, getThisYearDateRange } from "@/lib/date";
import { useEffect, useState } from "react";
import SalesPerformanceTable from "./SalesPerformanceTable";

export default function SalesPerformanceSection() {
  const [selectedRange, setSelectedRange] = useState<DateRange>(() => getThisYearDateRange());

  const { data, isFetching, refetch } = useAdminSalesPerformance(
    selectedRange.startDate,
    selectedRange.endDate,
  );

  // 팀원별 현황 페이지 진입 시 올해 기준으로 초기화 후 재조회
  useEffect(() => {
    setSelectedRange(getThisYearDateRange());
  }, []);

  const handleSearch = (range: DateRange) => {
    const isSameRange =
      range.startDate === selectedRange.startDate && range.endDate === selectedRange.endDate;

    if (isSameRange) {
      refetch();
      return;
    }

    setSelectedRange(range);
  };

  return (
    <section className="space-y-6">
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>• 담당 업체 수는 선택한 기간에 등록된 미계약 업체를 기준으로 표시됩니다.</p>
        <p>
          • 담당자 연락처 수는 선택한 기간에 등록된 연락처 중 현재 미계약 업체의 연락처를 기준으로
          표시됩니다.
        </p>
        <p>
          • 콜 수는 선택한 기간에 연락 완료 처리된 건 중 현재 미계약 업체의 콜을 기준으로
          집계됩니다.
        </p>
        <p>
          • 계약 건수는 선택한 기간에 계약 완료되었으며 현재 계약 상태인 건을 기준으로 집계됩니다.
        </p>
        <p>• 팀원 이름을 클릭하면 현재 담당 업체를 확인할 수 있습니다.</p>
        <p>• 콜 수는 실제로 연락 완료 처리한 직원에게 집계됩니다.</p>
        <p>
          • 계약 건수는 계약 완료 당시 담당자에게 집계되며, 이후 담당자가 변경되어도 기존 담당자의
          실적으로 유지됩니다.
        </p>
        <p>• 계약을 취소하면 해당 계약 실적에서도 제외됩니다.</p>
        <p>• 업체를 삭제하면 해당 업체의 연락 완료 기록도 삭제되어 콜 수가 감소합니다.</p>
      </div>

      <DateRangeFilter
        value={selectedRange}
        onSearch={handleSearch}
        isLoading={isFetching}
        title="조회 기간"
        description="담당 업체, 담당자 연락처, 콜, 계약 건수에 적용되는 기간입니다."
      />

      <div className="flex items-center justify-end">
        <p className="text-xs text-muted-foreground">선택 기간 기준 순위</p>
      </div>

      <SalesPerformanceTable items={data?.items ?? []} isLoading={isFetching} mode="custom" />
    </section>
  );
}
