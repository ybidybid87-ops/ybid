// api/admin/users/[userId]/reactivate/route.ts
// 재활성화 API / 계정만 재활성화하고, 퇴사 당시 인계한 업체는 되돌리지 않는다

import { getUser } from "@/services/actions/user/user.api";
import { CACHE_TAGS } from "@/services/cache-tags";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function PATCH(_: Request, { params }: RouteContext) {
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

    const targetUser = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        is_active: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          message: "사용자를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (targetUser.is_active) {
      return NextResponse.json(
        {
          message: "이미 활성화된 계정입니다.",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.users.update({
      where: {
        id: targetUser.id,
      },
      data: {
        is_active: true,
        retired_at: null,
      },
    });

    revalidateTag(CACHE_TAGS.ME, "max");

    return NextResponse.json({
      message: `${targetUser.name} 님의 계정이 재활성화되었습니다.`,
    });
  } catch (error) {
    console.error("사용자 계정 재활성화 실패:", error);

    return NextResponse.json(
      {
        message: "계정을 재활성화하는 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
