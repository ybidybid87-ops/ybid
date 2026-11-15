import UserManagementClient from "@/components/features/users/UserManagementClient";
import { getUser } from "@/services/actions/user/user.api";
import { redirect } from "next/navigation";
import prisma from "prisma/prisma";

export default async function AdminUsersPage() {
  const authUser = await getUser();

  if (!authUser) {
    redirect("/login");
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
    redirect("/dashboard");
  }

  return <UserManagementClient />;
}
