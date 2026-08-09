// api/admin/users/route.ts

import { getUser } from "@/services/actions/user/user.api";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
  try {
    const authUser = await getUser();

    if (!authUser) {
      return NextResponse.json(
        {
          message: "로그인이 필요합니다.",
        },
        {
          status: 401,
        },
      );
    }

    if (authUser.role !== "admin") {
      return NextResponse.json(
        {
          message: "계정을 관리할 권한이 없습니다.",
        },
        {
          status: 403,
        },
      );
    }

    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        is_active: true,
        retired_at: true,
        team_id: true,

        teams: {
          select: {
            id: true,
            name: true,
          },
        },

        _count: {
          select: {
            companies_companies_owner_idTousers: {
              where: {
                is_archived: false,
              },
            },
          },
        },
      },

      orderBy: [
        {
          is_active: "desc",
        },
        {
          name: "asc",
        },
      ],
    });

    const data = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      isActive: user.is_active,
      retiredAt: user.retired_at,

      team: user.teams
        ? {
            id: user.teams.id,
            name: user.teams.name,
          }
        : null,

      companyCount: user._count.companies_companies_owner_idTousers,
    }));

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("계정 목록 조회 실패:", error);

    return NextResponse.json(
      {
        message: "계정 목록을 불러오는 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
