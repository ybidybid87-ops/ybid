// 관리자 영업 현황 API
// src/app/api/admin/sales-performance/route.ts

import { getKoreaNow, getNextKoreaDateTime } from "@/lib/date";
import { getUser } from "@/services/actions/user/user.api";
import { connection, NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

const KOREA_TIME_OFFSET = "+09:00";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// YYYY-MM-DD 문자열을 한국 시간 00:00:00 기준 Date로 변환
function parseKoreaDateTime(date: string) {
  return new Date(`${date}T00:00:00${KOREA_TIME_OFFSET}`);
}

// YYYY-MM-DD 형식 및 실제 존재하는 날짜인지 확인
function isValidDate(date: string) {
  if (!DATE_PATTERN.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() + 1 === month &&
    parsedDate.getUTCDate() === day
  );
}

// 한국 시간 기준 YYYY-MM-DD 생성
function formatKoreaDate(year: number, month: number, day: number) {
  return [year, String(month).padStart(2, "0"), String(day).padStart(2, "0")].join("-");
}

export async function GET(request: NextRequest) {
  await connection();

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

    const period = searchParams.get("period");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (period && period !== "all" && period !== "month") {
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

    // period와 직접 날짜 지정은 동시에 사용하지 않음
    if (period && (startDateParam || endDateParam)) {
      return NextResponse.json(
        {
          success: false,
          message: "조회 기간 방식이 올바르지 않습니다.",
        },
        {
          status: 400,
        },
      );
    }

    // 직접 날짜 조회라면 시작일/종료일을 모두 전달해야 함
    if ((startDateParam && !endDateParam) || (!startDateParam && endDateParam)) {
      return NextResponse.json(
        {
          success: false,
          message: "시작일과 종료일을 모두 입력해주세요.",
        },
        {
          status: 400,
        },
      );
    }

    const now = getKoreaNow();

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    let startDateString: string | null = null;
    let endDateString: string | null = null;

    if (period === "all") {
      // 관리자 대시보드: 전체 누적
      startDate = undefined;
      endDate = undefined;
    } else if (period === "month") {
      // 당월 대시보드: 이번 달 1일 ~ 오늘
      startDateString = formatKoreaDate(now.getFullYear(), now.getMonth() + 1, 1);

      endDateString = formatKoreaDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

      startDate = parseKoreaDateTime(startDateString);
      endDate = getNextKoreaDateTime(endDateString);
    } else {
      // 기존 /admin 팀원별 현황
      // 날짜가 없으면 이번 달 1일 ~ 오늘
      startDateString = startDateParam ?? formatKoreaDate(now.getFullYear(), now.getMonth() + 1, 1);

      endDateString =
        endDateParam ?? formatKoreaDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

      if (!isValidDate(startDateString) || !isValidDate(endDateString)) {
        return NextResponse.json(
          {
            success: false,
            message: "올바른 날짜를 입력해주세요.",
          },
          {
            status: 400,
          },
        );
      }

      const selectedStartDate = parseKoreaDateTime(startDateString);
      const selectedEndDate = parseKoreaDateTime(endDateString);

      if (selectedStartDate > selectedEndDate) {
        return NextResponse.json(
          {
            success: false,
            message: "시작일은 종료일보다 늦을 수 없습니다.",
          },
          {
            status: 400,
          },
        );
      }

      startDate = selectedStartDate;
      endDate = getNextKoreaDateTime(endDateString);
    }

    // 담당 업체 수에 적용할 업체 등록 기간
    const companyCreatedAtRange =
      startDate && endDate
        ? {
            gte: startDate,
            lt: endDate,
          }
        : undefined;

    const [salesUsers, companyGroups, contacts, callGroups, contractGroups] = await Promise.all([
      // 영업사원
      prisma.users.findMany({
        where: {
          role: {
            in: ["member", "leader", "admin"],
          },
        },
        select: {
          id: true,
          name: true,
        },
      }),

      // 선택 기간에 등록된 현재 미계약 담당 업체
      prisma.companies.groupBy({
        by: ["owner_id"],
        where: {
          is_archived: false,
          sales_status: {
            not: "contracted",
          },
          ...(companyCreatedAtRange && {
            created_at: companyCreatedAtRange,
          }),
        },
        _count: {
          _all: true,
        },
      }),

      // 선택 기간에 등록된 현재 미계약 업체의 담당자 연락처
      prisma.company_contacts.findMany({
        where: {
          company: {
            is_archived: false,
            sales_status: {
              not: "contracted",
            },
          },
          ...(startDate &&
            endDate && {
              created_at: {
                gte: startDate,
                lt: endDate,
              },
            }),
        },
        select: {
          company: {
            select: {
              owner_id: true,
            },
          },
        },
      }),

      // 선택 기간에 완료 처리된 현재 미계약 업체의 콜
      prisma.contact_schedules.groupBy({
        by: ["completed_by"],
        where: {
          completed: true,
          completed_by: {
            not: null,
          },
          companies: {
            is_archived: false,
            sales_status: {
              not: "contracted",
            },
          },
          ...(startDate &&
            endDate && {
              completed_at: {
                gte: startDate,
                lt: endDate,
              },
            }),
        },
        _count: {
          _all: true,
        },
      }),

      // 선택 기간에 계약되었으며 현재도 유지 중인 계약 수
      prisma.companies.groupBy({
        by: ["contract_owner_id"],
        where: {
          is_archived: false,
          sales_status: "contracted",

          contract_owner_id: {
            not: null,
          },

          ...(startDate &&
            endDate && {
              contracted_at: {
                gte: startDate,
                lt: endDate,
              },
            }),
        },
        _count: {
          _all: true,
        },
      }),
    ]);

    const companyCountMap = new Map(
      companyGroups.map((group) => [group.owner_id, group._count._all] as const),
    );

    const contactCountMap = new Map<string, number>();

    contacts.forEach((contact) => {
      const ownerId = contact.company.owner_id;

      contactCountMap.set(ownerId, (contactCountMap.get(ownerId) ?? 0) + 1);
    });

    const callCountMap = new Map(
      callGroups.flatMap((group) =>
        group.completed_by ? [[group.completed_by, group._count._all] as const] : [],
      ),
    );

    const contractCountMap = new Map(
      contractGroups.flatMap((group) =>
        group.contract_owner_id ? [[group.contract_owner_id, group._count._all] as const] : [],
      ),
    );

    const items = salesUsers
      .map((user) => ({
        userId: user.id,
        name: user.name,

        companyCount: companyCountMap.get(user.id) ?? 0,
        contactCount: contactCountMap.get(user.id) ?? 0,
        callCount: callCountMap.get(user.id) ?? 0,
        contractCount: contractCountMap.get(user.id) ?? 0,
      }))
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
        period: period ?? "custom",
        startDate: startDateString,
        endDate: endDateString,
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
