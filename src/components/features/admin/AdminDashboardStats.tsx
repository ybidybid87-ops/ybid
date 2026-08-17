"use client";

import useAdminDashboardStats from "@/hooks/admin/useAdminDashboardStats";
import { DashboardDetailType } from "@/types/dashboard";
import { BriefcaseBusiness, User, UserRound, Users } from "lucide-react";
import DashboardInterestCard from "../dashboard/DashboardInterestCard";
import DashboardStatCard from "../dashboard/DashboardStatCard";

type Props = {
  selectedDetail?: DashboardDetailType | null;
  onSelectDetail?: (type: DashboardDetailType) => void;
};

export default function AdminDashboardStats({ selectedDetail, onSelectDetail }: Props) {
  const { data } = useAdminDashboardStats();

  const stats = [
    {
      type: "companies" as const,
      title: "전체 업체 수",
      count: data?.companyCount ?? 0,
      icon: Users,
      color: "text-blue-400",
    },
    {
      type: "contact-schedules" as const,
      title: "오늘 연락",
      count: data?.todayContactCount ?? 0,
      icon: User,
      color: "text-violet-400",
    },
    {
      type: "overdue-contacts" as const,
      title: "지난 연락",
      count: data?.overdueContactCount ?? 0,
      icon: UserRound,
      color: "text-sky-400",
    },
    {
      type: "contracts" as const,
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
          key={item.type}
          title={item.title}
          count={item.count}
          icon={item.icon}
          color={item.color}
          isActive={selectedDetail === item.type}
          onClick={onSelectDetail ? () => onSelectDetail(item.type) : undefined}
        />
      ))}

      <DashboardInterestCard
        high={data?.interestLevelCounts.high ?? 0}
        medium={data?.interestLevelCounts.medium ?? 0}
        low={data?.interestLevelCounts.low ?? 0}
        selectedDetail={selectedDetail}
        onSelectDetail={onSelectDetail}
      />
    </section>
  );
}
