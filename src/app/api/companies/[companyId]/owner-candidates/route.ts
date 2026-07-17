// src/app/api/companies/[companyId]/owner-candidates/route.ts
// 담당자 후보 조회 API

import { getUser } from "@/services/actions/user/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

type RouteContext = {
  params: Promise<{
    companyId: string;
  }>;
};

export async function GET(_: NextRequest, { params }: RouteContext) {
  try {
    const { companyId } = await params;

    const user = await getUser();

    const authUserId = user?.id;

    if (!authUserId) {
      return NextResponse.json(
        {
          message: "로그인이 필요합니다.",
        },
        {
          status: 401,
        },
      );
    }

    const [currentUser, company] = await Promise.all([
      prisma.users.findUnique({
        where: {
          id: authUserId,
        },
        select: {
          id: true,
          role: true,
          team_id: true,
        },
      }),

      prisma.companies.findUnique({
        where: {
          id: companyId,
        },
        select: {
          id: true,
          owner_id: true,
          team_id: true,
        },
      }),
    ]);

    if (!currentUser) {
      return NextResponse.json(
        {
          message: "사용자 정보를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (!company) {
      return NextResponse.json(
        {
          message: "업체를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (!["leader", "admin"].includes(currentUser.role)) {
      return NextResponse.json(
        {
          message: "담당자를 변경할 권한이 없습니다.",
        },
        {
          status: 403,
        },
      );
    }

    if (currentUser.role === "leader" && company.team_id !== currentUser.team_id) {
      return NextResponse.json(
        {
          message: "같은 팀의 업체만 담당자를 변경할 수 있습니다.",
        },
        {
          status: 403,
        },
      );
    }

    const users = await prisma.users.findMany({
      where: {
        id: {
          not: company.owner_id,
        },

        // 리더는 같은 팀원만 조회
        ...(currentUser.role === "leader"
          ? {
              team_id: currentUser.team_id,
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        team_id: true,
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          teams: {
            name: "asc",
          },
        },
        {
          name: "asc",
        },
      ],
    });

    return NextResponse.json({
      data: users,
    });
  } catch (error) {
    console.error("담당자 후보 조회 실패:", error);

    return NextResponse.json(
      {
        message: "담당자 목록을 불러오는 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
