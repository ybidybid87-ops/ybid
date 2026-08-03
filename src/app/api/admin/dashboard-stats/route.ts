//api/admin/dashboard-stats/route.ts

import { getMonthRange, getToday } from "@/lib/date";
import { getUser } from "@/services/actions/user/user.api";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
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

  const todayDate = getToday();

  const { startDate: monthStart, endDate: monthEnd } = getMonthRange();

  const [
    companyCount,
    interestLevelGroups,
    todayContactCount,
    overdueContactCount,
    contractedThisMonthCount,
  ] = await Promise.all([
    prisma.companies.count({
      where: {
        is_archived: false,
      },
    }),

    prisma.companies.groupBy({
      by: ["interest_level"],

      where: {
        is_archived: false,
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

        contracted_at: {
          gte: monthStart,
          lt: monthEnd,
        },
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

      contractedThisMonthCount,

      interestLevelCounts,
    },
  });
}
