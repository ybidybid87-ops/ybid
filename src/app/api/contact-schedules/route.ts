// api/contact-schedules/route.ts

import { parseKoreaDate } from "@/lib/date";
import { getUser } from "@/services/actions/user/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

/* GET
- 오늘 연락 예정
- 이번 주 연락 예정
- 지난 연락 예정
- 전체 연락 예정
- 특정 날짜 연락 예정

POST
- 연락 예정 추가 */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const type = searchParams.get("type");
  const date = searchParams.get("date");

  const today = new Date();

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  let whereClause = {};

  if (date) {
    const selectedDate = new Date(date);

    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    whereClause = {
      scheduled_at: {
        gte: selectedDate,
        lt: nextDate,
      },
    };
  } else {
    switch (type) {
      case "today":
        whereClause = {
          completed: false,
          scheduled_at: {
            gte: startOfToday,
            lt: endOfToday,
          },
        };
        break;

      case "week": {
        const startOfWeek = new Date(startOfToday);

        const day = startOfWeek.getDay();

        const diff = day === 0 ? -6 : 1 - day;

        startOfWeek.setDate(startOfWeek.getDate() + diff);

        const endOfWeek = new Date(startOfWeek);

        endOfWeek.setDate(endOfWeek.getDate() + 7);

        whereClause = {
          completed: false,
          scheduled_at: {
            gte: startOfWeek,
            lt: endOfWeek,
          },
        };

        break;
      }

      case "past":
        whereClause = {
          completed: false,
          scheduled_at: {
            lt: startOfToday,
          },
        };
        break;

      default:
        whereClause = {
          completed: false,
        };
    }
  }

  const schedules = await prisma.contact_schedules.findMany({
    where: whereClause,

    include: {
      companies: {
        include: {
          users_companies_owner_idTousers: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },

    orderBy: {
      scheduled_at: "asc",
    },
  });

  return NextResponse.json({
    success: true,
    data: schedules,
  });
}

type CreateScheduleRequest = {
  companyId: string;
  scheduledAt: string;
  memo?: string;
};

export async function POST(request: NextRequest) {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const body = (await request.json()) as CreateScheduleRequest;

  if (!body.companyId || !body.scheduledAt) {
    return NextResponse.json(
      {
        success: false,
        message: "업체와 연락 예정일은 필수입니다.",
      },
      {
        status: 400,
      },
    );
  }

  const existingSchedule = await prisma.contact_schedules.findFirst({
    where: {
      company_id: body.companyId,
      completed: false,
    },
  });

  if (existingSchedule) {
    return NextResponse.json(
      {
        success: false,
        message: "이미 등록된 연락 일정이 있습니다.",
      },
      {
        status: 409,
      },
    );
  }

  const schedule = await prisma.contact_schedules.create({
    data: {
      company_id: body.companyId,
      scheduled_at: parseKoreaDate(body.scheduledAt),
      memo: body.memo,
      created_by: authUser.id,
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: schedule,
    },
    {
      status: 201,
    },
  );
}
