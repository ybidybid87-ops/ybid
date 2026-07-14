// api/companies/[companyId]/route.ts
import { verifyCompanyPermission } from "@/lib/company-permission";
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

    if ("contacts" in body) {
      await tx.company_contacts.deleteMany({
        where: {
          company_id: companyId,
        },
      });

      if (body.contacts && body.contacts.length > 0) {
        await tx.company_contacts.createMany({
          data: body.contacts.map((contact, index) => ({
            company_id: companyId,
            name: contact.name || null,
            phone: contact.phone,
            is_primary: index === 0,
            sort_order: index,
          })),
        });
      }
    }

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
            scheduled_at: new Date(body.contactSchedule.scheduledAt),
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

  await prisma.companies.delete({
    where: {
      id: companyId,
    },
  });

  // 휴지통 만들 경우 삭제 로직 빼고 보관으로
  /*  await prisma.companies.update({
    where: {
      id: companyId,
    },
    data: {
      is_archived: true,
      archived_at: new Date(),
    },
  }); */

  return NextResponse.json({
    success: true,
  });
}
