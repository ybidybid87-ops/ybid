// api/admin/users/[userId]/retire/route.ts
// 퇴사처리 api
import { getUser } from "@/services/actions/user/user.api";
import { CACHE_TAGS } from "@/services/cache-tags";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

type RetireUserRequest = {
  newOwnerId?: string;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
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

    const { userId } = await params;
    const body = (await request.json()) as RetireUserRequest;

    if (authUser.id === userId) {
      return NextResponse.json(
        {
          message: "본인 계정은 퇴사 처리할 수 없습니다.",
        },
        {
          status: 400,
        },
      );
    }

    const targetUser = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        role: true,
        is_active: true,

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
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          message: "퇴사 처리할 사용자를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (!targetUser.is_active) {
      return NextResponse.json(
        {
          message: "이미 퇴사 처리된 계정입니다.",
        },
        {
          status: 400,
        },
      );
    }

    // 마지막 활성 관리자 보호
    if (targetUser.role === "admin") {
      const activeAdminCount = await prisma.users.count({
        where: {
          role: "admin",
          is_active: true,
        },
      });

      if (activeAdminCount <= 1) {
        return NextResponse.json(
          {
            message: "마지막 관리자 계정은 퇴사 처리할 수 없습니다.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const companyCount = targetUser._count.companies_companies_owner_idTousers;

    let newOwner: {
      id: string;
      name: string;
      team_id: string | null;
    } | null = null;

    // 담당 업체가 있다면 인계 대상 필수
    if (companyCount > 0) {
      if (!body.newOwnerId) {
        return NextResponse.json(
          {
            message: "담당 업체를 인계할 직원을 선택해주세요.",
          },
          {
            status: 400,
          },
        );
      }

      if (body.newOwnerId === targetUser.id) {
        return NextResponse.json(
          {
            message: "퇴사 대상자에게 업체를 인계할 수 없습니다.",
          },
          {
            status: 400,
          },
        );
      }

      newOwner = await prisma.users.findFirst({
        where: {
          id: body.newOwnerId,
          is_active: true,
        },
        select: {
          id: true,
          name: true,
          team_id: true,
        },
      });

      if (!newOwner) {
        return NextResponse.json(
          {
            message: "업체를 인계할 직원을 찾을 수 없습니다.",
          },
          {
            status: 404,
          },
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      if (companyCount > 0 && newOwner) {
        await tx.companies.updateMany({
          where: {
            owner_id: targetUser.id,
            is_archived: false,
          },
          data: {
            owner_id: newOwner.id,
            team_id: newOwner.team_id,
          },
        });
      }

      await tx.users.update({
        where: {
          id: targetUser.id,
        },
        data: {
          is_active: false,
          retired_at: new Date(),
        },
      });
    });

    // getUser()에서 사용하는 사용자 캐시 제거
    revalidateTag(CACHE_TAGS.ME, "max");

    return NextResponse.json({
      message:
        companyCount > 0 && newOwner
          ? `${targetUser.name} 님이 퇴사 처리되었으며, 담당 업체 ${companyCount}개가 ${newOwner.name} 님에게 인계되었습니다.`
          : `${targetUser.name} 님이 퇴사 처리되었습니다.`,
    });
  } catch (error) {
    console.error("사용자 퇴사 처리 실패:", error);

    return NextResponse.json(
      {
        message: "퇴사 처리 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
