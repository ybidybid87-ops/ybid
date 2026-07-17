import {
  ChangeCompanyOwnerRequest,
  ChangeCompanyOwnerResponse,
  CompanyOwnerCandidate,
} from "@/types/company-owner";
import { fetcher } from "../fetcher";

export const companyOwnerApi = {
  getCandidates(companyId: string) {
    return fetcher<CompanyOwnerCandidate[]>(`/api/companies/${companyId}/owner-candidates`);
  },

  change(companyId: string, request: ChangeCompanyOwnerRequest) {
    return fetcher<ChangeCompanyOwnerResponse>(`/api/companies/${companyId}/owner`, {
      method: "PATCH",
      body: JSON.stringify(request),
    });
  },
};
