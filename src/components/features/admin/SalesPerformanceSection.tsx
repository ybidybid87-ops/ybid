"use client";

import { Button } from "@/components/ui/button";
import useAdminSalesPerformance from "@/hooks/admin/useAdminSalesPerformance";
import { useState } from "react";
import SalesPerformanceTable from "./SalesPerformanceTable";

function formatDate(year: number, month: number, day: number) {
  return [year, String(month).padStart(2, "0"), String(day).padStart(2, "0")].join("-");
}

function getTodayDate() {
  const now = new Date();

  return formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function getThisMonthRange() {
  const now = new Date();

  return {
    startDate: formatDate(now.getFullYear(), now.getMonth() + 1, 1),
    endDate: getTodayDate(),
  };
}

function getLastMonthRange() {
  const now = new Date();

  const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const lastDayOfLastMonth = new Date(firstDayOfThisMonth);

  lastDayOfLastMonth.setDate(0);

  return {
    startDate: formatDate(lastDayOfLastMonth.getFullYear(), lastDayOfLastMonth.getMonth() + 1, 1),
    endDate: formatDate(
      lastDayOfLastMonth.getFullYear(),
      lastDayOfLastMonth.getMonth() + 1,
      lastDayOfLastMonth.getDate(),
    ),
  };
}

type DateRange = {
  startDate: string;
  endDate: string;
};

export default function SalesPerformanceSection() {
  const initialRange = getThisMonthRange();

  // 날짜 입력창에서 변경 중인 값
  const [dateRange, setDateRange] = useState<DateRange>(initialRange);

  // 실제 API 조회에 사용되는 기간
  const [selectedRange, setSelectedRange] = useState<DateRange>(initialRange);

  const { data, isFetching, refetch } = useAdminSalesPerformance(
    selectedRange.startDate,
    selectedRange.endDate,
  );

  const applyRange = (range: DateRange) => {
    setDateRange(range);

    const isSameRange =
      range.startDate === selectedRange.startDate && range.endDate === selectedRange.endDate;

    if (isSameRange) {
      refetch();
      return;
    }

    setSelectedRange(range);
  };

  const handleThisMonth = () => {
    applyRange(getThisMonthRange());
  };

  const handleLastMonth = () => {
    applyRange(getLastMonthRange());
  };

  const handleSearch = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return;
    }

    if (dateRange.startDate > dateRange.endDate) {
      return;
    }

    applyRange(dateRange);
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

      <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border bg-muted/20 p-4">
        <div>
          <p className="text-sm font-semibold">실적 조회 기간</p>

          <p className="mt-1 text-xs text-muted-foreground">
            콜 수와 계약 건수에 적용되는 기간입니다.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <Button type="button" variant="outline" onClick={handleThisMonth} disabled={isFetching}>
            이번 달
          </Button>

          <Button type="button" variant="outline" onClick={handleLastMonth} disabled={isFetching}>
            지난 달
          </Button>

          <div className="ml-2 flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              max={dateRange.endDate}
              disabled={isFetching}
              onChange={(event) =>
                setDateRange((prev) => ({
                  ...prev,
                  startDate: event.target.value,
                }))
              }
              className="h-9 rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />

            <span className="text-sm text-muted-foreground">~</span>

            <input
              type="date"
              value={dateRange.endDate}
              min={dateRange.startDate}
              max={getTodayDate()}
              disabled={isFetching}
              onChange={(event) =>
                setDateRange((prev) => ({
                  ...prev,
                  endDate: event.target.value,
                }))
              }
              className="h-9 rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />

            <Button
              type="button"
              onClick={handleSearch}
              disabled={
                isFetching ||
                !dateRange.startDate ||
                !dateRange.endDate ||
                dateRange.startDate > dateRange.endDate
              }
            >
              {isFetching ? "조회 중..." : "조회"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {selectedRange.startDate} ~ {selectedRange.endDate}
        </p>

        <p className="text-xs text-muted-foreground">선택 기간 기준 순위</p>
      </div>

      <SalesPerformanceTable items={data?.items ?? []} isLoading={isFetching} />
    </section>
  );
}
