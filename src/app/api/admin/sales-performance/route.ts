//관리자 영업 현황 API
//src/app/api/admin/sales-performance/route.ts

import { getUser } from "@/services/actions/user/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

const KOREA_TIME_OFFSET = "+09:00";

function getMonthRange(year: number, month: number) {
  const startDate = new Date(
    `${year}-${String(month).padStart(2, "0")}-01T00:00:00${KOREA_TIME_OFFSET}`,
  );

  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;

  const endDate = new Date(
    `${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00${KOREA_TIME_OFFSET}`,
  );

  return {
    startDate,
    endDate,
  };
}

export async function GET(request: NextRequest) {
  try {
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

    if (!["admin", "leader"].includes(authUser.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "접근 권한이 없습니다.",
        },
        {
          status: 403,
        },
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const now = new Date();

    const year = Number(searchParams.get("year") ?? now.getFullYear());

    const month = Number(searchParams.get("month") ?? now.getMonth() + 1);

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      year < 2000 ||
      year > 2100 ||
      month < 1 ||
      month > 12
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "올바른 연도와 월을 입력해주세요.",
        },
        {
          status: 400,
        },
      );
    }

    const { startDate, endDate } = getMonthRange(year, month);

    const [salesUsers, callGroups, contractGroups] = await Promise.all([
      // 영업사원별 현재 업체 및 담당자 연락처
      prisma.users.findMany({
        where: {
          role: {
            in: ["member", "leader", "admin"],
          },
        },
        select: {
          id: true,
          name: true,
          companies_companies_owner_idTousers: {
            where: {
              is_archived: false,
            },
            select: {
              id: true,
              _count: {
                select: {
                  company_contacts: true,
                },
              },
            },
          },
        },
      }),

      // 선택한 월의 콜 수
      prisma.contact_schedules.groupBy({
        by: ["completed_by"],
        where: {
          completed: true,

          completed_by: {
            not: null,
          },

          completed_at: {
            gte: startDate,
            lt: endDate,
          },
        },

        _count: {
          _all: true,
        },
      }),

      // 선택한 월에 계약되었으며 현재도 유지 중인 계약 수
      prisma.companies.groupBy({
        by: ["owner_id"],
        where: {
          is_archived: false,
          sales_status: "contracted",
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

    const callCountMap = new Map(
      callGroups.flatMap((group) =>
        group.completed_by ? [[group.completed_by, group._count._all] as const] : [],
      ),
    );

    const contractCountMap = new Map(
      contractGroups.map((group) => [group.owner_id, group._count._all]),
    );

    const items = salesUsers
      .map((user) => {
        const companies = user.companies_companies_owner_idTousers;

        const contactCount = companies.reduce(
          (total, company) => total + company._count.company_contacts,
          0,
        );

        return {
          userId: user.id,
          name: user.name,
          companyCount: companies.length,
          contactCount,
          callCount: callCountMap.get(user.id) ?? 0,
          contractCount: contractCountMap.get(user.id) ?? 0,
        };
      })
      .sort((a, b) => {
        // 1. 계약 건수 많은 순
        if (b.contractCount !== a.contractCount) {
          return b.contractCount - a.contractCount;
        }

        // 2. 계약 건수가 같으면 콜 수 많은 순
        if (b.callCount !== a.callCount) {
          return b.callCount - a.callCount;
        }

        // 3. 둘 다 같으면 이름 가나다순
        return a.name.localeCompare(b.name, "ko-KR");
      })
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    return NextResponse.json({
      success: true,
      data: {
        year,
        month,
        items,
      },
    });
  } catch (error) {
    console.error("관리자 영업 현황 조회 실패:", error);

    return NextResponse.json(
      {
        success: false,
        message: "관리자 영업 현황을 불러오지 못했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
