"use client";

import CompleteContactButton from "@/components/common/buttons/CompleteContactButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INTEREST_LEVEL_LABELS } from "@/constants/businessData";
import { getKoreaDateKey } from "@/lib/date";
import { cn, formatDate, getInterestTextStyle } from "@/lib/utils";
import { CompanyDetail } from "@/types/company-detail";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  Handshake,
  PhoneCall,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";

type Props = Pick<
  CompanyDetail,
  | "interest_level"
  | "contracted_at"
  | "contract_duration_days"
  | "contract_memo"
  | "contact_schedules"
  | "contact_histories"
>;

type ContactSummaryItem = {
  date: string;
  count: number;
};

const DEFAULT_VISIBLE_DATE_COUNT = 7;

export default function CompanySalesInfo({
  interest_level,
  contracted_at,
  contract_duration_days,
  contract_memo,
  contact_schedules,
  contact_histories,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const nextSchedule = contact_schedules[0];

  /*
   * 연락 이력을 한국 날짜 기준으로 묶고
   * 최신 날짜가 먼저 나오도록 정렬한다.
   */
  const contactSummary = useMemo<ContactSummaryItem[]>(() => {
    const contactCountByDate = new Map<string, number>();

    contact_histories.forEach((history) => {
      const date = getKoreaDateKey(history.contacted_at);

      if (!date) {
        return;
      }

      contactCountByDate.set(date, (contactCountByDate.get(date) ?? 0) + 1);
    });

    return Array.from(contactCountByDate.entries())
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [contact_histories]);

  const totalContactCount = contact_histories.length;

  const displayedContactSummary = isExpanded
    ? contactSummary
    : contactSummary.slice(0, DEFAULT_VISIBLE_DATE_COUNT);

  const canToggleContactSummary = contactSummary.length > DEFAULT_VISIBLE_DATE_COUNT;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Clock3 className="h-6 w-6 text-blue-600" />
          영업 정보
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-3xl border bg-white">
          {/* 상단 KPI */}
          <div className="grid md:grid-cols-4">
            <div className="flex gap-4 border-b p-6 md:border-r md:border-b-0">
              <Star
                className={cn("h-6 w-6 text-amber-500", getInterestTextStyle(interest_level))}
              />

              <div>
                <p className="text-sm text-gray-500">관심도</p>

                <p className={cn("mt-2 text-xl font-bold", getInterestTextStyle(interest_level))}>
                  {INTEREST_LEVEL_LABELS[interest_level as keyof typeof INTEREST_LEVEL_LABELS]}
                </p>
              </div>
            </div>

            <div className="flex gap-4 border-b p-6 md:border-r md:border-b-0">
              <Calendar className="h-6 w-6 text-blue-500" />

              <div className="flex-1">
                <p className="text-sm text-gray-500">다음 연락일</p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xl font-bold">
                    {nextSchedule ? formatDate(nextSchedule.scheduled_at) : "-"}
                  </p>

                  {nextSchedule && !nextSchedule.completed ? (
                    <CompleteContactButton scheduleId={nextSchedule.id} />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex gap-4 border-b p-6 md:border-r md:border-b-0">
              <Handshake className="h-6 w-6 text-emerald-500" />

              <div>
                <p className="text-sm text-gray-500">계약일</p>

                <p className="mt-2 text-xl font-bold">
                  {contracted_at ? formatDate(contracted_at) : "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6">
              <Clock3 className="h-6 w-6 text-orange-500" />

              <div>
                <p className="text-sm text-gray-500">계약 소요 일수</p>

                <p className="mt-2 text-xl font-bold">
                  {contract_duration_days != null ? `${contract_duration_days}일` : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* 계약 메모 */}
          <div className="flex gap-4 border-t p-6">
            <FileText className="h-6 w-6 shrink-0 text-emerald-500" />

            <div>
              <p className="text-sm text-gray-500">계약 메모</p>

              <p className="mt-2 whitespace-pre-wrap text-base">{contract_memo ?? "-"}</p>
            </div>
          </div>

          {/* 최근 연락 현황 */}
          <div className="border-t p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                  <PhoneCall className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">최근 연락 현황</h3>

                  <p className="mt-1 text-sm text-slate-500">연락 완료 날짜별 횟수</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-500">총 연락 횟수</span>

                <strong className="text-lg text-slate-900">{totalContactCount}회</strong>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              {displayedContactSummary.length > 0 ? (
                displayedContactSummary.map((item, index) => (
                  <div
                    key={item.date}
                    className={cn(
                      "flex items-center justify-between gap-4 px-5 py-4",
                      index !== displayedContactSummary.length - 1 && "border-b",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-slate-400" />

                      <span className="font-medium text-slate-700">{item.date}</span>
                    </div>

                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-sm font-semibold"
                    >
                      {item.count}회
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center">
                  <PhoneCall className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm text-slate-500">등록된 연락 이력이 없습니다.</p>
                </div>
              )}
            </div>

            {canToggleContactSummary ? (
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-2 rounded-xl text-slate-600"
                  onClick={() => setIsExpanded((previous) => !previous)}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? (
                    <>
                      접기
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      전체 보기
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
