import { InterestLevel } from "./common";

export type DashboardTodayContact = {
  id: string;
  scheduled_at: string;
  companies: {
    id: string;
    name: string;
    interest_level: InterestLevel;
    company_contacts: Tables<"company_contacts">[];
  };
};

export type DashboardResponse = {
  myCompanyCount: number;
  todayContactCount: number;
  overdueContactCount: number;
  contractedThisMonthCount: number;

  interestLevelCounts: {
    high: number;
    medium: number;
    low: number;
  };

  todayContacts: DashboardTodayContact[];

  page: number;

  pageSize: number;

  totalPages: number;
};
