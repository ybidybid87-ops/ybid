// src/types/admin-sales-performance.d.ts

export type AdminSalesPerformanceItem = {
  rank: number;
  userId: string;
  name: string;

  // 현재 보유 현황
  companyCount: number;
  contactCount: number;

  // 선택한 기간의 실적
  callCount: number;
  contractCount: number;
};

export type AdminSalesPerformanceResponse = {
  startDate: string;
  endDate: string;
  items: AdminSalesPerformanceItem[];
};
