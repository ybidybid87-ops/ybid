export type AdminSalesPerformanceItem = {
  rank: number;
  userId: string;
  name: string;

  // 현재 보유 현황
  companyCount: number;
  contactCount: number;

  // 선택한 월의 실적
  callCount: number;
  contractCount: number;
};

export type AdminSalesPerformanceResponse = {
  year: number;
  month: number;
  items: AdminSalesPerformanceItem[];
};
