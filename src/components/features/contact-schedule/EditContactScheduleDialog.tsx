"use client";

import { Building2, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { EditableContactSchedule } from "@/components/common/buttons/EditContactScheduleButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUpdateCompany from "@/hooks/companies/useUpdateCompany";
import useCreateContactSchedule from "@/hooks/contact-schedule/useCreateContactSchedule";
import useUpdateContactSchedule from "@/hooks/contact-schedule/useUpdateContactSchedule";
import { getInterestBadgeStyle } from "@/lib/utils";
import { InterestLevel } from "@/types/common";
import { format } from "date-fns";
import Link from "next/link";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: EditableContactSchedule;
};

export default function EditContactScheduleDialog({ open, onOpenChange, contact }: Props) {
  const { mutateAsync: updateSchedule, isPending: isUpdating } = useUpdateContactSchedule();

  const { mutateAsync: createSchedule, isPending: isCreating } = useCreateContactSchedule();

  const { mutateAsync: updateCompany, isPending: isUpdatingCompany } = useUpdateCompany();

  const isPending = isUpdating || isCreating || isUpdatingCompany;

  const company = contact.companies;

  const primaryContact = company.company_contacts[0];

  const [scheduledAt, setScheduledAt] = useState(contact.scheduled_at?.slice(0, 10) ?? "");
  const [memo, setMemo] = useState("");

  const [interestLevel, setInterestLevel] = useState<InterestLevel>(company.interest_level);

  useEffect(() => {
    if (!open) {
      return;
    }

    setScheduledAt(contact.scheduled_at?.slice(0, 10) ?? "");
    setInterestLevel(company.interest_level);
    setMemo("");
  }, [open, contact, company.interest_level]);

  const originalScheduledAt = contact.scheduled_at?.slice(0, 10) ?? "";

  const isScheduleChanged = scheduledAt !== originalScheduledAt;

  const isInterestLevelChanged = interestLevel !== company.interest_level;

  const hasChanges = isScheduleChanged || isInterestLevelChanged;

  const handleSave = async () => {
    if (!hasChanges) {
      return;
    }

    try {
      const mutations: Promise<unknown>[] = [];

      if (isInterestLevelChanged) {
        mutations.push(
          updateCompany({
            companyId: company.id,
            input: {
              interestLevel,
            },
          }),
        );
      }

      if (isScheduleChanged) {
        if (!scheduledAt) {
          return;
        }

        if (contact.id) {
          mutations.push(
            updateSchedule({
              scheduleId: contact.id,
              input: {
                scheduledAt,
                memo: memo || undefined,
              },
            }),
          );
        } else {
          mutations.push(
            createSchedule({
              companyId: company.id,
              scheduledAt,
              memo: memo || undefined,
            }),
          );
        }
      }

      await Promise.all(mutations);

      onOpenChange(false);
    } catch (error) {
      console.error("업체 정보 변경 실패:", error);
    }
  };

  const today = format(new Date(), "yyyy-MM-dd");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value < today) {
      return;
    }

    setScheduledAt(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl rounded-3xl shadow-2xl border-none p-0">
        <DialogHeader className="border-b px-8 py-6">
          <DialogTitle className="text-3xl font-bold">연락 일정 변경</DialogTitle>

          <DialogDescription className="mt-2">
            해당 업체의 연락 예정 일정을 변경합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 px-8 py-8">
          {/* 업체 정보 */}
          <div className="flex items-center gap-6 rounded-2xl border p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h3 className="text-xl font-bold">{company.name}</h3>

                <Badge className={getInterestBadgeStyle(company.interest_level)}>
                  {company.interest_level === "high"
                    ? "관심도 상"
                    : company.interest_level === "medium"
                      ? "관심도 중"
                      : "관심도 하"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                담당자 : {primaryContact?.name ?? "-"}
              </p>

              <p className="text-sm text-muted-foreground">
                연락처 : {primaryContact?.phone ?? "-"}
              </p>

              <p className="text-sm text-muted-foreground">
                콜 수 : {company.contact_count ?? 0}회
              </p>
            </div>
          </div>

          {/* 관심도 */}
          <div className="flex gap-8">
            <label className="w-28 pt-3 text-sm font-semibold">관심도</label>

            <div className="flex-1">
              <Select
                value={interestLevel}
                onValueChange={(value) => setInterestLevel(value as InterestLevel)}
                disabled={isPending}
              >
                <SelectTrigger className="h-14 w-full rounded-xl">
                  <SelectValue placeholder="관심도를 선택해주세요." />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="high">상</SelectItem>
                  <SelectItem value="medium">중</SelectItem>
                  <SelectItem value="low">하</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 연락 예정일 */}
          <div className="flex gap-8">
            <label className="w-28 pt-3 text-sm font-semibold">연락 예정일</label>

            <div className="flex-1">
              <div className="relative">
                <CalendarIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="date"
                  min={today}
                  value={scheduledAt}
                  onChange={handleDateChange}
                  className="h-14 rounded-xl pl-12 text-base"
                />
              </div>

              <p className="mt-2 text-sm text-muted-foreground">달력에서 날짜를 선택해주세요.</p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-between pt-2">
            <Button asChild variant="outline" size="lg">
              <Link href={`/companies/${company.id}`}>업체 상세 보기</Link>
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
                취소
              </Button>

              <Button size="lg" onClick={handleSave} disabled={isPending || !hasChanges}>
                {isPending ? "저장 중..." : "저장"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
