//app/api/admin/users/[id]/route.ts

import { deleteUserParamsSchema } from "@/schemas/deleteUserSchema";
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getUser();

    if (!authUser) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    const currentUser = await prisma.users.findUnique({
      where: { id: authUser.id },
      select: { role: true },
    });

    if (currentUser?.role !== "admin") {
      return NextResponse.json({ message: "접근 권한이 없습니다." }, { status: 403 });
    }

    const parsed = deleteUserParamsSchema.safeParse(await params);

    if (!parsed.success) {
      return NextResponse.json({ message: "잘못된 사용자 ID입니다." }, { status: 400 });
    }

    const { id } = parsed.data;

    if (id === authUser.id) {
      return NextResponse.json({ message: "본인 계정은 삭제할 수 없습니다." }, { status: 400 });
    }

    const targetUser = await prisma.users.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json({ message: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    const result = await prisma.$transaction(
      async (tx) => {
        // 다른 직원 소유 업체에 남은 필수 생성자 참조 정리
        const createdSchedules = await tx.contact_schedules.deleteMany({
          where: {
            created_by: id,
            companies: {
              owner_id: { not: id },
            },
          },
        });

        // 다른 직원 소유 업체의 완료 기록은 보존
        const completedSchedules = await tx.contact_schedules.updateMany({
          where: {
            completed_by: id,
            companies: {
              owner_id: { not: id },
            },
          },
          data: {
            completed_by: null,
          },
        });

        // 다른 직원 소유 업체의 연락 이력 보존
        const histories = await tx.contact_histories.updateMany({
          where: {
            user_id: id,
            companies: {
              owner_id: { not: id },
            },
          },
          data: {
            user_id: null,
          },
        });

        // 다른 직원 소유 업체의 계약 담당자 참조 해제
        const contracts = await tx.companies.updateMany({
          where: {
            contract_owner_id: id,
            owner_id: { not: id },
          },
          data: {
            contract_owner_id: null,
          },
        });

        // 아카이브 담당자 참조 해제
        const archives = await tx.companies.updateMany({
          where: {
            archived_by: id,
            owner_id: { not: id },
          },
          data: {
            archived_by: null,
          },
        });

        // 직원이 생성한 알림의 사용자 참조 해제
        const notifications = await tx.notifications.updateMany({
          where: {
            actor_id: id,
          },
          data: {
            actor_id: null,
          },
        });

        // 담당 업체 삭제
        // 업체에 연결된 연락 일정, 이력, 면허, 담당자,
        // 알림은 스키마의 Cascade 정책에 따라 삭제
        const companies = await tx.companies.deleteMany({
          where: {
            owner_id: id,
          },
        });

        return {
          deletedCompanies: companies.count,
          deletedExternalSchedules: createdSchedules.count,
          updatedCompletedSchedules: completedSchedules.count,
          updatedHistories: histories.count,
          updatedContracts: contracts.count,
          updatedArchives: archives.count,
          updatedNotifications: notifications.count,
        };
      },
      {
        maxWait: 5000,
        timeout: 20000,
      },
    );

    return NextResponse.json({
      message: "직원의 업무 데이터 정리가 완료되었습니다.",
      data: {
        userId: id,
        userName: targetUser.name,
        ...result,
      },
    });
  } catch (error) {
    console.error("직원 업무 데이터 삭제 오류:", error);

    return NextResponse.json(
      { message: "직원 데이터 삭제 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
