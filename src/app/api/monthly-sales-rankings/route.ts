// /api/monthly-sales-rankings/route.ts

import { addMonths, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
  const now = new Date();

  const start = startOfMonth(now);
  const end = addMonths(start, 1);

  const users = await prisma.users.findMany({
    where: {
      role: {
        not: "admin",
      },
    },
    include: {
      companies_companies_owner_idTousers: {
        where: {
          sales_status: "contracted",
          contracted_at: {
            gte: start,
            lt: end,
          },
        },
      },
    },
  });

  const rankings = users
    .map((user) => ({
      userId: user.id,
      name: user.name,
      contractCount: user.companies_companies_owner_idTousers.length,
    }))
    .sort((a, b) => {
      if (b.contractCount !== a.contractCount) {
        return b.contractCount - a.contractCount;
      }

      return a.name.localeCompare(b.name, "ko");
    })
    .map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      name: user.name,
      contractCount: user.contractCount,
    }));

  return NextResponse.json({
    data: rankings,
  });
}
