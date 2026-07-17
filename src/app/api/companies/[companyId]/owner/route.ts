// src/app/api/companies/[companyId]/owner/route.ts
// 업체 담당자 변경 API

import { getUser } from "@/services/actions/user/user.api";
import { ChangeCompanyOwnerRequest } from "@/types/company-owner";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

type RouteContext = {
  params: Promise<{
    companyId: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { companyId } = await params;
    const body = (await request.json()) as ChangeCompanyOwnerRequest;

    const user = await getUser();
    const authUserId = user?.id;

    if (!authUserId) {
      return NextResponse.json(
        {
          message: "로그인이 필요합니다.",
        },
        {
          status: 401,
        },
      );
    }

    if (!body.ownerId) {
      return NextResponse.json(
        {
          message: "새 담당자를 선택해주세요.",
        },
        {
          status: 400,
        },
      );
    }

    const [currentUser, company, newOwner] = await Promise.all([
      prisma.users.findUnique({
        where: {
          id: authUserId,
        },
        select: {
          id: true,
          role: true,
          team_id: true,
        },
      }),

      prisma.companies.findUnique({
        where: {
          id: companyId,
        },
        select: {
          id: true,
          owner_id: true,
          team_id: true,
        },
      }),

      prisma.users.findUnique({
        where: {
          id: body.ownerId,
        },
        select: {
          id: true,
          name: true,
          team_id: true,
        },
      }),
    ]);

    if (!currentUser) {
      return NextResponse.json(
        {
          message: "사용자 정보를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (!company) {
      return NextResponse.json(
        {
          message: "업체를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (!newOwner) {
      return NextResponse.json(
        {
          message: "변경할 담당자를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (!["leader", "admin"].includes(currentUser.role)) {
      return NextResponse.json(
        {
          message: "담당자를 변경할 권한이 없습니다.",
        },
        {
          status: 403,
        },
      );
    }

    if (company.owner_id === newOwner.id) {
      return NextResponse.json(
        {
          message: "현재 담당자와 동일한 사용자입니다.",
        },
        {
          status: 400,
        },
      );
    }

    if (currentUser.role === "leader") {
      const isSameCompanyTeam = company.team_id === currentUser.team_id;

      const isSameOwnerTeam = newOwner.team_id === currentUser.team_id;

      if (!isSameCompanyTeam || !isSameOwnerTeam) {
        return NextResponse.json(
          {
            message: "리더는 같은 팀의 업체와 팀원만 변경할 수 있습니다.",
          },
          {
            status: 403,
          },
        );
      }
    }

    const updatedCompany = await prisma.companies.update({
      where: {
        id: companyId,
      },
      data: {
        owner_id: newOwner.id,
        team_id: newOwner.team_id,
      },
      select: {
        id: true,
        owner_id: true,
        team_id: true,
        users_companies_owner_idTousers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: {
        id: updatedCompany.id,
        owner_id: updatedCompany.owner_id,
        team_id: updatedCompany.team_id,
        owner: updatedCompany.users_companies_owner_idTousers,
      },
      message: `${newOwner.name} 님으로 담당자가 변경되었습니다.`,
    });
  } catch (error) {
    console.error("업체 담당자 변경 실패:", error);

    return NextResponse.json(
      {
        message: "담당자를 변경하는 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
