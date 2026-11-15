//app/api/admin/users/[id]/route.ts

import { updateUserNameSchema } from "@/schemas/updateUserNameSchema";
import { getUser } from "@/services/actions/user/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.users.findUnique({
    where: { id: authUser.id },
    select: { role: true },
  });

  if (currentUser?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const body = await request.json().catch(() => null);
  const parsed = updateUserNameSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "올바른 이름을 입력해 주세요.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const targetUser = await prisma.users.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!targetUser) {
    return NextResponse.json({ message: "사용자를 찾을 수 없습니다." }, { status: 404 });
  }

  const updatedUser = await prisma.users.update({
    where: { id },
    data: {
      name: parsed.data.name,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json({ data: updatedUser });
}
