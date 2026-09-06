export type UpdateCompanyContractRequest = {
  action: "complete" | "cancel";
  memo?: string;
  contractedAt?: string;
  contractDurationDays?: number;
};

export type MonthlyContractParams = {
  year: number;
  month: number;
};
