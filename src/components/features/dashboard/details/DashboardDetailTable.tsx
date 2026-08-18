"use client";

import Loading from "@/components/common/Loading";
import { Card, CardContent } from "@/components/ui/card";
import { INTEREST_LEVEL_LABELS } from "@/constants/businessData";
import { getKoreaDateKey } from "@/lib/date";
import { getDescendingListNumber } from "@/lib/utils";
import { DashboardDetailItem, DashboardDetailScope, DashboardDetailType } from "@/types/dashboard";
import Link from "next/link";

type Props = {
  items: DashboardDetailItem[];
  type: DashboardDetailType;
  scope?: DashboardDetailScope;
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading?: boolean;
};

export default function DashboardDetailTable({
  items,
  type,
  scope,
  page,
  pageSize,
  totalCount,
  isLoading = false,
}: Props) {
  const showOwner = scope === "all";
  if (isLoading && items.length === 0) {
    return <Loading />;
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          조회된 업체가 없습니다.
        </CardContent>
      </Card>
    );
  }

  const showScheduledAt = type === "contact-schedules" || type === "overdue-contacts";

  const showContractedAt = type === "contracts";

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b">
            <th className="w-16 px-4 py-3 text-center font-medium">번호</th>
            <th className="px-4 py-3 text-left font-medium">업체명</th>

            {showOwner && <th className="px-4 py-3 text-left font-medium">담당 직원</th>}

            <th className="px-4 py-3 text-left font-medium">관심도</th>

            <th className="px-4 py-3 text-left font-medium">업체 담당자</th>

            <th className="px-4 py-3 text-left font-medium">연락처</th>

            {showScheduledAt && <th className="px-4 py-3 text-left font-medium">연락 예정일</th>}

            {showContractedAt && <th className="px-4 py-3 text-left font-medium">계약일</th>}
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr
              key={`${item.companyId}-${item.scheduledAt ?? item.contractedAt ?? index}`}
              className="border-b last:border-b-0"
            >
              <td className="px-4 py-3 text-center text-muted-foreground">
                {getDescendingListNumber({
                  totalCount,
                  page,
                  pageSize,
                  index,
                })}
              </td>
              <td className="px-4 py-3">
                <Link href={`/companies/${item.companyId}`} className="font-medium hover:underline">
                  {item.companyName}
                </Link>
              </td>

              {showOwner && (
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${item.owner.id}/companies`}
                    className="font-medium hover:underline"
                  >
                    {item.owner.name}
                  </Link>
                </td>
              )}

              <td className="px-4 py-3 pl-7">{INTEREST_LEVEL_LABELS[item.interestLevel]}</td>

              <td className="px-4 py-3">{item.primaryContact?.name ?? "-"}</td>

              <td className="px-4 py-3">{item.primaryContact?.phone ?? "-"}</td>

              {showScheduledAt && (
                <td className="px-4 py-3">
                  {item.scheduledAt ? getKoreaDateKey(item.scheduledAt) : "-"}
                </td>
              )}

              {showContractedAt && (
                <td className="px-4 py-3">
                  {item.contractedAt ? getKoreaDateKey(item.contractedAt) : "-"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
