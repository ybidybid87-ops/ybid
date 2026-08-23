import PageHeader from "@/components/common/PageHeader";
import { getUser } from "@/services/actions/user/user.api";
import { redirect } from "next/navigation";
import SalesPerformanceSection from "./SalesPerformanceSection";

export default async function AdminPageContent() {
  const user = await getUser();

  if (!user || !["admin", "leader"].includes(user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="팀원별 현황"
        description="기간별 팀원의 담당 현황과 영업 실적을 확인합니다."
      />

      <SalesPerformanceSection />
    </div>
  );
}
