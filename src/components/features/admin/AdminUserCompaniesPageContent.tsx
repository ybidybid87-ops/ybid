import PageHeader from "@/components/common/PageHeader";
import MyCompaniesClient from "@/components/features/my-companies/MyCompaniesClient";
import { getUser } from "@/services/actions/user/user.api";
import { redirect } from "next/navigation";
import prisma from "prisma/prisma";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function AdminUserCompaniesPageContent({
  params,
}: Props) {
  const authUser = await getUser();

  if (!authUser || !["admin", "leader"].includes(authUser.role)) {
    redirect("/dashboard");
  }

  const { userId } = await params;

  const targetUser = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      team_id: true,
    },
  });

  if (!targetUser) {
    redirect("/admin");
  }

  if (
    authUser.role === "leader" &&
    targetUser.team_id !== authUser.team_id
  ) {
    redirect("/admin");
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title={`${targetUser.name} 업체 관리`}
        description={`${targetUser.name}님이 담당하고 있는 업체 목록을 확인합니다.`}
      />

      <MyCompaniesClient
        ownerId={targetUser.id}
        showCreateButton={false}
      />
    </div>
  );
}