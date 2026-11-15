//app/api/users/[id]/deletion-preview/route.ts
import { getUser } from "@/services/actions/user/user.api";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.uuid(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const parsed = paramsSchema.safeParse(await params);

  if (!parsed.success) {
    return NextResponse.json({ message: "잘못된 사용자 ID이다." }, { status: 400 });
  }

  const { id } = parsed.data;

  if (id === authUser.id) {
    return NextResponse.json({ message: "본인 계정은 삭제할 수 없다." }, { status: 400 });
  }

  const targetUser = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!targetUser) {
    return NextResponse.json({ message: "사용자를 찾을 수 없다." }, { status: 404 });
  }

  const ownedCompanyFilter = {
    owner_id: id,
  };

  const [
    ownedCompanies,
    companyContacts,
    businessLicenses,
    companySchedules,
    companyHistories,
    externalCreatedSchedules,
    externalCompletedSchedules,
    externalHistories,
    externalContractCompanies,
    externalArchivedCompanies,
    externalNotifications,
  ] = await Promise.all([
    prisma.companies.count({
      where: ownedCompanyFilter,
    }),

    prisma.company_contacts.count({
      where: {
        company: ownedCompanyFilter,
      },
    }),

    prisma.company_business_licenses.count({
      where: {
        company: ownedCompanyFilter,
      },
    }),

    prisma.contact_schedules.count({
      where: {
        companies: ownedCompanyFilter,
      },
    }),

    prisma.contact_histories.count({
      where: {
        companies: ownedCompanyFilter,
      },
    }),

    prisma.contact_schedules.count({
      where: {
        created_by: id,
        companies: {
          owner_id: { not: id },
        },
      },
    }),

    prisma.contact_schedules.count({
      where: {
        completed_by: id,
        companies: {
          owner_id: { not: id },
        },
      },
    }),

    prisma.contact_histories.count({
      where: {
        user_id: id,
        companies: {
          owner_id: { not: id },
        },
      },
    }),

    prisma.companies.count({
      where: {
        contract_owner_id: id,
        owner_id: { not: id },
      },
    }),

    prisma.companies.count({
      where: {
        archived_by: id,
        owner_id: { not: id },
      },
    }),

    prisma.notifications.count({
      where: {
        actor_id: id,
        OR: [
          { company_id: null },
          {
            companies: {
              is: {
                owner_id: { not: id },
              },
            },
          },
        ],
      },
    }),
  ]);

  return NextResponse.json({
    data: {
      user: targetUser,
      ownedCompanies,
      companyContacts,
      businessLicenses,
      companySchedules,
      companyHistories,
      externalCreatedSchedules,
      externalCompletedSchedules,
      externalHistories,
      externalContractCompanies,
      externalArchivedCompanies,
      externalNotifications,
    },
  });
}
