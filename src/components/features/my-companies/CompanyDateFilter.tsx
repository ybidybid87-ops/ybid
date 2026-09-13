"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange, getTodayDateString, getYearDateRange, getYearMonthDateRange } from "@/lib/date";
import { CompanyDateFilterValue } from "@/types/company";
import { useEffect, useState } from "react";

type Props = {
  value: CompanyDateFilterValue;
  onChange: (value: CompanyDateFilterValue) => void;
  isLoading?: boolean;
};

export default function CompanyDateFilter({ value, onChange, isLoading = false }: Props) {
  const currentYear = new Date().getFullYear();
  const today = getTodayDateString();

  const [customRange, setCustomRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (value.type !== "custom") {
      setCustomRange({
        startDate: "",
        endDate: "",
      });
    }
  }, [value.type]);

  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);

  const handleAll = () => {
    onChange({
      type: "all",
    });
  };

  const handleYearChange = (yearValue: string) => {
    const year = Number(yearValue);
    const range = getYearDateRange(year);

    onChange({
      type: "year",
      year,
      startDate: range.startDate,
      endDate: range.endDate > today ? today : range.endDate,
    });
  };

  const handleMonthChange = (monthValue: string) => {
    const year = value.year ?? currentYear;
    const month = Number(monthValue);

    const range = getYearMonthDateRange(year, month);

    if (range.startDate > today) {
      return;
    }

    onChange({
      type: "month",
      year,
      month,
      startDate: range.startDate,
      endDate: range.endDate > today ? today : range.endDate,
    });
  };

  const handleStartDateChange = (startDate: string) => {
    setCustomRange((prev) => ({
      ...prev,
      startDate,
    }));
  };

  const handleEndDateChange = (endDate: string) => {
    setCustomRange((prev) => ({
      ...prev,
      endDate,
    }));
  };

  const handleCustomSearch = () => {
    if (
      !customRange.startDate ||
      !customRange.endDate ||
      customRange.startDate > customRange.endDate
    ) {
      return;
    }

    onChange({
      type: "custom",
      startDate: customRange.startDate,
      endDate: customRange.endDate,
    });
  };

  const isInvalidCustomRange =
    !customRange.startDate || !customRange.endDate || customRange.startDate > customRange.endDate;

  return (
    <div className="flex flex-wrap items-end gap-2">
      <Button
        type="button"
        variant={value.type === "all" ? "default" : "outline"}
        onClick={handleAll}
        disabled={isLoading}
      >
        전체
      </Button>

      <Select
        value={value.year ? String(value.year) : ""}
        onValueChange={handleYearChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="연도" />
        </SelectTrigger>

        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}년
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.month ? String(value.month) : ""}
        onValueChange={handleMonthChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="월" />
        </SelectTrigger>

        <SelectContent>
          {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
            <SelectItem key={month} value={String(month)}>
              {month}월
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-2 flex items-center gap-2">
        <input
          type="date"
          value={customRange.startDate}
          max={customRange.endDate || today}
          disabled={isLoading}
          onChange={(event) => handleStartDateChange(event.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />

        <span className="text-sm text-muted-foreground">~</span>

        <input
          type="date"
          value={customRange.endDate}
          min={customRange.startDate || undefined}
          max={today}
          disabled={isLoading}
          onChange={(event) => handleEndDateChange(event.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Button
          type="button"
          onClick={handleCustomSearch}
          disabled={isLoading || isInvalidCustomRange}
        >
          조회
        </Button>
      </div>
    </div>
  );
}
