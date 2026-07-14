"use client";

import CompleteContactButton from "@/components/common/buttons/CompleteContactButton";
import EditContactScheduleButton from "@/components/common/buttons/EditContactScheduleButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getInterestBadgeStyle } from "@/lib/utils";
import { DashboardTodayContact } from "@/types/dashboard";
import Link from "next/link";

type Props = {
  contact: DashboardTodayContact;
};

export default function TodayContactCard({ contact }: Props) {
  const company = contact.companies;
  const primaryContact = company.company_contacts[0];

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className={getInterestBadgeStyle(company.interest_level)}>
              {company.interest_level === "high"
                ? "관심도 상"
                : company.interest_level === "medium"
                  ? "관심도 중"
                  : "관심도 하"}
            </Badge>

            <h3 className="text-lg font-semibold">{company.name}</h3>
          </div>

          <p className="text-sm text-muted-foreground">
            담당자: {primaryContact?.name ?? "-"} / {primaryContact?.phone ?? "-"}
          </p>

          <p className="text-sm text-muted-foreground">
            다음 연락일: {formatDate(contact.scheduled_at)}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/companies/${company.id}`}>
            <Button variant="outline">상세보기</Button>
          </Link>

          <EditContactScheduleButton contact={contact} />

          <CompleteContactButton scheduleId={contact.id} />
        </div>
      </CardContent>
    </Card>
  );
}
