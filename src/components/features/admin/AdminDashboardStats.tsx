"use client";

import useAdminDashboardStats from "@/hooks/admin/useAdminDashboardStats";
import { BriefcaseBusiness, User, UserRound, Users } from "lucide-react";
import DashboardInterestCard from "../dashboard/DashboardInterestCard";
import DashboardStatCard from "../dashboard/DashboardStatCard";

export default function AdminDashboardStats() {
  const { data } = useAdminDashboardStats();

  const stats = [
    {
      title: "전체 업체 수",
      count: data?.companyCount ?? 0,
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "오늘 연락",
      count: data?.todayContactCount ?? 0,
      icon: User,
      color: "text-violet-400",
    },
    {
      title: "지난 연락",
      count: data?.overdueContactCount ?? 0,
      icon: UserRound,
      color: "text-sky-400",
    },
    {
      title: "이번 달 계약",
      count: data?.contractedThisMonthCount ?? 0,
      icon: BriefcaseBusiness,
      color: "text-emerald-400",
    },
  ];

  return (
    <section className="grid grid-cols-5 gap-4">
      {stats.map((item) => (
        <DashboardStatCard
          key={item.title}
          title={item.title}
          count={item.count}
          icon={item.icon}
          color={item.color}
        />
      ))}

      <DashboardInterestCard
        high={data?.interestLevelCounts.high ?? 0}
        medium={data?.interestLevelCounts.medium ?? 0}
        low={data?.interestLevelCounts.low ?? 0}
      />
    </section>
  );
}
