"use client";

import { DashboardDetailType } from "@/types/dashboard";
import { useEffect, useRef, useState } from "react";
import AdminDashboardStats from "../admin/AdminDashboardStats";
import DashboardDetailSection from "../dashboard/details/DashboardDetailSection";
import AdminTodayContactsSection from "./AdminTodayContactsSection";

export default function AdminDashboardClient() {
  const [selectedDetail, setSelectedDetail] = useState<DashboardDetailType | null>(null);

  const detailSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedDetail) {
      return;
    }

    detailSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedDetail]);

  const handleSelectDetail = (type: DashboardDetailType) => {
    if (selectedDetail === type) {
      detailSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    setSelectedDetail(type);
  };

  return (
    <div className="space-y-10">
      <AdminDashboardStats selectedDetail={selectedDetail} onSelectDetail={handleSelectDetail} />

      <AdminTodayContactsSection />

      {selectedDetail && (
        <div ref={detailSectionRef} className="scroll-mt-6">
          <DashboardDetailSection type={selectedDetail} scope="all" />
        </div>
      )}
    </div>
  );
}
