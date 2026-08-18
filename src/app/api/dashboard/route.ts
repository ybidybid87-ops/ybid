// app/api/dashboard/route.ts

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { getMonthRange, getToday, getTodayRange } from "@/lib/date";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const page = Number(request.nextUrl.searchParams.get("page")) || 1;
  const pageSize = Number(request.nextUrl.searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  if (!userId || userId === "undefined") {
    return NextResponse.json(
      {
        success: false,
        message: "userId는 필수입니다.",
      },
      { status: 400 },
    );
  }

  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      },
      { status: 404 },
    );
  }

  const todayDate = getToday();

  const { startDate: monthStart, endDate: monthEnd } = getMonthRange();
  const { startDate: todayStart, endDate: todayEnd } = getTodayRange();

  const companyWhere = {
    owner_id: user.id,
  };

  const [
    myCompanyCount,
    interestLevelGroups,
    todayContactCount,
    overdueContactCount,
    contractedThisMonthCount,
    todayContacts,
  ] = await Promise.all([
    prisma.companies.count({
      where: {
        ...companyWhere,
        is_archived: false,

        created_at: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    }),

    prisma.companies.groupBy({
      by: ["interest_level"],

      where: {
        ...companyWhere,
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
          ...companyWhere,
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
          ...companyWhere,
          is_archived: false,
        },
      },
    }),

    prisma.companies.count({
      where: {
        ...companyWhere,

        is_archived: false,

        contracted_at: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    }),

    prisma.contact_schedules.findMany({
      where: {
        completed: false,

        scheduled_at: todayDate,

        companies: {
          ...companyWhere,
          is_archived: false,
        },
      },

      select: {
        id: true,

        scheduled_at: true,

        companies: {
          select: {
            id: true,

            name: true,

            interest_level: true,

            company_contacts: {
              where: {
                is_primary: true,
              },

              orderBy: {
                sort_order: "asc",
              },

              take: 1,
            },
          },
        },
      },

      orderBy: [
        {
          companies: {
            interest_level: "desc",
          },
        },
        {
          companies: {
            created_at: "asc",
          },
        },
      ],

      skip: (page - 1) * pageSize,

      take: pageSize,
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
      myCompanyCount,

      interestLevelCounts,

      todayContactCount,

      overdueContactCount,

      contractedThisMonthCount,

      todayContacts,

      page,

      pageSize,

      totalPages: Math.ceil(todayContactCount / pageSize),
    },
  });
}
