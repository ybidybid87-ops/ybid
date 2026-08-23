import { DashboardDetailType, DashboardResponse } from "@/types/dashboard";
import { BriefcaseBusiness, User, UserRound, Users } from "lucide-react";
import DashboardInterestCard from "./DashboardInterestCard";
import DashboardStatCard from "./DashboardStatCard";

type Props = {
  dashboard?: DashboardResponse;
  selectedDetail?: DashboardDetailType | null;
  onSelectDetail?: (type: DashboardDetailType) => void;
};

export default function DashboardStats({ dashboard, selectedDetail, onSelectDetail }: Props) {
  const stats = [
    {
      type: "companies" as const,
      title: "내 업체 수",
      count: dashboard?.myCompanyCount ?? 0,
      icon: Users,
      color: "text-blue-400",
    },
    {
      type: "contact-schedules" as const,
      title: "오늘 연락",
      count: dashboard?.todayContactCount ?? 0,
      icon: User,
      color: "text-violet-400",
    },
    {
      type: "overdue-contacts" as const,
      title: "지난 연락",
      count: dashboard?.overdueContactCount ?? 0,
      icon: UserRound,
      color: "text-sky-400",
    },
    {
      type: "contracts" as const,
      title: "오늘 계약",
      count: dashboard?.contractedTodayCount ?? 0,
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
        high={dashboard?.interestLevelCounts.high ?? 0}
        medium={dashboard?.interestLevelCounts.medium ?? 0}
        low={dashboard?.interestLevelCounts.low ?? 0}
        selectedDetail={selectedDetail}
        onSelectDetail={onSelectDetail}
      />
    </section>
  );
}
