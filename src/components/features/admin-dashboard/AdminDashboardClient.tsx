"use client";

import { DashboardDetailType } from "@/types/dashboard";
import { useState } from "react";
import AdminDashboardStats from "../admin/AdminDashboardStats";
import DashboardDetailSection from "../dashboard/details/DashboardDetailSection";
import AdminTodayContactsSection from "./AdminTodayContactsSection";

export default function AdminDashboardClient() {
  const [selectedDetail, setSelectedDetail] = useState<DashboardDetailType | null>(null);

  const handleSelectDetail = (type: DashboardDetailType) => {
    setSelectedDetail(type);
  };

  return (
    <div className="space-y-10">
      <AdminDashboardStats selectedDetail={selectedDetail} onSelectDetail={handleSelectDetail} />

      <AdminTodayContactsSection />

      {selectedDetail && <DashboardDetailSection type={selectedDetail} scope="all" />}
    </div>
  );
}
