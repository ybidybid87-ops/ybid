"use client";

import { AdminDashboardPeriod } from "@/types/admin-dashboard";
import { DashboardDetailType } from "@/types/dashboard";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import AdminDashboardStats from "../admin/AdminDashboardStats";
import DashboardDetailSection from "../dashboard/details/DashboardDetailSection";
import DashboardSalesPerformanceSection from "./DashboardSalesPerformanceSection";

type Props = {
  period: AdminDashboardPeriod;
};

export default function AdminDashboardClient({ period }: Props) {
  const pathname = usePathname();

  const [selectedDetail, setSelectedDetail] = useState<DashboardDetailType | null>(null);

  useEffect(() => {
    setSelectedDetail(null);
  }, [pathname]);

  const handleSelectDetail = (type: DashboardDetailType) => {
    setSelectedDetail(type);
  };

  return (
    <div className="space-y-10">
      <AdminDashboardStats
        period={period}
        selectedDetail={selectedDetail}
        onSelectDetail={handleSelectDetail}
      />

      {selectedDetail && (
        <DashboardDetailSection type={selectedDetail} scope="all" period={period} />
      )}

      <DashboardSalesPerformanceSection period={period} />
    </div>
  );
}
