// api/admin/dashboard-stats/route.ts

import { getMonthRange, getToday } from "@/lib/date";
import { getUser } from "@/services/actions/user/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user || !["admin", "leader"].includes(user.role)) {
    return NextResponse.json(
      {
        success: false,
        message: "권한이 없습니다.",
      },
      {
        status: 403,
      },
    );
  }

  const period = request.nextUrl.searchParams.get("period") ?? "all";

  if (period !== "all" && period !== "month") {
    return NextResponse.json(
      {
        success: false,
        message: "올바른 조회 기간이 아닙니다.",
      },
      {
        status: 400,
      },
    );
  }

  const todayDate = getToday();
  const { startDate: monthStart, endDate: monthEnd } = getMonthRange();

  const createdAtWhere =
    period === "month"
      ? {
          gte: monthStart,
          lt: monthEnd,
        }
      : undefined;

  const contractedAtWhere =
    period === "month"
      ? {
          gte: monthStart,
          lt: monthEnd,
        }
      : undefined;

  const [companyCount, interestLevelGroups, todayContactCount, overdueContactCount, contractCount] =
    await Promise.all([
      prisma.companies.count({
        where: {
          is_archived: false,
          ...(createdAtWhere && {
            created_at: createdAtWhere,
          }),
        },
      }),

      prisma.companies.groupBy({
        by: ["interest_level"],
        where: {
          is_archived: false,
          ...(createdAtWhere && {
            created_at: createdAtWhere,
          }),
        },
        _count: {
          _all: true,
        },
      }),

      prisma.contact_schedules.count({
        where: {
          completed: false,
          scheduled_at: todayDate,
          companies: {
            is_archived: false,
          },
        },
      }),

      prisma.contact_schedules.count({
        where: {
          completed: false,
          scheduled_at: {
            lt: todayDate,
          },
          companies: {
            is_archived: false,
          },
        },
      }),

      prisma.companies.count({
        where: {
          is_archived: false,
          sales_status: "contracted",
          ...(contractedAtWhere && {
            contracted_at: contractedAtWhere,
          }),
        },
      }),
    ]);

  const interestLevelCounts = {
    high: 0,
    medium: 0,
    low: 0,
  };

  interestLevelGroups.forEach((item) => {
    interestLevelCounts[item.interest_level] = item._count._all;
  });

  return NextResponse.json({
    success: true,
    data: {
      companyCount,
      todayContactCount,
      overdueContactCount,
      contractCount,
      interestLevelCounts,
    },
  });
}
