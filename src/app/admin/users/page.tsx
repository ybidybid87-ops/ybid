import { redirect } from "next/navigation";
import { Suspense } from "react";

import UserManagementClient from "@/components/features/users/UserManagementClient";
import { getUser } from "@/services/actions/user/user.api";

async function AdminUsersContent() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return <UserManagementClient />;
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">
          사용자 관리 페이지를 불러오는 중입니다...
        </div>
      }
    >
      <AdminUsersContent />
    </Suspense>
  );
}
