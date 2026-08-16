"use client";

import { Button } from "@/components/ui/button";
import {
  DateRange,
  getFullThisMonthDateRange,
  getLastMonthDateRange,
  getThisMonthDateRange,
  getTodayDateString,
} from "@/lib/date";
import { useEffect, useState } from "react";

type Props = {
  value: DateRange;
  onSearch: (range: DateRange) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  maxDate?: string | null;
};

export default function DateRangeFilter({
  value,
  onSearch,
  isLoading = false,
  title = "조회 기간",
  description,
  maxDate = getTodayDateString(),
}: Props) {
  const [dateRange, setDateRange] = useState<DateRange>(value);

  useEffect(() => {
    setDateRange(value);
  }, [value]);

  const applyRange = (range: DateRange) => {
    setDateRange(range);
    onSearch(range);
  };

  const getRangeWithinMaxDate = (range: DateRange): DateRange | null => {
    if (!maxDate) {
      return range;
    }

    // 기간 전체가 조회 가능한 최대 날짜보다 미래라면 적용하지 않음
    if (range.startDate > maxDate) {
      return null;
    }

    return {
      startDate: range.startDate,
      endDate: range.endDate > maxDate ? maxDate : range.endDate,
    };
  };

  const handleThisMonth = () => {
    const thisMonthRange = maxDate === null ? getFullThisMonthDateRange() : getThisMonthDateRange();

    const range = getRangeWithinMaxDate(thisMonthRange);

    if (!range) {
      return;
    }

    applyRange(range);
  };

  const handleLastMonth = () => {
    const range = getRangeWithinMaxDate(getLastMonthDateRange());

    if (!range) {
      return;
    }

    applyRange(range);
  };

  const handleSearch = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return;
    }

    if (dateRange.startDate > dateRange.endDate) {
      return;
    }

    onSearch(dateRange);
  };

  const isInvalidRange =
    !dateRange.startDate || !dateRange.endDate || dateRange.startDate > dateRange.endDate;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border bg-muted/20 p-4">
        <div>
          <p className="text-sm font-semibold">{title}</p>

          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <Button type="button" variant="outline" onClick={handleThisMonth} disabled={isLoading}>
            이번 달
          </Button>

          <Button type="button" variant="outline" onClick={handleLastMonth} disabled={isLoading}>
            지난 달
          </Button>

          <div className="ml-2 flex items-center gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              max={
                dateRange.endDate
                  ? maxDate
                    ? dateRange.endDate < maxDate
                      ? dateRange.endDate
                      : maxDate
                    : dateRange.endDate
                  : (maxDate ?? undefined)
              }
              disabled={isLoading}
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
              max={maxDate ?? undefined}
              disabled={isLoading}
              onChange={(event) =>
                setDateRange((prev) => ({
                  ...prev,
                  endDate: event.target.value,
                }))
              }
              className="h-9 rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            />

            <Button type="button" onClick={handleSearch} disabled={isLoading || isInvalidRange}>
              {isLoading ? "조회 중..." : "조회"}
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm font-medium">
        {value.startDate} ~ {value.endDate}
      </p>
    </div>
  );
}
