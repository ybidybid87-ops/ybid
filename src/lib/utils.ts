import { Prisma, users } from "@/generated/prisma/client";
import { CreateCompanyFormValues } from "@/schemas/companySchema";
import { InterestLevel } from "@/types/common";
import { CompanyDetail } from "@/types/company-detail";
import { Tables } from "@/types/database.types";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./permissions/company";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 캐시키 배열을 문자열로 변환
export const cacheCore = {
  fromKey: (key: readonly (string | number)[]) => key.join(":"),
};

/* 쿼리키에서 undefined나 null 제거하는 함수 */
export function safeKey(...args: (string | number | undefined | null)[]) {
  return args
    .filter((v): v is string | number => v !== undefined && v !== null)
    .map((v) => String(v));
}

/* 관심도에 따른 뱃지 색 변경 */
export const getInterestBadgeStyle = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200";

    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200";

    case "low":
      return "bg-slate-100 text-slate-600 border-slate-200";

    default:
      return "";
  }
};

/* 관심도에 따른 글자색 변경 */
export function getInterestTextStyle(priority: InterestLevel) {
  switch (priority) {
    case "high":
      return "text-red-700";

    case "medium":
      return "text-amber-700";

    case "low":
      return "text-slate-600";

    default:
      return "";
  }
}

/* 권한체크 함수들 */
export function isAdmin(role: UserRole) {
  return role === "admin";
}

export function isLeader(role: UserRole) {
  return role === "leader";
}

export function isMember(role: UserRole) {
  return role === "member";
}

/* 영업왕 수정 가능 여부 */
export function canManageTopSales(role: UserRole) {
  return role === "admin" || role === "leader";
}

/* 업체 관리 권한
member → 본인 담당 업체만 수정/삭제/계약 처리 가능
leader/admin → 모든 업체 수정/삭제/계약 처리 가능
*/
export function canEditCompany(
  currentUser: Pick<users, "id" | "role">,
  ownerUser: Pick<users, "id">,
) {
  if (currentUser.role === "admin" || currentUser.role === "leader") {
    return true;
  }

  return currentUser.id === ownerUser.id;
}

/* 업체 조회 범위 */
export function getCompanyScope(currentUser: users): Prisma.companiesWhereInput {
  if (currentUser.role === "admin") {
    return {};
  }

  if (currentUser.role === "leader") {
    return {
      team_id: currentUser.team_id,
    };
  }

  return {
    owner_id: currentUser.id,
  };
}

/* 날짜 포맷 함수 */
export function formatDate(date: string | Date) {
  return format(new Date(date), "yyyy.MM.dd");
}

/* DB Date -> input[type=date] 값 변환 */
export function formatDateInput(date: string | Date) {
  if (typeof date === "string") {
    return date.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

/* 수정/등록 페이지 폼 초기값 변환 함수 */
export function toCompanyFormValues(company: CompanyDetail): CreateCompanyFormValues {
  return {
    name: company.name,

    ceoName: company.ceo_name ?? "",
    ceoPhone: company.ceo_phone ?? "",

    region: company.region ?? "",

    faxNumber: company.fax_number ?? "",

    contacts: company.company_contacts.map((contact) => ({
      id: contact.id,
      name: contact.name ?? "",
      phone: contact.phone,
    })),

    interestLevel: company.interest_level,

    salesStatus: company.sales_status as CreateCompanyFormValues["salesStatus"],

    scheduledAt: company.contact_schedules[0]?.scheduled_at
      ? formatDateInput(company.contact_schedules[0].scheduled_at)
      : "",

    memo: company.memo ?? "",

    businessLicenses: company.business_licenses.map(
      (license: Tables<"company_business_licenses">) => ({
        businessGroup: license.business_group,
        businessType: license.business_type,
        specialtyType: license.specialty_type ?? "",
        isPrimary: license.is_primary,
      }),
    ),
  };
}

/* 페이지네이션 목록의 내림차순 번호 계산 */
export function getDescendingListNumber({
  totalCount,
  page,
  pageSize,
  index,
}: {
  totalCount: number;
  page: number;
  pageSize: number;
  index: number;
}) {
  return totalCount - (page - 1) * pageSize - index;
}
