"use client";

import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/features/dashboard/DashboardStats";
import MyCompaniesClient from "@/components/features/my-companies/MyCompaniesClient";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import useUser from "@/hooks/user/useUser";

export default function MyCompaniesPage() {
  const { data: user } = useUser();
  const { data: dashboard } = useDashboard({
    userId: String(user?.id),
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  return (
    <div className="space-y-10">
      <PageHeader
        title="내 업체 관리"
        description="내가 담당하고 있는 업체 목록을 확인하고 관리할 수 있습니다."
      />

      <DashboardStats dashboard={dashboard} />

      <MyCompaniesClient />
    </div>
  );
}
