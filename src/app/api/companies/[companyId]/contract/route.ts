// api/companies/[companyId]/contract/route.ts

import { verifyCompanyPermission } from "@/lib/company-permission";
import { getKoreaDateKey, parseKoreaDate } from "@/lib/date";
import { getUser } from "@/services/actions/user/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

/*
1. 계약 완료 처리
2. 계약 취소 처리
3. 계약까지 걸린 일수 저장
4. 전체 알림 생성
5. 월별 계약 현황에 반영
*/

type RouteContext = {
  params: Promise<{
    companyId: string;
  }>;
};

type UpdateContractRequest = {
  action: "complete" | "cancel";
  memo?: string;
  contractedAt?: string;
  contractDurationDays?: number;
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

    const { companyId } = await context.params;

    await verifyCompanyPermission(companyId, authUser);

    const body = (await request.json()) as UpdateContractRequest;

    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.companies.findUnique({
        where: {
          id: companyId,
        },
      });

      if (!company) {
        throw new Error("업체를 찾을 수 없습니다.");
      }

      /**
       * 계약 취소
       */
      if (body.action === "cancel") {
        const canceledCompany = await tx.companies.update({
          where: {
            id: companyId,
          },
          data: {
            sales_status: "in_progress",
            contracted_at: null,
            contract_owner_id: null,
            contract_memo: null,
            contract_duration_days: null,
          },
        });

        /* await tx.notifications.create({
          data: {
            type: "contract_cancel",
            title: "계약 취소",
            content: `${company.name} 업체 계약이 취소되었습니다.`,
            company_id: company.id,
            actor_id: authUser.id,
          },
        }); */

        return canceledCompany;
      }

      /**
       * 계약 완료
       */
      const canCustomizeContract = authUser.role === "admin" || authUser.role === "leader";

      const contractedAt =
        canCustomizeContract && body.contractedAt ? parseKoreaDate(body.contractedAt) : new Date();

      // 업체 등록일과 계약 완료일을 날짜 단위로 변환
      const createdDate = parseKoreaDate(getKoreaDateKey(company.created_at));
      const contractedDate = parseKoreaDate(getKoreaDateKey(contractedAt));

      // 등록일 기준 계약 소요일 자동 계산
      const calculatedDurationDays = Math.floor(
        (contractedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      // 계약일이 등록일보다 이전이면 자동 계산값을 저장하지 않음
      const autoDurationDays = calculatedDurationDays >= 0 ? calculatedDurationDays : null;

      // 관리자/리더가 직접 입력한 계약 소요일 검증
      if (
        canCustomizeContract &&
        body.contractDurationDays !== undefined &&
        (!Number.isInteger(body.contractDurationDays) || body.contractDurationDays < 0)
      ) {
        throw new Error("계약 소요일은 0 이상의 정수여야 합니다.");
      }

      // 관리자/리더가 직접 입력했다면 수기값 우선,
      // 그렇지 않으면 등록일과 계약일 기준 자동 계산값 사용
      const durationDays =
        canCustomizeContract && body.contractDurationDays !== undefined
          ? body.contractDurationDays
          : autoDurationDays;

      const contractedCompany = await tx.companies.update({
        where: {
          id: companyId,
        },
        data: {
          sales_status: "contracted",
          contracted_at: contractedAt,
          // 계약 처리 시점의 현재 업체 담당자에게 계약 실적 귀속
          contract_owner_id: company.owner_id,
          contract_memo: body.memo,
          contract_duration_days: durationDays,
        },
      });

      await tx.notifications.create({
        data: {
          type: "contract_completed",
          title: "계약 완료",
          content: `${company.name} 업체가 계약 완료되었습니다.`,
          company_id: company.id,
          actor_id: authUser.id,
        },
      });

      return contractedCompany;
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "계약 처리에 실패했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
