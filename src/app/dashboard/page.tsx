"use client";

import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/features/dashboard/DashboardStats";
import TodayContactsSection from "@/components/features/dashboard/TodayContactsSection";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import useUser from "@/hooks/user/useUser";
import { useState } from "react";

export default function DashboardPage() {
  const [page, setPage] = useState(1);

  const { data: user } = useUser();

  const { data: dashboard, isLoading } = useDashboard({
    userId: String(user?.id),
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  return (
    <div className="space-y-10">
      <PageHeader title="대시보드" description="오늘 해야 할 영업 업무를 확인합니다." />

      <DashboardStats dashboard={dashboard} />

      <TodayContactsSection
        contacts={dashboard?.todayContacts ?? []}
        page={page}
        totalPages={dashboard?.totalPages ?? 0}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
