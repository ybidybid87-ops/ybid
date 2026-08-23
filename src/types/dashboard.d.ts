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

export type DashboardMode = "today" | "management";

export type DashboardParams = {
  userId: string;
  page: number;
  pageSize: number;
  mode?: DashboardMode;
};

export type DashboardResponse = {
  myCompanyCount: number;
  todayContactCount: number;
  overdueContactCount: number;
  contractCount: number;
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

/* -----------------대시보드 디테일----------------- */

/* 
| type               | 조회 기준              | 날짜 필터 |
| ------------------ | ------------------ | ----- |
| `companies`        | 현재 내가 담당하는 모든 업체   | X     |
| `contact-schedules` | 선택 기간의 미완료 연락 일정   | O     |
| `overdue-contacts` | 선택 기간 중 미완료된 지난 연락 | O     |
| `contracts`        | 선택 기간에 계약 완료된 업체   | O     |
| `interest-high`    | 현재 관심도 `high` 업체   | X     |
| `interest-medium`  | 현재 관심도 `medium` 업체 | X     |
| `interest-low`     | 현재 관심도 `low` 업체    | X     |
 */

export type DashboardDetailScope = "me" | "all";

export type DashboardDetailPeriod = "today" | "month" | "all";

export type DashboardDetailType =
  | "companies"
  | "contact-schedules"
  | "overdue-contacts"
  | "contracts"
  | "interest-high"
  | "interest-medium"
  | "interest-low";

export type DashboardPeriod = "today" | "month" | "all";

export type DashboardDetailParams = {
  type: DashboardDetailType;
  scope?: DashboardDetailScope;
  period?: DashboardDetailPeriod;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
};

export type DashboardDetailItem = {
  companyId: string;
  companyName: string;
  interestLevel: InterestLevel;

  owner: {
    id: string;
    name: string;
  };

  primaryContact: {
    id: string;
    name: string | null;
    phone: string;
  } | null;

  scheduledAt?: string;
  contractedAt?: string;
};

export type DashboardDetailResponse = {
  items: DashboardDetailItem[];

  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
