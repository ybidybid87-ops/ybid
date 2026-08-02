"use client";

import useMonthlySalesRankings from "@/hooks/monthly-sales-ranking/useMonthlySalesRankings";
import { cn } from "@/lib/utils";

export default function MonthlySalesRankingCard() {
  const { data, isPending } = useMonthlySalesRankings();
  const firstPlace = "🏆";

  if (isPending) {
    return (
      <div className="rounded-xl border bg-muted/30 p-3">
        <p className="text-sm text-muted-foreground">랭킹 불러오는 중...</p>
      </div>
    );
  }

  const hasRanking = data?.some((user) => user.contractCount > 0);

  if (!hasRanking) {
    return (
      <div className="rounded-xl border bg-linear-to-br from-amber-50 to-white p-3">
        <div className="mb-2 flex items-center gap-2">
          <span>🏆</span>

          <div>
            <p className="text-sm font-bold">이번 달 랭킹</p>
            <p className="text-xs text-muted-foreground">계약 건수 기준</p>
          </div>
        </div>

        <div className="rounded-lg border border-dashed p-4 text-center">
          <p className="text-sm font-medium">아직 이번 달 계약이 없습니다.</p>

          <p className="mt-1 text-xs text-muted-foreground">첫 계약의 주인공이 되어보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-linear-to-br from-amber-50 to-white p-3 shadow-sm group-data-[state=collapsed]:hidden">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">🏆</span>

        <div>
          <p className="text-sm font-bold">이번 달 랭킹</p>

          <p className="text-xs text-muted-foreground">계약 건수 기준</p>
        </div>
      </div>

      <div className="space-y-2">
        {data?.map((user) => (
          <div
            key={user.userId}
            className={cn(
              "flex items-center justify-between rounded-lg border px-2 py-2 transition-all duration-200",
              user.rank === 1
                ? "border-amber-300 bg-amber-100 hover:border-amber-400 hover:bg-amber-200 hover:shadow-sm"
                : "border-transparent hover:bg-muted/50",
            )}
          >
            <div className="flex items-center gap-2">
              <span className="w-6 text-center font-semibold">
                {user.rank === 1 ? firstPlace : user.rank}
              </span>

              <span className={cn("text-sm", user.rank === 1 ? "font-bold" : "font-medium")}>
                {user.name}
              </span>
            </div>

            <span
              className={cn(
                "text-xs",
                user.rank === 1 ? "font-bold text-amber-700" : "font-semibold text-indigo-600",
              )}
            >
              {user.contractCount}건
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
