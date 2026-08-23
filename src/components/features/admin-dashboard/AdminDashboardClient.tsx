"use client";

import { AdminDashboardPeriod } from "@/types/admin-dashboard";
import { DashboardDetailType } from "@/types/dashboard";
import { useState } from "react";
import AdminDashboardStats from "../admin/AdminDashboardStats";
import DashboardDetailSection from "../dashboard/details/DashboardDetailSection";
import AdminTodayContactsSection from "./AdminTodayContactsSection";

type Props = {
  period: AdminDashboardPeriod;
};

export default function AdminDashboardClient({ period }: Props) {
  const [selectedDetail, setSelectedDetail] = useState<DashboardDetailType | null>(null);

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

      <AdminTodayContactsSection />

      {selectedDetail && (
        <DashboardDetailSection type={selectedDetail} scope="all" period={period} />
      )}
    </div>
  );
}
