import { fetcher } from "@/services/fetcher";
import { CompanyListParams, CompanyListResponse } from "@/types/company";

export async function getCompanies(params?: CompanyListParams): Promise<CompanyListResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, String(value));
    }
  });

  return fetcher(`/api/companies?${searchParams.toString()}`);
}
