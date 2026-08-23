"use client";

import AppPagination from "@/components/common/AppPagination";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDashboardDetails } from "@/hooks/dashboard/useDashboardDetails";
import { getTodayDateString } from "@/lib/date";
import { useMemo, useState } from "react";
import DashboardDetailTable from "../dashboard/details/DashboardDetailTable";

export default function AdminTodayContactsSection() {
  const [page, setPage] = useState(1);

  const [today] = useState(() => getTodayDateString());

  const params = useMemo(
    () => ({
      type: "contact-schedules" as const,
      scope: "all" as const,
      startDate: today,
      endDate: today,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
    [today, page],
  );

  const { data, isFetching } = useDashboardDetails(params);

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">오늘 연락해야 할 업체</h2>

          {!isFetching && (
            <span className="text-sm text-muted-foreground">총 {data?.totalCount ?? 0}개</span>
          )}
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          오늘 연락 예정인 전체 직원의 미완료 업체를 확인합니다.
        </p>
      </div>

      <DashboardDetailTable
        items={data?.items ?? []}
        type="contact-schedules"
        scope="all"
        page={page}
        pageSize={DEFAULT_PAGE_SIZE}
        totalCount={data?.totalCount ?? 0}
        isLoading={isFetching}
      />

      <AppPagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
    </section>
  );
}
