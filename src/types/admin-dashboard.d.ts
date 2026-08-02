export type AdminDashboardStatsResponse = {
  companyCount: number;
  todayContactCount: number;
  overdueContactCount: number;
  contractedThisMonthCount: number;

  interestLevelCounts: {
    high: number;
    medium: number;
    low: number;
  };
};
