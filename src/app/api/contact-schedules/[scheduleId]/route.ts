// api/contact-schedules/[scheduleId]/route.ts
// 업체 담당자가 아닌 연락 완료 버튼을 누른 사람의 콜 수도 증가함

import { parseKoreaDate } from "@/lib/date";
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

const CONTACT_SCHEDULE_NOT_FOUND = "CONTACT_SCHEDULE_NOT_FOUND";

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

    const schedule = await prisma.$transaction(async (tx) => {
      const currentSchedule = await tx.contact_schedules.findUnique({
        where: {
          id: scheduleId,
        },
      });

      if (!currentSchedule) {
        throw new Error(CONTACT_SCHEDULE_NOT_FOUND);
      }

      const completedAt = body.completed === true ? new Date() : null;

      const updatedSchedule = await tx.contact_schedules.update({
        where: {
          id: scheduleId,
        },
        data: {
          ...(body.scheduledAt && {
            scheduled_at: parseKoreaDate(body.scheduledAt),
          }),

          ...(body.memo !== undefined && {
            memo: body.memo,
          }),

          ...(body.completed !== undefined && {
            completed: body.completed,
            completed_at: completedAt,
            completed_by: body.completed ? authUser.id : null,
          }),
        },
      });

      /*
       * 미완료 상태에서 완료 상태로 변경될 때만 연락 이력을 생성한다.
       *
       * 동일한 요청이 중복으로 전달되거나 완료 버튼이 여러 번 눌려도
       * 연락 이력이 중복 생성되지 않는다.
       */
      const shouldCreateContactHistory =
        body.completed === true && currentSchedule.completed === false;

      if (shouldCreateContactHistory) {
        await tx.contact_histories.create({
          data: {
            company_id: currentSchedule.company_id,
            user_id: authUser.id,
            content: "연락 완료",
            contacted_at: completedAt ?? new Date(),
          },
        });
      }

      return updatedSchedule;
    });

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    if (error instanceof Error && error.message === CONTACT_SCHEDULE_NOT_FOUND) {
      return NextResponse.json(
        {
          success: false,
          message: "연락 일정을 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

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
