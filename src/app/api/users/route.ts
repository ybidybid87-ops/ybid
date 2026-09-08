// api/users/route.ts
import { getUser } from "@/services/actions/user/user.api";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
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

  if (!["admin", "leader"].includes(user.role)) {
    return NextResponse.json(
      {
        success: false,
        message: "직원 목록을 조회할 권한이 없습니다.",
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
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json({
    success: true,
    data: users,
  });
}
