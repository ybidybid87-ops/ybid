// /api/monthly-sales-rankings/route.ts

import { getKoreaNow, getMonthRange } from "@/lib/date";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
  const now = getKoreaNow();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { startDate, endDate } = getMonthRange(year, month);

  const [users, contractGroups] = await Promise.all([
    prisma.users.findMany({
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.companies.groupBy({
      by: ["contract_owner_id"],
      where: {
        is_archived: false,
        sales_status: "contracted",

        contract_owner_id: {
          not: null,
        },

        contracted_at: {
          gte: startDate,
          lt: endDate,
        },
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const contractCountMap = new Map(
    contractGroups.flatMap((group) =>
      group.contract_owner_id
        ? [[group.contract_owner_id, group._count._all] as const]
        : [],
    ),
  );

  const rankings = users
    .map((user) => ({
      userId: user.id,
      name: user.name,
      contractCount: contractCountMap.get(user.id) ?? 0,
    }))
    .sort((a, b) => {
      if (b.contractCount !== a.contractCount) {
        return b.contractCount - a.contractCount;
      }

      return a.name.localeCompare(b.name, "ko-KR");
    })
    .map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      name: user.name,
      contractCount: user.contractCount,
    }));

  return NextResponse.json({
    data: rankings,
  });
}