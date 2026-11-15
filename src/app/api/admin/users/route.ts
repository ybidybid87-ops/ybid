import { getUser } from "@/services/actions/user/user.api";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.users.findUnique({
    where: {
      id: authUser.id,
    },
    select: {
      role: true,
    },
  });

  if (currentUser?.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      team_id: true,
      is_active: true,
      created_at: true,
      _count: {
        select: {
          companies_companies_owner_idTousers: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const result = users.map(({ _count, ...user }) => ({
    ...user,
    _count: {
      companies: _count.companies_companies_owner_idTousers,
    },
  }));

  return NextResponse.json({ data: result });
}
