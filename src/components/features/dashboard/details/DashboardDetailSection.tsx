"use client";

import AppPagination from "@/components/common/AppPagination";
import DateRangeFilter from "@/components/common/DateRangeFilter";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useScrollToTopOnPageChange } from "@/hooks/common/useScrollToTopOnPageChange";
import { useDashboardDetails } from "@/hooks/dashboard/useDashboardDetails";
import {
  DateRange,
  getLastMonthDateRange,
  getThisMonthDateRange,
  getTodayDateString,
  getYesterdayDateString,
} from "@/lib/date";
import { DashboardDetailScope, DashboardDetailType } from "@/types/dashboard";
import { useEffect, useMemo, useRef, useState } from "react";
import DashboardDetailTable from "./DashboardDetailTable";

type Props = {
  type: DashboardDetailType;
  scope?: DashboardDetailScope;
};

const DETAIL_INFO: Record<
  DashboardDetailType,
  {
    title: string;
    description: string;
  }
> = {
  companies: {
    title: "내 담당 업체",
    description: "현재 내가 담당하고 있는 업체를 확인합니다.",
  },

  "contact-schedules": {
    title: "연락 일정",
    description: "선택한 기간의 미완료 연락 일정을 확인합니다.",
  },

  "overdue-contacts": {
    title: "지난 연락 업체",
    description: "예정일이 지났지만 아직 연락 완료되지 않은 업체를 확인합니다.",
  },

  contracts: {
    title: "계약 완료 업체",
    description: "선택한 기간에 계약 완료된 업체를 확인합니다.",
  },

  "interest-high": {
    title: "관심도 상 업체",
    description: "현재 관심도가 상인 담당 업체를 확인합니다.",
  },

  "interest-medium": {
    title: "관심도 중 업체",
    description: "현재 관심도가 중인 담당 업체를 확인합니다.",
  },

  "interest-low": {
    title: "관심도 하 업체",
    description: "현재 관심도가 하인 담당 업체를 확인합니다.",
  },
};

function getInitialDateRange(type: DashboardDetailType): DateRange | null {
  if (type === "contact-schedules") {
    const today = getTodayDateString();

    return {
      startDate: today,
      endDate: today,
    };
  }

  if (type === "contracts") {
    return getThisMonthDateRange();
  }

  return null;
}

export default function DashboardDetailSection({ type, scope = "me" }: Props) {
  const [page, setPage] = useState(1);

  const [selectedRange, setSelectedRange] = useState<DateRange | null>(() =>
    getInitialDateRange(type),
  );

  const sectionRef = useRef<HTMLElement>(null);

  useScrollToTopOnPageChange(sectionRef, page);

  /*
   * 다른 카드를 선택하면
   * 페이지와 해당 카드의 기본 조회 기간을 초기화
   */
  useEffect(() => {
    setPage(1);
    setSelectedRange(getInitialDateRange(type));
  }, [type]);

  const params = useMemo(
    () => ({
      type,
      scope,
      startDate: selectedRange?.startDate,
      endDate: selectedRange?.endDate,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
    [type, scope, selectedRange, page],
  );

  const { data, isFetching } = useDashboardDetails(params);

  const detailInfo = DETAIL_INFO[type];

  const detailTitle = scope === "all" && type === "companies" ? "전체 담당 업체" : detailInfo.title;

  const detailDescription =
    scope === "all" && type === "companies"
      ? "현재 전체 직원이 담당하고 있는 업체를 확인합니다."
      : detailInfo.description;

  const hasDateFilter =
    type === "contact-schedules" || type === "overdue-contacts" || type === "contracts";

  const handleRangeSearch = (range: DateRange) => {
    setPage(1);
    setSelectedRange(range);
  };

  // 평소에는 이번 달 1일~어제, 매월 1일에만 지난달 전체가 기본
  const handleEnableDateFilter = () => {
    const thisMonth = getThisMonthDateRange();
    const yesterday = getYesterdayDateString();

    setPage(1);

    if (thisMonth.startDate > yesterday) {
      setSelectedRange(getLastMonthDateRange());
      return;
    }

    setSelectedRange({
      startDate: thisMonth.startDate,
      endDate: yesterday,
    });
  };

  const handleClearDateFilter = () => {
    setPage(1);
    setSelectedRange(null);
  };

  return (
    <section ref={sectionRef} className="scroll-mt-6 space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{detailTitle}</h2>

          {!isFetching && (
            <span className="text-sm text-muted-foreground">총 {data?.totalCount ?? 0}개</span>
          )}
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{detailDescription}</p>
      </div>

      {hasDateFilter && selectedRange && (
        <div className="space-y-2">
          <DateRangeFilter
            value={selectedRange}
            onSearch={handleRangeSearch}
            isLoading={isFetching}
            title="조회 기간"
            description="조회할 기간을 선택합니다."
            maxDate={
              type === "contact-schedules"
                ? null
                : type === "overdue-contacts"
                  ? getYesterdayDateString()
                  : undefined
            }
          />

          {type === "overdue-contacts" && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isFetching}
                onClick={handleClearDateFilter}
              >
                전체 지난 연락 보기
              </Button>
            </div>
          )}
        </div>
      )}

      {type === "overdue-contacts" && !selectedRange && (
        <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
          <div>
            <p className="text-sm font-semibold">전체 지난 연락</p>

            <p className="mt-1 text-xs text-muted-foreground">
              오늘 이전의 미완료 연락 전체를 표시하고 있습니다.
            </p>
          </div>

          <Button type="button" variant="outline" onClick={handleEnableDateFilter}>
            기간으로 조회
          </Button>
        </div>
      )}

      <DashboardDetailTable
        items={data?.items ?? []}
        type={type}
        scope={scope}
        isLoading={isFetching}
      />

      <AppPagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
    </section>
  );
}
