export const CACHE_TAGS = {
  ME: "me",

  companies: "companies",

  company: (companyId: string) => `company:${companyId}`,

  contactHistories: (companyId: string) => `contact-histories:${companyId}`,

  contactSchedules: "contact-schedules",

  contactScheduleCalendar: "contact-schedule-calendar",

  contractsMonthly: "contracts-monthly",

  dashboard: (userId: string) => `dashboard:${userId}`,

  monthlySalesRankings: "monthly-sales-rankings",

  notifications: (userId: string) => `notifications:${userId}`,
} as const;
