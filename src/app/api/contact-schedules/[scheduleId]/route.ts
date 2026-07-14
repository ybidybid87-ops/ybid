// api/contact-schedules/[scheduleId]/route.ts
//업체 담당자가 아닌 연락 완료 버튼 누른 사람 콜수 증가함
import { getUser } from "@/services/actions/user/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

type RouteContext = {
  params: Promise<{
    scheduleId: string;
  }>;
};

type UpdateContactScheduleRequest = {
  scheduledAt?: string;
  memo?: string;
  completed?: boolean;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const { scheduleId } = await context.params;

    const body = (await request.json()) as UpdateContactScheduleRequest;

    const schedule = await prisma.contact_schedules.update({
      where: {
        id: scheduleId,
      },

      data: {
        ...(body.scheduledAt && {
          scheduled_at: new Date(body.scheduledAt),
        }),

        ...(body.memo !== undefined && {
          memo: body.memo,
        }),

        ...(body.completed !== undefined && {
          completed: body.completed,

          completed_at: body.completed ? new Date() : null,

          completed_by: body.completed ? authUser.id : null,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error("연락 일정 수정 실패:", error);

    return NextResponse.json(
      {
        success: false,
        message: "연락 일정을 수정하지 못했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
