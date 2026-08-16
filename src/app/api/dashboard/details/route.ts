// api/dashboard/details/route.ts

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { getNextKoreaDateTime, getToday, parseKoreaDate, parseKoreaDateTime } from "@/lib/date";
import { getUser } from "@/services/actions/user/user.api";
import { DashboardDetailType } from "@/types/dashboard";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

const DASHBOARD_DETAIL_TYPES: DashboardDetailType[] = [
  "companies",
  "contact-schedules",
  "overdue-contacts",
  "contracts",
  "interest-high",
  "interest-medium",
  "interest-low",
];

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "로그인이 필요합니다.",
      },
      {
        status: 401,
      },
    );
  }

  const type = request.nextUrl.searchParams.get("type") as DashboardDetailType | null;

  const startDate = request.nextUrl.searchParams.get("startDate");
  const endDate = request.nextUrl.searchParams.get("endDate");

  const page = Math.max(Number(request.nextUrl.searchParams.get("page")) || 1, 1);

  const pageSize = Math.max(
    Number(request.nextUrl.searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE,
    1,
  );

  if (!type || !DASHBOARD_DETAIL_TYPES.includes(type)) {
    return NextResponse.json(
      {
        success: false,
        message: "올바른 상세 조회 유형이 아닙니다.",
      },
      {
        status: 400,
      },
    );
  }

  const requiresDateRange = ["contact-schedules", "contracts"].includes(type);

  if (requiresDateRange && (!startDate || !endDate)) {
    return NextResponse.json(
      {
        success: false,
        message: "조회 시작일과 종료일은 필수입니다.",
      },
      {
        status: 400,
      },
    );
  }

  if ((startDate && !endDate) || (!startDate && endDate)) {
    return NextResponse.json(
      {
        success: false,
        message: "조회 시작일과 종료일을 모두 입력해주세요.",
      },
      {
        status: 400,
      },
    );
  }

  if (startDate && endDate && startDate > endDate) {
    return NextResponse.json(
      {
        success: false,
        message: "조회 시작일은 종료일보다 늦을 수 없습니다.",
      },
      {
        status: 400,
      },
    );
  }

  const skip = (page - 1) * pageSize;

  const companyWhere = {
    owner_id: user.id,
    is_archived: false,
  };

  const companySelect = {
    id: true,
    name: true,
    interest_level: true,

    company_contacts: {
      where: {
        is_primary: true,
      },

      orderBy: {
        sort_order: "asc" as const,
      },

      take: 1,

      select: {
        id: true,
        name: true,
        phone: true,
      },
    },
  };

  if (type === "companies") {
    const [totalCount, companies] = await Promise.all([
      prisma.companies.count({
        where: companyWhere,
      }),

      prisma.companies.findMany({
        where: companyWhere,

        select: companySelect,

        orderBy: {
          created_at: "desc",
        },

        skip,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      success: true,

      data: {
        items: companies.map((company) => ({
          companyId: company.id,
          companyName: company.name,
          interestLevel: company.interest_level,
          primaryContact: company.company_contacts[0] ?? null,
        })),

        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  }

  if (type === "interest-high" || type === "interest-medium" || type === "interest-low") {
    const interestLevel = type.replace("interest-", "") as "high" | "medium" | "low";

    const where = {
      ...companyWhere,
      interest_level: interestLevel,
    };

    const [totalCount, companies] = await Promise.all([
      prisma.companies.count({
        where,
      }),

      prisma.companies.findMany({
        where,

        select: companySelect,

        orderBy: {
          created_at: "desc",
        },

        skip,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      success: true,

      data: {
        items: companies.map((company) => ({
          companyId: company.id,
          companyName: company.name,
          interestLevel: company.interest_level,
          primaryContact: company.company_contacts[0] ?? null,
        })),

        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  }

  if (type === "contracts") {
    const start = parseKoreaDateTime(startDate!);
    const end = getNextKoreaDateTime(endDate!);

    const where = {
      ...companyWhere,

      contracted_at: {
        gte: start,
        lt: end,
      },
    };

    const [totalCount, companies] = await Promise.all([
      prisma.companies.count({
        where,
      }),

      prisma.companies.findMany({
        where,

        select: {
          ...companySelect,
          contracted_at: true,
        },

        orderBy: {
          contracted_at: "desc",
        },

        skip,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      success: true,

      data: {
        items: companies.map((company) => ({
          companyId: company.id,
          companyName: company.name,
          interestLevel: company.interest_level,
          primaryContact: company.company_contacts[0] ?? null,
          contractedAt: company.contracted_at,
        })),

        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  }

  if (type === "contact-schedules") {
    const start = parseKoreaDate(startDate!);
    const end = parseKoreaDate(endDate!);

    const where = {
      completed: false,

      scheduled_at: {
        gte: start,
        lte: end,
      },

      companies: companyWhere,
    };

    const [totalCount, schedules] = await Promise.all([
      prisma.contact_schedules.count({
        where,
      }),

      prisma.contact_schedules.findMany({
        where,

        select: {
          id: true,
          scheduled_at: true,

          companies: {
            select: companySelect,
          },
        },

        orderBy: [
          {
            scheduled_at: "asc",
          },
          {
            companies: {
              interest_level: "desc",
            },
          },
        ],

        skip,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      success: true,

      data: {
        items: schedules.map((schedule) => ({
          companyId: schedule.companies.id,
          companyName: schedule.companies.name,
          interestLevel: schedule.companies.interest_level,
          primaryContact: schedule.companies.company_contacts[0] ?? null,
          scheduledAt: schedule.scheduled_at,
        })),

        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  }

  if (type === "overdue-contacts") {
    const today = getToday();

    const scheduledAtWhere =
      startDate && endDate
        ? {
            gte: parseKoreaDate(startDate),
            lte: parseKoreaDate(endDate),
            lt: today,
          }
        : {
            lt: today,
          };

    const where = {
      completed: false,

      scheduled_at: scheduledAtWhere,

      companies: companyWhere,
    };

    const [totalCount, schedules] = await Promise.all([
      prisma.contact_schedules.count({
        where,
      }),

      prisma.contact_schedules.findMany({
        where,

        select: {
          id: true,
          scheduled_at: true,

          companies: {
            select: companySelect,
          },
        },

        orderBy: [
          {
            scheduled_at: "asc",
          },
          {
            companies: {
              interest_level: "desc",
            },
          },
        ],

        skip,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      success: true,

      data: {
        items: schedules.map((schedule) => ({
          companyId: schedule.companies.id,
          companyName: schedule.companies.name,
          interestLevel: schedule.companies.interest_level,
          primaryContact: schedule.companies.company_contacts[0] ?? null,
          scheduledAt: schedule.scheduled_at,
        })),

        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: "지원하지 않는 조회 유형입니다.",
    },
    {
      status: 400,
    },
  );
}
