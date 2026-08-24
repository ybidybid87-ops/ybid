// app/api/companies/[companyId]/route.ts

import { verifyCompanyPermission } from "@/lib/company-permission";
import { parseKoreaDate } from "@/lib/date";
import { getUser } from "@/services/actions/user/user.api";
import { findCompany } from "@/services/server/company";
import { UpdateCompanyRequest } from "@/types/company";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

type RouteContext = {
  params: Promise<{
    companyId: string;
  }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const { companyId } = await context.params;

  const company = await findCompany(companyId);

  if (!company) {
    return NextResponse.json(
      {
        success: false,
        message: "업체를 찾을 수 없습니다.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: company,
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const { companyId } = await context.params;

  await verifyCompanyPermission(companyId, authUser);

  const body = (await request.json()) as UpdateCompanyRequest;

  const company = await prisma.$transaction(async (tx) => {
    const updatedCompany = await tx.companies.update({
      where: {
        id: companyId,
      },
      data: {
        name: body.name,
        ceo_name: body.ceoName,
        ceo_phone: body.ceoPhone,
        fax_number: body.faxNumber,
        region: body.region,
        interest_level: body.interestLevel,
        sales_status: body.salesStatus,
        memo: body.memo,
        team_id: body.teamId,
      },
    });

    // 담당자 연락처
    if ("contacts" in body) {
      const contacts = body.contacts ?? [];

      // 기존 연락처는 id가 존재하고,
      // 새로 추가된 연락처는 id가 존재하지 않는다.
      const existingContactIds = contacts
        .map((contact) => contact.id)
        .filter((id): id is string => Boolean(id));

      // 수정 폼에서 제거된 기존 연락처 삭제
      await tx.company_contacts.deleteMany({
        where: {
          company_id: companyId,
          ...(existingContactIds.length > 0 && {
            id: {
              notIn: existingContactIds,
            },
          }),
        },
      });

      for (const [index, contact] of contacts.entries()) {
        if (contact.id) {
          // 기존 연락처는 UPDATE하여 created_at을 유지한다.
          await tx.company_contacts.updateMany({
            where: {
              id: contact.id,
              company_id: companyId,
            },
            data: {
              name: contact.name || null,
              phone: contact.phone,
              is_primary: index === 0,
              sort_order: index,
            },
          });

          continue;
        }

        // id가 없는 연락처만 신규 생성한다.
        await tx.company_contacts.create({
          data: {
            company_id: companyId,
            name: contact.name || null,
            phone: contact.phone,
            is_primary: index === 0,
            sort_order: index,
          },
        });
      }
    }

    // 공사업 정보
    if (body.businessLicenses) {
      await tx.company_business_licenses.deleteMany({
        where: {
          company_id: companyId,
        },
      });

      await tx.company_business_licenses.createMany({
        data: body.businessLicenses.map((license, index) => ({
          company_id: companyId,
          business_group: license.businessGroup,
          business_type: license.businessType,
          specialty_type: license.specialtyType ?? null,
          is_primary: license.isPrimary ?? index === 0,
        })),
      });
    }

    // 다음 연락 일정
    if ("contactSchedule" in body) {
      await tx.contact_schedules.deleteMany({
        where: {
          company_id: companyId,
          completed: false,
        },
      });

      if (body.contactSchedule) {
        await tx.contact_schedules.create({
          data: {
            company_id: companyId,
            scheduled_at: parseKoreaDate(body.contactSchedule.scheduledAt),
            memo: body.contactSchedule.memo,
            created_by: authUser.id,
          },
        });
      }
    }

    return updatedCompany;
  });

  return NextResponse.json({
    success: true,
    data: company,
  });
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const { companyId } = await context.params;

  await verifyCompanyPermission(companyId, authUser);

  const company = await prisma.companies.findUnique({
    where: {
      id: companyId,
    },
    select: {
      sales_status: true,
    },
  });

  if (!company) {
    return NextResponse.json(
      {
        success: false,
        message: "업체를 찾을 수 없습니다.",
      },
      { status: 404 },
    );
  }

  if (company.sales_status === "contracted") {
    return NextResponse.json(
      {
        success: false,
        message: "계약 완료된 업체는 삭제할 수 없습니다. 계약을 취소한 후 삭제해주세요.",
      },
      { status: 400 },
    );
  }

  await prisma.companies.delete({
    where: {
      id: companyId,
    },
  });

  // 휴지통 만들 경우 삭제 로직 빼고 보관으로
  /*
  await prisma.companies.update({
    where: {
      id: companyId,
    },
    data: {
      is_archived: true,
      archived_at: new Date(),
    },
  });
  */

  return NextResponse.json({
    success: true,
  });
}
