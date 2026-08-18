"use client";

import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/features/dashboard/DashboardStats";
import DashboardDetailSection from "@/components/features/dashboard/details/DashboardDetailSection";
import TodayContactsSection from "@/components/features/dashboard/TodayContactsSection";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import useUser from "@/hooks/user/useUser";
import { DashboardDetailType } from "@/types/dashboard";
import { useState } from "react";

export default function DashboardPage() {
  const [page, setPage] = useState(1);

  const [selectedDetail, setSelectedDetail] = useState<DashboardDetailType | null>(null);

  const { data: user } = useUser();

  const { data: dashboard, isLoading } = useDashboard({
    userId: String(user?.id),
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const handleSelectDetail = (type: DashboardDetailType) => {
    setSelectedDetail(type);
  };

  return (
    <div className="space-y-10">
      <PageHeader title="대시보드" description="오늘 해야 할 영업 업무를 확인합니다." />

      <DashboardStats
        dashboard={dashboard}
        selectedDetail={selectedDetail}
        onSelectDetail={handleSelectDetail}
      />

      <TodayContactsSection
        contacts={dashboard?.todayContacts ?? []}
        page={page}
        totalPages={dashboard?.totalPages ?? 0}
        onPageChange={setPage}
        isLoading={isLoading}
      />

      {selectedDetail && <DashboardDetailSection type={selectedDetail} />}
    </div>
  );
}
