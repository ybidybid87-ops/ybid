export type AdminDashboardPeriod = "all" | "month";

export type AdminDashboardStatsResponse = {
  companyCount: number;
  todayContactCount: number;
  overdueContactCount: number;
  contractCount: number;
  interestLevelCounts: {
    high: number;
    medium: number;
    low: number;
  };
};
