import PageHeader from "@/components/common/PageHeader";
import { getUser } from "@/services/actions/user/user.api";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPageContent() {
  const user = await getUser();

  if (!user || !["admin", "leader"].includes(user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-10">
      <PageHeader title="관리자 대시보드" description="전체 직원의 영업 현황을 확인합니다." />

      <AdminDashboardClient />
    </div>
  );
}
